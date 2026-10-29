#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildGenerationBriefResult } from './generation-brief.mjs'
import {
  findPrimaryGeneratedPageFile,
  runGeneratePageFromBrief,
} from './generate-page-from-brief.mjs'
import { formatInstallModeUsage } from './lib/mode-contract.mjs'
import {
  DEFAULT_PROJECT_CHECK_PROFILE,
  resolveManagedProjectCheckPlan,
  runManagedProjectCheck,
} from './lib/non-typical-project-check.mjs'
import {
  buildPageGenerationSessionRef,
  recordPageGenerationSessionStage,
} from './lib/page-generation-session-trace.mjs'
import { autofixManagedMfHostContract } from './lib/managed-mf-host-contract-autofix.mjs'
import {
  ensureProjectNodeRuntime,
  runProjectNodeScriptSync,
} from './lib/project-node-launcher.mjs'
import { syncPageTaskStatusFromPreflight } from './lib/page-task-gate.mjs'
import { writePageTypeCapabilityArtifacts } from './lib/page-type-capability-report.mjs'
import {
  DEFAULT_GENERATION_BRIEF_FILENAME,
  writeGenerationBriefFile,
} from './lib/brief-file.mjs'
import { getContextScriptPath } from './lib/skill-identity.mjs'
import { finalizeUsageSession, startUsageSession } from './lib/usage-telemetry.mjs'

function readRequiredArg(argv, index, name) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`)
  return value
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeString(item)).filter(Boolean)
  }

  const normalized = normalizeString(value)
  return normalized ? [normalized] : []
}

function normalizeValidationProfile(value) {
  const normalized = normalizeString(value || 'light').toLowerCase()
  if (!['light', 'acceptance'].includes(normalized)) {
    throw new Error(
      `Unsupported --validation-profile value: ${normalized || '(empty)'}. Expected light or acceptance.`
    )
  }
  return normalized
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    pageType: '',
    pageFamily: '',
    mode: 'auto',
    inputMode: '',
    localizationMode: '',
    line: '',
    dest: '',
    relatedPagePath: '',
    title: '',
    routePath: '',
    exposeName: '',
    testBaseUrl: '',
    detailSectionsJson: '',
    feedbackVariantId: '',
    pageAdjustmentContract: '',
    confirmedGenerationInputJson: '',
    confirmedDesignRestoreInputJson: '',
    navigationMountContract: '',
    nonTypicalConversationOutputJson: '',
    legacyReconstructionInputJson: '',
    migrationInvariantContractJson: '',
    analyticsRefactorContractJson: '',
    sessionId: '',
    briefOutput: '',
    telemetryPrompt: '',
    telemetryPromptFile: '',
    validationProfile: 'light',
    projectCheckProfile: DEFAULT_PROJECT_CHECK_PROFILE,
    projectCheckCommand: '',
    force: false,
    dryRun: false,
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      continue
    }

    if (arg === '--target') {
      options.target = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--page-type') {
      options.pageType = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--page-family') {
      options.pageFamily = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--mode') {
      options.mode = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--input-mode') {
      options.inputMode = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--localization-mode') {
      options.localizationMode = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--line') {
      options.line = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--dest') {
      options.dest = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--related-page-path') {
      options.relatedPagePath = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--title') {
      options.title = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--route-path') {
      options.routePath = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--expose-name') {
      options.exposeName = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--test-base-url') {
      options.testBaseUrl = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--detail-sections-json') {
      options.detailSectionsJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--feedback-variant-id' || arg === '--variant-id') {
      options.feedbackVariantId = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--page-adjustment-contract') {
      options.pageAdjustmentContract = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--confirmed-generation-input-json') {
      options.confirmedGenerationInputJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--confirmed-design-restore-input-json') {
      options.confirmedDesignRestoreInputJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--navigation-mount-contract') {
      options.navigationMountContract = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--non-typical-conversation-output-json') {
      options.nonTypicalConversationOutputJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--legacy-reconstruction-input-json') {
      options.legacyReconstructionInputJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--migration-invariant-contract-json') {
      options.migrationInvariantContractJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--analytics-refactor-contract-json') {
      options.analyticsRefactorContractJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--session-id') {
      options.sessionId = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--brief-output') {
      options.briefOutput = readRequiredArg(argv, index, arg)
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
    if (arg === '--validation-profile') {
      options.validationProfile = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--project-check-profile') {
      options.projectCheckProfile = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--project-check-command') {
      options.projectCheckCommand = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--force') {
      options.force = true
      continue
    }
    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node ${getContextScriptPath('generate-page.mjs')} [--page-type <id>] --dest <dir> [--related-page-path <file>] [--title <title>] [--route-path <path>] [--expose-name <name>] [--test-base-url <url>] [--detail-sections-json <json-or-path>] [--input-mode <page-prompt|prototype-screenshot|figma-design-restore|legacy-system-reconstruction>] [--localization-mode <none|inherit-host|local-bridge>] [--feedback-variant-id <id>] [--page-adjustment-contract <json-or-path>] [--non-typical-conversation-output-json <json>] [--confirmed-generation-input-json <json-or-path>] [--confirmed-design-restore-input-json <json-or-path>] [--navigation-mount-contract <json-or-path>] [--legacy-reconstruction-input-json <json-or-path>] [--migration-invariant-contract-json <json-or-path>] [--analytics-refactor-contract-json <json-or-path>] [--mode <${formatInstallModeUsage()}>] [--session-id <id>] [--brief-output <file>] [--validation-profile <light|acceptance>] [--project-check-profile <auto|typecheck-only|none>] [--project-check-command <command>] [--force] [--dry-run] [--telemetry-prompt <text>] [--telemetry-prompt-file <path>] [--json]

generate-page.mjs is the official single-entry closure for standard typical pages. It internally runs generation-brief, writes a reusable brief JSON snapshot, executes generate-page-from-brief, and then runs typical-page-slot-gate unless --dry-run keeps the workflow read-only.

validation-profile defaults to light, which stops after slot-gate validation. Use validation-profile acceptance only when you want an extra project engineering check; then project-check-profile controls whether the acceptance layer runs auto, typecheck-only, or none, and project-check-command can override it with an explicit shell command.

For non-typical page-family workflows, continue using execute-non-typical-page-task.mjs. That family already has its own validated closure with dedicated light sanity.`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (options.pageType && options.pageFamily) {
    throw new Error('Use either --page-type or --page-family, not both')
  }

  return options
}

