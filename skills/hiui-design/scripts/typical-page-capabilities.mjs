#!/usr/bin/env node

import { parseCommonArgs, writeError, writeJson } from './lib/asset-control-surface.mjs'
import { loadLegacyHostFamilyFact, loadProjectCapabilitiesFact } from './lib/project-facts.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-capabilities.mjs" [--target <project-root>] [--skill-root <skill-root>] --json
`)
}

async function main() {
  const options = parseCommonArgs(process.argv.slice(2), { allowType: false, allowId: false })
  if (options.help) {
    printUsage()
    process.exit(0)
  }
  const legacyHostFamily = await loadLegacyHostFamilyFact({
    targetRoot: options.target,
    skillRoot: options.skillRoot,
  })
  const result = await loadProjectCapabilitiesFact({
    targetRoot: options.target,
    skillRoot: options.skillRoot,
    legacyHostFamily,
  })
  if (options.json) writeJson(result)
  else console.log(`projectRootValid=${result.projectRootValid} mode=${result.mode.id}`)
}

main().catch((error) => {
  writeError(error, { json: process.argv.includes('--json'), schemaVersion: 'hiui-project-capabilities.v1' })
  process.exit(1)
})
