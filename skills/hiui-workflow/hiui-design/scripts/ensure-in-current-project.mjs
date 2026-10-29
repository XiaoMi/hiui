#!/usr/bin/env node

import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { inspectIntegrationReadiness, isIntegrationReady } from './lib/integration-readiness.mjs'
import { writeEnsureOnlyPageTaskStatus } from './lib/page-task-gate.mjs'
import { ensureProjectNodeRuntime } from './lib/project-node-launcher.mjs'
import { runProjectNodeScriptSync } from './lib/project-node-launcher.mjs'
import { syncProjectContext } from './lib/project-context-sync.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/ensure-in-current-project.mjs" [--target <project-root>] [--force-context-sync] [--mode <auto|rules-only|host-integration>] [--line <line-id>] [--install] [--no-install] [--install-timeout-ms <ms>] [--init-i18n]

Default behavior:
  - target project: current working directory
  - if project context and apply-state are already ready, exit immediately without patching files unless --force-context-sync is provided
  - if project context is missing, sync the local hiui-design context into the target project first
  - if apply-state is missing or invalid, run apply-in-current-project in the target project
  - do not provision the project-local i18n baseline by default; pass --init-i18n only when the target project explicitly asks for the local bridge
  - use --force-context-sync when you explicitly want to refresh project-local hiui-design context files from the current skill copy, even if the project is already ready
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    forceContextSync: false,
    applyArgs: [],
  }
  const deprecatedArgs = new Set(['--shells-spec'])
  const removedPreviewArgs = new Set([
    '--materialize-preview',
    '--with-host-assets',
    '--dest',
    '--route-file',
    '--force',
  ])

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      continue
    }

    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --target')
      }
      options.target = value
      index += 1
      continue
    }

    if (arg === '--force-context-sync') {
      options.forceContextSync = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    if (deprecatedArgs.has(arg)) {
      throw new Error(
        `${arg} is no longer supported. Managed local runtime dependencies now come from docs/onboarding/managed-local-runtime-dependencies.json, so remove this flag.`
      )
    }

    if (removedPreviewArgs.has(arg)) {
      throw new Error(
        `${arg} is no longer supported. Preview examples now stay in the packaged preview runtime and are not materialized into target projects.`
      )
    }

    options.applyArgs.push(arg)
    const expectsValue = new Set([
      '--mode',
      '--line',
      '--install-timeout-ms',
    ])
    if (expectsValue.has(arg)) {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      options.applyArgs.push(value)
      index += 1
    }
  }

  return options
}

async function runNodeScript(targetRoot, scriptPath, args, { cwd, capture = false, allowFailure = false } = {}) {
  const { result } = await runProjectNodeScriptSync({
    targetRoot,
    scriptPath,
    scriptArgs: args,
    cwd,
    capture,
  })

  if (result.error) {
    if (allowFailure) return result
    throw result.error
  }

  if ((result.status ?? 1) !== 0 && !allowFailure) {
    throw new Error(result.stderr?.trim() || result.stdout?.trim() || `${scriptPath} failed`)
  }

  return result
}

function formatWarnings(warnings) {
  return warnings.length > 0 ? ` Warnings: ${warnings.join(', ')}` : ''
}

function ensureNoInstallApplyArgs(applyArgs = []) {
  const hasInstallDirective = applyArgs.includes('--install') || applyArgs.includes('--no-install')
  return hasInstallDirective ? [...applyArgs] : [...applyArgs, '--no-install']
}

async function syncContextIntoProject({ skillRoot, targetRoot, forceContextSync }) {
  const syncResult = await syncProjectContext({
    skillRoot,
    targetRoot,
    force: forceContextSync,
  })

  if (syncResult.status === 'completed-with-conflicts') {
    throw new Error(
      `Project context sync encountered conflicts under ${syncResult.targetContextRoot}. Review ${syncResult.syncManifestPath} and rerun with --force-context-sync only if overwriting those files is safe.`
    )
  }

  return syncResult
}

