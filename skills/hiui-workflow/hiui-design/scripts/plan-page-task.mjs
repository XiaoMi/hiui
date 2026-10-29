#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { formatInstallModeUsage } from './lib/mode-contract.mjs'
import { readReadyGenerationBriefFile } from './lib/brief-file.mjs'
import { maybeAutoAssembleLegacyReconstructionInput } from './lib/legacy-reconstruction-intake.mjs'
import { loadGenerationBrief } from './lib/load-generation-brief.mjs'
import {
  buildPageGenerationSessionRef,
  openPageGenerationSession,
  recordPageGenerationSessionStage,
} from './lib/page-generation-session-trace.mjs'
import { buildPageRelationStageDetails } from './lib/page-generation-stage-tracker.mjs'
import { buildPreflightCommand, inspectPageTaskGate } from './lib/page-task-gate.mjs'
import { maybeResolveRelatedPagePathFromPrompt } from './lib/related-page-intake.mjs'
import { finalizeUsageSession, startUsageSession } from './lib/usage-telemetry.mjs'
import { resolveJsonOrPathArg } from './lib/json-input-arg.mjs'

const TASK_LEVELS = new Set([
  'minor-edit',
  'managed-page-change',
  'new-page-or-rearchitecture',
])

function readRequiredArg(argv, index, flag) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`)
  }
  return value
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    targetExplicit: false,
    pageType: '',
    pageFamily: '',
    briefFile: '',
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
    nonTypicalConversationOutputJson: '',
    navigationMountContract: '',
    legacyReconstructionInputJson: '',
    migrationInvariantContractJson: '',
    analyticsRefactorContractJson: '',
    taskLevel: '',
    sessionId: '',
    telemetryPrompt: '',
    telemetryPromptFile: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      continue
    }

    if (arg === '--target') {
      options.target = readRequiredArg(argv, index, arg)
      options.targetExplicit = true
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
    if (arg === '--brief-file') {
      options.briefFile = readRequiredArg(argv, index, arg)
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
    if (arg === '--non-typical-conversation-output-json') {
      options.nonTypicalConversationOutputJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--navigation-mount-contract') {
      options.navigationMountContract = readRequiredArg(argv, index, arg)
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
    if (arg === '--task-level') {
      options.taskLevel = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(
        `Usage: node scripts/plan-page-task.mjs [--page-type <id> | --page-family <id>] [--target <project-root>] [--mode <${formatInstallModeUsage()}>] [--input-mode <page-prompt|prototype-screenshot|figma-design-restore|legacy-system-reconstruction>] [--localization-mode <none|inherit-host|local-bridge>] [--dest <dir>] [--related-page-path <file>] [--title <title>] [--route-path <path>] [--detail-sections-json <json-or-path>] [--feedback-variant-id <id>] [--page-adjustment-contract <json-or-path>] [--confirmed-generation-input-json <json>] [--confirmed-design-restore-input-json <json>] [--non-typical-conversation-output-json <json>] [--navigation-mount-contract <json-or-path>] [--legacy-reconstruction-input-json <json>] [--migration-invariant-contract-json <json>] [--analytics-refactor-contract-json <json>] [--brief-file <file>] [--task-level <minor-edit|managed-page-change|new-page-or-rearchitecture>] [--session-id <id>] [--telemetry-prompt <text>] [--telemetry-prompt-file <path>] [--json]

When input-mode is figma-design-restore, page selector may be omitted and auto-inferred from confirmedDesignRestoreInput when the routing decision is unambiguous.

Default localization behavior: if --localization-mode is omitted, the plan uses none. Use inherit-host only when the target project already has a proven host i18n runtime, and use local-bridge only when the user explicitly asks to connect page i18n.

Use --brief-file <file> to consume a previously materialized JSON brief from generation-brief.mjs. When --brief-file is present, page selector and other brief-shaping flags are ignored, and the file becomes the source of truth for planning.

When project integration is not ready yet, or the page-task gate is still not ready-to-generate, use plan-page-task only as a minimal gate probe: pass --target and optional --mode first, read nextStepCommand for ensure/preflight, and omit --page-type, --page-family, --title, --dest, --route-path, and other brief-shaping flags until the gate opens.

After typical-page:preflight opens the page-task gate, the planner reuses .local-context/hiui-design/outputs/PROJECT_HOST_CONTRACT.json as the project-scoped host fact source. If that contract is missing or invalid, planning fail-closes and asks you to rerun typical-page:preflight instead of rescanning navigation in the main path.`,
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (options.pageType && options.pageFamily) {
    throw new Error('Pass either --page-type or --page-family, not both')
  }

  if (options.taskLevel && !TASK_LEVELS.has(options.taskLevel)) {
    throw new Error(
      `Invalid --task-level "${options.taskLevel}". Allowed values: ${Array.from(TASK_LEVELS).join(', ')}`,
    )
  }

  return options
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return null
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

async function resolveExistingPageSourceFile(pageDirectory) {
  for (const fileName of ['index.tsx', 'index.jsx', 'index.ts', 'index.js']) {
    const candidatePath = path.join(pageDirectory, fileName)
    if (await pathExists(candidatePath)) return candidatePath
  }
  return ''
}

async function resolveExistingPageStyleFile(pageDirectory) {
  for (const fileName of [
    'index.module.scss',
    'index.scss',
    'index.module.less',
    'index.less',
    'index.module.css',
    'index.css',
  ]) {
    const candidatePath = path.join(pageDirectory, fileName)
    if (await pathExists(candidatePath)) return candidatePath
  }
  return ''
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`
}

function relativeOrAbsolute(root, targetPath) {
  const relativePath = path.relative(root, targetPath)
  if (!relativePath || relativePath.startsWith('..')) return targetPath
  return relativePath
}

async function detectPackageManager(targetRoot) {
  if (await pathExists(path.join(targetRoot, 'pnpm-lock.yaml'))) return 'pnpm'
  if (await pathExists(path.join(targetRoot, 'yarn.lock'))) return 'yarn'
  return 'npm'
}

function buildRunScriptCommand(packageManager, scriptName) {
  if (packageManager === 'pnpm') return `pnpm ${scriptName}`
  if (packageManager === 'yarn') return `yarn ${scriptName}`
  return `npm run ${scriptName}`
}

function pickExistingScript(scripts = {}, candidates = []) {
  return candidates.find((candidate) => typeof scripts[candidate] === 'string' && scripts[candidate].trim()) || ''
}

function inferTaskLevel({ overrideTaskLevel, destinationExists, inputModeId, pageAdjustmentContract }) {
  if (overrideTaskLevel) return overrideTaskLevel
  if (pageAdjustmentContract) return destinationExists ? 'managed-page-change' : 'new-page-or-rearchitecture'
  return destinationExists ? 'managed-page-change' : 'new-page-or-rearchitecture'
}

async function readTelemetryPromptText(options) {
  if (options.telemetryPrompt) return options.telemetryPrompt
  if (!options.telemetryPromptFile) return ''

  const promptFilePath = path.resolve(options.telemetryPromptFile)
  return fs.readFile(promptFilePath, 'utf8')
}

function buildNavigationExecutionSnapshot({ brief, planningGateKind = '' } = {}) {
  if (planningGateKind === 'ensure') {
    return {
      blocked: false,
      status: 'deferred-until-ensure',
      blockedBy: [],
      reason: 'Project-local hiui-design context and apply-state are not ready yet.',
      requiresManualNavigationRegistration: false,
    }
  }

  if (planningGateKind === 'preflight') {
    return {
      blocked: false,
      status: 'deferred-until-preflight',
      blockedBy: [],
      reason: 'Page-task gate is still closed until typical-page:preflight passes.',
      requiresManualNavigationRegistration: false,
    }
  }

  if (planningGateKind === 'brief-blocked') {
    return {
      blocked: false,
      status: 'deferred-until-brief-unblocked',
      blockedBy: [],
      reason:
        brief.executionPolicy?.briefBlockReason ||
        'Generation brief is blocked by the current project state.',
      requiresManualNavigationRegistration: false,
    }
  }

  return {
    blocked: brief.executionPolicy?.navigationExecutionBlocked === true,
    status: brief.executionPolicy?.navigationExecutionStatus || 'ready',
    blockedBy: Array.isArray(brief.executionPolicy?.navigationExecutionBlockedBy)
      ? brief.executionPolicy.navigationExecutionBlockedBy
      : [],
    reason: brief.executionPolicy?.navigationExecutionReason || '',
    requiresManualNavigationRegistration:
      brief.executionPolicy?.requiresManualNavigationRegistration === true,
  }
}

function resolveNavigationGate({ brief, destinationExists }) {
  const requiresFormalNavigationRegistration = Boolean(
    brief.executionPolicy?.mustRegisterToFormalNavigationRegistry ||
      brief.requestedBusiness?.routePath
  )
  const rawBlocked = Boolean(
    brief.executionPolicy?.navigationBlocked ||
      (requiresFormalNavigationRegistration &&
        (brief.pageGenerationDecision?.navigationMountDecision?.action === 'ask-user' ||
          brief.pageGenerationDecision?.navigationMountAction?.action === 'ask-user'))
  )
  const blockedForNewEntry = rawBlocked && !destinationExists

  return {
    rawBlocked,
    blockedForNewEntry,
    blockReason: blockedForNewEntry
      ? brief.executionPolicy.navigationBlockReason || 'Navigation registration requires manual confirmation.'
      : '',
    bypassReason:
      rawBlocked && destinationExists
        ? 'Existing-system navigation evidence is still missing for new formal entries, but this task targets an already existing page path and should reuse the current route/menu entry instead of blocking S1.'
        : '',
  }
}

function buildPageUnits(brief) {
  if (brief.nonTypicalExecutionBrief) {
    return [
      {
        id: 'non-typical-primitives',
        kind: 'family-primitives',
        requiredPrimitives: brief.nonTypicalExecutionBrief.primitivePlan.requiredPrimitives,
        optionalPrimitives: brief.nonTypicalExecutionBrief.primitivePlan.optionalPrimitives,
      },
      {
        id: 'page-header-plan',
        kind: 'page-header-plan',
        plan: brief.nonTypicalExecutionBrief.primitivePlan.pageHeaderPlan,
      },
      {
        id: 'white-body-plan',
        kind: 'white-body-plan',
        plan: brief.nonTypicalExecutionBrief.primitivePlan.whiteBodyPlan,
      },
      {
        id: 'region-plan',
        kind: 'region-composition',
        plan: brief.nonTypicalExecutionBrief.primitivePlan.regionPlan,
      },
      {
        id: 'coordination-bindings',
        kind: 'coordination-bindings',
        plan: brief.nonTypicalExecutionBrief.coordinationBindings,
      },
    ]
  }

  const units = [
    {
      id: 'official-template',
      kind: 'template-start',
      sourceTemplatePath: brief.sources.sourceTemplatePath,
      preferredTemplatePath: brief.sources.preferredTemplatePath,
    },
    {
      id: 'required-shell',
      kind: 'locked-shell',
      requiredShell: brief.generationContract.requiredShell || '',
      shell: brief.pageType.shell || '',
    },
  ]

  if (Array.isArray(brief.generationContract.businessSlots) && brief.generationContract.businessSlots.length > 0) {
    units.push({
      id: 'business-slots',
      kind: 'managed-business-slots',
      slots: brief.generationContract.businessSlots,
    })
  }

  if (Array.isArray(brief.generationContract.lockedRegions) && brief.generationContract.lockedRegions.length > 0) {
    units.push({
      id: 'locked-regions',
      kind: 'shell-ownership',
      regions: brief.generationContract.lockedRegions,
    })
  }

  return units
}

function isIntegrationBlocked(brief) {
  return brief.executionPolicy?.integrationGate === 'ensure-or-stop'
}

function getRequestedPageTypeStatus(brief) {
  return (
    brief.executionPolicy?.requestedPageTypeStatus ||
    brief.executionPolicy?.requestedPageTypeCapabilityStatus ||
    'not-checked'
  )
}

function getRequestedPageTypeReason(brief) {
  return (
    brief.executionPolicy?.requestedPageTypeReason ||
    brief.executionPolicy?.requestedPageTypeCapabilityReason ||
    ''
  )
}

function getWriteReadiness(brief) {
  return brief.executionPolicy?.writeReadiness || 'ready'
}

function getBriefBlockStatus(brief) {
  return String(brief.executionPolicy?.briefBlockStatus || '').trim()
}

function getBriefBlockReason(brief) {
  return String(brief.executionPolicy?.briefBlockReason || '').trim()
}

function getBriefBlockedBy(brief) {
  return String(brief.executionPolicy?.briefBlockedBy || '').trim()
}