async function writeReadyBriefSnapshot({ briefOutput = '', targetRoot = '', sessionTracePath = '', payload }) {
  return writeGenerationBriefFile({
    briefFile:
      normalizeString(briefOutput) ||
      path.join(path.dirname(sessionTracePath || ''), DEFAULT_GENERATION_BRIEF_FILENAME),
    targetRoot,
    sessionTracePath,
    payload,
  })
}

async function runTypicalPageSlotGate({ targetRoot, skillRoot, brief, generation }) {
  const slotGateScriptPath = path.join(skillRoot, 'scripts', 'typical-page-slot-gate.mjs')
  const pageFile =
    findPrimaryGeneratedPageFile(generation?.files || [], brief) || {
      destPath: path.join(
        targetRoot,
        brief?.requestedBusiness?.targetBusinessPath || brief?.requestedBusiness?.dest || '',
        'index.tsx'
      ),
    }
  const args = [
    '--page-type',
    brief.pageType.id,
    '--page',
    pageFile.destPath,
    '--json',
  ]

  if (normalizeString(brief?.pageGenerationDecision?.copyMode)) {
    args.push('--copy-mode', brief.pageGenerationDecision.copyMode)
  }
  if (normalizeString(brief?.requestedBusiness?.defaultBusinessPageDir)) {
    args.push('--default-business-page-dir', brief.requestedBusiness.defaultBusinessPageDir)
  }

  const { result } = await runProjectNodeScriptSync({
    targetRoot,
    scriptPath: slotGateScriptPath,
    scriptArgs: args,
    cwd: targetRoot,
    capture: true,
    maxBuffer: 16 * 1024 * 1024,
  })
  const rawOutput = result.stdout || result.stderr || ''
  let payload = null

  if (result.stdout) {
    try {
      payload = JSON.parse(result.stdout)
    } catch {
      payload = null
    }
  }

  return {
    exitCode: result.status ?? 0,
    rawOutput,
    payload,
    pagePath: pageFile.destPath,
  }
}

function buildBlockedResult({
  targetRoot,
  briefFilePath = '',
  pageSelector = null,
  mode = '',
  validationProfile = 'light',
  executionStage = '',
  reason = '',
  blockedBy = '',
  writeReadiness = '',
  briefWriteReadiness = '',
  requiredManualActions = [],
  nextCommand = '',
  pageAdjustmentExecution = null,
  sessionTrace = null,
  brief = null,
  generation = null,
  lightValidation = null,
  acceptanceValidation = null,
}) {
  return {
    schema: 'hiui-design-generate-page.v1',
    status:
      executionStage === 'light-validation' || executionStage === 'acceptance-validation'
        ? 'blocked-after-write'
        : 'blocked-before-write',
    executionStage,
    targetRoot,
    mode,
    validationProfile,
    pageSelector,
    briefFilePath,
    blockedBy,
    writeReadiness,
    briefWriteReadiness,
    requiredManualActions: Array.isArray(requiredManualActions) ? requiredManualActions : [],
    nextCommand,
    pageAdjustmentExecution,
    sessionTrace,
    brief,
    generation,
    lightValidation,
    acceptanceValidation,
    reason,
  }
}

