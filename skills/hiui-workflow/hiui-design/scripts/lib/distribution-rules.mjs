const COMMON_EXCLUDE_PATTERNS = [
  '.git',
  '.git/*',
  '.git/**',
  '.DS_Store',
  '**/.DS_Store',
  '.backup-*',
  '.backup-*/*',
  '.backup-*/**',
  '*.bak',
  '*.bak-*',
  '**/*.bak',
  '**/*.bak-*',
  '.codex-write-check',
  '.learnings/*',
  '.learnings/**',
  '.release.env',
  '.release.env.example',
  '.release.env.local',
  '.env.release',
  '.env.release.local',
  'tmp',
  'tmp/*',
  'tmp/**',
  'outputs/*',
  'outputs/**',
]

const MAINTAINER_ONLY_PATTERNS = [
  'docs/onboarding/global-sync-workflow.md',
  'PRIVACY.md',
  'scripts/activate-current-project-global-sync.mjs',
  'scripts/assert-maintainer-source.mjs',
  'scripts/build-skill-archive.mjs',
  'scripts/check-rules-coverage.mjs',
  'scripts/finalize-usage.mjs',
  'scripts/flush-pending-usage.mjs',
  'scripts/init-stats-identity.mjs',
  'scripts/log-usage.mjs',
  'scripts/manage-global-sync-daemon.mjs',
  'scripts/manage-global-sync-launch-agent.mjs',
  'scripts/manage-usage-service.mjs',
  'scripts/manage-usage-service-launch-agent.mjs',
  'scripts/mark-feishu-release-doc-synced.mjs',
  'scripts/publish-feishu-release-doc.mjs',
  'scripts/release-skill-archive.mjs',
  'scripts/report-preview-ready-usage.mjs',
  'scripts/serve-skill-usage.mjs',
  'scripts/setup-feishu-metrics-bitable.mjs',
  'scripts/sync-changelog.mjs',
  'scripts/sync-feishu-metrics-bitable.mjs',
  'scripts/sync-feishu-release-doc.mjs',
  'scripts/sync-global-skill.mjs',
  'scripts/sync-manifest-docs.mjs',
  'scripts/sync-open-source-package.mjs',
  'scripts/sync-shell-package-snapshot.mjs',
  'scripts/upload-release-archive-to-feishu.mjs',
  'scripts/verify-typical-page-maintainer-regressions.mjs',
  'scripts/lib/feishu-bitable-client.mjs',
  'scripts/lib/feishu-http-client.mjs',
  'scripts/lib/load-hiui-release-env.mjs',
  'scripts/lib/log-usage-event.mjs',
  'scripts/lib/maintainer-paths.mjs',
  'scripts/lib/stats-client.mjs',
  'scripts/lib/stats-config.mjs',
  'scripts/lib/stats-identity.mjs',
  'scripts/tests/build-skill-archive.test.mjs',
  'scripts/tests/report-preview-ready-usage.test.mjs',
  'src/typical-page-reuse/DOCTOR_REPORT.md',
  'src/typical-page-reuse/HOST_ADAPTER_SNIPPET.md',
  'src/typical-page-reuse/SMOKE_REPORT.md',
]

const RUNTIME_MIRROR_ALLOWED_USAGE_BACKEND_PATTERNS = [
  'PRIVACY.md',
  'scripts/finalize-usage.mjs',
  'scripts/flush-pending-usage.mjs',
  'scripts/init-stats-identity.mjs',
  'scripts/log-usage.mjs',
  'scripts/report-preview-ready-usage.mjs',
  'scripts/sync-team-package.mjs',
  'scripts/typical-page-preview-ready.mjs',
  'scripts/lib/log-usage-event.mjs',
  'scripts/lib/stats-client.mjs',
  'scripts/lib/stats-config.mjs',
  'scripts/lib/stats-identity.mjs',
]

const RUNTIME_MIRROR_EXTRA_BLOCKED_PATTERNS = [
  'scripts/tests/**/*.test.mjs',
]

const TEAM_PACKAGE_EXTRA_BLOCKED_PATTERNS = [
  'config/stats.default.env',
  'scripts/typical-page-preview-ready.mjs',
  'scripts/tests/**/*.test.mjs',
]

const TEAM_SYNC_ONLY_EXCLUDE_PATTERNS = [
  ...MAINTAINER_ONLY_PATTERNS,
]

const OPEN_SOURCE_PACKAGE_ALLOWED_PATTERNS = [
  'PRIVACY.md',
]

const OPEN_SOURCE_PACKAGE_EXTRA_BLOCKED_PATTERNS = [
  ['docs/onboarding/', 'usage-', 'stats.md'].join(''),
  ['docs/onboarding/', 'usage-', 'stats-contract.md'].join(''),
  'config/stats.default.env',
  'docs/business-lines',
  'docs/business-lines/*',
  'docs/business-lines/**',
  'docs/onboarding/one-click.md',
  'scripts/tests/**/*.test.mjs',
]