function resolvePlanningGate({ brief, destinationExists, nonTypicalGeneratorPending = false }) {
  const integrationBlocked = isIntegrationBlocked(brief)
    ? brief.integrationReadiness?.ready
      ? 'preflight'
      : 'ensure'
    : ''
  const navigationGate = resolveNavigationGate({ brief, destinationExists })
  const requestedPageTypeStatus = getRequestedPageTypeStatus(brief)
  const requestedPageTypeReason = getRequestedPageTypeReason(brief)
  const writeReadiness = getWriteReadiness(brief)
  const briefBlockStatus = getBriefBlockStatus(brief)
  const briefBlockReason = getBriefBlockReason(brief)
  const briefBlockedBy = getBriefBlockedBy(brief)

  if (integrationBlocked === 'ensure') {
    return {
      kind: 'ensure',
      status: 'blocked-until-ensure',
      writeReadiness,
      requestedPageTypeStatus,
      requestedPageTypeReason,
      navigationGate,
      blocked: true,
      reason:
        brief.executionPolicy?.pageTaskGateReason ||
        'Project-local hiui-design context and apply-state must be ensured before planning can continue.',
    }
  }

  if (integrationBlocked === 'preflight') {
    return {
      kind: 'preflight',
      status: 'blocked-until-preflight',
      writeReadiness,
      requestedPageTypeStatus,
      requestedPageTypeReason,
      navigationGate,
      blocked: true,
      reason:
        brief.executionPolicy?.pageTaskGateReason ||
        'typical-page:preflight must reopen the page-task gate before planning can continue.',
    }
  }

  if (requestedPageTypeStatus === 'blocked' || writeReadiness === 'blocked-by-requested-page-type') {
    return {
      kind: 'page-type-capability',
      status: 'blocked-by-page-type-capability',
      writeReadiness,
      requestedPageTypeStatus,
      requestedPageTypeReason,
      navigationGate,
      blocked: true,
      reason:
        requestedPageTypeReason ||
        'The requested page type is currently blocked by the project capability matrix.',
    }
  }

  if (brief.executionPolicy?.briefReadyToGenerate === false) {
    return {
      kind: 'brief-blocked',
      status: briefBlockStatus || 'blocked-before-write',
      writeReadiness,
      requestedPageTypeStatus,
      requestedPageTypeReason,
      navigationGate,
      blocked: true,
      blockedBy: briefBlockedBy,
      reason: briefBlockReason || 'Generation brief is blocked by the current project state.',
    }
  }

  if (navigationGate.blockedForNewEntry) {
    return {
      kind: 'navigation-mount',
      status: 'blocked-by-navigation-mount',
      writeReadiness,
      requestedPageTypeStatus,
      requestedPageTypeReason,
      navigationGate,
      blocked: true,
      reason:
        navigationGate.blockReason ||
        'Navigation registration still requires a confirmed mount point before planning can continue.',
    }
  }

  if (nonTypicalGeneratorPending) {
    return {
      kind: 'generator-pending',
      status: 'generator-pending',
      writeReadiness,
      requestedPageTypeStatus,
      requestedPageTypeReason,
      navigationGate,
      blocked: true,
      reason:
        'Planner and brief are wired for non-typical-page, but generatorReady is still false. Stop at nonTypicalExecutionBrief.',
    }
  }

  return {
    kind: '',
    status: 'ready-to-generate',
    writeReadiness,
    requestedPageTypeStatus,
    requestedPageTypeReason,
    navigationGate,
    blocked: false,
    reason: brief.integrationReadiness?.reason || 'Project-local hiui-design context and appliedMode are ready.',
  }
}

function isNonTypicalGeneratorPending(brief) {
  return Boolean(
    brief.nonTypicalExecutionBrief &&
      brief.pageGenerationDecision?.familyWorkflow &&
      brief.pageGenerationDecision.familyWorkflow.generatorReady !== true
  )
}

function isNonTypicalFamilyReady(brief, { nonTypicalGeneratorPending = false } = {}) {
  return Boolean(
    brief.pageSelector?.kind === 'page-family' &&
      brief.nonTypicalExecutionBrief &&
      !nonTypicalGeneratorPending
  )
}

function buildBlockingReasons(
  brief,
  { destinationExists, nonTypicalGeneratorPending = false, planningGate = null }
) {
  const reasons = []
  const navigationGate = planningGate?.navigationGate || resolveNavigationGate({ brief, destinationExists })
  const hostShellDecision = brief.pageGenerationDecision?.hostShellDecision

  if (planningGate?.kind === 'ensure' || planningGate?.kind === 'preflight') {
    return [
      `Project page task gate is not ready (${brief.executionPolicy?.pageTaskGateStatus || 'unknown'}): ${planningGate.reason || 'Run the required hiui-design gate before generating or editing the page.'}`,
    ]
  }

  if (planningGate?.kind === 'page-type-capability') {
    return [planningGate.reason]
  }

  if (planningGate?.kind === 'brief-blocked') {
    return [planningGate.reason]
  }

  if (
    brief.pageGenerationDecision?.navigationDecision?.shouldAutoCreateFormalBusinessShell &&
    hostShellDecision?.officialHostSourceStatus !== 'ready'
  ) {
    reasons.push(
      `Official host-shell source required for the first formal business shell is not ready: ${hostShellDecision?.officialHostSourceReason || 'missing official host-shell source.'}`
    )
  }

  if (!brief.nonTypicalExecutionBrief && !brief.sources.sourceTemplateExists) {
    reasons.push(`Official template is missing: ${brief.sources.sourceTemplatePath}`)
  }

  if (brief.generationContract.baseStylePath && !brief.sources.sourceStyleExists) {
    reasons.push(`Official base style is missing: ${brief.sources.sourceStylePath}`)
  }

  if (navigationGate.blockedForNewEntry) {
    reasons.push(navigationGate.blockReason)
  }

  if (nonTypicalGeneratorPending) {
    reasons.push(
      'Non-typical family generator is not wired yet. This plan stops at nonTypicalExecutionBrief and family composition planning.'
    )
  }

  return reasons
}

function createCommand({ id, phase, command, projectLocalCommand, reason, required = true }) {
  return {
    id,
    phase,
    required,
    command,
    projectLocalCommand,
    reason,
  }
}

const COMMAND_PHASE_TO_EXECUTION_PHASE = Object.freeze({
  'pre-generation': 'ResolveBlockingFacts',
  'post-ensure': 'ResolveBlockingFacts',
  generation: 'GenerateOrEdit',
  'engineering-gate': 'Preflight',
  'project-gate': 'Preflight',
  'formal-acceptance': 'FormalAcceptance',
})

function normalizeRequiredDocEntry(entry) {
  if (typeof entry === 'string') {
    const pathValue = entry.trim()
    if (!pathValue) return null
    return {
      path: pathValue,
      readMode: 'required',
      reason: 'Read this document before writing code because the planner marks it as required.',
    }
  }

  if (!entry || typeof entry !== 'object') return null

  const pathValue = String(entry.path || entry.doc || entry.file || '').trim()
  if (!pathValue) return null

  const readMode = String(entry.readMode || 'required').trim() || 'required'
  const reason = String(entry.reason || '').trim()

  return {
    ...entry,
    path: pathValue,
    readMode,
    reason:
      reason ||
      (readMode === 'required'
        ? 'Read this document before writing code because the planner marks it as required.'
        : readMode === 'conditional'
          ? 'Read this document only when the planner reason for the current task explicitly applies.'
          : 'Reference this document when the current task needs the additional planner context.'),
  }
}

function normalizeRequiredDocs(requiredDocs = []) {
  if (!Array.isArray(requiredDocs)) return []
  return requiredDocs
    .map((entry) => normalizeRequiredDocEntry(entry))
    .filter(Boolean)
}

function mapCommandPhaseToExecutionPhase(phase = '') {
  return COMMAND_PHASE_TO_EXECUTION_PHASE[phase] || 'unknown'
}

function buildPlannerActionFromCommand(command, fallbackStatus = 'pending') {
  if (!command || typeof command !== 'object') return null

  const semanticCommand = String(command.id || '').trim()
  const shellCommand = String(command.command || '').trim()
  const projectLocalCommand = String(command.projectLocalCommand || '').trim()
  const actionCommand = semanticCommand || projectLocalCommand || shellCommand

  if (!actionCommand) return null

  return {
    id: semanticCommand,
    command: actionCommand,
    phase: mapCommandPhaseToExecutionPhase(command.phase),
    status: String(command.status || fallbackStatus).trim() || fallbackStatus,
    shellCommand,
    projectLocalCommand,
    reason: String(command.reason || '').trim(),
    required: command.required !== false,
  }
}

function buildPlannerActionsFromCommands(commands = [], fallbackStatus = 'pending') {
  if (!Array.isArray(commands) || commands.length === 0) return []

  const seen = new Set()
  const actions = []

  for (const command of commands) {
    const action = buildPlannerActionFromCommand(command, fallbackStatus)
    if (!action) continue
    const dedupeKey = `${action.command}::${action.phase}`
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)
    actions.push(action)
  }

  return actions
}

function findNextPendingAction(requiredActions = [], formalAcceptanceActions = []) {
  const allActions = [
    ...(Array.isArray(requiredActions) ? requiredActions : []),
    ...(Array.isArray(formalAcceptanceActions) ? formalAcceptanceActions : []),
  ]

  return (
    allActions.find((action) =>
      ['pending', 'blocked', 'failed'].includes(String(action?.status || '').trim())
    ) || null
  )
}

function resolvePlannerFactsStatus(plan, planningGateKind = '') {
  const staleInputs = Array.isArray(plan.readinessGate?.staleInputs)
    ? plan.readinessGate.staleInputs
    : []

  if (staleInputs.length > 0) return 'stale'

  if (planningGateKind === 'ensure') {
    return plan.integrationReadiness?.status === 'missing-context' ? 'missing' : 'blocked'
  }

  if (planningGateKind === 'preflight') {
    return 'blocked'
  }

  if (planningGateKind === 'navigation-mount') {
    return 'conflict'
  }

  if (planningGateKind === 'page-type-capability' || planningGateKind === 'brief-blocked') {
    return 'blocked'
  }

  if (plan.projectHostContract?.status === 'invalid') {
    return 'conflict'
  }

  if (plan.integrationReadiness?.ready !== true) {
    return plan.integrationReadiness?.status === 'missing-context' ? 'missing' : 'blocked'
  }

  return 'ready'
}

function resolvePlannerPlanStatus(plan, factsStatus, planningGateKind = '') {
  if (planningGateKind) return 'blocked'
  if (factsStatus !== 'ready') return 'blocked'

  const writeReadiness = String(plan.writeReadiness || '').trim()
  if (writeReadiness && !['ready', 'ready-to-generate'].includes(writeReadiness)) {
    return 'blocked'
  }

  return 'ready'
}

function buildPlannerBlockerCodes(plan, factsStatus, planningGateKind = '') {
  const codes = []

  if (planningGateKind === 'ensure') {
    codes.push('PROJECT_INTEGRATION_BLOCKED')
  } else if (planningGateKind === 'preflight') {
    codes.push('PAGE_TASK_GATE_BLOCKED')
  } else if (planningGateKind === 'page-type-capability') {
    codes.push('PAGE_TYPE_CAPABILITY_BLOCKED')
  } else if (planningGateKind === 'navigation-mount') {
    codes.push('NAVIGATION_MOUNT_BLOCKED')
  } else if (planningGateKind === 'brief-blocked') {
    codes.push('GENERATION_BRIEF_BLOCKED')
  } else if (planningGateKind === 'generator-pending') {
    codes.push('FAMILY_GENERATOR_PENDING')
  }

  if (factsStatus === 'stale') {
    codes.push('PROJECT_FACTS_STALE')
  } else if (factsStatus === 'conflict') {
    codes.push('PROJECT_FACTS_CONFLICT')
  } else if (factsStatus === 'missing') {
    codes.push('PROJECT_FACTS_MISSING')
  } else if (factsStatus === 'blocked' && codes.length === 0) {
    codes.push('PROJECT_FACTS_BLOCKED')
  }

  return [...new Set(codes)]
}

function buildCurrentExecutionState({
  plan,
  planningGateKind = '',
  canStartImplementation = false,
  requiredActions = [],
  formalAcceptanceActions = [],
  factsStatus = 'unknown',
}) {
  const nextAction = findNextPendingAction(requiredActions, formalAcceptanceActions)

  if (!canStartImplementation) {
    return {
      status: 'blocked',
      primaryAction: 'ResolveBlockingFacts',
      currentPhase: nextAction?.phase || 'ResolveBlockingFacts',
      nextCommand: nextAction?.command || '',
      blockerCodes: buildPlannerBlockerCodes(plan, factsStatus, planningGateKind),
    }
  }

  return {
    status: 'ready',
    primaryAction: 'generate-by-page-component-slot-fill',
    currentPhase: nextAction?.phase || 'GenerateOrEdit',
    nextCommand: nextAction?.command || '',
    blockerCodes: [],
  }
}

function buildPlannerContractFields(
  plan,
  {
    planningGateKind = '',
    requiredActions = null,
    formalAcceptanceActions = null,
  } = {},
) {
  const normalizedRequiredDocs = normalizeRequiredDocs(plan.requiredDocs)
  const resolvedRequiredActions = Array.isArray(requiredActions)
    ? requiredActions
    : buildPlannerActionsFromCommands(plan.requiredCommands)
  const resolvedFormalAcceptanceActions = Array.isArray(formalAcceptanceActions)
    ? formalAcceptanceActions
    : buildPlannerActionsFromCommands(plan.formalAcceptanceCommands)
  const factsStatus = resolvePlannerFactsStatus(plan, planningGateKind)
  const planStatus = resolvePlannerPlanStatus(plan, factsStatus, planningGateKind)
  const canStartImplementation =
    planStatus === 'ready' &&
    factsStatus === 'ready' &&
    resolvedRequiredActions.some((action) => action.phase === 'GenerateOrEdit')

  return {
    ...plan,
    requiredDocs: normalizedRequiredDocs,
    plan: {
      status: planStatus,
      sourceSkill: 'hiui-design',
      blockingIssues: Array.isArray(plan.blockingReasons) ? plan.blockingReasons : [],
    },
    facts: {
      status: factsStatus,
      integrationReadinessStatus: plan.integrationReadiness?.status || 'unknown',
      projectHostContractStatus: plan.projectHostContract?.status || 'unknown',
      writeReadiness: String(plan.writeReadiness || '').trim() || 'unknown',
      blockingIssues: Array.isArray(plan.blockingReasons) ? plan.blockingReasons : [],
    },
    canStartImplementation,
    currentExecutionState: buildCurrentExecutionState({
      plan,
      planningGateKind,
      canStartImplementation,
      requiredActions: resolvedRequiredActions,
      formalAcceptanceActions: resolvedFormalAcceptanceActions,
      factsStatus,
    }),
    requiredActions: resolvedRequiredActions,
    formalAcceptanceActions: resolvedFormalAcceptanceActions,
    deliverySummaryProfile: 'plan-page-task.v1',
    acceptanceProfile: {
      formalRequired: resolvedFormalAcceptanceActions.length > 0,
    },
  }
}

