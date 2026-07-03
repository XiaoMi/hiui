#!/usr/bin/env node

import path from 'node:path'
import {
  getChangedFiles,
  isPageSourceFile,
  loadContracts,
  parseDiffArgs,
  readFileSafe,
  scoreCandidate,
  toPosixPath,
  usesTypicalPageShellPackage,
  CONTRACT_MARKER,
  CANDIDATE_IGNORE_MARKER,
  TYPICAL_PAGE_SHELL_PACKAGE,
} from './lib/detection/typical-page-candidates.mjs'
import { validateManagedPageSlotBoundary } from './lib/managed-page-source-guard.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-slot-gate.mjs" [--file <page>] [--files <a,b>] [--base <sha> --head <sha>]

Checks that changed managed pages stay within business-slot boundaries.
It is intentionally lighter than source-gate: it requires a page contract and blocks locked-shell/provenance bypasses,
but does not require finalized source snapshots.`)
}

function parseArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    printUsage()
    process.exit(0)
  }
  return parseDiffArgs(argv)
}

function isManagedCandidate({ filePath, fileContent, contractEntry }) {
  if (!isPageSourceFile(filePath)) return false
  if (fileContent.includes(CANDIDATE_IGNORE_MARKER)) return false
  if (contractEntry) return true
  if (fileContent.includes(CONTRACT_MARKER)) return true
  if (usesTypicalPageShellPackage(fileContent)) return true
  return scoreCandidate(filePath, fileContent).isCandidate
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const changedFiles = getChangedFiles(options).map((filePath) => toPosixPath(filePath))
  const contracts = loadContracts()
  const failures = []
  const checkedPages = []

  for (const filePath of changedFiles.filter(isPageSourceFile)) {
    const fileContent = readFileSafe(filePath)
    const contractEntry = contracts.get(filePath)

    if (!isManagedCandidate({ filePath, fileContent, contractEntry })) {
      continue
    }

    if (!contractEntry) {
      if (fileContent.includes(CONTRACT_MARKER)) {
        failures.push(
          `${filePath} declares "${CONTRACT_MARKER}" but no page contract exists. Slot-gate can only approve edits that are bound to a managed page contract.`
        )
      } else if (usesTypicalPageShellPackage(fileContent)) {
        failures.push(
          `${filePath} imports "${TYPICAL_PAGE_SHELL_PACKAGE}" but is not registered as a managed page. Add a contract before treating this as a slot-only edit.`
        )
      } else {
        failures.push(
          `${filePath} looks like a typical-page candidate but is not registered. Run plan/start-page/write-contract before slot-only edits.`
        )
      }
      continue
    }

    const errors = validateManagedPageSlotBoundary({
      contract: contractEntry.contract,
      sourceRaw: fileContent,
      pathLabel: filePath,
    })

    if (errors.length > 0) {
      failures.push(...errors)
    } else {
      checkedPages.push(filePath)
    }
  }

  if (failures.length > 0) {
    console.error('[typical-page-slot-gate] Slot boundary enforcement failed.')
    failures.forEach((failure) => console.error(`  - ${failure}`))
    process.exit(1)
  }

  if (checkedPages.length === 0) {
    console.log('[typical-page-slot-gate] No managed slot-only page changes detected.')
    return
  }

  console.log(
    `[typical-page-slot-gate] Checked ${checkedPages.length} managed page(s): ${checkedPages
      .map((filePath) => path.relative(process.cwd(), path.join(process.cwd(), filePath)) || filePath)
      .join(', ')}`
  )
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[typical-page-slot-gate] ${message}`)
  process.exit(1)
})
