#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  getChangedFiles,
  inspectTypicalPageChanges,
  parseDiffArgs,
} from './lib/detection/typical-page-candidates.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import { loadArchetypeDefinition } from './lib/archetypes/load-archetype-manifest.mjs'
import { validateRulesOnlyPageContract } from './lib/rules-only-page-contracts.mjs'
import fs from 'node:fs/promises'

async function main() {
  const options = parseDiffArgs(process.argv.slice(2))
  const changedFiles = getChangedFiles(options)
  const inspection = inspectTypicalPageChanges(changedFiles)

  if (inspection.managedPages.length === 0) {
    console.log('[typical-page-archetype-gate] No managed typical pages changed in this diff.')
    return
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const { manifest } = await loadPageTypeManifest({ skillRoot })
  const baselineSpecPath = path.join(
    skillRoot,
    'docs',
    'validation',
    'archetype-smoke-baselines.json'
  )
  const baselineSpec = JSON.parse(await fs.readFile(baselineSpecPath, 'utf8'))
  const failures = []

  for (const managedPage of inspection.managedPages) {
    const contract = managedPage.contractEntry.contract
    const archetypeDefinition = await loadArchetypeDefinition({
      skillRoot,
      pageTypeId: contract.pageTypeId,
    })

    const validation = validateRulesOnlyPageContract({
      contract,
      manifest,
      targetRoot: process.cwd(),
      archetypeDefinition,
      baselineSpec,
    })

    if (validation.errors.length > 0) {
      failures.push(
        `${managedPage.filePath} has an invalid archetype-backed contract: ${validation.errors.join(
          '; '
        )}`
      )
      continue
    }

    if (!contract.archetypeId) {
      failures.push(
        `${managedPage.filePath} is missing archetypeId in its contract. Re-run typical-page:finalize-page with the current skill package.`
      )
    }

    if (contract.strictExampleGeneration !== true) {
      failures.push(
        `${managedPage.filePath} is missing strictExampleGeneration=true in its contract. Re-run typical-page:finalize-page.`
      )
    }

    if (!contract.adapterContract || typeof contract.adapterContract !== 'object') {
      failures.push(
        `${managedPage.filePath} is missing adapterContract metadata in its contract. Re-run typical-page:finalize-page.`
      )
    }
  }

  if (failures.length > 0) {
    console.error('[typical-page-archetype-gate] Archetype enforcement failed.')
    failures.forEach((failure) => {
      console.error(`  - ${failure}`)
    })
    process.exit(1)
  }

  console.log('[typical-page-archetype-gate] All changed managed typical pages reference a valid packaged archetype contract.')
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[typical-page-archetype-gate] ${message}`)
  process.exit(1)
})
