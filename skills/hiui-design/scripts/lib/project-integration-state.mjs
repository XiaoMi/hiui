import fs from 'node:fs/promises'
import path from 'node:path'
import { legacyHostFamilyGate } from './legacy-page-component-bridge.mjs'

export const PROJECT_INTEGRATION_STATE_SCHEMA_VERSION = 'hiui-project-integration-state.v1'
export const PROJECT_INTEGRATION_STATE_RELATIVE_PATH =
  '.local-context/hiui-design/outputs/project-integration-state.json'
export const LEGACY_INTEGRATION_SEAL_RELATIVE_PATH =
  '.local-context/hiui-design/outputs/legacy-integration-seal.json'
const PROJECT_PAGE_COMPONENT_REGISTRY_RELATIVE_PATH =
  '.local-context/hiui-design/outputs/project-page-component-registry.json'

function normalizeModeId(mode) {
  const value = String(mode || '').trim()
  if (value === 'host-compatible') return 'legacy-host-compatible'
  if (['host-integration', 'rules-only', 'legacy-host-compatible'].includes(value)) {
    return value
  }
  return ''
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

async function validateCertifiedProjectCarrier({ targetRoot, component }) {
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
    const result = await validateCertifiedProjectCarrier({ targetRoot, component })
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
      carrierReady: null,
      carrierFirstRequiredPageTypes: [],
      directStandardAllowedPageTypes: [],
      pageTypes: [],
      blockingReasons: [],
    }
  }

  return {
    status: 'not-applicable',
    factPath: '',
    carrierReady: false,
    carrierFirstRequiredPageTypes: [],
    directStandardAllowedPageTypes: [],
    pageTypes: [],
    blockingReasons: [],
  }
}

function normalizeLegacyDeliveryPolicy(raw, mode = '') {
  if (!raw || typeof raw !== 'object') {
    return defaultLegacyDeliveryPolicy(mode)
  }

  const fallback = defaultLegacyDeliveryPolicy(mode)
  const normalizeIds = (value) =>
    Array.isArray(value) ? value.map((item) => String(item || '').trim()).filter(Boolean) : []

  return {
    status: ['ready', 'blocked', 'not-applicable'].includes(String(raw.status || '').trim())
      ? String(raw.status || '').trim()
      : fallback.status,
    factPath: String(raw.factPath || '').trim(),
    carrierReady:
      typeof raw.carrierReady === 'boolean'
        ? raw.carrierReady
        : fallback.carrierReady,
    carrierFirstRequiredPageTypes: normalizeIds(raw.carrierFirstRequiredPageTypes),
    directStandardAllowedPageTypes: normalizeIds(raw.directStandardAllowedPageTypes),
    pageTypes: Array.isArray(raw.pageTypes)
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
      : [],
    blockingReasons: Array.isArray(raw.blockingReasons)
      ? raw.blockingReasons.map((reason) => String(reason || '').trim()).filter(Boolean)
      : fallback.blockingReasons,
  }
}

function defaultLegacyBridgeValidation(mode = '') {
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
    status: 'blocked',
    hostFamilyStatus: 'missing',
    hostFamilyId: '',
    adapterPackId: '',
    confidence: '',
    missingFacts: ['legacy-host-family'],
    blockingReasons: [
      'legacy bridge validation is missing from project integration state; rerun bootstrap-target-project to certify legacy host family readiness',
    ],
  }
}

