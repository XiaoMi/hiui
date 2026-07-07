import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { buildProjectCapabilities } from './asset-control-surface.mjs'
import { detectHostProfile } from './detect-host-profile.mjs'
import { detectLegacyHostFamily } from './legacy-host-family-registry.mjs'
import {
  runtimeAdapterProofForComponent,
} from './legacy-page-component-bridge.mjs'
import {
  isPageComponentCertified,
  listPageComponentsForModeAndPageType,
  loadPageComponentCertification,
  loadPageComponentRegistry,
  supportedModesForPageComponent,
} from './page-component-registry.mjs'
import { validateProjectCertifiedCarriers } from './project-integration-state.mjs'
import { resolveRuntimeBridgeProfileForComponent } from './runtime-bridge-profile-registry.mjs'

const HOST_PROFILE_FINGERPRINT_PATHS = [
  'package.json',
  'src',
  'vite.config.ts',
  'vite.config.tsx',
  'vite.config.mts',
  'vite.config.js',
  'vite.config.jsx',
  'vite.config.mjs',
  'vite.config.cjs',
  'vite.config.cts',
  'next.config.ts',
  'next.config.js',
  'next.config.mjs',
  'next.config.cjs',
  '.umirc.ts',
  '.umirc.js',
  'config/config.ts',
  'config/config.js',
  'app/layout.tsx',
  'app/layout.ts',
  'src/app/layout.tsx',
  'src/app/layout.ts',
  'pages/_app.tsx',
  'pages/_app.ts',
  'src/pages/_app.tsx',
  'src/pages/_app.ts',
  'src/app.tsx',
  'src/app.ts',
  'src/layouts',
  'src/pages',
  'src/router',
]

const LEGACY_HOST_FINGERPRINT_PATHS = [
  'package.json',
  'src',
  'build',
  '.local-context/hiui-design/outputs/project-mode.json',
  '.local-context/hiui-design/outputs/legacy-host-boundary.json',
]

const PROJECT_CAPABILITIES_FINGERPRINT_PATHS = [
  'package.json',
  'src',
  'src/pages',
  'src/views',
  'src/router',
  'src/routes.tsx',
  'src/routes.ts',
  'src/routes.jsx',
  'src/translation',
  'src/i18n',
  'src/locales',
  '.local-context/hiui-design/outputs/project-mode.json',
  '.local-context/hiui-design/outputs/project-page-component-registry.json',
]

const PROJECT_CARRIER_REALIZATION_FINGERPRINT_PATHS = [
  '.local-context/hiui-design/outputs/project-page-component-registry.json',
  '.local-context/hiui-design/outputs/page-component-certifications',
  'src/typical-page-reuse/components',
]

const PROJECT_TYPICAL_PAGE_SUPPORT_FINGERPRINT_PATHS = [
  '.local-context/hiui-design/outputs/project-page-component-registry.json',
  '.local-context/hiui-design/outputs/page-component-certifications',
  'src/typical-page-reuse/components',
  '.local-context/hiui-design/outputs/legacy-host-boundary.json',
]

const PROJECT_LEGACY_DELIVERY_POLICY_FINGERPRINT_PATHS = [
  ...PROJECT_TYPICAL_PAGE_SUPPORT_FINGERPRINT_PATHS,
  '.local-context/hiui-design/outputs/project-integration-state.json',
]

const PROJECT_LEGACY_STYLE_BOUNDARY_FINGERPRINT_PATHS = [
  'package.json',
  'pnpm-lock.yaml',
  'src',
  'src/styles',
  'src/index.scss',
  'src/index.css',
  'src/app.scss',
  'src/app.css',
  '.local-context/hiui-design/outputs/legacy-host-boundary.json',
  'node_modules/@hi-ui/query-filter',
  'node_modules/@hi-ui/input',
  'node_modules/hiui5',
]

const PROJECT_FACTS_SCHEMA_VERSION = 'project-fact-cache.v1'
const LEGACY_PAGE_TYPE_DELIVERY_POLICY_RULES_RELATIVE_PATH = 'rules/legacy-page-type-delivery-policy.json'
const LEGACY_PAGE_TYPE_DELIVERY_POLICY_OUTPUT_TEMPLATE =
  '.local-context/hiui-design/outputs/page-type-delivery-policy.%MODE%.json'
const requireForProjectFacts = createRequire(import.meta.url)

function normalizeModeKey(modeOverride = '') {
  const value = String(modeOverride || '').trim()
  if (!value || value === 'auto') {
    return 'auto'
  }
  return value
}

function resolveFactModeId(modeOverride = '') {
  const modeKey = normalizeModeKey(modeOverride)
  return modeKey === 'auto' ? '' : modeKey
}

function uniqueValues(values = []) {
  return Array.from(new Set(values.filter(Boolean)))
}

function normalizePathForFact(value = '') {
  return String(value || '').replace(/\\/g, '/')
}

function releaseTrackForVersion(version = '') {
  const normalizedVersion = String(version || '').trim()
  const trackMatch = normalizedVersion.match(/-(alpha|beta|canary|experimental|rc)(?:[.-]\d+)?/i)

  return trackMatch ? trackMatch[1].toLowerCase() : normalizedVersion ? 'stable' : ''
}

