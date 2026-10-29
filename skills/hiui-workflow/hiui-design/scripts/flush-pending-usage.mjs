#!/usr/bin/env node

import { flushPendingUsage } from './lib/usage-telemetry.mjs'

function parseArgs(argv) {
  const options = {
    json: false,
    workspaceRoot: process.cwd(),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--workspace-root') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --workspace-root')
      }
      options.workspaceRoot = value
      index += 1
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/flush-pending-usage.mjs [--workspace-root <project-root>] [--json]')
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const result = await flushPendingUsage({ workspaceRoot: options.workspaceRoot })

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
    return
  }

  console.log(`pending usage flush status: ${result.status}`)
  console.log(`- flushed: ${result.flushedCount}`)
  console.log(`- remaining: ${result.remainingCount}`)
  if (result.lastError) {
    console.log(`- last error: ${result.lastError}`)
  }
}

await main()
