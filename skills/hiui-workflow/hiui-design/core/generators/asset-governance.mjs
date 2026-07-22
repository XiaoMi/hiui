import fs from 'fs'
import path from 'path'
import {
  OFFICIAL_RUNTIME_REGISTRY_PATH,
  PAGEGEN_ROOT,
  REPO_ROOT,
  assert,
  normalizeProjectModeId,
  readJson,
  relativeToRoot,
} from './shared.mjs'

export const ASSET_GOVERNANCE_REGISTRY_PATH = path.resolve(
  PAGEGEN_ROOT,
  'asset-governance',
  'governance-registry.json'
)

const DEFAULT_TRUTH_SOURCE_PRIORITY = [
  'reference-asset',
  'official-runtime-entry',
  'official-mirror',
  'managed-fallback',
  'legacy',
]

const MANAGED_GENERATION_MODES = new Set(['official-runtime', 'reference-asset', 'canonical'])
const GENERATION_DECISION_SOURCES = new Set([
  'explicit-request',
  'governance-preferred',
  'fallback-no-preferred-route',
])

function readParityManifest(pageType) {
  const parityPath = path.resolve(PAGEGEN_ROOT, 'parity', `${pageType}.json`)
  if (!fs.existsSync(parityPath)) {
    return null
  }

  return {
    path: parityPath,
    payload: readJson(parityPath),
  }
}

function extractVersionFromTarballPath(targetPath) {
  const fileName = path.basename(String(targetPath || ''))
  const match = fileName.match(/-(\d+\.\d+\.\d+)\.tgz$/)
  return match ? match[1] : null
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return Array.from(
    new Set(
      value
        .map((item) => String(item || '').trim())
        .filter(Boolean)
    )
  )
}

function optionalStringField(value) {
  const normalized = String(value || '').trim()
  return normalized ? normalized : ''
}

function isManagedAnalyticsProfile({ pageType = '', assetGovernance = null } = {}) {
  const normalizedPageType = optionalStringField(pageType)
  const profileId = optionalStringField(assetGovernance?.profileId)
  const deliveryRole = optionalStringField(assetGovernance?.deliveryRole)

  return (
    normalizedPageType === 'data-visualization' &&
    (profileId === 'managed-analytics-shell' ||
      deliveryRole === 'managed-analytics-business-shell')
  )
}

function normalizeManagedGenerationModeValue(value) {
  const normalized = String(value || '').trim()
  return MANAGED_GENERATION_MODES.has(normalized) ? normalized : ''
}

function clonePlainObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, entry]) => [String(key || '').trim(), String(entry || '').trim()])
      .filter(([key, entry]) => key && entry)
  )
}

function resolveCompatibilityProfilesRegistry(registry = {}) {
  const compatibilityProfiles = registry.compatibilityProfiles
  if (compatibilityProfiles && typeof compatibilityProfiles === 'object') {
    return compatibilityProfiles
  }

  return registry.canonicalProfiles && typeof registry.canonicalProfiles === 'object'
    ? registry.canonicalProfiles
    : {}
}

function resolveContextualProfileId(profileMap = {}, { projectMode = '', projectType = '' } = {}) {
  const contextualProfiles =
    profileMap && typeof profileMap === 'object' ? profileMap : {}
  return buildGovernanceContextKeys({ projectMode, projectType })
    .map((contextKey) => optionalStringField(contextualProfiles[contextKey]))
    .find(Boolean)
}

function resolveCompatibilityProfileName(
  pageTypeProfile = {},
  { projectMode = '', projectType = '' } = {}
) {
  return (
    resolveContextualProfileId(pageTypeProfile.compatibilityProfileByContext, {
      projectMode,
      projectType,
    }) ||
    String(
      pageTypeProfile.compatibilityProfile || pageTypeProfile.canonicalProfile || 'managed-fallback'
    ).trim() ||
    'managed-fallback'
  )
}

