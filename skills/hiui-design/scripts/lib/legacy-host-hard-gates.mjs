import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPageMoldForPageType } from './page-mold-registry.mjs'

function defaultSkillRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
}

function uniqueValues(values) {
  return Array.from(new Set(Array.isArray(values) ? values.filter(Boolean) : []))
}

export function loadLegacyHostHardGates({ skillRoot } = {}) {
  const resolvedSkillRoot = skillRoot || defaultSkillRoot()
  const truthPath = path.join(resolvedSkillRoot, 'rules', 'legacy-host-hard-gates.json')

  try {
    const truth = JSON.parse(fs.readFileSync(truthPath, 'utf8'))
    return {
      ...truth,
      sourcePath: 'rules/legacy-host-hard-gates.json',
    }
  } catch {
    return {
      schemaVersion: 'legacy-host-hard-gates.v1',
      mode: 'legacy-host-compatible',
      profile: 'ordinary-typical-page',
      baselineHardGates: [],
      conditionalHardGates: [],
      triggerChecks: [],
      notes: [],
      sourceRefs: {},
      sourcePath: 'rules/legacy-host-hard-gates.json',
    }
  }
}

function pageTypeHitsHeaderGate(pageTypeId, { skillRoot } = {}) {
  const mold = getPageMoldForPageType(pageTypeId, { skillRoot })
  if (!mold) return false

  const lockedRegions = Array.isArray(mold.lockedRegions) ? mold.lockedRegions : []
  const slotManifest = Array.isArray(mold.slotManifest) ? mold.slotManifest : []

  return lockedRegions.includes('header') || slotManifest.some((slot) => slot?.slotId === 'headerExtra')
}

export function resolveLegacyHostHardGatesForPageTypes({ mode, pageTypeIds, skillRoot } = {}) {
  if (mode !== 'legacy-host-compatible') return null

  const truth = loadLegacyHostHardGates({ skillRoot })
  const baselineHardGates = Array.isArray(truth.baselineHardGates) ? truth.baselineHardGates : []
  const conditionalHardGates = Array.isArray(truth.conditionalHardGates) ? truth.conditionalHardGates : []
  const triggerChecks = Array.isArray(truth.triggerChecks) ? truth.triggerChecks : []
  const normalizedPageTypeIds = uniqueValues(pageTypeIds)
  const headerLayoutContractRequired = normalizedPageTypeIds.some((pageTypeId) =>
    pageTypeHitsHeaderGate(pageTypeId, { skillRoot })
  )
  const appliedConditionalHardGates = conditionalHardGates.filter((gate) =>
    gate?.id === 'header-layout-proof' ? headerLayoutContractRequired : false
  )

  return {
    schemaVersion: truth.schemaVersion || 'legacy-host-hard-gates.v1',
    mode: truth.mode || 'legacy-host-compatible',
    profile: truth.profile || 'ordinary-typical-page',
    sourcePath: truth.sourcePath || 'rules/legacy-host-hard-gates.json',
    baselineHardGates,
    baselineGateIds: baselineHardGates.map((gate) => gate.id).filter(Boolean),
    conditionalHardGates,
    conditionalGateIds: conditionalHardGates.map((gate) => gate.id).filter(Boolean),
    appliedConditionalHardGates,
    appliedConditionIds: appliedConditionalHardGates.map((gate) => gate.id).filter(Boolean),
    effectiveGateIds: uniqueValues([
      ...baselineHardGates.map((gate) => gate.id),
      ...appliedConditionalHardGates.map((gate) => gate.id),
    ]),
    effectiveGateCount:
      baselineHardGates.length + appliedConditionalHardGates.length,
    triggerChecks,
    triggerCheckIds: triggerChecks.map((gate) => gate.id).filter(Boolean),
    headerLayoutContractRequired,
    pageTypeIds: normalizedPageTypeIds,
    notes: Array.isArray(truth.notes) ? truth.notes : [],
  }
}