function formatRequiredDocDisplay(doc) {
  if (typeof doc === 'string') return doc
  if (!doc || typeof doc !== 'object') return '—'

  const pathValue = String(doc.path || '').trim() || '—'
  const readMode = String(doc.readMode || '').trim()
  const reason = String(doc.reason || '').trim()

  return `${pathValue}${readMode ? ` [${readMode}]` : ''}${reason ? ` — ${reason}` : ''}`
}

function renderDeferredBriefShapingArgs(entries = []) {
  if (!Array.isArray(entries) || entries.length === 0) return '—'
  return entries.map((item) => `${item.flag}${item.value ? `=${item.value}` : ''}`).join(', ')
}

function buildGateAdviceNotes(gateAdvice = null) {
  if (!gateAdvice) return []
  const untilLabel = gateAdvice.untilLabel || 'until ensure succeeds'

  const notes = [
    `Minimal gate strategy: use only ${Array.isArray(gateAdvice.preferredFlags) && gateAdvice.preferredFlags.length > 0 ? gateAdvice.preferredFlags.join(', ') : '--target, --mode'} ${untilLabel}.`,
  ]

  if (
    Array.isArray(gateAdvice.deferredBriefShapingArgs) &&
    gateAdvice.deferredBriefShapingArgs.length > 0
  ) {
    notes.push(
      `Deferred brief-shaping args for rerun after ensure: ${renderDeferredBriefShapingArgs(gateAdvice.deferredBriefShapingArgs)}.`,
    )
  }

  return notes
}

function shouldRunMinimalGateProbe({ options, pageTaskGate }) {
  if (!pageTaskGate || pageTaskGate.nextStage === 'ready-to-generate') return false
  return !options.briefFile && !options.pageType && !options.pageFamily
}

function buildMinimalGateProbePlan({
  options,
  targetRoot,
  skillRoot,
  pageTaskGate,
  relatedPageResolution,
  legacyAutoAssembly,
}) {
  const gateKind = pageTaskGate.integrationReadiness?.ready ? 'preflight' : 'ensure'
  const nextStepCommand = pageTaskGate.nextCommand
    ? createCommand({
        id: gateKind === 'preflight' ? 'typical-page-preflight' : 'typical-page-ensure',
        phase: 'pre-generation',
        command: pageTaskGate.nextCommand,
        projectLocalCommand: pageTaskGate.nextCommand,
        reason: pageTaskGate.reason,
      })
    : null
  const gateAdvice = {
    strategy: 'minimal-gate-probe',
    preferredFlags: ['--target', ...(options.mode && options.mode !== 'auto' ? ['--mode'] : [])],
    untilLabel:
      gateKind === 'ensure' ? 'until ensure succeeds' : 'until typical-page:preflight passes',
    deferredBriefShapingArgs: [],
  }

  const basePlan = {
    schemaVersion: 1,
    schema: 'hiui-design-plan-page-task.v1',
    targetRoot,
    skillRoot,
    mode:
      pageTaskGate.integrationReadiness?.appliedMode ||
      (options.mode && options.mode !== 'auto' ? options.mode : 'auto'),
    inputMode: options.inputMode || '',
    localizationMode: options.localizationMode || 'none',
    inputModeResolution: {
      requestedInputMode: options.inputMode || 'auto',
      effectiveInputMode: options.inputMode || '',
      autoDetectedLegacyReconstruction: false,
      promptMatchedLegacySignals: legacyAutoAssembly.report?.promptMatched === true,
      promptConfidence: legacyAutoAssembly.report?.promptConfidence || 'low',
      promptReasons: legacyAutoAssembly.report?.promptReasons || [],
      evidenceSummary: legacyAutoAssembly.report?.evidenceSummary || [],
      sourceCodePaths: legacyAutoAssembly.report?.sourceCodePaths || [],
      layoutFacts: legacyAutoAssembly.report?.layoutFacts || [],
      invariants: legacyAutoAssembly.report?.invariants || [],
    },
    relatedPageResolution,
    pageSelector: {
      kind: 'deferred-until-gate-ready',
      id: 'selector-deferred',
      label: 'selector-deferred',
    },
    topology: {
      projectType: pageTaskGate.integrationReadiness?.hostCompatibility?.hostProfile?.projectType || '',
      framework: pageTaskGate.integrationReadiness?.hostCompatibility?.hostProfile?.framework || '',
      runtime: pageTaskGate.integrationReadiness?.hostCompatibility?.hostProfile?.runtime || '',
      routing: pageTaskGate.integrationReadiness?.hostCompatibility?.hostProfile?.routing || '',
      integrationReadinessStatus: pageTaskGate.integrationReadiness?.status || 'unknown',
      projectHostContractStatus: pageTaskGate.projectHostContract?.status || 'unknown',
      projectHostContractPath: pageTaskGate.projectHostContract?.path || '',
      hostCapabilityStatus: 'not-requested',
      formalHostAction:
        gateKind === 'ensure' ? 'blocked-until-ensure' : 'blocked-until-preflight',
      navigationBlocked: false,
      navigationBlockedByRawDetection: false,
      navigationExecutionStatus:
        gateKind === 'ensure' ? 'deferred-until-ensure' : 'deferred-until-preflight',
      requiresManualNavigationRegistration: false,
      formalNavigationRegistryPath: '',
    },
    navigationMountDecision: {
      existingBusinessNavigation: 'missing',
      action: 'ask-user',
      routeRegistryPath: '',
      menuRegistryPath: '',
      formalShellPath: '',
      shellSource: 'unknown',
      reason:
        gateKind === 'ensure'
          ? 'Project integration is not ready yet, so navigation mount analysis is deferred.'
          : 'Project page-task gate is still closed, so navigation mount analysis is deferred.',
    },
    navigationMountAction: {
      action: 'ask-user',
      targetShellPath: '',
      targetRegistryPath: '',
      appEntryPath: '',
      pageRoutePath: '',
      menuTitle: '',
      mustDoBeforePageCode: true,
      reason:
        gateKind === 'ensure'
          ? 'Project integration is not ready yet, so navigation mount action is deferred.'
          : 'Project page-task gate is still closed, so navigation mount action is deferred.',
    },
    integrationReadiness: pageTaskGate.integrationReadiness,
    projectHostContract: pageTaskGate.projectHostContract || null,
    navigationExecution: {
      blocked: false,
      status: gateKind === 'ensure' ? 'deferred-until-ensure' : 'deferred-until-preflight',
      blockedBy: [],
      reason:
        gateKind === 'ensure'
          ? 'Project-local hiui-design context and apply-state are not ready yet.'
          : 'Page-task gate is still closed until typical-page:preflight passes.',
      requiresManualNavigationRegistration: false,
    },
    pageRelationDecision: {
      kind: 'undetermined',
      confidence: 'low',
      reason: 'Minimal gate probe intentionally defers page relation inference until the planner can assemble a full brief.',
      evidence: [],
    },
    requestedPageTypeStatus: 'not-requested',
    requestedPageTypeReason:
      'Minimal gate probe defers page selector, template selection, and navigation planning until the gate is open.',
    writeReadiness: 'blocked-by-page-task-gate',
    gateAdvice,
    pageType: '',
    pageFamily: '',
    pageUnits: [],
    nonTypicalExecutionBrief: null,
    taskLevel: '',
    startFrom: {
      kind: gateKind === 'ensure' ? 'blocked-until-ensure' : 'blocked-until-preflight',
      sourceTemplatePath: '',
      preferredTemplatePath: '',
      requiredShell: '',
      generationPath: '',
      generationPathLabel: '',
      reason:
        gateKind === 'ensure'
          ? 'Project-local hiui-design context and appliedMode must be ensured before page selector resolution.'
          : 'Project integration is present, but the page-task gate is still closed until typical-page:preflight passes.',
      targetBusinessPath: '',
    },
    readinessGate: {
      status: pageTaskGate.status,
      reason: pageTaskGate.reason,
      nextRequiredAction: pageTaskGate.nextRequiredAction || '',
      staleInputs: pageTaskGate.staleInputs || [],
      canAutoRecover: pageTaskGate.canAutoRecover === true,
      contractSnapshotId: pageTaskGate.contractSnapshotId || '',
    },
    requiredDocs: [],
    blockingReasons: pageTaskGate.reason ? [pageTaskGate.reason] : [],
    allowedActions: Array.isArray(pageTaskGate.allowedActions) ? pageTaskGate.allowedActions : [],
    forbiddenActions: Array.isArray(pageTaskGate.forbiddenActions) ? pageTaskGate.forbiddenActions : [],
    requiredCommands: nextStepCommand ? [nextStepCommand] : [],
    nextStepCommand,
    resumeAfterEnsureCommand: buildResumeAfterGateCommand({
      options,
      targetRoot,
      skillRoot,
      gateKind,
    }),
    formalAcceptanceCommands: [],
    notes: [
      'This planner is running as a minimal gate probe, so page selector resolution is intentionally deferred.',
      gateKind === 'ensure'
        ? 'Project integration is not ready yet. Read nextStepCommand, run ensure, and rerun the planner with page-shaping args after ensure succeeds.'
        : 'Project page-task gate is still closed. Read nextStepCommand, run typical-page:preflight, and rerun the planner with page-shaping args after preflight succeeds.',
      ...buildGateAdviceNotes(gateAdvice),
    ],
  }

  return buildPlannerContractFields(basePlan, {
    planningGateKind: gateKind,
  })
}

function buildPageTaskGateCommand({ brief, targetRoot, skillRoot }) {
  if (!brief.executionPolicy?.pageTaskGateStatus) return null
  if (brief.executionPolicy?.pageTaskGateStatus === 'ready-to-generate') return null

  if (!brief.integrationReadiness?.ready) {
    const ensureScript = path.join(skillRoot, 'scripts', 'ensure-in-current-project.mjs')
    const commandParts = [
      `node ${shellQuote(ensureScript)}`,
      `--target ${shellQuote(targetRoot)}`,
      `--mode ${shellQuote(brief.mode)}`,
    ]
    const projectLocalCommandParts = [
      'node .local-context/hiui-design/scripts/ensure-in-current-project.mjs',
      `--mode ${shellQuote(brief.mode)}`,
    ]

    if (brief.line) {
      commandParts.push(`--line ${shellQuote(brief.line)}`)
      projectLocalCommandParts.push(`--line ${shellQuote(brief.line)}`)
    }

    return createCommand({
      id: 'typical-page-ensure',
      phase: 'pre-generation',
      command: commandParts.join(' '),
      projectLocalCommand:
        brief.integrationReadiness?.status === 'missing-context' ? '' : projectLocalCommandParts.join(' '),
      reason:
        'Materialize the project-local hiui-design context and a legal appliedMode before any generation or managed page edit starts.',
    })
  }

  return createCommand({
    id: 'typical-page-preflight',
    phase: 'pre-generation',
    command: brief.executionPolicy?.pageTaskGateNextCommand || '',
    projectLocalCommand: brief.executionPolicy?.pageTaskGateNextCommand || '',
    reason:
      brief.executionPolicy?.pageTaskGateReason ||
      'Run typical-page:preflight and reopen the page-task gate before any generation or managed page edit starts.',
  })
}

function pushCommandArg(parts, flag, value) {
  if (!value && value !== false) return
  const normalizedValue = String(value)
  if (!normalizedValue) return
  parts.push(flag, shellQuote(normalizedValue))
}