function resolvePageTypeGovernancePolicyFromRegistry(
  registry,
  pageType,
  { projectMode = '', projectType = '' } = {}
) {
  const defaults = registry.defaultPageTypePolicy || {}
  const pageTypeProfile = registry.pageTypeProfiles?.[pageType] || {}
  const contextualTruthSourcePriorityRegistry =
    pageTypeProfile.truthSourcePriorityByContext &&
    typeof pageTypeProfile.truthSourcePriorityByContext === 'object'
      ? pageTypeProfile.truthSourcePriorityByContext
      : {}
  const contextualTruthSourcePriority = buildGovernanceContextKeys({
    projectMode,
    projectType,
  })
    .map((contextKey) => normalizeStringArray(contextualTruthSourcePriorityRegistry[contextKey]))
    .find((priority) => priority.length > 0)
  const truthSourcePriority =
    contextualTruthSourcePriority && contextualTruthSourcePriority.length > 0
      ? contextualTruthSourcePriority
      : normalizeStringArray(pageTypeProfile.truthSourcePriority || defaults.truthSourcePriority)
  const preferredGenerationModes = {
    ...clonePlainObject(defaults.preferredGenerationModes),
    ...clonePlainObject(pageTypeProfile.preferredGenerationModes),
  }

  return {
    compatibilityProfile: resolveCompatibilityProfileName(pageTypeProfile, {
      projectMode,
      projectType,
    }),
    canonicalProfile: resolveCompatibilityProfileName(pageTypeProfile, {
      projectMode,
      projectType,
    }),
    deliveryBindingProfile:
      resolveContextualProfileId(pageTypeProfile.deliveryBindingProfileByContext, {
        projectMode,
        projectType,
      }) || optionalStringField(pageTypeProfile.deliveryBindingProfile),
    truthSourcePriority:
      truthSourcePriority.length > 0 ? truthSourcePriority : DEFAULT_TRUTH_SOURCE_PRIORITY,
    preferredGenerationModes,
    policySource: relativeToRoot(ASSET_GOVERNANCE_REGISTRY_PATH),
  }
}

function buildGovernanceContextKeys({ projectMode, projectType }) {
  const normalizedMode = normalizeProjectModeId(projectMode)
  const normalizedProjectType = String(projectType || '').trim() || 'any'

  if (!normalizedMode) {
    return []
  }

  return [`${normalizedMode}:${normalizedProjectType}`, `${normalizedMode}:any`]
}

function isGenerationModeAllowedForProjectMode({ pageType, generationMode, projectMode }) {
  const normalizedProjectMode = normalizeProjectModeId(projectMode)
  if (!normalizedProjectMode) {
    return false
  }

  const governanceState = resolveAssetGovernanceState({
    pageType,
    generationMode,
  })

  return governanceState.allowedModes.includes(normalizedProjectMode)
}

function resolveGovernanceProfileSelection({
  registry,
  pageType,
  generationMode,
  projectMode = '',
  projectType = '',
}) {
  if (generationMode === 'official-runtime') {
    return {
      profileId:
        String(registry.runtimeEntryProfile?.profileId || registry.runtimeEntryProfile?.assetMode || '').trim() ||
        'official-runtime-entry',
      profile: registry.runtimeEntryProfile,
    }
  }

  if (generationMode === 'reference-asset') {
    return {
      profileId:
        String(
          registry.referenceAssetProfile?.profileId || registry.referenceAssetProfile?.assetMode || ''
        ).trim() || 'reference-asset',
      profile: registry.referenceAssetProfile,
    }
  }

  const pageTypePolicy = resolvePageTypeGovernancePolicyFromRegistry(registry, pageType, {
    projectMode,
    projectType,
  })
  const compatibilityProfileName = pageTypePolicy.compatibilityProfile
  const compatibilityProfiles = resolveCompatibilityProfilesRegistry(registry)
  const compatibilityProfile = compatibilityProfiles?.[compatibilityProfileName]

  assert(
    compatibilityProfile,
    `页型 ${pageType} 命中的 compatibilityProfile=${compatibilityProfileName} 未在资产治理注册表声明`
  )

  return {
    profileId:
      String(compatibilityProfile.profileId || compatibilityProfileName).trim() ||
      compatibilityProfileName,
    profile: compatibilityProfile,
  }
}

