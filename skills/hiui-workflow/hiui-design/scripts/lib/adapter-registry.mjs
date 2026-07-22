import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

function defaultSkillRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
}

function readRegistry(skillRoot = defaultSkillRoot()) {
  const registryPath = path.join(skillRoot, 'rules', 'adapter-registry.json')
  try {
    return JSON.parse(fs.readFileSync(registryPath, 'utf8'))
  } catch {
    return { schemaVersion: 'adapter-registry.v1', adapters: [] }
  }
}

export function loadAdapterRegistry({ skillRoot } = {}) {
  const registry = readRegistry(skillRoot)
  const adapters = Array.isArray(registry.adapters) ? registry.adapters : []
  const byId = new Map()

  for (const adapter of adapters) {
    const adapterId = String(adapter?.adapterId || '').trim()
    if (!adapterId) continue
    byId.set(adapterId, adapter)
  }

  return {
    schemaVersion: registry.schemaVersion || 'adapter-registry.v1',
    adapters,
    byId,
  }
}

export function getAdapterRegistryEntry(adapterId, { skillRoot } = {}) {
  return loadAdapterRegistry({ skillRoot }).byId.get(String(adapterId || '').trim()) || null
}

export function isLocalBypassContainmentAllowed(adapterId, containment, { skillRoot } = {}) {
  const adapter = getAdapterRegistryEntry(adapterId, { skillRoot })
  const allowed = Array.isArray(adapter?.allowedLocalBypassContainment)
    ? adapter.allowedLocalBypassContainment
    : []
  return allowed.includes(String(containment || '').trim())
}
