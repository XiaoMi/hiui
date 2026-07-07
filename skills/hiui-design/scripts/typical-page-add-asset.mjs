#!/usr/bin/env node

import { buildAdapterAddPreview, buildMoldAddPreview, parseCommonArgs, writeError, writeJson } from './lib/asset-control-surface.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-add-asset.mjs" --type <mold|adapter> --id <asset-id> --dry-run [--target <project-root>] [--skill-root <skill-root>] --json
`)
}

try {
  const options = parseCommonArgs(process.argv.slice(2), { allowType: true, allowId: true })
  if (options.help) {
    printUsage()
    process.exit(0)
  }
  if (!['mold', 'adapter'].includes(options.type)) {
    throw new Error('add-asset currently supports --type mold or --type adapter')
  }
  if (!options.id) throw new Error('Missing required --id')
  const result = options.type === 'adapter'
    ? buildAdapterAddPreview({
        skillRoot: options.skillRoot,
        targetRoot: options.target,
        adapterId: options.id,
        dryRun: options.dryRun,
      })
    : buildMoldAddPreview({
        skillRoot: options.skillRoot,
        targetRoot: options.target,
        moldId: options.id,
        dryRun: options.dryRun,
      })
  if (options.json) writeJson(result)
  else console.log(`${result.status}:${result.asset.id}`)
} catch (error) {
  writeError(error, { json: process.argv.includes('--json'), schemaVersion: 'hiui-asset-add-preview.v1' })
  process.exit(1)
}
