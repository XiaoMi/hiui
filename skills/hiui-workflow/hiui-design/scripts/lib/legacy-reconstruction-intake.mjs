import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import {
  detectBusinessEntryEvidence,
  normalizeRelativePath,
  tokenizeBusinessEntryText,
} from './business-entry-evidence.mjs'
import { loadPageTypeManifest } from './load-page-type-manifest.mjs'

const LEGACY_HARD_PATTERNS = [
  /旧页面重构/u,
  /旧页重构/u,
  /旧系统重构/u,
  /旧页改造/u,
  /旧系统改造/u,
  /legacy[-\s]?system/u,
  /legacy[-\s]?page/u,
]

const LEGACY_CONTEXT_PATTERNS = [
  /旧页面/u,
  /旧页/u,
  /旧系统/u,
  /存量页面/u,
  /老页面/u,
  /历史页面/u,
  /\blegacy\b/iu,
  /\bexisting\s+page\b/iu,
]

const REFACTOR_PATTERNS = [
  /重构/u,
  /改造/u,
  /升级/u,
  /迁移/u,
  /翻新/u,
  /\brefactor\b/iu,
  /\bmigrate\b/iu,
  /\brebuild\b/iu,
]

const PRESERVE_PATTERNS = [
  /保留/u,
  /沿用/u,
  /不改接口/u,
  /接口不变/u,
  /路由不变/u,
  /交互不变/u,
  /权限不变/u,
  /样式升级/u,
  /视觉升级/u,
]

const QUERY_MARKERS = [/QueryFilter/u, /\bsearch\b/iu, /\bfilter\b/iu, /查询/u, /筛选/u]
const TABLE_MARKERS = [
  /\bPageTable\b/u,
  /\bTable\b/u,
  /\bProTable\b/u,
  /\bcolumns\b/u,
  /tableFields/u,
  /列表/u,
  /表格/u,
]
const PAGINATION_MARKERS = [/\bPagination\b/u, /\bpageSize\b/u, /\bcurrentPage\b/u, /分页/u]
const FORM_MARKERS = [/<Form\b/u, /<FormItem\b/u, /\bForm\.Item\b/u]
const DETAIL_LAYOUT_MARKERS = [
  /<Descriptions\b/u,
  /\bdetailSections\b/u,
  /\bdetailFields\b/u,
  /\bDetailSection\b/u,
  /\bDetailCard\b/u,
  /\bPageDetail\b/u,
]
const STAT_MARKERS = [/\bStatOverviewGrid\b/u, /\bsummaryMetrics\b/u, /指标/u, /统计/u]
const CHART_MARKERS = [
  /\bchartCards\b/u,
  /\bchartModules\b/u,
  /\bchartType\b/u,
  /\bECharts?\b/u,
  /<Chart\b/u,
  /<LineChart\b/u,
  /<BarChart\b/u,
  /<PieChart\b/u,
  /\bChartCard\b/u,
  /图表/u,
]

const SECTION_TO_LAYOUT_FACT = {
  pageHeader: 'header',
  statSection: 'stat-section',
  chartSection: 'chart-section',
  queryFilter: 'query-filter',
  table: 'table',
  pagination: 'pagination',
  form: 'form',
  detail: 'detail',
  drawer: 'drawer',
}

function normalizeString(value) {
  return String(value || '').trim()
}

function uniqueStrings(values) {
  const seen = new Set()
  const items = []

  for (const value of values || []) {
    const normalized = normalizeString(value)
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    items.push(normalized)
  }

  return items
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function countSharedTokens(leftTokens, rightTokens) {
  const rightSet = new Set((rightTokens || []).map((item) => normalizeString(item).toLowerCase()).filter(Boolean))
  let count = 0

  for (const token of leftTokens || []) {
    const normalized = normalizeString(token).toLowerCase()
    if (normalized && rightSet.has(normalized)) count += 1
  }

  return count
}

function findBalancedBlock(source, openIndex, { openChar = '{', closeChar = '}' } = {}) {
  if (openIndex < 0 || source[openIndex] !== openChar) return null

  let depth = 0
  let quote = ''
  let escaped = false
  const contentStart = openIndex + 1

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index]

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

    if (char === '\'' || char === '"' || char === '`') {
      quote = char
      continue
    }

    if (char === openChar) {
      depth += 1
      continue
    }

    if (char === closeChar) {
      depth -= 1
      if (depth === 0) {
        return {
          openIndex,
          closeIndex: index,
          body: source.slice(contentStart, index),
        }
      }
    }
  }

  return null
}

