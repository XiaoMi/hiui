#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { rollbackActions } from './lib/workflow-install.mjs'

function parseArgs(argv) {
  const options = {
    backupRoot: '',
    journal: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--backup-root') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --backup-root')
      options.backupRoot = value
      index += 1
      continue
    }
    if (arg === '--journal') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --journal')
      options.journal = value
      index += 1
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/rollback-workflow-bundle.mjs [--journal <path> | --backup-root <dir>] [--json]')
      process.exit(0)
    }
    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function readJournal(options) {
  if (options.journal) {
    return path.resolve(options.journal)
  }
  if (options.backupRoot) {
    return path.resolve(options.backupRoot, 'install-journal.json')
  }
  throw new Error('Provide --journal or --backup-root')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const journalPath = await readJournal(options)
  const journal = JSON.parse(await fs.readFile(journalPath, 'utf8'))
  const failures = await rollbackActions(journal)
  const report = {
    status: failures.length === 0 ? 'rolled-back' : 'rollback-failed',
    journalPath,
    failures,
  }

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  console.log(`Workflow bundle rollback: ${report.status}`)
  console.log(`- journal: ${journalPath}`)
  for (const failure of failures) {
    console.log(`- ${failure.skill}: ${failure.message}`)
  }

  if (failures.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`rollback-workflow-bundle failed: ${message}`)
  process.exit(1)
})