function buildBlockedResultFromPayload({
  targetRoot,
  briefFilePath = '',
  mode = '',
  validationProfile = 'light',
  executionStage = '',
  payload = null,
  briefPayload = null,
  generationPayload = null,
  sessionTrace = null,
  fallbackPageSelector = null,
  fallbackReason = '',
}) {
  return buildBlockedResult({
    targetRoot,
    briefFilePath,
    pageSelector: payload?.pageSelector || fallbackPageSelector,
    mode: payload?.mode || mode,
    validationProfile,
    executionStage,
    reason: payload?.reason || fallbackReason,
    blockedBy: payload?.blockedBy || '',
    writeReadiness: payload?.writeReadiness || '',
    briefWriteReadiness: payload?.briefWriteReadiness || '',
    requiredManualActions: payload?.requiredManualActions || [],
    nextCommand:
      payload?.nextCommand ||
      payload?.pageTaskGate?.nextCommand ||
      payload?.pageTypeCapability?.nextCommand ||
      '',
    pageAdjustmentExecution: payload?.pageAdjustmentExecution || null,
    sessionTrace: payload?.sessionTrace || sessionTrace || null,
    brief: briefPayload,
    generation: generationPayload,
    lightValidation: {
      kind: 'not-run',
      status: 'skipped',
    },
    acceptanceValidation: {
      kind: 'project-check',
      status: 'skipped',
      reason: 'generation never reached the acceptance validation layer.',
    },
  })
}

function renderResult(result) {
  const lines = [
    `status: ${result.status}`,
    `executionStage: ${result.executionStage}`,
    `targetRoot: ${result.targetRoot}`,
  ]

  if (result.pageSelector?.id) {
    lines.push(`pageSelector: ${result.pageSelector.kind}/${result.pageSelector.id}`)
  }
  if (result.briefFilePath) {
    lines.push(`briefFilePath: ${result.briefFilePath}`)
  }
  if (result.generation?.primaryPageLink) {
    lines.push(`primaryPageLink: ${result.generation.primaryPageLink}`)
  }
  if (result.lightValidation?.kind) {
    lines.push(`lightValidation: ${result.lightValidation.kind} (${result.lightValidation.status})`)
  }
  if (result.acceptanceValidation?.kind) {
    lines.push(
      `acceptanceValidation: ${result.acceptanceValidation.kind} (${result.acceptanceValidation.status})`
    )
  }
  if (result.reason) {
    lines.push(`reason: ${result.reason}`)
  }

  return `${lines.join('\n')}\n`
}

function resolveManagedMfAutofixRequest({ payload = null, brief = null, options = {} } = {}) {
  const preWriteAction =
    normalizeString(payload?.pageTypeCapability?.preWriteAction) ||
    normalizeString(payload?.executionPolicy?.requestedPageTypePreWriteAction) ||
    normalizeString(brief?.executionPolicy?.requestedPageTypePreWriteAction)
  const nextCommand =
    normalizeString(payload?.pageTypeCapability?.nextCommand) ||
    normalizeString(payload?.nextCommand) ||
    normalizeString(payload?.pageTaskGate?.nextCommand)
  const blockedBy = [
    ...normalizeStringArray(payload?.blockedBy),
    ...normalizeStringArray(payload?.pageTypeCapability?.blockedBy),
  ]

  if (preWriteAction !== 'materialize-managed-mf-host-contract') {
    return null
  }

  if (!nextCommand.includes('managed-mf-host-contract-autofix')) {
    return null
  }

  if (
    blockedBy.length > 0 &&
    !blockedBy.includes('requested-page-type-capability-blocked') &&
    !blockedBy.includes('generation-brief-blocked')
  ) {
    return null
  }

  const pageTypeId =
    normalizeString(options.pageType) ||
    normalizeString(brief?.pageType?.id) ||
    normalizeString(payload?.pageType?.id)
  const dest =
    normalizeString(options.dest) ||
    normalizeString(brief?.requestedBusiness?.targetBusinessPath) ||
    normalizeString(brief?.requestedBusiness?.dest)
  const title =
    normalizeString(options.title) ||
    normalizeString(brief?.requestedBusiness?.title)
  const routePath =
    normalizeString(options.routePath) ||
    normalizeString(brief?.requestedBusiness?.routePath)
  const mode =
    normalizeString(brief?.mode) ||
    normalizeString(payload?.mode) ||
    normalizeString(options.mode)

  if (!pageTypeId || !dest || !title) {
    return null
  }

  return {
    pageTypeId,
    dest,
    title,
    routePath,
    mode,
    blockedBy,
    reason:
      normalizeString(payload?.reason) ||
      normalizeString(payload?.pageTypeCapability?.reason) ||
      'managed-mf-host-contract-autofix is required before page generation can continue.',
    nextCommand,
  }
}

