import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultSkillRoot = path.resolve(scriptDir, '..', '..')

function normalizeEmbeddedSourceSnapshot(snapshot = {}) {
  const normalized = {}

  for (const fieldName of ['name', 'version', 'snapshotPackageJson', 'tarball']) {
    const value = String(snapshot?.[fieldName] || '').trim()
    if (value) normalized[fieldName] = value
  }

  return normalized
}

export function resolveManagedLocalRuntimeDependencyContractPath(skillRoot = defaultSkillRoot) {
  return path.join(skillRoot, 'docs', 'onboarding', 'managed-local-runtime-dependencies.json')
}

export async function loadManagedLocalRuntimeDependencyContract(skillRoot = defaultSkillRoot) {
  const contractPath = resolveManagedLocalRuntimeDependencyContractPath(skillRoot)
  return JSON.parse(await fs.readFile(contractPath, 'utf8'))
}

export async function loadManagedLocalRuntimePeerDependencies(skillRoot = defaultSkillRoot) {
  const contract = await loadManagedLocalRuntimeDependencyContract(skillRoot)
  return contract?.dependencies ?? {}
}

export function resolveManagedLocalRuntimeEmbeddedSourceSnapshot(contract = {}) {
  const managedRuntime = contract?.managedRuntime ?? {}
  const embeddedSourceSnapshot = normalizeEmbeddedSourceSnapshot(
    managedRuntime.embeddedSourceSnapshot
  )

  if (Object.keys(embeddedSourceSnapshot).length > 0) {
    return embeddedSourceSnapshot
  }

  return normalizeEmbeddedSourceSnapshot(managedRuntime.sourcePackageSnapshot)
}

export function resolveManagedLocalRuntimeEmbeddedSourceSnapshotFiles(
  skillRoot = defaultSkillRoot,
  contract = {}
) {
  const embeddedSourceSnapshot = resolveManagedLocalRuntimeEmbeddedSourceSnapshot(contract)

  return {
    ...embeddedSourceSnapshot,
    snapshotPackageJsonPath: embeddedSourceSnapshot.snapshotPackageJson
      ? path.join(skillRoot, embeddedSourceSnapshot.snapshotPackageJson)
      : '',
    tarballPath: embeddedSourceSnapshot.tarball
      ? path.join(skillRoot, embeddedSourceSnapshot.tarball)
      : '',
  }
}

export async function loadManagedLocalRuntimeEmbeddedSourceSnapshot(
  skillRoot = defaultSkillRoot
) {
  const contract = await loadManagedLocalRuntimeDependencyContract(skillRoot)
  return resolveManagedLocalRuntimeEmbeddedSourceSnapshot(contract)
}

export function applyManagedLocalRuntimeEmbeddedSourceSnapshot(contract, snapshot = {}) {
  const nextSnapshot = normalizeEmbeddedSourceSnapshot({
    ...resolveManagedLocalRuntimeEmbeddedSourceSnapshot(contract),
    ...snapshot,
  })
  const managedRuntime = contract?.managedRuntime ?? {}
  const {
    embeddedSourceSnapshot: _embeddedSourceSnapshot,
    sourcePackageSnapshot: _sourcePackageSnapshot,
    ...managedRuntimeRest
  } = managedRuntime

  return {
    ...(contract || {}),
    managedRuntime: {
      ...managedRuntimeRest,
      ...(Object.keys(nextSnapshot).length > 0
        ? {
            embeddedSourceSnapshot: nextSnapshot,
          }
        : {}),
    },
  }
}

export async function updateManagedLocalRuntimeEmbeddedSourceSnapshot(
  skillRoot = defaultSkillRoot,
  snapshot = {}
) {
  const contractPath = resolveManagedLocalRuntimeDependencyContractPath(skillRoot)
  const contract = await loadManagedLocalRuntimeDependencyContract(skillRoot)
  const updatedContract = applyManagedLocalRuntimeEmbeddedSourceSnapshot(contract, snapshot)
  await fs.writeFile(contractPath, `${JSON.stringify(updatedContract, null, 2)}\n`, 'utf8')
  return {
    contractPath,
    contract: updatedContract,
  }
}

export function applyManagedLocalRuntimeSourcePackageSnapshot(contract, snapshot = {}) {
  return applyManagedLocalRuntimeEmbeddedSourceSnapshot(contract, snapshot)
}

export async function updateManagedLocalRuntimeSourcePackageSnapshot(
  skillRoot = defaultSkillRoot,
  snapshot = {}
) {
  return updateManagedLocalRuntimeEmbeddedSourceSnapshot(skillRoot, snapshot)
}
