import fs from 'node:fs/promises'
import path from 'node:path'

import { collectLegacyRuntimeSurfaceFacts } from './legacy-runtime-surface-facts.mjs'

export const PROJECT_INTEGRATION_STATE_SCHEMA_VERSION = 'hiui-project-integration-state.v1'
export const PROJECT_INTEGRATION_STATE_RELATIVE_PATH =
  '.local-context/hiui-design/outputs/project-integration-state.json'
export const LEGACY_INTEGRATION_SEAL_RELATIVE_PATH =
  '.local-context/hiui-design/outputs/legacy-integration-seal.json'
const PROJECT_PAGE_COMPONENT_REGISTRY_RELATIVE_PATH =
  '.local-context/hiui-design/outputs/project-page-component-registry.json'
const LEGACY_HOST_CONTRACT_RELATIVE_PATH = '.local-context/hiui-design/host-contract.json'
const RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH =
  '.local-context/hiui-design/outputs/runtime-compatibility-lock.json'
const LEGACY_REQUIRED_ADAPTERS = ['request', 'message', 'permission', 'route', 'theme']

function normalizeModeId(mode) {
  const value = String(mode || '').trim()
  if (value === 'host-compatible') return 'legacy-host-compatible'
  if (['host-integration', 'rules-only', 'legacy-host-compatible'].includes(value)) {
    return value
  }
  return ''
}

function normalizeModeSelectionStatus(status, mode, recommendedMode) {
  const value = String(status || '').trim()
  if (['matched', 'overridden', 'blocked', 'unknown'].includes(value)) {
    return value
  }
  if (mode && recommendedMode) {
    return mode === recommendedMode ? 'matched' : 'unknown'
  }
  return 'unknown'
}

function normalizeGateStatus(status, fallback = 'not-run') {
  const value = String(status || '').trim()
  if (['passed', 'failed', 'skipped', 'skipped-by-user', 'not-run', 'not-applicable', 'unknown'].includes(value)) {
    return value
  }
  if (typeof status === 'boolean') {
    return status ? 'passed' : 'failed'
  }
  return fallback
}

function normalizeCompletionGates(raw = null, { mode = '', runtimeIntegrationReady = false } = {}) {
  const input = raw && typeof raw === 'object' ? raw : {}
  const bootstrapWritten = normalizeGateStatus(input.bootstrapWritten, 'passed')
  const modeLocked = normalizeGateStatus(input.modeLocked, mode ? 'passed' : 'failed')
  const dependencyInstalled = normalizeGateStatus(input.dependencyInstalled, 'not-run')
  const hostAssetsReady = normalizeGateStatus(
    input.hostAssetsReady,
    mode === 'rules-only' ? 'not-applicable' : 'not-run'
  )
  const doctorPassed = normalizeGateStatus(input.doctorPassed, 'not-run')
  const engineeringPassed = normalizeGateStatus(input.engineeringPassed, 'not-run')
  const modeRequiredGates = {
    legacyHostContractReady: normalizeGateStatus(
      input.modeRequiredGates?.legacyHostContractReady,
      mode === 'legacy-host-compatible' ? (runtimeIntegrationReady ? 'passed' : 'not-run') : 'not-applicable'
    ),
    legacyRuntimeReady: normalizeGateStatus(
      input.modeRequiredGates?.legacyRuntimeReady,
      mode === 'legacy-host-compatible' ? (runtimeIntegrationReady ? 'passed' : 'not-run') : 'not-applicable'
    ),
    hostRouteReady: normalizeGateStatus(
      input.modeRequiredGates?.hostRouteReady,
      mode === 'host-integration' ? 'not-run' : 'not-applicable'
    ),
  }

  return {
    bootstrapWritten,
    modeLocked,
    dependencyInstalled,
    hostAssetsReady,
    doctorPassed,
    engineeringPassed,
    modeRequiredGates,
  }
}

function deriveOnboardingCompletionReady({ completionGates, modeSelectionStatus, runtimeIntegrationReady }) {
  if (!runtimeIntegrationReady) return false
  if (modeSelectionStatus === 'blocked' || modeSelectionStatus === 'unknown') return false
  if (completionGates.bootstrapWritten !== 'passed') return false
  if (completionGates.modeLocked !== 'passed') return false
  if (!['passed', 'not-applicable'].includes(completionGates.dependencyInstalled)) return false
  if (!['passed', 'not-applicable'].includes(completionGates.hostAssetsReady)) return false
  if (completionGates.doctorPassed !== 'passed') return false
  if (completionGates.engineeringPassed !== 'passed') return false
  return Object.values(completionGates.modeRequiredGates || {}).every((status) =>
    ['passed', 'not-applicable'].includes(status)
  )
}

function pickHostProfileSummary(hostProfile = null) {
  return {
    projectType: String(hostProfile?.projectType || '').trim(),
    framework: String(hostProfile?.framework || '').trim(),
    runtime: String(hostProfile?.runtime || '').trim(),
    routing: String(hostProfile?.routing || '').trim(),
    strategy: String(hostProfile?.strategy || '').trim(),
  }
}

function normalizeProjectRelativePath(filePath) {
  const value = String(filePath || '').trim().replace(/\\/g, '/')
  if (!value || path.isAbsolute(value)) {
    return ''
  }
  const normalized = path.posix.normalize(value)
  if (!normalized || normalized === '.' || normalized === '..' || normalized.startsWith('../')) {
    return ''
  }
  return normalized
}

function resolveProjectFile(targetRoot, filePath) {
  const normalized = normalizeProjectRelativePath(filePath)
  if (!normalized) {
    return null
  }
  return {
    relativePath: normalized,
    absolutePath: path.join(targetRoot, normalized),
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return null
  }
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function shellExportExists(sourceRaw, exportName) {
  const normalizedExportName = String(exportName || '').trim()
  if (!sourceRaw || !normalizedExportName) {
    return false
  }

  if (normalizedExportName === 'default') {
    return /export\s+default\b/.test(sourceRaw)
  }

  const escapedName = escapeRegExp(normalizedExportName)
  const directExportPattern = new RegExp(
    `export\\s+(?:async\\s+)?(?:function|const|let|var|class)\\s+${escapedName}\\b`
  )
  const exportListPattern = new RegExp(`export\\s*\\{[^}]*\\b${escapedName}\\b[^}]*\\}`)
  const exportAliasPattern = new RegExp(`export\\s*\\{[^}]*\\bas\\s+${escapedName}\\b[^}]*\\}`)

  return (
    directExportPattern.test(sourceRaw) ||
    exportListPattern.test(sourceRaw) ||
    exportAliasPattern.test(sourceRaw)
  )
}

function parseComponentShell(shellRef) {
  const raw = String(shellRef || '').trim()
  const separatorIndex = raw.indexOf('::')
  if (separatorIndex < 0) {
    return {
      raw,
      sourcePath: raw,
      exportName: '',
    }
  }

  return {
    raw,
    sourcePath: raw.slice(0, separatorIndex).trim(),
    exportName: raw.slice(separatorIndex + 2).trim(),
  }
}

function createCarrierIssue({ componentId, code, message, path: filePath = '' }) {
  return {
    componentId,
    code,
    message,
    path: String(filePath || '').trim(),
  }
}

function extractImportSpecifiers(source) {
  const patterns = [
    /(?:import|export)\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g,
    /import\s+['"]([^'"]+)['"]/g,
    /import\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]
  const specifiers = new Set()

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1]) {
        specifiers.add(match[1])
      }
    }
  }

  return [...specifiers]
}

