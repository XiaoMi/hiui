import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const defaultLockPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'bundle',
  'workflow-bundle.lock.json',
)

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readJson(jsonPath) {
  const rawText = await fs.readFile(jsonPath, 'utf8')
  return JSON.parse(rawText)
}

function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string`)
  }
}

function assertStringArray(value, label) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string' || !entry.trim())) {
    throw new Error(`${label} must be an array of non-empty strings`)
  }
}

function versionModeForEntry(entry) {
  const mode = entry?.versionPolicy || 'locked'
  if (!['locked', 'follow-source-manifest'].includes(mode)) {
    throw new Error(`Unsupported version policy: ${mode}`)
  }
  return mode
}

function requestedVersionForEntry(entry) {
  return String(entry?.requestedVersion || entry?.version || '').trim()
}

function normalizeVersion(version) {
  return String(version || '').trim().replace(/^v/, '')
}

function isCommitSha(ref) {
  return typeof ref === 'string' && /^[0-9a-f]{40}$/i.test(ref.trim())
}

function compareVersions(left, right) {
  const leftParts = normalizeVersion(left).split('.').map((part) => Number.parseInt(part, 10) || 0)
  const rightParts = normalizeVersion(right).split('.').map((part) => Number.parseInt(part, 10) || 0)
  const length = Math.max(leftParts.length, rightParts.length)

  for (let index = 0; index < length; index += 1) {
    const leftValue = leftParts[index] ?? 0
    const rightValue = rightParts[index] ?? 0
    if (leftValue > rightValue) return 1
    if (leftValue < rightValue) return -1
  }

  return 0
}

function validateSkillManifest(manifest, manifestPath = 'skill.manifest.json') {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error(`${manifestPath}: manifest must be an object`)
  }
  if (manifest.schemaVersion !== 1) {
    throw new Error(`${manifestPath}: schemaVersion must be 1`)
  }
  assertNonEmptyString(manifest.name, `${manifestPath}: name`)
  assertNonEmptyString(manifest.version, `${manifestPath}: version`)
  assertNonEmptyString(manifest.distributionScope, `${manifestPath}: distributionScope`)
  assertNonEmptyString(manifest.entry, `${manifestPath}: entry`)
  assertStringArray(manifest.requiredPaths, `${manifestPath}: requiredPaths`)

  if (!manifest.publicContracts || typeof manifest.publicContracts !== 'object') {
    throw new Error(`${manifestPath}: publicContracts must be an object`)
  }
  assertStringArray(manifest.publicContracts.files, `${manifestPath}: publicContracts.files`)
  assertStringArray(
    manifest.publicContracts.directories,
    `${manifestPath}: publicContracts.directories`,
  )

  if (!Array.isArray(manifest.dependencies)) {
    throw new Error(`${manifestPath}: dependencies must be an array`)
  }

  for (const dependency of manifest.dependencies) {
    if (!dependency || typeof dependency !== 'object') {
      throw new Error(`${manifestPath}: each dependency must be an object`)
    }
    assertNonEmptyString(dependency.name, `${manifestPath}: dependency.name`)
    if (typeof dependency.required !== 'boolean') {
      throw new Error(`${manifestPath}: dependency.required must be boolean`)
    }
    assertNonEmptyString(dependency.versionRange, `${manifestPath}: dependency.versionRange`)
  }

  return true
}

function validateInstallPolicy(policy, policyPath = 'install-policy.json') {
  if (!policy || typeof policy !== 'object') {
    throw new Error(`${policyPath}: install policy must be an object`)
  }
  if (policy.schemaVersion !== 1) {
    throw new Error(`${policyPath}: schemaVersion must be 1`)
  }
  assertNonEmptyString(policy.bundleName, `${policyPath}: bundleName`)
  if (!policy.defaultPolicy || typeof policy.defaultPolicy !== 'object') {
    throw new Error(`${policyPath}: defaultPolicy must be an object`)
  }

  const supportedDecisions = [
    'install',
    'skip',
    'upgrade',
    'keep',
    'backup-and-upgrade',
  ]

  for (const key of [
    'onMissing',
    'onSameVersion',
    'onOlderVersion',
    'onNewerVersion',
    'onUnknownVersion',
    'onLocalModifications',
  ]) {
    const value = policy.defaultPolicy[key]
    if (!supportedDecisions.includes(value)) {
      throw new Error(`${policyPath}: defaultPolicy.${key} must be one of ${supportedDecisions.join(', ')}`)
    }
  }

  for (const key of ['allowDowngrade', 'createBackups', 'atomicReplace']) {
    if (typeof policy.defaultPolicy[key] !== 'boolean') {
      throw new Error(`${policyPath}: defaultPolicy.${key} must be boolean`)
    }
  }

  assertStringArray(policy.supportedFlags, `${policyPath}: supportedFlags`)
  return true
}

function validateCompatibilityMatrix(matrix, matrixPath = 'compatibility-matrix.json') {
  if (!matrix || typeof matrix !== 'object') {
    throw new Error(`${matrixPath}: compatibility matrix must be an object`)
  }
  if (matrix.schemaVersion !== 1) {
    throw new Error(`${matrixPath}: schemaVersion must be 1`)
  }
  assertNonEmptyString(matrix.bundleName, `${matrixPath}: bundleName`)
  if (!Array.isArray(matrix.testedBundles)) {
    throw new Error(`${matrixPath}: testedBundles must be an array`)
  }

  for (const bundle of matrix.testedBundles) {
    assertNonEmptyString(bundle.bundleVersion, `${matrixPath}: testedBundles.bundleVersion`)
    assertNonEmptyString(bundle.channel, `${matrixPath}: testedBundles.channel`)
    assertNonEmptyString(bundle.status, `${matrixPath}: testedBundles.status`)
    if (!bundle.skills || typeof bundle.skills !== 'object') {
      throw new Error(`${matrixPath}: testedBundles.skills must be an object`)
    }
  }

  return true
}

function validateBundleLock(lock, lockPath = 'workflow-bundle.lock.json') {
  if (!lock || typeof lock !== 'object') {
    throw new Error(`${lockPath}: lock file must be an object`)
  }
  if (lock.schemaVersion !== 1) {
    throw new Error(`${lockPath}: schemaVersion must be 1`)
  }
  assertNonEmptyString(lock.bundleName, `${lockPath}: bundleName`)
  assertNonEmptyString(lock.bundleVersion, `${lockPath}: bundleVersion`)
  assertNonEmptyString(lock.channel, `${lockPath}: channel`)
  assertNonEmptyString(lock.installPolicyRef, `${lockPath}: installPolicyRef`)
  assertNonEmptyString(lock.compatibilityMatrixRef, `${lockPath}: compatibilityMatrixRef`)

  if (!lock.codexCompatibility || typeof lock.codexCompatibility !== 'object') {
    throw new Error(`${lockPath}: codexCompatibility must be an object`)
  }
  assertStringArray(
    lock.codexCompatibility.requiredRuntimes,
    `${lockPath}: codexCompatibility.requiredRuntimes`,
  )
  assertStringArray(lock.codexCompatibility.notes, `${lockPath}: codexCompatibility.notes`)

  if (!Array.isArray(lock.skills) || lock.skills.length === 0) {
    throw new Error(`${lockPath}: skills must be a non-empty array`)
  }

  for (const entry of lock.skills) {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`${lockPath}: each skill entry must be an object`)
    }
    assertNonEmptyString(entry.name, `${lockPath}: skill.name`)
    assertNonEmptyString(entry.installName, `${lockPath}: skill.installName`)
    assertNonEmptyString(entry.version, `${lockPath}: skill.version`)
    assertNonEmptyString(entry.manifestPath, `${lockPath}: skill.manifestPath`)
    if ('versionPolicy' in entry && typeof entry.versionPolicy !== 'string') {
      throw new Error(`${lockPath}: skill.versionPolicy must be a string when provided`)
    }
    versionModeForEntry(entry)
    if (typeof entry.required !== 'boolean') {
      throw new Error(`${lockPath}: skill.required must be boolean`)
    }
    if (!entry.source || typeof entry.source !== 'object') {
      throw new Error(`${lockPath}: skill.source must be an object`)
    }
    assertNonEmptyString(entry.source.kind, `${lockPath}: skill.source.kind`)
    if (!['local', 'github', 'git'].includes(entry.source.kind)) {
      throw new Error(`${lockPath}: unsupported skill.source.kind ${entry.source.kind}`)
    }
    if (entry.source.kind === 'local') {
      assertNonEmptyString(entry.source.path, `${lockPath}: skill.source.path`)
      if (lock.channel === 'stable') {
        throw new Error(`${lockPath}: stable bundle skills must not use source.kind=local`)
      }
    }
    if (entry.source.kind === 'github') {
      assertNonEmptyString(entry.source.repo, `${lockPath}: skill.source.repo`)
      assertNonEmptyString(entry.source.path, `${lockPath}: skill.source.path`)
      if ('ref' in entry.source && typeof entry.source.ref !== 'string') {
        throw new Error(`${lockPath}: skill.source.ref must be a string when provided`)
      }
      if (lock.channel === 'stable' && !isCommitSha(entry.source.ref)) {
        throw new Error(`${lockPath}: stable github skill refs must be exact 40-character commit SHAs`)
      }
    }
    if (entry.source.kind === 'git') {
      assertNonEmptyString(entry.source.repoUrl, `${lockPath}: skill.source.repoUrl`)
      assertNonEmptyString(entry.source.path, `${lockPath}: skill.source.path`)
      if ('ref' in entry.source && typeof entry.source.ref !== 'string') {
        throw new Error(`${lockPath}: skill.source.ref must be a string when provided`)
      }
      if (lock.channel === 'stable' && !isCommitSha(entry.source.ref)) {
        throw new Error(`${lockPath}: stable git skill refs must be exact 40-character commit SHAs`)
      }
    }
  }

  return true
}

async function resolveBundleConfig(lockPath = defaultLockPath) {
  const resolvedLockPath = path.resolve(lockPath)
  const lockDir = path.dirname(resolvedLockPath)
  const bundleRoot = path.resolve(lockDir, '..')
  const lock = await readJson(resolvedLockPath)
  validateBundleLock(lock, resolvedLockPath)

  const installPolicyPath = path.resolve(lockDir, lock.installPolicyRef)
  const compatibilityMatrixPath = path.resolve(lockDir, lock.compatibilityMatrixRef)
  const installPolicy = await readJson(installPolicyPath)
  const compatibilityMatrix = await readJson(compatibilityMatrixPath)
  validateInstallPolicy(installPolicy, installPolicyPath)
  validateCompatibilityMatrix(compatibilityMatrix, compatibilityMatrixPath)

  return {
    bundleRoot,
    lockDir,
    lockPath: resolvedLockPath,
    lock,
    installPolicyPath,
    installPolicy,
    compatibilityMatrixPath,
    compatibilityMatrix,
  }
}

async function resolveSkillEntry(entry, lockDir) {
  const source = entry.source
  if (source.kind !== 'local') {
    return {
      ...entry,
      sourceRoot: '',
      manifestPath: '',
      manifest: null,
      sourceExists: false,
    }
  }

  const sourceRoot = path.resolve(lockDir, source.path)
  const manifestPath = path.join(sourceRoot, entry.manifestPath)
  const sourceExists = await pathExists(sourceRoot)
  const manifestExists = await pathExists(manifestPath)
  const manifest = manifestExists ? await readJson(manifestPath) : null
  if (manifest) validateSkillManifest(manifest, manifestPath)

  return {
    ...entry,
    sourceRoot,
    manifestPath,
    manifest,
    sourceExists,
    manifestExists,
  }
}

export {
  compareVersions,
  defaultLockPath,
  isCommitSha,
  pathExists,
  readJson,
  requestedVersionForEntry,
  resolveBundleConfig,
  resolveSkillEntry,
  validateBundleLock,
  validateCompatibilityMatrix,
  validateInstallPolicy,
  validateSkillManifest,
  versionModeForEntry,
}
