import fs from 'fs'
import path from 'path'
import { REPO_ROOT } from './shared.mjs'

const DELIVERY_CONTRACT_VERSION = 'delivery-readiness.v2'
const PROJECT_INTEGRATION_STATE_PATH = path.resolve(
  REPO_ROOT,
  '.local-context/hiui-design/outputs/project-integration-state.json'
)

const COMMON_HOST_ENTRY_FILES = [
  'src/App.jsx',
  'src/App.tsx',
  'src/main.jsx',
  'src/main.tsx',
  'src/routes.jsx',
  'src/routes.tsx',
  'src/router.jsx',
  'src/router.tsx',
  'src/router/index.jsx',
  'src/router/index.tsx',
]

function normalizePath(value) {
  return String(value || '').trim().replace(/\\/g, '/')
}

function readJsonIfExists(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

function readTextIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath)
  } catch {
    return false
  }
}

function relativeEvidencePath(filePath) {
  if (!filePath) return ''
  return normalizePath(path.relative(REPO_ROOT, filePath))
}

function looksLikeFilePath(targetPath) {
  return /\.[cm]?[jt]sx?$/.test(String(targetPath || '').trim())
}

function candidatePageFiles(pageDir) {
  return [
    'index.tsx',
    'index.jsx',
    'index.ts',
    'index.js',
    'page.tsx',
    'page.jsx',
    'page.ts',
    'page.js',
  ].map((entry) => path.resolve(pageDir, entry))
}

function resolveBindingTargetPaths(targetPagePath) {
  const normalizedTarget = normalizePath(targetPagePath)
  const absoluteTarget = path.resolve(REPO_ROOT, normalizedTarget)

  if (fileExists(absoluteTarget)) {
    const stats = fs.statSync(absoluteTarget)
    if (stats.isFile()) {
      return {
        pageFile: absoluteTarget,
        pageDir: path.dirname(absoluteTarget),
      }
    }

    if (stats.isDirectory()) {
      return {
        pageFile: candidatePageFiles(absoluteTarget).find((filePath) => fileExists(filePath)) || '',
        pageDir: absoluteTarget,
      }
    }
  }

  if (looksLikeFilePath(normalizedTarget)) {
    return {
      pageFile: absoluteTarget,
      pageDir: path.dirname(absoluteTarget),
    }
  }

  return {
    pageFile: candidatePageFiles(absoluteTarget).find((filePath) => fileExists(filePath)) || '',
    pageDir: absoluteTarget,
  }
}

function resolveBindingPageType(targetPagePath) {
  const { pageFile, pageDir } = resolveBindingTargetPaths(targetPagePath)
  const evidencePaths = []
  const schemaPath = path.resolve(pageDir, 'page.schema.json')
  const metaPath = path.resolve(pageDir, 'hiui-pagegen.meta.json')
  const schema = fileExists(schemaPath) ? readJsonIfExists(schemaPath) : null
  const meta = fileExists(metaPath) ? readJsonIfExists(metaPath) : null

  if (schema) {
    evidencePaths.push(relativeEvidencePath(schemaPath))
  }

  if (meta) {
    evidencePaths.push(relativeEvidencePath(metaPath))
  }

  const structuredPageType = String(
    schema?.pageType || meta?.pageType || meta?.officialRuntime?.pageId || ''
  ).trim()
  if (structuredPageType) {
    return {
      pageTypeId: structuredPageType,
      evidencePaths,
    }
  }

  const sourceRaw = pageFile ? readTextIfExists(pageFile) : ''
  if (sourceRaw) {
    evidencePaths.push(relativeEvidencePath(pageFile))
  }

  const attrMatch = sourceRaw.match(/data-hiui5-page-type\s*=\s*["']([^"']+)["']/)
  if (attrMatch?.[1]) {
    return {
      pageTypeId: String(attrMatch[1] || '').trim(),
      evidencePaths,
    }
  }

  const markerMatch = sourceRaw.match(/hiui-design page-type:\s*([^\n*]+)/)
  if (markerMatch?.[1]) {
    return {
      pageTypeId: String(markerMatch[1] || '').trim(),
      evidencePaths,
    }
  }

  return {
    pageTypeId: '',
    evidencePaths,
  }
}

