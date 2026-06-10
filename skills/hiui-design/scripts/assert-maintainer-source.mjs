#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REQUIRED_PATHS = [
  'SKILL.md',
  'rules/VERSION',
  'agents/openai.yaml',
  'examples/host-integration/src',
  'reference/host-integration/src',
  'templates/i18n',
  'templates/project-images',
  'scripts/manage-global-sync-launch-agent.mjs',
  'scripts/sync-global-skill.mjs',
]

function printUsage() {
  console.log(`Usage: node scripts/assert-maintainer-source.mjs [--source <path>] [--json]`)
}

function parseArgs(argv) {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const options = {
    json: false,
    sourceRoot: path.resolve(scriptDir, '..'),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--source') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --source')
      }
      options.sourceRoot = path.resolve(value)
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
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

async function readVersion(sourceRoot) {
  try {
    const content = await fs.readFile(path.join(sourceRoot, 'rules', 'VERSION'), 'utf8')
    const match = content.match(/^version:\s*(.+)$/m)
    return match?.[1]?.trim() || ''
  } catch {
    return ''
  }
}

async function inspectSourceRoot(sourceRoot) {
  const missingPaths = []
  for (const relativePath of REQUIRED_PATHS) {
    if (!(await pathExists(path.join(sourceRoot, relativePath)))) {
      missingPaths.push(relativePath)
    }
  }

  const warnings = []
  if (!(await pathExists(path.join(sourceRoot, '.git')))) {
    warnings.push('source root is not a git repository; allowed for active source but not suitable as a source repo')
  }

  return {
    missingPaths,
    ok: missingPaths.length === 0,
    sourceRoot,
    version: await readVersion(sourceRoot),
    warnings,
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const result = await inspectSourceRoot(options.sourceRoot)

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else if (result.ok) {
    console.log('active source qualification: PASS')
    console.log(`- source: ${result.sourceRoot}`)
    if (result.version) {
      console.log(`- version: ${result.version}`)
    }
    for (const warning of result.warnings) {
      console.log(`- warning: ${warning}`)
    }
  } else {
    console.error('active source qualification: FAIL')
    console.error(`- source: ${result.sourceRoot}`)
    if (result.version) {
      console.error(`- version: ${result.version}`)
    }
    for (const missingPath of result.missingPaths) {
      console.error(`- missing: ${missingPath}`)
    }
    for (const warning of result.warnings) {
      console.error(`- warning: ${warning}`)
    }
    process.exit(2)
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`assert-maintainer-source failed: ${message}`)
  process.exit(1)
})
