import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_EDITABLE_SLOTS = [
  'pageTitle',
  'headerExtra',
  'queryFields',
  'statItems',
  'tableColumns',
  'formFields',
  'detailFields',
  'rowActions',
  'cellEditRules',
  'mockData',
  'apiBinding',
]

function defaultSkillRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
}

function readRegistry(skillRoot = defaultSkillRoot()) {
  const registryPath = path.join(skillRoot, 'rules', 'page-mold-registry.json')
  try {
    return JSON.parse(fs.readFileSync(registryPath, 'utf8'))
  } catch {
    return { schemaVersion: 'page-mold-registry.v1', molds: [] }
  }
}

export function loadPageMoldRegistry({ skillRoot } = {}) {
  const registry = readRegistry(skillRoot)
  const molds = Array.isArray(registry.molds) ? registry.molds : []
  const byPageType = new Map()
  const byMoldId = new Map()

  for (const mold of molds) {
    const pageTypeId = String(mold?.pageTypeId || '').trim()
    const moldId = String(mold?.moldId || '').trim()
    if (!pageTypeId || !moldId) continue
    byPageType.set(pageTypeId, mold)
    byMoldId.set(moldId, mold)
  }

  return {
    schemaVersion: registry.schemaVersion || 'page-mold-registry.v1',
    molds,
    byPageType,
    byMoldId,
  }
}

export function getPageMoldForPageType(pageTypeId, { skillRoot } = {}) {
  return loadPageMoldRegistry({ skillRoot }).byPageType.get(String(pageTypeId || '').trim()) || null
}

export function getLockedRegionsForPageType(pageTypeId, { skillRoot } = {}) {
  const mold = getPageMoldForPageType(pageTypeId, { skillRoot })
  return Array.isArray(mold?.lockedRegions) && mold.lockedRegions.length > 0
    ? mold.lockedRegions
    : ['shell', 'header', 'white-body', 'main-scroll']
}

export function getEditableSlotsForPageType(pageTypeId, { skillRoot } = {}) {
  const mold = getPageMoldForPageType(pageTypeId, { skillRoot })
  return Array.isArray(mold?.editableSlots) && mold.editableSlots.length > 0
    ? mold.editableSlots
    : DEFAULT_EDITABLE_SLOTS
}

export function getSlotManifestForPageType(pageTypeId, { skillRoot } = {}) {
  const mold = getPageMoldForPageType(pageTypeId, { skillRoot })
  if (Array.isArray(mold?.slotManifest) && mold.slotManifest.length > 0) {
    return mold.slotManifest
  }

  return getEditableSlotsForPageType(pageTypeId, { skillRoot }).map((slotId) => ({
    slotId,
    label: slotId,
    contentType: 'business-slot',
    allowedChanges: ['businessContent'],
    forbiddenChanges: ['shell', 'layout-owner'],
  }))
}

export function getMoldIdForPageType(pageTypeId, { skillRoot } = {}) {
  const mold = getPageMoldForPageType(pageTypeId, { skillRoot })
  return String(mold?.moldId || '').trim() || `${pageTypeId}.managed-mold.v1`
}

export function isFreeformScaffoldBlockedForPageType(pageTypeId, { skillRoot } = {}) {
  const mold = getPageMoldForPageType(pageTypeId, { skillRoot })
  return Boolean(mold?.blockedFreeformScaffold)
}

export { DEFAULT_EDITABLE_SLOTS }
