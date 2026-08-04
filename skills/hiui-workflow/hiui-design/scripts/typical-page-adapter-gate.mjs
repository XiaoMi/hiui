#!/usr/bin/env node

import path from 'node:path'
import process from 'node:process'
import { runAdapterGate } from './lib/adapter-gate.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-adapter-gate.mjs" [--target <project-root>] [--profile <preview|delivery>] [--host-contract <path>] [--json]

Checks legacy-host-compatible host adapter readiness and delivery evidence.
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    profile: 'preview',
    hostContract: '',
    json: false,
  }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }
    if (arg === '--target' || arg === '--profile' || arg === '--host-contract') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--profile') options.profile = value
      if (arg === '--host-contract') options.hostContract = value
      index += 1
      continue
    }
    throw new Error(`Unknown argument: ${arg}`)
  }
  if (!['preview', 'delivery'].includes(options.profile)) {
    throw new Error('Expected --profile to be preview or delivery')
  }
  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const result = await runAdapterGate({
    targetRoot: options.target,
    profile: options.profile,
    hostContractPath: options.hostContract || undefined,
  })
  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log('[hiui-design][typical-page:adapter-gate]')
    console.log(`- status: ${result.ok ? 'passed' : 'failed'}`)
    console.log(`- profile: ${result.profile}`)
    if (result.issues.length > 0) {
      console.log('- issues:')
      for (const item of result.issues) console.log(`  - ${item.message}`)
    }
  }
  if (!result.ok) process.exit(1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[typical-page:adapter-gate] ${message}`)
    process.exit(1)
  })
}
