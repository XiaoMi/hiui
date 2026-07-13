#!/usr/bin/env node

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

function parseArgs(argv) {
  const options = {
    commit: false,
    message: 'Sync hiui-design team package snapshot',
    push: false,
    remote: 'origin',
    sourceRoot: '',
    targetRoot: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--commit') {
      options.commit = true
      continue
    }

    if (arg === '--push') {
      options.push = true
      options.commit = true
      continue
    }

    if (arg === '--source' || arg === '--target' || arg === '--message' || arg === '--remote') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--source') options.sourceRoot = path.resolve(value)
      if (arg === '--target') options.targetRoot = path.resolve(value)
      if (arg === '--message') options.message = value
      if (arg === '--remote') options.remote = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(`Usage:
  node scripts/sync-team-package.mjs --target <team-repo-or-dir> [--source <skill-root>] [--commit] [--push]

This command generates the team-package distribution from the maintainer/global source.
It is one-way: edit the maintainer source, then regenerate the team package.
`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.targetRoot) {
    throw new Error('Missing required --target <team-repo-or-dir>')
  }

  return options
}

function runCommand(command, args, cwd, label) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: 'pipe',
  })

  if (result.error) {
    throw result.error
  }

  if ((result.status ?? 1) !== 0) {
    throw new Error(`${label} failed: ${result.stderr?.trim() || result.stdout?.trim() || 'unknown error'}`)
  }

  return result.stdout?.trim() || ''
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function walkAllFiles(root, prefix = '') {
  const entries = await fs.readdir(path.join(root, prefix), { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name === '.git') {
      continue
    }

    const relativePath = prefix ? path.join(prefix, entry.name) : entry.name
    if (entry.isDirectory()) {
      files.push(...(await walkAllFiles(root, relativePath)))
      continue
    }

    if (entry.isFile()) {
      files.push(relativePath)
    }
  }

  return files.sort((left, right) => left.localeCompare(right))
}

async function emptyTargetPreservingGit(targetRoot) {
  await fs.mkdir(targetRoot, { recursive: true })
  const entries = await fs.readdir(targetRoot, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name === '.git') {
      continue
    }

    await fs.rm(path.join(targetRoot, entry.name), { force: true, recursive: true })
  }
}

async function copyDir(sourceDir, targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
  const entries = await fs.readdir(sourceDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name)
    const targetPath = path.join(targetDir, entry.name)

    if (entry.isDirectory()) {
      await copyDir(sourcePath, targetPath)
      continue
    }

    if (entry.isFile()) {
      await fs.copyFile(sourcePath, targetPath)
    }
  }
}

async function gitStatus(targetRoot) {
  if (!(await pathExists(path.join(targetRoot, '.git')))) {
    return ''
  }

  return runCommand('git', ['status', '--porcelain', '--untracked-files=all'], targetRoot, 'git status')
}

async function stageTargetSnapshot(targetRoot) {
  if (!(await pathExists(path.join(targetRoot, '.git')))) {
    return false
  }

  runCommand('git', ['add', '-A'], targetRoot, 'git add -A')
  return true
}

async function commitTarget(targetRoot, message, push, remote) {
  if (!(await pathExists(path.join(targetRoot, '.git')))) {
    console.log('Skipped team package git commit because target is not a git repository.')
    return
  }

  const status = await gitStatus(targetRoot)
  if (!status.trim()) {
    console.log('No team package git changes detected.')
    return
  }

  runCommand('git', ['add', '-A'], targetRoot, 'git add -A')
  runCommand('git', ['commit', '-m', message], targetRoot, 'git commit')

  if (push) {
    const branch = runCommand('git', ['rev-parse', '--abbrev-ref', 'HEAD'], targetRoot, 'git branch')
    runCommand('git', ['push', remote, branch], targetRoot, 'git push')
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const sourceRoot = options.sourceRoot || path.resolve(scriptDir, '..')
  const targetRoot = options.targetRoot

  if (!(await pathExists(path.join(sourceRoot, 'SKILL.md')))) {
    throw new Error(`Source does not look like a hiui-design skill root: ${sourceRoot}`)
  }

  const preSyncStatus =
    options.commit && (await pathExists(path.join(targetRoot, '.git')))
      ? await gitStatus(targetRoot)
      : ''
  if (preSyncStatus.trim()) {
    throw new Error(`Team package target is dirty before sync; commit or clean it first:\n${preSyncStatus}`)
  }

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-design-team-package-sync-'))
  const buildScript = path.join(sourceRoot, 'scripts', 'build-runtime-mirror.mjs')
  const boundaryScript = path.join(sourceRoot, 'scripts', 'check-distribution-boundary.mjs')

  runCommand(
    process.execPath,
    [buildScript, '--target', 'team-package', '--output', tempRoot, '--root', sourceRoot],
    sourceRoot,
    'build team package',
  )

  await emptyTargetPreservingGit(targetRoot)
  await copyDir(tempRoot, targetRoot)
  await stageTargetSnapshot(targetRoot)

  runCommand(
    process.execPath,
    [boundaryScript, '--root', targetRoot, '--scope', 'team', '--strict', '--json'],
    sourceRoot,
    'team package boundary check',
  )

  const copiedFiles = await walkAllFiles(tempRoot)
  await fs.rm(tempRoot, { force: true, recursive: true })

  console.log(`Synced hiui-design team package: ${targetRoot}`)
  console.log(`- source: ${sourceRoot}`)
  console.log(`- copied files: ${copiedFiles.length}`)

  if (options.commit) {
    await commitTarget(targetRoot, options.message, options.push, options.remote)
  } else {
    const status = await gitStatus(targetRoot)
    if (status.trim()) {
      console.log('- git changes: pending')
    }
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`sync-team-package failed: ${message}`)
  process.exit(1)
})
