#!/usr/bin/env node

import { buildProjectCapabilities, parseCommonArgs, writeError, writeJson } from './lib/asset-control-surface.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-capabilities.mjs" [--target <project-root>] [--skill-root <skill-root>] --json
`)
}

try {
  const options = parseCommonArgs(process.argv.slice(2), { allowType: false, allowId: false })
  if (options.help) {
    printUsage()
    process.exit(0)
  }
  const result = buildProjectCapabilities({ targetRoot: options.target, skillRoot: options.skillRoot })
  if (options.json) writeJson(result)
  else console.log(`projectRootValid=${result.projectRootValid} mode=${result.mode.id}`)
} catch (error) {
  writeError(error, { json: process.argv.includes('--json'), schemaVersion: 'hiui-project-capabilities.v1' })
  process.exit(1)
}