const PROJECT_IMAGE_BINARY_BLOCKED_PATTERNS = [
  'templates/project-images/**/*.png',
  'templates/project-images/**/*.jpg',
  'templates/project-images/**/*.jpeg',
  'templates/project-images/**/*.webp',
  'templates/project-images/**/*.gif',
  'templates/project-images/**/*.svg',
]

function normalizeRelativePath(relativePath) {
  return String(relativePath || '').split('\\').join('/')
}

function patternToRegExp(pattern) {
  const normalized = normalizeRelativePath(pattern)
  const segments = normalized.split('/')
  let regexSource = ''

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index]
    const isLast = index === segments.length - 1

    if (segment === '**') {
      regexSource += isLast ? '(?:.*)?' : '(?:[^/]+/)*'
      continue
    }

    const escaped = segment
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '[^/]*')

    regexSource += escaped
    if (!isLast) {
      regexSource += '/'
    }
  }

  return new RegExp(`^${regexSource}$`)
}

function matchesPattern(relativePath, pattern) {
  const normalized = normalizeRelativePath(relativePath)
  if (!normalized) return false
  return patternToRegExp(pattern).test(normalized)
}

function matchesAnyPattern(relativePath, patterns) {
  return patterns.some((pattern) => matchesPattern(relativePath, pattern))
}

function shouldExcludeFromAnyDistribution(relativePath) {
  return matchesAnyPattern(relativePath, COMMON_EXCLUDE_PATTERNS)
}

function shouldExcludeFromTeamDistribution(relativePath) {
  return matchesAnyPattern(relativePath, [
    ...COMMON_EXCLUDE_PATTERNS,
    ...TEAM_SYNC_ONLY_EXCLUDE_PATTERNS,
  ])
}

function getArchiveExcludePatterns({ includeMaintainerFiles = false } = {}) {
  return includeMaintainerFiles
    ? [...COMMON_EXCLUDE_PATTERNS, ...PROJECT_IMAGE_BINARY_BLOCKED_PATTERNS]
    : [...COMMON_EXCLUDE_PATTERNS, ...MAINTAINER_ONLY_PATTERNS, ...PROJECT_IMAGE_BINARY_BLOCKED_PATTERNS]
}

function getTeamDistributionBlockedPatterns() {
  return [
    ...COMMON_EXCLUDE_PATTERNS,
    ...TEAM_SYNC_ONLY_EXCLUDE_PATTERNS,
    ...TEAM_PACKAGE_EXTRA_BLOCKED_PATTERNS,
    ...PROJECT_IMAGE_BINARY_BLOCKED_PATTERNS,
  ]
}

function getRuntimeMirrorBlockedPatterns() {
  const allowed = new Set(RUNTIME_MIRROR_ALLOWED_USAGE_BACKEND_PATTERNS)
  return [
    ...COMMON_EXCLUDE_PATTERNS,
    ...TEAM_SYNC_ONLY_EXCLUDE_PATTERNS.filter((pattern) => !allowed.has(pattern)),
    ...RUNTIME_MIRROR_EXTRA_BLOCKED_PATTERNS,
    ...PROJECT_IMAGE_BINARY_BLOCKED_PATTERNS,
  ]
}

function getOpenSourcePackageBlockedPatterns() {
  const allowed = new Set(OPEN_SOURCE_PACKAGE_ALLOWED_PATTERNS)
  return [
    ...COMMON_EXCLUDE_PATTERNS,
    ...TEAM_SYNC_ONLY_EXCLUDE_PATTERNS.filter((pattern) => !allowed.has(pattern)),
    ...OPEN_SOURCE_PACKAGE_EXTRA_BLOCKED_PATTERNS,
    ...PROJECT_IMAGE_BINARY_BLOCKED_PATTERNS,
  ]
}

export {
  COMMON_EXCLUDE_PATTERNS,
  MAINTAINER_ONLY_PATTERNS,
  OPEN_SOURCE_PACKAGE_ALLOWED_PATTERNS,
  OPEN_SOURCE_PACKAGE_EXTRA_BLOCKED_PATTERNS,
  PROJECT_IMAGE_BINARY_BLOCKED_PATTERNS,
  RUNTIME_MIRROR_EXTRA_BLOCKED_PATTERNS,
  RUNTIME_MIRROR_ALLOWED_USAGE_BACKEND_PATTERNS,
  TEAM_PACKAGE_EXTRA_BLOCKED_PATTERNS,
  TEAM_SYNC_ONLY_EXCLUDE_PATTERNS,
  getArchiveExcludePatterns,
  getOpenSourcePackageBlockedPatterns,
  getRuntimeMirrorBlockedPatterns,
  getTeamDistributionBlockedPatterns,
  matchesAnyPattern,
  normalizeRelativePath,
  shouldExcludeFromAnyDistribution,
  shouldExcludeFromTeamDistribution,
}
