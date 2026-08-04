import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import path from 'node:path'

export const SYNC_PROFILE_CONTRACTS_RELATIVE_PATH = 'config/sync-profile-contracts.json'
export const SYNC_PROFILE_CONTRACT_SCHEMA_VERSION = 'hiui-design-sync-profile-contracts.v1'
export const VENDOR_TARBALLS_MANIFEST_RELATIVE_PATH = 'config/vendor-tarballs.manifest.json'
export const VENDOR_TARBALLS_MANIFEST_SCHEMA_VERSION = 'hiui-design-vendor-tarballs.v1'

function toPosixPath(value) {
  return String(value || '').split(path.sep).join('/').replace(/\\/g, '/')
}

export function normalizeRelativePath(value) {
  return toPosixPath(value).replace(/^\.\//u, '').replace(/\/+$/u, '')
}

function hasUnsafePathSegment(value) {
  const normalized = normalizeRelativePath(value)
  return !normalized || path.isAbsolute(normalized) || normalized.split('/').includes('..')
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function sha256File(filePath) {
  const hash = crypto.createHash('sha256')
  hash.update(await fs.readFile(filePath))
  return hash.digest('hex')
}

function isDirectoryCoverageMatch(requiredPath, targetPath) {
  const normalizedRequired = normalizeRelativePath(requiredPath)
  const normalizedTarget = normalizeRelativePath(targetPath)
  return normalizedTarget === normalizedRequired || normalizedTarget.startsWith(`${normalizedRequired}/`)
}

function manifestPathIsExcluded(relativePath, excludePatterns = []) {
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

function isPathCoveredByManifest(manifest, targetPath) {
  const normalizedTarget = normalizeRelativePath(targetPath)
  const excluded = manifestPathIsExcluded(normalizedTarget, manifest?.exclude || [])
  if (excluded) return false
  return (manifest?.paths || []).some((manifestPath) => isDirectoryCoverageMatch(manifestPath, normalizedTarget))
}

export function resolvePackageScriptTarget(command) {
  const normalizedCommand = String(command || '').trim()
  const quotedMatch = normalizedCommand.match(/(?:^|\s)node\s+"\.local-context\/hiui-design\/([^"]+\.mjs)"/u)
  if (quotedMatch) return normalizeRelativePath(quotedMatch[1])

  const unquotedMatch = normalizedCommand.match(/(?:^|\s)node\s+\.local-context\/hiui-design\/([^\s]+\.mjs)/u)
  if (unquotedMatch) return normalizeRelativePath(unquotedMatch[1])

  return ''
}

export function resolveFileTarballDependency(spec) {
  const normalizedSpec = String(spec || '').trim()
  const prefix = 'file:.local-context/hiui-design/'
  if (!normalizedSpec.startsWith(prefix) || !normalizedSpec.endsWith('.tgz')) {
    return ''
  }

  return normalizeRelativePath(normalizedSpec.slice(prefix.length))
}

export function validateSyncProfileContracts(payload, sourceLabel = SYNC_PROFILE_CONTRACTS_RELATIVE_PATH) {
  const issues = []
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, issues: [`${sourceLabel} must be a JSON object.`] }
  }
  if (payload.schemaVersion !== SYNC_PROFILE_CONTRACT_SCHEMA_VERSION) {
    issues.push(`${sourceLabel} schemaVersion must be ${SYNC_PROFILE_CONTRACT_SCHEMA_VERSION}.`)
  }
  if (!Array.isArray(payload.profiles) || payload.profiles.length === 0) {
    issues.push(`${sourceLabel} profiles must contain at least one profile.`)
  }

  for (const [profileIndex, profile] of (payload.profiles || []).entries()) {
    const prefix = `${sourceLabel} profiles.${profileIndex}`
    for (const field of ['profileId', 'mode', 'syncProfile', 'syncManifestPath']) {
      if (!String(profile?.[field] || '').trim()) issues.push(`${prefix}.${field} is required.`)
    }
    for (const field of [
      'requiredFiles',
      'requiredTarballs',
      'doctorRequiredFiles',
      'excludedFiles',
      'allowedMissingScripts',
    ]) {
      if (!Array.isArray(profile?.[field])) issues.push(`${prefix}.${field} must be an array.`)
    }
    if (!profile?.registeredScripts || typeof profile.registeredScripts !== 'object' || Array.isArray(profile.registeredScripts)) {
      issues.push(`${prefix}.registeredScripts must be an object.`)
    }

    const pathFields = [
      ...(profile?.requiredFiles || []),
      profile?.syncManifestPath,
      ...(profile?.requiredTarballs || []),
      ...(profile?.doctorRequiredFiles || []),
    ].filter(Boolean)
    for (const entry of pathFields) {
      if (hasUnsafePathSegment(entry)) issues.push(`${prefix} contains unsafe path: ${entry}`)
    }
    for (const [scriptName, scriptTarget] of Object.entries(profile?.registeredScripts || {})) {
      if (!String(scriptName || '').trim()) issues.push(`${prefix}.registeredScripts contains an empty script name.`)
      if (hasUnsafePathSegment(scriptTarget)) {
        issues.push(`${prefix}.registeredScripts.${scriptName} contains unsafe target: ${scriptTarget}`)
      }
    }
  }

  return { ok: issues.length === 0, issues }
}