export function readAssetGovernanceRegistry() {
  assert(
    fs.existsSync(ASSET_GOVERNANCE_REGISTRY_PATH),
    `缺少资产治理注册表：${relativeToRoot(ASSET_GOVERNANCE_REGISTRY_PATH)}`
  )

  return readJson(ASSET_GOVERNANCE_REGISTRY_PATH)
}

export function resolvePageTypeGovernancePolicy(pageType, context = {}) {
  const registry = readAssetGovernanceRegistry()
  return resolvePageTypeGovernancePolicyFromRegistry(registry, pageType, context)
}

export function resolveReferenceAssetTemplatePathForMode({ projectMode, pageType }) {
  const normalizedProjectMode = normalizeProjectModeId(projectMode)

  if (!normalizedProjectMode) {
    return ''
  }

  const candidateModes =
    normalizedProjectMode === 'rules-only'
      ? ['rules-only', 'host-integration']
      : [normalizedProjectMode]

  for (const candidateMode of candidateModes) {
    const templatePath = path.resolve(
      PAGEGEN_ROOT,
      '..',
      'templates',
      'archetypes',
      candidateMode,
      pageType,
      'page.template.tsx'
    )

    if (fs.existsSync(templatePath)) {
      return templatePath
    }
  }

  return ''
}

export function resolvePreferredGenerationMode({
  pageType,
  projectMode,
  projectType,
  officialRuntimeAvailable = false,
  referenceAssetTemplateAvailable = false,
}) {
  const policy = resolvePageTypeGovernancePolicy(pageType)
  const preferredMode = buildGovernanceContextKeys({ projectMode, projectType })
    .map((contextKey) => policy.preferredGenerationModes?.[contextKey])
    .find(Boolean)

  if (!preferredMode) {
    return ''
  }

  if (
    preferredMode === 'official-runtime' &&
    (!officialRuntimeAvailable ||
      !isGenerationModeAllowedForProjectMode({ pageType, generationMode: preferredMode, projectMode }))
  ) {
    return ''
  }

  if (
    preferredMode === 'reference-asset' &&
    (!referenceAssetTemplateAvailable ||
      !isGenerationModeAllowedForProjectMode({ pageType, generationMode: preferredMode, projectMode }))
  ) {
    return ''
  }

  if (
    preferredMode === 'canonical' &&
    !isGenerationModeAllowedForProjectMode({ pageType, generationMode: preferredMode, projectMode })
  ) {
    return ''
  }

  return preferredMode
}

export function normalizeGenerationMode(meta = {}) {
  if (
    meta.generatorMode === 'official-runtime' ||
    meta.generatorMode === 'canonical' ||
    meta.generatorMode === 'reference-asset'
  ) {
    return meta.generatorMode
  }

  if (
    meta.runtimeFamily === 'official-runtime' ||
    meta.officialRuntime ||
    String(meta.assetSource || '').includes('runtime-families/official-runtime')
  ) {
    return 'official-runtime'
  }

  if (
    meta.runtimeFamily === 'reference-asset' ||
    String(meta.assetSource || '').includes('templates/archetypes/') ||
    (meta.referenceAsset &&
      meta.referenceAsset.mode === 'explicit-asset' &&
      !String(meta.referenceAsset.canonicalComponentPath || '').trim())
  ) {
    return 'reference-asset'
  }

  return 'canonical'
}

export function resolveManagedRuntimeFamily({
  generationMode,
  pageType = '',
  assetGovernance = null,
} = {}) {
  if (generationMode === 'official-runtime') {
    return 'official-runtime'
  }

  if (generationMode === 'reference-asset') {
    return 'reference-asset'
  }

  return isManagedAnalyticsProfile({ pageType, assetGovernance })
    ? 'local-managed-analytics'
    : 'local-canonical'
}