function isBarePackageImport(specifier) {
  return (
    specifier &&
    !specifier.startsWith('.') &&
    !specifier.startsWith('/') &&
    !specifier.startsWith('@/') &&
    !specifier.startsWith('~/') &&
    !specifier.startsWith('node:')
  )
}

function normalizePackageName(specifier) {
  if (!isBarePackageImport(specifier)) return ''
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/')
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier
  }
  return specifier.split('/')[0]
}

function collectDeclaredPackages(packageJson) {
  return new Set([
    ...Object.keys(packageJson?.dependencies ?? {}),
    ...Object.keys(packageJson?.devDependencies ?? {}),
    ...Object.keys(packageJson?.peerDependencies ?? {}),
  ])
}

function findMissingDeclaredPackages(sourceRaw, declaredPackages) {
  return Array.from(
    new Set(
      extractImportSpecifiers(sourceRaw)
        .map((specifier) => normalizePackageName(specifier))
        .filter((pkgName) => pkgName && !declaredPackages.has(pkgName))
    )
  )
}

function createMissingDependencyIssue({ componentId, relativePath, missingPackages }) {
  return createCarrierIssue({
    componentId,
    code: 'component-runtime-dependency-missing',
    message: `${componentId} imports undeclared runtime packages in ${relativePath}: ${missingPackages.join(', ')}`,
    path: relativePath,
  })
}

async function validateCertifiedProjectCarrier({ targetRoot, component, declaredPackages }) {
  const componentId = String(component?.componentId || '').trim()
  const certificationRef = String(component?.certificationRef || '').trim()
  const issues = []

  if (!componentId || !certificationRef) {
    return {
      componentId,
      pageTypeId: String(component?.pageTypeId || '').trim(),
      certificationRef,
      status: 'blocked',
      issues: [
        createCarrierIssue({
          componentId,
          code: 'carrier-metadata-missing',
          message: `${componentId || '(unknown component)'} is missing componentId or certificationRef in project-page-component-registry.`,
        }),
      ],
    }
  }

  const certificationFile = resolveProjectFile(targetRoot, certificationRef)
  if (!certificationFile || !(await fileExists(certificationFile.absolutePath))) {
    issues.push(
      createCarrierIssue({
        componentId,
        code: 'certification-missing',
        message: `${componentId} is marked as a project-certified carrier, but certificationRef is missing or unresolved: ${certificationRef}`,
        path: certificationRef,
      })
    )
  }

  const certification = certificationFile
    ? await readJsonIfExists(certificationFile.absolutePath)
    : null

  if (certificationFile && !certification) {
    issues.push(
      createCarrierIssue({
        componentId,
        code: 'certification-invalid',
        message: `${componentId} certification file is not valid JSON: ${certificationRef}`,
        path: certificationRef,
      })
    )
  }

  if (certification) {
    if (
      certification.schemaVersion !== 'page-component-certification.v1' ||
      certification.status !== 'certified' ||
      certification.componentId !== componentId ||
      certification.baseMoldId !== component.baseMoldId ||
      certification.mode !== component.mode
    ) {
      issues.push(
        createCarrierIssue({
          componentId,
          code: 'certification-mismatch',
          message: `${componentId} certification does not match the project carrier registry entry: ${certificationRef}`,
          path: certificationRef,
        })
      )
    }

    const certificationInputs =
      certification.certificationInputs && typeof certification.certificationInputs === 'object'
        ? certification.certificationInputs
        : {}

    const componentSource = resolveProjectFile(targetRoot, certificationInputs.componentSource)
    if (!componentSource || !(await fileExists(componentSource.absolutePath))) {
      issues.push(
        createCarrierIssue({
          componentId,
          code: 'component-source-missing',
          message: `${componentId} componentSource is missing or unresolved at integration time: ${String(
            certificationInputs.componentSource || '(empty)'
          )}`,
          path: String(certificationInputs.componentSource || '').trim(),
        })
      )
    } else {
      const componentSourceRaw = await fs.readFile(componentSource.absolutePath, 'utf8').catch(() => '')
      const missingPackages = findMissingDeclaredPackages(componentSourceRaw, declaredPackages)
      if (missingPackages.length > 0) {
        issues.push(
          createMissingDependencyIssue({
            componentId,
            relativePath: componentSource.relativePath,
            missingPackages,
          })
        )
      }
    }

    const shellInfo = parseComponentShell(certificationInputs.componentShell)
    const shellSource = resolveProjectFile(targetRoot, shellInfo.sourcePath)
    if (!shellInfo.exportName) {
      issues.push(
        createCarrierIssue({
          componentId,
          code: 'component-shell-invalid',
          message: `${componentId} componentShell must resolve to "<file>::<export>", but received: ${String(
            certificationInputs.componentShell || '(empty)'
          )}`,
          path: String(certificationInputs.componentShell || '').trim(),
        })
      )
    } else if (!shellSource || !(await fileExists(shellSource.absolutePath))) {
      issues.push(
        createCarrierIssue({
          componentId,
          code: 'component-shell-source-missing',
          message: `${componentId} componentShell source file is missing at integration time: ${shellInfo.sourcePath || '(empty)'}`,
          path: shellInfo.sourcePath,
        })
      )
    } else {
      const shellSourceRaw = await fs.readFile(shellSource.absolutePath, 'utf8').catch(() => '')
      if (!shellExportExists(shellSourceRaw, shellInfo.exportName)) {
        issues.push(
          createCarrierIssue({
            componentId,
            code: 'component-shell-export-missing',
            message: `${componentId} componentShell export "${shellInfo.exportName}" is not present in ${shellInfo.sourcePath}`,
            path: shellInfo.sourcePath,
          })
        )
      }
      if (shellSource.relativePath !== componentSource?.relativePath) {
        const missingPackages = findMissingDeclaredPackages(shellSourceRaw, declaredPackages)
        if (missingPackages.length > 0) {
          issues.push(
            createMissingDependencyIssue({
              componentId,
              relativePath: shellSource.relativePath,
              missingPackages,
            })
          )
        }
      }
    }

    const supportSources = Array.isArray(certificationInputs.componentSupportSources)
      ? certificationInputs.componentSupportSources
      : []
    for (const supportSource of supportSources) {
      const supportFile = resolveProjectFile(targetRoot, supportSource)
      if (!supportFile || !(await fileExists(supportFile.absolutePath))) {
        issues.push(
          createCarrierIssue({
            componentId,
            code: 'component-support-source-missing',
            message: `${componentId} componentSupportSources contains a missing file at integration time: ${String(
              supportSource || '(empty)'
            )}`,
            path: String(supportSource || '').trim(),
          })
        )
      } else {
        const supportSourceRaw = await fs.readFile(supportFile.absolutePath, 'utf8').catch(() => '')
        const missingPackages = findMissingDeclaredPackages(supportSourceRaw, declaredPackages)
        if (missingPackages.length > 0) {
          issues.push(
            createMissingDependencyIssue({
              componentId,
              relativePath: supportFile.relativePath,
              missingPackages,
            })
          )
        }
      }
    }
  }

  return {
    componentId,
    pageTypeId: String(component?.pageTypeId || '').trim(),
    certificationRef,
    status: issues.length > 0 ? 'blocked' : 'ready',
    issues,
  }
}

