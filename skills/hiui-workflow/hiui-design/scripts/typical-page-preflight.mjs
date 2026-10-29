#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { inspectIntegrationReadiness } from './lib/integration-readiness.mjs'
import { formatInstallModeUsage } from './lib/mode-contract.mjs'
import {
  buildEnsureCommand,
  syncPageTaskStatusFromPreflight,
} from './lib/page-task-gate.mjs'
import { writePageTypeCapabilityArtifacts } from './lib/page-type-capability-report.mjs'
import { PAGE_TASK_READINESS } from './lib/page-task-status.mjs'
import { ensureProjectNodeRuntime } from './lib/project-node-launcher.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-preflight.mjs" [--target <project-root>] [--mode <${formatInstallModeUsage()}>] [--json]
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    mode: 'auto',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      continue
    }

    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --target')
      options.target = value
      index += 1
      continue
    }

    if (arg === '--mode') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --mode')
      options.mode = value
      index += 1
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeStringArray(value) {
  return Array.isArray(value) ? value.map((item) => normalizeString(item)).filter(Boolean) : []
}

function buildRuntimeExecutionHints(aiGenerationReadyContext = {}) {
  const rawExecutionReadiness =
    aiGenerationReadyContext?.executionReadiness &&
    typeof aiGenerationReadyContext.executionReadiness === 'object'
      ? aiGenerationReadyContext.executionReadiness
      : {}
  const runtimeStatus = normalizeString(rawExecutionReadiness.status) || 'ready'
  const environmentReady = runtimeStatus === 'ready'

  return {
    status: runtimeStatus,
    environmentReady,
    blockedBy: environmentReady ? [] : normalizeStringArray(rawExecutionReadiness.blockedBy),
    reason: environmentReady ? '' : normalizeString(rawExecutionReadiness.reason),
    nextCommand: environmentReady ? '' : normalizeString(rawExecutionReadiness.nextCommand),
    projectReadyToExecute: aiGenerationReadyContext.readyToExecute === true,
    projectExecutionStatus: normalizeString(aiGenerationReadyContext.executionStatus),
    projectExecutionBlockedBy: normalizeStringArray(aiGenerationReadyContext.executionBlockedBy),
    projectExecutionReason: normalizeString(aiGenerationReadyContext.executionReason),
  }
}

