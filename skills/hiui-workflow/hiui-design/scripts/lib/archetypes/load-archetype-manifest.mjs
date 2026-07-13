import fs from 'node:fs/promises'
import path from 'node:path'

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readOptionalJson(filePath, fallback) {
  if (!(await pathExists(filePath))) {
    return fallback
  }
  return readJson(filePath)
}

export async function loadArchetypeRegistry({ skillRoot }) {
  const registryPath = path.join(skillRoot, 'archetypes', 'registry', 'common.archetypes.json')
  const ownershipPath = path.join(
    skillRoot,
    'archetypes',
    'registry',
    'common.region-ownerships.json'
  )
  const capabilitiesPath = path.join(
    skillRoot,
    'archetypes',
    'registry',
    'common.adapter-capabilities.json'
  )

  const registry = await readJson(registryPath)
  const ownershipRegistry = await readJson(ownershipPath)
  const capabilityRegistry = await readJson(capabilitiesPath)

  return {
    registryPath,
    ownershipPath,
    capabilitiesPath,
    registry,
    ownershipRegistry,
    capabilityRegistry,
  }
}

export async function loadArchetypeDefinition({ skillRoot, pageTypeId }) {
  const { registry, ownershipRegistry, capabilityRegistry } = await loadArchetypeRegistry({
    skillRoot,
  })
  const archetypeMeta = Array.isArray(registry?.archetypes)
    ? registry.archetypes.find((item) => item.pageTypeId === pageTypeId)
    : null

  if (!archetypeMeta) {
    return {
      archetypeMeta: null,
      archetype: null,
      regions: [],
      ownership: null,
      allowedOverrides: [],
      forbiddenEscapes: [],
      capabilityRegistry,
      ownershipRegistry,
    }
  }

  const definitionDir = path.join(skillRoot, archetypeMeta.definitionDir)
  const archetype = await readJson(path.join(definitionDir, 'archetype.json'))
  const regionsJson = await readOptionalJson(path.join(definitionDir, 'regions.json'), {
    regions: [],
  })
  const ownership = await readOptionalJson(path.join(definitionDir, 'ownership.json'), null)
  const allowedOverridesJson = await readOptionalJson(
    path.join(definitionDir, 'allowed-overrides.json'),
    { allowed: [] }
  )
  const forbiddenEscapesJson = await readOptionalJson(
    path.join(definitionDir, 'forbidden-escapes.json'),
    { escapes: [] }
  )

  return {
    archetypeMeta,
    archetype,
    regions: Array.isArray(regionsJson?.regions) ? regionsJson.regions : [],
    ownership,
    allowedOverrides: Array.isArray(allowedOverridesJson?.allowed)
      ? allowedOverridesJson.allowed
      : [],
    forbiddenEscapes: Array.isArray(forbiddenEscapesJson?.escapes)
      ? forbiddenEscapesJson.escapes
      : [],
    capabilityRegistry,
    ownershipRegistry,
  }
}

export function getModeTemplateDir(archetype, mode) {
  return archetype?.modeAdapters?.[mode]?.templateDir || ''
}
