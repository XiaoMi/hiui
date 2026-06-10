#!/usr/bin/env node

import {
  getChangedFiles,
  inspectTypicalPageChanges,
  parseDiffArgs,
} from './lib/detection/typical-page-candidates.mjs'

function main() {
  const options = parseDiffArgs(process.argv.slice(2))
  const changedFiles = getChangedFiles(options)
  const inspection = inspectTypicalPageChanges(changedFiles)

  const candidateOnlyFailures = inspection.failures.filter((failure) =>
    failure.includes('looks like a new typical-page candidate') ||
    failure.includes('imports "@hiui-design/typical-page-shells"')
  )

  if (candidateOnlyFailures.length > 0) {
    console.error('[typical-page-candidate-gate] New typical-page candidates are not registered.')
    candidateOnlyFailures.forEach((failure) => {
      console.error(`  - ${failure}`)
    })
    process.exit(1)
  }

  if (inspection.candidates.length === 0) {
    console.log('[typical-page-candidate-gate] No new typical-page candidates found in this diff.')
    return
  }

  console.log('[typical-page-candidate-gate] Candidate detection saw:')
  inspection.candidates.forEach((candidate) => {
    console.log(`  - ${candidate.filePath} (${candidate.reasons.join(', ')})`)
  })
}

try {
  main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[typical-page-candidate-gate] ${message}`)
  process.exit(1)
}
