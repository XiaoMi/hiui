const path = require('path')
const { DEFAULT_PATCH_VERSION, PATCH_PACKAGE } = require('./constants')
const { updateProjectPackageJson } = require('./package-json')
const { findEntryFile, updateEntryFile } = require('./entry')
const { runInstall, detectPackageManager } = require('./install')

function resolveProjectRoot (inputPath) {
  return path.resolve(process.cwd(), inputPath || '.')
}

function runPatchForReact (options) {
  const projectRoot = resolveProjectRoot(options.path)
  const patchVersion = options.patchVersion || DEFAULT_PATCH_VERSION
  const dryRun = !!options.dryRun
  const skipInstall = !!options.skipInstall

  const result = {
    projectRoot,
    dryRun,
    packageManager: detectPackageManager(projectRoot),
    packageJson: null,
    entry: null,
    install: null,
    patchPackage: PATCH_PACKAGE,
    patchVersion,
  }

  result.packageJson = updateProjectPackageJson(projectRoot, {
    patchVersion,
    dryRun,
  })

  result.entry = updateEntryFile(
    findEntryFile(projectRoot, options.entry),
    { dryRun }
  )

  if (!dryRun && !skipInstall) {
    result.install = runInstall(projectRoot, {
      packageManager: options.packageManager,
    })
  }

  return result
}

module.exports = {
  resolveProjectRoot,
  runPatchForReact,
}