function packageJsonPathForResolvedEntry(resolvedEntryPath = '') {
  if (!resolvedEntryPath) {
    return ''
  }

  const normalizedPath = normalizePathForFact(resolvedEntryPath)
  const nodeModulesToken = '/node_modules/'
  const nodeModulesIndex = normalizedPath.lastIndexOf(nodeModulesToken)

  if (nodeModulesIndex < 0) {
    return ''
  }

  const packageStart = nodeModulesIndex + nodeModulesToken.length
  const packageSegments = normalizedPath.slice(packageStart).split('/')
  const packageName = packageSegments[0]?.startsWith('@')
    ? packageSegments.slice(0, 2).join('/')
    : packageSegments[0]

  if (!packageName) {
    return ''
  }

  return path.join(
    normalizedPath.slice(0, nodeModulesIndex + nodeModulesToken.length),
    packageName,
    'package.json'
  )
}

async function pathStamp(targetPath) {
  try {
    const stat = await fs.stat(targetPath)
    return {
      exists: true,
      kind: stat.isDirectory() ? 'directory' : 'file',
      mtimeMs: Math.trunc(stat.mtimeMs),
      size: stat.isFile() ? stat.size : 0,
    }
  } catch {
    return {
      exists: false,
      kind: 'missing',
      mtimeMs: 0,
      size: 0,
    }
  }
}

async function buildFingerprint(targetRoot, fingerprintPaths = []) {
  const entries = {}
  for (const rawPath of Array.from(new Set(fingerprintPaths.filter(Boolean)))) {
    const absolutePath = path.isAbsolute(rawPath) ? rawPath : path.join(targetRoot, rawPath)
    const label = path.isAbsolute(rawPath) ? rawPath : rawPath.replace(/\\/g, '/')
    entries[label] = await pathStamp(absolutePath)
  }
  return entries
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return null
  }
}

async function readTextIfExists(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch {
    return ''
  }
}

async function cacheRootExists(targetRoot) {
  try {
    const stat = await fs.stat(path.join(targetRoot, '.local-context', 'hiui-design'))
    return stat.isDirectory()
  } catch {
    return false
  }
}

async function writeDerivedOutput(targetRoot, relativePath, payload) {
  const filePath = path.join(targetRoot, relativePath)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

function resolvePackageEntryFromRoot(targetRoot, packageName, fromDir = targetRoot) {
  try {
    return requireForProjectFacts.resolve(packageName, { paths: [fromDir, targetRoot] })
  } catch {
    return ''
  }
}

async function loadInstalledPackageInfo(targetRoot, packageName, fromDir = targetRoot) {
  const resolvedEntryPath = resolvePackageEntryFromRoot(targetRoot, packageName, fromDir)
  const packageJsonPath = packageJsonPathForResolvedEntry(resolvedEntryPath)

  if (!resolvedEntryPath || !packageJsonPath) {
    return {
      packageName,
      version: '',
      releaseTrack: '',
      resolvedEntryPath: '',
      packageJsonPath: '',
      packageDir: '',
      found: false,
    }
  }

  const packageJson = await readJsonIfExists(packageJsonPath)
  const packageDir = packageJsonPath ? path.dirname(packageJsonPath) : ''
  const version = String(packageJson?.version || '').trim()

  return {
    packageName,
    version,
    releaseTrack: releaseTrackForVersion(version),
    resolvedEntryPath: normalizePathForFact(resolvedEntryPath),
    packageJsonPath: normalizePathForFact(packageJsonPath),
    packageDir: normalizePathForFact(packageDir),
    found: Boolean(packageJson),
  }
}

async function listFilesRecursively(rootPath) {
  try {
    const entries = await fs.readdir(rootPath, { withFileTypes: true })
    const nested = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(rootPath, entry.name)
        if (entry.isDirectory()) {
          return listFilesRecursively(entryPath)
        }
        return [entryPath]
      })
    )
    return nested.flat()
  } catch {
    return []
  }
}

async function collectGlobalStyleFiles(targetRoot) {
  const candidatePaths = [
    'src/index.scss',
    'src/index.css',
    'src/app.scss',
    'src/app.css',
    'src/styles/global.scss',
    'src/styles/global.css',
    'src/styles/index.scss',
    'src/styles/index.css',
  ]
  const collected = new Set()

  for (const candidatePath of candidatePaths) {
    const absolutePath = path.join(targetRoot, candidatePath)
    const stat = await pathStamp(absolutePath)
    if (stat.exists && stat.kind === 'file') {
      collected.add(absolutePath)
    }
  }

  const stylesRoot = path.join(targetRoot, 'src', 'styles')
  const styleFiles = await listFilesRecursively(stylesRoot)
  styleFiles
    .filter((entryPath) => /\.(css|scss|sass|less)$/i.test(entryPath) && !/\.module\./i.test(entryPath))
    .forEach((entryPath) => collected.add(entryPath))

  return Array.from(collected)
}

function detectGlobalInputOverrideSnippets(styleSource = '') {
  const source = String(styleSource || '')
  const patterns = [
    /\.hi-v5-input(?:__inner|--appearance-filled|\b)/g,
    /\.hi-v5-query-filter-search-input/g,
    /\.hi-v5-query-filter-form/g,
  ]
  const matches = []

  for (const pattern of patterns) {
    matches.push(...Array.from(source.matchAll(pattern), (match) => match[0]))
  }

  return uniqueValues(matches).slice(0, 6)
}

