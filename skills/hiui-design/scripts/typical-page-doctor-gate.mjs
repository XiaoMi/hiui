#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const DEFAULT_REQUIRED_CHECKS = [
  'no-business-pages-in-example-gallery',
  'no-business-gradients',
  'no-layout-stretch-anti-patterns',
  'no-white-body-edge-touch',
  'top-level-menu-icon-semantics',
  'rules-only-page-contracts',
  'rules-only-managed-page-coverage',
  'rules-only-managed-page-registry',
  'rules-only-example-parity-review',
  'rules-only-structural-guard',
  'rules-only-workspace-ownership',
  'rules-only-component-semantic-guard',
  'external-component-token-bridge',
  'rules-only-runtime-smoke-closure',
]

function parseArgs(argv) {
  const passthroughArgs = []
  const sourceGateArgs = []
  const requiredChecks = []

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--require-check') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --require-check')
      }

      requiredChecks.push(value)
      index += 1
      continue
    }

    if (arg === '--base' || arg === '--head' || arg === '--files' || arg === '--file') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      sourceGateArgs.push(arg, value)
      index += 1
      continue
    }

    passthroughArgs.push(arg)
  }

  return {
    passthroughArgs,
    sourceGateArgs,
    requiredChecks: requiredChecks.length > 0 ? requiredChecks : DEFAULT_REQUIRED_CHECKS,
  }
}

function parseDoctorJson(stdout) {
  const trimmed = String(stdout || '').trim()
  if (!trimmed) {
    throw new Error('typical-page-doctor returned empty output')
  }
  return JSON.parse(trimmed)
}

function formatCheck(check) {
  const detail = check.detail ? ` - ${check.detail}` : ''
  return `${check.id}: ${check.summary}${detail}`
}

const currentFilePath = fileURLToPath(import.meta.url)
const scriptDir = path.dirname(currentFilePath)
const doctorScriptPath = path.join(scriptDir, 'typical-page-doctor.mjs')
const sourceGateScriptPath = path.join(scriptDir, 'typical-page-source-gate.mjs')

let args

try {
  args = parseArgs(process.argv.slice(2))
} catch (error) {
  console.error(`[typical-page-doctor-gate] ${error.message}`)
  process.exit(1)
}

const sourceGateResult = spawnSync(
  process.execPath,
  [sourceGateScriptPath, ...args.sourceGateArgs],
  {
    cwd: process.cwd(),
    encoding: 'utf8',
  }
)

if (sourceGateResult.error) {
  console.error(
    `[typical-page-doctor-gate] Failed to execute source gate: ${sourceGateResult.error.message}`
  )
  process.exit(1)
}

if ((sourceGateResult.status ?? 0) !== 0) {
  const sourceStdout = String(sourceGateResult.stdout || '').trim()
  const sourceStderr = String(sourceGateResult.stderr || '').trim()

  console.error(
    '[typical-page-doctor-gate] Source gate failed before doctor. Current-page delivery requires registered source contracts and explicit facts before doctor can be trusted.'
  )
  if (sourceStdout) {
    console.error(sourceStdout)
  }
  if (sourceStderr) {
    console.error(sourceStderr)
  }
  process.exit(sourceGateResult.status || 1)
}

const doctorResult = spawnSync(
  process.execPath,
  [doctorScriptPath, '--json', ...args.passthroughArgs],
  {
    cwd: process.cwd(),
    encoding: 'utf8',
  }
)

if (doctorResult.error) {
  console.error(
    `[typical-page-doctor-gate] Failed to execute doctor: ${doctorResult.error.message}`
  )
  process.exit(1)
}

let doctorJson

try {
  doctorJson = parseDoctorJson(doctorResult.stdout)
} catch (error) {
  const stderr = doctorResult.stderr ? `\n${doctorResult.stderr.trim()}` : ''
  console.error(
    `[typical-page-doctor-gate] Failed to parse doctor output: ${error.message}${stderr}`
  )
  process.exit(1)
}

const hardFailures = (doctorJson.checks || []).filter(
  (check) => check.ok === false && check.severity === 'error'
)
const manualChecks = (doctorJson.checks || []).filter(
  (check) => check.ok === false && check.severity === 'manual'
)
const warningChecks = (doctorJson.checks || []).filter(
  (check) => check.ok === false && check.severity === 'warn'
)
const requiredCheckFailures = args.requiredChecks
  .map((checkId) => (doctorJson.checks || []).find((check) => check.id === checkId))
  .filter((check) => !check || check.ok !== true)

if (
  doctorResult.status !== 0 ||
  doctorJson.status !== 'pass' ||
  hardFailures.length > 0 ||
  manualChecks.length > 0 ||
  warningChecks.length > 0 ||
  requiredCheckFailures.length > 0
) {
  console.error(
    '[typical-page-doctor-gate] hiui-design doctor gate failed. Current-page delivery requires a warning-free PASS result.'
  )

  if (hardFailures.length > 0) {
    console.error('[typical-page-doctor-gate] Doctor reported hard failures:')
    hardFailures.forEach((check) => {
      console.error(`  - ${formatCheck(check)}`)
    })
  }

  if (manualChecks.length > 0) {
    console.error('[typical-page-doctor-gate] Doctor still requires manual completion:')
    manualChecks.forEach((check) => {
      console.error(`  - ${formatCheck(check)}`)
    })
  }

  if (warningChecks.length > 0) {
    console.error(
      '[typical-page-doctor-gate] Doctor still reports warnings. Warnings are blocking for current-page completion:'
    )
    warningChecks.forEach((check) => {
      console.error(`  - ${formatCheck(check)}`)
    })
  }

  if (requiredCheckFailures.length > 0) {
    console.error('[typical-page-doctor-gate] Required checks are not passing:')
    requiredCheckFailures.forEach((check) => {
      if (check) {
        console.error(`  - ${formatCheck(check)}`)
      } else {
        console.error('  - missing required check result in doctor output')
      }
    })
  }

  if (doctorJson.reportPath) {
    console.error(`[typical-page-doctor-gate] Report: ${doctorJson.reportPath}`)
  }

  process.exit(1)
}

console.log(
  '[typical-page-doctor-gate] hiui-design doctor gate passed with a warning-free PASS result.'
)
if (doctorJson.reportPath) {
  console.log(`[typical-page-doctor-gate] Report: ${doctorJson.reportPath}`)
}