function summarizeLegacyBridgeValidation({ mode, legacyHostFamily = null }) {
  const normalizedMode = normalizeModeId(mode)
  if (normalizedMode !== 'legacy-host-compatible') {
    return defaultLegacyBridgeValidation(normalizedMode)
  }

  const gate = legacyHostFamilyGate({
    mode: normalizedMode,
    legacyHostFamily,
  })

  return {
    status: gate.allowed ? 'ready' : 'blocked',
    hostFamilyStatus: String(legacyHostFamily?.status || '').trim() || (gate.allowed ? 'matched' : 'unmatched'),
    hostFamilyId: String(legacyHostFamily?.hostFamilyId || '').trim(),
    adapterPackId: String(legacyHostFamily?.adapterPackId || '').trim(),
    confidence: String(legacyHostFamily?.confidence || '').trim(),
    missingFacts: Array.isArray(legacyHostFamily?.missingFacts)
      ? legacyHostFamily.missingFacts.map((fact) => String(fact || '').trim()).filter(Boolean)
      : [],
    blockingReasons: gate.allowed
      ? []
      : uniqueBlockingReasons([
          ...(Array.isArray(legacyHostFamily?.blockingReasons) ? legacyHostFamily.blockingReasons : []),
          gate.reason,
        ]),
  }
}

