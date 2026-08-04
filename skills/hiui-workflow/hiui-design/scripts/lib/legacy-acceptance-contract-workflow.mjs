import fs from 'node:fs/promises'
import path from 'node:path'
import {
  computeManagedPageSourceSnapshot,
  normalizeContractPath,
  syncManagedPageRegistry,
  writeManagedPageContractArtifacts,
} from './managed-page-artifacts.mjs'
import {
  buildManagedPageWorkflowMetadata,
  getRulesOnlyPageContractsDir,
} from './rules-only-page-contracts.mjs'
import { isLegacyAcceptanceReadyStatus } from './legacy-acceptance-status.mjs'
import { reduceLightPageWorkflow } from './light-page-workflow-reducer.mjs'

const REQUIRED_ACCEPTANCE_STEPS = [
  'staticGate',
  'adapterGate',
  'build',
  'remoteEntry',
  'runtimeCapture',
  'runtimeDom',
  'domGeometry',
  'visualEvidence',
  'warningClassification',
]

function toPosixPath(value) {
  return String(value || '').replace(/\\/g, '/')
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function contractMarkdownPathForJson(contractJsonPath) {
  return contractJsonPath.replace(/\.json$/u, '.md')
}

export function validateLegacyAcceptanceForWorkflow(report) {
  const issues = []
  if (!report || typeof report !== 'object') {
    return { ok: false, issues: ['legacy acceptance report is required'] }
  }
  if (report.schemaVersion !== 'legacy-acceptance-result.v1') {
    issues.push('schemaVersion must be legacy-acceptance-result.v1')
  }
  if (!isLegacyAcceptanceReadyStatus(report.status) || report.accepted !== true) {
    issues.push(`legacy acceptance status must be preview-ready or delivery-ready; current status=${report.status || 'missing'}`)
  }
  for (const stepName of REQUIRED_ACCEPTANCE_STEPS) {
    const status = report.steps?.[stepName]?.status
    if (
      (stepName === 'adapterGate' || stepName === 'runtimeCapture' || stepName === 'domGeometry') &&
      report.status === 'accepted' &&
      status === undefined
    ) {
      continue
    }
    if (status !== 'passed') {
      issues.push(`legacy acceptance step ${stepName} must be passed; current status=${status || 'missing'}`)
    }
  }
  return { ok: issues.length === 0, issues }
}

export async function findLegacyPageContractForPage({ target, page }) {
  const targetRoot = path.resolve(target)
  const normalizedPagePath = toPosixPath(path.isAbsolute(page) ? path.relative(targetRoot, page) : page)
  const candidatePagePaths = new Set([normalizedPagePath])
  if (!/\.[cm]?[jt]sx?$/u.test(normalizedPagePath)) {
    candidatePagePaths.add(`${normalizedPagePath.replace(/\/$/u, '')}/page.instance.tsx`)
  }
  const contractsDir = getRulesOnlyPageContractsDir(targetRoot)
  const entries = (await fs.readdir(contractsDir).catch(() => [])).filter((entry) => entry.endsWith('.json')).sort()
  for (const entry of entries) {
    const contractJsonPath = path.join(contractsDir, entry)
    try {
      const contract = await readJson(contractJsonPath)
      if (candidatePagePaths.has(toPosixPath(contract.generatedPagePath))) {
        return {
          contract,
          contractJsonPath,
          contractMarkdownPath: contractMarkdownPathForJson(contractJsonPath),
        }
      }
    } catch {
      // Ignore unrelated invalid contract files here; static legacy:verify reports the matching contract state.
    }
  }
  return {
    contract: null,
    contractJsonPath: '',
    contractMarkdownPath: '',
  }
}

export async function writeLegacyAcceptanceWorkflow({ target, page, report, reportPath }) {
  const targetRoot = path.resolve(target)
  const validation = validateLegacyAcceptanceForWorkflow(report)
  if (!validation.ok) {
    return { status: 'skipped', changed: false, reason: validation.issues.join('; ') }
  }

  const contractContext = await findLegacyPageContractForPage({ target: targetRoot, page })
  if (!contractContext.contract) {
    return {
      status: 'skipped',
      changed: false,
      reason: `managed page contract was not found for ${toPosixPath(page)}`,
    }
  }

  const sourceSnapshot = computeManagedPageSourceSnapshot({
    generatedPagePath: contractContext.contract.generatedPagePath,
    targetRoot,
  })
  const previousWorkflow = contractContext.contract.workflow || {}
  const acceptedAt = String(previousWorkflow.legacyAcceptanceAcceptedAt || '').trim() || new Date().toISOString()
  const normalizedReportPath = normalizeContractPath(targetRoot, reportPath || report.reportPath || '')

  const managedWorkflow = buildManagedPageWorkflowMetadata({
    ...previousWorkflow,
    legacyAcceptanceStatus: 'pass',
    legacyAcceptanceReportPath: normalizedReportPath,
    legacyAcceptanceSnapshotHash: sourceSnapshot.hash,
    legacyAcceptanceAcceptedAt: acceptedAt,
    legacyAcceptanceCommand: 'typical-page:legacy:accept',
    sourceSnapshotHash: sourceSnapshot.hash,
    staleReason: '',
    lastCommand: 'typical-page:legacy:accept',
  })
  contractContext.contract.workflow = reduceLightPageWorkflow({ ...previousWorkflow, ...managedWorkflow }, {
    type: 'acceptance-completed',
    status: report.status,
    acceptanceProfile: report.acceptanceProfile || 'preview',
    acceptanceStatus: report.status,
  })

  const markdownExists = await pathExists(contractContext.contractMarkdownPath)
  const writeResult = await writeManagedPageContractArtifacts({
    contract: contractContext.contract,
    contractJsonPath: contractContext.contractJsonPath,
    contractMarkdownPath: markdownExists
      ? contractContext.contractMarkdownPath
      : contractMarkdownPathForJson(contractContext.contractJsonPath),
  })
  await syncManagedPageRegistry(targetRoot)

  return {
    status: 'updated',
    changed: writeResult.changed,
    contractPath: normalizeContractPath(targetRoot, contractContext.contractJsonPath),
    reportPath: normalizedReportPath,
    sourceSnapshotHash: sourceSnapshot.hash,
  }
}