function resolveAutoPreflightRecoveryRequest({ payload = null, brief = null, options = {} } = {}) {
  const pageTaskGate = payload?.pageTaskGate || brief?.pageTaskGate || {}
  const nextRequiredAction =
    normalizeString(payload?.executionPolicy?.pageTaskGateNextRequiredAction) ||
    normalizeString(pageTaskGate?.nextRequiredAction)
  const canAutoRecover =
    payload?.executionPolicy?.pageTaskGateCanAutoRecover === true ||
    pageTaskGate?.canAutoRecover === true
  const nextCommand =
    normalizeString(payload?.nextCommand) ||
    normalizeString(payload?.pageTaskGate?.nextCommand) ||
    normalizeString(brief?.executionPolicy?.pageTaskGateNextCommand) ||
    normalizeString(brief?.pageTaskGate?.nextCommand)
  const mode =
    normalizeString(brief?.mode) ||
    normalizeString(payload?.mode) ||
    normalizeString(options.mode)

  if (!canAutoRecover || nextRequiredAction !== 'typical-page:preflight') {
    return null
  }

  return {
    mode,
    nextCommand,
    reason:
      normalizeString(payload?.reason) ||
      normalizeString(payload?.pageTaskGate?.gateStatusReason) ||
      normalizeString(payload?.pageTaskGate?.reason) ||
      normalizeString(brief?.executionPolicy?.pageTaskGateReason) ||
      'typical-page:preflight can reopen the page-task gate automatically.',
  }
}

async function attemptAutoPreflightRecovery({
  blockedPayload,
  briefResult,
  options,
  targetRoot,
  skillRoot,
  scriptStartedAtMs,
}) {
  if (options.dryRun) {
    return null
  }

  const recoveryRequest = resolveAutoPreflightRecoveryRequest({
    payload: blockedPayload,
    brief: briefResult?.brief,
    options,
  })
  if (!recoveryRequest) {
    return null
  }

  const recoveryStartedAtMs = Date.now()
  const preflight = await syncPageTaskStatusFromPreflight({
    targetRoot,
    updatedBy: 'scripts/generate-page.mjs',
    mode: recoveryRequest.mode || 'auto',
  })
  await writePageTypeCapabilityArtifacts({
    skillRoot,
    targetRoot,
    generationReadiness: preflight.generationReadiness,
    pageTaskStatus: preflight.pageTaskStatus,
  })
  const refreshedBriefResult = await buildGenerationBriefResult(
    {
      ...options,
      sessionId: briefResult?.sessionTraceContext?.sessionId || options.sessionId,
    },
    {
      targetRoot,
      skillRoot,
      scriptStartedAtMs,
    }
  )
  const finalBlockedPayload = refreshedBriefResult?.blockedBrief ? refreshedBriefResult.payload : null

  await recordPageGenerationSessionStage({
    sessionContext: refreshedBriefResult?.sessionTraceContext || briefResult?.sessionTraceContext,
    brief: refreshedBriefResult?.brief || briefResult?.brief || null,
    options,
    source: 'generate-page',
    stage: 'singleEntryAutoPreflightRecovery',
    status: finalBlockedPayload ? 'blocked' : 'success',
    startedAtMs: recoveryStartedAtMs,
    finishedAtMs: Date.now(),
    details: {
      stageId: 'single-entry-auto-preflight-recovery',
      blockedBy: finalBlockedPayload?.blockedBy || [],
      blockingReason: finalBlockedPayload?.reason || '',
      nextCommand:
        finalBlockedPayload?.nextCommand ||
        refreshedBriefResult?.payload?.pageTaskGate?.nextCommand ||
        recoveryRequest.nextCommand ||
        '',
      requestedNextAction: 'typical-page:preflight',
      recoveryReason: recoveryRequest.reason,
      preflightTransition: preflight?.transition || '',
      preflightReadiness: preflight?.pageTaskStatus?.pageTaskReadiness || '',
    },
    resultPayload:
      refreshedBriefResult?.payload && typeof refreshedBriefResult.payload === 'object'
        ? refreshedBriefResult.payload
        : preflight,
  })

  return {
    recoveryRequest,
    preflight,
    briefResult: refreshedBriefResult,
  }
}