function buildImportReferenceNeedles(targetPagePath) {
  const normalizedPagePath = normalizePath(targetPagePath).replace(/\/index\.[cm]?[jt]sx?$/, '')
  const sourceRelativePath = normalizedPagePath.replace(/^src\//, '')

  if (!sourceRelativePath) {
    return []
  }

  return [
    `./${sourceRelativePath}`,
    `./${sourceRelativePath}/index`,
    `../${sourceRelativePath}`,
    `../${sourceRelativePath}/index`,
    `/${sourceRelativePath}`,
    `/${sourceRelativePath}/index`,
  ]
}

function resolveResultVerificationStatus(verifyResult) {
  return String(verifyResult?.status || '').trim() === 'passed' ? 'passed' : 'failed'
}

function normalizeVisualVerificationStatus(visualVerificationResult) {
  const status = String(visualVerificationResult?.status || '').trim()
  return status || 'not-run'
}

function buildReleaseReadyState({ resultReady, bindingStatus, visualVerificationStatus }) {
  if (resultReady.status !== 'ready') {
    return {
      status: 'blocked',
      reason: 'result-verify-not-passed',
      detail: 'release cannot be considered ready before result verification passes',
      unmetConditions: ['result-verification'],
      visualVerificationStatus,
    }
  }

  const unmetConditions = []

  if (bindingStatus.status !== 'ready') {
    unmetConditions.push('legacy-delivery-binding')
  }

  if (visualVerificationStatus !== 'passed') {
    unmetConditions.push('visual-verification')
  }

  if (unmetConditions.length === 0) {
    return {
      status: 'ready',
      reason: 'result-binding-and-visual-verification-ready',
      detail: 'result asset, legacy delivery binding, and release visual gate are all ready',
      unmetConditions,
      visualVerificationStatus,
    }
  }

  return {
    status: 'pending',
    reason:
      unmetConditions.length > 1
        ? 'waiting-for-binding-and-visual-verification'
        : unmetConditions[0] === 'legacy-delivery-binding'
          ? 'waiting-for-legacy-delivery-binding'
          : 'waiting-for-visual-verification',
    detail: 'release still needs all downstream delivery gates to be satisfied',
    unmetConditions,
    visualVerificationStatus,
  }
}

function buildDeliveryReadiness({ bindingStatus, verifyResult, visualVerificationResult }) {
  const verificationStatus = resolveResultVerificationStatus(verifyResult)
  const visualVerificationStatus = normalizeVisualVerificationStatus(visualVerificationResult)
  const resultReady =
    verificationStatus === 'passed'
      ? {
          status: 'ready',
          reason: 'verify-lite-passed',
          detail: 'result asset passed the current structural and rule verification gate',
        }
      : {
          status: 'blocked',
          reason: 'verify-lite-not-passed',
          detail: 'result asset has not yet passed the current structural and rule verification gate',
        }

  return {
    assetReady: {
      status: 'ready',
      reason: 'page-assets-written',
      detail: 'page files and managed companion artifacts were written',
    },
    resultReady,
    bindingReady: {
      status: bindingStatus.status,
      reason: bindingStatus.reason,
      detail: bindingStatus.detail,
      evidencePaths: bindingStatus.evidencePaths,
    },
    releaseReady: buildReleaseReadyState({
      resultReady,
      bindingStatus,
      visualVerificationStatus,
    }),
  }
}

function resolveDeliveryState(deliveryReadiness) {
  if (deliveryReadiness.releaseReady.status === 'ready') {
    return 'release-ready'
  }

  if (
    deliveryReadiness.resultReady.status === 'ready' &&
    deliveryReadiness.bindingReady.status === 'ready'
  ) {
    return 'binding-ready'
  }

  if (deliveryReadiness.resultReady.status === 'ready') {
    return 'result-ready'
  }

  return 'asset-ready'
}

function normalizeWorkflowStatus(value, fallback = 'not-run') {
  const normalized = String(value || '').trim()
  return normalized || fallback
}

function normalizeRuntimeSmokeStatus(value) {
  const normalized = String(value || '').trim()
  return normalized || 'not-required'
}

function buildManagedPageReleaseReadyState({
  resultReady,
  bindingReady,
  sourceGateStatus,
  doctorStatus,
  runtimeSmokeRequired,
  runtimeSmokeStatus,
}) {
  if (resultReady.status !== 'ready') {
    return {
      status: 'blocked',
      reason: 'result-validation-not-passed',
      detail: 'formal delivery cannot be considered ready before the managed page reaches result-ready',
      unmetConditions: ['result-validation'],
    }
  }

  const unmetConditions = []

  if (bindingReady.status !== 'ready') {
    unmetConditions.push('legacy-delivery-binding')
  }

  if (sourceGateStatus !== 'pass') {
    unmetConditions.push('source-gate')
  }

  if (doctorStatus !== 'pass') {
    unmetConditions.push('doctor')
  }

  if (runtimeSmokeRequired && !['pass', 'not-required'].includes(runtimeSmokeStatus)) {
    unmetConditions.push('runtime-smoke')
  }

  if (unmetConditions.length === 0) {
    return {
      status: 'ready',
      reason: 'managed-page-formal-delivery-gates-passed',
      detail: 'managed page has passed result validation, binding, source-gate, doctor, and any required runtime smoke gates',
      unmetConditions,
    }
  }

  return {
    status: 'pending',
    reason: 'waiting-for-managed-page-formal-delivery-gates',
    detail: 'managed page still needs downstream delivery gates before it can be treated as release-ready',
    unmetConditions,
  }
}

export function buildManagedPageDeliveryStatus({
  targetPagePath,
  workflow,
  runtimeSmokeRequired = false,
} = {}) {
  const bindingStatus = resolveDeliveryBindingStatus(targetPagePath)
  const preflightStatus = normalizeWorkflowStatus(workflow?.preflightStatus)
  const sourceGateStatus = normalizeWorkflowStatus(workflow?.sourceGateStatus)
  const doctorStatus = normalizeWorkflowStatus(workflow?.doctorStatus)
  const runtimeSmokeStatus = normalizeRuntimeSmokeStatus(workflow?.runtimeSmokeStatus)

  const resultReady =
    preflightStatus === 'pass'
      ? {
          status: 'ready',
          reason: 'managed-page-preflight-passed',
          detail: 'managed page passed the current result validation gate',
        }
      : {
          status: preflightStatus === 'fail' ? 'blocked' : 'pending',
          reason:
            preflightStatus === 'fail'
              ? 'managed-page-preflight-failed'
              : 'managed-page-preflight-not-passed',
          detail:
            preflightStatus === 'fail'
              ? 'managed page failed the current result validation gate'
              : 'managed page has not yet passed the current result validation gate',
        }

  const bindingReady = {
    status: bindingStatus.status,
    reason: bindingStatus.reason,
    detail: bindingStatus.detail,
    evidencePaths: bindingStatus.evidencePaths,
  }

  const deliveryReadiness = {
    assetReady: {
      status: 'ready',
      reason: 'managed-page-contract-written',
      detail: 'managed page contract and companion artifacts were written',
    },
    bindingReady,
    resultReady,
    releaseReady: buildManagedPageReleaseReadyState({
      resultReady,
      bindingReady,
      sourceGateStatus,
      doctorStatus,
      runtimeSmokeRequired,
      runtimeSmokeStatus,
    }),
  }

  let deliveryState = 'asset-ready'

  if (deliveryReadiness.releaseReady.status === 'ready') {
    deliveryState = 'release-ready'
  } else if (
    deliveryReadiness.resultReady.status === 'ready' &&
    deliveryReadiness.bindingReady.status === 'ready'
  ) {
    deliveryState = 'binding-ready'
  } else if (deliveryReadiness.resultReady.status === 'ready') {
    deliveryState = 'result-ready'
  }

  return {
    deliveryContractVersion: DELIVERY_CONTRACT_VERSION,
    deliveryState,
    deliveryReadiness,
  }
}

function buildHostIntegrationNeedles(targetPagePath) {
  const normalizedPagePath = normalizePath(targetPagePath)
  const trimmedPagePath = normalizedPagePath.replace(/\/index\.[cm]?[jt]sx?$/, '')
  const segments = trimmedPagePath.split('/').filter(Boolean)
  const parentChildPair =
    segments.length >= 2 ? `${segments.at(-2)}/${segments.at(-1)}` : ''

  return [
    normalizedPagePath,
    `${trimmedPagePath}/index`,
    parentChildPair,
    ...buildImportReferenceNeedles(trimmedPagePath),
  ].filter(Boolean)
}

export function resolveDeliveryBindingStatus(targetPagePath) {
  const integrationState = readJsonIfExists(PROJECT_INTEGRATION_STATE_PATH)
  const defaultEvidencePaths = [normalizePath(path.relative(REPO_ROOT, PROJECT_INTEGRATION_STATE_PATH))]

  if (!integrationState) {
    return {
      bindingReady: false,
      status: 'pending',
      reason: 'project-integration-state-missing',
      detail:
        'legacy delivery binding is not ready because project integration state has not been written yet',
      evidencePaths: defaultEvidencePaths,
    }
  }

  const carrierValidation = integrationState.carrierValidation || {}
  const legacyBridgeValidation = integrationState.legacyBridgeValidation || {}
  const bindingPage = resolveBindingPageType(targetPagePath)
  const registryPath = normalizePath(carrierValidation.registryPath)
  const evidencePaths = Array.from(
    new Set([
      ...defaultEvidencePaths,
      registryPath,
      ...(bindingPage.evidencePaths || []),
    ].filter(Boolean))
  )
  const integrationReady = integrationState.integrationReady === true
  const bridgeReady = String(legacyBridgeValidation.status || '').trim() === 'ready'
  const carrierReady = ['ready', 'not-applicable'].includes(
    String(carrierValidation.status || '').trim()
  )
  const requiredLegacyPageTypes = Array.isArray(integrationState.requiredLegacyPageTypes)
    ? integrationState.requiredLegacyPageTypes.map((pageTypeId) => String(pageTypeId || '').trim()).filter(Boolean)
    : []
  const certifiedLegacyPageTypes = Array.isArray(integrationState.certifiedLegacyPageTypes)
    ? integrationState.certifiedLegacyPageTypes.map((pageTypeId) => String(pageTypeId || '').trim()).filter(Boolean)
    : []
  const missingRequiredLegacyPageTypes = Array.isArray(integrationState.missingRequiredLegacyPageTypes)
    ? integrationState.missingRequiredLegacyPageTypes.map((pageTypeId) => String(pageTypeId || '').trim()).filter(Boolean)
    : []
  const legacyCoverageRequired =
    String(integrationState.mode || '').trim() === 'legacy-host-compatible' ||
    requiredLegacyPageTypes.length > 0 ||
    certifiedLegacyPageTypes.length > 0 ||
    missingRequiredLegacyPageTypes.length > 0

  if (legacyCoverageRequired && !bindingPage.pageTypeId) {
    return {
      bindingReady: false,
      status: 'pending',
      reason: 'legacy-delivery-binding-page-type-unresolved',
      detail:
        'legacy delivery binding cannot be treated as ready until the current page resolves a unique page type from page.schema.json, hiui-pagegen.meta.json, or managed source markers',
      evidencePaths,
    }
  }

  if (
    bindingPage.pageTypeId &&
    requiredLegacyPageTypes.includes(bindingPage.pageTypeId) &&
    !certifiedLegacyPageTypes.includes(bindingPage.pageTypeId)
  ) {
    return {
      bindingReady: false,
      status: 'pending',
      reason: 'legacy-delivery-binding-page-type-not-certified',
      detail:
        'legacy delivery binding is not ready because the current page type is still missing a certified delivery-binding proof in project integration state',
      evidencePaths,
    }
  }

  const bindingReady = integrationReady && bridgeReady && carrierReady

  return {
    bindingReady,
    status: bindingReady ? 'ready' : 'pending',
    reason: bindingReady
      ? 'integration-state-certifies-legacy-delivery-binding'
      : integrationReady
        ? 'legacy-delivery-binding-proof-missing'
        : 'project-integration-not-ready',
    detail: bindingReady
      ? 'legacy delivery binding is backed by project integration state and certified delivery plugin facts'
      : 'legacy delivery binding still lacks a closed integration-state proof; route grep is no longer treated as evidence',
    evidencePaths,
  }
}

export function buildGenerationDeliveryStatus({
  targetPagePath,
  verifyResult,
  visualVerificationResult,
} = {}) {
  const bindingStatus = resolveDeliveryBindingStatus(targetPagePath)
  const deliveryReadiness = buildDeliveryReadiness({
    bindingStatus,
    verifyResult,
    visualVerificationResult,
  })

  return {
    deliveryContractVersion: DELIVERY_CONTRACT_VERSION,
    deliveryState: resolveDeliveryState(deliveryReadiness),
    deliveryReadiness,
  }
}
