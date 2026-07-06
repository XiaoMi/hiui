#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  getDistributionTarget,
  readDistributionManifest,
  selectFilesForTarget,
  walkFiles,
} from './lib/distribution-manifest.mjs'

function parseArgs(argv) {
  const options = {
    json: false,
    root: '',
    target: 'open-source-package',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--root' || arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      if (arg === '--root') options.root = value
      if (arg === '--target') options.target = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/check-public-cli-fixture-distribution.mjs [--root <skill-root>] [--target <distribution-target>] [--json]

Fails closed when shipped machine-public CLI fixtures declared in scripts/public-cli-contracts.json
are missing from the source tree or excluded from the selected distribution target.
`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function readJson(targetPath) {
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

function getMachinePublicFixtures(contracts) {
  return [...new Set(
    (contracts.tiers?.['machine-public'] || [])
      .filter((entry) => entry.status === 'shipped' && entry.jsonContract === 'shipped')
      .map((entry) => String(entry.fixture || '').trim())
      .filter(Boolean)
  )].sort((left, right) => left.localeCompare(right))
}

function buildReport({ fixtures, missingFromSource, missingFromTarget, root, targetName }) {
  return {
    status: missingFromSource.length === 0 && missingFromTarget.length === 0 ? 'passed' : 'failed',
    root,
    target: targetName,
    shippedFixtureCount: fixtures.length,
    fixtures,
    missingFromSource,
    missingFromTarget,
  }
}

function printReport(report, asJson) {
  if (asJson) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  console.log(`public-cli fixture distribution: ${report.status}`)
  console.log(`- root: ${report.root}`)
  console.log(`- target: ${report.target}`)
  console.log(`- shipped fixtures: ${report.shippedFixtureCount}`)
  if (report.missingFromSource.length > 0) {
    console.log(`- missing from source: ${report.missingFromSource.join(', ')}`)
  }
  if (report.missingFromTarget.length > 0) {
    console.log(`- missing from target: ${report.missingFromTarget.join(', ')}`)
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const root = path.resolve(options.root || path.join(scriptDir, '..'))
  const contractsPath = path.join(root, 'scripts', 'public-cli-contracts.json')
  const manifestPath = path.join(root, 'distribution-manifest.json')
  const contracts = await readJson(contractsPath)
  const fixtures = getMachinePublicFixtures(contracts)
  const manifest = await readDistributionManifest(manifestPath)
  const target = getDistributionTarget(manifest, options.target)
  const files = await walkFiles(root)
  const selectedFiles = new Set(selectFilesForTarget(files, target))
  const fileSet = new Set(files)

  const missingFromSource = fixtures.filter((fixturePath) => !fileSet.has(fixturePath))
  const missingFromTarget = fixtures.filter((fixturePath) => !selectedFiles.has(fixturePath))
  const report = buildReport({
    fixtures,
    missingFromSource,
    missingFromTarget,
    root,
    targetName: options.target,
  })

  if (report.status !== 'passed') {
    throw new Error(
      `Shipped machine-public fixtures are not fully distributed for ${options.target}: ${JSON.stringify({
        missingFromSource,
        missingFromTarget,
      })}`
    )
  }

  printReport(report, options.json)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  if (process.argv.includes('--json')) {
    console.error(JSON.stringify({ error: { message } }, null, 2))
  }
  console.error(`check-public-cli-fixture-distribution failed: ${message}`)
  process.exit(1)
})
