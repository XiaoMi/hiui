import fs from 'node:fs/promises'
import path from 'node:path'

import { detectHostProfile } from './detect-host-profile.mjs'
import { inspectIntegrationReadiness } from './integration-readiness.mjs'
import {
  findRootConfigObjectRange,
  insertIntoObjectLiteral,
} from './js-config-object-edit.mjs'
import {
  hasManagedScopedHiui5BridgeReference,
  hasScopedHiui5BridgeMarkers,
} from './legacy-hiui5-bridge-signals.mjs'
import {
  detectSupportedLegacyReactCompatConfigs,
  resolveWritableLegacyCompatConfigTarget,
} from './legacy-react-compat-closure.mjs'
import {
  buildEnsureCommand,
  buildPreflightCommand,
  detectProjectPackageManager,
  writeEnsureOnlyPageTaskStatus,
} from './page-task-gate.mjs'

export const LEGACY_HIUI5_BRIDGE_AUTOFIX_SCHEMA =
  'hiui-design-legacy-hiui5-bridge-autofix.v1'

function normalizeString(value) {
  return String(value || '').trim()
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
    schema: LEGACY_HIUI5_BRIDGE_AUTOFIX_SCHEMA,
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

function isLegacyHiui5BridgeAutofixInScope(hostProfile = {}) {
  const projectType = normalizeString(hostProfile?.projectType)
  const framework = normalizeString(hostProfile?.framework)
  const legacyReactRuntime = hostProfile?.legacyReactRuntime === true
  const hiuiFacts = hostProfile?.hiuiFacts || {}

  return (
    projectType === 'existing-system' &&
    [
      'webpack-module-federation',
      'rspack-module-federation',
      'webpack-react',
      'rspack-react',
    ].includes(framework) &&
    (legacyReactRuntime === true ||
      hiuiFacts.hasLegacyRuntimePackages === true ||
      hiuiFacts.hasMixedRuntimePackages === true)
  )
}

function detectConfigSyntax(relativePath = '', source = '') {
  if (relativePath.endsWith('.cjs')) return 'cjs'
  if (
    relativePath.endsWith('.mjs') ||
    relativePath.endsWith('.mts') ||
    relativePath.endsWith('.ts')
  ) {
    return 'esm'
  }
  if (/module\.exports\s*=/.test(source)) return 'cjs'
  if (/\bexport\s+default\b/.test(source) || /\bimport\s+/.test(source)) return 'esm'
  return 'cjs'
}

function findMatchingBracket(source, openBracketIndex) {
  let quote = ''
  let escaped = false
  let lineComment = false
  let blockComment = false
  let depth = 0

  for (let index = openBracketIndex; index < source.length; index += 1) {
    const char = source[index]
    const nextChar = source[index + 1]

    if (lineComment) {
      if (char === '\n') lineComment = false
      continue
    }

    if (blockComment) {
      if (char === '*' && nextChar === '/') {
        blockComment = false
        index += 1
      }
      continue
    }

    if (quote) {
      if (escaped) {
        escaped = false
        continue
      }
      if (char === '\\') {
        escaped = true
        continue
      }
      if (char === quote) {
        quote = ''
      }
      continue
    }

    if (char === '/' && nextChar === '/') {
      lineComment = true
      index += 1
      continue
    }

    if (char === '/' && nextChar === '*') {
      blockComment = true
      index += 1
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '[') {
      depth += 1
      continue
    }

    if (char === ']') {
      depth -= 1
      if (depth === 0) {
        return index
      }
    }
  }

  return -1
}

function findArrayPropertyRange(source, propertyName) {
  const pattern = new RegExp(`(?:['"]${propertyName}['"]|\\b${propertyName}\\b)\\s*:`, 'g')

  for (const match of source.matchAll(pattern)) {
    const colonIndex = source.indexOf(':', match.index)
    if (colonIndex < 0) continue

    let cursor = colonIndex + 1
    while (cursor < source.length && /\s/.test(source[cursor])) {
      cursor += 1
    }

    if (source[cursor] !== '[') continue

    const closeIndex = findMatchingBracket(source, cursor)
    if (closeIndex < 0) continue

    return {
      openBracketIndex: cursor,
      closeBracketIndex: closeIndex,
    }
  }

  return null
}

function insertIntoArrayLiteral(source, arrayRange, entryText) {
  const beforeOpen = source.slice(0, arrayRange.openBracketIndex + 1)
  const innerSource = source.slice(
    arrayRange.openBracketIndex + 1,
    arrayRange.closeBracketIndex,
  )
  const afterClose = source.slice(arrayRange.closeBracketIndex)
  const lineStart = source.lastIndexOf('\n', arrayRange.closeBracketIndex - 1) + 1
  const closingIndent =
    source.slice(lineStart, arrayRange.closeBracketIndex).match(/^\s*/)?.[0] ?? ''
  const innerIndent = `${closingIndent}  `
  const body = entryText
    .split('\n')
    .map((line) => `${innerIndent}${line}`)
    .join('\n')

  if (!innerSource.trim()) {
    return `${beforeOpen}\n${body}\n${closingIndent}${afterClose}`
  }

  const normalizedInnerSource = innerSource.startsWith('\n')
    ? innerSource
    : `\n${innerSource}`

  return `${beforeOpen}\n${body},${normalizedInnerSource}${afterClose}`
}

function normalizeRequirePath(relativePath) {
  const normalized = String(relativePath || '').replace(/\\/g, '/')
  if (!normalized) return normalized
  return normalized.startsWith('.') ? normalized : `./${normalized}`
}

function buildBridgeHelperRequirePath({ targetRoot, configAbsolutePath }) {
  const bridgeHelperPath = path.join(
    targetRoot,
    '.local-context',
    'hiui-design',
    'examples',
    'host-integration',
    'build',
    'hiui5-peer-replacement-bridge.cjs',
  )

  return normalizeRequirePath(
    path.relative(path.dirname(configAbsolutePath), bridgeHelperPath),
  )
}

function buildBridgeHelperBlock({ configKind, helperRequirePath }) {
  const replacementPluginFactory =
    configKind === 'rspack'
      ? `require('@rspack/core').NormalModuleReplacementPlugin`
      : `require('webpack').NormalModuleReplacementPlugin`

  return [
    'const {',
    '  createScopedHiui5PeerReplacementPlugins,',
    `} = require(${JSON.stringify(helperRequirePath)})`,
    '',
    'const hiui5PeerReplacementPlugins = createScopedHiui5PeerReplacementPlugins(',
    `  ${replacementPluginFactory}`,
    ')',
  ].join('\n')
}

function insertBeforeModuleExports(source, block) {
  const moduleExportsMatch = source.match(/\bmodule\.exports\s*=/)
  const normalizedBlock = `${String(block || '').trimEnd()}\n`
  if (!moduleExportsMatch || moduleExportsMatch.index == null) {
    return `${normalizedBlock}\n${source}`
  }

  const insertionIndex = moduleExportsMatch.index
  const before = source.slice(0, insertionIndex)
  const after = source.slice(insertionIndex)
  const separator = before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n'

  return `${before}${separator}${normalizedBlock}\n${after}`
}

function hasManagedBridgePluginUsage(source = '') {
  return /plugins\s*:\s*\[[\s\S]*hiui5PeerReplacementPlugins[\s\S]*\]/.test(
    String(source || ''),
  )
}

function inspectManagedBridgeWiring(source = '') {
  const raw = String(source || '')
  return {
    hasScopedMarkers: hasScopedHiui5BridgeMarkers(raw),
    hasManagedReference: hasManagedScopedHiui5BridgeReference(raw),
    hasManagedVariable: raw.includes('hiui5PeerReplacementPlugins'),
    hasManagedUsage: hasManagedBridgePluginUsage(raw),
  }
}

function patchConfigSource({
  raw,
  configRelativePath,
  configAbsolutePath,
  configKind,
  targetRoot,
}) {
  const syntax = detectConfigSyntax(configRelativePath, raw)
  if (syntax !== 'cjs') {
    return {
      status: 'manual',
      nextRaw: raw,
      changes: [],
      reason:
        `${configRelativePath} is not a supported CommonJS config. ` +
        'Legacy HiUI5 bridge autofix currently edits only object-style CommonJS Webpack/Rspack configs.',
    }
  }

  const wiring = inspectManagedBridgeWiring(raw)
  if (wiring.hasScopedMarkers && wiring.hasManagedUsage) {
    return {
      status: 'already-compatible',
      nextRaw: raw,
      changes: [],
      reason:
        `${configRelativePath} already contains the managed scoped HiUI5 bridge wiring.`,
    }
  }

  if (wiring.hasScopedMarkers && !wiring.hasManagedVariable) {
    return {
      status: 'manual',
      nextRaw: raw,
      changes: [],
      reason:
        `${configRelativePath} already contains custom HiUI5 bridge markers, but not the managed ` +
        '`hiui5PeerReplacementPlugins` wiring shape. Review this custom bridge manually instead of letting autofix guess how to merge it.',
    }
  }

  let nextRaw = raw
  const changes = []

  if (!wiring.hasManagedVariable) {
    nextRaw = insertBeforeModuleExports(
      nextRaw,
      buildBridgeHelperBlock({
        configKind,
        helperRequirePath: buildBridgeHelperRequirePath({
          targetRoot,
          configAbsolutePath,
        }),
      }),
    )
    changes.push('inserted managed scoped HiUI5 bridge helper block')
  }

  if (!hasManagedBridgePluginUsage(nextRaw)) {
    const pluginsRange = findArrayPropertyRange(nextRaw, 'plugins')
    if (pluginsRange) {
      nextRaw = insertIntoArrayLiteral(nextRaw, pluginsRange, '...hiui5PeerReplacementPlugins')
      changes.push('appended hiui5PeerReplacementPlugins to plugins[]')
    } else {
      const rootRange = findRootConfigObjectRange(nextRaw)
      if (!rootRange) {
        return {
          status: 'manual',
          nextRaw: raw,
          changes: [],
          reason:
            `Autofix could not find a writable root config object inside ${configRelativePath}. ` +
            'Add the managed scoped HiUI5 bridge manually and rerun typical-page:preflight.',
        }
      }

      nextRaw = insertIntoObjectLiteral(
        nextRaw,
        rootRange,
        'plugins: [\n  ...hiui5PeerReplacementPlugins,\n]',
      )
      changes.push('created plugins[] and inserted hiui5PeerReplacementPlugins')
    }
  }

  return {
    status: nextRaw === raw ? 'already-compatible' : 'patched',
    nextRaw,
    changes,
    reason:
      nextRaw === raw
        ? `${configRelativePath} already contains the managed scoped HiUI5 bridge wiring.`
        : `Legacy HiUI5 bridge autofix updated ${configRelativePath} with the managed scoped replacement bridge.`,
  }
}

export async function autofixLegacyHiui5Bridge({
  targetRoot,
  skillRoot,
  updatedBy = 'scripts/legacy-hiui5-bridge-autofix.mjs',
} = {}) {
  const readiness = await inspectIntegrationReadiness(targetRoot)

  if (!readiness.ready) {
    return buildBlockedPayload({
      targetRoot,
      reason:
        `Project-local hiui-design context is not ready for legacy HiUI5 bridge autofix: ${readiness.reason}`,
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

  if (!isLegacyHiui5BridgeAutofixInScope(hostProfile)) {
    return buildBlockedPayload({
      targetRoot,
      reason:
        'Legacy HiUI5 bridge autofix only applies to existing-system legacy Webpack/Rspack hosts that still need an explicit scoped runtime bridge.',
      nextCommand: buildPreflightCommand({
        packageManager: await detectProjectPackageManager(targetRoot),
        mode: readiness.appliedMode,
      }),
      details: [
        `projectType=${hostProfile.projectType || 'unknown'}`,
        `framework=${hostProfile.framework || 'unknown'}`,
        `riskLevel=${hostProfile.riskLevel || 'unknown'}`,
      ],
    })
  }

  const supportedConfigs = (await detectSupportedLegacyReactCompatConfigs(targetRoot)).filter(
    (item) => item.kind === 'webpack' || item.kind === 'rspack',
  )
  const writableConfigTarget = resolveWritableLegacyCompatConfigTarget(supportedConfigs, {
    allowedKinds: ['webpack', 'rspack'],
  })
  if (writableConfigTarget.status !== 'selected') {
    return buildBlockedPayload({
      targetRoot,
      reason:
        supportedConfigs.length === 0
          ? 'Legacy HiUI5 bridge autofix did not find a supported Webpack/Rspack config file.'
          : `Legacy HiUI5 bridge autofix found ${supportedConfigs.length} supported Webpack/Rspack config files (${supportedConfigs.map((item) => item.relativePath).join(', ')}). It only runs when exactly one supported config file is present, or when a single shared Rspack base config can be selected safely.`,
      nextCommand: buildPreflightCommand({
        packageManager: await detectProjectPackageManager(targetRoot),
        mode: readiness.appliedMode,
      }),
      details: supportedConfigs.map((item) => item.relativePath),
    })
  }

  const config = writableConfigTarget.config
  const rawConfig = await fs.readFile(config.absolutePath, 'utf8')
  const configPatch = patchConfigSource({
    raw: rawConfig,
    configRelativePath: config.relativePath,
    configAbsolutePath: config.absolutePath,
    configKind: config.kind,
    targetRoot,
  })

  if (configPatch.status === 'manual') {
    return buildBlockedPayload({
      targetRoot,
      configPath: config.relativePath,
      configKind: config.kind,
      reason: configPatch.reason,
      nextCommand: buildPreflightCommand({
        packageManager: await detectProjectPackageManager(targetRoot),
        mode: readiness.appliedMode,
      }),
    })
  }

  if (configPatch.status === 'already-compatible') {
    return {
      schema: LEGACY_HIUI5_BRIDGE_AUTOFIX_SCHEMA,
      status: 'already-compatible',
      targetRoot,
      configPath: config.relativePath,
      configKind: config.kind,
      reason: configPatch.reason,
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

  await fs.writeFile(config.absolutePath, configPatch.nextRaw, 'utf8')

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
      'Legacy HiUI5 bridge autofix updated the build compatibility baseline. Run typical-page:preflight before generating or editing hiui-design pages again.',
    nextCommand,
    mode: refreshedReadiness.appliedMode || readiness.appliedMode,
    doctor: {
      lastStatus: 'not-run',
    },
  })

  return {
    schema: LEGACY_HIUI5_BRIDGE_AUTOFIX_SCHEMA,
    status: 'patched',
    targetRoot,
    configPath: config.relativePath,
    configKind: config.kind,
    reason: configPatch.reason,
    nextCommand,
    details: [],
    changes: configPatch.changes,
    writtenFiles: [],
    pageTaskReadiness: pageTaskStatus?.pageTaskReadiness || 'ensure-only',
  }
}
