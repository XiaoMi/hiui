import fs from 'node:fs'
import path from 'node:path'

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function readJsonIfExists(filePath) {
  try {
    return readJson(filePath)
  } catch {
    return null
  }
}

function withRegistryMetadata(component, { registryKind, registryBasePath }) {
  return {
    ...component,
    __registryKind: registryKind,
    __registryBasePath: registryBasePath,
  }
}

function loadProjectPageComponentOverlay({ targetRoot }) {
  if (!targetRoot) return []

  const overlayPath = path.join(
    targetRoot,
    '.local-context',
    'hiui-design',
    'outputs',
    'project-page-component-registry.json'
  )
  const overlay = readJsonIfExists(overlayPath)
  if (!overlay || !Array.isArray(overlay.components)) return []

  const schemaVersion = String(overlay.schemaVersion || '').trim()
  if (schemaVersion && !['project-page-component-registry.v1', 'page-component-registry.v1'].includes(schemaVersion)) {
    return []
  }

  return overlay.components
    .filter((component) => component?.componentId)
    .map((component) =>
      withRegistryMetadata(component, {
        registryKind: 'project-overlay',
        registryBasePath: targetRoot,
      })
    )
}

function comparePageComponentsForSelection(left, right, { mode = '', pageTypeId = '' } = {}) {
  const leftProjectOverlay = left?.__registryKind === 'project-overlay'
  const rightProjectOverlay = right?.__registryKind === 'project-overlay'
  if (leftProjectOverlay !== rightProjectOverlay) return leftProjectOverlay ? -1 : 1

  const leftManagedBootstrapCarrier = Boolean(
    left?.managedBootstrapCarrier ||
    left?.provisioningSource === 'bootstrap-target-project' ||
    left?.carrierFamilyId === 'legacy-bootstrap-managed-carrier.v1'
  )
  const rightManagedBootstrapCarrier = Boolean(
    right?.managedBootstrapCarrier ||
    right?.provisioningSource === 'bootstrap-target-project' ||
    right?.carrierFamilyId === 'legacy-bootstrap-managed-carrier.v1'
  )
  if (leftManagedBootstrapCarrier !== rightManagedBootstrapCarrier) {
    return leftManagedBootstrapCarrier ? -1 : 1
  }

  const leftCertified = left?.status === 'certified' &&
    left?.certificationStatus === 'certified' &&
    Boolean(left?.certificationRef)
  const rightCertified = right?.status === 'certified' &&
    right?.certificationStatus === 'certified' &&
    Boolean(right?.certificationRef)
  if (leftCertified !== rightCertified) return leftCertified ? -1 : 1

  const leftExactMode = String(left?.mode || '') === mode
  const rightExactMode = String(right?.mode || '') === mode
  if (leftExactMode !== rightExactMode) return leftExactMode ? -1 : 1

  const leftExactPageType = String(left?.pageTypeId || '') === pageTypeId
  const rightExactPageType = String(right?.pageTypeId || '') === pageTypeId
  if (leftExactPageType !== rightExactPageType) return leftExactPageType ? -1 : 1

  return String(left?.componentId || '').localeCompare(String(right?.componentId || ''))
}

export function loadPageComponentRegistry({ skillRoot, targetRoot = '' }) {
  const registryPath = path.join(skillRoot, 'rules', 'page-component-registry.json')
  const registry = readJson(registryPath)
  const bundledComponents = Array.isArray(registry.components)
    ? registry.components.map((component) =>
        withRegistryMetadata(component, {
          registryKind: 'skill-global',
          registryBasePath: skillRoot,
        })
      )
    : []
  const projectOverlayComponents = loadProjectPageComponentOverlay({ targetRoot })
  const componentMap = new Map()
  for (const component of [...bundledComponents, ...projectOverlayComponents]) {
    if (!component?.componentId) continue
    componentMap.set(component.componentId, component)
  }
  const components = Array.from(componentMap.values())
  const byComponentId = new Map()
  const byModeAndPageType = new Map()

  for (const component of components) {
    if (!component?.componentId) continue
    byComponentId.set(component.componentId, component)
    for (const mode of supportedModesForPageComponent(component)) {
      const key = `${mode}:${component.pageTypeId}`
      if (!byModeAndPageType.has(key)) byModeAndPageType.set(key, [])
      byModeAndPageType.get(key).push(component)
    }
  }

  for (const [key, scopedComponents] of byModeAndPageType.entries()) {
    const [mode, pageTypeId] = key.split(':')
    scopedComponents.sort((left, right) =>
      comparePageComponentsForSelection(left, right, { mode, pageTypeId })
    )
  }

  return {
    schemaVersion: registry.schemaVersion || 'page-component-registry.v1',
    components,
    byComponentId,
    byModeAndPageType,
    projectOverlayLoaded: projectOverlayComponents.length > 0,
  }
}

export function findPageComponent(componentId, { skillRoot, targetRoot = '' }) {
  const registry = loadPageComponentRegistry({ skillRoot, targetRoot })
  return registry.byComponentId.get(String(componentId || '').trim()) || null
}

export function listPageComponentsForModeAndPageType({ mode, pageTypeId, skillRoot, targetRoot = '' }) {
  const registry = loadPageComponentRegistry({ skillRoot, targetRoot })
  return registry.byModeAndPageType.get(`${mode}:${pageTypeId}`) || []
}

export function supportedModesForPageComponent(component) {
  const declaredModes = Array.isArray(component?.supportedModes) ? component.supportedModes : []
  return Array.from(
    new Set(
      [component?.mode, ...declaredModes]
        .map((mode) => String(mode || '').trim())
        .filter(Boolean)
    )
  )
}

export function loadPageComponentCertification(component, { skillRoot }) {
  const certificationRef = String(component?.certificationRef || '').trim()
  if (!certificationRef) return null
  if (path.isAbsolute(certificationRef) || certificationRef.includes('..')) return null

  try {
    return readJson(path.join(component?.__registryBasePath || skillRoot, certificationRef))
  } catch {
    return null
  }
}

export function isPageComponentCertificationValid(component, certification) {
  if (!certification) return false
  return (
    certification.schemaVersion === 'page-component-certification.v1' &&
    certification.status === 'certified' &&
    certification.componentId === component.componentId &&
    certification.baseMoldId === component.baseMoldId &&
    certification.mode === component.mode
  )
}

export function isPageComponentCertified(component, certification) {
  return (
    component?.status === 'certified' &&
    component?.certificationStatus === 'certified' &&
    Boolean(component?.certificationRef) &&
    isPageComponentCertificationValid(component, certification)
  )
}