export async function validateProjectCertifiedCarriers({ targetRoot }) {
  const registryFile = path.join(targetRoot, PROJECT_PAGE_COMPONENT_REGISTRY_RELATIVE_PATH)
  const registry = await readJsonIfExists(registryFile)
  const packageJson = (await readJsonIfExists(path.join(targetRoot, 'package.json'))) || {}
  const declaredPackages = collectDeclaredPackages(packageJson)
  const components = Array.isArray(registry?.components) ? registry.components : []
  const certifiedProjectCarriers = components.filter((component) => {
    const status = String(component?.status || '').trim()
    const certificationStatus = String(component?.certificationStatus || '').trim()
    return status === 'certified' && certificationStatus === 'certified' && component?.certificationRef
  })

  if (certifiedProjectCarriers.length === 0) {
    return {
      status: 'not-applicable',
      registryPath: PROJECT_PAGE_COMPONENT_REGISTRY_RELATIVE_PATH,
      checkedComponentCount: 0,
      readyComponentCount: 0,
      blockedComponentCount: 0,
      components: [],
      blockingReasons: [],
    }
  }

  const componentResults = []
  const blockingReasons = []

  for (const component of certifiedProjectCarriers) {
    const result = await validateCertifiedProjectCarrier({ targetRoot, component, declaredPackages })
    componentResults.push(result)
    for (const issue of result.issues) {
      blockingReasons.push(issue.message)
    }
  }

  const blockedComponentCount = componentResults.filter((component) => component.status === 'blocked').length
  const readyComponentCount = componentResults.length - blockedComponentCount

  return {
    status: blockedComponentCount > 0 ? 'blocked' : 'ready',
    registryPath: PROJECT_PAGE_COMPONENT_REGISTRY_RELATIVE_PATH,
    checkedComponentCount: componentResults.length,
    readyComponentCount,
    blockedComponentCount,
    components: componentResults,
    blockingReasons,
  }
}

export function getProjectIntegrationStatePath(targetRoot) {
  return path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'project-integration-state.json')
}

function normalizeCarrierValidation(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      status: 'not-applicable',
      registryPath: PROJECT_PAGE_COMPONENT_REGISTRY_RELATIVE_PATH,
      checkedComponentCount: 0,
      readyComponentCount: 0,
      blockedComponentCount: 0,
      components: [],
      blockingReasons: [],
    }
  }

  return {
    status: ['ready', 'blocked', 'not-applicable'].includes(String(raw.status || '').trim())
      ? String(raw.status || '').trim()
      : 'not-applicable',
    registryPath:
      String(raw.registryPath || '').trim() || PROJECT_PAGE_COMPONENT_REGISTRY_RELATIVE_PATH,
    checkedComponentCount: Number.isFinite(raw.checkedComponentCount)
      ? Number(raw.checkedComponentCount)
      : 0,
    readyComponentCount: Number.isFinite(raw.readyComponentCount) ? Number(raw.readyComponentCount) : 0,
    blockedComponentCount: Number.isFinite(raw.blockedComponentCount)
      ? Number(raw.blockedComponentCount)
      : 0,
    components: Array.isArray(raw.components)
      ? raw.components.map((component) => ({
          componentId: String(component?.componentId || '').trim(),
          pageTypeId: String(component?.pageTypeId || '').trim(),
          certificationRef: String(component?.certificationRef || '').trim(),
          status: String(component?.status || '').trim() || 'blocked',
          issues: Array.isArray(component?.issues)
            ? component.issues.map((issue) => ({
                componentId: String(issue?.componentId || component?.componentId || '').trim(),
                code: String(issue?.code || '').trim(),
                message: String(issue?.message || '').trim(),
                path: String(issue?.path || '').trim(),
              }))
            : [],
        }))
      : [],
    blockingReasons: Array.isArray(raw.blockingReasons)
      ? raw.blockingReasons.map((reason) => String(reason || '').trim()).filter(Boolean)
      : [],
  }
}

function normalizeTypicalPageSupport(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      status: 'not-applicable',
      readyPageTypeIds: [],
      blockedPageTypeIds: [],
      unsupportedPageTypeIds: [],
      pageTypes: [],
    }
  }

  const normalizeIds = (value) =>
    Array.isArray(value) ? value.map((item) => String(item || '').trim()).filter(Boolean) : []

  return {
    status: ['ready', 'blocked', 'not-applicable'].includes(String(raw.status || '').trim())
      ? String(raw.status || '').trim()
      : 'not-applicable',
    readyPageTypeIds: normalizeIds(raw.readyPageTypeIds),
    blockedPageTypeIds: normalizeIds(raw.blockedPageTypeIds),
    unsupportedPageTypeIds: normalizeIds(raw.unsupportedPageTypeIds),
    pageTypes: Array.isArray(raw.pageTypes)
      ? raw.pageTypes.map((pageType) => ({
          pageTypeId: String(pageType?.pageTypeId || '').trim(),
          supportStatus: String(pageType?.supportStatus || '').trim() || 'blocked',
          selectedDeliveryKind: String(pageType?.selectedDeliveryKind || '').trim(),
          selectedComponentId: String(pageType?.selectedComponentId || '').trim(),
          projectCarrierStatus: String(pageType?.projectCarrierStatus || '').trim() || 'missing',
          standardComponentStatus: String(pageType?.standardComponentStatus || '').trim() || 'missing',
          blockingReasons: Array.isArray(pageType?.blockingReasons)
            ? pageType.blockingReasons.map((reason) => String(reason || '').trim()).filter(Boolean)
            : [],
        }))
      : [],
  }
}

