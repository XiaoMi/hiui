import fs from 'node:fs/promises'
import path from 'node:path'

import { detectHostProfile } from './detect-host-profile.mjs'
import { inspectIntegrationReadiness } from './integration-readiness.mjs'
import { loadGenerationBrief } from './load-generation-brief.mjs'
import { inspectManagedHostContract } from './managed-host-contract.mjs'
import { evaluateProjectGenerationReadiness } from './generation-readiness.mjs'
import {
  buildEnsureCommand,
  buildPreflightCommand,
  detectProjectPackageManager,
  writeEnsureOnlyPageTaskStatus,
} from './page-task-gate.mjs'
import { readProjectPageTaskStatus } from './page-task-status.mjs'
import { buildPageTypeCapabilityArtifacts } from './page-type-capability-report.mjs'
import { ensureLegacyReactDefaultImport } from './legacy-react-runtime.mjs'
import {
  getManagedLocalRuntimeHostLogicalSource,
  getManagedLocalRuntimeHostPath,
} from './managed-local-runtime-contract.mjs'
import {
  buildManagedMfPublishEntryContent,
  buildManagedMfPublishEntryImportPlan,
  inferManagedBusinessShellImportPath,
  looksLikeManagedMfPublishEntryContent,
} from './managed-mf-publish-entry-template.mjs'

export const MANAGED_MF_HOST_CONTRACT_AUTOFIX_SCHEMA =
  'hiui-design-managed-mf-host-contract-autofix.v1'

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeRelativePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
}

function stripScriptModuleExtension(value) {
  return String(value || '').replace(/\.(?:[cm]?[jt]sx?)$/, '')
}

function ensureRelativeImportPath(value) {
  const normalized = String(value || '').replace(/\\/g, '/')
  if (!normalized) return './'
  return normalized.startsWith('.') ? normalized : `./${normalized}`
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, 'utf8')
  } catch {
    return ''
  }
}

function inferManagedMfPublishEntryFileName(brief) {
  const templatePath = normalizeRelativePath(brief?.sources?.preferredTemplatePath || '')
  const usesJavaScriptModule = /\.(?:jsx|js|mjs|cjs)$/.test(templatePath)
  return `mf-entry.${usesJavaScriptModule ? 'jsx' : 'tsx'}`
}

function shouldUseViewportAdaptiveManagedHostCore(hostProfile = null) {
  const profile = hostProfile && typeof hostProfile === 'object' ? hostProfile : {}

  return (
    normalizeString(profile.projectType) === 'existing-system' &&
    normalizeString(profile.routing) === 'module-federation' &&
    normalizeString(profile.strategy) === 'compat'
  )
}

function buildManagedHostAppFrameContent({ hostProfile = null } = {}) {
  return ensureLegacyReactDefaultImport(
    `import { TypicalPageAppFrameCore } from './app-frame-core'

export const hiuiDesignFormalShell = 'official-managed-host-shell-wrapper'

// Keep the managed MF host shell as a thin wrapper over the local host core.
export function BusinessShell({ children, ...shellProps }) {
  return <TypicalPageAppFrameCore {...shellProps}>{children}</TypicalPageAppFrameCore>
}

export default BusinessShell
`,
    hostProfile
  )
}

