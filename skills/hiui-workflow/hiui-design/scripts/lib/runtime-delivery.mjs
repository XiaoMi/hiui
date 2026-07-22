import fs from 'node:fs/promises'
import path from 'node:path'

function normalizeRelativePath(relativePath) {
  return String(relativePath || '').split(path.sep).join('/')
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readJson(targetPath) {
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

function resolvePathWithinRoot(root, relativePath, label) {
  const normalized = normalizeRelativePath(String(relativePath || '').trim())
  if (!normalized) {
    throw new Error(`Missing ${label}`)
  }

  const absoluteRoot = path.resolve(root)
  const absolutePath = path.resolve(absoluteRoot, normalized)
  if (absolutePath !== absoluteRoot && !absolutePath.startsWith(`${absoluteRoot}${path.sep}`)) {
    throw new Error(`${label} must stay within ${absoluteRoot}: ${normalized}`)
  }

  return {
    absolutePath,
    relativePath: normalized,
  }
}

async function loadRuntimeDeliveryContext(root) {
  const absoluteRoot = path.resolve(root)
  const policyPath = path.join(absoluteRoot, 'rules', 'runtime-delivery-policy.json')
  const policy = await readJson(policyPath)
  const runtimePackage = policy?.runtimePackage

  if (!runtimePackage || typeof runtimePackage !== 'object') {
    throw new Error(`Invalid runtime delivery policy at ${policyPath}: runtimePackage is required`)
  }

  if (typeof runtimePackage.packageName !== 'string' || !runtimePackage.packageName.trim()) {
    throw new Error(`Invalid runtime delivery policy at ${policyPath}: runtimePackage.packageName is required`)
  }

  const snapshotPathInfo = resolvePathWithinRoot(
    absoluteRoot,
    runtimePackage.vendorSnapshotManifest,
    'runtimePackage.vendorSnapshotManifest'
  )

  if (!(await pathExists(snapshotPathInfo.absolutePath))) {
    throw new Error(`Missing vendor snapshot manifest at ${snapshotPathInfo.relativePath} under ${absoluteRoot}`)
  }

  const snapshot = await readJson(snapshotPathInfo.absolutePath)
  return {
    root: absoluteRoot,
    policy,
    policyPath,
    runtimePackage,
    snapshot,
    snapshotPath: snapshotPathInfo.absolutePath,
    snapshotRelativePath: snapshotPathInfo.relativePath,
  }
}

async function resolveDeclaredVendoredTarball(root, contextInput) {
  const context = contextInput?.snapshot ? contextInput : await loadRuntimeDeliveryContext(root)
  const runtimeDelivery = context.snapshot?.runtimeDelivery

  if (!runtimeDelivery || typeof runtimeDelivery !== 'object') {
    throw new Error(`Invalid vendor snapshot at ${context.snapshotRelativePath}: runtimeDelivery is required`)
  }

  const tarballPathInfo = resolvePathWithinRoot(
    context.root,
    runtimeDelivery.vendoredTarball,
    'snapshot.runtimeDelivery.vendoredTarball'
  )

  const tarballDirectory = normalizeRelativePath(String(context.runtimePackage.vendoredTarballDirectory || '').trim())
  if (tarballDirectory && !tarballPathInfo.relativePath.startsWith(`${tarballDirectory}/`)) {
    throw new Error(
      `Declared vendored runtime tarball must live under ${tarballDirectory}: ${tarballPathInfo.relativePath}`
    )
  }

  const tarballPattern = String(context.runtimePackage.vendoredTarballPattern || '').trim()
  if (tarballPattern) {
    const pattern = new RegExp(tarballPattern)
    if (!pattern.test(path.basename(tarballPathInfo.relativePath))) {
      throw new Error(
        `Declared vendored runtime tarball does not match ${tarballPattern}: ${tarballPathInfo.relativePath}`
      )
    }
  }

  if (!(await pathExists(tarballPathInfo.absolutePath))) {
    throw new Error(`Missing declared vendored runtime tarball at ${tarballPathInfo.relativePath} under ${context.root}`)
  }

  return tarballPathInfo
}

function resolvePublicPackagePaths(root, contextInput) {
  const context = contextInput?.snapshot ? contextInput : null
  if (!context) {
    throw new Error('resolvePublicPackagePaths requires a loaded runtime delivery context')
  }

  const packageRootInfo = resolvePathWithinRoot(
    context.root,
    context.runtimePackage.publicPackageRoot,
    'runtimePackage.publicPackageRoot'
  )

  return {
    packageRoot: packageRootInfo.absolutePath,
    packageRootRelativePath: packageRootInfo.relativePath,
    packageJsonPath: path.join(packageRootInfo.absolutePath, 'package.json'),
    packageJsonRelativePath: normalizeRelativePath(path.join(packageRootInfo.relativePath, 'package.json')),
  }
}

export {
  loadRuntimeDeliveryContext,
  normalizeRelativePath,
  pathExists,
  readJson,
  resolveDeclaredVendoredTarball,
  resolvePublicPackagePaths,
}
