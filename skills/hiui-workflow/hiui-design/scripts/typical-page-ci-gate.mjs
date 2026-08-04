#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { validateLegacyAcceptanceCiGate } from './lib/legacy-ci-acceptance-gate.mjs'

const PROJECT_INTEGRATION_STATE_RELATIVE_PATH =
  '.local-context/hiui-design/outputs/project-integration-state.json'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-ci-gate.mjs" [existing gate args] [--target <project-root>] [--legacy-acceptance <legacy-acceptance-result.json>] [--legacy-acceptance-profile <preview|delivery>]

Legacy acceptance:
  - legacy-host-compatible targets must pass --legacy-acceptance after typical-page:legacy:accept
  - when --legacy-acceptance is provided, CI validates schemaVersion=legacy-acceptance-result.v1 and ready status before passing common args to standard gates
  - --legacy-acceptance-profile delivery requires status=delivery-ready; preview allows preview-ready, delivery-ready, or legacy accepted
  - --legacy-acceptance and --legacy-acceptance-profile are consumed by ci-gate and are not forwarded to older gate scripts
	`)
}

function parseCiArgs(argv) {
  const options = {
    target: process.cwd(),
    legacyAcceptance: '',
    legacyAcceptanceProfile: '',
    forwardedArgs: [],
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }
    if (arg === '--legacy-acceptance') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --legacy-acceptance')
      options.legacyAcceptance = value
      index += 1
      continue
    }
    if (arg === '--legacy-acceptance-profile') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --legacy-acceptance-profile')
      options.legacyAcceptanceProfile = value
      index += 1
      continue
    }
    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --target')
      options.target = path.resolve(value)
      options.forwardedArgs.push(arg, value)
      index += 1
      continue
    }
    options.forwardedArgs.push(arg)
  }

  return options
}

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

function readJsonIfExists(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

function validateOnboardingCompletionCiGate(targetRoot) {
  if (process.env.HIUI_DESIGN_SKIP_ONBOARDING_COMPLETION_GATE === '1') {
    return { status: 'skipped' }
  }

  const statePath = path.join(targetRoot, PROJECT_INTEGRATION_STATE_RELATIVE_PATH)
  const state = readJsonIfExists(statePath)
  if (!state) {
    throw new Error(
      `project onboarding completion state is required before CI gates run. Missing ${PROJECT_INTEGRATION_STATE_RELATIVE_PATH}`
    )
  }

  if (state.onboardingCompletionReady !== true) {
    const gates = state.completionGates || {}
    throw new Error(
      [
        'project onboarding completion state is not ready before CI gates run.',
        `onboardingCompletionReady=${String(state.onboardingCompletionReady)}`,
        `doctorPassed=${gates.doctorPassed || 'unknown'}`,
        `engineeringPassed=${gates.engineeringPassed || 'unknown'}`,
      ].join(' ')
    )
  }

  return { status: 'passed' }
}

const currentFilePath = fileURLToPath(import.meta.url)
const scriptDir = path.dirname(currentFilePath)

try {
  const options = parseCiArgs(process.argv.slice(2))
  validateLegacyAcceptanceCiGate({
    targetRoot: options.target,
    legacyAcceptancePath: options.legacyAcceptance,
    acceptanceProfile: options.legacyAcceptanceProfile,
    optional: process.env.HIUI_LEGACY_ACCEPTANCE_OPTIONAL === '1',
  })
  validateOnboardingCompletionCiGate(options.target)
  runNodeScript(path.join(scriptDir, 'typical-page-candidate-gate.mjs'), options.forwardedArgs)
  runNodeScript(path.join(scriptDir, 'typical-page-contract-gate.mjs'), options.forwardedArgs)
  runNodeScript(path.join(scriptDir, 'typical-page-archetype-gate.mjs'), options.forwardedArgs)
  runNodeScript(path.join(scriptDir, 'typical-page-source-gate.mjs'), options.forwardedArgs)
  runNodeScript(path.join(scriptDir, 'typical-page-doctor-gate.mjs'), options.forwardedArgs)
} catch (error) {
  console.error(`[typical-page-ci-gate] ${error.message}`)
  process.exit(1)
}
