const LOCAL_ONLY_SYNC_FILES = new Set([])

const LOCAL_ONLY_GIT_FILES = new Set([
  ...LOCAL_ONLY_SYNC_FILES,
  'scripts/README.md',
  'scripts/sync-changelog.mjs',
  'scripts/sync-global-skill.mjs',
])

function normalizeRelativePath(relativePath) {
  return String(relativePath || '').split('\\').join('/')
}

function shouldIgnoreForGitAutomation(relativePath) {
  const normalized = normalizeRelativePath(relativePath)
  if (!normalized) {
    return false
  }

  return (
    normalized === '.git' ||
    normalized.startsWith('.git/') ||
    normalized === '.release.env' ||
    normalized === '.release.env.local' ||
    normalized === '.env.release' ||
    normalized === '.env.release.local' ||
    normalized === 'outputs' ||
    normalized.startsWith('outputs/') ||
    LOCAL_ONLY_SYNC_FILES.has(normalized) ||
    normalized === '.codex-write-check' ||
    normalized === '.DS_Store' ||
    normalized.endsWith('/.DS_Store') ||
    LOCAL_ONLY_GIT_FILES.has(normalized)
  )
}

export function parseGitStatusEntries(statusOutput) {
  return String(statusOutput || '')
    .split('\n')
    .map((line) => line.replace(/\r$/, ''))
    .filter(Boolean)
    .map((line) => {
      if (line.length < 4) {
        return {
          ignored: false,
          line,
          paths: [],
        }
      }

      const payload = line.slice(2).trimStart()
      const rawPaths = payload.includes(' -> ') ? payload.split(' -> ') : [payload]
      const paths = rawPaths.map((entry) => normalizeRelativePath(entry.trim())).filter(Boolean)

      return {
        ignored: paths.every((entry) => shouldIgnoreForGitAutomation(entry)),
        line,
        paths,
      }
    })
}

export function filterRelevantGitStatus(statusOutput) {
  return parseGitStatusEntries(statusOutput)
    .filter((entry) => !entry.ignored)
    .map((entry) => entry.line)
    .join('\n')
}

export function collectRelevantGitPaths(statusOutput) {
  const relevantPaths = new Set()

  for (const entry of parseGitStatusEntries(statusOutput)) {
    if (entry.ignored) {
      continue
    }

    for (const filePath of entry.paths) {
      relevantPaths.add(filePath)
    }
  }

  return [...relevantPaths]
}

export function summarizeRelevantGitStatus(statusOutput, maxEntries = 10) {
  const relevantEntries = parseGitStatusEntries(statusOutput).filter((entry) => !entry.ignored)
  const previewEntries = relevantEntries.slice(0, Math.max(0, maxEntries))

  return {
    isDirty: relevantEntries.length > 0,
    omittedCount: Math.max(0, relevantEntries.length - previewEntries.length),
    previewLines: previewEntries.map((entry) => entry.line),
    totalEntries: relevantEntries.length,
  }
}
