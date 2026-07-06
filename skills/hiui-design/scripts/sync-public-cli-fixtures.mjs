#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

function printUsage() {
  console.log(`Usage:
  node scripts/sync-public-cli-fixtures.mjs [--check] [--id <entry-id>]

Notes:
  - Rebuilds shipped machine-public JSON fixtures from scripts/public-cli-contracts.json.
  - --check reports drift without writing files.
  - Repeat --id to sync only selected machine-public contract entries.
`)
}

function parseArgs(argv) {
  const ids = []
  let check = false

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      return { help: true, check, ids }
    }

    if (arg === '--check') {
      check = true
      continue
    }

    if (arg === '--id') {
      const id = argv[index + 1]
      if (!id) {
        throw new Error('--id requires a value')
      }
      ids.push(id)
      index += 1
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return { help: false, check, ids }
}

function commandArgs(command, skillRoot) {
  return (Array.isArray(command) ? command : []).map((arg) => (arg === '<skillRoot>' ? skillRoot : arg))
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    printUsage()
    return
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const manifestPath = path.join(skillRoot, 'scripts', 'public-cli-contracts.json')
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
  const shippedEntries = (manifest.tiers?.['machine-public'] || []).filter(
    (entry) => entry.status === 'shipped' && entry.jsonContract === 'shipped'
  )

  const selectedEntries = options.ids.length > 0
    ? shippedEntries.filter((entry) => options.ids.includes(entry.id))
    : shippedEntries

  if (options.ids.length > 0 && selectedEntries.length !== options.ids.length) {
    const foundIds = new Set(selectedEntries.map((entry) => entry.id))
    const missingIds = options.ids.filter((id) => !foundIds.has(id))
    throw new Error(`Unknown machine-public contract ids: ${missingIds.join(', ')}`)
  }

  const drifted = []
  const updated = []

  for (const entry of selectedEntries) {
    const result = spawnSync(
      process.execPath,
      [path.join(skillRoot, entry.script), ...commandArgs(entry.command, skillRoot)],
      {
        cwd: skillRoot,
        encoding: 'utf8',
        maxBuffer: 16 * 1024 * 1024,
      }
    )

    const expectedExitCode = entry.expectedExitCode ?? 0
    if (result.status !== expectedExitCode) {
      throw new Error(
        `${entry.id} exited with ${result.status}; expected ${expectedExitCode}\n${result.stderr || result.stdout}`
      )
    }

    const normalizedJson = `${JSON.stringify(JSON.parse(result.stdout), null, 2)}\n`
    const fixturePath = path.join(skillRoot, entry.fixture)
    const existing = await fs.readFile(fixturePath, 'utf8').catch(() => '')

    if (existing === normalizedJson) {
      continue
    }

    drifted.push(entry.id)

    if (!options.check) {
      await fs.mkdir(path.dirname(fixturePath), { recursive: true })
      await fs.writeFile(fixturePath, normalizedJson, 'utf8')
      updated.push(entry.id)
    }
  }

  if (options.check) {
    if (drifted.length > 0) {
      console.error(`machine-public fixture drift: ${drifted.join(', ')}`)
      process.exit(1)
    }
    console.log('machine-public fixtures are in sync')
    return
  }

  if (updated.length === 0) {
    console.log('machine-public fixtures already up to date')
    return
  }

  console.log(`updated machine-public fixtures: ${updated.join(', ')}`)
}

main().catch((error) => {
  console.error(error.message || String(error))
  process.exit(1)
})