function buildManagedHostAppFrameCoreContent({
  corePath = '',
  usesJavaScriptModule = false,
  hostProfile = null,
  pageTypeId = '',
} = {}) {
  const usesViewportAdaptiveHeightContract = shouldUseViewportAdaptiveManagedHostCore(hostProfile)
  const managedHostImportPath = ensureRelativeImportPath(
    stripScriptModuleExtension(
      path.posix.relative(path.posix.dirname(normalizeRelativePath(corePath)), getManagedLocalRuntimeHostPath(corePath))
    )
  )
  const viewportAdaptiveRootRefTs = 'useRef<HTMLDivElement | null>(null)'
  const viewportAdaptiveRootRefJs = 'useRef(null)'
  const viewportAdaptiveSetup = usesViewportAdaptiveHeightContract
    ? {
        ts: `const MANAGED_VIEWPORT_HEIGHT_VAR = '--hiui-managed-mf-viewport-height'

function updateManagedViewportHeight(target: HTMLDivElement | null) {
  if (!target || typeof window === 'undefined') return

  const viewportHeight =
    window.visualViewport?.height ||
    window.innerHeight ||
    document.documentElement?.clientHeight ||
    0
  const nextHeight = Math.max(Math.round(viewportHeight - target.getBoundingClientRect().top), 0)

  target.style.setProperty(MANAGED_VIEWPORT_HEIGHT_VAR, \`\${nextHeight}px\`)
}

`,
        js: `const MANAGED_VIEWPORT_HEIGHT_VAR = '--hiui-managed-mf-viewport-height'

function updateManagedViewportHeight(target) {
  if (!target || typeof window === 'undefined') return

  const viewportHeight =
    (window.visualViewport && window.visualViewport.height) ||
    window.innerHeight ||
    document.documentElement?.clientHeight ||
    0
  const nextHeight = Math.max(Math.round(viewportHeight - target.getBoundingClientRect().top), 0)

  target.style.setProperty(MANAGED_VIEWPORT_HEIGHT_VAR, \`\${nextHeight}px\`)
}

`,
        effectTs: `  const rootRef = ${viewportAdaptiveRootRefTs}

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined

    let rafId = 0
    const scheduleViewportHeightSync = () => {
      if (rafId !== 0) return

      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        updateManagedViewportHeight(rootRef.current)
      })
    }

    const viewport = window.visualViewport

    scheduleViewportHeightSync()
    window.addEventListener('resize', scheduleViewportHeightSync)
    window.addEventListener('scroll', scheduleViewportHeightSync, true)
    viewport?.addEventListener('resize', scheduleViewportHeightSync)
    viewport?.addEventListener('scroll', scheduleViewportHeightSync)

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('resize', scheduleViewportHeightSync)
      window.removeEventListener('scroll', scheduleViewportHeightSync, true)
      viewport?.removeEventListener('resize', scheduleViewportHeightSync)
      viewport?.removeEventListener('scroll', scheduleViewportHeightSync)
    }
  }, [])

`,
        effectJs: `  const rootRef = ${viewportAdaptiveRootRefJs}

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined

    let rafId = 0
    const scheduleViewportHeightSync = () => {
      if (rafId !== 0) return

      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        updateManagedViewportHeight(rootRef.current)
      })
    }

    const viewport = window.visualViewport

    scheduleViewportHeightSync()
    window.addEventListener('resize', scheduleViewportHeightSync)
    window.addEventListener('scroll', scheduleViewportHeightSync, true)
    if (viewport) {
      viewport.addEventListener('resize', scheduleViewportHeightSync)
      viewport.addEventListener('scroll', scheduleViewportHeightSync)
    }

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('resize', scheduleViewportHeightSync)
      window.removeEventListener('scroll', scheduleViewportHeightSync, true)
      if (viewport) {
        viewport.removeEventListener('resize', scheduleViewportHeightSync)
        viewport.removeEventListener('scroll', scheduleViewportHeightSync)
      }
    }
  }, [])

`,
      }
    : { ts: '', js: '', effectTs: '', effectJs: '' }
  const rootProps = usesViewportAdaptiveHeightContract
    ? `        ref={rootRef}
        className="pro-stat-page"
        data-hiui-managed-host-shell="true"
        data-hiui-main-content-outlet="true"
        data-hiui-height-contract="viewport-adaptive-legacy-mf"
        data-hiui-height-runtime="dynamic-top-offset"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 0%',
          width: '100%',
          minWidth: 0,
          minHeight: 'var(--hiui-managed-mf-viewport-height, calc(100vh - 60px))',
          overflow: 'hidden',
          paddingInline: 16,
        }}`
    : `        className="pro-stat-page"
        data-hiui-managed-host-shell="true"
        data-hiui-main-content-outlet="true"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 0%',
          width: '100%',
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
          paddingInline: 16,
        }}`

  if (!usesJavaScriptModule) {
    return ensureLegacyReactDefaultImport(
      `import { type ReactNode${usesViewportAdaptiveHeightContract ? ', useLayoutEffect, useRef' : ''} } from 'react'
import { TypicalPageHostProvider } from ${JSON.stringify(managedHostImportPath)}
import './host-reset.css'

${viewportAdaptiveSetup.ts}
// The managed MF host shell only proves the isolated viewport, gutter, and scroll chain.
export function TypicalPageAppFrameCore({
  children,
}: {
  children: ReactNode
}) {
${viewportAdaptiveSetup.effectTs}
  return (
    <TypicalPageHostProvider>
      <div
${rootProps}
      >
        {children}
      </div>
    </TypicalPageHostProvider>
  )
}
`,
      hostProfile
    )
  }

  return ensureLegacyReactDefaultImport(
      `${usesViewportAdaptiveHeightContract ? "import { useLayoutEffect, useRef } from 'react'\n" : ''}import { TypicalPageHostProvider } from ${JSON.stringify(managedHostImportPath)}
import './host-reset.css'

${viewportAdaptiveSetup.js}
// The managed MF host shell only proves the isolated viewport, gutter, and scroll chain.
export function TypicalPageAppFrameCore({ children }) {
${viewportAdaptiveSetup.effectJs}
  return (
    <TypicalPageHostProvider>
      <div
${rootProps}
      >
        {children}
      </div>
    </TypicalPageHostProvider>
  )
}
`,
    hostProfile
  )
}

