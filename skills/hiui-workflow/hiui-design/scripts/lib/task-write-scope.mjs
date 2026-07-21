import { buildTaskWriteScope } from './managed-analytics-policy.mjs'
import { toContractSlug } from './rules-only-page-contracts.mjs'

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizePath(value) {
  return String(value || '').trim().replace(/\\/g, '/')
}

function stripSourceExtension(filePath) {
  return normalizePath(filePath).replace(/\.[cm]?[jt]sx?$/, '')
}

function resolveContractArtifactPath(generatedPagePath) {
  const normalizedPagePath = normalizePath(generatedPagePath)
  if (!normalizedPagePath) {
    return ''
  }

  return toContractSlug(stripSourceExtension(normalizedPagePath))
}

function resolveScopedPattern(pattern, generatedPagePath) {
  const normalizedPattern = normalizePath(pattern)
  const normalizedPagePath = normalizePath(generatedPagePath)
  if (!normalizedPattern) {
    return ''
  }

  return normalizedPattern
    .replace(/<selected-page-file>/g, normalizedPagePath || '<selected-page-file>')
    .replace(
      /<selected-page-contract>/g,
      resolveContractArtifactPath(normalizedPagePath) ||
        '<selected-page-contract>'
    )
}

function resolveScopedPatterns(patterns, generatedPagePath) {
  return Array.isArray(patterns)
    ? patterns
        .map((pattern) => resolveScopedPattern(pattern, generatedPagePath))
        .filter(Boolean)
    : []
}

function globToRegex(pattern) {
  const escaped = escapeRegExp(normalizePath(pattern))
  const regexSource = escaped
    .replace(/\\\*\\\*/g, '.*')
    .replace(/\\\*/g, '[^/]*')
  return new RegExp(`^${regexSource}$`)
}

export function pathMatchesWriteScopePattern(filePath, pattern) {
  const normalizedFilePath = normalizePath(filePath)
  const normalizedPattern = normalizePath(pattern)
  if (!normalizedFilePath || !normalizedPattern) {
    return false
  }

  return globToRegex(normalizedPattern).test(normalizedFilePath)
}

export function resolveTaskWriteScope({ contract, generatedPagePath }) {
  if (contract?.writeScope && typeof contract.writeScope === 'object') {
    return contract.writeScope
  }

  return buildTaskWriteScope({ pagePath: generatedPagePath })
}

export function collectWriteScopeViolations({
  changedFiles,
  contract,
  generatedPagePath,
}) {
  const writeScope = resolveTaskWriteScope({ contract, generatedPagePath })
  const allowedPaths = resolveScopedPatterns(writeScope?.allowedPaths, generatedPagePath)
  const forbiddenPaths = resolveScopedPatterns(writeScope?.forbiddenPaths, generatedPagePath)
  const normalizedPagePath = normalizePath(generatedPagePath)
  const seen = new Set()
  const violations = []

  for (const changedFile of Array.isArray(changedFiles) ? changedFiles : []) {
    const normalizedChangedFile = normalizePath(changedFile)
    if (!normalizedChangedFile || normalizedChangedFile === normalizedPagePath) {
      continue
    }

    let hasForbiddenViolation = false

    for (const forbiddenPattern of forbiddenPaths) {
      if (!pathMatchesWriteScopePattern(normalizedChangedFile, forbiddenPattern)) {
        continue
      }

      const key = `${normalizedPagePath}::${normalizedChangedFile}`
      if (seen.has(key)) {
        continue
      }
      seen.add(key)
      hasForbiddenViolation = true

      violations.push(
        `${normalizedPagePath} changed together with forbidden shared asset ${normalizedChangedFile}. writeScope blocks page tasks from mutating shared shells, public components, or vendor chart baselines in the same delivery diff.`
      )
    }

    if (
      !hasForbiddenViolation &&
      allowedPaths.length > 0 &&
      !allowedPaths.some((allowedPattern) =>
        pathMatchesWriteScopePattern(normalizedChangedFile, allowedPattern)
      )
    ) {
      const key = `${normalizedPagePath}::out-of-scope::${normalizedChangedFile}`
      if (seen.has(key)) {
        continue
      }
      seen.add(key)

      violations.push(
        `${normalizedPagePath} changed together with out-of-scope file ${normalizedChangedFile}. writeScope policy page-local-and-contract-artifacts-only only allows the page source, sibling stylesheets, managed page contract artifacts, and managed page registry indexes in the same delivery diff.`
      )
    }
  }

  return violations
}