function cacheFilePath(targetRoot, factId, modeKey = '') {
  const fileName = modeKey && modeKey !== 'auto' ? `${factId}.${modeKey}.json` : `${factId}.json`
  return path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'project-facts', fileName)
}

async function loadCachedProjectFact({
  targetRoot,
  factId,
  modeKey = '',
  fingerprintPaths = [],
  compute,
}) {
  const fingerprint = await buildFingerprint(targetRoot, fingerprintPaths)
  const usePersistentCache = await cacheRootExists(targetRoot)
  const cachePath = cacheFilePath(targetRoot, factId, modeKey)

  if (usePersistentCache) {
    const cached = await readJsonIfExists(cachePath)
    if (
      cached?.schemaVersion === PROJECT_FACTS_SCHEMA_VERSION &&
      JSON.stringify(cached.fingerprint || {}) === JSON.stringify(fingerprint)
    ) {
      return cached.payload
    }
  }

  const payload = await compute()

  if (usePersistentCache) {
    await fs.mkdir(path.dirname(cachePath), { recursive: true })
    await fs.writeFile(
      cachePath,
      `${JSON.stringify(
        {
          schemaVersion: PROJECT_FACTS_SCHEMA_VERSION,
          factId,
          modeKey,
          fingerprint,
          payload,
        },
        null,
        2
      )}\n`,
      'utf8'
    )
  }

  return payload
}

export async function loadHostProfileFact({ targetRoot, options = {} }) {
  return loadCachedProjectFact({
    targetRoot,
    factId: 'host-profile',
    fingerprintPaths: HOST_PROFILE_FINGERPRINT_PATHS,
    compute: () => detectHostProfile(targetRoot, options),
  })
}

export async function loadLegacyHostFamilyFact({ targetRoot, skillRoot, modeOverride = '' }) {
  const modeKey = normalizeModeKey(modeOverride)
  return loadCachedProjectFact({
    targetRoot,
    factId: 'legacy-host-family',
    modeKey,
    fingerprintPaths: LEGACY_HOST_FINGERPRINT_PATHS,
    compute: () => detectLegacyHostFamily({ targetRoot, skillRoot, modeOverride }),
  })
}

export async function loadProjectCapabilitiesFact({
  targetRoot,
  skillRoot,
  modeOverride = '',
  legacyHostFamily = null,
}) {
  const modeKey = normalizeModeKey(modeOverride)
  const fingerprintPaths = [
    ...PROJECT_CAPABILITIES_FINGERPRINT_PATHS,
    path.join(skillRoot, 'rules', 'page-mold-registry.json'),
    path.join(skillRoot, 'rules', 'adapter-registry.json'),
    path.join(skillRoot, 'rules', 'page-component-registry.json'),
    path.join(skillRoot, 'rules', 'common.page-types.json'),
  ]

  return loadCachedProjectFact({
    targetRoot,
    factId: 'project-capabilities',
    modeKey,
    fingerprintPaths,
    compute: () =>
      buildProjectCapabilities({
        targetRoot,
        skillRoot,
        modeOverride,
        legacyHostFamilyOverride: legacyHostFamily,
      }),
  })
}

function isProjectOverlayComponent(component) {
  return component?.__registryKind === 'project-overlay'
}

function summarizeCarrierRealizationEntry(result = null) {
  const issues = Array.isArray(result?.issues) ? result.issues : []
  return {
    componentId: String(result?.componentId || '').trim(),
    pageTypeId: String(result?.pageTypeId || '').trim(),
    status: String(result?.status || 'blocked').trim() || 'blocked',
    issueCount: issues.length,
    blockingReasons: issues.map((issue) => issue?.message).filter(Boolean),
    issues,
  }
}

export async function loadProjectCarrierRealizationFact({
  targetRoot,
  skillRoot,
  modeOverride = '',
}) {
  const modeKey = normalizeModeKey(modeOverride)
  const effectiveMode = resolveFactModeId(modeOverride)
  const fingerprintPaths = [
    ...PROJECT_CARRIER_REALIZATION_FINGERPRINT_PATHS,
    path.join(skillRoot, 'rules', 'page-component-registry.json'),
  ]

  return loadCachedProjectFact({
    targetRoot,
    factId: 'project-carrier-realization',
    modeKey,
    fingerprintPaths,
    compute: async () => {
      const validation = await validateProjectCertifiedCarriers({ targetRoot })
      const components = Array.isArray(validation?.components)
        ? validation.components.map(summarizeCarrierRealizationEntry)
        : []

      const filteredComponents = effectiveMode
        ? components.filter((component) => {
            const projectComponent = loadPageComponentRegistry({ skillRoot, targetRoot }).byComponentId.get(
              component.componentId
            )
            return supportedModesForPageComponent(projectComponent).includes(effectiveMode)
          })
        : components

      const readyPageTypeIds = uniqueValues(
        filteredComponents.filter((component) => component.status === 'ready').map((component) => component.pageTypeId)
      ).sort()
      const blockedPageTypeIds = uniqueValues(
        filteredComponents.filter((component) => component.status === 'blocked').map((component) => component.pageTypeId)
      ).sort()

      return {
        schemaVersion: 'project-carrier-realization.v1',
        mode: effectiveMode || modeKey,
        status: filteredComponents.length === 0
          ? 'not-applicable'
          : filteredComponents.some((component) => component.status === 'blocked')
            ? 'blocked'
            : 'ready',
        source: validation?.registryPath || '.local-context/hiui-design/outputs/project-page-component-registry.json',
        checkedComponentCount: filteredComponents.length,
        readyComponentCount: filteredComponents.filter((component) => component.status === 'ready').length,
        blockedComponentCount: filteredComponents.filter((component) => component.status === 'blocked').length,
        readyPageTypeIds,
        blockedPageTypeIds,
        enforcement: {
          deliverySemantics: 'page-component',
          deliveryPath: 'page-component-plus-slot-fill',
          projectCarrierRole: 'prefer-project-certified-carrier-when-ready',
        },
        components: filteredComponents,
        blockingReasons: filteredComponents.flatMap((component) => component.blockingReasons || []),
      }
    },
  })
}

