import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PAGE_SOURCE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']
const BUSINESS_PAGE_ROOTS = ['src/views', 'src/pages']
const DEFAULT_CHANGE_SCOPE = 'page-shell-refactor'

const LEGACY_CARRIER_PAGE_TYPE_BY_SYMBOL = Object.freeze({
  ProjectTableBasicCarrier: 'table-basic',
  ProjectTableStatCarrier: 'table-stat',
  ProjectTreeTableCarrier: 'tree-table',
  ProjectTreeSplitCarrier: 'tree-split',
  ProjectDrawerFormCarrier: 'drawer-form',
  ProjectDrawerDetailCarrier: 'drawer-detail',
  ProjectFullPageEditCarrier: 'full-page-edit',
  ProjectFullPageDetailCarrier: 'full-page-detail',
})

const CANONICAL_PAGE_TYPE_BY_SYMBOL = Object.freeze({
  CanonicalTableBasicPage: 'table-basic',
  CanonicalTableStatPage: 'table-stat',
  CanonicalTreeTablePage: 'tree-table',
  CanonicalTreeSplitPage: 'tree-split',
  CanonicalDrawerFormPage: 'drawer-form',
  CanonicalDrawerDetailPage: 'drawer-detail',
  CanonicalFullPageEditPage: 'full-page-edit',
  CanonicalFullPageDetailPage: 'full-page-detail',
  CanonicalFeedbackStatusPage: 'feedback-status',
  CanonicalDataVisualizationPage: 'data-visualization',
})

const TYPICAL_PAGE_TYPES = new Set([
  'table-basic',
  'table-stat',
  'tree-table',
  'tree-split',
  'drawer-form',
  'drawer-detail',
  'full-page-edit',
  'full-page-detail',
  'feedback-status',
  'data-visualization',
])

const CHANGE_SCOPE_VALUES = new Set([
  'bugfix',
  'content-adjustment',
  'slot-refactor',
  'page-shell-refactor',
  'entry-migration',
])

function toPosixPath(inputPath) {
  return String(inputPath || '').replace(/\\/g, '/').replace(/^\.\/+/, '')
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function readJsonIfExists(filePath) {
  try {
    return readJson(filePath)
  } catch {
    return null
  }
}

function readTextIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}

function pathExists(targetPath) {
  try {
    fs.accessSync(targetPath)
    return true
  } catch {
    return false
  }
}

function listDirectoryEntriesSafe(targetDir) {
  try {
    return fs.readdirSync(targetDir, { withFileTypes: true })
  } catch {
    return []
  }
}

function isFilePath(targetPath) {
  try {
    return fs.statSync(targetPath).isFile()
  } catch {
    return false
  }
}

function normalizePagePath(targetRoot, inputPath) {
  const absolutePath = path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(targetRoot, inputPath)
  return toPosixPath(path.relative(targetRoot, absolutePath))
}

function resolvePageEntryPath(targetRoot, inputPath) {
  const absolutePath = path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(targetRoot, inputPath)

  if (pathExists(absolutePath) && fs.statSync(absolutePath).isFile()) {
    return absolutePath
  }

  for (const extension of PAGE_SOURCE_EXTENSIONS) {
    const entryPath = path.join(absolutePath, `index${extension}`)
    if (pathExists(entryPath)) {
      return entryPath
    }
  }

  for (const extension of PAGE_SOURCE_EXTENSIONS) {
    const entryPath = `${absolutePath}${extension}`
    if (pathExists(entryPath)) {
      return entryPath
    }
  }

  return ''
}

function collectPageDirectoryTextFiles(pageDir) {
  const files = []

  function walk(currentPath) {
    const stat = (() => {
      try {
        return fs.statSync(currentPath)
      } catch {
        return null
      }
    })()

    if (!stat) return
    if (stat.isDirectory()) {
      for (const entry of listDirectoryEntriesSafe(currentPath)) {
        walk(path.join(currentPath, entry.name))
      }
      return
    }

    if (!/\.(?:[cm]?[jt]sx?|s?css|json)$/i.test(currentPath)) return
    files.push({
      absolutePath: currentPath,
      relativePath: toPosixPath(currentPath),
      raw: readTextIfExists(currentPath),
    })
  }

  walk(pageDir)
  return files
}