function buildManagedHostResetCssContent() {
  return `:where([data-hiui-managed-host-shell='true']) {
  box-sizing: border-box;
  min-height: 100%;
}

:where([data-hiui-managed-host-shell='true']) *,
:where([data-hiui-managed-host-shell='true']) *::before,
:where([data-hiui-managed-host-shell='true']) *::after {
  box-sizing: inherit;
}
`
}

function buildManagedHostContractContent({
  shellPath,
  corePath,
  hostResetPath,
  publishEntryPath,
  hostProfile = null,
  pageTypeId = '',
}) {
  const heightContractMode = shouldUseViewportAdaptiveManagedHostCore(hostProfile)
    ? 'viewport-adaptive-legacy-mf'
    : 'strict-flex-chain'
  return `${JSON.stringify(
    {
      schema: 'hiui-design-managed-host-contract.v1',
      kind: 'managed-isolated-mf-host-shell',
      layoutMode: 'self-contained-hiui-shell',
      shellPath,
      corePath,
      hostResetPath,
      headerSlotPolicy: 'no-header-slot',
      continuousHeightChain: true,
      heightContractMode,
      managedHostImportSource: getManagedLocalRuntimeHostLogicalSource(),
      deliveryUnitKind: 'module-federation-direct-expose',
      publishEntryPath,
      wrapsPageWithBusinessShell: true,
      contentOutletPath: 'official-shell-root',
      scrollOwner: 'official-shell-root',
      rightViewportGutterPx: 16,
    },
    null,
    2
  )}\n`
}

function buildBlockedPayload({
  targetRoot,
  reason,
  nextCommand = '',
  details = [],
}) {
  return {
    schema: MANAGED_MF_HOST_CONTRACT_AUTOFIX_SCHEMA,
    status: 'blocked',
    targetRoot,
    reason,
    details,
    changes: [],
    writtenFiles: [],
    pageTaskReadiness: 'unchanged',
    nextCommand,
  }
}

function buildAlreadyCompatiblePayload({
  targetRoot,
  reason,
  writtenFiles = [],
  nextCommand = '',
}) {
  return {
    schema: MANAGED_MF_HOST_CONTRACT_AUTOFIX_SCHEMA,
    status: 'already-compatible',
    targetRoot,
    reason,
    details: [],
    changes: [],
    writtenFiles,
    pageTaskReadiness: 'unchanged',
    nextCommand,
  }
}

