#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  LEGACY_MF_SHARED_CONTRACT_AUTOFIX_SCHEMA,
  autofixLegacyMfSharedContract,
} from './lib/legacy-mf-shared-contract-autofix.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/legacy-mf-shared-contract-autofix.mjs" [--target <project-root>] [--json]

Default behavior:
  - target project: current working directory
  - only runs on existing-system legacy Module Federation hosts
  - only patches the shared contract when scoped HiUI5 bridge wiring coexists with a legacy shared singleton for @hi-ui/hiui
  - rewires hiui5 to shareKey=@hi-ui/hiui and forces non-singleton shared resolution for both hiui5 and @hi-ui/hiui
  - resets the page-task gate to ensure-only after applying changes
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      continue
    }

    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --target')
      }
      options.target = value
      index += 1
      continue
    }

    if (arg === '--json') {
      options.json = true
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

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const targetRoot = path.resolve(options.target)
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const payload = await autofixLegacyMfSharedContract({
      targetRoot,
      skillRoot,
      updatedBy: 'scripts/legacy-mf-shared-contract-autofix.mjs',
    })

    if (options.json) {
      console.log(JSON.stringify(payload, null, 2))
      return
    }

    console.log(`legacy-mf-shared-contract-autofix ${payload.status}`)
    console.log(`schema: ${LEGACY_MF_SHARED_CONTRACT_AUTOFIX_SCHEMA}`)
    console.log(`reason: ${payload.reason}`)
    if (payload.configPath) {
      console.log(`configPath: ${payload.configPath}`)
    }
    if (payload.changes?.length > 0) {
      console.log(`changes: ${payload.changes.join('; ')}`)
    }
    if (payload.writtenFiles?.length > 0) {
      console.log(`writtenFiles: ${payload.writtenFiles.join(', ')}`)
    }
    if (payload.nextCommand) {
      console.log(`nextCommand: ${payload.nextCommand}`)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`legacy-mf-shared-contract-autofix failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

await main()
