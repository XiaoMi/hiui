import fs from 'node:fs/promises'
import path from 'node:path'

import { findModuleFederationConfigs } from './business-entry-evidence.mjs'
import { detectHostProfile } from './detect-host-profile.mjs'
import { findMatchingBrace } from './js-config-object-edit.mjs'
import { inspectIntegrationReadiness } from './integration-readiness.mjs'
import { hasScopedHiui5BridgeMarkers } from './legacy-hiui5-bridge-signals.mjs'
import {
  buildEnsureCommand,
  buildPreflightCommand,
  detectProjectPackageManager,
  writeEnsureOnlyPageTaskStatus,
} from './page-task-gate.mjs'
import { isVersionCompatible } from './version-compatibility.mjs'

export const LEGACY_MF_SHARED_CONTRACT_AUTOFIX_SCHEMA =
  'hiui-design-legacy-mf-shared-contract-autofix.v1'

export const LEGACY_MF_SHARED_CONTRACT_PREWRITE_ACTION = 'repair-legacy-mf-shared-contract'
export const LEGACY_MF_SHARED_CONTRACT_BLOCKER_ID = 'legacy-mf-shared-runtime-contract'

const LEGACY_MF_SHARED_CONTRACT_PAGE_TYPES = new Set([
  'table-basic',
  'table-stat',
  'tree-table',
  'tree-split',
  'data-visualization',
])

function normalizeString(value) {
  return String(value || '').trim()
}

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, 'utf8')
  } catch {
    return ''
  }
}

function findDependency(pkg, depName) {
  const groups = [
    pkg?.dependencies,
    pkg?.devDependencies,
    pkg?.peerDependencies,
    pkg?.optionalDependencies,
  ]

  for (const group of groups) {
    if (group && typeof group[depName] === 'string') {
      return group[depName]
    }
  }

  return ''
}

function shouldInspectLegacyMfSharedRuntimeContract(hostProfile = {}) {
  const projectType = normalizeString(hostProfile?.projectType)
  const framework = normalizeString(hostProfile?.framework)
  const legacyReactRuntime = hostProfile?.legacyReactRuntime === true
  const hiuiFacts = hostProfile?.hiuiFacts || {}

  return (
    projectType === 'existing-system' &&
    ['rspack-module-federation', 'webpack-module-federation'].includes(framework) &&
    (legacyReactRuntime === true ||
      hiuiFacts.hasLegacyRuntimePackages === true ||
      hiuiFacts.hasMixedRuntimePackages === true)
  )
}