function buildPreflightActionHints({ pageTaskGate = {}, legacyReactCompatibilityClosure = {} } = {}) {
  const nextCommand = normalizeString(pageTaskGate.nextCommand)
  const requiredManualActions =
    normalizeStringArray(pageTaskGate.requiredManualActions).length > 0
      ? normalizeStringArray(pageTaskGate.requiredManualActions)
      : legacyReactCompatibilityClosure?.status === 'needs-closure' &&
          legacyReactCompatibilityClosure.autofixAvailable !== true
        ? normalizeStringArray(legacyReactCompatibilityClosure.recommendedSteps)
        : []
  const recommendedSteps =
    normalizeStringArray(pageTaskGate.recommendedSteps).length > 0
      ? normalizeStringArray(pageTaskGate.recommendedSteps)
      : requiredManualActions

  return {
    nextCommand,
    requiredManualActions,
    recommendedSteps,
  }
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
    const readiness = await inspectIntegrationReadiness(targetRoot)

    if (!readiness.ready) {
      const nextCommand = await buildEnsureCommand({
        targetRoot,
        skillRoot,
        integrationReadiness: readiness,
      })
      const payload = {
        schema: 'hiui-design-typical-page-preflight.v1',
        status: 'blocked',
        completionStandard: PAGE_TASK_READINESS.READY_TO_GENERATE,
        userVisibleState: 'materialized-only',
        integrationComplete: false,
        reason: readiness.reason,
        targetRoot,
        integrationReadiness: readiness,
        nextCommand,
        requiredManualActions: [],
        recommendedSteps: [],
      }

      if (options.json) {
        console.log(JSON.stringify(payload, null, 2))
      } else {
        console.log(`typical-page preflight blocked: ${payload.reason}`)
        console.log(`nextCommand: ${payload.nextCommand}`)
      }
      return
    }

    const result = await syncPageTaskStatusFromPreflight({
      targetRoot,
      updatedBy: 'scripts/typical-page-preflight.mjs',
      mode: options.mode,
    })
    const capabilityArtifacts = await writePageTypeCapabilityArtifacts({
      skillRoot,
      targetRoot,
      generationReadiness: result.generationReadiness,
      pageTaskStatus: result.pageTaskStatus,
    })
    const publicViewport =
      capabilityArtifacts.aiGenerationReadyContext.publicViewport ||
      capabilityArtifacts.aiGenerationReadyContext.publicShell ||
      result.generationReadiness?.hostCompatibility?.publicShell ||
      result.integrationReadiness?.hostCompatibility?.publicShell ||
      {}
    const publicShell =
      capabilityArtifacts.aiGenerationReadyContext.publicShell ||
      result.generationReadiness?.hostCompatibility?.publicShell ||
      result.integrationReadiness?.hostCompatibility?.publicShell ||
      {}
    const formalHostCompatibility =
      capabilityArtifacts.aiGenerationReadyContext.formalHostCompatibility ||
      {}
    const runtimeExecutionHints = buildRuntimeExecutionHints(
      capabilityArtifacts.aiGenerationReadyContext
    )
    const legacyReactCompatibilityClosure =
      result.generationReadiness?.legacyReactCompatibilityClosure || {}
    const pageTaskGate = result.pageTaskStatus || {}
    const actionHints = buildPreflightActionHints({
      pageTaskGate,
      legacyReactCompatibilityClosure,
    })
    const reason =
      normalizeString(pageTaskGate.reason) ||
      normalizeString(result.generationReadiness?.reason) ||
      normalizeString(result.integrationReadiness?.reason)

    const payload = {
      schema: 'hiui-design-typical-page-preflight.v1',
      completionStandard: PAGE_TASK_READINESS.READY_TO_GENERATE,
      status:
        result.pageTaskStatus?.pageTaskReadiness === PAGE_TASK_READINESS.READY_TO_GENERATE
          ? 'pass'
          : 'blocked',
      userVisibleState: result.pageTaskStatus?.userVisibleState || 'materialized-only',
      integrationComplete: Boolean(result.pageTaskStatus?.integrationComplete),
      targetRoot,
      integrationReadiness: result.integrationReadiness,
      reason,
      nextCommand: actionHints.nextCommand,
      requiredManualActions: actionHints.requiredManualActions,
      recommendedSteps: actionHints.recommendedSteps,
      hostCompatibility: result.integrationReadiness?.hostCompatibility || {},
      publicViewport,
      publicShell,
      formalShell: capabilityArtifacts.aiGenerationReadyContext.formalShell || {},
      formalHostCompatibility,
      generationReadiness: result.generationReadiness || {},
      legacyReactCompatibilityClosure,
      pageTypeCapabilityReport: {
        path: capabilityArtifacts.capabilityReportPath,
        summary: capabilityArtifacts.capabilityReport.summary,
      },
      projectStateSummary: {
        path: capabilityArtifacts.projectStateSummaryPath,
        lifecycleProfile: capabilityArtifacts.projectStateSummary.lifecycleProfile,
        projectState: capabilityArtifacts.projectStateSummary.projectState,
      },
      aiGenerationReadyContext: {
        path: capabilityArtifacts.aiGenerationReadyContextPath,
        readyToGenerate: capabilityArtifacts.aiGenerationReadyContext.readyToGenerate,
        readyToExecute: capabilityArtifacts.aiGenerationReadyContext.readyToExecute,
        executionStatus: capabilityArtifacts.aiGenerationReadyContext.executionStatus,
        executionBlockedBy: capabilityArtifacts.aiGenerationReadyContext.executionBlockedBy,
        executionReason: capabilityArtifacts.aiGenerationReadyContext.executionReason,
        lifecycleProfile: capabilityArtifacts.aiGenerationReadyContext.lifecycleProfile,
        requestedPageTypeBindingStatus:
          capabilityArtifacts.aiGenerationReadyContext.requestedPageTypeBindingStatus,
        writeReadiness: capabilityArtifacts.aiGenerationReadyContext.writeReadiness,
        allowedPageTypeIds: capabilityArtifacts.aiGenerationReadyContext.allowedPageTypes.map((item) => item.id),
        conditionalPageTypeIds:
          capabilityArtifacts.aiGenerationReadyContext.conditionalPageTypes.map((item) => item.id),
        blockedPageTypeIds: capabilityArtifacts.aiGenerationReadyContext.blockedPageTypes.map((item) => item.id),
      },
      runtimeExecutionHints,
      pageTaskGate,
    }

    if (options.json) {
      console.log(JSON.stringify(payload, null, 2))
    } else {
      console.log(`typical-page preflight ${payload.status}`)
      console.log(`reason: ${payload.reason || '—'}`)
      if (payload.nextCommand) {
        console.log(`nextCommand: ${payload.nextCommand}`)
      }
      for (const action of payload.requiredManualActions) {
        console.log(`requiredManualAction: ${action}`)
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`typical-page-preflight failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

await main()