function summarizeRuntimeBridgeRequirement({
  component,
  legacyHostFamily = null,
  mode,
  skillRoot,
  targetRoot,
}) {
  if (mode !== 'legacy-host-compatible') {
    return {
      required: false,
      status: 'not-applicable',
      profileId: '',
      blockingReasons: [],
    }
  }

  const profile = resolveRuntimeBridgeProfileForComponent({
    componentId: component.componentId,
    skillRoot,
    targetRoot,
  })
  const adapterProof = runtimeAdapterProofForComponent({
    component,
    legacyHostFamily,
    mode,
    skillRoot,
  })
  const adapterBlockingReasons = []

  if (adapterProof?.status === 'blocked') {
    adapterBlockingReasons.push(String(adapterProof.reason || 'legacy runtime adapter proof is blocked').trim())
    if (Array.isArray(adapterProof.missingCapabilities) && adapterProof.missingCapabilities.length > 0) {
      adapterBlockingReasons.push(
        `legacy runtime adapter ${adapterProof.adapterId || '(missing)'} is missing capabilities: ${adapterProof.missingCapabilities.join(', ')}`
      )
    }
  }

  const blockingReasons = uniqueValues([
    ...(profile?.status === 'available'
      ? []
      : [String(profile?.reason || 'runtime bridge profile is blocked').trim()].filter(Boolean)),
    ...adapterBlockingReasons,
  ])

  return {
    required: true,
    status:
      profile?.status === 'available' && adapterProof?.status === 'available'
        ? 'ready'
        : 'blocked',
    profileId: String(profile?.profileId || '').trim(),
    deliveryMode: String(profile?.deliveryMode || '').trim(),
    adapterProof: adapterProof
      ? {
          required: Boolean(adapterProof.required),
          status: String(adapterProof.status || '').trim() || 'blocked',
          kind: String(adapterProof.kind || '').trim(),
          adapterId: String(adapterProof.adapterId || '').trim(),
          responsibility: String(adapterProof.responsibility || '').trim(),
          reason: String(adapterProof.reason || '').trim(),
          missingCapabilities: Array.isArray(adapterProof.missingCapabilities)
            ? adapterProof.missingCapabilities.map((capability) => String(capability || '').trim()).filter(Boolean)
            : [],
        }
      : null,
    blockingReasons,
  }
}

function evaluateCandidateSupport({
  component,
  legacyHostFamily = null,
  certification,
  mode,
  skillRoot,
  targetRoot,
  carrierRealizationByComponentId,
}) {
  const candidateKind = isProjectOverlayComponent(component)
    ? 'project-certified-carrier'
    : 'direct-standard-component'
  const certified = isPageComponentCertified(component, certification)

  if (!certified) {
    return {
      status: 'blocked',
      candidateKind,
      componentId: component.componentId,
      pageTypeId: component.pageTypeId,
      blockingReasons: [
        isProjectOverlayComponent(component)
          ? `${component.componentId} project carrier is not fully certified`
          : `${component.componentId} standard page component is not fully certified`,
      ],
      runtimeBridge: {
        required: mode === 'legacy-host-compatible',
        status: mode === 'legacy-host-compatible' ? 'blocked' : 'not-applicable',
        profileId: '',
        blockingReasons: mode === 'legacy-host-compatible'
          ? ['runtime bridge cannot be resolved until the page component certification is valid']
          : [],
      },
    }
  }

  const runtimeBridge = summarizeRuntimeBridgeRequirement({
    component,
    legacyHostFamily,
    mode,
    skillRoot,
    targetRoot,
  })

  if (isProjectOverlayComponent(component)) {
    const realization = carrierRealizationByComponentId.get(component.componentId)
    const blockingReasons = [
      ...(realization?.blockingReasons || []),
      ...runtimeBridge.blockingReasons,
    ]

    return {
      status:
        realization?.status === 'ready' && runtimeBridge.status !== 'blocked'
          ? 'ready'
          : 'blocked',
      candidateKind,
      componentId: component.componentId,
      pageTypeId: component.pageTypeId,
      blockingReasons,
      runtimeBridge,
      carrierRealization: realization || {
        componentId: component.componentId,
        pageTypeId: component.pageTypeId,
        status: 'blocked',
        issueCount: 1,
        blockingReasons: [`${component.componentId} is missing project carrier realization evidence`],
        issues: [],
      },
    }
  }

  return {
    status: runtimeBridge.status === 'blocked' ? 'blocked' : 'ready',
    candidateKind,
    componentId: component.componentId,
    pageTypeId: component.pageTypeId,
    blockingReasons: runtimeBridge.blockingReasons,
    runtimeBridge,
  }
}

