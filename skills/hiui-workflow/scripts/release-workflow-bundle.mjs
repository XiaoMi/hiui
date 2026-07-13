#!/usr/bin/env node

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

function parseArgs(argv) {
  const options = {
    json: false,
    lockfile: '',
    target: '',
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
    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --target')
      options.target = value
      index += 1
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/release-workflow-bundle.mjs [--lockfile <path>] [--target <skills-dir>] [--json]')
      process.exit(0)
    }
    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function runNodeScript(scriptPath, args) {
  const result = spawnSync('node', [scriptPath, ...args], {
    encoding: 'utf8',
    stdio: 'pipe',
    maxBuffer: 32 * 1024 * 1024,
  })

  if (result.error) throw result.error
  if ((result.status ?? 1) !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || `${scriptPath} failed`)
  }

  const stdout = (result.stdout || '').trim()
  return stdout ? JSON.parse(stdout) : {}
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(new URL(import.meta.url).pathname)
  const verifyScript = path.join(scriptDir, 'verify-workflow-bundle.mjs')
  const installScript = path.join(scriptDir, 'install-workflow-bundle.mjs')

  const temporaryRoot = options.target
    ? ''
    : await fs.mkdtemp(path.join(os.tmpdir(), 'workflow-bundle-release-'))
  const targetRoot = path.resolve(options.target || path.join(temporaryRoot, 'skills'))

  try {
    const verifySource = runNodeScript(verifyScript, [
      '--json',
      ...(options.lockfile ? ['--lockfile', options.lockfile] : []),
    ])

    const install = runNodeScript(installScript, [
      '--json',
      '--target',
      targetRoot,
      ...(options.lockfile ? ['--lockfile', options.lockfile] : []),
    ])

    const verifyInstalled = runNodeScript(verifyScript, [
      '--json',
      '--target',
      targetRoot,
      ...(options.lockfile ? ['--lockfile', options.lockfile] : []),
    ])

    const report = {
      status:
        verifySource.status === 'passed' && verifyInstalled.status === 'passed'
          ? 'passed'
          : 'failed',
      targetRoot,
      verifySource,
      install,
      verifyInstalled,
    }

    if (options.json) {
      console.log(JSON.stringify(report, null, 2))
      return
    }

    console.log(`Workflow bundle release smoke: ${report.status}`)
    console.log(`- target: ${targetRoot}`)
    console.log(`- source verification: ${verifySource.status}`)
    console.log(`- install status: ${install.status}`)
    console.log(`- installed verification: ${verifyInstalled.status}`)
  } finally {
    if (temporaryRoot) {
      await fs.rm(temporaryRoot, { recursive: true, force: true }).catch(() => {})
    }
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`release-workflow-bundle failed: ${message}`)
  process.exit(1)
})
