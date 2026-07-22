#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { validateManagedPageSource } from './lib/managed-page-source-guard.mjs'
import {
  findManagedPageContractEntry,
  loadRulesOnlyPageContracts,
  normalizeContractPath,
} from './lib/rules-only-page-contracts.mjs'
import { checkIdForFailure, failureCodeForCheckId } from './typical-page-preflight.mjs'

const LIST_PAGE_TYPES = new Set(['table-basic', 'table-stat', 'tree-table', 'tree-split'])
const LIST_EARLY_SCREEN_CHECK_IDS = new Set([
  'managedFilterChain',
  'queryFilterBaseline',
  'hostStyleContamination',
  'listWorkspaceWidth',
  'paginationDrift',
])

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/verify-managed-list-source.mjs" --page <relative-page-path> [--target <project-root>] [--json]

Notes:
  - This is an early-screen shell for managed list pages only.
  - It reuses managed-page-source-guard + preflight failure mapping, then filters down to list-page failure codes already defined in failure-matrix.md.
  - It does not replace full preflight or define any new failure semantics.
`)
}

function parseArgs(argv) {
  const options = {
    json: false,
    page: '',
    target: process.cwd(),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--page' || arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--page') options.page = value
      if (arg === '--target') options.target = path.resolve(value)
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

  return options
}

async function findManagedContract(targetRoot, pagePath) {
  const normalizedPagePath = normalizeContractPath(targetRoot, pagePath)
  const contractsResult = await loadRulesOnlyPageContracts(targetRoot)
  return findManagedPageContractEntry(contractsResult.contracts, normalizedPagePath)?.contract || null
}

function printHumanReadableReport(report) {
  console.log(`Managed list source verify: ${report.status}`)
  console.log(`- page: ${report.page}`)
  console.log(`- page type: ${report.pageTypeId}`)
  console.log(`- failure codes: ${report.blockingIssues.map((issue) => issue.code).join(', ') || '(none)'}`)
  console.log(`- matched checks: ${report.blockingIssues.map((issue) => issue.checkId).join(', ') || '(none)'}`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const targetRoot = path.resolve(options.target)
  const normalizedPagePath = normalizeContractPath(targetRoot, options.page)
  const contract = await findManagedContract(targetRoot, normalizedPagePath)

  if (!contract) {
    throw new Error(
      `Managed list source verification requires an existing page contract for ${normalizedPagePath}. Resolve contract registration first.`
    )
  }

  const pageTypeId = String(contract.pageTypeId || '').trim()
  const baseReport = {
    schemaVersion: 'managed-list-source-verify-report.v1',
    page: normalizedPagePath,
    pageTypeId,
  }

  if (!LIST_PAGE_TYPES.has(pageTypeId)) {
    const report = {
      ...baseReport,
      status: 'not-applicable',
      blockingIssues: [],
      reason: `${pageTypeId || '(missing-page-type)'} is outside the managed list-source early-screen scope`,
    }
    if (options.json) {
      console.log(JSON.stringify(report, null, 2))
    } else {
      printHumanReadableReport(report)
    }
    return
  }

  const failures = validateManagedPageSource({
    contract,
    generatedPagePath: normalizedPagePath,
    targetRoot,
  })
  const blockingIssues = failures
    .map((message) => {
      const checkId = checkIdForFailure(message)
      if (!LIST_EARLY_SCREEN_CHECK_IDS.has(checkId)) {
        return null
      }

      return {
        code: failureCodeForCheckId(checkId),
        checkId,
        source: 'managed-page-source-guard',
        message,
      }
    })
    .filter(Boolean)

  const report = {
    ...baseReport,
    status: blockingIssues.length > 0 ? 'failed' : 'passed',
    blockingIssues,
    failureCount: blockingIssues.length,
    reason:
      blockingIssues.length > 0
        ? 'managed list-source early-screen detected existing list-page governance failures'
        : 'managed list-source early-screen found no list-page-specific blocking failures',
  }

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    printHumanReadableReport(report)
  }

  if (report.status === 'failed') {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