function selectSupportedCandidate(candidates = []) {
  return candidates.find((candidate) => candidate.status === 'ready') || null
}

function summarizePageTypeSupport({
  mode,
  pageTypeId,
  candidates,
  legacyHostFamily = null,
  skillRoot,
  targetRoot,
  carrierRealizationByComponentId,
}) {
  const evaluatedCandidates = candidates.map((component) =>
    evaluateCandidateSupport({
      component,
      legacyHostFamily,
      certification: loadPageComponentCertification(component, { skillRoot }),
      mode,
      skillRoot,
      targetRoot,
      carrierRealizationByComponentId,
    })
  )
  const selectedCandidate = selectSupportedCandidate(evaluatedCandidates)
  const projectCarrier = evaluatedCandidates.find(
    (candidate) => candidate.candidateKind === 'project-certified-carrier'
  ) || null
  const standardComponent = evaluatedCandidates.find(
    (candidate) => candidate.candidateKind === 'direct-standard-component'
  ) || null

  return {
    pageTypeId,
    semantics: 'page-component',
    deliveryPath: 'page-component-plus-slot-fill',
    enforcement: 'force-page-component-when-supported',
    supportStatus: selectedCandidate
      ? 'ready'
      : evaluatedCandidates.length > 0
        ? 'blocked'
        : 'unsupported',
    selectedDeliveryKind: selectedCandidate?.candidateKind || '',
    selectedComponentId: selectedCandidate?.componentId || '',
    selectedSource: selectedCandidate
      ? selectedCandidate.candidateKind === 'project-certified-carrier'
        ? 'project-overlay'
        : 'skill-global'
      : '',
    projectCarrier: projectCarrier
      ? {
          status: projectCarrier.status,
          componentId: projectCarrier.componentId,
          blockingReasons: projectCarrier.blockingReasons,
          runtimeBridge: projectCarrier.runtimeBridge,
        }
      : {
          status: 'missing',
          componentId: '',
          blockingReasons: [],
          runtimeBridge: {
            required: mode === 'legacy-host-compatible',
            status: mode === 'legacy-host-compatible' ? 'blocked' : 'not-applicable',
            profileId: '',
            blockingReasons: [],
          },
        },
    standardComponent: standardComponent
      ? {
          status: standardComponent.status,
          componentId: standardComponent.componentId,
          blockingReasons: standardComponent.blockingReasons,
          runtimeBridge: standardComponent.runtimeBridge,
        }
      : {
          status: 'missing',
          componentId: '',
          blockingReasons: [],
          runtimeBridge: {
            required: mode === 'legacy-host-compatible',
            status: mode === 'legacy-host-compatible' ? 'blocked' : 'not-applicable',
            profileId: '',
            blockingReasons: [],
          },
        },
    blockingReasons: uniqueValues(evaluatedCandidates.flatMap((candidate) => candidate.blockingReasons || [])),
    candidates: evaluatedCandidates.map((candidate) => ({
      kind: candidate.candidateKind,
      status: candidate.status,
      componentId: candidate.componentId,
      runtimeBridge: candidate.runtimeBridge,
      blockingReasons: candidate.blockingReasons,
    })),
  }
}

export async function loadProjectTypicalPageSupportFact({
  targetRoot,
  skillRoot,
  modeOverride = '',
  legacyHostFamily = null,
  projectCarrierRealization = null,
}) {
  const modeKey = normalizeModeKey(modeOverride)
  const effectiveMode = resolveFactModeId(modeOverride)
  const fingerprintPaths = [
    ...PROJECT_TYPICAL_PAGE_SUPPORT_FINGERPRINT_PATHS,
    path.join(skillRoot, 'rules', 'page-component-registry.json'),
    path.join(skillRoot, 'rules', 'page-component-certifications'),
    path.join(skillRoot, 'rules', 'runtime-bridged-component-matrix.json'),
    path.join(skillRoot, 'rules', 'adapter-registry.json'),
  ]

  return loadCachedProjectFact({
    targetRoot,
    factId: 'project-typical-page-support',
    modeKey,
    fingerprintPaths,
    compute: async () => {
      const resolvedLegacyHostFamily =
        effectiveMode === 'legacy-host-compatible'
          ? legacyHostFamily ||
            await loadLegacyHostFamilyFact({
              targetRoot,
              skillRoot,
              modeOverride: effectiveMode,
            })
          : null
      const carrierRealization = projectCarrierRealization ||
        await loadProjectCarrierRealizationFact({
          targetRoot,
          skillRoot,
          modeOverride,
        })
      const carrierRealizationByComponentId = new Map(
        (carrierRealization?.components || []).map((component) => [component.componentId, component])
      )
      const registry = loadPageComponentRegistry({ skillRoot, targetRoot })
      const pageTypeIds = effectiveMode
        ? uniqueValues(
            registry.components
              .filter((component) => supportedModesForPageComponent(component).includes(effectiveMode))
              .map((component) => component.pageTypeId)
          ).sort()
        : []
      const pageTypes = pageTypeIds.map((pageTypeId) =>
        summarizePageTypeSupport({
          mode: effectiveMode,
          pageTypeId,
          candidates: listPageComponentsForModeAndPageType({
            mode: effectiveMode,
            pageTypeId,
            skillRoot,
            targetRoot,
          }),
          legacyHostFamily: resolvedLegacyHostFamily,
          skillRoot,
          targetRoot,
          carrierRealizationByComponentId,
        })
      )

      return {
        schemaVersion: 'project-typical-page-support.v1',
        mode: effectiveMode || modeKey,
        status: pageTypes.length === 0
          ? 'not-applicable'
          : pageTypes.some((pageType) => pageType.supportStatus === 'blocked')
            ? 'blocked'
            : 'ready',
        source: 'page-component-registry',
        enforcement: {
          deliverySemantics: 'page-component',
          deliveryPath: 'page-component-plus-slot-fill',
          fallbackPolicy: 'block-before-business-shell-fallback',
          selectionOrder: ['project-certified-carrier', 'direct-standard-component'],
        },
        readyPageTypeIds: pageTypes
          .filter((pageType) => pageType.supportStatus === 'ready')
          .map((pageType) => pageType.pageTypeId),
        blockedPageTypeIds: pageTypes
          .filter((pageType) => pageType.supportStatus === 'blocked')
          .map((pageType) => pageType.pageTypeId),
        unsupportedPageTypeIds: pageTypes
          .filter((pageType) => pageType.supportStatus === 'unsupported')
          .map((pageType) => pageType.pageTypeId),
        pageTypes,
      }
    },
  })
}

