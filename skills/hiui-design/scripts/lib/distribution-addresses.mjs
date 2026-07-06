import fs from 'node:fs/promises'
import path from 'node:path'

const LOCAL_OVERRIDE_FILE = '.distribution-addresses.local.json'

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
  const registry = JSON.parse(raw)
  const overridePath = path.join(skillRoot, LOCAL_OVERRIDE_FILE)

  if (!(await pathExists(overridePath))) {
    return registry
  }

  const overrideRaw = await fs.readFile(overridePath, 'utf8')
  const override = JSON.parse(overrideRaw)
  return mergeObjects(registry, override)
}

function mergeObjects(base, override) {
  if (Array.isArray(base) || Array.isArray(override)) {
    return Array.isArray(override) ? override : base
  }

  if (!base || typeof base !== 'object') return override
  if (!override || typeof override !== 'object') return base

  const merged = { ...base }
  for (const [key, value] of Object.entries(override)) {
    merged[key] = key in base ? mergeObjects(base[key], value) : value
  }
  return merged
}

async function resolveOfficialTeamPackagePath(skillRoot) {
  const registry = await readDistributionAddresses(skillRoot)
  if (!registry || typeof registry !== 'object') {
    return ''
  }

  const defaultsPath = typeof registry.defaults?.teamPackage === 'string'
    ? registry.defaults.teamPackage.trim()
    : ''
  if (isConcretePath(defaultsPath)) {
    return defaultsPath
  }

  const examplePath = typeof registry.localExamples?.teamPackage === 'string'
    ? registry.localExamples.teamPackage.trim()
    : ''
  return isConcretePath(examplePath) ? examplePath : ''
}

function isConcretePath(value) {
  return Boolean(value) && !/[<>]/.test(value)
}

export {
  LOCAL_OVERRIDE_FILE,
  readDistributionAddresses,
  resolveOfficialTeamPackagePath,
}
