#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  getOpenSourcePackageBlockedPatterns,
  getTeamDistributionBlockedPatterns,
  getRuntimeMirrorBlockedPatterns,
  matchesAnyPattern,
  normalizeRelativePath,
} from './lib/distribution-rules.mjs'

const PRIVATE_WORKSPACE_PATTERNS = [
  '.release.env',
  '.release.env.local',
  '.env.release',
  '.env.release.local',
  '*.bak',
  '*.bak-*',
  '**/*.bak',
  '**/*.bak-*',
  '.learnings/*',
  '.learnings/**',
  'outputs/*',
  'outputs/**',
  '.DS_Store',
  '**/.DS_Store',
  '.codex-write-check',
]

const PROJECT_LOCAL_ALLOWED_PATTERNS = [
  'outputs/*',
  'outputs/**',
]

function parseArgs(argv) {
  const options = {
    root: '',
    json: false,
    scope: 'team',
    strict: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--strict') {
      options.strict = true
      continue
    }

    if (arg === '--scope') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --scope')
      }
      if (!['team', 'project', 'runtime-mirror', 'open-source-package', 'maintainer'].includes(value)) {
        throw new Error(`Invalid --scope value: ${value}`)
      }
      options.scope = value
      index += 1
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
      console.log(`Usage: node scripts/check-distribution-boundary.mjs [--root <skill-root>] [--scope team|project|runtime-mirror|open-source-package|maintainer] [--strict] [--json]

Checks whether a team-facing hiui-design view contains maintainer workspace files.
Use --scope maintainer for the private source repo; it only checks that local-only files are not tracked by git.
Use --scope team for generated user zip or team-facing Git views.
Use --scope runtime-mirror for generated global Agent runtime views.
Use --scope open-source-package for generated public distributions with usage collection disabled.
Use --scope project for target .local-context/hiui-design; project outputs are allowed as page facts.
--strict also fails when tracked git files match the selected blocked patterns.
`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function walkFiles(root, relativeDir = '') {
  const currentDir = path.join(root, relativeDir)
  const entries = await fs.readdir(currentDir, { withFileTypes: true }).catch((error) => {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return []
    }
    throw error
  })
  const files = []

  for (const entry of entries) {
    const relativePath = relativeDir ? path.join(relativeDir, entry.name) : entry.name
    const normalized = normalizeRelativePath(relativePath)

    if (entry.isDirectory()) {
      if (normalized === '.git' || normalized.startsWith('.git/')) {
        continue
      }
      files.push(...(await walkFiles(root, relativePath)))
      continue
    }

    if (entry.isFile() || entry.isSymbolicLink()) {
      files.push(normalized)
    }
  }

  return files.sort((left, right) => left.localeCompare(right))
}

async function readGitTrackedFiles(root) {
  const gitDir = path.join(root, '.git')
  if (!(await pathExists(gitDir))) {
    return []
  }

  const { spawnSync } = await import('node:child_process')
  const result = spawnSync('git', ['ls-files'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  })

  if ((result.status ?? 1) !== 0) {
    const failureText = `${result.stderr || ''}\n${result.stdout || ''}`
    if (/not a git repository/i.test(failureText)) {
      return []
    }
    throw new Error(result.stderr?.trim() || result.stdout?.trim() || 'git ls-files failed')
  }

  return result.stdout
    .split('\n')
    .map((entry) => normalizeRelativePath(entry.trim()))
    .filter(Boolean)
}

function findBlocked(files, patterns) {
  return files.filter((file) => matchesAnyPattern(file, patterns))
}

function getBlockedPatterns(scope) {
  if (scope === 'maintainer') {
    return [...PRIVATE_WORKSPACE_PATTERNS, ...getTeamDistributionBlockedPatterns().filter((pattern) => pattern.startsWith('templates/project-images/'))]
  }

  if (scope === 'runtime-mirror') {
    return getRuntimeMirrorBlockedPatterns()
  }

  if (scope === 'open-source-package') {
    return getOpenSourcePackageBlockedPatterns()
  }

  const teamPatterns = getTeamDistributionBlockedPatterns()
  if (scope === 'project') {
    return teamPatterns.filter((pattern) => !PROJECT_LOCAL_ALLOWED_PATTERNS.includes(pattern))
  }

  return teamPatterns
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const root = path.resolve(options.root || path.join(scriptDir, '..'))
  const patterns = getBlockedPatterns(options.scope)
  const files = await walkFiles(root)
  const blockedWorkspaceFiles = findBlocked(files, patterns)
  const trackedFiles = await readGitTrackedFiles(root)
  const blockedTrackedFiles = findBlocked(trackedFiles, patterns)
  const status = options.scope === 'maintainer'
    ? blockedTrackedFiles.length === 0
      ? 'passed'
      : 'failed'
    : blockedWorkspaceFiles.length === 0 && (!options.strict || blockedTrackedFiles.length === 0)
      ? 'passed'
      : 'failed'

  const report = {
    status,
    root,
    checkedFiles: files.length,
    blockedWorkspaceFiles,
    blockedTrackedFiles,
    scope: options.scope,
    strict: options.strict,
  }

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log(`Distribution boundary: ${status}`)
    console.log(`- root: ${root}`)
    console.log(`- scope: ${options.scope}`)
    console.log(`- checked files: ${files.length}`)
    console.log(`- blocked workspace files: ${blockedWorkspaceFiles.length}`)
    console.log(`- blocked tracked files: ${blockedTrackedFiles.length}`)

    for (const [label, entries] of [
      ['blocked workspace files', blockedWorkspaceFiles],
      ['blocked tracked files', blockedTrackedFiles],
    ]) {
      if (entries.length === 0) continue
      console.log(`- ${label}:`)
      for (const entry of entries.slice(0, 30)) {
        console.log(`  - ${entry}`)
      }
      if (entries.length > 30) {
        console.log(`  - ... ${entries.length - 30} more`)
      }
    }
  }

  if (status !== 'passed') {
    process.exit(1)
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`check-distribution-boundary failed: ${message}`)
  process.exit(1)
})
