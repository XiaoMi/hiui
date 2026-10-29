import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { inspectIntegrationReadiness } from './integration-readiness.mjs'
import { isRecognizedInstallMode } from './mode-contract.mjs'
import {
  DEFAULT_FORBIDDEN_ACTIONS,
  INTEGRATION_BLOCKED_ALLOWED_ACTIONS,
  PAGE_TASK_NEXT_STAGE,
  PAGE_TASK_READINESS,
  PAGE_TASK_GATE_BLOCKED_ALLOWED_ACTIONS,
  markPageTaskEnsureOnly,
  markPageTaskReadyToGenerate,
  readProjectPageTaskStatus,
  resolvePageTaskNextStage,
  resolveProjectPageTaskStatusPath,
} from './page-task-status.mjs'
import { evaluateProjectGenerationReadiness } from './generation-readiness.mjs'
import {
  getManagedHostContractCandidatePaths,
  inspectManagedHostContract,
} from './managed-host-contract.mjs'
import {
  readProjectHostContract,
  refreshProjectHostContractFingerprint,
  writeProjectHostContract,
} from './project-host-contract.mjs'
import {
  PROJECT_HOST_CONTRACT_FILENAME,
  resolveExistingProjectContextPath,
  resolveProjectContextPath,
} from './skill-identity.mjs'

