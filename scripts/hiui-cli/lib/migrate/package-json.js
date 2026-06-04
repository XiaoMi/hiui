const fs = require('fs')
const path = require('path')
const {
  HIUI_SCOPE,
  PACKAGE_UPGRADE_EXCLUDE,
  DEPENDENCY_FIELDS,
  SKIP_DIRS,
} = require('./constants')

function shouldUpgradePackage (name) {
  return (
    name.startsWith(HIUI_SCOPE) && !PACKAGE_UPGRADE_EXCLUDE.has(name)
  )
}

function upgradeDependencySection (section, targetVersion, changes) {
  if (!section || typeof section !== 'object') return section

  const next = { ...section }

  Object.keys(next).forEach((name) => {
    if (!shouldUpgradePackage(name)) return
    if (next[name] === targetVersion) return

    changes.push({
      name,
      from: next[name],
      to: targetVersion,
    })
    next[name] = targetVersion
  })

  return next
}

function upgradeOverridesSection (section, targetVersion, changes) {
  if (!section || typeof section !== 'object') return section

  const next = { ...section }

  Object.keys(next).forEach((name) => {
    if (!shouldUpgradePackage(name)) return
    if (typeof next[name] !== 'string') return
    if (next[name] === targetVersion) return

    changes.push({
      name,
      from: next[name],
      to: targetVersion,
      field: 'overrides',
    })
    next[name] = targetVersion
  })

  return next
}

function upgradePackageJsonObject (pkg, targetVersion) {
  const changes = []
  const next = { ...pkg }

  DEPENDENCY_FIELDS.forEach((field) => {
    if (next[field]) {
      next[field] = upgradeDependencySection(next[field], targetVersion, changes)
    }
  })

  if (next.overrides) {
    next.overrides = upgradeOverridesSection(next.overrides, targetVersion, changes)
  }

  if (next.resolutions) {
    const resolutionChanges = []
    next.resolutions = upgradeOverridesSection(
      next.resolutions,
      targetVersion,
      resolutionChanges
    )
    resolutionChanges.forEach((change) => {
      changes.push({ ...change, field: 'resolutions' })
    })
  }

  return { pkg: next, changes }
}

function readPackageJson (filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  return { raw, data: JSON.parse(raw) }
}

function detectIndent (raw) {
  const match = raw.match(/^(\s+)"/m)
  return match ? match[1] : '  '
}

function writePackageJson (filePath, data, raw) {
  const indent = detectIndent(raw)
  const content = `${JSON.stringify(data, null, indent)}\n`
  fs.writeFileSync(filePath, content, 'utf8')
  return content
}

function findPackageJsonFiles (rootDir) {
  const results = []

  function walk (dir) {
    let entries

    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch (err) {
      return
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue
        walk(fullPath)
        continue
      }

      if (entry.name === 'package.json') {
        results.push(fullPath)
      }
    }
  }

  walk(rootDir)
  return results
}

function upgradePackageJsonFiles (rootDir, options) {
  const targetVersion = options.version
  const dryRun = !!options.dryRun
  const files = findPackageJsonFiles(rootDir)
  const updatedFiles = []

  files.forEach((filePath) => {
    const { raw, data } = readPackageJson(filePath)
    const { pkg, changes } = upgradePackageJsonObject(data, targetVersion)

    if (!changes.length) return

    if (!dryRun) {
      writePackageJson(filePath, pkg, raw)
    }

    updatedFiles.push({
      file: filePath,
      changes,
    })
  })

  return updatedFiles
}

module.exports = {
  shouldUpgradePackage,
  upgradePackageJsonObject,
  findPackageJsonFiles,
  upgradePackageJsonFiles,
}
