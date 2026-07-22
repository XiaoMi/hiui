import fs from 'node:fs'
import path from 'node:path'
import { findPageComponent, loadPageComponentCertification } from './page-component-registry.mjs'

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function getByPath(value, dottedPath) {
  return String(dottedPath || '')
    .split('.')
    .filter(Boolean)
    .reduce((current, segment) => current?.[segment], value)
}

export function loadRuntimeBridgeProfileRegistry({ skillRoot }) {
  const registryPath = path.join(skillRoot, 'rules', 'runtime-bridged-component-matrix.json')
  const registry = readJson(registryPath)
  const profiles = Array.isArray(registry.profiles) ? registry.profiles : []
  const byProfileId = new Map()
  const byComponentId = new Map()
  const byPageTypeId = new Map()

  for (const profile of profiles) {
    if (!profile?.profileId) continue
    byProfileId.set(profile.profileId, profile)
    if (profile.componentId) byComponentId.set(profile.componentId, profile)
    if (profile.pageTypeId && !byPageTypeId.has(profile.pageTypeId)) {
      byPageTypeId.set(profile.pageTypeId, profile)
    }
  }

  return {
    schemaVersion: registry.schemaVersion || 'runtime-bridged-component-matrix.v1',
    principles: Array.isArray(registry.principles) ? registry.principles : [],
    profiles,
    byProfileId,
    byComponentId,
    byPageTypeId,
  }
}

export function findRuntimeBridgeProfile(componentId, { skillRoot, pageTypeId = '' } = {}) {
  const registry = loadRuntimeBridgeProfileRegistry({ skillRoot })
  return registry.byComponentId.get(String(componentId || '').trim()) ||
    registry.byPageTypeId.get(String(pageTypeId || '').trim()) ||
    null
}

function blockedProfile({
  component,
  profile = null,
  reason,
  matchedBy = 'none',
}) {
  return {
    schemaVersion: 'runtime-bridge-profile-ref.v1',
    status: 'blocked',
    profileId: profile?.profileId || '',
    componentId: component?.componentId || '',
    pageTypeId: component?.pageTypeId || '',
    normalizedStrategy: profile?.normalizedGenerationStrategy || 'page-component',
    userFacingStrategy: profile?.userFacingGenerationStrategy || 'runtime-bridged-page-component',
    resolutionOrder: Array.isArray(profile?.resolutionOrder) ? profile.resolutionOrder : [],
    deliveryMode: profile?.deliveryMode || 'runtime-component-filled-by-business-slots',
    runtimeAssetSource: {
      assetKind: profile?.runtimeAssetSource?.assetKind || 'certified-page-component-shell',
      certificationRef: component?.certificationRef || profile?.runtimeAssetSource?.certificationRef || '',
      componentShellField: profile?.runtimeAssetSource?.componentShellField || 'certificationInputs.componentShell',
      componentShell: '',
    },
    semanticReferencePolicy: profile?.semanticReferencePolicy || null,
    bridgeLayerPolicy: profile?.bridgeLayerPolicy || null,
    bridgeAssets: profile?.bridgeAssets || null,
    matchedBy,
    reason,
  }
}

export function resolveRuntimeBridgeProfileForComponent({
  componentId,
  skillRoot,
  targetRoot = '',
}) {
  const component = findPageComponent(componentId, { skillRoot, targetRoot })
  if (!component) {
    return blockedProfile({
      component: { componentId: String(componentId || '').trim(), pageTypeId: '' },
      reason: 'runtime bridge profile is missing for legacy page component selection',
    })
  }

  const profile = findRuntimeBridgeProfile(component.componentId, {
    skillRoot,
    pageTypeId: component.pageTypeId,
  })

  if (!profile) {
    return blockedProfile({
      component,
      reason: 'runtime bridge profile is missing for legacy page component selection',
    })
  }

  const certification = loadPageComponentCertification(component, { skillRoot })
  const componentShell = String(
    getByPath(certification, profile.runtimeAssetSource.componentShellField) || ''
  ).trim()
  const matchedBy = profile.componentId === component.componentId ? 'componentId' : 'pageTypeId'

  if (!componentShell) {
    return blockedProfile({
      component,
      profile,
      matchedBy,
      reason: 'runtime bridge component shell could not be resolved from certification',
    })
  }

  return {
    schemaVersion: 'runtime-bridge-profile-ref.v1',
    status: 'available',
    profileId: profile.profileId,
    componentId: component.componentId,
    pageTypeId: component.pageTypeId,
    normalizedStrategy: profile.normalizedGenerationStrategy,
    userFacingStrategy: profile.userFacingGenerationStrategy,
    resolutionOrder: Array.isArray(profile.resolutionOrder) ? profile.resolutionOrder : [],
    deliveryMode: profile.deliveryMode,
    runtimeAssetSource: {
      assetKind: profile.runtimeAssetSource.assetKind,
      certificationRef: component.certificationRef || profile.runtimeAssetSource.certificationRef,
      componentShellField: profile.runtimeAssetSource.componentShellField,
      componentShell,
    },
    semanticReferencePolicy: profile.semanticReferencePolicy,
    bridgeLayerPolicy: profile.bridgeLayerPolicy,
    bridgeAssets: profile.bridgeAssets || null,
    matchedBy,
    reason: matchedBy === 'componentId'
      ? 'runtime bridge profile resolved from the selected page component'
      : 'runtime bridge profile resolved from page type semantics and the selected component certification',
  }
}