function defaultLegacyDeliveryPolicy(mode = '') {
  if (normalizeModeId(mode) !== 'legacy-host-compatible') {
    return {
      status: 'not-applicable',
      factPath: '',
      runtimeSurfaceReady: null,
      runtimeSurfaceRequiredPageTypes: [],
      runtimeSurfaceOptionalPageTypes: [],
      deferredLegacyPageTypes: [],
      runtimeSurfaceCoveredPageTypes: [],
      missingRuntimeSurfacePageTypes: [],
      legacyRolloutCoverageStatus: 'not-applicable',
      pageTypes: [],
      blockingReasons: [],
    }
  }

  return {
    status: 'not-applicable',
    factPath: '',
    runtimeSurfaceReady: null,
    runtimeSurfaceRequiredPageTypes: [],
    runtimeSurfaceOptionalPageTypes: [],
    deferredLegacyPageTypes: [],
    runtimeSurfaceCoveredPageTypes: [],
    missingRuntimeSurfacePageTypes: [],
    legacyRolloutCoverageStatus: 'not-applicable',
    pageTypes: [],
    blockingReasons: [],
  }
}

function normalizeLegacyDeliveryPolicy(raw, mode = '') {
  const fallback = defaultLegacyDeliveryPolicy(mode)
  if (!raw || typeof raw !== 'object') {
    return fallback
  }
  const normalizeIds = (value) =>
    Array.isArray(value) ? value.map((item) => String(item || '').trim()).filter(Boolean) : []
  const pageTypes = Array.isArray(raw.pageTypes)
    ? raw.pageTypes.map((entry) => ({
        pageTypeId: String(entry?.pageTypeId || '').trim(),
        deliveryPolicy: String(entry?.deliveryPolicy || '').trim(),
        reason: String(entry?.reason || '').trim(),
        policyStatus: String(entry?.policyStatus || '').trim() || 'blocked',
        supportStatus: String(entry?.supportStatus || '').trim() || 'missing',
        selectedDeliveryKind: String(entry?.selectedDeliveryKind || '').trim(),
        selectedComponentId: String(entry?.selectedComponentId || '').trim(),
        projectCarrierStatus: String(entry?.projectCarrierStatus || '').trim() || 'missing',
        standardComponentStatus: String(entry?.standardComponentStatus || '').trim() || 'missing',
        blockingReasons: Array.isArray(entry?.blockingReasons)
          ? entry.blockingReasons.map((reason) => String(reason || '').trim()).filter(Boolean)
          : [],
      }))
    : []
  const runtimeSurfaceRequiredPageTypes = normalizeIds(raw.runtimeSurfaceRequiredPageTypes)
  const runtimeSurfaceOptionalPageTypes = normalizeIds(raw.runtimeSurfaceOptionalPageTypes)
  const resolvedRuntimeSurfaceRequiredPageTypes = (() => {
    if (runtimeSurfaceRequiredPageTypes.length > 0) {
      return runtimeSurfaceRequiredPageTypes
    }
    return pageTypes
      .filter((entry) => entry.deliveryPolicy === 'compiled-pagespec-runtime-required')
      .map((entry) => entry.pageTypeId)
  })()
  const deferredLegacyPageTypes = normalizeIds(raw.deferredLegacyPageTypes)
  const runtimeSurfaceCoveredPageTypes = normalizeIds(raw.runtimeSurfaceCoveredPageTypes)
  const missingRuntimeSurfacePageTypes = resolvedRuntimeSurfaceRequiredPageTypes.filter(
    (pageTypeId) => !runtimeSurfaceCoveredPageTypes.includes(pageTypeId)
  )
  const derivedCoverageStatus =
    normalizeModeId(mode) !== 'legacy-host-compatible'
      ? 'not-applicable'
      : resolvedRuntimeSurfaceRequiredPageTypes.length === 0
        ? 'not-applicable'
        : missingRuntimeSurfacePageTypes.length === 0
          ? 'ready'
          : 'blocked'
  const legacyRolloutCoverageStatus = ['ready', 'blocked', 'not-applicable'].includes(
    String(raw.legacyRolloutCoverageStatus || '').trim()
  )
    ? String(raw.legacyRolloutCoverageStatus || '').trim()
    : derivedCoverageStatus
  const derivedBlockingReasons =
    legacyRolloutCoverageStatus === 'blocked' && missingRuntimeSurfacePageTypes.length > 0
      ? [
          `legacy integration is incomplete because required compiled PageSpec runtime coverage is still missing for page types: ${missingRuntimeSurfacePageTypes.join(', ')}`,
        ]
      : []
  const normalizedBlockingReasons = uniqueBlockingReasons([
    ...(Array.isArray(raw.blockingReasons)
      ? raw.blockingReasons.map((reason) => String(reason || '').trim()).filter(Boolean)
      : fallback.blockingReasons),
    ...derivedBlockingReasons,
  ])
  const runtimeSurfaceReady =
    typeof raw.runtimeSurfaceReady === 'boolean'
      ? raw.runtimeSurfaceReady
      : legacyRolloutCoverageStatus === 'ready'

  return {
    status: ['ready', 'blocked', 'not-applicable'].includes(String(raw.status || '').trim())
      ? String(raw.status || '').trim()
      : derivedCoverageStatus,
    factPath: String(raw.factPath || '').trim(),
    runtimeSurfaceReady,
    runtimeSurfaceRequiredPageTypes: resolvedRuntimeSurfaceRequiredPageTypes,
    runtimeSurfaceOptionalPageTypes,
    deferredLegacyPageTypes,
    runtimeSurfaceCoveredPageTypes,
    missingRuntimeSurfacePageTypes,
    legacyRolloutCoverageStatus,
    pageTypes,
    blockingReasons: normalizedBlockingReasons,
  }
}

function mergeLegacyDeliveryPolicyWithRuntimeSurfaceFacts({ mode, legacyDeliveryPolicy, legacyRuntimeSurfaceFacts }) {
  if (normalizeModeId(mode) !== 'legacy-host-compatible' || !legacyRuntimeSurfaceFacts) {
    return legacyDeliveryPolicy
  }

  const missingRuntimeSurfacePageTypes = legacyRuntimeSurfaceFacts.missingRuntimeSurfacePageTypes
  const legacyRolloutCoverageStatus = legacyRuntimeSurfaceFacts.runtimeSurfaceReady ? 'ready' : 'blocked'
  const runtimeSurfaceReady = legacyRuntimeSurfaceFacts.runtimeSurfaceReady && legacyRolloutCoverageStatus === 'ready'

  return {
    ...legacyDeliveryPolicy,
    status: legacyRolloutCoverageStatus,
    runtimeSurfaceReady,
    runtimeSurfaceCoveredPageTypes: legacyRuntimeSurfaceFacts.runtimeSurfaceCoveredPageTypes,
    missingRuntimeSurfacePageTypes,
    legacyRolloutCoverageStatus,
    blockingReasons: uniqueBlockingReasons([
      ...legacyDeliveryPolicy.blockingReasons,
      ...legacyRuntimeSurfaceFacts.blockingReasons,
    ]),
  }
}

