#!/usr/bin/env node

import { inspectManagedPageRegistry } from './lib/managed-page-artifacts.mjs'
import {
  getChangedFiles,
  inspectTypicalPageChanges,
  parseDiffArgs,
} from './lib/detection/typical-page-candidates.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-contract-gate.mjs" [--base <git-ref>] [--head <git-ref>] [--files <a,b,c>] [--file <path>]
`)
}

function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    printUsage()
    process.exit(0)
  }

  const options = parseDiffArgs(args)
  const changedFiles = getChangedFiles(options)
  const inspection = inspectTypicalPageChanges(changedFiles)
  const managedPageRegistryInspection = inspectManagedPageRegistry(process.cwd())
  const projectLevelFailures = managedPageRegistryInspection.issues.map(
    (issue) => `[project managed-page closure] ${issue}`
  )

  if (inspection.failures.length > 0 || projectLevelFailures.length > 0) {
    console.error('[typical-page-contract-gate] Contract sync / candidate detection failed.')
    ;[...inspection.failures, ...projectLevelFailures].forEach((failure) => {
      console.error(`  - ${failure}`)
    })
    process.exit(1)
  }

  if (inspection.managedPages.length === 0 && inspection.candidates.length === 0) {
    console.log('[typical-page-contract-gate] No typical-page candidate changed in this diff.')
    return
  }

  if (inspection.managedPages.length > 0) {
    console.log('[typical-page-contract-gate] Managed typical pages are synced:')
    inspection.managedPages.forEach(({ filePath, contractEntry }) => {
      console.log(
        `  - ${filePath} -> ${contractEntry.contractJsonPath}, ${contractEntry.contractMdPath}`
      )
    })
  }

  if (inspection.candidates.length > 0) {
    console.log('[typical-page-contract-gate] Candidate detection saw:')
    inspection.candidates.forEach((candidate) => {
      console.log(`  - ${candidate.filePath} (${candidate.reasons.join(', ')})`)
    })
  }

  if (managedPageRegistryInspection.contracts.length > 0) {
    console.log('[typical-page-contract-gate] Managed page registry is synced:')
    console.log(
      `  - ${managedPageRegistryInspection.contracts.length} contract(s) -> .local-context/hiui-design/outputs/managed-pages.index.json, .local-context/hiui-design/outputs/managed-pages.index.md`
    )
  }
}

try {
  main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[typical-page-contract-gate] ${message}`)
  process.exit(1)
}
