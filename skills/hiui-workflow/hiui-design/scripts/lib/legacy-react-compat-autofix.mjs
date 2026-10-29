import fs from 'node:fs/promises'
import path from 'node:path'

import { detectHostProfile } from './detect-host-profile.mjs'
import { inspectIntegrationReadiness } from './integration-readiness.mjs'
import {
  detectSupportedLegacyReactCompatConfigs,
  isEligibleLegacyReactHost,
  REACT_DOM_CLIENT_SHIM,
  REACT_JSX_RUNTIME_SHIM,
  resolveWritableLegacyCompatConfigTarget,
  resolveLegacyReactCompatRequirements,
} from './legacy-react-compat-closure.mjs'
import {
  ensureEsmPathImport,
  findObjectPropertyRange,
  findRootConfigObjectRange,
  insertIntoObjectLiteral,
} from './js-config-object-edit.mjs'
import {
  buildEnsureCommand,
  buildPreflightCommand,
  detectProjectPackageManager,
  writeEnsureOnlyPageTaskStatus,
} from './page-task-gate.mjs'

export const LEGACY_REACT_COMPAT_AUTOFIX_SCHEMA = 'hiui-design-legacy-react-compat-autofix.v1'
const SCHEMA_TYPES_SHIM_RELATIVE_PATH =
  '.local-context/hiui-design/examples/host-integration/src/shims/schema-types-empty.js'

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function findExistingRelativePaths(targetRoot, candidates) {
  const matches = []

  for (const candidate of candidates) {
    if (await pathExists(path.join(targetRoot, candidate))) {
      matches.push(candidate)
    }
  }

  return matches
}