async function refreshPageTaskGate(targetRoot, readiness) {
  await writeEnsureOnlyPageTaskStatus({
    targetRoot,
    integrationReadiness: readiness,
    updatedBy: 'scripts/ensure-in-current-project.mjs',
    reason:
      'typical-page ensure completed. Do not start a hiui-design page task until typical-page:preflight passes again.',
    mode: readiness.appliedMode,
    doctor: {
      lastStatus: 'not-run',
    },
  })
}

async function main() {
  try {
    const rawArgs = process.argv.slice(2)
    const options = parseArgs(rawArgs)
    const targetRoot = path.resolve(options.target)
    const scriptPath = fileURLToPath(import.meta.url)
    const runtimeReset = await ensureProjectNodeRuntime({
      targetRoot,
      scriptPath,
      scriptArgs: rawArgs,
      preferLoginShell: true,
    })
    if (runtimeReset.reexecuted) {
      process.exit(runtimeReset.exitCode ?? 0)
    }
    const scriptDir = path.dirname(scriptPath)
    const skillRoot = path.resolve(scriptDir, '..')
    const applyScript = path.join(skillRoot, 'scripts', 'apply-in-current-project.mjs')

    let readiness = await inspectIntegrationReadiness(targetRoot)
    if (isIntegrationReady(readiness)) {
      if (options.forceContextSync) {
        console.log(`Project integration is already ready. Refreshing hiui-design context in ${targetRoot}...`)
        const syncResult = await syncContextIntoProject({
          skillRoot,
          targetRoot,
          forceContextSync: true,
        })
        console.log(
          `Project context sync status: ${syncResult.status}. Created ${syncResult.summary.created}, refreshed ${syncResult.summary.refreshed}, overwritten ${syncResult.summary.overwritten}, up-to-date ${syncResult.summary['up-to-date']}.`
        )
        console.log('Re-applying managed host/runtime baseline after context refresh...')
        await runNodeScript(targetRoot, applyScript, ensureNoInstallApplyArgs(options.applyArgs), { cwd: targetRoot })
        readiness = await inspectIntegrationReadiness(targetRoot)
      }
      await refreshPageTaskGate(targetRoot, readiness)
      console.log(
        `Project integration already ready at ${readiness.contextRoot}.${formatWarnings(readiness.compatibilityWarnings)} Run typical-page:preflight before page generation.`
      )
      return
    }

    if (readiness.status === 'missing-context') {
      console.log(`Project context is missing. Syncing hiui-design context into ${targetRoot}...`)
      const syncResult = await syncContextIntoProject({
        skillRoot,
        targetRoot,
        forceContextSync: options.forceContextSync,
      })

      console.log(
        `Project context sync status: ${syncResult.status}. Created ${syncResult.summary.created}, refreshed ${syncResult.summary.refreshed}, overwritten ${syncResult.summary.overwritten}, up-to-date ${syncResult.summary['up-to-date']}.`
      )
      readiness = await inspectIntegrationReadiness(targetRoot)
    }

    if (isIntegrationReady(readiness)) {
      await refreshPageTaskGate(targetRoot, readiness)
      console.log(`Project integration ready after context sync at ${readiness.contextRoot}.${formatWarnings(readiness.compatibilityWarnings)} Run typical-page:preflight before page generation.`)
      return
    }

    if (!['missing-apply-state', 'invalid-apply-state', 'invalid-applied-mode'].includes(readiness.status)) {
      throw new Error(`Project integration is not ready: ${readiness.reason}`)
    }

    console.log(`Project context is present but apply-state is not ready (${readiness.status}). Running apply-in-current-project...`)
    await runNodeScript(targetRoot, applyScript, options.applyArgs, { cwd: targetRoot })

    readiness = await inspectIntegrationReadiness(targetRoot)
    if (!isIntegrationReady(readiness)) {
      throw new Error(`Project integration still not ready after apply: ${readiness.reason}`)
    }

    await refreshPageTaskGate(targetRoot, readiness)
    console.log(`Project integration ensured at ${readiness.contextRoot} with mode ${readiness.appliedMode}.${formatWarnings(readiness.compatibilityWarnings)} Run typical-page:preflight before page generation.`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`ensure-in-current-project failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

await main()
