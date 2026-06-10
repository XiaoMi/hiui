#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

function runNodeScript(scriptPath, args) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: process.cwd(),
    stdio: 'inherit',
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

const currentFilePath = fileURLToPath(import.meta.url)
const scriptDir = path.dirname(currentFilePath)
const args = process.argv.slice(2)

try {
  runNodeScript(path.join(scriptDir, 'typical-page-candidate-gate.mjs'), args)
  runNodeScript(path.join(scriptDir, 'typical-page-contract-gate.mjs'), args)
  runNodeScript(path.join(scriptDir, 'typical-page-archetype-gate.mjs'), args)
  runNodeScript(path.join(scriptDir, 'typical-page-source-gate.mjs'), args)
  runNodeScript(path.join(scriptDir, 'typical-page-doctor-gate.mjs'), args)
} catch (error) {
  console.error(`[typical-page-ci-gate] ${error.message}`)
  process.exit(1)
}
