#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolveSkillName } from './lib/skill-identity.mjs'

const COMMON_EXCLUDE_PATTERNS = [
  '.git/*',
  '.git/**',
  '.DS_Store',
  '**/.DS_Store',
  '.release.env',
  '.release.env.local',
  '.env.release',
  '.env.release.local',
  'outputs/*',
  'outputs/**',
]

const USER_ONLY_EXCLUDE_PATTERNS = [
  'docs/onboarding/global-sync-workflow.md',
  'scripts/activate-current-project-global-sync.mjs',
  'scripts/build-skill-archive.mjs',
  'scripts/check-rules-coverage.mjs',
  'scripts/manage-global-sync-daemon.mjs',
  'scripts/manage-global-sync-launch-agent.mjs',
  'scripts/mark-feishu-release-doc-synced.mjs',
  'scripts/publish-feishu-release-doc.mjs',
  'scripts/release-skill-archive.mjs',
  'scripts/sync-changelog.mjs',
  'scripts/sync-feishu-release-doc.mjs',
  'scripts/sync-global-skill.mjs',
  'scripts/sync-manifest-docs.mjs',
  'scripts/sync-shell-package-snapshot.mjs',
  'scripts/upload-release-archive-to-feishu.mjs',
  'src/typical-page-reuse/DOCTOR_REPORT.md',
  'src/typical-page-reuse/HOST_ADAPTER_SNIPPET.md',
  'src/typical-page-reuse/SMOKE_REPORT.md',
]

function runCommand(command, args, cwd) {
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
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || `${command} ${args.join(' ')} failed`)
  }

  return result
}

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8')
}

function parseVersionFile(content) {
  const metadata = {}

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trimEnd()
    if (!line || line.trimStart().startsWith('- ')) {
      continue
    }

    const match = line.match(/^([a-z-]+):\s*(.+)$/)
    if (!match) {
      continue
    }

    const [, key, value] = match
    metadata[key] = value
  }

  return metadata
}

function parseArgs(argv) {
  const options = {
    maintainerOutput: '',
    output: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--output') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --output')
      }
      options.output = value
      index += 1
      continue
    }

    if (arg === '--maintainer-output') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --maintainer-output')
      }
      options.maintainerOutput = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node scripts/build-skill-archive.mjs [--output <zip-path>] [--maintainer-output <zip-path>]',
      )
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

async function removeIfExists(targetPath) {
  if (await pathExists(targetPath)) {
    await fs.rm(targetPath)
  }
}

function prefixPatterns(sourceDirName, patterns) {
  return patterns.map((pattern) => `${sourceDirName}/${pattern}`)
}

async function buildArchive({ archivePath, extraExcludePatterns, parentDir, sourceDirName }) {
  await fs.mkdir(path.dirname(archivePath), { recursive: true })
  await removeIfExists(archivePath)

  const zipArgs = [
    '-r',
    archivePath,
    sourceDirName,
    '-x',
    ...prefixPatterns(sourceDirName, [...COMMON_EXCLUDE_PATTERNS, ...extraExcludePatterns]),
  ]

  runCommand('zip', zipArgs, parentDir)
}

async function assertRequiredSkillPaths(skillRoot) {
  const requiredRelativePaths = [
    'SKILL.md',
    path.join('agents', 'openai.yaml'),
    path.join('examples', 'host-integration', 'src'),
    path.join('reference', 'host-integration', 'src'),
    path.join('templates', 'i18n'),
    path.join('templates', 'project-images'),
  ]
  const missing = []

  for (const relativePath of requiredRelativePaths) {
    const absolutePath = path.join(skillRoot, relativePath)
    if (!(await pathExists(absolutePath))) {
      missing.push(relativePath)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      [
        'skill package is incomplete; refusing to build archive',
        'missing required paths:',
        ...missing.map((relativePath) => `- ${relativePath}`),
      ].join('\n')
    )
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const parentDir = path.dirname(skillRoot)
  const archiveSkillName = await resolveSkillName(skillRoot)
  const sourceDirName = path.basename(skillRoot)
  const versionFilePath = path.join(skillRoot, 'rules', 'VERSION')
  const versionMetadata = parseVersionFile(await readText(versionFilePath))
  const version = versionMetadata.version || '0.0.0'
  const archiveDir = path.join(skillRoot, 'outputs', 'archives')
  const archivePath = options.output
    ? path.resolve(options.output)
    : path.join(archiveDir, `${archiveSkillName}.zip`)
  const maintainerArchivePath = options.maintainerOutput
    ? path.resolve(options.maintainerOutput)
    : path.join(archiveDir, `${archiveSkillName}-maintainer.zip`)

  await assertRequiredSkillPaths(skillRoot)

  if (archivePath === maintainerArchivePath) {
    throw new Error('Public archive path and maintainer archive path must be different')
  }

  await buildArchive({
    archivePath,
    extraExcludePatterns: USER_ONLY_EXCLUDE_PATTERNS,
    parentDir,
    sourceDirName,
  })
  await buildArchive({
    archivePath: maintainerArchivePath,
    extraExcludePatterns: [],
    parentDir,
    sourceDirName,
  })

  console.log(`Built user skill archive: ${archivePath}`)
  console.log(`Built maintainer skill archive: ${maintainerArchivePath}`)
  console.log(`- version: ${version}`)
  console.log(`- source: ${skillRoot}`)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`build-skill-archive failed: ${message}`)
  process.exit(1)
})
