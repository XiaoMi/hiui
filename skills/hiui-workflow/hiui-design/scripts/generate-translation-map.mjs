#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { computeManagedPageSourceSnapshot } from './lib/managed-page-artifacts.mjs'
import {
  getRulesOnlyOutputRoot,
  loadRulesOnlyPageContracts,
  normalizeContractPath,
  toContractSlug,
} from './lib/rules-only-page-contracts.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/generate-translation-map.mjs" --page <relative-page-path> [--target <project-root>] [--reason <text>] [--json] [--contract-fixture <quality-pass>]

Default behavior:
  - loads the managed page contract
  - computes the current source snapshot hash
  - writes translation-map.v1 to .local-context/hiui-design/outputs/translation-maps/<page>.json
`)
}

function parseArgs(argv) {
  const options = {
    contractFixture: '',
    json: false,
    page: '',
    reason: '',
    target: process.cwd(),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--page' || arg === '--target' || arg === '--reason' || arg === '--contract-fixture') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--page') options.page = value
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--reason') options.reason = value
      if (arg === '--contract-fixture') options.contractFixture = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.page) {
    throw new Error('Missing --page')
  }
  if (options.contractFixture && !['quality-pass'].includes(options.contractFixture)) {
    throw new Error('Expected --contract-fixture to be one of: quality-pass')
  }

  return options
}

function buildContractFixtureReport() {
  return {
    status: 'written',
    outputPath: '.local-context/hiui-design/outputs/translation-maps/src__pages__orders__index.json',
    translationMap: {
      schemaVersion: 'translation-map.v1',
      generatedBy: 'typical-page:translation-map',
      generatedAt: '2026-06-17T00:00:00.000Z',
      page: 'src/pages/orders/index.tsx',
      pageType: 'table-stat',
      mode: 'legacy-host-compatible',
      reason: 'contract-fixture',
      sourceHash: 'sha256:translation-map-contract-fixture-source',
      previousSourceHash: '',
      stale: false,
      staleReason: '',
      invalidatesWhen: [
        'page source snapshot changes',
        'managed contract regionMapping changes',
        'managed contract ownershipMapping changes',
        'formal acceptance is requested for a high-risk legacy page',
      ],
      mappings: [
        { kind: 'region', source: 'header', target: 'LegacyPageHeader' },
        { kind: 'ownership', source: 'main-scroll', target: 'LegacyContentScroller' },
      ],
    },
  }
}

function mappingPathForPage(targetRoot, page) {
  return path.join(
    getRulesOnlyOutputRoot(targetRoot),
    'translation-maps',
    `${toContractSlug(page)}.json`
  )
}

function buildMappings(contract) {
  const regions = Array.isArray(contract.regionMapping) ? contract.regionMapping : []
  const ownerships = Array.isArray(contract.ownershipMapping) ? contract.ownershipMapping : []
  return [
    ...regions.map((item) => ({
      kind: 'region',
      source: String(item.region || '').trim(),
      target: String(item.target || '').trim(),
    })),
    ...ownerships.map((item) => ({
      kind: 'ownership',
      source: String(item.role || '').trim(),
      target: String(item.target || '').trim(),
    })),
  ].filter((item) => item.source || item.target)
}

async function readPreviousMap(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return null
  }
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    if (options.contractFixture) {
      console.log(JSON.stringify(buildContractFixtureReport(), null, 2))
      return
    }

    const targetRoot = path.resolve(options.target)
    const page = normalizeContractPath(targetRoot, options.page)
    const contractsResult = await loadRulesOnlyPageContracts(targetRoot)
    const contractEntry = contractsResult.contracts.find(
      (entry) => entry?.contract?.generatedPagePath === page
    )

    if (!contractEntry?.contract) {
      throw new Error(`${page} is not registered as a managed page. Run typical-page:start-page first.`)
    }

    const snapshot = computeManagedPageSourceSnapshot({ generatedPagePath: page, targetRoot })
    const outputPath = mappingPathForPage(targetRoot, page)
    const previousMap = await readPreviousMap(outputPath)
    const previousSourceHash = String(previousMap?.sourceHash || '').trim()
    const sourceHash = snapshot.hash
    const generatedAt = new Date().toISOString()
    const translationMap = {
      schemaVersion: 'translation-map.v1',
      generatedBy: 'typical-page:translation-map',
      generatedAt,
      page,
      pageType: contractEntry.contract.pageTypeId,
      mode: contractEntry.contract.archetypeMode || '',
      reason: options.reason || 'manual-refresh',
      sourceHash,
      previousSourceHash,
      stale: false,
      staleReason: '',
      invalidatesWhen: [
        'page source snapshot changes',
        'managed contract regionMapping changes',
        'managed contract ownershipMapping changes',
        'formal acceptance is requested for a high-risk legacy page',
      ],
      mappings: buildMappings(contractEntry.contract),
    }

    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, `${JSON.stringify(translationMap, null, 2)}\n`, 'utf8')

    const payload = {
      status: 'written',
      outputPath: normalizeContractPath(targetRoot, outputPath),
      translationMap,
    }

    if (options.json) {
      console.log(JSON.stringify(payload, null, 2))
      return
    }

    console.log('[typical-page:translation-map] written')
    console.log(`- page: ${translationMap.page}`)
    console.log(`- page type: ${translationMap.pageType}`)
    console.log(`- output: ${payload.outputPath}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[typical-page:translation-map] ${message}`)
    process.exit(1)
  }
}

main()