export function resolveManagedGenerationStrategy({ pageType = '', assetGovernance = null } = {}) {
  return isManagedAnalyticsProfile({ pageType, assetGovernance }) ? 'managed-analytics' : ''
}

export function normalizeGenerationDecision(decision = null, fallbackFinalMode = 'canonical') {
  if (!decision || typeof decision !== 'object' || Array.isArray(decision)) {
    return null
  }

  const requestedMode = normalizeManagedGenerationModeValue(decision.requestedMode)
  const governancePreferredMode = normalizeManagedGenerationModeValue(decision.governancePreferredMode)
  const finalMode =
    normalizeManagedGenerationModeValue(decision.finalMode) ||
    normalizeManagedGenerationModeValue(fallbackFinalMode) ||
    'canonical'
  const declaredSource = String(decision.source || '').trim()
  const derivedSource =
    requestedMode && requestedMode === finalMode
      ? 'explicit-request'
      : governancePreferredMode && governancePreferredMode === finalMode
        ? 'governance-preferred'
        : 'fallback-no-preferred-route'
  const source = GENERATION_DECISION_SOURCES.has(declaredSource) ? declaredSource : derivedSource

  const normalizedDecision = {
    requestedMode,
    governancePreferredMode,
    finalMode,
    source,
  }
  const normalizedProjectMode = normalizeProjectModeId(decision.projectMode)
  const projectType = optionalStringField(decision.projectType)

  if (normalizedProjectMode) {
    normalizedDecision.projectMode = normalizedProjectMode
  }

  if (projectType) {
    normalizedDecision.projectType = projectType
  }

  return normalizedDecision
}

export function buildGenerationDecision({
  requestedMode = '',
  governancePreferredMode = '',
  finalMode = 'canonical',
  projectMode = '',
  projectType = '',
} = {}) {
  return normalizeGenerationDecision(
    {
      requestedMode,
      governancePreferredMode,
      finalMode,
      projectMode,
      projectType,
    },
    finalMode
  )
}

export function resolveAssetGovernance({
  pageType,
  generationMode,
  assetSource = '',
  referenceAsset = null,
  projectMode = '',
  projectType = '',
}) {
  const registry = readAssetGovernanceRegistry()
  const profileSource = relativeToRoot(ASSET_GOVERNANCE_REGISTRY_PATH)

  if (generationMode === 'official-runtime') {
    return {
      assetMode: registry.runtimeEntryProfile.assetMode,
      standardsSource: registry.runtimeEntryProfile.standardsSource,
      standardsBaselineType: 'official-runtime-registry',
      standardsBaselinePath: relativeToRoot(OFFICIAL_RUNTIME_REGISTRY_PATH),
      standardsVersion: null,
      syncStatus: registry.runtimeEntryProfile.syncStatus,
      lifecycle: registry.runtimeEntryProfile.lifecycle,
      profileSource,
    }
  }

  if (generationMode === 'reference-asset') {
    const referenceProfile = registry.referenceAssetProfile

    assert(referenceProfile, '资产治理注册表缺少 referenceAssetProfile')

    return {
      assetMode: referenceProfile.assetMode,
      standardsSource: referenceProfile.standardsSource,
      standardsBaselineType: 'reference-example',
      standardsBaselinePath:
        referenceAsset?.examplePath ||
        referenceAsset?.assetExamplePath ||
        referenceAsset?.templateAssetSource ||
        relativeToRoot(path.resolve(REPO_ROOT, assetSource)),
      standardsVersion: null,
      syncStatus: referenceProfile.syncStatus,
      lifecycle: referenceProfile.lifecycle,
      profileSource,
    }
  }

  const compatibilityProfileName = resolveCompatibilityProfileName(
    registry.pageTypeProfiles?.[pageType] || {},
    { projectMode, projectType }
  )
  const compatibilityProfiles = resolveCompatibilityProfilesRegistry(registry)
  const compatibilityProfile = compatibilityProfiles?.[compatibilityProfileName]

  assert(
    compatibilityProfile,
    `页型 ${pageType} 命中的 compatibilityProfile=${compatibilityProfileName} 未在资产治理注册表声明`
  )

  const parity = readParityManifest(pageType)
  let standardsBaselineType = 'local-canonical-proposal'
  let standardsBaselinePath = relativeToRoot(path.resolve(REPO_ROOT, assetSource))
  let standardsVersion = null

  if (parity?.payload?.officialSnapshot) {
    standardsBaselineType = 'official-snapshot'
    standardsBaselinePath = `${parity.payload.officialSnapshot.tarball}#${parity.payload.officialSnapshot.entry}`
    standardsVersion = extractVersionFromTarballPath(parity.payload.officialSnapshot.tarball)
  } else if (parity?.payload?.officialSource?.path) {
    standardsBaselineType = 'official-reference-source'
    standardsBaselinePath = parity.payload.officialSource.path
  }

  return {
    assetMode: compatibilityProfile.assetMode,
    standardsSource: compatibilityProfile.standardsSource,
    standardsBaselineType,
    standardsBaselinePath,
    standardsVersion,
    syncStatus: compatibilityProfile.syncStatus,
    lifecycle: compatibilityProfile.lifecycle,
    profileSource,
  }
}