export const READY_ALLOWED_ACTIONS = []
export const READY_FORBIDDEN_ACTIONS = []
export const WARM_REFRESHABLE_NAVIGATION_MOUNT_ACTIONS = [
  'append-existing-registry',
  'materialize-implicit-feature-entry',
  'materialize-mf-publish-entry',
]
const LOCKFILE_CANDIDATES = ['pnpm-lock.yaml', 'yarn.lock', 'package-lock.json', 'bun.lockb', 'bun.lock']
const ENTRY_FILE_CANDIDATES = [
  'src/main.tsx',
  'src/main.jsx',
  'src/main.ts',
  'src/main.js',
  'src/index.tsx',
  'src/index.jsx',
  'src/index.ts',
  'src/index.js',
]
const BUILD_CONFIG_CANDIDATES = [
  'vite.config.ts',
  'vite.config.mts',
  'vite.config.js',
  'vite.config.mjs',
  'vite.config.cjs',
  'vite.config.cts',
  'build/rspack.base.conf.js',
  'build/rspack.base.conf.ts',
]
const LEGACY_FORMAL_HOST_CONTRACT_CANDIDATES = [
  'src/business-shell/app-frame.tsx',
  'src/business-shell/app-frame.ts',
  'src/business-shell/app-frame.jsx',
  'src/business-shell/app-frame.js',
  'src/business-layout/app-frame.tsx',
  'src/business-layout/app-frame.ts',
  'src/business-layout/app-frame.jsx',
  'src/business-layout/app-frame.js',
]
const MANAGED_HOST_CONTRACT_CANDIDATES = getManagedHostContractCandidatePaths()

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeRelativePath(value) {
  return normalizeString(value).replace(/\\/g, '/').replace(/^\.\//, '')
}

function buildContractSnapshotId(projectHostContract = null, pageTaskStatus = null) {
  return (
    normalizeString(projectHostContract?.fingerprint?.value) ||
    normalizeString(projectHostContract?.generatedAt) ||
    normalizeString(pageTaskStatus?.contractSnapshotId)
  )
}

function uniqueRelativePaths(values = []) {
  return [
    ...new Set(
      (Array.isArray(values) ? values : [values]).map((item) => normalizeRelativePath(item)).filter(Boolean)
    ),
  ]
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readPackageJson(targetRoot) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  if (!(await pathExists(packageJsonPath))) return null
  return JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
}

async function firstExistingPath(targetRoot, candidates) {
  for (const relativePath of candidates) {
    const absolutePath = path.join(targetRoot, relativePath)
    if (await pathExists(absolutePath)) return absolutePath
  }

  return ''
}

async function hashFileOrMissing(targetPath) {
  if (!targetPath || !(await pathExists(targetPath))) return 'missing'
  const content = await fs.readFile(targetPath)
  return createHash('sha256').update(content).digest('hex')
}

async function hashProjectFiles(targetRoot, relativePaths = []) {
  const normalizedRelativePaths = [
    ...new Set(
      relativePaths
        .map((relativePath) => String(relativePath || '').trim().replace(/\\/g, '/'))
        .filter(Boolean)
    ),
  ].sort()

  if (normalizedRelativePaths.length === 0) return 'missing'

  const hash = createHash('sha256')
  let includedFileCount = 0

  for (const relativePath of normalizedRelativePaths) {
    const absolutePath = path.join(targetRoot, relativePath)
    if (!(await pathExists(absolutePath))) continue
    const stat = await fs.stat(absolutePath).catch(() => null)
    if (!stat?.isFile()) continue
    hash.update(`file:${relativePath}\n`)
    hash.update(await fs.readFile(absolutePath))
    hash.update('\n')
    includedFileCount += 1
  }

  return includedFileCount > 0 ? hash.digest('hex') : 'missing'
}

function normalizeManagedHostContractFreshnessPaths(managedHostContract = {}) {
  if (managedHostContract.status === 'valid') {
    return Array.isArray(managedHostContract.evidenceFiles)
      ? managedHostContract.evidenceFiles
      : []
  }

  if (managedHostContract.status !== 'invalid') return []

  const declaredContractPaths = [
    managedHostContract.contractRelativePath,
    managedHostContract.contract?.shellPath,
    managedHostContract.contract?.corePath,
    managedHostContract.contract?.hostResetPath,
    managedHostContract.contract?.publishEntryPath,
  ]

  return declaredContractPaths.map((item) => String(item || '').trim()).filter(Boolean)
}

async function collectFormalHostFreshnessSnapshot(targetRoot, options = {}) {
  const managedHostContract = await inspectManagedHostContract(targetRoot, {
    hostProfile: options?.hostProfile || null,
  })
  const managedHostFreshnessPaths = normalizeManagedHostContractFreshnessPaths(managedHostContract)

  if (managedHostFreshnessPaths.length > 0) {
    return {
      hostContractHash: await hashProjectFiles(targetRoot, managedHostFreshnessPaths),
      hostContractSource: managedHostContract.status === 'valid' ? 'managed-host-contract' : 'managed-host-contract-invalid',
    }
  }

  const managedHostContractPath = await firstExistingPath(targetRoot, MANAGED_HOST_CONTRACT_CANDIDATES)
  if (managedHostContractPath) {
    return {
      hostContractHash: await hashFileOrMissing(managedHostContractPath),
      hostContractSource: 'managed-host-contract-unparsed',
    }
  }

  const legacyHostContractPath = await firstExistingPath(targetRoot, LEGACY_FORMAL_HOST_CONTRACT_CANDIDATES)
  return legacyHostContractPath
    ? {
        hostContractHash: await hashFileOrMissing(legacyHostContractPath),
        hostContractSource: 'legacy-formal-host-shell',
      }
    : {
        hostContractHash: 'no-formal-host-contract',
        hostContractSource: 'none',
      }
}

async function collectProjectHostContractFreshnessSnapshot(targetRoot, options = {}) {
  const projectHostContractPath = resolveProjectContextPath(
    targetRoot,
    'outputs',
    PROJECT_HOST_CONTRACT_FILENAME
  )
  const projectHostContract = Object.prototype.hasOwnProperty.call(options, 'projectHostContract')
    ? options.projectHostContract
    : await readProjectHostContract(targetRoot)
  const evidenceFiles = uniqueRelativePaths(projectHostContract?.evidenceFiles || [])

  return {
    projectHostContractHash: await hashFileOrMissing(projectHostContractPath),
    projectHostContractFingerprintValue: normalizeString(projectHostContract?.fingerprint?.value),
    projectHostContractFingerprintSource: normalizeString(projectHostContract?.fingerprint?.source),
    projectHostContractEvidenceHash:
      evidenceFiles.length > 0 ? await hashProjectFiles(targetRoot, evidenceFiles) : 'missing',
  }
}

function normalizeInstallMode(mode) {
  const normalized = String(mode || '').trim()
  return isRecognizedInstallMode(normalized, { allowAuto: false }) ? normalized : ''
}

function normalizeWrittenProjectPaths(targetRoot, writtenFiles = []) {
  return uniqueRelativePaths(
    (Array.isArray(writtenFiles) ? writtenFiles : [writtenFiles]).flatMap((item) => {
      if (!item) return []

      if (typeof item === 'string') {
        const normalizedItem = normalizeRelativePath(item)
        if (!normalizedItem) return []
        if (path.isAbsolute(item)) {
          const relativePath = normalizeRelativePath(path.relative(targetRoot, item))
          return relativePath && !relativePath.startsWith('..') ? [relativePath] : []
        }
        return normalizedItem.startsWith('..') ? [] : [normalizedItem]
      }

      const destPath = normalizeString(item.destPath)
      if (!destPath) return []
      const relativePath = normalizeRelativePath(
        path.isAbsolute(destPath) ? path.relative(targetRoot, destPath) : destPath
      )
      return relativePath && !relativePath.startsWith('..') ? [relativePath] : []
    })
  )
}

async function collectWarmRefreshProtectedPaths(targetRoot, options = {}) {
  const protectedPaths = new Set([
    'package.json',
    '.local-context/hiui-design/.context.jsonc',
    normalizeRelativePath(
      path.relative(
        targetRoot,
        resolveProjectContextPath(targetRoot, 'outputs', PROJECT_HOST_CONTRACT_FILENAME)
      )
    ),
  ])
  const lockfilePath = await firstExistingPath(targetRoot, LOCKFILE_CANDIDATES)
  const entryFilePath = await firstExistingPath(targetRoot, ENTRY_FILE_CANDIDATES)
  const buildConfigPath = await firstExistingPath(targetRoot, BUILD_CONFIG_CANDIDATES)

  for (const absolutePath of [lockfilePath, entryFilePath, buildConfigPath]) {
    if (!absolutePath) continue
    protectedPaths.add(normalizeRelativePath(path.relative(targetRoot, absolutePath)))
  }

  const managedHostContract = await inspectManagedHostContract(targetRoot, {
    hostProfile: options?.hostProfile || null,
  })
  for (const contractPath of [
    managedHostContract?.contractRelativePath,
    managedHostContract?.contract?.shellPath,
    managedHostContract?.contract?.corePath,
    managedHostContract?.contract?.hostResetPath,
  ]) {
    const normalizedPath = normalizeRelativePath(contractPath)
    if (normalizedPath) protectedPaths.add(normalizedPath)
  }

  const legacyHostContractPath = await firstExistingPath(targetRoot, LEGACY_FORMAL_HOST_CONTRACT_CANDIDATES)
  if (legacyHostContractPath) {
    protectedPaths.add(normalizeRelativePath(path.relative(targetRoot, legacyHostContractPath)))
  }

  return protectedPaths
}

function isWarmRefreshableNavigationMountAction(action = '') {
  return WARM_REFRESHABLE_NAVIGATION_MOUNT_ACTIONS.includes(normalizeString(action))
}

export async function detectProjectPackageManager(targetRoot) {
  const pkg = await readPackageJson(targetRoot)
  const packageManager = typeof pkg?.packageManager === 'string' ? pkg.packageManager.trim() : ''

  if (packageManager.startsWith('pnpm@')) return 'pnpm'
  if (packageManager.startsWith('yarn@')) return 'yarn'
  if (packageManager.startsWith('npm@')) return 'npm'
  if (packageManager.startsWith('bun@')) return 'bun'

  const lockfileManagers = [
    ['pnpm-lock.yaml', 'pnpm'],
    ['yarn.lock', 'yarn'],
    ['package-lock.json', 'npm'],
    ['bun.lockb', 'bun'],
    ['bun.lock', 'bun'],
  ]

  for (const [filename, manager] of lockfileManagers) {
    if (await pathExists(path.join(targetRoot, filename))) return manager
  }

  return 'npm'
}

export function buildProjectRunScriptCommand(packageManager, scriptName) {
  if (packageManager === 'pnpm') return `pnpm run ${scriptName}`
  if (packageManager === 'yarn') return `yarn ${scriptName}`
  if (packageManager === 'bun') return `bun run ${scriptName}`
  return `npm run ${scriptName}`
}

export function buildProjectRunScriptCommandWithArgs(packageManager, scriptName, args = []) {
  const baseCommand = buildProjectRunScriptCommand(packageManager, scriptName)
  const normalizedArgs = Array.isArray(args)
    ? args.map((arg) => String(arg || '').trim()).filter(Boolean)
    : [String(args || '').trim()].filter(Boolean)

  if (normalizedArgs.length === 0) {
    return baseCommand
  }

  const separator = packageManager === 'npm' ? ' -- ' : ' '
  return `${baseCommand}${separator}${normalizedArgs.join(' ')}`
}

export function buildExternalEnsureCommand({ targetRoot, skillRoot }) {
  return `node ${JSON.stringify(path.join(skillRoot, 'scripts', 'ensure-in-current-project.mjs'))} --target ${JSON.stringify(targetRoot)}`
}

export async function buildEnsureCommand({ targetRoot, skillRoot, integrationReadiness }) {
  const packageManager = await detectProjectPackageManager(targetRoot)
  const projectLocalCommand = buildProjectRunScriptCommand(packageManager, 'typical-page:ensure')

  return integrationReadiness?.status === 'missing-context'
    ? buildExternalEnsureCommand({ targetRoot, skillRoot })
    : projectLocalCommand
}

export function buildDoctorCommand({ packageManager, mode = '' }) {
  const effectiveMode = normalizeInstallMode(mode) || 'rules-only'
  return buildProjectRunScriptCommandWithArgs(packageManager, 'typical-page:doctor', [
    '--mode',
    effectiveMode,
  ])
}

export function buildPreflightCommand({ packageManager, mode = '' }) {
  const effectiveMode = normalizeInstallMode(mode) || 'rules-only'
  return buildProjectRunScriptCommandWithArgs(packageManager, 'typical-page:preflight', [
    '--mode',
    effectiveMode,
  ])
}

function buildIntegrationEnsureOnlyReason(mode) {
  const modeLabel = normalizeInstallMode(mode) || 'current'
  return `hiui-design integration is ready in ${modeLabel} mode, but page-task generation stays blocked until typical-page:preflight passes.`
}

function normalizeDoctorAssessmentDimension(dimension = {}) {
  return {
    status: String(dimension?.status || '').trim(),
    failedCheckIds: Array.isArray(dimension?.failedCheckIds)
      ? dimension.failedCheckIds.map((item) => String(item || '').trim()).filter(Boolean)
      : [],
    summary: String(dimension?.summary || '').trim(),
  }
}

function normalizeDoctorAssessment(doctorAssessment = {}) {
  return {
    runtimeBaseline: normalizeDoctorAssessmentDimension(doctorAssessment?.runtimeBaseline),
    layoutContract: normalizeDoctorAssessmentDimension(doctorAssessment?.layoutContract),
    decision: String(doctorAssessment?.decision || '').trim(),
  }
}

function shouldDoctorCloseReadyPageTaskGate({ doctorStatus = '', doctorAssessment = null } = {}) {
  const normalizedDoctorStatus = String(doctorStatus || '').trim()
  const normalizedAssessment = normalizeDoctorAssessment(doctorAssessment)
  const runtimeBaselineStatus = normalizedAssessment.runtimeBaseline.status

  if (runtimeBaselineStatus === 'fail' || runtimeBaselineStatus === 'blocked') {
    return true
  }

  return normalizedDoctorStatus === 'fail' && !runtimeBaselineStatus
}

function buildDoctorBlockingReason(doctor = {}) {
  const decision = String(doctor?.assessment?.decision || '').trim()
  if (decision) return decision

  const runtimeSummary = String(doctor?.assessment?.runtimeBaseline?.summary || '').trim()
  if (runtimeSummary) {
    return `typical-page doctor recorded blocking runtime-baseline findings. ${runtimeSummary}`
  }

  return (
    'typical-page doctor recorded blocking runtime-baseline findings. Fix the blocking doctor findings ' +
    'before reopening the page-task gate with typical-page:preflight.'
  )
}

function buildPreflightBlockedReason(generationReadiness = {}) {
  return (
    generationReadiness.reason ||
    generationReadiness.hostCompatibility?.reason ||
    'typical-page preflight blocked page generation. Complete the project generation readiness baseline and rerun preflight before starting any hiui-design page task.'
  )
}

function buildGenerationReadinessNextCommand({ packageManager, mode, generationReadiness = {} }) {
  const legacyReactCompatibilityClosure = generationReadiness?.legacyReactCompatibilityClosure
  if (
    legacyReactCompatibilityClosure?.status === 'needs-closure' &&
    legacyReactCompatibilityClosure.autofixAvailable === true
  ) {
    return buildProjectRunScriptCommand(packageManager, 'typical-page:legacy-react-compat')
  }

  if (legacyReactCompatibilityClosure?.status === 'needs-closure') {
    return ''
  }

  return buildPreflightCommand({ packageManager, mode })
}

function buildGenerationReadinessRequiredManualActions(generationReadiness = {}) {
  const legacyReactCompatibilityClosure = generationReadiness?.legacyReactCompatibilityClosure
  if (legacyReactCompatibilityClosure?.status !== 'needs-closure') return []
  if (legacyReactCompatibilityClosure.autofixAvailable === true) return []

  return Array.isArray(legacyReactCompatibilityClosure.recommendedSteps)
    ? legacyReactCompatibilityClosure.recommendedSteps
    : []
}

function buildGenerationReadinessRecommendedSteps({ packageManager, mode, generationReadiness = {} }) {
  const requiredManualActions = buildGenerationReadinessRequiredManualActions(generationReadiness)
  if (requiredManualActions.length === 0) return []

  return [...requiredManualActions, `完成后重新运行 ${buildPreflightCommand({ packageManager, mode })} 复核页面门禁。`]
}

function buildPreflightSuccessReason(mode, generationReadiness = {}) {
  const modeLabel = normalizeInstallMode(mode) || 'current'
  if (generationReadiness.officialHostSourceRequired) {
    return `typical-page preflight passed for ${modeLabel} mode. Project generation readiness is complete, including the official host-shell source required for the first formal business shell.`
  }

  if (generationReadiness.hostCompatibility?.riskLevel === 'high') {
    return `typical-page preflight passed for ${modeLabel} mode on a high-risk legacy host. The project generation readiness baseline is in place and hiui-design page generation can proceed.`
  }

  return `typical-page preflight passed for ${modeLabel} mode. Project generation readiness is in place and hiui-design page generation can proceed.`
}

function toFreshnessSnapshot(reportSnapshot = {}) {
  return {
    packageJsonHash: String(reportSnapshot.packageJsonHash || '').trim(),
    lockfileHash: String(reportSnapshot.lockfileHash || '').trim(),
  }
}

function toDoctorSnapshot({ doctorStatus, reportSnapshot, doctorAssessment = null }) {
  return {
    lastRunAt: String(reportSnapshot?.generatedAt || '').trim(),
    lastStatus: String(doctorStatus || '').trim() || 'unknown',
    assessment: normalizeDoctorAssessment(doctorAssessment),
  }
}

function normalizeIntegrationReadiness(integrationReadiness = {}, mode = '') {
  const appliedMode = normalizeInstallMode(mode) || normalizeInstallMode(integrationReadiness.appliedMode)
  return {
    ...integrationReadiness,
    ready: Boolean(integrationReadiness.ready),
    status: String(integrationReadiness.status || '').trim(),
    appliedMode,
  }
}

function applyGenerationReadinessSnapshots(integrationReadiness = {}, generationReadiness = {}) {
  if (!generationReadiness?.hostCompatibility) {
    return integrationReadiness
  }

  return {
    ...integrationReadiness,
    hostCompatibility: {
      ...(integrationReadiness.hostCompatibility || {}),
      ...JSON.parse(JSON.stringify(generationReadiness.hostCompatibility)),
    },
  }
}

export async function collectPageTaskFreshnessSnapshot(targetRoot, options = {}) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  const lockfilePath = await firstExistingPath(targetRoot, LOCKFILE_CANDIDATES)
  const entryFilePath = await firstExistingPath(targetRoot, ENTRY_FILE_CANDIDATES)
  const buildConfigPath = await firstExistingPath(targetRoot, BUILD_CONFIG_CANDIDATES)
  const contextPath = await resolveExistingProjectContextPath(targetRoot, '.context.jsonc')
  const formalHostFreshness = await collectFormalHostFreshnessSnapshot(targetRoot, {
    hostProfile: options?.hostProfile || null,
  })
  const projectHostContractFreshness = await collectProjectHostContractFreshnessSnapshot(
    targetRoot,
    Object.prototype.hasOwnProperty.call(options, 'projectHostContract')
      ? { projectHostContract: options.projectHostContract }
      : {}
  )

  return {
    packageJsonHash: await hashFileOrMissing(packageJsonPath),
    lockfileHash: await hashFileOrMissing(lockfilePath),
    entryFileHash: await hashFileOrMissing(entryFilePath),
    buildConfigHash: await hashFileOrMissing(buildConfigPath),
    contextHash: await hashFileOrMissing(contextPath),
    hostContractHash: formalHostFreshness.hostContractHash,
    hostContractSource: formalHostFreshness.hostContractSource,
    projectHostContractHash: projectHostContractFreshness.projectHostContractHash,
    projectHostContractFingerprintValue:
      projectHostContractFreshness.projectHostContractFingerprintValue,
    projectHostContractFingerprintSource:
      projectHostContractFreshness.projectHostContractFingerprintSource,
    projectHostContractEvidenceHash: projectHostContractFreshness.projectHostContractEvidenceHash,
  }
}

