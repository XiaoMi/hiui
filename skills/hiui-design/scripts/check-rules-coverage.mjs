#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8')
}

function parseCoverageSection(content, heading) {
  const lines = content.split('\n')
  const startIndex = lines.findIndex((line) => line.trim() === `## ${heading}`)
  if (startIndex === -1) {
    throw new Error(`Missing section "## ${heading}" in rules/COVERAGE.md`)
  }

  const ids = []
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trim()

    if (line.startsWith('## ')) {
      break
    }

    const match = line.match(/^- `([^`]+)`$/)
    if (match) {
      ids.push(match[1])
    }
  }

  return ids
}

function diffIds(actualIds, expectedIds) {
  const actualSet = new Set(actualIds)
  const expectedSet = new Set(expectedIds)

  return {
    missing: expectedIds.filter((id) => !actualSet.has(id)),
    extra: actualIds.filter((id) => !expectedSet.has(id)),
  }
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function collectMissingGenerationDocs(skillRoot, manifest) {
  const missingDocs = []

  for (const pageType of manifest.pageTypes) {
    const docPaths = [pageType.docEntry, ...(pageType.sharedDocs ?? [])].filter(Boolean)
    for (const relativeDocPath of docPaths) {
      const fullPath = path.join(skillRoot, relativeDocPath)
      if (!(await pathExists(fullPath))) {
        missingDocs.push(`${pageType.id}: ${relativeDocPath}`)
      }
    }
  }

  const nonTypicalLayoutDoc = manifest.nonTypicalPageLayout?.docEntry
  if (nonTypicalLayoutDoc) {
    const fullPath = path.join(skillRoot, nonTypicalLayoutDoc)
    if (!(await pathExists(fullPath))) {
      missingDocs.push(`non-typical-layout: ${nonTypicalLayoutDoc}`)
    }
  }

  return missingDocs
}

function printDiff(label, diff) {
  if (!diff.missing.length && !diff.extra.length) {
    return
  }

  console.log(`${label}:`)
  for (const id of diff.missing) {
    console.log(`- missing: ${id}`)
  }
  for (const id of diff.extra) {
    console.log(`- extra: ${id}`)
  }
}

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const coveragePath = path.join(skillRoot, 'rules', 'COVERAGE.md')
  const coverageContent = await readText(coveragePath)
  const { manifest } = await loadPageTypeManifest({ skillRoot })
  const manifestIds = manifest.pageTypes.map((pageType) => pageType.id)
  const nonTypicalStrategyIds = Array.isArray(manifest.nonTypicalPageLayout?.strategies)
    ? manifest.nonTypicalPageLayout.strategies.map((strategy) => strategy.id)
    : []
  const nonTypicalArchetypeIds = Array.isArray(manifest.nonTypicalPageLayout?.archetypes)
    ? manifest.nonTypicalPageLayout.archetypes.map((archetype) => archetype.id)
    : []
  const generationIds = parseCoverageSection(coverageContent, 'Generation Coverage')
  const validationIds = parseCoverageSection(coverageContent, 'Validation Coverage')
  const nonTypicalStrategyCoverageIds = parseCoverageSection(coverageContent, 'Non-typical Layout Strategy Coverage')
  const nonTypicalArchetypeCoverageIds = parseCoverageSection(coverageContent, 'Non-typical Layout Archetype Coverage')
  const generationDiff = diffIds(generationIds, manifestIds)
  const validationDiff = diffIds(validationIds, manifestIds)
  const nonTypicalStrategyDiff = diffIds(nonTypicalStrategyCoverageIds, nonTypicalStrategyIds)
  const nonTypicalArchetypeDiff = diffIds(nonTypicalArchetypeCoverageIds, nonTypicalArchetypeIds)
  const missingGenerationDocs = await collectMissingGenerationDocs(skillRoot, manifest)

  if (
    generationDiff.missing.length ||
    generationDiff.extra.length ||
    validationDiff.missing.length ||
    validationDiff.extra.length ||
    nonTypicalStrategyDiff.missing.length ||
    nonTypicalStrategyDiff.extra.length ||
    nonTypicalArchetypeDiff.missing.length ||
    nonTypicalArchetypeDiff.extra.length ||
    missingGenerationDocs.length
  ) {
    console.log('Rules coverage check failed.')
    printDiff('Generation coverage mismatch', generationDiff)
    printDiff('Validation coverage mismatch', validationDiff)
    printDiff('Non-typical layout strategy coverage mismatch', nonTypicalStrategyDiff)
    printDiff('Non-typical layout archetype coverage mismatch', nonTypicalArchetypeDiff)

    if (missingGenerationDocs.length) {
      console.log('Missing generation docs:')
      for (const doc of missingGenerationDocs) {
        console.log(`- ${doc}`)
      }
    }

    process.exit(1)
  }

  console.log('Rules coverage check passed.')
  console.log(`- page types: ${manifestIds.length}`)
  console.log(`- generation coverage entries: ${generationIds.length}`)
  console.log(`- validation coverage entries: ${validationIds.length}`)
  console.log(`- non-typical layout strategies: ${nonTypicalStrategyIds.length}`)
  console.log(`- non-typical layout archetypes: ${nonTypicalArchetypeIds.length}`)
  console.log('- generation docs: all referenced files exist')
}

await main()
