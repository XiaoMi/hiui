#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  autofixManagedMfHostContract,
  MANAGED_MF_HOST_CONTRACT_AUTOFIX_SCHEMA,
} from './lib/managed-mf-host-contract-autofix.mjs'
import { formatInstallModeUsage } from './lib/mode-contract.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/managed-mf-host-contract-autofix.mjs" --page-type <id> --dest <relative-dir> --title <title> [--route-path <path>] [--target <project-root>] [--mode <${formatInstallModeUsage()}>] [--line <line-id>] [--json]

Default behavior:
  - target project: current working directory
  - only runs when the requested page qualifies for materialize-managed-mf-host-contract
  - never overwrites conflicting project-local shell, contract, or mf-entry files
  - materializes src/business-shell/app-frame.tsx, app-frame-core.tsx, host-reset.css, hiui-managed-host.contract.json, and the page-local managed mf-entry
  - resets the page-task gate to ensure-only after applying changes
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    pageType: '',
    dest: '',
    title: '',
    routePath: '',
    mode: 'auto',
    line: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      continue
    }

    if (
      arg === '--target' ||
      arg === '--page-type' ||
      arg === '--dest' ||
      arg === '--title' ||
      arg === '--route-path' ||
      arg === '--mode' ||
      arg === '--line'
    ) {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      const key =
        arg === '--page-type'
          ? 'pageType'
          : arg === '--route-path'
            ? 'routePath'
            : arg.slice(2)
      options[key] = value
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

  if (!options.pageType) throw new Error('Missing required --page-type <id>')
  if (!options.dest) throw new Error('Missing required --dest <relative-dir>')
  if (!options.title) throw new Error('Missing required --title <title>')
  return options
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const targetRoot = path.resolve(options.target)
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const payload = await autofixManagedMfHostContract({
      targetRoot,
      skillRoot,
      pageTypeId: options.pageType,
      dest: options.dest,
      title: options.title,
      routePath: options.routePath,
      mode: options.mode,
      line: options.line,
      updatedBy: 'scripts/managed-mf-host-contract-autofix.mjs',
    })

    if (options.json) {
      console.log(JSON.stringify(payload, null, 2))
      return
    }

    console.log(`managed-mf-host-contract-autofix ${payload.status}`)
    console.log(`schema: ${MANAGED_MF_HOST_CONTRACT_AUTOFIX_SCHEMA}`)
    console.log(`reason: ${payload.reason}`)
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
    console.error(`managed-mf-host-contract-autofix failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

await main()
