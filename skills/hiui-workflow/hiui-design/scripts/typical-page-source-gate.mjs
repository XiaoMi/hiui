#!/usr/bin/env node

import {
  getChangedFiles,
  inspectTypicalPageChanges,
  parseDiffArgs,
} from './lib/detection/typical-page-candidates.mjs'
import { validateManagedPageSource } from './lib/managed-page-source-guard.mjs'

async function main() {
  const options = parseDiffArgs(process.argv.slice(2))
  const changedFiles = getChangedFiles(options)
  const inspection = inspectTypicalPageChanges(changedFiles)
  const changedManagedPages = inspection.managedPages

  const failures = [...inspection.failures]

  for (const entry of changedManagedPages) {
    const filePath = entry.filePath
    const contractEntry = entry.contractEntry
    const errors = validateManagedPageSource({
      contract: contractEntry.contract,
      generatedPagePath: filePath,
      targetRoot: process.cwd(),
    })

    if (errors.length > 0) {
      failures.push(...errors)
    }
  }

  if (changedManagedPages.length === 0 && failures.length === 0) {
    console.log('[typical-page-source-gate] No managed typical pages changed in this diff.')
    return
  }

  if (failures.length > 0) {
    console.error(
      '[typical-page-source-gate] Managed page source contract enforcement failed. Current-page delivery requires an explicit, registered source contract before doctor can be trusted. Local import chains are included in this check, so transitive helper contamination is blocking here as well.'
    )
    failures.forEach((failure) => {
      console.error(`  - ${failure}`)
    })
    process.exit(1)
  }

  console.log(
    '[typical-page-source-gate] All changed managed typical pages expose a registered, verifiable source contract.'
  )
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[typical-page-source-gate] ${message}`)
  process.exit(1)
})