function buildGeneratePageAction({
  brief,
  options,
  targetRoot,
  skillRoot,
  relatedPagePath = '',
}) {
  const pageTypeId = String(brief?.pageType?.id || '').trim()
  const targetBusinessPath = String(
    brief?.requestedBusiness?.targetBusinessPath || brief?.requestedBusiness?.dest || ''
  ).trim()
  const title = String(brief?.requestedBusiness?.title || '').trim()

  if (!pageTypeId || !targetBusinessPath || !title) return null

  const scriptPath = path.join(skillRoot, 'scripts', 'generate-page.mjs')
  const commandParts = [
    `node ${shellQuote(scriptPath)}`,
    '--target',
    shellQuote(targetRoot),
    '--page-type',
    shellQuote(pageTypeId),
    '--dest',
    shellQuote(targetBusinessPath),
    '--title',
    shellQuote(title),
  ]
  const projectLocalCommandParts = [
    'node .local-context/hiui-design/scripts/generate-page.mjs',
    '--page-type',
    shellQuote(pageTypeId),
    '--dest',
    shellQuote(targetBusinessPath),
    '--title',
    shellQuote(title),
  ]

  pushCommandArg(commandParts, '--mode', brief.mode)
  pushCommandArg(projectLocalCommandParts, '--mode', brief.mode)
  pushCommandArg(commandParts, '--input-mode', brief.inputMode?.id || '')
  pushCommandArg(projectLocalCommandParts, '--input-mode', brief.inputMode?.id || '')
  pushCommandArg(commandParts, '--localization-mode', brief.localizationMode || '')
  pushCommandArg(projectLocalCommandParts, '--localization-mode', brief.localizationMode || '')
  pushCommandArg(commandParts, '--related-page-path', relatedPagePath)
  pushCommandArg(projectLocalCommandParts, '--related-page-path', relatedPagePath)
  pushCommandArg(commandParts, '--route-path', brief.requestedBusiness?.routePath || '')
  pushCommandArg(projectLocalCommandParts, '--route-path', brief.requestedBusiness?.routePath || '')
  pushCommandArg(commandParts, '--feedback-variant-id', brief.requestedBusiness?.feedbackVariantId || '')
  pushCommandArg(
    projectLocalCommandParts,
    '--feedback-variant-id',
    brief.requestedBusiness?.feedbackVariantId || '',
  )

  if (
    Array.isArray(brief.requestedBusiness?.detailSections) &&
    brief.requestedBusiness.detailSections.length > 0
  ) {
    const detailSectionsJson = JSON.stringify(brief.requestedBusiness.detailSections)
    pushCommandArg(commandParts, '--detail-sections-json', detailSectionsJson)
    pushCommandArg(projectLocalCommandParts, '--detail-sections-json', detailSectionsJson)
  }

  if (brief.pageAdjustmentContract) {
    const pageAdjustmentContractJson = JSON.stringify(brief.pageAdjustmentContract)
    pushCommandArg(commandParts, '--page-adjustment-contract', pageAdjustmentContractJson)
    pushCommandArg(projectLocalCommandParts, '--page-adjustment-contract', pageAdjustmentContractJson)
  }

  pushCommandArg(commandParts, '--confirmed-generation-input-json', options.confirmedGenerationInputJson)
  pushCommandArg(
    projectLocalCommandParts,
    '--confirmed-generation-input-json',
    options.confirmedGenerationInputJson,
  )
  pushCommandArg(
    commandParts,
    '--confirmed-design-restore-input-json',
    options.confirmedDesignRestoreInputJson,
  )
  pushCommandArg(
    projectLocalCommandParts,
    '--confirmed-design-restore-input-json',
    options.confirmedDesignRestoreInputJson,
  )
  pushCommandArg(commandParts, '--navigation-mount-contract', options.navigationMountContract)
  pushCommandArg(
    projectLocalCommandParts,
    '--navigation-mount-contract',
    options.navigationMountContract,
  )
  pushCommandArg(
    commandParts,
    '--legacy-reconstruction-input-json',
    options.legacyReconstructionInputJson,
  )
  pushCommandArg(
    projectLocalCommandParts,
    '--legacy-reconstruction-input-json',
    options.legacyReconstructionInputJson,
  )
  pushCommandArg(
    commandParts,
    '--migration-invariant-contract-json',
    options.migrationInvariantContractJson,
  )
  pushCommandArg(
    projectLocalCommandParts,
    '--migration-invariant-contract-json',
    options.migrationInvariantContractJson,
  )
  pushCommandArg(
    commandParts,
    '--analytics-refactor-contract-json',
    options.analyticsRefactorContractJson,
  )
  pushCommandArg(
    projectLocalCommandParts,
    '--analytics-refactor-contract-json',
    options.analyticsRefactorContractJson,
  )
  pushCommandArg(commandParts, '--telemetry-prompt', options.telemetryPrompt)
  pushCommandArg(projectLocalCommandParts, '--telemetry-prompt', options.telemetryPrompt)
  pushCommandArg(commandParts, '--telemetry-prompt-file', options.telemetryPromptFile)
  pushCommandArg(projectLocalCommandParts, '--telemetry-prompt-file', options.telemetryPromptFile)
  commandParts.push('--validation-profile', shellQuote('light'), '--json')
  projectLocalCommandParts.push('--validation-profile', shellQuote('light'), '--json')

  return {
    command: 'generate-page',
    phase: 'GenerateOrEdit',
    status: 'pending',
    shellCommand: commandParts.join(' '),
    projectLocalCommand: projectLocalCommandParts.join(' '),
    reason:
      'Run the official single-entry typical page generation closure so template write, business slots, and light slot validation stay on the managed path.',
    required: true,
  }
}

function buildExecuteNonTypicalPageTaskAction({
  brief,
  options,
  targetRoot,
  skillRoot,
}) {
  const targetBusinessPath = String(
    brief?.requestedBusiness?.targetBusinessPath || brief?.requestedBusiness?.dest || ''
  ).trim()
  const title = String(brief?.requestedBusiness?.title || '').trim()
  const nonTypicalConversationOutputJson =
    options.nonTypicalConversationOutputJson ||
    (brief?.nonTypicalConversationOutput
      ? JSON.stringify(brief.nonTypicalConversationOutput)
      : '')

  if (!targetBusinessPath || !title || !nonTypicalConversationOutputJson) return null

  const scriptPath = path.join(skillRoot, 'scripts', 'execute-non-typical-page-task.mjs')
  const commandParts = [
    `node ${shellQuote(scriptPath)}`,
    '--target',
    shellQuote(targetRoot),
    '--page-family',
    shellQuote('non-typical-page'),
    '--mode',
    shellQuote(brief.mode || 'auto'),
    '--dest',
    shellQuote(targetBusinessPath),
    '--title',
    shellQuote(title),
    '--non-typical-conversation-output-json',
    shellQuote(nonTypicalConversationOutputJson),
  ]
  const projectLocalCommandParts = [
    'node .local-context/hiui-design/scripts/execute-non-typical-page-task.mjs',
    '--page-family',
    shellQuote('non-typical-page'),
    '--mode',
    shellQuote(brief.mode || 'auto'),
    '--dest',
    shellQuote(targetBusinessPath),
    '--title',
    shellQuote(title),
    '--non-typical-conversation-output-json',
    shellQuote(nonTypicalConversationOutputJson),
  ]

  pushCommandArg(commandParts, '--input-mode', brief.inputMode?.id || '')
  pushCommandArg(projectLocalCommandParts, '--input-mode', brief.inputMode?.id || '')
  pushCommandArg(commandParts, '--route-path', brief.requestedBusiness?.routePath || '')
  pushCommandArg(projectLocalCommandParts, '--route-path', brief.requestedBusiness?.routePath || '')
  pushCommandArg(commandParts, '--confirmed-generation-input-json', options.confirmedGenerationInputJson)
  pushCommandArg(
    projectLocalCommandParts,
    '--confirmed-generation-input-json',
    options.confirmedGenerationInputJson,
  )
  pushCommandArg(
    commandParts,
    '--confirmed-design-restore-input-json',
    options.confirmedDesignRestoreInputJson,
  )
  pushCommandArg(
    projectLocalCommandParts,
    '--confirmed-design-restore-input-json',
    options.confirmedDesignRestoreInputJson,
  )
  pushCommandArg(commandParts, '--navigation-mount-contract', options.navigationMountContract)
  pushCommandArg(
    projectLocalCommandParts,
    '--navigation-mount-contract',
    options.navigationMountContract,
  )
  pushCommandArg(commandParts, '--telemetry-prompt', options.telemetryPrompt)
  pushCommandArg(projectLocalCommandParts, '--telemetry-prompt', options.telemetryPrompt)
  pushCommandArg(commandParts, '--telemetry-prompt-file', options.telemetryPromptFile)
  pushCommandArg(projectLocalCommandParts, '--telemetry-prompt-file', options.telemetryPromptFile)
  commandParts.push('--json')
  projectLocalCommandParts.push('--json')

  return {
    command: 'execute-non-typical-page-task',
    phase: 'GenerateOrEdit',
    status: 'pending',
    shellCommand: commandParts.join(' '),
    projectLocalCommand: projectLocalCommandParts.join(' '),
    reason:
      'Run the public non-typical page execution closure so planner, family generator, and light sanity stay on the validated workflow.',
    required: true,
  }
}

function buildWorkflowRequiredActions({
  plan,
  planningGateKind = '',
  brief = null,
  options = {},
  targetRoot = '',
  skillRoot = '',
  relatedPagePath = '',
}) {
  if (planningGateKind) {
    return buildPlannerActionsFromCommands(plan.requiredCommands)
  }

  const actions = []

  if (brief?.pageSelector?.kind === 'page-family' && plan.nonTypicalExecutionBrief) {
    const executeNonTypicalAction = buildExecuteNonTypicalPageTaskAction({
      brief,
      options,
      targetRoot,
      skillRoot,
    })
    if (executeNonTypicalAction) actions.push(executeNonTypicalAction)
  } else {
    const generatePageAction = buildGeneratePageAction({
      brief,
      options,
      targetRoot,
      skillRoot,
      relatedPagePath,
    })
    if (generatePageAction) actions.push(generatePageAction)
  }

  actions.push(
    ...buildPlannerActionsFromCommands(
      Array.isArray(plan.requiredCommands)
        ? plan.requiredCommands.filter((command) => command?.phase === 'project-gate')
        : [],
    ),
  )

  return actions.length > 0 ? actions : buildPlannerActionsFromCommands(plan.requiredCommands)
}

function appendNonTypicalBriefArgs(parts, brief, { useTargetPlaceholder = false } = {}) {
  parts.push('--target', useTargetPlaceholder ? '"$PWD"' : shellQuote(brief.targetRoot))
  parts.push('--page-family', shellQuote(brief.pageSelector?.id || brief.pageType?.pageFamily || ''))
  parts.push('--mode', shellQuote(brief.mode))
  parts.push('--input-mode', shellQuote(brief.inputMode?.id || brief.inputMode || ''))
  parts.push(
    '--dest',
    shellQuote(brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || '')
  )
  parts.push('--title', shellQuote(brief.requestedBusiness?.title || ''))

  if (brief.confirmedGenerationInput) {
    parts.push(
      '--confirmed-generation-input-json',
      shellQuote(JSON.stringify(brief.confirmedGenerationInput))
    )
  }
  if (brief.confirmedDesignRestoreInput) {
    parts.push(
      '--confirmed-design-restore-input-json',
      shellQuote(JSON.stringify(brief.confirmedDesignRestoreInput))
    )
  }

  if (brief.nonTypicalConversationOutput) {
    parts.push(
      '--non-typical-conversation-output-json',
      shellQuote(JSON.stringify(brief.nonTypicalConversationOutput))
    )
  }
}

function appendOptionalNavigationMountContract(parts, navigationMountContract) {
  if (!navigationMountContract) return
  parts.push('--navigation-mount-contract', shellQuote(navigationMountContract))
}

function appendOptionalRelatedPagePath(parts, relatedPagePath) {
  if (!relatedPagePath) return
  parts.push('--related-page-path', shellQuote(relatedPagePath))
}

function buildResumeAfterGateCommand({ options, targetRoot, skillRoot, gateKind }) {
  const scriptPath = path.join(skillRoot, 'scripts', 'plan-page-task.mjs')
  const commandParts = [
    `node ${shellQuote(scriptPath)}`,
    '--target',
    shellQuote(targetRoot),
  ]

  if (options.pageType) {
    commandParts.push('--page-type', shellQuote(options.pageType))
  }
  if (options.pageFamily) {
    commandParts.push('--page-family', shellQuote(options.pageFamily))
  }

  pushCommandArg(commandParts, '--mode', options.mode)
  pushCommandArg(commandParts, '--input-mode', options.inputMode)
  pushCommandArg(commandParts, '--localization-mode', options.localizationMode)
  pushCommandArg(commandParts, '--line', options.line)
  pushCommandArg(commandParts, '--dest', options.dest)
  pushCommandArg(commandParts, '--related-page-path', options.relatedPagePath)
  pushCommandArg(commandParts, '--title', options.title)
  pushCommandArg(commandParts, '--route-path', options.routePath)
  pushCommandArg(commandParts, '--detail-sections-json', options.detailSectionsJson)
  pushCommandArg(commandParts, '--feedback-variant-id', options.feedbackVariantId)
  pushCommandArg(commandParts, '--page-adjustment-contract', options.pageAdjustmentContract)
  pushCommandArg(commandParts, '--confirmed-generation-input-json', options.confirmedGenerationInputJson)
  pushCommandArg(
    commandParts,
    '--confirmed-design-restore-input-json',
    options.confirmedDesignRestoreInputJson
  )
  pushCommandArg(
    commandParts,
    '--non-typical-conversation-output-json',
    options.nonTypicalConversationOutputJson
  )
  pushCommandArg(commandParts, '--navigation-mount-contract', options.navigationMountContract)
  pushCommandArg(commandParts, '--legacy-reconstruction-input-json', options.legacyReconstructionInputJson)
  pushCommandArg(commandParts, '--migration-invariant-contract-json', options.migrationInvariantContractJson)
  pushCommandArg(commandParts, '--analytics-refactor-contract-json', options.analyticsRefactorContractJson)
  pushCommandArg(commandParts, '--task-level', options.taskLevel)
  pushCommandArg(commandParts, '--telemetry-prompt', options.telemetryPrompt)
  pushCommandArg(commandParts, '--telemetry-prompt-file', options.telemetryPromptFile)

  if (options.json) {
    commandParts.push('--json')
  }

  return createCommand({
    id: gateKind === 'preflight' ? 'rerun-plan-after-preflight' : 'rerun-plan-after-ensure',
    phase: 'post-ensure',
    command: commandParts.join(' '),
    projectLocalCommand: '',
    reason:
      gateKind === 'preflight'
        ? 'After typical-page:preflight reopens the page-task gate, rerun the planner to recover template selection, slot boundaries, navigation gating, and acceptance commands.'
        : 'After ensure materializes the local hiui-design context and apply-state, rerun the planner to recover template selection, slot boundaries, navigation gating, and acceptance commands.',
  })
}