function buildPatchedPayload({
  targetRoot,
  reason,
  changes,
  writtenFiles,
  nextCommand,
}) {
  return {
    schema: MANAGED_MF_HOST_CONTRACT_AUTOFIX_SCHEMA,
    status: 'patched',
    targetRoot,
    reason,
    details: [],
    changes,
    writtenFiles,
    pageTaskReadiness: 'ensure-only',
    nextCommand,
  }
}

function looksLikeManagedHostContractContent(source = '') {
  try {
    const payload = JSON.parse(source)
    return (
      normalizeString(payload?.schema) === 'hiui-design-managed-host-contract.v1' &&
      normalizeString(payload?.kind) === 'managed-isolated-mf-host-shell' &&
      normalizeString(payload?.deliveryUnitKind) === 'module-federation-direct-expose'
    )
  } catch {
    return false
  }
}

function looksLikeManagedHostShellContent(source = '') {
  const text = String(source || '')
  return (
    text.includes("export const hiuiDesignFormalShell = 'official-managed-host-shell-wrapper'") &&
    text.includes("import { TypicalPageAppFrameCore } from './app-frame-core'") &&
    text.includes('export default BusinessShell')
  )
}

function looksLikeManagedHostCoreContent(source = '') {
  const text = String(source || '')
  return (
    text.includes('hiui-design-runtime/host') &&
    text.includes('data-hiui-managed-host-shell="true"') &&
    text.includes('data-hiui-main-content-outlet="true"')
  )
}

function looksLikeManagedHostResetContent(source = '') {
  const text = String(source || '')
  return (
    text.includes(":where([data-hiui-managed-host-shell='true'])") &&
    text.includes('box-sizing: border-box;')
  )
}

function canRefreshManagedMfHostArtifact(relativePath, source = '', plan) {
  if (!source) return false

  if (relativePath === plan.shellPath) {
    return looksLikeManagedHostShellContent(source)
  }
  if (relativePath === plan.corePath) {
    return looksLikeManagedHostCoreContent(source)
  }
  if (relativePath === plan.hostResetPath) {
    return looksLikeManagedHostResetContent(source)
  }
  if (relativePath === plan.contractPath) {
    return looksLikeManagedHostContractContent(source)
  }
  if (relativePath === plan.publishEntryPath) {
    return looksLikeManagedMfPublishEntryContent(source)
  }

  return false
}

async function resolveAutofixHostProfile({ brief, targetRoot }) {
  const briefHostProfile =
    brief?.hostProfile && typeof brief.hostProfile === 'object' ? brief.hostProfile : {}
  const projectType = normalizeString(briefHostProfile.projectType)
  if (projectType && projectType !== 'gated-before-detection') {
    return briefHostProfile
  }

  const detectedHostProfile = await detectHostProfile(targetRoot)
  return {
    projectType: detectedHostProfile.projectType,
    framework: detectedHostProfile.framework,
    runtime: detectedHostProfile.runtime,
    routing: detectedHostProfile.routing,
    reactMajor: detectedHostProfile.reactMajor,
    legacyReactRuntime: detectedHostProfile.legacyReactRuntime,
    riskLevel: detectedHostProfile.riskLevel,
    riskTags: detectedHostProfile.riskTags,
    strategy: detectedHostProfile.strategy,
    reason: detectedHostProfile.reason,
    adapterDoc: detectedHostProfile.adapterDoc,
    adapterEntryHints: detectedHostProfile.adapterEntryHints,
    readmePath: detectedHostProfile.readmePath,
    remoteOnlyRuntime: detectedHostProfile.remoteOnlyRuntime,
    remoteDebugContract: detectedHostProfile.remoteDebugContract,
  }
}

