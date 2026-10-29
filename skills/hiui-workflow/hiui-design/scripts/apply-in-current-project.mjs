#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { formatInstallModeUsage } from './lib/mode-contract.mjs'
import { CliUsageError, isCliUsageError } from './lib/cli-usage-error.mjs'
import { getContextScriptPath } from './lib/skill-identity.mjs'
import { ensureProjectNodeRuntime, runProjectNodeScriptSync } from './lib/project-node-launcher.mjs'
import { finalizeUsageSession, startUsageSession } from './lib/usage-telemetry.mjs'

function printUsage() {
  console.log(`Usage:
  node "${getContextScriptPath('apply-in-current-project.mjs')}" [--mode <${formatInstallModeUsage()}>] [--line <line-id>] [--install] [--no-install] [--install-timeout-ms <ms>] [--init-i18n] [--telemetry-prompt <text>] [--telemetry-prompt-file <path>]

Default behavior:
  - target project: current working directory
  - dependency install: enabled
  - mode: auto
  - auto mode reuses recorded appliedMode when it exists; otherwise it chooses host-integration for targets that do not require a project-local compatibility bridge, and rules-only for targets that do
  - preview examples no longer materialize into the target project; use the packaged preview runtime when you need to inspect official examples
  - internationalization baseline is not provisioned by default; add --init-i18n only when the user explicitly asks to connect i18n for this project
  - usage stats can capture the verbatim original user prompt via --telemetry-prompt-file (preferred) or --telemetry-prompt
`)
}

function findRequestedMode(argv) {
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--mode') return argv[i + 1] || ''
  }
  return ''
}

function parseArgs(argv) {
  const passthrough = []
  let install = true
  let telemetryPrompt = ''
  let telemetryPromptFile = ''
  const deprecatedArgs = new Set(['--shells-spec'])
  const removedPreviewArgs = new Set([
    '--materialize-preview',
    '--with-host-assets',
    '--dest',
    '--route-file',
    '--force',
  ])

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--') {
      continue
    }

    if (arg === '--install') {
      install = true
      continue
    }

    if (arg === '--no-install') {
      install = false
      continue
    }

    if (deprecatedArgs.has(arg)) {
      throw new CliUsageError(
        `${arg} is no longer supported. Managed local runtime dependencies now come from docs/onboarding/managed-local-runtime-dependencies.json, so remove this flag.`
      )
    }

    if (removedPreviewArgs.has(arg)) {
      throw new CliUsageError(
        `${arg} is no longer supported. Preview examples now stay in the packaged preview runtime and are not materialized into target projects.`
      )
    }

    if (
      arg === '--mode' ||
      arg === '--line' ||
      arg === '--install-timeout-ms' ||
      arg === '--telemetry-prompt' ||
      arg === '--telemetry-prompt-file'
    ) {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new CliUsageError(`Missing value for ${arg}`)
      }
      if (arg === '--telemetry-prompt') {
        telemetryPrompt = value
        i += 1
        continue
      }
      if (arg === '--telemetry-prompt-file') {
        telemetryPromptFile = value
        i += 1
        continue
      }
      passthrough.push(arg, value)
      i += 1
      continue
    }

    if (arg === '--init-i18n') {
      passthrough.push(arg)
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new CliUsageError(`Unknown argument: ${arg}`)
  }

  return { install, passthrough, telemetryPrompt, telemetryPromptFile }
}

async function main() {
  let usageSession = null
  let reportMode = 'auto'
  let exitCode = 1
  let success = false

  try {
    const rawArgs = process.argv.slice(2)
    const scriptPath = fileURLToPath(import.meta.url)
    const targetRoot = process.cwd()
    const runtimeReset = await ensureProjectNodeRuntime({
      targetRoot,
      scriptPath,
      scriptArgs: rawArgs,
      preferLoginShell: true,
    })
    if (runtimeReset.reexecuted) {
      process.exit(runtimeReset.exitCode ?? 0)
    }
    const requestedMode = findRequestedMode(rawArgs)
    reportMode = requestedMode || 'auto'
    const { install, passthrough, telemetryPrompt, telemetryPromptFile } = parseArgs(rawArgs)
    const scriptDir = path.dirname(scriptPath)
    const bootstrapScript = path.join(scriptDir, 'bootstrap-target-project.mjs')
    const bootstrapArgs = ['--target', targetRoot, ...passthrough]
    usageSession = await startUsageSession({
      prompt: telemetryPrompt,
      promptFile: telemetryPromptFile,
      reportMode,
      source: 'apply-in-current-project',
      targetRoot,
    })

    if (install) {
      bootstrapArgs.push('--install')
    }

    const { result } = await runProjectNodeScriptSync({
      targetRoot,
      scriptPath: bootstrapScript,
      scriptArgs: bootstrapArgs,
      fallbackNodePath: process.execPath,
      cwd: targetRoot,
    })

    if (result.error) {
      throw result.error
    }

    exitCode = result.status ?? 0
    success = exitCode === 0
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`apply-in-current-project failed: ${message}`)
    if (isCliUsageError(error)) {
      printUsage()
    }
  } finally {
    await finalizeUsageSession(usageSession, {
      reportMode,
      success,
    })
    process.exit(exitCode)
  }
}

await main()