function extractModuleFederationSharedEntries(source = '') {
  const entries = []
  const sharedSpan = findNamedObjectPropertySpan(source, 'shared')
  if (!sharedSpan) return entries

  const sharedSource = source.slice(sharedSpan.start, sharedSpan.end)
  const openBraceIndex = sharedSource.indexOf('{')
  const closeBraceIndex = sharedSource.lastIndexOf('}')
  if (openBraceIndex < 0 || closeBraceIndex <= openBraceIndex) return entries

  const sharedBlock = sharedSource.slice(openBraceIndex + 1, closeBraceIndex)

  const entryPattern = /(['"]?)(@?[\w./-]+)\1\s*:\s*\{([^{}]*)\}/g
  let match = entryPattern.exec(sharedBlock)

  while (match) {
    const depName = normalizeString(match[2])
    const rawOptions = normalizeString(match[3])
    if (!depName) {
      match = entryPattern.exec(sharedBlock)
      continue
    }

    const requiredVersionMatch = rawOptions.match(/\brequiredVersion\s*:\s*(['"])(.*?)\1/)
    const shareKeyMatch = rawOptions.match(/\bshareKey\s*:\s*(['"])(.*?)\1/)

    entries.push({
      depName,
      singleton: /\bsingleton\s*:\s*true\b/.test(rawOptions),
      requiredVersion: requiredVersionMatch?.[2] || '',
      shareKey: shareKeyMatch?.[2] || '',
      rawOptions,
    })
    match = entryPattern.exec(sharedBlock)
  }

  return entries
}

function findNamedObjectPropertySpan(source, propertyName) {
  const pattern = new RegExp(`(['"]?${propertyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]?)\\s*:`, 'g')

  for (const match of source.matchAll(pattern)) {
    const colonIndex = source.indexOf(':', match.index)
    if (colonIndex < 0) continue

    let cursor = colonIndex + 1
    while (cursor < source.length && /\s/.test(source[cursor])) {
      cursor += 1
    }

    if (source[cursor] !== '{') continue

    const closeBraceIndex = findMatchingBrace(source, cursor)
    if (closeBraceIndex < 0) continue

    let end = closeBraceIndex + 1
    while (end < source.length && /[ \t]/.test(source[end])) {
      end += 1
    }
    if (source[end] === ',') {
      end += 1
    }

    const lineStart = source.lastIndexOf('\n', match.index - 1) + 1
    const indent = source.slice(lineStart, match.index)

    return {
      start: match.index,
      end,
      propertyKeySource: match[1],
      indent,
    }
  }

  return null
}

function buildSharedEntryReplacement(span, lines) {
  const innerIndent = `${span.indent}  `
  return `${span.propertyKeySource}: {\n${lines
    .map((line) => {
      const normalizedLine = String(line || '').trimEnd()
      const suffix = normalizedLine.endsWith(',') ? '' : ','
      return `${innerIndent}${normalizedLine}${suffix}`
    })
    .join('\n')}\n${span.indent}},`
}

function applySharedContractPatch(raw) {
  const sharedSpan = findNamedObjectPropertySpan(raw, 'shared')
  if (!sharedSpan) {
    return {
      status: 'manual',
      nextRaw: raw,
      changes: [],
    }
  }

  const sharedSource = raw.slice(sharedSpan.start, sharedSpan.end)
  const hiui5Span = findNamedObjectPropertySpan(sharedSource, 'hiui5')
  const legacyHiuiSpan = findNamedObjectPropertySpan(sharedSource, '@hi-ui/hiui')

  if (!hiui5Span || !legacyHiuiSpan) {
    return {
      status: 'manual',
      nextRaw: raw,
      changes: [],
    }
  }

  const hiui5Replacement = buildSharedEntryReplacement(hiui5Span, [
    `shareKey: '@hi-ui/hiui'`,
    'singleton: false',
  ])
  const legacyHiuiReplacement = buildSharedEntryReplacement(legacyHiuiSpan, ['singleton: false'])

  let patchedSharedSource = sharedSource
  const replacements = [
    { span: hiui5Span, replacement: hiui5Replacement },
    { span: legacyHiuiSpan, replacement: legacyHiuiReplacement },
  ].sort((left, right) => right.span.start - left.span.start)

  for (const item of replacements) {
    patchedSharedSource =
      patchedSharedSource.slice(0, item.span.start) +
      item.replacement +
      patchedSharedSource.slice(item.span.end)
  }

  return {
    status: patchedSharedSource === sharedSource ? 'already-compatible' : 'patched',
    nextRaw: raw.slice(0, sharedSpan.start) + patchedSharedSource + raw.slice(sharedSpan.end),
    changes: [
      'rewired hiui5 shared entry to shareKey=@hi-ui/hiui with singleton=false',
      'downgraded @hi-ui/hiui shared entry from singleton to multi-version shared',
    ],
  }
}

export function isLegacyMfSharedContractPageType(pageTypeId = '') {
  return LEGACY_MF_SHARED_CONTRACT_PAGE_TYPES.has(normalizeString(pageTypeId))
}

export async function inspectLegacyMfSharedContractRepair({
  targetRoot,
  hostProfile = null,
} = {}) {
  const resolvedHostProfile =
    hostProfile && typeof hostProfile === 'object'
      ? hostProfile
      : await detectHostProfile(targetRoot, {
          ignoreRelativePaths: ['src/typical-page-preview'],
        })

  if (!shouldInspectLegacyMfSharedRuntimeContract(resolvedHostProfile)) {
    return {
      inScope: false,
      risky: false,
      repairRecommended: false,
      repairable: false,
      alreadyCompatible: false,
      configPath: '',
      reason:
        'Legacy shared-contract repair only applies to existing-system legacy Module Federation hosts.',
      sharedEntries: [],
      declaredLegacyHiuiSpec: '',
    }
  }

  const packageJsonPath = path.join(targetRoot, 'package.json')
  const packageJsonRaw = await readTextIfExists(packageJsonPath)
  const pkg = packageJsonRaw ? JSON.parse(packageJsonRaw) : {}
  const declaredLegacyHiuiSpec = findDependency(pkg, '@hi-ui/hiui')
  const declaredLegacyHiuiRuntime =
    Boolean(declaredLegacyHiuiSpec) &&
    !isVersionCompatible(declaredLegacyHiuiSpec, '>=5.0.0-experimental.0')

  const configs = await findModuleFederationConfigs(targetRoot)
  if (configs.length !== 1) {
    return {
      inScope: true,
      risky: false,
      repairRecommended: false,
      repairable: false,
      alreadyCompatible: false,
      configPath: '',
      reason:
        configs.length === 0
          ? 'No supported Module Federation config file was found for legacy shared-contract repair.'
          : `Found ${configs.length} Module Federation configs (${configs
              .map((item) => item.relativePath)
              .join(', ')}); legacy shared-contract autofix only runs when exactly one config is present.`,
      sharedEntries: [],
      declaredLegacyHiuiSpec,
    }
  }

  const config = configs[0]
  const raw = await readTextIfExists(config.absolutePath)
  const sharedEntries = extractModuleFederationSharedEntries(raw)
  const hiui5Entry = sharedEntries.find((entry) => entry.depName === 'hiui5') || null
  const legacyHiuiEntry = sharedEntries.find((entry) => entry.depName === '@hi-ui/hiui') || null
  const scopedBridgeDetected = hasScopedHiui5BridgeMarkers(raw)
  const alreadyCompatible =
    declaredLegacyHiuiRuntime &&
    scopedBridgeDetected &&
    hiui5Entry?.shareKey === '@hi-ui/hiui' &&
    hiui5Entry?.singleton !== true &&
    legacyHiuiEntry?.singleton !== true
  const risky =
    declaredLegacyHiuiRuntime &&
    scopedBridgeDetected &&
    hiui5Entry != null &&
    legacyHiuiEntry?.singleton === true
  const repairable = risky && hiui5Entry != null && legacyHiuiEntry != null

  return {
    inScope: true,
    risky,
    repairRecommended: risky,
    repairable,
    alreadyCompatible,
    configPath: config.relativePath,
    configAbsolutePath: config.absolutePath,
    raw,
    reason: !declaredLegacyHiuiRuntime
      ? 'Target project no longer declares a legacy @hi-ui/hiui runtime; shared-contract repair is not needed.'
      : alreadyCompatible
        ? 'Legacy MF shared contract already uses a non-singleton @hi-ui/hiui share key bridge for hiui5.'
        : risky
          ? `Detected a scoped HiUI5 bridge plus shared singleton @hi-ui/hiui in ${config.relativePath}; this can force legacy MF consumers and new generated pages onto the same incompatible singleton runtime.`
          : 'No risky legacy MF shared-contract signature was detected.',
    sharedEntries,
    declaredLegacyHiuiSpec,
  }
}

function buildBlockedPayload({
  targetRoot,
  reason,
  nextCommand = '',
  configPath = '',
  details = [],
}) {
  return {
    schema: LEGACY_MF_SHARED_CONTRACT_AUTOFIX_SCHEMA,
    status: 'blocked',
    targetRoot,
    configPath,
    reason,
    nextCommand,
    details,
    changes: [],
    writtenFiles: [],
    pageTaskReadiness: 'unchanged',
  }
}

export async function autofixLegacyMfSharedContract({
  targetRoot,
  skillRoot,
  updatedBy = 'scripts/legacy-mf-shared-contract-autofix.mjs',
} = {}) {
  const readiness = await inspectIntegrationReadiness(targetRoot)

  if (!readiness.ready) {
    return buildBlockedPayload({
      targetRoot,
      reason:
        `Project-local hiui-design context is not ready for legacy MF shared-contract autofix: ${readiness.reason}`,
      nextCommand: await buildEnsureCommand({
        targetRoot,
        skillRoot,
        integrationReadiness: readiness,
      }),
    })
  }

  const inspection = await inspectLegacyMfSharedContractRepair({ targetRoot })
  const packageManager = await detectProjectPackageManager(targetRoot)
  const nextCommand = buildPreflightCommand({
    packageManager,
    mode: readiness.appliedMode,
  })

  if (!inspection.inScope) {
    return buildBlockedPayload({
      targetRoot,
      configPath: inspection.configPath,
      reason: inspection.reason,
      nextCommand,
    })
  }

  if (inspection.alreadyCompatible) {
    return {
      schema: LEGACY_MF_SHARED_CONTRACT_AUTOFIX_SCHEMA,
      status: 'already-compatible',
      targetRoot,
      configPath: inspection.configPath,
      reason: inspection.reason,
      nextCommand,
      details: [],
      changes: [],
      writtenFiles: [],
      pageTaskReadiness: 'unchanged',
    }
  }

  if (!inspection.repairRecommended || !inspection.configAbsolutePath || !inspection.raw) {
    return buildBlockedPayload({
      targetRoot,
      configPath: inspection.configPath,
      reason: inspection.reason,
      nextCommand,
    })
  }

  const patch = applySharedContractPatch(inspection.raw)
  if (patch.status === 'manual') {
    return buildBlockedPayload({
      targetRoot,
      configPath: inspection.configPath,
      reason:
        `Autofix could not find a writable shared block with object-literal hiui5 and @hi-ui/hiui entries inside ${inspection.configPath}. Patch the Module Federation shared contract manually, then rerun typical-page:preflight.`,
      nextCommand,
    })
  }

  if (patch.status === 'already-compatible') {
    return {
      schema: LEGACY_MF_SHARED_CONTRACT_AUTOFIX_SCHEMA,
      status: 'already-compatible',
      targetRoot,
      configPath: inspection.configPath,
      reason:
        'Legacy MF shared contract already matches the managed multi-version hiui bridge shape.',
      nextCommand,
      details: [],
      changes: [],
      writtenFiles: [],
      pageTaskReadiness: 'unchanged',
    }
  }

  await fs.writeFile(inspection.configAbsolutePath, patch.nextRaw, 'utf8')

  const refreshedReadiness = await inspectIntegrationReadiness(targetRoot)
  const refreshedNextCommand = buildPreflightCommand({
    packageManager,
    mode: refreshedReadiness.appliedMode || readiness.appliedMode,
  })
  const pageTaskStatus = await writeEnsureOnlyPageTaskStatus({
    targetRoot,
    integrationReadiness: refreshedReadiness,
    updatedBy,
    reason:
      'Legacy MF shared-contract autofix updated the host shared runtime baseline. Run typical-page:preflight before generating or editing hiui-design pages again.',
    nextCommand: refreshedNextCommand,
    mode: refreshedReadiness.appliedMode || readiness.appliedMode,
    doctor: {
      lastStatus: 'not-run',
    },
  })

  return {
    schema: LEGACY_MF_SHARED_CONTRACT_AUTOFIX_SCHEMA,
    status: 'patched',
    targetRoot,
    configPath: inspection.configPath,
    reason:
      `Legacy MF shared-contract autofix updated ${inspection.configPath} so legacy @hi-ui/hiui consumers and new hiui5-backed generated pages can resolve different versions under the same share key.`,
    nextCommand: refreshedNextCommand,
    details: [],
    changes: patch.changes,
    writtenFiles: [inspection.configPath],
    pageTaskReadiness: pageTaskStatus?.pageTaskReadiness || 'ensure-only',
  }
}