export async function loadSyncProfileContracts(skillRoot) {
  const contractPath = path.join(skillRoot, SYNC_PROFILE_CONTRACTS_RELATIVE_PATH)
  const payload = await readJson(contractPath)
  const validation = validateSyncProfileContracts(payload, SYNC_PROFILE_CONTRACTS_RELATIVE_PATH)
  if (!validation.ok) {
    throw new Error(validation.issues.join('; '))
  }
  return { contractPath, payload }
}

export function validateVendorTarballsManifest(payload, sourceLabel = VENDOR_TARBALLS_MANIFEST_RELATIVE_PATH) {
  const issues = []
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, issues: [`${sourceLabel} must be a JSON object.`] }
  }
  if (payload.schemaVersion !== VENDOR_TARBALLS_MANIFEST_SCHEMA_VERSION) {
    issues.push(`${sourceLabel} schemaVersion must be ${VENDOR_TARBALLS_MANIFEST_SCHEMA_VERSION}.`)
  }
  if (!Array.isArray(payload.tarballs)) {
    issues.push(`${sourceLabel}.tarballs must be an array.`)
  }

  for (const [index, entry] of (payload.tarballs || []).entries()) {
    const prefix = `${sourceLabel}.tarballs.${index}`
    for (const field of ['filePath', 'packageName', 'version', 'sha256', 'reactRange']) {
      if (!String(entry?.[field] || '').trim()) issues.push(`${prefix}.${field} is required.`)
    }
    if (hasUnsafePathSegment(entry?.filePath)) issues.push(`${prefix}.filePath must be a safe relative path.`)
    if (!/^[a-f0-9]{64}$/u.test(String(entry?.sha256 || ''))) issues.push(`${prefix}.sha256 must be a 64-character hex digest.`)
    if (!Array.isArray(entry?.allowedProfiles)) issues.push(`${prefix}.allowedProfiles must be an array.`)
  }

  return { ok: issues.length === 0, issues }
}

export async function loadVendorTarballsManifest(skillRoot) {
  const manifestPath = path.join(skillRoot, VENDOR_TARBALLS_MANIFEST_RELATIVE_PATH)
  const payload = await readJson(manifestPath)
  const validation = validateVendorTarballsManifest(payload, VENDOR_TARBALLS_MANIFEST_RELATIVE_PATH)
  if (!validation.ok) {
    throw new Error(validation.issues.join('; '))
  }
  return { manifestPath, payload }
}