async function attemptManagedMfAutofixRecovery({
  blockedPayload,
  briefResult,
  options,
  targetRoot,
  skillRoot,
  scriptStartedAtMs,
}) {
  if (options.dryRun) {
    return null
  }

  const recoveryRequest = resolveManagedMfAutofixRequest({
    payload: blockedPayload,
    brief: briefResult?.brief,
    options,
  })
  if (!recoveryRequest) {
    return null
  }

  const recoveryStartedAtMs = Date.now()
  const autofix = await autofixManagedMfHostContract({
    targetRoot,
    skillRoot,
    pageTypeId: recoveryRequest.pageTypeId,
    dest: recoveryRequest.dest,
    title: recoveryRequest.title,
    routePath: recoveryRequest.routePath,
    mode: recoveryRequest.mode || 'auto',
    line: options.line,
    updatedBy: 'scripts/generate-page.mjs',
  })

  let preflight = null
  let refreshedBriefResult = briefResult

  if (autofix.status !== 'blocked') {
    preflight = await syncPageTaskStatusFromPreflight({
      targetRoot,
      updatedBy: 'scripts/generate-page.mjs',
      mode: recoveryRequest.mode || 'auto',
    })
    await writePageTypeCapabilityArtifacts({
      skillRoot,
      targetRoot,
      generationReadiness: preflight.generationReadiness,
      pageTaskStatus: preflight.pageTaskStatus,
    })
    refreshedBriefResult = await buildGenerationBriefResult(
      {
        ...options,
        sessionId: briefResult?.sessionTraceContext?.sessionId || options.sessionId,
      },
      {
        targetRoot,
        skillRoot,
        scriptStartedAtMs,
      }
    )
  }

  const finalBlockedPayload =
    autofix.status === 'blocked'
      ? {
          blockedBy: 'managed-mf-host-contract-autofix-blocked',
          reason: autofix.reason,
          nextCommand: autofix.nextCommand,
        }
      : refreshedBriefResult?.blockedBrief
        ? refreshedBriefResult.payload
        : null

  await recordPageGenerationSessionStage({
    sessionContext: refreshedBriefResult?.sessionTraceContext || briefResult?.sessionTraceContext,
    brief: refreshedBriefResult?.brief || briefResult?.brief || null,
    options,
    source: 'generate-page',
    stage: 'singleEntryManagedMfRecovery',
    status: finalBlockedPayload ? 'blocked' : 'success',
    startedAtMs: recoveryStartedAtMs,
    finishedAtMs: Date.now(),
    details: {
      stageId: 'single-entry-managed-mf-recovery',
      blockedBy: finalBlockedPayload?.blockedBy || [],
      blockingReason: finalBlockedPayload?.reason || '',
      nextCommand:
        finalBlockedPayload?.nextCommand ||
        refreshedBriefResult?.payload?.pageTypeCapability?.nextCommand ||
        refreshedBriefResult?.payload?.pageTaskGate?.nextCommand ||
        autofix.nextCommand ||
        '',
      autofixStatus: autofix.status,
      autofixReason: autofix.reason,
      preflightTransition: preflight?.transition || '',
      preflightReadiness: preflight?.pageTaskStatus?.pageTaskReadiness || '',
      writtenFiles: autofix.writtenFiles || [],
    },
    resultPayload:
      refreshedBriefResult?.payload && typeof refreshedBriefResult.payload === 'object'
        ? refreshedBriefResult.payload
        : autofix,
  })

  return {
    recoveryRequest,
    autofix,
    preflight,
    briefResult: refreshedBriefResult,
  }
}

async function runAcceptanceValidation({
  targetRoot,
  projectCheckProfile = DEFAULT_PROJECT_CHECK_PROFILE,
  projectCheckCommand = '',
}) {
  const projectCheckPlan = await resolveManagedProjectCheckPlan({
    targetRoot,
    projectCheckProfile,
    projectCheckCommand,
  })
  const projectCheck = runManagedProjectCheck(targetRoot, projectCheckPlan)
  const status =
    projectCheck.status === 'pass'
      ? 'pass'
      : projectCheck.status === 'fail'
        ? 'blocked'
        : 'skipped'

  return {
    kind: 'project-check',
    status,
    profile: projectCheck.profile || projectCheckPlan.profile || DEFAULT_PROJECT_CHECK_PROFILE,
    reason: projectCheck.reason || projectCheckPlan.reason || '',
    selectionReason: projectCheck.selectionReason || projectCheckPlan.reason || '',
    command: projectCheck.command || projectCheckPlan.command || '',
    selectedChecks: projectCheck.selectedChecks || projectCheckPlan.selectedChecks || [],
    exitCode: projectCheck.exitCode,
    stdout: projectCheck.stdout || '',
    stderr: projectCheck.stderr || '',
  }
}

