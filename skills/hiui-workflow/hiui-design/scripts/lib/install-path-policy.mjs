import path from 'node:path'

export const DEFAULT_INSTALL_EXCLUDED_PATHS = [
  '.git',
  'outputs',
  'preview-runtime/node_modules',
  'examples/host-integration/node_modules',
  'preview-runtime/dist',
  '.hiui-design-cache',
  '.local-context',
  'docs/business-lines',
  'examples/business-lines',
  'scripts/tests',
  'scripts/local-quality-gate.mjs',
  'scripts/ci-quality-gate.mjs',
  'scripts/package-clean-distribution.mjs',
  'scripts/verify-distribution-package.mjs',
  'scripts/sync-manifest-docs.mjs',
  'scripts/sync-shell-package-snapshot.mjs',
  'scripts/check-i18n-template-boundary.mjs',
  'scripts/verify-light-flow-regressions.mjs',
]

export function normalizeInstallRelativePath(value) {
  return String(value || '')
    .split(path.sep)
    .join('/')
    .replace(/^\.\/+/, '')
    .replace(/\/+$/, '')
}

export function shouldExcludeInstallPath(relativePath) {
  const normalized = normalizeInstallRelativePath(relativePath)
  if (!normalized) return false

  const baseName = path.posix.basename(normalized)
  if (baseName === '.DS_Store') return true
  if (baseName.endsWith('.log')) return true

  return DEFAULT_INSTALL_EXCLUDED_PATHS.some(
    (excludedPath) => normalized === excludedPath || normalized.startsWith(`${excludedPath}/`)
  )
}