export function resolveAssetGovernanceState({
  pageType,
  generationMode,
  assetSource = '',
  referenceAsset = null,
  projectMode = '',
  projectType = '',
}) {
  const registry = readAssetGovernanceRegistry()
  const profileSource = relativeToRoot(ASSET_GOVERNANCE_REGISTRY_PATH)
  const pageTypePolicy = resolvePageTypeGovernancePolicyFromRegistry(registry, pageType, {
    projectMode,
    projectType,
  })
  const { profileId, profile } = resolveGovernanceProfileSelection({
    registry,
    pageType,
    generationMode,
    projectMode,
    projectType,
  })
  const baseGovernance = resolveAssetGovernance({
    pageType,
    generationMode,
    assetSource,
    referenceAsset,
    projectMode,
    projectType,
  })
  const deliveryBindingProfiles =
    registry.deliveryBindingProfiles && typeof registry.deliveryBindingProfiles === 'object'
      ? registry.deliveryBindingProfiles
      : {}
  const deliveryBindingProfileId = pageTypePolicy.deliveryBindingProfile
  const deliveryBindingProfile = deliveryBindingProfileId
    ? deliveryBindingProfiles?.[deliveryBindingProfileId]
    : null

  return {
    governanceSchemaVersion: String(registry.schemaVersion || '').trim() || 'asset-governance.v1',
    profileId,
    assetMode: baseGovernance.assetMode,
    assetClass: String(profile?.assetClass || '').trim(),
    deliveryRole: String(profile?.deliveryRole || '').trim(),
    standardsSource: baseGovernance.standardsSource,
    standardsBaselineType: baseGovernance.standardsBaselineType,
    standardsBaselinePath: baseGovernance.standardsBaselinePath,
    standardsVersion: baseGovernance.standardsVersion,
    syncStatus: baseGovernance.syncStatus,
    lifecycle: baseGovernance.lifecycle,
    readiness: String(profile?.readiness || '').trim(),
    parityStatus: String(profile?.parityStatus || '').trim(),
    preferredContexts: normalizeStringArray(profile?.preferredContexts),
    allowedModes: normalizeStringArray(profile?.allowedModes),
    truthSourcePriority: pageTypePolicy.truthSourcePriority,
    preferredGenerationModes: pageTypePolicy.preferredGenerationModes,
    profileSource,
    pageTypePolicySource: pageTypePolicy.policySource,
    ...(deliveryBindingProfileId
      ? {
          deliveryBindingProfileId,
        }
      : {}),
    ...(optionalStringField(deliveryBindingProfile?.bindingMode)
      ? {
          deliveryBindingMode: optionalStringField(deliveryBindingProfile.bindingMode),
        }
      : {}),
    ...(optionalStringField(deliveryBindingProfile?.bindingRole)
      ? {
          deliveryBindingRole: optionalStringField(deliveryBindingProfile.bindingRole),
        }
      : {}),
    ...(normalizeStringArray(deliveryBindingProfile?.mustNotOwn).length > 0
      ? {
          deliveryBindingMustNotOwn: normalizeStringArray(deliveryBindingProfile.mustNotOwn),
        }
      : {}),
    ...(deliveryBindingProfile?.visualTransparencyRequired === true
      ? {
          deliveryBindingVisualTransparencyRequired: true,
        }
      : {}),
    ...(generationMode === 'canonical' && optionalStringField(profile?.profileId || profileId)
      ? {
          compatibilityProfileId: optionalStringField(profile?.profileId || profileId),
        }
      : {}),
    ...(optionalStringField(profile?.parityContract)
      ? {
          parityContract: optionalStringField(profile?.parityContract),
        }
      : {}),
    ...(optionalStringField(profile?.driftWhitelistPolicy)
      ? {
          driftWhitelistPolicy: optionalStringField(profile?.driftWhitelistPolicy),
        }
      : {}),
    ...(optionalStringField(profile?.owner)
      ? {
          owner: optionalStringField(profile?.owner),
        }
      : {}),
    ...(optionalStringField(profile?.replacementTarget)
      ? {
          replacementTarget: optionalStringField(profile?.replacementTarget),
        }
      : {}),
    ...(optionalStringField(profile?.expiryPolicy)
      ? {
          expiryPolicy: optionalStringField(profile?.expiryPolicy),
        }
      : {}),
    ...(optionalStringField(profile?.maintenancePolicy)
      ? {
          maintenancePolicy: optionalStringField(profile?.maintenancePolicy),
        }
      : {}),
    ...(normalizeStringArray(profile?.entryCriteria).length > 0
      ? {
          entryCriteria: normalizeStringArray(profile?.entryCriteria),
        }
      : {}),
    ...(normalizeStringArray(profile?.exitCriteria).length > 0
      ? {
          exitCriteria: normalizeStringArray(profile?.exitCriteria),
        }
      : {}),
  }
}

