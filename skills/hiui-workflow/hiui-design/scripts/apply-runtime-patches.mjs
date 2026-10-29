#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  MANAGED_RUNTIME_PATCH_IDS,
  runManagedRuntimePatches,
} from './lib/runtime-patches.mjs'

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    json: false,
    line: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      options.target = value
      index += 1
      continue
    }

    if (arg === '--line') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      options.line = value
      index += 1
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node .local-context/hiui-design/scripts/apply-runtime-patches.mjs [--target <project-root>] [--json]'
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function renderMarkdown(report) {
  const lines = [
    '# Managed Runtime Patch Report',
    '',
    `- status: ${report.status}`,
    `- patched groups: ${report.summary.patchedGroups}`,
    `- noop groups: ${report.summary.noopGroups}`,
    `- patched files: ${report.summary.patchedFiles}`,
    `- already patched files: ${report.summary.alreadyPatchedFiles}`,
    `- missing files: ${report.summary.missingFiles}`,
    `- unchanged files: ${report.summary.unchangedFiles}`,
    '',
    `- managed patch ids: ${MANAGED_RUNTIME_PATCH_IDS.join(', ')}`,
    '',
    '## Patch Groups',
    '',
  ]

  for (const patch of report.patches) {
    lines.push(`### ${patch.title}`)
    lines.push('')
    lines.push(`- id: ${patch.id}`)
    lines.push(`- status: ${patch.status}`)
    lines.push(`- patched files: ${patch.summary.patched}`)
    lines.push(`- already patched files: ${patch.summary.alreadyPatched}`)
    lines.push(`- missing files: ${patch.summary.missing}`)
    lines.push(`- unchanged files: ${patch.summary.unchanged}`)
    lines.push('')
    for (const item of patch.results) {
      lines.push(
        `- ${item.status}: ${path.relative(report.targetRoot, item.filePath)}${item.applied.length > 0 ? ` (${item.applied.join(', ')})` : ''}`
      )
    }
    lines.push('')
  }

  return lines.join('\n')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const targetRoot = path.resolve(options.target)
  const report = await runManagedRuntimePatches({ targetRoot })

  if (options.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
    return
  }

  process.stdout.write(`${renderMarkdown(report)}\n`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main()
}