export function findSyncProfileContract(payload, { profileId = '', mode = '', syncProfile = '' } = {}) {
  const profiles = Array.isArray(payload?.profiles) ? payload.profiles : []
  const normalizedProfileId = String(profileId || '').trim()
  if (normalizedProfileId) {
    return profiles.find((profile) => profile.profileId === normalizedProfileId) || null
  }

  const normalizedMode = String(mode || '').trim()
  const normalizedSyncProfile = String(syncProfile || '').trim()
  return (
    profiles.find(
      (profile) =>
        (!normalizedMode || profile.mode === normalizedMode) &&
        (!normalizedSyncProfile || profile.syncProfile === normalizedSyncProfile)
    ) || null
  )
}

export function isPathCoveredByProfile(profile, targetPath) {
  const normalizedTarget = normalizeRelativePath(targetPath)
  return (profile?.requiredFiles || []).some((requiredPath) => isDirectoryCoverageMatch(requiredPath, normalizedTarget))
}

export async function checkSyncProfileContract({ skillRoot, profile, scripts = {} }) {
  const issues = []
  const warnings = []
  const missingFiles = []
  const missingTarballs = []
  const tarballManifestMissingEntries = []
  const tarballHashMismatches = []
  const tarballProfileViolations = []
  const unexpectedScripts = []
  const missingRegisteredScripts = []
  const scriptTargetMismatches = []
  const missingScriptTargets = []
  const unexpectedTarballDependencies = []
  const requiredFilesNotSynced = []
  const syncManifestPath = path.join(skillRoot, normalizeRelativePath(profile.syncManifestPath))
  const syncManifest = await readJson(syncManifestPath)
  const vendorTarballsManifest = await loadVendorTarballsManifest(skillRoot)
  const tarballManifestEntries = new Map(
    (vendorTarballsManifest.payload.tarballs || []).map((entry) => [normalizeRelativePath(entry.filePath), entry])
  )

  for (const relativePath of [profile.syncManifestPath, ...(profile.requiredFiles || []), ...(profile.doctorRequiredFiles || [])]) {
    const normalizedPath = normalizeRelativePath(relativePath)
    if (!(await pathExists(path.join(skillRoot, normalizedPath)))) {
      missingFiles.push(normalizedPath)
    }
  }

  for (const relativePath of [...(profile.requiredFiles || []), ...(profile.doctorRequiredFiles || [])]) {
    const normalizedPath = normalizeRelativePath(relativePath)
    if (!isPathCoveredByManifest(syncManifest, normalizedPath)) {
      requiredFilesNotSynced.push(normalizedPath)
    }
  }

  for (const relativePath of profile.requiredTarballs || []) {
    const normalizedPath = normalizeRelativePath(relativePath)
    const absolutePath = path.join(skillRoot, normalizedPath)
    if (!(await pathExists(absolutePath))) {
      missingTarballs.push(normalizedPath)
      continue
    }

    const manifestEntry = tarballManifestEntries.get(normalizedPath)
    if (!manifestEntry) {
      tarballManifestMissingEntries.push(normalizedPath)
      continue
    }

    if (!manifestEntry.allowedProfiles.includes(profile.profileId)) {
      tarballProfileViolations.push({ tarballPath: normalizedPath, profileId: profile.profileId })
    }

    const actualSha256 = await sha256File(absolutePath)
    if (actualSha256 !== manifestEntry.sha256) {
      tarballHashMismatches.push({ tarballPath: normalizedPath, expectedSha256: manifestEntry.sha256, actualSha256 })
    }
  }

  const allowedScripts = new Set(Object.keys(profile.registeredScripts || {}))
  const allowedMissingScripts = new Set(profile.allowedMissingScripts || [])
  for (const scriptName of allowedScripts) {
    if (!Object.prototype.hasOwnProperty.call(scripts || {}, scriptName) && !allowedMissingScripts.has(scriptName)) {
      missingRegisteredScripts.push(scriptName)
    }
  }
  for (const [scriptName, command] of Object.entries(scripts || {})) {
    if (!allowedScripts.has(scriptName) && !allowedMissingScripts.has(scriptName)) {
      unexpectedScripts.push(scriptName)
      continue
    }

    const target = resolvePackageScriptTarget(command)
    const expectedTarget = normalizeRelativePath(profile.registeredScripts?.[scriptName] || '')
    if (target && expectedTarget && target !== expectedTarget) {
      scriptTargetMismatches.push({ scriptName, expectedTarget, target })
    }
    if (target && !isPathCoveredByProfile(profile, target)) {
      missingScriptTargets.push({ scriptName, target })
    }
  }

  for (const [depName, spec] of Object.entries(profile.dependencySpecs || {})) {
    const tarballPath = resolveFileTarballDependency(spec)
    if (tarballPath && !(profile.requiredTarballs || []).map(normalizeRelativePath).includes(tarballPath)) {
      unexpectedTarballDependencies.push({ depName, tarballPath })
    }
  }

  if (missingFiles.length > 0) issues.push(`missing required file(s): ${missingFiles.join(', ')}`)
  if (missingTarballs.length > 0) issues.push(`missing required tarball(s): ${missingTarballs.join(', ')}`)
  if (tarballManifestMissingEntries.length > 0) {
    issues.push(`required tarball(s) are missing from vendor manifest: ${tarballManifestMissingEntries.join(', ')}`)
  }
  if (tarballProfileViolations.length > 0) {
    issues.push(
      `required tarball(s) are not allowed for profile: ${tarballProfileViolations
        .map((entry) => `${entry.tarballPath}->${entry.profileId}`)
        .join(', ')}`
    )
  }
  if (tarballHashMismatches.length > 0) {
    issues.push(
      `required tarball hash mismatch(es): ${tarballHashMismatches
        .map((entry) => `${entry.tarballPath} expected ${entry.expectedSha256} got ${entry.actualSha256}`)
        .join(', ')}`
    )
  }
  if (unexpectedScripts.length > 0) issues.push(`script(s) are not allowed by profile: ${unexpectedScripts.join(', ')}`)
  if (missingRegisteredScripts.length > 0) {
    issues.push(`registered script(s) are missing from reusable surface: ${missingRegisteredScripts.join(', ')}`)
  }
  if (scriptTargetMismatches.length > 0) {
    issues.push(
      `script target(s) differ from profile: ${scriptTargetMismatches
        .map((entry) => `${entry.scriptName}->${entry.target} expected ${entry.expectedTarget}`)
        .join(', ')}`
    )
  }
  if (missingScriptTargets.length > 0) {
    issues.push(
      `script target(s) are not covered by profile: ${missingScriptTargets
        .map((entry) => `${entry.scriptName}->${entry.target}`)
        .join(', ')}`
    )
  }
  if (unexpectedTarballDependencies.length > 0) {
    issues.push(
      `tarball dependency spec(s) are not declared by profile: ${unexpectedTarballDependencies
        .map((entry) => `${entry.depName}->${entry.tarballPath}`)
        .join(', ')}`
    )
  }
  if (requiredFilesNotSynced.length > 0) {
    issues.push(`required file(s) are not covered by sync manifest: ${requiredFilesNotSynced.join(', ')}`)
  }

  return {
    status: issues.length === 0 ? 'passed' : 'failed',
    profileId: profile.profileId,
    mode: profile.mode,
    syncProfile: profile.syncProfile,
    issues,
    warnings,
    missingFiles,
    missingTarballs,
    tarballManifestMissingEntries,
    tarballHashMismatches,
    tarballProfileViolations,
    unexpectedScripts,
    missingRegisteredScripts,
    scriptTargetMismatches,
    missingScriptTargets,
    unexpectedTarballDependencies,
    requiredFilesNotSynced,
  }
}
