import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readDistributionAddresses(skillRoot) {
  const filePath = path.join(skillRoot, 'distribution-addresses.json')
  if (!(await pathExists(filePath))) {
    return null
  }

  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

function expandAddressTemplate(rawPath, skillRoot) {
  const value = typeof rawPath === 'string' ? rawPath.trim() : ''
  if (!value) {
    return ''
  }

  const replacements = new Map([
    ['<maintainer-root>', skillRoot],
    ['<skill-root>', skillRoot],
    ['<maintainer-parent>', path.dirname(skillRoot)],
    ['<user-home>', os.homedir()],
  ])

  let resolved = value
  for (const [token, replacement] of replacements.entries()) {
    resolved = resolved.split(token).join(replacement)
  }

  return resolved
}

async function resolveOfficialTeamPackagePath(skillRoot) {
  const registry = await readDistributionAddresses(skillRoot)
  if (!registry || typeof registry !== 'object') {
    return ''
  }

  const defaultsPath = typeof registry.defaults?.teamPackage === 'string'
    ? registry.defaults.teamPackage.trim()
    : ''
  if (defaultsPath) {
    return expandAddressTemplate(defaultsPath, skillRoot)
  }

  const examplePath = typeof registry.localExamples?.teamPackage === 'string'
    ? registry.localExamples.teamPackage.trim()
    : ''
  return expandAddressTemplate(examplePath, skillRoot)
}

export {
  expandAddressTemplate,
  readDistributionAddresses,
  resolveOfficialTeamPackagePath,
}