export function buildManagedPageMeta({
  generatedAt,
  pageType,
  assetSource,
  schemaSource,
  generator = 'hiui-pagegen',
  generationMode,
  officialRuntime,
  referenceAsset,
  generationDecision,
}) {
  const normalizedGenerationMode =
    generationMode === 'official-runtime'
      ? 'official-runtime'
      : generationMode === 'reference-asset'
        ? 'reference-asset'
        : 'canonical'
  const assetGovernance = resolveAssetGovernanceState({
    pageType,
    generationMode: normalizedGenerationMode,
    assetSource,
    referenceAsset,
    projectMode: generationDecision?.projectMode,
    projectType: generationDecision?.projectType,
  })
  const runtimeFamily = resolveManagedRuntimeFamily({
    generationMode: normalizedGenerationMode,
    pageType,
    assetGovernance,
  })
  const generationStrategy = resolveManagedGenerationStrategy({
    pageType,
    assetGovernance,
  })

  return {
    generatedAt,
    pageType,
    assetSource,
    schemaSource,
    generator,
    generatorMode: normalizedGenerationMode,
    runtimeFamily,
    assetGovernance,
    ...(generationStrategy
      ? {
          generationStrategy,
        }
      : {}),
    ...(normalizeGenerationDecision(generationDecision, normalizedGenerationMode)
      ? {
          generationDecision: normalizeGenerationDecision(
            generationDecision,
            normalizedGenerationMode
          ),
        }
      : {}),
    ...(referenceAsset && typeof referenceAsset === 'object' ? { referenceAsset } : {}),
    ...(officialRuntime ? { officialRuntime } : {}),
  }
}
