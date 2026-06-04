const fs = require('fs')
const path = require('path')
const { PATCH_PACKAGE } = require('./constants')
const { readPackageJson, writePackageJson } = require('../shared/package-json-io')

function addToSection (section, name, version, field, changes) {
  const next = { ...section }

  if (next[name] === version) {
    return { section: next, changed: false }
  }

  if (next[name]) {
    return { section: next, changed: false, exists: true }
  }

  changes.push({
    name,
    field,
    from: null,
    to: version,
  })
  next[name] = version

  return { section: next, changed: true }
}

function addPatchDependencies (pkg, options) {
  const patchVersion = options.patchVersion
  const changes = []
  const next = { ...pkg }
  const field = 'dependencies'

  if (!next.dependencies) {
    next.dependencies = {}
  }

  const patchResult = addToSection(
    { ...next.dependencies },
    PATCH_PACKAGE,
    patchVersion,
    field,
    changes
  )

  next.dependencies = patchResult.section

  return { pkg: next, changes }
}

function updateProjectPackageJson (projectRoot, options) {
  const filePath = path.join(projectRoot, 'package.json')

  if (!fs.existsSync(filePath)) {
    const error = new Error(`package.json not found in ${projectRoot}`)
    error.code = 'PACKAGE_JSON_NOT_FOUND'
    throw error
  }

  const { raw, data } = readPackageJson(filePath)
  const { pkg, changes } = addPatchDependencies(data, options)

  if (!changes.length) {
    return { filePath, changes: [], skipped: true }
  }

  if (!options.dryRun) {
    writePackageJson(filePath, pkg, raw)
  }

  return { filePath, changes, skipped: false }
}

module.exports = {
  addPatchDependencies,
  updateProjectPackageJson,
}
