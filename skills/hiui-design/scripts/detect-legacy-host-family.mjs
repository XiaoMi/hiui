#!/usr/bin/env node

import { defaultSkillRoot, parseCommonArgs, writeError, writeJson } from './lib/asset-control-surface.mjs'
import { detectLegacyHostFamily } from './lib/legacy-host-family-registry.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/detect-legacy-host-family.mjs" [--target <project-root>] [--skill-root <skill-root>] --json
`)
}

try {
  const options = parseCommonArgs(process.argv.slice(2), { allowType: false, allowId: false })
  if (options.help) {
    printUsage()
    process.exit(0)
  }
  const result = detectLegacyHostFamily({ targetRoot: options.target, skillRoot: options.skillRoot || defaultSkillRoot() })
  if (options.json) writeJson(result)
  else console.log(`status=${result.status} hostFamilyId=${result.hostFamilyId || 'none'} confidence=${result.confidence}`)
} catch (error) {
  writeError(error, { json: process.argv.includes('--json'), schemaVersion: 'legacy-host-family-detection.v1' })
  process.exit(1)
}