function buildNonTypicalGeneratorCommand({
  brief,
  skillRoot,
  navigationMountContract = '',
  relatedPagePath = '',
}) {
  const generatorScript = path.join(skillRoot, 'scripts', 'generate-page-from-brief.mjs')
  const commandParts = [`node ${shellQuote(generatorScript)}`]
  const projectLocalCommandParts = ['node .local-context/hiui-design/scripts/generate-page-from-brief.mjs']

  appendNonTypicalBriefArgs(commandParts, brief)
  appendNonTypicalBriefArgs(projectLocalCommandParts, brief, { useTargetPlaceholder: true })
  appendOptionalNavigationMountContract(commandParts, navigationMountContract)
  appendOptionalNavigationMountContract(projectLocalCommandParts, navigationMountContract)
  appendOptionalRelatedPagePath(commandParts, relatedPagePath)
  appendOptionalRelatedPagePath(projectLocalCommandParts, relatedPagePath)

  if (brief.requestedBusiness?.routePath) {
    commandParts.push('--route-path', shellQuote(brief.requestedBusiness.routePath))
    projectLocalCommandParts.push('--route-path', shellQuote(brief.requestedBusiness.routePath))
  }

  commandParts.push('--json')
  projectLocalCommandParts.push('--json')

  return createCommand({
    id: 'run-family-generator',
    phase: 'generation',
    command: commandParts.join(' '),
    projectLocalCommand: projectLocalCommandParts.join(' '),
    reason:
      'Run the family generator from the validated nonTypicalExecutionBrief and write the page files before light sanity checks.',
  })
}

function buildRequiredCommands({
  brief,
  targetRoot,
  pageFilePath,
  styleFilePath,
  skillRoot,
  planningGate,
  nonTypicalGeneratorPending = false,
  navigationMountContract = '',
}) {
  const commands = []
  const gateCommand = buildPageTaskGateCommand({ brief, targetRoot, skillRoot })
  const slotGateScript = path.join(skillRoot, 'scripts', 'typical-page-slot-gate.mjs')
  const nonTypicalSanityScript = path.join(skillRoot, 'scripts', 'non-typical-page-sanity.mjs')
  const copyMode = String(brief.pageGenerationDecision?.copyMode || '').trim()
  const nonTypicalFamilyReady = isNonTypicalFamilyReady(brief, {
    nonTypicalGeneratorPending,
  })

  if (gateCommand) {
    commands.push(gateCommand)
  }

  if (
    planningGate?.kind === 'ensure' ||
    planningGate?.kind === 'preflight' ||
    planningGate?.kind === 'brief-blocked'
  ) {
    return commands
  }

  if (planningGate?.kind === 'page-type-capability' || planningGate?.kind === 'navigation-mount') {
    return commands
  }

  if (nonTypicalGeneratorPending) {
    return commands
  }

  if (nonTypicalFamilyReady) {
    const sanityParts = [`node ${shellQuote(nonTypicalSanityScript)}`]
    const localSanityParts = ['node .local-context/hiui-design/scripts/non-typical-page-sanity.mjs']
    appendNonTypicalBriefArgs(sanityParts, brief)
    appendNonTypicalBriefArgs(localSanityParts, brief, { useTargetPlaceholder: true })
    appendOptionalNavigationMountContract(sanityParts, navigationMountContract)
    appendOptionalNavigationMountContract(localSanityParts, navigationMountContract)
    sanityParts.push('--json')
    localSanityParts.push('--json')

    commands.push(
      createCommand({
        id: 'non-typical-page-sanity',
        phase: 'engineering-gate',
        command: sanityParts.join(' '),
        projectLocalCommand: localSanityParts.join(' '),
        reason:
          'Validate the generated non-typical page against the execution brief, runtime primitives, metadata, and design mapping plan.',
      }),
    )

    return commands
  }

  const slotGateParts = [
    `node ${shellQuote(slotGateScript)}`,
    `--page-type ${shellQuote(brief.pageType.id)}`,
    `--page ${shellQuote(pageFilePath)}`,
  ]
  const localSlotGateParts = [
    'node .local-context/hiui-design/scripts/typical-page-slot-gate.mjs',
    `--page-type ${shellQuote(brief.pageType.id)}`,
    `--page ${shellQuote(relativeOrAbsolute(targetRoot, pageFilePath))}`,
  ]
  const defaultBusinessPageDir = String(
    brief.requestedBusiness?.defaultBusinessPageDir || ''
  ).trim()

  if (copyMode) {
    slotGateParts.push(`--copy-mode ${shellQuote(copyMode)}`)
    localSlotGateParts.push(`--copy-mode ${shellQuote(copyMode)}`)
  }

  if (defaultBusinessPageDir) {
    slotGateParts.push(`--default-business-page-dir ${shellQuote(defaultBusinessPageDir)}`)
    localSlotGateParts.push(`--default-business-page-dir ${shellQuote(defaultBusinessPageDir)}`)
  }

  if (styleFilePath) {
    slotGateParts.push(`--style ${shellQuote(styleFilePath)}`)
    localSlotGateParts.push(`--style ${shellQuote(relativeOrAbsolute(targetRoot, styleFilePath))}`)
  }
  slotGateParts.push('--json')
  localSlotGateParts.push('--json')

  commands.push(
    createCommand({
      id: 'typical-page-slot-gate',
      phase: 'engineering-gate',
      command: slotGateParts.join(' '),
      projectLocalCommand: localSlotGateParts.join(' '),
      reason: 'Check slot boundaries, locked regions, and shell ownership after the page is written.',
    }),
  )

  return commands
}

function buildBriefBlockedRecoveryCommand({ brief, packageManager, planningGate }) {
  if (planningGate?.kind !== 'brief-blocked') return null
  if (planningGate.status !== 'blocked-by-project-host-contract') return null

  const command = buildPreflightCommand({
    packageManager,
    mode: brief.mode,
  })

  return createCommand({
    id: 'typical-page-preflight',
    phase: 'pre-generation',
    command,
    projectLocalCommand: command,
    reason:
      planningGate.reason ||
      'Refresh PROJECT_HOST_CONTRACT.json with typical-page:preflight before rerunning the planner.',
  })
}

function buildManagedMfHostContractAutofixCommand({ brief }) {
  const command = String(brief.executionPolicy?.requestedPageTypeNextCommand || '').trim()
  if (!command) return null

  return createCommand({
    id: 'managed-mf-host-contract-autofix',
    phase: 'pre-generation',
    command,
    projectLocalCommand: command,
    reason:
      brief.executionPolicy?.requestedPageTypePreWriteActionReason ||
      'Materialize the minimal managed MF host contract and publish entry before rerunning preflight.',
  })
}

function buildLegacyMfSharedContractAutofixCommand({ brief }) {
  const command = String(brief.executionPolicy?.requestedPageTypeNextCommand || '').trim()
  if (!command) return null

  return createCommand({
    id: 'legacy-mf-shared-contract-autofix',
    phase: 'pre-generation',
    command,
    projectLocalCommand: command,
    reason:
      brief.executionPolicy?.requestedPageTypePreWriteActionReason ||
      'Repair the legacy MF host shared contract before rerunning preflight.',
  })
}

function buildPreflightAfterManagedMfAutofixCommand({ brief, packageManager }) {
  const command = `${buildRunScriptCommand(packageManager, 'typical-page:preflight')} -- --mode ${shellQuote(brief.mode)}`

  return createCommand({
    id: 'typical-page-preflight',
    phase: 'pre-generation',
    command,
    projectLocalCommand: command,
    reason:
      'The managed MF host contract autofix resets the page-task gate to ensure-only; rerun preflight so contract-first evidence can reopen generation.',
  })
}

function buildPreflightAfterLegacyMfSharedContractAutofixCommand({ brief, packageManager }) {
  const command = `${buildRunScriptCommand(packageManager, 'typical-page:preflight')} -- --mode ${shellQuote(brief.mode)}`

  return createCommand({
    id: 'typical-page-preflight',
    phase: 'pre-generation',
    command,
    projectLocalCommand: command,
    reason:
      'The legacy MF shared-contract autofix resets the page-task gate to ensure-only; rerun preflight so runtime-baseline evidence can reopen generation.',
  })
}

function resolveManagedMfHostContractAutofixPlan({
  brief,
  options,
  targetRoot,
  skillRoot,
  packageManager,
  planningGate,
}) {
  const requestedPageTypePreWriteAction = String(
    brief.executionPolicy?.requestedPageTypePreWriteAction || ''
  ).trim()
  const requestedPageTypeNextCommand = String(
    brief.executionPolicy?.requestedPageTypeNextCommand || ''
  ).trim()

  if (planningGate?.kind !== 'page-type-capability') {
    return {
      eligible: false,
      command: null,
      followUpPreflight: null,
      rerunPlan: null,
    }
  }

  if (
    requestedPageTypePreWriteAction !== 'materialize-managed-mf-host-contract' ||
    !requestedPageTypeNextCommand
  ) {
    return {
      eligible: false,
      command: null,
      followUpPreflight: null,
      rerunPlan: null,
    }
  }

  return {
    eligible: true,
    command: buildManagedMfHostContractAutofixCommand({ brief }),
    followUpPreflight: buildPreflightAfterManagedMfAutofixCommand({
      brief,
      packageManager,
    }),
    rerunPlan: buildResumeAfterGateCommand({
      options,
      targetRoot,
      skillRoot,
      gateKind: 'preflight',
    }),
  }
}

function resolveLegacyMfSharedContractAutofixPlan({
  brief,
  options,
  targetRoot,
  skillRoot,
  packageManager,
  planningGate,
}) {
  const requestedPageTypePreWriteAction = String(
    brief.executionPolicy?.requestedPageTypePreWriteAction || ''
  ).trim()
  const requestedPageTypeNextCommand = String(
    brief.executionPolicy?.requestedPageTypeNextCommand || ''
  ).trim()

  if (planningGate?.kind !== 'page-type-capability') {
    return {
      eligible: false,
      command: null,
      followUpPreflight: null,
      rerunPlan: null,
    }
  }

  if (
    requestedPageTypePreWriteAction !== 'repair-legacy-mf-shared-contract' ||
    !requestedPageTypeNextCommand
  ) {
    return {
      eligible: false,
      command: null,
      followUpPreflight: null,
      rerunPlan: null,
    }
  }

  return {
    eligible: true,
    command: buildLegacyMfSharedContractAutofixCommand({ brief }),
    followUpPreflight: buildPreflightAfterLegacyMfSharedContractAutofixCommand({
      brief,
      packageManager,
    }),
    rerunPlan: buildResumeAfterGateCommand({
      options,
      targetRoot,
      skillRoot,
      gateKind: 'preflight',
    }),
  }
}

function buildScriptCommands({ packageJson, packageManager }) {
  const scripts = packageJson?.scripts || {}
  const commands = []

  const typecheckScript = pickExistingScript(scripts, [
    'typecheck',
    'check-types',
    'types',
    'tsc',
  ])
  if (typecheckScript) {
    commands.push(
      createCommand({
        id: `project-${typecheckScript}`,
        phase: 'project-gate',
        command: buildRunScriptCommand(packageManager, typecheckScript),
        projectLocalCommand: buildRunScriptCommand(packageManager, typecheckScript),
        reason: 'Run the target project type-level validation.',
      }),
    )
  }

  const lintScript = pickExistingScript(scripts, [
    'lint',
    'eslint',
  ])
  if (lintScript) {
    commands.push(
      createCommand({
        id: `project-${lintScript}`,
        phase: 'project-gate',
        command: buildRunScriptCommand(packageManager, lintScript),
        projectLocalCommand: buildRunScriptCommand(packageManager, lintScript),
        reason: 'Run the target project lint gate when it exists.',
      }),
    )
  }

  return commands
}

function buildFormalAcceptanceCommands({ brief, targetRoot, packageJson, packageManager, skillRoot }) {
  if (brief.nonTypicalExecutionBrief) {
    return []
  }

  const commands = []
  const doctorScript = path.join(skillRoot, 'scripts', 'typical-page-doctor.mjs')

  commands.push(
    createCommand({
      id: 'typical-page-doctor',
      phase: 'formal-acceptance',
      command:
        `node ${shellQuote(doctorScript)} --target ${shellQuote(targetRoot)} --mode ${shellQuote(brief.mode)} --json`,
      projectLocalCommand:
        `node .local-context/hiui-design/scripts/typical-page-doctor.mjs --target "$PWD" --mode ${shellQuote(brief.mode)} --json`,
      reason: 'Run doctor when the workflow level is formal-e2e, or when shell/runtime issues must be proven closed.',
    }),
  )

  const buildScript = pickExistingScript(packageJson?.scripts || {}, [
    'build',
    'compile',
  ])
  if (buildScript) {
    commands.push(
      createCommand({
        id: `project-${buildScript}`,
        phase: 'formal-acceptance',
        command: buildRunScriptCommand(packageManager, buildScript),
        projectLocalCommand: buildRunScriptCommand(packageManager, buildScript),
        reason: 'Formal acceptance should include the project build when the host defines one.',
      }),
    )
  }

  return commands
}

