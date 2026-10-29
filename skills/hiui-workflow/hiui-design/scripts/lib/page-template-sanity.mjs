import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { collectRouteMountablePageExportViolations } from './page-export-contract.mjs'
import {
  isManagedLocalRuntimeImportSourceMatch,
  isManagedLocalRuntimeLogicalSource,
} from './managed-local-runtime-contract.mjs'
import { resolveManagedLocalRuntimeEmbeddedSourceSnapshot } from './managed-local-runtime-dependencies.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const skillRoot = path.resolve(scriptDir, '..', '..')
const managedLocalRuntimeDependencyContractPath = path.join(
  skillRoot,
  'docs',
  'onboarding',
  'managed-local-runtime-dependencies.json'
)
const managedLocalRuntimeSourcePackageName = (() => {
  try {
    const contract = JSON.parse(
      fs.readFileSync(managedLocalRuntimeDependencyContractPath, 'utf8')
    )
    return resolveManagedLocalRuntimeEmbeddedSourceSnapshot(contract).name || ''
  } catch {
    return ''
  }
})()

function normalizeImportSpecifier(value = '') {
  return String(value || '').trim().replace(/\\/g, '/')
}

function hasLegacyRuntimeSourcePackageToken(value = '') {
  return normalizeImportSpecifier(value).includes('runtime-source-package')
}

function isSourcePackagePrivateDistImport(source = '', packageName = '') {
  const normalizedSource = normalizeImportSpecifier(source)
  const normalizedPackageName = normalizeImportSpecifier(packageName)
  if (!normalizedSource) return false
  if (!normalizedPackageName) {
    return hasLegacyRuntimeSourcePackageToken(normalizedSource) && normalizedSource.includes('/dist/')
  }
  return normalizedSource.includes(`${normalizedPackageName}/dist/`)
}