function findLegacyExpressionEnd(source = '', startIndex = 0) {
  let depthParen = 0
  let depthBracket = 0
  let depthBrace = 0
  let quote = ''
  let escaped = false

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index]

    if (quote) {
      if (escaped) {
        escaped = false
        continue
      }
      if (char === '\\') {
        escaped = true
        continue
      }
      if (char === quote) quote = ''
      continue
    }

    if (char === '\'' || char === '"' || char === '`') {
      quote = char
      continue
    }

    if (char === '(') {
      depthParen += 1
      continue
    }
    if (char === ')') {
      depthParen = Math.max(0, depthParen - 1)
      continue
    }
    if (char === '[') {
      depthBracket += 1
      continue
    }
    if (char === ']') {
      depthBracket = Math.max(0, depthBracket - 1)
      continue
    }
    if (char === '{') {
      depthBrace += 1
      continue
    }
    if (char === '}') {
      depthBrace = Math.max(0, depthBrace - 1)
      continue
    }

    const atTopLevel = depthParen === 0 && depthBracket === 0 && depthBrace === 0
    if (!atTopLevel) continue

    if (char === ';') return index
    if (char !== '\n') continue

    const remainder = source.slice(index + 1)
    if (/^\s*(?:export\s+)?(?:const|let|var|function)\s+[A-Za-z_$]/u.test(remainder)) {
      return index
    }
    if (/^\s*(?:return\b|if\s*\(|for\s*\(|while\s*\(|switch\s*\(|\})/u.test(remainder)) {
      return index
    }
    if (/^\s*$/.test(remainder)) return index
  }

  return source.length
}

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

function isPathInsideRoot(relativePath, rootPath) {
  const normalizedPath = normalizeRelativePath(relativePath)
  const normalizedRoot = normalizeRelativePath(rootPath)
  return normalizedPath === normalizedRoot || normalizedPath.startsWith(`${normalizedRoot}/`)
}

function stripScriptModuleExtension(value) {
  return normalizeRelativePath(value).replace(/\.(?:[cm]?[jt]sx?)$/, '').replace(/\/index$/, '')
}

function shouldIncludeLegacyCompanionCodePath(relativePath) {
  const normalizedPath = normalizeRelativePath(relativePath)
  if (!normalizedPath) return false
  if (!/\.(?:[cm]?[jt]sx?)$/i.test(normalizedPath)) return false
  if (/(^|\/)detail(\/|$)/i.test(normalizedPath)) return false
  if (/(^|\/)edit(\/|$)/i.test(normalizedPath)) return false
  const baseName = stripScriptModuleExtension(path.posix.basename(normalizedPath))
  if (/(^|[-_.])(detail|edit)([-_.]|$)/i.test(baseName)) return false
  if (/(Drawer|Modal|Dialog)\.(?:[cm]?[jt]sx?)$/i.test(normalizedPath)) return false
  return true
}

function isManagedLegacyGeneratedSource(source = '') {
  const normalizedSource = String(source || '')
  if (!normalizedSource) return false

  return (
    /(local-managed-runtime\/pro-table-page|components\/hiui-design-runtime\/pro-table-page)/u.test(
      normalizedSource
    ) &&
    /TypicalPageFieldMapProvider/u.test(normalizedSource) &&
    /PageOwnedMountBoundary/u.test(normalizedSource)
  )
}

function extractRelativeImportSpecifiers(source = '') {
  const specifiers = []
  const patterns = [
    /import[\s\S]*?from\s+['"]([^'"]+)['"]/g,
    /export\s+(?:\*|\{[\s\S]*?\})\s+from\s+['"]([^'"]+)['"]/g,
  ]

  for (const pattern of patterns) {
    pattern.lastIndex = 0
    let match = pattern.exec(source)
    while (match) {
      const specifier = normalizeString(match[1])
      if (specifier.startsWith('.')) specifiers.push(specifier)
      match = pattern.exec(source)
    }
  }

  return uniqueStrings(specifiers)
}

function extractJsxTagBlocks(source = '', tagName = '') {
  const blocks = []
  const normalizedTagName = normalizeString(tagName)
  if (!normalizedTagName) return blocks

  const openToken = `<${normalizedTagName}`
  let searchStart = 0

  while (searchStart < source.length) {
    const openIndex = source.indexOf(openToken, searchStart)
    if (openIndex < 0) break

    let index = openIndex + openToken.length
    let quote = ''
    let escaped = false
    let braceDepth = 0
    let closeIndex = -1

    for (; index < source.length; index += 1) {
      const char = source[index]

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

      if (char === '\'' || char === '"' || char === '`') {
        quote = char
        continue
      }

      if (char === '{') {
        braceDepth += 1
        continue
      }

      if (char === '}') {
        braceDepth = Math.max(0, braceDepth - 1)
        continue
      }

      if (braceDepth === 0 && source.startsWith('/>', index)) {
        closeIndex = index + 2
        break
      }

      if (braceDepth === 0 && source.startsWith(`</${normalizedTagName}>`, index)) {
        closeIndex = index + normalizedTagName.length + 3
        break
      }
    }

    if (closeIndex < 0) break

    blocks.push({
      index: openIndex,
      block: source.slice(openIndex, closeIndex),
    })
    searchStart = closeIndex
  }

  return blocks
}

function buildManagedDestImportHints(dest) {
  const normalizedDest = stripScriptModuleExtension(dest)
  if (!normalizedDest) return []

  const hints = [
    normalizedDest,
    `./${normalizedDest}`,
  ]

  if (normalizedDest.startsWith('src/')) {
    hints.push(`@/${normalizedDest.slice(4)}`)
  }

  return uniqueStrings(hints)
}

function sourceContainsManagedDestImport(source, managedDestImportHints = []) {
  return managedDestImportHints.some((hint) =>
    new RegExp(`from\\s+['"]${escapeRegExp(hint)}(?:/index)?['"]`).test(source)
  )
}

function isThinReExportSource(source, managedDestImportHints = []) {
  const lines = String(source || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return false

  const reExportPattern = /^export\s+(?:\*|\{[\s\S]*\})\s+from\s+['"][^'"]+['"];?$/
  if (!lines.every((line) => reExportPattern.test(line))) return false
  if (managedDestImportHints.length === 0) return true

  return lines.some((line) =>
    managedDestImportHints.some((hint) =>
      new RegExp(`['"]${escapeRegExp(hint)}(?:/index)?['"]`).test(line)
    )
  )
}

async function walkCodeFiles(rootDir, onFile) {
  let entries = []
  try {
    entries = await fs.readdir(rootDir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    const absolutePath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      await walkCodeFiles(absolutePath, onFile)
      continue
    }

    if (!/\.(?:[cm]?[jt]sx?)$/.test(entry.name)) continue
    await onFile(absolutePath)
  }
}

async function findLegacyWrapperCandidates(targetRoot, dest) {
  const candidates = []
  const managedDestImportHints = buildManagedDestImportHints(dest)
  if (managedDestImportHints.length === 0) return candidates

  await walkCodeFiles(path.join(targetRoot, 'src'), async (absolutePath) => {
    const relativePath = normalizeRelativePath(path.relative(targetRoot, absolutePath))
    if (!relativePath || isPathInsideRoot(relativePath, dest)) return

    const source = await readTextIfExists(absolutePath)
    if (!source || !sourceContainsManagedDestImport(source, managedDestImportHints)) return

    candidates.push({
      relativePath,
      source,
    })
  })

  return candidates
}

function readGitHistorySource(targetRoot, relativePath, managedDestImportHints = []) {
  const logResult = spawnSync(
    'git',
    ['log', '--format=%H', '--follow', '--', relativePath],
    {
      cwd: targetRoot,
      encoding: 'utf8',
    }
  )

  if ((logResult.status ?? 1) !== 0) return null
  const commits = uniqueStrings(String(logResult.stdout || '').split('\n'))

  for (const commit of commits) {
    const showResult = spawnSync(
      'git',
      ['show', `${commit}:${relativePath}`],
      {
        cwd: targetRoot,
        encoding: 'utf8',
      }
    )
    if ((showResult.status ?? 1) !== 0) continue

    const source = String(showResult.stdout || '')
    if (!source.trim()) continue
    if (isThinReExportSource(source, managedDestImportHints)) continue

    return {
      commit,
      source,
    }
  }

  return null
}

function collectMatches(prompt, patterns) {
  const normalizedPrompt = normalizeString(prompt)
  if (!normalizedPrompt) return []

  const matches = []
  for (const pattern of patterns) {
    const matched = normalizedPrompt.match(pattern)
    if (!matched) continue
    matches.push(matched[0])
  }
  return uniqueStrings(matches)
}

function analyzeLegacyPrompt(prompt) {
  const normalizedPrompt = normalizeString(prompt)
  const hardSignals = collectMatches(normalizedPrompt, LEGACY_HARD_PATTERNS)
  const legacySignals = collectMatches(normalizedPrompt, LEGACY_CONTEXT_PATTERNS)
  const refactorSignals = collectMatches(normalizedPrompt, REFACTOR_PATTERNS)
  const preserveSignals = collectMatches(normalizedPrompt, PRESERVE_PATTERNS)
  const matched =
    hardSignals.length > 0 ||
    (legacySignals.length > 0 && (refactorSignals.length > 0 || preserveSignals.length > 0))

  let confidence = 'low'
  if (hardSignals.length > 0 || (legacySignals.length > 0 && refactorSignals.length > 0)) {
    confidence = 'high'
  } else if (matched) {
    confidence = 'medium'
  }

  return {
    prompt: normalizedPrompt,
    matched,
    confidence,
    hardSignals,
    legacySignals,
    refactorSignals,
    preserveSignals,
    reasons: uniqueStrings([
      hardSignals.length > 0 ? '提示词明确点名旧页面/旧系统重构' : '',
      legacySignals.length > 0 ? '提示词包含旧页上下文' : '',
      refactorSignals.length > 0 ? '提示词包含重构/改造/迁移语义' : '',
      preserveSignals.length > 0 ? '提示词强调保留旧业务事实或只做视觉升级' : '',
    ]),
  }
}

async function resolveFileCandidate(targetRoot, relativePath) {
  const normalized = normalizeRelativePath(relativePath).replace(/^\.\//, '')
  if (!normalized) return []

  const absoluteCandidate = path.join(targetRoot, normalized)
  const candidates = []

  if (await pathExists(absoluteCandidate)) {
    const stats = await fs.stat(absoluteCandidate)
    if (stats.isFile()) {
      return [normalized]
    }
    if (stats.isDirectory()) {
      for (const entryName of ['index.tsx', 'index.jsx', 'index.ts', 'index.js']) {
        const nestedPath = path.join(absoluteCandidate, entryName)
        if (await pathExists(nestedPath)) {
          candidates.push(normalizeRelativePath(path.relative(targetRoot, nestedPath)))
        }
      }
      return candidates
    }
  }

  const extension = path.posix.extname(normalized)
  if (extension) return []

  for (const suffix of ['.tsx', '.jsx', '.ts', '.js']) {
    const filePath = path.join(targetRoot, `${normalized}${suffix}`)
    if (await pathExists(filePath)) {
      candidates.push(normalizeRelativePath(path.relative(targetRoot, filePath)))
    }
  }

  for (const entryName of ['index.tsx', 'index.jsx', 'index.ts', 'index.js']) {
    const nestedPath = path.join(targetRoot, normalized, entryName)
    if (await pathExists(nestedPath)) {
      candidates.push(normalizeRelativePath(path.relative(targetRoot, nestedPath)))
    }
  }

  return uniqueStrings(candidates)
}

async function resolveDestCodePaths(targetRoot, dest) {
  const normalizedDest = normalizeRelativePath(dest)
  if (!normalizedDest) return []
  return resolveFileCandidate(targetRoot, normalizedDest)
}

async function findLikelyLegacyEntryCandidates(targetRoot, dest) {
  const normalizedDest = normalizeRelativePath(dest)
  if (!normalizedDest) return []

  const absoluteDest = path.join(targetRoot, normalizedDest)
  let entries = []
  try {
    entries = await fs.readdir(absoluteDest, { withFileTypes: true })
  } catch {
    return []
  }

  const candidates = []
  for (const entry of entries) {
    if (!entry.isFile()) continue
    if (!/\.(?:[cm]?[jt]sx?)$/i.test(entry.name)) continue

    const relativePath = normalizeRelativePath(path.join(normalizedDest, entry.name))
    if (!shouldIncludeLegacyCompanionCodePath(relativePath)) continue

    const baseName = stripScriptModuleExtension(entry.name).toLowerCase()
    if (
      baseName === 'list-page' ||
      baseName === 'list' ||
      baseName === 'page' ||
      baseName.endsWith('.page')
    ) {
      candidates.push(relativePath)
    }
  }

  return uniqueStrings(candidates)
}

async function resolveRelativeImportCodePaths(targetRoot, importerRelativePath, specifier) {
  const importerDir = path.posix.dirname(normalizeRelativePath(importerRelativePath))
  const resolvedBase = normalizeRelativePath(path.posix.join(importerDir, specifier))
  if (!resolvedBase) return []
  return resolveFileCandidate(targetRoot, resolvedBase)
}

async function collectLegacyCompanionSourceEntries(targetRoot, seedEntries = [], { allowedRoot = '' } = {}) {
  const pending = []
  const knownEntries = new Map()
  const processed = new Set()
  const normalizedAllowedRoot = normalizeRelativePath(allowedRoot)

  for (const entry of seedEntries || []) {
    const relativePath = normalizeRelativePath(entry.relativePath)
    if (!relativePath) continue
    knownEntries.set(relativePath, {
      relativePath,
      content: entry.content,
      sourceKind: entry.sourceKind || 'workspace',
      commit: entry.commit || '',
    })
    pending.push(relativePath)
  }

  while (pending.length > 0) {
    const relativePath = normalizeRelativePath(pending.shift())
    if (!relativePath || processed.has(relativePath)) continue
    processed.add(relativePath)

    const entry = knownEntries.get(relativePath)
    const source =
      entry?.content || (await readTextIfExists(path.join(targetRoot, relativePath)))
    if (!source) continue

    const featureRoot = normalizedAllowedRoot || path.posix.dirname(relativePath)

    for (const specifier of extractRelativeImportSpecifiers(source)) {
      const resolvedPaths = await resolveRelativeImportCodePaths(targetRoot, relativePath, specifier)
      for (const candidatePath of resolvedPaths) {
        const normalizedCandidate = normalizeRelativePath(candidatePath)
        if (
          !normalizedCandidate ||
          processed.has(normalizedCandidate) ||
          !isPathInsideRoot(normalizedCandidate, featureRoot) ||
          !shouldIncludeLegacyCompanionCodePath(normalizedCandidate)
        ) {
          continue
        }

        if (!knownEntries.has(normalizedCandidate)) {
          knownEntries.set(normalizedCandidate, {
            relativePath: normalizedCandidate,
            content: '',
            sourceKind: 'workspace-related',
            commit: '',
          })
        }
        pending.push(normalizedCandidate)
      }
    }
  }

  const entries = []
  for (const relativePath of processed) {
    const knownEntry = knownEntries.get(relativePath)
    const content =
      knownEntry?.content || (await readTextIfExists(path.join(targetRoot, relativePath)))
    if (!content) continue
    entries.push({
      relativePath,
      content,
      sourceKind: knownEntry?.sourceKind || 'workspace',
      commit: knownEntry?.commit || '',
    })
  }

  return entries
}

async function resolveEvidenceCodePaths(targetRoot, evidenceItems) {
  const collected = []

  for (const item of evidenceItems || []) {
    if (item.entryPath) {
      collected.push(...(await resolveFileCandidate(targetRoot, item.entryPath)))
    }
    if (item.sourcePath) {
      collected.push(...(await resolveFileCandidate(targetRoot, item.sourcePath)))
    }
    if (item.path && /^src\//.test(item.path)) {
      collected.push(...(await resolveFileCandidate(targetRoot, item.path)))
    }
  }

  return uniqueStrings(collected)
}

function summarizeEvidenceItem(item) {
  if (!item || typeof item !== 'object') return ''

  return uniqueStrings([
    item.kind ? `evidenceKind=${item.kind}` : '',
    item.path ? `source=${normalizeRelativePath(item.path)}` : '',
    item.entryPath ? `entry=${normalizeRelativePath(item.entryPath)}` : '',
    item.sourcePath ? `code=${normalizeRelativePath(item.sourcePath)}` : '',
    item.routePath ? `route=${item.routePath}` : '',
    item.title ? `title=${item.title}` : '',
    item.publicName ? `expose=${item.publicName}` : '',
    item.featureBaseDir ? `featureBaseDir=${item.featureBaseDir}` : '',
  ]).join(' | ')
}

function selectRelevantEvidence(evidenceItems, { title = '', routePath = '', dest = '' } = {}) {
  const normalizedTitle = normalizeString(title)
  const normalizedRoutePath = normalizeString(routePath)
  const requestedDestLeafTokens = tokenizeBusinessEntryText(
    path.posix.basename(normalizeRelativePath(dest))
  )
  const requestedTokens = uniqueStrings([
    ...tokenizeBusinessEntryText(normalizedTitle),
    ...tokenizeBusinessEntryText(normalizedRoutePath),
    ...requestedDestLeafTokens,
  ])
  const preciseEvidence = []
  const broadEvidence = []

  for (const item of evidenceItems || []) {
    if (!item || item.kind === 'module-federation-exposes') continue

    const itemTokens = uniqueStrings([
      ...tokenizeBusinessEntryText(item.publicName),
      ...tokenizeBusinessEntryText(item.sourcePath),
      ...tokenizeBusinessEntryText(item.entryPath),
      ...tokenizeBusinessEntryText(item.title),
      ...tokenizeBusinessEntryText(item.routePath),
    ])

    const matchesExactTitle = normalizedTitle && normalizeString(item.title) === normalizedTitle
    const matchesExactRoute = normalizedRoutePath && normalizeString(item.routePath) === normalizedRoutePath
    const matchesDestLeaf =
      requestedDestLeafTokens.length > 0 &&
      countSharedTokens(requestedDestLeafTokens, itemTokens) >= Math.min(2, requestedDestLeafTokens.length)

    if (matchesExactTitle || matchesExactRoute || matchesDestLeaf) {
      preciseEvidence.push(item)
      continue
    }

    if (countSharedTokens(requestedTokens, itemTokens) >= 3) {
      broadEvidence.push(item)
    }
  }

  if (preciseEvidence.length > 0) {
    return preciseEvidence.slice(0, 3)
  }

  if (broadEvidence.length > 0) {
    return broadEvidence.slice(0, 3)
  }

  return (evidenceItems || []).slice(0, 3)
}

function buildFallbackLayoutFactsFromPageType(pageType = {}) {
  const sectionSequence = Array.isArray(pageType?.generationContract?.minimumGenerationContract?.sectionSequence)
    ? pageType.generationContract.minimumGenerationContract.sectionSequence
    : []

  return uniqueStrings(
    sectionSequence
      .map((sectionId) => SECTION_TO_LAYOUT_FACT[sectionId] || '')
      .filter(Boolean)
  )
}

function sanitizeLegacyFactLabel(value) {
  return normalizeString(value).replace(/[：:]\s*$/, '')
}

function pushUniqueObjectFact(list, fact, identityKey) {
  if (!fact || typeof fact !== 'object') return
  const identity = normalizeString(fact[identityKey] || fact.label || fact.title || fact.key || fact.field)
  if (!identity) return
  if (list.some((item) => normalizeString(item[identityKey] || item.label || item.title || item.key || item.field) === identity)) {
    return
  }
  list.push(fact)
}

function uniqueObjectFactsByKey(items = [], identityKey = 'id') {
  const facts = []
  for (const item of Array.isArray(items) ? items : []) {
    pushUniqueObjectFact(facts, item, identityKey)
  }
  return facts
}

function collectRegexSnippets(source = '', pattern, before = 240, after = 480) {
  if (!source || !(pattern instanceof RegExp)) return []

  const normalizedPattern = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`)
  const snippets = []
  let match = normalizedPattern.exec(source)

  while (match) {
    const start = Math.max(0, match.index - before)
    const end = Math.min(source.length, normalizedPattern.lastIndex + after)
    snippets.push(source.slice(start, end))
    match = normalizedPattern.exec(source)
  }

  return snippets
}

function extractLegacyDependencyKeysFromSource(source = '') {
  const dependencyKeys = []
  const dependencyPattern = /\[(.*?)\]/g
  let match = dependencyPattern.exec(source)

  while (match) {
    const dependencySource = String(match[1] || '')
    const keyMatches = dependencySource.match(/\b(?:form|filters|searchForm|query)\.(\w+)/g) || []
    for (const item of keyMatches) {
      const key = normalizeString(item.split('.').pop())
      if (key) dependencyKeys.push(key)
    }
    match = dependencyPattern.exec(source)
  }

  return uniqueStrings(dependencyKeys)
}

function extractLegacyFieldKeyFromBlock(block = '') {
  const patterns = [
    /value=\{(?:normalizeSelectValue\()?(?:form|filters|searchForm|query|values)\.(\w+)/u,
    /set(?:SearchForm|Form|Filters)\(\((?:prev|current)\)\s*=>\s*\(\{\s*\.\.\.(?:prev|current),\s*(\w+)\s*:/u,
    /set(?:SearchForm|Form|Filters)\(\((?:prev|current)\)\s*=>\s*\{[\s\S]{0,320}?\b(\w+)\s*:/u,
    /onChange=\{[\s\S]{0,320}?set(?:SearchForm|Form|Filters)\(\((?:prev|current)\)\s*=>\s*\(\{\s*\.\.\.(?:prev|current),\s*(\w+)\s*:/u,
    /onChange=\{[\s\S]{0,320}?set(?:SearchForm|Form|Filters)\(\((?:prev|current)\)\s*=>\s*\{[\s\S]{0,320}?\b(\w+)\s*:/u,
    /value=\{(\w+)(?:\s*(?:\|\||\?\?)[^}]*)?\}/u,
  ]

  for (const pattern of patterns) {
    const fieldKey = normalizeString(block.match(pattern)?.[1])
    if (fieldKey) return fieldKey
  }

  return ''
}

function extractLegacyDateRangeRequestParamKeysFromSource({ source = '', fieldKey = '' } = {}) {
  const normalizedFieldKey = normalizeString(fieldKey)
  if (!source || !normalizedFieldKey) {
    return {
      startRequestParamKey: '',
      endRequestParamKey: '',
    }
  }

  const directReferencePattern = `(?:form|filters|appliedFilters|searchForm|query|values)\\.${escapeRegExp(
    normalizedFieldKey
  )}`
  const aliasNames = []
  const aliasPattern = new RegExp(
    `(?:const|let|var)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*Array\\.isArray\\([\\s\\S]{0,160}?${directReferencePattern}[\\s\\S]{0,120}?\\)\\s*\\?[\\s\\S]{0,160}?${directReferencePattern}[\\s\\S]{0,120}?:\\s*\\[\\s*\\]`,
    'gu'
  )
  let aliasMatch = aliasPattern.exec(source)
  while (aliasMatch) {
    const aliasName = normalizeString(aliasMatch[1])
    if (aliasName) aliasNames.push(aliasName)
    aliasMatch = aliasPattern.exec(source)
  }

  const referencePatterns = [directReferencePattern, ...uniqueStrings(aliasNames).map(escapeRegExp)]
  let startRequestParamKey = ''
  let endRequestParamKey = ''

  for (const referencePattern of referencePatterns) {
    if (!startRequestParamKey) {
      startRequestParamKey = normalizeString(
        source.match(
          new RegExp(
            `(?:^|\\n)\\s*([A-Za-z_$][\\w$]*)\\s*:\\s*[^,\\n]*?${referencePattern}\\s*\\[\\s*0\\s*\\]`,
            'u'
          )
        )?.[1]
      )
    }
    if (!endRequestParamKey) {
      endRequestParamKey = normalizeString(
        source.match(
          new RegExp(
            `(?:^|\\n)\\s*([A-Za-z_$][\\w$]*)\\s*:\\s*[^,\\n]*?${referencePattern}\\s*\\[\\s*1\\s*\\]`,
            'u'
          )
        )?.[1]
      )
    }
    if (startRequestParamKey && endRequestParamKey) break
  }

  return {
    startRequestParamKey,
    endRequestParamKey,
  }
}

function extractLegacySelectDataIdentifier(block = '') {
  return normalizeString(
    block.match(/\bdata=\{(?:normalizeSelectOptions\()?\s*([A-Za-z_$][\w$]*)/u)?.[1]
  )
}

function extractLegacySelectSearchHandlerName(block = '') {
  const directHandler = normalizeString(
    block.match(/\bonSearch=\{\s*([A-Za-z_$][\w$]*)\s*\}/u)?.[1]
  )
  if (directHandler) return directHandler

  return normalizeString(
    block.match(/\bonSearch=\{[\s\S]{0,160}?([A-Za-z_$][\w$]*)\s*\(/u)?.[1]
  )
}

function extractInvokedLegacyFunctionNames(source = '') {
  const ignoredNames = new Set([
    'String',
    'Number',
    'Boolean',
    'Array',
    'Object',
    'setTimeout',
    'clearTimeout',
    'normalizeSelectValue',
    'normalizeSelectOptions',
    'if',
    'for',
    'while',
    'switch',
    'catch',
  ])
  const functionNames = []
  const functionPattern = /\b([A-Za-z_$][\w$]*)\s*\(/g
  let match = functionPattern.exec(source)

  while (match) {
    const functionName = normalizeString(match[1])
    if (
      functionName &&
      !ignoredNames.has(functionName) &&
      !/^set[A-Z]/.test(functionName)
    ) {
      functionNames.push(functionName)
    }
    match = functionPattern.exec(source)
  }

  return uniqueStrings(functionNames)
}

function extractLegacyOptionContractFromSource({
  source = '',
  block = '',
  dataIdentifier = '',
} = {}) {
  if (!source) {
    return {
      asyncOptions: false,
      optionApiId: '',
      dependsOn: [],
    }
  }

  const handlerSnippets = []
  const setterSnippets = []
  const searchHandlerName = extractLegacySelectSearchHandlerName(block)
  if (searchHandlerName) {
    const handlerBody = findLegacyHandlerBody(source, searchHandlerName)
    if (handlerBody) {
      handlerSnippets.push(handlerBody)
      const nestedFunctionNames = extractInvokedLegacyFunctionNames(handlerBody)
      for (const nestedFunctionName of nestedFunctionNames) {
        const nestedBody = findLegacyHandlerBody(source, nestedFunctionName)
        if (!nestedBody) continue
        handlerSnippets.push(nestedBody)
        for (const deepFunctionName of extractInvokedLegacyFunctionNames(nestedBody)) {
          const deepBody = findLegacyHandlerBody(source, deepFunctionName)
          if (deepBody) handlerSnippets.push(deepBody)
        }
      }
    }
  }

  const normalizedDataIdentifier = normalizeString(dataIdentifier)
  const setterName = normalizedDataIdentifier
    ? `set${normalizedDataIdentifier.charAt(0).toUpperCase()}${normalizedDataIdentifier.slice(1)}`
    : ''
  if (normalizedDataIdentifier) {
    setterSnippets.push(
      ...collectRegexSnippets(
        source,
        new RegExp(`\\b${escapeRegExp(setterName)}\\s*\\(`, 'u'),
        240,
        560
      )
    )
  }

  const hasSearchHandler = /\bonSearch=/.test(block)
  const snippets = [...handlerSnippets, ...setterSnippets]
  const asyncOptions =
    hasSearchHandler ||
    snippets.some((snippet) => /\bawait\b|\.then\s*\(/u.test(snippet))
  const pickNearestSetterApiId = (snippet) => {
    const normalizedSnippet = String(snippet || '')
    if (!normalizedSnippet || !setterName) return ''
    const setterIndex = normalizedSnippet.indexOf(setterName)
    if (setterIndex < 0) return ''
    const beforeSetter = normalizedSnippet.slice(0, setterIndex)
    const matchPattern = hasSearchHandler
      ? /\b((?:fetch|get|query|load)[A-Z_a-z][\w$]*Search[A-Z_a-z][\w$]*Options|(?:fetch|get|query|load)[A-Z_a-z][\w$]*Options|(?:fetch|get|query|load)[A-Z_a-z][\w$]*)\s*\(/gu
      : /\b((?:fetch|get|query|load)[A-Z_a-z][\w$]*)\s*\(/gu
    const matches = [...beforeSetter.matchAll(matchPattern)]
    const preferredMatches = matches
      .map((match) => normalizeString(match[1]))
      .filter((name) => /(Options|Enum|Enums)$/u.test(name))
    if (preferredMatches.length > 0) {
      return normalizeString(preferredMatches[preferredMatches.length - 1])
    }
    return normalizeString(matches[matches.length - 1]?.[1] || '')
  }
  const setterApiCandidates = setterSnippets
    .map((snippet) => pickNearestSetterApiId(snippet))
    .filter(Boolean)
  const setterOptionApiId = normalizeString(
    setterApiCandidates.find((name) => /(Options|Enum|Enums)$/u.test(name)) ||
      setterApiCandidates[0] ||
      ''
  )
  const snippetOptionApiId = normalizeString(
    handlerSnippets
      .map(
        (snippet) =>
          hasSearchHandler
            ? snippet.match(/\b((?:fetch|get|query|load)[A-Z_a-z][\w$]*Search[A-Z_a-z][\w$]*Options)\s*\(/u)?.[1] ||
              snippet.match(/\b((?:fetch|get|query|load)[A-Z_a-z][\w$]*Options)\s*\(/u)?.[1] ||
              snippet.match(/\b((?:fetch|get|query|load)[A-Z_a-z][\w$]*)\s*\(/u)?.[1] ||
              ''
            : snippet.match(/\b((?:fetch|get|query|load)[A-Z_a-z][\w$]*)\s*\(/u)?.[1] ||
              snippet.match(/\b((?:fetch|get|query|load)[A-Z_a-z][\w$]*Options)\s*\(/u)?.[1] ||
              ''
      )
      .find(Boolean)
  )
  const optionApiId =
    setterOptionApiId ||
    snippetOptionApiId ||
    normalizeString(
      hasSearchHandler
        ? source.match(/\b((?:fetch|get|query|load)[A-Z_a-z][\w$]*Search[A-Z_a-z][\w$]*Options)\s*\(/u)?.[1] ||
          source.match(/\b((?:fetch|get|query|load)[A-Z_a-z][\w$]*Options)\s*\(/u)?.[1]
        : source.match(/\b((?:fetch|get|query|load)[A-Z_a-z][\w$]*)\s*\(/u)?.[1] || ''
    )
  const dependsOn = uniqueStrings(
    snippets.flatMap((snippet) => extractLegacyDependencyKeysFromSource(snippet))
  )

  return {
    asyncOptions,
    optionApiId,
    dependsOn,
  }
}

function extractLegacyQueryFactsFromSource(source = '') {
  const facts = []
  const componentNames = ['Input', 'Select', 'DatePicker']

  for (const componentName of componentNames) {
    const componentBlocks = extractJsxTagBlocks(source, componentName)

    for (const match of componentBlocks) {
      const block = match.block
      const fieldKey = extractLegacyFieldKeyFromBlock(block)
      const nearbySource = source.slice(Math.max(0, match.index - 320), match.index)
      const label =
        sanitizeLegacyFactLabel(block.match(/label=["']([^"']+)["']/)?.[1] || '') ||
        sanitizeLegacyFactLabel(block.match(/prefix=\{<span[^>]*>([^<]+)<\/span>\}/)?.[1] || '') ||
        sanitizeLegacyFactLabel(nearbySource.match(/<span[^>]*>\s*([^<]+?)\s*<\/span>\s*$/)?.[1] || '')
      const placeholderText =
        block.match(/placeholder=["']([^"']+)["']/)?.[1] ||
        (() => {
          const placeholderMatch = block.match(
            /placeholder=\{\[\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\]\}/
          )
          return placeholderMatch ? `${placeholderMatch[1]} ~ ${placeholderMatch[2]}` : ''
        })()
      const resolvedLabel = label || sanitizeLegacyFactLabel(placeholderText)
      const searchable = /\bsearchable\b/.test(block) || /\bonSearch=/.test(block)
      const clearable = /\bclearable\b/.test(block)
      const selectDataIdentifier =
        componentName === 'Select' ? extractLegacySelectDataIdentifier(block) : ''
      const optionContract =
        componentName === 'Select'
          ? extractLegacyOptionContractFromSource({
              source,
              block,
              dataIdentifier: selectDataIdentifier,
            })
          : {
              asyncOptions: false,
              optionApiId: '',
              dependsOn: [],
            }
      const dateRangeRequestKeys =
        componentName === 'DatePicker'
          ? extractLegacyDateRangeRequestParamKeysFromSource({
              source,
              fieldKey,
            })
          : {
              startRequestParamKey: '',
              endRequestParamKey: '',
            }

      pushUniqueObjectFact(
        facts,
        {
          field: fieldKey || resolvedLabel,
          label: resolvedLabel || fieldKey,
          fieldKey: fieldKey || resolvedLabel,
          control: componentName,
          requestParamKey: fieldKey,
          placeholder: normalizeString(placeholderText),
          searchable,
          asyncOptions: optionContract.asyncOptions,
          optionApiId: optionContract.optionApiId,
          dependsOn: optionContract.dependsOn,
          clearable,
          startRequestParamKey: dateRangeRequestKeys.startRequestParamKey,
          endRequestParamKey: dateRangeRequestKeys.endRequestParamKey,
        },
        'fieldKey'
      )
    }
  }

  return facts
}

function collectLegacyTableArrayBlocks(source = '') {
  const blocks = []
  const tableArrayPattern =
    /const\s+([A-Za-z_$][\w$]*)\b[\s\S]{0,120}?(?:=\s*\[|=>\s*\[)/g
  let tableArrayMatch = tableArrayPattern.exec(source)

  while (tableArrayMatch) {
    const variableName = normalizeString(tableArrayMatch[1])
    if (!/columns?/iu.test(variableName)) {
      tableArrayMatch = tableArrayPattern.exec(source)
      continue
    }

    const arrayStart = tableArrayMatch.index + tableArrayMatch[0].length - 1
    if (arrayStart < 0) {
      tableArrayMatch = tableArrayPattern.exec(source)
      continue
    }

    const balancedArray = findBalancedBlock(source, arrayStart, {
      openChar: '[',
      closeChar: ']',
    })
    if (balancedArray?.body) {
      blocks.push(balancedArray.body)
    }
    tableArrayMatch = tableArrayPattern.exec(source)
  }

  return blocks
}

function extractLegacyTableFactsFromSource(source = '') {
  const facts = []
  const tableArrayBlocks = collectLegacyTableArrayBlocks(source)
  const targetSources = tableArrayBlocks.length > 0 ? tableArrayBlocks : []
  const patterns = [
    /title:\s*['"]([^'"]+)['"][\s\S]{0,400}?dataKey:\s*['"]([^'"]+)['"]/g,
    /dataKey:\s*['"]([^'"]+)['"][\s\S]{0,400}?title:\s*['"]([^'"]+)['"]/g,
  ]

  for (const targetSource of targetSources) {
    for (const pattern of patterns) {
      pattern.lastIndex = 0
      let match = pattern.exec(targetSource)
      while (match) {
        const [first, second] = match.slice(1)
        const title = pattern.source.startsWith('title') ? first : second
        const columnKey = pattern.source.startsWith('title') ? second : first
        pushUniqueObjectFact(
          facts,
          {
            columnKey: normalizeString(columnKey),
            title: sanitizeLegacyFactLabel(title),
          },
          'columnKey'
        )
        match = pattern.exec(targetSource)
      }
    }
  }

  return facts
}

function extractLegacyApiContractsFromSource(source = '', sourcePath = '') {
  const facts = []
  const importPattern =
    /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]*(?:network|net|api|service|request)[^'"]*)['"]/g
  let match = importPattern.exec(source)

  while (match) {
    const importedSymbols = String(match[1] || '')
      .split(',')
      .map((item) => normalizeString(item))
      .filter(Boolean)
    const sourceModule = normalizeString(match[2])

    for (const symbol of importedSymbols) {
      if (!new RegExp(`\\b${escapeRegExp(symbol)}\\s*\\(`).test(source)) continue
      pushUniqueObjectFact(
        facts,
        {
          id: symbol,
          sourceModule,
          sourcePath: normalizeRelativePath(sourcePath),
        },
        'id'
      )
    }

    match = importPattern.exec(source)
  }

  return facts
}

function extractLegacyInteractionContractsFromSource(source = '', sourcePath = '', companionEntries = []) {
  const facts = []
  const handleExportBlock =
    source.match(/const\s+handleExport\b[\s\S]{0,1200}?=>\s*\{([\s\S]{0,2400}?)\n\s*\}/)?.[1] || ''
  const exportRequestId =
    extractLegacyApiContractsFromSource(source, sourcePath)
      .map((item) => item.id)
      .find((id) => new RegExp(`\\b${escapeRegExp(id)}\\s*\\(`).test(handleExportBlock)) || ''

  if (
    /const\s+handleSearch\b/.test(source) &&
    /(?:fetchListData|fetchList|query[A-Z_a-z][\w$]*|load[A-Z_a-z][\w$]*)\s*\(|setAppliedFilters\(/.test(source)
  ) {
    pushUniqueObjectFact(
      facts,
      {
        trigger: 'click:search',
        effect: 'request:list',
      },
      'trigger'
    )
  }

  if (/const\s+handleExport\b/.test(source) && exportRequestId) {
    pushUniqueObjectFact(
      facts,
      {
        trigger: 'click:export',
        effect: `request:${exportRequestId}`,
      },
      'trigger'
    )
  }

  if (
    /(const\s+handleClick\b|const\s+handleViewDetail\b|onViewDetail)/.test(source) &&
    /(setVisible\(true\)|addPage\(\{[\s\S]{0,400}?path:\s*['"][^'"]*Detail[^'"]*['"])/.test(source)
  ) {
    pushUniqueObjectFact(
      facts,
      {
        trigger: 'click:table-primary-link',
        effect: 'open:detail-view',
      },
      'trigger'
    )
  }

  if (
    /const\s+handlePageChange\b/.test(source) &&
    /(?:fetchListData|fetchList|query[A-Z_a-z][\w$]*)\s*\(/.test(source)
  ) {
    pushUniqueObjectFact(
      facts,
      {
        trigger: 'change:pagination',
        effect: 'request:list-page',
      },
      'trigger'
    )
  }

  if (/\b<Pagination\b/.test(source) && /\bonChange=\{(?:setCurrentPage|handlePageChange)\}/.test(source)) {
    pushUniqueObjectFact(
      facts,
      {
        trigger: 'change:pagination',
        effect: 'request:list-page',
      },
      'trigger'
    )
  }

  const buttonBlocks = extractJsxTagBlocks(source, 'Button')
  for (const blockMatch of buttonBlocks) {
    const block = blockMatch.block
    const label = extractLegacyButtonLabel(block)
    const inlineHandlerExpression = normalizeString(
      block.match(/\bonClick=\{([\s\S]{0,240}?)\}/u)?.[1]
    )
    if (!inlineHandlerExpression) continue
    const inlineHandlerId = normalizeString(
      inlineHandlerExpression.match(/\b([A-Za-z_$][\w$]*)\s*\(/u)?.[1]
    )
    const importedHandler = inlineHandlerId
      ? resolveLegacyImportedHandlerBody({
          source,
          sourcePath,
          sourceHandler: inlineHandlerId,
          companionEntries,
        })
      : {
          handlerBody: '',
          sourceText: '',
        }
    const inlineHandlerBody =
      importedHandler.handlerBody || findLegacyHandlerBody(source, inlineHandlerId)
    const inlineNavigateEffect = extractLegacyNavigateEffect(
      inlineHandlerBody,
      label,
      importedHandler.sourceText || source
    )

    if (
      /open[A-Z_a-z][\w$]*Detail\s*\(/.test(inlineHandlerExpression) ||
      /addPage\(\{[\s\S]{0,240}?path:\s*['"][^'"]*Detail[^'"]*['"]/.test(inlineHandlerExpression)
    ) {
      pushUniqueObjectFact(
        facts,
        {
          trigger: 'click:table-primary-link',
          effect: 'open:detail-view',
          kind: inlineNavigateEffect ? 'navigate' : '',
          sourceHandler: inlineHandlerId,
          routePath: normalizeString(inlineNavigateEffect?.routePath),
          targetTitle: normalizeString(inlineNavigateEffect?.targetTitle),
          sourcePath: normalizeRelativePath(sourcePath),
        },
        'trigger'
      )
    }

    if (/submit[A-Z_a-z][\w$]*\s*\(/.test(inlineHandlerExpression) || /^(提交)$/u.test(label)) {
      const submitHandlerId = normalizeString(
        inlineHandlerExpression.match(/\b(submit[A-Z_a-z][\w$]*)\s*\(/)?.[1]
      )
      const submitActionContract = extractLegacySubmitActionContract({
        source,
        sourcePath,
        sourceHandler: submitHandlerId || inlineHandlerId,
        handlerBody: importedHandler.handlerBody || inlineHandlerBody,
        companionEntries,
      })
      pushUniqueObjectFact(
        facts,
        {
          trigger: 'click:row-action:submit',
          effect: submitHandlerId ? `action:${submitHandlerId}` : 'action:submit',
          label: label || '提交',
          sourceHandler: submitHandlerId,
          sourcePath: normalizeRelativePath(sourcePath),
          submitActionContract,
        },
        'trigger'
      )
    }

    if (/open[A-Z_a-z][\w$]*Edit\s*\(/.test(inlineHandlerExpression) || /^(编辑)$/u.test(label)) {
      pushUniqueObjectFact(
        facts,
        {
          trigger: 'click:row-action:edit',
          effect: 'open:edit-view',
          label: label || '编辑',
          kind: inlineNavigateEffect ? 'navigate' : '',
          sourceHandler: inlineHandlerId,
          routePath: normalizeString(inlineNavigateEffect?.routePath),
          targetTitle: normalizeString(inlineNavigateEffect?.targetTitle),
          sourcePath: normalizeRelativePath(sourcePath),
        },
        'trigger'
      )
    }
  }

  const headerActionFacts = extractLegacyHeaderActionFactsFromSource(source, sourcePath, companionEntries)
  for (const fact of headerActionFacts) {
    facts.push(fact)
  }

  return facts
}

function extractLegacyHeaderActionFactsFromSource(source = '', sourcePath = '', companionEntries = []) {
  const facts = []
  const buttonPattern = /<Button\b[\s\S]{0,800}?onClick=\{([^}]+)\}[\s\S]{0,800}?>\s*([\s\S]*?)\s*<\/Button>/g
  let match = buttonPattern.exec(source)
  let index = 0

  while (match) {
    index += 1
    const sourceHandler = normalizeString(match[1])
    const innerContent = String(match[2] || '')
    const label = extractLegacyButtonLabel(innerContent)
    if (!sourceHandler || !label || !/^[A-Za-z_$][\w$]*$/u.test(sourceHandler)) {
      match = buttonPattern.exec(source)
      continue
    }

    if (isIgnoredLegacyHeaderActionLabel(label)) {
      match = buttonPattern.exec(source)
      continue
    }

    const handlerBody = findLegacyHandlerBody(source, sourceHandler)
    const action = buildLegacyHeaderActionFact({
      source,
      sourcePath,
      sourceHandler,
      handlerBody,
      companionEntries,
      label,
      index,
    })

    if (action) {
      facts.push(action)
    }

    match = buttonPattern.exec(source)
  }

  return facts
}

function extractLegacyButtonLabel(source = '') {
  const normalizedSource = String(source || '').trim()
  if (!normalizedSource) return ''

  let openingTagEnd = -1
  if (/^<Button\b/u.test(normalizedSource)) {
    let quote = ''
    let escaped = false
    let braceDepth = 0

    for (let index = '<Button'.length; index < normalizedSource.length; index += 1) {
      const char = normalizedSource[index]

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

      if (char === '\'' || char === '"' || char === '`') {
        quote = char
        continue
      }

      if (char === '{') {
        braceDepth += 1
        continue
      }

      if (char === '}') {
        braceDepth = Math.max(0, braceDepth - 1)
        continue
      }

      if (braceDepth === 0 && char === '>') {
        openingTagEnd = index
        break
      }
    }
  }

  const closingTagStart = normalizedSource.lastIndexOf('</Button>')
  const contentSource = normalizeString(
    openingTagEnd >= 0 && closingTagStart > openingTagEnd
      ? normalizedSource.slice(openingTagEnd + 1, closingTagStart)
      : normalizedSource
  )
  const translationLiteral =
    contentSource.match(/\bt\s*\(\s*['"]([^'"]+)['"]\s*\)/)?.[1] ||
    contentSource.match(/^\{?\s*['"]([^'"]+)['"]\s*\}?$/u)?.[1] ||
    ''
  if (translationLiteral) return normalizeString(translationLiteral)

  const plainText = normalizeString(
    contentSource
      .replace(/<[^>]+>/g, ' ')
      .replace(/[{}]/g, ' ')
      .replace(/\s+/g, ' ')
  )

  return plainText
}

function isIgnoredLegacyHeaderActionLabel(label = '') {
  return /^(查询|重置|取消|提交|保存|关闭|返回)$/u.test(normalizeString(label))
}

function findLegacyHandlerBody(source = '', sourceHandler = '') {
  const normalizedHandler = normalizeString(sourceHandler)
  if (!normalizedHandler) return ''
  const escapedHandler = escapeRegExp(normalizedHandler)
  const constMatch = source.match(
    new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+${escapedHandler}\\b[\\s\\S]{0,1600}?=>`, 'u')
  )
  if (constMatch?.index >= 0) {
    const arrowIndex = source.indexOf('=>', constMatch.index)
    if (arrowIndex >= 0) {
      let bodyStart = arrowIndex + 2
      while (bodyStart < source.length && /\s/u.test(source[bodyStart])) bodyStart += 1
      if (source[bodyStart] === '{') {
        const balanced = findBalancedBlock(source, bodyStart)
        if (balanced?.body) return balanced.body
      }
      const expressionEnd = findLegacyExpressionEnd(source, bodyStart)
      return source.slice(bodyStart, expressionEnd).trim()
    }
  }

  const functionMatch = source.match(
    new RegExp(`(?:export\\s+)?(?:async\\s+)?function\\s+${escapedHandler}\\s*\\([^)]*\\)\\s*\\{`, 'u')
  )
  if (functionMatch?.index >= 0) {
    const braceIndex = source.indexOf('{', functionMatch.index)
    const balanced = findBalancedBlock(source, braceIndex)
    if (balanced?.body) return balanced.body
  }

  return ''
}

function resolveLegacyImportedHandlerBinding(source = '', sourceHandler = '') {
  const normalizedHandler = normalizeString(sourceHandler)
  if (!normalizedHandler) return null

  const namedImportPattern = /import\s+\{([\s\S]*?)\}\s+from\s+['"]([^'"]+)['"]/g
  let match = namedImportPattern.exec(source)
  while (match) {
    const importedBlock = String(match[1] || '')
    const specifier = normalizeString(match[2])
    for (const importedItem of importedBlock.split(',')) {
      const normalizedItem = normalizeString(importedItem)
      if (!normalizedItem) continue
      const aliasMatch = normalizedItem.match(
        /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/u
      )
      if (!aliasMatch) continue
      const importedName = normalizeString(aliasMatch[1])
      const localName = normalizeString(aliasMatch[2] || aliasMatch[1])
      if (localName === normalizedHandler) {
        return {
          importedName,
          localName,
          specifier,
        }
      }
    }
    match = namedImportPattern.exec(source)
  }

  return null
}

function resolveLegacyImportedHandlerBody({
  source = '',
  sourcePath = '',
  sourceHandler = '',
  companionEntries = [],
} = {}) {
  const binding = resolveLegacyImportedHandlerBinding(source, sourceHandler)
  if (!binding || !binding.specifier.startsWith('.')) {
    return {
      handlerBody: '',
      sourcePath: '',
      sourceText: '',
    }
  }

  const importerDir = path.posix.dirname(normalizeRelativePath(sourcePath))
  const importedBasePath = stripScriptModuleExtension(path.posix.join(importerDir, binding.specifier))
  const importedEntry = (companionEntries || []).find(
    (entry) =>
      stripScriptModuleExtension(entry?.relativePath || '') === importedBasePath &&
      normalizeRelativePath(entry?.relativePath || '') !== normalizeRelativePath(sourcePath)
  )
  if (!importedEntry?.content) {
    return {
      handlerBody: '',
      sourcePath: '',
      sourceText: '',
    }
  }

  return {
    handlerBody: findLegacyHandlerBody(importedEntry.content, binding.importedName),
    sourcePath: normalizeRelativePath(importedEntry.relativePath),
    sourceText: importedEntry.content,
  }
}

function resolveLegacyImportedSymbolContext({
  source = '',
  sourcePath = '',
  symbolName = '',
  companionEntries = [],
} = {}) {
  const binding = resolveLegacyImportedHandlerBinding(source, symbolName)
  const normalizedSymbol = normalizeString(symbolName)
  if (!binding) {
    return {
      importedName: normalizedSymbol,
      localName: normalizedSymbol,
      sourceModule: '',
      sourcePath: '',
      sourceText: '',
    }
  }

  const normalizedSourcePath = normalizeRelativePath(sourcePath)
  if (!binding.specifier.startsWith('.')) {
    return {
      importedName: normalizeString(binding.importedName),
      localName: normalizeString(binding.localName),
      sourceModule: normalizeString(binding.specifier),
      sourcePath: normalizedSourcePath,
      sourceText: '',
    }
  }

  const importerDir = path.posix.dirname(normalizedSourcePath)
  const importedBasePath = stripScriptModuleExtension(path.posix.join(importerDir, binding.specifier))
  const importedEntry = (companionEntries || []).find(
    (entry) =>
      stripScriptModuleExtension(entry?.relativePath || '') === importedBasePath &&
      normalizeRelativePath(entry?.relativePath || '') !== normalizedSourcePath
  )

  return {
    importedName: normalizeString(binding.importedName),
    localName: normalizeString(binding.localName),
    sourceModule: normalizeString(binding.specifier),
    sourcePath: normalizeRelativePath(importedEntry?.relativePath || normalizedSourcePath),
    sourceText: normalizeString(importedEntry?.content) ? importedEntry.content : '',
  }
}

function findLegacyDelimitedExpressionEnd(source = '', startIndex = 0, terminators = [',']) {
  const normalizedTerminators = new Set((terminators || []).filter(Boolean))
  let depthParen = 0
  let depthBracket = 0
  let depthBrace = 0
  let quote = ''
  let escaped = false

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index]

    if (quote) {
      if (escaped) {
        escaped = false
        continue
      }
      if (char === '\\') {
        escaped = true
        continue
      }
      if (char === quote) quote = ''
      continue
    }

    if (char === '\'' || char === '"' || char === '`') {
      quote = char
      continue
    }

    if (char === '(') {
      depthParen += 1
      continue
    }
    if (char === ')') {
      depthParen = Math.max(0, depthParen - 1)
      continue
    }
    if (char === '[') {
      depthBracket += 1
      continue
    }
    if (char === ']') {
      depthBracket = Math.max(0, depthBracket - 1)
      continue
    }
    if (char === '{') {
      depthBrace += 1
      continue
    }
    if (char === '}') {
      depthBrace = Math.max(0, depthBrace - 1)
      if (
        depthParen === 0 &&
        depthBracket === 0 &&
        depthBrace === 0 &&
        normalizedTerminators.has('}')
      ) {
        return index
      }
      continue
    }

    if (depthParen === 0 && depthBracket === 0 && depthBrace === 0 && normalizedTerminators.has(char)) {
      return index
    }
  }

  return source.length
}

function extractLegacyObjectPropertyExpression(objectBody = '', propertyName = '') {
  const normalizedPropertyName = normalizeString(propertyName)
  if (!normalizedPropertyName || !objectBody) return ''
  const pattern = new RegExp(`(?:^\\s*|[,{]\\s*)${escapeRegExp(normalizedPropertyName)}\\s*:\\s*`, 'u')
  const match = pattern.exec(objectBody)
  if (!match || match.index == null) return ''

  const expressionStart = match.index + match[0].length
  const expressionEnd = findLegacyDelimitedExpressionEnd(objectBody, expressionStart, [','])
  return normalizeString(objectBody.slice(expressionStart, expressionEnd).replace(/,$/, ''))
}

function extractLegacyInlineMessageTitle(source = '') {
  const configMatch = source.match(/\bmessage\.open\s*\(\s*\{/u)
  if (!configMatch || configMatch.index == null) return ''
  const objectStart = source.indexOf('{', configMatch.index)
  const objectBlock = findBalancedBlock(source, objectStart)
  if (!objectBlock?.body) return ''
  const titleExpression = extractLegacyObjectPropertyExpression(objectBlock.body, 'title')
  const literalTitle = titleExpression.match(/^['"]([^'"]+)['"]$/u)?.[1]
  const ternaryFallbackTitle = titleExpression.match(/:\s*['"]([^'"]+)['"]$/u)?.[1]
  return normalizeString(literalTitle || ternaryFallbackTitle || titleExpression)
}

function normalizeLegacyNavigateTargetTitleFallback(label = '') {
  const normalizedLabel = normalizeString(label)
  if (/^(value|cellValue|row|item)$/iu.test(normalizedLabel)) return ''
  return normalizedLabel
}

function extractLegacySubmitActionContract({
  source = '',
  sourcePath = '',
  sourceHandler = '',
  handlerBody = '',
  companionEntries = [],
} = {}) {
  const normalizedHandlerBody = String(handlerBody || '').trim()
  if (!normalizedHandlerBody || !/\bModal\.confirm\s*\(\s*\{/u.test(normalizedHandlerBody)) {
    return null
  }

  const confirmCallMatch = normalizedHandlerBody.match(/\bModal\.confirm\s*\(\s*\{/u)
  if (!confirmCallMatch || confirmCallMatch.index == null) return null
  const confirmObjectStart = normalizedHandlerBody.indexOf('{', confirmCallMatch.index)
  const confirmObjectBlock = findBalancedBlock(normalizedHandlerBody, confirmObjectStart)
  if (!confirmObjectBlock?.body) return null

  const confirmTypeExpression = extractLegacyObjectPropertyExpression(confirmObjectBlock.body, 'type')
  const confirmTitleExpression = extractLegacyObjectPropertyExpression(confirmObjectBlock.body, 'title')
  const confirmContentExpression = extractLegacyObjectPropertyExpression(confirmObjectBlock.body, 'content')
  const cancelTextExpression = extractLegacyObjectPropertyExpression(confirmObjectBlock.body, 'cancelText')
  const confirmTextExpression = extractLegacyObjectPropertyExpression(confirmObjectBlock.body, 'confirmText')
  const confirmDialog = {
    type: normalizeString(confirmTypeExpression.match(/^['"]([^'"]+)['"]$/u)?.[1] || confirmTypeExpression),
    title: normalizeString(confirmTitleExpression.match(/^['"]([^'"]+)['"]$/u)?.[1] || confirmTitleExpression),
    contentExpression: normalizeString(confirmContentExpression),
    cancelText: normalizeString(cancelTextExpression.match(/^['"]([^'"]+)['"]$/u)?.[1] || cancelTextExpression),
    confirmText: normalizeString(
      confirmTextExpression.match(/^['"]([^'"]+)['"]$/u)?.[1] || confirmTextExpression
    ),
  }
  const contentSource = normalizeString(confirmDialog.contentExpression.match(/\b([A-Za-z_$][\w$]*)\s*\(/u)?.[1])
  if (contentSource) {
    const contentSourceContext = resolveLegacyImportedSymbolContext({
      source,
      sourcePath,
      symbolName: contentSource,
      companionEntries,
    })
    confirmDialog.contentSource = contentSource
    confirmDialog.contentSourceModule = normalizeString(contentSourceContext.sourceModule)
    confirmDialog.contentSourcePath = normalizeRelativePath(contentSourceContext.sourcePath)
  }

  const onConfirmExpression = extractLegacyObjectPropertyExpression(confirmObjectBlock.body, 'onConfirm')
  const onConfirmBodyStart = onConfirmExpression.indexOf('{')
  const onConfirmBodyBlock =
    onConfirmBodyStart >= 0 ? findBalancedBlock(onConfirmExpression, onConfirmBodyStart) : null
  const onConfirmBody = String(onConfirmBodyBlock?.body || '').trim()
  if (!onConfirmBody) {
    return {
      sourceHandler: normalizeString(sourceHandler),
      confirmDialog,
    }
  }

  const detailLoadMatch = onConfirmBody.match(
    /const\s+([A-Za-z_$][\w$]*)\s*=\s*await\s+([A-Za-z_$][\w$]*)\s*\(([\s\S]{0,240}?)\)/u
  )
  const detailRecordBinding = normalizeString(detailLoadMatch?.[1])
  const detailApiId = normalizeString(detailLoadMatch?.[2])
  const detailRequestArgSource = normalizeString(detailLoadMatch?.[3])
  const detailLoad = {
    recordBinding: detailRecordBinding,
    apiId: detailApiId,
    requestArgSource: detailRequestArgSource,
  }
  if (detailApiId) {
    const detailApiContext = resolveLegacyImportedSymbolContext({
      source,
      sourcePath,
      symbolName: detailApiId,
      companionEntries,
    })
    detailLoad.apiSourceModule = normalizeString(detailApiContext.sourceModule)
    detailLoad.apiSourcePath = normalizeRelativePath(detailApiContext.sourcePath)
  }
  if (detailRecordBinding) {
    const detailErrorBlockMatch = onConfirmBody.match(
      new RegExp(`if\\s*\\(\\s*!${escapeRegExp(detailRecordBinding)}\\s*\\)\\s*\\{`, 'u')
    )
    if (detailErrorBlockMatch?.index != null) {
      const blockStart = onConfirmBody.indexOf('{', detailErrorBlockMatch.index)
      const block = findBalancedBlock(onConfirmBody, blockStart)
      detailLoad.errorMessage = extractLegacyInlineMessageTitle(block?.body || '')
    }
  }

  const parseMatch = onConfirmBody.match(
    /([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\s*\(([\s\S]{0,240}?)\)/u
  )
  const snapshotParse = {
    snapshotBinding: normalizeString(parseMatch?.[1]),
    adapterBinding: normalizeString(parseMatch?.[2]),
    parseMethod: normalizeString(parseMatch?.[3]),
    parseArgSource: normalizeString(parseMatch?.[4]),
  }
  if (snapshotParse.adapterBinding) {
    const adapterResolverMatch = onConfirmBody.match(
      new RegExp(
        `const\\s+${escapeRegExp(snapshotParse.adapterBinding)}\\s*=\\s*([A-Za-z_$][\\w$]*)\\s*\\(([^)]*)\\)`,
        'u'
      )
    )
    snapshotParse.adapterResolver = normalizeString(adapterResolverMatch?.[1])
    snapshotParse.adapterResolverArgSource = normalizeString(adapterResolverMatch?.[2])
    if (snapshotParse.adapterResolver) {
      const adapterResolverContext = resolveLegacyImportedSymbolContext({
        source,
        sourcePath,
        symbolName: snapshotParse.adapterResolver,
        companionEntries,
      })
      snapshotParse.adapterResolverSourceModule = normalizeString(adapterResolverContext.sourceModule)
      snapshotParse.adapterResolverSourcePath = normalizeRelativePath(adapterResolverContext.sourcePath)
    }
    const missingSubmitBlockMatch = onConfirmBody.match(
      new RegExp(
        `if\\s*\\(\\s*!${escapeRegExp(snapshotParse.adapterBinding)}\\?\\.submitSnapshot\\s*\\)\\s*\\{`,
        'u'
      )
    )
    if (missingSubmitBlockMatch?.index != null) {
      const blockStart = onConfirmBody.indexOf('{', missingSubmitBlockMatch.index)
      const block = findBalancedBlock(onConfirmBody, blockStart)
      snapshotParse.submitGuardMessage = extractLegacyInlineMessageTitle(block?.body || '')
    }
  }
  const parseErrorBlockMatch = onConfirmBody.match(/catch\s*\(\s*[A-Za-z_$][\w$]*\s*\)\s*\{/u)
  if (parseErrorBlockMatch?.index != null) {
    const parseErrorBlockStart = onConfirmBody.indexOf('{', parseErrorBlockMatch.index)
    const parseErrorBlock = findBalancedBlock(onConfirmBody, parseErrorBlockStart)
    snapshotParse.errorMessage = extractLegacyInlineMessageTitle(parseErrorBlock?.body || '')
  }

  const submitMatch = snapshotParse.adapterBinding
    ? onConfirmBody.match(
        new RegExp(
          `const\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*await\\s+${escapeRegExp(snapshotParse.adapterBinding)}\\.([A-Za-z_$][\\w$]*)\\s*\\(([\\s\\S]{0,240}?)\\)`,
          'u'
        )
      )
    : null
  const submitExecute = {
    successBinding: normalizeString(submitMatch?.[1]),
    receiverSource: normalizeString(snapshotParse.adapterBinding),
    submitMethod: normalizeString(submitMatch?.[2]),
    args: normalizeString(submitMatch?.[3])
      .split(',')
      .map((item) => normalizeString(item))
      .filter(Boolean),
    successCondition: normalizeString(submitMatch?.[1]) ? `truthy:${normalizeString(submitMatch?.[1])}` : '',
  }

  const successRefresh = {}
  if (submitExecute.successBinding) {
    const successBlockMatch = onConfirmBody.match(
      new RegExp(`if\\s*\\(\\s*${escapeRegExp(submitExecute.successBinding)}\\s*\\)\\s*\\{`, 'u')
    )
    if (successBlockMatch?.index != null) {
      const successBlockStart = onConfirmBody.indexOf('{', successBlockMatch.index)
      const successBlock = findBalancedBlock(onConfirmBody, successBlockStart)
      const successBlockBody = String(successBlock?.body || '')
      successRefresh.successMessage = extractLegacyInlineMessageTitle(successBlockBody)
      const refreshMatch = successBlockBody.match(/await\s+([A-Za-z_$][\w$]*)\s*\(/u)
      successRefresh.refreshHandler = normalizeString(refreshMatch?.[1])
      successRefresh.kind = successRefresh.refreshHandler ? 'reload-list' : ''
    }
  }

  return {
    sourceHandler: normalizeString(sourceHandler),
    confirmDialog,
    detailLoad,
    snapshotParse,
    submitExecute,
    successRefresh,
  }
}

function deriveLegacyHeaderActionKey({ sourceHandler = '', label = '', kind = '', index = 0 }) {
  const handlerKey = normalizeString(sourceHandler).replace(/[^A-Za-z0-9_$]+/gu, '')
  if (handlerKey) return handlerKey
  const labelKey = normalizeString(label).replace(/[^\p{L}\p{N}]+/gu, '')
  if (labelKey) return labelKey
  return `${kind || 'headerAction'}${index || 0}`
}

function resolveLegacyStringReference(source = '', expression = '') {
  const normalizedExpression = normalizeString(expression).replace(/,$/, '')
  if (!normalizedExpression) return ''
  const literalMatch = normalizedExpression.match(/^['"]([^'"]+)['"]$/u)
  if (literalMatch) return normalizeString(literalMatch[1])
  const escapedExpression = escapeRegExp(normalizedExpression)
  return normalizeString(
    source.match(
      new RegExp(`(?:export\\s+)?const\\s+${escapedExpression}\\s*=\\s*['"]([^'"]+)['"]`, 'u')
    )?.[1]
  )
}

function resolveLegacyRouteReference(source = '', expression = '') {
  const normalizedExpression = normalizeString(expression).replace(/,$/, '')
  if (!normalizedExpression) return ''
  const literalMatch = normalizedExpression.match(/^['"]([^'"]+)['"]$/u)
  if (literalMatch) return normalizeString(literalMatch[1])

  const objectPropertyMatch = normalizedExpression.match(/^([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)$/u)
  if (objectPropertyMatch) {
    const objectName = escapeRegExp(objectPropertyMatch[1])
    const propertyName = escapeRegExp(objectPropertyMatch[2])
    const objectBody =
      source.match(
        new RegExp(
          `(?:export\\s+)?const\\s+${objectName}\\s*=\\s*\\{([\\s\\S]{0,1600}?)\\}\\s*(?:as\\s+const)?`,
          'u'
        )
      )?.[1] || ''
    if (objectBody) {
      const routePath = normalizeString(
        objectBody.match(new RegExp(`${propertyName}\\s*:\\s*['"]([^'"]+)['"]`, 'u'))?.[1]
      )
      if (routePath) return routePath
    }
  }

  return resolveLegacyStringReference(source, normalizedExpression)
}

function extractLegacyNavigateEffect(handlerBody = '', label = '', navigationSource = '') {
  const path =
    handlerBody.match(/\bpath\s*:\s*['"]([^'"]+)['"]/)?.[1] ||
    handlerBody.match(/\bopenNewPage\s*\(\s*['"]([^'"]+)['"]/)?.[1] ||
    ''
  if (path) {
    const title =
      handlerBody.match(/\btitle\s*:\s*['"]([^'"]+)['"]/)?.[1] ||
      normalizeString(label)

    return {
      kind: 'navigate',
      effect: `navigate:${normalizeString(path)}`,
      routePath: normalizeString(path),
      targetTitle: normalizeString(title),
    }
  }

  const addPageCall = handlerBody.match(
    /\baddPage\s*\(\s*([^,]+?)\s*,\s*([A-Za-z_$@./'"][\w$@./'"-]*(?:\.[A-Za-z_$][\w$]*)?)\s*(?:,|\))/u
  )
  const routePath = resolveLegacyRouteReference(navigationSource, addPageCall?.[2] || '')
  if (!routePath) return null

  const title =
    resolveLegacyStringReference(navigationSource, addPageCall?.[1] || '') ||
    normalizeLegacyNavigateTargetTitleFallback(label)

  return {
    kind: 'navigate',
    effect: `navigate:${routePath}`,
    routePath,
    targetTitle: normalizeString(title),
  }
}

function extractLegacyDrawerContract(source = '', handlerBody = '') {
  const setter =
    handlerBody.match(/\b(set[A-Z][A-Za-z0-9_$]*)\s*\(\s*true\s*\)/)?.[1] || ''
  if (!setter) return null

  const stateKey =
    source.match(
      new RegExp(`\\[\\s*([A-Za-z_$][\\w$]*)\\s*,\\s*${escapeRegExp(setter)}\\s*\\]\\s*=\\s*useState`, 'u')
    )?.[1] || ''
  if (!stateKey) return null

  const component =
    source.match(
      new RegExp(`<([A-Z][A-Za-z0-9_$]*)\\b[\\s\\S]{0,240}?\\bvisible\\s*=\\s*\\{\\s*${escapeRegExp(stateKey)}\\s*\\}`, 'u')
    )?.[1] || ''
  if (!component) return null

  const importSource =
    source.match(
      new RegExp(`import\\s+${escapeRegExp(component)}\\s+from\\s+['"]([^'"]+)['"]`, 'u')
    )?.[1] || ''
  if (!importSource) return null

  return {
    component: normalizeString(component),
    importSource: normalizeString(importSource),
    visibleStateKey: normalizeString(stateKey),
    stateSetterKey: normalizeString(setter),
  }
}

function buildLegacyHeaderActionFact({
  source = '',
  sourcePath = '',
  sourceHandler = '',
  handlerBody = '',
  companionEntries = [],
  label = '',
  index = 0,
}) {
  const normalizedLabel = normalizeString(label)
  const normalizedHandler = normalizeString(sourceHandler)
  if (!normalizedLabel || !normalizedHandler) return null

  const importedHandler = resolveLegacyImportedHandlerBody({
    source,
    sourcePath,
    sourceHandler: normalizedHandler,
    companionEntries,
  })
  const normalizedBody = String(handlerBody || importedHandler.handlerBody || '')
  const navigationSource = normalizeString(importedHandler.sourceText) ? importedHandler.sourceText : source

  const baseFact = {
    label: normalizedLabel,
    sourceHandler: normalizedHandler,
    sourcePath: normalizeRelativePath(sourcePath),
  }

  if (/export|导出/u.test(`${normalizedLabel} ${normalizedHandler}`)) {
    return {
      trigger: 'click:export',
      kind: 'export',
      effect: 'request:export',
      key: 'export',
      ...baseFact,
    }
  }

  const navigateEffect = extractLegacyNavigateEffect(normalizedBody, normalizedLabel, navigationSource)
  if (navigateEffect) {
    return {
      trigger: `click:header-action:${deriveLegacyHeaderActionKey({
        sourceHandler: normalizedHandler,
        label: normalizedLabel,
        kind: 'navigate',
        index,
      })}`,
      key: deriveLegacyHeaderActionKey({
        sourceHandler: normalizedHandler,
        label: normalizedLabel,
        kind: 'navigate',
        index,
      }),
      ...baseFact,
      ...navigateEffect,
    }
  }

  const drawerContract = extractLegacyDrawerContract(source, normalizedBody)
  if (drawerContract) {
    return {
      trigger: `click:header-action:${deriveLegacyHeaderActionKey({
        sourceHandler: normalizedHandler,
        label: normalizedLabel,
        kind: 'open-drawer',
        index,
      })}`,
      key: deriveLegacyHeaderActionKey({
        sourceHandler: normalizedHandler,
        label: normalizedLabel,
        kind: 'open-drawer',
        index,
      }),
      kind: 'open-drawer',
      effect: `open:drawer:${drawerContract.component}`,
      drawerComponent: drawerContract.component,
      drawerImportSource: drawerContract.importSource,
      ...baseFact,
    }
  }

  if (/添加|新增|创建|管理/u.test(`${normalizedLabel} ${normalizedHandler}`)) {
    return {
      trigger: `click:header-action-unresolved:${deriveLegacyHeaderActionKey({
        sourceHandler: normalizedHandler,
        label: normalizedLabel,
        kind: 'unresolved',
        index,
      })}`,
      key: deriveLegacyHeaderActionKey({
        sourceHandler: normalizedHandler,
        label: normalizedLabel,
        kind: 'unresolved',
        index,
      }),
      kind: 'unresolved',
      effect: '',
      ...baseFact,
    }
  }

  return null
}

function extractLegacyDetailFactsFromSource(source = '') {
  const facts = []
  const drawerComponent = source.match(/<ServiceDrawer\b[\s\S]*?<([A-Z][A-Za-z0-9]*Detail)\b/)?.[1] || ''
  const detailRoutePath =
    source.match(/addPage\(\{[\s\S]{0,400}?path:\s*['"]([^'"]*Detail[^'"]*)['"]/)?.[1] || ''

  if (drawerComponent) {
    pushUniqueObjectFact(
      facts,
      {
        kind: 'drawer-detail',
        component: drawerComponent,
      },
      'component'
    )
  }

  if (detailRoutePath) {
    pushUniqueObjectFact(
      facts,
      {
        kind: 'detail-page-route',
        routePath: normalizeString(detailRoutePath),
      },
      'routePath'
    )
  }

  return facts
}

function collectLegacyFactCompletenessViolations({
  pageTypeId = '',
  layoutFacts = [],
  queryFacts = [],
  tableFacts = [],
  formFacts = [],
  detailFacts = [],
  apiContracts = [],
  interactionContracts = [],
} = {}) {
  const violations = []
  const normalizedPageTypeId = normalizeString(pageTypeId)
  const isFullPageDetail = normalizedPageTypeId === 'full-page-detail'
  const isListLikeTablePage = ['table-basic', 'table-stat', 'tree-table', 'tree-split'].includes(
    normalizedPageTypeId
  )

  if (!isFullPageDetail && layoutFacts.includes('query-filter') && queryFacts.length === 0) {
    violations.push('queryFacts is required when layoutFacts includes query-filter')
  }
  if (layoutFacts.includes('table') && tableFacts.length === 0) {
    violations.push('tableFacts is required when layoutFacts includes table')
  }
  if (!isFullPageDetail && layoutFacts.includes('form') && formFacts.length === 0) {
    violations.push('formFacts is required when layoutFacts includes form')
  }
  if (!isListLikeTablePage && (layoutFacts.includes('detail') || isFullPageDetail) && detailFacts.length === 0) {
    violations.push('detailFacts is required when layoutFacts includes detail')
  }
  if (
    ['query-filter', 'table', 'form', 'detail'].some((fact) => layoutFacts.includes(fact)) &&
    apiContracts.length === 0
  ) {
    violations.push('apiContracts is required when old-page business regions were detected')
  }
  if (interactionContracts.length === 0) {
    violations.push('interactionContracts must include at least one preserved user interaction')
  }

  return violations
}

function inferFallbackInteractionContracts({
  pageType = {},
  layoutFacts = [],
  routePath = '',
} = {}) {
  const pageTypeId = normalizeString(pageType?.id)
  if (pageTypeId !== 'full-page-detail') return []

  const hasDetailReadingFlow =
    layoutFacts.includes('detail') || layoutFacts.includes('detail-sections')
  if (!hasDetailReadingFlow) return []

  return [
    {
      trigger: 'click:page-header-back',
      effect: normalizeString(routePath) ? `navigate:${routePath}` : 'navigate:parent-list',
      source: 'auto-supplemented:full-page-detail-back',
    },
  ]
}

function extractLayoutFactsFromSources(sourceTexts, pageType) {
  const facts = new Set()
  const addFact = (fact) => {
    const normalized = normalizeString(fact)
    if (normalized) facts.add(normalized)
  }

  const combinedSource = sourceTexts.join('\n')

  if (combinedSource) {
    addFact('header')
    if (QUERY_MARKERS.some((pattern) => pattern.test(combinedSource))) addFact('query-filter')
    if (TABLE_MARKERS.some((pattern) => pattern.test(combinedSource))) addFact('table')
    if (PAGINATION_MARKERS.some((pattern) => pattern.test(combinedSource))) addFact('pagination')
    if (FORM_MARKERS.some((pattern) => pattern.test(combinedSource))) addFact('form')
    if (
      sourceTexts.some((source) =>
        DETAIL_LAYOUT_MARKERS.some((pattern) => pattern.test(String(source || '')))
      )
    ) {
      addFact('detail')
    }
    if (STAT_MARKERS.some((pattern) => pattern.test(combinedSource))) addFact('stat-section')
    if (CHART_MARKERS.some((pattern) => pattern.test(combinedSource))) addFact('chart-section')
  }

  for (const fallbackFact of buildFallbackLayoutFactsFromPageType(pageType)) {
    addFact(fallbackFact)
  }

  return [...facts]
}

function inferFallbackTitle({ title, topEvidence = null, dest = '' }) {
  if (normalizeString(title)) return normalizeString(title)
  if (normalizeString(topEvidence?.title)) return normalizeString(topEvidence.title)
  if (normalizeString(topEvidence?.name)) return normalizeString(topEvidence.name)
  if (normalizeString(topEvidence?.publicName)) {
    return normalizeString(topEvidence.publicName).replace(/^\.\//, '')
  }

  const normalizedDest = normalizeRelativePath(dest)
  if (!normalizedDest) return ''
  return path.posix.basename(normalizedDest)
}

function buildPromptSummary({ prompt, titleDraft }) {
  if (normalizeString(prompt)) return normalizeString(prompt)
  if (normalizeString(titleDraft)) {
    return `基于 hiui-design 重构旧页面“${titleDraft}”，保留旧业务语义，只做受管视觉升级。`
  }
  return '基于 hiui-design 对旧页面做受管重构，保留旧业务语义，只做视觉升级。'
}

function buildInvariants({ routePath, promptAnalysis, titleDraft, sourceCodePaths }) {
  const invariants = [
    normalizeString(titleDraft) ? `页面业务主题继续围绕“${titleDraft}”展开` : '',
    routePath ? '既有业务入口与目标路由语义保持一致' : '',
    sourceCodePaths.length > 0 ? '已有业务页面源码应作为事实来源，不按纯新页面生成' : '',
    promptAnalysis.preserveSignals.length > 0 ? '旧页面业务事实优先保留，只允许做受管视觉升级' : '',
    promptAnalysis.refactorSignals.length > 0 ? '重构范围限定为 hiui-design 受管页面结构，不扩展为宿主壳改造' : '',
  ]

  return uniqueStrings(invariants).slice(0, 8)
}

async function resolvePageTypeRecord({ skillRoot, line = '', pageTypeId = '' }) {
  if (!normalizeString(pageTypeId)) return null
  const { manifest } = await loadPageTypeManifest({ skillRoot, line })
  return manifest.pageTypes.find((pageType) => pageType.id === pageTypeId) || null
}

function matchesLegacyHint(text = '', patterns = []) {
  const normalizedText = normalizeString(text)
  if (!normalizedText) return false
  return patterns.some((pattern) => pattern.test(normalizedText))
}

function buildLegacyTypeHintText({
  promptAnalysis,
  titleDraft = '',
  routePath = '',
  dest = '',
  topEvidence = [],
} = {}) {
  return normalizeString(
    [
      promptAnalysis?.prompt || '',
      titleDraft,
      routePath,
      dest,
      ...topEvidence.flatMap((item) => [
        item?.title,
        item?.routePath,
        item?.name,
        item?.publicName,
        item?.relativePath,
      ]),
    ].join(' ')
  )
}

function upsertLegacyPageTypeCandidate(list, candidate) {
  if (!candidate?.pageType) return
  const existing = list.find((item) => item.pageType === candidate.pageType)

  if (!existing) {
    list.push(candidate)
    return
  }

  existing.score = Math.max(existing.score || 0, candidate.score || 0)
  existing.reasons = uniqueStrings([...(existing.reasons || []), ...(candidate.reasons || [])])
}

function buildLegacyPageTypeCandidates({
  availablePageTypes = new Map(),
  promptAnalysis,
  titleDraft = '',
  routePath = '',
  dest = '',
  topEvidence = [],
  layoutFacts = [],
  detailFacts = [],
  interactionContracts = [],
} = {}) {
  const candidates = []
  const layoutFactSet = new Set((layoutFacts || []).map((item) => normalizeString(item)).filter(Boolean))
  const detailKinds = new Set(
    (detailFacts || []).map((item) => normalizeString(item?.kind)).filter(Boolean)
  )
  const interactionKinds = new Set(
    (interactionContracts || []).map((item) => normalizeString(item?.kind)).filter(Boolean)
  )
  const interactionEffects = (interactionContracts || [])
    .map((item) => normalizeString(item?.effect))
    .filter(Boolean)
    .join(' ')
  const hintText = buildLegacyTypeHintText({
    promptAnalysis,
    titleDraft,
    routePath,
    dest,
    topEvidence,
  })
  const hasTable = layoutFactSet.has('table')
  const hasQueryFilter = layoutFactSet.has('query-filter')
  const hasStatSection = layoutFactSet.has('stat-section')
  const hasChartSection = layoutFactSet.has('chart-section')
  const hasForm = layoutFactSet.has('form')
  const hasDetail = layoutFactSet.has('detail') || detailKinds.size > 0
  const hasDrawerDetail = detailKinds.has('drawer-detail')
  const hasDetailRoute = detailKinds.has('detail-page-route')
  const hasDrawerInteraction =
    interactionKinds.has('open-drawer') || interactionEffects.includes('open:drawer:')
  const looksAnalytics = matchesLegacyHint(hintText, [
    /\banalytics\b/iu,
    /\banalysis\b/iu,
    /\bdashboard\b/iu,
    /\btrend\b/iu,
    /\bchart\b/iu,
    /分析/u,
    /图表/u,
    /趋势/u,
    /看板/u,
    /驾驶舱/u,
  ])
  const looksTree = matchesLegacyHint(hintText, [
    /\btree\b/iu,
    /树/u,
    /层级/u,
    /组织架构/u,
  ])
  const looksDrawer = matchesLegacyHint(hintText, [/\bdrawer\b/iu, /抽屉/u]) || hasDrawerInteraction
  const looksDetail =
    matchesLegacyHint(hintText, [/\bdetail\b/iu, /详情/u, /查看/u]) || hasDetailRoute || hasDrawerDetail
  const looksEdit =
    matchesLegacyHint(hintText, [/\bedit\b/iu, /编辑/u, /新建/u, /创建/u]) || hasForm

  const pushCandidate = (pageType, score, reasons = []) => {
    const pageTypeRecord = availablePageTypes.get(pageType)
    if (!pageTypeRecord) return
    upsertLegacyPageTypeCandidate(candidates, {
      pageType,
      pageFamily: normalizeString(pageTypeRecord.pageFamily),
      score,
      reasons: uniqueStrings(reasons),
    })
  }

  if ((looksAnalytics || hasChartSection) && !hasForm && !hasDetail) {
    pushCandidate('data-visualization', hasChartSection ? 0.99 : hasStatSection || !hasTable ? 0.92 : 0.86, [
      hasChartSection ? '旧页源码存在图表工作区信号' : '提示词包含分析/图表/驾驶舱语义',
      hasStatSection ? '旧页存在统计/指标工作区信号' : '',
      hasTable ? '旧页仍带表格区，但更像分析页尾部明细收口' : '',
    ])
  }

  if (hasTable && hasStatSection) {
    pushCandidate('table-stat', hasChartSection ? 0.84 : 0.95, [
      '旧页同时存在表格工作区和统计/指标工作区',
      hasQueryFilter ? '旧页同时存在查询/筛选工作区' : '',
      hasChartSection ? '旧页还存在独立图表工作区，应优先与分析页区分' : '',
    ])
  }

  if (looksTree && hasTable) {
    pushCandidate('tree-split', hasQueryFilter ? 0.84 : 0.79, [
      '提示词或路径包含树形/层级语义',
      '旧页主体仍包含表格工作区',
    ])
    pushCandidate('tree-table', hasQueryFilter ? 0.78 : 0.74, [
      '树形语义可能落在树表页型',
    ])
  }

  if (hasDrawerDetail) {
    pushCandidate('drawer-detail', 0.94, [
      '旧页详情事实显示为抽屉详情打开方式',
    ])
  }

  if (hasDrawerInteraction && hasForm && !hasTable) {
    pushCandidate('drawer-form', 0.93, [
      '旧页存在抽屉打开交互，主体又是表单工作区',
    ])
  }

  if (hasDetailRoute && !hasTable) {
    pushCandidate('full-page-detail', 0.88, [
      '旧页详情事实显示为独立详情路由',
    ])
  }

  if (hasDetail && !hasTable && !hasForm && !hasDrawerDetail) {
    pushCandidate('full-page-detail', looksDetail ? 0.82 : 0.78, [
      '旧页主体更像详情阅读页而不是列表页',
    ])
  }

  if (hasForm && !hasTable) {
    pushCandidate('full-page-edit', looksEdit ? 0.84 : 0.78, [
      '旧页主体更像表单/编辑工作区',
      looksDrawer ? '提示词同时包含抽屉语义，需与 drawer-form 做区分' : '',
    ])
    if (looksDrawer) {
      pushCandidate('drawer-form', 0.8, [
        '提示词包含抽屉语义，可能是抽屉表单',
      ])
    }
  }

  if (hasTable && hasQueryFilter) {
    pushCandidate('table-basic', hasChartSection ? 0.8 : 0.92, [
      '旧页存在查询/筛选 + 表格的稳定典型结构',
      hasChartSection ? '但旧页同时存在图表工作区，不宜直接收口为普通表格页' : '',
    ])
  }

  if (hasTable) {
    pushCandidate('table-basic', hasChartSection ? 0.7 : 0.78, [
      '旧页主体包含表格工作区',
      hasChartSection ? '图表区更像主工作区，表格更可能是分析页尾部明细' : '',
    ])
  }

  return candidates.sort((left, right) => {
    if ((right.score || 0) !== (left.score || 0)) return (right.score || 0) - (left.score || 0)
    return String(left.pageType || '').localeCompare(String(right.pageType || ''))
  })
}

function buildLegacyPageFamilyRecommendation({
  pageTypeCandidates = [],
  promptAnalysis,
} = {}) {
  if (!pageTypeCandidates.length) {
    return {
      recommended: '',
      candidates: [],
      confidence: 'low',
      reasons: uniqueStrings([...(promptAnalysis?.reasons || []), '旧页证据尚不足以收口页面家族']),
    }
  }

  const familyMap = new Map()
  for (const candidate of pageTypeCandidates) {
    const pageFamily = normalizeString(candidate.pageFamily)
    if (!pageFamily) continue
    const current = familyMap.get(pageFamily) || {
      pageFamily,
      score: 0,
      reasons: [],
    }
    current.score = Math.max(current.score || 0, candidate.score || 0)
    current.reasons = uniqueStrings([
      ...current.reasons,
      ...candidate.reasons,
      `候选页型 ${candidate.pageType} 指向 ${pageFamily}`,
    ])
    familyMap.set(pageFamily, current)
  }

  const candidates = [...familyMap.values()].sort((left, right) => {
    if ((right.score || 0) !== (left.score || 0)) return (right.score || 0) - (left.score || 0)
    return String(left.pageFamily || '').localeCompare(String(right.pageFamily || ''))
  })
  const topCandidate = candidates[0] || null
  const nextCandidate = candidates[1] || null
  const confidence =
    topCandidate && topCandidate.score >= 0.9 && (!nextCandidate || topCandidate.score - nextCandidate.score >= 0.1)
      ? 'high'
      : topCandidate && topCandidate.score >= 0.8
        ? 'medium'
        : 'low'

  return {
    recommended: normalizeString(topCandidate?.pageFamily),
    candidates: candidates.map((candidate) => ({
      pageFamily: candidate.pageFamily,
      score: candidate.score,
      reasons: candidate.reasons,
    })),
    confidence,
    reasons: uniqueStrings([
      ...(promptAnalysis?.reasons || []),
      topCandidate ? `旧页证据优先指向 ${topCandidate.pageFamily}` : '',
    ]),
  }
}

function buildLegacyPageTypeRecommendation({
  pageTypeCandidates = [],
  promptAnalysis,
} = {}) {
  const topCandidate = pageTypeCandidates[0] || null
  const nextCandidate = pageTypeCandidates[1] || null
  const confidence =
    topCandidate && topCandidate.score >= 0.9 && (!nextCandidate || topCandidate.score - nextCandidate.score >= 0.1)
      ? 'high'
      : topCandidate && topCandidate.score >= 0.8
        ? 'medium'
        : 'low'

  return {
    recommended: normalizeString(topCandidate?.pageType),
    candidates: pageTypeCandidates.map((candidate) => ({
      pageType: candidate.pageType,
      score: candidate.score,
      reasons: candidate.reasons,
    })),
    confidence,
    reasons: uniqueStrings([
      ...(promptAnalysis?.reasons || []),
      topCandidate ? `旧页证据优先指向 ${topCandidate.pageType}` : '',
    ]),
  }
}

function formatLegacyCandidateSummary(candidates = [], field = 'pageType') {
  return candidates
    .slice(0, 3)
    .map((candidate) => `${candidate[field]} (${Number(candidate.score || 0).toFixed(2)})`)
    .join(', ')
}

function resolveLegacyPageTypeSelection({
  explicitPageType = null,
  pageTypeCandidates = [],
} = {}) {
  const topCandidate = pageTypeCandidates[0] || null
  const nextCandidate = pageTypeCandidates[1] || null
  const summary = formatLegacyCandidateSummary(pageTypeCandidates)
  const hasSingleHighConfidenceCandidate =
    Boolean(topCandidate) &&
    topCandidate.score >= 0.9 &&
    (!nextCandidate || topCandidate.score - nextCandidate.score >= 0.1)

  if (explicitPageType) {
    const explicitCandidate = pageTypeCandidates.find(
      (candidate) => candidate.pageType === explicitPageType.id
    )

    if (
      topCandidate &&
      topCandidate.pageType !== explicitPageType.id &&
      topCandidate.score >= 0.9 &&
      (!explicitCandidate || topCandidate.score - explicitCandidate.score >= 0.1)
    ) {
      return {
        pageType: null,
        blockingReason:
          `Prompt suggests legacy-system-reconstruction, but explicit pageTypeId "${explicitPageType.id}" conflicts with old-page evidence. ` +
          `Recommended pageType is "${topCandidate.pageType}". ` +
          `${summary ? `Top candidates: ${summary}. ` : ''}` +
          'Stop and resolve the target page type before continuing.',
      }
    }

    return {
      pageType: explicitPageType,
      blockingReason: '',
    }
  }

  if (!topCandidate || !hasSingleHighConfidenceCandidate) {
    return {
      pageType: null,
      blockingReason:
        'Prompt suggests legacy-system-reconstruction, but the target page type could not be resolved with high confidence from old-page evidence. ' +
        `${summary ? `Top candidates: ${summary}. ` : ''}` +
        'Stop and resolve the target page type before continuing.',
    }
  }

  return {
    pageType: {
      id: topCandidate.pageType,
      pageFamily: topCandidate.pageFamily,
    },
    blockingReason: '',
  }
}

export async function resolveLegacyReconstructionContext({
  targetRoot,
  skillRoot,
  line = '',
  pageTypeId = '',
  title = '',
  routePath = '',
  dest = '',
  prompt = '',
  explicitInputMode = '',
} = {}) {
  const promptAnalysis = analyzeLegacyPrompt(prompt)
  const normalizedExplicitInputMode = normalizeString(explicitInputMode)
  const detectionReport = {
    requestedInputMode: normalizedExplicitInputMode || 'auto',
    promptMatched: promptAnalysis.matched,
    promptConfidence: promptAnalysis.confidence,
    promptReasons: promptAnalysis.reasons,
    evidenceSummary: [],
    sourceCodePaths: [],
    layoutFacts: [],
    invariants: [],
  }

  if (normalizedExplicitInputMode === 'prototype-screenshot') {
    return {
      status: 'skipped',
      attempted: false,
      autoDetected: false,
      effectiveInputMode: normalizedExplicitInputMode,
      legacyReconstructionInput: null,
      migrationInvariantContract: null,
      report: detectionReport,
      blockingReason: '',
    }
  }

  if (!promptAnalysis.matched) {
    return {
      status: 'not-applicable',
      attempted: false,
      autoDetected: false,
      effectiveInputMode: normalizedExplicitInputMode,
      legacyReconstructionInput: null,
      migrationInvariantContract: null,
      report: detectionReport,
      blockingReason: '',
    }
  }

  const { manifest } = await loadPageTypeManifest({ skillRoot, line })
  const availablePageTypes = new Map(
    (manifest.pageTypes || []).map((pageType) => [pageType.id, pageType])
  )
  const explicitPageTypeId = normalizeString(pageTypeId)
  const explicitPageType = explicitPageTypeId ? availablePageTypes.get(explicitPageTypeId) || null : null
  if (explicitPageTypeId && !explicitPageType) {
    return {
      status: 'blocked',
      attempted: true,
      autoDetected: false,
      effectiveInputMode: normalizedExplicitInputMode,
      legacyReconstructionInput: null,
      migrationInvariantContract: null,
      report: detectionReport,
      blockingReason: `Prompt suggests legacy-system-reconstruction, but pageTypeId "${pageTypeId}" does not exist in page-types.manifest.json.`,
    }
  }

  const businessEntryEvidence = await detectBusinessEntryEvidence(targetRoot, {
    routePath,
    title,
    dest,
  })
  const topEvidence = selectRelevantEvidence(businessEntryEvidence, {
    title,
    routePath,
    dest,
  })
  const managedDestImportHints = buildManagedDestImportHints(dest)
  const destCodePaths = await resolveDestCodePaths(targetRoot, dest)
  const evidenceCodePaths = await resolveEvidenceCodePaths(targetRoot, topEvidence)
  const legacyWrapperCandidates = await findLegacyWrapperCandidates(targetRoot, dest)
  const sourceEntries = []

  for (const candidate of legacyWrapperCandidates) {
    if (isThinReExportSource(candidate.source, managedDestImportHints)) {
      const historicalSource = readGitHistorySource(
        targetRoot,
        candidate.relativePath,
        managedDestImportHints
      )

      if (historicalSource?.source) {
        sourceEntries.push({
          relativePath: candidate.relativePath,
          content: historicalSource.source,
          sourceKind: 'git-history',
          commit: historicalSource.commit,
        })
        continue
      }
    }

    if (!isThinReExportSource(candidate.source, managedDestImportHints)) {
      sourceEntries.push({
        relativePath: candidate.relativePath,
        content: candidate.source,
        sourceKind: 'workspace',
        commit: '',
      })
    }
  }

  if (sourceEntries.length === 0) {
    const likelyLegacyEntryCandidates = await findLikelyLegacyEntryCandidates(targetRoot, dest)
    const fallbackSourceCodePaths = uniqueStrings([
      ...likelyLegacyEntryCandidates,
      ...evidenceCodePaths.filter((item) => !isPathInsideRoot(item, dest)),
      ...destCodePaths,
    ]).filter((item) => shouldIncludeLegacyCompanionCodePath(item))

    for (const relativePath of fallbackSourceCodePaths.slice(0, 4)) {
      const absolutePath = path.join(targetRoot, relativePath)
      const source = await readTextIfExists(absolutePath)
      if (!source) continue
      sourceEntries.push({
        relativePath,
        content: source,
        sourceKind: 'workspace',
        commit: '',
      })
    }
  }

  const enrichedSourceEntries = await collectLegacyCompanionSourceEntries(targetRoot, sourceEntries, {
    allowedRoot: dest,
  })
  const analysisSourceEntries = enrichedSourceEntries.filter(
    (entry) => !isManagedLegacyGeneratedSource(entry.content)
  )
  const effectiveSourceEntries =
    analysisSourceEntries.length > 0 ? analysisSourceEntries : enrichedSourceEntries
  const sourceCodePaths = uniqueStrings(effectiveSourceEntries.map((entry) => entry.relativePath))
  const sourceTexts = effectiveSourceEntries.map((entry) => entry.content).filter(Boolean)

  const titleDraft = inferFallbackTitle({
    title,
    topEvidence: topEvidence[0] || null,
    dest,
  })
  const rawLayoutFacts = extractLayoutFactsFromSources(sourceTexts, explicitPageType)
  const queryFacts = sourceTexts.flatMap((source) => extractLegacyQueryFactsFromSource(source))
  const tableFacts = sourceTexts.flatMap((source) => extractLegacyTableFactsFromSource(source))
  const apiContracts = effectiveSourceEntries.flatMap((entry) =>
    extractLegacyApiContractsFromSource(entry.content, entry.relativePath)
  )
  const detectedInteractionContracts = effectiveSourceEntries.flatMap((entry) =>
    extractLegacyInteractionContractsFromSource(entry.content, entry.relativePath, effectiveSourceEntries)
  )
  const detailFacts = sourceTexts.flatMap((source) => extractLegacyDetailFactsFromSource(source))
  const invariants = buildInvariants({
    routePath,
    promptAnalysis,
    titleDraft,
    sourceCodePaths,
  })
  const hasRepoEvidence = sourceCodePaths.length > 0 || topEvidence.length > 0

  detectionReport.evidenceSummary = [
    ...topEvidence.map((item) => summarizeEvidenceItem(item)),
    ...effectiveSourceEntries
      .filter((entry) => entry.sourceKind === 'git-history' && entry.commit)
      .map(
        (entry) =>
          `historicalSource=${entry.relativePath} | commit=${String(entry.commit).slice(0, 8)}`
      ),
  ]
  detectionReport.sourceCodePaths = sourceCodePaths
  detectionReport.layoutFacts = rawLayoutFacts
  detectionReport.invariants = invariants

  if (!hasRepoEvidence) {
    return {
      status: 'blocked',
      attempted: true,
      autoDetected: false,
      effectiveInputMode: normalizedExplicitInputMode,
      legacyReconstructionInput: null,
      migrationInvariantContract: null,
      report: detectionReport,
      blockingReason:
        'Prompt suggests legacy-system-reconstruction, but repo evidence is missing. Stop instead of silently falling back to page-prompt.',
    }
  }

  const pageTypeCandidates = buildLegacyPageTypeCandidates({
    availablePageTypes,
    promptAnalysis,
    titleDraft,
    routePath,
    dest,
    topEvidence,
    layoutFacts: rawLayoutFacts,
    detailFacts,
    interactionContracts: detectedInteractionContracts,
  })
  const pageFamilyRecommendation = buildLegacyPageFamilyRecommendation({
    pageTypeCandidates,
    promptAnalysis,
  })
  const pageTypeRecommendation = buildLegacyPageTypeRecommendation({
    pageTypeCandidates,
    promptAnalysis,
  })
  const pageTypeSelection = resolveLegacyPageTypeSelection({
    explicitPageType,
    pageTypeCandidates,
  })
  const resolvedPageType = pageTypeSelection.pageType

  detectionReport.pageFamilyRecommendation = pageFamilyRecommendation
  detectionReport.pageTypeRecommendation = pageTypeRecommendation
  detectionReport.pageTypeCandidates = pageTypeCandidates
  detectionReport.resolvedPageTypeId = normalizeString(resolvedPageType?.id)
  detectionReport.resolvedPageFamilyId = normalizeString(resolvedPageType?.pageFamily)

  if (!resolvedPageType) {
    return {
      status: 'blocked',
      attempted: true,
      autoDetected: false,
      effectiveInputMode: normalizedExplicitInputMode,
      legacyReconstructionInput: null,
      migrationInvariantContract: null,
      report: detectionReport,
      blockingReason: pageTypeSelection.blockingReason,
    }
  }

  const resolvedPageTypeRecord =
    availablePageTypes.get(resolvedPageType.id) || explicitPageType || null
  const layoutFacts = uniqueStrings([
    ...rawLayoutFacts,
    ...buildFallbackLayoutFactsFromPageType(resolvedPageTypeRecord),
  ])
  const interactionContracts = uniqueObjectFactsByKey(
    [...detectedInteractionContracts, ...inferFallbackInteractionContracts({
      pageType: resolvedPageTypeRecord,
      layoutFacts,
      routePath,
    })],
    'trigger'
  )
  const factCompletenessViolations = collectLegacyFactCompletenessViolations({
    pageTypeId: resolvedPageType.id,
    layoutFacts,
    queryFacts,
    tableFacts,
    formFacts: [],
    detailFacts,
    apiContracts,
    interactionContracts,
  })
  detectionReport.layoutFacts = layoutFacts

  if (
    !titleDraft ||
    layoutFacts.length === 0 ||
    invariants.length === 0 ||
    factCompletenessViolations.length > 0
  ) {
    return {
      status: 'blocked',
      attempted: true,
      autoDetected: false,
      effectiveInputMode: normalizedExplicitInputMode,
      legacyReconstructionInput: null,
      migrationInvariantContract: null,
      report: detectionReport,
      blockingReason:
        `Prompt suggests legacy-system-reconstruction, but the assembled old-page facts are incomplete: ${factCompletenessViolations.join('; ') || 'missing core old-page facts'}. Stop instead of silently falling back to page-prompt.`,
    }
  }

  const effectiveRoutePath = normalizeString(routePath) || normalizeString(topEvidence[0]?.routePath)
  const finalPrompt = buildPromptSummary({
    prompt,
    titleDraft,
  })
  const legacyReconstructionInput = {
    inputMode: 'legacy-system-reconstruction',
    evidence: {
      sourceRoute: effectiveRoutePath,
      sourceCodePaths,
      sourceUrl: '',
      sourceScreenshotPath: '',
      sourceSystemName: path.basename(targetRoot),
    },
    pageFamilyRecommendation: {
      recommended: normalizeString(resolvedPageType.pageFamily),
      candidates: pageFamilyRecommendation.candidates,
      confidence: pageFamilyRecommendation.confidence,
      reasons: pageFamilyRecommendation.reasons,
    },
    pageTypeRecommendation: {
      recommended: resolvedPageType.id,
      candidates: pageTypeRecommendation.candidates,
      confidence: pageTypeRecommendation.confidence,
      reasons: uniqueStrings([
        ...pageTypeRecommendation.reasons,
        explicitPageTypeId ? `显式 pageTypeId 仍按 ${explicitPageTypeId} 执行，并已通过旧页事实校验` : '',
      ]),
    },
    legacyFacts: {
      titleDraft,
      pageGoal: `保留“${titleDraft}”的旧业务语义与入口事实，按 hiui-design 做受管重构。`,
      layoutFacts,
      queryFacts,
      tableFacts,
      formFacts: [],
      detailFacts,
      apiContracts,
      interactionContracts,
      routeFacts: effectiveRoutePath
        ? {
            routePath: effectiveRoutePath,
          }
        : {},
      permissionFacts: [],
      invariants,
      unknowns: uniqueStrings([
        sourceCodePaths.length === 0 ? '旧页源码路径待补充确认' : '',
        topEvidence.length === 0 ? '旧页正式导航/发布入口证据待补充确认' : '',
      ]),
    },
    sourceMeta: {
      assemblyMode: 'auto-detected-from-telemetry-prompt',
      promptMatched: true,
      promptConfidence: promptAnalysis.confidence,
      evidenceSummary: detectionReport.evidenceSummary,
      sourceCodePaths,
    },
    confirmation: {
      confirmed: true,
      confirmedPageFamily: normalizeString(resolvedPageType.pageFamily),
      confirmedPageType: resolvedPageType.id,
      finalPrompt,
    },
  }

  const migrationInvariantContract = {
    mustKeepApiShape: true,
    mustKeepInteractionSemantics: true,
    mustKeepPermissionSemantics: true,
    mustKeepRouteTargets: Boolean(effectiveRoutePath || topEvidence.length > 0),
    allowedBehaviorDrift: [
      '允许替换为 hiui-design 受管页面壳、受管白色主体与统一视觉节奏',
    ],
    blockedReasons: [],
  }

  return {
    status: 'auto-detected',
    attempted: true,
    autoDetected: true,
    effectiveInputMode: 'legacy-system-reconstruction',
    resolvedPageTypeId: resolvedPageType.id,
    resolvedPageFamilyId: normalizeString(resolvedPageType.pageFamily),
    legacyReconstructionInput,
    migrationInvariantContract,
    report: detectionReport,
    blockingReason: '',
  }
}

export async function maybeAutoAssembleLegacyReconstructionInput(options = {}) {
  return resolveLegacyReconstructionContext(options)
}
