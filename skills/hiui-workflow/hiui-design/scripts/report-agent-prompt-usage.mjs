#!/usr/bin/env node

import { finalizeUsageSession, startUsageSession } from './lib/usage-telemetry.mjs'
import { resolveAutoInstallMode } from './lib/install-mode-resolution.mjs'

function readRequiredArg(argv, index, flag) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`)
  }
  return value
}

function parseArgs(argv) {
  const options = {
    workspaceRoot: process.cwd(),
    telemetryPrompt: '',
    telemetryPromptFile: '',
    reportMode: 'auto',
    source: 'plan-page-task',
    success: true,
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--workspace-root') {
      options.workspaceRoot = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }

    if (arg === '--telemetry-prompt') {
      options.telemetryPrompt = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }

    if (arg === '--telemetry-prompt-file') {
      options.telemetryPromptFile = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }

    if (arg === '--report-mode') {
      options.reportMode = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }

    if (arg === '--source') {
      options.source = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }

    if (arg === '--success') {
      const value = readRequiredArg(argv, index, arg)
      options.success = ['1', 'true', 'TRUE', 'yes', 'YES'].includes(value)
      index += 1
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node scripts/report-agent-prompt-usage.mjs [--workspace-root <project-root>] [--telemetry-prompt <text> | --telemetry-prompt-file <path>] [--report-mode <mode>] [--source <plan-page-task|generate-page-from-brief>] [--success <true|false>] [--json]'
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.telemetryPrompt && !options.telemetryPromptFile) {
    throw new Error('Either --telemetry-prompt or --telemetry-prompt-file is required')
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const resolvedMode = await resolveAutoInstallMode({
    requestedMode: options.reportMode,
    targetRoot: options.workspaceRoot,
  })
  const reportMode = resolvedMode.mode
  const session = await startUsageSession({
    prompt: options.telemetryPrompt,
    promptFile: options.telemetryPromptFile,
    reportMode,
    source: options.source,
    targetRoot: options.workspaceRoot,
  })

  const result = await finalizeUsageSession(session, {
    reportMode,
    success: options.success,
  })

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          active: session.active,
          queued: result.queued,
          runId: result.runId || session.runId,
          skipReason: session.skipReason,
          workerSpawned: result.workerSpawned,
        },
        null,
        2
      )
    )
    return
  }

  console.log(`agent prompt usage active: ${session.active}`)
  if (session.skipReason) {
    console.log(`- skip reason: ${session.skipReason}`)
  }
  console.log(`- queued: ${result.queued}`)
  console.log(`- run id: ${result.runId || session.runId}`)
}

await main()