function buildManagedMfHostContractPlan({ brief, targetRoot }) {
  const targetBusinessPath = normalizeRelativePath(
    brief?.requestedBusiness?.targetBusinessPath || brief?.requestedBusiness?.dest || ''
  )
  if (!targetBusinessPath) {
    throw new Error('Managed MF host contract autofix requires a target business path.')
  }

  const shellPath = 'src/business-shell/app-frame.tsx'
  const corePath = 'src/business-shell/app-frame-core.tsx'
  const hostResetPath = 'src/business-shell/host-reset.css'
  const contractPath = 'src/business-shell/hiui-managed-host.contract.json'
  const publishEntryPath = `${targetBusinessPath}/${inferManagedMfPublishEntryFileName(brief)}`
  const usesJavaScriptModule = publishEntryPath.endsWith('.jsx')
  const shellImportPath = inferManagedBusinessShellImportPath(publishEntryPath, shellPath)

  return {
    files: [
      {
        relativePath: shellPath,
        absolutePath: path.join(targetRoot, shellPath),
        content: buildManagedHostAppFrameContent({ hostProfile: brief.hostProfile }),
      },
      {
        relativePath: corePath,
        absolutePath: path.join(targetRoot, corePath),
        content: buildManagedHostAppFrameCoreContent({
          corePath,
          usesJavaScriptModule,
          hostProfile: brief.hostProfile,
          pageTypeId: brief?.pageType?.id,
        }),
      },
      {
        relativePath: hostResetPath,
        absolutePath: path.join(targetRoot, hostResetPath),
        content: buildManagedHostResetCssContent(),
      },
      {
        relativePath: contractPath,
        absolutePath: path.join(targetRoot, contractPath),
        content: buildManagedHostContractContent({
          shellPath,
          corePath,
          hostResetPath,
          publishEntryPath,
          hostProfile: brief.hostProfile,
          pageTypeId: brief?.pageType?.id,
        }),
      },
      {
        relativePath: publishEntryPath,
        absolutePath: path.join(targetRoot, publishEntryPath),
        content: '',
      },
    ],
    publishEntryPath,
    shellPath,
    corePath,
    hostResetPath,
    contractPath,
  }
}

async function finalizeManagedMfPublishEntry(plan, { brief, targetRoot }) {
  const navigationMountAction = brief.pageGenerationDecision?.navigationMountAction || {}
  const appEntryPath = normalizeRelativePath(navigationMountAction.appEntryPath || '')
  const absoluteAppEntryPath = appEntryPath ? path.join(targetRoot, appEntryPath) : ''
  const appEntrySource =
    absoluteAppEntryPath && (await pathExists(absoluteAppEntryPath))
      ? await readTextIfExists(absoluteAppEntryPath)
      : ''
  const importPlan = buildManagedMfPublishEntryImportPlan({
    appEntrySource,
    hostProfile: brief.hostProfile,
  })
  const publishEntryPath = plan.publishEntryPath
  const shellImportPath = inferManagedBusinessShellImportPath(publishEntryPath, plan.shellPath)
  const publishEntryFile = plan.files.find((file) => file.relativePath === publishEntryPath)

  if (!publishEntryFile) {
    throw new Error(`Managed MF publish entry ${publishEntryPath} is missing from the autofix plan.`)
  }

  publishEntryFile.content = buildManagedMfPublishEntryContent({
    importPlan,
    shellImportPath,
    publishEntryPath,
    usesJavaScriptModule: publishEntryPath.endsWith('.jsx'),
    hostProfile: brief.hostProfile,
  })

  return plan
}

function extractBriefSignals(brief) {
  return {
    pageTaskGateStatus:
      normalizeString(brief?.executionPolicy?.pageTaskGateStatus) ||
      normalizeString(brief?.pageTaskGate?.status),
    pageTaskGateReason:
      normalizeString(brief?.executionPolicy?.pageTaskGateReason) ||
      normalizeString(brief?.pageTaskGate?.reason),
    pageTaskGateNextCommand:
      normalizeString(brief?.executionPolicy?.pageTaskGateNextCommand) ||
      normalizeString(brief?.pageTaskGate?.nextCommand),
    requestedPageTypeStatus:
      normalizeString(brief?.executionPolicy?.requestedPageTypeStatus) ||
      normalizeString(brief?.executionPolicy?.requestedPageTypeCapabilityStatus),
    requestedPageTypeReason:
      normalizeString(brief?.executionPolicy?.requestedPageTypeReason) ||
      normalizeString(brief?.executionPolicy?.requestedPageTypeCapabilityReason),
    requestedPageTypePreWriteAction:
      normalizeString(brief?.executionPolicy?.requestedPageTypePreWriteAction),
    requestedPageTypePreWriteActionReason:
      normalizeString(brief?.executionPolicy?.requestedPageTypePreWriteActionReason),
    navigationMountAction: normalizeString(brief?.pageGenerationDecision?.navigationMountAction?.action),
  }
}