export async function loadLegacyStyleBoundaryFact({
  targetRoot,
  modeOverride = '',
}) {
  const modeKey = normalizeModeKey(modeOverride)
  const effectiveMode = resolveFactModeId(modeOverride)

  return loadCachedProjectFact({
    targetRoot,
    factId: 'legacy-style-boundary',
    modeKey,
    fingerprintPaths: PROJECT_LEGACY_STYLE_BOUNDARY_FINGERPRINT_PATHS,
    compute: async () => {
      if (effectiveMode !== 'legacy-host-compatible') {
        return {
          schemaVersion: 'legacy-style-boundary.v1',
          mode: effectiveMode || modeKey,
          factPath: `.local-context/hiui-design/outputs/project-facts/legacy-style-boundary.${modeKey || 'auto'}.json`,
          status: 'not-applicable',
          riskLevel: 'low',
          riskSignals: [],
          packageVersions: {},
          packageResolution: {},
          styleBoundary: {},
          globalStyleOverrides: [],
          blockingReasons: [],
        }
      }

      const legacyBoundaryPath = path.join(
        targetRoot,
        '.local-context',
        'hiui-design',
        'outputs',
        'legacy-host-boundary.json'
      )
      const legacyBoundary = await readJsonIfExists(legacyBoundaryPath)
      const rootPackageJson = await readJsonIfExists(path.join(targetRoot, 'package.json'))
      const declaredHiui5Version = String(
        rootPackageJson?.dependencies?.hiui5 || rootPackageJson?.devDependencies?.hiui5 || ''
      ).trim()
      const hiui5Info = await loadInstalledPackageInfo(targetRoot, 'hiui5')
      const queryFilterInfo = await loadInstalledPackageInfo(targetRoot, '@hi-ui/query-filter')
      const inputInfo = queryFilterInfo.packageDir
        ? await loadInstalledPackageInfo(targetRoot, '@hi-ui/input', queryFilterInfo.packageDir)
        : await loadInstalledPackageInfo(targetRoot, '@hi-ui/input')
      const queryFilterEntrySource = queryFilterInfo.resolvedEntryPath
        ? await readTextIfExists(queryFilterInfo.resolvedEntryPath)
        : ''
      const queryFilterStyleImportDetected = /styles\/index\.scss\.js/.test(queryFilterEntrySource)
      const queryFilterStyleEntryPath = queryFilterInfo.resolvedEntryPath
        ? normalizePathForFact(
            path.join(path.dirname(queryFilterInfo.resolvedEntryPath), 'styles', 'index.scss.js')
          )
        : ''
      const queryFilterStyleSource = queryFilterStyleEntryPath
        ? await readTextIfExists(queryFilterStyleEntryPath)
        : ''
      const searchInputFilledSkinAvailable =
        /query-filter-search-input/.test(queryFilterStyleSource) &&
        /appearance-filled/.test(queryFilterStyleSource)
      const styleFiles = await collectGlobalStyleFiles(targetRoot)
      const globalOverrideEntries = []

      for (const styleFilePath of styleFiles) {
        const styleSource = await readTextIfExists(styleFilePath)
        const overrideSnippets = detectGlobalInputOverrideSnippets(styleSource)

        if (overrideSnippets.length > 0) {
          globalOverrideEntries.push({
            file: normalizePathForFact(path.relative(targetRoot, styleFilePath)),
            selectors: overrideSnippets,
          })
        }
      }

      const releaseTracks = uniqueValues([
        releaseTrackForVersion(declaredHiui5Version),
        hiui5Info.releaseTrack,
        queryFilterInfo.releaseTrack,
        inputInfo.releaseTrack,
      ]).filter(Boolean)
      const inputPackageResolutionAligned = Boolean(
        hiui5Info.version &&
        queryFilterInfo.version &&
        inputInfo.version &&
        releaseTracks.length <= 1
      )
      const queryFilterCssLoadedRisk =
        !queryFilterInfo.found || !queryFilterStyleImportDetected || !searchInputFilledSkinAvailable
      const hostGlobalInputOverrideRisk = globalOverrideEntries.length > 0
      const riskSignals = []

      if (!queryFilterInfo.found) {
        riskSignals.push('@hi-ui/query-filter package is missing or unresolved from target root')
      }

      if (!inputInfo.found) {
        riskSignals.push('@hi-ui/input package is missing or unresolved from query-filter context')
      }

      if (
        queryFilterInfo.found &&
        inputInfo.found &&
        hiui5Info.found &&
        !inputPackageResolutionAligned
      ) {
        riskSignals.push(
          `HiUI package release tracks are not aligned (declared hiui5=${releaseTrackForVersion(
            declaredHiui5Version
          ) || '(missing)'}, resolved hiui5=${hiui5Info.releaseTrack || '(missing)'}, query-filter=${
            queryFilterInfo.releaseTrack || '(missing)'
          }, input=${inputInfo.releaseTrack || '(missing)'})`
        )
      }

      if (!queryFilterStyleImportDetected) {
        riskSignals.push('@hi-ui/query-filter entry does not expose its style side-effect import')
      }

      if (!searchInputFilledSkinAvailable) {
        riskSignals.push('@hi-ui/query-filter styles do not expose the filled search-input skin rule')
      }

      if (hostGlobalInputOverrideRisk) {
        riskSignals.push(
          `global style files directly target hi-v5 input/query-filter selectors (${globalOverrideEntries
            .map((entry) => entry.file)
            .join(', ')})`
        )
      }

      return {
        schemaVersion: 'legacy-style-boundary.v1',
        mode: effectiveMode || modeKey,
        factPath: `.local-context/hiui-design/outputs/project-facts/legacy-style-boundary.${modeKey || 'auto'}.json`,
        status: riskSignals.length > 0 ? 'risk' : 'ready',
        riskLevel: riskSignals.length > 0 ? 'high' : 'low',
        riskSignals,
        packageVersions: {
          declaredHiui5Version,
          resolvedHiui5Version: hiui5Info.version,
          queryFilterVersion: queryFilterInfo.version,
          inputVersion: inputInfo.version,
        },
        packageResolution: {
          hiui5EntryPath: hiui5Info.resolvedEntryPath,
          queryFilterEntryPath: queryFilterInfo.resolvedEntryPath,
          queryFilterResolvesInputPath: inputInfo.resolvedEntryPath,
          inputPackageResolutionAligned,
          releaseTracks,
        },
        styleBoundary: {
          boundaryStatus: String(legacyBoundary?.styleBoundary?.status || '').trim() || 'missing',
          queryFilterStyleImportDetected,
          queryFilterStyleEntryPath,
          searchInputFilledSkinAvailable,
          queryFilterCssLoadedRisk,
          hostGlobalInputOverrideRisk,
        },
        globalStyleOverrides: globalOverrideEntries,
        blockingReasons: [],
      }
    },
  })
}