function defaultLegacyContractValidation(mode = '') {
  if (normalizeModeId(mode) !== 'legacy-host-compatible') {
    return {
      status: 'not-applicable',
      hostFamilyStatus: 'not_applicable',
      hostFamilyId: '',
      adapterPackId: '',
      confidence: '',
      missingFacts: [],
      blockingReasons: [],
    }
  }

  return {
    status: 'not-applicable',
    hostFamilyStatus: 'not_required',
    hostFamilyId: '',
    adapterPackId: '',
    confidence: '',
    missingFacts: [],
    blockingReasons: [],
  }
}

function summarizeLegacyContractValidation({ mode, legacyHostFamily = null }) {
  const normalizedMode = normalizeModeId(mode)
  if (normalizedMode !== 'legacy-host-compatible') {
    return defaultLegacyContractValidation(normalizedMode)
  }

  return {
    status: 'ready',
    hostFamilyStatus: String(legacyHostFamily?.status || '').trim() || 'matched',
    hostFamilyId: String(legacyHostFamily?.hostFamilyId || '').trim(),
    adapterPackId: String(legacyHostFamily?.adapterPackId || '').trim(),
    confidence: String(legacyHostFamily?.confidence || '').trim(),
    missingFacts: Array.isArray(legacyHostFamily?.missingFacts)
      ? legacyHostFamily.missingFacts.map((fact) => String(fact || '').trim()).filter(Boolean)
      : [],
    blockingReasons: [],
  }
}

async function collectLegacyHostContractFacts({ targetRoot, mode }) {
  if (normalizeModeId(mode) !== 'legacy-host-compatible') {
    return null
  }

  const hostContractPath = path.join(targetRoot, LEGACY_HOST_CONTRACT_RELATIVE_PATH)
  const hostContract = await readJsonIfExists(hostContractPath)
  if (!hostContract) {
    return {
      status: 'blocked',
      hostContractPath: LEGACY_HOST_CONTRACT_RELATIVE_PATH,
      adapters: {},
      missingFacts: [LEGACY_HOST_CONTRACT_RELATIVE_PATH],
      blockingReasons: [`legacy host contract is missing: ${LEGACY_HOST_CONTRACT_RELATIVE_PATH}`],
    }
  }

  const adapters = {}
  const blockingReasons = []
  const missingFacts = []

  if (hostContract.schemaVersion !== 'host-contract.v1') {
    blockingReasons.push('legacy host contract schemaVersion must be host-contract.v1')
  }
  if (hostContract.mode !== 'legacy-host-compatible') {
    blockingReasons.push('legacy host contract mode must be legacy-host-compatible')
  }

  for (const adapterName of LEGACY_REQUIRED_ADAPTERS) {
    const status = String(hostContract.adapters?.[adapterName]?.status || '').trim()
    adapters[adapterName] = {
      status: status || 'missing',
      source: String(hostContract.adapters?.[adapterName]?.source || '').trim(),
    }
    if (status !== 'ready' && status !== 'not-required') {
      missingFacts.push(`adapters.${adapterName}`)
      blockingReasons.push(`${adapterName} adapter must be ready or not-required; current status is ${status || 'missing'}`)
    }
  }

  return {
    status: blockingReasons.length === 0 ? 'ready' : 'blocked',
    hostContractPath: LEGACY_HOST_CONTRACT_RELATIVE_PATH,
    adapters,
    missingFacts,
    blockingReasons,
  }
}

async function collectRuntimeCompatibilityLockFacts({ targetRoot, mode }) {
  if (normalizeModeId(mode) !== 'legacy-host-compatible') {
    return null
  }

  const lockPath = path.join(targetRoot, RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH)
  const lock = await readJsonIfExists(lockPath)
  if (!lock) {
    return {
      status: 'unknown',
      lockPath: RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH,
      shellRuntimeVariant: '',
      blockingReasons: [],
    }
  }

  const shellStatus = String(lock.shell?.status || '').trim()
  const shellRuntimeVariant = String(lock.shell?.runtimeVariant || '').trim()
  const shellBlockingReasons = Array.isArray(lock.shell?.blockingReasons)
    ? lock.shell.blockingReasons.map((reason) => String(reason || '').trim()).filter(Boolean)
    : []
  const peerResolutionStatus = String(lock.peerResolution?.status || '').trim()
  const peerResolutionBlockingReasons = Array.isArray(lock.peerResolution?.blockingReasons)
    ? lock.peerResolution.blockingReasons.map((reason) => String(reason || '').trim()).filter(Boolean)
    : []
  const blockingReasons = shellStatus === 'blocked'
    ? shellBlockingReasons.length > 0
      ? shellBlockingReasons
      : ['legacy shell runtime compatibility is blocked']
    : []
  if (peerResolutionStatus === 'blocked') {
    blockingReasons.push(...(peerResolutionBlockingReasons.length > 0
      ? peerResolutionBlockingReasons
      : ['legacy runtime peer/export resolution is blocked']))
  }

  return {
    status: blockingReasons.length > 0 ? 'blocked' : shellStatus || 'unknown',
    lockPath: RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH,
    shellRuntimeVariant,
    peerResolutionStatus,
    blockingReasons,
  }
}

function mergeLegacyContractValidationWithHostContractFacts({ legacyContractValidation, legacyHostContractFacts, mode }) {
  if (normalizeModeId(mode) !== 'legacy-host-compatible' || !legacyHostContractFacts) {
    return legacyContractValidation
  }

  const blockingReasons = uniqueBlockingReasons([
    ...legacyContractValidation.blockingReasons,
    ...legacyHostContractFacts.blockingReasons,
  ])
  return {
    ...legacyContractValidation,
    status: legacyContractValidation.status === 'ready' && legacyHostContractFacts.status === 'ready' ? 'ready' : 'blocked',
    missingFacts: uniqueBlockingReasons([
      ...legacyContractValidation.missingFacts,
      ...legacyHostContractFacts.missingFacts,
    ]),
    blockingReasons,
  }
}

