#!/usr/bin/env node

import { buildAdapterInspection, buildMoldInspection, buildPageComponentInspection, parseCommonArgs, writeError, writeJson } from './lib/asset-control-surface.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-inspect-asset.mjs" --type <mold|adapter|page-component> --id <asset-id> [--target <project-root>] [--skill-root <skill-root>] --json
`)
}

try {
  const options = parseCommonArgs(process.argv.slice(2), { allowType: true, allowId: true })
  if (options.help) {
    printUsage()
    process.exit(0)
  }
  if (!['mold', 'adapter', 'page-component'].includes(options.type)) {
    throw new Error('inspect-asset currently supports --type mold, adapter, or page-component')
  }
  if (!options.id) throw new Error('Missing required --id')
  const result = options.type === 'adapter'
    ? buildAdapterInspection({ skillRoot: options.skillRoot, adapterId: options.id })
    : options.type === 'page-component'
      ? buildPageComponentInspection({ skillRoot: options.skillRoot, targetRoot: options.target, componentId: options.id })
      : buildMoldInspection({ skillRoot: options.skillRoot, moldId: options.id })
  if (options.json) writeJson(result)
  else console.log(`${result.assetType}:${result.assetId}`)
} catch (error) {
  writeError(error, { json: process.argv.includes('--json'), schemaVersion: 'hiui-asset-inspection.v1' })
  process.exit(1)
}
