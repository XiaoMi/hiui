#!/usr/bin/env node

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

function parseArgs(argv) {
  const options = {
    json: false,
    lockfile: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--lockfile') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --lockfile')
      options.lockfile = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/preflight-workflow-bundle-release.mjs [--lockfile <path>] [--json]')
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: 'pipe',
    maxBuffer: 32 * 1024 * 1024,
    env: options.env,
    cwd: options.cwd,
  })

  if (result.error) throw result.error
  if ((result.status ?? 1) !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || `${command} ${args.join(' ')} failed`)
  }

  const stdout = (result.stdout || '').trim()
  return stdout ? JSON.parse(stdout) : {}
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(new URL(import.meta.url).pathname)
  const installEntry = path.join(scriptDir, '..', 'install.sh')
  const verifyScript = path.join(scriptDir, 'verify-workflow-bundle.mjs')
  const installScript = path.join(scriptDir, 'install-workflow-bundle.mjs')
  const releaseScript = path.join(scriptDir, 'release-workflow-bundle.mjs')

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'workflow-bundle-preflight-'))
  const dryRunTarget = path.join(tempRoot, 'dry-run-target')
  const releaseTarget = path.join(tempRoot, 'release-target')
  const codexHome = path.join(tempRoot, 'codex-home')

  try {
    const baseArgs = options.lockfile ? ['--lockfile', options.lockfile] : []

    const verifySource = runCommand('node', [verifyScript, '--json', ...baseArgs])
    const dryRunInstall = runCommand('node', [
      installScript,
      '--json',
      '--dry-run',
      '--target',
      dryRunTarget,
      ...baseArgs,
    ])
    const releaseSmoke = runCommand('node', [
      releaseScript,
      '--json',
      '--target',
      releaseTarget,
      ...baseArgs,
    ])
    const bootstrapInstall = runCommand(
      'bash',
      [installEntry, '--json', ...baseArgs],
      {
        env: {
          ...process.env,
          CODEX_HOME: codexHome,
        },
        cwd: path.dirname(installEntry),
      },
    )
    const verifyBootstrap = runCommand('node', [
      verifyScript,
      '--json',
      '--target',
      path.join(codexHome, 'skills'),
      ...baseArgs,
    ])

    const report = {
      status:
        verifySource.status === 'passed' &&
        dryRunInstall.status === 'planned' &&
        releaseSmoke.status === 'passed' &&
        bootstrapInstall.status === 'applied' &&
        verifyBootstrap.status === 'passed'
          ? 'passed'
          : 'failed',
      tempRoot,
      dryRunTarget,
      releaseTarget,
      codexHome,
      verifySource,
      dryRunInstall,
      releaseSmoke,
      bootstrapInstall,
      verifyBootstrap,
    }

    if (options.json) {
      console.log(JSON.stringify(report, null, 2))
      return
    }

    console.log(`Workflow bundle preflight: ${report.status}`)
    console.log(`- source verification: ${verifySource.status}`)
    console.log(`- dry-run install: ${dryRunInstall.status}`)
    console.log(`- release smoke: ${releaseSmoke.status}`)
    console.log(`- bootstrap install: ${bootstrapInstall.status}`)
    console.log(`- bootstrap verification: ${verifyBootstrap.status}`)
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true }).catch(() => {})
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`preflight-workflow-bundle-release failed: ${message}`)
  process.exit(1)
})