function normalizeLegacyContractValidation(raw, mode = '') {
  if (!raw || typeof raw !== 'object') {
    return defaultLegacyContractValidation(mode)
  }

  const fallback = defaultLegacyContractValidation(mode)
  return {
    status: ['ready', 'blocked', 'not-applicable'].includes(String(raw.status || '').trim())
      ? String(raw.status || '').trim()
      : fallback.status,
    hostFamilyStatus:
      String(raw.hostFamilyStatus || raw.status || '').trim() || fallback.hostFamilyStatus,
    hostFamilyId: String(raw.hostFamilyId || '').trim(),
    adapterPackId: String(raw.adapterPackId || '').trim(),
    confidence: String(raw.confidence || '').trim(),
    missingFacts: Array.isArray(raw.missingFacts)
      ? raw.missingFacts.map((fact) => String(fact || '').trim()).filter(Boolean)
      : fallback.missingFacts,
    blockingReasons: Array.isArray(raw.blockingReasons)
      ? raw.blockingReasons.map((reason) => String(reason || '').trim()).filter(Boolean)
      : fallback.blockingReasons,
  }
}

function uniqueBlockingReasons(reasons = []) {
  return Array.from(
    new Set(
      reasons
        .map((reason) => String(reason || '').trim())
        .filter(Boolean)
    )
  )
}

function typicalPageSupportBlockingReasons(typicalPageSupport) {
  if (!typicalPageSupport || typicalPageSupport.status !== 'blocked') {
    return []
  }

  return uniqueBlockingReasons(
    (Array.isArray(typicalPageSupport.pageTypes) ? typicalPageSupport.pageTypes : []).flatMap((pageType) => {
      if (pageType?.supportStatus !== 'blocked') {
        return []
      }
      const pageTypeId = String(pageType?.pageTypeId || '').trim() || 'unknown-page-type'
      const blockingReasons = Array.isArray(pageType?.blockingReasons)
        ? pageType.blockingReasons.map((reason) => String(reason || '').trim()).filter(Boolean)
        : []
      if (blockingReasons.length > 0) {
        return blockingReasons.map(
          (reason) => `${pageTypeId} typical page support is blocked: ${reason}`
        )
      }
      return [
        `${pageTypeId} typical page support is blocked; repair the shared page-component asset chain before using page-component + slot-fill`,
      ]
    })
  )
}

function filterExplicitIntegrationBlockingReasons({
  blockingReasons = [],
  carrierValidation,
  legacyContractValidation,
  legacyDeliveryPolicy,
  typicalPageSupport,
}) {
  const derivedReasons = new Set([
    ...(carrierValidation?.blockingReasons || []),
    ...(legacyContractValidation?.blockingReasons || []),
    ...(legacyDeliveryPolicy?.blockingReasons || []),
    ...typicalPageSupportBlockingReasons(typicalPageSupport),
  ])

  return uniqueBlockingReasons(
    blockingReasons.filter((reason) => !derivedReasons.has(String(reason || '').trim()))
  )
}

function deriveIntegrationBlockingReasons({
  blockingReasons = [],
}) {
  return uniqueBlockingReasons(blockingReasons)
}

function deriveIntegrationReady({
  blockingReasons = [],
}) {
  return blockingReasons.length === 0
}

function deriveLegacyContractReady({ mode, legacyContractValidation }) {
  if (normalizeModeId(mode) !== 'legacy-host-compatible') {
    return null
  }

  return legacyContractValidation?.status === 'ready'
}

function deriveLegacyRuntimeSurfaceReady({ mode, legacyContractValidation, legacyDeliveryPolicy, legacyRuntimeSurfaceFacts }) {
  if (normalizeModeId(mode) !== 'legacy-host-compatible') {
    return null
  }

  if (legacyContractValidation?.status !== 'ready') {
    return false
  }

  if (legacyRuntimeSurfaceFacts?.status === 'ready' || legacyRuntimeSurfaceFacts?.status === 'blocked') {
    return Boolean(legacyRuntimeSurfaceFacts?.runtimeSurfaceReady) && legacyDeliveryPolicy?.legacyRolloutCoverageStatus !== 'blocked'
  }

  if (legacyDeliveryPolicy?.status === 'ready' || legacyDeliveryPolicy?.status === 'blocked') {
    return Boolean(legacyDeliveryPolicy?.runtimeSurfaceReady)
  }

  return false
}

function normalizeLegacyRuntimeSurfaceFacts(raw, mode = '') {
  if (normalizeModeId(mode) !== 'legacy-host-compatible') {
    return null
  }
  if (!raw || typeof raw !== 'object') {
    return null
  }

  return {
    schemaVersion: String(raw.schemaVersion || '').trim() || 'legacy-runtime-surface-facts.v1',
    status: ['ready', 'blocked'].includes(String(raw.status || '').trim())
      ? String(raw.status || '').trim()
      : 'blocked',
    runtimeSurfaceReady: Boolean(raw.runtimeSurfaceReady),
    runtimeDir: String(raw.runtimeDir || '').trim() || 'src/hiui-runtime',
    runtimeFiles: Array.isArray(raw.runtimeFiles) ? raw.runtimeFiles : [],
    missingRuntimeFiles: Array.isArray(raw.missingRuntimeFiles)
      ? raw.missingRuntimeFiles.map((filePath) => String(filePath || '').trim()).filter(Boolean)
      : [],
    styleScope: String(raw.styleScope || '').trim(),
    styleScopeReady: Boolean(raw.styleScopeReady),
    requiredPageTypes: Array.isArray(raw.requiredPageTypes)
      ? raw.requiredPageTypes.map((pageTypeId) => String(pageTypeId || '').trim()).filter(Boolean)
      : [],
    optionalPageTypes: Array.isArray(raw.optionalPageTypes)
      ? raw.optionalPageTypes.map((pageTypeId) => String(pageTypeId || '').trim()).filter(Boolean)
      : [],
    pageTypeSpecs: Array.isArray(raw.pageTypeSpecs) ? raw.pageTypeSpecs : [],
    runtimeSurfaceCoveredPageTypes: Array.isArray(raw.runtimeSurfaceCoveredPageTypes)
      ? raw.runtimeSurfaceCoveredPageTypes.map((pageTypeId) => String(pageTypeId || '').trim()).filter(Boolean)
      : [],
    missingRuntimeSurfacePageTypes: Array.isArray(raw.missingRuntimeSurfacePageTypes)
      ? raw.missingRuntimeSurfacePageTypes.map((pageTypeId) => String(pageTypeId || '').trim()).filter(Boolean)
      : [],
    blockingReasons: Array.isArray(raw.blockingReasons)
      ? raw.blockingReasons.map((reason) => String(reason || '').trim()).filter(Boolean)
      : [],
  }
}