function normalizeLegacyDeliveryPolicyId(value) {
  const policyId = String(value || '').trim()
  if (
    [
      'direct-standard-allowed',
      'carrier-first-required',
      'managed-analytics-only',
      'explicit-fallback-only',
    ].includes(policyId)
  ) {
    return policyId
  }
  return ''
}

function outputPathForLegacyDeliveryPolicy(modeKey = '') {
  const normalizedMode = String(modeKey || '').trim() || 'legacy-host-compatible'
  return LEGACY_PAGE_TYPE_DELIVERY_POLICY_OUTPUT_TEMPLATE.replace('%MODE%', normalizedMode)
}

function summarizeLegacyDeliveryPolicyEntry({
  mode,
  pageTypeId,
  deliveryPolicy,
  reason = '',
  supportEntry = null,
}) {
  const selectedDeliveryKind = String(supportEntry?.selectedDeliveryKind || '').trim()
  const selectedComponentId = String(supportEntry?.selectedComponentId || '').trim()
  const projectCarrierStatus = String(supportEntry?.projectCarrier?.status || 'missing').trim() || 'missing'
  const standardComponentStatus =
    String(supportEntry?.standardComponent?.status || 'missing').trim() || 'missing'
  const supportStatus = String(supportEntry?.supportStatus || 'missing').trim() || 'missing'
  const baseBlockingReasons = Array.isArray(supportEntry?.blockingReasons)
    ? supportEntry.blockingReasons.map((entry) => String(entry || '').trim()).filter(Boolean)
    : []
  const projectCarrierBlockingReasons = Array.isArray(supportEntry?.projectCarrier?.blockingReasons)
    ? supportEntry.projectCarrier.blockingReasons.map((entry) => String(entry || '').trim()).filter(Boolean)
    : []

  if (deliveryPolicy === 'carrier-first-required') {
    const policyReady = projectCarrierStatus === 'ready'
    return {
      pageTypeId,
      deliveryPolicy,
      reason: String(reason || '').trim(),
      policyStatus: policyReady ? 'ready' : 'blocked',
      supportStatus,
      selectedDeliveryKind,
      selectedComponentId,
      projectCarrierStatus,
      standardComponentStatus,
      blockingReasons: policyReady
        ? []
        : uniqueValues([
            `legacy pageType ${pageTypeId} requires a project-certified carrier before page generation`,
            ...(projectCarrierStatus === 'missing'
              ? [`legacy pageType ${pageTypeId} does not have a ready project-certified carrier`]
              : []),
            ...(selectedDeliveryKind === 'direct-standard-component'
              ? [
                  `legacy pageType ${pageTypeId} currently resolves to direct-standard-component, but delivery policy requires project-certified-carrier first`,
                ]
              : []),
            ...projectCarrierBlockingReasons,
            ...baseBlockingReasons,
          ]),
    }
  }

  const policyReady = supportStatus === 'ready'
  return {
    pageTypeId,
    deliveryPolicy,
    reason: String(reason || '').trim(),
    policyStatus: policyReady ? 'ready' : 'blocked',
    supportStatus,
    selectedDeliveryKind,
    selectedComponentId,
    projectCarrierStatus,
    standardComponentStatus,
    blockingReasons: policyReady
      ? []
      : uniqueValues([
          `legacy pageType ${pageTypeId} does not have a ready page-component delivery path for policy ${deliveryPolicy}`,
          ...baseBlockingReasons,
          ...projectCarrierBlockingReasons,
        ]),
  }
}