function buildAllowedActions({
  planningGateKind = '',
  briefBlockedStatus = '',
  legacyMfSharedContractAutofixEligible = false,
  managedMfHostContractAutofixEligible = false,
  nonTypicalGeneratorPending = false,
  nonTypicalFamilyReady = false,
}) {
  if (!planningGateKind && nonTypicalFamilyReady) {
    return [
      'read-required-docs',
      'review-nonTypicalExecutionBrief',
      'run-family-generator',
      'run-light-sanity',
      'plan-host-entry-if-needed',
    ]
  }

  if (!planningGateKind && nonTypicalGeneratorPending) {
    return [
      'read-required-docs',
      'review-nonTypicalExecutionBrief',
      'plan-family-primitives',
      'prepare-generator-handoff',
    ]
  }

  if (!planningGateKind) {
    return [
      'read-required-docs',
      'select-official-template',
      'plan-page-units',
      'plan-host-entry-if-needed',
    ]
  }

  if (planningGateKind === 'preflight') {
    return ['run-preflight', 'complete-host-compatibility-baseline', 'report-blocked']
  }

  if (planningGateKind === 'ensure') {
    return ['run-ensure', 'report-blocked']
  }

  if (planningGateKind === 'page-type-capability') {
    return legacyMfSharedContractAutofixEligible
      ? [
          'run-legacy-mf-shared-contract-autofix',
          'run-preflight',
          'rerun-planner',
          'choose-allowed-page-type',
          'report-blocked',
        ]
      : managedMfHostContractAutofixEligible
      ? [
          'run-managed-mf-host-contract-autofix',
          'run-preflight',
          'rerun-planner',
          'choose-allowed-page-type',
          'report-blocked',
        ]
      : ['complete-host-compatibility-baseline', 'choose-allowed-page-type', 'report-blocked']
  }

  if (planningGateKind === 'navigation-mount') {
    return ['provide-navigation-mount-contract', 'report-blocked']
  }

  if (planningGateKind === 'brief-blocked') {
    return briefBlockedStatus === 'blocked-by-project-host-contract'
      ? ['run-preflight', 'report-blocked']
      : ['report-blocked']
  }

  return planningGateKind === 'generator-pending'
    ? [
        'read-required-docs',
        'review-nonTypicalExecutionBrief',
        'plan-family-primitives',
        'prepare-generator-handoff',
      ]
    : ['report-blocked']
}

function buildForbiddenActions({
  planningGateKind = '',
  nonTypicalGeneratorPending = false,
  nonTypicalFamilyReady = false,
}) {
  if (!planningGateKind && nonTypicalFamilyReady) {
    return [
      'select-template',
      'run-slot-replacement',
      'downgrade-family-brief-to-typical-template',
      'invent-unapproved-primitives',
    ]
  }

  if (!planningGateKind && nonTypicalGeneratorPending) {
    return [
      'select-template',
      'run-slot-replacement',
      'pretend-generator-ready',
      'treat-family-brief-as-typical-page-template',
    ]
  }

  if (planningGateKind === 'generator-pending') {
    return [
      'select-template',
      'run-slot-replacement',
      'pretend-generator-ready',
      'treat-family-brief-as-typical-page-template',
    ]
  }

  return planningGateKind
    ? [
        'read-business-pages',
        'analyze-reuse',
        'find-mount-point',
        'plan-route-menu-entry',
        'select-template',
        'plan-host-shell',
      ]
    : []
}

function buildPageTypeCapabilityNotes({
  planningGate,
  brief,
  legacyMfSharedContractAutofixPlan,
  managedMfHostContractAutofixPlan,
}) {
  if (legacyMfSharedContractAutofixPlan?.eligible) {
    return [
      'This planner is read-only; it stops before template selection because the requested page type still needs the legacy MF host shared-contract baseline repaired.',
      planningGate.reason,
      'This is an explicit legacy-only autofixable path: run the legacy MF shared-contract autofix first.',
      'Then rerun typical-page:preflight so the page-task gate and runtime-baseline evidence can refresh from the patched shared contract.',
      'After preflight succeeds, rerun plan-page-task to recover the full generation plan before writing page code.',
      'Do not generalize this repair to greenfield or non-Module-Federation projects; it only belongs to existing-system legacy MF hosts.',
      `Target business path is ${brief.requestedBusiness.targetBusinessPath}.`,
    ]
  }

  if (!managedMfHostContractAutofixPlan?.eligible) {
    return [
      'This planner is read-only; it stops before template selection because the requested page type is not currently allowed by the project capability matrix.',
      planningGate.reason,
      'Complete the missing host/formal-shell baseline or switch to an allowed page type before rerunning the planner.',
      `Target business path is ${brief.requestedBusiness.targetBusinessPath}.`,
    ]
  }

  return [
    'This planner is read-only; it stops before template selection because the requested page type still needs the managed MF host contract evidence to be materialized.',
    planningGate.reason,
    'This is an explicit autofixable path, not a direct page-write path: run the managed MF host contract autofix first.',
    'Then rerun typical-page:preflight so the page-task gate and contract-first host capability report can refresh from the new managed shell evidence.',
    'After preflight succeeds, rerun plan-page-task to recover the full generation plan before writing page code.',
    'If you choose not to materialize the managed shell evidence, switch to an already allowed page type instead of forcing the blocked template path.',
    `Target business path is ${brief.requestedBusiness.targetBusinessPath}.`,
  ]
}

function renderJsonInline(value) {
  return `\`\`\`json
${JSON.stringify(value ?? null, null, 2)}
\`\`\``
}

function formatStartFromDisplay(startFrom) {
  if (!startFrom || typeof startFrom !== 'object') return '—'
  if (startFrom.kind === 'family-rules-composition') return 'nonTypicalExecutionBrief'
  if (startFrom.kind === 'official-template') {
    return startFrom.sourceTemplatePath || '—'
  }
  return startFrom.kind || startFrom.sourceTemplatePath || '—'
}

function renderPlanText(plan) {
  const coordinationPatternId =
    plan.nonTypicalExecutionBrief?.coordinationPattern?.coordinationPatternId ||
    plan.nonTypicalExecutionBrief?.coordinationBindings?.coordinationPatternId ||
    plan.nonTypicalExecutionBrief?.archetype?.coordinationPatternId ||
    '—'
  const coordinationPatternManifestPath =
    plan.nonTypicalExecutionBrief?.coordinationPatternManifestPath || '—'
  const legacyArchetypeId = plan.nonTypicalExecutionBrief?.archetype?.archetypeId || '—'
  const lines = [
    '# HiUI Plan Page Task',
    '',
    `- mode: ${plan.mode}`,
    `- localizationMode: ${plan.localizationMode || 'none'}`,
    `- pageSelector: ${plan.pageSelector.kind} / ${plan.pageSelector.id}`,
    `- pageType: ${plan.pageType}`,
    `- taskLevel: ${plan.taskLevel}`,
    `- integrationReadiness: ${plan.integrationReadiness?.status || 'unknown'}`,
    `- requestedPageTypeStatus: ${plan.requestedPageTypeStatus || 'not-checked'}`,
    `- writeReadiness: ${plan.writeReadiness || 'ready'}`,
    `- readinessGate: ${plan.readinessGate.status}`,
    `- planStatus: ${plan.plan?.status || 'unknown'}`,
    `- factsStatus: ${plan.facts?.status || 'unknown'}`,
    `- canStartImplementation: ${plan.canStartImplementation === true}`,
    `- pageRelation: ${plan.pageRelationDecision?.kind || 'undetermined'} / ${plan.pageRelationDecision?.confidence || 'low'}`,
    `- navigationMountDecision: ${plan.navigationMountDecision.action} / ${plan.navigationMountDecision.existingBusinessNavigation}`,
    `- navigationMountAction: ${plan.navigationMountAction?.action || 'ask-user'} / ${plan.navigationMountAction?.targetRegistryPath || '—'} / appEntry=${plan.navigationMountAction?.appEntryPath || '—'}`,
    `- navigationMountReason: ${plan.navigationMountAction?.reason || '—'}`,
    `- navigationExecution: ${plan.navigationExecution?.status || 'ready'} / manual=${plan.navigationExecution?.requiresManualNavigationRegistration === true}`,
    `- startFrom: ${formatStartFromDisplay(plan.startFrom)}`,
    `- requiredShell: ${plan.startFrom.requiredShell || '—'}`,
    ...(plan.nonTypicalExecutionBrief
      ? [
          `- coordinationPatternId: ${coordinationPatternId}`,
          `- coordinationPatternManifestPath: ${coordinationPatternManifestPath}`,
          `- legacyArchetypeId(alias): ${legacyArchetypeId}`,
        ]
      : []),
    `- blockingReasons: ${plan.blockingReasons.length > 0 ? plan.blockingReasons.join(' | ') : '—'}`,
    '',
    '## Required Docs',
    ...(plan.requiredDocs.length > 0 ? plan.requiredDocs.map((item) => `- ${formatRequiredDocDisplay(item)}`) : ['- —']),
    '',
    '## Required Actions',
    ...(Array.isArray(plan.requiredActions) && plan.requiredActions.length > 0
      ? plan.requiredActions.map((item) => `- ${item.command} [${item.phase}]`)
      : ['- —']),
    '',
    '## Required Commands',
    ...(plan.requiredCommands.length > 0
      ? plan.requiredCommands.map((item) => `- ${item.id}: ${item.projectLocalCommand || item.command}`)
      : ['- —']),
  ]

  if (plan.allowedActions.length > 0) {
    lines.push('', '## Allowed Actions')
    lines.push(...plan.allowedActions.map((item) => `- ${item}`))
  }

  if (plan.forbiddenActions.length > 0) {
    lines.push('', '## Forbidden Actions')
    lines.push(...plan.forbiddenActions.map((item) => `- ${item}`))
  }

  if (plan.nextStepCommand) {
    lines.push('', '## Next Step Command')
    lines.push(`- ${plan.nextStepCommand.id}: ${plan.nextStepCommand.projectLocalCommand || plan.nextStepCommand.command}`)
  }

  if (plan.gateAdvice) {
    lines.push('', '## Gate Advice')
    lines.push(`- strategy: ${plan.gateAdvice.strategy || 'minimal-ensure-gate'}`)
    lines.push(`- preferredFlags: ${Array.isArray(plan.gateAdvice.preferredFlags) && plan.gateAdvice.preferredFlags.length > 0 ? plan.gateAdvice.preferredFlags.join(', ') : '—'}`)
    lines.push(`- deferredBriefShapingArgs: ${renderDeferredBriefShapingArgs(plan.gateAdvice.deferredBriefShapingArgs)}`)
  }

  if (plan.resumeAfterEnsureCommand) {
    lines.push('', '## Resume After Ensure')
    lines.push(`- ${plan.resumeAfterEnsureCommand.id}: ${plan.resumeAfterEnsureCommand.command}`)
  }

  if (Array.isArray(plan.formalAcceptanceActions) && plan.formalAcceptanceActions.length > 0) {
    lines.push('', '## Formal Acceptance Actions')
    lines.push(...plan.formalAcceptanceActions.map((item) => `- ${item.command} [${item.phase}]`))
  }

  if (plan.formalAcceptanceCommands.length > 0) {
    lines.push('', '## Formal Acceptance Commands')
    lines.push(...plan.formalAcceptanceCommands.map((item) => `- ${item.id}: ${item.projectLocalCommand || item.command}`))
  }

  if (plan.nonTypicalExecutionBrief) {
    lines.push('', '## Non-Typical Coordination Pattern')
    lines.push(`- coordinationPatternId: ${coordinationPatternId}`)
    lines.push(`- coordinationPatternManifestPath: ${coordinationPatternManifestPath}`)
    lines.push(`- legacyArchetypeId(alias): ${legacyArchetypeId}`)
    lines.push('', '## Non-Typical Execution Brief')
    lines.push(renderJsonInline(plan.nonTypicalExecutionBrief))
  }

  return `${lines.join('\n')}\n`
}

