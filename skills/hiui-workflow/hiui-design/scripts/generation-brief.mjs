#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { formatInstallModeUsage } from './lib/mode-contract.mjs'
import { maybeAutoAssembleLegacyReconstructionInput } from './lib/legacy-reconstruction-intake.mjs'
import { maybeResolveRelatedPagePathFromPrompt } from './lib/related-page-intake.mjs'
import { getContextScriptPath } from './lib/skill-identity.mjs'
import {
  isGenerationBriefBlocked,
  loadGenerationBrief,
  renderGenerationBriefMarkdown,
  toBlockedGenerationBrief,
} from './lib/load-generation-brief.mjs'
import {
  buildPageGenerationSessionRef,
  openPageGenerationSession,
  recordPageGenerationSessionStage,
} from './lib/page-generation-session-trace.mjs'
import { buildPageRelationStageDetails } from './lib/page-generation-stage-tracker.mjs'
import { inspectPageTaskGate } from './lib/page-task-gate.mjs'
import { ensureProjectNodeRuntime } from './lib/project-node-launcher.mjs'
import { resolveJsonOrPathArg } from './lib/json-input-arg.mjs'

function readRequiredArg(argv, index, name) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`)
  return value
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
    telemetryPrompt: '',
    telemetryPromptFile: '',
    json: false,
    output: '',
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--') {
      continue
    }

    if (arg === '--target') {
      options.target = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--page-type') {
      options.pageType = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--page-family') {
      options.pageFamily = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--mode') {
      options.mode = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--input-mode') {
      options.inputMode = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--localization-mode') {
      options.localizationMode = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--line') {
      options.line = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--dest') {
      options.dest = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--related-page-path') {
      options.relatedPagePath = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--title') {
      options.title = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--route-path') {
      options.routePath = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--detail-sections-json') {
      options.detailSectionsJson = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--feedback-variant-id' || arg === '--variant-id') {
      options.feedbackVariantId = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--page-adjustment-contract') {
      options.pageAdjustmentContract = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--confirmed-generation-input-json') {
      options.confirmedGenerationInputJson = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--confirmed-design-restore-input-json') {
      options.confirmedDesignRestoreInputJson = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--navigation-mount-contract') {
      options.navigationMountContract = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--non-typical-conversation-output-json') {
      options.nonTypicalConversationOutputJson = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--legacy-reconstruction-input-json') {
      options.legacyReconstructionInputJson = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--migration-invariant-contract-json') {
      options.migrationInvariantContractJson = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--analytics-refactor-contract-json') {
      options.analyticsRefactorContractJson = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--session-id') {
      options.sessionId = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--telemetry-prompt') {
      options.telemetryPrompt = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--telemetry-prompt-file') {
      options.telemetryPromptFile = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--output') {
      options.output = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node ${getContextScriptPath('generation-brief.mjs')} [--page-type <id> | --page-family <id>] [--dest <dir>] [--related-page-path <file>] [--title <title>] [--route-path <path>] [--detail-sections-json <json-or-path>] [--input-mode <page-prompt|prototype-screenshot|figma-design-restore|legacy-system-reconstruction>] [--localization-mode <none|inherit-host|local-bridge>] [--feedback-variant-id <id>] [--page-adjustment-contract <json-or-path>] [--confirmed-generation-input-json <json>] [--confirmed-design-restore-input-json <json>] [--navigation-mount-contract <json-or-path>] [--non-typical-conversation-output-json <json>] [--legacy-reconstruction-input-json <json>] [--migration-invariant-contract-json <json>] [--analytics-refactor-contract-json <json>] [--session-id <id>] [--telemetry-prompt <text>] [--telemetry-prompt-file <path>] [--mode ${formatInstallModeUsage()}] [--json] [--output <file>]

--page-adjustment-contract is only for the "base-template-local-adjustment" path. It must describe the current request as a local adjustment relative to the official base template, not as a new page type.

When input-mode is figma-design-restore, page selector may be omitted and auto-inferred from confirmedDesignRestoreInput when the routing decision is unambiguous.

--related-page-path is optional directory evidence only. Pass a project-relative page file such as src/views/existing-page/index.jsx when the task should inherit an existing business page root.

Default localization behavior: if --localization-mode is omitted, the brief uses none. Use inherit-host only when the target project already has a proven host i18n runtime, and use local-bridge only when the user explicitly asks to connect page i18n.

When integrationReadiness is not ready yet, use generation-brief only as a minimal gate probe: pass --target and optional --mode first, read nextCommand for ensure, and omit --page-type, --page-family, --title, --dest, --route-path, and other brief-shaping flags until ensure succeeds.

After typical-page:preflight opens the page-task gate, generation-brief reads project-scoped host facts from .local-context/hiui-design/outputs/PROJECT_HOST_CONTRACT.json and AI_GENERATION_READY_CONTEXT.json. If PROJECT_HOST_CONTRACT.json is missing or invalid, the command fail-closes and asks you to rerun typical-page:preflight instead of rescanning navigation in the main path.
`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function writeOutput(outputPath, content) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, content, 'utf8')
}

