const MANAGED_LOCAL_RUNTIME_PREFIX = 'local-managed-runtime'
const MANAGED_LOCAL_RUNTIME_ROOT = 'components/hiui-design-runtime'
const MANAGED_LOCAL_RUNTIME_HOST_LOGICAL_SOURCE = `${MANAGED_LOCAL_RUNTIME_PREFIX}/host`
const DEFAULT_MANAGED_LOCAL_RUNTIME_SOURCE_BASE_DIR = 'src'

function normalizeImportSpecifier(value = '') {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/\.(?:[cm]?[jt]sx?)$/, '')
    .replace(/\/index$/, '')
    .replace(/\/+/g, '/')
    .replace(/^\.\/+/, '')
    .replace(/^\/+/, '')
}

export function isManagedLocalRuntimeLogicalSource(source = '') {
  return normalizeImportSpecifier(source).startsWith(MANAGED_LOCAL_RUNTIME_PREFIX)
}

export function resolveManagedLocalRuntimeModulePath(source = '') {
  const normalizedSource = normalizeImportSpecifier(source)
  if (!isManagedLocalRuntimeLogicalSource(normalizedSource)) return ''

  const suffix = normalizedSource
    .slice(MANAGED_LOCAL_RUNTIME_PREFIX.length)
    .replace(/^\/+/, '')

  return suffix ? `${MANAGED_LOCAL_RUNTIME_ROOT}/${suffix}` : MANAGED_LOCAL_RUNTIME_ROOT
}

export function isManagedLocalRuntimeImportSourceMatch(actualSource = '', logicalSource = '') {
  const expectedModulePath = resolveManagedLocalRuntimeModulePath(logicalSource)
  if (!expectedModulePath) return false

  const normalizedActualSource = normalizeImportSpecifier(actualSource)
  if (!normalizedActualSource) return false

  return (
    normalizedActualSource === expectedModulePath ||
    normalizedActualSource.endsWith(`/${expectedModulePath}`)
  )
}

export function getManagedLocalRuntimeRoot() {
  return MANAGED_LOCAL_RUNTIME_ROOT
}

export function getManagedLocalRuntimeHostLogicalSource() {
  return MANAGED_LOCAL_RUNTIME_HOST_LOGICAL_SOURCE
}

export function inferManagedLocalRuntimeSourceBaseDir(candidatePath = '') {
  const segments = normalizeImportSpecifier(candidatePath).split('/').filter(Boolean)
  if (segments[0] === 'src' || segments[0] === 'app') {
    return segments[0]
  }

  return DEFAULT_MANAGED_LOCAL_RUNTIME_SOURCE_BASE_DIR
}

export function getManagedLocalRuntimeStylePath(sourceBaseDir = '') {
  const baseDir = inferManagedLocalRuntimeSourceBaseDir(sourceBaseDir)
  return `${baseDir}/${MANAGED_LOCAL_RUNTIME_ROOT}/styles.css`
}

export function getManagedLocalRuntimeHostPath(sourceBaseDir = '') {
  const baseDir = inferManagedLocalRuntimeSourceBaseDir(sourceBaseDir)
  return `${baseDir}/${MANAGED_LOCAL_RUNTIME_ROOT}/host`
}