function normalizeLegacyBridgeValidation(raw, mode = '') {
  if (!raw || typeof raw !== 'object') {
    return defaultLegacyBridgeValidation(mode)
  }

  const fallback = defaultLegacyBridgeValidation(mode)
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

function integrationUsesLegacyCarrierValidation(mode) {
  return normalizeModeId(mode) === 'legacy-host-compatible'
}

function filterExplicitIntegrationBlockingReasons({
  blockingReasons = [],
  carrierValidation,
  legacyBridgeValidation,
  typicalPageSupport,
}) {
  const derivedReasons = new Set([
    ...(carrierValidation?.blockingReasons || []),
    ...(legacyBridgeValidation?.blockingReasons || []),
    ...typicalPageSupportBlockingReasons(typicalPageSupport),
  ])

  return uniqueBlockingReasons(
    blockingReasons.filter((reason) => !derivedReasons.has(String(reason || '').trim()))
  )
}

function deriveIntegrationBlockingReasons({
  mode,
  blockingReasons = [],
  carrierValidation,
  legacyBridgeValidation,
}) {
  return uniqueBlockingReasons([
    ...blockingReasons,
    ...(integrationUsesLegacyCarrierValidation(mode) ? carrierValidation?.blockingReasons || [] : []),
    ...(integrationUsesLegacyCarrierValidation(mode) ? legacyBridgeValidation?.blockingReasons || [] : []),
  ])
}

function deriveIntegrationReady({
  mode,
  blockingReasons = [],
  carrierValidation,
  legacyBridgeValidation,
}) {
  if (blockingReasons.length > 0) {
    return false
  }

  if (integrationUsesLegacyCarrierValidation(mode) && carrierValidation?.status === 'blocked') {
    return false
  }

  if (integrationUsesLegacyCarrierValidation(mode) && legacyBridgeValidation?.status === 'blocked') {
    return false
  }

  return true
}

function deriveLegacyRuntimeReady({ mode, legacyBridgeValidation }) {
  if (normalizeModeId(mode) !== 'legacy-host-compatible') {
    return null
  }

  return legacyBridgeValidation?.status === 'ready'
}

function deriveLegacyCarrierReady({ mode, carrierValidation, legacyDeliveryPolicy }) {
  if (normalizeModeId(mode) !== 'legacy-host-compatible') {
    return null
  }

  if (legacyDeliveryPolicy?.status === 'ready' || legacyDeliveryPolicy?.status === 'blocked') {
    return Boolean(legacyDeliveryPolicy?.carrierReady)
  }

  return carrierValidation?.status === 'ready'
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
  const legacyBridgeValidation = normalizeLegacyBridgeValidation(raw.legacyBridgeValidation, mode)
  const typicalPageSupport = normalizeTypicalPageSupport(raw.typicalPageSupport)
  const legacyDeliveryPolicy = normalizeLegacyDeliveryPolicy(raw.legacyDeliveryPolicy, mode)
  const explicitBlockingReasons = filterExplicitIntegrationBlockingReasons({
    blockingReasons: Array.isArray(raw.blockingReasons) ? raw.blockingReasons : [],
    carrierValidation,
    legacyBridgeValidation,
    typicalPageSupport,
  })
  const blockingReasons = deriveIntegrationBlockingReasons({
    mode,
    blockingReasons: explicitBlockingReasons,
    carrierValidation,
    legacyBridgeValidation,
  })
  const integrationReady = deriveIntegrationReady({
    mode,
    blockingReasons,
    carrierValidation,
    legacyBridgeValidation,
  })
  const legacyRuntimeReady = deriveLegacyRuntimeReady({ mode, legacyBridgeValidation })
  const legacyCarrierReady = deriveLegacyCarrierReady({
    mode,
    carrierValidation,
    legacyDeliveryPolicy,
  })

  return {
    schemaVersion: PROJECT_INTEGRATION_STATE_SCHEMA_VERSION,
    status: 'integrated',
    integrationReady,
    mode,
    recommendedMode: normalizeModeId(raw.recommendedMode) || mode,
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
    legacyBridgeValidation,
    legacyRuntimeReady,
    legacyCarrierReady,
    pageTypeDeliveryPolicyRef: legacyDeliveryPolicy.factPath,
    carrierFirstRequiredPageTypes: legacyDeliveryPolicy.carrierFirstRequiredPageTypes,
    directStandardAllowedPageTypes: legacyDeliveryPolicy.directStandardAllowedPageTypes,
    legacyDeliveryPolicy,
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

  const carrierValidation = await validateProjectCertifiedCarriers({ targetRoot })
  const legacyBridgeValidation = summarizeLegacyBridgeValidation({
    mode: normalizedMode,
    legacyHostFamily: legacyHostFamilySummary,
  })
  const legacyDeliveryPolicy = normalizeLegacyDeliveryPolicy(
    legacyDeliveryPolicySummary,
    normalizedMode
  )
  const typicalPageSupport = normalizeTypicalPageSupport(typicalPageSupportSummary)
  const integrationReady = deriveIntegrationReady({
    mode: normalizedMode,
    blockingReasons: [],
    carrierValidation,
    legacyBridgeValidation,
  })
  const blockingReasons = deriveIntegrationBlockingReasons({
    mode: normalizedMode,
    blockingReasons: [],
    carrierValidation,
    legacyBridgeValidation,
  })
  const legacyRuntimeReady = deriveLegacyRuntimeReady({
    mode: normalizedMode,
    legacyBridgeValidation,
  })
  const legacyCarrierReady = deriveLegacyCarrierReady({
    mode: normalizedMode,
    carrierValidation,
    legacyDeliveryPolicy,
  })

  const nextState = {
    schemaVersion: PROJECT_INTEGRATION_STATE_SCHEMA_VERSION,
    status: 'integrated',
    integrationReady,
    mode: normalizedMode,
    recommendedMode: normalizeModeId(recommendedMode) || normalizedMode,
    source: String(source || '').trim() || 'bootstrap',
    confirmedAt: String(confirmedAt || '').trim() || new Date().toISOString(),
    factPath: PROJECT_INTEGRATION_STATE_RELATIVE_PATH,
    projectModeFactPath: String(projectModeFactPath || '').trim() || '.local-context/hiui-design/outputs/project-mode.json',
    bootstrapSummary: String(bootstrapSummary || '').trim(),
    hostProfile: pickHostProfileSummary(hostProfile),
    carrierValidation,
    legacyBridgeValidation,
    legacyRuntimeReady,
    legacyCarrierReady,
    pageTypeDeliveryPolicyRef: legacyDeliveryPolicy.factPath,
    carrierFirstRequiredPageTypes: legacyDeliveryPolicy.carrierFirstRequiredPageTypes,
    directStandardAllowedPageTypes: legacyDeliveryPolicy.directStandardAllowedPageTypes,
    legacyDeliveryPolicy,
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
      legacyRuntimeReady,
      legacyCarrierReady,
      pageTypeDeliveryPolicyRef: legacyDeliveryPolicy.factPath,
      carrierFirstRequiredPageTypes: legacyDeliveryPolicy.carrierFirstRequiredPageTypes,
      directStandardAllowedPageTypes: legacyDeliveryPolicy.directStandardAllowedPageTypes,
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