function normalizeProjectIntegrationState(raw) {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const mode = normalizeModeId(raw.mode || raw.projectMode || raw.id)
  if (!mode) {
    return null
  }

  const status = String(raw.status || '').trim() || 'integrated'
  if (status !== 'integrated') {
    return null
  }

  const carrierValidation = normalizeCarrierValidation(raw.carrierValidation)
  const legacyContractValidation = normalizeLegacyContractValidation(raw.legacyContractValidation, mode)
  const typicalPageSupport = normalizeTypicalPageSupport(raw.typicalPageSupport)
  const legacyDeliveryPolicy = normalizeLegacyDeliveryPolicy(raw.legacyDeliveryPolicy, mode)
  const legacyRuntimeSurfaceFacts = normalizeLegacyRuntimeSurfaceFacts(raw.legacyRuntimeSurfaceFacts, mode)
  const explicitBlockingReasons = filterExplicitIntegrationBlockingReasons({
    blockingReasons: Array.isArray(raw.blockingReasons) ? raw.blockingReasons : [],
    carrierValidation,
    legacyContractValidation,
    legacyDeliveryPolicy,
    typicalPageSupport,
  })
  const blockingReasons = deriveIntegrationBlockingReasons({
    blockingReasons: [
      ...explicitBlockingReasons,
      ...carrierValidation.blockingReasons,
      ...legacyContractValidation.blockingReasons,
      ...legacyDeliveryPolicy.blockingReasons,
    ],
  })
  const runtimeIntegrationReady = deriveIntegrationReady({
    blockingReasons,
  })
  const normalizedRecommendedMode = normalizeModeId(raw.recommendedMode) || mode
  const modeSelectionStatus = normalizeModeSelectionStatus(
    raw.modeSelectionStatus,
    mode,
    normalizedRecommendedMode
  )
  const completionGates = normalizeCompletionGates(raw.completionGates, {
    mode,
    runtimeIntegrationReady,
  })
  const onboardingCompletionReady = deriveOnboardingCompletionReady({
    completionGates,
    modeSelectionStatus,
    runtimeIntegrationReady,
  })
  const integrationReady = onboardingCompletionReady
  const legacyContractReady = deriveLegacyContractReady({ mode, legacyContractValidation })
  const legacyRuntimeSurfaceReady = deriveLegacyRuntimeSurfaceReady({
    mode,
    legacyContractValidation,
    legacyDeliveryPolicy,
    legacyRuntimeSurfaceFacts,
  })

  return {
    schemaVersion: PROJECT_INTEGRATION_STATE_SCHEMA_VERSION,
    status: 'integrated',
    integrationReady,
    runtimeIntegrationReady,
    mode,
    recommendedMode: normalizedRecommendedMode,
    modeSelectionStatus,
    overrideReason: String(raw.overrideReason || '').trim(),
    completionGates,
    onboardingCompletionReady,
    source: String(raw.source || '').trim() || 'unknown',
    confirmedAt: String(raw.confirmedAt || raw.updatedAt || '').trim(),
    factPath:
      String(raw.factPath || '').trim() || PROJECT_INTEGRATION_STATE_RELATIVE_PATH,
    projectModeFactPath:
      String(raw.projectModeFactPath || '').trim() ||
      '.local-context/hiui-design/outputs/project-mode.json',
    bootstrapSummary:
      String(raw.bootstrapSummary || raw.bootstrapSummaryPath || '').trim() || '',
    hostProfile: pickHostProfileSummary(raw.hostProfile),
    carrierValidation,
    legacyContractValidation,
    legacyHostContractFacts: raw.legacyHostContractFacts || null,
    legacyContractReady,
    legacyRuntimeSurfaceReady,
    pageTypeDeliveryPolicyRef: legacyDeliveryPolicy.factPath,
    runtimeSurfaceRequiredPageTypes: legacyDeliveryPolicy.runtimeSurfaceRequiredPageTypes,
    runtimeSurfaceOptionalPageTypes: legacyDeliveryPolicy.runtimeSurfaceOptionalPageTypes,
    deferredLegacyPageTypes: legacyDeliveryPolicy.deferredLegacyPageTypes,
    runtimeSurfaceCoveredPageTypes: legacyDeliveryPolicy.runtimeSurfaceCoveredPageTypes,
    missingRuntimeSurfacePageTypes: legacyDeliveryPolicy.missingRuntimeSurfacePageTypes,
    legacyRolloutCoverageStatus: legacyDeliveryPolicy.legacyRolloutCoverageStatus,
    legacyDeliveryPolicy,
    legacyRuntimeSurfaceFacts,
    typicalPageSupport,
    blockingReasons,
  }
}

async function readTextIfExists(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch {
    return ''
  }
}

export async function readProjectIntegrationState(targetRoot) {
  const filePath = getProjectIntegrationStatePath(targetRoot)
  try {
    const raw = JSON.parse(await fs.readFile(filePath, 'utf8'))
    return normalizeProjectIntegrationState(raw)
  } catch {
    return null
  }
}

