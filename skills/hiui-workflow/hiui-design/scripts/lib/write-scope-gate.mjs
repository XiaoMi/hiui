import fs from 'node:fs/promises'
import path from 'node:path'

function issue(code, message, pathLabel = '') {
  return { code, message, path: pathLabel }
}

function normalizeString(value) {
  return String(value ?? '').trim()
}

export function toProjectRelativePath(value) {
  const raw = normalizeString(value).replace(/\\/g, '/')
  const normalized = path.posix.normalize(raw).replace(/^\.\//u, '')
  return normalized === '.' ? '' : normalized
}

export function isUnsafeProjectPath(value) {
  const raw = normalizeString(value)
  const normalized = toProjectRelativePath(raw)
  return (
    !normalized ||
    raw.includes('\\') ||
    path.isAbsolute(raw) ||
    raw.startsWith('~') ||
    normalized === '..' ||
    normalized.startsWith('../') ||
    normalized.split('/').includes('..')
  )
}

export function isOverbroadScopePattern(value) {
  const normalized = toProjectRelativePath(value)
  return ['*', '**', '**/*', '.', './', './**', './**/*'].includes(normalized)
}

export function validateWriteScopePatterns(writeScope) {
  const issues = []
  if (!Array.isArray(writeScope) || writeScope.length === 0) {
    return {
      ok: false,
      issues: [issue('missing-write-scope', 'writeScope must contain at least one allowed project-relative path pattern.', 'writeScope')],
      patterns: [],
    }
  }

  const patterns = []
  for (const [index, pattern] of writeScope.entries()) {
    const normalized = toProjectRelativePath(pattern)
    if (isUnsafeProjectPath(pattern)) {
      issues.push(issue('unsafe-write-scope-pattern', 'writeScope pattern must be project-relative and must not escape the project.', `writeScope.${index}`))
      continue
    }
    if (isOverbroadScopePattern(pattern)) {
      issues.push(issue('overbroad-write-scope-pattern', 'writeScope pattern is too broad for page generation.', `writeScope.${index}`))
      continue
    }
    patterns.push(normalized)
  }

  return { ok: issues.length === 0, issues, patterns }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function patternToRegExp(pattern) {
  const placeholder = '\u0000GLOBSTAR\u0000'
  const escaped = escapeRegExp(pattern).replace(/\\\*\\\*/g, placeholder).replace(/\\\*/g, '[^/]*')
  return new RegExp(`^${escaped.replaceAll(placeholder, '.*')}$`, 'u')
}

export function pathMatchesWriteScope(candidatePath, patterns) {
  const candidate = toProjectRelativePath(candidatePath)
  return patterns.some((pattern) => {
    if (pattern.endsWith('/**')) {
      const prefix = pattern.slice(0, -3)
      return candidate === prefix || candidate.startsWith(`${prefix}/`)
    }
    if (!pattern.includes('*')) {
      return candidate === pattern || candidate.startsWith(`${pattern}/`)
    }
    return patternToRegExp(pattern).test(candidate)
  })
}

async function realpathIfExists(filePath) {
  try {
    return await fs.realpath(filePath)
  } catch {
    return ''
  }
}

async function resolveNearestExistingParent(filePath) {
  let current = filePath
  for (;;) {
    const real = await realpathIfExists(current)
    if (real) return { realPath: real, existingPath: current }
    const next = path.dirname(current)
    if (next === current) return { realPath: '', existingPath: '' }
    current = next
  }
}

export async function checkPathWithinWriteScope({ targetRoot = process.cwd(), candidatePath, writeScope }) {
  const scopeValidation = validateWriteScopePatterns(writeScope)
  const issues = [...scopeValidation.issues]
  const root = path.resolve(targetRoot)
  const candidateRaw = normalizeString(candidatePath)
  const absoluteCandidate = path.isAbsolute(candidateRaw) ? path.resolve(candidateRaw) : path.resolve(root, candidateRaw)
  const relativeCandidate = path.relative(root, absoluteCandidate).replace(/\\/g, '/')

  if (!candidateRaw) {
    issues.push(issue('missing-candidate-path', 'Candidate write path is required.', 'candidatePath'))
  } else if (relativeCandidate.startsWith('..') || path.isAbsolute(relativeCandidate) || isUnsafeProjectPath(relativeCandidate)) {
    issues.push(issue('candidate-outside-target', 'Candidate write path must stay inside target root.', 'candidatePath'))
  }

  const rootRealPath = await realpathIfExists(root)
  const nearestParent = await resolveNearestExistingParent(absoluteCandidate)
  if (rootRealPath && nearestParent.realPath) {
    const parentRelative = path.relative(rootRealPath, nearestParent.realPath)
    if (parentRelative.startsWith('..') || path.isAbsolute(parentRelative)) {
      issues.push(issue('candidate-symlink-escape', 'Candidate write path resolves outside target root through an existing path.', 'candidatePath'))
    }
  }

  if (scopeValidation.ok && relativeCandidate && !pathMatchesWriteScope(relativeCandidate, scopeValidation.patterns)) {
    issues.push(issue('candidate-outside-write-scope', 'Candidate write path is not allowed by writeScope.', 'candidatePath'))
  }

  return {
    ok: issues.length === 0,
    issues,
    candidatePath: relativeCandidate,
    patterns: scopeValidation.patterns,
  }
}

export function summarizeWriteScopeViolation(result) {
  const issues = Array.isArray(result?.issues) ? result.issues : []
  return issues.map((item) => `${item.path || 'writeScope'}: ${item.message}`).join('; ')
}

export async function assertWithinWriteScope(options) {
  const result = await checkPathWithinWriteScope(options)
  if (!result.ok) {
    throw new Error(summarizeWriteScopeViolation(result) || 'Candidate write path is outside writeScope.')
  }
  return result
}