function describeFreshnessField(field) {
  switch (field) {
    case 'packageJsonHash':
      return 'package.json'
    case 'lockfileHash':
      return 'lockfile'
    case 'entryFileHash':
      return 'app entry'
    case 'buildConfigHash':
      return 'build config'
    case 'contextHash':
      return '.local-context/hiui-design/.context.jsonc'
    case 'hostContractHash':
      return 'formal host contract'
    case 'hostContractSource':
      return 'formal host contract source'
    case 'projectHostContractHash':
      return 'PROJECT_HOST_CONTRACT.json'
    case 'projectHostContractFingerprintValue':
      return 'project host contract fingerprint'
    case 'projectHostContractFingerprintSource':
      return 'project host contract fingerprint source'
    case 'projectHostContractEvidenceHash':
      return 'project host contract evidence files'
    default:
      return field
  }
}

export async function evaluatePageTaskFreshness({
  targetRoot,
  pageTaskStatus,
  hostProfile = null,
  projectHostContract,
}) {
  const stored = pageTaskStatus?.freshness || {}
  const current = await collectPageTaskFreshnessSnapshot(targetRoot, {
    hostProfile,
    projectHostContract,
  })
  const staleFields = []

  for (const field of [
    'packageJsonHash',
    'lockfileHash',
    'entryFileHash',
    'buildConfigHash',
    'contextHash',
    'hostContractHash',
    'hostContractSource',
    'projectHostContractHash',
    'projectHostContractFingerprintValue',
    'projectHostContractFingerprintSource',
    'projectHostContractEvidenceHash',
  ]) {
    if (!String(stored[field] || '').trim()) {
      staleFields.push(field)
      continue
    }

    if (stored[field] !== current[field]) {
      staleFields.push(field)
    }
  }

  return {
    status: staleFields.length === 0 ? 'fresh' : 'stale',
    staleFields,
    staleLabels: staleFields.map((field) => describeFreshnessField(field)),
    current,
  }
}

