#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const currentFilePath = fileURLToPath(import.meta.url)
const scriptDir = path.dirname(currentFilePath)

const REGRESSION_SCRIPTS = [
  {
    label: 'doctor mixed-mode rules-only coverage',
    fileName: 'verify-typical-page-doctor-rules-only-regressions.mjs',
  },
  {
    label: 'managed source-guard coverage',
    fileName: 'verify-managed-page-source-guard-regressions.mjs',
  },
  {
    label: 'managed chart governance flow coverage',
    fileName: 'verify-managed-chart-flow-regressions.mjs',
  },
]

function runRegressionScript(fileName) {
  const scriptPath = path.join(scriptDir, fileName)
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: 'pipe',
  })

  if (result.error) {
    throw result.error
  }

  if ((result.status ?? 1) !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || `${fileName} failed`)
  }

  return String(result.stdout || '').trim()
}

function main() {
  console.log('[verify-typical-page-maintainer-regressions] Running maintainer regression bundle...')

  for (const regressionScript of REGRESSION_SCRIPTS) {
    console.log(`- ${regressionScript.label}`)
    const stdout = runRegressionScript(regressionScript.fileName)
    if (stdout) {
      console.log(stdout)
    }
  }

  console.log('[verify-typical-page-maintainer-regressions] PASS')
  console.log(`- regression scripts: ${REGRESSION_SCRIPTS.length}`)
}

try {
  main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[verify-typical-page-maintainer-regressions] ${message}`)
  process.exit(1)
}
