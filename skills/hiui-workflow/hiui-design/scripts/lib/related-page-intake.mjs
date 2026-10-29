import fs from 'node:fs/promises'
import path from 'node:path'

import {
  detectBusinessEntryEvidence,
  normalizeRelativePath,
  tokenizeBusinessEntryText,
} from './business-entry-evidence.mjs'

const SUPPORTED_BUSINESS_ROOTS = ['src/views', 'src/pages', 'src/features']
const SUPPORTED_ENTRY_FILE_PATTERN = /^(index|page)\.[cm]?[jt]sx?$/i
const NON_INHERITABLE_PAGE_DIR_PREFIXES = ['src/typical-page-preview']
const FORMAL_PAGE_TITLE_SIGNAL_PATTERNS = [
  /(?:^|[,{(\s])title\s*:\s*(['"`])([^'"`\n]{2,60})\1/gu,
  /\btitle\s*=\s*(['"`])([^'"`\n]{2,60})\1/gu,
  /(?:^|[,{(\s])(?:pageTitle|headerTitle|menuTitle|entryTitle)\s*:\s*(['"`])([^'"`\n]{2,60})\1/gu,
  /\b(?:pageTitle|headerTitle|menuTitle|entryTitle)\s*=\s*(['"`])([^'"`\n]{2,60})\1/gu,
  /\b(?:const|let|var)\s+[A-Za-z0-9_$]*TITLE[A-Za-z0-9_$]*\s*=\s*(['"`])([^'"`\n]{2,60})\1/gu,
]
const RELATED_PAGE_NAME_HINT_PATTERNS = [
  /关联页面[“"'`]?([^“”"'`\n]{2,40})[”"'`]?/gu,
  /在[“"'`]?([^“”"'`\n，。；、]{2,30}?)[”"'`]?(?:列表页|列表|页面|页)?(?:中)?(?:增加|新增|添加|点击|进入|打开|跳转)/gu,
  /从[“"'`]?([^“”"'`\n，。；、]{2,30}?)[”"'`]?(?:列表页|列表|页面|页)?(?:中)?(?:点击|进入|打开|跳转)/gu,
]

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeStringArray(values) {
  return Array.isArray(values)
    ? values.map((value) => normalizeString(value)).filter(Boolean)
    : []
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

function normalizePromptPageName(value = '') {
  return normalizeString(value)
    .replace(/^(?:在|从)/u, '')
    .replace(/(?:列表页|列表|页面|页)$/u, '')
    .trim()
}

function normalizeProjectRelativePath(value = '') {
  return normalizeRelativePath(value)
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
}

function deriveDestRelationContext(dest = '') {
  const normalizedDest = normalizeProjectRelativePath(dest)
  if (!normalizedDest) {
    return {
      currentPageDir: '',
      parentModuleDir: '',
    }
  }

  const currentPageDir = normalizedDest.replace(/\/(?:index|page)\.[cm]?[jt]sx?$/i, '')
  const parentModuleDir =
    currentPageDir && currentPageDir.includes('/')
      ? normalizeProjectRelativePath(path.posix.dirname(currentPageDir))
      : ''

  return {
    currentPageDir,
    parentModuleDir:
      parentModuleDir && parentModuleDir !== currentPageDir ? parentModuleDir : '',
  }
}

function countSharedTokens(leftTokens, rightTokens) {
  const rightSet = new Set(
    normalizeStringArray(rightTokens).map((item) => item.toLowerCase())
  )
  let count = 0

  for (const token of normalizeStringArray(leftTokens)) {
    if (rightSet.has(token.toLowerCase())) count += 1
  }

  return count
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

async function statIfExists(targetPath) {
  try {
    return await fs.stat(targetPath)
  } catch {
    return null
  }
}

async function walkCodeFiles(rootDir, onFile) {
  let entries = []
  try {
    entries = await fs.readdir(rootDir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const absolutePath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      await walkCodeFiles(absolutePath, onFile)
      continue
    }
    await onFile(absolutePath)
  }
}

function extractFormalPageTitleSignals(source = '') {
  const titleSignals = []
  const text = String(source || '')

  for (const pattern of FORMAL_PAGE_TITLE_SIGNAL_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      titleSignals.push(normalizeString(match[2]))
    }
  }

  return uniqueStrings(titleSignals)
}

function normalizeEvidenceExactMatchValue(value = '') {
  return normalizeString(value)
    .replace(/^\.\/+/, '')
    .replace(/^@[^/]+\//, '')
}

function isSupportedEntryPath(relativePath = '') {
  const normalizedPath = normalizeProjectRelativePath(relativePath)
  if (!normalizedPath) return false

  if (
    NON_INHERITABLE_PAGE_DIR_PREFIXES.some((prefix) =>
      normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
    )
  ) {
    return false
  }

  const fileName = path.posix.basename(normalizedPath)
  if (!SUPPORTED_ENTRY_FILE_PATTERN.test(fileName)) return false

  return SUPPORTED_BUSINESS_ROOTS.some(
    (root) => normalizedPath === root || normalizedPath.startsWith(`${root}/`)
  )
}

async function collectCandidatePageEntries(targetRoot, { evidenceIndex } = {}) {
  const candidates = []

  for (const root of SUPPORTED_BUSINESS_ROOTS) {
    const absoluteRoot = path.join(targetRoot, root)
    if (!(await pathExists(absoluteRoot))) continue

    await walkCodeFiles(absoluteRoot, async (absolutePath) => {
      const relativePath = normalizeProjectRelativePath(path.relative(targetRoot, absolutePath))
      if (!isSupportedEntryPath(relativePath)) return

      const source = await readTextIfExists(absolutePath)
      const relatedEvidence = evidenceIndex?.get(relativePath) || []
      const formalPageTitleSignals = extractFormalPageTitleSignals(source)
      const pathTokens = uniqueStrings([
        ...tokenizeBusinessEntryText(relativePath),
        ...tokenizeBusinessEntryText(path.posix.dirname(relativePath)),
      ])

      candidates.push({
        path: relativePath,
        source,
        relatedEvidence,
        formalPageTitleSignals,
        hasFormalEntryEvidence: relatedEvidence.length > 0,
        eligibleForAutoDetect:
          relatedEvidence.length > 0 || formalPageTitleSignals.length > 0,
        pathTokens,
      })
    })
  }

  return candidates
}

async function resolveSupportedEntryPath(targetRoot, relativePath = '') {
  const normalizedPath = normalizeProjectRelativePath(relativePath)
  if (!normalizedPath) return ''

  if (isSupportedEntryPath(normalizedPath) && (await pathExists(path.join(targetRoot, normalizedPath)))) {
    return normalizedPath
  }

  const absolutePath = path.join(targetRoot, normalizedPath)
  const pathStat = await statIfExists(absolutePath)
  if (!pathStat?.isDirectory()) return ''

  let entries = []
  try {
    entries = await fs.readdir(absolutePath, { withFileTypes: true })
  } catch {
    return ''
  }

  const matchedEntry = entries
    .filter((entry) => entry.isFile() && SUPPORTED_ENTRY_FILE_PATTERN.test(entry.name))
    .map((entry) => normalizeProjectRelativePath(path.posix.join(normalizedPath, entry.name)))
    .sort((left, right) => left.localeCompare(right))[0]

  return isSupportedEntryPath(matchedEntry) ? matchedEntry : ''
}

async function buildCandidatePageEntry(targetRoot, relativePath, { evidenceIndex } = {}) {
  const resolvedEntryPath = await resolveSupportedEntryPath(targetRoot, relativePath)
  if (!resolvedEntryPath) return null

  const source = await readTextIfExists(path.join(targetRoot, resolvedEntryPath))
  const relatedEvidence = evidenceIndex?.get(resolvedEntryPath) || []
  const formalPageTitleSignals = extractFormalPageTitleSignals(source)
  const pathTokens = uniqueStrings([
    ...tokenizeBusinessEntryText(resolvedEntryPath),
    ...tokenizeBusinessEntryText(path.posix.dirname(resolvedEntryPath)),
  ])

  return {
    path: resolvedEntryPath,
    source,
    relatedEvidence,
    formalPageTitleSignals,
    hasFormalEntryEvidence: relatedEvidence.length > 0,
    eligibleForAutoDetect:
      relatedEvidence.length > 0 || formalPageTitleSignals.length > 0,
    pathTokens,
  }
}

async function collectEvidenceBackedCandidatePageEntries(targetRoot, { evidenceIndex } = {}) {
  const candidatePaths = new Set()

  for (const candidateKey of evidenceIndex?.keys?.() || []) {
    const resolvedPath = await resolveSupportedEntryPath(targetRoot, candidateKey)
    if (resolvedPath) candidatePaths.add(resolvedPath)
  }

  const candidates = []
  for (const candidatePath of candidatePaths) {
    const candidate = await buildCandidatePageEntry(targetRoot, candidatePath, {
      evidenceIndex,
    })
    if (candidate) candidates.push(candidate)
  }

  return candidates
}

function extractPromptPageNames({ prompt = '', requestedTitle = '' } = {}) {
  const normalizedPrompt = normalizeString(prompt)
  if (!normalizedPrompt) return []

  const rawNames = [
    ...Array.from(normalizedPrompt.matchAll(/[“"'`]([^“”"'`\n]{2,40})[”"'`]/g)).map((match) =>
      normalizeString(match[1])
    ),
  ]

  for (const pattern of RELATED_PAGE_NAME_HINT_PATTERNS) {
    for (const match of normalizedPrompt.matchAll(pattern)) {
      rawNames.push(normalizeString(match[1]))
    }
  }

  return uniqueStrings(rawNames.map((item) => normalizePromptPageName(item))).filter(
    (item) => item && item !== normalizeString(requestedTitle)
  )
}

function buildCandidateEvidenceIndex(evidenceItems = []) {
  const evidenceIndex = new Map()
  const push = (key, item) => {
    if (!key) return
    const normalizedKey = normalizeProjectRelativePath(key)
    if (!normalizedKey) return
    const list = evidenceIndex.get(normalizedKey) || []
    list.push(item)
    evidenceIndex.set(normalizedKey, list)
  }

  for (const item of evidenceItems) {
    push(item.path, item)
    push(item.entryPath, item)
    push(item.sourcePath, item)
    if (item.sourcePath) {
      push(`${normalizeProjectRelativePath(item.sourcePath)}/index.jsx`, item)
      push(`${normalizeProjectRelativePath(item.sourcePath)}/index.tsx`, item)
    }
  }

  return evidenceIndex
}

function scoreRelatedPageCandidate({
  candidate,
  promptPageNames = [],
  evidenceIndex,
  dest = '',
}) {
  if (!candidate.eligibleForAutoDetect) {
    return {
      path: candidate.path,
      score: 0,
      reasons: [],
      exactHighConfidenceMatches: [],
    }
  }

  let score = 0
  const reasons = []
  const exactHighConfidenceMatches = []
  const relatedEvidence = candidate.relatedEvidence || evidenceIndex.get(candidate.path) || []
  const formalPageTitleSignals = normalizeStringArray(candidate.formalPageTitleSignals)
  const candidateDir = normalizeProjectRelativePath(path.posix.dirname(candidate.path))
  const { currentPageDir, parentModuleDir } = deriveDestRelationContext(dest)

  for (const pageName of promptPageNames) {
    if (formalPageTitleSignals.includes(pageName)) {
      score += 1200
      exactHighConfidenceMatches.push(pageName)
      reasons.push(`page-title-match:${pageName}`)
    }

    const requestedTokens = tokenizeBusinessEntryText(pageName)
    const sharedPathTokens = countSharedTokens(requestedTokens, candidate.pathTokens)
    if (sharedPathTokens > 0) {
      score += sharedPathTokens * 80
      reasons.push(`path-token-match:${pageName}`)
    }

    for (const evidence of relatedEvidence) {
      const exactEvidenceValues = uniqueStrings([
        normalizeEvidenceExactMatchValue(evidence.title),
        normalizeEvidenceExactMatchValue(evidence.name),
        normalizeEvidenceExactMatchValue(evidence.publicName),
        normalizeEvidenceExactMatchValue(evidence.routePath),
      ])
      if (exactEvidenceValues.includes(normalizeEvidenceExactMatchValue(pageName))) {
        score += 1000
        exactHighConfidenceMatches.push(pageName)
        reasons.push(`business-entry-exact-match:${pageName}`)
      }

      const evidenceTokens = uniqueStrings([
        ...tokenizeBusinessEntryText(evidence.title),
        ...tokenizeBusinessEntryText(evidence.name),
        ...tokenizeBusinessEntryText(evidence.publicName),
        ...tokenizeBusinessEntryText(evidence.routePath),
      ])
      const sharedEvidenceTokens = countSharedTokens(requestedTokens, evidenceTokens)
      if (sharedEvidenceTokens > 0) {
        score += sharedEvidenceTokens * 60
        reasons.push(`business-entry-token-match:${pageName}`)
      }
    }
  }

  if (currentPageDir && candidateDir === currentPageDir) {
    score -= 900
    reasons.push('same-destination-page')
  }

  if (parentModuleDir && candidateDir === parentModuleDir) {
    score += 500
    reasons.push('parent-module-entry')
  } else if (parentModuleDir && candidateDir.startsWith(`${parentModuleDir}/`)) {
    score -= 300
    reasons.push('sibling-subview-under-parent-module')
  }

  return {
    path: candidate.path,
    score,
    reasons: uniqueStrings(reasons),
    exactHighConfidenceMatches: uniqueStrings(exactHighConfidenceMatches),
  }
}

function buildNoResolutionPayload({
  status,
  promptPageNames,
  candidates = [],
  reason = '',
}) {
  return {
    status,
    relatedPagePath: '',
    autoDetected: false,
    confidence: candidates.length > 0 ? 'medium' : 'low',
    promptPageNames,
    candidates,
    reason,
  }
}

function rankRelatedPageCandidates({
  pageCandidates = [],
  promptPageNames = [],
  evidenceIndex,
  dest = '',
}) {
  return pageCandidates
    .map((candidate) =>
      scoreRelatedPageCandidate({
        candidate,
        promptPageNames,
        evidenceIndex,
        dest,
      })
    )
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.path.localeCompare(right.path))
}

function buildResolutionFromScoredCandidates({
  promptPageNames,
  scoredCandidates = [],
}) {
  const topCandidate = scoredCandidates[0] || null
  const secondCandidate = scoredCandidates[1] || null

  if (!topCandidate) {
    return buildNoResolutionPayload({
      status: 'no-match',
      promptPageNames,
      candidates: [],
      reason: 'No supported page entry matched the related page names extracted from the prompt.',
    })
  }

  const exactSignalWinner = topCandidate.exactHighConfidenceMatches.length > 0
  const scoreGap = topCandidate.score - (secondCandidate?.score || 0)
  const hasUniqueHighConfidenceWinner =
    (exactSignalWinner && scoreGap >= 150) ||
    (topCandidate.score >= 900 && scoreGap >= 150) ||
    (topCandidate.score >= 360 && scoreGap >= 60) ||
    (topCandidate.score >= 300 && !secondCandidate)

  const visibleCandidates = scoredCandidates.slice(0, 3).map((candidate) => ({
    path: candidate.path,
    score: candidate.score,
    reasons: candidate.reasons,
  }))

  if (!hasUniqueHighConfidenceWinner) {
    return buildNoResolutionPayload({
      status: 'ambiguous',
      promptPageNames,
      candidates: visibleCandidates,
      reason:
        'The prompt suggests a related page, but multiple supported page entries remain plausible candidates.',
    })
  }

  return {
    status: 'auto-detected',
    relatedPagePath: topCandidate.path,
    autoDetected: true,
    confidence: exactSignalWinner ? 'high' : 'medium',
    promptPageNames,
    candidates: visibleCandidates,
    reason: exactSignalWinner
      ? 'The prompt-related page name matched a formal page title or formal business entry signal.'
      : 'The prompt-related page name matched one supported page entry significantly better than the remaining candidates.',
  }
}

export async function maybeResolveRelatedPagePathFromPrompt({
  targetRoot,
  prompt = '',
  requestedTitle = '',
  routePath = '',
  dest = '',
} = {}) {
  const promptPageNames = extractPromptPageNames({
    prompt,
    requestedTitle,
  })
  if (promptPageNames.length === 0) {
    return {
      status: 'not-applicable',
      relatedPagePath: '',
      autoDetected: false,
      confidence: 'low',
      promptPageNames: [],
      candidates: [],
      reason: '',
    }
  }

  const evidenceItems = await detectBusinessEntryEvidence(targetRoot, {
    title: requestedTitle,
    routePath,
    dest,
  })
  const evidenceIndex = buildCandidateEvidenceIndex(evidenceItems)
  const fastPathCandidates = await collectEvidenceBackedCandidatePageEntries(targetRoot, {
    evidenceIndex,
  })
  const fastPathResolution = buildResolutionFromScoredCandidates({
    promptPageNames,
    scoredCandidates: rankRelatedPageCandidates({
      pageCandidates: fastPathCandidates,
      promptPageNames,
      evidenceIndex,
      dest,
    }),
  })
  if (fastPathResolution.status === 'auto-detected') {
    return fastPathResolution
  }

  const pageCandidates = await collectCandidatePageEntries(targetRoot, { evidenceIndex })
  return buildResolutionFromScoredCandidates({
    promptPageNames,
    scoredCandidates: rankRelatedPageCandidates({
      pageCandidates,
      promptPageNames,
      evidenceIndex,
      dest,
    }),
  })
}
