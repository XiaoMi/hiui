#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { runDomGeometryGate } from './lib/dom-geometry-gate.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-dom-geometry-gate.mjs" --runtime-evidence <json> [--target <project-root>] [--profile <preview|delivery>] [--json]

Checks runtime DOM geometry captured by typical-page:legacy:accept.
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    runtimeEvidence: '',
    profile: 'preview',
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
    if (arg === '--target' || arg === '--runtime-evidence' || arg === '--profile') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--runtime-evidence') options.runtimeEvidence = value
      if (arg === '--profile') options.profile = value
      index += 1
      continue
    }
    throw new Error(`Unknown argument: ${arg}`)
  }
  if (!options.runtimeEvidence) throw new Error('Missing required --runtime-evidence')
  if (!['preview', 'delivery'].includes(options.profile)) throw new Error('Expected --profile to be preview or delivery')
  return options
}

async function readRuntimeEvidence(targetRoot, runtimeEvidencePath) {
  const resolvedPath = path.isAbsolute(runtimeEvidencePath) ? runtimeEvidencePath : path.join(targetRoot, runtimeEvidencePath)
  return JSON.parse(await fs.readFile(resolvedPath, 'utf8'))
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const runtimeEvidence = await readRuntimeEvidence(options.target, options.runtimeEvidence)
  const result = runDomGeometryGate({ runtimeEvidence, profile: options.profile })
  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log('[hiui-design][typical-page:dom-geometry-gate]')
    console.log(`- status: ${result.ok ? 'passed' : 'failed'}`)
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
    console.error(`[typical-page:dom-geometry-gate] ${message}`)
    process.exit(1)
  })
}
