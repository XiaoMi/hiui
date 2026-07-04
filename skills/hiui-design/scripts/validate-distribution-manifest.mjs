#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  assertTargetRequirements,
  getDistributionTarget,
  readDistributionManifest,
  selectFilesForTarget,
  walkFiles,
} from './lib/distribution-manifest.mjs'

function parseArgs(argv) {
  const options = { json: false, root: '', target: '' }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --target')
      options.target = value
      index += 1
      continue
    }
    if (arg === '--root') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --root')
      options.root = value
      index += 1
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/validate-distribution-manifest.mjs [--target runtime-mirror|team-package|open-source-package|open-source-dev-bundle] [--root <skill-root>] [--json]')
      process.exit(0)
    }
    throw new Error(`Unknown argument: ${arg}`)
  }
  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const root = path.resolve(options.root || path.join(scriptDir, '..'))
  const manifest = await readDistributionManifest(path.join(root, 'distribution-manifest.json'))
  const files = await walkFiles(root)
  const targetNames = options.target ? [options.target] : Object.keys(manifest.targets)
  const targets = []

  for (const targetName of targetNames) {
    const target = getDistributionTarget(manifest, targetName)
    const selectedFiles = selectFilesForTarget(files, target)
    await assertTargetRequirements(root, targetName, target, selectedFiles)
    targets.push({
      target: targetName,
      files: selectedFiles.length,
      includePatterns: target.include.length,
      excludePatterns: target.exclude.length,
    })
  }

  const report = { status: 'passed', root, targets }
  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log(`Distribution manifest: ${report.status}`)
    for (const target of targets) {
      console.log(`- ${target.target}: ${target.files} files`)
    }
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`validate-distribution-manifest failed: ${message}`)
  process.exit(1)
})
