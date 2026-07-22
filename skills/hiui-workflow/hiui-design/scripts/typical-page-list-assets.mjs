#!/usr/bin/env node

import { buildAdapterCatalog, buildMoldCatalog, buildPageComponentCatalog, parseCommonArgs, writeError, writeJson } from './lib/asset-control-surface.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-list-assets.mjs" --type <molds|adapters|page-components> [--target <project-root>] [--skill-root <skill-root>] --json
`)
}

try {
  const options = parseCommonArgs(process.argv.slice(2), { allowType: true, allowId: false })
  if (options.help) {
    printUsage()
    process.exit(0)
  }
  if (!['molds', 'adapters', 'page-components'].includes(options.type)) {
    throw new Error('list-assets currently supports --type molds, adapters, or page-components')
  }
  const result = options.type === 'adapters'
    ? buildAdapterCatalog({ skillRoot: options.skillRoot, targetRoot: options.target })
    : options.type === 'page-components'
      ? buildPageComponentCatalog({ skillRoot: options.skillRoot, targetRoot: options.target })
      : buildMoldCatalog({ skillRoot: options.skillRoot, targetRoot: options.target })
  if (options.json) writeJson(result)
  else console.log(`molds=${result.items.length}`)
} catch (error) {
  writeError(error, { json: process.argv.includes('--json'), schemaVersion: 'hiui-asset-catalog.v1' })
  process.exit(1)
}
