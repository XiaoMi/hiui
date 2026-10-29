#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  LEGACY_HIUI5_BRIDGE_AUTOFIX_SCHEMA,
  autofixLegacyHiui5Bridge,
} from './lib/legacy-hiui5-bridge-autofix.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/legacy-hiui5-bridge-autofix.mjs" [--target <project-root>] [--json]

Default behavior:
  - target project: current working directory
  - only runs on existing-system legacy Webpack/Rspack hosts that still need the managed scoped HiUI5 bridge
  - only supports exactly one object-style CommonJS Webpack/Rspack config file
  - injects the managed hiui5-peer-replacement-bridge helper and appends the scoped replacement plugins
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
    const payload = await autofixLegacyHiui5Bridge({
      targetRoot,
      skillRoot,
      updatedBy: 'scripts/legacy-hiui5-bridge-autofix.mjs',
    })

    if (options.json) {
      console.log(JSON.stringify(payload, null, 2))
      return
    }

    console.log(`legacy-hiui5-bridge-autofix ${payload.status}`)
    console.log(`schema: ${LEGACY_HIUI5_BRIDGE_AUTOFIX_SCHEMA}`)
    console.log(`reason: ${payload.reason}`)
    if (payload.configPath) {
      console.log(`configPath: ${payload.configPath}`)
    }
    if (payload.changes?.length > 0) {
      console.log(`changes: ${payload.changes.join('; ')}`)
    }
    if (payload.nextCommand) {
      console.log(`nextCommand: ${payload.nextCommand}`)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`legacy-hiui5-bridge-autofix failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

await main()
