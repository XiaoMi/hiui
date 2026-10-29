#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { readReadyGenerationBriefFile } from './lib/brief-file.mjs'
import { loadGenerationBrief } from './lib/load-generation-brief.mjs'
import {
  isDesignRestoreInputMode,
  normalizeConfirmedDesignRestoreInput,
  validateConfirmedDesignRestoreInput,
} from './lib/design-restore-intake.mjs'
import { buildCamoraRuntimeClosure } from './lib/camora-runtime-closure.mjs'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import {
  collectCodeRegistrationEvidence,
  resolveExpectedExposeTarget,
} from './lib/code-registration-evidence.mjs'
import { resolveJsonOrPathArg } from './lib/json-input-arg.mjs'
import { maybeResolveRelatedPagePathFromPrompt } from './lib/related-page-intake.mjs'
import {
  readPersistedPageGenerationMeta,
  resolveEffectivePageRelationDecision,
  resolveEffectiveRelatedPagePath,
} from './lib/page-relation-decision.mjs'
import { verifyStyleDeliveryDecision } from './lib/style-delivery-decision.mjs'
import { ensureProjectNodeRuntime } from './lib/project-node-launcher.mjs'
import { readRemoteRuntimeSourceStatus } from './lib/remote-runtime-source-status.mjs'
import { getContextScriptPath } from './lib/skill-identity.mjs'

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
    line: '',
    dest: '',
    relatedPagePath: '',
    title: '',
    routePath: '',
    exposeName: '',
    expectedExposeTarget: '',
    entryFile: '',
    confirmedGenerationInputJson: '',
    confirmedDesignRestoreInputJson: '',
    nonTypicalConversationOutputJson: '',
    legacyReconstructionInputJson: '',
    migrationInvariantContractJson: '',
    analyticsRefactorContractJson: '',
    detailSectionsJson: '',
    telemetryPrompt: '',
    telemetryPromptFile: '',
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
    if (arg === '--detail-sections-json') {
      options.detailSectionsJson = readRequiredArg(argv, i, arg)
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
    if (arg === '--expected-expose-target') {
      options.expectedExposeTarget = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--entry-file') {
      options.entryFile = readRequiredArg(argv, i, arg)
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
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node ${getContextScriptPath('integration-preflight.mjs')} [--page-type <id> | --page-family <id>] --dest <dir> --title <title> [--related-page-path <relative-file>] [--detail-sections-json <json-or-path>] [--input-mode <page-prompt|prototype-screenshot|figma-design-restore|legacy-system-reconstruction>] [--route-path <path>] [--expose-name <Name>] [--expected-expose-target <relative-module-path>] [--entry-file <relative-file>] [--confirmed-generation-input-json <json-or-path>] [--confirmed-design-restore-input-json <json-or-path>] [--non-typical-conversation-output-json <json-or-path>] [--legacy-reconstruction-input-json <json-or-path>] [--migration-invariant-contract-json <json-or-path>] [--analytics-refactor-contract-json <json-or-path>] [--brief-file <file>] [--telemetry-prompt <text>] [--telemetry-prompt-file <path>] [--json]

Use --brief-file <file> to consume a previously materialized JSON brief from generation-brief.mjs. When --brief-file is present, page selector, dest, title, route-path, and other brief-shaping flags are ignored, and the file becomes the source of truth for preflight.`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, 'utf8')
  } catch {
    return ''
  }
}

async function readTelemetryPromptText(options) {
  if (options.telemetryPrompt) return options.telemetryPrompt
  if (options.telemetryPromptFile) {
    return readTextIfExists(path.resolve(options.telemetryPromptFile))
  }
  return options.line || ''
}

function ensureProjectRelative(targetRoot, relativePath, optionName) {
  if (!relativePath) return ''
  if (path.isAbsolute(relativePath)) throw new Error(`${optionName} must be project-relative`)
  const absolutePath = path.resolve(targetRoot, relativePath)
  if (!absolutePath.startsWith(`${targetRoot}${path.sep}`)) {
    throw new Error(`${optionName} escapes target root: ${relativePath}`)
  }
  return absolutePath
}

function toExposeName(value) {
  if (!value) return ''
  return value.startsWith('./') ? value : `./${value}`
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeRelativePath(value) {
  return normalizeString(value)
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
}

function toExpectedExposeTarget(dest) {
  if (!dest) return ''
  return `./${dest.replace(/^\.\//, '').replace(/\/index$/, '')}`
}

function normalizeExpectedExposeTarget(value = '') {
  const normalizedValue = String(value || '').trim()
  if (!normalizedValue) return ''
  const withoutExtension = normalizedValue
    .replace(/^\.\//, '')
    .replace(/\.(?:tsx|ts|jsx|js|mjs|cjs)$/i, '')
    .replace(/\/index$/i, '')
  return withoutExtension ? `./${withoutExtension}` : ''
}

function shouldSkipBusinessEntryEvidenceForDirectMfExpose({
  brief,
  expectedExposeName = '',
}) {
  const pageRelationKind = String(
    brief?.pageGenerationDecision?.pageRelationDecision?.kind || ''
  ).trim()
  if (pageRelationKind === 'same-module-subview') {
    return false
  }

  if (!expectedExposeName) return false

  const pageGenerationDecision = brief?.pageGenerationDecision || {}
  const navigationMountAction = pageGenerationDecision.navigationMountAction || {}
  const hostExecutionAdapter = pageGenerationDecision.hostExecutionAdapter || {}
  const publishEntry = hostExecutionAdapter?.publishEntry || {}

  return (
    navigationMountAction.action === 'materialize-mf-publish-entry' ||
    navigationMountAction.targetEntryKind === 'module-federation-exposes' ||
    hostExecutionAdapter?.kind === 'mf-direct-expose-legacy' ||
    publishEntry?.publishMechanism === 'module-federation-direct-expose' ||
    publishEntry?.registrationMode === 'manual-repoint-mf-expose'
  )
}

function decision(ok, reason, evidence = {}) {
  return { ok, reason, evidence }
}

function normalizeRuntimeVerificationStatus(value) {
  const normalizedValue = String(value || '').trim()
  if (normalizedValue === 'pass' || normalizedValue === 'fail') return normalizedValue
  if (normalizedValue === 'verified') return 'pass'
  if (normalizedValue === 'not-applicable') return 'not-applicable'
  return 'not-run'
}

function buildLegacyRuntimeSourceVerifiedCheck(runtimeVerificationCheck) {
  return {
    ok: runtimeVerificationCheck.ok,
    reason: runtimeVerificationCheck.reason,
    evidence: {
      ...runtimeVerificationCheck.evidence,
      derivedFrom: 'checks.runtimeVerification',
    },
  }
}

function isThinReExportSource(source = '') {
  const lines = String(source || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return false

  return lines.every((line) => /^export\s+\{[\s\S]*\}\s+from\s+['"][^'"]+['"];?$/u.test(line))
}

async function resolveRelativeSourceFile(targetRoot, importerPath, specifier) {
  const importerDir = path.posix.dirname(normalizeRelativePath(importerPath))
  const resolvedBase = normalizeRelativePath(path.posix.join(importerDir, specifier))
  if (!resolvedBase) return ''

  const candidates = [
    resolvedBase,
    `${resolvedBase}.tsx`,
    `${resolvedBase}.jsx`,
    `${resolvedBase}.ts`,
    `${resolvedBase}.js`,
    `${resolvedBase}/index.tsx`,
    `${resolvedBase}/index.jsx`,
    `${resolvedBase}/index.ts`,
    `${resolvedBase}/index.js`,
  ]

  for (const relativePath of candidates) {
    if (await readTextIfExists(path.join(targetRoot, relativePath))) {
      return normalizeRelativePath(relativePath)
    }
  }

  return normalizeRelativePath(resolvedBase)
}

async function inspectContentReadiness({
  targetRoot,
  dest = '',
  persistedMeta = null,
}) {
  const persistedDeliveryReadiness = normalizeString(persistedMeta?.deliveryReadiness)
  const persistedContentReadiness = normalizeString(persistedMeta?.contentReadiness)
  const fallbackIndexPath = normalizeRelativePath(path.posix.join(dest || '', 'index.tsx'))
  let contentSourcePath =
    normalizeRelativePath(persistedMeta?.contentSourcePath || '') || fallbackIndexPath
  let contentReadiness = persistedContentReadiness

  if (!contentSourcePath) {
    return {
      deliveryReadiness: persistedDeliveryReadiness || 'blocked',
      contentReadiness: contentReadiness || 'blocked',
      contentSourcePath: '',
      reason: 'No page content source path could be determined.',
    }
  }

  const source = await readTextIfExists(path.join(targetRoot, contentSourcePath))
  if (!source) {
    return {
      deliveryReadiness: persistedDeliveryReadiness || 'blocked',
      contentReadiness: 'blocked',
      contentSourcePath,
      reason: 'Resolved page content source file is missing.',
    }
  }

  if (isThinReExportSource(source)) {
    const specifier = normalizeString(source.match(/from\s+['"]([^'"]+)['"]/u)?.[1])
    if (specifier.startsWith('.')) {
      contentSourcePath = await resolveRelativeSourceFile(targetRoot, contentSourcePath, specifier)
    }
    contentReadiness = 'legacy'
  } else if (
    /local-managed-runtime|hiui5-page-header|TypicalPageFieldMapProvider|ProListPageProvider/u.test(
      source
    )
  ) {
    contentReadiness = 'ready'
  } else if (!contentReadiness) {
    contentReadiness = 'legacy'
  }

  return {
    deliveryReadiness: persistedDeliveryReadiness || '',
    contentReadiness,
    contentSourcePath,
    reason:
      contentReadiness === 'ready'
        ? 'Page content source already points at a managed generated page implementation.'
        : contentReadiness === 'legacy'
          ? 'Runtime entry still resolves to a legacy page implementation path.'
          : 'Page content source is not ready.',
  }
}

function getPersistedRuntimeSourceStatusReuse({
  runtimeSourceStatus = null,
  expectedExposeName = '',
} = {}) {
  const normalizedExpectedExposeName = toExposeName(expectedExposeName)
  const normalizedPersistedExposeName = toExposeName(runtimeSourceStatus?.exposeName || '')

  if (!runtimeSourceStatus) {
    return {
      reusable: true,
      reason: '',
      persistedExposeName: normalizedPersistedExposeName,
    }
  }

  if (!normalizedExpectedExposeName) {
    return {
      reusable: true,
      reason: '',
      persistedExposeName: normalizedPersistedExposeName,
    }
  }

  if (normalizedPersistedExposeName && normalizedPersistedExposeName === normalizedExpectedExposeName) {
    return {
      reusable: true,
      reason: '',
      persistedExposeName: normalizedPersistedExposeName,
    }
  }

  return {
    reusable: false,
    reason: normalizedPersistedExposeName
      ? `Persisted runtime verification belongs to ${normalizedPersistedExposeName}, not ${normalizedExpectedExposeName}; rerun runtime verification for the current expose before treating the Camora/proxy runtime as ready.`
      : `Persisted runtime verification does not record an exposeName, so it cannot prove ${normalizedExpectedExposeName}; rerun runtime verification for the current expose.`,
    persistedExposeName: normalizedPersistedExposeName,
  }
}

function buildRuntimeVerificationCheck({
  remoteDebugContract = {},
  runtimeSourceStatus = null,
  codeRegistrationEvidence = {},
  routePath = '',
  expectedExposeName = '',
  expectedExposeTarget = '',
  pageRelationDecision = null,
  navigationMountAction = null,
}) {
  if (String(pageRelationDecision?.kind || '').trim() === 'same-module-subview') {
    return decision(
      true,
      'runtime source verification is not required for a same-module-subview page',
      {
        status: 'not-applicable',
        pageRelationKind: 'same-module-subview',
      }
    )
  }

  if (remoteDebugContract?.enabled !== true) {
    return decision(true, 'runtime source verification is not required for this host profile', {
      status: 'not-applicable',
    })
  }

  const mode = String(remoteDebugContract.mode || 'remote-entry-debug').trim()
  const localRuntimeSources = Array.isArray(remoteDebugContract.localRuntimeSources)
    ? remoteDebugContract.localRuntimeSources
    : []
  const camoraProxyRules = Array.isArray(remoteDebugContract.camoraProxyRules)
    ? remoteDebugContract.camoraProxyRules
    : []
  const verifyCommand = expectedExposeName
    ? `node ${getContextScriptPath('verify-remote-runtime-source.mjs')} --expose-name ${expectedExposeName.replace(/^\.\//, '')}`
    : ''
  const persistedStatusReuse = getPersistedRuntimeSourceStatusReuse({
    runtimeSourceStatus,
    expectedExposeName,
  })
  const effectiveRuntimeSourceStatus = persistedStatusReuse.reusable ? runtimeSourceStatus : null
  const persistedRuntimeStatus = persistedStatusReuse.reusable
    ? normalizeRuntimeVerificationStatus(
        effectiveRuntimeSourceStatus?.status || remoteDebugContract.runtimeSourceStatus
      )
    : 'not-run'
  const camoraRuntimeClosure = buildCamoraRuntimeClosure({
    remoteDebugContract,
    runtimeSourceStatus: effectiveRuntimeSourceStatus,
    codeRegistrationEvidence,
    expectedExposeName,
    verifyCommand,
  })

  if (persistedRuntimeStatus === 'pass') {
    return decision(true, 'live runtime source verification passed for the current remote debug contract', {
      status: 'pass',
      mode,
      routePath,
      expectedExposeName,
      expectedExposeTarget,
      remoteEntryUrl: effectiveRuntimeSourceStatus?.remoteEntryUrl || '',
      localRuntimeSources,
      camoraProxyRules,
      remoteEntryFilenames: remoteDebugContract.remoteEntryFilenames || [],
      verificationHints: remoteDebugContract.verificationHints || [],
      readmePath: remoteDebugContract.readmePath || '',
      verifyCommand,
      checks: effectiveRuntimeSourceStatus?.checks || {},
      observationKind: effectiveRuntimeSourceStatus?.observation?.kind || '',
      updatedAt: effectiveRuntimeSourceStatus?.updatedAt || '',
      updatedBy: effectiveRuntimeSourceStatus?.updatedBy || '',
      persistedRuntimeStatusReuse: persistedStatusReuse,
      camoraRuntimeClosure,
    })
  }

  if (persistedRuntimeStatus === 'fail') {
    const managedPublishSignatureMissing =
      String(effectiveRuntimeSourceStatus?.observation?.kind || '').trim() ===
        'remote-entry-reachable-but-managed-publish-signature-missing' &&
      String(navigationMountAction?.action || '').trim() === 'materialize-mf-publish-entry'
    const failedCheckDetail = Object.values(effectiveRuntimeSourceStatus?.checks || {}).find(
      (check) => check?.status === 'fail' && String(check.detail || '').trim()
    )?.detail
    const failureReason =
      managedPublishSignatureMissing
        ? 'live remoteEntry.js already exposes the requested page, but the managed mf-entry publish signature is still missing; treat this as runtime pending until the remote package actually switches to the managed publish entry.'
        : camoraRuntimeClosure?.applicable && camoraRuntimeClosure?.reason
        ? camoraRuntimeClosure.reason
        : failedCheckDetail ||
          `live runtime source verification failed for ${mode}; the active remoteEntry.js still does not prove the requested expose`

    return decision(
      false,
      failureReason,
      {
        status: 'fail',
        mode,
        routePath,
        expectedExposeName,
        expectedExposeTarget,
        remoteEntryUrl: effectiveRuntimeSourceStatus?.remoteEntryUrl || '',
        localRuntimeSources,
        camoraProxyRules,
        remoteEntryFilenames: remoteDebugContract.remoteEntryFilenames || [],
        verificationHints: remoteDebugContract.verificationHints || [],
        readmePath: remoteDebugContract.readmePath || '',
        verifyCommand,
        checks: effectiveRuntimeSourceStatus?.checks || {},
        observationKind: effectiveRuntimeSourceStatus?.observation?.kind || '',
        pendingInsteadOfBlocked: managedPublishSignatureMissing,
        updatedAt: effectiveRuntimeSourceStatus?.updatedAt || '',
        updatedBy: effectiveRuntimeSourceStatus?.updatedBy || '',
        persistedRuntimeStatusReuse: persistedStatusReuse,
        camoraRuntimeClosure,
      }
    )
  }

  return decision(
    false,
    persistedStatusReuse.reusable
      ? localRuntimeSources.length > 0
        ? `Detected ${mode} remote debug contract, but the live runtime source is still unverified. Integration preflight only proves code registration here; run runtime verification to confirm the active Camora/proxy target is serving the current remoteEntry.js.`
        : `Detected ${mode} remote debug contract, but no local runtime source candidate has been verified yet.`
      : persistedStatusReuse.reason,
    {
      status: 'not-run',
      mode,
      routePath,
      expectedExposeName,
      expectedExposeTarget,
      remoteEntryUrl: effectiveRuntimeSourceStatus?.remoteEntryUrl || '',
      localRuntimeSources,
      camoraProxyRules,
      remoteEntryFilenames: remoteDebugContract.remoteEntryFilenames || [],
      verificationHints: remoteDebugContract.verificationHints || [],
      readmePath: remoteDebugContract.readmePath || '',
      verifyCommand,
      checks: effectiveRuntimeSourceStatus?.checks || {},
      observationKind: effectiveRuntimeSourceStatus?.observation?.kind || '',
      updatedAt: effectiveRuntimeSourceStatus?.updatedAt || '',
      updatedBy: effectiveRuntimeSourceStatus?.updatedBy || '',
      persistedRuntimeStatusReuse: persistedStatusReuse,
      camoraRuntimeClosure,
    }
  )
}

async function buildStyleDeliveryVerificationCheck({
  targetRoot,
  pageRelationDecision = null,
  hostExecutionAdapter = null,
  projectHostContract = null,
  persistedMeta = null,
} = {}) {
  const pageRelationKind = String(pageRelationDecision?.kind || '').trim()
  const hostExecutionAdapterKind = String(
    hostExecutionAdapter?.kind ||
      persistedMeta?.styleDeliveryDecision?.hostExecutionAdapterKind ||
      projectHostContract?.hostExecutionAdapterKind ||
      projectHostContract?.executionContractKind ||
      ''
  ).trim()
  const styleDeliveryDecision = persistedMeta?.styleDeliveryDecision || null

  if (
    pageRelationKind !== 'same-module-subview' ||
    hostExecutionAdapterKind !== 'mf-direct-expose-legacy'
  ) {
    return decision(
      true,
      'style delivery verification is only required for same-module-subview pages on the legacy direct-expose adapter',
      {
        status: 'not-applicable',
        pageRelationKind: pageRelationKind || 'undetermined',
        hostExecutionAdapterKind,
      }
    )
  }

  const verification = await verifyStyleDeliveryDecision({
    targetRoot,
    styleDeliveryDecision,
  })

  return decision(verification.ok, verification.reason, {
    ...(verification.evidence || {}),
    pageRelationKind,
    hostExecutionAdapterKind,
  })
}

function buildConfirmationPolicy({
  brief,
  confirmedGenerationInput,
  confirmedDesignRestoreInput,
}) {
  const confirmation = confirmedGenerationInput?.confirmation || {}
  const designRestoreConfirmation = confirmedDesignRestoreInput?.confirmation || {}
  const hasConfirmedInput = Boolean(confirmedGenerationInput)
  const hasConfirmedDesignRestoreInput = Boolean(confirmedDesignRestoreInput)

  return {
    mode:
      brief.executionPolicy?.confirmationMode ||
      (hasConfirmedInput || hasConfirmedDesignRestoreInput ? 'chat-confirmed' : ''),
    requiresChatConfirmation:
      Boolean(brief.executionPolicy?.requiresChatConfirmation) ||
      hasConfirmedInput ||
      hasConfirmedDesignRestoreInput,
    confirmedPageType:
      brief.executionPolicy?.confirmedPageType || confirmation.confirmedPageType || '',
    finalPromptAvailable:
      Boolean(brief.executionPolicy?.finalPromptAvailable) ||
      Boolean(confirmation.finalPrompt) ||
      Boolean(designRestoreConfirmation.finalPrompt),
  }
}

function validatePrototypeScreenshotInput({ pageTypeId, confirmedGenerationInput }) {
  if (!confirmedGenerationInput) {
    throw new Error('prototype-screenshot mode requires confirmedGenerationInput')
  }

  if (confirmedGenerationInput.inputMode !== 'prototype-screenshot') {
    throw new Error('Invalid confirmedGenerationInput: confirmedGenerationInput.inputMode must equal prototype-screenshot')
  }

  if (!confirmedGenerationInput.evidence?.screenshotPath) {
    throw new Error('Invalid confirmedGenerationInput: confirmedGenerationInput.evidence.screenshotPath is required')
  }

  if (!path.isAbsolute(confirmedGenerationInput.evidence.screenshotPath)) {
    throw new Error(
      'Invalid confirmedGenerationInput: confirmedGenerationInput.evidence.screenshotPath must be an absolute path'
    )
  }

  if (!confirmedGenerationInput.pageTypeRecommendation?.recommended) {
    throw new Error(
      'Invalid confirmedGenerationInput: confirmedGenerationInput.pageTypeRecommendation.recommended is required'
    )
  }

  if (!Array.isArray(confirmedGenerationInput.promptDraft?.observedLayout) || confirmedGenerationInput.promptDraft.observedLayout.length === 0) {
    throw new Error(
      'Invalid confirmedGenerationInput: confirmedGenerationInput.promptDraft.observedLayout must be a non-empty array'
    )
  }

  if (confirmedGenerationInput.confirmation?.confirmed !== true) {
    throw new Error(
      'Invalid confirmedGenerationInput: prototype-screenshot generation requires confirmedGenerationInput.confirmation.confirmed=true'
    )
  }

  if (!confirmedGenerationInput.confirmation?.confirmedPageType) {
    throw new Error(
      'Invalid confirmedGenerationInput: confirmedGenerationInput.confirmation.confirmedPageType is required'
    )
  }

  if (confirmedGenerationInput.confirmation.confirmedPageType !== pageTypeId) {
    throw new Error(
      `Invalid confirmedGenerationInput: confirmedGenerationInput.confirmation.confirmedPageType must equal pageTypeId ${pageTypeId}`
    )
  }

  if (!confirmedGenerationInput.confirmation?.finalPrompt) {
    throw new Error('Invalid confirmedGenerationInput: confirmedGenerationInput.confirmation.finalPrompt is required')
  }
}

function validateDesignRestoreInput({ inputMode, confirmedDesignRestoreInput }) {
  const normalizedInputMode = { id: inputMode }
  const normalizedConfirmedDesignRestoreInput = normalizeConfirmedDesignRestoreInput(
    confirmedDesignRestoreInput
  )
  const violations = validateConfirmedDesignRestoreInput({
    normalizedInputMode,
    confirmedDesignRestoreInput: normalizedConfirmedDesignRestoreInput,
  })

  if (violations.length > 0) {
    throw new Error(`Invalid confirmedDesignRestoreInput: ${violations.join('; ')}`)
  }
}

function validatePreflightInputs({
  options,
  confirmedGenerationInput,
  confirmedDesignRestoreInput,
}) {
  if (options.inputMode === 'prototype-screenshot') {
    if (options.pageFamily) {
      throw new Error(
        'prototype-screenshot integration-preflight currently requires --page-type instead of --page-family'
      )
    }
    validatePrototypeScreenshotInput({
      pageTypeId: options.pageType,
      confirmedGenerationInput,
    })
  } else if (confirmedGenerationInput) {
    throw new Error(
      'Invalid confirmedGenerationInput: confirmedGenerationInput is only allowed when inputMode=prototype-screenshot'
    )
  }

  if (isDesignRestoreInputMode(options.inputMode)) {
    validateDesignRestoreInput({
      inputMode: options.inputMode,
      confirmedDesignRestoreInput,
    })
  } else if (confirmedDesignRestoreInput) {
    throw new Error(
      'Invalid confirmedDesignRestoreInput: confirmedDesignRestoreInput is only allowed when inputMode is a design-restore mode'
    )
  }
}

function buildGateBlockedResult({
  brief,
  targetRoot,
  options,
  expectedExposeName,
  expectedExposeTarget,
  gateKind,
  confirmedGenerationInput,
  confirmedDesignRestoreInput,
}) {
  const confirmationPolicy = buildConfirmationPolicy({
    brief,
    confirmedGenerationInput,
    confirmedDesignRestoreInput,
  })
  const requestedBusiness = {
    ...brief.requestedBusiness,
    title:
      brief.requestedBusiness?.title ||
      confirmedGenerationInput?.promptDraft?.titleDraft ||
      confirmedDesignRestoreInput?.restoreDecisionPackage?.pageGoal ||
      '',
  }
  const routePath =
    options.routePath || (expectedExposeName ? `@common/${expectedExposeName.replace(/^\.\//, '')}` : '')
  const isIntegrationBlocked = gateKind === 'integration'
  const blockedReason = isIntegrationBlocked
    ? brief.integrationReadiness?.reason || 'Project integration is not ready.'
    : brief.pageTaskGate?.reason || 'Project page-task gate is not ready.'
  const nextCommand = isIntegrationBlocked
    ? brief.pageTaskGate?.nextCommand || ''
    : brief.executionPolicy?.pageTaskGateNextCommand || brief.pageTaskGate?.nextCommand || ''

  return {
    schema: 'hiui5-integration-preflight.v1',
    targetRoot,
    pageType: brief.pageType,
    inputMode: brief.inputMode,
    integrationReadiness: brief.integrationReadiness,
    pageTaskGate: brief.pageTaskGate,
    confirmationPolicy,
    requestedBusiness,
    generationPath: brief.pageGenerationDecision.generationPath,
    copyMode: brief.pageGenerationDecision.copyMode,
    routePath,
    expectedExposeName,
    expectedExposeTarget,
    status: 'blocked',
    checks: isIntegrationBlocked
      ? {
          integrationReadiness: decision(
            false,
            blockedReason,
            {
              status: brief.integrationReadiness?.status || '',
              nextCommand,
              allowedActions: brief.pageTaskGate?.allowedActions || [],
            }
          ),
        }
      : {
          pageTaskGate: decision(
            false,
            blockedReason,
            {
              status: brief.pageTaskGate?.status || '',
              nextCommand,
              allowedActions:
                brief.executionPolicy?.pageTaskAllowedActions ||
                brief.pageTaskGate?.allowedActions ||
                [],
            }
          ),
        },
    requiredManualActions: nextCommand
      ? [
          isIntegrationBlocked
            ? `Run ensure first, then rerun integration preflight: ${nextCommand}`
            : `Run typical-page:preflight first, then rerun integration preflight: ${nextCommand}`,
        ]
      : [
          isIntegrationBlocked
            ? 'Run ensure first, then rerun integration preflight.'
            : 'Run typical-page:preflight first, then rerun integration preflight.',
        ],
    riskPolicy: {
      doesNotPatchEntryFiles: true,
      browserValidationIsNotRequiredBeforeGeneration: true,
      mustNotGuessRouteMenuOrExpose: true,
    },
  }
}

async function runPreflight({
  options,
  targetRoot,
  skillRoot,
  preloadedBrief = null,
  confirmedGenerationInput,
  confirmedDesignRestoreInput,
  nonTypicalConversationOutput,
  legacyReconstructionInput,
  migrationInvariantContract,
  analyticsRefactorContract,
}) {
  validatePreflightInputs({
    options,
    confirmedGenerationInput,
    confirmedDesignRestoreInput,
  })

  const telemetryPromptText = await readTelemetryPromptText(options)
  const relatedPageResolution =
    options.relatedPagePath
      ? {
          relatedPagePath: options.relatedPagePath,
        }
      : await maybeResolveRelatedPagePathFromPrompt({
          targetRoot,
          prompt: telemetryPromptText,
          requestedTitle: options.title,
          routePath: options.routePath,
          dest: options.dest,
        })
  const effectiveRelatedPagePathForBrief =
    options.relatedPagePath || relatedPageResolution.relatedPagePath || ''

  const brief =
    preloadedBrief ||
    (await loadGenerationBrief({
      targetRoot,
      skillRoot,
      pageTypeId: options.pageType,
      pageFamilyId: options.pageFamily,
      mode: options.mode,
      inputMode: options.inputMode,
      line: options.line,
      dest: options.dest,
      relatedPagePath: effectiveRelatedPagePathForBrief,
      title: options.title,
      routePath: options.routePath,
      detailSections: options.detailSectionsJson,
      confirmedGenerationInput,
      confirmedDesignRestoreInput,
      nonTypicalConversationOutput,
      legacyReconstructionInput,
      migrationInvariantContract,
      analyticsRefactorContract,
    }))
  const effectiveDest = preloadedBrief
    ? String(brief?.requestedBusiness?.targetBusinessPath || '').trim()
    : options.dest
  const effectiveTitle = preloadedBrief
    ? String(brief?.requestedBusiness?.title || '').trim()
    : options.title
  const effectiveRoutePath = preloadedBrief
    ? String(brief?.requestedBusiness?.routePath || '').trim()
    : options.routePath
  const expectedExposeName = toExposeName(
    options.exposeName ||
      brief?.pageGenerationDecision?.hostExecutionAdapter?.publishEntry?.exposeName ||
      ''
  )
  const destDir = ensureProjectRelative(targetRoot, effectiveDest, '--dest')
  const entryFile = ensureProjectRelative(targetRoot, options.entryFile, '--entry-file')
  const pageGenerationDecision = brief.pageGenerationDecision || {}
  const navigationMountAction = pageGenerationDecision.navigationMountAction || {}
  const hostExecutionAdapter = pageGenerationDecision.hostExecutionAdapter || {}
  const persistedMetaState = await readPersistedPageGenerationMeta({
    targetRoot,
    dest: effectiveDest,
  })
  const pageRelationResolution = resolveEffectivePageRelationDecision({
    briefPageRelationDecision: pageGenerationDecision.pageRelationDecision || {},
    persistedPageRelationDecision: persistedMetaState.meta?.pageRelationDecision || {},
    routePath: effectiveRoutePath,
    exposeName: expectedExposeName,
    expectedExposeTarget: options.expectedExposeTarget,
  })
  const pageRelationDecision = pageRelationResolution.decision
  const isSameModuleSubview = pageRelationDecision.kind === 'same-module-subview'
  const effectiveRelatedPagePath = resolveEffectiveRelatedPagePath({
    relatedPagePath: effectiveRelatedPagePathForBrief,
    briefOutputTargetEvidence: brief.outputTargetEvidence,
    persistedMeta: persistedMetaState.meta,
  })
  const relatedPagePath = ensureProjectRelative(
    targetRoot,
    effectiveRelatedPagePath,
    '--related-page-path'
  )
  const expectedExposeTarget = resolveExpectedExposeTarget({
    expectedExposeTarget: options.expectedExposeTarget,
    dest: effectiveDest,
    navigationMountAction,
    hostExecutionAdapter,
    pageRelationDecision,
    publishDeliveryDecision: pageGenerationDecision.publishDeliveryDecision || null,
  })
  const skipBusinessEntryEvidenceForDirectMfExpose = shouldSkipBusinessEntryEvidenceForDirectMfExpose(
    {
      brief,
      expectedExposeName,
    }
  )
  const confirmationPolicy = buildConfirmationPolicy({
    brief,
    confirmedGenerationInput,
    confirmedDesignRestoreInput,
  })

  if (!brief.integrationReadiness?.ready) {
    return buildGateBlockedResult({
      brief,
      targetRoot,
      options,
      expectedExposeName,
      expectedExposeTarget,
      gateKind: 'integration',
      confirmedGenerationInput,
      confirmedDesignRestoreInput,
    })
  }

  if (brief.pageTaskGate?.status !== 'ready-to-generate') {
    return buildGateBlockedResult({
      brief,
      targetRoot,
      options,
      expectedExposeName,
      expectedExposeTarget,
      gateKind: 'page-task',
      confirmedGenerationInput,
      confirmedDesignRestoreInput,
    })
  }

  if (brief.executionPolicy?.navigationBlocked) {
    return {
      schema: 'hiui5-integration-preflight.v1',
      targetRoot,
      pageType: brief.pageType,
      inputMode: brief.inputMode,
      integrationReadiness: brief.integrationReadiness,
      pageTaskGate: brief.pageTaskGate,
      confirmationPolicy,
      requestedBusiness: brief.requestedBusiness,
      copyMode: brief.pageGenerationDecision.copyMode,
      routePath: options.routePath || '',
      expectedExposeName,
      expectedExposeTarget,
      status: 'blocked',
      checks: {
        navigationContract: decision(
          false,
          brief.executionPolicy.navigationBlockReason ||
            'navigation integration is blocked because no existing business navigation entry point could be proven'
        ),
      },
      requiredManualActions: [
        'Specify the exact existing business navigation registry, route entry file, or menu挂靠点 before running integration preflight again.',
      ],
      riskPolicy: {
        doesNotPatchEntryFiles: true,
        browserValidationIsNotRequiredBeforeGeneration: true,
        mustNotGuessRouteMenuOrExpose: true,
      },
    }
  }

  const routePath =
    effectiveRoutePath || (expectedExposeName ? `@common/${expectedExposeName.replace(/^\.\//, '')}` : '')
  const detectedHostProfile =
    brief.hostProfile?.remoteDebugContract || brief.hostProfile?.remoteOnlyRuntime
      ? brief.hostProfile
      : await detectHostProfile(targetRoot)
  const runtimeSourceStatus = await readRemoteRuntimeSourceStatus(targetRoot)
  const remoteDebugContract = {
    ...(detectedHostProfile?.remoteDebugContract || {}),
    runtimeSourceStatus:
      runtimeSourceStatus?.status ||
      detectedHostProfile?.remoteDebugContract?.runtimeSourceStatus ||
      '',
  }

  const codeRegistrationEvidence = await collectCodeRegistrationEvidence({
    targetRoot,
    dest: effectiveDest,
    title: effectiveTitle,
    routePath,
    expectedExposeName,
    expectedExposeTarget,
    navigationMountAction,
    hostExecutionAdapter,
    entryFile: options.entryFile,
    entryFileAbsolutePath: entryFile,
    relatedPagePath: effectiveRelatedPagePath,
    relatedPageAbsolutePath: relatedPagePath,
    pageRelationDecision,
    publishDeliveryDecision: brief.pageGenerationDecision?.publishDeliveryDecision || null,
    requireEntryFileEvidence: !skipBusinessEntryEvidenceForDirectMfExpose,
    requireAddPageEvidence: !skipBusinessEntryEvidenceForDirectMfExpose,
  })
  const baseChecks = codeRegistrationEvidence.checks
  const codeRegistered = codeRegistrationEvidence.status === 'proven'
  const runtimeVerification = buildRuntimeVerificationCheck({
    remoteDebugContract,
    runtimeSourceStatus,
    codeRegistrationEvidence,
    routePath,
    expectedExposeName,
    expectedExposeTarget,
    pageRelationDecision,
    navigationMountAction,
  })
  const styleDeliveryVerified = await buildStyleDeliveryVerificationCheck({
    targetRoot,
    pageRelationDecision,
    hostExecutionAdapter,
    projectHostContract: brief.projectHostContract || null,
    persistedMeta: persistedMetaState.meta,
  })
  const contentInspection = await inspectContentReadiness({
    targetRoot,
    dest: effectiveDest,
    persistedMeta: persistedMetaState.meta,
  })
  const checks = {
    ...baseChecks,
    codeRegistered: decision(
      codeRegistered,
      codeRegistered
        ? isSameModuleSubview
          ? 'page output, parent-page evidence, and module ownership are all registered in code for this same-module-subview page'
          : 'page output, expose registration, route registration, and business entry evidence are all registered in code'
        : isSameModuleSubview
          ? 'same-module-subview code registration is incomplete; fix the blocked parent-page or module-ownership checks before blaming runtime'
          : 'code registration is incomplete; fix the blocked code-level checks before attributing failures to runtime source',
      {
        blockedChecks: codeRegistrationEvidence.blockedChecks,
        status: codeRegistrationEvidence.status,
        pageRelationKind: pageRelationDecision.kind || 'undetermined',
        pageRelationDecisionSource: pageRelationResolution.source,
      }
    ),
    styleDeliveryVerified,
    contentReadiness: decision(
      contentInspection.contentReadiness === 'ready',
      contentInspection.reason,
      {
        status: contentInspection.contentReadiness,
        contentSourcePath: contentInspection.contentSourcePath,
      }
    ),
    runtimeVerification,
    runtimeSourceVerified: buildLegacyRuntimeSourceVerifiedCheck(runtimeVerification),
  }
  const deliveryReadiness =
    pageRelationDecision.kind === 'same-module-subview'
      ? 'not-applicable'
      : checks.moduleFederation?.ok && checks.pageOutput?.ok
        ? 'ready'
        : 'blocked'
  const contentReadiness = contentInspection.contentReadiness || 'blocked'

  const requiredManualActions = []
  if (!checks.moduleFederation.ok) requiredManualActions.push('register or correct Module Federation exposes before expecting host access')
  if (!checks.addPageEntry.ok) requiredManualActions.push('add or correct window.addPage route path in the business entry')
  if (!checks.entryFile.ok) requiredManualActions.push('provide the exact business entry file and verify the button/link references the route')
  if (checks.relatedPage && !checks.relatedPage.ok) {
    requiredManualActions.push('provide the exact related-page file and verify the parent page exists for this subview flow')
  }
  if (checks.moduleOwnership && !checks.moduleOwnership.ok) {
    requiredManualActions.push('place the child page under the related page module directory before rerunning integration preflight')
  }
  if (!checks.pageOutput.ok) requiredManualActions.push('generate the page output before connecting entry files')
  if (!checks.styleDeliveryVerified.ok) {
    requiredManualActions.push(
      'declare a valid styleDeliveryDecision in hiui-pagegen.meta.json and make sure the declared owner file really imports the managed runtime styles before rerunning integration preflight'
    )
  }
  if (deliveryReadiness === 'ready' && contentReadiness === 'legacy') {
    requiredManualActions.push(
      'replace the legacy content source behind the current runtime entry chain before calling the page reconstruction complete'
    )
  }
  if (!checks.runtimeVerification.ok) {
    if (checks.runtimeVerification.evidence.verifyCommand) {
      requiredManualActions.push(
        `run runtime source verification before blaming page source: ${checks.runtimeVerification.evidence.verifyCommand}`
      )
    }
    const camoraRuntimeClosure = checks.runtimeVerification.evidence.camoraRuntimeClosure
    if (camoraRuntimeClosure?.applicable) {
      if (camoraRuntimeClosure.status === 'needs-local-restart') {
        requiredManualActions.push(
          'restart the local dev server so Camora stops serving a stale local remoteEntry.js, then rerun runtime source verification'
        )
      } else if (camoraRuntimeClosure.status === 'start-local-remote') {
        requiredManualActions.push(
          'start the local dev server that should serve the Camora remoteEntry.js, then rerun runtime source verification'
        )
      } else if (camoraRuntimeClosure.status === 'blocked-by-code-registration') {
        requiredManualActions.push(
          'fix the blocked code registration checks before attributing the failure to Camora runtime'
        )
      } else {
        requiredManualActions.push(
          'verify the live Camora proxy target is serving the current remoteEntry.js before blaming page source'
        )
      }
    } else {
      requiredManualActions.push(
        checks.runtimeVerification.evidence.pendingInsteadOfBlocked
          ? 'confirm the remote package has switched to mf-entry and rerun runtime source verification before visual acceptance'
          : checks.runtimeVerification.evidence.status === 'fail'
          ? remoteDebugContract.mode === 'camora-regex-proxy'
            ? 'fix the failing Camora proxy target or expose registration, then rerun runtime source verification'
            : 'fix the failing live remoteEntry.js source or expose registration, then rerun runtime source verification'
          : remoteDebugContract.mode === 'camora-regex-proxy'
            ? 'verify the live Camora proxy target is serving the current remoteEntry.js before blaming page source'
            : 'verify the live remoteEntry.js source being loaded by the host before blaming page source'
      )
    }
  }

  const status =
    !checks.codeRegistered.ok || !checks.styleDeliveryVerified.ok
      ? 'blocked'
      : checks.runtimeVerification.ok
        ? 'pass'
        : checks.runtimeVerification.evidence.pendingInsteadOfBlocked
          ? 'pass-with-runtime-pending'
        : checks.runtimeVerification.evidence.status === 'not-run'
          ? 'pass-with-runtime-pending'
          : 'blocked'

  return {
    schema: 'hiui5-integration-preflight.v1',
    targetRoot,
    pageType: brief.pageType,
    inputMode: brief.inputMode,
    integrationReadiness: brief.integrationReadiness,
    pageTaskGate: brief.pageTaskGate,
    confirmationPolicy,
    requestedBusiness: brief.requestedBusiness,
    generationPath: brief.pageGenerationDecision.generationPath,
    copyMode: brief.pageGenerationDecision.copyMode,
    routePath,
    relatedPagePath: effectiveRelatedPagePath,
    pageRelationDecision,
    pageRelationDecisionSource: pageRelationResolution.source,
    styleDeliveryDecision: persistedMetaState.meta?.styleDeliveryDecision || null,
    deliveryReadiness,
    contentReadiness,
    contentSourcePath: contentInspection.contentSourcePath,
    expectedExposeName,
    expectedExposeTarget,
    remoteDebugContract,
    runtimeSourceStatus,
    status,
    checks,
    requiredManualActions,
    persistedMetaPath: persistedMetaState.metaPath,
    riskPolicy: {
      doesNotPatchEntryFiles: true,
      browserValidationIsNotRequiredBeforeGeneration: true,
      mustNotGuessRouteMenuOrExpose: true,
    },
  }
}

function renderMarkdown(result) {
  const lines = [
    '# HiUI5 Integration Preflight',
    '',
    `- status: ${result.status}`,
    `- pageType: ${result.pageType.id} / ${result.pageType.label}`,
    `- inputMode: ${result.inputMode?.id || '—'} / ${result.inputMode?.label || '—'}`,
    `- confirmationMode: ${result.confirmationPolicy?.mode || '—'}`,
    `- confirmedPageType: ${result.confirmationPolicy?.confirmedPageType || '—'}`,
    `- finalPromptAvailable: ${Boolean(result.confirmationPolicy?.finalPromptAvailable)}`,
    `- generationPath: ${result.generationPath?.id || '—'} / ${result.generationPath?.label || '—'}`,
    `- carrierStrategy(copyMode): ${result.copyMode}`,
    `- routePath: ${result.routePath || '—'}`,
    `- relatedPagePath: ${result.relatedPagePath || '—'}`,
    `- pageRelation: ${result.pageRelationDecision?.kind || 'undetermined'} / ${result.pageRelationDecisionSource || 'unknown'}`,
    `- deliveryReadiness: ${result.deliveryReadiness || '—'}`,
    `- contentReadiness: ${result.contentReadiness || '—'}`,
    `- contentSourcePath: ${result.contentSourcePath || '—'}`,
    `- styleDeliveryOwner: ${result.styleDeliveryDecision?.owner || '—'}`,
    `- styleDeliveryEntry: ${result.styleDeliveryDecision?.effectiveEntryPath || '—'}`,
    `- expectedExposeName: ${result.expectedExposeName || '—'}`,
    `- expectedExposeTarget: ${result.expectedExposeTarget || '—'}`,
    '',
    '## Checks',
    '',
    ...Object.entries(result.checks).map(([key, check]) => `- ${key}: ${check.ok ? 'pass' : 'blocked'} — ${check.reason}`),
    '',
    '## Required Manual Actions',
    '',
    ...(result.requiredManualActions.length ? result.requiredManualActions.map((item) => `- ${item}`) : ['- —']),
    '',
  ]
  return lines.join('\n')
}

async function main() {
  const rawArgs = process.argv.slice(2)
  const options = parseArgs(rawArgs)
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
    process.exit(runtimeReset.exitCode ?? 0)
  }
  const scriptDir = path.dirname(scriptPath)
  const skillRoot = path.resolve(scriptDir, '..')
  let confirmedGenerationInput = null
  let confirmedDesignRestoreInput = null
  let nonTypicalConversationOutput = null
  let legacyReconstructionInput = null
  let migrationInvariantContract = null
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
    nonTypicalConversationOutput = await resolveJsonOrPathArg(
      options.nonTypicalConversationOutputJson,
      {
        targetRoot,
        label: '--non-typical-conversation-output-json',
      }
    )
  }

  if (options.legacyReconstructionInputJson) {
    legacyReconstructionInput = await resolveJsonOrPathArg(options.legacyReconstructionInputJson, {
      targetRoot,
      label: '--legacy-reconstruction-input-json',
    })
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

  const result = await runPreflight({
    options,
    targetRoot,
    skillRoot,
    preloadedBrief: invocation.brief,
    confirmedGenerationInput,
    confirmedDesignRestoreInput,
    nonTypicalConversationOutput,
    legacyReconstructionInput,
    migrationInvariantContract,
    analyticsRefactorContract,
  })

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
    return
  }

  console.log(renderMarkdown(result))
}

await main()
