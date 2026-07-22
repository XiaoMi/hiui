#!/usr/bin/env node

import { buildAssetDiff, parseCommonArgs, writeError, writeJson } from './lib/asset-control-surface.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-diff-asset.mjs" --type <mold|adapter> --id <asset-id> [--target <project-root>] [--skill-root <skill-root>] --json
`)
}

try {
  const options = parseCommonArgs(process.argv.slice(2), { allowType: true, allowId: true })
  if (options.help) {
    printUsage()
    process.exit(0)
  }
  if (!options.id) throw new Error('Missing required --id')
  const result = buildAssetDiff({
    skillRoot: options.skillRoot,
    targetRoot: options.target,
    type: options.type,
    id: options.id,
  })
  if (options.json) writeJson(result)
  else console.log(`${result.status}:${result.asset.type}:${result.asset.id}`)
} catch (error) {
  writeError(error, { json: process.argv.includes('--json'), schemaVersion: 'hiui-asset-diff.v1' })
  process.exit(1)
}