export async function inspectPageTaskGate({
  targetRoot,
  skillRoot,
  integrationReadiness: providedIntegrationReadiness = null,
}) {
  const packageManager = await detectProjectPackageManager(targetRoot)
  const integrationReadiness =
    providedIntegrationReadiness || (await inspectIntegrationReadiness(targetRoot))
  let pageTaskStatus = await readProjectPageTaskStatus(targetRoot)
  const statusPath = resolveProjectPageTaskStatusPath(targetRoot)

  let status = PAGE_TASK_READINESS.READY_TO_GENERATE
  let reason = ''
  let nextCommand = ''
  let nextRequiredAction = ''
  let nextStage = PAGE_TASK_NEXT_STAGE.READY_TO_GENERATE
  let allowedActions = []
  let forbiddenActions = []
  let projectHostContract = null
  let staleInputs = []
  let canAutoRecover = false
  let contractSnapshotId = ''

  if (!integrationReadiness.ready) {
    status = PAGE_TASK_READINESS.ENSURE_ONLY
    reason = integrationReadiness.reason || 'Project-local hiui-design context is not ready.'
    nextCommand = await buildEnsureCommand({ targetRoot, skillRoot, integrationReadiness })
    nextRequiredAction = 'typical-page:ensure'
    allowedActions = INTEGRATION_BLOCKED_ALLOWED_ACTIONS
    forbiddenActions = DEFAULT_FORBIDDEN_ACTIONS
  } else if (!pageTaskStatus) {
    status = PAGE_TASK_READINESS.ENSURE_ONLY
    reason =
      `Page-task readiness status is missing at ${statusPath}. ` +
      'Run the preflight gate after integration changes before starting any hiui-design page task.'
    nextCommand = buildPreflightCommand({
      packageManager,
      mode: integrationReadiness.appliedMode,
    })
    nextRequiredAction = 'typical-page:preflight'
    canAutoRecover = true
    allowedActions = PAGE_TASK_GATE_BLOCKED_ALLOWED_ACTIONS
    forbiddenActions = DEFAULT_FORBIDDEN_ACTIONS
  } else if (pageTaskStatus.pageTaskReadiness !== PAGE_TASK_READINESS.READY_TO_GENERATE) {
    status = PAGE_TASK_READINESS.ENSURE_ONLY
    reason =
      pageTaskStatus.gateStatusReason ||
      pageTaskStatus.reason ||
      'Project page-task readiness gate is closed.'
    nextCommand =
      pageTaskStatus.nextCommand ||
      buildPreflightCommand({
        packageManager,
        mode: integrationReadiness.appliedMode || pageTaskStatus.integrationReadiness?.appliedMode,
      })
    nextRequiredAction =
      pageTaskStatus.nextRequiredAction ||
      (integrationReadiness.ready ? 'typical-page:preflight' : 'typical-page:ensure')
    staleInputs = Array.isArray(pageTaskStatus.staleInputs) ? pageTaskStatus.staleInputs : []
    canAutoRecover =
      pageTaskStatus.canAutoRecover === true ||
      nextRequiredAction === 'typical-page:preflight'
    contractSnapshotId = buildContractSnapshotId(null, pageTaskStatus)
    allowedActions = Array.isArray(pageTaskStatus.allowedActions)
      ? pageTaskStatus.allowedActions
      : PAGE_TASK_GATE_BLOCKED_ALLOWED_ACTIONS
    forbiddenActions = Array.isArray(pageTaskStatus.forbiddenActions)
      ? pageTaskStatus.forbiddenActions
      : DEFAULT_FORBIDDEN_ACTIONS
  } else {
    allowedActions = Array.isArray(pageTaskStatus.allowedActions) ? pageTaskStatus.allowedActions : []
    forbiddenActions = Array.isArray(pageTaskStatus.forbiddenActions) ? pageTaskStatus.forbiddenActions : []
    projectHostContract = await readProjectHostContract(targetRoot)
    contractSnapshotId = buildContractSnapshotId(projectHostContract, pageTaskStatus)
    const freshness = await evaluatePageTaskFreshness({
      targetRoot,
      pageTaskStatus,
      hostProfile: integrationReadiness?.hostCompatibility?.hostProfile || null,
      projectHostContract,
    })
    if (freshness.status !== 'fresh') {
      status = PAGE_TASK_READINESS.ENSURE_ONLY
      staleInputs = freshness.staleLabels
      reason =
        `Project page-task readiness is stale because these inputs changed or were never snapshotted: ${freshness.staleLabels.join(', ')}. ` +
        'Re-run typical-page:preflight before starting any hiui-design page task.'
      nextCommand = buildPreflightCommand({
        packageManager,
        mode: integrationReadiness.appliedMode || pageTaskStatus.integrationReadiness?.appliedMode,
      })
      nextRequiredAction = 'typical-page:preflight'
      canAutoRecover = true
      allowedActions = PAGE_TASK_GATE_BLOCKED_ALLOWED_ACTIONS
      forbiddenActions = DEFAULT_FORBIDDEN_ACTIONS
      const refreshedStatus = await markPageTaskEnsureOnly({
        targetRoot,
        integrationReadiness:
          pageTaskStatus.integrationReadiness && typeof pageTaskStatus.integrationReadiness === 'object'
            ? {
                ...JSON.parse(JSON.stringify(pageTaskStatus.integrationReadiness)),
                ...integrationReadiness,
              }
            : integrationReadiness,
        reason,
        gateStatusReason: reason,
        nextCommand,
        nextRequiredAction,
        staleInputs,
        canAutoRecover,
        contractSnapshotId,
        updatedBy: 'scripts/lib/page-task-gate.mjs#inspectPageTaskGate',
        allowedActions,
        forbiddenActions,
        doctor:
          pageTaskStatus.doctor && typeof pageTaskStatus.doctor === 'object'
            ? pageTaskStatus.doctor
            : { lastStatus: 'not-run' },
        freshness: freshness.current,
      })
      pageTaskStatus = refreshedStatus
      contractSnapshotId = buildContractSnapshotId(projectHostContract, refreshedStatus)
    } else {
      nextRequiredAction = 'page-generation'
    }
  }

  nextStage = resolvePageTaskNextStage({
    integrationReadiness,
    pageTaskReadiness: status,
  })

  return {
    schema: 'hiui-design-page-task-gate.v1',
    targetRoot,
    status,
    nextStage,
    integrationReadiness,
    pageTaskStatus,
    reason,
    gateStatusReason: reason,
    nextCommand,
    nextRequiredAction,
    staleInputs,
    canAutoRecover,
    contractSnapshotId,
    allowedActions,
    forbiddenActions,
    projectHostContract,
  }
}