async function main(options, context = {}) {
  const scriptStartedAtMs = Date.now()
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const targetRoot = context.targetRoot || path.resolve(options.target)
  const packageJson = await readJsonIfExists(path.join(targetRoot, 'package.json'))
  const packageManager = await detectPackageManager(targetRoot)

  const confirmedGenerationInput = context.preloadedBrief
    ? null
    : await resolveJsonOrPathArg(
        options.confirmedGenerationInputJson,
        { targetRoot, label: '--confirmed-generation-input-json' },
      )
  const confirmedDesignRestoreInput = context.preloadedBrief
    ? null
    : await resolveJsonOrPathArg(
        options.confirmedDesignRestoreInputJson,
        { targetRoot, label: '--confirmed-design-restore-input-json' },
      )
  const nonTypicalConversationOutput = context.preloadedBrief
    ? null
    : await resolveJsonOrPathArg(
        options.nonTypicalConversationOutputJson,
        { targetRoot, label: '--non-typical-conversation-output-json' },
      )
  const explicitLegacyReconstructionInput = context.preloadedBrief
    ? null
    : await resolveJsonOrPathArg(
        options.legacyReconstructionInputJson,
        { targetRoot, label: '--legacy-reconstruction-input-json' },
      )
  const explicitMigrationInvariantContract = context.preloadedBrief
    ? null
    : await resolveJsonOrPathArg(
        options.migrationInvariantContractJson,
        { targetRoot, label: '--migration-invariant-contract-json' },
      )
  const analyticsRefactorContract = context.preloadedBrief
    ? null
    : await resolveJsonOrPathArg(
        options.analyticsRefactorContractJson,
        { targetRoot, label: '--analytics-refactor-contract-json' },
      )
  let brief = context.preloadedBrief || null
  let effectiveRelatedPagePath = String(brief?.outputTargetEvidence?.relatedPagePath || '').trim()
  let legacyAutoAssembly = {
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
  let relatedPageResolution = brief
    ? {
        status: 'from-brief-file',
        relatedPagePath: effectiveRelatedPagePath,
        autoDetected: false,
        confidence: effectiveRelatedPagePath ? 'high' : 'low',
        promptPageNames: [],
        candidates: [],
        reason: 'relatedPagePath was loaded from --brief-file.',
      }
    : {
        status: 'not-resolved',
        relatedPagePath: '',
        autoDetected: false,
        confidence: 'low',
        promptPageNames: [],
        candidates: [],
        reason: '',
      }

  if (!brief) {
    const telemetryPromptText = await readTelemetryPromptText(options)
    const pageTaskGate = await inspectPageTaskGate({ targetRoot, skillRoot })
    legacyAutoAssembly =
      explicitLegacyReconstructionInput || explicitMigrationInvariantContract
        ? {
            status: 'explicit',
            attempted: false,
            autoDetected: false,
            effectiveInputMode: options.inputMode,
            legacyReconstructionInput: explicitLegacyReconstructionInput,
            migrationInvariantContract: explicitMigrationInvariantContract,
            report: {
              requestedInputMode: options.inputMode || 'auto',
              promptMatched: false,
              promptConfidence: 'low',
              promptReasons: [],
              evidenceSummary: [],
              sourceCodePaths: [],
              layoutFacts: [],
              invariants: [],
            },
            blockingReason: '',
          }
        : pageTaskGate.nextStage !== 'ready-to-generate'
          ? {
              status: 'deferred-until-page-task-ready',
              attempted: false,
              autoDetected: false,
              effectiveInputMode: options.inputMode,
              legacyReconstructionInput: null,
              migrationInvariantContract: null,
              report: {
                requestedInputMode: options.inputMode || 'auto',
                promptMatched: false,
                promptConfidence: 'low',
                promptReasons: [],
                evidenceSummary: [],
                sourceCodePaths: [],
                layoutFacts: [],
                invariants: [],
              },
              blockingReason: '',
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
    relatedPageResolution = options.relatedPagePath
      ? {
          status: 'explicit',
          relatedPagePath: options.relatedPagePath,
          autoDetected: false,
          confidence: 'high',
          promptPageNames: [],
          candidates: [],
          reason: 'relatedPagePath was provided explicitly.',
        }
      : pageTaskGate.nextStage !== 'ready-to-generate'
        ? {
            status: 'deferred-until-page-task-ready',
            relatedPagePath: '',
            autoDetected: false,
            confidence: 'low',
            promptPageNames: [],
            candidates: [],
            reason:
              'Related page auto-detection is deferred until the project page-task gate is ready.',
          }
        : await maybeResolveRelatedPagePathFromPrompt({
            targetRoot,
            prompt: telemetryPromptText,
            requestedTitle: options.title,
            routePath: options.routePath,
            dest: options.dest,
          })
    effectiveRelatedPagePath =
      options.relatedPagePath || relatedPageResolution.relatedPagePath || ''

    if (shouldRunMinimalGateProbe({ options, pageTaskGate })) {
      const plan = buildMinimalGateProbePlan({
        options,
        targetRoot,
        skillRoot,
        pageTaskGate,
        relatedPageResolution,
        legacyAutoAssembly,
      })

      if (options.json) {
        process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`)
        return
      }

      process.stdout.write(renderPlanText(plan))
      return
    }

    brief = await loadGenerationBrief({
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
      nonTypicalConversationOutput,
      navigationMountContract: options.navigationMountContract,
      legacyReconstructionInput,
      migrationInvariantContract,
      analyticsRefactorContract,
    })
  }
  const sessionTraceContext = await openPageGenerationSession({
    targetRoot,
    brief,
    sessionId: options.sessionId,
    options,
    source: 'plan-page-task',
  })

  const resolvedPageDirectory = path.join(targetRoot, brief.requestedBusiness.targetBusinessPath)
  const targetPageFilePath = path.join(resolvedPageDirectory, 'index.tsx')
  const existingPageSourceFile = await resolveExistingPageSourceFile(resolvedPageDirectory)
  const resolvedPageFilePath = existingPageSourceFile || targetPageFilePath
  const resolvedStyleFilePath = await resolveExistingPageStyleFile(resolvedPageDirectory)
  const destinationExists = Boolean(existingPageSourceFile)
  const styleExists = Boolean(resolvedStyleFilePath)
  const nonTypicalGeneratorPending = isNonTypicalGeneratorPending(brief)
  const nonTypicalFamilyReady = isNonTypicalFamilyReady(brief, {
    nonTypicalGeneratorPending,
  })
  const planningGate = resolvePlanningGate({
    brief,
    destinationExists,
    nonTypicalGeneratorPending,
  })
  const navigationGate = planningGate.navigationGate
  const planningBlocked = [
    'ensure',
    'preflight',
    'brief-blocked',
    'page-type-capability',
    'navigation-mount',
  ].includes(planningGate.kind)
  const blockingReasons = buildBlockingReasons(brief, {
    destinationExists,
    nonTypicalGeneratorPending,
    planningGate,
  })
  const requiredCommands = [
    ...buildRequiredCommands({
      brief,
      targetRoot,
      packageManager,
      pageFilePath: resolvedPageFilePath,
      styleFilePath: styleExists ? resolvedStyleFilePath : '',
      skillRoot,
      planningGate,
      nonTypicalGeneratorPending,
      navigationMountContract: options.navigationMountContract,
    }),
    ...(planningBlocked || nonTypicalGeneratorPending
      ? []
      : buildScriptCommands({ packageJson, packageManager })),
  ]
  const managedMfHostContractAutofixPlan = resolveManagedMfHostContractAutofixPlan({
    brief,
    options,
    targetRoot,
    skillRoot,
    packageManager,
    planningGate,
  })
  const legacyMfSharedContractAutofixPlan = resolveLegacyMfSharedContractAutofixPlan({
    brief,
    options,
    targetRoot,
    skillRoot,
    packageManager,
    planningGate,
  })
  if (legacyMfSharedContractAutofixPlan.eligible) {
    requiredCommands.push(
      legacyMfSharedContractAutofixPlan.command,
      legacyMfSharedContractAutofixPlan.followUpPreflight,
      legacyMfSharedContractAutofixPlan.rerunPlan,
    )
  }
  if (managedMfHostContractAutofixPlan.eligible) {
    requiredCommands.push(
      managedMfHostContractAutofixPlan.command,
      managedMfHostContractAutofixPlan.followUpPreflight,
      managedMfHostContractAutofixPlan.rerunPlan,
    )
  }
  const briefBlockedRecoveryCommand = buildBriefBlockedRecoveryCommand({
    brief,
    packageManager,
    planningGate,
  })
  if (briefBlockedRecoveryCommand) {
    requiredCommands.push(briefBlockedRecoveryCommand)
  }
  const nextStepCommand =
    planningGate.kind === 'ensure' || planningGate.kind === 'preflight'
      ? requiredCommands.find((command) =>
          planningGate.kind === 'preflight'
            ? command.id === 'typical-page-preflight'
            : command.id === 'typical-page-ensure'
        ) || null
    : planningGate.kind === 'brief-blocked'
      ? briefBlockedRecoveryCommand
    : legacyMfSharedContractAutofixPlan.eligible
      ? legacyMfSharedContractAutofixPlan.command
    : managedMfHostContractAutofixPlan.eligible
      ? managedMfHostContractAutofixPlan.command
      : nonTypicalFamilyReady
        ? buildNonTypicalGeneratorCommand({
            brief,
            skillRoot,
            navigationMountContract: options.navigationMountContract,
            relatedPagePath: effectiveRelatedPagePath,
          })
        : null
  const resumeAfterEnsureCommand =
    planningGate.kind === 'ensure' || planningGate.kind === 'preflight'
      ? buildResumeAfterGateCommand({
          options,
          targetRoot,
          skillRoot,
          gateKind: planningGate.kind,
        })
      : planningGate.kind === 'brief-blocked' && briefBlockedRecoveryCommand
        ? buildResumeAfterGateCommand({
            options,
            targetRoot,
            skillRoot,
            gateKind: 'preflight',
          })
      : null
  const allowedActions = buildAllowedActions({
    planningGateKind: planningGate.kind,
    briefBlockedStatus: planningGate.status,
    legacyMfSharedContractAutofixEligible: legacyMfSharedContractAutofixPlan.eligible,
    managedMfHostContractAutofixEligible: managedMfHostContractAutofixPlan.eligible,
    nonTypicalGeneratorPending,
    nonTypicalFamilyReady,
  })
  const forbiddenActions = buildForbiddenActions({
    planningGateKind: planningGate.kind,
    nonTypicalGeneratorPending,
    nonTypicalFamilyReady,
  })
  const navigationExecution = buildNavigationExecutionSnapshot({
    brief,
    planningGateKind: planningGate.kind,
  })

  const basePlan = {
    schemaVersion: 1,
    schema: 'hiui-design-plan-page-task.v1',
    targetRoot,
    skillRoot,
    mode: brief.mode,
    inputMode: brief.inputMode?.id || '',
    localizationMode: brief.localizationMode || 'none',
    inputModeResolution: {
      requestedInputMode: options.inputMode || 'auto',
      effectiveInputMode: brief.inputMode?.id || '',
      autoDetectedLegacyReconstruction: legacyAutoAssembly.autoDetected === true,
      promptMatchedLegacySignals: legacyAutoAssembly.report?.promptMatched === true,
      promptConfidence: legacyAutoAssembly.report?.promptConfidence || 'low',
      promptReasons: legacyAutoAssembly.report?.promptReasons || [],
      evidenceSummary: legacyAutoAssembly.report?.evidenceSummary || [],
      sourceCodePaths: legacyAutoAssembly.report?.sourceCodePaths || [],
      layoutFacts: legacyAutoAssembly.report?.layoutFacts || [],
      invariants: legacyAutoAssembly.report?.invariants || [],
    },
    relatedPageResolution,
    pageSelector: brief.pageSelector || {
      kind: 'page-type',
      id: brief.pageType.id,
      label: brief.pageType.label,
    },
    topology: {
      projectType: brief.hostProfile.projectType,
      framework: brief.hostProfile.framework,
      runtime: brief.hostProfile.runtime,
      routing: brief.hostProfile.routing,
      integrationReadinessStatus: brief.integrationReadiness?.status || 'unknown',
      projectHostContractStatus: brief.projectHostContract?.status || 'unknown',
      projectHostContractPath: brief.projectHostContract?.path || '',
      hostCapabilityStatus: brief.pageGenerationDecision.hostCapability.status,
      formalHostAction:
        planningGate.kind === 'ensure'
          ? 'blocked-until-ensure'
          : planningGate.kind === 'preflight'
            ? 'blocked-until-preflight'
            : planningGate.kind === 'brief-blocked'
              ? 'deferred-until-brief-unblocked'
            : brief.pageGenerationDecision.navigationDecision.formalHostAction,
      navigationBlocked:
        planningGate.kind === 'ensure' ||
        planningGate.kind === 'preflight' ||
        planningGate.kind === 'brief-blocked'
          ? false
          : navigationGate.blockedForNewEntry,
      navigationBlockedByRawDetection:
        planningGate.kind === 'ensure' ||
        planningGate.kind === 'preflight' ||
        planningGate.kind === 'brief-blocked'
          ? false
          : navigationGate.rawBlocked,
      navigationExecutionStatus: navigationExecution.status,
      requiresManualNavigationRegistration:
        navigationExecution.requiresManualNavigationRegistration,
      formalNavigationRegistryPath:
        planningGate.kind === 'ensure' ||
        planningGate.kind === 'preflight' ||
        planningGate.kind === 'brief-blocked'
          ? ''
          : brief.executionPolicy.formalNavigationRegistryPath || '',
    },
    navigationMountDecision:
      planningGate.kind === 'ensure' ||
      planningGate.kind === 'preflight' ||
      planningGate.kind === 'brief-blocked'
      ? {
          existingBusinessNavigation: 'missing',
          action: 'ask-user',
          routeRegistryPath: '',
          menuRegistryPath: '',
          formalShellPath: '',
          shellSource: 'unknown',
          reason:
            planningGate.kind === 'brief-blocked'
              ? 'Generation brief is blocked, so navigation mount analysis is not available yet.'
              : 'Project integration/page-task gate is blocked; navigation mount analysis is not available yet.',
        }
      : brief.pageGenerationDecision.navigationMountDecision,
    navigationMountAction:
      planningGate.kind === 'ensure' ||
      planningGate.kind === 'preflight' ||
      planningGate.kind === 'brief-blocked'
      ? {
          action: 'ask-user',
          targetShellPath: '',
          targetRegistryPath: '',
          appEntryPath: '',
          pageRoutePath: '',
          menuTitle: '',
          mustDoBeforePageCode: true,
          reason:
            planningGate.kind === 'brief-blocked'
              ? 'Generation brief is blocked, so navigation mount action is not available yet.'
              : 'Project integration/page-task gate is blocked; navigation mount action is not available yet.',
        }
      : brief.pageGenerationDecision.navigationMountAction,
    pageRelationDecision:
      planningGate.kind === 'ensure' ||
      planningGate.kind === 'preflight' ||
      planningGate.kind === 'brief-blocked'
        ? {
            kind: 'undetermined',
            confidence: 'low',
            reason:
              planningGate.kind === 'brief-blocked'
                ? 'Generation brief is blocked, so page relation inference is not available yet.'
                : 'Project integration/page-task gate is blocked; page relation inference is not available yet.',
            evidence: [],
          }
        : brief.pageGenerationDecision.pageRelationDecision || {
            kind: 'undetermined',
            confidence: 'low',
            reason: 'Page relation inference is not available in this brief.',
            evidence: [],
          },
    integrationReadiness: brief.integrationReadiness,
    projectHostContract: brief.projectHostContract || null,
    navigationExecution,
    requestedPageTypeStatus: planningGate.requestedPageTypeStatus,
    requestedPageTypeReason: planningGate.requestedPageTypeReason,
    writeReadiness: planningGate.writeReadiness,
    gateAdvice:
      planningGate.kind === 'ensure' || planningGate.kind === 'preflight'
        ? brief.gateAdvice || null
        : null,
    pageType: brief.pageType.id || (brief.pageSelector?.kind === 'page-family' ? brief.pageSelector.id : ''),
    pageFamily: brief.pageType.pageFamily,
    pageUnits: planningBlocked ? [] : buildPageUnits(brief),
    nonTypicalExecutionBrief: planningBlocked ? null : brief.nonTypicalExecutionBrief || null,
    taskLevel: inferTaskLevel({
      overrideTaskLevel: options.taskLevel,
      destinationExists,
      inputModeId: brief.inputMode.id,
      pageAdjustmentContract: brief.pageAdjustmentContract,
    }),
    startFrom: {
      kind:
        planningGate.kind === 'ensure'
          ? 'blocked-until-ensure'
          : planningGate.kind === 'preflight'
            ? 'blocked-until-preflight'
            : planningGate.kind === 'brief-blocked'
              ? planningGate.status
            : planningGate.kind === 'page-type-capability'
              ? 'blocked-by-page-type-capability'
              : planningGate.kind === 'navigation-mount'
                ? 'blocked-by-navigation-mount'
            : brief.nonTypicalExecutionBrief
              ? 'family-rules-composition'
              : 'official-template',
      sourceTemplatePath: planningBlocked ? '' : brief.sources.sourceTemplatePath,
      preferredTemplatePath: planningBlocked ? '' : brief.sources.preferredTemplatePath,
      requiredShell: planningBlocked ? '' : brief.generationContract.requiredShell || '',
      generationPath: planningBlocked ? '' : brief.executionPolicy.generationPath,
      generationPathLabel: planningBlocked ? '' : brief.executionPolicy.generationPathLabel,
      reason: planningBlocked
        ? planningGate.kind === 'preflight'
          ? 'Project integration is present, but the page-task gate is still closed until typical-page:preflight passes.'
          : planningGate.kind === 'ensure'
            ? 'Project-local hiui-design context and appliedMode must be ensured before selecting an official template or planning any host integration.'
            : planningGate.kind === 'brief-blocked'
              ? planningGate.reason
            : planningGate.reason
        : brief.executionPolicy.generationPathReason,
      targetBusinessPath: brief.requestedBusiness.targetBusinessPath,
    },
    readinessGate: {
      status: planningGate.status,
      reason: planningGate.reason,
      nextRequiredAction: brief.executionPolicy?.pageTaskGateNextRequiredAction || '',
      staleInputs: brief.executionPolicy?.pageTaskGateStaleInputs || [],
      canAutoRecover: brief.executionPolicy?.pageTaskGateCanAutoRecover === true,
      contractSnapshotId: brief.executionPolicy?.pageTaskGateContractSnapshotId || '',
    },
    requiredDocs: planningBlocked ? [] : brief.sources.requiredDocs || [],
    blockingReasons,
    allowedActions,
    forbiddenActions,
    requiredCommands,
    nextStepCommand,
    resumeAfterEnsureCommand,
    formalAcceptanceCommands: planningBlocked
      ? []
      : buildFormalAcceptanceCommands({
          brief,
          targetRoot,
          packageJson,
          packageManager,
          skillRoot,
        }),
    notes: planningGate.kind === 'ensure' || planningGate.kind === 'preflight'
      ? [
          'This planner is read-only; it reports missing integration facts but does not run ensure-in-current-project automatically.',
          planningGate.kind === 'preflight'
            ? 'Because the page-task gate is still closed, this plan intentionally withholds template selection, slot-gate steps, host-entry planning, and formal acceptance commands.'
            : 'Because project integration is not ready, this plan intentionally withholds template selection, slot-gate steps, host-entry planning, and formal acceptance commands.',
          ...buildGateAdviceNotes(brief.gateAdvice),
          'Once the page-task gate is open, this planner reuses PROJECT_HOST_CONTRACT.json as the project-scoped host fact source and does not rerun main-path navigation scanning.',
          planningGate.kind === 'preflight'
            ? 'Do not start page generation, template selection, or host-entry work before typical-page:preflight passes.'
            : 'Do not read existing business pages, analyze reuse, or inspect route/menu/window.addPage hooks before ensure succeeds.',
          planningGate.kind === 'preflight'
            ? 'Run typical-page:preflight, then rerun plan-page-task to recover the full generation plan.'
            : 'Do not locate button mount points or plan host shell / formal navigation entry before ensure succeeds.',
          planningGate.kind === 'preflight'
            ? 'After preflight succeeds, rerun plan-page-task before attempting page generation or host-entry work.'
            : 'After ensure succeeds, rerun plan-page-task before attempting page generation or host-entry work.',
          `Target business path is ${brief.requestedBusiness.targetBusinessPath}.`,
        ]
      : planningGate.kind === 'brief-blocked'
        ? [
            'This planner is read-only; it stops before template selection because generation-brief already returned a hard block for the current task.',
            planningGate.reason,
            planningGate.status === 'blocked-by-project-host-contract'
              ? 'Rerun typical-page:preflight to refresh PROJECT_HOST_CONTRACT.json before rerunning the planner.'
              : 'Clear the blocking fact and rerun plan-page-task before attempting page generation or host-entry work.',
            planningGate.status === 'blocked-by-project-host-contract'
              ? 'Do not work around the missing contract by rescanning navigation manually in the main path.'
              : 'Do not continue into official template selection, host-entry planning, or page generation while this brief block remains open.',
            `Target business path is ${brief.requestedBusiness.targetBusinessPath}.`,
          ]
      : planningGate.kind === 'page-type-capability'
        ? buildPageTypeCapabilityNotes({
            planningGate,
            brief,
            legacyMfSharedContractAutofixPlan,
            managedMfHostContractAutofixPlan,
          })
      : planningGate.kind === 'navigation-mount'
        ? [
            'This planner is read-only; it stops before template selection because the formal navigation mount still requires a confirmed target.',
            planningGate.reason,
            'Planner output still treats PROJECT_HOST_CONTRACT.json as the project-scoped fact source; do not work around this by rerunning old navigation detection paths manually.',
            'Provide a supported navigation mount contract or certify the formal route/menu registry before rerunning the planner.',
            `Target business path is ${brief.requestedBusiness.targetBusinessPath}.`,
          ]
      : nonTypicalGeneratorPending
        ? [
            'Read only the requiredDocs listed in this plan before touching the family generator.',
            'This planner output is intentionally capped at nonTypicalExecutionBrief because generatorReady is still false in the family workflow manifest.',
            `Target business path is ${brief.requestedBusiness.targetBusinessPath}.`,
            'Do not downgrade this family brief into a typical-page template selection flow.',
            'Use the primitive plan, coordination bindings, and light sanity plan as the next generator handoff input.',
          ]
      : nonTypicalFamilyReady
        ? [
            'Read only the requiredDocs listed in this plan before writing code.',
            `Target business path is ${brief.requestedBusiness.targetBusinessPath}.`,
            'Start from nonTypicalExecutionBrief, primitivePlan, coordination bindings, and block-design mappings; do not detour into official-template slot replacement.',
            'Run the family generator and then run non-typical-page-sanity before formal acceptance.',
            destinationExists
              ? 'An existing page source was detected at the target business path; keep the family composition structure stable while applying managed changes.'
              : 'No existing page source was detected at the target business path; plan as a new family-rules-composition output.',
          ]
      : [
          ...(legacyAutoAssembly.autoDetected
            ? [
                `Input mode was auto-raised to legacy-system-reconstruction from the telemetry prompt. Evidence: ${(
                  legacyAutoAssembly.report?.evidenceSummary || []
                ).join(' ; ') || 'repo source facts found at the requested target path.'}`,
              ]
            : []),
          'Read only the requiredDocs listed in this plan before writing code.',
          'If blockingReasons is non-empty, resolve those facts before generating or editing the page.',
          ...(navigationExecution.requiresManualNavigationRegistration
            ? [
                `This plan allows page source generation, but navigation execution is still manual: ${
                  navigationExecution.reason || brief.pageGenerationDecision.navigationMountAction?.reason || 'confirm the existing mount target and complete the manual registration step after generation.'
                }`,
              ]
            : []),
          `Target business path is ${brief.requestedBusiness.targetBusinessPath}.`,
          ...(navigationGate.bypassReason ? [navigationGate.bypassReason] : []),
          destinationExists
            ? 'An existing page source was detected at the target business path; plan as a managed page change unless the user authorizes a broader refactor.'
            : 'No existing page source was detected at the target business path; plan as a new page output unless the handoff narrows the scope.',
        ],
  }

  const plan = buildPlannerContractFields(basePlan, {
    planningGateKind: planningGate.kind,
    requiredActions: buildWorkflowRequiredActions({
      plan: basePlan,
      planningGateKind: planningGate.kind,
      brief,
      options,
      targetRoot,
      skillRoot,
      relatedPagePath: effectiveRelatedPagePath,
    }),
  })

  plan.sessionTrace = buildPageGenerationSessionRef(sessionTraceContext, {
    currentStage: 'planReady',
    currentStatus: 'success',
  })
  await recordPageGenerationSessionStage({
    sessionContext: sessionTraceContext,
    brief,
    options,
    source: 'plan-page-task',
    stage: 'planReady',
    status: 'success',
    startedAtMs: scriptStartedAtMs,
    finishedAtMs: Date.now(),
    details: {
      fromBriefFile: Boolean(context.preloadedBrief),
      planningBlocked: planningBlocked === true,
      blockedBy:
        planningBlocked
          ? plan.nextStepCommand?.id ||
            plan.readinessGate?.status ||
            (Array.isArray(plan.blockingReasons) && plan.blockingReasons.length > 0
              ? 'planning-blocked'
              : '')
          : '',
      blockingReason:
        planningBlocked
          ? (Array.isArray(plan.blockingReasons) && plan.blockingReasons.length > 0
              ? plan.blockingReasons[0]
              : plan.readinessGate?.reason || '')
          : '',
      nextCommand:
        planningBlocked
          ? plan.nextStepCommand?.projectLocalCommand ||
            plan.nextStepCommand?.command ||
            ''
          : '',
      blockingReasonCount: Array.isArray(plan.blockingReasons) ? plan.blockingReasons.length : 0,
      taskLevel: String(plan.task?.taskLevel || '').trim(),
      ...buildPageRelationStageDetails({
        brief,
        resultPayload: plan,
        pageRelationDecision: plan.pageRelationDecision,
      }),
    },
    resultPayload: plan,
  })

  if (options.json) {
    process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`)
    return
  }

  process.stdout.write(renderPlanText(plan))
}

async function runCli() {
  const options = parseArgs(process.argv.slice(2))
  let usageSession = null
  let reportMode = options.mode || 'auto'
  let success = false

  try {
    const invocation =
      options.briefFile
        ? await readReadyGenerationBriefFile({
            briefFile: options.briefFile,
            targetRoot: path.resolve(options.target),
            expectedTargetRoot: options.targetExplicit ? path.resolve(options.target) : '',
          })
        : {
            brief: null,
            briefFilePath: '',
            targetRoot: path.resolve(options.target),
          }
    reportMode = invocation.brief?.mode || reportMode
    usageSession = await startUsageSession({
      prompt: options.telemetryPrompt,
      promptFile: options.telemetryPromptFile,
      reportMode,
      source: 'plan-page-task',
      targetRoot: invocation.targetRoot,
    })
    await main(options, {
      targetRoot: invocation.targetRoot,
      preloadedBrief: invocation.brief,
    })
    success = true
  } finally {
    await finalizeUsageSession(usageSession, {
      reportMode,
      success,
    })
  }
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  await runCli()
}

export {
  buildPlannerContractFields,
  buildWorkflowRequiredActions,
}
