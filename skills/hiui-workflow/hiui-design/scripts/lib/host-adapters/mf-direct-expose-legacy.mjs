import path from 'node:path'
import { getManagedLocalRuntimeRoot } from '../managed-local-runtime-contract.mjs'

import {
  findModuleFederationConfigs,
  normalizeRelativePath as normalizeBusinessEntryRelativePath,
} from '../business-entry-evidence.mjs'

export const MF_DIRECT_EXPOSE_LEGACY_ADAPTER_KIND = 'mf-direct-expose-legacy'
export const MANAGED_MF_PUBLISH_ENTRY_SHELL_STYLE_IMPORT =
  `${getManagedLocalRuntimeRoot()}/styles.css`

const BUSINESS_ROOT_CANDIDATES = new Set(['src/views', 'src/pages', 'src/features'])

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeExposePublicName(value) {
  return normalizeString(value).replace(/^\.\//, '')
}

function normalizeRelativePath(value) {
  return normalizeBusinessEntryRelativePath(value).replace(/^\.\//, '')
}

function unique(values = []) {
  return [...new Set(values.map((value) => normalizeRelativePath(value)).filter(Boolean))]
}

function stripScriptModuleExtension(value) {
  return String(value || '').replace(/\.(?:[cm]?[jt]sx?)$/, '')
}

function normalizeStringArray(values) {
  return Array.isArray(values)
    ? [...new Set(values.map((value) => normalizeString(value)).filter(Boolean))]
    : []
}

function isModuleFederationEntryKind(kind = '') {
  return ['module-federation-exposes', 'module-federation-expose'].includes(
    normalizeString(kind)
  )
}

function isDirectExposePublishMechanism(value = '') {
  return ['module-federation-direct-expose', 'module-federation-single-expose'].includes(
    normalizeString(value)
  )
}

function getBusinessRootCandidate(relativePath) {
  const normalizedPath = normalizeRelativePath(relativePath)
  if (!normalizedPath) return ''

  const segments = normalizedPath.split('/').filter(Boolean)
  if (segments.length < 3 || segments[0] !== 'src') return ''

  const candidate = `${segments[0]}/${segments[1]}`
  return BUSINESS_ROOT_CANDIDATES.has(candidate) ? candidate : ''
}

function inferBusinessPageDirFromFormalNavigation(formalNavigation = {}) {
  const candidatePaths = [
    formalNavigation?.selectedLegacyMountEntryPath,
    formalNavigation?.selectedBusinessEntryPath,
    ...(Array.isArray(formalNavigation?.businessEntryEvidence)
      ? formalNavigation.businessEntryEvidence.flatMap((item) => [
          item?.sourcePath,
          item?.entryPath,
          item?.path,
          item?.featureBaseDir,
        ])
      : []),
  ]

  for (const candidatePath of candidatePaths) {
    const candidate = getBusinessRootCandidate(candidatePath)
    if (candidate) return candidate
  }

  return ''
}

function buildProjectAdapterBase({
  projectHostContract = null,
  generationReadiness = null,
  defaultBusinessPageDir = '',
} = {}) {
  const formalNavigation = generationReadiness?.formalNavigation || projectHostContract?.formalNavigation || {}
  const navigationMountAction = generationReadiness?.navigationMountAction || {}
  const publishConfigPath = normalizeRelativePath(
    navigationMountAction?.targetEntryPath ||
      formalNavigation?.selectedPublishEntryPath ||
      formalNavigation?.selectedBusinessEntryPath ||
      ''
  )
  const publishConfigKind = normalizeString(
    navigationMountAction?.targetEntryKind ||
      formalNavigation?.selectedPublishEntryKind ||
      formalNavigation?.selectedBusinessEntryKind
  )
  const hostFamily = normalizeString(projectHostContract?.hostFamily)
  const publishMechanism = normalizeString(projectHostContract?.publishMechanism)
  const adapterActive =
    hostFamily === MF_DIRECT_EXPOSE_LEGACY_ADAPTER_KIND ||
    isDirectExposePublishMechanism(publishMechanism) ||
    isModuleFederationEntryKind(publishConfigKind)

  if (!adapterActive) return null

  const resolvedDefaultBusinessPageDir =
    normalizeRelativePath(defaultBusinessPageDir) ||
    normalizeRelativePath(projectHostContract?.defaultBusinessPageDir) ||
    inferBusinessPageDirFromFormalNavigation(formalNavigation)
  const managedPublishEntryRequired =
    normalizeString(navigationMountAction?.action) === 'materialize-mf-publish-entry' ||
    (!generationReadiness &&
      normalizeString(projectHostContract?.mode) === 'rules-only' &&
      isDirectExposePublishMechanism(publishMechanism))
  const evidenceFiles = unique([
    publishConfigPath,
    formalNavigation?.selectedPublishEntryPath,
    formalNavigation?.selectedLegacyMountEntryPath,
    ...(Array.isArray(formalNavigation?.businessEntryEvidence)
      ? formalNavigation.businessEntryEvidence.flatMap((item) => [
          item?.path,
          item?.entryPath,
          item?.sourcePath,
        ])
      : []),
  ])

  return {
    kind: MF_DIRECT_EXPOSE_LEGACY_ADAPTER_KIND,
    enabled: true,
    projectScoped: true,
    pageSource: {
      defaultBusinessPageDir: resolvedDefaultBusinessPageDir,
      resolutionSource: resolvedDefaultBusinessPageDir
        ? normalizeRelativePath(projectHostContract?.defaultBusinessPageDir) ===
          resolvedDefaultBusinessPageDir
          ? 'project-host-contract-default-business-page-dir'
          : 'formal-navigation-business-entry-evidence'
        : 'unresolved',
    },
    publishEntry: {
      configPath: publishConfigPath,
      configKind: publishConfigKind,
      publishMechanism:
        publishMechanism ||
        (isModuleFederationEntryKind(publishConfigKind)
          ? 'module-federation-direct-expose'
          : ''),
      registrationMode: managedPublishEntryRequired
        ? 'manual-repoint-mf-expose'
        : 'manual-extend-mf-expose',
      managedPublishEntryRequired,
      shellStyleImport: managedPublishEntryRequired
        ? MANAGED_MF_PUBLISH_ENTRY_SHELL_STYLE_IMPORT
        : '',
    },
    evidenceFiles,
  }
}

export function buildProjectMfDirectExposeLegacyAdapter(options = {}) {
  return buildProjectAdapterBase(options)
}

export function inferManagedMfPublishEntryFileName({ preferredTemplatePath = '' } = {}) {
  const normalizedTemplatePath = normalizeRelativePath(preferredTemplatePath)
  const usesJavaScriptModule = /\.(?:jsx|js|mjs|cjs)$/.test(normalizedTemplatePath)
  return `mf-entry.${usesJavaScriptModule ? 'jsx' : 'tsx'}`
}

export function inferManagedMfPublishEntryRelativePath({
  targetBusinessPath = '',
  preferredTemplatePath = '',
} = {}) {
  const normalizedTargetBusinessPath = normalizeRelativePath(targetBusinessPath)
  const fileName = inferManagedMfPublishEntryFileName({ preferredTemplatePath })
  return normalizedTargetBusinessPath ? `${normalizedTargetBusinessPath}/${fileName}` : fileName
}

export function buildPageScopedMfDirectExposeLegacyAdapter({
  projectHostContract = null,
  projectAdapter = null,
  requestedBusiness = {},
  preferredTemplatePath = '',
  generationReadiness = null,
} = {}) {
  const baseAdapter =
    projectAdapter ||
    buildProjectAdapterBase({
      projectHostContract,
      generationReadiness,
      defaultBusinessPageDir: requestedBusiness?.defaultBusinessPageDir,
    })

  if (!baseAdapter?.enabled) return null

  const targetBusinessPath = normalizeRelativePath(
    requestedBusiness?.targetBusinessPath || requestedBusiness?.dest || ''
  )
  const managedPublishEntryFileName = inferManagedMfPublishEntryFileName({
    preferredTemplatePath,
  })
  const managedPublishEntryPath =
    baseAdapter.publishEntry?.managedPublishEntryRequired === true
      ? inferManagedMfPublishEntryRelativePath({
          targetBusinessPath,
          preferredTemplatePath,
        })
      : ''

  return {
    ...baseAdapter,
    projectScoped: false,
    pageSource: {
      ...baseAdapter.pageSource,
      rawDest: normalizeRelativePath(requestedBusiness?.rawDest || requestedBusiness?.dest || ''),
      targetBusinessPath,
    },
    publishEntry: {
      ...baseAdapter.publishEntry,
      managedPublishEntryFileName,
      managedPublishEntryPath,
    },
    separation: {
      pageSourceTargetPath: targetBusinessPath,
      publishConfigPath: normalizeRelativePath(baseAdapter.publishEntry?.configPath),
      managedPublishEntryPath,
    },
  }
}

export function normalizeMfExposeModulePath(value) {
  return stripScriptModuleExtension(normalizeRelativePath(value).replace(/^\.\//, '')).replace(
    /\/index$/,
    ''
  )
}

function extractRouteLeaf(value) {
  const normalized = normalizeString(value)
    .split(/[?#]/)[0]
    .replace(/\/+$/g, '')
  if (!normalized) return ''

  const segments = normalized.split('/').filter(Boolean)
  return segments.at(-1) || ''
}

function tokenizeMfExposeSelector(value) {
  return normalizeString(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

function hasTokenCoverage(requestedTokens, candidateTokens) {
  if (!Array.isArray(requestedTokens) || requestedTokens.length === 0) return false

  const normalizedCandidateTokens = new Set(
    normalizeStringArray(candidateTokens).map((token) => token.toLowerCase())
  )

  return requestedTokens.every((token) =>
    normalizedCandidateTokens.has(normalizeString(token).toLowerCase())
  )
}

function scoreModuleFederationExposeMatch(expose, requestedBusiness = {}, managedMfPublishEntry = null) {
  const publicName = normalizeExposePublicName(expose?.publicName)
  const sourcePath = normalizeMfExposeModulePath(expose?.sourcePath || '')
  const requestedRouteTokens = tokenizeMfExposeSelector(requestedBusiness?.routePath || '')
  const requestedRouteLeaf = normalizeMfExposeModulePath(extractRouteLeaf(requestedBusiness?.routePath || ''))
  const requestedRouteLeafTokens = tokenizeMfExposeSelector(requestedRouteLeaf)
  const requestedTitleTokens = tokenizeMfExposeSelector(requestedBusiness?.title || '')
  const requestedBusinessPath = normalizeMfExposeModulePath(
    requestedBusiness?.targetBusinessPath || requestedBusiness?.dest || ''
  )
  const managedPublishEntryPath = normalizeMfExposeModulePath(managedMfPublishEntry?.path || '')
  const candidateTokens = [
    ...tokenizeMfExposeSelector(publicName),
    ...tokenizeMfExposeSelector(sourcePath),
  ]

  let score = 0
  if (managedPublishEntryPath && sourcePath === managedPublishEntryPath) score += 120
  if (requestedBusinessPath && sourcePath === requestedBusinessPath) score += 100
  if (requestedRouteLeaf && normalizeMfExposeModulePath(publicName) === requestedRouteLeaf) score += 90
  if (
    requestedRouteLeafTokens.length > 0 &&
    hasTokenCoverage(requestedRouteLeafTokens, candidateTokens)
  ) {
    score += 70
  }
  if (requestedRouteTokens.length > 0 && hasTokenCoverage(requestedRouteTokens, candidateTokens)) score += 60
  if (requestedTitleTokens.length > 0 && hasTokenCoverage(requestedTitleTokens, candidateTokens)) score += 40
  return score
}

export async function resolveMfDirectExposeWiringState({
  targetRoot,
  requestedBusiness = {},
  managedMfPublishEntry = null,
  hostExecutionAdapter = null,
} = {}) {
  const publishConfigPath = normalizeRelativePath(hostExecutionAdapter?.publishEntry?.configPath || '')
  if (!publishConfigPath) {
    return {
      mfExposeTargetPath: '',
      mfExposeUsesManagedPublishEntry: false,
      matchedExposeName: '',
    }
  }

  const moduleFederationConfigs = await findModuleFederationConfigs(targetRoot)
  const matchingConfig = moduleFederationConfigs.find(
    (config) => normalizeRelativePath(config.relativePath) === publishConfigPath
  )
  const exposes = Array.isArray(matchingConfig?.exposes) ? matchingConfig.exposes : []
  if (exposes.length === 0) {
    return {
      mfExposeTargetPath: '',
      mfExposeUsesManagedPublishEntry: false,
      matchedExposeName: '',
    }
  }

  const rankedExposes = exposes
    .map((expose) => ({
      expose,
      score: scoreModuleFederationExposeMatch(
        expose,
        requestedBusiness,
        managedMfPublishEntry
      ),
    }))
    .sort((left, right) => right.score - left.score)

  const selectedExpose =
    rankedExposes[0]?.score > 0
      ? rankedExposes[0].expose
      : exposes.length === 1
        ? exposes[0]
        : null

  const mfExposeTargetPath = normalizeRelativePath(selectedExpose?.sourcePath || '').replace(
    /^\.\//,
    ''
  )
  return {
    mfExposeTargetPath,
    mfExposeUsesManagedPublishEntry:
      Boolean(mfExposeTargetPath) &&
      normalizeMfExposeModulePath(mfExposeTargetPath) ===
        normalizeMfExposeModulePath(managedMfPublishEntry?.path || ''),
    matchedExposeName: normalizeExposePublicName(selectedExpose?.publicName),
  }
}