export async function writeEnsureOnlyPageTaskStatus({
  targetRoot,
  integrationReadiness,
  updatedBy,
  reason = '',
  nextCommand = '',
  mode = '',
  doctor,
  freshness,
}) {
  const packageManager = await detectProjectPackageManager(targetRoot)
  const freshnessSnapshot =
    freshness ||
    (await collectPageTaskFreshnessSnapshot(targetRoot, {
      hostProfile: integrationReadiness?.hostCompatibility?.hostProfile || null,
    }))
  const normalizedIntegrationReadiness = normalizeIntegrationReadiness(integrationReadiness, mode)
  const appliedMode = normalizedIntegrationReadiness.appliedMode

  return markPageTaskEnsureOnly({
    targetRoot,
    integrationReadiness: normalizedIntegrationReadiness,
    reason: reason || buildIntegrationEnsureOnlyReason(appliedMode),
    gateStatusReason: reason || buildIntegrationEnsureOnlyReason(appliedMode),
    nextCommand: nextCommand || buildPreflightCommand({ packageManager, mode: appliedMode }),
    nextRequiredAction: normalizedIntegrationReadiness.ready ? 'typical-page:preflight' : 'typical-page:ensure',
    staleInputs: [],
    canAutoRecover: normalizedIntegrationReadiness.ready,
    updatedBy,
    allowedActions: PAGE_TASK_GATE_BLOCKED_ALLOWED_ACTIONS,
    forbiddenActions: DEFAULT_FORBIDDEN_ACTIONS,
    doctor,
    freshness: freshnessSnapshot,
  })
}

