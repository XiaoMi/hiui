const path = require('path')
const { resolveMigration } = require('./resolve')
const { upgradePackageJsonFiles } = require('./package-json')
const { replaceClassNamesInProject } = require('./replace-class')

function resolveProjectRoot (inputPath) {
  return path.resolve(process.cwd(), inputPath || '.')
}

function runMigrate (options) {
  const migration = resolveMigration(options.from, options.to)
  const rootDir = resolveProjectRoot(options.path)
  const dryRun = !!options.dryRun
  const upgradeDeps = options.upgradeDeps !== false
  const replaceClass = options.replaceClass !== false && !!migration.classReplace

  const result = {
    from: migration.from,
    to: migration.to,
    rootDir,
    dryRun,
    version: migration.version,
    packageJson: [],
    classNames: {
      updatedFiles: [],
      totalReplacements: 0,
    },
  }

  if (upgradeDeps) {
    result.packageJson = upgradePackageJsonFiles(rootDir, {
      version: migration.version,
      dryRun,
    })
  }

  if (replaceClass) {
    result.classNames = replaceClassNamesInProject(rootDir, {
      dryRun,
      classReplace: migration.classReplace,
    })
  }

  return result
}

module.exports = {
  resolveProjectRoot,
  runMigrate,
  resolveMigration: require('./resolve').resolveMigration,
}