async function main(options, context = {}) {
  const scriptStartedAtMs =
    Number.isFinite(context.scriptStartedAtMs) ? context.scriptStartedAtMs : Date.now()
  const targetRoot = context.targetRoot || path.resolve(options.target)
  const skillRoot =
    context.skillRoot || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const validationProfile = normalizeValidationProfile(options.validationProfile)

  let briefResult = await buildGenerationBriefResult(options, {
    targetRoot,
    skillRoot,
    sessionId: options.sessionId,
    scriptStartedAtMs,
  })
  let autoPreflightRecovery = null
  let managedMfRecovery = null

  if (briefResult.brief?.pageSelector?.kind === 'page-family') {
    const blockedResult = buildBlockedResult({
      targetRoot,
      briefFilePath: '',
      pageSelector: briefResult.brief.pageSelector,
      mode: briefResult.brief.mode,
      validationProfile,
      executionStage: 'generation-brief',
      reason:
        'generate-page.mjs currently closes only standard typical page-type workflows. For non-typical page-family tasks, use execute-non-typical-page-task.mjs so the validated family-specific light sanity stays in place.',
      sessionTrace: briefResult.payload.sessionTrace || null,
      brief: briefResult.payload,
      generation: null,
      lightValidation: {
        kind: 'not-run',
        status: 'skipped',
      },
      acceptanceValidation: {
        kind: 'project-check',
        status: 'skipped',
        reason: 'validation-profile acceptance is not available for non-typical page-family tasks in this entrypoint.',
      },
    })
    await recordPageGenerationSessionStage({
      sessionContext: briefResult.sessionTraceContext,
      brief: briefResult.brief,
      options,
      source: 'generate-page',
      stage: 'singleEntryBlocked',
      status: 'blocked',
      startedAtMs: scriptStartedAtMs,
      finishedAtMs: Date.now(),
      details: {
        blockedBy: 'page-family-single-entry-not-supported',
      },
    })
    return blockedResult
  }

  if (briefResult.blockedBrief) {
    autoPreflightRecovery = await attemptAutoPreflightRecovery({
      blockedPayload: briefResult.payload,
      briefResult,
      options,
      targetRoot,
      skillRoot,
      scriptStartedAtMs,
    })
    if (autoPreflightRecovery?.briefResult) {
      briefResult = autoPreflightRecovery.briefResult
    }
  }

  if (briefResult.blockedBrief) {
    managedMfRecovery = await attemptManagedMfAutofixRecovery({
      blockedPayload: briefResult.payload,
      briefResult,
      options,
      targetRoot,
      skillRoot,
      scriptStartedAtMs,
    })
    if (managedMfRecovery?.briefResult) {
      briefResult = managedMfRecovery.briefResult
    }
  }

  if (briefResult.blockedBrief) {
    await recordPageGenerationSessionStage({
      sessionContext: briefResult.sessionTraceContext,
      brief: briefResult.brief,
      options,
      source: 'generate-page',
      stage: 'singleEntryBlocked',
      status: 'blocked',
      startedAtMs: scriptStartedAtMs,
      finishedAtMs: Date.now(),
      details: {
        blockedBy: briefResult.payload.blockedBy || 'generation-brief-blocked',
        },
      })
    return buildBlockedResultFromPayload({
      targetRoot,
      mode: briefResult.payload.mode || options.mode,
      validationProfile,
      executionStage: 'generation-brief',
      payload: briefResult.payload,
      briefPayload: briefResult.payload,
      fallbackPageSelector: briefResult.brief?.pageSelector ?? null,
      fallbackReason: 'generation-brief blocked page generation.',
    })
  }

  let briefFilePath = await writeReadyBriefSnapshot({
    briefOutput: options.briefOutput,
    targetRoot,
    sessionTracePath: briefResult.sessionTraceContext.tracePath,
    payload: briefResult.payload,
  })
  const generationOptions = {
    ...options,
    target: targetRoot,
    briefFile: briefFilePath,
    sessionId: briefResult.sessionTraceContext.sessionId,
  }

  let generation = null
  for (let generationAttempt = 0; generationAttempt < 2; generationAttempt += 1) {
    try {
      generation = await runGeneratePageFromBrief(generationOptions, {
        targetRoot,
        preloadedBrief: briefResult.brief,
      })
      break
    } catch (error) {
      if (
        !managedMfRecovery &&
        error?.name === 'BlockedGenerationError' &&
        error.payload
      ) {
        managedMfRecovery = await attemptManagedMfAutofixRecovery({
          blockedPayload: error.payload,
          briefResult,
          options,
          targetRoot,
          skillRoot,
          scriptStartedAtMs,
        })

        if (managedMfRecovery?.briefResult) {
          briefResult = managedMfRecovery.briefResult
          if (briefResult.blockedBrief) {
            await recordPageGenerationSessionStage({
              sessionContext: briefResult.sessionTraceContext,
              brief: briefResult.brief,
              options,
              source: 'generate-page',
              stage: 'singleEntryBlocked',
              status: 'blocked',
              startedAtMs: scriptStartedAtMs,
              finishedAtMs: Date.now(),
              details: {
                blockedBy: briefResult.payload.blockedBy || 'generation-brief-blocked',
              },
            })
            return buildBlockedResultFromPayload({
              targetRoot,
              briefFilePath,
              mode: briefResult.payload.mode || options.mode,
              validationProfile,
              executionStage: 'generation-brief',
              payload: briefResult.payload,
              briefPayload: briefResult.payload,
              fallbackPageSelector: briefResult.brief?.pageSelector ?? null,
              fallbackReason: 'generation-brief blocked page generation after managed MF recovery.',
            })
          }

          briefFilePath = await writeReadyBriefSnapshot({
            briefOutput: options.briefOutput,
            targetRoot,
            sessionTracePath: briefResult.sessionTraceContext.tracePath,
            payload: briefResult.payload,
          })
          generationOptions.briefFile = briefFilePath
          generationOptions.sessionId = briefResult.sessionTraceContext.sessionId
          continue
        }
      }

      if (error?.name === 'BlockedGenerationError' && error.payload) {
        await recordPageGenerationSessionStage({
          sessionContext: briefResult.sessionTraceContext,
          brief: briefResult.brief,
          options,
          source: 'generate-page',
          stage: 'singleEntryBlocked',
          status: 'blocked',
          startedAtMs: scriptStartedAtMs,
          finishedAtMs: Date.now(),
          details: {
            blockedBy: error.payload.blockedBy || 'generate-page-from-brief-blocked',
          },
        })
        return buildBlockedResultFromPayload({
          targetRoot,
          briefFilePath,
          mode: error.payload.mode || briefResult.brief.mode,
          validationProfile,
          executionStage: 'generation',
          payload: error.payload,
          briefPayload: briefResult.payload,
          generationPayload: error.payload,
          fallbackPageSelector: briefResult.brief.pageSelector,
          fallbackReason: error.message,
        })
      }
      throw error
    }
  }

  if (options.dryRun) {
    await recordPageGenerationSessionStage({
      sessionContext: briefResult.sessionTraceContext,
      brief: briefResult.brief,
      options,
      source: 'generate-page',
      stage: 'singleEntryDone',
      status: 'success',
      startedAtMs: scriptStartedAtMs,
      finishedAtMs: Date.now(),
      details: {
        dryRun: true,
        lightValidation: 'skipped',
      },
    })
    return {
      schema: 'hiui-design-generate-page.v1',
      status: generation.status || 'planned',
      executionStage: 'generation',
      targetRoot,
      mode: generation.mode || briefResult.brief.mode,
      validationProfile,
      pageSelector: briefResult.brief.pageSelector,
      briefFilePath,
      sessionTrace: buildPageGenerationSessionRef(briefResult.sessionTraceContext, {
        currentStage: 'singleEntryDone',
        currentStatus: 'success',
      }),
      brief: briefResult.payload,
      generation,
      lightValidation: {
        kind: 'typical-page-slot-gate',
        status: 'skipped',
        reason: 'dry-run kept the workflow read-only, so light validation after write was skipped.',
      },
      acceptanceValidation: {
        kind: 'project-check',
        status: 'skipped',
        reason: 'dry-run kept the workflow read-only, so acceptance validation after write was skipped.',
      },
      reason: '',
    }
  }

  const lightValidationStartedAtMs = Date.now()
  const slotGateResult = await runTypicalPageSlotGate({
    targetRoot,
    skillRoot,
    brief: briefResult.brief,
    generation,
  })
  const lightValidation =
    slotGateResult.payload || {
      status: slotGateResult.exitCode === 0 ? 'pass' : 'blocked',
      kind: 'typical-page-slot-gate',
      rawOutput: slotGateResult.rawOutput,
      pagePath: slotGateResult.pagePath,
      violations: [],
    }
  lightValidation.kind = 'typical-page-slot-gate'
  lightValidation.pagePath = lightValidation.pagePath || slotGateResult.pagePath
  const lightValidationBlocked = lightValidation.status !== 'pass'

  await recordPageGenerationSessionStage({
    sessionContext: briefResult.sessionTraceContext,
    brief: briefResult.brief,
    options,
    source: 'generate-page',
    stage: lightValidationBlocked ? 'lightValidationBlocked' : 'lightValidationDone',
    status: lightValidationBlocked ? 'blocked' : 'success',
    startedAtMs: lightValidationStartedAtMs,
    finishedAtMs: Date.now(),
    details: {
      validationKind: 'typical-page-slot-gate',
      violationCount: Array.isArray(lightValidation.violations)
        ? lightValidation.violations.length
        : 0,
    },
  })
  await recordPageGenerationSessionStage({
    sessionContext: briefResult.sessionTraceContext,
    brief: briefResult.brief,
    options,
    source: 'generate-page',
    stage: 'singleEntryDone',
    status: lightValidationBlocked ? 'blocked' : 'success',
    startedAtMs: scriptStartedAtMs,
    finishedAtMs: Date.now(),
    details: {
      dryRun: false,
      lightValidation: lightValidation.status,
    },
  })

  if (lightValidationBlocked) {
    return buildBlockedResult({
      targetRoot,
      briefFilePath,
      pageSelector: briefResult.brief.pageSelector,
      mode: generation.mode || briefResult.brief.mode,
      validationProfile,
      executionStage: 'light-validation',
      reason:
        Array.isArray(lightValidation.violations) && lightValidation.violations.length > 0
          ? lightValidation.violations.join('; ')
          : 'typical-page-slot-gate blocked the generated page.',
      sessionTrace: buildPageGenerationSessionRef(briefResult.sessionTraceContext, {
        currentStage: 'singleEntryDone',
        currentStatus: 'blocked',
      }),
      brief: briefResult.payload,
      generation,
      lightValidation,
      acceptanceValidation: {
        kind: 'project-check',
        status: 'skipped',
        reason: 'slot gate blocked the generated page before acceptance validation could run.',
      },
    })
  }

  if (validationProfile === 'light') {
    return {
      schema: 'hiui-design-generate-page.v1',
      status: 'pass',
      executionStage: 'light-validation',
      targetRoot,
      mode: generation.mode || briefResult.brief.mode,
      validationProfile,
      pageSelector: briefResult.brief.pageSelector,
      briefFilePath,
      sessionTrace: buildPageGenerationSessionRef(briefResult.sessionTraceContext, {
        currentStage: 'singleEntryDone',
        currentStatus: 'success',
      }),
      brief: briefResult.payload,
      generation,
      lightValidation,
      acceptanceValidation: {
        kind: 'project-check',
        status: 'skipped',
        reason: 'validation-profile light stops after slot-gate validation.',
      },
      reason: '',
    }
  }

  const acceptanceValidationStartedAtMs = Date.now()
  const acceptanceValidation = await runAcceptanceValidation({
    targetRoot,
    projectCheckProfile: options.projectCheckProfile,
    projectCheckCommand: options.projectCheckCommand,
  })
  const acceptanceBlocked = acceptanceValidation.status === 'blocked'

  await recordPageGenerationSessionStage({
    sessionContext: briefResult.sessionTraceContext,
    brief: briefResult.brief,
    options,
    source: 'generate-page',
    stage: acceptanceBlocked ? 'acceptanceValidationBlocked' : 'acceptanceValidationDone',
    status: acceptanceBlocked ? 'blocked' : 'success',
    startedAtMs: acceptanceValidationStartedAtMs,
    finishedAtMs: Date.now(),
    details: {
      validationKind: acceptanceValidation.kind,
      validationStatus: acceptanceValidation.status,
      selectedChecks: acceptanceValidation.selectedChecks,
    },
  })
  await recordPageGenerationSessionStage({
    sessionContext: briefResult.sessionTraceContext,
    brief: briefResult.brief,
    options,
    source: 'generate-page',
    stage: 'singleEntryDone',
    status: acceptanceBlocked ? 'blocked' : 'success',
    startedAtMs: scriptStartedAtMs,
    finishedAtMs: Date.now(),
    details: {
      dryRun: false,
      lightValidation: lightValidation.status,
      acceptanceValidation: acceptanceValidation.status,
    },
  })

  if (acceptanceBlocked) {
    return buildBlockedResult({
      targetRoot,
      briefFilePath,
      pageSelector: briefResult.brief.pageSelector,
      mode: generation.mode || briefResult.brief.mode,
      validationProfile,
      executionStage: 'acceptance-validation',
      reason:
        acceptanceValidation.reason ||
        'acceptance validation blocked the generated page.',
      sessionTrace: buildPageGenerationSessionRef(briefResult.sessionTraceContext, {
        currentStage: 'singleEntryDone',
        currentStatus: 'blocked',
      }),
      brief: briefResult.payload,
      generation,
      lightValidation,
      acceptanceValidation,
    })
  }

  return {
    schema: 'hiui-design-generate-page.v1',
    status: 'pass',
    executionStage: 'acceptance-validation',
    targetRoot,
    mode: generation.mode || briefResult.brief.mode,
    validationProfile,
    pageSelector: briefResult.brief.pageSelector,
    briefFilePath,
    sessionTrace: buildPageGenerationSessionRef(briefResult.sessionTraceContext, {
      currentStage: 'singleEntryDone',
      currentStatus: 'success',
    }),
    brief: briefResult.payload,
    generation,
    lightValidation,
    acceptanceValidation,
    reason: '',
  }
}

async function runCli() {
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
  let usageSession = null
  let success = false

  try {
    usageSession = await startUsageSession({
      prompt: options.telemetryPrompt,
      promptFile: options.telemetryPromptFile,
      reportMode: options.mode || 'auto',
      source: 'generate-page',
      targetRoot,
    })
    const result = await main(options, {
      targetRoot,
      skillRoot,
    })
    success = result.status === 'pass' || result.status === 'planned'

    if (options.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
    } else {
      process.stdout.write(renderResult(result))
    }

    if (!success) {
      process.exitCode = 1
    }
  } finally {
    await finalizeUsageSession(usageSession, {
      success,
      source: 'generate-page',
      targetRoot,
      reportMode: options.mode || 'auto',
    })
  }
}

function isDirectCliExecution() {
  if (!process.argv[1]) return false
  return path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
}

if (isDirectCliExecution()) {
  await runCli()
}
