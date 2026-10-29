#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
export { runReact19RuntimePatch } from './lib/runtime-patches.mjs'
import { runReact19RuntimePatch } from './lib/runtime-patches.mjs'

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
        'Usage: node .local-context/hiui-design/scripts/apply-react19-runtime-patches.mjs [--target <project-root>] [--json]'
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function renderMarkdown(report) {
  const lines = [
    '# React 19 Runtime Patch Report',
    '',
    `- status: ${report.status}`,
    `- patched files: ${report.summary.patched}`,
    `- already patched files: ${report.summary.alreadyPatched}`,
    `- missing files: ${report.summary.missing}`,
    `- unchanged files: ${report.summary.unchanged}`,
    '',
    '## Files',
    '',
  ]

  for (const item of report.results) {
    lines.push(`- ${item.status}: ${path.relative(report.targetRoot, item.filePath)}${item.applied.length > 0 ? ` (${item.applied.join(', ')})` : ''}`)
  }

  return lines.join('\n')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const targetRoot = path.resolve(options.target)
  const report = await runReact19RuntimePatch({ targetRoot })

  if (options.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
    return
  }

  process.stdout.write(`${renderMarkdown(report)}\n`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main()
}