async function readTelemetryPromptText(options) {
  if (options.telemetryPrompt) return options.telemetryPrompt
  if (!options.telemetryPromptFile) return ''

  const promptFilePath = path.resolve(options.telemetryPromptFile)
  return fs.readFile(promptFilePath, 'utf8')
}

export async function buildGenerationBriefResult(options, context = {}) {
  const scriptStartedAtMs =
    Number.isFinite(context.scriptStartedAtMs) ? context.scriptStartedAtMs : Date.now()
  const targetRoot = context.targetRoot || path.resolve(options.target)
  const skillRoot =
    context.skillRoot || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const sessionTraceContext = await openPageGenerationSession({
    targetRoot,
    sessionId: context.sessionId || options.sessionId,
    options,
    source: 'generation-brief',
  })
  let confirmedGenerationInput = null
  let confirmedDesignRestoreInput = null
  let nonTypicalConversationOutput = null
  let explicitLegacyReconstructionInput = null
  let explicitMigrationInvariantContract = null
  let analyticsRefactorContract = null

  if (options.confirmedGenerationInputJson) {
    confirmedGenerationInput = await resolveJsonOrPathArg(options.confirmedGenerationInputJson, {
      targetRoot,
      label: '--confirmed-generation-input-json',
    })
  }
  if (options.confirmedDesignRestoreInputJson) {
    confirmedDesignRestoreInput = await resolveJsonOrPathArg(
      options.confirmedDesignRestoreInputJson,
      {
        targetRoot,
        label: '--confirmed-design-restore-input-json',
      }
    )
  }
  if (options.nonTypicalConversationOutputJson) {
    try {
      nonTypicalConversationOutput = JSON.parse(options.nonTypicalConversationOutputJson)
    } catch (error) {
      throw new Error(
        `Invalid JSON passed to --non-typical-conversation-output-json: ${error.message}`
      )
    }
  }
  if (options.legacyReconstructionInputJson) {
    explicitLegacyReconstructionInput = await resolveJsonOrPathArg(
      options.legacyReconstructionInputJson,
      {
        targetRoot,
        label: '--legacy-reconstruction-input-json',
      }
    )
  }
  if (options.migrationInvariantContractJson) {
    explicitMigrationInvariantContract = await resolveJsonOrPathArg(
      options.migrationInvariantContractJson,
      {
        targetRoot,
        label: '--migration-invariant-contract-json',
      }
    )
  }
  if (options.analyticsRefactorContractJson) {
    analyticsRefactorContract = await resolveJsonOrPathArg(
      options.analyticsRefactorContractJson,
      {
        targetRoot,
        label: '--analytics-refactor-contract-json',
      }
    )
  }

  const telemetryPromptText = await readTelemetryPromptText(options)
  const pageTaskGate = await inspectPageTaskGate({ targetRoot, skillRoot })
  const legacyAutoAssembly =
    explicitLegacyReconstructionInput || explicitMigrationInvariantContract
      ? {
          status: 'explicit',
          effectiveInputMode: options.inputMode,
          legacyReconstructionInput: explicitLegacyReconstructionInput,
          migrationInvariantContract: explicitMigrationInvariantContract,
        }
      : pageTaskGate.nextStage !== 'ready-to-generate'
        ? {
            status: 'deferred-until-page-task-ready',
            effectiveInputMode: options.inputMode,
            legacyReconstructionInput: null,
            migrationInvariantContract: null,
            autoDetected: false,
            report: {
              promptMatched: false,
              promptConfidence: 'low',
              promptReasons: [],
              evidenceSummary: [],
              sourceCodePaths: [],
              layoutFacts: [],
              invariants: [],
            },
          }
      : await maybeAutoAssembleLegacyReconstructionInput({
          targetRoot,
          skillRoot,
          line: options.line,
          pageTypeId: options.pageType,
          title: options.title,
          routePath: options.routePath,
          dest: options.dest,
          prompt: telemetryPromptText,
          explicitInputMode: options.inputMode,
        })

  if (legacyAutoAssembly.status === 'blocked') {
    throw new Error(legacyAutoAssembly.blockingReason)
  }

  const effectiveInputMode = legacyAutoAssembly.effectiveInputMode || options.inputMode
  const legacyReconstructionInput =
    explicitLegacyReconstructionInput || legacyAutoAssembly.legacyReconstructionInput
  const migrationInvariantContract =
    explicitMigrationInvariantContract || legacyAutoAssembly.migrationInvariantContract
  const effectivePageTypeId =
    options.pageType || (options.pageFamily ? '' : legacyAutoAssembly.resolvedPageTypeId || '')
  const effectivePageFamilyId = effectivePageTypeId
    ? ''
    : options.pageFamily || legacyAutoAssembly.resolvedPageFamilyId || ''
  const relatedPageResolution = options.relatedPagePath
    ? {
        relatedPagePath: options.relatedPagePath,
      }
    : pageTaskGate.nextStage !== 'ready-to-generate'
      ? {
          relatedPagePath: '',
        }
      : await maybeResolveRelatedPagePathFromPrompt({
          targetRoot,
          prompt: telemetryPromptText,
          requestedTitle: options.title,
          routePath: options.routePath,
          dest: options.dest,
        })
  const effectiveRelatedPagePath =
    options.relatedPagePath || relatedPageResolution.relatedPagePath || ''

  const brief = await loadGenerationBrief({
    targetRoot,
    skillRoot,
    integrationReadiness: pageTaskGate.integrationReadiness,
    pageTaskGate,
    pageTypeId: effectivePageTypeId,
    pageFamilyId: effectivePageFamilyId,
    mode: options.mode,
    inputMode: effectiveInputMode,
    localizationMode: options.localizationMode,
    line: options.line,
    dest: options.dest,
    relatedPagePath: effectiveRelatedPagePath,
    title: options.title,
    routePath: options.routePath,
    detailSections: options.detailSectionsJson,
    feedbackVariantId: options.feedbackVariantId,
    pageAdjustmentContract: options.pageAdjustmentContract,
    confirmedGenerationInput,
    confirmedDesignRestoreInput,
    navigationMountContract: options.navigationMountContract,
    nonTypicalConversationOutput,
    legacyReconstructionInput,
    migrationInvariantContract,
    analyticsRefactorContract,
  })
  const blockedBrief = isGenerationBriefBlocked(brief)
  const payload = blockedBrief ? toBlockedGenerationBrief(brief, targetRoot) : brief
  payload.sessionTrace = buildPageGenerationSessionRef(sessionTraceContext, {
    currentStage: 'briefReady',
    currentStatus: blockedBrief ? 'blocked' : 'success',
  })
  await recordPageGenerationSessionStage({
    sessionContext: sessionTraceContext,
    brief,
    options,
    source: 'generation-brief',
    stage: 'briefReady',
    status: blockedBrief ? 'blocked' : 'success',
    startedAtMs: scriptStartedAtMs,
    finishedAtMs: Date.now(),
    details: {
      stageId: blockedBrief ? 'generation-brief-blocked' : 'generation-brief-ready',
      blocked: blockedBrief,
      blockedBy: blockedBrief ? payload.blockedBy || '' : '',
      blockingReason: blockedBrief ? payload.reason || '' : '',
      nextCommand: blockedBrief
        ? payload.pageTypeCapability?.nextCommand || payload.pageTaskGate?.nextCommand || ''
        : '',
      requiredManualActions: blockedBrief ? payload.requiredManualActions || [] : [],
      evidenceFiles: blockedBrief
        ? [
            payload.projectHostContract?.path || '',
            payload.pageTypeCapability?.sourcePath || '',
          ].filter(Boolean)
        : [],
      jsonOutput: options.json === true,
      outputRequested: Boolean(options.output),
      ...buildPageRelationStageDetails({
        brief,
        resultPayload: payload,
      }),
    },
    resultPayload: payload,
  })
  const content = options.json
    ? `${JSON.stringify(payload, null, 2)}\n`
    : renderGenerationBriefMarkdown(brief)

  return {
    targetRoot,
    skillRoot,
    brief,
    payload,
    blockedBrief,
    sessionTraceContext,
    content,
  }
}

async function main() {
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
  const result = await buildGenerationBriefResult(options, {
    targetRoot,
    skillRoot,
  })

  if (options.output) {
    const outputPath = path.resolve(targetRoot, options.output)
    await writeOutput(outputPath, result.content)
    console.log(`Generation brief written: ${outputPath}`)
    return
  }

  process.stdout.write(result.content)
}

function isDirectCliExecution() {
  if (!process.argv[1]) return false
  return path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
}

if (isDirectCliExecution()) {
  await main()
}
