import fs from 'node:fs/promises'
import path from 'node:path'

const MANIFEST_SCHEMA_VERSION = 'hiui-design-sync-manifest.v1'
const VALID_SYNC_PROFILES = new Set(['minimal', 'workbench'])

const SYNC_MANIFEST_BY_MODE_AND_PROFILE = {
  'host-integration:minimal': 'host-integration-sync-manifest.json',
  'rules-only:minimal': 'rules-only-sync-manifest.json',
  'legacy-host-compatible:minimal': 'legacy-minimal-sync-manifest.json',
  'legacy-host-compatible:workbench': 'workbench-sync-manifest.json',
}

function toPosixPath(value) {
  return String(value || '').split(path.sep).join('/').replace(/\\/g, '/')
}

function normalizeRelativePath(value) {
  return toPosixPath(value).replace(/^\.\//u, '').replace(/\/+$/u, '')
}

function hasUnsafePathSegment(value) {
  const normalized = normalizeRelativePath(value)
  return !normalized || path.isAbsolute(normalized) || normalized.split('/').includes('..')
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

export function normalizeSyncProfile(profile) {
  const normalized = String(profile || 'minimal').trim() || 'minimal'
  if (!VALID_SYNC_PROFILES.has(normalized)) {
    throw new Error(`Unsupported hiui-design sync profile: ${normalized}. Expected minimal or workbench.`)
  }
  return normalized
}

export function validateSyncManifest(manifest, manifestPath = 'sync manifest') {
  const issues = []
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    return { ok: false, issues: [`${manifestPath} must be a JSON object.`] }
  }
  if (manifest.schemaVersion !== MANIFEST_SCHEMA_VERSION) {
    issues.push(`${manifestPath} schemaVersion must be ${MANIFEST_SCHEMA_VERSION}.`)
  }
  if (!VALID_SYNC_PROFILES.has(manifest.profile)) {
    issues.push(`${manifestPath} profile must be one of: ${[...VALID_SYNC_PROFILES].join(', ')}.`)
  }
  if (!Array.isArray(manifest.paths) || manifest.paths.length === 0) {
    issues.push(`${manifestPath} paths must contain at least one project-relative path.`)
  }
  for (const [index, entry] of (manifest.paths || []).entries()) {
    if (hasUnsafePathSegment(entry)) {
      issues.push(`${manifestPath} paths.${index} must be a safe relative path.`)
    }
  }
  for (const [index, entry] of (manifest.exclude || []).entries()) {
    const normalized = normalizeRelativePath(String(entry || '').replace(/\/\*\*$/u, ''))
    if (hasUnsafePathSegment(normalized)) {
      issues.push(`${manifestPath} exclude.${index} must be a safe relative path or /** pattern.`)
    }
  }
  return { ok: issues.length === 0, issues }
}

export async function loadMinimalSyncManifest(skillRoot) {
  return loadSyncManifest(skillRoot, 'config/legacy-minimal-sync-manifest.json')
}

export async function loadSyncManifest(skillRoot, relativeManifestPath) {
  const manifestPath = path.join(skillRoot, normalizeRelativePath(relativeManifestPath))
  const manifest = await readJson(manifestPath)
  const validation = validateSyncManifest(manifest, manifestPath)
  if (!validation.ok) {
    throw new Error(validation.issues.join('; '))
  }
  return { manifest, manifestPath }
}

export async function loadSyncManifestForModeProfile(skillRoot, { mode, syncProfile }) {
  const normalizedSyncProfile = normalizeSyncProfile(syncProfile)
  const key = `${mode}:${normalizedSyncProfile}`
  const manifestFilename = SYNC_MANIFEST_BY_MODE_AND_PROFILE[key]
  if (!manifestFilename) {
    return normalizedSyncProfile === 'workbench'
      ? loadSyncManifest(skillRoot, 'config/workbench-sync-manifest.json')
      : loadMinimalSyncManifest(skillRoot)
  }
  return loadSyncManifest(skillRoot, path.join('config', manifestFilename))
}

export function manifestPathIsExcluded(relativePath, excludePatterns = []) {
  const normalized = normalizeRelativePath(relativePath)
  return excludePatterns.some((pattern) => {
    const exclude = normalizeRelativePath(pattern)
    if (!exclude) return false
    if (exclude.endsWith('/**')) {
      const prefix = exclude.slice(0, -3)
      return normalized === prefix || normalized.startsWith(`${prefix}/`)
    }
    return normalized === exclude || normalized.startsWith(`${exclude}/`)
  })
}

export async function buildSyncPairsFromManifest({ skillRoot, destRoot, manifest }) {
  const pairs = []
  const missingPaths = []
  const exclude = manifest.exclude || []
  for (const rawPath of manifest.paths) {
    const relativePath = normalizeRelativePath(rawPath)
    if (manifestPathIsExcluded(relativePath, exclude)) {
      continue
    }
    const sourcePath = path.join(skillRoot, relativePath)
    if (!(await pathExists(sourcePath))) {
      missingPaths.push(relativePath)
      continue
    }
    pairs.push({
      sourcePath,
      destPath: path.join(destRoot, relativePath),
    })
  }
  if (missingPaths.length > 0) {
    throw new Error(`Minimal sync manifest references missing path(s): ${missingPaths.join(', ')}`)
  }
  return pairs
}