function normalizeSource(source = '') {
  return String(source || '').replace(/\r\n/g, '\n').trimEnd()
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildBlockedPayload({
  targetRoot,
  reason,
  nextCommand = '',
  configPath = '',
  configKind = '',
  details = [],
}) {
  return {
    schema: LEGACY_REACT_COMPAT_AUTOFIX_SCHEMA,
    status: 'blocked',
    targetRoot,
    configPath,
    configKind,
    reason,
    nextCommand,
    details,
    changes: [],
    writtenFiles: [],
    pageTaskReadiness: 'unchanged',
  }
}

function detectConfigSyntax(relativePath = '', source = '') {
  if (relativePath.endsWith('.cjs')) return 'cjs'
  if (relativePath.endsWith('.mjs') || relativePath.endsWith('.mts')) return 'esm'
  if (/module\.exports\s*=/.test(source)) return 'cjs'
  if (/\bexport\s+default\b/.test(source) || /\bimport\s+/.test(source)) return 'esm'
  return 'cjs'
}

function buildAliasExpression(syntax, relativeShimPath) {
  if (syntax === 'esm') {
    return `path.resolve(process.cwd(), ${JSON.stringify(relativeShimPath)})`
  }

  return `require('node:path').resolve(process.cwd(), ${JSON.stringify(relativeShimPath)})`
}

function buildMissingAliasEntries({ raw, syntax, compatRequirements }) {
  const entries = []

  if (!new RegExp(`['"]${escapeRegExp('@hi-ui/schema-types')}['"]\\s*:`).test(raw)) {
    entries.push(
      `'@hi-ui/schema-types': ${buildAliasExpression(syntax, SCHEMA_TYPES_SHIM_RELATIVE_PATH)}`
    )
  }

  if (
    compatRequirements?.needsReactDomClientCompat &&
    !new RegExp(`['"]${escapeRegExp('react-dom/client')}['"]\\s*:`).test(raw)
  ) {
    entries.push(
      `'react-dom/client': ${buildAliasExpression(syntax, REACT_DOM_CLIENT_SHIM.canonicalRelativePath)}`
    )
  }

  if (
    compatRequirements?.needsReactJsxRuntimeCompat &&
    !new RegExp(`['"]${escapeRegExp('react/jsx-runtime')}['"]\\s*:`).test(raw)
  ) {
    entries.push(
      `'react/jsx-runtime': ${buildAliasExpression(syntax, REACT_JSX_RUNTIME_SHIM.canonicalRelativePath)}`
    )
  }

  if (
    compatRequirements?.needsReactJsxRuntimeCompat &&
    !new RegExp(`['"]${escapeRegExp('react/jsx-dev-runtime')}['"]\\s*:`).test(raw)
  ) {
    entries.push(
      `'react/jsx-dev-runtime': ${buildAliasExpression(syntax, REACT_JSX_RUNTIME_SHIM.canonicalRelativePath)}`
    )
  }

  return entries
}

async function inspectShimState({ targetRoot, skillRoot, shimSpec }) {
  const existingRelativePaths = await findExistingRelativePaths(targetRoot, shimSpec.candidateRelativePaths)
  const officialAbsolutePath = path.join(skillRoot, shimSpec.officialRelativePath)
  const officialSource = normalizeSource(await fs.readFile(officialAbsolutePath, 'utf8'))
  const canonicalAbsolutePath = path.join(targetRoot, shimSpec.canonicalRelativePath)

  if (existingRelativePaths.length === 0) {
    return {
      status: 'missing',
      shimSpec,
      officialSource,
      canonicalAbsolutePath,
      canonicalRelativePath: shimSpec.canonicalRelativePath,
      reason: '',
    }
  }

  if (
    existingRelativePaths.length > 1 ||
    existingRelativePaths.some((relativePath) => relativePath !== shimSpec.canonicalRelativePath)
  ) {
    return {
      status: 'conflict',
      shimSpec,
      officialSource,
      canonicalAbsolutePath,
      canonicalRelativePath: shimSpec.canonicalRelativePath,
      reason:
        `Found existing ${shimSpec.label} shim candidates at ${existingRelativePaths.join(', ')}. ` +
        `Autofix only writes the canonical ${shimSpec.canonicalRelativePath} file.`,
    }
  }

  const currentSource = normalizeSource(await fs.readFile(canonicalAbsolutePath, 'utf8'))
  if (currentSource !== officialSource) {
    return {
      status: 'conflict',
      shimSpec,
      officialSource,
      canonicalAbsolutePath,
      canonicalRelativePath: shimSpec.canonicalRelativePath,
      reason:
        `Found project-local ${shimSpec.canonicalRelativePath}, but its content differs from the official ` +
        `${shimSpec.label} shim template. Autofix will not overwrite custom shim content.`,
    }
  }

  return {
    status: 'ready',
    shimSpec,
    officialSource,
    canonicalAbsolutePath,
    canonicalRelativePath: shimSpec.canonicalRelativePath,
    reason: '',
  }
}

function patchConfigSource({ raw, configRelativePath, compatRequirements }) {
  const syntax = detectConfigSyntax(configRelativePath, raw)
  const missingAliasEntries = buildMissingAliasEntries({ raw, syntax, compatRequirements })

  if (missingAliasEntries.length === 0) {
    return {
      status: 'already-compatible',
      nextRaw: raw,
      changedKeys: [],
      insertedPathImport: false,
    }
  }

  let workingRaw = raw
  let insertedPathImport = false

  if (syntax === 'esm') {
    const importPatch = ensureEsmPathImport(workingRaw)
    workingRaw = importPatch.source
    insertedPathImport = importPatch.inserted
  }

  const aliasRange = findObjectPropertyRange(workingRaw, 'alias')
  if (aliasRange) {
    return {
      status: 'patched',
      nextRaw: insertIntoObjectLiteral(workingRaw, aliasRange, missingAliasEntries.join(',\n')),
      changedKeys: missingAliasEntries.map((entry) => entry.split(':')[0].replace(/['"]/g, '')),
      insertedPathImport,
    }
  }

  const resolveRange = findObjectPropertyRange(workingRaw, 'resolve')
  if (resolveRange) {
    return {
      status: 'patched',
      nextRaw: insertIntoObjectLiteral(
        workingRaw,
        resolveRange,
        `alias: {\n  ${missingAliasEntries.join(',\n  ')}\n}`
      ),
      changedKeys: missingAliasEntries.map((entry) => entry.split(':')[0].replace(/['"]/g, '')),
      insertedPathImport,
    }
  }

  const rootRange = findRootConfigObjectRange(workingRaw)
  if (rootRange) {
    return {
      status: 'patched',
      nextRaw: insertIntoObjectLiteral(
        workingRaw,
        rootRange,
        `resolve: {\n  alias: {\n    ${missingAliasEntries.join(',\n    ')}\n  }\n}`
      ),
      changedKeys: missingAliasEntries.map((entry) => entry.split(':')[0].replace(/['"]/g, '')),
      insertedPathImport,
    }
  }

  return {
    status: 'manual',
    nextRaw: raw,
    changedKeys: [],
    insertedPathImport,
  }
}

async function writeOfficialShimIfMissing(shimState) {
  if (shimState.status !== 'missing') return ''

  await fs.mkdir(path.dirname(shimState.canonicalAbsolutePath), { recursive: true })
  await fs.writeFile(shimState.canonicalAbsolutePath, `${shimState.officialSource}\n`, 'utf8')
  return shimState.canonicalRelativePath
}

export async function autofixLegacyReactCompat({
  targetRoot,
  skillRoot,
  updatedBy = 'scripts/legacy-react-compat-autofix.mjs',
} = {}) {
  const readiness = await inspectIntegrationReadiness(targetRoot)

  if (!readiness.ready) {
    return buildBlockedPayload({
      targetRoot,
      reason:
        `Project-local hiui-design context is not ready for legacy React compat autofix: ${readiness.reason}`,
      nextCommand: await buildEnsureCommand({
        targetRoot,
        skillRoot,
        integrationReadiness: readiness,
      }),
    })
  }

  const hostProfile = await detectHostProfile(targetRoot, {
    ignoreRelativePaths: ['src/typical-page-preview'],
  })
  const compatRequirements = resolveLegacyReactCompatRequirements(hostProfile)
  if (!isEligibleLegacyReactHost(hostProfile)) {
    return buildBlockedPayload({
      targetRoot,
      reason:
        `Legacy React compat autofix only applies to high-risk legacy React 16/17 hosts. ` +
        `Detected riskLevel=${hostProfile.riskLevel || 'unknown'}, reactMajor=${hostProfile.reactMajor || 'unknown'}, ` +
        `riskTags=${Array.isArray(readiness.hostCompatibility?.riskTags) ? readiness.hostCompatibility.riskTags.join(', ') : 'none'}.`,
      nextCommand: buildPreflightCommand({
        packageManager: await detectProjectPackageManager(targetRoot),
        mode: readiness.appliedMode,
      }),
    })
  }

  const supportedConfigs = await detectSupportedLegacyReactCompatConfigs(targetRoot)
  const writableConfigTarget = resolveWritableLegacyCompatConfigTarget(supportedConfigs)
  if (writableConfigTarget.status !== 'selected') {
    return buildBlockedPayload({
      targetRoot,
      reason:
        supportedConfigs.length === 0
          ? 'Legacy React compat autofix did not find a supported Vite or Rspack config file.'
          : `Legacy React compat autofix found ${supportedConfigs.length} supported Vite/Rspack/Webpack config files (${supportedConfigs.map((item) => item.relativePath).join(', ')}). It only runs when exactly one supported config file is present, or when a single shared Rspack base config can be selected safely.`,
      nextCommand: buildPreflightCommand({
        packageManager: await detectProjectPackageManager(targetRoot),
        mode: readiness.appliedMode,
      }),
      details: supportedConfigs.map((item) => item.relativePath),
    })
  }

  const config = writableConfigTarget.config
  const requiredShimStates = []
  if (compatRequirements.needsReactDomClientCompat) {
    requiredShimStates.push(
      await inspectShimState({
        targetRoot,
        skillRoot,
        shimSpec: REACT_DOM_CLIENT_SHIM,
      })
    )
  }
  if (compatRequirements.needsReactJsxRuntimeCompat) {
    requiredShimStates.push(
      await inspectShimState({
        targetRoot,
        skillRoot,
        shimSpec: REACT_JSX_RUNTIME_SHIM,
      })
    )
  }

  const reactDomClientShim =
    requiredShimStates.find((item) => item.shimSpec?.label === REACT_DOM_CLIENT_SHIM.label) || null
  const reactJsxRuntimeShim =
    requiredShimStates.find((item) => item.shimSpec?.label === REACT_JSX_RUNTIME_SHIM.label) || null

  const shimConflicts = requiredShimStates
    .filter((item) => item.status === 'conflict')
    .map((item) => item.reason)

  if (shimConflicts.length > 0) {
    return buildBlockedPayload({
      targetRoot,
      configPath: config.relativePath,
      configKind: config.kind,
      reason: shimConflicts.join(' '),
      nextCommand: buildPreflightCommand({
        packageManager: await detectProjectPackageManager(targetRoot),
        mode: readiness.appliedMode,
      }),
      details: shimConflicts,
    })
  }

  const rawConfig = await fs.readFile(config.absolutePath, 'utf8')
  const configPatch = patchConfigSource({
    raw: rawConfig,
    configRelativePath: config.relativePath,
    compatRequirements,
  })

  if (configPatch.status === 'manual') {
    return buildBlockedPayload({
      targetRoot,
      configPath: config.relativePath,
      configKind: config.kind,
      reason:
        `Autofix could not find a writable alias or root config object inside ${config.relativePath}. ` +
        'Patch the legacy React compatibility aliases manually and rerun typical-page:preflight.',
      nextCommand: buildPreflightCommand({
        packageManager: await detectProjectPackageManager(targetRoot),
        mode: readiness.appliedMode,
      }),
    })
  }

  const writtenFiles = []
  const changes = []

  if (configPatch.status === 'patched' && configPatch.nextRaw !== rawConfig) {
    await fs.writeFile(config.absolutePath, configPatch.nextRaw, 'utf8')
    changes.push(
      `patched ${config.relativePath} with ${configPatch.changedKeys.join(', ')} alias entries`
    )
    if (configPatch.insertedPathImport) {
      changes.push(`inserted node:path import into ${config.relativePath}`)
    }
  }

  const writtenReactDomClientShim = reactDomClientShim
    ? await writeOfficialShimIfMissing(reactDomClientShim)
    : ''
  if (writtenReactDomClientShim) {
    writtenFiles.push(writtenReactDomClientShim)
    changes.push(`wrote ${writtenReactDomClientShim}`)
  }

  const writtenReactJsxRuntimeShim = reactJsxRuntimeShim
    ? await writeOfficialShimIfMissing(reactJsxRuntimeShim)
    : ''
  if (writtenReactJsxRuntimeShim) {
    writtenFiles.push(writtenReactJsxRuntimeShim)
    changes.push(`wrote ${writtenReactJsxRuntimeShim}`)
  }

  if (changes.length === 0) {
    return {
      schema: LEGACY_REACT_COMPAT_AUTOFIX_SCHEMA,
      status: 'already-compatible',
      targetRoot,
      configPath: config.relativePath,
      configKind: config.kind,
      reason:
        `Legacy React compatibility aliases and project-local shims are already in place for ${config.relativePath}.`,
      nextCommand: buildPreflightCommand({
        packageManager: await detectProjectPackageManager(targetRoot),
        mode: readiness.appliedMode,
      }),
      details: [],
      changes: [],
      writtenFiles: [],
      pageTaskReadiness: 'unchanged',
    }
  }

  const refreshedReadiness = await inspectIntegrationReadiness(targetRoot)
  const packageManager = await detectProjectPackageManager(targetRoot)
  const nextCommand = buildPreflightCommand({
    packageManager,
    mode: refreshedReadiness.appliedMode || readiness.appliedMode,
  })
  const pageTaskStatus = await writeEnsureOnlyPageTaskStatus({
    targetRoot,
    integrationReadiness: refreshedReadiness,
    updatedBy,
    reason:
      'Legacy React compatibility autofix updated the project runtime baseline. Run typical-page:preflight before generating or editing hiui-design pages again.',
    nextCommand,
    mode: refreshedReadiness.appliedMode || readiness.appliedMode,
    doctor: {
      lastStatus: 'not-run',
    },
  })

  return {
    schema: LEGACY_REACT_COMPAT_AUTOFIX_SCHEMA,
    status: 'patched',
    targetRoot,
    configPath: config.relativePath,
    configKind: config.kind,
    reason:
      `Legacy React compatibility autofix updated ${config.relativePath} and synchronized ` +
      `${writtenFiles.length > 0 ? writtenFiles.join(', ') : 'the existing shim baseline'}.`,
    nextCommand,
    details: [],
    changes,
    writtenFiles,
    pageTaskReadiness: pageTaskStatus?.pageTaskReadiness || 'ensure-only',
  }
}