export async function syncPageTaskStatusFromDoctor({
  targetRoot,
  doctorStatus,
  doctorAssessment = null,
  updatedBy,
  mode = '',
  reportSnapshot,
}) {
  const integrationReadiness = await inspectIntegrationReadiness(targetRoot)
  if (!integrationReadiness.ready) {
    return {
      skipped: true,
      transition: 'not-written',
      integrationReadiness,
      pageTaskStatus: null,
    }
  }

  const normalizedIntegrationReadiness = normalizeIntegrationReadiness(integrationReadiness, mode)
  const existingPageTaskStatus = await readProjectPageTaskStatus(targetRoot)
  const effectiveIntegrationReadiness = existingPageTaskStatus?.integrationReadiness
    ? {
        ...JSON.parse(JSON.stringify(existingPageTaskStatus.integrationReadiness)),
        ...normalizedIntegrationReadiness,
        hostCompatibility: {
          ...(existingPageTaskStatus.integrationReadiness.hostCompatibility || {}),
          ...(normalizedIntegrationReadiness.hostCompatibility || {}),
          publicShell: {
            ...(existingPageTaskStatus.integrationReadiness.hostCompatibility?.publicShell || {}),
            ...(normalizedIntegrationReadiness.hostCompatibility?.publicShell || {}),
          },
        },
      }
    : normalizedIntegrationReadiness
  const doctor = toDoctorSnapshot({ doctorStatus, reportSnapshot, doctorAssessment })
  const freshness = await collectPageTaskFreshnessSnapshot(targetRoot, {
    hostProfile: effectiveIntegrationReadiness?.hostCompatibility?.hostProfile || null,
  })
  const doctorClosesReadyGate = shouldDoctorCloseReadyPageTaskGate({
    doctorStatus,
    doctorAssessment,
  })

  if (
    existingPageTaskStatus?.pageTaskReadiness === PAGE_TASK_READINESS.READY_TO_GENERATE &&
    !doctorClosesReadyGate
  ) {
    const contractSnapshotId = buildContractSnapshotId(undefined, existingPageTaskStatus)
    const pageTaskStatus = await markPageTaskReadyToGenerate({
      targetRoot,
      integrationReadiness: effectiveIntegrationReadiness,
      reason:
        existingPageTaskStatus.reason ||
        'typical-page preflight already opened the page-task gate. Doctor findings are recorded for acceptance only.',
      gateStatusReason:
        existingPageTaskStatus.gateStatusReason ||
        existingPageTaskStatus.reason ||
        'typical-page preflight already opened the page-task gate. Doctor findings are recorded for acceptance only.',
      nextCommand: existingPageTaskStatus.nextCommand || '',
      nextRequiredAction: existingPageTaskStatus.nextRequiredAction || 'page-generation',
      staleInputs: existingPageTaskStatus.staleInputs || [],
      canAutoRecover: false,
      contractSnapshotId,
      updatedBy,
      allowedActions:
        Array.isArray(existingPageTaskStatus.allowedActions) &&
        existingPageTaskStatus.allowedActions.length > 0
          ? existingPageTaskStatus.allowedActions
          : READY_ALLOWED_ACTIONS,
      forbiddenActions: Array.isArray(existingPageTaskStatus.forbiddenActions)
        ? existingPageTaskStatus.forbiddenActions
        : READY_FORBIDDEN_ACTIONS,
      doctor,
      freshness,
    })

    return {
      skipped: false,
      transition: PAGE_TASK_READINESS.READY_TO_GENERATE,
      integrationReadiness: effectiveIntegrationReadiness,
      pageTaskStatus,
    }
  }

  if (
    existingPageTaskStatus?.pageTaskReadiness === PAGE_TASK_READINESS.READY_TO_GENERATE &&
    doctorClosesReadyGate
  ) {
    const contractSnapshotId = buildContractSnapshotId(undefined, existingPageTaskStatus)
    const pageTaskStatus = await markPageTaskEnsureOnly({
      targetRoot,
      integrationReadiness: effectiveIntegrationReadiness,
      reason: buildDoctorBlockingReason(doctor),
      gateStatusReason: buildDoctorBlockingReason(doctor),
      nextCommand: buildPreflightCommand({
        packageManager: await detectProjectPackageManager(targetRoot),
        mode: normalizedIntegrationReadiness.appliedMode,
      }),
      nextRequiredAction: 'typical-page:preflight',
      staleInputs: [],
      canAutoRecover: true,
      contractSnapshotId,
      requiredManualActions: [],
      recommendedSteps: [],
      updatedBy,
      allowedActions: PAGE_TASK_GATE_BLOCKED_ALLOWED_ACTIONS,
      forbiddenActions: DEFAULT_FORBIDDEN_ACTIONS,
      doctor,
      freshness,
    })

    return {
      skipped: false,
      transition: PAGE_TASK_READINESS.ENSURE_ONLY,
      integrationReadiness: effectiveIntegrationReadiness,
      pageTaskStatus,
    }
  }

  const contractSnapshotId = buildContractSnapshotId(undefined, existingPageTaskStatus)
  const pageTaskStatus = await markPageTaskEnsureOnly({
    targetRoot,
    integrationReadiness: effectiveIntegrationReadiness,
    reason:
      existingPageTaskStatus?.reason ||
      'typical-page preflight has not yet opened the project page-task gate. Doctor findings are recorded for acceptance only.',
    gateStatusReason:
      existingPageTaskStatus?.gateStatusReason ||
      existingPageTaskStatus?.reason ||
      'typical-page preflight has not yet opened the project page-task gate. Doctor findings are recorded for acceptance only.',
    nextCommand:
      existingPageTaskStatus?.nextCommand ||
      buildPreflightCommand({
        packageManager: await detectProjectPackageManager(targetRoot),
        mode: normalizedIntegrationReadiness.appliedMode,
      }),
    nextRequiredAction: existingPageTaskStatus?.nextRequiredAction || 'typical-page:preflight',
    staleInputs: existingPageTaskStatus?.staleInputs || [],
    canAutoRecover: true,
    contractSnapshotId,
    requiredManualActions: existingPageTaskStatus?.requiredManualActions || [],
    recommendedSteps: existingPageTaskStatus?.recommendedSteps || [],
    updatedBy,
    allowedActions: Array.isArray(existingPageTaskStatus?.allowedActions)
      ? existingPageTaskStatus.allowedActions
      : PAGE_TASK_GATE_BLOCKED_ALLOWED_ACTIONS,
    forbiddenActions: Array.isArray(existingPageTaskStatus?.forbiddenActions)
      ? existingPageTaskStatus.forbiddenActions
      : DEFAULT_FORBIDDEN_ACTIONS,
    doctor,
    freshness,
  })

  return {
    skipped: false,
    transition: PAGE_TASK_READINESS.ENSURE_ONLY,
    integrationReadiness: effectiveIntegrationReadiness,
    pageTaskStatus,
  }
}

