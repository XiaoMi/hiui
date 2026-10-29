import fs from 'node:fs/promises'
import path from 'node:path'

import {
  findModuleFederationConfigs,
  scanEntryEvidenceFiles,
} from './business-entry-evidence.mjs'

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, 'utf8')
  } catch {
    return ''
  }
}

function decision(ok, reason, evidence = {}) {
  return { ok, reason, evidence }
}

function toExposeName(value) {
  if (!value) return ''
  return value.startsWith('./') ? value : `./${value}`
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

function normalizeRelativePath(value = '') {
  return String(value || '').trim().replace(/\\/g, '/').replace(/^\.?\//, '')
}

function isPathInsideDir(relativePath = '', relativeDir = '') {
  const normalizedPath = normalizeRelativePath(relativePath)
  const normalizedDir = normalizeRelativePath(relativeDir)
  if (!normalizedPath || !normalizedDir) return false
  return normalizedPath === normalizedDir || normalizedPath.startsWith(`${normalizedDir}/`)
}

function resolveManagedPublishEntryTarget({
  navigationMountAction = null,
  hostExecutionAdapter = null,
  publishDeliveryDecision = null,
} = {}) {
  const publishDeliveryKind = String(publishDeliveryDecision?.kind || '').trim()
  const navigationAction = String(navigationMountAction?.action || '').trim()
  const managedPublishEntryPath = hostExecutionAdapter?.publishEntry?.managedPublishEntryPath || ''

  if (
    publishDeliveryKind !== 'managed-mf-publish-entry' &&
    navigationAction !== 'materialize-mf-publish-entry'
  ) {
    return ''
  }

  return normalizeExpectedExposeTarget(managedPublishEntryPath)
}

export function resolveExpectedExposeTarget({
  expectedExposeTarget = '',
  dest = '',
  navigationMountAction = null,
  hostExecutionAdapter = null,
  pageRelationDecision = null,
  publishDeliveryDecision = null,
} = {}) {
  const publishDeliveryKind = String(publishDeliveryDecision?.kind || '').trim()
  if (
    String(pageRelationDecision?.kind || '').trim() === 'same-module-subview' &&
    publishDeliveryKind !== 'managed-mf-publish-entry'
  ) {
    return ''
  }

  return (
    normalizeExpectedExposeTarget(expectedExposeTarget) ||
    resolveManagedPublishEntryTarget({
      navigationMountAction,
      hostExecutionAdapter,
      publishDeliveryDecision,
    }) ||
    toExpectedExposeTarget(dest)
  )
}

function buildSkippedDecision(reason, evidence = {}) {
  return decision(true, reason, {
    skipped: true,
    ...evidence,
  })
}

function matchesRoutePathWithQuery(value, routePath) {
  if (!value || !routePath) return false
  return value === routePath || value.startsWith(`${routePath}?`)
}

function sourceContainsRoutePathWithQuery(source, routePath) {
  if (!source || !routePath) return false
  return source.includes(routePath) || source.includes(`${routePath}?`)
}

function entryFileContainsNavigationCall(source = '') {
  if (!source) return false
  return /\b(?:window\.)?addPage\s*\(|\bopenNewPage\s*\(/.test(source)
}

function normalizeEntryFileParams({ targetRoot, entryFile = '', entryFileAbsolutePath = '' } = {}) {
  if (entryFileAbsolutePath) {
    return {
      entryFileRelativePath: entryFile,
      entryFileAbsolutePath,
    }
  }

  if (!entryFile) {
    return {
      entryFileRelativePath: '',
      entryFileAbsolutePath: '',
    }
  }

  return {
    entryFileRelativePath: entryFile,
    entryFileAbsolutePath: path.resolve(targetRoot, entryFile),
  }
}

function normalizeRelatedPageParams({
  targetRoot,
  relatedPagePath = '',
  relatedPageAbsolutePath = '',
} = {}) {
  if (relatedPageAbsolutePath) {
    return {
      relatedPageRelativePath: relatedPagePath,
      relatedPageAbsolutePath,
    }
  }

  if (!relatedPagePath) {
    return {
      relatedPageRelativePath: '',
      relatedPageAbsolutePath: '',
    }
  }

  return {
    relatedPageRelativePath: relatedPagePath,
    relatedPageAbsolutePath: path.resolve(targetRoot, relatedPagePath),
  }
}

function deriveEvidenceStatus(
  checks,
  { requireEntryFileEvidence = true, requireAddPageEvidence = true } = {}
) {
  const checkEntries = Object.entries(checks)
  const relevantEntries = checkEntries.filter(([key]) => {
    if (!requireEntryFileEvidence && key === 'entryFile') return false
    if (!requireAddPageEvidence && key === 'addPageEntry') return false
    return true
  })
  if (relevantEntries.length === 0) return 'unknown'
  if (relevantEntries.every(([, check]) => check.ok)) return 'proven'
  if (relevantEntries.some(([, check]) => check.ok)) return 'partial'
  return 'unknown'
}

export async function collectCodeRegistrationEvidence({
  targetRoot,
  dest = '',
  title = '',
  routePath = '',
  exposeName = '',
  expectedExposeName = '',
  expectedExposeTarget = '',
  navigationMountAction = null,
  hostExecutionAdapter = null,
  entryFile = '',
  entryFileAbsolutePath = '',
  relatedPagePath = '',
  relatedPageAbsolutePath = '',
  pageRelationDecision = null,
  publishDeliveryDecision = null,
  requireEntryFileEvidence = true,
  requireAddPageEvidence = true,
} = {}) {
  const pageRelationKind = String(pageRelationDecision?.kind || '').trim()
  const isSameModuleSubview = pageRelationKind === 'same-module-subview'
  const publishDeliveryKind = String(publishDeliveryDecision?.kind || '').trim()
  const requiresManagedPublishEntry = publishDeliveryKind === 'managed-mf-publish-entry'
  const resolvedExpectedExposeName = toExposeName(expectedExposeName || exposeName)
  const resolvedExpectedExposeTarget = resolveExpectedExposeTarget({
    expectedExposeTarget,
    dest,
    navigationMountAction,
    hostExecutionAdapter,
    pageRelationDecision,
    publishDeliveryDecision,
  })
  const resolvedRoutePath =
    routePath || (resolvedExpectedExposeName ? `@common/${resolvedExpectedExposeName.replace(/^\.\//, '')}` : '')
  const {
    entryFileRelativePath,
    entryFileAbsolutePath: resolvedEntryFileAbsolutePath,
  } = normalizeEntryFileParams({
    targetRoot,
    entryFile,
    entryFileAbsolutePath,
  })
  const {
    relatedPageRelativePath,
    relatedPageAbsolutePath: resolvedRelatedPageAbsolutePath,
  } = normalizeRelatedPageParams({
    targetRoot,
    relatedPagePath,
    relatedPageAbsolutePath,
  })

  const [mfConfigs, entryFiles] = await Promise.all([
    findModuleFederationConfigs(targetRoot),
    scanEntryEvidenceFiles(targetRoot, { roots: ['src'] }),
  ])
  const destDir = path.join(targetRoot, dest)
  const destExists = await pathExists(destDir)
  const destIndexExists =
    (await pathExists(path.join(destDir, 'index.tsx'))) ||
    (await pathExists(path.join(destDir, 'index.jsx'))) ||
    (await pathExists(path.join(destDir, 'index.js')))

  const exposes = mfConfigs.flatMap((config) =>
    config.exposes.map((item) => ({ ...item, configPath: config.relativePath }))
  )
  const exactExpose = resolvedExpectedExposeName
    ? exposes.find((item) => item.publicName === resolvedExpectedExposeName)
    : null
  const normalizedExactExposeTarget = normalizeExpectedExposeTarget(exactExpose?.sourcePath || '')
  const targetExpose = exposes.find(
    (item) => normalizeExpectedExposeTarget(item.sourcePath || '') === resolvedExpectedExposeTarget
  )
  const entrySource = resolvedEntryFileAbsolutePath
    ? await readTextIfExists(resolvedEntryFileAbsolutePath)
    : ''
  const relatedPageSource = resolvedRelatedPageAbsolutePath
    ? await readTextIfExists(resolvedRelatedPageAbsolutePath)
    : ''
  const relatedPageModuleDir = normalizeRelativePath(
    relatedPageRelativePath ? path.posix.dirname(normalizeRelativePath(relatedPageRelativePath)) : ''
  )
  const normalizedDest = normalizeRelativePath(dest)
  const relatedPageLinkReferenceDetected = Boolean(relatedPageSource) && (
    (title && relatedPageSource.includes(title)) ||
    (routePath && relatedPageSource.includes(routePath)) ||
    (normalizedDest && relatedPageSource.includes(normalizedDest)) ||
    (normalizedDest && relatedPageSource.includes(path.posix.basename(normalizedDest)))
  )

  const routeConstantMatches = resolvedRoutePath
    ? entryFiles.flatMap((file) =>
        file.routeConstants
          .filter((item) => item.value === resolvedRoutePath)
          .map((item) => ({ ...item, file: file.relativePath }))
      )
    : []
  const routeConstantKeys = new Set(routeConstantMatches.map((item) => item.key))
  const scannedAddPageMatches = resolvedRoutePath
    ? entryFiles.flatMap((file) =>
        file.calls
          .filter((call) => {
            if (matchesRoutePathWithQuery(call.path, resolvedRoutePath)) return true
            if (matchesRoutePathWithQuery(call.pathExpression, resolvedRoutePath)) return true
            for (const key of routeConstantKeys) {
              if (call.pathExpression.includes(key)) return true
            }
            return false
          })
          .map((call) => ({ ...call, file: file.relativePath }))
      )
    : []
  const entryFileFallbackMatches =
    resolvedRoutePath &&
    entryFileRelativePath &&
    entrySource &&
    entryFileContainsNavigationCall(entrySource) &&
    sourceContainsRoutePathWithQuery(entrySource, resolvedRoutePath)
      ? [
          {
            kind: 'entry-file-route-reference',
            file: entryFileRelativePath,
            matchedBy: 'entry-file-source',
          },
        ]
      : []
  const addPageMatches =
    scannedAddPageMatches.length > 0 ? scannedAddPageMatches : entryFileFallbackMatches

  const checks = {
    pageOutput: decision(
      destExists && destIndexExists,
      destExists && destIndexExists
        ? 'target page directory and index entry exist'
        : 'target page directory or index entry is missing; generate the page before connecting formal entries',
      { dest, destExists, destIndexExists }
    ),
    moduleFederation: isSameModuleSubview && !requiresManagedPublishEntry
      ? buildSkippedDecision(
          'standalone Module Federation expose evidence is not required for a same-module-subview page',
          {
            expectedExposeName: resolvedExpectedExposeName,
            expectedExposeTarget: resolvedExpectedExposeTarget,
            pageRelationKind,
            publishDeliveryKind,
          }
        )
      : resolvedExpectedExposeName
      ? decision(
          Boolean(exactExpose) && normalizedExactExposeTarget === resolvedExpectedExposeTarget,
          exactExpose && normalizedExactExposeTarget === resolvedExpectedExposeTarget
            ? 'requested Module Federation expose already points to the expected page publish target'
            : exactExpose
              ? 'requested Module Federation expose exists but points to a different source path'
              : targetExpose
                ? 'expected page publish target is exposed under a different public name'
                : 'requested Module Federation expose is not registered',
          {
            expectedExposeName: resolvedExpectedExposeName,
            expectedExposeTarget: resolvedExpectedExposeTarget,
            exactExpose,
            targetExpose,
            configFiles: mfConfigs.map((item) => item.relativePath),
            publishDeliveryKind,
          }
        )
      : resolvedExpectedExposeTarget
      ? decision(
          Boolean(targetExpose),
          targetExpose
            ? 'expected page publish target is already exposed through Module Federation'
            : 'expected page publish target is not registered in Module Federation exposes',
          {
            expectedExposeTarget: resolvedExpectedExposeTarget,
            targetExpose,
            configFiles: mfConfigs.map((item) => item.relativePath),
            publishDeliveryKind,
          }
        )
      : decision(
          false,
          'missing --expose-name; cannot prove Module Federation public path',
          { expectedExposeTarget: resolvedExpectedExposeTarget, publishDeliveryKind }
        ),
    addPageEntry: isSameModuleSubview
      ? buildSkippedDecision(
          'formal addPage/openNewPage route evidence is not required for a same-module-subview page',
          {
            routePath: resolvedRoutePath,
            pageRelationKind,
          }
        )
      : !requireAddPageEvidence
      ? buildSkippedDecision(
          'route registration evidence is not required for the current publish mechanism',
          {
            routePath: resolvedRoutePath,
            expectedExposeName: resolvedExpectedExposeName,
          }
        )
      : resolvedRoutePath
        ? decision(
            addPageMatches.length > 0,
            addPageMatches.length > 0
              ? 'window.addPage/openNewPage entry using the requested route path or route config key exists'
              : 'no window.addPage/openNewPage entry using the requested route path or route config key was found',
            {
              routePath: resolvedRoutePath,
              matches: addPageMatches,
              routeConstantMatches,
              scannedFiles: entryFiles.length,
            }
          )
        : decision(false, 'missing --route-path and --expose-name; cannot infer addPage path', {}),
    entryFile: isSameModuleSubview
      ? buildSkippedDecision(
          'formal business entry file evidence is not required for a same-module-subview page',
          {
            pageRelationKind,
            expectedExposeName: resolvedExpectedExposeName,
          }
        )
      : !requireEntryFileEvidence
      ? buildSkippedDecision(
          'business entry file evidence is not required for the current publish mechanism',
          {
            expectedExposeName: resolvedExpectedExposeName,
          }
        )
      : entryFileRelativePath
        ? decision(
            Boolean(entrySource) &&
              (entrySource.includes(resolvedRoutePath) ||
                entrySource.includes(title) ||
                entrySource.includes(dest)),
            entrySource
              ? 'entry file exists; check evidence shows whether it references route, title, or dest'
              : 'entry file does not exist or is unreadable',
            {
              entryFile: entryFileRelativePath,
              exists: Boolean(entrySource),
              referencesRoutePath: resolvedRoutePath ? entrySource.includes(resolvedRoutePath) : false,
              referencesTitle: title ? entrySource.includes(title) : false,
              referencesDest: dest ? entrySource.includes(dest) : false,
            }
          )
        : decision(false, 'missing --entry-file; business entry button cannot be proven', {}),
    relatedPage: !isSameModuleSubview
      ? buildSkippedDecision(
          'related-page evidence is only required when the page relation is same-module-subview',
          {
            pageRelationKind: pageRelationKind || 'undetermined',
          }
        )
      : decision(
          Boolean(relatedPageSource),
          Boolean(relatedPageSource)
            ? relatedPageLinkReferenceDetected
              ? 'related page exists and contains a detectable child-page reference'
              : 'related page exists; manual review is still recommended if the child jump is indirect'
            : 'related page file is missing or unreadable; subview parent evidence cannot be proven',
          {
            relatedPagePath: relatedPageRelativePath,
            exists: Boolean(relatedPageSource),
            referencesTitle: title ? relatedPageSource.includes(title) : false,
            referencesRoutePath: resolvedRoutePath ? relatedPageSource.includes(resolvedRoutePath) : false,
            referencesDest: normalizedDest ? relatedPageSource.includes(normalizedDest) : false,
            referencesDestBaseName: normalizedDest
              ? relatedPageSource.includes(path.posix.basename(normalizedDest))
              : false,
          }
        ),
    moduleOwnership: !isSameModuleSubview
      ? buildSkippedDecision(
          'module ownership is only required when the page relation is same-module-subview',
          {
            pageRelationKind: pageRelationKind || 'undetermined',
          }
        )
      : decision(
          isPathInsideDir(normalizedDest, relatedPageModuleDir),
          isPathInsideDir(normalizedDest, relatedPageModuleDir)
            ? 'child page target stays inside the related page module directory'
            : 'child page target is outside the related page module directory',
          {
            dest: normalizedDest,
            relatedPagePath: relatedPageRelativePath,
            relatedPageModuleDir,
          }
        ),
  }

  const blockedChecks = Object.entries(checks)
    .filter(([key, check]) => {
      if (!requireEntryFileEvidence && key === 'entryFile') return false
      if (!requireAddPageEvidence && key === 'addPageEntry') return false
      return !check.ok
    })
    .map(([key]) => key)

  return {
    routePath: resolvedRoutePath,
    expectedExposeName: resolvedExpectedExposeName,
    expectedExposeTarget: resolvedExpectedExposeTarget,
    checks,
    status: deriveEvidenceStatus(checks, { requireEntryFileEvidence, requireAddPageEvidence }),
    blockedChecks,
  }
}
