#!/usr/bin/env node

import path from 'node:path'
import process from 'node:process'
import { runLegacyAcceptance } from './lib/legacy-acceptance-runner.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-legacy-accept.mjs" --page-type <id> --page <page-dir-or-page.instance.tsx> [--target <project-root>] [--profile <preview|delivery>] [--build-command <command>] [--remote-entry <path>] [--runtime-url <url>] [--runtime-evidence <json>] [--visual-evidence <image>] [--warning-waiver <json>] [--timeout <ms>] [--viewport <width>x<height>] [--json]

Checks:
  - static legacy page boundary through typical-page:legacy:verify
  - project build command and build log errors
  - built remoteEntry.js contains the exposed page key
  - runtime DOM evidence proves HiuiLegacyPage managed shell regions
  - visual evidence screenshot exists
  - console warnings are classified before acceptance
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    pageType: '',
    page: '',
    profile: '',
    buildCommand: '',
    remoteEntry: 'dist/remoteEntry.js',
    runtimeEvidence: '',
    visualEvidence: '',
    runtimeUrl: '',
    warningWaiver: '',
    timeout: 15000,
    viewport: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--') {
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
    if (
      arg === '--target' ||
      arg === '--page-type' ||
      arg === '--page' ||
      arg === '--profile' ||
      arg === '--build-command' ||
      arg === '--remote-entry' ||
      arg === '--runtime-url' ||
      arg === '--runtime-evidence' ||
      arg === '--visual-evidence' ||
      arg === '--warning-waiver' ||
      arg === '--timeout' ||
      arg === '--viewport' ||
      arg === '--line'
    ) {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--page-type') options.pageType = value
      if (arg === '--page') options.page = value
      if (arg === '--profile') options.profile = value
      if (arg === '--build-command') options.buildCommand = value
      if (arg === '--remote-entry') options.remoteEntry = value
      if (arg === '--runtime-url') options.runtimeUrl = value
      if (arg === '--runtime-evidence') options.runtimeEvidence = value
      if (arg === '--visual-evidence') options.visualEvidence = value
      if (arg === '--warning-waiver') options.warningWaiver = value
      if (arg === '--timeout') options.timeout = Number(value)
      if (arg === '--viewport') options.viewport = value
      if (arg === '--line') {
        // Business-line overlays affect generation/planning facts, not the acceptance gate itself.
      }
      index += 1
      continue
    }
    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.pageType) throw new Error('Missing required --page-type')
  if (!options.page) throw new Error('Missing required --page')
  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const result = await runLegacyAcceptance(options)
  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log('[hiui-design][typical-page:legacy:accept]')
    console.log(`- status: ${result.status}`)
    console.log(`- report: ${result.reportPath}`)
    if (result.issues.length > 0) {
      console.log('- issues:')
      for (const issue of result.issues) console.log(`  - ${issue}`)
    }
  }
  if (result.status !== 'preview-ready' && result.status !== 'delivery-ready' && result.status !== 'accepted') process.exitCode = 1
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[typical-page:legacy:accept] ${message}`)
    process.exit(1)
  })
}
