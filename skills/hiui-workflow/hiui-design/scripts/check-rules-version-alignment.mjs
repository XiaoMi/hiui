#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { parseGitStatusEntries } from './lib/git-workspace-status.mjs'

const VERSION_PATH = 'rules/VERSION'
const GUARDED_PREFIXES = ['rules/', 'scripts/']
const GUARDED_EXACT_PATHS = new Set(['SKILL.md', 'distribution-manifest.json'])

function parseArgs(argv) {
  const options = {
    json: false,
    root: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--root') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --root')
      }
      options.root = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/check-rules-version-alignment.mjs [--root <skill-root>] [--json]

Fails closed when guarded maintainer files changed in a standalone Git maintainer source
but rules/VERSION was not updated in the same workspace state.
`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function runGit(args, cwd, label) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: 'pipe',
  })

  if (result.error) {
    throw result.error
  }

  if ((result.status ?? 1) !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(`${label} failed: ${stderr || stdout || 'unknown error'}`)
  }

  return result.stdout?.trim() || ''
}

function normalizeRelativePath(relativePath) {
  return String(relativePath || '').split(path.sep).join('/')
}

function isGuardedPath(relativePath) {
  const normalized = normalizeRelativePath(relativePath)
  if (!normalized || normalized === VERSION_PATH) {
    return false
  }

  if (GUARDED_EXACT_PATHS.has(normalized)) {
    return true
  }

  return GUARDED_PREFIXES.some((prefix) => normalized.startsWith(prefix))
}

function buildReport({
  guardedChanges = [],
  gitRoot = '',
  reason = '',
  root = '',
  status = 'passed',
  versionChanged = false,
}) {
  return {
    status,
    root,
    gitRoot,
    enforced: status !== 'skipped',
    reason,
    guardDefinition: {
      versionPath: VERSION_PATH,
      guardedExactPaths: [...GUARDED_EXACT_PATHS].sort(),
      guardedPrefixes: [...GUARDED_PREFIXES].sort(),
    },
    versionChanged,
    guardedChanges,
  }
}

function printReport(report, asJson) {
  if (asJson) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  console.log(`rules version alignment: ${report.status}`)
  console.log(`- root: ${report.root}`)
  if (report.gitRoot) {
    console.log(`- git root: ${report.gitRoot}`)
  }
  console.log(`- enforced: ${report.enforced ? 'yes' : 'no'}`)
  console.log(`- version changed: ${report.versionChanged ? 'yes' : 'no'}`)
  if (report.reason) {
    console.log(`- reason: ${report.reason}`)
  }
  if (report.guardedChanges.length > 0) {
    console.log(`- guarded changes: ${report.guardedChanges.join(', ')}`)
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const root = await fs.realpath(path.resolve(options.root || path.join(scriptDir, '..')))

  let gitRoot = ''
  try {
    gitRoot = await fs.realpath(
      path.resolve(runGit(['rev-parse', '--show-toplevel'], root, 'git rev-parse --show-toplevel'))
    )
  } catch (error) {
    const report = buildReport({
      root,
      status: 'skipped',
      reason: error instanceof Error ? error.message : String(error),
    })
    printReport(report, options.json)
    return
  }

  if (gitRoot !== root) {
    const report = buildReport({
      root,
      gitRoot,
      status: 'skipped',
      reason: 'root is not a standalone git maintainer source; version gate is enforced only at git worktree root',
    })
    printReport(report, options.json)
    return
  }

  const statusOutput = runGit(['status', '--porcelain', '--untracked-files=all'], root, 'git status')
  const entries = parseGitStatusEntries(statusOutput)
  const versionChanged = entries.some((entry) => entry.paths.some((filePath) => normalizeRelativePath(filePath) === VERSION_PATH))
  const guardedChanges = [...new Set(
    entries
      .flatMap((entry) => entry.paths)
      .map((filePath) => normalizeRelativePath(filePath))
      .filter((filePath) => isGuardedPath(filePath))
  )].sort()

  if (guardedChanges.length > 0 && !versionChanged) {
    throw new Error(
      `Guarded maintainer files changed without updating ${VERSION_PATH}: ${guardedChanges.join(', ')}`
    )
  }

  const report = buildReport({
    root,
    gitRoot,
    status: 'passed',
    versionChanged,
    guardedChanges,
  })
  printReport(report, options.json)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  if (process.argv.includes('--json')) {
    console.error(JSON.stringify({ error: { message } }, null, 2))
  }
  console.error(`check-rules-version-alignment failed: ${message}`)
  process.exit(1)
})