export async function syncPageTaskStatusFromPreflight({
  targetRoot,
  updatedBy,
  mode = '',
}) {
  const integrationReadiness = await inspectIntegrationReadiness(targetRoot)
  if (!integrationReadiness.ready) {
    return {
      skipped: true,
      transition: 'not-written',
      integrationReadiness,
      pageTaskStatus: null,
    }
  }

  const packageManager = await detectProjectPackageManager(targetRoot)
  const normalizedIntegrationReadiness = normalizeIntegrationReadiness(integrationReadiness, mode)
  const appliedMode = normalizedIntegrationReadiness.appliedMode
  const effectiveHostProfile = normalizedIntegrationReadiness?.hostCompatibility?.hostProfile || null
  const generationReadiness = await evaluateProjectGenerationReadiness({
    targetRoot,
    mode: appliedMode,
    integrationReadiness: normalizedIntegrationReadiness,
    hostProfile: effectiveHostProfile,
  })
  const integrationReadinessWithGenerationSnapshots = applyGenerationReadinessSnapshots(
    normalizedIntegrationReadiness,
    generationReadiness
  )
  const projectHostContractResult = await writeProjectHostContract({
    targetRoot,
    generationReadiness,
  })
  const contractSnapshotId = buildContractSnapshotId(projectHostContractResult.contract)
  const freshness = await collectPageTaskFreshnessSnapshot(targetRoot, {
    hostProfile: effectiveHostProfile,
    projectHostContract: projectHostContractResult.contract,
  })
  const existingPageTaskStatus = await readProjectPageTaskStatus(targetRoot)
  const doctorSnapshot =
    existingPageTaskStatus?.doctor && String(existingPageTaskStatus.doctor.lastStatus || '').trim()
      ? existingPageTaskStatus.doctor
      : {
          lastStatus: 'not-run',
        }

  if (generationReadiness.status === 'ready') {
    const pageTaskStatus = await markPageTaskReadyToGenerate({
      targetRoot,
      integrationReadiness: integrationReadinessWithGenerationSnapshots,
      reason: buildPreflightSuccessReason(appliedMode, generationReadiness),
      gateStatusReason: buildPreflightSuccessReason(appliedMode, generationReadiness),
      nextRequiredAction: 'page-generation',
      staleInputs: [],
      canAutoRecover: false,
      contractSnapshotId,
      updatedBy,
      allowedActions: READY_ALLOWED_ACTIONS,
      forbiddenActions: READY_FORBIDDEN_ACTIONS,
      doctor: doctorSnapshot,
      freshness,
    })

    return {
      skipped: false,
      transition: PAGE_TASK_READINESS.READY_TO_GENERATE,
      integrationReadiness: integrationReadinessWithGenerationSnapshots,
      generationReadiness,
      pageTaskStatus,
    }
  }

  const pageTaskStatus = await markPageTaskEnsureOnly({
    targetRoot,
    integrationReadiness: integrationReadinessWithGenerationSnapshots,
    reason: buildPreflightBlockedReason(generationReadiness),
    gateStatusReason: buildPreflightBlockedReason(generationReadiness),
    nextCommand: buildGenerationReadinessNextCommand({
      packageManager,
      mode: appliedMode,
      generationReadiness,
    }),
    nextRequiredAction: 'typical-page:preflight',
    staleInputs: [],
    canAutoRecover: true,
    contractSnapshotId,
    requiredManualActions: buildGenerationReadinessRequiredManualActions(generationReadiness),
    recommendedSteps: buildGenerationReadinessRecommendedSteps({
      packageManager,
      mode: appliedMode,
      generationReadiness,
    }),
    updatedBy,
    allowedActions: PAGE_TASK_GATE_BLOCKED_ALLOWED_ACTIONS,
    forbiddenActions: DEFAULT_FORBIDDEN_ACTIONS,
    doctor: doctorSnapshot,
    freshness,
  })

  return {
    skipped: false,
    transition: PAGE_TASK_READINESS.ENSURE_ONLY,
    integrationReadiness: integrationReadinessWithGenerationSnapshots,
    generationReadiness,
    pageTaskStatus,
  }
}