export async function writeProjectIntegrationState({
  targetRoot,
  mode,
  recommendedMode = '',
  modeSelectionStatus = '',
  overrideReason = '',
  completionGates = null,
  source = 'bootstrap',
  confirmedAt = new Date().toISOString(),
  bootstrapSummary = '',
  projectModeFactPath = '.local-context/hiui-design/outputs/project-mode.json',
  hostProfile = null,
  legacyHostFamilySummary = null,
  legacyDeliveryPolicySummary = null,
  typicalPageSupportSummary = null,
}) {
  const normalizedMode = normalizeModeId(mode)
  if (!normalizedMode) {
    throw new Error(`Cannot persist project integration state without a supported mode. Received: ${mode || '(empty)'}`)
  }

  const carrierValidation = normalizeCarrierValidation(null)
  let legacyContractValidation = summarizeLegacyContractValidation({
    mode: normalizedMode,
    legacyHostFamily: legacyHostFamilySummary,
  })
  const legacyHostContractFacts = await collectLegacyHostContractFacts({
    targetRoot,
    mode: normalizedMode,
  })
  legacyContractValidation = mergeLegacyContractValidationWithHostContractFacts({
    legacyContractValidation,
    legacyHostContractFacts,
    mode: normalizedMode,
  })
  let legacyDeliveryPolicy = normalizeLegacyDeliveryPolicy(
    legacyDeliveryPolicySummary,
    normalizedMode
  )
  const legacyRuntimeSurfaceFacts =
    normalizedMode === 'legacy-host-compatible'
      ? await collectLegacyRuntimeSurfaceFacts({
          targetRoot,
          requiredPageTypes: legacyDeliveryPolicy.runtimeSurfaceRequiredPageTypes,
          optionalPageTypes: legacyDeliveryPolicy.runtimeSurfaceOptionalPageTypes,
        })
      : null
  legacyDeliveryPolicy = mergeLegacyDeliveryPolicyWithRuntimeSurfaceFacts({
    mode: normalizedMode,
    legacyDeliveryPolicy,
    legacyRuntimeSurfaceFacts,
  })
  const runtimeCompatibilityLockFacts = await collectRuntimeCompatibilityLockFacts({
    targetRoot,
    mode: normalizedMode,
  })
  const typicalPageSupport = normalizeTypicalPageSupport(typicalPageSupportSummary)
  const blockingReasons = deriveIntegrationBlockingReasons({
    blockingReasons:
      normalizedMode === 'legacy-host-compatible'
        ? [
            ...legacyContractValidation.blockingReasons,
            ...legacyDeliveryPolicy.blockingReasons,
            ...(runtimeCompatibilityLockFacts?.blockingReasons ?? []),
          ]
        : [],
  })
  const runtimeIntegrationReady = deriveIntegrationReady({
    blockingReasons,
  })
  const normalizedRecommendedMode = normalizeModeId(recommendedMode) || normalizedMode
  const normalizedModeSelectionStatus = normalizeModeSelectionStatus(
    modeSelectionStatus,
    normalizedMode,
    normalizedRecommendedMode
  )
  const normalizedCompletionGates = normalizeCompletionGates(completionGates, {
    mode: normalizedMode,
    runtimeIntegrationReady,
  })
  const onboardingCompletionReady = deriveOnboardingCompletionReady({
    completionGates: normalizedCompletionGates,
    modeSelectionStatus: normalizedModeSelectionStatus,
    runtimeIntegrationReady,
  })
  const integrationReady = onboardingCompletionReady
  const legacyContractReady = deriveLegacyContractReady({
    mode: normalizedMode,
    legacyContractValidation,
  })
  const legacyRuntimeSurfaceReady = deriveLegacyRuntimeSurfaceReady({
    mode: normalizedMode,
    legacyContractValidation,
    legacyDeliveryPolicy,
    legacyRuntimeSurfaceFacts,
  })

  const nextState = {
    schemaVersion: PROJECT_INTEGRATION_STATE_SCHEMA_VERSION,
    status: 'integrated',
    integrationReady,
    runtimeIntegrationReady,
    mode: normalizedMode,
    recommendedMode: normalizedRecommendedMode,
    modeSelectionStatus: normalizedModeSelectionStatus,
    overrideReason: String(overrideReason || '').trim(),
    completionGates: normalizedCompletionGates,
    onboardingCompletionReady,
    source: String(source || '').trim() || 'bootstrap',
    confirmedAt: String(confirmedAt || '').trim() || new Date().toISOString(),
    factPath: PROJECT_INTEGRATION_STATE_RELATIVE_PATH,
    projectModeFactPath: String(projectModeFactPath || '').trim() || '.local-context/hiui-design/outputs/project-mode.json',
    bootstrapSummary: String(bootstrapSummary || '').trim(),
    hostProfile: pickHostProfileSummary(hostProfile),
    carrierValidation,
    legacyContractValidation,
    legacyHostContractFacts,
    legacyContractReady,
    legacyRuntimeSurfaceReady,
    runtimeCompatibilityLockFacts,
    pageTypeDeliveryPolicyRef: legacyDeliveryPolicy.factPath,
    runtimeSurfaceRequiredPageTypes: legacyDeliveryPolicy.runtimeSurfaceRequiredPageTypes,
    runtimeSurfaceOptionalPageTypes: legacyDeliveryPolicy.runtimeSurfaceOptionalPageTypes,
    deferredLegacyPageTypes: legacyDeliveryPolicy.deferredLegacyPageTypes,
    runtimeSurfaceCoveredPageTypes: legacyDeliveryPolicy.runtimeSurfaceCoveredPageTypes,
    missingRuntimeSurfacePageTypes: legacyDeliveryPolicy.missingRuntimeSurfacePageTypes,
    legacyRolloutCoverageStatus: legacyDeliveryPolicy.legacyRolloutCoverageStatus,
    legacyDeliveryPolicy,
    legacyRuntimeSurfaceFacts,
    typicalPageSupport,
    blockingReasons,
  }

  const filePath = getProjectIntegrationStatePath(targetRoot)
  const serialized = `${JSON.stringify(nextState, null, 2)}\n`
  const previous = await readTextIfExists(filePath)

  await fs.mkdir(path.dirname(filePath), { recursive: true })

  if (previous === serialized) {
    return {
      status: 'unchanged',
      filePath,
      relativePath: PROJECT_INTEGRATION_STATE_RELATIVE_PATH,
      state: nextState,
    }
  }

  await fs.writeFile(filePath, serialized, 'utf8')
  if (normalizedMode === 'legacy-host-compatible') {
    const legacySealPath = path.join(targetRoot, LEGACY_INTEGRATION_SEAL_RELATIVE_PATH)
    const legacySeal = {
      schemaVersion: 'legacy-integration-seal.v1',
      mode: normalizedMode,
      source: String(source || '').trim() || 'bootstrap',
      confirmedAt: nextState.confirmedAt,
      factPath: LEGACY_INTEGRATION_SEAL_RELATIVE_PATH,
      projectIntegrationStateRef: PROJECT_INTEGRATION_STATE_RELATIVE_PATH,
      legacyContractReady,
      legacyHostContractFacts,
      legacyRuntimeSurfaceReady,
      pageTypeDeliveryPolicyRef: legacyDeliveryPolicy.factPath,
      runtimeSurfaceRequiredPageTypes: legacyDeliveryPolicy.runtimeSurfaceRequiredPageTypes,
      runtimeSurfaceOptionalPageTypes: legacyDeliveryPolicy.runtimeSurfaceOptionalPageTypes,
      deferredLegacyPageTypes: legacyDeliveryPolicy.deferredLegacyPageTypes,
      runtimeSurfaceCoveredPageTypes: legacyDeliveryPolicy.runtimeSurfaceCoveredPageTypes,
      missingRuntimeSurfacePageTypes: legacyDeliveryPolicy.missingRuntimeSurfacePageTypes,
      legacyRolloutCoverageStatus: legacyDeliveryPolicy.legacyRolloutCoverageStatus,
      legacyRuntimeSurfaceFacts,
      blockingReasons: Array.isArray(legacyDeliveryPolicy.blockingReasons)
        ? legacyDeliveryPolicy.blockingReasons
        : [],
    }
    await fs.mkdir(path.dirname(legacySealPath), { recursive: true })
    await fs.writeFile(legacySealPath, `${JSON.stringify(legacySeal, null, 2)}\n`, 'utf8')
  }
  return {
    status: 'written',
    filePath,
    relativePath: PROJECT_INTEGRATION_STATE_RELATIVE_PATH,
    state: nextState,
  }
}
