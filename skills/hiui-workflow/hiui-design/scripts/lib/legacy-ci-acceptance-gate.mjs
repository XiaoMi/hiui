import fs from 'node:fs'
import path from 'node:path'
import { validateLegacyAcceptanceForWorkflow } from './legacy-acceptance-contract-workflow.mjs'
import { getLightFlowFeatureFlags } from './light-flow-feature-flags.mjs'

const PROJECT_MODE_RELATIVE_PATH = '.local-context/hiui-design/outputs/project-mode.json'
const HOST_CONTRACT_RELATIVE_PATH = '.local-context/hiui-design/host-contract.json'
const PAGE_CONTRACTS_RELATIVE_DIR = '.local-context/hiui-design/outputs/page-contracts'

function readJsonIfExists(targetRoot, relativePath) {
  const absolutePath = path.isAbsolute(relativePath) ? relativePath : path.join(targetRoot, relativePath)
  if (!fs.existsSync(absolutePath)) return null
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'))
}

function readJson(targetRoot, filePath) {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(targetRoot, filePath)
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'))
}

function isLegacyMode(value) {
  return String(value || '').trim() === 'legacy-host-compatible'
}

export function hasLegacyAcceptanceRequirement(targetRoot) {
  const projectMode = readJsonIfExists(targetRoot, PROJECT_MODE_RELATIVE_PATH)
  if (isLegacyMode(projectMode?.mode)) return true

  const hostContract = readJsonIfExists(targetRoot, HOST_CONTRACT_RELATIVE_PATH)
  if (isLegacyMode(hostContract?.mode)) return true

  const contractsDir = path.join(targetRoot, PAGE_CONTRACTS_RELATIVE_DIR)
  if (!fs.existsSync(contractsDir)) return false
  const entries = fs.readdirSync(contractsDir).filter((entry) => entry.endsWith('.json')).sort()
  return entries.some((entry) => {
    try {
      const contract = JSON.parse(fs.readFileSync(path.join(contractsDir, entry), 'utf8'))
      return (
        isLegacyMode(contract?.mode) ||
        isLegacyMode(contract?.hostMode) ||
        String(contract?.workflow?.legacyAcceptanceStatus || '').trim() === 'pass' ||
        String(contract?.acceptance?.command || '').trim() === 'typical-page:legacy:accept'
      )
    } catch {
      return false
    }
  })
}

function normalizeCiAcceptanceProfile(profile) {
  const normalized = String(profile || getLightFlowFeatureFlags().acceptanceProfile || 'preview').trim() || 'preview'
  if (!['preview', 'delivery'].includes(normalized)) {
    throw new Error(`Expected legacy acceptance CI profile to be preview or delivery; received ${normalized}`)
  }
  return normalized
}

export function validateLegacyAcceptanceCiGate({ targetRoot, legacyAcceptancePath, optional = false, acceptanceProfile = '' }) {
  const normalizedAcceptanceProfile = normalizeCiAcceptanceProfile(acceptanceProfile)
  const requiresLegacyAcceptance = hasLegacyAcceptanceRequirement(targetRoot)
  if (!legacyAcceptancePath) {
    if (requiresLegacyAcceptance && !optional) {
      throw new Error('legacy acceptance report is required for legacy-host-compatible CI; pass --legacy-acceptance <legacy-acceptance-result.json> after running typical-page:legacy:accept')
    }
    return { status: 'skipped', required: requiresLegacyAcceptance }
  }

  const report = readJson(targetRoot, legacyAcceptancePath)
  const validation = validateLegacyAcceptanceForWorkflow(report)
  if (!validation.ok) {
    throw new Error(`legacy acceptance report failed CI gate: ${validation.issues.join('; ')}`)
  }
  if (normalizedAcceptanceProfile === 'delivery' && report.status !== 'delivery-ready') {
    throw new Error(`legacy acceptance report failed CI gate: delivery profile requires status=delivery-ready; current status=${report.status || 'missing'}`)
  }
  return { status: 'passed', required: requiresLegacyAcceptance, acceptanceProfile: normalizedAcceptanceProfile }
}