export async function refreshReadyPageTaskGateAfterManagedWrite({
  targetRoot,
  navigationMountAction = null,
  writtenFiles = [],
  pageTaskStatus = null,
  integrationReadiness = null,
  projectHostContract = undefined,
  updatedBy = 'scripts/generate-page-from-brief.mjs',
} = {}) {
  const existingPageTaskStatus = pageTaskStatus || (await readProjectPageTaskStatus(targetRoot))
  const action = normalizeString(navigationMountAction?.action)
  const normalizedWrittenFiles = normalizeWrittenProjectPaths(targetRoot, writtenFiles)

  if (existingPageTaskStatus?.pageTaskReadiness !== PAGE_TASK_READINESS.READY_TO_GENERATE) {
    return {
      refreshed: false,
      reason: 'page-task gate is not already open; warm refresh is only allowed after preflight opened it.',
      navigationMountAction: action,
      writtenFiles: normalizedWrittenFiles,
      blockedWrittenFiles: [],
      pageTaskStatus: existingPageTaskStatus,
      projectHostContract: null,
    }
  }

  if (!isWarmRefreshableNavigationMountAction(action)) {
    return {
      refreshed: false,
      reason: `navigation mount action ${action || '(missing)'} is not eligible for warm page-task refresh.`,
      navigationMountAction: action,
      writtenFiles: normalizedWrittenFiles,
      blockedWrittenFiles: [],
      pageTaskStatus: existingPageTaskStatus,
      projectHostContract: null,
    }
  }

  if (normalizedWrittenFiles.length === 0) {
    return {
      refreshed: false,
      reason: 'warm page-task refresh requires concrete managed write targets.',
      navigationMountAction: action,
      writtenFiles: normalizedWrittenFiles,
      blockedWrittenFiles: [],
      pageTaskStatus: existingPageTaskStatus,
      projectHostContract: null,
    }
  }

  const effectiveIntegrationReadiness =
    integrationReadiness || existingPageTaskStatus.integrationReadiness || {}
  const effectiveHostProfile = effectiveIntegrationReadiness?.hostCompatibility?.hostProfile || null
  const protectedPaths = await collectWarmRefreshProtectedPaths(targetRoot, {
    hostProfile: effectiveHostProfile,
  })
  const blockedWrittenFiles = normalizedWrittenFiles.filter((relativePath) =>
    protectedPaths.has(relativePath)
  )

  if (blockedWrittenFiles.length > 0) {
    return {
      refreshed: false,
      reason:
        `warm page-task refresh is blocked because the managed write touched project-level protected inputs: ${blockedWrittenFiles.join(', ')}.`,
      navigationMountAction: action,
      writtenFiles: normalizedWrittenFiles,
      blockedWrittenFiles,
      pageTaskStatus: existingPageTaskStatus,
      projectHostContract: null,
    }
  }

  const refreshedProjectHostContractResult = await refreshProjectHostContractFingerprint({
    targetRoot,
    projectHostContract,
  })
  const effectiveProjectHostContract =
    refreshedProjectHostContractResult.contract ||
    (projectHostContract === undefined
      ? await readProjectHostContract(targetRoot)
      : projectHostContract)
  const freshness = await collectPageTaskFreshnessSnapshot(targetRoot, {
    hostProfile: effectiveHostProfile,
    projectHostContract: effectiveProjectHostContract,
  })
  const nextPageTaskStatus = await markPageTaskReadyToGenerate({
    targetRoot,
    integrationReadiness: effectiveIntegrationReadiness,
    reason:
      existingPageTaskStatus.reason ||
      'typical-page preflight already opened the page-task gate; warm refresh preserved the ready state after a managed write.',
    gateStatusReason:
      existingPageTaskStatus.gateStatusReason ||
      existingPageTaskStatus.reason ||
      'typical-page preflight already opened the page-task gate; warm refresh preserved the ready state after a managed write.',
    nextCommand: existingPageTaskStatus.nextCommand || '',
    nextRequiredAction: 'page-generation',
    staleInputs: [],
    canAutoRecover: false,
    contractSnapshotId: buildContractSnapshotId(
      effectiveProjectHostContract,
      existingPageTaskStatus
    ),
    requiredManualActions: existingPageTaskStatus.requiredManualActions || [],
    recommendedSteps: existingPageTaskStatus.recommendedSteps || [],
    updatedBy,
    allowedActions:
      Array.isArray(existingPageTaskStatus.allowedActions) &&
      existingPageTaskStatus.allowedActions.length > 0
        ? existingPageTaskStatus.allowedActions
        : READY_ALLOWED_ACTIONS,
    forbiddenActions: Array.isArray(existingPageTaskStatus.forbiddenActions)
      ? existingPageTaskStatus.forbiddenActions
      : READY_FORBIDDEN_ACTIONS,
    doctor:
      existingPageTaskStatus.doctor &&
      normalizeString(existingPageTaskStatus.doctor.lastStatus)
        ? existingPageTaskStatus.doctor
        : {
            lastStatus: 'not-run',
          },
    freshness,
  })

  return {
    refreshed: true,
    reason: `warm page-task refresh kept the ready gate open after managed ${action} writes.`,
    navigationMountAction: action,
    writtenFiles: normalizedWrittenFiles,
    blockedWrittenFiles: [],
    pageTaskStatus: nextPageTaskStatus,
    projectHostContract: effectiveProjectHostContract,
  }
}
