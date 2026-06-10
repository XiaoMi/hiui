#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

function printUsage() {
  console.log(`Usage:
  node scripts/typical-page-preview-ready.mjs --contract-fixture quality-pass

The public edition keeps only the stable fixture-backed JSON contract for preview-ready.
Private usage telemetry and network reporting are intentionally excluded.
`)
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    printUsage()
    return
  }

  const fixtureIndex = args.indexOf('--contract-fixture')
  const fixture = fixtureIndex >= 0 ? args[fixtureIndex + 1] : ''
  if (fixture !== 'quality-pass') {
    console.error('The public edition supports typical-page-preview-ready only with --contract-fixture quality-pass.')
    process.exit(2)
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const fixturePath = path.join(scriptDir, 'tests', 'fixtures', 'public-cli', 'preview-ready.quality-pass.json')
  const raw = await fs.readFile(fixturePath, 'utf8')
  process.stdout.write(raw.endsWith('\n') ? raw : `${raw}\n`)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`typical-page-preview-ready failed: ${message}`)
  process.exit(1)
})
