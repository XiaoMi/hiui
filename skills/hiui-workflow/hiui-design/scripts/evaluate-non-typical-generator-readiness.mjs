#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  NON_TYPICAL_GENERATOR_READINESS_PAGE_FAMILY,
  writeNonTypicalGeneratorReadinessEvaluation,
} from './lib/non-typical-generator-readiness-evaluation.mjs'

function readRequiredArg(argv, index, name) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`)
  return value
}

function normalizeString(value) {
  return String(value || '').trim()
}

function parseArgs(argv) {
  const options = {
    target: '',
    pageFamily: NON_TYPICAL_GENERATOR_READINESS_PAGE_FAMILY,
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--target') {
      options.target = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--page-family') {
      options.pageFamily = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node .local-context/hiui-design/scripts/evaluate-non-typical-generator-readiness.mjs --target <project-root> [--page-family non-typical-page] [--json]'
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!normalizeString(options.target)) {
    throw new Error('Missing --target <project-root>')
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const targetRoot = path.resolve(options.target)
  const { report } = await writeNonTypicalGeneratorReadinessEvaluation({
    skillRoot,
    targetRoot,
    pageFamily: options.pageFamily,
  })

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log(
      [
        '# Non-Typical Generator Readiness Evaluation',
        '',
        `- status: ${report.status}`,
        `- evidenceStatus: ${report.evidenceStatus}`,
        `- releaseRecommendation: ${report.releaseRecommendation}`,
        `- reason: ${report.reason}`,
      ].join('\n')
    )
  }

  if (report.status !== 'pass') {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error.message || String(error))
  process.exit(1)
})
