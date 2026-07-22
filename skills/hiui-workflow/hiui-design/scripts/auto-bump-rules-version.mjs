#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  VERSION_FILE_RELATIVE_PATH,
  formatIsoDate,
  incrementPatchVersion,
  parseRulesVersionFile,
  readRulesVersionMetadata,
  writeRulesVersionMetadata,
} from './lib/rules-version-file.mjs'

const GUARDED_PREFIXES = ['rules/', 'scripts/']
const GUARDED_EXACT_PATHS = new Set(['SKILL.md', 'distribution-manifest.json'])

function parseArgs(argv) {
  const options = {
    baseline: '',
    json: false,
    root: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--root' || arg === '--baseline') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      if (arg === '--root') options.root = value
      if (arg === '--baseline') options.baseline = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/auto-bump-rules-version.mjs --baseline <skill-root> [--root <skill-root>] [--json]

Automatically increments rules/VERSION when guarded files drift from the sync baseline
but rules/VERSION itself has not changed yet.
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

function normalizeRelativePath(relativePath) {
  return String(relativePath || '').split(path.sep).join('/')
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

function readGitBlob(relativePath, cwd) {
  const result = spawnSync('git', ['show', `HEAD:${relativePath}`], {
    cwd,
    encoding: null,
    maxBuffer: 32 * 1024 * 1024,
    stdio: 'pipe',
  })

  if (result.error) {
    throw result.error
  }

  if ((result.status ?? 1) !== 0) {
    const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString('utf8').trim() : ''
    throw new Error(`git show HEAD:${relativePath} failed: ${stderr || 'unknown error'}`)
  }

  return Buffer.from(result.stdout || '')
}

function isGuardedPath(relativePath) {
  const normalized = normalizeRelativePath(relativePath)
  if (!normalized) {
    return false
  }
  if (normalized === 'rules' || normalized === 'scripts') {
    return true
  }
  if (GUARDED_EXACT_PATHS.has(normalized)) {
    return true
  }
  return GUARDED_PREFIXES.some((prefix) => normalized.startsWith(prefix))
}

async function collectGuardedFiles(root, relativePath = '') {
  const currentDir = relativePath ? path.join(root, relativePath) : root
  const entries = await fs.readdir(currentDir, { withFileTypes: true }).catch((error) => {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return []
    }
    throw error
  })
  const files = []

  for (const entry of entries) {
    if (entry.name === '.git') {
      continue
    }

    const childRelativePath = relativePath ? path.join(relativePath, entry.name) : entry.name
    if (!isGuardedPath(childRelativePath)) {
      continue
    }

    if (entry.isDirectory()) {
      files.push(...(await collectGuardedFiles(root, childRelativePath)))
      continue
    }

    if (entry.isFile()) {
      files.push(normalizeRelativePath(childRelativePath))
    }
  }

  return files.sort((left, right) => left.localeCompare(right))
}

async function collectGuardedFilesFromGitHead(root) {
  const output = runGit(['ls-tree', '-r', '--name-only', 'HEAD'], root, 'git ls-tree HEAD')
  return output
    .split('\n')
    .map((entry) => normalizeRelativePath(entry))
    .filter(Boolean)
    .filter((entry) => isGuardedPath(entry))
    .sort((left, right) => left.localeCompare(right))
}

function createFilesystemBaseline(root) {
  return {
    kind: 'filesystem',
    label: root,
    root,
    async collectGuardedFiles() {
      return collectGuardedFiles(root)
    },
    async readFileBuffer(relativePath) {
      const absolutePath = path.join(root, relativePath)
      if (!(await pathExists(absolutePath))) {
        return null
      }
      return fs.readFile(absolutePath)
    },
  }
}

function createGitHeadBaseline(root) {
  return {
    kind: 'git-head',
    label: `${root}#HEAD`,
    root,
    async collectGuardedFiles() {
      return collectGuardedFilesFromGitHead(root)
    },
    async readFileBuffer(relativePath) {
      try {
        return readGitBlob(relativePath, root)
      } catch (error) {
        if (error instanceof Error && /exists on disk, but not in 'HEAD'|path .* does not exist in 'HEAD'/.test(error.message)) {
          return null
        }
        throw error
      }
    },
  }
}

async function resolveBaseline(root) {
  try {
    const [gitRoot, baselineRealRoot] = await Promise.all([
      fs.realpath(
        path.resolve(runGit(['rev-parse', '--show-toplevel'], root, 'git rev-parse --show-toplevel'))
      ),
      fs.realpath(path.resolve(root)),
    ])
    if (gitRoot === baselineRealRoot) {
      return createGitHeadBaseline(root)
    }
  } catch {
    // Fallback to filesystem baseline when the path is not a standalone git root.
  }

  return createFilesystemBaseline(root)
}

async function readRootFileBuffer(root, relativePath) {
  const absolutePath = path.join(root, relativePath)
  if (!(await pathExists(absolutePath))) {
    return null
  }
  return fs.readFile(absolutePath)
}

async function collectGuardedDrift(root, baseline) {
  const [rootFiles, baselineFiles] = await Promise.all([
    collectGuardedFiles(root),
    baseline.collectGuardedFiles(),
  ])
  const allPaths = [...new Set([...rootFiles, ...baselineFiles])].sort((left, right) =>
    left.localeCompare(right)
  )
  const guardedChanges = []
  let versionChanged = false

  for (const relativePath of allPaths) {
    const [sourceBuffer, baselineBuffer] = await Promise.all([
      readRootFileBuffer(root, relativePath),
      baseline.readFileBuffer(relativePath),
    ])
    const same =
      sourceBuffer &&
      baselineBuffer &&
      sourceBuffer.length === baselineBuffer.length &&
      sourceBuffer.equals(baselineBuffer)

    if (same) {
      continue
    }

    if (relativePath === VERSION_FILE_RELATIVE_PATH) {
      versionChanged = extractVersionValue(sourceBuffer) !== extractVersionValue(baselineBuffer)
      continue
    }

    guardedChanges.push(relativePath)
  }

  return {
    guardedChanges,
    versionChanged,
  }
}

function compactPathSummary(guardedChanges) {
  const preview = guardedChanges.slice(0, 4)
  const previewText = preview.join(', ')
  if (guardedChanges.length <= preview.length) {
    return previewText
  }
  return `${previewText}, and ${guardedChanges.length - preview.length} more`
}

function extractVersionValue(buffer) {
  if (!buffer) {
    return ''
  }

  const metadata = parseRulesVersionFile(buffer.toString('utf8'))
  return String(metadata.version || '').trim()
}

function buildAutoBumpedMetadata(currentMetadata, guardedChanges) {
  const currentVersion = currentMetadata.version || '0.0.0'
  const nextVersion = incrementPatchVersion(currentVersion)
  const snapshotSummary = compactPathSummary(guardedChanges)

  return {
    ...currentMetadata,
    version: nextVersion,
    'last-updated': formatIsoDate(),
    'source-snapshot': `auto-bumped during sync-global-skill after guarded drift in ${snapshotSummary}`,
    notes: [
      'auto-generated by sync-global-skill so every successful rules/debug sync advances the governed rules snapshot',
      `guarded drift detected before mirror: ${snapshotSummary}`,
    ],
  }
}

async function syncRulesVersionMetadataFacts(root, metadata) {
  const commonPageTypesPath = path.join(root, 'rules', 'common.page-types.json')
  if (!(await pathExists(commonPageTypesPath))) {
    return false
  }

  const manifest = JSON.parse(await fs.readFile(commonPageTypesPath, 'utf8'))
  const nextRulesVersion = metadata.version || manifest.rulesVersion || ''
  const nextRulesLastUpdated = metadata['last-updated'] || manifest.rulesLastUpdated || ''

  if (
    manifest.rulesVersion === nextRulesVersion &&
    manifest.rulesLastUpdated === nextRulesLastUpdated
  ) {
    return false
  }

  manifest.rulesVersion = nextRulesVersion
  manifest.rulesLastUpdated = nextRulesLastUpdated
  await fs.writeFile(commonPageTypesPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  return true
}

function buildReport({
  baselineRoot,
  guardedChanges,
  metadataFactsSynced = false,
  nextVersion = '',
  previousVersion = '',
  root,
  status,
  versionChanged,
}) {
  return {
    status,
    root,
    baselineRoot,
    previousVersion,
    nextVersion,
    versionChanged,
    metadataFactsSynced,
    guardedChanges,
  }
}

function printReport(report, asJson) {
  if (asJson) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  console.log(`rules version auto-bump: ${report.status}`)
  console.log(`- root: ${report.root}`)
  console.log(`- baseline: ${report.baselineRoot}`)
  console.log(`- previous version: ${report.previousVersion || '(unchanged)'}`)
  console.log(`- next version: ${report.nextVersion || report.previousVersion || '(unchanged)'}`)
  console.log(`- version already changed: ${report.versionChanged ? 'yes' : 'no'}`)
  console.log(`- machine facts synced: ${report.metadataFactsSynced ? 'yes' : 'no'}`)
  if (report.guardedChanges.length > 0) {
    console.log(`- guarded drift: ${report.guardedChanges.join(', ')}`)
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const root = path.resolve(options.root || path.join(scriptDir, '..'))
  const baselineArg = String(options.baseline || '').trim()

  if (!baselineArg) {
    throw new Error('Missing required --baseline <skill-root>')
  }
  const baselineRoot = path.resolve(baselineArg)
  const baseline = await resolveBaseline(baselineRoot)

  const { guardedChanges, versionChanged } = await collectGuardedDrift(root, baseline)
  const currentMetadata = await readRulesVersionMetadata(root)
  const previousVersion = currentMetadata.version || '0.0.0'

  if (guardedChanges.length === 0) {
    const metadataFactsSynced = await syncRulesVersionMetadataFacts(root, currentMetadata)
    printReport(
      buildReport({
        baselineRoot: baseline.label,
        guardedChanges,
        metadataFactsSynced,
        previousVersion,
        root,
        status: 'skipped',
        versionChanged,
      }),
      options.json,
    )
    return
  }

  if (versionChanged) {
    const metadataFactsSynced = await syncRulesVersionMetadataFacts(root, currentMetadata)
    printReport(
      buildReport({
        baselineRoot: baseline.label,
        guardedChanges,
        metadataFactsSynced,
        previousVersion,
        root,
        status: 'skipped-version-already-changed',
        versionChanged,
      }),
      options.json,
    )
    return
  }

  const nextMetadata = buildAutoBumpedMetadata(currentMetadata, guardedChanges)
  await writeRulesVersionMetadata(root, nextMetadata)
  const metadataFactsSynced = await syncRulesVersionMetadataFacts(root, nextMetadata)

  printReport(
    buildReport({
      baselineRoot: baseline.label,
      guardedChanges,
      metadataFactsSynced,
      nextVersion: nextMetadata.version,
      previousVersion,
      root,
      status: 'bumped',
      versionChanged,
    }),
    options.json,
  )
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  if (process.argv.includes('--json')) {
    console.error(JSON.stringify({ error: { message } }, null, 2))
  }
  console.error(`auto-bump-rules-version failed: ${message}`)
  process.exit(1)
})
