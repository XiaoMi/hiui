import { getLightFlowFeatureFlags } from './light-flow-feature-flags.mjs'

const VALID_ACCEPTANCE_PROFILES = new Set(['preview', 'delivery'])
const READY_STATUSES = new Set(['preview-ready', 'delivery-ready', 'accepted'])

export function normalizeLegacyAcceptanceProfile(profile) {
  const normalized = String(profile || getLightFlowFeatureFlags().acceptanceProfile).trim() || 'preview'
  if (!VALID_ACCEPTANCE_PROFILES.has(normalized)) {
    throw new Error(`Unsupported legacy acceptance profile: ${normalized}. Expected preview or delivery.`)
  }
  return normalized
}

export function resolveLegacyAcceptanceStatus({ profile = 'preview', passed = false } = {}) {
  const normalizedProfile = normalizeLegacyAcceptanceProfile(profile)
  if (!passed) return 'failed'
  return normalizedProfile === 'delivery' ? 'delivery-ready' : 'preview-ready'
}

export function isLegacyAcceptanceReadyStatus(status) {
  return READY_STATUSES.has(String(status || '').trim())
}