export async function loadLegacyDeliveryPolicyFact({
  targetRoot,
  skillRoot,
  modeOverride = '',
  projectTypicalPageSupport = null,
}) {
  const modeKey = normalizeModeKey(modeOverride)
  const effectiveMode = resolveFactModeId(modeOverride)
  const outputRelativePath = outputPathForLegacyDeliveryPolicy(effectiveMode || modeKey)
  const fingerprintPaths = [
    ...PROJECT_LEGACY_DELIVERY_POLICY_FINGERPRINT_PATHS,
    path.join(skillRoot, LEGACY_PAGE_TYPE_DELIVERY_POLICY_RULES_RELATIVE_PATH),
  ]

  const payload = await loadCachedProjectFact({
    targetRoot,
    factId: 'legacy-delivery-policy',
    modeKey,
    fingerprintPaths,
    compute: async () => {
      if (effectiveMode !== 'legacy-host-compatible') {
        return {
          schemaVersion: 'legacy-delivery-policy.v1',
          mode: effectiveMode || modeKey,
          status: 'not-applicable',
          source: LEGACY_PAGE_TYPE_DELIVERY_POLICY_RULES_RELATIVE_PATH,
          factPath: outputRelativePath,
          carrierReady: null,
          carrierFirstRequiredPageTypes: [],
          directStandardAllowedPageTypes: [],
          pageTypes: [],
          blockingReasons: [],
        }
      }

      const rules = await readJsonIfExists(
        path.join(skillRoot, LEGACY_PAGE_TYPE_DELIVERY_POLICY_RULES_RELATIVE_PATH)
      )
      const support =
        projectTypicalPageSupport ||
        (await loadProjectTypicalPageSupportFact({
          targetRoot,
          skillRoot,
          modeOverride,
        }))
      const supportByPageTypeId = new Map(
        (Array.isArray(support?.pageTypes) ? support.pageTypes : []).map((entry) => [entry.pageTypeId, entry])
      )
      const configuredPageTypes = Array.isArray(rules?.pageTypes) ? rules.pageTypes : []
      const pageTypes = configuredPageTypes
        .map((entry) => ({
          pageTypeId: String(entry?.pageTypeId || '').trim(),
          deliveryPolicy: normalizeLegacyDeliveryPolicyId(entry?.deliveryPolicy),
          reason: String(entry?.reason || '').trim(),
        }))
        .filter((entry) => entry.pageTypeId && entry.deliveryPolicy)
        .map((entry) =>
          summarizeLegacyDeliveryPolicyEntry({
            mode: effectiveMode,
            pageTypeId: entry.pageTypeId,
            deliveryPolicy: entry.deliveryPolicy,
            reason: entry.reason,
            supportEntry: supportByPageTypeId.get(entry.pageTypeId) || null,
          })
        )

      const carrierFirstRequiredPageTypes = pageTypes
        .filter((entry) => entry.deliveryPolicy === 'carrier-first-required')
        .map((entry) => entry.pageTypeId)
      const directStandardAllowedPageTypes = pageTypes
        .filter((entry) => entry.deliveryPolicy === 'direct-standard-allowed')
        .map((entry) => entry.pageTypeId)
      const blockingReasons = uniqueValues(
        pageTypes
          .filter((entry) => entry.policyStatus === 'blocked')
          .flatMap((entry) => entry.blockingReasons || [])
      )

      return {
        schemaVersion: 'legacy-delivery-policy.v1',
        mode: effectiveMode,
        status: pageTypes.length === 0 ? 'not-applicable' : blockingReasons.length > 0 ? 'blocked' : 'ready',
        source: LEGACY_PAGE_TYPE_DELIVERY_POLICY_RULES_RELATIVE_PATH,
        factPath: outputRelativePath,
        carrierReady: carrierFirstRequiredPageTypes.every((pageTypeId) => {
          const entry = pageTypes.find((item) => item.pageTypeId === pageTypeId)
          return entry?.policyStatus === 'ready'
        }),
        carrierFirstRequiredPageTypes,
        directStandardAllowedPageTypes,
        pageTypes,
        blockingReasons,
      }
    },
  })

  if (await cacheRootExists(targetRoot)) {
    await writeDerivedOutput(targetRoot, outputRelativePath, payload)
  }

  return payload
}
