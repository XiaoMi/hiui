#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import fs from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readReadyGenerationBriefFile } from './lib/brief-file.mjs'
import { loadGenerationBrief } from './lib/load-generation-brief.mjs'
import {
  isDesignRestoreInputMode,
  normalizeConfirmedDesignRestoreInput,
  validateConfirmedDesignRestoreInput,
} from './lib/design-restore-intake.mjs'
import { getPageFamilyWorkflowEntry } from './lib/load-page-family-workflow-manifest.mjs'
import {
  buildCamoraRuntimeClosure,
  isCamoraRuntimeClosureApplicable,
} from './lib/camora-runtime-closure.mjs'
import { collectCodeRegistrationEvidence } from './lib/code-registration-evidence.mjs'
import {
  settleProjectHostContractAfterManagedWrite,
} from './lib/project-host-contract.mjs'
import { formatInstallModeUsage } from './lib/mode-contract.mjs'
import {
  collectHiuiVisualImportViolations,
  collectHostGenerationPageContractViolations,
  collectHostGenerationSupportFileContractViolations,
  collectPageSourceSanityViolations,
} from './lib/page-template-sanity.mjs'
import {
  validateCoverageDecision,
  validateOutputTargetDecision,
} from './lib/generation-decision-contract.mjs'
import {
  inferManagedMfPublishEntryFileName,
  inferManagedMfPublishEntryRelativePath,
  resolveMfDirectExposeWiringState,
} from './lib/host-adapters/mf-direct-expose-legacy.mjs'
import { maybeResolveRelatedPagePathFromPrompt } from './lib/related-page-intake.mjs'
import {
  inspectPageTaskGate,
  refreshReadyPageTaskGateAfterManagedWrite,
} from './lib/page-task-gate.mjs'
import {
  applyPageAdjustmentTransform,
  collectPageAdjustmentExecutionViolations,
  planPageAdjustmentExecution,
} from './lib/page-adjustment-executor.mjs'
import {
  buildPageGenerationSessionRef,
  openPageGenerationSession,
  recordPageGenerationSessionStage,
} from './lib/page-generation-session-trace.mjs'
import { buildPageRelationStageDetails } from './lib/page-generation-stage-tracker.mjs'
import { materializeNonTypicalPageFiles } from './lib/non-typical-page-generator.mjs'
import { collectManagedMfPublishEntryFiles } from './lib/publish-entry-materializer.mjs'
import {
  SKILL_PUBLIC_NAME,
  getContextScriptPath,
  toSkillSourceTag,
} from './lib/skill-identity.mjs'
import {
  annotateGeneratedArtifacts,
  resolveGeneratedArtifactWritePlan,
  summarizeGeneratedArtifacts,
} from './lib/generation-artifact-policy.mjs'
import { resolveManagedGenerationProjectCheckSelection } from './lib/managed-project-check-selection.mjs'
import {
  getManagedLocalRuntimeRoot,
  resolveManagedLocalRuntimeModulePath,
  getManagedLocalRuntimeStylePath,
  isManagedLocalRuntimeLogicalSource,
} from './lib/managed-local-runtime-contract.mjs'
import {
  buildStyleDeliveryDecision,
  resolveStyleDeliveryImportSource,
  sourceContainsManagedRuntimeStyleImport,
} from './lib/style-delivery-decision.mjs'
import { collectManagedLocalRuntimeProjectDistributionFiles } from './lib/managed-runtime-distribution.mjs'
import { ensureProjectNodeRuntime } from './lib/project-node-launcher.mjs'
import { runProjectNodeScriptSync } from './lib/project-node-launcher.mjs'
import {
  ensureLegacyReactDefaultImport,
  shouldPreserveExplicitReactImport,
  sourceNeedsExplicitLegacyReactRuntimeImport,
} from './lib/legacy-react-runtime.mjs'
import {
  collectRouteMountablePageExportViolations,
  ensureRouteMountablePageExport,
  preserveExpectedRouteMountablePageExport,
  preserveExistingRouteMountablePageExport,
} from './lib/page-export-contract.mjs'
import { resolveManagedLocalRuntimeEmbeddedSourceSnapshot } from './lib/managed-local-runtime-dependencies.mjs'
import { finalizeUsageSession, startUsageSession } from './lib/usage-telemetry.mjs'
import { verifyRemoteRuntimeSource } from './verify-remote-runtime-source.mjs'
import { resolveJsonOrPathArg } from './lib/json-input-arg.mjs'

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const defaultSkillRoot = path.resolve(moduleDir, '..')
const managedLocalRuntimeDependencyContractPath = path.join(
  defaultSkillRoot,
  'docs',
  'onboarding',
  'managed-local-runtime-dependencies.json'
)
const managedLocalRuntimeSourcePackageName = (() => {
  try {
    const contract = JSON.parse(
      readFileSync(managedLocalRuntimeDependencyContractPath, 'utf8')
    )
    return resolveManagedLocalRuntimeEmbeddedSourceSnapshot(contract).name || ''
  } catch {
    return ''
  }
})()
const PAGE_GENERATION_REPORT_SCHEMA = 'hiui-design-page-generation-report.v2'

class BlockedGenerationError extends Error {
  constructor(message, payload) {
    super(message)
    this.name = 'BlockedGenerationError'
    this.payload = payload
  }
}

const MANUAL_NAVIGATION_MOUNT_ACTIONS = new Set([
  'append-existing-entry',
  'materialize-mf-publish-entry',
  'manual-register-existing-registry',
])

const PROJECT_TRANSLATION_ENTRY_CANDIDATES = [
  'src/translation/index.ts',
  'src/translation/index.tsx',
  'src/translation/index.js',
  'src/translation/index.jsx',
]
const DEFAULT_TYPICAL_PAGE_SHELL_IMPORT_SOURCE = 'local-managed-runtime'

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function isReadableFile(targetPath) {
  try {
    const stat = await fs.stat(targetPath)
    return stat.isFile()
  } catch {
    return false
  }
}

async function readLinkConfigFromReadme(targetRoot) {
  const readmePath = path.join(targetRoot, 'README.md')
  if (!(await pathExists(readmePath))) {
    return {
      testBaseUrl: '',
      localOrigin: '',
    }
  }

  const raw = await fs.readFile(readmePath, 'utf8')
  const readmeValue = (key) => raw.match(new RegExp(`^\\s*-\\s*${key}\\s*:\\s*(\\S+)\\s*$`, 'm'))?.[1] || ''
  return {
    testBaseUrl: readmeValue('testBaseUrl'),
    localOrigin: readmeValue('localOrigin'),
  }
}

async function readTelemetryPromptText(options) {
  if (options.telemetryPrompt) return options.telemetryPrompt
  if (!options.telemetryPromptFile) return ''

  const promptFilePath = path.resolve(options.telemetryPromptFile)
  return fs.readFile(promptFilePath, 'utf8')
}

function readRequiredArg(argv, index, name) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`)
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
    exposeName: '',
    testBaseUrl: '',
    detailSectionsJson: '',
    feedbackVariantId: '',
    pageAdjustmentContract: '',
    nonTypicalConversationOutputJson: '',
    confirmedGenerationInputJson: '',
    confirmedDesignRestoreInputJson: '',
    navigationMountContract: '',
    legacyReconstructionInputJson: '',
    migrationInvariantContractJson: '',
    analyticsRefactorContractJson: '',
    sessionId: '',
    telemetryPrompt: '',
    telemetryPromptFile: '',
    force: false,
    dryRun: false,
    json: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--') {
      continue
    }

    if (arg === '--target') {
      options.target = readRequiredArg(argv, i, arg)
      options.targetExplicit = true
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
    if (arg === '--brief-file') {
      options.briefFile = readRequiredArg(argv, i, arg)
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
    if (arg === '--expose-name') {
      options.exposeName = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--test-base-url') {
      options.testBaseUrl = readRequiredArg(argv, i, arg)
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
    if (arg === '--non-typical-conversation-output-json') {
      options.nonTypicalConversationOutputJson = readRequiredArg(argv, i, arg)
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
      console.log(`Usage: node ${getContextScriptPath('generate-page-from-brief.mjs')} [--page-type <id> | --page-family <id>] --dest <dir> [--related-page-path <file>] [--title <title>] [--route-path <path>] [--expose-name <name>] [--test-base-url <url>] [--detail-sections-json <json-or-path>] [--input-mode <page-prompt|prototype-screenshot|figma-design-restore|legacy-system-reconstruction>] [--localization-mode <none|inherit-host|local-bridge>] [--feedback-variant-id <id>] [--page-adjustment-contract <json-or-path>] [--non-typical-conversation-output-json <json>] [--confirmed-generation-input-json <json>] [--confirmed-design-restore-input-json <json>] [--navigation-mount-contract <json-or-path>] [--legacy-reconstruction-input-json <json>] [--migration-invariant-contract-json <json>] [--analytics-refactor-contract-json <json>] [--brief-file <file>] [--mode <${formatInstallModeUsage()}>] [--session-id <id>] [--force] [--dry-run] [--telemetry-prompt <text>] [--telemetry-prompt-file <path>] [--json]

--page-adjustment-contract is only for the "base-template-local-adjustment" path. It must describe the current request as a local adjustment relative to the official base template, not as a new page type.

When input-mode is figma-design-restore, page selector may be omitted and auto-inferred from confirmedDesignRestoreInput when the routing decision is unambiguous.

--non-typical-conversation-output-json is required for --page-family non-typical-page.

--related-page-path is optional directory evidence only. Pass a project-relative page file when the brief should inherit an existing business page root, but formal generation still requires --dest.

Default localization behavior: if --localization-mode is omitted, generation uses none. Use inherit-host only when the target project already has a proven host i18n runtime, and use local-bridge only when the user explicitly asks to connect page i18n.

Usage stats capture the verbatim original user prompt via --telemetry-prompt-file (preferred) or --telemetry-prompt.

Use --brief-file <file> to consume a previously materialized JSON brief from generation-brief.mjs. When --brief-file is present, page selector, dest, and other brief-shaping flags are ignored, and the file becomes the source of truth for generation.
`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function ensureDestIsSafe(targetRoot, dest) {
  if (!dest) throw new Error('Missing --dest <relative-dir>')
  if (path.isAbsolute(dest)) throw new Error('--dest must be a project-relative directory')

  const absDest = path.resolve(targetRoot, dest)
  if (!absDest.startsWith(`${targetRoot}${path.sep}`)) {
    throw new Error(`--dest escapes target root: ${dest}`)
  }

  return absDest
}

async function runDependencyIsolationPreflight({ targetRoot, skillRoot }) {
  const scriptPath = path.join(skillRoot, 'scripts', 'dependency-isolation-check.mjs')
  const { result } = await runProjectNodeScriptSync({
    targetRoot,
    scriptPath,
    scriptArgs: [
      '--target',
      targetRoot,
      '--json',
      '--allow-pending-managed-local-runtime-materialization',
    ],
    cwd: targetRoot,
    capture: true,
    maxBuffer: 16 * 1024 * 1024,
  })

  if (result.error) {
    throw result.error
  }

  const reportOutput = result.stdout || result.stderr
  let report
  try {
    report = JSON.parse(reportOutput)
  } catch (error) {
    if (result.status !== 0) {
      throw new Error(`dependency-isolation-check failed to run: ${reportOutput}`, {
        cause: error,
      })
    }
    throw new Error(`dependency-isolation-check returned invalid JSON: ${error.message}`, {
      cause: error,
    })
  }

  if (report.status !== 'pass') {
    const failed = Array.isArray(report.failed) ? report.failed : []
    const details = failed
      .slice(0, 8)
      .map((item) => `${item.id}: ${item.detail}`)
      .join('; ')
    throw new Error(
      `HiUI5 dependency isolation must pass before generating a ${SKILL_PUBLIC_NAME} page. ${details || 'Run dependency-isolation-check for details.'}`
    )
  }

  return report
}

function toPageTaskGateSnapshot(brief) {
  return {
    status: brief.executionPolicy?.pageTaskGateStatus || brief.pageTaskGate?.status || '',
    reason: brief.executionPolicy?.pageTaskGateReason || brief.pageTaskGate?.reason || '',
    nextCommand:
      brief.executionPolicy?.pageTaskGateNextCommand || brief.pageTaskGate?.nextCommand || '',
    allowedActions:
      brief.executionPolicy?.pageTaskAllowedActions || brief.pageTaskGate?.allowedActions || [],
    forbiddenActions:
      brief.executionPolicy?.pageTaskForbiddenActions || brief.pageTaskGate?.forbiddenActions || [],
  }
}

function buildFamilyWorkflowSnapshot({ pageFamily, workflowEntry, workflowManifestPath }) {
  if (!workflowEntry) return null

  return {
    id: pageFamily,
    label: workflowEntry.label || '',
    status: workflowEntry.status || '',
    plannerReady: workflowEntry.plannerReady === true,
    briefReady: workflowEntry.briefReady === true,
    generatorReady: workflowEntry.generatorReady === true,
    legacyRefactorReady: workflowEntry.legacyRefactorReady === true,
    workflowManifestPath: workflowManifestPath || '',
  }
}

function buildBlockedGenerationPayload({
  targetRoot,
  brief,
  blockedBy,
  reason,
  familyWorkflow = null,
  writeReadinessOverride = '',
  semanticReadiness = null,
  artifactWritePlan = null,
}) {
  const requestedPageTypeCapability = brief.pageTypeCapability || {}
  const requestedPageTypeStatus =
    brief.requestedPageTypeStatus ||
    brief.executionPolicy?.requestedPageTypeStatus ||
    brief.executionPolicy?.requestedPageTypeCapabilityStatus ||
    'not-checked'
  const requestedPageTypeCapabilityStatus =
    requestedPageTypeCapability.status ||
    brief.executionPolicy?.requestedPageTypeCapabilityStatus ||
    requestedPageTypeStatus
  const requestedPageTypeReason =
    requestedPageTypeCapability.reason ||
    brief.executionPolicy?.requestedPageTypeReason ||
    brief.executionPolicy?.requestedPageTypeCapabilityReason ||
    ''
  const requestedPageTypeBlockedBy =
    brief.requestedPageTypeBlockedBy ||
    brief.executionPolicy?.requestedPageTypeBlockedBy ||
    brief.executionPolicy?.requestedPageTypeCapabilityBlockedBy ||
    []
  const requestedPageTypeCapabilityBlockedBy =
    requestedPageTypeCapability.blockedBy ||
    brief.executionPolicy?.requestedPageTypeCapabilityBlockedBy ||
    requestedPageTypeBlockedBy
  const requestedPageTypeConditionalBlockedBy =
    requestedPageTypeCapability.conditionalBlockedBy ||
    brief.executionPolicy?.requestedPageTypeConditionalBlockedBy ||
    []
  const requestedPageTypePreWriteAction =
    requestedPageTypeCapability.preWriteAction ||
    brief.executionPolicy?.requestedPageTypePreWriteAction ||
    ''
  const requestedPageTypePreWriteActionReason =
    requestedPageTypeCapability.preWriteActionReason ||
    brief.executionPolicy?.requestedPageTypePreWriteActionReason ||
    ''
  const requestedPageTypeSourcePath =
    requestedPageTypeCapability.sourcePath ||
    brief.requestedPageTypeSourcePath ||
    brief.executionPolicy?.requestedPageTypeSourcePath ||
    brief.executionPolicy?.requestedPageTypeCapabilitySourcePath ||
    ''
  const requestedPageTypeNextCommand = requestedPageTypeCapability.nextCommand || brief.executionPolicy?.requestedPageTypeNextCommand || ''

  return {
    schema: 'hiui-design-generate-page-blocked.v1',
    status: 'blocked-before-write',
    blockedBy,
    reason,
    targetRoot,
    mode: brief.mode,
    requestedMode: brief.requestedMode,
    inputMode: typeof brief.inputMode === 'string' ? brief.inputMode : brief.inputMode?.id || '',
    pageSelector: brief.pageSelector || {
      kind: 'page-type',
      id: brief.pageType?.id || '',
      label: brief.pageType?.label || '',
    },
    pageType: brief.pageType || null,
    integrationReadiness: brief.integrationReadiness || null,
    projectHostContract: brief.projectHostContract || null,
    requestedPageTypeStatus,
    requestedPageTypeReason,
    requestedPageTypeBlockedBy,
    requestedPageTypeSourcePath,
    writeReadiness:
      writeReadinessOverride || brief.executionPolicy?.writeReadiness || 'blocked-before-write',
    pageTaskGate: toPageTaskGateSnapshot(brief),
    pageTypeCapability: {
      status: requestedPageTypeCapabilityStatus,
      reason: requestedPageTypeReason,
      blockedBy: requestedPageTypeCapabilityBlockedBy,
      conditionalBlockedBy: requestedPageTypeConditionalBlockedBy,
      preWriteAction: requestedPageTypePreWriteAction,
      preWriteActionReason: requestedPageTypePreWriteActionReason,
      nextCommand: requestedPageTypeNextCommand,
      sourcePath: requestedPageTypeSourcePath,
    },
    navigation: {
      blocked: isNavigationMountBlocked(brief),
      reason: getNavigationBlockReason(brief),
      mountDecisionAction: brief.pageGenerationDecision?.navigationMountDecision?.action || '',
      mountActionAction: brief.pageGenerationDecision?.navigationMountAction?.action || '',
    },
    outputTargetEvidence: brief.outputTargetEvidence || null,
    businessSlotSemanticReadiness:
      semanticReadiness ||
      brief.pageGenerationDecision?.businessSlotPlan?.semanticReadiness ||
      null,
    artifactWritePlan:
      artifactWritePlan && typeof artifactWritePlan === 'object' ? artifactWritePlan : null,
    familyWorkflow,
    nonTypicalExecutionBrief: brief.nonTypicalExecutionBrief || null,
  }
}

function isNavigationMountBlocked(brief) {
  return (
    brief.executionPolicy?.navigationBlocked === true ||
    brief.pageGenerationDecision?.navigationMountDecision?.action === 'ask-user' ||
    brief.pageGenerationDecision?.navigationMountAction?.action === 'ask-user'
  )
}

function getNavigationBlockReason(brief) {
  return (
    brief.executionPolicy?.navigationBlockReason ||
    brief.pageGenerationDecision?.navigationMountAction?.reason ||
    brief.pageGenerationDecision?.navigationMountDecision?.reason ||
    'Navigation mount point is unresolved before page generation.'
  )
}

function buildManualNavigationFollowUpActions(brief) {
  const navigationMountAction = brief.pageGenerationDecision?.navigationMountAction || {}
  const publishDeliveryDecision = brief.pageGenerationDecision?.publishDeliveryDecision || {}
  const hostExecutionAdapter = brief.pageGenerationDecision?.hostExecutionAdapter || null
  const targetBusinessPath = normalizeRelativePath(
    brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
  )
  const pageRoutePath = normalizeRelativePath(navigationMountAction.pageRoutePath || '')
  const menuTitle = normalizeString(navigationMountAction.menuTitle || brief.requestedBusiness?.title || '')
  const relatedPagePath = normalizeRelativePath(brief.outputTargetEvidence?.relatedPagePath || '')
  const managedPublishEntryPath =
    normalizeRelativePath(hostExecutionAdapter?.publishEntry?.managedPublishEntryPath) ||
    inferManagedMfPublishEntryRelativePath({
      targetBusinessPath,
      preferredTemplatePath: brief?.sources?.preferredTemplatePath || '',
    })
  const selectedMountSource = normalizeString(navigationMountAction.selectedMountSource || '')
  const publishDeliveryKind = normalizeString(publishDeliveryDecision?.kind)

  if (publishDeliveryKind === 'managed-mf-publish-entry') {
    return [
      navigationMountAction.targetEntryPath
        ? `Repoint the Module Federation expose contract in ${navigationMountAction.targetEntryPath} to the managed publish entry ${managedPublishEntryPath}.`
        : `Repoint the confirmed Module Federation expose contract to the managed publish entry ${managedPublishEntryPath}.`,
      targetBusinessPath
        ? `Keep the generated business page module at ${targetBusinessPath} as the implementation target; ${managedPublishEntryPath} must import the managed local runtime styles.css before re-exporting that page.`
        : `Keep the generated business page module as the implementation target; ${managedPublishEntryPath} must import the managed local runtime styles.css before re-exporting that page.`,
    ]
  }

  if (navigationMountAction.action === 'manual-register-existing-registry') {
    return [
      navigationMountAction.targetRegistryPath
        ? `Manually register route "${pageRoutePath}" and menu "${menuTitle}" in ${navigationMountAction.targetRegistryPath}; the current executor only confirms this router file as the mount target and does not patch this registry shape automatically yet.`
        : 'Manually register the generated page in the confirmed existing router registry; the current executor does not patch this registry shape automatically yet.',
      targetBusinessPath
        ? `Point the manual registry entry at ${targetBusinessPath} and verify the existing router keeps the page inside the current business navigation.`
        : 'Point the manual registry entry at the generated page module and verify the existing router keeps the page inside the current business navigation.',
    ]
  }

  if (navigationMountAction.action === 'append-existing-entry') {
    if (selectedMountSource === 'related-page-evidence' || (!pageRoutePath && relatedPagePath)) {
      return [
        navigationMountAction.targetEntryPath
          ? `Manually update the confirmed parent page ${navigationMountAction.targetEntryPath} so its existing trigger opens the generated subview "${menuTitle}" instead of adding a new route or menu registration.`
          : `Manually update the confirmed parent page flow so its existing trigger opens the generated subview "${menuTitle}" instead of adding a new route or menu registration.`,
        targetBusinessPath
          ? `Keep the generated subview module at ${targetBusinessPath} under the parent module, and do not add a formal navigation entry unless the requirement changes to an independently publishable page.`
          : 'Keep the generated subview inside the parent module, and do not add a formal navigation entry unless the requirement changes to an independently publishable page.',
      ]
    }

    return [
      navigationMountAction.targetEntryPath
        ? `Manually update the legacy business entry ${navigationMountAction.targetEntryPath} so it opens route "${pageRoutePath}" with title "${menuTitle}".`
        : `Manually update the confirmed legacy business entry so it opens route "${pageRoutePath}" with title "${menuTitle}".`,
      targetBusinessPath
        ? `Connect that legacy entry to the generated page module at ${targetBusinessPath}; the current executor does not rewrite legacy addPage/openNewPage calls automatically yet.`
        : 'Connect that legacy entry to the generated page module; the current executor does not rewrite legacy addPage/openNewPage calls automatically yet.',
    ]
  }

  return []
}

function buildParentFlowNavigateExpression({
  targetPathPattern = '',
  paramMap = {},
  rowVariableName = 'row',
}) {
  const normalizedTargetPathPattern = normalizeString(targetPathPattern)
  if (!normalizedTargetPathPattern) return ''

  const tokens = [...normalizedTargetPathPattern.matchAll(/:([A-Za-z0-9_]+)/g)].map((match) => match[1])
  if (tokens.length === 0) {
    return JSON.stringify(normalizedTargetPathPattern)
  }

  let template = normalizedTargetPathPattern
  for (const token of tokens) {
    const fieldName = normalizeString(paramMap?.[token])
    if (!fieldName) return ''
    template = template.replace(
      `:${token}`,
      `\${encodeURIComponent(${rowVariableName}.${fieldName})}`
    )
  }

  return `\`${template}\``
}

function buildManualParentFlowPatchSuggestion({
  brief,
  parentFlowContract = null,
}) {
  const normalizedParentPagePath = normalizeRelativePath(parentFlowContract?.parentPagePath || '')
  const targetBusinessPath = normalizeRelativePath(
    brief?.requestedBusiness?.targetBusinessPath || brief?.requestedBusiness?.dest || ''
  )
  const routePath = normalizeString(
    parentFlowContract?.targetPathPattern || brief?.requestedBusiness?.routePath || ''
  )
  const paramMap = parentFlowContract?.paramMap && typeof parentFlowContract.paramMap === 'object'
    ? parentFlowContract.paramMap
    : {}

  return {
    status: 'manual-parent-trigger-patch-required',
    parentPagePath: normalizedParentPagePath,
    targetBusinessPath,
    triggerKind: normalizeString(parentFlowContract?.triggerKind),
    triggerLocator: parentFlowContract?.triggerLocator ?? null,
    targetPathPattern: routePath,
    paramMap,
    backBehavior: normalizeString(parentFlowContract?.backBehavior),
    suggestedNavigateExpression: routePath
      ? buildParentFlowNavigateExpression({
          targetPathPattern: routePath,
          paramMap,
        })
      : '',
    suggestedAction: 'replace-placeholder-view-action-with-navigate',
    summary: normalizedParentPagePath
      ? `Update ${normalizedParentPagePath} so the confirmed parent trigger opens ${routePath || targetBusinessPath || 'the generated subview'} instead of the placeholder action.`
      : `Update the confirmed parent trigger so it opens ${routePath || targetBusinessPath || 'the generated subview'} instead of the placeholder action.`,
  }
}

async function resolveParentFlowPatchPlan({ brief, targetRoot }) {
  const pageRelationKind = normalizeString(brief?.pageGenerationDecision?.pageRelationDecision?.kind)
  const parentFlowContract =
    brief?.requestedBusiness?.parentFlowContract ||
    brief?.requestedBusiness?.navigationMountContract?.parentFlowContract ||
    null

  if (pageRelationKind !== 'same-module-subview') {
    return {
      parentFlowPatchStatus: 'not-applicable',
      manualPatchSuggestion: null,
      patchFiles: [],
      backNavigationStrategy: '',
    }
  }

  if (!parentFlowContract || typeof parentFlowContract !== 'object') {
    return {
      parentFlowPatchStatus: 'manual-parent-trigger-patch-required',
      manualPatchSuggestion: buildManualParentFlowPatchSuggestion({
        brief,
        parentFlowContract: {
          parentPagePath: brief?.outputTargetEvidence?.relatedPagePath || '',
          targetPathPattern: brief?.requestedBusiness?.routePath || '',
          paramMap: {},
          backBehavior: '',
        },
      }),
      patchFiles: [],
      backNavigationStrategy: '',
    }
  }

  const parentPagePath = normalizeRelativePath(parentFlowContract.parentPagePath)
  const parentPageAbsolutePath = parentPagePath ? path.join(targetRoot, parentPagePath) : ''
  const parentMetaPath = parentPagePath
    ? path.join(path.dirname(parentPageAbsolutePath), 'hiui-pagegen.meta.json')
    : ''
  const hasParentMeta = parentMetaPath ? await pathExists(parentMetaPath) : false
  const parentMeta = hasParentMeta
    ? JSON.parse(await fs.readFile(parentMetaPath, 'utf8').catch(() => 'null'))
    : null
  const parentSource = parentPageAbsolutePath ? await fs.readFile(parentPageAbsolutePath, 'utf8').catch(() => '') : ''
  const routeExpression = buildParentFlowNavigateExpression({
    targetPathPattern: parentFlowContract.targetPathPattern,
    paramMap: parentFlowContract.paramMap,
  })
  const rowVariableName = (parentSource.match(/const\s+([A-Za-z_$][\w$]*)\s*=\s*ctx\.rawData\b/) || [])[1] || 'row'
  const finalRouteExpression = buildParentFlowNavigateExpression({
    targetPathPattern: parentFlowContract.targetPathPattern,
    paramMap: parentFlowContract.paramMap,
    rowVariableName,
  })
  const slashPrefixedRouteExpression =
    normalizeString(parentFlowContract.targetPathPattern).startsWith('/')
      ? ''
      : buildParentFlowNavigateExpression({
          targetPathPattern: `/${normalizeString(parentFlowContract.targetPathPattern)}`,
          paramMap: parentFlowContract.paramMap,
          rowVariableName,
        })
  const alreadySatisfiedParentTrigger =
    Boolean(finalRouteExpression) &&
    (parentSource.includes(`navigate(${finalRouteExpression})`) ||
      (slashPrefixedRouteExpression &&
        parentSource.includes(`navigate(${slashPrefixedRouteExpression})`)))
  const canAutoPatch =
    hasParentMeta &&
    normalizeString(parentMeta?.sourceSkill) === 'hiui-design' &&
    normalizeRelativePath(parentMeta?.contentSourcePath || '') === parentPagePath &&
    normalizeString(parentFlowContract.triggerKind) === 'table-row-view' &&
    normalizeString(parentFlowContract?.triggerLocator?.actionLabel || parentFlowContract?.triggerLocator) === '查看' &&
    parentSource.includes('useNavigate') &&
    parentSource.includes('const navigate = useNavigate()') &&
    Boolean(routeExpression)

  if (canAutoPatch && alreadySatisfiedParentTrigger) {
    return {
      parentFlowPatchStatus: 'auto-patched-parent-trigger',
      manualPatchSuggestion: null,
      patchFiles: [],
      backNavigationStrategy: normalizeString(parentFlowContract.backBehavior),
    }
  }

  if (!canAutoPatch) {
    return {
      parentFlowPatchStatus: 'manual-parent-trigger-patch-required',
      manualPatchSuggestion: buildManualParentFlowPatchSuggestion({
        brief,
        parentFlowContract,
      }),
      patchFiles: [],
      backNavigationStrategy: normalizeString(parentFlowContract.backBehavior),
    }
  }

  const patchedSource = parentSource.replace(
    /(onClick=\{\(\) => )Message\.open\(\{[\s\S]*?\}\)(\})([\s\S]*?\{t\('查看'\)\})/,
    `$1navigate(${finalRouteExpression})$2$3`
  )

  if (patchedSource === parentSource) {
    return {
      parentFlowPatchStatus: 'manual-parent-trigger-patch-required',
      manualPatchSuggestion: buildManualParentFlowPatchSuggestion({
        brief,
        parentFlowContract,
      }),
      patchFiles: [],
      backNavigationStrategy: normalizeString(parentFlowContract.backBehavior),
    }
  }

  return {
    parentFlowPatchStatus: 'auto-patched-parent-trigger',
    manualPatchSuggestion: null,
    patchFiles: [
      {
        sourcePath: toSkillSourceTag('parent-flow-auto-patch'),
        destPath: parentPageAbsolutePath,
        content: patchedSource,
        allowManagedOverwrite: true,
        artifactClass: 'navigation',
      },
    ],
    backNavigationStrategy: normalizeString(parentFlowContract.backBehavior),
  }
}

async function resolvePageFamilyWorkflowSnapshot({ skillRoot, brief, pageFamily }) {
  const normalizedPageFamily =
    String(pageFamily || brief.pageSelector?.id || brief.pageType?.pageFamily || '').trim()
  if (!normalizedPageFamily) return null

  const { entry, manifestPath } = await getPageFamilyWorkflowEntry({
    skillRoot,
    pageFamily: normalizedPageFamily,
  })

  return buildFamilyWorkflowSnapshot({
    pageFamily: normalizedPageFamily,
    workflowEntry: entry,
    workflowManifestPath: manifestPath,
  })
}

function buildEnsureCommandPreview({ targetRoot, skillRoot, mode, line, projectLocalAvailable }) {
  const ensureScript = path.join(skillRoot, 'scripts', 'ensure-in-current-project.mjs')
  const commandParts = [
    `node ${JSON.stringify(ensureScript)}`,
    '--target',
    JSON.stringify(targetRoot),
    '--mode',
    JSON.stringify(mode),
    '--no-install',
  ]
  const projectLocalCommandParts = [
    'node ".local-context/hiui-design/scripts/ensure-in-current-project.mjs"',
    '--mode',
    JSON.stringify(mode),
    '--no-install',
  ]

  if (line) {
    commandParts.push('--line', JSON.stringify(line))
    projectLocalCommandParts.push('--line', JSON.stringify(line))
  }

  return {
    command: commandParts.join(' '),
    projectLocalCommand: projectLocalAvailable ? projectLocalCommandParts.join(' ') : '',
  }
}

async function runEnsureInCurrentProject({ targetRoot, skillRoot, mode, line }) {
  const ensureScript = path.join(skillRoot, 'scripts', 'ensure-in-current-project.mjs')
  const args = ['--target', targetRoot, '--mode', mode, '--no-install']
  if (line) {
    args.push('--line', line)
  }

  const { result } = await runProjectNodeScriptSync({
    targetRoot,
    scriptPath: ensureScript,
    scriptArgs: args,
    cwd: targetRoot,
    capture: true,
    maxBuffer: 16 * 1024 * 1024,
  })

  if (result.error) {
    throw result.error
  }

  if ((result.status ?? 1) !== 0) {
    throw new Error(result.stderr?.trim() || result.stdout?.trim() || 'ensure-in-current-project failed')
  }

  return {
    stdout: result.stdout?.trim() || '',
    stderr: result.stderr?.trim() || '',
  }
}

function assertIntegrationExecutionPolicy(brief) {
  if (brief.executionPolicy?.mustPassIntegrationReadinessBeforeWriting !== true) {
    throw new Error(
      `${brief.pageType?.id || 'unknown'}: executionPolicy.mustPassIntegrationReadinessBeforeWriting must stay true`
    )
  }

  if (brief.executionPolicy?.mustPassPageTaskGateBeforeWriting !== true) {
    throw new Error(
      `${brief.pageType?.id || 'unknown'}: executionPolicy.mustPassPageTaskGateBeforeWriting must stay true`
    )
  }

  if (brief.executionPolicy?.requiresProjectLocalHiuiDesignContext !== true) {
    throw new Error(
      `${brief.pageType?.id || 'unknown'}: executionPolicy.requiresProjectLocalHiuiDesignContext must stay true`
    )
  }

  if (!Array.isArray(brief.executionPolicy?.forbiddenIntegrationFallbacks)) {
    throw new Error(
      `${brief.pageType?.id || 'unknown'}: executionPolicy.forbiddenIntegrationFallbacks must be an array`
    )
  }
}

function renderForbiddenIntegrationFallbacks(brief) {
  const forbiddenFallbacks = Array.isArray(brief.executionPolicy?.forbiddenIntegrationFallbacks)
    ? brief.executionPolicy.forbiddenIntegrationFallbacks
    : []

  if (forbiddenFallbacks.length === 0) return ''
  return ` Forbidden fallbacks until the page-task gate is ready: ${forbiddenFallbacks.join(', ')}.`
}

function usesSeparateWorkflow(brief) {
  return brief.pageGenerationDecision?.workflow?.replaceBusinessSlotsByDefault === false
}

function usesRulesDrivenAnalyticsWorkflow(brief) {
  return brief.pageGenerationDecision?.workflow?.generatorMode === 'rule-driven-golden-path'
}

function hasPageAdjustmentContract(brief) {
  return Boolean(brief.pageAdjustmentContract)
}

function replaceFeedbackStatusVariantId(source, variantId) {
  const nextSource = source.replace(
    /(\bvariantId\s*=\s*)(['"])[^'"]+\2/,
    (_, prefix) => `${prefix}${JSON.stringify(variantId)}`
  )

  if (nextSource === source) {
    throw new Error(
      'feedback-status template is missing a replaceable variantId default assignment'
    )
  }

  return nextSource
}

function hasRequestedDetailSections(brief) {
  return (
    brief.pageType.id === 'full-page-detail' &&
    Array.isArray(brief.requestedBusiness?.detailSections) &&
    brief.requestedBusiness.detailSections.length > 0
  )
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeObjectArray(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter((item) => item && typeof item === 'object' && !Array.isArray(item))
    .map((item) => ({ ...item }))
}

function normalizeRelativePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
}

function resolveTargetRelativePath(targetRoot, targetPath) {
  const normalizedTargetRoot = normalizeString(targetRoot)
  const normalizedTargetPath = normalizeString(targetPath)

  if (!normalizedTargetPath) return ''

  if (normalizedTargetRoot && path.isAbsolute(normalizedTargetPath)) {
    const relativePath = path.relative(normalizedTargetRoot, normalizedTargetPath)
    if (
      relativePath &&
      relativePath !== '..' &&
      !relativePath.startsWith(`..${path.sep}`) &&
      relativePath !== '..'
    ) {
      return normalizeRelativePath(relativePath)
    }
  }

  return normalizeRelativePath(normalizedTargetPath)
}

function resolvePlannedPageRelativePath(brief, pageFile, targetRoot = '') {
  const requestedBusinessPath = normalizeRelativePath(
    brief?.requestedBusiness?.targetBusinessPath || brief?.requestedBusiness?.dest || ''
  )
  if (requestedBusinessPath) {
    return `${requestedBusinessPath}/index.tsx`
  }

  return resolveTargetRelativePath(targetRoot, pageFile?.destPath || '')
}

function readTextIfExists(filePath = '') {
  const normalizedFilePath = String(filePath || '').trim()
  if (!normalizedFilePath || !existsSync(normalizedFilePath)) {
    return ''
  }

  try {
    return readFileSync(normalizedFilePath, 'utf8')
  } catch {
    return ''
  }
}

function resolveSiblingImportedPageExportName(pageFilePath = '') {
  const normalizedPageFilePath = String(pageFilePath || '').trim()
  if (!normalizedPageFilePath) return ''

  const pageDirPath = path.dirname(normalizedPageFilePath)
  const parentDirPath = path.dirname(pageDirPath)
  const pageDirName = path.basename(pageDirPath)
  if (!pageDirName || !existsSync(parentDirPath)) {
    return ''
  }

  const siblingEntries = readdirSync(parentDirPath, { withFileTypes: true })
  const importPathPattern = new RegExp(
    `import\\s*\\{([^}]+)\\}\\s*from\\s*['"]\\./${pageDirName}(?:/index)?['"]`,
    'g'
  )

  for (const entry of siblingEntries) {
    if (!entry.isFile()) continue
    if (!/\.(?:[cm]?[jt]sx?)$/i.test(entry.name)) continue

    const siblingPath = path.join(parentDirPath, entry.name)
    if (path.resolve(siblingPath) === path.resolve(normalizedPageFilePath)) continue

    const siblingSource = readTextIfExists(siblingPath)
    if (!siblingSource) continue

    importPathPattern.lastIndex = 0
    let match = importPathPattern.exec(siblingSource)
    while (match) {
      const importedNames = String(match[1] || '')
        .split(',')
        .map((item) => String(item || '').trim())
        .map((item) => item.split(/\s+as\s+/i)[0]?.trim() || '')
        .filter(Boolean)
      const preferredExportName =
        importedNames.find((name) => name.endsWith('Page')) ||
        importedNames.find((name) => /^[A-Z]/.test(name)) ||
        ''

      if (preferredExportName) {
        return preferredExportName
      }

      match = importPathPattern.exec(siblingSource)
    }
  }

  return ''
}

function refreshProjectHostContractSummary(summary, refreshedProjectHostContract) {
  if (!summary || typeof summary !== 'object') return summary || null
  if (!refreshedProjectHostContract || typeof refreshedProjectHostContract !== 'object') return summary

  return {
    ...summary,
    generatedAt: normalizeString(refreshedProjectHostContract.generatedAt) || summary.generatedAt || '',
    fingerprintSource:
      normalizeString(refreshedProjectHostContract.fingerprint?.source) ||
      summary.fingerprintSource ||
      '',
    fingerprintValue:
      normalizeString(refreshedProjectHostContract.fingerprint?.value) ||
      summary.fingerprintValue ||
      '',
    evidenceFiles: Array.isArray(refreshedProjectHostContract.evidenceFiles)
      ? refreshedProjectHostContract.evidenceFiles
      : summary.evidenceFiles || [],
  }
}

function slugifyAsciiSegment(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripScriptModuleExtension(value) {
  return String(value || '').replace(/\.(?:[cm]?[jt]sx?)$/, '')
}

function ensureRelativeImportPath(value) {
  const normalized = String(value || '').replace(/\\/g, '/')
  if (!normalized) return './'
  return normalized.startsWith('.') ? normalized : `./${normalized}`
}

function normalizeImportSpecifierForMatch(value = '') {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/\.(?:[cm]?[jt]sx?)$/, '')
    .replace(/\/index$/, '')
    .replace(/\/+/g, '/')
}

function isTypeScriptLikeModulePath(value) {
  return /\.(?:tsx?|mts|cts)$/.test(String(value || ''))
}

function hasManagedFormalHostShellDecision(brief) {
  return (
    brief.pageGenerationDecision?.hostShellDecision?.status ===
    'materialize-official-formal-host-shell'
  )
}

function inferFirstGeneratedBusinessRoutePath(brief) {
  const explicitRoutePath = normalizeRelativePath(brief.requestedBusiness?.routePath || '')
  if (explicitRoutePath) return explicitRoutePath

  const businessTargetPath = normalizeRelativePath(
    brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
  )
  const routeFromBusinessTarget = businessTargetPath
    .replace(/^src\/pages\/?/, '')
    .replace(/\/index$/, '')

  if (routeFromBusinessTarget) return routeFromBusinessTarget

  const titleSlug = slugifyAsciiSegment(brief.requestedBusiness?.title || '')
  return titleSlug || 'generated-first-page'
}

function inferFirstGeneratedBusinessPageTitle(brief) {
  return String(brief.requestedBusiness?.title || '').trim() || '首个业务页'
}

function buildFormalBusinessShellAppFrameContent({ hostProfile = null, hostShellDecision }) {
  const targetShellPath = normalizeRelativePath(hostShellDecision?.targetShellPath || '')
  const targetRegistryPath = normalizeRelativePath(hostShellDecision?.targetRegistryPath || '')
  const registryImportPath = ensureRelativeImportPath(
    stripScriptModuleExtension(
      path.posix.relative(path.posix.dirname(targetShellPath), targetRegistryPath)
    )
  )
  const coreImportPath = './app-frame-core'

  if (isTypeScriptLikeModulePath(targetShellPath)) {
    return ensureLegacyReactDefaultImport(`import { type ReactNode } from 'react'
import {
  type AppRouteLike as CoreBusinessRouteObject,
  type ShellOptions as CoreBusinessShellOptions,
  TypicalPageAppFrameCore,
} from ${JSON.stringify(coreImportPath)}
import { businessShellOptions as defaultBusinessShellOptions } from ${JSON.stringify(registryImportPath)}

export type BusinessRouteObject = CoreBusinessRouteObject
export type BusinessShellOptions = CoreBusinessShellOptions

export const hiuiDesignFormalShell = 'official-managed-host-shell-wrapper'

// Keep the first formal business shell as a thin wrapper over the managed official host core.
export function TypicalPageAppFrame({
  routes,
  children,
  shellOptions,
}: {
  routes: BusinessRouteObject[]
  children: ReactNode
  shellOptions?: BusinessShellOptions
}) {
  const mergedShellOptions: BusinessShellOptions = {
    ...defaultBusinessShellOptions,
    ...(shellOptions ?? {}),
  }

  return (
    <TypicalPageAppFrameCore routes={routes} shellOptions={mergedShellOptions}>
      {children}
    </TypicalPageAppFrameCore>
  )
}

export function BusinessAppFrame(props: {
  routes: BusinessRouteObject[]
  children: ReactNode
  shellOptions?: BusinessShellOptions
}) {
  return <TypicalPageAppFrame {...props} />
}

export default BusinessAppFrame
`, hostProfile)
  }

  return ensureLegacyReactDefaultImport(`import { TypicalPageAppFrameCore } from ${JSON.stringify(coreImportPath)}
import { businessShellOptions as defaultBusinessShellOptions } from ${JSON.stringify(registryImportPath)}

export const hiuiDesignFormalShell = 'official-managed-host-shell-wrapper'

// Keep the first formal business shell as a thin wrapper over the managed official host core.
export function TypicalPageAppFrame({ routes, children, shellOptions }) {
  const mergedShellOptions = {
    ...defaultBusinessShellOptions,
    ...(shellOptions ?? {}),
  }

  return (
    <TypicalPageAppFrameCore routes={routes} shellOptions={mergedShellOptions}>
      {children}
    </TypicalPageAppFrameCore>
  )
}

export function BusinessAppFrame(props) {
  return <TypicalPageAppFrame {...props} />
}

export default BusinessAppFrame
`, hostProfile)
}

function buildFormalBusinessRoutesContent({ brief, hostProfile = null, hostShellDecision }) {
  const targetRegistryPath = normalizeRelativePath(hostShellDecision?.targetRegistryPath || '')
  const targetShellPath = normalizeRelativePath(hostShellDecision?.targetShellPath || '')
  const targetBusinessPath = normalizeRelativePath(
    brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
  )
  const generatedRoutePath = inferFirstGeneratedBusinessRoutePath(brief)
  const generatedPageTitle = inferFirstGeneratedBusinessPageTitle(brief)
  const pageImportPath = ensureRelativeImportPath(
    path.posix.relative(path.posix.dirname(targetRegistryPath), targetBusinessPath)
  )
  const businessShellBrandTitle = '业务工作台'

  if (isTypeScriptLikeModulePath(targetRegistryPath)) {
    return ensureLegacyReactDefaultImport(`import { AppStoreFilled } from '@hi-ui/icons'
import { type ReactNode } from 'react'
import GeneratedBusinessPage from ${JSON.stringify(pageImportPath)}

type BusinessRouteObject = {
  title?: string
  path?: string
  icon?: ReactNode
  showInMenu?: boolean
  children?: BusinessRouteObject[]
  element?: ReactNode
}

type BusinessShellOptions = {
  brandTitle?: string
  profileName?: string
  profileEmail?: string
  routeBasePath?: string
}

const BUSINESS_NAVIGATION_GROUP_TITLE = '业务导航'
const FIRST_GENERATED_BUSINESS_ROUTE_TITLE = ${JSON.stringify(generatedPageTitle)}
const FIRST_GENERATED_BUSINESS_ROUTE_PATH = ${JSON.stringify(generatedRoutePath)}

export const businessShellOptions: BusinessShellOptions = {
  brandTitle: ${JSON.stringify(businessShellBrandTitle)},
}

export const businessRoutes: BusinessRouteObject[] = [
  {
    title: BUSINESS_NAVIGATION_GROUP_TITLE,
    icon: <AppStoreFilled />,
    children: [
      {
        title: FIRST_GENERATED_BUSINESS_ROUTE_TITLE,
        path: FIRST_GENERATED_BUSINESS_ROUTE_PATH,
        element: <GeneratedBusinessPage />,
      },
    ],
  },
]

export const businessRouteChildren = businessRoutes.flatMap((route) => route.children ?? [])
export const businessLandingPath = \`/\${FIRST_GENERATED_BUSINESS_ROUTE_PATH}\`

export default businessRoutes
`, hostProfile)
  }

  return ensureLegacyReactDefaultImport(`import { AppStoreFilled } from '@hi-ui/icons'
import GeneratedBusinessPage from ${JSON.stringify(pageImportPath)}

const BUSINESS_NAVIGATION_GROUP_TITLE = '业务导航'
const FIRST_GENERATED_BUSINESS_ROUTE_TITLE = ${JSON.stringify(generatedPageTitle)}
const FIRST_GENERATED_BUSINESS_ROUTE_PATH = ${JSON.stringify(generatedRoutePath)}

export const businessShellOptions = {
  brandTitle: ${JSON.stringify(businessShellBrandTitle)},
}

export const businessRoutes = [
  {
    title: BUSINESS_NAVIGATION_GROUP_TITLE,
    icon: <AppStoreFilled />,
    children: [
      {
        title: FIRST_GENERATED_BUSINESS_ROUTE_TITLE,
        path: FIRST_GENERATED_BUSINESS_ROUTE_PATH,
        element: <GeneratedBusinessPage />,
      },
    ],
  },
]

export const businessRouteChildren = businessRoutes.flatMap((route) => route.children ?? [])
export const businessLandingPath = \`/\${FIRST_GENERATED_BUSINESS_ROUTE_PATH}\`

export default businessRoutes
`, hostProfile)
}

function findMatchingTokenIndex(source, openIndex, openToken, closeToken) {
  let depth = 0
  let inSingleQuote = false
  let inDoubleQuote = false
  let inTemplateString = false
  let inLineComment = false
  let inBlockComment = false

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index]
    const nextChar = source[index + 1]
    const prevChar = source[index - 1]

    if (inLineComment) {
      if (char === '\n') inLineComment = false
      continue
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false
        index += 1
      }
      continue
    }

    if (inSingleQuote) {
      if (char === "'" && prevChar !== '\\') inSingleQuote = false
      continue
    }

    if (inDoubleQuote) {
      if (char === '"' && prevChar !== '\\') inDoubleQuote = false
      continue
    }

    if (inTemplateString) {
      if (char === '`' && prevChar !== '\\') inTemplateString = false
      continue
    }

    if (char === '/' && nextChar === '/') {
      inLineComment = true
      index += 1
      continue
    }

    if (char === '/' && nextChar === '*') {
      inBlockComment = true
      index += 1
      continue
    }

    if (char === "'") {
      inSingleQuote = true
      continue
    }

    if (char === '"') {
      inDoubleQuote = true
      continue
    }

    if (char === '`') {
      inTemplateString = true
      continue
    }

    if (char === openToken) {
      depth += 1
      continue
    }

    if (char === closeToken) {
      depth -= 1
      if (depth === 0) return index
    }
  }

  return -1
}

function getLineIndent(source, index) {
  const lineStart = source.lastIndexOf('\n', index - 1) + 1
  const line = source.slice(lineStart, index)
  return line.match(/^[ \t]*/)?.[0] || ''
}

function toPascalCaseIdentifier(value) {
  const segments = String(value || '')
    .split(/[^a-zA-Z0-9]+/)
    .map((segment) => segment.trim())
    .filter(Boolean)

  const pascal = segments
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join('')

  return pascal || 'GeneratedBusinessPage'
}

function buildGeneratedBusinessPageImportName({ pageRoutePath, menuTitle, registrySource }) {
  const titleBaseName = toPascalCaseIdentifier(menuTitle)
  const routeBaseName = toPascalCaseIdentifier(pageRoutePath)
  const preferredBaseName =
    titleBaseName !== 'GeneratedBusinessPage' ? titleBaseName : routeBaseName
  const baseName =
    preferredBaseName === 'GeneratedBusinessPage'
      ? preferredBaseName
      : `${preferredBaseName}GeneratedBusinessPage`
  let candidate = /^[A-Za-z_$]/.test(baseName) ? baseName : `Generated${baseName}`
  let counter = 2

  while (new RegExp(`\\b${candidate}\\b`).test(registrySource)) {
    candidate = `${baseName}${counter}`
    counter += 1
  }

  return candidate
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizeBusinessRoutePath(value) {
  return normalizeRelativePath(value).replace(/^\/+/, '')
}

function collectStaticStringConstants(source = '') {
  const constants = new Map()
  const constantPattern =
    /(?:^|\n)\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`$]*)`)\s*;?/g
  let match = constantPattern.exec(source)

  while (match) {
    const [, identifier, doubleQuotedValue, singleQuotedValue, templateValue] = match
    const rawValue = doubleQuotedValue ?? singleQuotedValue ?? templateValue ?? ''
    constants.set(identifier, normalizeBusinessRoutePath(rawValue))
    match = constantPattern.exec(source)
  }

  return constants
}

function registryContainsRoutePath(source, pageRoutePath) {
  const normalizedPageRoutePath = normalizeBusinessRoutePath(pageRoutePath)
  if (!normalizedPageRoutePath) return false

  if (
    new RegExp(`path\\s*:\\s*(['"\`])${escapeRegExp(normalizedPageRoutePath)}\\1`).test(source)
  ) {
    return true
  }

  const staticStringConstants = collectStaticStringConstants(source)
  for (const [identifier, resolvedValue] of staticStringConstants.entries()) {
    if (resolvedValue !== normalizedPageRoutePath) continue
    if (new RegExp(`path\\s*:\\s*${escapeRegExp(identifier)}\\b`).test(source)) {
      return true
    }
  }

  return false
}

function registryImportsBusinessPath(source, importPath) {
  if (!String(importPath || '').trim()) return false
  return new RegExp(
    `import\\s+[A-Za-z_$][\\w$]*\\s+from\\s+(['"\`])${escapeRegExp(importPath)}\\1`
  ).test(source)
}

function findBusinessRoutesArrayRange(source) {
  const match = source.match(
    /export\s+const\s+businessRoutes(?:\s*:\s*[^=]+)?\s*=\s*\[/
  )
  if (!match || match.index == null) return null

  const openIndex = match.index + match[0].lastIndexOf('[')
  const closeIndex = findMatchingTokenIndex(source, openIndex, '[', ']')
  if (closeIndex < 0) return null

  return {
    openIndex,
    closeIndex,
  }
}

function findFirstChildrenArrayRange(source, startIndex, endIndex) {
  const childrenPattern = /children\s*:\s*\[/g
  let match = childrenPattern.exec(source)

  while (match) {
    const openIndex = match.index + match[0].lastIndexOf('[')
    if (openIndex > startIndex && openIndex < endIndex) {
      const closeIndex = findMatchingTokenIndex(source, openIndex, '[', ']')
      if (closeIndex > openIndex && closeIndex < endIndex) {
        return {
          openIndex,
          closeIndex,
        }
      }
    }
    match = childrenPattern.exec(source)
  }

  return null
}

function findLastRoutePathBeforeIndex(source, startIndex, endIndex) {
  const staticStringConstants = collectStaticStringConstants(source)
  const pathPattern = /path\s*:\s*(?:(['"`])([^'"`]+)\1|([A-Za-z_$][\w$]*))/g
  const segment = source.slice(startIndex, endIndex)
  let match = pathPattern.exec(segment)
  let resolvedPath = ''

  while (match) {
    const [, , quotedValue = '', identifier = ''] = match
    if (quotedValue) {
      resolvedPath = normalizeBusinessRoutePath(quotedValue)
    } else if (identifier) {
      resolvedPath = staticStringConstants.get(identifier) || ''
    }
    match = pathPattern.exec(segment)
  }

  return resolvedPath
}

function resolveNestedChildrenGroupRoutePath({ parentRoutePath, pageRoutePath }) {
  const normalizedParentRoutePath = normalizeBusinessRoutePath(parentRoutePath)
  const normalizedPageRoutePath = normalizeBusinessRoutePath(pageRoutePath)

  if (!normalizedParentRoutePath || !normalizedPageRoutePath) {
    return normalizedPageRoutePath
  }

  const nestedPrefix = `${normalizedParentRoutePath}/`
  if (normalizedPageRoutePath.startsWith(nestedPrefix)) {
    return normalizedPageRoutePath.slice(nestedPrefix.length)
  }

  return normalizedPageRoutePath
}

function appendImportStatement(source, importStatement) {
  if (source.includes(importStatement)) return source

  const importPattern =
    /(?:^|\n)import[\s\S]*?from\s+['"][^'"]+['"];?\n?|(?:^|\n)import\s+['"][^'"]+['"];?\n?/g
  let insertionIndex = 0
  let match = importPattern.exec(source)

  while (match) {
    insertionIndex = match.index + match[0].length
    match = importPattern.exec(source)
  }

  const prefix = source.slice(0, insertionIndex)
  const suffix = source.slice(insertionIndex)
  const separator = insertionIndex > 0 && !prefix.endsWith('\n') ? '\n' : ''
  return `${prefix}${separator}${importStatement}\n${suffix}`
}

function hasNamedImportSymbol(source, importSource, symbol) {
  const importPattern =
    /(^|\n)(\s*import\s+\{)([\s\S]*?)(\}\s+from\s+['"]([^'"]+)['"]\s*;?)/gm
  let match = null

  while ((match = importPattern.exec(source))) {
    if (match[5] !== importSource) continue
    return match[3]
      .split(',')
      .map((item) => item.replace(/\bas\b[\s\S]*$/, '').trim())
      .filter(Boolean)
      .includes(symbol)
  }

  return false
}

function addNamedImportSymbol(source, importSource, symbol) {
  if (hasNamedImportSymbol(source, importSource, symbol)) {
    return source
  }

  const importPattern =
    /(^|\n)(\s*import\s+\{)([\s\S]*?)(\}\s+from\s+['"]([^'"]+)['"]\s*;?)/gm
  let match = null

  while ((match = importPattern.exec(source))) {
    if (match[5] !== importSource) continue

    const symbols = match[3]
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    return source.replace(
      `${match[1]}${match[2]}${match[3]}${match[4]}`,
      `${match[1]}${match[2]} ${[...symbols, symbol].join(', ')} ${match[4]}`
    )
  }

  return appendImportStatement(source, `import { ${symbol} } from ${JSON.stringify(importSource)}`)
}

function removeNamedImportSymbol(source, importSource, symbol) {
  const importPattern =
    /(^|\n)(\s*import\s+\{)([\s\S]*?)(\}\s+from\s+['"]([^'"]+)['"]\s*;?)/gm
  let match = null

  while ((match = importPattern.exec(source))) {
    if (match[5] !== importSource) continue

    const symbols = match[3]
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    const filteredSymbols = symbols.filter((item) => {
      const importedName = item.replace(/\bas\b[\s\S]*$/, '').trim()
      return importedName !== symbol
    })

    if (filteredSymbols.length === symbols.length) {
      return source
    }

    const fullImportStatement = `${match[1]}${match[2]}${match[3]}${match[4]}`
    if (filteredSymbols.length === 0) {
      return source.replace(fullImportStatement, match[1] || '')
    }

    return source.replace(
      fullImportStatement,
      `${match[1]}${match[2]} ${filteredSymbols.join(', ')} ${match[4]}`
    )
  }

  return source
}

function collectExternalImportSources(source = '') {
  const importPatterns = [
    /\bfrom\s+['"]([^./][^'"]*)['"]/g,
    /\bimport\s+['"]([^./][^'"]+)['"]/g,
    /\brequire\(\s*['"]([^./][^'"]+)['"]\s*\)/g,
  ]
  const imports = []

  for (const pattern of importPatterns) {
    let match = null
    while ((match = pattern.exec(source))) {
      imports.push(match[1])
    }
  }

  return [...new Set(imports)]
}

function appendItemToArrayRange({
  source,
  openIndex,
  closeIndex,
  itemBlock,
}) {
  const arrayIndent = getLineIndent(source, closeIndex)
  const arrayBody = source.slice(openIndex + 1, closeIndex)
  const trimmedBody = arrayBody.trimEnd()

  if (!trimmedBody.trim()) {
    return `${source.slice(0, openIndex + 1)}\n${itemBlock}\n${arrayIndent}${source.slice(closeIndex)}`
  }

  const separator = trimmedBody.endsWith(',') ? '\n' : ',\n'
  return `${source.slice(0, openIndex + 1)}${trimmedBody}${separator}${itemBlock}\n${arrayIndent}${source.slice(closeIndex)}`
}

function renderGeneratedBusinessLeafRouteBlock({
  indent,
  menuTitle,
  pageRoutePath,
  importName,
}) {
  return `${indent}{
${indent}  title: ${JSON.stringify(menuTitle)},
${indent}  path: ${JSON.stringify(pageRoutePath)},
${indent}  element: <${importName} />,
${indent}}`
}

function renderGeneratedBusinessRouteGroupBlock({
  indent,
  menuTitle,
  pageRoutePath,
  importName,
}) {
  const leafRouteBlock = renderGeneratedBusinessLeafRouteBlock({
    indent: `${indent}    `,
    menuTitle,
    pageRoutePath,
    importName,
  })

  return `${indent}{
${indent}  title: '业务导航',
${indent}  children: [
${leafRouteBlock}
${indent}  ],
${indent}}`
}

function replaceBusinessLandingPath(source, pageRoutePath) {
  return source.replace(
    /(export\s+const\s+businessLandingPath(?:\s*:\s*[^=]+)?\s*=\s*)(['"`])[^'"`]*\2/,
    (_, prefix, quote) => `${prefix}${quote}/${pageRoutePath}${quote}`
  )
}

function planExistingNavigationRegistryPatch({
  registrySource,
  targetRegistryPath,
  targetBusinessPath,
  pageRoutePath,
  menuTitle,
}) {
  const normalizedRegistryPath = normalizeRelativePath(targetRegistryPath)
  const normalizedBusinessPath = normalizeRelativePath(targetBusinessPath)
  const normalizedPageRoutePath = normalizeBusinessRoutePath(pageRoutePath)
  const normalizedMenuTitle = String(menuTitle || '').trim() || '新业务页'
  const pageImportPath = ensureRelativeImportPath(
    path.posix.relative(path.posix.dirname(normalizedRegistryPath), normalizedBusinessPath)
  )

  if (!normalizedRegistryPath || !normalizedBusinessPath || !normalizedPageRoutePath) {
    return {
      supported: false,
      reason:
        'The certified navigation registry append plan is missing targetRegistryPath, targetBusinessPath, or pageRoutePath.',
      strategy: 'missing-append-inputs',
      content: '',
    }
  }

  const businessRoutesArrayRange = findBusinessRoutesArrayRange(registrySource)
  if (!businessRoutesArrayRange) {
    return {
      supported: false,
      reason:
        `The certified navigation registry ${normalizedRegistryPath} does not expose an appendable export const businessRoutes = [...]. Ask the user to migrate this registry to the managed contract before generating a new page.`,
      strategy: 'unsupported-business-routes-export-shape',
      content: '',
    }
  }

  if (registryContainsRoutePath(registrySource, normalizedPageRoutePath)) {
    if (registryImportsBusinessPath(registrySource, pageImportPath)) {
      return {
        supported: true,
        reason:
          `The certified navigation registry ${normalizedRegistryPath} already mounts route "${normalizedPageRoutePath}" for ${normalizedBusinessPath}; skip duplicate registry writes and continue page generation.`,
        strategy: 'already-mounted-existing-route',
        content: registrySource,
        skipWrite: true,
      }
    }

    return {
      supported: false,
      reason:
        `The certified navigation registry ${normalizedRegistryPath} already contains route "${normalizedPageRoutePath}", but the existing registration does not clearly point at ${normalizedBusinessPath}. Stop and resolve the route ownership manually instead of appending a duplicate entry.`,
      strategy: 'duplicate-route-path',
      content: '',
    }
  }

  const importName = buildGeneratedBusinessPageImportName({
    pageRoutePath: normalizedPageRoutePath,
    menuTitle: normalizedMenuTitle,
    registrySource,
  })
  const importStatement = `import ${importName} from ${JSON.stringify(pageImportPath)}`
  let nextSource = appendImportStatement(registrySource, importStatement)

  const refreshedBusinessRoutesArrayRange = findBusinessRoutesArrayRange(nextSource)
  if (!refreshedBusinessRoutesArrayRange) {
    return {
      supported: false,
      reason:
        `The certified navigation registry ${normalizedRegistryPath} lost the appendable businessRoutes export after import insertion. Stop and inspect the registry manually.`,
      strategy: 'append-shape-lost-after-import-insertion',
      content: '',
    }
  }

  const businessRoutesBody = nextSource
    .slice(
      refreshedBusinessRoutesArrayRange.openIndex + 1,
      refreshedBusinessRoutesArrayRange.closeIndex
    )
    .trim()

  if (!businessRoutesBody) {
    const arrayIndent = getLineIndent(nextSource, refreshedBusinessRoutesArrayRange.closeIndex)
    nextSource = appendItemToArrayRange({
      source: nextSource,
      openIndex: refreshedBusinessRoutesArrayRange.openIndex,
      closeIndex: refreshedBusinessRoutesArrayRange.closeIndex,
      itemBlock: renderGeneratedBusinessRouteGroupBlock({
        indent: `${arrayIndent}  `,
        menuTitle: normalizedMenuTitle,
        pageRoutePath: normalizedPageRoutePath,
        importName,
      }),
    })

    return {
      supported: true,
      reason:
        `The certified navigation registry ${normalizedRegistryPath} was empty; seeded it with a default business navigation group for route "${normalizedPageRoutePath}".`,
      strategy: 'seed-empty-business-routes-group',
      content: replaceBusinessLandingPath(nextSource, normalizedPageRoutePath),
    }
  }

  const childrenArrayRange = findFirstChildrenArrayRange(
    nextSource,
    refreshedBusinessRoutesArrayRange.openIndex,
    refreshedBusinessRoutesArrayRange.closeIndex
  )

  if (childrenArrayRange) {
    const inferredParentRoutePath = findLastRoutePathBeforeIndex(
      nextSource,
      refreshedBusinessRoutesArrayRange.openIndex,
      childrenArrayRange.openIndex
    )
    const nestedChildrenRoutePath = resolveNestedChildrenGroupRoutePath({
      parentRoutePath: inferredParentRoutePath,
      pageRoutePath: normalizedPageRoutePath,
    })
    const childrenArrayIndent = getLineIndent(nextSource, childrenArrayRange.closeIndex)
    return {
      supported: true,
      reason:
        inferredParentRoutePath && nestedChildrenRoutePath !== normalizedPageRoutePath
          ? `Append route "${normalizedPageRoutePath}" to the first existing business navigation group in ${normalizedRegistryPath} using the parent route prefix "${inferredParentRoutePath}".`
          : `Append route "${normalizedPageRoutePath}" to the first existing business navigation group in ${normalizedRegistryPath}.`,
      strategy: 'append-first-existing-children-group',
      content: appendItemToArrayRange({
        source: nextSource,
        openIndex: childrenArrayRange.openIndex,
        closeIndex: childrenArrayRange.closeIndex,
        itemBlock: renderGeneratedBusinessLeafRouteBlock({
          indent: `${childrenArrayIndent}  `,
          menuTitle: normalizedMenuTitle,
          pageRoutePath: nestedChildrenRoutePath,
          importName,
        }),
      }),
    }
  }

  const businessRoutesArrayIndent = getLineIndent(
    nextSource,
    refreshedBusinessRoutesArrayRange.closeIndex
  )
  return {
    supported: true,
    reason:
      `Append route "${normalizedPageRoutePath}" as a top-level business route in ${normalizedRegistryPath}.`,
    strategy: 'append-top-level-business-route',
    content: appendItemToArrayRange({
      source: nextSource,
      openIndex: refreshedBusinessRoutesArrayRange.openIndex,
      closeIndex: refreshedBusinessRoutesArrayRange.closeIndex,
      itemBlock: renderGeneratedBusinessLeafRouteBlock({
        indent: `${businessRoutesArrayIndent}  `,
        menuTitle: normalizedMenuTitle,
        pageRoutePath: normalizedPageRoutePath,
        importName,
      }),
    }),
  }
}

function extractSideEffectImportLines(source = '') {
  return [...new Set(
    source
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^import\s+['"][^'"]+['"];?$/.test(line))
  )]
}

function buildFormalBusinessAppEntryContent({
  appEntryPath,
  appEntrySource,
  hostShellDecision,
}) {
  const targetShellPath = normalizeRelativePath(hostShellDecision?.targetShellPath || '')
  const targetRegistryPath = normalizeRelativePath(hostShellDecision?.targetRegistryPath || '')
  const shellImportPath = ensureRelativeImportPath(
    stripScriptModuleExtension(
      path.posix.relative(path.posix.dirname(appEntryPath), targetShellPath)
    )
  )
  const registryImportPath = ensureRelativeImportPath(
    stripScriptModuleExtension(
      path.posix.relative(path.posix.dirname(appEntryPath), targetRegistryPath)
    )
  )
  const preservedSideEffectImports = extractSideEffectImportLines(appEntrySource)
  const managedStyleImport = `import ${JSON.stringify(
    ensureRelativeImportPath(
      path.posix.relative(
        path.posix.dirname(appEntryPath),
        getManagedLocalRuntimeStylePath(appEntryPath)
      )
    )
  )}`
  const nextSideEffectImports = preservedSideEffectImports.includes(managedStyleImport)
    ? preservedSideEffectImports
    : [...preservedSideEffectImports, managedStyleImport]
  const sideEffectImportBlock = nextSideEffectImports.length > 0
    ? `${nextSideEffectImports.join('\n')}\n`
    : ''
  const useStrictMode = /StrictMode/.test(appEntrySource)
  const rootRenderTree = useStrictMode
    ? `  <React.StrictMode>
    <BrowserRouter>
      <BusinessAppRoot />
    </BrowserRouter>
  </React.StrictMode>`
    : `  <BrowserRouter>
    <BusinessAppRoot />
  </BrowserRouter>`

  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Outlet, useRoutes } from 'react-router-dom'
import BusinessAppFrame from ${JSON.stringify(shellImportPath)}
import {
  businessLandingPath,
  businessRouteChildren,
  businessRoutes,
} from ${JSON.stringify(registryImportPath)}
${sideEffectImportBlock}
function BusinessShellRoute() {
  return (
    <BusinessAppFrame routes={businessRoutes}>
      <Outlet />
    </BusinessAppFrame>
  )
}

function BusinessAppRoot() {
  return useRoutes([
    {
      path: '/',
      element: <BusinessShellRoute />,
      children: [
        {
          index: true,
          element: <Navigate to={businessLandingPath} replace />,
        },
        ...businessRouteChildren,
      ],
    },
  ])
}

const container = document.getElementById('root')

if (!container) {
  throw new Error('Missing #root container for hiui-design formal business shell mount.')
}

ReactDOM.createRoot(container).render(
${rootRenderTree}
)
`
}

function renderIndentedJson(value, indent = '  ') {
  return JSON.stringify(value, null, 2)
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n')
}

function replaceFullPageDetailSectionConfigs(source, detailSections) {
  const startMarker = '// hiui5-pagegen:detail-sections:start'
  const endMarker = '// hiui5-pagegen:detail-sections:end'
  const pattern = new RegExp(
    `${startMarker}[\\s\\S]*?${endMarker}`
  )

  if (!pattern.test(source)) {
    throw new Error('full-page-detail template is missing replaceable detail-section markers')
  }

  const renderedSections = detailSections
    .map((section) => `${renderIndentedJson(section, '  ')},`)
    .join('\n')

  return source.replace(pattern, `${startMarker}\n${renderedSections}\n  ${endMarker}`)
}

function buildSampleDate(rowIndex = 0) {
  const day = String(11 + rowIndex).padStart(2, '0')
  return `2026-04-${day}`
}

function buildSampleDateTime(rowIndex = 0) {
  const day = String(11 + rowIndex).padStart(2, '0')
  const hour = String(9 + rowIndex).padStart(2, '0')
  return `2026-04-${day} ${hour}:30:00`
}

function buildSampleCellValue(label, key, rowIndex = 0) {
  const normalizedKey = String(key || '').toLowerCase()
  const normalizedLabel = String(label || '')

  if (/status/.test(normalizedKey) || normalizedLabel.includes('状态')) {
    return rowIndex === 0 ? '已完成' : '处理中'
  }
  if (/phone/.test(normalizedKey) || normalizedLabel.includes('电话')) {
    return '139****0088'
  }
  if (/time|date|at$/.test(normalizedKey) || normalizedLabel.includes('时间') || normalizedLabel.includes('日期')) {
    return /accepted|service/.test(normalizedKey) || normalizedLabel.includes('受理') || normalizedLabel.includes('服务')
      ? buildSampleDateTime(rowIndex)
      : buildSampleDate(rowIndex)
  }
  if (/days|count|amount|total|metric|value|num/.test(normalizedKey) || normalizedLabel.includes('天数')) {
    return 7 + rowIndex
  }
  return `${normalizedLabel || normalizedKey || '字段'}示例${rowIndex > 0 ? rowIndex + 1 : ''}`
}

function buildMockValueForDetailSection(section) {
  if (section.kind === 'description-group') {
    return (section.fields ?? []).reduce((result, field) => {
      result[field.key] = buildSampleCellValue(field.label, field.key)
      return result
    }, {})
  }

  if (section.kind === 'summary-cards') {
    return [0, 1].map((rowIndex) => {
      const row = {
        [section.cardTitleKey]: `${section.title}${rowIndex + 1}`,
        [section.metricValueKey]: 3 + rowIndex * 4,
      }

      for (const field of section.dateFields ?? []) {
        row[field.key] = buildSampleDate(rowIndex)
      }

      return row
    })
  }

  return [0, 1].map((rowIndex) =>
    (section.columns ?? []).reduce((result, column) => {
      result[column.key] = buildSampleCellValue(column.label, column.key, rowIndex)
      return result
    }, { id: `${section.dataKey}-${rowIndex + 1}` })
  )
}

function buildFullPageDetailMockContent(brief) {
  const payload = brief.requestedBusiness.detailSections.reduce((result, section) => {
    result[section.dataKey] = buildMockValueForDetailSection(section)
    return result
  }, {})

  return `export async function getWorkOrderDetail() {
  return ${JSON.stringify(payload, null, 2)}
}
`
}

function buildTableStatSalesMockContent() {
  return `import type { GetDataSourceParamsType } from '@hi-ui/schema-core'
import { toValues } from 'local-managed-runtime/pro-list-page/hooks/use-fetch-list'

type SelectOption = {
  id: string
  title: string
}

type TableStatOverviewItem = {
  title: string
  value: number
}

type TableStatRow = {
  id: string
  ownerName: string
  timeRange: string
  createCount: number
  signCount: number
  completeCount: number
  rejectCount: number
  cancelCount: number
  cancelBeforeSignCount: number
  cancelAfterSignCount: number
  cancelRebuildCount: number
}

function includesText(value: string | undefined, keyword: string) {
  if (!keyword) return true
  return (value ?? '').toLowerCase().includes(keyword.toLowerCase())
}

function buildPagedResponse<T>(list: T[], params: GetDataSourceParamsType) {
  const current = params.pagination?.current ?? 1
  const pageSize = params.pagination?.pageSize ?? 20
  const start = (current - 1) * pageSize

  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    current,
    pageSize,
  }
}

const tableStatOverview: TableStatOverviewItem[] = [
  { title: '新增商机数', value: 386 },
  { title: '赢单数', value: 142 },
  { title: '成交金额', value: 268 },
  { title: '流失商机', value: 37 },
  { title: '退款订单', value: 12 },
]

const tableStatRows: TableStatRow[] = [
  {
    id: 'owner-001',
    ownerName: '华东大区',
    timeRange: '2026-04-01 至 2026-04-07',
    createCount: 128,
    signCount: 52,
    completeCount: 98,
    rejectCount: 12,
    cancelCount: 4,
    cancelBeforeSignCount: 33,
    cancelAfterSignCount: 18,
    cancelRebuildCount: 21,
  },
  {
    id: 'owner-002',
    ownerName: '华南大区',
    timeRange: '2026-04-01 至 2026-04-07',
    createCount: 104,
    signCount: 41,
    completeCount: 76,
    rejectCount: 9,
    cancelCount: 3,
    cancelBeforeSignCount: 27,
    cancelAfterSignCount: 15,
    cancelRebuildCount: 17,
  },
  {
    id: 'owner-003',
    ownerName: '北方大区',
    timeRange: '2026-04-01 至 2026-04-07',
    createCount: 92,
    signCount: 35,
    completeCount: 64,
    rejectCount: 8,
    cancelCount: 2,
    cancelBeforeSignCount: 24,
    cancelAfterSignCount: 12,
    cancelRebuildCount: 14,
  },
]

export const salesOwnerOptions: SelectOption[] = [
  { id: 'owner-001', title: '华东大区' },
  { id: 'owner-002', title: '华南大区' },
  { id: 'owner-003', title: '北方大区' },
]

export async function getTableStatOverview() {
  return { list: tableStatOverview }
}

export function queryTableStatRows(params: GetDataSourceParamsType) {
  const { ownerId, keyword } = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])
  const normalizedKeyword = keyword != null ? String(keyword) : ''

  return tableStatRows.filter((row) => {
    const ownerMatched = !ownerId || row.id === ownerId
    const keywordMatched = !normalizedKeyword || includesText(row.ownerName, normalizedKeyword)
    return ownerMatched && keywordMatched
  })
}

export async function getTableStatList(params: GetDataSourceParamsType) {
  const list = queryTableStatRows(params)
  return buildPagedResponse(list, params)
}
`
}

function applyTableStatBusinessSlotPlan(source, businessSlotPlan = {}) {
  if (businessSlotPlan.replacementTheme !== 'sales-management') return source

  let nextSource = source
  const visibleLabelReplacements = [
    ['工程师姓名', '销售负责人'],
    ['工程师', '销售负责人'],
    ['工程师组别', '销售团队'],
    ['时间范围', '成交时间'],
    ['建单量', '新增商机数'],
    ['签收量', '赢单数'],
    ['业务完成量', '成交金额'],
    ['不予受理量', '流失商机'],
    ['取消重建量', '复购客户'],
    ['签收前取消量', '待跟进商机'],
    ['签收后取消量', '高价值客户'],
    ['取消量', '退款订单'],
  ]

  for (const [fromLabel, toLabel] of visibleLabelReplacements) {
    nextSource = nextSource.replaceAll(`t('${fromLabel}')`, `t('${toLabel}')`)
  }

  nextSource = nextSource
    .replaceAll('engineerOptions', 'salesOwnerOptions')
    .replaceAll('engineerId', 'ownerId')
    .replaceAll('engineerName', 'ownerName')
    .replace(/^\s*engineerGroupOptions,\n/gm, '')
    .replace(
      /\n\s*F\(t\('[^']+'\), 'engineerGroupIds'\)[\s\S]*?\.val,\n/,
      '\n'
    )

  if (businessSlotPlan.searchPlaceholder) {
    nextSource = nextSource.replace(
      /searchPlaceholder=\{t\('[^']+'\)\}/,
      `searchPlaceholder={t(${JSON.stringify(businessSlotPlan.searchPlaceholder)})}`
    )
  }

  if (Array.isArray(businessSlotPlan.overviewMetrics) && businessSlotPlan.overviewMetrics.length > 0) {
    nextSource = nextSource.replace(
      /response\.list\.map\(\(item\) => \(\{\n\s+\.\.\.item,\n\s+title: t\(item\.title\),\n\s+\}\)\)/,
      `response.list.map((item, index) => ({
          ...item,
          title: t(${JSON.stringify(businessSlotPlan.overviewMetrics)}[index] ?? item.title),
        }))`
    )
  }

  return nextSource
}

function isStructuredBasicTableBusinessSlotPlan(businessSlotPlan = {}) {
  return [
    'legacy-reconstruction-facts',
    'page-type-default-fallback:table-basic',
  ].includes(normalizeString(businessSlotPlan?.source))
}

function isStructuredFullPageEditBusinessSlotPlan(businessSlotPlan = {}) {
  return normalizeString(businessSlotPlan?.source) === 'legacy-reconstruction-facts:full-page-edit'
}

function toGeneratedIdentifier(value, fallback = 'field') {
  const normalized = normalizeString(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((segment, index) =>
      index === 0
        ? segment.charAt(0).toLowerCase() + segment.slice(1)
        : segment.charAt(0).toUpperCase() + segment.slice(1)
    )
    .join('')

  return normalized || fallback
}

function toPascalIdentifier(value, fallback = 'GeneratedBusiness') {
  const normalized = toGeneratedIdentifier(value, fallback.toLowerCase())
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : fallback
}

function buildLegacyOptionConstName(field = {}) {
  return `${toGeneratedIdentifier(field.key || field.label || 'field')}Options`
}

function resolveStructuredFullPageEditRequestPlan(brief) {
  const plan = brief?.pageGenerationDecision?.businessSlotPlan || {}
  const businessIdentifier = normalizeString(plan.businessIdentifier) || 'generatedFullPageEdit'
  const businessIdentifierPascal = toPascalIdentifier(
    businessIdentifier,
    'GeneratedFullPageEdit'
  )
  const pageTitle = normalizeString(plan.title || brief?.requestedBusiness?.title)

  return {
    detailRequestFunctionName:
      normalizeString(plan.detailRequestFunctionName) ||
      `get${businessIdentifierPascal}InitialDetail`,
    submitRequestFunctionName:
      normalizeString(plan.submitRequestFunctionName) ||
      `submit${businessIdentifierPascal}`,
    stashRequestFunctionName:
      normalizeString(plan.stashRequestFunctionName) ||
      `stash${businessIdentifierPascal}Draft`,
    submitSuccessMessage:
      normalizeString(plan.submitSuccessMessage) ||
      `${pageTitle || '当前页面'}已提交`,
    stashSuccessMessage:
      normalizeString(plan.stashSuccessMessage) || '草稿已保存',
    submitActionLabel:
      normalizeString(plan.submitActionLabel) || '提交',
    stashEnabled: plan.stashEnabled === true,
  }
}

function inferLegacySelectOptions(field = {}, plan = {}) {
  const keyAndLabel = `${normalizeString(field.key)} ${normalizeString(field.label)}`

  if (/cooperationStatus|合作状态/i.test(keyAndLabel)) {
    return [
      { id: 'active', title: '合作中' },
      { id: 'pending', title: '待准入' },
      { id: 'paused', title: '暂停合作' },
      { id: 'terminated', title: '终止合作' },
    ]
  }

  if (/contractStatus|合同状态/i.test(keyAndLabel)) {
    return [
      { id: 'draft', title: '草稿' },
      { id: 'active', title: '履约中' },
      { id: 'expiring', title: '即将到期' },
      { id: 'terminated', title: '已终止' },
    ]
  }

  if (/customerStatus|客户状态/i.test(keyAndLabel)) {
    return [
      { id: 'new', title: '新建' },
      { id: 'active', title: '跟进中' },
      { id: 'signed', title: '已签约' },
      { id: 'lost', title: '已流失' },
    ]
  }

  if (/billStatus|auditStatus|reviewStatus|approveStatus|状态|status/i.test(keyAndLabel)) {
    return [
      { id: 'pending', title: '待处理' },
      { id: 'processing', title: '进行中' },
      { id: 'completed', title: '已完成' },
      { id: 'paused', title: '已停用' },
    ]
  }

  if (/settlement|结算/i.test(keyAndLabel)) {
    return [
      { id: 'monthly', title: '月结' },
      { id: 'quarterly', title: '季结' },
      { id: 'delivery', title: '货到付款' },
      { id: 'stage', title: '阶段结算' },
    ]
  }

  if (/serviceType|服务类型/i.test(keyAndLabel)) {
    return [
      { id: 'standard', title: '标准服务' },
      { id: 'urgent', title: '加急服务' },
      { id: 'project', title: '专项服务' },
    ]
  }

  if (/orgId|机构|organization/i.test(keyAndLabel)) {
    return [
      { id: 'bj-center', title: '北京服务中心' },
      { id: 'sh-center', title: '上海服务中心' },
      { id: 'gz-center', title: '广州服务中心' },
    ]
  }

  if (/role|角色/i.test(keyAndLabel)) {
    return [
      { id: 'owner', title: '负责人' },
      { id: 'operator', title: '运营专员' },
      { id: 'auditor', title: '审核专员' },
    ]
  }

  if (/priority|优先级/i.test(keyAndLabel)) {
    return [
      { id: 'high', title: '高优先级' },
      { id: 'medium', title: '中优先级' },
      { id: 'low', title: '低优先级' },
    ]
  }

  if (/owner|负责人|contact|联系人|engineer|工程师/i.test(keyAndLabel)) {
    return [
      { id: 'u-001', title: '王晨' },
      { id: 'u-002', title: '李想' },
      { id: 'u-003', title: '周宁' },
    ]
  }

  const fallbackLabel = normalizeString(field.label || field.key || '选项')
  return [
    { id: 'option-a', title: `${fallbackLabel}A` },
    { id: 'option-b', title: `${fallbackLabel}B` },
    { id: 'option-c', title: `${fallbackLabel}C` },
  ]
}

function getLegacySemanticValues(kind) {
  switch (kind) {
    case 'orgTitles':
      return ['北京服务中心', '上海服务中心', '广州服务中心']
    case 'orgIds':
      return ['bj-center', 'sh-center', 'gz-center']
    case 'serviceTypes':
      return ['标准服务', '加急服务', '专项服务']
    case 'serviceTypeIds':
      return ['standard', 'urgent', 'project']
    case 'statuses':
      return ['待处理', '进行中', '已完成', '已停用']
    case 'statusIds':
      return ['pending', 'processing', 'completed', 'paused']
    case 'people':
      return ['王晨', '李想', '周宁']
    case 'personIds':
      return ['u-001', 'u-002', 'u-003']
    default:
      return []
  }
}

function resolveBasicTableEntityName(plan = {}) {
  const rawEntityName = normalizeString(
    plan?.mockDataTheme?.entityName || plan?.title || '业务对象'
  )

  return rawEntityName.replace(/(管理|列表|查询|复验|测试|页面)$/u, '') || '业务对象'
}

function buildEntityCodePrefix(entityName = '') {
  const normalized = toGeneratedIdentifier(entityName, 'item').replace(/[^A-Za-z]/g, '')
  const prefix = normalized.slice(0, 4).toUpperCase()
  return prefix || 'ITEM'
}

function inferLegacyFieldValue(field = {}, rowIndex = 0, plan = {}) {
  const key = normalizeString(field.key)
  const label = normalizeString(field.label)
  const matcher = `${key} ${label}`
  const suffix = String(rowIndex + 1).padStart(3, '0')
  const entityName = resolveBasicTableEntityName(plan)
  const entityCodePrefix = buildEntityCodePrefix(entityName)
  const rowNameExamples = Array.isArray(plan?.mockDataTheme?.rowNameExamples)
    ? plan.mockDataTheme.rowNameExamples.map((item) => normalizeString(item)).filter(Boolean)
    : []
  const orgTitles = getLegacySemanticValues('orgTitles')
  const orgIds = getLegacySemanticValues('orgIds')
  const serviceTypes = getLegacySemanticValues('serviceTypes')
  const serviceTypeIds = getLegacySemanticValues('serviceTypeIds')
  const statuses = getLegacySemanticValues('statuses')
  const statusIds = getLegacySemanticValues('statusIds')
  const people = getLegacySemanticValues('people')
  const personIds = getLegacySemanticValues('personIds')
  const selectOptions = field.control === 'Select' ? inferLegacySelectOptions(field, plan) : []

  if (field.control === 'Select' && selectOptions.length > 0) {
    return selectOptions[rowIndex % selectOptions.length].id
  }

  if (/actions|操作/i.test(matcher)) {
    return '查看'
  }
  if (/name|名称/i.test(matcher) && !/contact|owner|负责人|联系人|engineer|工程师/i.test(matcher)) {
    if (rowNameExamples.length > 0) {
      return rowNameExamples[rowIndex % rowNameExamples.length]
    }
    return `${entityName}${rowIndex + 1}`
  }
  if (/contactPhone|phone|mobile|tel|电话/i.test(matcher)) {
    return `1380000${String(1201 + rowIndex).padStart(4, '0')}`
  }
  if (/contactName|ownerName|负责人|联系人|engineerName|工程师/i.test(matcher) && !/Id/i.test(key)) {
    return people[rowIndex % people.length]
  }
  if (/ownerId|contactId|engineer|owner|contact|负责人|联系人/i.test(matcher)) {
    return personIds[rowIndex % personIds.length]
  }
  if (/email|邮箱/i.test(matcher)) {
    return `contact${rowIndex + 1}@example.com`
  }
  if (/contractNo|编号|编码|code|No\b/i.test(matcher) && !/status/i.test(key)) {
    return `${entityCodePrefix}-${suffix}`
  }

  if (/divideOrderNo|分账单号/i.test(matcher)) {
    return `DZ20260418${suffix}`
  }
  if (/tradeUpayNo|交易流水号/i.test(matcher)) {
    return `UPAY20260418${suffix}`
  }
  if (/(^|[^A-Za-z])orderNo($|[^A-Za-z])|工单号/i.test(matcher)) {
    return `GD20260418${suffix}`
  }
  if (/serviceNo|服务单号/i.test(matcher)) {
    return `FW20260418${suffix}`
  }
  if (/orgName|机构名称/i.test(matcher)) {
    return orgTitles[rowIndex % orgTitles.length]
  }
  if (/orgId|机构/i.test(matcher)) {
    return orgIds[rowIndex % orgIds.length]
  }
  if (/serviceTypeDesc/i.test(matcher)) {
    return serviceTypes[rowIndex % serviceTypes.length]
  }
  if (/serviceType/i.test(matcher)) {
    return serviceTypeIds[rowIndex % serviceTypeIds.length]
  }
  if (/settlementTypeText|结算方式/i.test(matcher) && !/Id/i.test(key)) {
    return ['月结', '季结', '货到付款', '阶段结算'][rowIndex % 4]
  }
  if (/settlementType|结算方式/i.test(matcher)) {
    return ['monthly', 'quarterly', 'delivery', 'stage'][rowIndex % 4]
  }
  if (/billStatusDesc|statusDesc|状态/i.test(matcher) && !/Id/i.test(key)) {
    if (/cooperationStatus|合作状态/i.test(matcher)) {
      return ['合作中', '待准入', '暂停合作', '终止合作'][rowIndex % 4]
    }
    if (/contractStatus|合同状态/i.test(matcher)) {
      return ['草稿', '履约中', '即将到期', '已终止'][rowIndex % 4]
    }
    if (/customerStatus|客户状态/i.test(matcher)) {
      return ['新建', '跟进中', '已签约', '已流失'][rowIndex % 4]
    }
    return statuses[rowIndex % statuses.length]
  }
  if (/billStatus|status/i.test(matcher)) {
    if (/cooperationStatus|合作状态/i.test(matcher)) {
      return ['active', 'pending', 'paused', 'terminated'][rowIndex % 4]
    }
    if (/contractStatus|合同状态/i.test(matcher)) {
      return ['draft', 'active', 'expiring', 'terminated'][rowIndex % 4]
    }
    if (/customerStatus|客户状态/i.test(matcher)) {
      return ['new', 'active', 'signed', 'lost'][rowIndex % 4]
    }
    return statusIds[rowIndex % statusIds.length]
  }
  if (/receivable|discount|actual|channel|fee|amount|费用|金额/i.test(matcher)) {
    return String((199 + rowIndex * 23).toFixed(2))
  }
  if (/count|数量|量|num/i.test(matcher)) {
    return String(20 + rowIndex * 3)
  }
  if (/dateRange|timeRange/i.test(matcher)) {
    return ['2026-10-01', '2026-10-17']
  }
  if (/time|date|时间|日期/i.test(matcher)) {
    return `2026-10-${String(11 + rowIndex).padStart(2, '0')} 10:${String(10 + rowIndex).padStart(2, '0')}`
  }

  return `${label || key}${rowIndex + 1}`
}

function buildLegacyBasicTableRows(plan = {}) {
  const queryFields = Array.isArray(plan.queryFields) ? plan.queryFields : []
  const tableFields = Array.isArray(plan.tableFields) ? plan.tableFields : []
  const selectFields = queryFields.filter((field) => field.control === 'Select')
  const rows = []

  for (let rowIndex = 0; rowIndex < 6; rowIndex += 1) {
    const row = { id: `legacy-row-${rowIndex + 1}` }
    for (const field of queryFields) {
      if (field.control === 'DateRange') continue
      row[field.key] = inferLegacyFieldValue(field, rowIndex, plan)
    }
    for (const field of tableFields) {
      row[field.key] = inferLegacyFieldValue(field, rowIndex, plan)
    }
    rows.push(row)
  }

  for (const row of rows) {
    for (const field of selectFields) {
      const options = inferLegacySelectOptions(field, plan)
      row[field.key] = options.find((option) => option.id === row[field.key])?.id || options[0]?.id || ''
    }
  }

  return rows
}

function shouldHideManagedKeywordQueryField(field = {}, plan = {}) {
  if (!normalizeString(plan.searchPlaceholder)) return false

  const control = normalizeString(field.control)
  if (control && control !== 'Input') return false

  const fieldKey = normalizeString(field.key || field.field)
  const requestParamKey = normalizeString(field.requestParamKey)
  return fieldKey === 'keyword' || requestParamKey === 'keyword'
}

function getVisibleLegacyQueryFields(plan = {}) {
  const queryFields = Array.isArray(plan.queryFields) ? plan.queryFields : []
  return queryFields.filter((field) => !shouldHideManagedKeywordQueryField(field, plan))
}

function renderLegacyQueryFieldSource(plan = {}) {
  const queryFields = getVisibleLegacyQueryFields(plan)

  return queryFields
    .map((field) => {
      const label = normalizeString(field.label)
      const key = normalizeString(field.key)
      const placeholder = normalizeString(field.placeholder)
      if (field.control === 'Select') {
        const optionConstName = buildLegacyOptionConstName(field)
        return `      F(t(${JSON.stringify(label)}), ${JSON.stringify(key)})
        .Select({
          data: ${optionConstName}.map((option) => ({ ...option, title: t(option.title) })),
          clearable: true,
          overlay: queryFilterPickerOverlay,
        })
        .val`
      }
      if (field.control === 'DateRange') {
        return `      F(t(${JSON.stringify(label)}), ${JSON.stringify(key)})
        .Date({
          type: 'daterange',
          format: 'YYYY-MM-DD',
          clearable: true,
          overlay: queryFilterDatePickerOverlay,
        })
        .val`
      }
      return `      F(t(${JSON.stringify(label)}), ${JSON.stringify(key)})
        .Text({ clearable: true })${placeholder ? `.Placeholder(t(${JSON.stringify(placeholder)}))` : ''}
        .val`
    })
    .join(',\n')
}

function buildLegacyTableFieldWidth(field = {}) {
  const matcher = `${normalizeString(field.key)} ${normalizeString(field.label)}`
  if (/费用|金额|fee|amount/i.test(matcher)) return 148
  if (/时间|日期|time|date/i.test(matcher)) return 176
  if (/状态|status/i.test(matcher)) return 128
  return 160
}

function buildLegacyDetailPageTitle(title = '') {
  const normalizedTitle = normalizeString(title).replace(/(查询|列表|管理)$/u, '')
  return `${normalizedTitle || '业务'}详情`
}

function resolveLegacyWorkspaceImportSource(sourcePath = '', sourceModule = '') {
  const normalizedSourceModule = normalizeString(sourceModule)
  const normalizedSourcePath = normalizeRelativePath(sourcePath)

  if (!normalizedSourceModule) return ''
  if (normalizedSourceModule.startsWith('@/')) {
    return stripScriptModuleExtension(normalizedSourceModule)
  }
  if (normalizedSourceModule.startsWith('src/')) {
    return `@/${stripScriptModuleExtension(normalizedSourceModule).slice(4)}`
  }
  if (normalizedSourceModule.startsWith('.')) {
    if (
      normalizedSourceModule === './mock' ||
      normalizedSourceModule === './mock.ts' ||
      normalizedSourceModule === './mock.js'
    ) {
      return './mock'
    }
    if (!normalizedSourcePath) return ''
    const resolvedRelativePath = normalizeRelativePath(
      path.posix.join(path.posix.dirname(normalizedSourcePath), normalizedSourceModule)
    )
    if (!resolvedRelativePath.startsWith('src/')) return ''
    return `@/${stripScriptModuleExtension(resolvedRelativePath).slice(4)}`
  }

  return stripScriptModuleExtension(normalizedSourceModule)
}

function inferLegacyDateRangeRequestParamKeys(field = {}) {
  const explicitStartParamKey = normalizeString(field.startRequestParamKey)
  const explicitEndParamKey = normalizeString(field.endRequestParamKey)
  if (explicitStartParamKey && explicitEndParamKey) {
    return {
      startParamKey: explicitStartParamKey,
      endParamKey: explicitEndParamKey,
    }
  }

  const requestParamKey =
    normalizeString(field.requestParamKey || field.key) || 'dateRange'
  const generatedKey = toGeneratedIdentifier(requestParamKey, 'dateRange')
  const baseKey = generatedKey.endsWith('Range') ? generatedKey.slice(0, -5) : generatedKey
  const capitalizedBaseKey = baseKey.charAt(0).toUpperCase() + baseKey.slice(1)

  return {
    startParamKey: `start${capitalizedBaseKey}`,
    endParamKey: `end${capitalizedBaseKey}`,
  }
}

function extractLegacyRowFieldKeyFromSource(expression = '') {
  const normalizedExpression = normalizeString(expression)
  const rowFieldMatch = normalizedExpression.match(/\brow\.([A-Za-z_$][\w$]*)\b/u)
  return normalizeString(rowFieldMatch?.[1])
}

function resolveLegacySubmitActionContractPlan(contract = {}) {
  const confirmDialog = contract?.confirmDialog || {}
  const detailLoad = contract?.detailLoad || {}
  const snapshotParse = contract?.snapshotParse || {}
  const successRefresh = contract?.successRefresh || {}

  return {
    confirmDialog: {
      type: normalizeString(confirmDialog.type),
      title: normalizeString(confirmDialog.title),
      contentExpression: normalizeString(confirmDialog.contentExpression),
      contentSource: normalizeString(confirmDialog.contentSource),
      contentImportSource: resolveLegacyWorkspaceImportSource(
        confirmDialog.contentSourcePath,
        confirmDialog.contentSourceModule
      ),
      cancelText: normalizeString(confirmDialog.cancelText),
      confirmText: normalizeString(confirmDialog.confirmText),
    },
    detailLoad: {
      apiId: normalizeString(detailLoad.apiId),
      apiImportSource: resolveLegacyWorkspaceImportSource(
        detailLoad.apiSourcePath,
        detailLoad.apiSourceModule
      ),
      requestArgSource: normalizeString(detailLoad.requestArgSource),
      errorMessage: normalizeString(detailLoad.errorMessage) || '详情加载失败',
      rowKeyField: extractLegacyRowFieldKeyFromSource(detailLoad.requestArgSource),
    },
    snapshotParse: {
      adapterResolver: normalizeString(snapshotParse.adapterResolver),
      adapterResolverImportSource: resolveLegacyWorkspaceImportSource(
        snapshotParse.adapterResolverSourcePath,
        snapshotParse.adapterResolverSourceModule
      ),
      adapterResolverArgSource: normalizeString(snapshotParse.adapterResolverArgSource),
      parseMethod: normalizeString(snapshotParse.parseMethod),
      parseArgSource: normalizeString(snapshotParse.parseArgSource),
      errorMessage: normalizeString(snapshotParse.errorMessage) || '审批快照解析失败',
      submitGuardMessage: normalizeString(snapshotParse.submitGuardMessage) || '当前审批快照暂不支持提交',
    },
    submitExecute: {
      submitMethod: normalizeString(contract?.submitExecute?.submitMethod),
      args: Array.isArray(contract?.submitExecute?.args)
        ? contract.submitExecute.args.map((item) => normalizeString(item)).filter(Boolean)
        : [],
    },
    successRefresh: {
      refreshHandler: normalizeString(successRefresh.refreshHandler),
      successMessage: normalizeString(successRefresh.successMessage) || '操作成功',
    },
  }
}

function buildLegacyRowActionHandlerName(actionKey = '', suffix = '') {
  const normalizedActionKey = normalizeString(actionKey).replace(/[^A-Za-z0-9_$]+/gu, ' ')
  const pascalKey =
    normalizedActionKey
      .split(/\s+/u)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') || 'LegacyRowAction'
  return `handle${pascalKey}${suffix}`
}

function resolveLegacyBasicTableApiPlan(plan = {}) {
  const listRequestImportSource = resolveLegacyWorkspaceImportSource(
    plan.listRequestApiSourcePath,
    plan.listRequestApiSourceModule
  )
  const exportImportSource = resolveLegacyWorkspaceImportSource(
    plan.exportApiSourcePath,
    plan.exportApiSourceModule
  )

  return {
    listRequestApiId: normalizeString(plan.listRequestApiId),
    listRequestImportSource,
    hasRealListRequest:
      Boolean(normalizeString(plan.listRequestApiId)) && Boolean(listRequestImportSource),
    exportApiId: normalizeString(plan.exportApiId),
    exportImportSource,
    hasRealExport:
      Boolean(normalizeString(plan.exportApiId)) && Boolean(exportImportSource),
    detailRoutePath: normalizeString(plan.detailRoutePath),
    detailTargetTitle: normalizeString(plan.detailTargetTitle),
    rowActionFieldKey: normalizeString(plan.rowActionFieldKey),
    rowActions: normalizeObjectArray(plan.rowActions).map((action) => ({
      ...action,
      submitActionContract:
        normalizeString(action?.kind) === 'submit'
          ? resolveLegacySubmitActionContractPlan(action.submitActionContract)
          : undefined,
    })),
  }
}

function renderLegacyTableFieldSource(plan = {}, apiPlan = {}) {
  const tableFields = Array.isArray(plan.tableFields) ? plan.tableFields : []
  const primaryLinkFieldKey = normalizeString(plan.primaryLinkFieldKey)
  const statusFieldKeySet = new Set(
    (Array.isArray(plan.statusFieldKeys) ? plan.statusFieldKeys : []).map((key) =>
      normalizeString(key)
    )
  )
  const detailRoutePath = normalizeString(apiPlan.detailRoutePath)
  const detailTitle = normalizeString(apiPlan.detailTargetTitle) || buildLegacyDetailPageTitle(plan.title)
  const rowActionFieldKey = normalizeString(apiPlan.rowActionFieldKey)
  const rowActions = Array.isArray(apiPlan.rowActions) ? apiPlan.rowActions : []

  return tableFields
    .map((field) => {
      const label = normalizeString(field.label)
      const key = normalizeString(field.key)
      const width = buildLegacyTableFieldWidth(field)

      if (primaryLinkFieldKey && primaryLinkFieldKey === key) {
        return `      T(t(${JSON.stringify(label)}), ${JSON.stringify(key)})
        .W(${width})
        .renderCell((cellValue, ctx) => {
          const row = ctx.rawData as Record<string, unknown>

          return (
            <Button
              type="primary"
              appearance="link"
              onClick={() =>
                ${detailRoutePath
                  ? `window?.addPage({
                  title: t(${JSON.stringify(detailTitle)}),
                  path: ${JSON.stringify(detailRoutePath)},
                  refresh: true,
                  params: {
                    ...row,
                  },
                })`
                  : `Message.open({
                  title: [t('查看'), cellValue].filter(Boolean).join(' '),
                })`}
              }
            >
              {cellValue || '—'}
            </Button>
          )
        })
        .val`
      }

      if (rowActionFieldKey && rowActionFieldKey === key && rowActions.length > 0) {
        const actionNodes = rowActions
          .map((action) => {
            const actionLabel = normalizeString(action.label) || '操作'
            if (normalizeString(action.kind) === 'submit') {
              const submitHandlerName = buildLegacyRowActionHandlerName(action.key, 'Submit')
              const rowKeyField =
                normalizeString(action.submitActionContract?.detailLoad?.rowKeyField) || 'id'
              return `              <Button
                type="primary"
                appearance="link"
                loading={submittingRowKeys.has(String(row.${rowKeyField} ?? ''))}
                onClick={() => ${submitHandlerName}(row)}
              >
                {t(${JSON.stringify(actionLabel)})}
              </Button>`
            }

            const routePath = normalizeString(action.routePath)
            const targetTitle = normalizeString(action.targetTitle || actionLabel) || actionLabel
            if (normalizeString(action.kind) !== 'navigate' || !routePath) return ''
            return `              <Button
                type="primary"
                appearance="link"
                onClick={() =>
                  window?.addPage({
                    title: t(${JSON.stringify(targetTitle)}),
                    path: ${JSON.stringify(routePath)},
                    refresh: true,
                    params: {
                      ...row,
                    },
                  })
                }
              >
                {t(${JSON.stringify(actionLabel)})}
              </Button>`
          })
          .filter(Boolean)

        if (actionNodes.length > 0) {
          return `      T(t(${JSON.stringify(label)}), ${JSON.stringify(key)})
        .W(${width})
        .renderCell((_cellValue, ctx) => {
          const row = ctx.rawData as Record<string, unknown>

          return (
            <Space>
${actionNodes.join('\n')}
            </Space>
          )
        })
        .val`
        }
      }

      if (statusFieldKeySet.has(key)) {
        return `      T(t(${JSON.stringify(label)}), ${JSON.stringify(key)})
        .W(${width})
        .renderCell((cellValue) => renderGeneratedTableStatusTag(cellValue))
        .val`
      }

      return `      T(t(${JSON.stringify(label)}), ${JSON.stringify(key)}).W(${width}).renderEllipsis().val`
    })
    .join(',\n')
}

function renderLegacyListQueryRequestSource(plan = {}) {
  const queryFields = Array.isArray(plan.queryFields) ? plan.queryFields : []
  const dateRangeFields = queryFields.filter((field) => field.control === 'DateRange')
  const directFields = queryFields.filter((field) => field.control !== 'DateRange')
  const paginationPageParamKey =
    normalizeString(plan?.paginationContract?.pageNumberParamKey) || 'pageNo'
  const lines = [
    'function formatDateBoundary(date: Date | null | undefined, boundary: \'start\' | \'end\') {',
    '  if (!date) return undefined',
    '',
    "  return boundary === 'start'",
    "    ? moment(date).startOf('day').toDate()",
    "    : moment(date).endOf('day').toDate()",
    '}',
    '',
    'function buildListQuery(params: GetDataSourceParamsType) {',
    "  const values = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])",
  ]

  for (const field of dateRangeFields) {
    lines.push(
      `  const ${field.key}Value = Array.isArray(values.${field.key}) ? values.${field.key} : []`
    )
  }

  lines.push('  return {')

  for (const field of directFields) {
    const requestParamKey = normalizeString(field.requestParamKey || field.key)
    const control = normalizeString(field.control)
    if (/^(input|text|search)$/i.test(control)) {
      lines.push(
        `    ${requestParamKey}:`,
        `      typeof values.${field.key} === 'string'`,
        `        ? values.${field.key}.trim() || undefined`,
        `        : values.${field.key} ?? undefined,`
      )
      continue
    }

    lines.push(
      `    ${requestParamKey}:`,
      `      values.${field.key} === undefined || values.${field.key} === null || values.${field.key} === ''`,
      '        ? undefined',
      `        : values.${field.key},`
    )
  }

  for (const field of dateRangeFields) {
    const { startParamKey, endParamKey } = inferLegacyDateRangeRequestParamKeys(field)
    lines.push(
      `    ${startParamKey}: formatDateBoundary(${field.key}Value[0] || null, 'start'),`,
      `    ${endParamKey}: formatDateBoundary(${field.key}Value[1] || null, 'end'),`
    )
  }

  lines.push(
    `    ${paginationPageParamKey}: params.pagination?.current ?? 1,`,
    '    pageSize: params.pagination?.pageSize ?? 20,',
    '  }',
    '}',
    '',
    'function buildExportQuery(query: Record<string, unknown>) {',
    '  return {'
  )

  for (const field of directFields) {
    const requestParamKey = normalizeString(field.requestParamKey || field.key)
    lines.push(`    ${requestParamKey}: query.${requestParamKey},`)
  }

  for (const field of dateRangeFields) {
    const { startParamKey, endParamKey } = inferLegacyDateRangeRequestParamKeys(field)
    lines.push(`    ${startParamKey}: query.${startParamKey},`)
    lines.push(`    ${endParamKey}: query.${endParamKey},`)
  }

  lines.push('  }', '}', '')

  return lines
}

function buildLegacyHeaderExtraSource(plan = {}, apiPlan = {}) {
  const headerActions = Array.isArray(plan.headerActions) ? plan.headerActions : []
  if (headerActions.length === 0) return ''
  const actionNodes = headerActions
    .map((action) => {
      const actionKind = normalizeString(action?.kind)
      const actionLabel = normalizeString(action?.label) || '操作'
      const actionKey = normalizeString(action?.key) || 'legacyHeaderAction'

      if (actionKind === 'export') {
        const exportHandlerSource = apiPlan.hasRealExport
          ? 'handleExport'
          : "() => Message.open({ type: 'success', title: t('导出任务已创建') })"
        const exportLoadingSource = apiPlan.hasRealExport ? '\n            loading={exporting}' : ''
        return `          <Button
            key=${JSON.stringify(actionKey)}
            type="default"
            appearance="line"
            icon={<DownloadOutlined />}
            onClick={${exportHandlerSource}}${exportLoadingSource}
          >
            {t(${JSON.stringify(actionLabel)})}
          </Button>`
      }

      if (actionKind === 'navigate') {
        const navigateHandlerName = buildLegacyHeaderActionHandlerName(actionKey, 'Navigate')
        return `          <Button
            key=${JSON.stringify(actionKey)}
            type="default"
            appearance="line"
            onClick={${navigateHandlerName}}
          >
            {t(${JSON.stringify(actionLabel)})}
          </Button>`
      }

      if (actionKind === 'open-drawer') {
        const openDrawerHandlerName = buildLegacyHeaderActionHandlerName(actionKey, 'OpenDrawer')
        const drawerIconSource = /添加|新增|创建/u.test(actionLabel)
          ? '\n            icon={<PlusOutlined />}'
          : ''
        return `          <Button
            key=${JSON.stringify(actionKey)}
            type="primary"${drawerIconSource}
            onClick={${openDrawerHandlerName}}
          >
            {t(${JSON.stringify(actionLabel)})}
          </Button>`
      }

      return ''
    })
    .filter(Boolean)

  return `      extra={
        <Space className={proTablePageStyles.headerExtra}>
${actionNodes.join('\n')}
        </Space>
      }`
}

function buildLegacyHeaderActionHandlerName(actionKey = '', suffix = '') {
  const normalizedActionKey = normalizeString(actionKey).replace(/[^A-Za-z0-9_$]+/gu, ' ')
  const pascalKey =
    normalizedActionKey
      .split(/\s+/u)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') || 'LegacyHeaderAction'
  return `handle${pascalKey}${suffix}`
}

function buildLegacyHeaderActionStateName(actionKey = '') {
  const handlerName = buildLegacyHeaderActionHandlerName(actionKey, 'DrawerVisibility')
  return handlerName.replace(/^handle/u, 'is')
}

function collectLegacyHeaderActionVariants(plan = {}) {
  const headerActions = Array.isArray(plan.headerActions) ? plan.headerActions : []
  const navigateActions = []
  const drawerActions = []
  const drawerImportEntries = []
  const seenDrawerImports = new Set()

  for (const action of headerActions) {
    const kind = normalizeString(action?.kind)
    if (kind === 'navigate') {
      navigateActions.push(action)
      continue
    }
    if (kind !== 'open-drawer') continue

    drawerActions.push(action)
    const drawerComponent = normalizeString(action?.drawerComponent)
    const drawerImportSource = normalizeString(action?.drawerImportSource)
    const identity = `${drawerComponent}@@${drawerImportSource}`
    if (!drawerComponent || !drawerImportSource || seenDrawerImports.has(identity)) continue
    seenDrawerImports.add(identity)
    drawerImportEntries.push({
      drawerComponent,
      drawerImportSource,
    })
  }

  return {
    navigateActions,
    drawerActions,
    drawerImportEntries,
  }
}

export function buildLegacyBasicTablePageSource(brief) {
  const plan = brief?.pageGenerationDecision?.businessSlotPlan || {}
  const visibleQueryFields = getVisibleLegacyQueryFields(plan)
  const selectFields = visibleQueryFields.filter((field) => field.control === 'Select')
  const needsDateOverlay = visibleQueryFields.some((field) => field.control === 'DateRange')
  const usesStatusTag = Array.isArray(plan.statusFieldKeys) && plan.statusFieldKeys.length > 0
  const apiPlan = resolveLegacyBasicTableApiPlan(plan)
  const submitRowActions = apiPlan.rowActions.filter(
    (action) => normalizeString(action?.kind) === 'submit'
  )
  const headerExtraSource = buildLegacyHeaderExtraSource(plan, apiPlan)
  const { navigateActions, drawerActions, drawerImportEntries } =
    collectLegacyHeaderActionVariants(plan)
  const needsLegacyMessage =
    !apiPlan.hasRealExport || !apiPlan.detailRoutePath || submitRowActions.length > 0
  const needsPlusOutlined = drawerActions.some((action) =>
    /添加|新增|创建/u.test(normalizeString(action?.label))
  )
  const mockImports = [
    ...(!apiPlan.hasRealListRequest ? ['getBasicTableList'] : []),
    ...selectFields.map((field) => buildLegacyOptionConstName(field)),
  ]
  const overlayImports = [
    'ProListPageProvider',
    ...(drawerActions.length > 0 || submitRowActions.length > 0 ? ['useProListPageContext'] : []),
    ...(selectFields.length > 0 ? ['queryFilterPickerOverlay'] : []),
    ...(needsDateOverlay ? ['queryFilterDatePickerOverlay'] : []),
  ]
  const reactHooks = ['useMemo']
  if (apiPlan.hasRealExport) {
    reactHooks.push('useRef', 'useState')
  } else if (drawerActions.length > 0 || submitRowActions.length > 0) {
    reactHooks.push('useState')
  }
  if (submitRowActions.length > 0) {
    reactHooks.push('useCallback')
  }
  const normalizedReactHooks = [...new Set(reactHooks)]
  const apiImportGroups = new Map()
  if (apiPlan.hasRealListRequest) {
    apiImportGroups.set(apiPlan.listRequestImportSource, new Set([apiPlan.listRequestApiId]))
  }
  if (apiPlan.hasRealExport) {
    const symbols = apiImportGroups.get(apiPlan.exportImportSource) || new Set()
    symbols.add(apiPlan.exportApiId)
    apiImportGroups.set(apiPlan.exportImportSource, symbols)
  }
  for (const action of submitRowActions) {
    const submitActionContract = action.submitActionContract || {}
    if (
      normalizeString(submitActionContract.confirmDialog?.contentSource) &&
      normalizeString(submitActionContract.confirmDialog?.contentImportSource)
    ) {
      const symbols =
        apiImportGroups.get(submitActionContract.confirmDialog.contentImportSource) || new Set()
      symbols.add(submitActionContract.confirmDialog.contentSource)
      apiImportGroups.set(submitActionContract.confirmDialog.contentImportSource, symbols)
    }
    if (
      normalizeString(submitActionContract.detailLoad?.apiId) &&
      normalizeString(submitActionContract.detailLoad?.apiImportSource)
    ) {
      const symbols =
        apiImportGroups.get(submitActionContract.detailLoad.apiImportSource) || new Set()
      symbols.add(submitActionContract.detailLoad.apiId)
      apiImportGroups.set(submitActionContract.detailLoad.apiImportSource, symbols)
    }
    if (
      normalizeString(submitActionContract.snapshotParse?.adapterResolver) &&
      normalizeString(submitActionContract.snapshotParse?.adapterResolverImportSource)
    ) {
      const symbols =
        apiImportGroups.get(submitActionContract.snapshotParse.adapterResolverImportSource) ||
        new Set()
      symbols.add(submitActionContract.snapshotParse.adapterResolver)
      apiImportGroups.set(submitActionContract.snapshotParse.adapterResolverImportSource, symbols)
    }
  }
  const basicTableInnerProps = [
    ...(apiPlan.hasRealExport ? ['exporting: boolean', 'onExport: () => Promise<void>'] : []),
    ...navigateActions.map(
      (action) => `${buildLegacyHeaderActionHandlerName(action?.key, 'Navigate')}: () => void`
    ),
    ...drawerActions.flatMap((action) => [
      `${buildLegacyHeaderActionStateName(action?.key)}: boolean`,
      `${buildLegacyHeaderActionHandlerName(action?.key, 'OpenDrawer')}: () => void`,
      `${buildLegacyHeaderActionHandlerName(action?.key, 'CloseDrawer')}: () => void`,
    ]),
  ]
  const basicTableInnerPropEntries = [
    ...(apiPlan.hasRealExport
      ? [
          { prop: 'exporting', value: 'exporting' },
          { prop: 'onExport', value: 'handleExport' },
        ]
      : []),
    ...navigateActions.map((action) => {
      const handlerName = buildLegacyHeaderActionHandlerName(action?.key, 'Navigate')
      return {
        prop: handlerName,
        value: handlerName,
      }
    }),
    ...drawerActions.flatMap((action) => {
      const stateName = buildLegacyHeaderActionStateName(action?.key)
      const openHandlerName = buildLegacyHeaderActionHandlerName(action?.key, 'OpenDrawer')
      const closeHandlerName = buildLegacyHeaderActionHandlerName(action?.key, 'CloseDrawer')
      return [
        { prop: stateName, value: stateName },
        { prop: openHandlerName, value: openHandlerName },
        { prop: closeHandlerName, value: closeHandlerName },
      ]
    }),
  ]
  const basicTableInnerPropNames = basicTableInnerPropEntries.map((item) => item.prop)
  const drawerRenderLines = drawerActions.map((action) => {
    const drawerComponent = normalizeString(action?.drawerComponent)
    const stateName = buildLegacyHeaderActionStateName(action?.key)
    const closeHandlerName = buildLegacyHeaderActionHandlerName(action?.key, 'CloseDrawer')
    const successHandlerName = buildLegacyHeaderActionHandlerName(action?.key, 'Success')
    return `      <${drawerComponent}
        visible={${stateName}}
        onClose={${closeHandlerName}}
        onSuccess={${successHandlerName}}
      />`
  })
  const drawerSuccessHandlerLines = drawerActions.flatMap((action) => {
    const closeHandlerName = buildLegacyHeaderActionHandlerName(action?.key, 'CloseDrawer')
    const successHandlerName = buildLegacyHeaderActionHandlerName(action?.key, 'Success')
    return [
      `  const ${successHandlerName} = () => {`,
      `    ${closeHandlerName}()`,
      '    void refreshListData()',
      '  }',
      '',
    ]
  })
  const parentActionStateLines = drawerActions.flatMap((action) => {
    const stateName = buildLegacyHeaderActionStateName(action?.key)
    const openHandlerName = buildLegacyHeaderActionHandlerName(action?.key, 'OpenDrawer')
    const closeHandlerName = buildLegacyHeaderActionHandlerName(action?.key, 'CloseDrawer')
    return [
      `  const [${stateName}, set${stateName.charAt(0).toUpperCase()}${stateName.slice(1)}] = useState(false)`,
      '',
      `  const ${openHandlerName} = () => {`,
      `    set${stateName.charAt(0).toUpperCase()}${stateName.slice(1)}(true)`,
      '  }',
      '',
      `  const ${closeHandlerName} = () => {`,
      `    set${stateName.charAt(0).toUpperCase()}${stateName.slice(1)}(false)`,
      '  }',
      '',
    ]
  })
  const parentNavigateHandlerLines = navigateActions.flatMap((action) => {
    const handlerName = buildLegacyHeaderActionHandlerName(action?.key, 'Navigate')
    const targetTitle = normalizeString(action?.targetTitle || action?.label) || '页面'
    const routePath = normalizeString(action?.routePath)
    return [
      `  const ${handlerName} = () => {`,
      '    window?.addPage({',
      `      title: ${JSON.stringify(targetTitle)},`,
      `      path: ${JSON.stringify(routePath)},`,
      '      refresh: true,',
      '    })',
      '  }',
      '',
    ]
  })
  const submitRowActionHandlerLines = submitRowActions.flatMap((action) => {
    const submitHandlerName = buildLegacyRowActionHandlerName(action?.key, 'Submit')
    const submitActionContract = action.submitActionContract || {}
    const rowKeySource =
      normalizeString(submitActionContract.detailLoad?.requestArgSource) || "row.id ?? ''"
    const confirmContentSource =
      normalizeString(submitActionContract.confirmDialog?.contentExpression) ||
      JSON.stringify(normalizeString(action?.label) || '确认提交')
    const confirmType = normalizeString(submitActionContract.confirmDialog?.type) || 'warning'
    const confirmTitle = normalizeString(submitActionContract.confirmDialog?.title) || '提示'
    const cancelText = normalizeString(submitActionContract.confirmDialog?.cancelText) || '取消'
    const confirmText = normalizeString(submitActionContract.confirmDialog?.confirmText) || '确定'
    const detailApiId = normalizeString(submitActionContract.detailLoad?.apiId)
    const detailErrorMessage =
      normalizeString(submitActionContract.detailLoad?.errorMessage) || '详情加载失败'
    const adapterResolver = normalizeString(submitActionContract.snapshotParse?.adapterResolver)
    const adapterResolverArgSource =
      normalizeString(submitActionContract.snapshotParse?.adapterResolverArgSource) ||
      'row.moduleCode'
    const submitGuardMessage =
      normalizeString(submitActionContract.snapshotParse?.submitGuardMessage) ||
      '当前审批快照暂不支持提交'
    const parseMethod = normalizeString(submitActionContract.snapshotParse?.parseMethod)
    const parseArgSource =
      normalizeString(submitActionContract.snapshotParse?.parseArgSource) || 'record'
    const parseErrorMessage =
      normalizeString(submitActionContract.snapshotParse?.errorMessage) || '审批快照解析失败'
    const submitMethod = normalizeString(submitActionContract.submitExecute?.submitMethod)
    const submitArgs = Array.isArray(submitActionContract.submitExecute?.args)
      ? submitActionContract.submitExecute.args.map((item) => normalizeString(item)).filter(Boolean)
      : []
    const successMessage =
      normalizeString(submitActionContract.successRefresh?.successMessage) || '操作成功'
    return [
      `  const ${submitHandlerName} = useCallback((rawRow: Record<string, unknown>) => {`,
      "    const row = rawRow as Record<string, any>",
      `    const submitRowKey = String(${rowKeySource} ?? '')`,
      '    Modal.confirm({',
      `      type: ${JSON.stringify(confirmType)},`,
      `      title: ${JSON.stringify(confirmTitle)},`,
      `      content: ${confirmContentSource},`,
      `      cancelText: ${JSON.stringify(cancelText)},`,
      `      confirmText: ${JSON.stringify(confirmText)},`,
      '      onConfirm: async () => {',
      '        if (submittingRowKeys.has(submitRowKey)) return',
      '        setSubmittingRowKeys((current) => new Set(current).add(submitRowKey))',
      '        try {',
      `          const record = await ${detailApiId}(${normalizeString(submitActionContract.detailLoad?.requestArgSource)})`,
      '          if (!record) {',
      `            Message.open({ type: 'error', title: ${JSON.stringify(detailErrorMessage)} })`,
      '            return',
      '          }',
      `          const adapter = ${adapterResolver}(${adapterResolverArgSource})`,
      '          if (!adapter?.submitSnapshot) {',
      `            Message.open({ type: 'error', title: ${JSON.stringify(submitGuardMessage)} })`,
      '            return',
      '          }',
      '          let snapshot: unknown',
      '          try {',
      `            snapshot = adapter.${parseMethod}(${parseArgSource})`,
      '          } catch (error) {',
      '            Message.open({',
      "              type: 'error',",
      `              title: error instanceof Error ? error.message : ${JSON.stringify(parseErrorMessage)},`,
      '            })',
      '            return',
      '          }',
      `          const success = await adapter.${submitMethod}(${submitArgs.join(', ')})`,
      '          if (success) {',
      `            Message.open({ type: 'success', title: ${JSON.stringify(successMessage)} })`,
      '            await refreshListData()',
      '          }',
      '        } catch (error) {',
      '          Message.open({',
      "            type: 'error',",
      "            title: error instanceof Error ? error.message : '提交失败，请稍后重试',",
      '          })',
      '        } finally {',
      '          setSubmittingRowKeys((current) => {',
      '            const next = new Set(current)',
      '            next.delete(submitRowKey)',
      '            return next',
      '          })',
      '        }',
      '      },',
      '    })',
      `  }, [refreshListData, submittingRowKeys])`,
      '',
    ]
  })
  const tableFieldDependencyNames = [
    't',
    ...(submitRowActions.length > 0 ? ['submittingRowKeys'] : []),
    ...submitRowActions.map((action) => buildLegacyRowActionHandlerName(action?.key, 'Submit')),
  ]
  const paginationPageParamKey =
    normalizeString(plan?.paginationContract?.pageNumberParamKey) || 'pageNo'
  const currentPageExpression = [
    `result?.${paginationPageParamKey}`,
    'result?.pageNo',
    'result?.pageNum',
    `query.${paginationPageParamKey}`,
    '1',
  ]
    .filter((value, index, array) => array.indexOf(value) === index)
    .join(' ?? ')

  const lines = [
    `import { ${normalizedReactHooks.join(', ')} } from 'react'`,
    ...(apiPlan.hasRealListRequest ? ["import moment from 'moment'"] : []),
    `import { Button${needsLegacyMessage ? ', Message' : ''}${submitRowActions.length > 0 ? ', Modal' : ''}, Space${usesStatusTag ? ', Tag' : ''} } from '@hi-ui/hiui'`,
    `import { DownloadOutlined${needsPlusOutlined ? ', PlusOutlined' : ''} } from '@hi-ui/icons'`,
    `import { extendDsl, F, ReadonlyFieldCreator${apiPlan.hasRealListRequest ? ', type GetDataSourceParamsType' : ''} } from '@hi-ui/schema-core'`,
    "import { TypicalPageFieldMapProvider } from 'local-managed-runtime'",
    'import {',
    ...overlayImports.map((item) => `  ${item},`),
    "} from 'local-managed-runtime/pro-list-page'",
    ...(apiPlan.hasRealListRequest
      ? [
          "import { toValues } from 'local-managed-runtime/pro-list-page/hooks/use-fetch-list'",
        ]
      : []),
    'import {',
    '  TablePageFrame,',
    '  proTablePageStyles,',
    '  renderTableTextEllipsis,',
    "} from 'local-managed-runtime/pro-table-page'",
    ...drawerImportEntries.map(
      (item) =>
        `import ${item.drawerComponent} from ${JSON.stringify(item.drawerImportSource)}`
    ),
    ...[...apiImportGroups.entries()].flatMap(([importSource, symbols]) => [
      'import {',
      ...[...symbols].map((symbol) => `  ${symbol},`),
      `} from ${JSON.stringify(importSource)}`,
    ]),
    ...(mockImports.length > 0
      ? [
          'import {',
          ...mockImports.map((item) => `  ${item},`),
          "} from './typical-pages.mock'",
        ]
      : []),
    "import { useTranslation } from './page-localization'",
    '',
    'const T = extendDsl(ReadonlyFieldCreator, {',
    '  renderEllipsis(this) {',
    '    return this.renderCell((cellValue) => renderTableTextEllipsis(cellValue))',
    '  },',
    '})',
    '',
  ]

  if (usesStatusTag) {
    lines.push(
      'function renderGeneratedTableStatusTag(cellValue) {',
      "  const normalizedValue = String(cellValue ?? '').trim()",
      "  if (!normalizedValue) return '—'",
      "  const tagType = /成功|完成|启用|正常|在岗|合作中|履约中|已签约/u.test(normalizedValue)",
      "    ? 'success'",
      "    : /失败|终止|停用|停岗|禁用|异常|流失/u.test(normalizedValue)",
      "      ? 'danger'",
      "      : /中|待|审核|进行|暂停|草稿|即将/u.test(normalizedValue)",
      "        ? 'warning'",
      "        : 'default'",
      '  return <Tag type={tagType} appearance="filled">{normalizedValue}</Tag>',
      '}',
      ''
    )
  }

  if (apiPlan.hasRealListRequest) {
    lines.push(...renderLegacyListQueryRequestSource(plan))
  }

  if (basicTableInnerProps.length > 0) {
    lines.push(
      'type BasicTableInnerProps = {',
      ...basicTableInnerProps.map((item) => `  ${item}`),
      '}',
      ''
    )
  }

  lines.push(
    ...(basicTableInnerProps.length > 0
      ? [`function BasicTableInner({ ${basicTableInnerPropNames.join(', ')} }: BasicTableInnerProps) {`]
      : ['function BasicTableInner() {']),
    '  const { locale, t } = useTranslation()',
    ...(drawerActions.length > 0 || submitRowActions.length > 0
      ? ['  const { refreshListData } = useProListPageContext()', '']
      : []),
    ...(submitRowActions.length > 0
      ? [
          "  const [submittingRowKeys, setSubmittingRowKeys] = useState<Set<string>>(new Set())",
          '',
          ...submitRowActionHandlerLines,
        ]
      : []),
    ...(drawerSuccessHandlerLines.length > 0 ? drawerSuccessHandlerLines : []),
    '',
    '  const queryFields = useMemo(',
    '    () => [',
    renderLegacyQueryFieldSource(plan),
    '    ],',
    '    [t]',
    '  )',
    '',
    '  const tableFields = useMemo(',
    '    () => [',
    renderLegacyTableFieldSource(plan, apiPlan),
    '    ],',
    `    [${tableFieldDependencyNames.join(', ')}]`,
    '  )',
    '',
    '  return (',
    ...(drawerRenderLines.length > 0 ? ['    <>'] : []),
    '      <TablePageFrame',
    '        key={locale}',
    `        title={t(${JSON.stringify(normalizeString(plan.title || brief?.requestedBusiness?.title))})}`,
    '        queryFields={queryFields}',
    '        tableFields={tableFields}',
    `        searchPlaceholder={t(${JSON.stringify(normalizeString(plan.searchPlaceholder) || '请输入关键词')})}`,
    ...(headerExtraSource
      ? [headerExtraSource.replace(/onClick=\{handleExport\}/g, 'onClick={onExport}').replace(/^      /u, '        ')]
      : []),
    '      />',
    ...(drawerRenderLines.length > 0 ? drawerRenderLines : []),
    ...(drawerRenderLines.length > 0 ? ['    </>'] : []),
    '  )',
    '}',
    '',
    'export function BasicTablePage() {',
    ...parentActionStateLines,
    ...(apiPlan.hasRealExport
      ? [
          '  const [exporting, setExporting] = useState(false)',
          '  const latestExportQueryRef = useRef<Record<string, unknown>>({})',
          '',
          '  const handleExport = async () => {',
          '    setExporting(true)',
          '    try {',
          `      await ${apiPlan.exportApiId}(latestExportQueryRef.current)`,
          '    } finally {',
          '      setExporting(false)',
          '    }',
          '  }',
          '',
        ]
      : []),
    ...parentNavigateHandlerLines,
    '  const request = useMemo(',
    ...(apiPlan.hasRealListRequest
      ? [
          '    () => async (params: GetDataSourceParamsType) => {',
          '      const query = buildListQuery(params)',
          ...(apiPlan.hasRealExport
            ? ['      latestExportQueryRef.current = buildExportQuery(query)']
            : []),
          `      const result = await ${apiPlan.listRequestApiId}(query)`,
          '',
          '      return {',
          '        list: Array.isArray(result?.list) ? result.list : [],',
          '        total: Number(result?.total) || 0,',
          `        current: Number(${currentPageExpression}) || 1,`,
          '        pageSize: query.pageSize,',
          '      }',
          '    },',
        ]
      : [
          '    () => async (params: Parameters<typeof getBasicTableList>[0]) => getBasicTableList(params),',
        ]),
    '    []',
    '  )',
    '',
    '  return (',
    '    <ProListPageProvider request={request}>',
    '      <TypicalPageFieldMapProvider>',
    ...(basicTableInnerProps.length > 0
      ? [
          '        <BasicTableInner',
          ...basicTableInnerPropEntries.map(
            ({ prop, value }) => `          ${prop}={${value}}`
          ),
          '        />',
        ]
      : ['        <BasicTableInner />']),
    '      </TypicalPageFieldMapProvider>',
    '    </ProListPageProvider>',
    '  )',
    '}',
    '',
    'export default BasicTablePage',
    ''
  )

  return lines.join('\n')
}

function buildLegacyBasicTableMockContent(brief) {
  const plan = brief?.pageGenerationDecision?.businessSlotPlan || {}
  const queryFields = Array.isArray(plan.queryFields) ? plan.queryFields : []
  const tableFields = Array.isArray(plan.tableFields) ? plan.tableFields : []
  const selectFields = queryFields.filter((field) => field.control === 'Select')
  const optionExports = selectFields.map((field) => ({
    constName: buildLegacyOptionConstName(field),
    options: inferLegacySelectOptions(field, plan),
  }))
  const rows = buildLegacyBasicTableRows(plan)
  const filterableKeys = Array.from(
    new Set(
      [...queryFields.map((field) => normalizeString(field.key)), ...tableFields.map((field) => normalizeString(field.key))]
        .filter(Boolean)
    )
  )
  const keywordKeys = Array.isArray(plan.keywordKeys) && plan.keywordKeys.length > 0
    ? plan.keywordKeys
    : tableFields.slice(0, 3).map((field) => field.key)

  const lines = [
    "import type { GetDataSourceParamsType } from '@hi-ui/schema-core'",
    "import { toValues } from 'local-managed-runtime/pro-list-page/hooks/use-fetch-list'",
    '',
    'type SelectOption = {',
    '  id: string',
    '  title: string',
    '}',
    '',
    'type BasicTableRow = {',
    '  id: string',
    ...filterableKeys.map((key) => `  ${JSON.stringify(key)}: string`),
    '}',
    '',
    'type PagedResponse<T> = {',
    '  list: T[]',
    '  total: number',
    '  current: number',
    '  pageSize: number',
    '}',
    '',
    'function includesText(value: string | undefined, keyword: string) {',
    '  if (!keyword) return true',
    "  return (value ?? '').toLowerCase().includes(keyword.toLowerCase())",
    '}',
    '',
    'function buildPagedResponse<T>(list: T[], params: GetDataSourceParamsType): PagedResponse<T> {',
    "  const current = params.pagination?.current ?? 1",
    "  const pageSize = params.pagination?.pageSize ?? 20",
    '  const start = (current - 1) * pageSize',
    '',
    '  return {',
    '    list: list.slice(start, start + pageSize),',
    '    total: list.length,',
    '    current,',
    '    pageSize,',
    '  }',
    '}',
    '',
    ...optionExports.flatMap((item) => [
      `export const ${item.constName}: SelectOption[] = ${JSON.stringify(item.options, null, 2)}`,
      '',
    ]),
    `const basicTableRows: BasicTableRow[] = ${JSON.stringify(rows, null, 2)}`,
    '',
    'function matchesFilter(row: BasicTableRow, key: string, value: unknown) {',
    '  if (value == null || value === \'\') return true',
    '  if (Array.isArray(value)) {',
    '    if (value.length === 0) return true',
    '    return true',
    '  }',
    '  return includesText(String(row[key] ?? \'\'), String(value))',
    '}',
    '',
    'export function queryBasicTableRows(params: GetDataSourceParamsType) {',
    "  const values = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])",
    "  const keyword = values.keyword != null ? String(values.keyword) : ''",
    '',
    '  return basicTableRows.filter((row) => {',
    `    const keywordMatched = !keyword || ${JSON.stringify(keywordKeys)}.some((key) => includesText(String(row[key] ?? ''), keyword))`,
    '    if (!keywordMatched) return false',
    '',
    '    return Object.entries(values).every(([key, value]) => {',
    "      if (key === 'keyword') return true",
    '      return matchesFilter(row, key, value)',
    '    })',
    '  })',
    '}',
    '',
    'export async function getBasicTableList(params: GetDataSourceParamsType) {',
    '  const list = queryBasicTableRows(params)',
    '  return buildPagedResponse(list, params)',
    '}',
    '',
  ]

  return lines.join('\n')
}

function resolveBasicTableDateFieldKey(dateRangeField = {}, plan = {}) {
  const tableFields = Array.isArray(plan.tableFields) ? plan.tableFields : []
  const requestParamKey = normalizeString(
    dateRangeField.requestParamKey || dateRangeField.key
  )
  const baseKey = requestParamKey.endsWith('Range')
    ? requestParamKey.slice(0, -5)
    : requestParamKey

  const directMatch = tableFields.find((field) => normalizeString(field.key) === baseKey)
  if (directMatch) return normalizeString(directMatch.key)

  const fuzzyMatch = tableFields.find((field) =>
    /time|date|时间|日期/i.test(`${normalizeString(field.key)} ${normalizeString(field.label)}`)
  )
  return normalizeString(fuzzyMatch?.key || '')
}

function buildBasicTableBusinessMockModuleContent(brief) {
  const plan = brief?.pageGenerationDecision?.businessSlotPlan || {}
  const queryFields = Array.isArray(plan.queryFields) ? plan.queryFields : []
  const tableFields = Array.isArray(plan.tableFields) ? plan.tableFields : []
  const selectFields = queryFields.filter((field) => field.control === 'Select')
  const optionExports = selectFields.map((field) => ({
    constName: buildLegacyOptionConstName(field),
    options: inferLegacySelectOptions(field, plan),
  }))
  const rows = buildLegacyBasicTableRows(plan)
  const listApiId = normalizeString(plan.listRequestApiId) || 'getGeneratedBasicTableList'
  const exportApiId = normalizeString(plan.exportApiId) || 'exportGeneratedBasicTableList'
  const keywordKeys =
    Array.isArray(plan.keywordKeys) && plan.keywordKeys.length > 0
      ? plan.keywordKeys
      : tableFields.slice(0, 3).map((field) => normalizeString(field.key)).filter(Boolean)
  const filterableKeys = Array.from(
    new Set(
      [...queryFields.map((field) => normalizeString(field.requestParamKey || field.key)), ...tableFields.map((field) => normalizeString(field.key))]
        .filter(Boolean)
    )
  )
  const directInputFields = queryFields.filter((field) => field.control === 'Input')
  const dateRangeFields = queryFields
    .filter((field) => field.control === 'DateRange')
    .map((field) => ({
      field,
      requestKeys: inferLegacyDateRangeRequestParamKeys(field),
      rowFieldKey: resolveBasicTableDateFieldKey(field, plan),
    }))

  const lines = [
    `type ${toGeneratedIdentifier(plan.title || 'business')}Query = {`,
    ...queryFields.flatMap((field) => {
      if (field.control === 'DateRange') {
        const { startParamKey, endParamKey } = inferLegacyDateRangeRequestParamKeys(field)
        return [
          `  ${startParamKey}?: Date | string`,
          `  ${endParamKey}?: Date | string`,
        ]
      }
      return [`  ${normalizeString(field.requestParamKey || field.key)}?: string`]
    }),
    '  pageNum?: number',
    '  pageSize?: number',
    '}',
    '',
    `type ${toGeneratedIdentifier(plan.title || 'business')}Row = {`,
    '  id: string',
    ...filterableKeys.map((key) => `  ${JSON.stringify(key)}: string`),
    '}',
    '',
    `type ${toGeneratedIdentifier(plan.title || 'business')}ListResult = {`,
    `  list: ${toGeneratedIdentifier(plan.title || 'business')}Row[]`,
    '  total: number',
    '}',
    '',
    ...optionExports.flatMap((item) => [
      `export const ${item.constName}: { id: string; title: string }[] = ${JSON.stringify(item.options, null, 2)}`,
      '',
    ]),
    `const rows: ${toGeneratedIdentifier(plan.title || 'business')}Row[] = ${JSON.stringify(rows, null, 2)}`,
    '',
    'function includesText(value: unknown, keyword: string) {',
    '  return String(value ?? \'\').toLowerCase().includes(keyword.toLowerCase())',
    '}',
    '',
    'function toTimestamp(value: Date | string | undefined) {',
    '  if (!value) return undefined',
    '  const normalized = value instanceof Date ? value.getTime() : new Date(String(value)).getTime()',
    '  return Number.isFinite(normalized) ? normalized : undefined',
    '}',
    '',
    `function filterRows(query: ${toGeneratedIdentifier(plan.title || 'business')}Query) {`,
    "  const keyword = String(query.keyword ?? '').trim()",
    '',
    '  return rows.filter((row) => {',
    `    if (keyword && !${JSON.stringify(keywordKeys)}.some((key) => includesText(row[key], keyword))) {`,
    '      return false',
    '    }',
    '',
    ...directInputFields.flatMap((field) => {
      const requestParamKey = normalizeString(field.requestParamKey || field.key)
      if (requestParamKey === 'keyword') return []
      const rowKey = normalizeString(field.key)
      return [
        `    if (query.${requestParamKey} && !includesText(row.${rowKey}, String(query.${requestParamKey}))) {`,
        '      return false',
        '    }',
        '',
      ]
    }),
    ...selectFields.flatMap((field) => {
      const requestParamKey = normalizeString(field.requestParamKey || field.key)
      const rowKey = normalizeString(field.key)
      return [
        `    if (query.${requestParamKey} && row.${rowKey} !== query.${requestParamKey}) {`,
        '      return false',
        '    }',
        '',
      ]
    }),
    ...dateRangeFields.flatMap(({ requestKeys, rowFieldKey }) => {
      if (!rowFieldKey) return []
      return [
        `    const start${rowFieldKey} = toTimestamp(query.${requestKeys.startParamKey})`,
        `    const end${rowFieldKey} = toTimestamp(query.${requestKeys.endParamKey})`,
        `    const row${rowFieldKey} = toTimestamp(row.${rowFieldKey})`,
        `    if (start${rowFieldKey} != null && row${rowFieldKey} != null && row${rowFieldKey} < start${rowFieldKey}) {`,
        '      return false',
        '    }',
        `    if (end${rowFieldKey} != null && row${rowFieldKey} != null && row${rowFieldKey} > end${rowFieldKey}) {`,
        '      return false',
        '    }',
        '',
      ]
    }),
    '    return true',
    '  })',
    '}',
    '',
    `export async function ${listApiId}(query: ${toGeneratedIdentifier(plan.title || 'business')}Query): Promise<${toGeneratedIdentifier(plan.title || 'business')}ListResult> {`,
    '  const pageNum = Number(query.pageNum) > 0 ? Number(query.pageNum) : 1',
    '  const pageSize = Number(query.pageSize) > 0 ? Number(query.pageSize) : 20',
    '  const filteredRows = filterRows(query)',
    '  const startIndex = (pageNum - 1) * pageSize',
    '',
    '  return {',
    '    list: filteredRows.slice(startIndex, startIndex + pageSize),',
    '    total: filteredRows.length,',
    '  }',
    '}',
    '',
    `export async function ${exportApiId}(query: ${toGeneratedIdentifier(plan.title || 'business')}Query) {`,
    '  return filterRows(query)',
    '}',
    '',
  ]

  return lines.join('\n')
}

function buildDefaultTableStatMockContent() {
  return `import type { GetDataSourceParamsType } from '@hi-ui/schema-core'
import { toValues } from 'local-managed-runtime/pro-list-page/hooks/use-fetch-list'

type SelectOption = {
  id: string
  title: string
}

type TableStatOverviewItem = {
  title: string
  value: number
}

type TableStatRow = {
  id: string
  engineerName: string
  timeRange: string
  createCount: number
  signCount: number
  completeCount: number
  rejectCount: number
  cancelCount: number
  cancelBeforeSignCount: number
  cancelAfterSignCount: number
  cancelRebuildCount: number
}

function includesText(value: string | undefined, keyword: string) {
  if (!keyword) return true
  return (value ?? '').toLowerCase().includes(keyword.toLowerCase())
}

function buildPagedResponse<T>(list: T[], params: GetDataSourceParamsType) {
  const current = params.pagination?.current ?? 1
  const pageSize = params.pagination?.pageSize ?? 20
  const start = (current - 1) * pageSize

  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    current,
    pageSize,
  }
}

const tableStatOverview: TableStatOverviewItem[] = [
  { title: '建单量', value: 1248 },
  { title: '签收量', value: 1096 },
  { title: '业务完成量', value: 972 },
  { title: '不予受理量', value: 41 },
  { title: '取消量', value: 133 },
]

const tableStatRows: TableStatRow[] = [
  {
    id: 'e-001',
    engineerName: '张晨',
    timeRange: '2026-04-01 至 2026-04-07',
    createCount: 138,
    signCount: 126,
    completeCount: 117,
    rejectCount: 3,
    cancelCount: 12,
    cancelBeforeSignCount: 5,
    cancelAfterSignCount: 4,
    cancelRebuildCount: 3,
  },
  {
    id: 'e-002',
    engineerName: '李岩',
    timeRange: '2026-04-01 至 2026-04-07',
    createCount: 122,
    signCount: 118,
    completeCount: 103,
    rejectCount: 5,
    cancelCount: 11,
    cancelBeforeSignCount: 4,
    cancelAfterSignCount: 3,
    cancelRebuildCount: 4,
  },
  {
    id: 'e-003',
    engineerName: '王硕',
    timeRange: '2026-04-01 至 2026-04-07',
    createCount: 114,
    signCount: 102,
    completeCount: 91,
    rejectCount: 2,
    cancelCount: 10,
    cancelBeforeSignCount: 3,
    cancelAfterSignCount: 4,
    cancelRebuildCount: 3,
  },
]

export const engineerOptions: SelectOption[] = [
  { id: 'e-001', title: '张晨' },
  { id: 'e-002', title: '李岩' },
  { id: 'e-003', title: '王硕' },
]

export async function getTableStatOverview() {
  return { list: tableStatOverview }
}

export function queryTableStatRows(params: GetDataSourceParamsType) {
  const { engineerId, keyword } = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])
  const normalizedKeyword = keyword != null ? String(keyword) : ''

  return tableStatRows.filter((row) => {
    const engineerMatched = !engineerId || row.id === engineerId
    const keywordMatched = !normalizedKeyword || includesText(row.engineerName, normalizedKeyword)
    return engineerMatched && keywordMatched
  })
}

export async function getTableStatList(params: GetDataSourceParamsType) {
  const list = queryTableStatRows(params)
  return buildPagedResponse(list, params)
}
`
}

function buildTreeTableMockContent() {
  return `import type { GetDataSourceParamsType } from '@hi-ui/schema-core'
import { toValues } from 'local-managed-runtime/pro-list-page/hooks/use-fetch-list'

type SelectOption = {
  id: string
  title: string
}

export type OrgTreeTableRow = {
  id: string
  departmentName: string
  deptStatus: 'enabled' | 'disabled'
  departmentDuty: string
  managerId: string
  managerName: string
  memberCount: number
  organizationId: string
  organizationTitle: string
  departmentDesc: string
  children?: OrgTreeTableRow[]
}

function includesText(value: string | undefined, keyword: string) {
  if (!keyword) return true
  return (value ?? '').toLowerCase().includes(keyword.toLowerCase())
}

export function countTreeNodes<T extends { children?: T[] }>(list: T[]): number {
  return list.reduce((count, item) => count + 1 + countTreeNodes(item.children ?? []), 0)
}

export const managerOptions: SelectOption[] = [
  { id: 'm-001', title: '张晨' },
  { id: 'm-002', title: '李岩' },
  { id: 'm-003', title: '王硕' },
]

export const basicUserOrganizationOptions: SelectOption[] = [
  { id: 'bj', title: '北京服务中心' },
  { id: 'sh', title: '上海服务中心' },
  { id: 'gz', title: '广州服务中心' },
]

const orgTreeTableRows: OrgTreeTableRow[] = [
  {
    id: 'dept-001',
    departmentName: '华北服务中心',
    deptStatus: 'enabled',
    departmentDuty: '负责北京、天津、河北区域服务履约',
    managerId: 'm-001',
    managerName: '张晨',
    memberCount: 36,
    organizationId: 'bj',
    organizationTitle: '北京服务中心',
    departmentDesc: '统一负责华北区域现场服务排班、工程师管理和质量闭环',
    children: [
      {
        id: 'dept-001-1',
        departmentName: '北京上门组',
        deptStatus: 'enabled',
        departmentDuty: '承接北京市区上门维修工单',
        managerId: 'm-001',
        managerName: '张晨',
        memberCount: 14,
        organizationId: 'bj',
        organizationTitle: '北京服务中心',
        departmentDesc: '覆盖海淀、朝阳、丰台等重点城区',
      },
      {
        id: 'dept-001-2',
        departmentName: '华北质检组',
        deptStatus: 'disabled',
        departmentDuty: '负责服务录音、照片与回访抽检',
        managerId: 'm-003',
        managerName: '王硕',
        memberCount: 6,
        organizationId: 'bj',
        organizationTitle: '北京服务中心',
        departmentDesc: '当前并入全国质检专项项目，常态编制暂停',
      },
    ],
  },
  {
    id: 'dept-002',
    departmentName: '华东服务中心',
    deptStatus: 'enabled',
    departmentDuty: '负责华东区域驻场与门店支持',
    managerId: 'm-002',
    managerName: '李岩',
    memberCount: 28,
    organizationId: 'sh',
    organizationTitle: '上海服务中心',
    departmentDesc: '聚焦门店驻场和高峰期支援调度',
    children: [
      {
        id: 'dept-002-1',
        departmentName: '上海驻场组',
        deptStatus: 'enabled',
        departmentDuty: '驻场服务、门店客诉兜底',
        managerId: 'm-002',
        managerName: '李岩',
        memberCount: 12,
        organizationId: 'sh',
        organizationTitle: '上海服务中心',
        departmentDesc: '重点覆盖旗舰店和高客流门店',
      },
    ],
  },
]

function filterOrgTreeRows(
  list: OrgTreeTableRow[],
  values: Record<string, unknown>
): OrgTreeTableRow[] {
  const keyword = values.keyword != null ? String(values.keyword) : ''

  return list.flatMap((item) => {
    const children: OrgTreeTableRow[] = item.children
      ? filterOrgTreeRows(item.children, values)
      : []
    const selfMatched =
      (!values.managerId || item.managerId === values.managerId) &&
      (!values.organizationId || item.organizationId === values.organizationId) &&
      (!keyword ||
        includesText(item.departmentName, keyword) ||
        includesText(item.departmentDuty, keyword) ||
        includesText(item.departmentDesc, keyword))

    if (selfMatched) return [{ ...item, children }]
    if (children.length > 0) return [{ ...item, children }]
    return []
  })
}

export async function getOrgTreeTableList(params: GetDataSourceParamsType) {
  const values = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])
  const list = filterOrgTreeRows(orgTreeTableRows, values)

  return {
    list,
    total: countTreeNodes(list),
    current: params.pagination?.current ?? 1,
    pageSize: params.pagination?.pageSize ?? 20,
  }
}

export function queryOrgTreeTableRows(params: GetDataSourceParamsType) {
  const values = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])
  return filterOrgTreeRows(orgTreeTableRows, values)
}
`
}

function buildTreeSplitMockContent() {
  return `import type { TreeDataItem } from '@hi-ui/tree'
import type { GetDataSourceParamsType } from '@hi-ui/schema-core'
import { toValues } from 'local-managed-runtime/pro-list-page/hooks/use-fetch-list'

type SelectOption = {
  id: string
  title: string
}

export const itemAttrOptions: SelectOption[] = [
  { id: '成品', title: '成品' },
  { id: '备件', title: '备件' },
  { id: '耗材', title: '耗材' },
]

export const conditionOptions: SelectOption[] = [
  { id: '全新', title: '全新' },
  { id: '良品', title: '良品' },
  { id: '残次', title: '残次' },
]

export const materialCategoryTree: TreeDataItem[] = [
  {
    id: 'root-device',
    title: '整机',
    children: [
      { id: 'phone', title: '手机' },
      { id: 'pad', title: '平板' },
    ],
  },
  {
    id: 'root-part',
    title: '配件',
    children: [
      { id: 'screen', title: '屏幕' },
      { id: 'battery', title: '电池' },
      { id: 'charger', title: '充电器' },
    ],
  },
]

export const materialDefaultExpandedIds = ['root-device', 'root-part']

export type InventoryRow = {
  id: string
  categoryId: string
  index: number
  name: string
  code: string
  unit: string
  serialManaged: '是' | '否'
  itemAttr: string
  conditionGrade: string
  amount: string
}

const inventoryRows: InventoryRow[] = [
  {
    id: 'item-001',
    categoryId: 'phone',
    index: 1,
    name: 'Xiaomi 16 Pro 展示机',
    code: 'PHONE-001',
    unit: '台',
    serialManaged: '是',
    itemAttr: '成品',
    conditionGrade: '全新',
    amount: '4,999',
  },
  {
    id: 'item-002',
    categoryId: 'pad',
    index: 2,
    name: 'Xiaomi Pad 8',
    code: 'PAD-008',
    unit: '台',
    serialManaged: '是',
    itemAttr: '成品',
    conditionGrade: '良品',
    amount: '2,699',
  },
  {
    id: 'item-003',
    categoryId: 'screen',
    index: 3,
    name: '旗舰机型显示屏',
    code: 'PART-SCR-16',
    unit: '片',
    serialManaged: '否',
    itemAttr: '备件',
    conditionGrade: '全新',
    amount: '899',
  },
  {
    id: 'item-004',
    categoryId: 'battery',
    index: 4,
    name: '高压电池模组',
    code: 'PART-BAT-03',
    unit: '块',
    serialManaged: '否',
    itemAttr: '备件',
    conditionGrade: '良品',
    amount: '299',
  },
  {
    id: 'item-005',
    categoryId: 'charger',
    index: 5,
    name: '67W 快充头',
    code: 'ACC-CHG-67',
    unit: '个',
    serialManaged: '否',
    itemAttr: '耗材',
    conditionGrade: '残次',
    amount: '129',
  },
]

export function createInventoryRowQuery(getCategoryId: () => string | null) {
  return function queryInventoryRows(params: GetDataSourceParamsType) {
    const values = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])
    const categoryId = getCategoryId()

    return inventoryRows.filter(
      (item) =>
        (!categoryId || item.categoryId === categoryId) &&
        (!values.itemAttr || item.itemAttr === values.itemAttr) &&
        (!values.conditionGrade || item.conditionGrade === values.conditionGrade)
    )
  }
}
`
}

function buildDrawerFormMockContent() {
  return `type SelectOption = {
  id: string
  title: string
}

export const basicUserRoleOptions: SelectOption[] = [
  { id: 'field', title: '一线工程师' },
  { id: 'lead', title: '组长' },
  { id: 'qc', title: '质检' },
]

export const basicUserPositionOptions: SelectOption[] = [
  { id: 'door', title: '上门工程师' },
  { id: 'station', title: '驻场工程师' },
  { id: 'dispatcher', title: '调度专员' },
]

export const basicUserOrganizationOptions: SelectOption[] = [
  { id: 'bj', title: '北京服务中心' },
  { id: 'sh', title: '上海服务中心' },
  { id: 'gz', title: '广州服务中心' },
]

export const basicUserStatusOptions: SelectOption[] = [
  { id: 'enabled', title: '在岗' },
  { id: 'paused', title: '停岗' },
  { id: 'training', title: '培训中' },
]
`
}

function buildDrawerDetailMockContent() {
  return `export async function getDrawerUserDetail() {
  return {
    userName: '张晨',
    miTalkId: 'zc_service',
    phone: '13800000001',
    email: 'zhangchen@example.com',
    roleTitle: '一线工程师',
    positionTitle: '上门工程师',
    organizationTitle: '北京服务中心',
    entryDate: '2024-06-18',
    userStatusTitle: '在岗',
    remark: '负责重点城区履约，近三个月服务完成率保持在 95% 以上。',
  }
}
`
}

function buildLegacyStructuredFullPageEditMockContent(brief) {
  const plan = brief?.pageGenerationDecision?.businessSlotPlan || {}
  const requestPlan = resolveStructuredFullPageEditRequestPlan(brief)
  const queryFields = Array.isArray(plan.queryFields) ? plan.queryFields : []
  const remarkField =
    plan?.remarkField && typeof plan.remarkField === 'object' ? plan.remarkField : null
  const selectFields = queryFields.filter((field) => field.control === 'Select')
  const optionExports = selectFields.map((field) => ({
    field,
    constName: buildLegacyOptionConstName(field),
    options: inferLegacySelectOptions(field, plan),
  }))
  const initialDetail = {}

  for (const field of queryFields) {
    if (field.control === 'Select') {
      const optionList = optionExports.find(
        (item) => normalizeString(item.field.key) === normalizeString(field.key)
      )?.options || []
      initialDetail[field.key] = optionList[0]?.id || ''
      continue
    }

    if (field.control === 'DateRange') {
      initialDetail[field.key] = ['2026-10-01', '2026-10-17']
      continue
    }

    if (/date|日期/i.test(normalizeString(field.key))) {
      initialDetail[field.key] = '2026-10-18'
      continue
    }

    if (/time|时间/i.test(normalizeString(field.key))) {
      initialDetail[field.key] = '2026-10-18 10:00:00'
      continue
    }

    initialDetail[field.key] = ''
  }

  if (remarkField?.key) {
    initialDetail[remarkField.key] = ''
  }

  return `type SelectOption = {
  id: string
  title: string
}

${optionExports
  .flatMap((item) => [
    `export const ${item.constName}: SelectOption[] = ${JSON.stringify(item.options, null, 2)}`,
    '',
  ])
  .join('\n')}

export async function ${requestPlan.detailRequestFunctionName}() {
  return ${JSON.stringify(initialDetail, null, 2)}
}

export async function ${requestPlan.submitRequestFunctionName}(formData: Record<string, unknown>) {
  return {
    status: 'success',
    action: 'submit',
    formData,
  }
}

export async function ${requestPlan.stashRequestFunctionName}(formData: Record<string, unknown>) {
  return {
    status: 'success',
    action: 'stash',
    formData,
  }
}
`
}

function buildDefaultFullPageEditMockContent() {
  return `type SelectOption = {
  id: string
  title: string
}

export const ticketStatusOptions: SelectOption[] = [
  { id: 'pending', title: '待受理' },
  { id: 'processing', title: '处理中' },
  { id: 'completed', title: '已完成' },
]

export const ticketTypeOptions: SelectOption[] = [
  { id: 'repair', title: '维修工单' },
  { id: 'install', title: '安装工单' },
  { id: 'consult', title: '咨询工单' },
]

export const serviceMethodOptions: SelectOption[] = [
  { id: 'door', title: '上门服务' },
  { id: 'station', title: '到店服务' },
  { id: 'remote', title: '远程协助' },
]

export const purchaseChannelOptions: SelectOption[] = [
  { id: 'mi-mall', title: '小米商城' },
  { id: 'jd', title: '京东' },
  { id: 'offline', title: '线下门店' },
]

export const userTagOptions: SelectOption[] = [
  { id: 'vip', title: '高净值' },
  { id: 'member', title: '会员用户' },
  { id: 'new', title: '新用户' },
]

export const serviceOrgOptions: SelectOption[] = [
  { id: 'bj-door', title: '北京上门中心' },
  { id: 'sh-store', title: '上海门店中心' },
  { id: 'gz-remote', title: '广州远程中心' },
]

export const serviceEngineerOptions: SelectOption[] = [
  { id: 'eng-001', title: '张晨' },
  { id: 'eng-002', title: '李岩' },
  { id: 'eng-003', title: '王硕' },
]

export async function getWorkOrderEditDetail() {
  return {
    ticketNo: 'WO20260418001',
    status: 'processing',
    ticketType: 'repair',
    serviceMethod: 'door',
    relatedProduct: 'Xiaomi 16 Pro',
    purchaseChannel: 'mi-mall',
    warrantyStart: '2025-08-01',
    warrantyEnd: '2027-08-01',
    visitReason: '整机无法正常开机',
    userName: '赵冉',
    userTags: ['vip', 'member'],
    userPhone: '13900000088',
    serviceOrg: 'bj-door',
    serviceEngineer: 'eng-001',
    acceptedAt: '2026-04-17 15:20:00',
    description: '客户反馈设备夜间升级后无法开机，已做基础排查，需安排工程师上门进一步检测。',
  }
}

export async function submitExampleWorkOrder(formData: Record<string, unknown>) {
  return {
    status: 'success',
    action: 'submit',
    formData,
  }
}

export async function stashExampleWorkOrder(formData: Record<string, unknown>) {
  return {
    status: 'success',
    action: 'stash',
    formData,
  }
}
`
}

export function buildFullPageEditMockContent(brief) {
  if (isStructuredFullPageEditBusinessSlotPlan(brief?.pageGenerationDecision?.businessSlotPlan)) {
    return buildLegacyStructuredFullPageEditMockContent(brief)
  }

  return buildDefaultFullPageEditMockContent()
}

function buildDefaultFullPageDetailMockContent() {
  return `export async function getWorkOrderDetail() {
  return {
    basicInfo: {
      ticketNo: 'WO20260418001',
      status: '处理中',
      ticketType: '维修工单',
      serviceMethod: '上门服务',
      relatedProduct: 'Xiaomi 16 Pro',
      purchaseChannel: '小米商城',
      visitReason: '整机无法正常开机',
    },
    warrantyInfo: [
      {
        type: '退货',
        remainingDays: 2,
        startAt: '2026-04-16',
        endAt: '2026-04-22',
      },
      {
        type: '换货',
        remainingDays: 9,
        startAt: '2026-04-16',
        endAt: '2026-04-30',
      },
      {
        type: '维修',
        remainingDays: 469,
        startAt: '2025-08-01',
        endAt: '2027-08-01',
      },
    ],
    customerInfo: {
      userName: '赵冉',
      userTags: '多次来访 / 会员用户',
      userPhone: '13900000088',
    },
    serviceInfo: {
      serviceOrg: '北京上门中心',
      serviceEngineer: '张晨',
      acceptedAt: '2026-04-17 15:20:00',
      description: '此处展示示例描述信息，可能会比较长，超出时内容换行展示。',
    },
    serviceRecords: [
      {
        id: 'record-001',
        serviceTime: '2026-04-17 15:20:00',
        serviceAction: '受理工单',
        status: '已完成',
        detailDescription: '客服已完成工单受理，并同步用户诉求与设备信息。',
      },
      {
        id: 'record-002',
        serviceTime: '2026-04-18 09:30:00',
        serviceAction: '上门检测',
        status: '处理中',
        detailDescription: '工程师已预约上门检测，待同步备件库存后继续处理。',
      },
    ],
  }
}
`
}

const MANAGED_PAGE_LOCAL_MOCK_MODULE_PAGE_TYPES = new Set([
  'table-basic',
  'table-stat',
  'tree-table',
  'tree-split',
  'drawer-form',
  'drawer-detail',
  'full-page-edit',
  'full-page-detail',
])

function shouldMaterializeManagedPageLocalMockModule({ brief } = {}) {
  return MANAGED_PAGE_LOCAL_MOCK_MODULE_PAGE_TYPES.has(
    normalizeString(brief?.pageType?.id)
  )
}

function buildManagedPageLocalMockModuleContent({
  brief,
  targetRoot,
  destDir,
} = {}) {
  const pageTypeId = normalizeString(brief?.pageType?.id)

  switch (pageTypeId) {
    case 'table-basic':
      return shouldMaterializeBasicTableBusinessMockModule({
        brief,
        targetRoot,
        destDir,
      })
        ? buildBasicTableBusinessMockModuleContent(brief)
        : buildLegacyBasicTableMockContent(brief)
    case 'table-stat':
      return brief?.pageGenerationDecision?.businessSlotPlan?.replacementTheme ===
        'sales-management'
        ? buildTableStatSalesMockContent()
        : buildDefaultTableStatMockContent()
    case 'tree-table':
      return buildTreeTableMockContent()
    case 'tree-split':
      return buildTreeSplitMockContent()
    case 'drawer-form':
      return buildDrawerFormMockContent()
    case 'drawer-detail':
      return buildDrawerDetailMockContent()
    case 'full-page-edit':
      return buildFullPageEditMockContent(brief)
    case 'full-page-detail':
      return hasRequestedDetailSections(brief)
        ? buildFullPageDetailMockContent(brief)
        : buildDefaultFullPageDetailMockContent()
    default:
      return ''
  }
}

function shouldMaterializeBasicTableBusinessMockModule({
  brief,
  targetRoot,
  destDir,
}) {
  if (brief?.pageType?.id !== 'table-basic') return false
  if (!isStructuredBasicTableBusinessSlotPlan(brief?.pageGenerationDecision?.businessSlotPlan)) {
    return false
  }

  const plan = brief?.pageGenerationDecision?.businessSlotPlan || {}
  const expectedMockPath = normalizeRelativePath(
    path.relative(targetRoot, path.join(destDir, 'mock.ts'))
  )
  const sourcePaths = [
    normalizeRelativePath(plan.listRequestApiSourcePath),
    normalizeRelativePath(plan.exportApiSourcePath),
  ].filter(Boolean)
  const sourceModules = [
    normalizeString(plan.listRequestApiSourceModule),
    normalizeString(plan.exportApiSourceModule),
  ].filter(Boolean)

  return (
    sourcePaths.includes(expectedMockPath) ||
    sourceModules.includes('./mock') ||
    sourceModules.includes('./mock.ts')
  )
}

function rewriteManagedPageLocalMockImports(source = '', brief) {
  if (!shouldMaterializeManagedPageLocalMockModule({ brief })) {
    return source
  }

  return source.replace(
    /from\s+(['"])\.\/(?:typical-pages|table-stat)\.mock\1/g,
    "from './mock'"
  )
}

function isTemplateMockModuleFile(file = {}) {
  const basename = path.basename(file?.destName || file?.destPath || '')
  return basename === 'typical-pages.mock.ts' || basename === 'table-stat.mock.ts'
}

function shouldOmitTemplateMockModuleFile(file = {}, brief) {
  return (
    shouldMaterializeManagedPageLocalMockModule({ brief }) &&
    isTemplateMockModuleFile(file)
  )
}

function isTemplateTranslationImport(importPath = '') {
  const normalizedImportPath = normalizeRelativePath(importPath).replace(/\/index$/, '')
  return normalizedImportPath.endsWith('/translation')
}

function resolveProjectTranslationImportPath(brief) {
  const targetBusinessPath = normalizeRelativePath(
    brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
  )

  if (!targetBusinessPath) return '../../translation'

  const businessDir = /\.[a-z0-9]+$/i.test(path.posix.basename(targetBusinessPath))
    ? path.posix.dirname(targetBusinessPath)
    : targetBusinessPath
  const relativeTranslationPath = path.posix.relative(businessDir, 'src/translation')

  if (!relativeTranslationPath) return './translation'
  return relativeTranslationPath.startsWith('.')
    ? relativeTranslationPath
    : `./${relativeTranslationPath}`
}

function isPageLocalizationSupportFile(file = {}) {
  return /^page-localization\.[jt]sx?$/.test(path.basename(file.destName || file.destPath || ''))
}

async function hasProjectTranslationRuntime(targetRoot) {
  for (const candidate of PROJECT_TRANSLATION_ENTRY_CANDIDATES) {
    if (await isReadableFile(path.join(targetRoot, candidate))) {
      return true
    }
  }

  return false
}

function buildTranslationBridgeSupportContent(brief) {
  return `export { useTranslation } from '${resolveProjectTranslationImportPath(brief)}'\n`
}

function shouldUseProjectTranslationImport(pageLocalizationSupportPlan = null) {
  const strategy = normalizeString(pageLocalizationSupportPlan?.strategy)
  return (
    strategy === 'project-translation-bridge' ||
    strategy === 'reuse-existing-project-translation'
  )
}

function rewritePageLocalizationImport(source = '', brief, pageLocalizationSupportPlan = null) {
  if (!shouldUseProjectTranslationImport(pageLocalizationSupportPlan)) {
    return source
  }

  const projectTranslationImportPath = resolveProjectTranslationImportPath(brief)
  return source.replace(
    /from\s+['"]\.\/page-localization['"]/g,
    `from '${projectTranslationImportPath}'`
  )
}

function buildFallbackPageLocalizationSupportContent({ reason = '' } = {}) {
  const commentLine = reason ? `// ${reason}` : ''

  return [
    "import { useMemo } from 'react'",
    commentLine,
    '',
    "type TranslationParams = Record<string, string | number | boolean | null | undefined>",
    "type LocaleDirection = 'ltr' | 'rtl'",
    '',
    "const DEFAULT_LOCALE = 'zh-CN'",
    'const DEFAULT_TEXT_EXPANSION_MULTIPLIER = 1',
    '',
    'function resolveLocale() {',
    "  if (typeof document !== 'undefined') {",
    "    const documentLocale = String(document.documentElement.lang || '').trim()",
    '    if (documentLocale) return documentLocale',
    '  }',
    "  if (typeof navigator !== 'undefined') {",
    "    const navigatorLocale = String(navigator.language || '').trim()",
    '    if (navigatorLocale) return navigatorLocale',
    '  }',
    '  return DEFAULT_LOCALE',
    '}',
    '',
    'function resolveDirection(locale: string): LocaleDirection {',
    "  if (typeof document !== 'undefined') {",
    "    return document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'",
    '  }',
    "  return String(locale || '').toLowerCase().startsWith('ar') ? 'rtl' : 'ltr'",
    '}',
    '',
    'function interpolate(template: string, params?: TranslationParams) {',
    '  if (!params) return template',
    "  return template.replace(/\\{(\\w+)\\}/g, (_, key: string) => {",
    '    const value = params[key]',
    "    return value == null ? '' : String(value)",
    '  })',
    '}',
    '',
    'function formatDateValue(value: string | number | Date, locale: string, options?: Intl.DateTimeFormatOptions) {',
    '  return new Intl.DateTimeFormat(locale, options).format(new Date(value))',
    '}',
    '',
    'function formatNumberValue(value: number, locale: string, options?: Intl.NumberFormatOptions) {',
    '  return new Intl.NumberFormat(locale, options).format(value)',
    '}',
    '',
    "function formatCurrencyValue(value: number, currency: string, locale: string, options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>) {",
    '  return new Intl.NumberFormat(locale, {',
    "    style: 'currency',",
    '    currency,',
    '    ...options,',
    '  }).format(value)',
    '}',
    '',
    "function formatPercentValue(value: number, locale: string, options?: Omit<Intl.NumberFormatOptions, 'style'>) {",
    '  return new Intl.NumberFormat(locale, {',
    "    style: 'percent',",
    '    ...options,',
    '  }).format(value)',
    '}',
    '',
    'export function useTranslation() {',
    '  return useMemo(() => {',
    '    const locale = resolveLocale()',
    '    const dir = resolveDirection(locale)',
    '    return {',
    '      locale,',
    '      dir,',
    '      t: (key: string, params?: TranslationParams) => interpolate(key, params),',
    '      formatDate: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) =>',
    '        formatDateValue(value, locale, options),',
    '      formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>',
    '        formatNumberValue(value, locale, options),',
    "      formatCurrency: (value: number, currency: string, options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>) =>",
    '        formatCurrencyValue(value, currency, locale, options),',
    "      formatPercent: (value: number, options?: Omit<Intl.NumberFormatOptions, 'style'>) =>",
    '        formatPercentValue(value, locale, options),',
    '      setLocale: (nextLocale?: string) => String(nextLocale || locale),',
    '      textExpansionMultiplier: DEFAULT_TEXT_EXPANSION_MULTIPLIER,',
    '    }',
    '  }, [])',
    '}',
    '',
  ].join('\n')
}

async function resolvePageLocalizationSupportPlan({ brief, targetRoot }) {
  const localizationMode = normalizeString(brief.localizationMode) || 'none'
  const projectTranslationRuntimeReady = await hasProjectTranslationRuntime(targetRoot)

  if (localizationMode === 'local-bridge') {
    return {
      localizationMode,
      strategy: 'project-translation-bridge',
      content: buildTranslationBridgeSupportContent(brief),
    }
  }

  if (projectTranslationRuntimeReady) {
    return {
      localizationMode,
      strategy: 'reuse-existing-project-translation',
      content: buildTranslationBridgeSupportContent(brief),
    }
  }

  return {
    localizationMode,
    strategy: 'document-locale-fallback',
    content: buildFallbackPageLocalizationSupportContent({
      reason:
        localizationMode === 'inherit-host'
          ? 'Host translation runtime was not detected at src/translation, so this page falls back to document lang/dir plus Intl formatting.'
      : 'Localization is intentionally disabled for this generated page, so visible copy stays literal and only locale-sensitive formatting remains available.',
    }),
  }
}

function isHostShellLocalizationSupportFile(file = {}) {
  return /^host-shell-localization\.[jt]sx?$/.test(path.basename(file.destName || file.destPath || ''))
}

function resolveHostShellTranslationImportPath(brief) {
  const targetShellPath = normalizeRelativePath(
    brief.pageGenerationDecision?.hostShellDecision?.targetShellPath || 'src/business-shell/app-frame.tsx'
  )
  const shellDir = path.posix.dirname(targetShellPath)
  const relativeTranslationPath = path.posix.relative(shellDir, 'src/translation')

  if (!relativeTranslationPath) return './translation'
  return relativeTranslationPath.startsWith('.')
    ? relativeTranslationPath
    : `./${relativeTranslationPath}`
}

function buildHostShellLocalizationBridgeContent(source, brief) {
  const hostShellTranslationImportPath = resolveHostShellTranslationImportPath(brief)
  return source.replace(
    /from\s+['"]\.\/translation['"]/g,
    `from '${hostShellTranslationImportPath}'`
  )
}

function buildFallbackHostShellLocalizationSupportContent({ reason = '' } = {}) {
  const commentLine = reason ? `// ${reason}` : ''

  return [
    "import { useMemo } from 'react'",
    commentLine,
    '',
    "type TranslationParams = Record<string, string | number | boolean | null | undefined>",
    "type LocaleDirection = 'ltr' | 'rtl'",
    "type LocaleOption = { id: string; nativeLabel: string }",
    '',
    "const DEFAULT_LOCALE = 'zh-CN'",
    '',
    'function resolveLocale() {',
    "  if (typeof document !== 'undefined') {",
    "    const documentLocale = String(document.documentElement.lang || '').trim()",
    '    if (documentLocale) return documentLocale',
    '  }',
    "  if (typeof navigator !== 'undefined') {",
    "    const navigatorLocale = String(navigator.language || '').trim()",
    '    if (navigatorLocale) return navigatorLocale',
    '  }',
    '  return DEFAULT_LOCALE',
    '}',
    '',
    'function resolveDirection(locale: string): LocaleDirection {',
    "  if (typeof document !== 'undefined') {",
    "    return document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'",
    '  }',
    "  return String(locale || '').toLowerCase().startsWith('ar') ? 'rtl' : 'ltr'",
    '}',
    '',
    'function interpolate(template: string, params?: TranslationParams) {',
    '  if (!params) return template',
    "  return template.replace(/\\{(\\w+)\\}/g, (_, key: string) => {",
    '    const value = params[key]',
    "    return value == null ? '' : String(value)",
    '  })',
    '}',
    '',
    'export function useHostShellLocalization() {',
    '  return useMemo(() => {',
    '    const locale = resolveLocale()',
    '    return {',
    '      dir: resolveDirection(locale),',
    '      locale,',
    '      setLocale: (nextLocale?: string) => String(nextLocale || locale),',
    '      t: (key: string, params?: TranslationParams) => interpolate(key, params),',
    '      localeSwitcherEnabled: false,',
    '      localeOptions: [] as LocaleOption[],',
    "      languageFieldLabel: 'Language',",
    "      userCenterLabel: '用户中心',",
    '    }',
    '  }, [])',
    '}',
    '',
  ].join('\n')
}

async function resolveHostShellLocalizationSupportPlan({ brief, targetRoot, source = '' }) {
  const localizationMode = normalizeString(brief.localizationMode) || 'none'

  if (localizationMode === 'local-bridge') {
    return {
      localizationMode,
      strategy: 'project-translation-bridge',
      content: buildHostShellLocalizationBridgeContent(source, brief),
    }
  }

  if (localizationMode === 'inherit-host' && (await hasProjectTranslationRuntime(targetRoot))) {
    return {
      localizationMode,
      strategy: 'reuse-existing-project-translation',
      content: buildHostShellLocalizationBridgeContent(source, brief),
    }
  }

  return {
    localizationMode,
    strategy: 'document-locale-fallback',
    content: buildFallbackHostShellLocalizationSupportContent({
      reason:
        localizationMode === 'inherit-host'
          ? 'Host translation runtime was not detected at src/translation, so the formal host shell falls back to document lang/dir and hides the locale switcher.'
          : 'Localization is intentionally disabled for the formal host shell, so the locale switcher stays hidden and visible copy remains literal.',
    }),
  }
}

function shouldApplyLegacyReactImportToGeneratedModule(file, source = '', brief = null) {
  if (!shouldPreserveExplicitReactImport(brief)) {
    return false
  }

  const extension = path.extname(file?.destName || file?.destPath || '').toLowerCase()
  if (extension !== '.tsx' && extension !== '.jsx') {
    return false
  }

  return sourceNeedsExplicitLegacyReactRuntimeImport(source)
}

function getFieldMapProviderCompatibility(brief) {
  const compatibility = brief.pageGenerationDecision?.fieldMapProviderCompatibility
  return compatibility && typeof compatibility === 'object' ? compatibility : null
}

function getResolvedHostGenerationContract(brief) {
  const contract = brief.pageGenerationDecision?.resolvedHostGenerationContract
  return contract && typeof contract === 'object' ? contract : {}
}

const HIUI_ROOT_SYMBOL_PACKAGE_MAP = {
  Button: '@hi-ui/button',
  EmptyState: '@hi-ui/empty-state',
  Loading: '@hi-ui/loading',
  Message: '@hi-ui/message',
  PageHeader: '@hi-ui/page-header',
}

function getVisualRewritePlan(contract = {}) {
  const rewritePlan = contract.visualRewritePlan
  if (rewritePlan && Array.isArray(rewritePlan.rewrites)) {
    return {
      rootImportSource: String(rewritePlan.rootImportSource || contract.visualImportSource || 'hiui5').trim(),
      rewrites: rewritePlan.rewrites
        .map((entry) => ({
          symbolName: String(entry?.symbolName || '').trim(),
          importSource: String(entry?.importSource || '').trim(),
        }))
        .filter((entry) => entry.symbolName && entry.importSource),
    }
  }

  const splitAliasMap =
    contract.visualSplitAliasMap && typeof contract.visualSplitAliasMap === 'object'
      ? contract.visualSplitAliasMap
      : {}
  return {
    rootImportSource: String(contract.visualImportSource || 'hiui5').trim(),
    rewrites: Object.entries(HIUI_ROOT_SYMBOL_PACKAGE_MAP)
      .map(([symbolName, sourcePackage]) => ({
        symbolName,
        importSource: String(splitAliasMap[sourcePackage] || '').trim(),
      }))
      .filter((entry) => entry.symbolName && entry.importSource),
  }
}

function getHookRewritePlan(contract = {}) {
  const rewritePlan = contract.hookRewritePlan
  if (rewritePlan && Array.isArray(rewritePlan.supportFileImports)) {
    return {
      supportFileImports: rewritePlan.supportFileImports
        .map((entry) => ({
          symbolName: String(entry?.symbolName || '').trim(),
          importKind: String(entry?.importKind || '').trim(),
          importSource: String(entry?.importSource || '').trim(),
        }))
        .filter((entry) => entry.symbolName && entry.importSource),
    }
  }

  const splitAliasMap =
    contract.visualSplitAliasMap && typeof contract.visualSplitAliasMap === 'object'
      ? contract.visualSplitAliasMap
      : {}
  return {
    supportFileImports: [
      {
        symbolName: String(contract.hookImportName || 'usePersistFn').trim() || 'usePersistFn',
        importKind: 'named',
        importSource: String(contract.hookImportSource || 'ahooks').trim(),
      },
      {
        symbolName: 'TextArea',
        importKind: 'default',
        importSource:
          String(splitAliasMap['@hi-ui/textarea'] || '').trim() || '@hi-ui/textarea',
      },
    ].filter((entry) => entry.importSource),
  }
}

function parseNamedImportEntry(entry = '') {
  const normalizedEntry = String(entry).trim()
  if (!normalizedEntry) {
    return null
  }

  const [importedName, localName] = normalizedEntry.split(/\s+as\s+/)
  const normalizedImportedName = String(importedName || '').trim()
  if (!normalizedImportedName) {
    return null
  }

  const normalizedLocalName = String(localName || normalizedImportedName).trim()
  return {
    importedName: normalizedImportedName,
    localName: normalizedLocalName,
    renderedEntry:
      normalizedLocalName && normalizedLocalName !== normalizedImportedName
        ? `${normalizedImportedName} as ${normalizedLocalName}`
        : normalizedImportedName,
  }
}

function rewriteNamedImportSourceByContract(source = '', currentImportSource = '', contract = {}) {
  if (contract.visualImportMode !== 'split-alias') {
    return source
  }

  const visualRewritePlan = getVisualRewritePlan(contract)
  const rootImportSource = visualRewritePlan.rootImportSource
  const rewriteImportSourceBySymbol = new Map(
    visualRewritePlan.rewrites.map((entry) => [entry.symbolName, entry.importSource])
  )
  const escapedImportSource = String(currentImportSource).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const importPattern = new RegExp(
    `(^|\\n)(\\s*import\\s+\\{)([\\s\\S]*?)(\\}\\s+from\\s+['"]${escapedImportSource}['"]\\s*;?)`,
    'gm'
  )

  return source.replace(importPattern, (fullMatch, prefix, start, bindings, end) => {
    const fallbackEntries = []
    const aliasEntriesBySource = new Map()
    const parsedEntries = bindings
      .split(',')
      .map((entry) => parseNamedImportEntry(entry))
      .filter(Boolean)

    for (const entry of parsedEntries) {
      const aliasImportSource = rewriteImportSourceBySymbol.get(entry.importedName) || ''
      if (aliasImportSource) {
        aliasEntriesBySource.set(aliasImportSource, [
          ...(aliasEntriesBySource.get(aliasImportSource) || []),
          entry.renderedEntry,
        ])
        continue
      }
      fallbackEntries.push(entry.renderedEntry)
    }

    const rewrittenImports = []
    if (fallbackEntries.length > 0) {
      rewrittenImports.push(`${start} ${fallbackEntries.join(', ')} } from '${rootImportSource}'`)
    }
    for (const [importSource, entries] of aliasEntriesBySource.entries()) {
      rewrittenImports.push(`${start} ${entries.join(', ')} } from '${importSource}'`)
    }

    if (rewrittenImports.length === 0) {
      return prefix || ''
    }

    return `${prefix}${rewrittenImports.join('\n')}\n`
  })
}

function rewriteLegacyVisualImportsByContract(source = '', brief) {
  const contract = getResolvedHostGenerationContract(brief)
  if (contract.visualImportMode !== 'split-alias') {
    return source
  }

  let nextSource = rewriteNamedImportSourceByContract(source, '@hi-ui/hiui', contract)
  const visualRewritePlan = getVisualRewritePlan(contract)
  const rootImportSource = visualRewritePlan.rootImportSource

  for (const { symbolName, importSource: aliasImportSource } of visualRewritePlan.rewrites) {
    if (!aliasImportSource) continue
    if (!hasNamedImportSymbol(nextSource, rootImportSource, symbolName)) continue

    nextSource = removeNamedImportSymbol(nextSource, rootImportSource, symbolName)
    if (!hasNamedImportSymbol(nextSource, aliasImportSource, symbolName)) {
      nextSource = appendImportStatement(
        nextSource,
        `import { ${symbolName} } from '${aliasImportSource}'`
      )
    }
  }

  return nextSource
}

export function resolveGeneratedSupportFileImportContract(brief) {
  const compatibility = getFieldMapProviderCompatibility(brief)
  const contract = getResolvedHostGenerationContract(brief)
  const hookRewritePlan = getHookRewritePlan(contract)
  const hookImport = hookRewritePlan.supportFileImports.find(
    (entry) => entry.importKind === 'named'
  )
  const textAreaImport = hookRewritePlan.supportFileImports.find(
    (entry) => entry.symbolName === 'TextArea'
  )

  if (compatibility?.strategy === 'local-minimal-provider') {
    const hookImportMode = String(contract.hookImportMode || '').trim()
    const hookImportName = String(contract.hookImportName || '').trim()
    if (
      hookImportMode !== 'isolated-alias' ||
      !hookImportName ||
      !hookImport?.symbolName ||
      hookImport.symbolName !== hookImportName ||
      !hookImport?.importSource ||
      !textAreaImport?.importSource
    ) {
      throw new Error(
        'High-risk legacy Module Federation field-map-provider generation requires a resolved isolated-alias support-file import contract.'
      )
    }
  }

  return {
    hookImportSource:
      String(hookImport?.importSource || contract.hookImportSource || 'ahooks').trim(),
    hookImportName: String(hookImport?.symbolName || contract.hookImportName || 'usePersistFn').trim(),
    textAreaImportSource: String(textAreaImport?.importSource || '@hi-ui/textarea').trim(),
  }
}

function rewriteFieldMapProviderImport(source, brief) {
  const compatibility = getFieldMapProviderCompatibility(brief)
  if (compatibility?.strategy !== 'local-minimal-provider') return source

  const supportFile = compatibility.supportFile || {}
  const importSource = String(supportFile.importSource || './field-map-provider').trim()
  const exportedSymbol = String(supportFile.exportedSymbol || 'TypicalPageFieldMapProvider').trim()
  const shellImportSource =
    brief.pageGenerationDecision?.hostImportPolicy?.typicalPageShells ||
    DEFAULT_TYPICAL_PAGE_SHELL_IMPORT_SOURCE

  let nextSource = removeNamedImportSymbol(source, shellImportSource, exportedSymbol)
  nextSource = removeNamedImportSymbolFromMatchingSources(
    nextSource,
    exportedSymbol,
    (importSource) => isManagedLocalRuntimeRootImportSource(importSource)
  )
  if (!hasNamedImportSymbol(nextSource, importSource, exportedSymbol)) {
    nextSource = appendImportStatement(
      nextSource,
      `import { ${exportedSymbol} } from '${importSource}'`
    )
  }

  return nextSource
}

function buildLocalFieldMapProviderContent(brief) {
  const importContract = resolveGeneratedSupportFileImportContract(brief)
  return `import React, { useContext, useLayoutEffect, useMemo, useRef } from 'react'
import { ${importContract.hookImportName} } from '${importContract.hookImportSource}'
import TextArea from '${importContract.textAreaImportSource}'
import { FieldMapProvider, type ProFieldMapType } from '@hi-ui/schema-fields'
import {
  ProCheckSelect,
  ProDate,
  ProNumber,
  ProRadio,
  ProSelect,
  ProText,
  ProTextArea,
  ProUpload,
} from '@hi-ui/schema-fields/bundle'

function assignRef(ref: React.Ref<any> | undefined, value: any) {
  if (!ref) return
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  ref.current = value
}

function StableTextarea(props: React.ComponentProps<typeof TextArea>) {
  const { ref, autoSize, value, defaultValue, ...rest } = props
  const textareaRef = useRef<any>(null)
  const syncAutoSize = ${importContract.hookImportName}(() => {
    const element = textareaRef.current
    if (!element || !autoSize) return
    element.dispatchEvent(new Event('input', { bubbles: true }))
  })

  useLayoutEffect(() => {
    syncAutoSize()
    let cancelled = false
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) {
          syncAutoSize()
        }
      })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [autoSize, defaultValue, syncAutoSize, value])

  return (
    <TextArea
      {...rest}
      ref={(node) => {
        textareaRef.current = node
        assignRef(ref, node)
      }}
      value={value}
      defaultValue={defaultValue}
      autoSize={autoSize}
    />
  )
}

class StableProTextArea extends ProTextArea {
  renderFormItem(schema: any, context: any) {
    const fieldProps = this.getFieldProps({}, context)
    return <StableTextarea {...fieldProps} />
  }
}

class StableProCheckSelect extends ProCheckSelect {
  getSelfFieldProps(props: any) {
    const resolved = super.getSelfFieldProps(props)
    const fieldProps = resolved?.fieldProps || {}
    const tagInputProps = fieldProps.tagInputProps || {}

    return {
      ...resolved,
      fieldProps: {
        ...fieldProps,
        tagInputProps: {
          wrap: true,
          ...tagInputProps,
        },
      },
    }
  }
}

export const typicalPageFieldMap: Partial<ProFieldMapType> = {
  text: ProText,
  select: ProSelect,
  date: ProDate,
  radio: ProRadio,
  number: ProNumber,
  upload: ProUpload,
  textarea: StableProTextArea,
  'check-select': StableProCheckSelect,
}

const TypicalPageFieldMapContext = React.createContext(
  typicalPageFieldMap as ProFieldMapType
)

export function useTypicalPageFieldMap(): ProFieldMapType {
  return useContext(TypicalPageFieldMapContext)
}

type TypicalPageFieldMapProviderProps = React.PropsWithChildren<{
  fields?: Partial<ProFieldMapType>
}>

// Generated for high-risk legacy Module Federation hosts to avoid the shell package-root import chain.
export function TypicalPageFieldMapProvider({
  children,
  fields,
}: TypicalPageFieldMapProviderProps) {
  const mergedFields = useMemo(
    () => ({
      ...typicalPageFieldMap,
      ...(fields || {}),
    }),
    [fields]
  )

  return (
    <TypicalPageFieldMapContext.Provider value={mergedFields as ProFieldMapType}>
      <FieldMapProvider fields={mergedFields}>{children}</FieldMapProvider>
    </TypicalPageFieldMapContext.Provider>
  )
}
`
}

function collectFieldMapCompatibilityFiles({ brief, destDir, pageFiles }) {
  const compatibility = getFieldMapProviderCompatibility(brief)
  if (compatibility?.strategy !== 'local-minimal-provider') return []

  const supportFile = compatibility.supportFile || {}
  const pageFile = pageFiles.find((file) => path.basename(file.destPath) === 'index.tsx')
  if (!pageFile?.content || !pageFile.content.includes('TypicalPageFieldMapProvider')) {
    return []
  }

  const destName = String(supportFile.destName || 'field-map-provider.tsx').trim()
  if (!destName) return []

  return [
    {
      sourcePath: toSkillSourceTag('generated-local-field-map-provider'),
      destPath: path.join(destDir, destName),
      content: buildLocalFieldMapProviderContent(brief),
    },
  ]
}

function requiresPageOwnedSupportFile(brief) {
  const layoutContract = brief.generationContract?.layoutContract || {}
  return String(layoutContract.pageRootFillOwner || '').trim() === 'page-owned-support-file'
}

function reindentBlock(block, indent) {
  const lines = String(block || '')
    .replace(/^\n+|\n+$/g, '')
    .split('\n')
  const nonEmptyLines = lines.filter((line) => line.trim())
  const minIndent = nonEmptyLines.reduce((currentMin, line) => {
    const lineIndent = line.match(/^[ \t]*/)?.[0].length ?? 0
    return Math.min(currentMin, lineIndent)
  }, Number.POSITIVE_INFINITY)
  const stripLength = Number.isFinite(minIndent) ? minIndent : 0

  return lines
    .map((line) => `${indent}${line.slice(stripLength)}`)
    .join('\n')
}

function findFunctionBodyStart(source, startIndex) {
  let inSingleQuote = false
  let inDoubleQuote = false
  let inTemplateString = false
  let inLineComment = false
  let inBlockComment = false
  let parenDepth = 0

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index]
    const nextChar = source[index + 1]
    const prevChar = source[index - 1]

    if (inLineComment) {
      if (char === '\n') inLineComment = false
      continue
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false
        index += 1
      }
      continue
    }

    if (inSingleQuote) {
      if (char === "'" && prevChar !== '\\') inSingleQuote = false
      continue
    }

    if (inDoubleQuote) {
      if (char === '"' && prevChar !== '\\') inDoubleQuote = false
      continue
    }

    if (inTemplateString) {
      if (char === '`' && prevChar !== '\\') inTemplateString = false
      continue
    }

    if (char === '/' && nextChar === '/') {
      inLineComment = true
      index += 1
      continue
    }

    if (char === '/' && nextChar === '*') {
      inBlockComment = true
      index += 1
      continue
    }

    if (char === "'") {
      inSingleQuote = true
      continue
    }

    if (char === '"') {
      inDoubleQuote = true
      continue
    }

    if (char === '`') {
      inTemplateString = true
      continue
    }

    if (char === '(') {
      parenDepth += 1
      continue
    }

    if (char === ')') {
      parenDepth = Math.max(0, parenDepth - 1)
      continue
    }

    if (char === '{' && parenDepth === 0) {
      return index
    }
  }

  return -1
}

function findTopLevelFunctionReturnRange(source, bodyStartIndex) {
  let inSingleQuote = false
  let inDoubleQuote = false
  let inTemplateString = false
  let inLineComment = false
  let inBlockComment = false
  let braceDepth = 1

  for (let index = bodyStartIndex + 1; index < source.length; index += 1) {
    const char = source[index]
    const nextChar = source[index + 1]
    const prevChar = source[index - 1]

    if (inLineComment) {
      if (char === '\n') inLineComment = false
      continue
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false
        index += 1
      }
      continue
    }

    if (inSingleQuote) {
      if (char === "'" && prevChar !== '\\') inSingleQuote = false
      continue
    }

    if (inDoubleQuote) {
      if (char === '"' && prevChar !== '\\') inDoubleQuote = false
      continue
    }

    if (inTemplateString) {
      if (char === '`' && prevChar !== '\\') inTemplateString = false
      continue
    }

    if (char === '/' && nextChar === '/') {
      inLineComment = true
      index += 1
      continue
    }

    if (char === '/' && nextChar === '*') {
      inBlockComment = true
      index += 1
      continue
    }

    if (char === "'") {
      inSingleQuote = true
      continue
    }

    if (char === '"') {
      inDoubleQuote = true
      continue
    }

    if (char === '`') {
      inTemplateString = true
      continue
    }

    if (char === '{') {
      braceDepth += 1
      continue
    }

    if (char === '}') {
      braceDepth -= 1
      if (braceDepth === 0) return null
      continue
    }

    if (
      braceDepth === 1 &&
      source.startsWith('return', index) &&
      !/[A-Za-z0-9_$]/.test(source[index - 1] || '') &&
      !/[A-Za-z0-9_$]/.test(source[index + 'return'.length] || '')
    ) {
      let expressionStart = index + 'return'.length
      while (expressionStart < source.length && /\s/.test(source[expressionStart])) {
        expressionStart += 1
      }

      if (source[expressionStart] !== '(') return null
      const expressionEnd = findMatchingTokenIndex(source, expressionStart, '(', ')')
      if (expressionEnd < 0) return null

      return {
        returnIndex: index,
        expressionStart,
        expressionEnd,
      }
    }
  }

  return null
}

function wrapExportedPageComponentWithPageOwnedBoundary(source = '') {
  const exportedPagePattern =
    /(?:^|\n)\s*export\s+(?:default\s+)?function\s+([A-Za-z_$][\w$]*Page)\s*\(/g
  const exportedPageMatch = exportedPagePattern.exec(source)
  if (!exportedPageMatch || exportedPageMatch.index == null) {
    throw new Error('Generated page source is missing an exported *Page component for page-owned support wiring')
  }

  const functionStartIndex = exportedPageMatch.index + exportedPageMatch[0].indexOf('function')
  const functionBodyStart = findFunctionBodyStart(source, functionStartIndex)
  if (functionBodyStart < 0) {
    throw new Error('Unable to locate the exported page component body for page-owned support wiring')
  }

  const returnRange = findTopLevelFunctionReturnRange(source, functionBodyStart)
  if (!returnRange) {
    throw new Error('Unable to locate the exported page component return block for page-owned support wiring')
  }

  const returnIndent = getLineIndent(source, returnRange.returnIndex)
  const boundaryIndent = `${returnIndent}  `
  const childIndent = `${returnIndent}    `
  const innerBlock = source.slice(returnRange.expressionStart + 1, returnRange.expressionEnd)
  const wrappedBlock = [
    '(',
    `${boundaryIndent}<PageOwnedMountBoundary>`,
    reindentBlock(innerBlock, childIndent),
    `${boundaryIndent}</PageOwnedMountBoundary>`,
    `${returnIndent})`,
  ].join('\n')

  return `${source.slice(0, returnRange.expressionStart)}${wrappedBlock}${source.slice(returnRange.expressionEnd + 1)}`
}

function applyPageOwnedSupportTransform(source, brief) {
  if (!requiresPageOwnedSupportFile(brief)) return source
  if (source.includes("from './page-owned-mount-support'") && source.includes('<PageOwnedMountBoundary')) {
    return source
  }

  let nextSource = appendImportStatement(
    source,
    "import { PageOwnedMountBoundary } from './page-owned-mount-support'"
  )
  if (!nextSource.includes('<PageOwnedMountBoundary')) {
    nextSource = wrapExportedPageComponentWithPageOwnedBoundary(nextSource)
  }
  return nextSource
}

const PAGE_HEADER_BACKLESS_NAVIGATION_ACTIONS = new Set([
  'append-existing-registry',
  'manual-register-existing-registry',
  'materialize-implicit-feature-entry',
  'create-formal-shell-and-mount-entry',
])

const DRAWER_PAGE_TYPES = new Set(['drawer-form', 'drawer-detail'])

function shouldHidePageHeaderBackForNavigationEntry(brief) {
  const pageTypeId = normalizeString(brief?.pageType?.id)
  if (!pageTypeId || DRAWER_PAGE_TYPES.has(pageTypeId)) {
    return false
  }

  const navigationMountAction = normalizeString(
    brief?.pageGenerationDecision?.navigationMountAction?.action
  )
  return PAGE_HEADER_BACKLESS_NAVIGATION_ACTIONS.has(navigationMountAction)
}

function findJsxExpressionPropRange(source, propName) {
  const propPattern = new RegExp(`\\n([ \\t]*)${propName}\\s*=\\s*\\{`)
  const match = propPattern.exec(source)
  if (!match) return null

  const propStart = match.index + 1
  const braceIndex = source.indexOf('{', propStart)
  if (braceIndex < 0) return null

  const expressionEnd = findMatchingTokenIndex(source, braceIndex, '{', '}')
  if (expressionEnd < 0) return null

  let propEnd = expressionEnd + 1
  if (source[propEnd] === '\r') propEnd += 1
  if (source[propEnd] === '\n') propEnd += 1

  return {
    propStart,
    propEnd,
    indent: match[1] || '',
  }
}

function replaceJsxExpressionProp(source, propName, replacementBlock = '') {
  const range = findJsxExpressionPropRange(source, propName)
  if (!range) {
    return {
      source,
      replaced: false,
    }
  }

  const normalizedReplacement = String(replacementBlock || '').trim()
  const nextSource = normalizedReplacement
    ? `${source.slice(0, range.propStart)}${reindentBlock(normalizedReplacement, range.indent)}\n${source.slice(range.propEnd)}`
    : `${source.slice(0, range.propStart)}${source.slice(range.propEnd)}`

  return {
    source: nextSource,
    replaced: true,
  }
}

function stripPageHeaderBackBehavior(source) {
  const replacedProp = replaceJsxExpressionProp(source, 'onBack')
  let nextSource = replacedProp.source
  if (!replacedProp.replaced) return source

  nextSource = nextSource.replace(/\n\s*const\s+navigate\s*=\s*useNavigate\(\)\s*\n/, '\n')
  if (!nextSource.includes('useNavigate(')) {
    nextSource = removeNamedImportSymbol(nextSource, 'react-router-dom', 'useNavigate')
  }

  return nextSource
}

function resolveGeneratedLegacyBackTarget(brief) {
  const navigationMountAction = brief?.pageGenerationDecision?.navigationMountAction || {}
  return {
    backRoutePath: normalizeString(navigationMountAction.backRoutePath),
    backTitle: normalizeString(navigationMountAction.backTitle),
    backName: normalizeString(navigationMountAction.backName),
  }
}

function shouldApplyGeneratedLegacyBackBehavior(brief) {
  const navigationMountAction = normalizeString(
    brief?.pageGenerationDecision?.navigationMountAction?.action
  )
  if (navigationMountAction !== 'append-existing-entry') return false

  const backTarget = resolveGeneratedLegacyBackTarget(brief)
  return Boolean(backTarget.backRoutePath)
}

function buildGeneratedLegacyBackBehaviorSource(brief) {
  const backTarget = resolveGeneratedLegacyBackTarget(brief)
  const addPagePayloadLines = []

  if (backTarget.backName) {
    addPagePayloadLines.push(`name: ${JSON.stringify(backTarget.backName)},`)
  }
  if (backTarget.backTitle) {
    addPagePayloadLines.push(`title: ${JSON.stringify(backTarget.backTitle)},`)
  }
  addPagePayloadLines.push(`path: ${JSON.stringify(backTarget.backRoutePath)},`)
  addPagePayloadLines.push('refresh: true,')

  return `
onBack={() => {
  if (typeof window === 'undefined') return
  const hostWindow = window as Window &
    typeof globalThis & {
      closeTab?: () => void
      addPage?: (payload: { name?: string; title?: string; path: string; refresh?: boolean }) => void
    }

  if (typeof hostWindow.closeTab === 'function') {
    hostWindow.closeTab()
    return
  }

  if (hostWindow.opener && !hostWindow.opener.closed) {
    hostWindow.close()
    return
  }

  if (typeof hostWindow.addPage === 'function') {
    hostWindow.addPage({
${addPagePayloadLines.map((line) => `      ${line}`).join('\n')}
    })
    return
  }

  if (hostWindow.history.length > 1) {
    hostWindow.history.back()
  }
}}
`.trim()
}

function applyGeneratedLegacyBackBehavior(source, brief) {
  if (!shouldApplyGeneratedLegacyBackBehavior(brief)) return source

  const replacedProp = replaceJsxExpressionProp(
    source,
    'onBack',
    buildGeneratedLegacyBackBehaviorSource(brief)
  )
  return replacedProp.replaced ? replacedProp.source : source
}

function splitFieldSemanticTokens(value) {
  return String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
}

function isSwitchLikeTableField({ label, key }) {
  const normalizedLabel = normalizeString(label)
  const normalizedKey = normalizeString(key)
  const tokens = splitFieldSemanticTokens(`${normalizedLabel} ${normalizedKey}`)
  const joinedTokenString = tokens.join(' ')

  if (
    /^(is|has|can)[A-Z_]/.test(normalizedKey) ||
    /(?:^|[._-])(is|has|can)(?:[._-]|$)/i.test(normalizedKey)
  ) {
    return true
  }

  if (
    /(开关|启用|停用|启停|是否|可见|隐藏|开闭|启闭)/.test(normalizedLabel) ||
    /(switch|toggle|enabled|disabled|visible|hidden|checked|unchecked|open|closed)/.test(
      joinedTokenString
    )
  ) {
    return true
  }

  return false
}

function isStatusLikeTableField({ label, key }) {
  const normalizedLabel = normalizeString(label)
  const normalizedKey = normalizeString(key)
  const tokens = splitFieldSemanticTokens(`${normalizedLabel} ${normalizedKey}`)
  const joinedTokenString = tokens.join(' ')

  if (isSwitchLikeTableField({ label: normalizedLabel, key: normalizedKey })) {
    return false
  }

  if (/(状态|流程|进度|阶段|审批|结果)/.test(normalizedLabel)) {
    return true
  }

  return /(status|state|stage|progress|workflow|process|approval|review|result)/.test(
    joinedTokenString
  )
}

function ensureManagedTableStatusTagHelpers(source) {
  if (source.includes('function renderGeneratedTableStatusTag(')) {
    return source
  }

  const helperSource = `
function getGeneratedTableStatusTagType(cellValue) {
  const normalizedValue = String(cellValue ?? '').trim()

  if (!normalizedValue) return 'default'
  if (/(成功|通过|已完成|完成|正常|有效|可用|在线|active|enabled|success|approved|completed|normal|online)/i.test(normalizedValue)) {
    return 'success'
  }
  if (/(进行中|处理中|待审核|待确认|待开始|审核中|流转中|pending|processing|review|running|in progress|progress)/i.test(normalizedValue)) {
    return 'primary'
  }
  if (/(失败|驳回|拒绝|停用|异常|终止|关闭|失效|离线|error|failed|rejected|disabled|closed|offline|invalid|terminated)/i.test(normalizedValue)) {
    return 'danger'
  }

  return 'default'
}

function renderGeneratedTableStatusTag(cellValue) {
  const displayValue = String(cellValue ?? '').trim()

  if (!displayValue) {
    return '—'
  }

  return (
    <Tag type={getGeneratedTableStatusTagType(displayValue)} appearance="filled">
      {displayValue}
    </Tag>
  )
}
`

  const dslMatch = source.match(/const T = extendDsl\(ReadonlyFieldCreator, \{[\s\S]*?\n\}\)\n/)
  if (!dslMatch) return source

  const insertionIndex = dslMatch.index + dslMatch[0].length
  return `${source.slice(0, insertionIndex)}${helperSource}\n${source.slice(insertionIndex)}`
}

const MANAGED_TABLE_STATUS_TAG_PAGE_TYPES = new Set([
  'table-basic',
  'table-stat',
  'tree-table',
  'tree-split',
  'data-visualization',
])

export function applyManagedTableStatusTagTransforms(source, brief) {
  const pageTypeId = normalizeString(brief?.pageType?.id)
  if (!MANAGED_TABLE_STATUS_TAG_PAGE_TYPES.has(pageTypeId)) {
    return source
  }

  const columnPattern = /T\(t\('([^']+)'\),\s*'([^']+)'\)([^\n]*?)\.renderEllipsis\(\)\.val/g
  let replacementCount = 0
  const nextSource = source.replace(columnPattern, (match, label, key, chain = '') => {
    if (!isStatusLikeTableField({ label, key })) {
      return match
    }

    replacementCount += 1
    return `T(t('${label}'), '${key}')${chain}.renderCell((cellValue) => renderGeneratedTableStatusTag(cellValue)).val`
  })

  if (replacementCount === 0) {
    return source
  }

  return ensureManagedTableStatusTagHelpers(
    addNamedImportSymbol(nextSource, '@hi-ui/hiui', 'Tag')
  )
}

export function applyFullPageEditBusinessSlotPlan(source, brief) {
  const plan = brief?.pageGenerationDecision?.businessSlotPlan || {}
  if (!isStructuredFullPageEditBusinessSlotPlan(plan)) {
    return source
  }

  const requestPlan = resolveStructuredFullPageEditRequestPlan(brief)
  let nextSource = source

  nextSource = nextSource.replace(
    /import\s*\{\s*getWorkOrderEditDetail[\s\S]*?\}\s*from\s*['"]\.\/(?:typical-pages\.mock|mock)['"]/,
    `import {\n  ${requestPlan.detailRequestFunctionName},\n  ${requestPlan.submitRequestFunctionName}${requestPlan.stashEnabled ? `,\n  ${requestPlan.stashRequestFunctionName}` : ''},\n} from './mock'`
  )

  nextSource = nextSource.replace(
    /openRuntimeMessage\('success',\s*t\('工单已提交(?:（示例）)?'\)\)/,
    `openRuntimeMessage('success', t(${JSON.stringify(requestPlan.submitSuccessMessage)}))`
  )
  nextSource = nextSource.replace(
    /<SubmitButton>\{t\('提交'\)\}<\/SubmitButton>/,
    `<SubmitButton>{t(${JSON.stringify(requestPlan.submitActionLabel)})}</SubmitButton>`
  )

  if (requestPlan.stashEnabled) {
    nextSource = nextSource.replace(
      /onStashSuccess=\{\(\)\s*=>\s*openRuntimeMessage\('success',\s*t\('草稿已保存(?:（示例）)?'\)\)\}/,
      `onStashSuccess={() => openRuntimeMessage('success', t(${JSON.stringify(requestPlan.stashSuccessMessage)}))}`
    )
  } else {
    nextSource = nextSource
      .replace(/\n\s*onStashSuccess=\{\(\)\s*=>\s*openRuntimeMessage\('success',\s*t\('草稿已保存(?:（示例）)?'\)\)\}/, '')
      .replace(/\n\s*stashRequest=\{[^}]+\}/, '')
      .replace(/\n\s*StashButton,\n/, '\n')
      .replace(/\n\s*<StashButton \/>\n/, '\n')
  }

  nextSource = nextSource.replace(
    /const detailRequest = useMemo\(\n[\s\S]*?\n\s*\)\n\n\s*return \(/,
    `const detailRequest = useMemo(
    () => async () => {
      const response = await ${requestPlan.detailRequestFunctionName}()

      return response
    },
    []
  )

  return (`
  )

  nextSource = nextSource.replace(
    /submitRequest=\{[^}]+\}/,
    `submitRequest={${requestPlan.submitRequestFunctionName}}`
  )
  if (requestPlan.stashEnabled) {
    nextSource = nextSource.replace(
      /stashRequest=\{[^}]+\}/,
      `stashRequest={${requestPlan.stashRequestFunctionName}}`
    )
  }

  return nextSource
}

function applyBusinessSlotReplacements(source, brief) {
  if (usesSeparateWorkflow(brief)) {
    return source
  }

  if (
    brief.pageType.id === 'table-basic' &&
    isStructuredBasicTableBusinessSlotPlan(brief.pageGenerationDecision?.businessSlotPlan)
  ) {
    return rewriteManagedPageLocalMockImports(
      buildLegacyBasicTablePageSource(brief),
      brief
    )
  }

  let nextSource = source
  if (hasRequestedDetailSections(brief)) {
    nextSource = replaceFullPageDetailSectionConfigs(
      nextSource,
      brief.requestedBusiness.detailSections
    )
  }
  if (brief.requestedBusiness.title) {
    nextSource = nextSource.replace(
      /title="[^"]+"|title=\{[^\n}]+\}/,
      `title={${JSON.stringify(brief.requestedBusiness.title)}}`
    )
  }
  if (shouldHidePageHeaderBackForNavigationEntry(brief)) {
    nextSource = stripPageHeaderBackBehavior(nextSource)
  } else {
    nextSource = applyGeneratedLegacyBackBehavior(nextSource, brief)
  }
  if (brief.pageType.id === 'feedback-status' && brief.requestedBusiness.feedbackVariantId) {
    nextSource = replaceFeedbackStatusVariantId(nextSource, brief.requestedBusiness.feedbackVariantId)
  }
  if (brief.pageType.id === 'table-stat') {
    nextSource = applyTableStatBusinessSlotPlan(
      nextSource,
      brief.pageGenerationDecision?.businessSlotPlan
    )
  }
  if (brief.pageType.id === 'full-page-edit') {
    nextSource = applyFullPageEditBusinessSlotPlan(
      nextSource,
      brief
    )
  }
  nextSource = applyManagedTableStatusTagTransforms(nextSource, brief)

  const styleBasename = brief.sources.preferredStylePath ? path.basename(brief.sources.preferredStylePath) : ''
  if (styleBasename) {
    nextSource = nextSource.replace(new RegExp(`(['"])\\./${styleBasename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`, 'g'), '$1./index.module.scss$1')
  }

  // Strip explicit example-only UI copy before writing a business page scaffold.
  nextSource = nextSource.replace(/（示例）/g, '')
  nextSource = nextSource.replace(
    /\n\s+extra=\{\n[\s\S]*?复制提示词[\s\S]*?\n\s+\}/,
    ''
  )
  nextSource = rewriteManagedPageLocalMockImports(nextSource, brief)

  return nextSource
}

function ensureManagedRuntimeStyleImportForPageSource(source, brief, transformContext = {}) {
  const targetRoot = normalizeString(transformContext.targetRoot)
  const destPath = normalizeString(transformContext.destPath)
  if (!targetRoot || !destPath) return source

  const pageFileRelativePath = normalizeRelativePath(path.relative(targetRoot, destPath))
  const styleDeliveryDecision = buildStyleDeliveryDecision({
    brief,
    pageFileRelativePath,
  })
  if (styleDeliveryDecision.owner !== 'page-local-fallback') {
    return source
  }

  if (
    sourceContainsManagedRuntimeStyleImport({
      source,
      entryRelativePath: pageFileRelativePath,
      styleImportPath: styleDeliveryDecision.styleImportPath,
    })
  ) {
    return source
  }

  return appendImportStatement(
    source,
    `import ${JSON.stringify(
      resolveStyleDeliveryImportSource({
        entryRelativePath: pageFileRelativePath,
        styleImportPath: styleDeliveryDecision.styleImportPath,
      })
    )}`
  )
}

async function collectStyleDeliveryOwnerPatchFiles({
  targetRoot,
  styleDeliveryDecision,
}) {
  const styleOwner = normalizeString(styleDeliveryDecision?.owner)
  const effectiveEntryPath = normalizeRelativePath(styleDeliveryDecision?.effectiveEntryPath)
  const styleImportPath = normalizeRelativePath(styleDeliveryDecision?.styleImportPath)

  if (styleOwner !== 'parent-entry' || !targetRoot || !effectiveEntryPath || !styleImportPath) {
    return []
  }

  const destPath = path.join(targetRoot, effectiveEntryPath)
  if (!(await isReadableFile(destPath))) {
    return []
  }

  const source = await fs.readFile(destPath, 'utf8')
  if (
    sourceContainsManagedRuntimeStyleImport({
      source,
      entryRelativePath: effectiveEntryPath,
      styleImportPath,
    })
  ) {
    return []
  }

  const expectedStyleImportStatement = `import ${JSON.stringify(
    resolveStyleDeliveryImportSource({
      entryRelativePath: effectiveEntryPath,
      styleImportPath,
    })
  )}`

  return [
    {
      sourcePath: toSkillSourceTag('generated-style-delivery-owner-patch'),
      destPath,
      content: appendImportStatement(source, expectedStyleImportStatement),
      allowManagedOverwrite: true,
    },
  ]
}

function applyGenerationTransforms(
  file,
  brief,
  pageAdjustmentExecution,
  pageLocalizationSupportPlan = null,
  transformContext = {}
) {
  if (file.binaryContent) {
    return file.binaryContent
  }

  let nextSource = file.content
  if (file.isPage) {
    const businessSource = applyBusinessSlotReplacements(file.content, brief)
    nextSource = businessSource
    nextSource = rewritePageLocalizationImport(nextSource, brief, pageLocalizationSupportPlan)
    if (hasPageAdjustmentContract(brief)) {
      nextSource = applyPageAdjustmentTransform({
        source: nextSource,
        brief,
        executionPlan: pageAdjustmentExecution,
      })
    }
    const existingDestPath = path.isAbsolute(transformContext.destPath)
      ? transformContext.destPath
      : path.join(transformContext.targetRoot || '', transformContext.destPath || '')
    if (existingDestPath && existsSync(existingDestPath)) {
      const existingDestSource = readTextIfExists(existingDestPath)
      if (existingDestSource) {
        nextSource = preserveExistingRouteMountablePageExport(
          nextSource,
          existingDestSource,
          brief.generationContract?.moduleExportContract,
          {
            sourceLabel: 'generated page source',
            existingSourceLabel: `existing destination page source (${normalizeRelativePath(transformContext.destPath)})`,
          }
        )
      }
    }
    const siblingImportedPageExportName = resolveSiblingImportedPageExportName(existingDestPath)
    if (siblingImportedPageExportName) {
      nextSource = preserveExpectedRouteMountablePageExport(
        nextSource,
        siblingImportedPageExportName,
        brief.generationContract?.moduleExportContract,
        { sourceLabel: 'generated page source' }
      )
    }
    nextSource = ensureRouteMountablePageExport(
      nextSource,
      brief.generationContract?.moduleExportContract,
      { sourceLabel: 'generated page source' }
    )
    nextSource = applyPageOwnedSupportTransform(nextSource, brief)
    nextSource = rewriteManagedLocalRuntimeImports(nextSource, {
      ...transformContext,
      brief,
      sourcePath: file.sourcePath,
    })
    nextSource = ensureManagedRuntimeStyleImportForPageSource(
      nextSource,
      brief,
      transformContext
    )
    nextSource = rewriteLegacyVisualImportsByContract(nextSource, brief)
    nextSource = rewriteFieldMapProviderImport(nextSource, brief)
    return ensureLegacyReactDefaultImport(nextSource, brief)
  }

  if (isPageLocalizationSupportFile(file) && pageLocalizationSupportPlan?.content) {
    nextSource = pageLocalizationSupportPlan.content
  }

  nextSource = rewriteManagedLocalRuntimeImports(nextSource, {
    ...transformContext,
    brief,
    sourcePath: file.sourcePath,
  })

  if (shouldApplyLegacyReactImportToGeneratedModule(file, nextSource, brief)) {
    return ensureLegacyReactDefaultImport(nextSource, brief)
  }

  return nextSource
}

function buildGeneratedOutputContract(brief) {
  const compatibility = getFieldMapProviderCompatibility(brief)
  const generationContract = brief.generationContract || {}
  const contract = getResolvedHostGenerationContract(brief)
  let requiredImports = Array.isArray(generationContract.requiredImports)
    ? generationContract.requiredImports.map((item) => ({
        ...item,
        symbols: Array.isArray(item?.symbols) ? [...item.symbols] : item?.symbols,
      }))
    : generationContract.requiredImports

  if (compatibility?.strategy === 'local-minimal-provider') {
    const supportFile = compatibility.supportFile || {}
    const importSource = String(supportFile.importSource || './field-map-provider').trim()
    const exportedSymbol = String(supportFile.exportedSymbol || 'TypicalPageFieldMapProvider').trim()
    const shellImportSource =
      brief.pageGenerationDecision?.hostImportPolicy?.typicalPageShells ||
      DEFAULT_TYPICAL_PAGE_SHELL_IMPORT_SOURCE

    requiredImports = Array.isArray(requiredImports)
      ? requiredImports.flatMap((item) => {
          if (
            item?.source !== shellImportSource ||
            !Array.isArray(item?.symbols) ||
            !item.symbols.includes(exportedSymbol)
          ) {
            return [item]
          }

          const remainingSymbols = item.symbols.filter((symbol) => symbol !== exportedSymbol)
          const entries = []
          if (remainingSymbols.length > 0) {
            entries.push({
              ...item,
              symbols: remainingSymbols,
            })
          }
          entries.push({
            source: importSource,
            symbols: [exportedSymbol],
          })
          return entries
        })
      : requiredImports
  }

  if (contract.visualImportMode === 'split-alias' && Array.isArray(requiredImports)) {
    const visualRewritePlan = getVisualRewritePlan(contract)
    const rootImportSource = visualRewritePlan.rootImportSource
    const rewriteImportSourceBySymbol = new Map(
      visualRewritePlan.rewrites.map((entry) => [entry.symbolName, entry.importSource])
    )

    requiredImports = requiredImports.flatMap((item) => {
      const itemSource = String(item?.source || '').trim()
      const itemSymbols = Array.isArray(item?.symbols) ? item.symbols.filter(Boolean) : []

      if (
        itemSymbols.length === 0 ||
        (itemSource !== '@hi-ui/hiui' && itemSource !== rootImportSource)
      ) {
        return [item]
      }

      const retainedSymbols = []
      const rewrittenSymbolsBySource = new Map()

      for (const symbol of itemSymbols) {
        const aliasImportSource = rewriteImportSourceBySymbol.get(symbol) || ''
        if (!aliasImportSource) {
          retainedSymbols.push(symbol)
          continue
        }

        rewrittenSymbolsBySource.set(aliasImportSource, [
          ...(rewrittenSymbolsBySource.get(aliasImportSource) || []),
          symbol,
        ])
      }

      const rewrittenEntries = []
      if (retainedSymbols.length > 0) {
        rewrittenEntries.push({
          ...item,
          source: rootImportSource,
          symbols: retainedSymbols,
        })
      }

      for (const [aliasImportSource, aliasSymbols] of rewrittenSymbolsBySource.entries()) {
        rewrittenEntries.push({
          ...item,
          source: aliasImportSource,
          symbols: aliasSymbols,
        })
      }

      return rewrittenEntries
    })
  }

  return {
    ...generationContract,
    requiredImports,
  }
}

function findShortestPlannedFileByBasename(plannedFiles, basename) {
  return (
    plannedFiles
      .filter((file) => path.basename(file.destPath) === basename)
      .sort((left, right) => left.destPath.length - right.destPath.length)[0] || null
  )
}

function findSiblingPlannedFileByBasename(plannedFiles, siblingFile, basename) {
  if (!siblingFile?.destPath || !basename) return null

  return (
    plannedFiles.find(
      (file) =>
        path.basename(file.destPath) === basename &&
        path.dirname(file.destPath) === path.dirname(siblingFile.destPath)
    ) || null
  )
}

function isPageOwnedSupportRuntimeFile(file) {
  return normalizeRelativePath(file?.destPath).includes('/page-owned-mount-support/')
}

function isManagedGeneratedSupportFile(file) {
  const normalizedDestName = normalizeRelativePath(file?.destName || file?.destPath)
  const normalizedSourcePath = normalizeRelativePath(file?.sourcePath)
  return (
    normalizedDestName.startsWith('runtime/analytics-primitives/') ||
    normalizedSourcePath.includes('/runtime/analytics-primitives/')
  )
}

function hasLikelyGeneratedPageExport(file) {
  const source = String(file?.content || '')
  return (
    /export\s+function\s+[A-Z][A-Za-z0-9_$]*Page\s*\(/.test(source) ||
    /export\s+default\s+[A-Z][A-Za-z0-9_$]*Page\b/.test(source)
  )
}

function isGeneratedRuntimeSupportIndexFile(file) {
  const normalizedDestPath = normalizeRelativePath(file?.destPath)
  const normalizedSourcePath = normalizeRelativePath(file?.sourcePath)
  return [normalizedDestPath, normalizedSourcePath].some(
    (value) =>
      value.includes('/runtime/') ||
      value.endsWith('/runtime') ||
      value.includes('/analytics-primitives/')
  )
}

function matchesRequestedBusinessIndex(file, brief) {
  const requestedBusinessPath = normalizeRelativePath(
    brief?.requestedBusiness?.targetBusinessPath || brief?.requestedBusiness?.dest || ''
  )
  if (!requestedBusinessPath) return false

  const normalizedDestPath = normalizeRelativePath(file?.destPath)
  const requestedEntrySuffix = `${requestedBusinessPath}/index.tsx`
  return (
    normalizedDestPath === requestedEntrySuffix ||
    normalizedDestPath.endsWith(`/${requestedEntrySuffix}`)
  )
}

export function findPrimaryGeneratedPageFile(plannedFiles, brief) {
  return (
    plannedFiles
      .filter(
        (file) =>
          path.basename(file.destPath) === 'index.tsx' && !isPageOwnedSupportRuntimeFile(file)
      )
      .sort((left, right) => {
        const leftMatchesRequestedBusinessIndex = matchesRequestedBusinessIndex(left, brief)
        const rightMatchesRequestedBusinessIndex = matchesRequestedBusinessIndex(right, brief)
        if (leftMatchesRequestedBusinessIndex !== rightMatchesRequestedBusinessIndex) {
          return leftMatchesRequestedBusinessIndex ? -1 : 1
        }

        const leftLooksLikePageEntry = hasLikelyGeneratedPageExport(left)
        const rightLooksLikePageEntry = hasLikelyGeneratedPageExport(right)
        if (leftLooksLikePageEntry !== rightLooksLikePageEntry) {
          return leftLooksLikePageEntry ? -1 : 1
        }

        const leftIsRuntimeSupportIndex = isGeneratedRuntimeSupportIndexFile(left)
        const rightIsRuntimeSupportIndex = isGeneratedRuntimeSupportIndexFile(right)
        if (leftIsRuntimeSupportIndex !== rightIsRuntimeSupportIndex) {
          return leftIsRuntimeSupportIndex ? 1 : -1
        }

        return left.destPath.length - right.destPath.length
      })[0] || null
  )
}

function collectPageOwnedSupportOutputViolations(plannedFiles, brief) {
  if (!requiresPageOwnedSupportFile(brief)) return []

  const pageFile = findPrimaryGeneratedPageFile(plannedFiles, brief)
  const supportSourceFile = plannedFiles.find((file) =>
    normalizeRelativePath(file.destPath).endsWith('/page-owned-mount-support/index.tsx')
  )
  const supportStyleFile = plannedFiles.find((file) =>
    normalizeRelativePath(file.destPath).endsWith('/page-owned-mount-support/index.module.scss')
  )
  const violations = []

  if (!supportSourceFile) {
    violations.push(`${brief.pageType.id}: generated output missing page-owned support runtime index.tsx`)
  }

  if (!supportStyleFile) {
    violations.push(`${brief.pageType.id}: generated output missing page-owned support runtime index.module.scss`)
  }

  if (!pageFile?.content) {
    violations.push(`${brief.pageType.id}: generated output missing page source for page-owned support validation`)
    return violations
  }

  if (!hasNamedImportSymbol(pageFile.content, './page-owned-mount-support', 'PageOwnedMountBoundary')) {
    violations.push(
      `${brief.pageType.id}: generated output must import PageOwnedMountBoundary from ./page-owned-mount-support`
    )
  }

  if (!pageFile.content.includes('<PageOwnedMountBoundary')) {
    violations.push(`${brief.pageType.id}: generated output must wrap the exported page root with PageOwnedMountBoundary`)
  }

  return violations
}

function collectFieldMapCompatibilityViolations(plannedFiles, brief) {
  const compatibility = getFieldMapProviderCompatibility(brief)
  if (compatibility?.strategy !== 'local-minimal-provider') return []

  const supportFile = compatibility.supportFile || {}
  const supportDestName = String(supportFile.destName || 'field-map-provider.tsx').trim()
  const importSource = String(supportFile.importSource || './field-map-provider').trim()
  const exportedSymbol = String(supportFile.exportedSymbol || 'TypicalPageFieldMapProvider').trim()
  const pageFile = findPrimaryGeneratedPageFile(plannedFiles, brief)
  const providerFile = plannedFiles.find((file) => path.basename(file.destPath) === supportDestName)
  const violations = []

  if (!pageFile?.content) {
    violations.push(`${brief.pageType.id}: generated output missing page source for field-map compatibility validation`)
    return violations
  }

  if (!providerFile?.content) {
    violations.push(`${brief.pageType.id}: generated output missing ${supportDestName} for high-risk legacy host compatibility`)
    return violations
  }

  if (!hasNamedImportSymbol(pageFile.content, importSource, exportedSymbol)) {
    violations.push(`${brief.pageType.id}: generated output does not import ${exportedSymbol} from ${importSource}`)
  }

  if (
    hasNamedImportSymbol(
      pageFile.content,
      brief.pageGenerationDecision?.hostImportPolicy?.typicalPageShells ||
      DEFAULT_TYPICAL_PAGE_SHELL_IMPORT_SOURCE,
      exportedSymbol
    )
  ) {
    violations.push(
      `${brief.pageType.id}: generated output still imports ${exportedSymbol} from ${
        brief.pageGenerationDecision?.hostImportPolicy?.typicalPageShells ||
        DEFAULT_TYPICAL_PAGE_SHELL_IMPORT_SOURCE
      }`
    )
  }

  if (
    collectNamedImportSourcesContainingSymbol(pageFile.content, exportedSymbol).some((importSource) =>
      isManagedLocalRuntimeRootImportSource(importSource)
    )
  ) {
    violations.push(
      `${brief.pageType.id}: generated output still imports ${exportedSymbol} from managed local runtime root instead of ${importSource}`
    )
  }

  if (
    managedLocalRuntimeSourcePackageName &&
    providerFile.content.includes(managedLocalRuntimeSourcePackageName)
  ) {
    violations.push(
      `${brief.pageType.id}: ${supportDestName} must not import legacy source-package modules from ${managedLocalRuntimeSourcePackageName}`
    )
  }

  const providerHiuiVisualImportViolations = collectHiuiVisualImportViolations(
    providerFile.content,
    supportDestName,
    {}
  )
  for (const importSource of providerHiuiVisualImportViolations) {
    violations.push(
      `${brief.pageType.id}: ${supportDestName} imports unsupported HiUI package ${importSource}; keep the generated shim on the certified field-map dependency surface only`
    )
  }

  const supportFileImportContract = resolveGeneratedSupportFileImportContract(brief)
  const allowedExternalImportSources = new Set([
    'react',
    supportFileImportContract.hookImportSource,
    supportFileImportContract.textAreaImportSource,
    '@hi-ui/schema-fields',
    '@hi-ui/schema-fields/bundle',
  ])
  const unexpectedExternalImportSources = collectExternalImportSources(providerFile.content).filter(
    (importSource) => !allowedExternalImportSources.has(importSource)
  )
  if (unexpectedExternalImportSources.length > 0) {
    violations.push(
      `${brief.pageType.id}: ${supportDestName} imports unexpected external packages ${unexpectedExternalImportSources.join(', ')}`
    )
  }

  for (const requiredToken of [
    'FieldMapProvider',
    'StableProCheckSelect',
    'StableProTextArea',
    'TypicalPageFieldMapProvider',
  ]) {
    if (!providerFile.content.includes(requiredToken)) {
      violations.push(`${brief.pageType.id}: ${supportDestName} missing required token ${requiredToken}`)
    }
  }

  violations.push(
    ...collectHostGenerationSupportFileContractViolations({
      source: providerFile.content,
      sourceLabel: supportDestName,
      contract: getResolvedHostGenerationContract(brief),
      supportFileImportContract,
    }).map((violation) => `${brief.pageType.id}: ${violation}`)
  )

  return violations
}

function collectGeneratedOutputViolations(plannedFiles, brief, options = {}) {
  const requireMetadata = options.requireMetadata !== false
  const pageFile = findPrimaryGeneratedPageFile(plannedFiles, brief)
  const metadataFile = plannedFiles.find((file) => path.basename(file.destPath) === 'hiui-pagegen.meta.json')
  const expectedStyleName = inferStyleDestName(brief.sources.preferredStylePath)
  const styleFile = expectedStyleName
    ? findSiblingPlannedFileByBasename(plannedFiles, pageFile, expectedStyleName) ||
      findShortestPlannedFileByBasename(plannedFiles, expectedStyleName)
    : null
  const styleSource = styleFile?.content ?? ''
  const violations = []
  const hostExecutionAdapter = brief.pageGenerationDecision?.hostExecutionAdapter || null
  const managedMfPublishEntryFileName =
    normalizeString(hostExecutionAdapter?.publishEntry?.managedPublishEntryFileName) ||
    inferManagedMfPublishEntryFileName({
      preferredTemplatePath: brief?.sources?.preferredTemplatePath || '',
    })
  const managedMfPublishEntryFile = plannedFiles.find(
    (file) => path.basename(file.destPath) === managedMfPublishEntryFileName
  )

  if (requireMetadata && !metadataFile) {
    violations.push(`${brief.pageType.id}: generated output missing hiui-pagegen.meta.json`)
  } else if (metadataFile) {
    try {
      const metadata = JSON.parse(String(metadataFile.content || '{}'))
      const metadataPageType = normalizeString(metadata.pageType)
      const metadataBaseTemplatePath = normalizeRelativePath(metadata.baseTemplatePath)
      const expectedBaseTemplatePath = normalizeRelativePath(
        brief.generationContract?.baseTemplatePath || brief.sources?.preferredTemplatePath || ''
      )

      if (metadataPageType !== normalizeString(brief.pageType.id)) {
        violations.push(
          `${brief.pageType.id}: hiui-pagegen.meta.json pageType must equal ${brief.pageType.id}`
        )
      }

      if (!metadataBaseTemplatePath || metadataBaseTemplatePath !== expectedBaseTemplatePath) {
        violations.push(
          `${brief.pageType.id}: hiui-pagegen.meta.json baseTemplatePath must equal ${expectedBaseTemplatePath}`
        )
      }
    } catch {
      violations.push(`${brief.pageType.id}: hiui-pagegen.meta.json must be valid JSON`)
    }
  }

  if (!pageFile) {
    violations.push(`${brief.pageType.id}: generated output missing index.tsx`)
    return violations
  }

  const targetRoot = normalizeString(brief.targetRoot)
  const pageFileRelativePath = resolvePlannedPageRelativePath(brief, pageFile, targetRoot)
  const managedMfPublishEntryRelativePath = managedMfPublishEntryFile
    ? resolveTargetRelativePath(targetRoot, managedMfPublishEntryFile.destPath)
    : ''
  const styleDeliveryDecision = buildStyleDeliveryDecision({
    brief,
    pageFileRelativePath,
    managedMfPublishEntry: {
      required: Boolean(managedMfPublishEntryFile),
      path: managedMfPublishEntryRelativePath,
    },
  })

  const routeMountUsesDefaultImport = new Set([
    'append-existing-registry',
    'create-formal-shell-and-mount-entry',
  ]).has(normalizeString(brief.pageGenerationDecision?.navigationMountAction?.action))

  if (routeMountUsesDefaultImport) {
    violations.push(
      ...collectRouteMountablePageExportViolations(
        pageFile.content,
        brief.generationContract?.moduleExportContract,
        { sourceLabel: 'generated route-mountable page source' }
      ).map(
        (violation) =>
          `${brief.pageType.id}: navigation mount requires a route-mountable page export contract - ${violation}`
      )
    )
  }

  violations.push(
    ...collectPageSourceSanityViolations({
      pageType: brief.pageType,
      contract: buildGeneratedOutputContract(brief),
      source: pageFile.content,
      styleSource,
      sourceLabel: 'generated output',
      copyMode: brief.pageGenerationDecision.copyMode,
    })
  )
  violations.push(
    ...collectHostGenerationPageContractViolations({
      source: pageFile.content,
      sourceLabel: 'index.tsx',
      contract: getResolvedHostGenerationContract(brief),
    }).map((violation) => `${brief.pageType.id}: ${violation}`)
  )

  if (brief.sources.preferredStylePath) {
    if (!styleFile) {
      violations.push(`${brief.pageType.id}: generated output missing required style ${expectedStyleName}`)
    }

    if (!pageFile.content.includes("from './index.module.scss'") && expectedStyleName === 'index.module.scss') {
      violations.push(`${brief.pageType.id}: generated output does not import ./index.module.scss`)
    }
  }

  if (styleDeliveryDecision.owner === 'page-local-fallback') {
    const expectedStyleImportStatement = `import ${JSON.stringify(
      resolveStyleDeliveryImportSource({
        entryRelativePath: pageFileRelativePath,
        styleImportPath: styleDeliveryDecision.styleImportPath,
      })
    )}`
    if (!pageFile.content.includes(expectedStyleImportStatement)) {
      pageFile.content = appendImportStatement(
        pageFile.content,
        expectedStyleImportStatement,
      )
    }

    if (
      !pageFile.content.includes(expectedStyleImportStatement) &&
      !sourceContainsManagedRuntimeStyleImport({
        source: pageFile.content,
        entryRelativePath: pageFileRelativePath,
        styleImportPath: styleDeliveryDecision.styleImportPath,
      })
    ) {
      violations.push(
        `${brief.pageType.id}: page-local style delivery fallback must import the managed local runtime styles`
      )
    }
  }

  violations.push(...collectVisibleExampleResidualViolations(plannedFiles, brief))
  violations.push(
    ...collectPageAdjustmentExecutionViolations({
      pageSource: pageFile.content,
      brief,
      executionPlan: brief.pageGenerationDecision.pageAdjustmentExecution,
    })
  )
  violations.push(...collectFieldMapCompatibilityViolations(plannedFiles, brief))
  violations.push(...collectPageOwnedSupportOutputViolations(plannedFiles, brief))

  if (brief.pageGenerationDecision?.publishDeliveryDecision?.kind === 'managed-mf-publish-entry') {
    if (!managedMfPublishEntryFile) {
      violations.push(
        `${brief.pageType.id}: generated output missing managed Module Federation publish entry ${managedMfPublishEntryFileName}`
      )
    } else if (
      !/hiui-design-runtime\/styles\.css/.test(String(managedMfPublishEntryFile.content || ''))
    ) {
      violations.push(
        `${brief.pageType.id}: managed Module Federation publish entry must import managed local runtime styles.css`
      )
    }
  }

  return violations
}

function collectPreWriteDecisionViolations(brief) {
  const outputTargetValidation = validateOutputTargetDecision({
    pageType: brief.pageType,
    requestedBusiness: {
      ...brief.requestedBusiness,
      outputTargetEvidence: brief.outputTargetEvidence || null,
    },
    generationTargetPolicy: brief.pageGenerationDecision.generationTargetPolicy,
  })
  const validation = validateCoverageDecision({
    pageType: brief.pageType,
    contract: brief.generationContract,
    coverageDecision: brief.pageGenerationDecision.coverageDecision,
    componentDecision: brief.pageGenerationDecision.componentDecision,
    tokenDecision: brief.pageGenerationDecision.tokenDecision,
    pageAdjustmentContract: brief.pageAdjustmentContract,
  })

  const violations = [...outputTargetValidation.violations, ...validation.violations]
  const guidance = brief.pageGenerationDecision.generationGuidance || {}
  const hostImportPolicy = brief.pageGenerationDecision.hostImportPolicy || {}

  if (guidance.enforceImportSourcePolicy && !hostImportPolicy.hiui5Components) {
    violations.push(`${brief.pageType.id}: host import policy does not declare hiui5Components source`)
  }

  if (guidance.enforceImportSourcePolicy && !Array.isArray(hostImportPolicy.forbiddenNewVisualImports)) {
    violations.push(`${brief.pageType.id}: host import policy does not declare forbiddenNewVisualImports`)
  }

  if (brief.executionPolicy?.navigationBlocked) {
    violations.push(
      `${brief.pageType.id}: navigation integration is blocked - ${brief.executionPolicy.navigationBlockReason || 'missing business navigation evidence'}`
    )
  }

  const navigationMountDecision = brief.pageGenerationDecision?.navigationMountDecision
  if (!navigationMountDecision?.action) {
    violations.push(`${brief.pageType.id}: missing navigationMountDecision before page generation`)
  } else if (navigationMountDecision.action === 'ask-user') {
    violations.push(
      `${brief.pageType.id}: navigation mount point is unresolved - ${navigationMountDecision.reason || 'ask the user for a target navigation registry before writing page code'}`
    )
  }

  const navigationMountAction = brief.pageGenerationDecision?.navigationMountAction
  const publishDeliveryDecision = brief.pageGenerationDecision?.publishDeliveryDecision || {}
  if (!navigationMountAction?.action) {
    violations.push(`${brief.pageType.id}: missing navigationMountAction before page generation`)
  } else if (navigationMountAction.action === 'ask-user') {
    violations.push(
      `${brief.pageType.id}: navigation mount action is unresolved - ${navigationMountAction.reason || 'resolve the navigation mount action before writing page code'}`
    )
  } else if (
    !MANUAL_NAVIGATION_MOUNT_ACTIONS.has(navigationMountAction.action) &&
    navigationMountAction.mustDoBeforePageCode !== true
  ) {
    violations.push(`${brief.pageType.id}: navigationMountAction.mustDoBeforePageCode must be true`)
  } else if (
    MANUAL_NAVIGATION_MOUNT_ACTIONS.has(navigationMountAction.action) &&
    navigationMountAction.mustDoBeforePageCode === true
  ) {
    violations.push(
      `${brief.pageType.id}: manual navigation mount action ${navigationMountAction.action} must not block page code generation`
    )
  } else if (navigationMountAction.action === 'append-existing-registry' && !navigationMountAction.targetRegistryPath) {
    violations.push(`${brief.pageType.id}: append-existing-registry requires targetRegistryPath before writing page code`)
  } else if (
    navigationMountAction.action === 'manual-register-existing-registry' &&
    !navigationMountAction.targetRegistryPath
  ) {
    violations.push(
      `${brief.pageType.id}: manual-register-existing-registry requires targetRegistryPath for manual follow-up guidance`
    )
  } else if (
    navigationMountAction.action === 'append-existing-entry' &&
    !navigationMountAction.targetEntryPath
  ) {
    violations.push(
      `${brief.pageType.id}: append-existing-entry requires targetEntryPath for manual follow-up guidance`
    )
  } else if (
    publishDeliveryDecision.kind === 'managed-mf-publish-entry' &&
    !navigationMountAction.targetEntryPath
  ) {
    violations.push(
      `${brief.pageType.id}: materialize-mf-publish-entry requires targetEntryPath for managed publish-entry follow-up guidance`
    )
  } else if (
    navigationMountAction.action === 'materialize-implicit-feature-entry' &&
    !(
      navigationMountAction.targetEntryPath &&
      navigationMountAction.implicitFeatureBaseDir &&
      navigationMountAction.implicitFeatureEntryPattern
    )
  ) {
    violations.push(
      `${brief.pageType.id}: materialize-implicit-feature-entry requires targetEntryPath, implicitFeatureBaseDir, and implicitFeatureEntryPattern before writing page code`
    )
  } else if (
    navigationMountAction.action === 'create-formal-shell-and-mount-entry' &&
    (!navigationMountAction.targetShellPath ||
      !navigationMountAction.targetRegistryPath ||
      !navigationMountAction.appEntryPath)
  ) {
    violations.push(
      `${brief.pageType.id}: create-formal-shell-and-mount-entry requires targetShellPath, targetRegistryPath, and appEntryPath before writing page code`
    )
  }

  violations.push(...collectHostShellDecisionViolations(brief))

  if (hasPageAdjustmentContract(brief) && brief.pageGenerationDecision?.pageAdjustmentExecution?.status !== 'ready') {
    violations.push(
      `${brief.pageType.id}: page adjustment execution is not ready - ${brief.pageGenerationDecision?.pageAdjustmentExecution?.message || 'missing execution plan'}`
    )
  }

  violations.push(...collectConfirmedInputViolations(brief))
  violations.push(...collectDesignRestoreInputViolations(brief))
  violations.push(...collectLegacyReconstructionViolations(brief))

  return violations
}

async function collectPreWriteNavigationMountExecutionViolations({ brief, targetRoot }) {
  const violations = []
  const navigationMountAction = brief.pageGenerationDecision?.navigationMountAction
  const targetBusinessPath = normalizeRelativePath(
    brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
  )

  if (navigationMountAction?.action === 'materialize-implicit-feature-entry') {
    const targetEntryPath = normalizeRelativePath(
      navigationMountAction.targetEntryPath || navigationMountAction.implicitFeatureBaseDir || ''
    )
    const implicitFeatureEntryPattern = normalizeRelativePath(
      navigationMountAction.implicitFeatureEntryPattern || ''
    )

    if (!targetEntryPath || !targetBusinessPath) return violations

    const absoluteEntryPath = path.join(targetRoot, targetEntryPath)
    if (!(await pathExists(absoluteEntryPath))) {
      violations.push(
        `${brief.pageType.id}: implicit feature registry base directory ${targetEntryPath} must exist before writing page code`
      )
      return violations
    }

    if (
      targetBusinessPath !== targetEntryPath &&
      !targetBusinessPath.startsWith(`${targetEntryPath}/`)
    ) {
      violations.push(
        `${brief.pageType.id}: implicit feature entry target ${targetBusinessPath} must stay under ${targetEntryPath}`
      )
      return violations
    }

    const relativeFeaturePath = path.posix.relative(targetEntryPath, targetBusinessPath)
    const featureSegments = relativeFeaturePath.split('/').filter(Boolean)
    if (featureSegments.length !== 1) {
      violations.push(
        `${brief.pageType.id}: implicit feature entry target ${targetBusinessPath} must be a direct child directory of ${targetEntryPath} so ${implicitFeatureEntryPattern || 'the existing import.meta.glob pattern'} can auto-discover index.tsx`
      )
    }

    return violations
  }

  if (navigationMountAction?.action !== 'append-existing-registry') return violations

  const targetRegistryPath = normalizeRelativePath(navigationMountAction.targetRegistryPath || '')
  const pageRoutePath = normalizeRelativePath(navigationMountAction.pageRoutePath || '').replace(/^\/+/, '')
  if (!targetRegistryPath || !pageRoutePath) return violations

  const absoluteRegistryPath = path.join(targetRoot, targetRegistryPath)
  if (!(await pathExists(absoluteRegistryPath))) {
    violations.push(
      `${brief.pageType.id}: append-existing-registry target ${targetRegistryPath} must exist before writing page code`
    )
  }

  return violations
}

function collectHostShellDecisionViolations(brief) {
  const violations = []
  const navigationDecision = brief.pageGenerationDecision?.navigationDecision
  const hostShellDecision = brief.pageGenerationDecision?.hostShellDecision

  if (!navigationDecision?.shouldAutoCreateFormalBusinessShell) {
    return violations
  }

  if (!hostShellDecision) {
    violations.push(`${brief.pageType.id}: missing hostShellDecision for first formal business navigation`)
    return violations
  }

  if (hostShellDecision.status !== 'materialize-official-formal-host-shell') {
    violations.push(
      `${brief.pageType.id}: hostShellDecision.status must be materialize-official-formal-host-shell when auto-creating the first formal business shell`
    )
  }

  if (hostShellDecision.officialHostSourceStatus !== 'ready') {
    violations.push(
      `${brief.pageType.id}: official host-shell source required for formal shell reuse is not ready - ${hostShellDecision.officialHostSourceReason || 'missing official host-shell source'}`
    )
  }

  if (hostShellDecision.baseHostTemplatePath !== 'examples/host-integration/src/app-frame-core.tsx') {
    violations.push(
      `${brief.pageType.id}: hostShellDecision.baseHostTemplatePath must stay pinned to examples/host-integration/src/app-frame-core.tsx`
    )
  }

  if (hostShellDecision.materializationStrategy !== 'thin-wrapper-over-managed-local-runtime') {
    violations.push(
      `${brief.pageType.id}: hostShellDecision.materializationStrategy must stay thin-wrapper-over-managed-local-runtime`
    )
  }

  if (!hostShellDecision.managedHostImportSource) {
    violations.push(`${brief.pageType.id}: hostShellDecision.managedHostImportSource is required`)
  }

  if (
    !Array.isArray(hostShellDecision.officialHostSourceRequiredFiles) ||
    hostShellDecision.officialHostSourceRequiredFiles.length === 0
  ) {
    violations.push(
      `${brief.pageType.id}: hostShellDecision.officialHostSourceRequiredFiles must declare the official host-shell source asset set`
    )
  }

  if (!hostShellDecision.targetShellPath || !hostShellDecision.targetRegistryPath) {
    violations.push(
      `${brief.pageType.id}: hostShellDecision must declare both targetShellPath and targetRegistryPath`
    )
  }

  if (!Array.isArray(hostShellDecision.lockedRegions) || hostShellDecision.lockedRegions.length === 0) {
    violations.push(`${brief.pageType.id}: hostShellDecision.lockedRegions must be declared for the first formal business shell`)
  }

  if (
    !normalizeRelativePath(
      hostShellDecision.firstPageRegistration?.targetBusinessPath ||
      brief.requestedBusiness?.targetBusinessPath ||
      ''
    )
  ) {
    violations.push(`${brief.pageType.id}: hostShellDecision.firstPageRegistration.targetBusinessPath is required`)
  }

  return violations
}

function collectConfirmedInputViolations(brief) {
  const violations = []
  const confirmedInput = brief.confirmedGenerationInput
  const isPrototypeScreenshot = brief.inputMode?.id === 'prototype-screenshot'

  if (!isPrototypeScreenshot) {
    if (confirmedInput) {
      violations.push(
        `${brief.pageType.id}: confirmedGenerationInput is only allowed when inputMode=prototype-screenshot`
      )
    }
    return violations
  }

  if (!confirmedInput) {
    violations.push(
      `${brief.pageType.id}: prototype-screenshot generation requires confirmedGenerationInput`
    )
    return violations
  }

  if (brief.executionPolicy?.requiresChatConfirmation !== true) {
    violations.push(
      `${brief.pageType.id}: prototype-screenshot generation must require chat confirmation`
    )
  }

  if (brief.executionPolicy?.confirmationMode !== 'chat-confirmed') {
    violations.push(
      `${brief.pageType.id}: prototype-screenshot generation must remain in chat-confirmed mode`
    )
  }

  if (!confirmedInput.evidence?.screenshotPath) {
    violations.push(
      `${brief.pageType.id}: confirmedGenerationInput.evidence.screenshotPath is required before generation`
    )
  } else if (!path.isAbsolute(confirmedInput.evidence.screenshotPath)) {
    violations.push(
      `${brief.pageType.id}: confirmedGenerationInput.evidence.screenshotPath must be an absolute path`
    )
  }

  if (!confirmedInput.pageTypeRecommendation?.recommended) {
    violations.push(
      `${brief.pageType.id}: confirmedGenerationInput.pageTypeRecommendation.recommended is required before generation`
    )
  }

  if (!Array.isArray(confirmedInput.promptDraft?.observedLayout) || confirmedInput.promptDraft.observedLayout.length === 0) {
    violations.push(
      `${brief.pageType.id}: confirmedGenerationInput.promptDraft.observedLayout must be a non-empty array before generation`
    )
  }

  if (confirmedInput.confirmation?.confirmed !== true) {
    violations.push(
      `${brief.pageType.id}: prototype-screenshot generation requires confirmedGenerationInput.confirmation.confirmed=true`
    )
  }

  if (!brief.executionPolicy?.confirmedPageType) {
    violations.push(
      `${brief.pageType.id}: executionPolicy.confirmedPageType is missing for prototype-screenshot generation`
    )
  } else if (brief.executionPolicy.confirmedPageType !== brief.pageType.id) {
    violations.push(
      `${brief.pageType.id}: executionPolicy.confirmedPageType must equal pageType.id ${brief.pageType.id}`
    )
  }

  if (confirmedInput.confirmation?.confirmedPageType !== brief.pageType.id) {
    violations.push(
      `${brief.pageType.id}: confirmedGenerationInput.confirmation.confirmedPageType must equal pageType.id ${brief.pageType.id}`
    )
  }

  if (!brief.executionPolicy?.finalPromptAvailable || !confirmedInput.confirmation?.finalPrompt) {
    violations.push(
      `${brief.pageType.id}: prototype-screenshot generation requires a non-empty confirmed finalPrompt`
    )
  }

  return violations
}

function collectDesignRestoreInputViolations(brief) {
  const violations = []
  const inputModeId = brief.inputMode?.id || ''
  const expectsDesignRestoreInput = isDesignRestoreInputMode(inputModeId)
  const confirmedDesignRestoreInput = normalizeConfirmedDesignRestoreInput(
    brief.confirmedDesignRestoreInput
  )

  if (!expectsDesignRestoreInput) {
    if (confirmedDesignRestoreInput) {
      violations.push(
        `${brief.pageType.id}: confirmedDesignRestoreInput is only allowed when inputMode is a design-restore mode`
      )
    }
    return violations
  }

  const contractViolations = validateConfirmedDesignRestoreInput({
    normalizedInputMode: { id: inputModeId },
    confirmedDesignRestoreInput,
  })
  violations.push(...contractViolations.map((item) => `${brief.pageType.id}: ${item}`))

  if (brief.executionPolicy?.requiresChatConfirmation !== true) {
    violations.push(
      `${brief.pageType.id}: ${inputModeId} generation must require chat confirmation`
    )
  }

  if (brief.executionPolicy?.confirmationMode !== 'chat-confirmed') {
    violations.push(
      `${brief.pageType.id}: ${inputModeId} generation must remain in chat-confirmed mode`
    )
  }

  if (!brief.executionPolicy?.finalPromptAvailable) {
    violations.push(
      `${brief.pageType.id}: ${inputModeId} generation requires a non-empty confirmed finalPrompt`
    )
  }

  return violations
}

function collectLegacyReconstructionViolations(brief) {
  const violations = []
  const legacyInput = brief.legacyReconstructionInput
  const migrationInvariantContract = brief.migrationInvariantContract
  const isLegacyReconstruction = brief.inputMode?.id === 'legacy-system-reconstruction'

  if (!isLegacyReconstruction) {
    if (legacyInput) {
      violations.push(
        `${brief.pageType.id}: legacyReconstructionInput is only allowed when inputMode=legacy-system-reconstruction`
      )
    }
    if (migrationInvariantContract) {
      violations.push(
        `${brief.pageType.id}: migrationInvariantContract is only allowed when inputMode=legacy-system-reconstruction`
      )
    }
    return violations
  }

  if (!legacyInput) {
    violations.push(
      `${brief.pageType.id}: legacy-system-reconstruction generation requires legacyReconstructionInput`
    )
    return violations
  }

  if (!migrationInvariantContract) {
    violations.push(
      `${brief.pageType.id}: legacy-system-reconstruction generation requires migrationInvariantContract`
    )
    return violations
  }

  if (brief.executionPolicy?.requiresChatConfirmation !== true) {
    violations.push(
      `${brief.pageType.id}: legacy-system-reconstruction generation must require chat confirmation`
    )
  }

  if (brief.executionPolicy?.confirmationMode !== 'chat-confirmed') {
    violations.push(
      `${brief.pageType.id}: legacy-system-reconstruction generation must remain in chat-confirmed mode`
    )
  }

  if (!brief.executionPolicy?.confirmedPageFamily) {
    violations.push(
      `${brief.pageType.id}: executionPolicy.confirmedPageFamily is missing for legacy-system-reconstruction generation`
    )
  } else if (brief.executionPolicy.confirmedPageFamily !== brief.pageType.pageFamily) {
    violations.push(
      `${brief.pageType.id}: executionPolicy.confirmedPageFamily must equal pageType.pageFamily ${brief.pageType.pageFamily}`
    )
  }

  if (!brief.executionPolicy?.confirmedPageType) {
    violations.push(
      `${brief.pageType.id}: executionPolicy.confirmedPageType is missing for legacy-system-reconstruction generation`
    )
  } else if (brief.executionPolicy.confirmedPageType !== brief.pageType.id) {
    violations.push(
      `${brief.pageType.id}: executionPolicy.confirmedPageType must equal pageType.id ${brief.pageType.id}`
    )
  }

  if (!brief.executionPolicy?.finalPromptAvailable || !legacyInput.confirmation?.finalPrompt) {
    violations.push(
      `${brief.pageType.id}: legacy-system-reconstruction generation requires a non-empty confirmed finalPrompt`
    )
  }

  if (!legacyInput.legacyFacts?.invariants?.length) {
    violations.push(
      `${brief.pageType.id}: legacy-system-reconstruction generation requires non-empty legacy invariants`
    )
  }

  if (migrationInvariantContract.blockedReasons?.length > 0) {
    violations.push(
      `${brief.pageType.id}: migrationInvariantContract still has blockedReasons: ${migrationInvariantContract.blockedReasons.join(', ')}`
    )
  }

  const legacyRefactorContractMode =
    brief.pageGenerationDecision?.pageFamilyContract?.legacyRefactorContractMode || 'none'

  if (legacyRefactorContractMode === 'analytics-refactor-contract') {
    if (!brief.analyticsRefactorContract) {
      violations.push(
        `${brief.pageType.id}: analytics-page legacy-system-reconstruction generation requires analyticsRefactorContract`
      )
    }
    if (!brief.pageGenerationDecision?.analyticsRefactorViewModel) {
      violations.push(
        `${brief.pageType.id}: analytics-page legacy-system-reconstruction generation requires analyticsRefactorViewModel`
      )
    }
  } else if (legacyRefactorContractMode === 'family-specific-contract') {
    violations.push(
      `${brief.pageType.id}: ${brief.pageType.pageFamily} legacy-system-reconstruction is reserved for a future family-specific refactor contract`
    )
  } else if (brief.analyticsRefactorContract) {
    violations.push(
      `${brief.pageType.id}: analyticsRefactorContract is only allowed for analytics-page generation`
    )
  }

  return violations
}

function inferStyleDestName(stylePath) {
  if (!stylePath) return ''
  const basename = path.basename(stylePath)
  if (basename.endsWith('.module.scss')) return 'index.module.scss'
  return basename
}

function buildGenerationReportArtifactPaths({ skillRoot, pageTypeId, generatedAt }) {
  const safeTimestamp = String(generatedAt || new Date().toISOString()).replace(/[:.]/g, '-')

  return {
    versionedMarkdownPath: path.join(
      skillRoot,
      'outputs',
      `PAGE_GENERATION_REPORT.${pageTypeId}.${safeTimestamp}.${process.pid}.md`
    ),
    versionedJsonPath: path.join(
      skillRoot,
      'outputs',
      `PAGE_GENERATION_REPORT.${pageTypeId}.${safeTimestamp}.${process.pid}.json`
    ),
    latestMarkdownPath: path.join(skillRoot, 'outputs', 'PAGE_GENERATION_REPORT.latest.md'),
    latestJsonPath: path.join(skillRoot, 'outputs', 'PAGE_GENERATION_REPORT.latest.json'),
  }
}

function resolveAppliedHostGenerationMetadata(brief) {
  const contract = getResolvedHostGenerationContract(brief)
  const compatibility = getFieldMapProviderCompatibility(brief)
  const visualImportModeApplied = String(contract.visualImportMode || '').trim() || 'not-applied'
  const hookImportModeApplied =
    compatibility?.strategy === 'local-minimal-provider'
      ? String(contract.hookImportMode || '').trim() || 'not-applied'
      : 'not-applicable'
  const scope =
    String(contract.scope || brief.pageGenerationDecision?.generationTargetPolicy?.scope || '').trim()

  return {
    resolvedHostGenerationContract: contract,
    visualImportModeApplied,
    hookImportModeApplied,
    scope,
  }
}

function buildPassStatus(status, reasons = []) {
  return {
    status,
    reasons: [...new Set((Array.isArray(reasons) ? reasons : []).filter(Boolean))],
  }
}

const BUSINESS_PLACEHOLDER_FILE_NAMES = new Set(['index.tsx', 'mock.ts', 'page-localization.ts'])
const BUSINESS_PLACEHOLDER_PATTERNS = [/示例/iu, /字段\s*\d+/iu, /概览\s*\d+/iu, /\bmock\b/iu]

function withManagedRuntimeSkippedSummary(summary = {}, skippedIdenticalFileCount = 0) {
  const skippedCount = Number.isFinite(skippedIdenticalFileCount) ? skippedIdenticalFileCount : 0
  if (skippedCount <= 0) {
    return summary
  }

  const countsByClass = {
    ...(summary?.countsByClass || {}),
  }
  countsByClass['managed-runtime'] = (countsByClass['managed-runtime'] || 0) + skippedCount
  const countsByCategory = {
    ...(summary?.countsByCategory || {}),
    managedRuntime: Number(summary?.countsByCategory?.managedRuntime || 0) + skippedCount,
  }

  return {
    ...summary,
    totalFiles: Number(summary?.totalFiles || 0) + skippedCount,
    countsByClass,
    countsByCategory,
    classes: Object.keys(countsByClass).sort(),
  }
}

function collectBusinessPlaceholderSignals(files = []) {
  const signals = []

  for (const file of Array.isArray(files) ? files : []) {
    const destPath = normalizeString(file?.destPath || '')
    const baseName = path.basename(destPath)
    if (!BUSINESS_PLACEHOLDER_FILE_NAMES.has(baseName)) continue

    const content = typeof file?.content === 'string' ? file.content : ''
    if (!content) continue

    for (const pattern of BUSINESS_PLACEHOLDER_PATTERNS) {
      if (!pattern.test(content)) continue
      signals.push({
        destPath,
        pattern: pattern.source,
      })
    }
  }

  return signals
}

function buildGenerationPassAssessment({
  brief,
  generatedOutputViolations = [],
  preWriteDecisionViolations = [],
  dependencyIsolationStatus = '',
  businessSlotSemanticReadiness = null,
  businessPlaceholderSignals = [],
  dryRun = false,
}) {
  const technicalReasons = []
  const businessReasons = []
  const navigationReasons = []
  const semanticReasons = []
  const semanticReadiness =
    businessSlotSemanticReadiness && typeof businessSlotSemanticReadiness === 'object'
      ? businessSlotSemanticReadiness
      : {}

  if (preWriteDecisionViolations.length > 0) {
    technicalReasons.push('pre-write decision contract did not pass')
  }
  if (generatedOutputViolations.length > 0) {
    technicalReasons.push('generated output sanity did not pass')
  }
  if (dependencyIsolationStatus && dependencyIsolationStatus !== 'pass') {
    technicalReasons.push(`dependency isolation status is ${dependencyIsolationStatus}`)
  }

  if (hasPageAdjustmentContract(brief)) {
    const pageAdjustmentExecution = brief.pageGenerationDecision?.pageAdjustmentExecution ?? {}
    const pageAdjustmentDecision = brief.pageGenerationDecision?.pageAdjustmentDecision ?? {}

    if (pageAdjustmentExecution.renderStrategy === 'default-adjustment-helper') {
      businessReasons.push('page adjustment still falls back to explanatory helper output')
    }
    if (pageAdjustmentDecision.validation?.status && pageAdjustmentDecision.validation.status !== 'pass') {
      businessReasons.push('page adjustment contract validation did not pass')
    }
  }

  if (brief.executionPolicy?.navigationBlocked) {
    navigationReasons.push('formal navigation registration is still blocked')
  }
  if (brief.executionPolicy?.requiresManualNavigationRegistration === true) {
    navigationReasons.push(
      brief.executionPolicy?.navigationExecutionReason ||
        'manual navigation registration is still required'
    )
  }
  if (semanticReadiness.ready === false || semanticReadiness.status === 'review-required') {
    semanticReasons.push(
      String(semanticReadiness.reason || '').trim() ||
        'business slot semantics are not ready for final acceptance'
    )
  }
  if (Array.isArray(businessPlaceholderSignals) && businessPlaceholderSignals.length > 0) {
    semanticReasons.push(
      `placeholder business content was detected in ${businessPlaceholderSignals
        .map((item) => path.basename(item.destPath))
        .join(', ')}`
    )
  }
  businessReasons.push(...navigationReasons, ...semanticReasons)

  const technicalPass = dryRun
    ? buildPassStatus(
        technicalReasons.length === 0 ? 'simulated-pass' : 'simulated-fail',
        technicalReasons.length === 0
          ? ['dry-run completed the technical write checks without materializing files']
          : technicalReasons
      )
    : buildPassStatus(technicalReasons.length === 0 ? 'pass' : 'fail', technicalReasons)

  const businessPass = dryRun
    ? buildPassStatus(
        technicalReasons.length === 0 && businessReasons.length === 0
          ? 'pending-review'
          : 'simulated-fail',
        technicalReasons.length === 0 && businessReasons.length === 0
          ? ['dry-run cannot prove final business deliverability; browser or materialized-page review is still required']
          : [...technicalReasons, ...businessReasons]
      )
    : buildPassStatus(
        technicalReasons.length === 0 && businessReasons.length === 0 ? 'pass' : 'fail',
        technicalReasons.length === 0 && businessReasons.length === 0
          ? []
          : [...technicalReasons, ...businessReasons]
      )

  return {
    templatePass: technicalPass,
    engineeringPass: technicalPass,
    navigationFlowPass:
      dryRun && navigationReasons.length === 0
        ? buildPassStatus('pending-review', [
            'dry-run cannot prove final navigation flow wiring without materialized code review',
          ])
        : buildPassStatus(navigationReasons.length === 0 ? 'pass' : 'fail', navigationReasons),
    businessSemanticPass: {
      status:
        semanticReasons.length === 0
          ? 'pass'
          : semanticReadiness.status === 'blocked'
            ? 'fail'
            : 'placeholder',
      reasons: semanticReasons,
      placeholderSignals: businessPlaceholderSignals,
    },
    technicalPass,
    businessPass,
  }
}

function buildManagedGenerationReadinessSummary({
  brief,
  generatedOutputViolations = [],
  preWriteDecisionViolations = [],
  dependencyIsolationStatus = '',
  projectCheckSelection = null,
  dryRun = false,
}) {
  const semanticReadiness =
    brief.pageGenerationDecision?.businessSlotPlan?.semanticReadiness ?? {
      status: 'unknown',
      ready: true,
      reason: '',
    }
  const writeReadiness = String(brief.executionPolicy?.writeReadiness || '').trim()
  const projectCheck =
    projectCheckSelection && typeof projectCheckSelection === 'object'
      ? projectCheckSelection
      : { shouldRun: false, selectedProfile: 'none', reason: '' }

  let generationReady = {
    status: 'ready',
    reason: '',
  }
  if (
    semanticReadiness.ready === false ||
    semanticReadiness.status === 'review-required' ||
    semanticReadiness.requiresReview === true
  ) {
    generationReady = {
      status: 'ready-with-review',
      reason:
        String(semanticReadiness.reason || '').trim() ||
        'Managed generation is using auto-completed business semantics and should be reviewed before delivery.',
    }
  } else if (writeReadiness && writeReadiness !== 'ready') {
    generationReady = {
      status: 'blocked',
      reason: `Generation write readiness is ${writeReadiness}.`,
    }
  } else if (preWriteDecisionViolations.length > 0) {
    generationReady = {
      status: 'blocked',
      reason: 'Pre-write generation decision sanity did not pass.',
    }
  }

  let engineeringReady = {
    status: 'ready',
    reason: '',
    selectedProjectCheckProfile: projectCheck.selectedProfile || 'none',
  }
  if (generatedOutputViolations.length > 0) {
    engineeringReady = {
      status: 'blocked',
      reason: 'Generated output sanity did not pass.',
      selectedProjectCheckProfile: projectCheck.selectedProfile || 'none',
    }
  } else if (dependencyIsolationStatus && dependencyIsolationStatus !== 'pass') {
    engineeringReady = {
      status: 'blocked',
      reason: `Dependency isolation is ${dependencyIsolationStatus}.`,
      selectedProjectCheckProfile: projectCheck.selectedProfile || 'none',
    }
  } else if (projectCheck.shouldRun && dryRun) {
    engineeringReady = {
      status: 'pending-materialization',
      reason:
        'Project check was selected, but dry-run did not materialize files, so engineering readiness still needs a written pass.',
      selectedProjectCheckProfile: projectCheck.selectedProfile || 'none',
    }
  } else if (projectCheck.shouldRun) {
    engineeringReady = {
      status: 'pending-project-check',
      reason:
        projectCheck.reason ||
        'Project check has been selected as the next engineering verification step.',
      selectedProjectCheckProfile: projectCheck.selectedProfile || 'none',
    }
  } else if (projectCheck.reason) {
    engineeringReady = {
      status: 'deferred',
      reason: projectCheck.reason,
      selectedProjectCheckProfile: projectCheck.selectedProfile || 'none',
    }
  }

  let runtimeReady = {
    status: 'baseline-ready',
    reason: '',
  }
  if (brief.integrationReadiness?.ready !== true) {
    runtimeReady = {
      status: 'blocked',
      reason:
        String(brief.integrationReadiness?.reason || '').trim() ||
        'Project integration readiness is not ready.',
    }
  } else if (dependencyIsolationStatus && dependencyIsolationStatus !== 'pass') {
    runtimeReady = {
      status: 'blocked',
      reason: `Dependency isolation is ${dependencyIsolationStatus}.`,
    }
  } else if (projectCheck.shouldRun && dryRun) {
    runtimeReady = {
      status: 'needs-written-runtime-check',
      reason:
        'Dry-run cannot prove the written runtime baseline inside the real project source tree.',
    }
  }

  return {
    generationReady,
    engineeringReady,
    runtimeReady,
  }
}

function isThinReExportPageSource(source = '') {
  const lines = String(source || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return false

  return lines.every(
    (line) =>
      /^export\s+(?:\*|\{[\s\S]*\}|default)\s+from\s+['"][^'"]+['"];?$/u.test(line) ||
      /^export\s+\{[\s\S]*\}\s+from\s+['"][^'"]+['"];?$/u.test(line)
  )
}

function buildGeneratedDeliveryState({
  brief,
  plannedFiles = [],
  managedMfPublishEntry = null,
}) {
  const pageFile = findPrimaryGeneratedPageFile(plannedFiles, brief)
  const targetRoot = normalizeString(brief?.targetRoot)
  const pageFileRelativePath = pageFile
    ? resolveTargetRelativePath(targetRoot, pageFile.destPath)
    : ''
  const deliveryRequiresManagedPublishEntry =
    brief?.pageGenerationDecision?.publishDeliveryDecision?.kind === 'managed-mf-publish-entry'
  const deliveryReadiness =
    deliveryRequiresManagedPublishEntry && !normalizeRelativePath(managedMfPublishEntry?.path || '')
      ? 'blocked'
      : 'ready'
  const contentReadiness =
    !pageFile?.content
      ? 'blocked'
      : hasLikelyGeneratedPageExport(pageFile) && !isThinReExportPageSource(pageFile.content)
        ? 'ready'
        : 'legacy'

  return {
    deliveryReadiness,
    contentReadiness,
    contentSourcePath: pageFileRelativePath,
  }
}

function buildGeneratedArtifactRecord(file = {}) {
  const content = typeof file.content === 'string' ? file.content : ''

  return {
    sourcePath: file.sourcePath || '',
    destPath: file.destPath || '',
    artifactClass: file.artifactClass || '',
    writeStatus: file.writeStatus || '',
    allowManagedOverwrite: file.allowManagedOverwrite === true,
    isManagedLocalRuntimeAsset: file.isManagedLocalRuntimeAsset === true,
    contentTrackedAtGeneration: Boolean(content),
    contentLength: content.length,
    contentDigest: content ? createHash('sha256').update(content).digest('hex') : '',
  }
}

function sanitizeGeneratedArtifactWritePlan(artifactWritePlan = null) {
  if (!artifactWritePlan || typeof artifactWritePlan !== 'object') return null

  return {
    ...artifactWritePlan,
    writableFiles: Array.isArray(artifactWritePlan.writableFiles)
      ? artifactWritePlan.writableFiles.map((file) => buildGeneratedArtifactRecord(file))
      : [],
    blockedFiles: Array.isArray(artifactWritePlan.blockedFiles)
      ? artifactWritePlan.blockedFiles.map((file) => buildGeneratedArtifactRecord(file))
      : [],
  }
}

function buildPagegenMetaContent({
  brief,
  generatedAt,
  managedMfPublishEntry = null,
  mfExposeWiringState = null,
  passAssessment = null,
  plannedFiles = [],
  plannedArtifactSummary = null,
  projectCheckSelection = null,
  readinessSummary = null,
  artifactWritePlan = null,
  styleDeliveryDecision = null,
  managedRuntimeWriteSummary = null,
  parentFlowPatchPlan = null,
}) {
  const generationContract = brief.generationContract || {}
  const layoutContract = generationContract.layoutContract || {}
  const appliedHostGenerationMetadata = resolveAppliedHostGenerationMetadata(brief)
  const navigationMountAction = brief.pageGenerationDecision?.navigationMountAction ?? {}
  const hostExecutionAdapter = brief.pageGenerationDecision?.hostExecutionAdapter ?? null
  const publishDeliveryDecision = brief.pageGenerationDecision?.publishDeliveryDecision ?? {}
  const mfPublishEntryPath = normalizeRelativePath(managedMfPublishEntry?.path || '')
  const mfPublishEntryManaged = managedMfPublishEntry?.required === true
  const mfPublishEntryShellStyles = managedMfPublishEntry?.importsShellStyles === true
  const mfExposeTargetPath = normalizeRelativePath(mfExposeWiringState?.mfExposeTargetPath || '')
  const mfExposeUsesManagedPublishEntry = mfExposeWiringState?.mfExposeUsesManagedPublishEntry === true
  const deliveryState = buildGeneratedDeliveryState({
    brief,
    plannedFiles,
    managedMfPublishEntry,
  })
  const meta = {
    schemaVersion: 'hiui-pagegen.meta.v1',
    sourceSkill: SKILL_PUBLIC_NAME,
    command: 'generate-page-from-brief',
    contractVersion: generationContract.contractVersion || 'page-types.manifest.json#generationContract',
    pageType: brief.pageType?.id || '',
    pageTypeLabel: brief.pageType?.label || '',
    copyMode: brief.pageGenerationDecision?.copyMode || '',
    generationPath: brief.pageGenerationDecision?.generationPath ?? {},
    workflow: brief.pageGenerationDecision?.workflow ?? {},
    mode: brief.mode || '',
    baseTemplatePath: generationContract.baseTemplatePath || brief.sources?.preferredTemplatePath || '',
    requiredShell: generationContract.requiredShell || brief.pageType?.shell || '',
    businessSlots: Array.isArray(generationContract.businessSlots) ? generationContract.businessSlots : [],
    forbiddenTokens: Array.isArray(generationContract.forbiddenTokens) ? generationContract.forbiddenTokens : [],
    requestedBusiness: {
      title: brief.requestedBusiness?.title || '',
      routePath: brief.requestedBusiness?.routePath || '',
      feedbackVariantId: brief.requestedBusiness?.feedbackVariantId || '',
      rawDest: brief.requestedBusiness?.rawDest || '',
      targetBusinessPath: brief.requestedBusiness?.targetBusinessPath || '',
      defaultBusinessPageDir: brief.requestedBusiness?.defaultBusinessPageDir || '',
      detailSections: brief.requestedBusiness?.detailSections || [],
      detailSectionsSource: brief.requestedBusiness?.detailSectionsSource || '',
      parentFlowContract: brief.requestedBusiness?.parentFlowContract || null,
    },
    outputTargetEvidence: brief.outputTargetEvidence ?? {},
    inputMode: brief.inputMode ?? {},
    confirmationPolicy: {
      mode: brief.executionPolicy?.confirmationMode || '',
      requiresChatConfirmation: Boolean(brief.executionPolicy?.requiresChatConfirmation),
      confirmedPageFamily: brief.executionPolicy?.confirmedPageFamily || '',
      confirmedPageType: brief.executionPolicy?.confirmedPageType || '',
      finalPromptAvailable: Boolean(brief.executionPolicy?.finalPromptAvailable),
    },
    confirmedDesignRestoreInput: brief.confirmedDesignRestoreInput ?? null,
    pageFamilyContract: brief.pageGenerationDecision?.pageFamilyContract ?? {},
    migrationInvariantContract: brief.migrationInvariantContract ?? null,
    analyticsRefactorContract: brief.analyticsRefactorContract ?? null,
    analyticsRefactorViewModel: brief.pageGenerationDecision?.analyticsRefactorViewModel ?? null,
    pageAdjustmentContract: brief.pageAdjustmentContract ?? null,
    pageAdjustmentDecision: brief.pageGenerationDecision?.pageAdjustmentDecision ?? {},
    pageAdjustmentExecution: brief.pageGenerationDecision?.pageAdjustmentExecution ?? {},
    pageRelationDecision: brief.pageGenerationDecision?.pageRelationDecision ?? {},
    publishDeliveryDecision,
    deliveryReadiness: deliveryState.deliveryReadiness,
    contentReadiness: deliveryState.contentReadiness,
    contentSourcePath: deliveryState.contentSourcePath,
    styleDeliveryDecision:
      styleDeliveryDecision && typeof styleDeliveryDecision === 'object'
        ? styleDeliveryDecision
        : null,
    navigationMountDecision: brief.pageGenerationDecision?.navigationMountDecision ?? {},
    navigationMountAction,
    parentFlowPatchStatus: parentFlowPatchPlan?.parentFlowPatchStatus || 'not-recorded',
    manualPatchSuggestion: parentFlowPatchPlan?.manualPatchSuggestion || null,
    backNavigationStrategy: parentFlowPatchPlan?.backNavigationStrategy || '',
    hostExecutionAdapter,
    mfPublishEntryPath,
    mfPublishEntryManaged,
    mfPublishEntryShellStyles,
    mfExposeTargetPath,
    mfExposeUsesManagedPublishEntry,
    managedMfPublishEntry:
      managedMfPublishEntry && typeof managedMfPublishEntry === 'object'
        ? managedMfPublishEntry
        : {
            required: false,
            path: '',
            fileName: '',
            importsShellStyles: false,
            importsReactCompatPatch: false,
            appEntryPath: '',
          },
    hostShellDecision: brief.pageGenerationDecision?.hostShellDecision ?? {},
    businessSlotPlan: brief.pageGenerationDecision?.businessSlotPlan ?? {},
    businessSlotSemanticReadiness:
      brief.pageGenerationDecision?.businessSlotPlan?.semanticReadiness ?? {},
    artifactSummary: summarizeGeneratedArtifacts(plannedFiles),
    plannedArtifactSummary:
      plannedArtifactSummary && typeof plannedArtifactSummary === 'object'
        ? plannedArtifactSummary
        : summarizeGeneratedArtifacts(plannedFiles),
    managedRuntimeWriteSummary:
      managedRuntimeWriteSummary && typeof managedRuntimeWriteSummary === 'object'
        ? managedRuntimeWriteSummary
        : null,
    artifactWritePlan:
      sanitizeGeneratedArtifactWritePlan(artifactWritePlan),
    projectCheckSelection:
      projectCheckSelection && typeof projectCheckSelection === 'object'
        ? projectCheckSelection
        : null,
    readinessSummary:
      readinessSummary && typeof readinessSummary === 'object' ? readinessSummary : null,
    shellCertification: brief.pageGenerationDecision?.navigationDecision?.shellCertification || 'missing',
    shellCertificationEvidence: brief.pageGenerationDecision?.navigationDecision?.shellCertificationEvidence ?? [],
    slotBoundaryCheck: {
      status: generationContract.slotBoundaryContract ? 'pass' : 'not-declared',
      allowedSlots: generationContract.slotBoundaryContract?.allowedSlots ?? [],
      forbiddenSlots: generationContract.slotBoundaryContract?.forbiddenSlots ?? [],
    },
    coverageDecision: brief.pageGenerationDecision?.coverageDecision ?? {},
    requiredDecisions: brief.pageGenerationDecision?.coverageDecision?.requiredDecisions ?? {},
    hostImportPolicy: brief.pageGenerationDecision?.hostImportPolicy ?? {},
    resolvedHostGenerationContract: appliedHostGenerationMetadata.resolvedHostGenerationContract,
    visualImportModeApplied: appliedHostGenerationMetadata.visualImportModeApplied,
    hookImportModeApplied: appliedHostGenerationMetadata.hookImportModeApplied,
    scope: appliedHostGenerationMetadata.scope,
    generationGuidance: brief.pageGenerationDecision?.generationGuidance ?? {},
    certifiedImplementationPolicy: brief.pageGenerationDecision?.certifiedImplementationPolicy ?? {},
    fieldMapProviderCompatibility:
      brief.pageGenerationDecision?.fieldMapProviderCompatibility ?? {},
    regionOwnershipCheck: {
      status: generationContract.regionOwnershipContract ? 'pass' : 'not-declared',
      lockedRegions: Array.isArray(generationContract.lockedRegions) ? generationContract.lockedRegions : [],
    },
    layoutChainCheck: {
      status: layoutContract.requiresFlexMinHeightChain ? 'pass' : 'not-required',
      requiresFlexMinHeightChain: Boolean(layoutContract.requiresFlexMinHeightChain),
      rootMustAvoidViewportHeightHack: Boolean(layoutContract.rootMustAvoidViewportHeightHack),
      whiteBodyMustFillRemainingHeight: Boolean(layoutContract.whiteBodyMustFillRemainingHeight),
    },
    businessNoticeCheck: {
      status: 'pass',
      persistentBusinessNoticeAllowed: generationContract.slotBoundaryContract?.businessNoticePolicy === 'persistent-ui-allowed',
    },
    templatePass: passAssessment?.templatePass ?? buildPassStatus('not-recorded'),
    engineeringPass: passAssessment?.engineeringPass ?? buildPassStatus('not-recorded'),
    navigationFlowPass: passAssessment?.navigationFlowPass ?? buildPassStatus('not-recorded'),
    businessSemanticPass:
      passAssessment?.businessSemanticPass ?? {
        status: 'not-recorded',
        reasons: [],
        placeholderSignals: [],
      },
    technicalPass: passAssessment?.technicalPass ?? buildPassStatus('not-recorded'),
    businessPass: passAssessment?.businessPass ?? buildPassStatus('not-recorded'),
    generatedAt,
    validatedAt: generatedAt,
    note: 'Lightweight provenance marker for AI and human review; current source files and manifest remain authoritative.',
  }

  return `${JSON.stringify(meta, null, 2)}\n`
}

function getAnalyticsFactLabel(value, fallback = '') {
  if (!value || typeof value !== 'object') return String(fallback || '').trim()

  return String(
    value.label ||
    value.title ||
    value.name ||
    value.key ||
    fallback ||
    ''
  ).trim()
}

function buildAnalyticsSearchPlaceholder(viewModel) {
  const labels = (viewModel?.controlStripFields ?? [])
    .map((item) => getAnalyticsFactLabel(item))
    .filter(Boolean)
    .slice(0, 3)

  if (labels.length === 0) return '请输入区域 / 风险点 / 趋势洞察'
  return `请输入${labels.join(' / ')}`
}

function buildAnalyticsTableFieldSource(detailTableColumns = []) {
  const widths = [240, 180, 180, 160]
  const columns = Array.isArray(detailTableColumns) ? detailTableColumns : []

  if (columns.length === 0) return ''

  return columns
    .slice(0, 4)
    .map((column, index) => {
      const label = getAnalyticsFactLabel(column, `明细列${index + 1}`)
      const key = String(column?.key || `field${index + 1}`).trim()
      const width = widths[index] || 160
      const ellipsisChain = index === 0 ? '.renderEllipsis()' : ''
      return `      T(${JSON.stringify(label)}, ${JSON.stringify(key)}).W(${width})${ellipsisChain}.val,`
    })
    .join('\n')
}

function buildDataVisualizationGoldenPathPageContent(brief) {
  const title = brief.requestedBusiness.title || brief.pageType.label || '数据可视化'
  const targetBusinessPath = normalizeRelativePath(
    brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
  )
  const analyticsPrimitivesImportPath = ensureRelativeImportPath(
    stripScriptModuleExtension(
      path.posix.relative(
        targetBusinessPath,
        normalizeRelativePath('src/runtime/analytics-primitives/index.tsx')
      )
    ).replace(/\/index$/, '')
  )
  const analyticsViewModel = brief.pageGenerationDecision?.analyticsRefactorViewModel || null
  const businessSlotPlan = brief.pageGenerationDecision?.businessSlotPlan || {}
  const detailTableColumns =
    Array.isArray(analyticsViewModel?.detailTableColumns) && analyticsViewModel.detailTableColumns.length > 0
      ? analyticsViewModel.detailTableColumns
      : Array.isArray(businessSlotPlan?.tableFields) && businessSlotPlan.tableFields.length > 0
        ? businessSlotPlan.tableFields
        : []
  const hasDetailTable = detailTableColumns.length > 0
  const tableFieldSource = buildAnalyticsTableFieldSource(detailTableColumns)
  const searchPlaceholder = buildAnalyticsSearchPlaceholder(analyticsViewModel)
  const schemaCoreImportSource = hasDetailTable
    ? "import { extendDsl, F, ReadonlyFieldCreator } from '@hi-ui/schema-core'"
    : "import { F } from '@hi-ui/schema-core'"
  const statPageImportSource = hasDetailTable
    ? "import { StatListPageFrame, renderStatTableTextEllipsis } from 'local-managed-runtime/pro-stat-page'"
    : "import { StatListPageFrame } from 'local-managed-runtime/pro-stat-page'"
  const tableDslSource = hasDetailTable
    ? `
const T = extendDsl(ReadonlyFieldCreator, {
  renderEllipsis() {
    return this.renderCell((cellValue) => renderStatTableTextEllipsis(cellValue))
  },
})
`
    : ''
  const detailRequestSource = hasDetailTable
    ? `const detailRows = [
  { id: '1', region: '华北', metricType: '效率', metricName: '响应时长', value: '18 分钟', riskPoint: '高峰期资源紧张', updatedAt: '2026-08-16 09:30' },
  { id: '2', region: '华东', metricType: '质量', metricName: '一次解决率', value: '97.2%', riskPoint: '复杂问题复访增加', updatedAt: '2026-08-16 09:42' },
  { id: '3', region: '华南', metricType: '风险', metricName: '超时风险', value: '126 单', riskPoint: '预约改期集中', updatedAt: '2026-08-16 10:10' },
  { id: '4', region: '西南', metricType: '体验', metricName: '满意度', value: '98.1%', riskPoint: '评价样本波动', updatedAt: '2026-08-16 10:28' },
]

async function queryVisualizationDetailList(params) {
  const keyword = String(params?.keyword || '').trim().toLowerCase()
  const region = params?.formData?.region
  const metricType = params?.formData?.metricType
  const filteredList = detailRows.filter((item) => {
    const regionMatched = !region || region === 'all' || item.region === regionOptions.find((option) => option.id === region)?.title
    const metricMatched = !metricType || metricType === 'all' || item.metricType === metricOptions.find((option) => option.id === metricType)?.title
    const keywordMatched = !keyword || [item.region, item.metricType, item.metricName, item.riskPoint].some((value) => String(value).toLowerCase().includes(keyword))

    return regionMatched && metricMatched && keywordMatched
  })

  return {
    list: filteredList,
    total: filteredList.length,
    current: params?.pagination?.current ?? 1,
    pageSize: params?.pagination?.pageSize ?? 20,
  }
}
`
    : `async function queryVisualizationDetailList() {
  return {
    list: [],
    total: 0,
    current: 1,
    pageSize: 20,
  }
}
`
  const tableFieldBlock = hasDetailTable
    ? `
  const tableFields = useMemo(
    () => [
${tableFieldSource}
    ],
    []
  )
`
    : ''
  const analyticsRefactorCommentSource = analyticsViewModel
    ? `// Legacy analytics refactor contract:
// workspaceInvariant: ${analyticsViewModel.workspaceInvariant}
// Legacy dashboard control-strip facts to preserve during refactor:
${analyticsViewModel.controlStripFields.map((item) => `// ${item.label} (${item.semanticRole || 'field'})`).join('\n')}
// Legacy chart module(s):
${analyticsViewModel.chartModules.map((item) => `// Legacy chart module: ${item.title}`).join('\n')}
`
    : ''

  const pageSource = `import { useMemo } from 'react'
import { Column, Line, Pie, Bar } from '@ant-design/charts'
${schemaCoreImportSource}
import { TypicalPageFieldMapProvider } from 'local-managed-runtime'
import { ProListPageProvider } from 'local-managed-runtime/pro-list-page'
${statPageImportSource}
import {
  createHiuiBarLikeColorScale,
  createHiuiColumnLikeColorScale,
  hiuiCartesianAxis,
  hiuiChartTokens,
  hiuiDistinctCategoricalPalette,
} from './chart-theme'
import { ChartCard, MetricCard } from ${JSON.stringify(analyticsPrimitivesImportPath)}
import styles from './index.module.scss'

${analyticsRefactorCommentSource}

${tableDslSource}

const regionOptions = [
  { id: 'all', title: '全部区域' },
  { id: 'north', title: '华北' },
  { id: 'east', title: '华东' },
  { id: 'south', title: '华南' },
]

const metricOptions = [
  { id: 'all', title: '全部指标' },
  { id: 'efficiency', title: '效率' },
  { id: 'quality', title: '质量' },
  { id: 'risk', title: '风险' },
]

const summaryMetrics = [
  { title: '核心指标量', value: '128,640', note: '较上周期 +12.8%' },
  { title: '目标达成率', value: '96.8%', note: '目标 95%' },
  { title: '平均处理时长', value: '18 分钟', note: '较上周期 -6 分钟' },
  { title: '体验评分', value: '98.2%', note: '样本 24,360' },
]

const trendData = [
  { period: '1月', type: '业务量', value: 8620 },
  { period: '2月', type: '业务量', value: 9180 },
  { period: '3月', type: '业务量', value: 10340 },
  { period: '4月', type: '业务量', value: 11260 },
  { period: '5月', type: '业务量', value: 12180 },
  { period: '6月', type: '业务量', value: 13420 },
  { period: '1月', type: '达成率', value: 94.8 },
  { period: '2月', type: '达成率', value: 95.6 },
  { period: '3月', type: '达成率', value: 96.1 },
  { period: '4月', type: '达成率', value: 96.9 },
  { period: '5月', type: '达成率', value: 97.6 },
  { period: '6月', type: '达成率', value: 98.2 },
]

const regionData = [
  { region: '华北', value: 96.2 },
  { region: '华东', value: 98.1 },
  { region: '华南', value: 95.7 },
  { region: '西南', value: 94.8 },
  { region: '海外', value: 93.6 },
]

const typeData = [
  { type: '效率', value: 46 },
  { type: '质量', value: 28 },
  { type: '风险', value: 16 },
  { type: '体验', value: 10 },
]

const riskData = [
  { reason: '资源等待', value: 386 },
  { reason: '流程回退', value: 264 },
  { reason: '人员超负荷', value: 198 },
  { reason: '信息异常', value: 126 },
]

const channelData = [
  { channel: '线上渠道', value: 35240 },
  { channel: '客服热线', value: 28680 },
  { channel: '门店受理', value: 22640 },
  { channel: '企业服务台', value: 14860 },
]

${detailRequestSource}

const chartCommonConfig = {
  autoFit: true,
  axis: hiuiCartesianAxis,
  height: 280,
  legend: { position: 'top' },
  scale: { color: { range: hiuiDistinctCategoricalPalette } },
}

const columnChartConfig = {
  ...chartCommonConfig,
  scale: createHiuiColumnLikeColorScale(hiuiDistinctCategoricalPalette, 'x'),
}

const barChartConfig = {
  ...chartCommonConfig,
  scale: createHiuiBarLikeColorScale(hiuiDistinctCategoricalPalette, 'x'),
}

const chartCards = [
  {
    key: 'trend',
    title: '核心指标趋势',
    subtitle: '观察业务量与目标达成率走势',
    featured: true,
    render: () => <Line {...chartCommonConfig} data={trendData} xField="period" yField="value" colorField="type" smooth point={{ size: 4 }} />,
  },
  {
    key: 'region',
    title: '区域达成率',
    subtitle: '定位区域履约短板',
    render: () => <Column {...columnChartConfig} data={regionData} xField="region" yField="value" colorField="region" label={{ text: 'value', position: 'top' }} />,
  },
  {
    key: 'type',
    title: '指标类型占比',
    subtitle: '识别主要分析结构',
    render: () => <Pie {...chartCommonConfig} data={typeData} angleField="value" colorField="type" innerRadius={0.6} label={{ text: 'type', position: 'outside' }} />,
  },
  {
    key: 'risk',
    title: '风险原因排行',
    subtitle: '聚焦需运营干预的问题',
    render: () => <Bar {...barChartConfig} data={riskData} xField="reason" yField="value" colorField="reason" label={{ text: 'value', position: 'right' }} />,
  },
  {
    key: 'channel',
    title: '渠道业务量',
    subtitle: '比较渠道入口压力',
    render: () => <Column {...columnChartConfig} data={channelData} xField="channel" yField="value" colorField="channel" />,
  },
]

const sectionStyles = {
  metricCard: {
    background: hiuiChartTokens.surface,
    border: '1px solid ' + hiuiChartTokens.border,
    borderRadius: 8,
    boxSizing: 'border-box',
    display: 'grid',
    gap: 10,
    minWidth: 0,
    padding: 16,
  },
  metricTitle: {
    color: hiuiChartTokens.textTertiary,
    fontSize: 14,
    lineHeight: '22px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  metricValueRow: {
    alignItems: 'baseline',
    columnGap: 8,
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  metricValue: {
    color: hiuiChartTokens.text,
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '32px',
  },
  metricNote: {
    color: hiuiChartTokens.textMeta,
    fontSize: 12,
    lineHeight: '20px',
  },
  chartCard: {
    background: hiuiChartTokens.surface,
    border: '1px solid ' + hiuiChartTokens.border,
    borderRadius: 8,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
    padding: 16,
  },
  chartHeader: {
    flex: '0 0 auto',
    minHeight: 48,
    paddingBottom: 10,
  },
  chartTitle: {
    color: hiuiChartTokens.text,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '24px',
  },
  chartSubtitle: {
    color: hiuiChartTokens.textMeta,
    fontSize: 12,
    lineHeight: '20px',
    marginTop: 4,
  },
  chartContent: {
    flex: '1 1 auto',
    minHeight: 0,
    minWidth: 0,
  },
}

function VisualizationWorkspace() {
  return (
    <div className={styles.workspace}>
      <section className={styles.summaryGrid}>
        {summaryMetrics.map((item) => (
          <MetricCard key={item.title} note={item.note} title={item.title} value={item.value} />
        ))}
      </section>

      <section className={styles.chartGrid}>
        {chartCards.map((item) => (
          <div key={item.key} className={item.featured ? styles.chartGridFeatured : styles.chartGridItem}>
            <ChartCard
              contentStyle={sectionStyles.chartContent}
              subtitle={item.subtitle}
              title={item.title}
            >
              {item.render()}
            </ChartCard>
          </div>
        ))}
      </section>
    </div>
  )
}

function DataVisualizationInner() {
  const queryFields = useMemo(
    () => [
      F('区域', 'region').Select({ data: regionOptions, clearable: true }).val,
      F('指标类型', 'metricType').Select({ data: metricOptions, clearable: true }).val,
    ],
    []
  )

${tableFieldBlock}

  return (
    <div className={styles.pageRoot}>
      <StatListPageFrame
        title={${JSON.stringify(title)}}
        queryFields={queryFields}
        searchPlaceholder=${JSON.stringify(searchPlaceholder)}
        statSection={<VisualizationWorkspace />}
${hasDetailTable ? "        tableFields={tableFields}\n        tableProps={{ maxHeight: undefined }}" : ''}
      />
    </div>
  )
}

export function DataVisualizationPage() {
  return (
    <ProListPageProvider request={queryVisualizationDetailList}>
      <TypicalPageFieldMapProvider>
        <DataVisualizationInner />
      </TypicalPageFieldMapProvider>
    </ProListPageProvider>
  )
}

export default DataVisualizationPage
`

  return applyManagedTableStatusTagTransforms(pageSource, brief)
}

function buildDataVisualizationRulesDrivenStyleContent() {
  return `.pageRoot {
  display: flex;
  flex: 1 1 0%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.pageRoot :global(.pro-stat-page) {
  display: flex;
  flex: 1 1 0%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.pageRoot :global(.pro-stat-page > .pro-list-page) {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.pageRoot :global(.pro-stat-page [class*='whiteBody']) {
  flex: 1 1 0% !important;
  min-height: 0 !important;
  min-width: 0 !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
}

.pageRoot :global(.pro-stat-page [class*='tableContainer']) {
  flex: 0 0 auto !important;
  min-height: auto !important;
  overflow: visible !important;
  padding-bottom: 20px !important;
}

.pageRoot :global(.pro-stat-page .hi-v5-table-footer) {
  position: static !important;
}

.workspace {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.summaryGrid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  min-width: 0;
}

.chartGrid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  min-width: 0;
}

.chartGridFeatured {
  grid-column: span 2;
  display: flex;
  min-width: 0;
}

.chartGridItem {
  display: flex;
  min-width: 0;
}

.chartGridFeatured > *,
.chartGridItem > * {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 280px;
  height: 100%;
}

@media (max-width: 1200px) {
  .summaryGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .chartGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .summaryGrid,
  .chartGrid {
    grid-template-columns: minmax(0, 1fr);
  }

  .chartGridFeatured {
    grid-column: span 1;
  }
}
`
}

function collectRelativeImports(source) {
  const imports = new Set()
  const patterns = [
    /from\s+['"](\.\.?\/[^'"]+)['"]/g,
    /import\s*['"](\.\.?\/[^'"]+)['"]/g,
  ]

  for (const pattern of patterns) {
    let match = pattern.exec(source)
    while (match) {
      imports.add(match[1])
      match = pattern.exec(source)
    }
  }

  return [...imports]
}

function resolveManagedLocalRuntimeSourceRoot(skillRoot) {
  return path.join(
    skillRoot,
    'examples',
    'host-integration',
    'src',
    getManagedLocalRuntimeRoot()
  )
}

function isPathInsideRoot(targetPath, rootPath) {
  const relativePath = path.relative(rootPath, targetPath)
  return (
    relativePath === '' ||
    (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
  )
}

function isManagedLocalRuntimeSourceFile(sourcePath = '', skillRoot = '') {
  if (!sourcePath || String(sourcePath).startsWith('skill:') || !skillRoot) return false
  const managedRuntimeSourceRoot = resolveManagedLocalRuntimeSourceRoot(skillRoot)
  return isPathInsideRoot(path.resolve(sourcePath), managedRuntimeSourceRoot)
}

function inferManagedLocalRuntimeSourceBaseDir(brief) {
  const candidates = [
    brief?.requestedBusiness?.targetBusinessPath,
    brief?.requestedBusiness?.dest,
    brief?.requestedBusiness?.defaultBusinessPageDir,
    brief?.pageGenerationDecision?.hostExecutionAdapter?.pageSource?.targetBusinessPath,
    brief?.pageGenerationDecision?.hostExecutionAdapter?.pageSource?.defaultBusinessPageDir,
  ]

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeRelativePath(candidate)
    if (!normalizedCandidate) continue

    const segments = normalizedCandidate.split('/').filter(Boolean)
    if (segments[0] === 'src' || segments[0] === 'app') {
      return segments[0]
    }
  }

  return 'src'
}

function resolveManagedLocalRuntimeTargetRoot({ brief, targetRoot }) {
  return path.join(
    targetRoot,
    inferManagedLocalRuntimeSourceBaseDir(brief),
    getManagedLocalRuntimeRoot()
  )
}

function resolveManagedLocalRuntimeTargetRelativeRoot(brief) {
  return normalizeRelativePath(
    path.posix.join(inferManagedLocalRuntimeSourceBaseDir(brief), getManagedLocalRuntimeRoot())
  )
}

function splitImportSearchAndHashSuffix(importPath = '') {
  const match = String(importPath || '').match(/([?#].*)$/)
  return {
    bareImportPath: stripImportSearchAndHash(importPath),
    suffix: match?.[1] || '',
  }
}

function isManagedLocalRuntimeRootImportSource(importSource = '') {
  const normalizedImportSource = normalizeImportSpecifierForMatch(importSource)
  const normalizedManagedRoot = normalizeImportSpecifierForMatch(getManagedLocalRuntimeRoot())

  return (
    normalizedImportSource === normalizedManagedRoot ||
    normalizedImportSource.endsWith(`/${normalizedManagedRoot}`)
  )
}

function collectNamedImportSourcesContainingSymbol(source = '', exportedSymbol = '') {
  const importPattern = /import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]/g
  const sources = new Set()
  let match = importPattern.exec(source)

  while (match) {
    const importedSymbols = match[1]
      .split(',')
      .map((item) => item.trim().split(/\s+as\s+/)[0]?.trim())
      .filter(Boolean)

    if (importedSymbols.includes(exportedSymbol)) {
      sources.add(match[2])
    }

    match = importPattern.exec(source)
  }

  return [...sources]
}

function removeNamedImportSymbolFromMatchingSources(source, exportedSymbol, matcher) {
  let nextSource = source
  const candidateImportSources = collectNamedImportSourcesContainingSymbol(source, exportedSymbol)

  for (const importSource of candidateImportSources) {
    if (!matcher(importSource)) continue
    nextSource = removeNamedImportSymbol(nextSource, importSource, exportedSymbol)
  }

  return nextSource
}

function resolveManagedLocalRuntimeImportRewriteTarget({
  importPath = '',
  sourcePath = '',
  destPath = '',
  brief,
  targetRoot,
} = {}) {
  if (!importPath || !destPath || !brief || !targetRoot) return ''

  const { bareImportPath, suffix } = splitImportSearchAndHashSuffix(importPath)
  const usesManagedLocalRuntime =
    isManagedLocalRuntimeLogicalSource(
      brief.pageGenerationDecision?.hostImportPolicy?.typicalPageShells ||
        DEFAULT_TYPICAL_PAGE_SHELL_IMPORT_SOURCE
    )

  if (!usesManagedLocalRuntime) return ''

  let targetAbsolutePath = ''
  if (bareImportPath.startsWith('.')) {
    if (!sourcePath || String(sourcePath).startsWith('skill:')) return ''

    const managedRuntimeSourceRoot = resolveManagedLocalRuntimeSourceRoot(brief.skillRoot)
    const resolvedTemplateImportPath = path.resolve(path.dirname(sourcePath), bareImportPath)
    if (!isPathInsideRoot(resolvedTemplateImportPath, managedRuntimeSourceRoot)) return ''

    const runtimeRelativePath = path.relative(
      managedRuntimeSourceRoot,
      resolvedTemplateImportPath
    )
    targetAbsolutePath = path.join(
      resolveManagedLocalRuntimeTargetRoot({ brief, targetRoot }),
      runtimeRelativePath
    )
  } else if (isManagedLocalRuntimeLogicalSource(bareImportPath)) {
    const managedRuntimeModulePath = resolveManagedLocalRuntimeModulePath(bareImportPath)
    if (!managedRuntimeModulePath) return ''

    targetAbsolutePath = path.join(
      targetRoot,
      inferManagedLocalRuntimeSourceBaseDir(brief),
      managedRuntimeModulePath
    )
  } else {
    return ''
  }

  const rewrittenImportPath = ensureRelativeImportPath(
    path.relative(path.dirname(destPath), targetAbsolutePath).replace(/\\/g, '/')
  )
  return `${rewrittenImportPath}${suffix}`
}

function rewriteManagedLocalRuntimeImports(
  source = '',
  { brief, targetRoot, sourcePath = '', destPath = '' } = {}
) {
  if (!source || !destPath) return source

  const replaceImportSpecifier = (match, prefix, importPath, suffix) => {
    const rewrittenImportPath = resolveManagedLocalRuntimeImportRewriteTarget({
      importPath,
      sourcePath,
      destPath,
      brief,
      targetRoot,
    })

    return rewrittenImportPath ? `${prefix}${rewrittenImportPath}${suffix}` : match
  }

  return source
    .replace(/(from\s+['"])([^'"]+)(['"])/g, replaceImportSpecifier)
    .replace(/(import\s*['"])([^'"]+)(['"])/g, replaceImportSpecifier)
}

async function collectAllManagedLocalRuntimeFiles({ brief, targetRoot }) {
  const sourceRoot = resolveManagedLocalRuntimeSourceRoot(brief.skillRoot)
  const files = await collectManagedLocalRuntimeProjectDistributionFiles({
    sourceRoot,
    targetRoot: resolveManagedLocalRuntimeTargetRoot({ brief, targetRoot }),
    annotateTargetDiff: true,
  })

  const annotatedFiles = files.map((file) => ({
    ...file,
    isManagedLocalRuntimeAsset: true,
    allowManagedOverwrite: true,
  }))
  const writableFiles = annotatedFiles.filter((file) => file.writeStatus !== 'skip-identical')
  const skippedIdenticalFiles = annotatedFiles.filter((file) => file.writeStatus === 'skip-identical')

  return {
    plannedFiles: annotatedFiles,
    writableFiles,
    skippedIdenticalFiles,
  }
}

const STYLE_TEMPLATE_EXTENSIONS = new Set(['.css', '.scss', '.sass'])
const TEXT_TEMPLATE_EXTENSIONS = new Set([
  '.css',
  '.json',
  '.js',
  '.jsx',
  '.mjs',
  '.sass',
  '.scss',
  '.ts',
  '.tsx',
])
const BINARY_TEMPLATE_ASSET_EXTENSIONS = new Set([
  '.avif',
  '.bmp',
  '.eot',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.otf',
  '.png',
  '.ttf',
  '.webp',
  '.woff',
  '.woff2',
  '.svg',
])

function stripImportSearchAndHash(importPath = '') {
  return importPath.replace(/[?#].*$/, '')
}

function isStyleTemplateFile(filePath) {
  return STYLE_TEMPLATE_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

function isTextTemplateFile(filePath) {
  return TEXT_TEMPLATE_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

function isBinaryTemplateAssetFile(filePath) {
  return BINARY_TEMPLATE_ASSET_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

function collectRelativeStyleDependencies(source) {
  const dependencies = new Set()
  const patterns = [
    /@(?:use|forward|import)\s+['"](\.\.?\/[^'"]+)['"]/g,
    /url\(\s*['"]?(\.\.?\/[^'")]+(?:[?#][^'")]*)?)['"]?\s*\)/g,
  ]

  for (const pattern of patterns) {
    let match = pattern.exec(source)
    while (match) {
      dependencies.add(stripImportSearchAndHash(match[1]))
      match = pattern.exec(source)
    }
  }

  return [...dependencies]
}

function mergeDependencyOwners(existingOwners = [], nextOwners = []) {
  return [...new Set([...(existingOwners || []), ...(nextOwners || [])])]
}

async function collectSiblingTemplateAssets(fileDir) {
  const entries = await fs.readdir(fileDir, { withFileTypes: true })
  return entries
    .filter(
      (entry) =>
        entry.isFile() && isBinaryTemplateAssetFile(entry.name)
    )
    .map((entry) => path.join(fileDir, entry.name))
}

async function resolveImportFile(templateDir, importPath) {
  const sanitizedImportPath = stripImportSearchAndHash(importPath)
  const base = path.resolve(templateDir, sanitizedImportPath)
  const basename = path.basename(base)
  const baseDir = path.dirname(base)
  const candidates = [
    base,
    `${base}.json`,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.css`,
    `${base}.scss`,
    `${base}.sass`,
    path.join(baseDir, `_${basename}.css`),
    path.join(baseDir, `_${basename}.scss`),
    path.join(baseDir, `_${basename}.sass`),
    path.join(base, 'index.json'),
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
    path.join(base, 'index.js'),
    path.join(base, 'index.jsx'),
    path.join(base, 'index.css'),
    path.join(base, 'index.scss'),
    path.join(base, 'index.sass'),
  ]

  for (const candidate of candidates) {
    if (await isReadableFile(candidate)) return candidate
  }

  return ''
}

export async function collectTemplateFiles(templatePath) {
  const templateDir = path.dirname(templatePath)
  const files = []
  const filesBySourcePath = new Map()
  const queue = [
    {
      sourcePath: templatePath,
      destName: 'index.tsx',
      isPage: true,
      dependencyOwners: [],
    },
  ]
  const visited = new Set()

  while (queue.length > 0) {
    const currentFile = queue.shift()
    const resolvedSourcePath = path.resolve(currentFile.sourcePath)
    const dependencyOwners = mergeDependencyOwners(
      [],
      currentFile.dependencyOwners?.map((ownerPath) => path.resolve(ownerPath)) || []
    )
    let recordedFile = filesBySourcePath.get(resolvedSourcePath)
    if (!recordedFile) {
      recordedFile = {
        sourcePath: resolvedSourcePath,
        destName: currentFile.destName,
        isPage: Boolean(currentFile.isPage),
        dependencyOwners,
      }
      filesBySourcePath.set(resolvedSourcePath, recordedFile)
      files.push(recordedFile)
    } else {
      recordedFile.isPage = recordedFile.isPage || Boolean(currentFile.isPage)
      recordedFile.dependencyOwners = mergeDependencyOwners(
        recordedFile.dependencyOwners,
        dependencyOwners
      )
    }

    if (visited.has(resolvedSourcePath)) continue
    visited.add(resolvedSourcePath)

    if (!isTextTemplateFile(resolvedSourcePath)) {
      recordedFile.binaryContent = await fs.readFile(resolvedSourcePath)
      continue
    }

    const currentSource = await fs.readFile(resolvedSourcePath, 'utf8')
    recordedFile.content = currentSource

    const currentDir = path.dirname(resolvedSourcePath)
    const dependencySpecifiers = new Set(collectRelativeImports(currentSource))
    if (isStyleTemplateFile(resolvedSourcePath)) {
      for (const importPath of collectRelativeStyleDependencies(currentSource)) {
        dependencySpecifiers.add(importPath)
      }
    }

    for (const importPath of dependencySpecifiers) {
      if (isTemplateTranslationImport(importPath)) continue

      const importFile = await resolveImportFile(currentDir, importPath)
      if (!importFile) continue

      queue.push({
        sourcePath: importFile,
        destName: path.relative(templateDir, importFile).replace(/\\/g, '/'),
        isPage: false,
        dependencyOwners: [resolvedSourcePath],
      })
    }

    if (isStyleTemplateFile(resolvedSourcePath)) {
      for (const assetPath of await collectSiblingTemplateAssets(currentDir)) {
        queue.push({
          sourcePath: assetPath,
          destName: path.relative(templateDir, assetPath).replace(/\\/g, '/'),
          isPage: false,
          dependencyOwners: [resolvedSourcePath],
        })
      }
    }
  }

  return files
}

export function pruneUnreferencedPageFiles(plannedFiles) {
  const keepDestPaths = new Set(
    plannedFiles
      .filter(
        (file) =>
          file.isPage ||
          file.isContractStyle ||
          file.isManagedFormalHostSupportAsset ||
          !Array.isArray(file.dependencyOwners) ||
          file.dependencyOwners.length === 0
      )
      .map((file) => file.destPath)
  )

  let changed = true
  while (changed) {
    changed = false
    for (const file of plannedFiles) {
      if (keepDestPaths.has(file.destPath)) continue
      if ((file.dependencyOwners || []).some((ownerPath) => keepDestPaths.has(ownerPath))) {
        keepDestPaths.add(file.destPath)
        changed = true
      }
    }
  }

  return plannedFiles.filter((file) => keepDestPaths.has(file.destPath))
}

export async function writePlannedFiles(plannedFiles) {
  for (const file of plannedFiles) {
    await fs.mkdir(path.dirname(file.destPath), { recursive: true })
    if (file.binaryContent) {
      await fs.writeFile(file.destPath, file.binaryContent)
      continue
    }

    await fs.writeFile(file.destPath, file.content, 'utf8')
  }
}

async function collectFormalHostSourceFiles({ entryPath, sourceRoot }) {
  const files = []
  const queue = [entryPath]
  const visited = new Set()

  while (queue.length > 0) {
    const currentSourcePath = queue.shift()
    const resolvedSourcePath = path.resolve(currentSourcePath)
    if (visited.has(resolvedSourcePath)) continue
    visited.add(resolvedSourcePath)

    const currentSource = await fs.readFile(resolvedSourcePath, 'utf8')
    const destName = path.relative(sourceRoot, resolvedSourcePath).replace(/\\/g, '/')
    if (!destName || destName.startsWith('..')) {
      throw new Error(`Formal host source asset escaped the official source root: ${resolvedSourcePath}`)
    }

    files.push({
      sourcePath: resolvedSourcePath,
      destName,
      content: currentSource,
      isManagedFormalHostSupportAsset: true,
    })

    const currentDir = path.dirname(resolvedSourcePath)
    for (const importPath of collectRelativeImports(currentSource)) {
      if (isTemplateTranslationImport(importPath)) continue

      const importFile = await resolveImportFile(currentDir, importPath)
      if (!importFile) continue

      const resolvedImportPath = path.resolve(importFile)
      if (visited.has(resolvedImportPath)) continue
      queue.push(resolvedImportPath)
    }
  }

  return files
}

function isFormalHostShellManagedRuntimeSupportFile(destName = '') {
  return normalizeRelativePath(destName).startsWith('components/hiui-design-runtime/')
}

function rewriteFormalHostShellManagedRuntimeImports(content = '', destRelativePath = '') {
  const normalizedDestRelativePath = normalizeRelativePath(destRelativePath)
  if (!content || !normalizedDestRelativePath) return content

  const destDir = path.posix.dirname(normalizedDestRelativePath)
  return content.replace(
    /(from\s+['"])(\.\.?(?:\/[^'"]+)?\/hiui-design-runtime\/[^'"]+)(['"])/g,
    (_match, prefix, importSource, suffix) => {
      const sourceMatch = String(importSource).match(
        /^\.\.?(?:\/[^'"]+)?\/hiui-design-runtime\/(.+)$/u
      )
      if (!sourceMatch) return `${prefix}${importSource}${suffix}`

      const rewrittenSource = ensureRelativeImportPath(
        path.posix.relative(
          destDir,
          path.posix.join('src', 'components', 'hiui-design-runtime', sourceMatch[1])
        )
      )
      return `${prefix}${rewrittenSource}${suffix}`
    }
  )
}

async function collectPageOwnedSupportFiles({ brief, destDir }) {
  if (!requiresPageOwnedSupportFile(brief)) return []

  const sourceRoot = path.join(
    brief.skillRoot,
    'examples',
    'host-integration',
    'src',
    'components',
    'hiui-design-runtime',
    'page-owned-mount-support'
  )
  const entryPath = path.join(sourceRoot, 'index.tsx')
  if (!(await isReadableFile(entryPath))) {
    throw new Error(`Missing page-owned support runtime source: ${entryPath}`)
  }

  const sourceFiles = await collectFormalHostSourceFiles({
    entryPath,
    sourceRoot,
  })

  return sourceFiles.map((file) => ({
    sourcePath: file.sourcePath,
    destPath: path.join(destDir, 'page-owned-mount-support', file.destName),
    content: file.content,
  }))
}

async function collectFormalHostShellFiles({ brief, targetRoot }) {
  if (!hasManagedFormalHostShellDecision(brief)) return []

  const hostShellDecision = brief.pageGenerationDecision.hostShellDecision
  const targetShellPath = normalizeRelativePath(hostShellDecision?.targetShellPath || '')
  const targetRegistryPath = normalizeRelativePath(hostShellDecision?.targetRegistryPath || '')
  const targetBusinessPath = normalizeRelativePath(
    brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
  )

  if (!targetShellPath || !targetRegistryPath || !targetBusinessPath) {
    throw new Error(
      'Formal host-shell materialization is missing targetShellPath, targetRegistryPath, or targetBusinessPath'
    )
  }

  const files = [
    {
      sourcePath: toSkillSourceTag('generated-formal-business-app-frame'),
      destPath: path.join(targetRoot, targetShellPath),
      content: buildFormalBusinessShellAppFrameContent({
        hostProfile: brief.hostProfile,
        hostShellDecision,
      }),
    },
    {
      sourcePath: toSkillSourceTag('generated-formal-business-routes'),
      destPath: path.join(targetRoot, targetRegistryPath),
      content: buildFormalBusinessRoutesContent({
        brief,
        hostProfile: brief.hostProfile,
        hostShellDecision,
      }),
    },
  ]

  const sourceAppFramePath = normalizeRelativePath(
    hostShellDecision?.sourceAppFramePath || hostShellDecision?.baseHostTemplatePath || ''
  )
  if (!sourceAppFramePath) {
    throw new Error('Formal host-shell materialization is missing sourceAppFramePath')
  }

  const absoluteSourceAppFramePath = path.join(brief.skillRoot, sourceAppFramePath)
  const sourceRoot = path.dirname(absoluteSourceAppFramePath)

  const sourceFiles = await collectFormalHostSourceFiles({
    entryPath: absoluteSourceAppFramePath,
    sourceRoot,
  })
  const hostShellLocalizationSource = sourceFiles.find((file) =>
    isHostShellLocalizationSupportFile(file)
  )?.content
  const hostShellLocalizationSupportPlan = await resolveHostShellLocalizationSupportPlan({
    brief,
    targetRoot,
    source: hostShellLocalizationSource || '',
  })

  return [
    ...files,
    ...sourceFiles
      .filter((file) => !isFormalHostShellManagedRuntimeSupportFile(file.destName))
      .map((file) => {
        const destRelativePath = path.posix.join(path.posix.dirname(targetShellPath), file.destName)
        const sourceContent =
          isHostShellLocalizationSupportFile(file) && hostShellLocalizationSupportPlan.content
            ? hostShellLocalizationSupportPlan.content
            : file.content
        return {
          sourcePath: file.sourcePath,
          destPath: path.join(targetRoot, destRelativePath),
          content: rewriteFormalHostShellManagedRuntimeImports(
            sourceContent,
            destRelativePath
          ),
          isManagedFormalHostSupportAsset: true,
        }
      }),
  ]
}

async function collectFormalNavigationEntryFiles({ brief, targetRoot }) {
  const navigationMountAction = brief.pageGenerationDecision?.navigationMountAction
  if (navigationMountAction?.action !== 'create-formal-shell-and-mount-entry') return []

  const appEntryPath = normalizeRelativePath(navigationMountAction.appEntryPath || '')
  const hostShellDecision = brief.pageGenerationDecision?.hostShellDecision || {}
  if (!appEntryPath) {
    throw new Error('Formal navigation entry materialization is missing appEntryPath')
  }

  const absoluteAppEntryPath = path.join(targetRoot, appEntryPath)
  const appEntrySource = await fs.readFile(absoluteAppEntryPath, 'utf8')

  return [
    {
      sourcePath: toSkillSourceTag('generated-formal-business-app-entry'),
      destPath: absoluteAppEntryPath,
      content: buildFormalBusinessAppEntryContent({
        appEntryPath,
        appEntrySource,
        hostShellDecision,
      }),
      allowManagedOverwrite: true,
    },
  ]
}

async function collectExistingNavigationRegistryPatchFiles({ brief, targetRoot }) {
  const navigationMountAction = brief.pageGenerationDecision?.navigationMountAction
  if (navigationMountAction?.action !== 'append-existing-registry') {
    return {
      files: [],
      supported: true,
      reason: '',
      strategy: 'none',
    }
  }

  const targetRegistryPath = normalizeRelativePath(navigationMountAction.targetRegistryPath || '')
  const targetBusinessPath = normalizeRelativePath(
    brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
  )
  if (!targetRegistryPath) {
    return {
      files: [],
      supported: false,
      reason: 'append-existing-registry is missing targetRegistryPath before writing page code.',
      strategy: 'missing-target-registry-path',
    }
  }

  const absoluteRegistryPath = path.join(targetRoot, targetRegistryPath)
  if (!(await pathExists(absoluteRegistryPath))) {
    return {
      files: [],
      supported: false,
      reason:
        `append-existing-registry target ${targetRegistryPath} must exist before writing page code.`,
      strategy: 'missing-target-registry-file',
    }
  }

  const registrySource = await fs.readFile(absoluteRegistryPath, 'utf8')
  const patchPlan = planExistingNavigationRegistryPatch({
    registrySource,
    targetRegistryPath,
    targetBusinessPath,
    pageRoutePath: navigationMountAction.pageRoutePath,
    menuTitle: navigationMountAction.menuTitle,
  })

  if (!patchPlan.supported) {
    return {
      files: [],
      supported: false,
      reason: patchPlan.reason,
      strategy: patchPlan.strategy,
    }
  }

  if (patchPlan.skipWrite) {
    return {
      files: [],
      supported: true,
      reason: patchPlan.reason,
      strategy: patchPlan.strategy,
    }
  }

  return {
    files: [
      {
        sourcePath: toSkillSourceTag('generated-formal-business-registry-append'),
        destPath: absoluteRegistryPath,
        content: patchPlan.content,
        allowManagedOverwrite: true,
      },
    ],
    supported: true,
    reason: patchPlan.reason,
    strategy: patchPlan.strategy,
  }
}

async function collectRulesDrivenWorkflowFiles(brief) {
  if (!usesRulesDrivenAnalyticsWorkflow(brief)) return null
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const chartThemePath = path.join(
    skillRoot,
    'examples/host-integration/src/pages/data-visualization/chart-theme.ts'
  )
  if (!(await pathExists(chartThemePath))) {
    throw new Error(`Missing data-visualization chart theme source: ${chartThemePath}`)
  }

  return [
    {
      sourcePath: toSkillSourceTag('generated-data-visualization-golden-path'),
      destName: 'index.tsx',
      content: buildDataVisualizationGoldenPathPageContent(brief),
      isPage: true,
    },
    {
      sourcePath: chartThemePath,
      destName: 'chart-theme.ts',
      content: await fs.readFile(chartThemePath, 'utf8'),
      isPage: false,
    },
    {
      sourcePath: toSkillSourceTag('generated-data-visualization-golden-path-style'),
      destName: 'index.module.scss',
      content: buildDataVisualizationRulesDrivenStyleContent(),
      isPage: false,
      isContractStyle: true,
    },
  ]
}

async function collectAnalyticsPrimitiveFiles({ targetRoot }) {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const sourceRoot = path.join(
    skillRoot,
    'examples',
    'host-integration',
    'src',
    'runtime',
    'analytics-primitives'
  )
  const targetRootPath = path.join(targetRoot, 'src', 'runtime', 'analytics-primitives')
  const fileNames = ['index.tsx', 'index.module.scss']
  const files = []

  for (const fileName of fileNames) {
    const sourcePath = path.join(sourceRoot, fileName)
    if (!(await pathExists(sourcePath))) {
      throw new Error(`Missing analytics primitive source: ${sourcePath}`)
    }

    files.push({
      sourcePath,
      destPath: path.join(targetRootPath, fileName),
      content: await fs.readFile(sourcePath, 'utf8'),
      allowManagedOverwrite: true,
    })
  }

  return files
}

async function appendContractStyleFile(files, brief) {
  const stylePath = brief.sources.preferredStylePath
  if (!stylePath) return files
  if (!(await pathExists(stylePath))) {
    throw new Error(`Missing official source style declared by baseStylePath: ${stylePath}`)
  }

  const alreadyIncluded = files.some((file) => path.resolve(file.sourcePath) === path.resolve(stylePath))
  if (alreadyIncluded) return files

  return [
    ...files,
    {
      sourcePath: stylePath,
      destName: inferStyleDestName(stylePath),
      content: await fs.readFile(stylePath, 'utf8'),
      isPage: false,
      isContractStyle: true,
    },
  ]
}

function collectVisibleExampleResidualViolations(plannedFiles, brief) {
  const violations = []
  const slotPlanResiduals = Array.isArray(
    brief.pageGenerationDecision?.businessSlotPlan?.forbiddenVisibleResiduals
  )
    ? brief.pageGenerationDecision.businessSlotPlan.forbiddenVisibleResiduals
    : []
  const visibleExampleTokens = [...new Set(['（示例）', '复制提示词', ...slotPlanResiduals])]
  const candidateFiles = plannedFiles.filter(
    (file) =>
      !file.isManagedFormalHostSupportAsset &&
      /\.(?:[cm]?[jt]sx?)$/.test(path.basename(file.destPath))
  )

  for (const file of candidateFiles) {
    for (const token of visibleExampleTokens) {
      if (file.content.includes(token)) {
        violations.push(`${brief.pageType.id}: generated output still contains visible example residue ${JSON.stringify(token)} in ${path.basename(file.destPath)}`)
      }
    }
  }

  return violations
}

function normalizeUrlOrigin(url) {
  return String(url || '').trim().replace(/\/+$/, '')
}

function normalizeRoutePathForLink(routePath) {
  const normalized = String(routePath || '').trim()
  if (!normalized) return ''
  return normalized.startsWith('/') ? normalized : `/${normalized}`
}

function buildPageLink(origin, routePath) {
  const normalizedOrigin = normalizeUrlOrigin(origin)
  if (!normalizedOrigin || !routePath) return ''
  return `${normalizedOrigin}${routePath}`
}

function buildCamoraPageLink(testBaseUrl, exposeName) {
  const baseUrl = normalizeUrlOrigin(testBaseUrl)
  const normalizedExposeName = String(exposeName || '')
    .trim()
    .replace(/^@common\//, '')

  if (!baseUrl || !normalizedExposeName) return ''
  return `${baseUrl}/?path=@common/${normalizedExposeName}`
}

function resolvePrimaryPageLinkDecision({ routePath, exposeName, testBaseUrl, localOrigin }) {
  const normalizedTestBaseUrl = normalizeUrlOrigin(testBaseUrl)
  const normalizedExposeName = String(exposeName || '')
    .trim()
    .replace(/^@common\//, '')
  const wantsCamoraLink = Boolean(normalizedTestBaseUrl || normalizedExposeName)
  const camoraPageLink = buildCamoraPageLink(testBaseUrl, exposeName)
  const normalizedRoutePath = normalizeRoutePathForLink(routePath)
  const primaryBusinessPageLink = normalizedRoutePath ? buildPageLink(localOrigin, normalizedRoutePath) : ''

  if (camoraPageLink) {
    return {
      primaryPageLink: camoraPageLink,
      primaryBusinessPageLink,
      primaryPageLinkBlockedReason: '',
      linkSource: 'camora-test',
    }
  }

  if (wantsCamoraLink) {
    const missingParts = [
      normalizedTestBaseUrl ? '' : 'testBaseUrl',
      normalizedExposeName ? '' : 'ExposeName',
    ].filter(Boolean)
    return {
      primaryPageLink: '',
      primaryBusinessPageLink,
      primaryPageLinkBlockedReason: `Camora direct page link requested but missing ${missingParts.join(' and ')}.`,
      linkSource: 'blocked-camora-test',
    }
  }

  if (normalizedRoutePath) {
    if (!primaryBusinessPageLink) {
      return {
        primaryPageLink: '',
        primaryBusinessPageLink: '',
        primaryPageLinkBlockedReason:
          'Local business route link requires an explicit localOrigin in README.md; do not default to localhost:5173.',
        linkSource: 'blocked-local-route',
      }
    }

    return {
      primaryPageLink: primaryBusinessPageLink,
      primaryBusinessPageLink,
      primaryPageLinkBlockedReason: '',
      linkSource: 'local-route',
    }
  }

  return {
    primaryPageLink: '',
    primaryBusinessPageLink: '',
    primaryPageLinkBlockedReason:
      'Primary page link requires either a formal routePath with localOrigin or a complete Camora test link contract. Official preview references stay in the packaged preview runtime.',
    linkSource: 'blocked-missing-route',
  }
}

function normalizeExposeName(value) {
  const normalizedValue = String(value || '').trim()
  if (!normalizedValue) return ''
  return normalizedValue.startsWith('./') ? normalizedValue : `./${normalizedValue}`
}

function buildCamoraVerifyCommand(exposeName = '') {
  const normalizedExposeName = normalizeExposeName(exposeName)
  if (!normalizedExposeName) return ''
  return `node ${getContextScriptPath('verify-remote-runtime-source.mjs')} --expose-name ${normalizedExposeName.replace(/^\.\//, '')}`
}

function buildDryRunCamoraRuntimeClosure({
  exposeName = '',
  primaryPageLinkDecision,
} = {}) {
  const verifyCommand = buildCamoraVerifyCommand(exposeName)
  return {
    applicable: true,
    status: 'manual-check',
    diagnosisKind: 'manual-runtime-check-required',
    confidence: 'medium',
    linkReady: primaryPageLinkDecision?.primaryPageLink ? 'unknown' : 'not-ready',
    reason: verifyCommand
      ? 'Dry-run does not write files or verify the live Camora remoteEntry.js, so runtime readiness remains unverified.'
      : 'Dry-run cannot verify Camora runtime readiness because ExposeName is missing.',
    suggestedAction: verifyCommand ? 'verify-runtime-source' : 'inspect-code-registration',
    remoteEntryUrl: '',
    verifyCommand,
    codeRegistration: {
      status: 'unknown',
      blockedChecks: [],
    },
  }
}

function deriveCamoraGenerationStatus({
  dryRun,
  camoraRuntimeClosure,
  defaultStatus,
} = {}) {
  if (!camoraRuntimeClosure?.applicable) return defaultStatus
  if (dryRun) return defaultStatus
  if (camoraRuntimeClosure.status === 'pass') return 'ready'
  if (camoraRuntimeClosure.status === 'blocked-by-code-registration') {
    return 'blocked-by-code-registration'
  }
  return 'written-but-runtime-not-ready'
}

function deriveCamoraPrimaryPageLinkRuntimeReadiness({
  primaryPageLinkDecision,
  camoraRuntimeClosure,
} = {}) {
  if (!camoraRuntimeClosure?.applicable) return ''
  if (!primaryPageLinkDecision?.primaryPageLink) return 'not-ready'
  return camoraRuntimeClosure.linkReady || 'unknown'
}

function deriveCamoraPrimaryPageLinkCaveat({
  primaryPageLinkDecision,
  camoraRuntimeClosure,
} = {}) {
  if (!camoraRuntimeClosure?.applicable) return ''
  if (!primaryPageLinkDecision?.primaryPageLink) {
    return primaryPageLinkDecision?.primaryPageLinkBlockedReason || ''
  }

  if (camoraRuntimeClosure.status === 'pass') return ''
  if (camoraRuntimeClosure.status === 'needs-local-restart') {
    return 'Do not treat the Camora link as ready yet; the local remote still appears stale.'
  }
  if (camoraRuntimeClosure.status === 'start-local-remote') {
    return 'Do not treat the Camora link as ready yet; the local remoteEntry.js could not be reached.'
  }
  if (camoraRuntimeClosure.status === 'blocked-by-code-registration') {
    return 'Do not treat the Camora link as ready yet; code registration is incomplete.'
  }
  return 'Do not treat the Camora link as ready yet; runtime readiness has not been fully verified.'
}

function buildCamoraNextRequiredActions({
  camoraRuntimeClosure,
  dryRun,
} = {}) {
  if (!camoraRuntimeClosure?.applicable) return []
  if (dryRun) {
    return camoraRuntimeClosure.verifyCommand
      ? [
          'Dry-run does not verify live Camora runtime readiness.',
          `After generating for real, run ${camoraRuntimeClosure.verifyCommand} before treating the test link as ready.`,
        ]
      : ['Dry-run cannot verify Camora runtime readiness until ExposeName is provided.']
  }

  if (camoraRuntimeClosure.status === 'pass') {
    return ['Open the Camora test page directly; the live remoteEntry.js already exposes the generated page.']
  }
  if (camoraRuntimeClosure.status === 'needs-local-restart') {
    return [
      'Restart the local dev server so Camora stops serving a stale local remoteEntry.js, then refresh the test page.',
    ]
  }
  if (camoraRuntimeClosure.status === 'start-local-remote') {
    return [
      'Start the local dev server that should serve the Camora remoteEntry.js, then refresh the test page.',
    ]
  }
  if (camoraRuntimeClosure.status === 'blocked-by-code-registration') {
    return [
      'Complete the blocked Camora code registration checks before treating the test page as ready.',
    ]
  }
  return camoraRuntimeClosure.verifyCommand
    ? [`Run ${camoraRuntimeClosure.verifyCommand} before treating the Camora test link as ready.`]
    : ['Camora runtime readiness still requires a manual check before the test link can be trusted.']
}

async function collectCamoraRuntimeClosure({
  targetRoot,
  brief,
  options,
  primaryPageLinkDecision,
} = {}) {
  const remoteDebugContract = brief.hostProfile?.remoteDebugContract || {}
  const navigationMountAction = brief.pageGenerationDecision?.navigationMountAction || {}
  const hostExecutionAdapter = brief.pageGenerationDecision?.hostExecutionAdapter || null
  const pageRelationDecision = brief.pageGenerationDecision?.pageRelationDecision || {}
  const publishDeliveryDecision = brief.pageGenerationDecision?.publishDeliveryDecision || {}
  const expectedExposeTarget =
    normalizeString(publishDeliveryDecision?.kind) === 'managed-mf-publish-entry'
      ? `./${stripScriptModuleExtension(
          normalizeRelativePath(hostExecutionAdapter?.publishEntry?.managedPublishEntryPath) ||
            inferManagedMfPublishEntryRelativePath({
              targetBusinessPath:
                brief?.requestedBusiness?.targetBusinessPath || brief?.requestedBusiness?.dest || '',
              preferredTemplatePath: brief?.sources?.preferredTemplatePath || '',
            })
        )}`
      : ''
  if (!isCamoraRuntimeClosureApplicable({ remoteDebugContract })) {
    return {
      applicable: false,
    }
  }

  if (options.dryRun) {
    return buildDryRunCamoraRuntimeClosure({
      exposeName: options.exposeName,
      primaryPageLinkDecision,
    })
  }

  const codeRegistrationEvidence = await collectCodeRegistrationEvidence({
    targetRoot,
    dest: options.dest,
    title: options.title,
    exposeName: options.exposeName,
    expectedExposeTarget,
    pageRelationDecision,
    publishDeliveryDecision,
    requireEntryFileEvidence: false,
    requireAddPageEvidence: false,
  })
  const runtimeSourceStatus = options.exposeName
    ? await verifyRemoteRuntimeSource({
        targetRoot,
        exposeName: options.exposeName,
        updatedBy: 'scripts/generate-page-from-brief.mjs',
      })
    : null

  return buildCamoraRuntimeClosure({
    remoteDebugContract,
    runtimeSourceStatus,
    codeRegistrationEvidence,
    expectedExposeName: normalizeExposeName(options.exposeName),
    verifyCommand: buildCamoraVerifyCommand(options.exposeName),
  })
}

function renderGenerationReport(result, brief) {
  const lines = [
    '# HiUI5 Page Generation Report',
    '',
    `- schema: ${result.reportSchema || PAGE_GENERATION_REPORT_SCHEMA}`,
    `- status: ${result.status}`,
    `- templatePass: ${result.templatePass?.status || 'not-recorded'}`,
    `- engineeringPass: ${result.engineeringPass?.status || 'not-recorded'}`,
    `- navigationFlowPass: ${result.navigationFlowPass?.status || 'not-recorded'}`,
    `- businessSemanticPass: ${result.businessSemanticPass?.status || 'not-recorded'}`,
    `- technicalPass: ${result.technicalPass?.status || 'not-recorded'}`,
    `- businessPass: ${result.businessPass?.status || 'not-recorded'}`,
    `- dryRun: ${result.dryRun}`,
    `- plannedFileCount: ${result.plannedFileCount ?? '—'}`,
    `- writtenFileCount: ${result.writtenFileCount ?? '—'}`,
    `- skippedIdenticalFileCount: ${result.skippedIdenticalFileCount ?? '—'}`,
    `- managedRuntimeWrittenFileCount: ${result.managedRuntimeWrittenFileCount ?? '—'}`,
    `- parentFlowPatchStatus: ${result.parentFlowPatchStatus || 'not-recorded'}`,
    `- backNavigationStrategy: ${result.backNavigationStrategy || '—'}`,
    `- mode: ${result.mode}`,
    `- inputMode: ${brief.inputMode.id} / ${brief.inputMode.label}`,
    `- confirmationMode: ${brief.executionPolicy.confirmationMode || '—'}`,
    `- requiresChatConfirmation: ${brief.executionPolicy.requiresChatConfirmation}`,
    `- confirmedPageFamily: ${brief.executionPolicy.confirmedPageFamily || '—'}`,
    `- confirmedPageType: ${brief.executionPolicy.confirmedPageType || '—'}`,
    `- finalPromptAvailable: ${brief.executionPolicy.finalPromptAvailable}`,
    ...(brief.confirmedDesignRestoreInput
      ? [
          `- designRestorePageGoal: ${brief.confirmedDesignRestoreInput.restoreDecisionPackage?.pageGoal || '—'}`,
          `- designRestoreLayoutIntent: ${brief.confirmedDesignRestoreInput.restoreDecisionPackage?.layoutIntent || '—'}`,
          `- designRestoreViewport: ${brief.confirmedDesignRestoreInput.targetViewport?.kind || '—'} / ${brief.confirmedDesignRestoreInput.targetViewport?.width ?? '—'}`,
          `- designRestoreTargetState: ${brief.confirmedDesignRestoreInput.targetState?.stateId || '—'} / ${brief.confirmedDesignRestoreInput.targetState?.label || '—'}`,
          `- designRestoreMustMatchRegions: ${brief.confirmedDesignRestoreInput.mustMatchRegions?.length || 0}`,
          `- designRestoreDecisionRegions: ${brief.confirmedDesignRestoreInput.restoreDecisionPackage?.regionDecisionTable?.length || 0}`,
        ]
      : []),
    `- generationPath: ${brief.pageGenerationDecision.generationPath.id} / ${brief.pageGenerationDecision.generationPath.label}`,
    `- carrierStrategy(copyMode): ${result.copyMode}`,
    `- workflowKind: ${result.workflow.kind}`,
    `- workflowDefaultFlow: ${result.workflow.defaultFlow}`,
    `- replaceBusinessSlotsByDefault: ${result.workflow.replaceBusinessSlotsByDefault}`,
    `- generatorMode: ${result.workflow.generatorMode}`,
    `- contentGenerationMode: ${result.workflow.contentGenerationMode}`,
    `- templateUsageMode: ${result.workflow.templateUsageMode}`,
    `- pageType: ${result.pageType.id} / ${result.pageType.label}`,
    `- pageFamily: ${result.pageType.pageFamily}`,
    `- pageFamilyContract: ${brief.pageGenerationDecision.pageFamilyContract.id} / ${brief.pageGenerationDecision.pageFamilyContract.label}`,
    `- primaryBusinessPageLink: ${result.primaryBusinessPageLink || '—'}`,
    `- linkSource: ${result.linkSource || '—'}`,
    `- primaryPageLinkBlockedReason: ${result.primaryPageLinkBlockedReason || '—'}`,
    `- primaryPageLinkRuntimeReadiness: ${result.primaryPageLinkRuntimeReadiness || '—'}`,
    `- primaryPageLinkCaveat: ${result.primaryPageLinkCaveat || '—'}`,
    `- pageFamilyLegacyRefactorContractMode: ${brief.pageGenerationDecision.pageFamilyContract.legacyRefactorContractMode}`,
    `- destDir: ${result.destDir}`,
    `- primaryPageLink: ${result.primaryPageLink || '—'}`,
    `- sourceTemplatePath: ${result.sourceTemplatePath}`,
    `- sourceStylePath: ${result.sourceStylePath || '—'}`,
    `- hostCapability: ${brief.pageGenerationDecision.hostCapability.status}`,
    `- hostCapabilityReason: ${brief.pageGenerationDecision.hostCapability.reason}`,
    `- formalHostAction: ${brief.pageGenerationDecision.navigationDecision.formalHostAction}`,
    `- navigationBlocked: ${brief.executionPolicy.navigationBlocked}`,
    `- navigationBlockReason: ${brief.executionPolicy.navigationBlockReason || '—'}`,
    `- navigationMountAction: ${brief.pageGenerationDecision.navigationMountAction?.action || '—'}`,
    `- navigationMountActionTargetShellPath: ${brief.pageGenerationDecision.navigationMountAction?.targetShellPath || '—'}`,
    `- navigationMountActionTargetRegistryPath: ${brief.pageGenerationDecision.navigationMountAction?.targetRegistryPath || '—'}`,
    `- navigationMountActionAppEntryPath: ${brief.pageGenerationDecision.navigationMountAction?.appEntryPath || '—'}`,
    `- hostShellDecisionStatus: ${brief.pageGenerationDecision.hostShellDecision?.status || '—'}`,
    `- hostShellMaterializationStrategy: ${brief.pageGenerationDecision.hostShellDecision?.materializationStrategy || '—'}`,
    `- hostShellTargetShellPath: ${brief.pageGenerationDecision.hostShellDecision?.targetShellPath || '—'}`,
    `- hostShellTargetRegistryPath: ${brief.pageGenerationDecision.hostShellDecision?.targetRegistryPath || '—'}`,
    `- coverageDecision: ${brief.pageGenerationDecision.coverageDecision.status}`,
    `- localAdjustmentHandling(adjustmentHandling): ${brief.pageGenerationDecision.coverageDecision.adjustmentHandling}`,
    `- managedByTemplate: ${brief.pageGenerationDecision.coverageDecision.managedByTemplate}`,
    `- componentDecisionRequired: ${brief.pageGenerationDecision.coverageDecision.requiredDecisions.componentDecision}`,
    `- tokenDecisionRequired: ${brief.pageGenerationDecision.coverageDecision.requiredDecisions.tokenDecision}`,
    `- pageAdjustmentContractStatus: ${brief.pageGenerationDecision.pageAdjustmentDecision.status}`,
    `- pageAdjustmentContractSource: ${brief.pageGenerationDecision.pageAdjustmentDecision.source || '—'}`,
    `- pageAdjustmentExecutionStatus: ${brief.pageGenerationDecision.pageAdjustmentExecution?.status || '—'}`,
    `- pageAdjustmentExecutionMode: ${brief.pageGenerationDecision.pageAdjustmentExecution?.mode || '—'}`,
    `- pageAdjustmentSelectedRegion: ${brief.pageGenerationDecision.pageAdjustmentExecution?.selectedRegion || '—'}`,
    '',
    '## Files',
    '',
    ...result.files.map((file) => `- ${file.destPath} ← ${file.sourcePath}`),
    '',
    '## Required Data Shape',
    '',
    '```json',
    JSON.stringify(brief.pageGenerationDecision.requiredDataShape, null, 2),
    '```',
    '',
    '## Coverage Decision',
    '',
    '```json',
    JSON.stringify(brief.pageGenerationDecision.coverageDecision, null, 2),
    '```',
    '',
    '## Pass Assessment',
    '',
    '```json',
    JSON.stringify(
      {
        technicalPass: result.technicalPass ?? buildPassStatus('not-recorded'),
        businessPass: result.businessPass ?? buildPassStatus('not-recorded'),
      },
      null,
      2
    ),
    '```',
    '',
    '## Migration Invariants',
    '',
    '```json',
    JSON.stringify(brief.migrationInvariantContract ?? null, null, 2),
    '```',
    '',
    '## Analytics Refactor Contract',
    '',
    '```json',
    JSON.stringify(brief.analyticsRefactorContract ?? null, null, 2),
    '```',
    '',
    '## Analytics Refactor View Model',
    '',
    '```json',
    JSON.stringify(brief.pageGenerationDecision.analyticsRefactorViewModel ?? null, null, 2),
    '```',
    '',
    '## Local Adjustment Decision',
    '',
    '```json',
    JSON.stringify(brief.pageGenerationDecision.pageAdjustmentDecision, null, 2),
    '```',
    '',
    '## Local Adjustment Execution',
    '',
    '```json',
    JSON.stringify(brief.pageGenerationDecision.pageAdjustmentExecution, null, 2),
    '```',
    '',
    '## Local Adjustment Contract',
    '',
    '```json',
    JSON.stringify(brief.pageAdjustmentContract, null, 2),
    '```',
    '',
    '## Generation Path',
    '',
    '```json',
    JSON.stringify(brief.pageGenerationDecision.generationPath, null, 2),
    '```',
    '',
    '## Host Shell Decision',
    '',
    '```json',
    JSON.stringify(brief.pageGenerationDecision.hostShellDecision ?? null, null, 2),
    '```',
    '',
    '## Navigation Mount Action',
    '',
    '```json',
    JSON.stringify(brief.pageGenerationDecision.navigationMountAction ?? null, null, 2),
    '```',
    '',
    '## Host Import Policy',
    '',
    '```json',
    JSON.stringify(brief.pageGenerationDecision.hostImportPolicy, null, 2),
    '```',
    '',
    '## Required Layout',
    '',
    '```json',
    JSON.stringify(brief.pageGenerationDecision.requiredLayout, null, 2),
    '```',
    '',
    '## Required DOM Class Contract',
    '',
    '```json',
    JSON.stringify(brief.pageGenerationDecision.requiredDomClassContract, null, 2),
    '```',
    '',
    ...(result.camoraRuntimeClosure?.applicable
      ? [
          '## Camora Runtime Closure',
          '',
          '```json',
          JSON.stringify(result.camoraRuntimeClosure, null, 2),
          '```',
          '',
        ]
      : []),
    '## Next Required Actions',
    '',
    ...result.nextRequiredActions.map((item) => `- ${item}`),
    '',
  ]
  return lines.join('\n')
}

export async function runGeneratePageFromBrief(options, context = {}) {
  const scriptStartedAtMs = Date.now()
  const emitOutput = context.emitOutput === true
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const targetRoot = context.targetRoot || path.resolve(options.target)
  let brief = context.preloadedBrief || null
  let pageTaskGate = brief?.pageTaskGate || null
  let effectiveRelatedPagePath = String(brief?.outputTargetEvidence?.relatedPagePath || '').trim()
  let sessionTraceContext = await openPageGenerationSession({
    targetRoot,
    brief,
    options,
    source: 'generate-page-from-brief',
  })
  const destDir = brief
    ? ensureDestIsSafe(targetRoot, brief.requestedBusiness?.targetBusinessPath || '')
    : ensureDestIsSafe(targetRoot, options.dest)
  let nonTypicalConversationOutput = null
  let confirmedGenerationInput = null
  let confirmedDesignRestoreInput = null
  let legacyReconstructionInput = null
  let migrationInvariantContract = null
  let analyticsRefactorContract = null
  const loadBrief = () => {
    if (!pageTaskGate) {
      throw new Error('Internal error: pageTaskGate must be initialized before reloading the generation brief.')
    }

    return loadGenerationBrief({
      targetRoot,
      skillRoot,
      integrationReadiness: pageTaskGate.integrationReadiness,
      pageTaskGate,
      pageTypeId: options.pageType,
      pageFamilyId: options.pageFamily,
      mode: options.mode,
      inputMode: options.inputMode,
      localizationMode: options.localizationMode,
      line: options.line,
      dest: options.dest,
      relatedPagePath: effectiveRelatedPagePath,
      title: options.title,
      routePath: options.routePath,
      detailSections: options.detailSectionsJson,
      feedbackVariantId: options.feedbackVariantId,
      pageAdjustmentContract: options.pageAdjustmentContract,
      nonTypicalConversationOutput,
      confirmedGenerationInput,
      confirmedDesignRestoreInput,
      navigationMountContract: options.navigationMountContract,
      legacyReconstructionInput,
      migrationInvariantContract,
      analyticsRefactorContract,
    })
  }

  if (options.pageType && options.pageFamily) {
    throw new Error('Use either --page-type or --page-family, not both')
  }

  if (!brief) {
    if (options.nonTypicalConversationOutputJson) {
      try {
        nonTypicalConversationOutput = JSON.parse(options.nonTypicalConversationOutputJson)
      } catch (error) {
        throw new Error(`Invalid JSON passed to --non-typical-conversation-output-json: ${error.message}`, {
          cause: error,
        })
      }
    }

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
    if (options.legacyReconstructionInputJson) {
      legacyReconstructionInput = await resolveJsonOrPathArg(
        options.legacyReconstructionInputJson,
        {
          targetRoot,
          label: '--legacy-reconstruction-input-json',
        }
      )
    }
    if (options.migrationInvariantContractJson) {
      migrationInvariantContract = await resolveJsonOrPathArg(
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
    pageTaskGate = await inspectPageTaskGate({ targetRoot, skillRoot })
    const relatedPageResolution = options.relatedPagePath
      ? {
          status: 'explicit',
          relatedPagePath: options.relatedPagePath,
        }
      : pageTaskGate.nextStage !== 'ready-to-generate'
        ? {
            status: 'deferred-until-page-task-ready',
            relatedPagePath: '',
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

    brief = await loadBrief()
  }
  sessionTraceContext = await openPageGenerationSession({
    targetRoot,
    brief,
    options,
    source: 'generate-page-from-brief',
    sessionId: sessionTraceContext.sessionId,
  })
  assertIntegrationExecutionPolicy(brief)

  const finalizeSessionSuccess = async (result, details = {}) => {
    const finishedAtMs = Date.now()
    const branch = normalizeString(details.branch || '')
    const plannedFiles = Array.isArray(result?.files)
      ? result.files.map((file) => normalizeString(file?.destPath || '')).filter(Boolean)
      : []
    const mutatedFiles = result?.dryRun === true ? [] : plannedFiles
    const evidenceFiles = [
      normalizeString(result?.reportPath || ''),
      normalizeString(result?.projectHostContract?.path || ''),
      normalizeString(result?.outputTargetEvidence?.selectedEntryPath || ''),
      normalizeString(result?.mfPublishEntryPath || ''),
    ].filter(Boolean)
    await recordPageGenerationSessionStage({
      sessionContext: sessionTraceContext,
      brief,
      options,
      source: 'generate-page-from-brief',
      stage: 'firstCodeReady',
      status: 'success',
      startedAtMs: scriptStartedAtMs,
      finishedAtMs,
      details: {
        stageId: `generate-page-from-brief-${branch || 'unknown'}-first-code-ready`,
        branch,
        dryRun: result?.dryRun === true,
        fileCount: Array.isArray(result?.files) ? result.files.length : 0,
        plannedFileCount: Number(result?.plannedFileCount || 0),
        writtenFileCount: Number(result?.writtenFileCount || 0),
        skippedIdenticalFileCount: Number(result?.skippedIdenticalFileCount || 0),
        managedRuntimeWrittenFileCount: Number(result?.managedRuntimeWrittenFileCount || 0),
        resultStatus: normalizeString(result?.status || ''),
        mutatedFiles,
        plannedFiles,
        evidenceFiles,
        ...buildPageRelationStageDetails({
          brief,
          resultPayload: result,
        }),
      },
      resultPayload: result,
    })
    await recordPageGenerationSessionStage({
      sessionContext: sessionTraceContext,
      brief,
      options,
      source: 'generate-page-from-brief',
      stage: 'done',
      status: 'success',
      startedAtMs: scriptStartedAtMs,
      finishedAtMs,
      details: {
        stageId: `generate-page-from-brief-${branch || 'unknown'}-done`,
        branch,
        dryRun: result?.dryRun === true,
        reportPath: normalizeString(result?.reportPath || ''),
        resultStatus: normalizeString(result?.status || ''),
        mutatedFiles,
        plannedFiles,
        evidenceFiles,
        ...buildPageRelationStageDetails({
          brief,
          resultPayload: result,
        }),
      },
      resultPayload: result,
    })
    result.sessionTrace = buildPageGenerationSessionRef(sessionTraceContext, {
      currentStage: 'done',
      currentStatus: 'success',
    })
    return result
  }

  try {
    const familyWorkflow = brief.pageSelector?.kind === 'page-family'
      ? await resolvePageFamilyWorkflowSnapshot({
          skillRoot,
          brief,
          pageFamily: brief.pageSelector?.id || options.pageFamily,
        })
      : null

    if (familyWorkflow && familyWorkflow.generatorReady !== true) {
      throw new BlockedGenerationError(
        'Non-typical family generator is not enabled in page-family workflow manifest. Keep this path fail-closed until generatorReady becomes true.',
        buildBlockedGenerationPayload({
          targetRoot,
          brief,
          blockedBy: 'page-family-generator-not-ready',
          reason:
            'Non-typical family generator is not enabled in page-family workflow manifest. Keep this path fail-closed until generatorReady becomes true.',
          familyWorkflow,
        })
      )
    }

    let ensureSummary = {
      attempted: false,
      command: '',
      projectLocalCommand: '',
      output: '',
    }

  if (brief.executionPolicy?.integrationGate === 'ensure-or-stop') {
    if (brief.executionPolicy?.integrationGate !== 'ensure-or-stop') {
      throw new Error(
        `Project integration is not ready (${brief.integrationReadiness?.status || 'unknown'}) but executionPolicy.integrationGate is ${brief.executionPolicy?.integrationGate || 'missing'} instead of ensure-or-stop.`
      )
    }

    const ensureCommandPreview = buildEnsureCommandPreview({
      targetRoot,
      skillRoot,
      mode: brief.mode,
      line: options.line,
      projectLocalAvailable: brief.integrationReadiness?.status !== 'missing-context',
    })
    ensureSummary = {
      attempted: !options.dryRun,
      command: ensureCommandPreview.command,
      projectLocalCommand: ensureCommandPreview.projectLocalCommand,
      output: '',
    }

    const gateNeedsContextSync = brief.integrationReadiness?.ready !== true
    const gateNextCommand = gateNeedsContextSync
      ? ensureCommandPreview.projectLocalCommand || ensureCommandPreview.command
      : brief.executionPolicy?.pageTaskGateNextCommand || 'typical-page:preflight'
    const gateNextActionLabel = gateNeedsContextSync ? 'ensure' : 'preflight'

    if (options.dryRun) {
      throw new BlockedGenerationError(
        `Project page task gate is not ready (${brief.executionPolicy?.pageTaskGateStatus || brief.integrationReadiness.status}): ${brief.executionPolicy?.pageTaskGateReason || brief.integrationReadiness.reason}.${renderForbiddenIntegrationFallbacks(brief)} Dry-run stays read-only, so generation will not auto-run ${gateNextActionLabel}. Run ${gateNextCommand} first.`,
        buildBlockedGenerationPayload({
          targetRoot,
          brief,
          blockedBy: 'page-task-gate-not-ready',
          reason:
            `Project page task gate is not ready (${brief.executionPolicy?.pageTaskGateStatus || brief.integrationReadiness.status}): ${brief.executionPolicy?.pageTaskGateReason || brief.integrationReadiness.reason}.${renderForbiddenIntegrationFallbacks(brief)} Dry-run stays read-only, so generation will not auto-run ${gateNextActionLabel}. Run ${gateNextCommand} first.`,
          familyWorkflow,
        })
      )
    }

    if (!brief.integrationReadiness?.ready) {
      const ensureResult = await runEnsureInCurrentProject({
        targetRoot,
        skillRoot,
        mode: brief.mode,
        line: options.line,
      })
      ensureSummary.output = ensureResult.stdout || ensureResult.stderr || ''
      pageTaskGate = await inspectPageTaskGate({ targetRoot, skillRoot })
      brief = await loadBrief()
      sessionTraceContext = await openPageGenerationSession({
        targetRoot,
        brief,
        options,
        source: 'generate-page-from-brief',
        sessionId: sessionTraceContext.sessionId,
      })
      assertIntegrationExecutionPolicy(brief)
    }

    if (!brief.integrationReadiness?.ready) {
      throw new BlockedGenerationError(
        `Project integration is still not ready after auto-ensure (${brief.integrationReadiness?.status || 'unknown'}): ${brief.integrationReadiness?.reason || 'unknown reason'}`,
        buildBlockedGenerationPayload({
          targetRoot,
          brief,
          blockedBy: 'integration-not-ready-after-ensure',
          reason:
            `Project integration is still not ready after auto-ensure (${brief.integrationReadiness?.status || 'unknown'}): ${brief.integrationReadiness?.reason || 'unknown reason'}`,
          familyWorkflow,
        })
      )
    }

    if (brief.executionPolicy?.integrationGate !== 'ready-to-generate') {
      throw new BlockedGenerationError(
        `Project page task gate is still closed (${brief.executionPolicy?.pageTaskGateStatus || 'unknown'}): ${brief.executionPolicy?.pageTaskGateReason || 'typical-page:preflight must pass before generation can continue.'}${renderForbiddenIntegrationFallbacks(brief)} Run ${brief.executionPolicy?.pageTaskGateNextCommand || 'typical-page:preflight'} first.`,
        buildBlockedGenerationPayload({
          targetRoot,
          brief,
          blockedBy: 'page-task-gate-not-ready',
          reason:
            `Project page task gate is still closed (${brief.executionPolicy?.pageTaskGateStatus || 'unknown'}): ${brief.executionPolicy?.pageTaskGateReason || 'typical-page:preflight must pass before generation can continue.'}${renderForbiddenIntegrationFallbacks(brief)} Run ${brief.executionPolicy?.pageTaskGateNextCommand || 'typical-page:preflight'} first.`,
          familyWorkflow,
        })
      )
    }
  }

  if (brief.executionPolicy?.briefReadyToGenerate === false) {
    throw new BlockedGenerationError(
      brief.executionPolicy?.briefBlockReason || 'Generation brief is blocked before write.',
      buildBlockedGenerationPayload({
        targetRoot,
        brief,
        blockedBy: brief.executionPolicy?.briefBlockedBy || 'generation-brief-blocked',
        reason: brief.executionPolicy?.briefBlockReason || 'Generation brief is blocked before write.',
        familyWorkflow,
      })
    )
  }

  if (isNavigationMountBlocked(brief)) {
    throw new BlockedGenerationError(
      getNavigationBlockReason(brief),
      buildBlockedGenerationPayload({
        targetRoot,
        brief,
        blockedBy: 'navigation-mount-not-ready',
        reason: getNavigationBlockReason(brief),
        familyWorkflow,
      })
    )
  }

  if (brief.pageSelector?.kind === 'page-family') {
    if (!brief.nonTypicalExecutionBrief) {
      throw new Error('Non-typical page-family generation requires nonTypicalExecutionBrief')
    }

    const dependencyIsolationReport = await runDependencyIsolationPreflight({ targetRoot, skillRoot })
    const familyResult = await materializeNonTypicalPageFiles({
      skillRoot,
      targetRoot,
      brief,
      force: options.force,
      dryRun: options.dryRun,
    })
    const familyDestDir = path.join(
      targetRoot,
      normalizeRelativePath(
        familyResult.targetBusinessPath ||
          brief.requestedBusiness?.targetBusinessPath ||
          brief.requestedBusiness?.dest ||
          ''
      )
    )
    const managedMfPublishEntryPlan = await collectManagedMfPublishEntryFiles({
      brief,
      targetRoot,
      destDir: familyDestDir,
    })
    const managedMfPublishEntryFiles = managedMfPublishEntryPlan.files
    const mfExposeWiringState = await resolveMfDirectExposeWiringState({
      targetRoot,
      requestedBusiness: brief.requestedBusiness,
      managedMfPublishEntry: managedMfPublishEntryPlan.managedMfPublishEntry,
      hostExecutionAdapter: brief.pageGenerationDecision?.hostExecutionAdapter || null,
    })

    if (managedMfPublishEntryFiles.length > 0 && !options.force) {
      const existingManagedMfFiles = []
      for (const file of managedMfPublishEntryFiles) {
        if ((await pathExists(file.destPath)) && !file.allowManagedOverwrite) {
          existingManagedMfFiles.push(file.destPath)
        }
      }

      if (existingManagedMfFiles.length > 0) {
        throw new Error(
          `Destination files already exist. Use --force only after reviewing: ${existingManagedMfFiles.join(', ')}`
        )
      }
    }

    if (!options.dryRun) {
      for (const file of managedMfPublishEntryFiles) {
        await fs.mkdir(path.dirname(file.destPath), { recursive: true })
        await fs.writeFile(file.destPath, file.content, 'utf8')
      }
    }

    let pageTaskGateRefresh = {
      refreshed: false,
      reason: options.dryRun
        ? 'dry-run did not write files, so the page-task gate freshness was left unchanged.'
        : 'no eligible managed navigation write was detected for page-task warm refresh.',
    }
    let settledProjectHostContractResult = {
      updated: false,
      reason: options.dryRun
        ? 'dry-run did not write files, so the project host contract was left unchanged.'
        : 'managed write did not settle any new project-scoped host contract facts.',
      contract: null,
    }
    let refreshedProjectHostContractSummary = brief.projectHostContract || null
    if (!options.dryRun) {
      settledProjectHostContractResult = await settleProjectHostContractAfterManagedWrite({
        targetRoot,
        navigationMountAction: brief.pageGenerationDecision?.navigationMountAction || null,
        requestedBusiness: brief.requestedBusiness || null,
        hostShellDecision: brief.pageGenerationDecision?.hostShellDecision || null,
        hostExecutionAdapter: brief.pageGenerationDecision?.hostExecutionAdapter || null,
      })
      pageTaskGateRefresh = await refreshReadyPageTaskGateAfterManagedWrite({
        targetRoot,
        navigationMountAction: brief.pageGenerationDecision?.navigationMountAction || null,
        writtenFiles: [...familyResult.files, ...managedMfPublishEntryFiles],
        integrationReadiness: brief.integrationReadiness,
        projectHostContract:
          settledProjectHostContractResult.contract || undefined,
        updatedBy: getContextScriptPath('generate-page-from-brief.mjs'),
      })
      refreshedProjectHostContractSummary = refreshProjectHostContractSummary(
        brief.projectHostContract || null,
        pageTaskGateRefresh.projectHostContract || settledProjectHostContractResult.contract
      )
    }

    let result = {
      ...familyResult,
      files: [
        ...familyResult.files,
        ...managedMfPublishEntryFiles.map((file) => ({
          sourcePath: file.sourcePath,
          destPath: file.destPath,
        })),
      ],
      mode: brief.mode,
      inputMode: brief.inputMode,
      confirmedDesignRestoreInput: brief.confirmedDesignRestoreInput ?? null,
      integrationReadiness: brief.integrationReadiness,
      projectHostContract: refreshedProjectHostContractSummary,
      pageFamilyContract: brief.pageGenerationDecision.pageFamilyContract ?? {},
      copyMode: brief.pageGenerationDecision.copyMode,
      generationPath: brief.pageGenerationDecision.generationPath,
      workflow: brief.pageGenerationDecision.workflow,
      nonTypicalExecutionBrief: brief.nonTypicalExecutionBrief,
      outputTargetEvidence: brief.outputTargetEvidence || null,
      navigationMountAction: brief.pageGenerationDecision.navigationMountAction,
      hostExecutionAdapter: brief.pageGenerationDecision.hostExecutionAdapter ?? null,
      mfPublishEntryPath: normalizeRelativePath(
        managedMfPublishEntryPlan.managedMfPublishEntry?.path || ''
      ),
      mfPublishEntryManaged: managedMfPublishEntryPlan.managedMfPublishEntry?.required === true,
      mfPublishEntryShellStyles:
        managedMfPublishEntryPlan.managedMfPublishEntry?.importsShellStyles === true,
      mfExposeTargetPath: normalizeRelativePath(mfExposeWiringState?.mfExposeTargetPath || ''),
      mfExposeUsesManagedPublishEntry: mfExposeWiringState?.mfExposeUsesManagedPublishEntry === true,
      managedMfPublishEntry: managedMfPublishEntryPlan.managedMfPublishEntry,
      navigationExecution: {
        blocked: brief.executionPolicy?.navigationExecutionBlocked === true,
        status: brief.executionPolicy?.navigationExecutionStatus || 'ready',
        blockedBy: brief.executionPolicy?.navigationExecutionBlockedBy || [],
        reason: brief.executionPolicy?.navigationExecutionReason || '',
        requiresManualNavigationRegistration:
          brief.executionPolicy?.requiresManualNavigationRegistration === true,
      },
      dependencyIsolation: {
        status: dependencyIsolationReport.status,
        checkedPackages:
          dependencyIsolationReport.checks?.find((check) => check.id === 'hiui-runtime-graph-uses-hiui5-only')
            ?.evidence?.validated?.length,
      },
      projectHostContractSettlement: {
        updated: settledProjectHostContractResult.updated === true,
        reason: settledProjectHostContractResult.reason || '',
      },
      pageTaskGateRefresh,
      reportPath: '',
    }

    result = await finalizeSessionSuccess(result, {
      branch: 'page-family',
    })

    if (emitOutput) {
      if (options.json) {
        console.log(JSON.stringify(result, null, 2))
        return result
      }

      console.log(
        `${options.dryRun ? 'Planned' : 'Generated'} ${result.files.length} file(s) from ${brief.pageSelector.label}`
      )
      for (const file of result.files) {
        console.log(`- ${path.relative(targetRoot, file.destPath)}`)
      }
    }
    return result
  }

  const readmeLinkConfig = await readLinkConfigFromReadme(targetRoot)
  const resolvedTestBaseUrl = options.testBaseUrl || readmeLinkConfig.testBaseUrl
  const pageAdjustmentExecution = planPageAdjustmentExecution({ brief })
  if (hasPageAdjustmentContract(brief) && pageAdjustmentExecution.status !== 'ready') {
    throw new Error(
      `Page adjustment execution planning failed: ${pageAdjustmentExecution.message || pageAdjustmentExecution.status}`
    )
  }
  brief.pageGenerationDecision.pageAdjustmentExecution = pageAdjustmentExecution
  const preWriteDecisionViolations = [
    ...collectPreWriteDecisionViolations(brief),
    ...(await collectPreWriteNavigationMountExecutionViolations({ brief, targetRoot })),
  ]
  if (preWriteDecisionViolations.length > 0) {
    throw new Error(`Generation decision contract failed before writing code: ${preWriteDecisionViolations.join('; ')}`)
  }
  const dependencyIsolationReport = await runDependencyIsolationPreflight({ targetRoot, skillRoot })
  const workflowFiles = await collectRulesDrivenWorkflowFiles(brief)
  const templateFiles =
    workflowFiles ??
    (await appendContractStyleFile(
      await collectTemplateFiles(brief.sources.preferredTemplatePath),
      brief
    ))
  const managedLocalRuntimeDistribution = isManagedLocalRuntimeLogicalSource(
    brief.pageGenerationDecision?.hostImportPolicy?.typicalPageShells ||
      DEFAULT_TYPICAL_PAGE_SHELL_IMPORT_SOURCE
  )
    ? await collectAllManagedLocalRuntimeFiles({ brief, targetRoot })
    : {
        plannedFiles: [],
        writableFiles: [],
        skippedIdenticalFiles: [],
      }
  const pageTemplateFiles = templateFiles.filter(
    (file) =>
      !isManagedLocalRuntimeSourceFile(file.sourcePath, brief.skillRoot) &&
      !shouldOmitTemplateMockModuleFile(file, brief)
  )
  const pageLocalizationSupportPlan = await resolvePageLocalizationSupportPlan({
    brief,
    targetRoot,
  })
  const existingNavigationRegistryPatch = await collectExistingNavigationRegistryPatchFiles({
    brief,
    targetRoot,
  })
  if (!existingNavigationRegistryPatch.supported) {
    throw new BlockedGenerationError(
      existingNavigationRegistryPatch.reason ||
        'Existing certified navigation registry could not be patched safely before page generation.',
      buildBlockedGenerationPayload({
        targetRoot,
        brief,
        blockedBy: 'navigation-mount-not-ready',
        reason:
          existingNavigationRegistryPatch.reason ||
          'Existing certified navigation registry could not be patched safely before page generation.',
        familyWorkflow,
      })
    )
  }
  const generatedAt = new Date().toISOString()
  const primaryPageLinkDecision = resolvePrimaryPageLinkDecision({
    routePath: brief.requestedBusiness?.routePath,
    exposeName: options.exposeName,
    testBaseUrl: resolvedTestBaseUrl,
    localOrigin: readmeLinkConfig.localOrigin,
  })
  const pageFiles = pageTemplateFiles.map((file) => {
    const destPath = path.join(
      destDir,
      brief.sources.preferredStylePath && path.resolve(file.sourcePath) === path.resolve(brief.sources.preferredStylePath)
        ? inferStyleDestName(file.sourcePath)
        : file.destName
    )
    const transformedContent = applyGenerationTransforms(
      file,
      brief,
      pageAdjustmentExecution,
      pageLocalizationSupportPlan,
      {
        targetRoot,
        destPath,
      }
    )
    return file.binaryContent
      ? {
          sourcePath: file.sourcePath,
          destPath,
          isPage: Boolean(file.isPage),
          binaryContent: transformedContent,
          dependencyOwners: file.dependencyOwners,
          allowManagedOverwrite:
            Boolean(file.allowManagedOverwrite) || isManagedGeneratedSupportFile(file),
        }
      : {
          sourcePath: file.sourcePath,
          destPath,
          isPage: Boolean(file.isPage),
          content: transformedContent,
          dependencyOwners: file.dependencyOwners,
          allowManagedOverwrite:
            Boolean(file.allowManagedOverwrite) || isManagedGeneratedSupportFile(file),
        }
  })
  const formalHostShellFiles = await collectFormalHostShellFiles({ brief, targetRoot })
  const existingNavigationRegistryPatchFiles = existingNavigationRegistryPatch.files
  const formalNavigationEntryFiles = await collectFormalNavigationEntryFiles({ brief, targetRoot })
  const managedMfPublishEntryPlan = await collectManagedMfPublishEntryFiles({
    brief,
    targetRoot,
    destDir,
  })
  const managedMfPublishEntryFiles = managedMfPublishEntryPlan.files
  const analyticsPrimitiveFiles = usesRulesDrivenAnalyticsWorkflow(brief)
    ? await collectAnalyticsPrimitiveFiles({ targetRoot })
    : []
  const mfExposeWiringState = await resolveMfDirectExposeWiringState({
    targetRoot,
    requestedBusiness: brief.requestedBusiness,
    managedMfPublishEntry: managedMfPublishEntryPlan.managedMfPublishEntry,
    hostExecutionAdapter: brief.pageGenerationDecision?.hostExecutionAdapter || null,
  })
  const fieldMapCompatibilityFiles = collectFieldMapCompatibilityFiles({
    brief,
    destDir,
    pageFiles,
  })
  const pageOwnedSupportFiles = await collectPageOwnedSupportFiles({ brief, destDir })
  const pageLocalMockModuleDestPath = path.join(destDir, 'mock.ts')
  const pageLocalMockModuleFiles = shouldMaterializeManagedPageLocalMockModule({
    brief,
  })
    ? [
        {
          sourcePath: toSkillSourceTag('generated-page-local-mock-module'),
          destPath: pageLocalMockModuleDestPath,
          content: rewriteManagedLocalRuntimeImports(
            buildManagedPageLocalMockModuleContent({
              brief,
              targetRoot,
              destDir,
            }),
            {
              brief,
              targetRoot,
              destPath: pageLocalMockModuleDestPath,
            }
          ),
        },
      ]
    : []
  const primaryGeneratedPageFile = findPrimaryGeneratedPageFile(pageFiles, brief)
  const primaryGeneratedPageFileRelativePath = resolvePlannedPageRelativePath(
    brief,
    primaryGeneratedPageFile,
    targetRoot,
  )
  const styleDeliveryDecision = buildStyleDeliveryDecision({
    brief,
    pageFileRelativePath: primaryGeneratedPageFileRelativePath,
    managedMfPublishEntry: managedMfPublishEntryPlan.managedMfPublishEntry,
  })
  if (
    primaryGeneratedPageFile &&
    !primaryGeneratedPageFile.binaryContent &&
    styleDeliveryDecision.owner === 'page-local-fallback'
  ) {
    const expectedStyleImportStatement = `import ${JSON.stringify(
      resolveStyleDeliveryImportSource({
        entryRelativePath: primaryGeneratedPageFileRelativePath,
        styleImportPath: styleDeliveryDecision.styleImportPath,
      })
    )}`
    if (!primaryGeneratedPageFile.content.includes(expectedStyleImportStatement)) {
      primaryGeneratedPageFile.content = appendImportStatement(
        primaryGeneratedPageFile.content,
        expectedStyleImportStatement,
      )
    }
    if (
      !sourceContainsManagedRuntimeStyleImport({
        source: primaryGeneratedPageFile.content,
        entryRelativePath: primaryGeneratedPageFileRelativePath,
        styleImportPath: styleDeliveryDecision.styleImportPath,
      })
    ) {
      primaryGeneratedPageFile.content = appendImportStatement(
        primaryGeneratedPageFile.content,
        expectedStyleImportStatement,
      )
    }
  }
  const styleDeliveryOwnerPatchFiles = await collectStyleDeliveryOwnerPatchFiles({
    targetRoot,
    styleDeliveryDecision,
  })
  const parentFlowPatchPlan = await resolveParentFlowPatchPlan({
    brief,
    targetRoot,
  })
  let plannedFiles = [
    ...formalHostShellFiles,
    ...existingNavigationRegistryPatchFiles,
    ...formalNavigationEntryFiles,
    ...managedMfPublishEntryFiles,
    ...managedLocalRuntimeDistribution.writableFiles,
    ...analyticsPrimitiveFiles,
    ...fieldMapCompatibilityFiles,
    ...pageOwnedSupportFiles,
    ...pageLocalMockModuleFiles,
    ...styleDeliveryOwnerPatchFiles,
    ...parentFlowPatchPlan.patchFiles,
    ...pageFiles,
  ]
  plannedFiles = annotateGeneratedArtifacts(plannedFiles)
  const businessSlotSemanticReadiness =
    brief.pageGenerationDecision?.businessSlotPlan?.semanticReadiness ?? null
  const managedRuntimeSkippedIdenticalFileCount =
    managedLocalRuntimeDistribution.skippedIdenticalFiles.length
  let artifactSummary = summarizeGeneratedArtifacts(plannedFiles)
  let plannedArtifactSummary = withManagedRuntimeSkippedSummary(
    artifactSummary,
    managedRuntimeSkippedIdenticalFileCount
  )
  const artifactWritePlan = resolveGeneratedArtifactWritePlan({
    files: plannedFiles,
    semanticReadiness: businessSlotSemanticReadiness,
  })
  const projectCheckSelection = resolveManagedGenerationProjectCheckSelection({
    dryRun: options.dryRun,
    semanticReadiness: businessSlotSemanticReadiness,
    artifactSummary,
  })
  const generatedOutputViolations = collectGeneratedOutputViolations(plannedFiles, brief, {
    requireMetadata: false,
  })
  const businessPlaceholderSignals = collectBusinessPlaceholderSignals(plannedFiles)
  const passAssessment = buildGenerationPassAssessment({
    brief,
    generatedOutputViolations,
    preWriteDecisionViolations,
    dependencyIsolationStatus: dependencyIsolationReport.status,
    businessSlotSemanticReadiness,
    businessPlaceholderSignals,
    dryRun: options.dryRun,
  })
  const readinessSummary = buildManagedGenerationReadinessSummary({
    brief,
    generatedOutputViolations,
    preWriteDecisionViolations,
    dependencyIsolationStatus: dependencyIsolationReport.status,
    projectCheckSelection,
    dryRun: options.dryRun,
  })
  plannedFiles.push({
    sourcePath: toSkillSourceTag('generated-metadata'),
    destPath: path.join(destDir, 'hiui-pagegen.meta.json'),
    content: buildPagegenMetaContent({
      brief,
      generatedAt,
      managedMfPublishEntry: managedMfPublishEntryPlan.managedMfPublishEntry,
      mfExposeWiringState,
      passAssessment,
      plannedFiles,
      plannedArtifactSummary,
      projectCheckSelection,
      readinessSummary,
      artifactWritePlan,
      styleDeliveryDecision,
      managedRuntimeWriteSummary: {
        plannedFileCount: managedLocalRuntimeDistribution.plannedFiles.length,
        writtenFileCount: managedLocalRuntimeDistribution.writableFiles.length,
        skippedIdenticalFileCount: managedLocalRuntimeDistribution.skippedIdenticalFiles.length,
      },
      parentFlowPatchPlan,
    }),
  })
  plannedFiles = annotateGeneratedArtifacts(plannedFiles)
  artifactSummary = summarizeGeneratedArtifacts(plannedFiles)
  plannedArtifactSummary = withManagedRuntimeSkippedSummary(
    artifactSummary,
    managedRuntimeSkippedIdenticalFileCount
  )

  const finalGeneratedOutputViolations = collectGeneratedOutputViolations(plannedFiles, brief)
  if (finalGeneratedOutputViolations.length > 0) {
    throw new Error(`Generated output violates page contract: ${finalGeneratedOutputViolations.join('; ')}`)
  }

  const existingFiles = []
  for (const file of plannedFiles) {
    if ((await pathExists(file.destPath)) && !file.allowManagedOverwrite) {
      existingFiles.push(file.destPath)
    }
  }

  if (existingFiles.length > 0 && !options.force) {
    const reason = `Destination files already exist. Use --force only after reviewing: ${existingFiles.join(', ')}`
    const blockedPayload = buildBlockedGenerationPayload({
      targetRoot,
      brief,
      blockedBy: 'destination-conflict',
      reason,
    })
    blockedPayload.existingFiles = existingFiles
    blockedPayload.requiredManualActions = [
      'Review the existing destination files and confirm whether this page should really be regenerated in place.',
      'Only rerun with --force after confirming the overwrite scope is expected.',
    ]
    throw new BlockedGenerationError(reason, blockedPayload)
  }

  if (!options.dryRun) {
    await writePlannedFiles(plannedFiles)
  }

  let pageTaskGateRefresh = {
    refreshed: false,
    reason: options.dryRun
      ? 'dry-run did not write files, so the page-task gate freshness was left unchanged.'
      : 'no eligible managed navigation write was detected for page-task warm refresh.',
  }
  let settledProjectHostContractResult = {
    updated: false,
    reason: options.dryRun
      ? 'dry-run did not write files, so the project host contract was left unchanged.'
      : 'managed write did not settle any new project-scoped host contract facts.',
    contract: null,
  }
  let refreshedProjectHostContractSummary = brief.projectHostContract || null
  if (!options.dryRun) {
    settledProjectHostContractResult = await settleProjectHostContractAfterManagedWrite({
      targetRoot,
      navigationMountAction: brief.pageGenerationDecision?.navigationMountAction || null,
      requestedBusiness: brief.requestedBusiness || null,
      hostShellDecision: brief.pageGenerationDecision?.hostShellDecision || null,
      hostExecutionAdapter: brief.pageGenerationDecision?.hostExecutionAdapter || null,
    })
    pageTaskGateRefresh = await refreshReadyPageTaskGateAfterManagedWrite({
      targetRoot,
      navigationMountAction: brief.pageGenerationDecision?.navigationMountAction || null,
      writtenFiles: plannedFiles,
      integrationReadiness: brief.integrationReadiness,
      projectHostContract:
        settledProjectHostContractResult.contract || undefined,
      updatedBy: getContextScriptPath('generate-page-from-brief.mjs'),
    })
    refreshedProjectHostContractSummary = refreshProjectHostContractSummary(
      brief.projectHostContract || null,
      pageTaskGateRefresh.projectHostContract || settledProjectHostContractResult.contract
    )
  }

  const camoraRuntimeClosure = await collectCamoraRuntimeClosure({
    targetRoot,
    brief,
    options,
    primaryPageLinkDecision,
  })
  const camoraNextRequiredActions = buildCamoraNextRequiredActions({
    camoraRuntimeClosure,
    dryRun: options.dryRun,
  })
  const writtenFileCount = plannedFiles.length
  const skippedIdenticalFileCount = managedRuntimeSkippedIdenticalFileCount
  const plannedFileCount = writtenFileCount + skippedIdenticalFileCount
  const managedRuntimeWrittenFileCount = plannedFiles.filter(
    (file) => file.artifactClass === 'managed-runtime'
  ).length

  let result = {
    status: deriveCamoraGenerationStatus({
      dryRun: options.dryRun,
      camoraRuntimeClosure,
      defaultStatus: options.dryRun ? 'planned' : 'written',
    }),
    dryRun: options.dryRun,
    mode: brief.mode,
    templatePass: passAssessment.templatePass,
    engineeringPass: passAssessment.engineeringPass,
    navigationFlowPass: passAssessment.navigationFlowPass,
    businessSemanticPass: passAssessment.businessSemanticPass,
    technicalPass: passAssessment.technicalPass,
    businessPass: passAssessment.businessPass,
    integrationReadiness: brief.integrationReadiness,
    integrationPolicy: {
      gate: brief.executionPolicy?.integrationGate || '',
      pageTaskGateStatus: brief.executionPolicy?.pageTaskGateStatus || '',
      pageTaskGateReason: brief.executionPolicy?.pageTaskGateReason || '',
      pageTaskGateNextCommand: brief.executionPolicy?.pageTaskGateNextCommand || '',
      pageTaskGateNextRequiredAction: brief.executionPolicy?.pageTaskGateNextRequiredAction || '',
      pageTaskGateStaleInputs: brief.executionPolicy?.pageTaskGateStaleInputs || [],
      pageTaskGateCanAutoRecover: brief.executionPolicy?.pageTaskGateCanAutoRecover === true,
      pageTaskGateContractSnapshotId:
        brief.executionPolicy?.pageTaskGateContractSnapshotId || '',
      mustAutoEnsureOrStopWhenIntegrationMissing: Boolean(
        brief.executionPolicy?.mustAutoEnsureOrStopWhenIntegrationMissing
      ),
      mustStopWhenPageTaskGateClosed: Boolean(
        brief.executionPolicy?.mustStopWhenPageTaskGateClosed
      ),
      forbidHostCompatibilityFallbackWhenIntegrationMissing: Boolean(
        brief.executionPolicy?.forbidHostCompatibilityFallbackWhenIntegrationMissing
      ),
      forbiddenIntegrationFallbacks: brief.executionPolicy?.forbiddenIntegrationFallbacks || [],
    },
    ensureSummary,
    inputMode: brief.inputMode,
    confirmedDesignRestoreInput: brief.confirmedDesignRestoreInput ?? null,
    confirmationPolicy: {
      mode: brief.executionPolicy?.confirmationMode || '',
      requiresChatConfirmation: Boolean(brief.executionPolicy?.requiresChatConfirmation),
      confirmedPageFamily: brief.executionPolicy?.confirmedPageFamily || '',
      confirmedPageType: brief.executionPolicy?.confirmedPageType || '',
      finalPromptAvailable: Boolean(brief.executionPolicy?.finalPromptAvailable),
    },
    pageFamilyContract: brief.pageGenerationDecision.pageFamilyContract ?? {},
    migrationInvariantContract: brief.migrationInvariantContract ?? null,
    analyticsRefactorContract: brief.analyticsRefactorContract ?? null,
    analyticsRefactorViewModel: brief.pageGenerationDecision.analyticsRefactorViewModel ?? null,
    resolvedHostGenerationContract:
      brief.pageGenerationDecision.resolvedHostGenerationContract ?? {},
    fieldMapProviderCompatibility:
      brief.pageGenerationDecision.fieldMapProviderCompatibility ?? {},
    copyMode: brief.pageGenerationDecision.copyMode,
    generationPath: brief.pageGenerationDecision.generationPath,
    contentGenerationMode: brief.pageGenerationDecision.workflow.contentGenerationMode,
    templateUsageMode: brief.pageGenerationDecision.workflow.templateUsageMode,
    workflow: brief.pageGenerationDecision.workflow,
    pageType: brief.pageType,
    projectHostContract: refreshedProjectHostContractSummary,
    outputTargetEvidence: brief.outputTargetEvidence || null,
    primaryPageLink: primaryPageLinkDecision.primaryPageLink,
    primaryBusinessPageLink: primaryPageLinkDecision.primaryBusinessPageLink,
    linkSource: primaryPageLinkDecision.linkSource,
    primaryPageLinkBlockedReason: primaryPageLinkDecision.primaryPageLinkBlockedReason,
    primaryPageLinkRuntimeReadiness: deriveCamoraPrimaryPageLinkRuntimeReadiness({
      primaryPageLinkDecision,
      camoraRuntimeClosure,
    }),
    primaryPageLinkCaveat: deriveCamoraPrimaryPageLinkCaveat({
      primaryPageLinkDecision,
      camoraRuntimeClosure,
    }),
    sourceTemplatePath: brief.sources.preferredTemplatePath,
    sourceStylePath: brief.sources.preferredStylePath,
    navigationMountAction: brief.pageGenerationDecision.navigationMountAction,
    parentFlowPatchStatus: parentFlowPatchPlan.parentFlowPatchStatus,
    manualPatchSuggestion: parentFlowPatchPlan.manualPatchSuggestion,
    backNavigationStrategy: parentFlowPatchPlan.backNavigationStrategy,
    hostExecutionAdapter: brief.pageGenerationDecision.hostExecutionAdapter ?? null,
    styleDeliveryDecision,
    mfPublishEntryPath: normalizeRelativePath(managedMfPublishEntryPlan.managedMfPublishEntry?.path || ''),
    mfPublishEntryManaged: managedMfPublishEntryPlan.managedMfPublishEntry?.required === true,
    mfPublishEntryShellStyles:
      managedMfPublishEntryPlan.managedMfPublishEntry?.importsShellStyles === true,
    mfExposeTargetPath: normalizeRelativePath(mfExposeWiringState?.mfExposeTargetPath || ''),
    mfExposeUsesManagedPublishEntry: mfExposeWiringState?.mfExposeUsesManagedPublishEntry === true,
    managedMfPublishEntry: managedMfPublishEntryPlan.managedMfPublishEntry,
    navigationExecution: {
      blocked: brief.executionPolicy?.navigationExecutionBlocked === true,
      status: brief.executionPolicy?.navigationExecutionStatus || 'ready',
      blockedBy: brief.executionPolicy?.navigationExecutionBlockedBy || [],
      reason: brief.executionPolicy?.navigationExecutionReason || '',
      requiresManualNavigationRegistration:
        brief.executionPolicy?.requiresManualNavigationRegistration === true,
    },
    formalHostShell: {
      status: brief.pageGenerationDecision.hostShellDecision?.status || 'no-formal-host-shell-change',
      materializationStrategy: brief.pageGenerationDecision.hostShellDecision?.materializationStrategy || 'none',
      targetShellPath: brief.pageGenerationDecision.hostShellDecision?.targetShellPath || '',
      targetRegistryPath: brief.pageGenerationDecision.hostShellDecision?.targetRegistryPath || '',
      files: [...formalHostShellFiles, ...formalNavigationEntryFiles].map((file) => ({
        sourcePath: file.sourcePath,
        destPath: file.destPath,
        artifactClass: file.artifactClass || '',
      })),
    },
    destDir,
    generatedAt,
    plannedFileCount,
    writtenFileCount,
    skippedIdenticalFileCount,
    managedRuntimeFilesPlanned:
      managedLocalRuntimeDistribution.plannedFiles.length,
    managedRuntimeFilesWritten:
      managedLocalRuntimeDistribution.writableFiles.length,
    managedRuntimeFilesSkippedAsIdentical:
      managedLocalRuntimeDistribution.skippedIdenticalFiles.length,
    managedRuntimeWrittenFileCount,
    files: plannedFiles.map((file) => ({
      sourcePath: file.sourcePath,
      destPath: file.destPath,
      artifactClass: file.artifactClass || '',
    })),
    generatedOutputSanity: {
      ok: finalGeneratedOutputViolations.length === 0,
      violations: finalGeneratedOutputViolations,
    },
    preWriteDecisionSanity: {
      ok: preWriteDecisionViolations.length === 0,
      violations: preWriteDecisionViolations,
      coverageDecision: brief.pageGenerationDecision.coverageDecision,
      pageAdjustmentDecision: brief.pageGenerationDecision.pageAdjustmentDecision,
      pageAdjustmentExecution: brief.pageGenerationDecision.pageAdjustmentExecution,
      navigationMountAction: brief.pageGenerationDecision.navigationMountAction,
      hostImportPolicy: brief.pageGenerationDecision.hostImportPolicy,
      resolvedHostGenerationContract: brief.pageGenerationDecision.resolvedHostGenerationContract,
    },
    dependencyIsolation: {
      status: dependencyIsolationReport.status,
      checkedPackages: dependencyIsolationReport.checks?.find((check) => check.id === 'hiui-runtime-graph-uses-hiui5-only')
        ?.evidence?.validated?.length,
    },
    businessSlotSemanticReadiness: businessSlotSemanticReadiness || {},
    businessPlaceholderSignals,
    artifactSummary,
    plannedArtifactSummary,
    artifactWritePlan,
    projectCheckSelection,
    readinessSummary,
    projectHostContractSettlement: {
      updated: settledProjectHostContractResult.updated === true,
      reason: settledProjectHostContractResult.reason || '',
    },
    pageTaskGateRefresh,
    nextRequiredActions: [
      ...camoraNextRequiredActions,
      ...(parentFlowPatchPlan.manualPatchSuggestion
        ? [parentFlowPatchPlan.manualPatchSuggestion.summary]
        : []),
      ...(hasPageAdjustmentContract(brief)
        ? [
            'Review the generated local adjustment region against the selected execution anchor and confirm it still matches the requested business intent.',
            'Verify the generated local adjustment still preserves the base shell, forbidden regions, and the original primary reading flow.',
            'If the requested change exceeds the supported controlled region, stop and upgrade the request instead of rewriting the page shell.',
          ]
        : usesSeparateWorkflow(brief)
        ? [
            ...(brief.analyticsRefactorContract
              ? [
                  `Preserve the legacy analytics workspace invariant: ${brief.analyticsRefactorContract.workspaceInvariant}.`,
                  `Preserve analytics interaction semantics: ${brief.analyticsRefactorContract.preservedInteractions.join('；')}.`,
                ]
              : []),
            'Verify the generated dashboard control strip stays in queryFields/searchPlaceholder and remains separate from detail-table filters.',
            'Verify the generated content workspace follows the data-visualization Golden Path: summaryMetrics, chartCards, optional detailRows when the business really needs a tail table, and one whiteBody reading flow.',
            'Verify chartCards already express the desktop slot plan with featured/normal cards and no lone last-row chart.',
            'Verify chart theme usage comes from local chart-theme.ts and hiuiChartTokens instead of the chart library default skin.',
            'Verify each chart card still uses a fixed header and a stretchable chart body.',
            'Keep only header and whiteBody as fixed shell regions; do not copy the whole example page into business code.',
            'When a chart pattern already exists in the official template, copy that chart block selectively and then replace its business content.',
          ]
        : ['Replace remaining business slots with real fields, requests, and copy']),
      ...(brief.executionPolicy.navigationBlocked
        ? [
            brief.executionPolicy.navigationBlockReason,
            'Specify the exact existing business navigation registry or target route entry before trying to connect this page.',
          ]
        : brief.executionPolicy?.requiresManualNavigationRegistration
          ? buildManualNavigationFollowUpActions(brief)
        : brief.pageGenerationDecision.navigationDecision.shouldAppendToExistingNavigation
          ? [
              `Review the updated formal navigation registry ${brief.pageGenerationDecision.navigationMountAction.targetRegistryPath} and confirm the generated page route/title were appended with the expected menu grouping.`,
            ]
        : brief.pageGenerationDecision.navigationDecision.shouldAutoCreateFormalBusinessShell
          ? [
              `Review the patched real app entry ${brief.pageGenerationDecision.navigationMountAction.appEntryPath} and confirm it now mounts the generated formal business shell ${brief.pageGenerationDecision.hostShellDecision.targetShellPath} and registry ${brief.pageGenerationDecision.hostShellDecision.targetRegistryPath}.`,
              `Keep ${brief.pageGenerationDecision.hostShellDecision.targetShellPath} as a thin wrapper over the local managed host core ${brief.pageGenerationDecision.hostShellDecision.migrationTargetCorePath || `${path.posix.dirname(brief.pageGenerationDecision.hostShellDecision.targetShellPath || 'src/business-shell/app-frame.tsx')}/app-frame-core.tsx`} and aligned with ${brief.pageGenerationDecision.hostShellDecision.baseHostTemplatePath}; keep the managed host import inside that local app-frame-core, and adjust menus and default shellOptions through ${brief.pageGenerationDecision.hostShellDecision.targetRegistryPath} instead of rewriting the host shell.`,
            ]
            : ['Connect route/menu/expose only after the target project entry is confirmed']),
      'Run npm run typical-page:preflight -- --json',
      'Run the smallest target-project build or type check available',
    ],
  }
  if (camoraRuntimeClosure?.applicable) {
    result.camoraRuntimeClosure = camoraRuntimeClosure
  }

  if (!options.dryRun) {
    const reportArtifacts = buildGenerationReportArtifactPaths({
      skillRoot,
      pageTypeId: brief.pageType.id,
      generatedAt,
    })
    result.reportSchema = PAGE_GENERATION_REPORT_SCHEMA
    result.reportPath = reportArtifacts.versionedMarkdownPath
    result.latestReportPath = reportArtifacts.latestMarkdownPath
    result.latestReportJsonPath = reportArtifacts.latestJsonPath
    result.reportArtifacts = reportArtifacts
    await fs.mkdir(path.dirname(reportArtifacts.versionedMarkdownPath), { recursive: true })
    const reportMarkdown = renderGenerationReport(result, brief)
    const reportJson = `${JSON.stringify(result, null, 2)}\n`
    await fs.writeFile(reportArtifacts.versionedMarkdownPath, reportMarkdown, 'utf8')
    await fs.writeFile(reportArtifacts.versionedJsonPath, reportJson, 'utf8')
    await fs.writeFile(reportArtifacts.latestMarkdownPath, reportMarkdown, 'utf8')
    await fs.writeFile(reportArtifacts.latestJsonPath, reportJson, 'utf8')
  } else {
    result.reportPath = ''
    result.latestReportPath = ''
    result.latestReportJsonPath = ''
    result.reportArtifacts = null
  }

  result = await finalizeSessionSuccess(result, {
    branch: 'page-type',
  })

  if (emitOutput) {
    if (options.json) {
      console.log(JSON.stringify(result, null, 2))
      return result
    }

    console.log(
      `${options.dryRun ? 'Planned' : 'Generated'} ${plannedFiles.length} file(s) from ${brief.pageType.label}`
    )
    for (const file of result.files) {
      console.log(`- ${path.relative(targetRoot, file.destPath)}`)
    }
    if (result.primaryPageLink) {
      console.log(`Page link: ${result.primaryPageLink}`)
    } else if (result.primaryPageLinkBlockedReason) {
      console.log(`Page link unavailable: ${result.primaryPageLinkBlockedReason}`)
    }
    if (result.camoraRuntimeClosure?.applicable) {
      console.log(
        `Camora runtime: ${result.camoraRuntimeClosure.status} — ${result.camoraRuntimeClosure.reason}`
      )
    }
  }

    return result
  } catch (error) {
    if (error instanceof BlockedGenerationError && error.payload && sessionTraceContext) {
      const blockedPayload = error.payload
      const finishedAtMs = Date.now()
      blockedPayload.sessionTrace = buildPageGenerationSessionRef(sessionTraceContext, {
        currentStage: 'blocked',
        currentStatus: 'blocked',
      })
      await recordPageGenerationSessionStage({
        sessionContext: sessionTraceContext,
        brief,
        options,
        source: 'generate-page-from-brief',
        stage: 'blocked',
        status: 'blocked',
        startedAtMs: scriptStartedAtMs,
        finishedAtMs,
        details: {
          stageId: 'generate-page-from-brief-blocked',
          blockedBy: blockedPayload.blockedBy || [],
          blockingReason: blockedPayload.reason || error.message,
          nextCommand:
            blockedPayload.nextCommand ||
            blockedPayload.pageTaskGate?.nextCommand ||
            blockedPayload.pageTypeCapability?.nextCommand ||
            '',
          requiredManualActions: blockedPayload.requiredManualActions || [],
          mutatedFiles: Array.isArray(blockedPayload?.files)
            ? blockedPayload.files.map((file) => normalizeString(file?.destPath || '')).filter(Boolean)
            : [],
          evidenceFiles: [
            normalizeString(blockedPayload?.projectHostContract?.path || ''),
            normalizeString(blockedPayload?.pageTypeCapability?.sourcePath || ''),
            normalizeString(blockedPayload?.outputTargetEvidence?.selectedEntryPath || ''),
          ].filter(Boolean),
          ...buildPageRelationStageDetails({
            brief,
            resultPayload: blockedPayload,
          }),
        },
        resultPayload: blockedPayload,
      })
    }
    throw error
  }
}

function buildGenerationTelemetryMetadata({ options, result = null, blockedPayload = null, defaultStatus = '' }) {
  const metadata = {
    dry_run: options.dryRun === true,
  }

  const resolvedMode = String(
    result?.mode || blockedPayload?.mode || blockedPayload?.requestedMode || options.mode || ''
  ).trim()
  if (resolvedMode) {
    metadata.mode = resolvedMode
  }

  const resolvedPageType = String(
    result?.pageType?.id ||
      blockedPayload?.pageType?.id ||
      (blockedPayload?.pageSelector?.kind === 'page-type' ? blockedPayload.pageSelector.id : '') ||
      options.pageType ||
      ''
  ).trim()
  if (resolvedPageType) {
    metadata.page_type = resolvedPageType
  }

  const resolvedPageFamily = String(
    (result?.pageSelector?.kind === 'page-family' ? result.pageSelector.id : '') ||
      (blockedPayload?.pageSelector?.kind === 'page-family' ? blockedPayload.pageSelector.id : '') ||
      options.pageFamily ||
      ''
  ).trim()
  if (resolvedPageFamily) {
    metadata.page_family = resolvedPageFamily
  }

  const resolvedInputMode = String(
    (typeof result?.inputMode === 'string' ? result.inputMode : result?.inputMode?.id) ||
      blockedPayload?.inputMode ||
      options.inputMode ||
      ''
  ).trim()
  if (resolvedInputMode) {
    metadata.input_mode = resolvedInputMode
  }

  const technicalPassStatus = String(result?.technicalPass?.status || '').trim()
  if (technicalPassStatus) {
    metadata.technical_pass_status = technicalPassStatus
  }

  const engineeringPassStatus = String(result?.engineeringPass?.status || '').trim()
  if (engineeringPassStatus) {
    metadata.engineering_pass_status = engineeringPassStatus
  }

  const businessPassStatus = String(result?.businessPass?.status || '').trim()
  if (businessPassStatus) {
    metadata.business_pass_status = businessPassStatus
  }

  const businessSemanticPassStatus = String(result?.businessSemanticPass?.status || '').trim()
  if (businessSemanticPassStatus) {
    metadata.business_semantic_pass_status = businessSemanticPassStatus
  }

  const resolvedStatus = String(result?.status || blockedPayload?.status || defaultStatus || '').trim()
  if (resolvedStatus) {
    metadata.result_status = resolvedStatus
  }

  const blockedBy = String(blockedPayload?.blockedBy || '').trim()
  if (blockedBy) {
    metadata.blocked_by = blockedBy
  }

  return metadata
}

async function runCli() {
  const rawArgs = process.argv.slice(2)
  const options = parseArgs(rawArgs)
  let usageSession = null
  let reportMode = options.mode || 'auto'
  let success = false
  let telemetryMetadata = buildGenerationTelemetryMetadata({
    options,
    defaultStatus: 'started',
  })

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
    const targetRoot = invocation.targetRoot
    const scriptPath = fileURLToPath(import.meta.url)
    const runtimeReset = await ensureProjectNodeRuntime({
      targetRoot,
      scriptPath,
      scriptArgs: rawArgs,
      preferLoginShell: true,
    })
    if (runtimeReset.reexecuted) {
      process.exitCode = runtimeReset.exitCode ?? 0
      return
    }
    reportMode = invocation.brief?.mode || reportMode
    usageSession = await startUsageSession({
      prompt: options.telemetryPrompt,
      promptFile: options.telemetryPromptFile,
      reportMode,
      source: 'generate-page-from-brief',
      targetRoot,
    })
    const result = await runGeneratePageFromBrief(options, {
      targetRoot,
      preloadedBrief: invocation.brief,
      emitOutput: true,
    })
    reportMode = String(result?.mode || reportMode || '').trim() || reportMode
    telemetryMetadata = buildGenerationTelemetryMetadata({
      options,
      result,
    })
    success = true
  } catch (error) {
    if (error instanceof BlockedGenerationError) {
      reportMode = String(error.payload?.mode || reportMode || '').trim() || reportMode
      telemetryMetadata = buildGenerationTelemetryMetadata({
        options,
        blockedPayload: error.payload,
      })
      if (options.json && error.payload) {
        console.error(error.message)
        console.log(JSON.stringify(error.payload, null, 2))
      } else {
        console.error(error.message)
      }
      process.exitCode = 1
      return
    }
    telemetryMetadata = buildGenerationTelemetryMetadata({
      options,
      defaultStatus: 'error',
    })
    throw error
  } finally {
    await finalizeUsageSession(usageSession, {
      reportMode,
      success,
      metadata: telemetryMetadata,
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
