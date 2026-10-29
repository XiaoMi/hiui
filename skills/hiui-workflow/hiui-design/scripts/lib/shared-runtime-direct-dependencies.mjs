import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultSkillRoot = path.resolve(scriptDir, '..', '..')

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

export function resolveSharedRuntimeDirectDependenciesPath(skillRoot = defaultSkillRoot) {
  return path.join(skillRoot, 'docs', 'onboarding', 'shared-runtime-direct-dependencies.json')
}

export async function loadSharedRuntimeDirectDependencySnapshot(skillRoot = defaultSkillRoot) {
  const referencePath = resolveSharedRuntimeDirectDependenciesPath(skillRoot)
  const raw = await fs.readFile(referencePath, 'utf8')
  const reference = JSON.parse(raw)
  return reference?.dependencies ?? {}
}

export function selectEntryImportedSharedRuntimeDirectDependencies({
  entrySource = '',
  dependencyMap = {},
}) {
  return Object.fromEntries(
    Object.entries(dependencyMap).filter(([depName]) => {
      return (
        entrySource.includes(`'${depName}'`) ||
        entrySource.includes(`"${depName}"`)
      )
    })
  )
}

export function findDeclaredDependency(pkg, depName) {
  return (
    pkg?.dependencies?.[depName] ||
    pkg?.devDependencies?.[depName] ||
    pkg?.peerDependencies?.[depName] ||
    ''
  )
}

export async function inspectDeclaredSharedRuntimeDirectDependencies({
  targetRoot,
  pkg = null,
  expectedDependencies = {},
  checkInstalledResolution = true,
}) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  const packageJsonExists = await pathExists(packageJsonPath)
  const nodeModulesPresent = await pathExists(path.join(targetRoot, 'node_modules'))
  const missingDeclared = []
  const versionDrifts = []
  const unresolved = []
  const resolved = []

  let targetRequire = null
  if (checkInstalledResolution && packageJsonExists && nodeModulesPresent) {
    try {
      targetRequire = createRequire(packageJsonPath)
    } catch {
      targetRequire = null
    }
  }

  for (const [depName, expectedVersion] of Object.entries(expectedDependencies)) {
    const declaredVersion = findDeclaredDependency(pkg, depName)
    if (!declaredVersion) {
      missingDeclared.push({ depName, expectedVersion })
      continue
    }

    if (declaredVersion !== expectedVersion) {
      versionDrifts.push({
        depName,
        declaredVersion,
        expectedVersion,
      })
    }

    if (!targetRequire) continue

    try {
      targetRequire.resolve(depName, { paths: [targetRoot] })
      resolved.push(depName)
    } catch (error) {
      unresolved.push({
        depName,
        error: error?.message ?? String(error),
      })
    }
  }

  return {
    expectedDependencies,
    packageJsonPath,
    packageJsonExists,
    nodeModulesPresent,
    resolutionChecked: Boolean(targetRequire),
    missingDeclared,
    versionDrifts,
    unresolved,
    resolved,
    declaredOk: missingDeclared.length === 0 && versionDrifts.length === 0,
    resolvableOk: unresolved.length === 0,
  }
}

export function describeSharedRuntimeDirectDependencyInspection(inspection = {}) {
  const expectedDependencyNames = Object.keys(inspection.expectedDependencies || {})
  if (expectedDependencyNames.length === 0) {
    return 'No shared runtime direct dependencies are currently imported from the detected app entry.'
  }

  if ((inspection.missingDeclared || []).length > 0 || (inspection.versionDrifts || []).length > 0) {
    const missingDetails = (inspection.missingDeclared || []).map(
      ({ depName, expectedVersion }) => `${depName}@${expectedVersion}`
    )
    const driftDetails = (inspection.versionDrifts || []).map(
      ({ depName, declaredVersion, expectedVersion }) =>
        `${depName} declared as ${declaredVersion} but expected ${expectedVersion}`
    )
    return `App entry imports shared runtime direct dependencies, but package.json does not satisfy the contract: ${[...missingDetails, ...driftDetails].join('; ')}.`
  }

  if ((inspection.unresolved || []).length > 0) {
    return `App entry imports shared runtime direct dependencies, but installed modules cannot be resolved from node_modules: ${inspection.unresolved
      .map(({ depName }) => depName)
      .join(', ')}.`
  }

  if (!inspection.resolutionChecked) {
    return `App entry imports shared runtime direct dependencies, and package.json declares them. Installed resolution was not checked because node_modules is absent.`
  }

  return `App entry imports shared runtime direct dependencies, and package.json plus installed modules satisfy the contract: ${expectedDependencyNames.join(', ')}.`
}