function detectPageTypeFromSource(sourceCode = '') {
  const schemaTypeMatch = sourceCode.match(/pageType["']?\s*[:=]\s*["']([a-z-]+)["']/)
  if (schemaTypeMatch && TYPICAL_PAGE_TYPES.has(schemaTypeMatch[1])) {
    return schemaTypeMatch[1]
  }

  const templateMatch = sourceCode.match(/data-hiui-pagegen-template=["']([a-z-]+)["']/)
  if (templateMatch && TYPICAL_PAGE_TYPES.has(templateMatch[1])) {
    return templateMatch[1]
  }

  const canonicalImportMatch = sourceCode.match(/@\/hiui-pagegen\/canonical\/([a-z-]+)/)
  if (canonicalImportMatch && TYPICAL_PAGE_TYPES.has(canonicalImportMatch[1])) {
    return canonicalImportMatch[1]
  }

  const runtimeEntryPageTypeMatch = sourceCode.match(/pageType=["']([a-z-]+)["']/)
  if (runtimeEntryPageTypeMatch && TYPICAL_PAGE_TYPES.has(runtimeEntryPageTypeMatch[1])) {
    return runtimeEntryPageTypeMatch[1]
  }

  for (const [symbol, pageType] of Object.entries(CANONICAL_PAGE_TYPE_BY_SYMBOL)) {
    if (sourceCode.includes(symbol)) return pageType
  }

  for (const [symbol, pageType] of Object.entries(LEGACY_CARRIER_PAGE_TYPE_BY_SYMBOL)) {
    if (sourceCode.includes(symbol)) return pageType
  }

  const markerMatch = sourceCode.match(/hiui-design page-type:\s*([a-z-]+)/)
  if (markerMatch && TYPICAL_PAGE_TYPES.has(markerMatch[1])) {
    return markerMatch[1]
  }

  return 'unknown'
}

function detectPageType(pageDir, sourceCode = '') {
  const schema = readJsonIfExists(path.join(pageDir, 'page.schema.json'))
  if (schema?.pageType && TYPICAL_PAGE_TYPES.has(String(schema.pageType))) {
    return String(schema.pageType)
  }

  const meta = readJsonIfExists(path.join(pageDir, 'hiui-pagegen.meta.json'))
  if (meta?.pageType && TYPICAL_PAGE_TYPES.has(String(meta.pageType))) {
    return String(meta.pageType)
  }

  return detectPageTypeFromSource(sourceCode)
}

function detectLegacyCarrierUsage(sourceCode = '') {
  return Object.keys(LEGACY_CARRIER_PAGE_TYPE_BY_SYMBOL).some((symbol) => sourceCode.includes(symbol))
}

function detectCanonicalUsage(sourceCode = '') {
  return sourceCode.includes('@/hiui-pagegen/canonical/') ||
    Object.keys(CANONICAL_PAGE_TYPE_BY_SYMBOL).some((symbol) => sourceCode.includes(symbol))
}

function detectOfficialRuntimeUsage(sourceCode = '') {
  return sourceCode.includes('OfficialRuntimeEntryPage')
}

function expectTokensPresent(raw, tokens = [], ownerLabel, failures) {
  for (const token of tokens) {
    if (!raw.includes(token)) {
      failures.push(`${ownerLabel} missing required token: ${token}`)
    }
  }
}

function expectTokensAbsent(raw, tokens = [], ownerLabel, failures) {
  for (const token of tokens) {
    if (raw.includes(token)) {
      failures.push(`${ownerLabel} contains forbidden token: ${token}`)
    }
  }
}

function expectRegionOrder(raw, regions = [], ownerLabel, failures) {
  if (!Array.isArray(regions) || regions.length === 0) {
    return
  }

  let previousIndex = -1

  for (const region of regions) {
    const marker = `data-hiui5-region="${region}"`
    const index = raw.indexOf(marker)

    if (index < 0) {
      failures.push(`${ownerLabel} missing region marker: ${marker}`)
      return
    }

    if (index <= previousIndex) {
      failures.push(
        `${ownerLabel} region order invalid: ${region} must appear after previous regions (${regions.join(' -> ')})`
      )
      return
    }

    previousIndex = index
  }
}

function loadOfficialRuntimeRegistry(targetRoot) {
  const registryPath = path.join(
    targetRoot,
    '.local-context',
    'hiui-pagegen',
    'runtime-families',
    'official-runtime-pages.json'
  )
  return {
    registryPath,
    data: readJsonIfExists(registryPath) || {},
  }
}

function detectCanonicalSupport(targetRoot, pageType) {
  if (!pageType || pageType === 'unknown') {
    return {
      status: 'not-available',
      source: '',
      assetSource: '',
      issues: [],
    }
  }

  const parityPath = path.join(targetRoot, '.local-context', 'hiui-pagegen', 'parity', `${pageType}.json`)
  if (!pathExists(parityPath)) {
    return {
      status: 'not-available',
      source: '',
      assetSource: '',
      issues: [`missing parity manifest: ${normalizePagePath(targetRoot, parityPath)}`],
    }
  }

  const parity = readJsonIfExists(parityPath)
  const canonicalRelativePath = String(parity?.canonicalSource?.path || '').trim()
  if (!canonicalRelativePath) {
    return {
      status: 'not-available',
      source: normalizePagePath(targetRoot, parityPath),
      assetSource: '',
      issues: [`parity manifest does not declare canonicalSource.path for ${pageType}`],
    }
  }

  const canonicalPath = path.resolve(targetRoot, canonicalRelativePath)
  if (!isFilePath(canonicalPath)) {
    return {
      status: 'not-available',
      source: normalizePagePath(targetRoot, parityPath),
      assetSource: normalizePagePath(targetRoot, canonicalPath),
      issues: [`canonical asset file is missing: ${normalizePagePath(targetRoot, canonicalPath)}`],
    }
  }

  const canonicalRaw = readTextIfExists(canonicalPath)
  const failures = []
  expectTokensPresent(
    canonicalRaw,
    parity?.canonicalSource?.requiredTokens || [],
    `${pageType} canonical asset`,
    failures
  )
  expectTokensAbsent(
    canonicalRaw,
    parity?.canonicalSource?.forbiddenTokens || [],
    `${pageType} canonical asset`,
    failures
  )
  expectRegionOrder(
    canonicalRaw,
    parity?.canonicalSource?.requiredRegionOrder || [],
    `${pageType} canonical asset`,
    failures
  )

  if (failures.length === 0) {
    return {
      status: 'available',
      source: normalizePagePath(targetRoot, parityPath),
      assetSource: normalizePagePath(targetRoot, canonicalPath),
      issues: [],
    }
  }

  return {
    status: 'not-available',
    source: normalizePagePath(targetRoot, parityPath),
    assetSource: normalizePagePath(targetRoot, canonicalPath),
    issues: failures,
  }
}

function loadWebpackExposeBindings(targetRoot) {
  const webpackConfigPath = path.join(targetRoot, 'build', 'webpack.base.conf.js')
  const raw = readTextIfExists(webpackConfigPath)
  if (!raw) {
    return []
  }

  const bindings = []
  const exposeEntryPattern = /['"](\.\/[^'"]+)['"]\s*:\s*['"](\.\/[^'"]+)['"]/g
  let match = exposeEntryPattern.exec(raw)
  while (match) {
    bindings.push({
      exposeKey: match[1],
      targetPath: toPosixPath(match[2].replace(/^\.\//, '')),
      source: normalizePagePath(targetRoot, webpackConfigPath),
    })
    match = exposeEntryPattern.exec(raw)
  }

  return bindings
}

function detectStableRouteBindings(targetRoot, pageEntryPath) {
  const relativeEntryPath = normalizePagePath(targetRoot, pageEntryPath)
  const relativePageDir = normalizePagePath(targetRoot, path.dirname(pageEntryPath))
  const bindings = loadWebpackExposeBindings(targetRoot).filter((binding) => {
    const bindingTarget = toPosixPath(binding.targetPath)
    return (
      bindingTarget === relativePageDir ||
      bindingTarget === relativeEntryPath ||
      `${bindingTarget}/index` === relativeEntryPath.replace(/\.[^.]+$/, '') ||
      `${bindingTarget}/index.tsx` === relativeEntryPath ||
      `${bindingTarget}/index.ts` === relativeEntryPath ||
      `${bindingTarget}/index.jsx` === relativeEntryPath ||
      `${bindingTarget}/index.js` === relativeEntryPath
    )
  })

  return {
    routeCanStayStable: bindings.length > 0,
    bindings,
  }
}

function detectLegacyDriftSignals({ pageFiles, sourceCode, usesLegacyCarrier }) {
  if (!usesLegacyCarrier) {
    return []
  }

  const aggregateSource = pageFiles.map((file) => file.raw).join('\n')
  const signals = []
  const hasQueryFilter = /\bQueryFilter\b/.test(aggregateSource)
  const hasQueryActionButton = /<Button\b[\s\S]{0,240}>\s*查询\s*<\/Button>/.test(aggregateSource)
  const hasResetActionButton = /<Button\b[\s\S]{0,240}>\s*重置\s*<\/Button>/.test(aggregateSource)
  const hasTableSummaryShell = /\btable_toolbar\b/.test(aggregateSource) || /\btable_summary\b/.test(aggregateSource)
  const hasPaginationShellWrapper =
    /className=\{styles\.(?:pagination|paginationWrap|pagination_wrap|paginationContainer|pagination_container|tablePagination|table_pagination)\}/.test(
      aggregateSource
    )

  if (hasQueryFilter && (hasQueryActionButton || hasResetActionButton)) {
    signals.push('query-filter-not-governed')
  }

  if (!hasQueryFilter && /(SearchInput|DatePicker|<Button|<Input|<Select)/.test(aggregateSource)) {
    signals.push('manual-filter-bar')
  }

  if ((/<Pagination\b/.test(aggregateSource) || /\bPagination\b/.test(aggregateSource)) &&
    (hasTableSummaryShell || hasPaginationShellWrapper)) {
    signals.push('manual-pagination-shell')
  }

  if (/共\s*\{[^}]+\}\s*条/.test(aggregateSource) || /共\s+\d+\s+条/.test(aggregateSource)) {
    signals.push('manual-summary-strip')
  }

  if (hasTableSummaryShell && /<Table\b/.test(aggregateSource)) {
    signals.push('table-shell-rebuilt')
  }

  if (/<div>\s*<div className=\{styles\.page_root\}/s.test(sourceCode)) {
    signals.push('double-spacing-owner')
  }

  return Array.from(new Set(signals))
}

function exactOrIncluded(actualValue, expectedValue) {
  if (Array.isArray(expectedValue)) {
    return expectedValue.includes(actualValue)
  }
  return actualValue === expectedValue
}

function matchesRuleWhen(inputs, when = {}) {
  for (const [key, expectedValue] of Object.entries(when)) {
    if (key === 'anyAssetAvailable') {
      const actualValue =
        inputs.officialRuntimeSupport === 'available' || inputs.canonicalSupport === 'available'
      if (actualValue !== expectedValue) return false
      continue
    }

    if (key === 'legacyDriftSignalsMinCount') {
      if (inputs.legacyDriftSignals.length < Number(expectedValue || 0)) return false
      continue
    }

    if (key === 'legacyDriftSignalsMaxCount') {
      if (inputs.legacyDriftSignals.length > Number(expectedValue || 0)) return false
      continue
    }

    if (!exactOrIncluded(inputs[key], expectedValue)) {
      return false
    }
  }

  return true
}

function evaluateDecision(decisionMatrix, inputs) {
  const matchedRule =
    decisionMatrix.rules.find((rule) => matchesRuleWhen(inputs, rule.when || {})) || null
  const decisionId = matchedRule?.decision || 'legacy_hold'
  const decision = decisionMatrix.decisions?.[decisionId] || {
    label: decisionId,
    description: '',
    requiredNextAction: '',
  }

  return {
    matchedRuleId: matchedRule?.id || '',
    decisionId,
    decision,
    reasonCodes: Array.isArray(matchedRule?.reasonCodes) ? matchedRule.reasonCodes : [],
  }
}

function buildReasonDetails(reasonCodes = [], reasonCatalog = {}) {
  return reasonCodes.map((reasonCode) => ({
    code: reasonCode,
    detail: String(reasonCatalog?.[reasonCode] || '').trim(),
  }))
}

function collectExposedBusinessPageEntries(targetRoot) {
  const bindings = loadWebpackExposeBindings(targetRoot)
  const entryPaths = new Set()

  for (const binding of bindings) {
    const resolvedEntryPath = resolvePageEntryPath(targetRoot, binding.targetPath)
    if (resolvedEntryPath) {
      entryPaths.add(resolvedEntryPath)
    }
  }

  if (entryPaths.size > 0) {
    return Array.from(entryPaths)
  }

  const fallbackEntries = []
  for (const root of BUSINESS_PAGE_ROOTS) {
    const absoluteRoot = path.join(targetRoot, root)
    if (!pathExists(absoluteRoot)) continue

    const walk = (currentPath) => {
      const stat = (() => {
        try {
          return fs.statSync(currentPath)
        } catch {
          return null
        }
      })()
      if (!stat) return
      if (stat.isDirectory()) {
        for (const entry of listDirectoryEntriesSafe(currentPath)) {
          walk(path.join(currentPath, entry.name))
        }
        return
      }
      if (!/\/index\.(?:[cm]?[jt]sx?)$/.test(toPosixPath(currentPath))) return
      fallbackEntries.push(currentPath)
    }

    walk(absoluteRoot)
  }

  return Array.from(new Set(fallbackEntries))
}

export function defaultSkillRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
}

export function getLegacyTypicalPageMigrationChangeScopes() {
  return Array.from(CHANGE_SCOPE_VALUES)
}

export function getDefaultLegacyTypicalPageMigrationChangeScope() {
  return DEFAULT_CHANGE_SCOPE
}

export function loadLegacyTypicalPageMigrationDecision({ skillRoot = defaultSkillRoot() } = {}) {
  const decisionPath = path.join(skillRoot, 'rules', 'legacy-typical-page-migration-decision.json')
  const decisionMatrix = readJson(decisionPath)

  return {
    decisionPath,
    decisionMatrix,
  }
}

export function triageLegacyTypicalPage({
  targetRoot,
  pagePath,
  skillRoot = defaultSkillRoot(),
  changeScope = DEFAULT_CHANGE_SCOPE,
  breakGlassRequested = false,
}) {
  if (!CHANGE_SCOPE_VALUES.has(changeScope)) {
    throw new Error(
      `Unsupported --change-scope "${changeScope}". Expected one of: ${Array.from(CHANGE_SCOPE_VALUES).join(', ')}`
    )
  }

  const resolvedEntryPath = resolvePageEntryPath(targetRoot, pagePath)
  if (!resolvedEntryPath) {
    throw new Error(`Cannot resolve page entry for ${pagePath}`)
  }

  const pageDir = path.dirname(resolvedEntryPath)
  const relativeEntryPath = normalizePagePath(targetRoot, resolvedEntryPath)
  const relativePageDir = normalizePagePath(targetRoot, pageDir)
  const sourceCode = readTextIfExists(resolvedEntryPath)
  const pageFiles = collectPageDirectoryTextFiles(pageDir)
  const pageType = detectPageType(pageDir, sourceCode)
  const isTypicalPage = TYPICAL_PAGE_TYPES.has(pageType)
  const usesLegacyCarrier = detectLegacyCarrierUsage(sourceCode)
  const usesOfficialRuntimeEntry = detectOfficialRuntimeUsage(sourceCode)
  const usesCanonicalPage = detectCanonicalUsage(sourceCode)
  const hasHiuiPagegenMeta = pathExists(path.join(pageDir, 'hiui-pagegen.meta.json'))
  const { registryPath, data: officialRuntimeRegistry } = loadOfficialRuntimeRegistry(targetRoot)
  const officialRuntimeEntry = officialRuntimeRegistry?.[pageType]
  const officialRuntimeSupport = officialRuntimeEntry ? 'available' : 'not-available'
  const canonicalSupportInfo = detectCanonicalSupport(targetRoot, pageType)
  const canonicalSupport = canonicalSupportInfo.status
  const { routeCanStayStable, bindings } = detectStableRouteBindings(targetRoot, resolvedEntryPath)
  const legacyDriftSignals = detectLegacyDriftSignals({
    pageFiles,
    sourceCode,
    usesLegacyCarrier,
  })
  const legacyCandidate = Boolean(
    usesLegacyCarrier ||
      (isTypicalPage &&
        !hasHiuiPagegenMeta &&
        !usesOfficialRuntimeEntry &&
        !usesCanonicalPage)
  )
  const { decisionPath, decisionMatrix } = loadLegacyTypicalPageMigrationDecision({ skillRoot })
  const baseReport = {
    schemaVersion: 'legacy-typical-page-triage.v1',
    status: legacyCandidate ? 'legacy-candidate' : 'not_applicable',
    legacyCandidate,
    page: relativeEntryPath,
    pageDir: relativePageDir,
    pageType,
    isTypicalPage,
    changeScope,
    hasHiuiPagegenMeta,
    usesLegacyCarrier,
    usesOfficialRuntimeEntry,
    usesCanonicalPage,
    officialRuntimeSupport,
    canonicalSupport,
    routeCanStayStable,
    exposeBindings: bindings.map((binding) => ({
      exposeKey: binding.exposeKey,
      targetPath: binding.targetPath,
      source: binding.source,
    })),
    legacyDriftSignals,
    factsSource: {
      migrationDecisionRule: normalizePagePath(targetRoot, decisionPath),
      officialRuntimeRegistry: normalizePagePath(targetRoot, registryPath),
      canonicalSupportSource: canonicalSupportInfo.source,
      canonicalAssetSource: canonicalSupportInfo.assetSource,
    },
    analysis: {
      resolvedEntryPath: relativeEntryPath,
      anyAssetAvailable: officialRuntimeSupport === 'available' || canonicalSupport === 'available',
      breakGlassRequested: Boolean(breakGlassRequested),
      canonicalSupportIssues: canonicalSupportInfo.issues,
    },
  }

  if (!legacyCandidate) {
    return {
      ...baseReport,
      decision: 'not_applicable',
      decisionLabel: 'already on hiui-pagegen or outside legacy migration scope',
      decisionDescription:
        'this page no longer depends on the legacy carrier/write path, so legacy migration triage is informationally complete',
      matchedRuleId: '',
      requiredNextAction: 'none',
      reasonCodes: ['ALREADY_ON_NEW_FLOW'],
      reasonDetails: [
        {
          code: 'ALREADY_ON_NEW_FLOW',
          detail:
            'page already uses hiui-pagegen metadata or canonical/runtime assets, so legacy migration rules no longer apply',
        },
      ],
    }
  }

  const decisionInputs = {
    pagePath: relativeEntryPath,
    pageType,
    changeScope,
    isTypicalPage,
    hasHiuiPagegenMeta,
    usesLegacyCarrier,
    usesOfficialRuntimeEntry,
    usesCanonicalPage,
    officialRuntimeSupport,
    canonicalSupport,
    routeCanStayStable,
    legacyDriftSignals,
    breakGlassRequested: Boolean(breakGlassRequested),
  }
  const decisionResult = evaluateDecision(decisionMatrix, decisionInputs)

  return {
    ...baseReport,
    decision: decisionResult.decisionId,
    decisionLabel: decisionResult.decision.label,
    decisionDescription: decisionResult.decision.description,
    matchedRuleId: decisionResult.matchedRuleId,
    requiredNextAction: decisionResult.decision.requiredNextAction,
    reasonCodes: decisionResult.reasonCodes,
    reasonDetails: buildReasonDetails(decisionResult.reasonCodes, decisionMatrix.reasonCodes),
  }
}

export function collectLegacyTypicalPageMigrationCandidates({
  targetRoot,
  skillRoot = defaultSkillRoot(),
  changeScope = DEFAULT_CHANGE_SCOPE,
}) {
  return collectExposedBusinessPageEntries(targetRoot)
    .map((pageEntryPath) => {
      try {
        return triageLegacyTypicalPage({
          targetRoot,
          pagePath: pageEntryPath,
          skillRoot,
          changeScope,
        })
      } catch (error) {
        return {
          schemaVersion: 'legacy-typical-page-triage.v1',
          page: normalizePagePath(targetRoot, pageEntryPath),
          error: error instanceof Error ? error.message : String(error),
        }
      }
    })
    .filter((result) => {
      if (result.error) return true
      return Boolean(result.legacyCandidate)
    })
}

export function summarizeLegacyTypicalPageMigrationCandidate(result) {
  if (result.error) {
    return `${result.page} -> ${result.error}`
  }

  const driftSuffix =
    Array.isArray(result.legacyDriftSignals) && result.legacyDriftSignals.length > 0
      ? ` | drift=${result.legacyDriftSignals.join(', ')}`
      : ''
  return `${result.page} -> ${result.decision} (${result.pageType}; ${result.changeScope}; next=${result.requiredNextAction})${driftSuffix}`
}