export function includesToken(source, token) {
  return source.includes(token)
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function hasImportSource(source, importSource) {
  if (isManagedLocalRuntimeLogicalSource(importSource)) {
    const importPattern =
      /(?:^|\n)\s*import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g
    let match = importPattern.exec(source)

    while (match) {
      if (isManagedLocalRuntimeImportSourceMatch(match[1], importSource)) {
        return true
      }
      match = importPattern.exec(source)
    }

    return false
  }

  return new RegExp(`from\\s+['"]${escapeRegExp(importSource)}['"]`).test(source)
}

export function hasRequiredImportSymbol(source, importSource, symbol) {
  const importPattern = new RegExp(
    `(?:^|\\n)\\s*import\\s+([\\s\\S]*?)\\s+from\\s+['"]([^'"]+)['"]`,
    'g'
  )
  let match = importPattern.exec(source)

  while (match) {
    const matchesImportSource = isManagedLocalRuntimeLogicalSource(importSource)
      ? isManagedLocalRuntimeImportSourceMatch(match[2], importSource)
      : match[2] === importSource
    if (matchesImportSource && new RegExp(`\\b${escapeRegExp(symbol)}\\b`).test(match[1])) return true
    match = importPattern.exec(source)
  }

  return false
}

function getRequiredImportFallbackSources(requiredImport, symbol) {
  if (requiredImport?.source === 'local-managed-runtime' && symbol === 'TypicalPageFieldMapProvider') {
    return ['./field-map-provider']
  }

  return []
}

function hasRequiredImportSymbolWithFallback(source, requiredImport, symbol) {
  if (hasRequiredImportSymbol(source, requiredImport.source, symbol)) return true

  for (const importSource of getRequiredImportFallbackSources(requiredImport, symbol)) {
    if (hasRequiredImportSymbol(source, importSource, symbol)) return true
  }

  return false
}

function isRequiredImportSatisfiedByFallback(source, requiredImport) {
  const symbols = Array.isArray(requiredImport?.symbols) ? requiredImport.symbols : []
  if (symbols.length === 0) return false
  return symbols.every((symbol) => hasRequiredImportSymbolWithFallback(source, requiredImport, symbol))
}

export function resolveRequiredImports(contract = {}) {
  const requiredImports = Array.isArray(contract?.requiredImports)
    ? contract.requiredImports.map((item) => ({
        ...item,
        symbols: Array.isArray(item?.symbols) ? [...item.symbols] : item?.symbols,
      }))
    : []

  if (String(contract.visualImportMode || '').trim() !== 'split-alias') {
    return requiredImports
  }

  const visualRewritePlan = getVisualRewritePlan(contract)
  const rootImportSource = visualRewritePlan.rootImportSource
  const rewriteImportSourceBySymbol = new Map(
    visualRewritePlan.rewrites.map((entry) => [entry.symbolName, entry.importSource])
  )

  return requiredImports.flatMap((item) => {
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

export function countSchemaFields(source) {
  const matches = source.match(/\b[DFT]\(\s*['"]/g)
  return matches ? matches.length : 0
}

export function getFrameChildren(source, shellName) {
  const children = []
  let searchIndex = 0

  while (searchIndex < source.length) {
    const openIndex = source.indexOf(`<${shellName}`, searchIndex)
    if (openIndex < 0) break

    let braceDepth = 0
    let quote = ''
    let openTagEndIndex = -1

    for (let index = openIndex + shellName.length + 1; index < source.length; index += 1) {
      const char = source[index]
      const previousChar = source[index - 1]

      if (quote) {
        if (char === quote && previousChar !== '\\') quote = ''
        continue
      }

      if ((char === '"' || char === "'" || char === '`') && braceDepth > 0) {
        quote = char
        continue
      }

      if (char === '{') braceDepth += 1
      if (char === '}') braceDepth = Math.max(0, braceDepth - 1)

      if (char === '>' && braceDepth === 0) {
        openTagEndIndex = index
        break
      }
    }

    if (openTagEndIndex < 0) break

    if (source.slice(openIndex, openTagEndIndex).trimEnd().endsWith('/')) {
      searchIndex = openTagEndIndex + 1
      continue
    }

    const closeToken = `</${shellName}>`
    const closeIndex = source.indexOf(closeToken, openTagEndIndex + 1)
    if (closeIndex < 0) break

    children.push(source.slice(openTagEndIndex + 1, closeIndex))
    searchIndex = closeIndex + closeToken.length
  }

  return children
}

export function hasNonEmptyFrameChildren(source, shellName) {
  return getFrameChildren(source, shellName).some((children) => {
    const normalized = children
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim()
    return normalized.length > 0
  })
}

export function getStyleClassBlock(styleSource = '', className) {
  if (!styleSource || !className) return ''
  const pattern = new RegExp(`\\.${escapeRegExp(className)}\\s*\\{([\\s\\S]*?)\\}`, 'g')
  const match = pattern.exec(styleSource)
  return match?.[1] ?? ''
}

export function hasFlexMinHeightContract(block = '') {
  const normalized = block.replace(/\s+/g, ' ').toLowerCase()
  return (
    /flex\s*:\s*(?:1\s+1\s+0%|1\s+1\s+0|1)/.test(normalized) &&
    /min-height\s*:\s*0/.test(normalized) &&
    !/min-height\s*:\s*100vh/.test(normalized) &&
    !/overflow-y\s*:\s*auto/.test(normalized)
  )
}

export function hasRootFlexChain(source = '', styleSource = '') {
  const localRootClasses = ['pageRoot', 'detailPageRoot', 'whiteBody']
  const usedLocalRootClasses = localRootClasses.filter((className) => source.includes(`styles.${className}`))

  if (usedLocalRootClasses.length === 0) {
    return (
      source.includes('TablePageFrame') ||
      source.includes('StatListPageFrame') ||
      source.includes('TreeSplitPageFrame') ||
      source.includes('ProEditPage') ||
      source.includes('ProDetailPage')
    )
  }

  return usedLocalRootClasses.every((className) => hasFlexMinHeightContract(getStyleClassBlock(styleSource, className)))
}

export function hasAnalyticsSingleWorkspaceContract(source = '', styleSource = '') {
  const keepsManagedShell =
    source.includes('<StatListPageFrame') &&
    source.includes('statSection=')
  const keepsOptionalDetailTableInShell =
    !source.includes('tableFields=') ||
    (source.includes('tableFields=') && source.includes('tableProps='))
  const avoidsSplitWorkspace = !source.includes('customWhiteBody=') && !source.includes('customMainScroll=')
  const keepsDocumentFlowFooter =
    !styleSource ||
    !source.includes('tableFields=') ||
    /\.hi-v5-table-footer\)\s*\{[\s\S]*position\s*:\s*static/i.test(styleSource)

  return (
    keepsManagedShell &&
    keepsOptionalDetailTableInShell &&
    avoidsSplitWorkspace &&
    keepsDocumentFlowFooter &&
    hasRootFlexChain(source, styleSource)
  )
}

export function hasDataVisualizationGoldenPathContract(source = '') {
  const usesRealCharts =
    /from\s+['"]@ant-design\/charts['"]/.test(source) &&
    /<\s*(Line|Column|Bar|Pie|Area|DualAxes|Gauge|Radar|Liquid|Funnel)\b/.test(source)
  const usesLocalChartTheme =
    /from\s+['"]\.\/chart-theme['"]/.test(source) && source.includes('hiuiChartTokens')
  const usesMetricDataList =
    /\bsummaryMetrics\b/.test(source) || /\btranslatedMetrics\b/.test(source) || /\bmetrics\.map\b/.test(source)
  const usesSharedAnalyticsPrimitives =
    /from\s+['"][^'"]*analytics-primitives['"]/.test(source) &&
    /\bMetricCard\b/.test(source) &&
    /\bChartCard\b/.test(source)
  const usesLocalInlineCards =
    usesMetricDataList &&
    source.includes('chartCards') &&
    /function\s+MetricCard\b/.test(source) &&
    /function\s+ChartCard\b/.test(source)
  const usesUnifiedCards =
    usesMetricDataList &&
    source.includes('chartCards') &&
    (usesSharedAnalyticsPrimitives || usesLocalInlineCards)
  const avoidsLocalCardReimplementation =
    !usesSharedAnalyticsPrimitives ||
    (!/function\s+MetricCard\b/.test(source) && !/function\s+ChartCard\b/.test(source))
  const usesColumnLikeScale =
    !/<\s*Column\b/.test(source) || /\bcreateHiuiColumnLike(?:Color)?Scale\b/.test(source)
  const usesBarLikeScale =
    !/<\s*Bar\b/.test(source) || /\bcreateHiuiBarLike(?:Color)?Scale\b/.test(source)
  const avoidsMetricTopDecoration = !/function\s+MetricCard\b[\s\S]{0,800}\bborderTop\b/.test(source)

  return (
    usesRealCharts &&
    usesLocalChartTheme &&
    usesUnifiedCards &&
    avoidsLocalCardReimplementation &&
    usesColumnLikeScale &&
    usesBarLikeScale &&
    avoidsMetricTopDecoration
  )
}

export function hasDataVisualizationPlaceholderResidue(source = '') {
  return [
    /\bTODO\b/i,
    /\bplaceholders\b/i,
    /Resolve\s+chartCount/i,
    /占位图表/,
    /稍后替换/,
    /稍后接入/,
    /接口未接入/,
    /生成说明/,
    /测试说明/,
  ].some((pattern) => pattern.test(source))
}

export function hasPersistentBusinessNotice(source) {
  const noticeClassPattern = /className=\{?[^}\n]*styles\.notice|className=["'][^"']*notice/i
  const persistentNoticePattern = /<(?:div|section|p|span)\b[\s\S]{0,240}(?:当前展示为|前端典型页示例|需接入(?:文件服务|后端|接口)|接口未接入后启用|生成说明|测试说明)/
  const pageAdjustmentExplanationPattern =
    /function\s+Hiui5PageAdjustmentRegion\b|pageAdjustmentRetainedCharacteristics|pageAdjustmentValidationRules|pageAdjustmentDesignSystemConstraints|当前局部改造围绕「/u

  return (
    noticeClassPattern.test(source) ||
    persistentNoticePattern.test(source) ||
    pageAdjustmentExplanationPattern.test(source)
  )
}

export function appearsBefore(source, markers) {
  let lastIndex = -1

  for (const marker of markers) {
    const index = source.indexOf(marker)
    if (index < 0 || index <= lastIndex) return false
    lastIndex = index
  }

  return true
}

export function collectHiuiVisualImportViolations(
  source,
  sourceLabel = 'source',
  { additionalAllowedImportRoots = [] } = {}
) {
  const allowedHiuiImportRoots = new Set([
    '@hi-ui/hiui',
    '@hi-ui/icons',
    '@hi-ui/patch-for-react',
    '@hi-ui/schema-core',
    '@hi-ui/schema-form',
    '@hi-ui/schema-group',
    '@hi-ui/schema-table',
    '@hi-ui/schema-fields',
    '@hi-ui/schema-types',
    '@hi-ui/query-filter',
    '@hi-ui/use-ref-state',
    '@hi-ui/use-subscription',
    '@hi-ui/utility-types',
    ...additionalAllowedImportRoots,
  ])
  const violations = []
  const importPatterns = [
    /\bfrom\s+['"](@hi-ui\/[^'"]+)['"]/g,
    /\bimport\s+['"](@hi-ui\/[^'"]+)['"]/g,
    /\brequire\(\s*['"](@hi-ui\/[^'"]+)['"]\s*\)/g,
  ]

  for (const pattern of importPatterns) {
    let match = null
    while ((match = pattern.exec(source))) {
      const lineStart = source.lastIndexOf('\n', match.index) + 1
      const importPrefix = source.slice(lineStart, match.index)
      if (/\bimport\s+type\b/.test(importPrefix)) continue

      const importSource = match[1]
      const parts = importSource.split('/')
      const root = parts[0] === '@hi-ui' && parts[1] ? `${parts[0]}/${parts[1]}` : ''
      if (!root || allowedHiuiImportRoots.has(root)) continue
      violations.push(importSource)
    }
  }

  return [...new Set(violations)]
}

const HOST_GENERATION_ALIASABLE_HIUI_SYMBOL_PACKAGE_MAP = {
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
    rewrites: Object.entries(HOST_GENERATION_ALIASABLE_HIUI_SYMBOL_PACKAGE_MAP)
      .map(([symbolName, sourcePackage]) => ({
        symbolName,
        importSource: String(splitAliasMap[sourcePackage] || '').trim(),
      }))
      .filter((entry) => entry.symbolName && entry.importSource),
  }
}

function getSupportFileRewritePlan(contract = {}) {
  const rewritePlan = contract.hookRewritePlan
  if (rewritePlan && Array.isArray(rewritePlan.supportFileImports)) {
    return {
      supportFileImports: rewritePlan.supportFileImports
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
    supportFileImports: [
      {
        symbolName: String(contract.hookImportName || 'usePersistFn').trim() || 'usePersistFn',
        importSource: String(contract.hookImportSource || 'ahooks').trim(),
      },
      {
        symbolName: 'TextArea',
        importSource:
          String(splitAliasMap['@hi-ui/textarea'] || '').trim() || '@hi-ui/textarea',
      },
    ].filter((entry) => entry.importSource),
  }
}

function collectNamedImportSymbols(source = '', importSource = '') {
  if (!source || !importSource) return []

  const importPattern =
    /(?:^|\n)\s*import\s+\{([\s\S]*?)\}\s+from\s+['"]([^'"]+)['"]\s*;?/g
  const symbols = []
  let match = importPattern.exec(source)

  while (match) {
    if (match[2] !== importSource) {
      match = importPattern.exec(source)
      continue
    }

    for (const entry of match[1].split(',')) {
      const importedName = entry.split(/\s+as\s+/)[0]?.trim()
      if (importedName) {
        symbols.push(importedName)
      }
    }

    match = importPattern.exec(source)
  }

  return [...new Set(symbols)]
}

export function collectHostGenerationPageContractViolations({
  source = '',
  sourceLabel = 'source',
  contract = {},
}) {
  if (String(contract.visualImportMode || '').trim() !== 'split-alias') {
    return []
  }

  const visualRewritePlan = getVisualRewritePlan(contract)
  const rootImportSource = visualRewritePlan.rootImportSource
  const rewriteImportSourceBySymbol = new Map(
    visualRewritePlan.rewrites.map((entry) => [entry.symbolName, entry.importSource])
  )
  const rootImportSymbols = collectNamedImportSymbols(source, rootImportSource)
  const violations = []

  for (const symbolName of Object.keys(HOST_GENERATION_ALIASABLE_HIUI_SYMBOL_PACKAGE_MAP)) {
    const aliasImportSource = rewriteImportSourceBySymbol.get(symbolName) || ''
    if (!aliasImportSource) continue
    if (!rootImportSymbols.includes(symbolName)) continue

    violations.push(
      `${sourceLabel} keeps ${symbolName} on ${rootImportSource}; resolvedHostGenerationContract requires ${aliasImportSource}`
    )
  }

  return violations
}

export function collectHostGenerationSupportFileContractViolations({
  source = '',
  sourceLabel = 'support file',
  contract = {},
  supportFileImportContract = {},
}) {
  const hookImportMode = String(contract.hookImportMode || '').trim()
  const visualImportMode = String(contract.visualImportMode || '').trim()
  if (hookImportMode !== 'isolated-alias' && visualImportMode !== 'split-alias') {
    return []
  }

  const supportFileRewritePlan = getSupportFileRewritePlan(contract)
  const expectedHookImportName = String(
    supportFileImportContract.hookImportName ||
      contract.hookImportName ||
      'usePersistFn'
  ).trim()
  const hookImportPlan = supportFileRewritePlan.supportFileImports.find(
    (entry) =>
      entry.symbolName === expectedHookImportName ||
      entry.symbolName === 'usePersistFn' ||
      entry.symbolName === 'useMemoizedFn'
  )
  const textAreaPlan = supportFileRewritePlan.supportFileImports.find(
    (entry) => entry.symbolName === 'TextArea'
  )

  const expectedHookImportSource = String(
    supportFileImportContract.hookImportSource ||
      hookImportPlan?.importSource ||
      contract.hookImportSource ||
      ''
  ).trim()
  const expectedTextAreaImportSource = String(
    supportFileImportContract.textAreaImportSource || textAreaPlan?.importSource || ''
  ).trim()
  const violations = []

  if (hookImportMode === 'isolated-alias' && expectedHookImportSource) {
    if (!hasRequiredImportSymbol(source, expectedHookImportSource, expectedHookImportName)) {
      violations.push(
        `${sourceLabel} must import ${expectedHookImportName} from ${expectedHookImportSource}`
      )
    }
    if (
      expectedHookImportSource !== 'ahooks' &&
      hasRequiredImportSymbol(source, 'ahooks', expectedHookImportName)
    ) {
      violations.push(
        `${sourceLabel} still imports ${expectedHookImportName} from ahooks; resolvedHostGenerationContract requires ${expectedHookImportSource}`
      )
    }
  }

  if (visualImportMode === 'split-alias' && expectedTextAreaImportSource) {
    if (!hasImportSource(source, expectedTextAreaImportSource)) {
      violations.push(
        `${sourceLabel} must import TextArea from ${expectedTextAreaImportSource}`
      )
    }
    if (
      expectedTextAreaImportSource !== '@hi-ui/textarea' &&
      hasImportSource(source, '@hi-ui/textarea')
    ) {
      violations.push(
        `${sourceLabel} still imports TextArea from @hi-ui/textarea; resolvedHostGenerationContract requires ${expectedTextAreaImportSource}`
      )
    }
  }

  return violations
}

export function collectDangerousPropViolations({ pageType, contract, source, sourceLabel = 'source' }) {
  const dangerousProps = contract.slotBoundaryContract?.dangerousProps ?? []
  const violations = []

  for (const propName of dangerousProps) {
    if (!propName) continue

    if (propName === 'children') {
      const shellName = contract.requiredShell || pageType.shell
      const hasChildrenProp = new RegExp(`\\bchildren\\s*=`).test(source)
      const hasShellChildren = shellName ? hasNonEmptyFrameChildren(source, shellName) : false
      if (hasChildrenProp || hasShellChildren) {
        violations.push(`${pageType.id}: ${sourceLabel} uses dangerous prop or slot ${propName}; use manifest allowed slots instead`)
      }
      continue
    }

    if (new RegExp(`\\b${escapeRegExp(propName)}\\s*=`).test(source)) {
      violations.push(`${pageType.id}: ${sourceLabel} uses dangerous prop ${propName}; route uncovered UI through hiui-design guidance first`)
    }
  }

  return violations
}

export function collectForbiddenSlotViolations({ pageType, contract, source, sourceLabel = 'source' }) {
  const forbiddenSlots = contract.slotBoundaryContract?.forbiddenSlots ?? []
  const violations = []

  for (const slotName of forbiddenSlots) {
    if (!slotName) continue
    if (new RegExp(`\\b${escapeRegExp(slotName)}\\s*=`).test(source)) {
      violations.push(`${pageType.id}: ${sourceLabel} uses forbidden slot ${slotName}; keep the managed region owner from the page type`)
    }
  }

  return violations
}

export function collectVisualTokenViolations({ pageType, contract, styleSource = '', sourceLabel = 'style' }) {
  if (!styleSource || !Array.isArray(contract.localStyleAllowlist)) return []

  const allowlist = new Set(contract.localStyleAllowlist)
  const visualPropertyPattern = /(^|[;{\n])\s*([a-zA-Z-]+)\s*:/g
  const visualValuePattern = /#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(/g
  const guardedProperties = new Set([
    'color',
    'background',
    'background-color',
    'font-size',
    'line-height',
    'border-radius',
    'box-shadow',
    'border',
    'border-color',
  ])
  const violations = []
  let match = null

  while ((match = visualPropertyPattern.exec(styleSource))) {
    const propertyName = match[2]
    if (allowlist.has(propertyName)) continue
    if (guardedProperties.has(propertyName)) {
      violations.push(`${pageType.id}: ${sourceLabel} declares visual token property ${propertyName}; use HiUI5 component or shell token source`)
    }
  }

  while ((match = visualValuePattern.exec(styleSource))) {
    violations.push(`${pageType.id}: ${sourceLabel} declares raw visual token value ${match[0]}; use HiUI5 component or documented token source`)
  }

  return [...new Set(violations)]
}

const FORBIDDEN_GLOBAL_BASELINE_SELECTORS = [
  ':root',
  'html',
  'body',
  '#root',
  '#app',
  '#__next',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]

function splitSelectorList(selectorText = '') {
  const selectors = []
  let current = ''
  let parenDepth = 0
  let bracketDepth = 0
  let quote = ''

  for (let index = 0; index < selectorText.length; index += 1) {
    const char = selectorText[index]
    const previousChar = selectorText[index - 1]

    if (quote) {
      current += char
      if (char === quote && previousChar !== '\\') quote = ''
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      current += char
      continue
    }

    if (char === '(') parenDepth += 1
    if (char === ')') parenDepth = Math.max(0, parenDepth - 1)
    if (char === '[') bracketDepth += 1
    if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1)

    if (char === ',' && parenDepth === 0 && bracketDepth === 0) {
      if (current.trim()) selectors.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  if (current.trim()) selectors.push(current.trim())
  return selectors
}

function isForbiddenGlobalBaselineSelector(selector = '') {
  const normalized = String(selector || '').trim().toLowerCase().replace(/\s+/g, ' ')
  if (!normalized) return false

  return FORBIDDEN_GLOBAL_BASELINE_SELECTORS.some((token) => {
    const suffixPattern = '(?:::[a-z-]+|:[a-z-]+(?:\\([^)]*\\))?)*'
    return new RegExp(`^${escapeRegExp(token)}${suffixPattern}$`).test(normalized)
  })
}

function hasForbiddenRootBaselineSelector(selector = '') {
  const normalized = String(selector || '').trim().toLowerCase()
  if (!normalized) return false

  return /(^|[\s>+~,(])(?::(?:global|where|is|matches)\(\s*)?(?::root|html|body|#root|#app|#__next)(?:\s*\))?(?=$|[\s>+~.[#:,(])/i.test(
    normalized
  )
}

function hasForbiddenLeadingHeadingSelector(selector = '') {
  const normalized = String(selector || '').trim().toLowerCase()
  if (!normalized) return false

  return /^\s*(?::(?:global|where|is|matches)\(\s*)?h[1-6](?:\s*\))?(?=$|[\s>+~.[#:,(])/i.test(normalized)
}

export function collectGlobalTypographyBaselineSelectorViolations({
  pageType,
  styleSource = '',
  sourceLabel = 'style',
}) {
  if (!styleSource) return []

  const violations = []
  const blockPattern = /([^{}]+)\{[^{}]*\}/g
  let match = null

  while ((match = blockPattern.exec(styleSource))) {
    const selectorText = match[1] ?? ''
    const selectors = splitSelectorList(selectorText)

    for (const selector of selectors) {
      const shouldFlag =
        isForbiddenGlobalBaselineSelector(selector) ||
        hasForbiddenRootBaselineSelector(selector) ||
        hasForbiddenLeadingHeadingSelector(selector)
      if (!shouldFlag) continue
      violations.push(
        `${pageType.id}: ${sourceLabel} declares global typography baseline selector ${selector}; keep typography baseline ownership in TypicalPageHost/host-reset.css instead of business page styles`
      )
    }
  }

  return [...new Set(violations)]
}

export function collectSemanticPseudoComponentViolations({ pageType, source, sourceLabel = 'source' }) {
  const violations = []
  const pseudoComponentPattern = /<\s*(span|div)\b[^>]*className=\{?[^>\n]*(?:tag|badge|status|chip|statCard|metricCard)[^>]*>/gi
  let match = null

  while ((match = pseudoComponentPattern.exec(source))) {
    violations.push(
      `${pageType.id}: ${sourceLabel} uses ${match[1]} with tag/badge/status/chip/card semantics; use hiui5 component or manifest-registered component`
    )
  }

  return [...new Set(violations)]
}

export function collectPreviewReferenceViolations({ pageType, source, sourceLabel = 'source' }) {
  const violations = []
  const forbiddenPreviewMarkers = [
    {
      token: 'createTypicalPagePreviewRoutes',
      reason: 'preview route factory',
    },
    {
      token: 'typicalPagePreviewRoutes',
      reason: 'preview route tree',
    },
    {
      token: 'ExampleAppShell',
      reason: 'preview app shell',
    },
    {
      token: '__typical-preview',
      reason: 'preview-only route mount',
    },
  ]

  for (const marker of forbiddenPreviewMarkers) {
    if (source.includes(marker.token)) {
      violations.push(
        `${pageType.id}: ${sourceLabel} references ${marker.reason} ${marker.token}; business page output must stay independent from preview routing assets`
      )
    }
  }

  const previewImportPattern = /\b(?:from|import)\s+['"][^'"]*typical-page-preview[^'"]*['"]/g
  let match = null
  while ((match = previewImportPattern.exec(source))) {
    violations.push(
      `${pageType.id}: ${sourceLabel} imports preview asset path ${match[0]}; preview assets are reference-only and must not be imported by business page output`
    )
  }

  return [...new Set(violations)]
}

export function validateLightSanityCheck({ pageType, source, styleSource = '', check, copyMode = '' }) {
  if (check.startsWith('forbidden-frame-children:')) {
    const shell = check.slice('forbidden-frame-children:'.length)
    return shell ? !hasNonEmptyFrameChildren(source, shell) : null
  }

  if (check.startsWith('required-shell:')) {
    const shell = check.slice('required-shell:'.length)
    return includesToken(source, `<${shell}`) || includesToken(source, `${shell}(`)
  }

  if (check.startsWith('required-symbol:')) {
    const symbolPath = check.slice('required-symbol:'.length)
    const [symbol] = symbolPath.split('.')
    return includesToken(source, symbol)
  }

  if (check.startsWith('required-provider:')) {
    const provider = check.slice('required-provider:'.length)
    return includesToken(source, `<${provider}`)
  }

  if (check.startsWith('field-count-max:')) {
    const maxCount = Number(check.slice('field-count-max:'.length))
    return Number.isFinite(maxCount) && countSchemaFields(source) <= maxCount
  }

  switch (check) {
    case 'required-tree-column':
      return source.includes('renderTreeTableTextEllipsis') || source.includes('treeSwitcherCol')
    case 'required-tree-first-column':
      return source.includes('renderTreeTableTextEllipsis') || source.includes('treeSwitcherCol')
    case 'required-left-tree-slot':
      return source.includes('leftPane=') && (source.includes('<Tree') || source.includes('Tree\n'))
    case 'required-right-table-slot':
      return source.includes('tableFields=') && source.includes('queryFields=')
    case 'required-left-pane-boundary':
      return source.includes('leftPane=') && !source.includes('<PageTable') && !source.includes('<TablePageFrame')
    case 'required-split-region-owner':
      return source.includes('<TreeSplitPageFrame') && source.includes('leftPane=') && source.includes('queryFields=') && source.includes('tableFields=')
    case 'required-drawer-root-class':
      return source.includes('ProFormDrawer') || source.includes('ProDetailDrawer')
    case 'required-drawer-certified-schema-subtree':
      return (
        source.includes('<TypicalPageFieldMapProvider>') &&
        source.includes('<CertifiedDrawerSchemaForm') &&
        source.includes('drawerSchemaFormProps')
      )
    case 'required-drawer-footer':
      return source.includes('ProDrawerFooterActions') || source.includes('footer=')
    case 'required-drawer-footer-owner':
      return source.includes('ProDrawerFooterActions') && !source.includes('Drawer.Footer')
    case 'forbidden-drawer-card-body':
      return !source.includes('Card + Form') && !/<Card\b/.test(source)
    case 'required-detail-drawer-body-owner':
      return source.includes('ProDetailDrawerBody')
    case 'forbidden-drawer-card-detail':
      return !source.includes('Card + Descriptions') && !/<Card\b/.test(source)
    case 'required-grouped-detail-sections':
      return source.includes('GroupMapProvider') && source.includes('SchemaGroup') && source.includes('G(')
    case 'required-detail-summary-section':
      return source.includes('.Custom({') || source.includes('.Custom(')
    case 'required-detail-data-table-section':
      return source.includes('SchemaTableBridge') && (source.includes('.Table({') || source.includes('.Table('))
    case 'required-stat-section-owner':
      return /statSection=\{\s*<(?:StatOverviewGrid|MetricOverviewGrid)\b/.test(source)
    case 'required-root-flex-chain':
      return hasRootFlexChain(source, styleSource)
    case 'required-white-body-fill-contract':
      return !hasPersistentBusinessNotice(source) && !source.includes('min-height: 100vh') && !source.includes('overflow-y: auto')
    case 'required-analytics-single-workspace':
      return hasAnalyticsSingleWorkspaceContract(source, styleSource)
    case 'required-data-visualization-golden-path':
      return hasDataVisualizationGoldenPathContract(source)
    case 'forbidden-data-visualization-placeholder-residue':
      return !hasDataVisualizationPlaceholderResidue(source)
    case 'forbidden-business-notice-ui':
      return !hasPersistentBusinessNotice(source)
    case 'required-edit-page-structure-order':
      return appearsBefore(source, ['<PageHeader', 'formScrollBody', 'inlineEditFooter'])
    case 'required-edit-header-before-shell':
      return (
        source.includes('<PageHeader') &&
        source.includes('<ProEditPage') &&
        source.indexOf('<PageHeader') < source.indexOf('<ProEditPage')
      )
    case 'required-edit-footer-owner':
      return source.includes('proEditPageShellStyles.inlineEditFooter')
    case 'required-edit-form-bridge':
      return source.includes('<Form') && !source.includes('SchemaForm') && !source.includes('mapToDumb')
    case 'required-detail-page-region-owner':
      return (
        source.includes('ProDetailPage') &&
        source.includes('<PageHeader') &&
        (source.includes('SchemaGroup') || source.includes('GroupMapProvider') || source.includes('G('))
      )
    case 'forbidden-duplicate-page-header': {
      const matches = source.match(/<PageHeader\b/g) || []
      return matches.length <= 1
    }
    case 'forbidden-legacy-hiui4':
      return !source.includes('hi-v4-') && !source.includes('--hi-v4-')
    case 'forbidden-inline-query-filter-label':
      return !source.includes('showLabel={true}')
    case 'forbidden-private-shell-import':
      return (
        !isSourcePackagePrivateDistImport(source, managedLocalRuntimeSourcePackageName) &&
        !source.includes('node_modules/.pnpm')
      )
    case 'forbidden-tree-split-shell':
      return pageType.id === 'tree-split' || !source.includes('TreeSplitPageFrame')
    case 'forbidden-footer-portal':
      return !source.includes('TypicalPageFooterPortal') && !source.includes('PageFooterPortal')
    case 'forbidden-extra-form-root-padding':
      return !source.includes("padding: '20px 20px 0'") && !source.includes('padding: "20px 20px 0"')
    case 'forbidden-feedback-white-body-padding':
      return (
        !/const\s+whiteBodyStyle\s*=\s*\{[\s\S]*?\bpadding\s*:\s*20\b/.test(source) &&
        !/className=\{styles\.whiteBody\}\s+style=\{\{[\s\S]*?\bpadding\s*:\s*20\b/.test(source)
      )
    default:
      return null
  }
}

export function collectPageSourceSanityViolations({ pageType, contract, source, styleSource = '', sourceLabel = 'source', copyMode = '' }) {
  const violations = []
  const shouldEnforceGenerationGuidance = Boolean(contract.managedCoverage || contract.generationGuidanceRef)
  const resolvedRequiredImports = resolveRequiredImports(contract)

  violations.push(
    ...collectRouteMountablePageExportViolations(source, contract.moduleExportContract, {
      sourceLabel,
    }).map((violation) => `${pageType.id}: ${violation}`)
  )

  const hiuiVisualImportViolations = collectHiuiVisualImportViolations(source, sourceLabel)
  for (const importSource of hiuiVisualImportViolations) {
    violations.push(
      `${pageType.id}: ${sourceLabel} imports HiUI visual package ${importSource}; use local-managed-runtime or certified HiUI5 aliases instead`
    )
  }

  for (const requiredImport of resolvedRequiredImports) {
    if (
      !hasImportSource(source, requiredImport.source) &&
      !isRequiredImportSatisfiedByFallback(source, requiredImport)
    ) {
      violations.push(`${pageType.id}: ${sourceLabel} missing import source ${requiredImport.source}`)
      continue
    }

    for (const symbol of requiredImport.symbols ?? []) {
      if (!hasRequiredImportSymbolWithFallback(source, requiredImport, symbol)) {
        violations.push(`${pageType.id}: ${sourceLabel} missing import symbol ${symbol} from ${requiredImport.source}`)
      }
    }
  }

  for (const forbiddenToken of contract.forbiddenTokens ?? []) {
    if (source.includes(forbiddenToken)) {
      violations.push(`${pageType.id}: ${sourceLabel} contains forbidden token ${forbiddenToken}`)
    }
  }

  for (const sanityCheck of contract.lightSanityChecks ?? []) {
    const ok = validateLightSanityCheck({ pageType, source, styleSource, check: sanityCheck, copyMode })
    if (ok === null) {
      violations.push(`${pageType.id}: unsupported lightSanityCheck ${sanityCheck}`)
    } else if (!ok) {
      violations.push(`${pageType.id}: ${sourceLabel} fails lightSanityCheck ${sanityCheck}`)
    }
  }

  if (shouldEnforceGenerationGuidance) {
    violations.push(...collectDangerousPropViolations({ pageType, contract, source, sourceLabel }))
    violations.push(...collectForbiddenSlotViolations({ pageType, contract, source, sourceLabel }))
    violations.push(...collectVisualTokenViolations({ pageType, contract, styleSource, sourceLabel: `${sourceLabel} style` }))
    violations.push(...collectSemanticPseudoComponentViolations({ pageType, source, sourceLabel }))
  }
  violations.push(...collectGlobalTypographyBaselineSelectorViolations({ pageType, styleSource, sourceLabel: `${sourceLabel} style` }))
  violations.push(...collectPreviewReferenceViolations({ pageType, source, sourceLabel }))

  return violations
}