export async function autofixManagedMfHostContract({
  targetRoot,
  skillRoot,
  pageTypeId,
  dest,
  title,
  routePath = '',
  mode = 'auto',
  line = '',
  updatedBy = 'scripts/managed-mf-host-contract-autofix.mjs',
}) {
  const integrationReadiness = await inspectIntegrationReadiness(targetRoot)
  if (!integrationReadiness.ready) {
    return buildBlockedPayload({
      targetRoot,
      reason: `Project-local hiui-design context is not ready for managed MF host contract autofix: ${integrationReadiness.reason}`,
      nextCommand: await buildEnsureCommand({ targetRoot, skillRoot, integrationReadiness }),
    })
  }

  const managedHostContract = await inspectManagedHostContract(targetRoot, {
    hostProfile: integrationReadiness?.hostCompatibility?.hostProfile || null,
  })
  if (managedHostContract.status === 'valid') {
    const packageManager = await detectProjectPackageManager(targetRoot)
    return buildAlreadyCompatiblePayload({
      targetRoot,
      reason:
        managedHostContract.reason ||
        'Managed MF host contract already exists and is valid.',
      writtenFiles: managedHostContract.evidenceFiles || [],
      nextCommand: buildPreflightCommand({
        packageManager,
        mode: integrationReadiness.appliedMode || mode,
      }),
    })
  }

  const brief = await loadGenerationBrief({
    targetRoot,
    skillRoot,
    pageTypeId,
    mode,
    line,
    dest,
    title,
    routePath,
  })
  const briefSignals = extractBriefSignals(brief)
  const resolvedHostProfile = await resolveAutofixHostProfile({ brief, targetRoot })
  const briefForPlan = { ...brief, hostProfile: resolvedHostProfile }
  const plan = await finalizeManagedMfPublishEntry(
    buildManagedMfHostContractPlan({ brief: briefForPlan, targetRoot }),
    { brief: briefForPlan, targetRoot }
  )
  const canRepairInvalidManagedContract = managedHostContract.status === 'invalid'

  if (briefSignals.pageTaskGateStatus !== 'ready-to-generate' && !canRepairInvalidManagedContract) {
    return buildBlockedPayload({
      targetRoot,
      reason:
        briefSignals.pageTaskGateReason ||
        'Project page-task gate is not ready for managed MF host contract autofix.',
      nextCommand: briefSignals.pageTaskGateNextCommand,
    })
  }

  const pageTaskStatus = await readProjectPageTaskStatus(targetRoot)
  const generationReadiness = await evaluateProjectGenerationReadiness({
    targetRoot,
    mode: brief.mode || integrationReadiness.appliedMode || mode,
    integrationReadiness,
    hostProfile: integrationReadiness?.hostCompatibility?.hostProfile || null,
  })
  const capabilityArtifacts = await buildPageTypeCapabilityArtifacts({
    skillRoot,
    targetRoot,
    generationReadiness,
    pageTaskStatus,
  })
  const requestedPageTypeCapability = Array.isArray(capabilityArtifacts?.capabilityReport?.pageTypes)
    ? capabilityArtifacts.capabilityReport.pageTypes.find(
        (entry) => normalizeString(entry?.id) === normalizeString(pageTypeId)
      )
    : null
  const requestedPageTypeCapabilityStatus = normalizeString(requestedPageTypeCapability?.status)
  const requestedPageTypePreWriteAction = normalizeString(
    requestedPageTypeCapability?.preWriteAction
  )

  if (
    requestedPageTypeCapabilityStatus !== 'requires-managed-formal-shell' ||
    requestedPageTypePreWriteAction !== 'materialize-managed-mf-host-contract'
  ) {
    if (canRepairInvalidManagedContract) {
      // Allow stale managed host files to self-heal even when the project gate
      // has already fallen back to ensure-only because the contract is invalid.
    } else {
      return buildBlockedPayload({
        targetRoot,
        reason:
          normalizeString(requestedPageTypeCapability?.reason) ||
          briefSignals.requestedPageTypeReason ||
          'Current requested page type does not qualify for managed MF host contract autofix.',
        details: [
          `requestedPageTypeStatus=${requestedPageTypeCapabilityStatus || briefSignals.requestedPageTypeStatus || 'unknown'}`,
          `preWriteAction=${requestedPageTypePreWriteAction || briefSignals.requestedPageTypePreWriteAction || 'none'}`,
          `navigationMountAction=${briefSignals.navigationMountAction || 'none'}`,
        ],
      })
    }
  }

  const missingFiles = []
  const alreadyCompatibleFiles = []
  const refreshableFiles = []
  for (const file of plan.files) {
    const existingSource = await readTextIfExists(file.absolutePath)
    if (!existingSource) {
      missingFiles.push(file)
      continue
    }
    if (existingSource === file.content) {
      alreadyCompatibleFiles.push(file.relativePath)
      continue
    }
    if (canRefreshManagedMfHostArtifact(file.relativePath, existingSource, plan)) {
      refreshableFiles.push(file)
      continue
    }
    return buildBlockedPayload({
      targetRoot,
      reason:
        'Managed MF host contract autofix found conflicting existing files and will not overwrite custom project content automatically.',
      details: [
        `${file.relativePath} already exists with non-managed content. Review or migrate it manually before rerunning autofix.`,
      ],
    })
  }

  for (const file of [...missingFiles, ...refreshableFiles]) {
    await fs.mkdir(path.dirname(file.absolutePath), { recursive: true })
    await fs.writeFile(file.absolutePath, file.content, 'utf8')
  }

  const packageManager = await detectProjectPackageManager(targetRoot)
  const refreshedIntegrationReadiness = await inspectIntegrationReadiness(targetRoot)
  const nextCommand = buildPreflightCommand({
    packageManager,
    mode: brief.mode || integrationReadiness.appliedMode || mode,
  })

  await writeEnsureOnlyPageTaskStatus({
    targetRoot,
    integrationReadiness: refreshedIntegrationReadiness,
    updatedBy,
    reason:
      'Managed MF host contract autofix materialized the minimal managed shell contract. Rerun typical-page:preflight so the refreshed contract evidence can reopen page generation.',
    nextCommand,
    mode: brief.mode || integrationReadiness.appliedMode || mode,
  })

  if (missingFiles.length === 0 && refreshableFiles.length === 0) {
    return buildAlreadyCompatiblePayload({
      targetRoot,
      reason:
        'Managed MF host contract files already matched the managed autofix template. No file changes were required.',
      writtenFiles: alreadyCompatibleFiles,
      nextCommand,
    })
  }

  return buildPatchedPayload({
    targetRoot,
    reason:
      refreshableFiles.length > 0
        ? 'Managed MF host contract autofix refreshed stale managed shell contract files and reset the page-task gate to ensure-only until preflight is rerun.'
        : 'Managed MF host contract autofix materialized the minimal managed shell contract and reset the page-task gate to ensure-only until preflight is rerun.',
    changes: [
      ...missingFiles.map((file) => `materialized ${file.relativePath}`),
      ...refreshableFiles.map((file) => `refreshed ${file.relativePath}`),
    ],
    writtenFiles: [...missingFiles, ...refreshableFiles].map((file) => file.relativePath),
    nextCommand,
  })
}
