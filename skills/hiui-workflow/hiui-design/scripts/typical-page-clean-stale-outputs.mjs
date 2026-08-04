#!/usr/bin/env node

import path from 'node:path'
import { cleanStaleManagedOutputs } from './lib/stale-managed-outputs.mjs'

function printUsage() {
  console.log(`Usage:
  node .local-context/hiui-design/scripts/typical-page-clean-stale-outputs.mjs --target <project-root> [--apply] [--backup-id <id>] [--json]

Default is dry-run. --apply backs up stale artifacts under .local-context/hiui-design/outputs/.stale-backup/<id> before deleting stale contracts and resyncing managed-pages.index.*.`)
}

function parseArgs(argv) {
  const options = { apply: false, backupId: '', json: false, target: process.cwd() }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--apply') {
      options.apply = true
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      options.help = true
      continue
    }
    if (arg === '--target' || arg === '--backup-id') {
      const value = argv[index + 1]
      if (!value) throw new Error(`${arg} requires a value`)
      if (arg === '--target') options.target = value
      if (arg === '--backup-id') options.backupId = value
      index += 1
      continue
    }
    throw new Error(`Unknown argument: ${arg}`)
  }
  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    printUsage()
    return
  }

  const targetRoot = path.resolve(options.target)
  const result = await cleanStaleManagedOutputs(targetRoot, {
    apply: options.apply,
    backupId: options.backupId,
  })

  const payload = {
    schemaVersion: 'hiui-design-stale-managed-outputs-cleanup.v1',
    targetRoot,
    ...result,
  }

  if (options.json) {
    console.log(JSON.stringify(payload, null, 2))
    return
  }

  console.log(`[hiui-design][stale-outputs] ${payload.status}${payload.dryRun ? ' (dry-run)' : ''}`)
  if (payload.staleContracts.length > 0) {
    console.log(`- stale contracts: ${payload.staleContracts.length}`)
  }
  if (payload.staleRegistryEntries.length > 0) {
    console.log(`- stale registry entries: ${payload.staleRegistryEntries.length}`)
  }
  if (payload.backupRoot) {
    console.log(`- backup: ${payload.backupRoot}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
