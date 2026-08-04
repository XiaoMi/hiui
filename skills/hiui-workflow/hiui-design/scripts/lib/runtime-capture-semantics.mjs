import { getLightFlowFeatureFlags } from './light-flow-feature-flags.mjs'

function normalizeUrl(value) {
  return String(value || '').trim()
}

function isLoopbackHostname(hostname) {
  const normalized = String(hostname || '').trim().toLowerCase().replace(/^\[|\]$/g, '')
  if (!normalized) return true
  if (['localhost', '127.0.0.1', '0.0.0.0', '::1', 'host.docker.internal'].includes(normalized)) return true
  if (normalized.endsWith('.localhost')) return true
  if (/^127(?:\.\d{1,3}){3}$/.test(normalized)) return true
  if (/(^|\.)127(?:\.\d{1,3}){3}(\.|$)/.test(normalized)) return true
  return false
}

export function isLocalRuntimeUrl(value) {
  const raw = normalizeUrl(value)
  if (!raw) return true
  try {
    const url = new URL(raw)
    return isLoopbackHostname(url.hostname) || url.protocol === 'file:'
  } catch {
    return true
  }
}

export function classifyRuntimeCapture({ runtimeUrl = '', runtimeEvidence = null, capturedRuntimeEvidencePath = '' } = {}) {
  const requestedUrl = normalizeUrl(runtimeUrl)
  const evidenceUrl = normalizeUrl(runtimeEvidence?.url)
  if (!runtimeEvidence) {
    return {
      kind: requestedUrl ? 'failed' : 'not-run',
      runtimeUrl: requestedUrl,
      evidenceUrl,
      hostBacked: false,
      captured: false,
      issues: requestedUrl ? ['runtime evidence capture failed or produced no evidence'] : [],
    }
  }

  const sourceUrl = evidenceUrl || requestedUrl
  const hostBacked = Boolean(sourceUrl) && !isLocalRuntimeUrl(sourceUrl)
  const captured = Boolean(capturedRuntimeEvidencePath)
  const kind = captured
    ? hostBacked
      ? 'captured-host'
      : 'captured-local'
    : hostBacked && evidenceUrl && (!requestedUrl || evidenceUrl === requestedUrl)
      ? 'provided-host'
      : 'provided-local'
  const issues = []
  if (kind === 'provided-local' && requestedUrl && evidenceUrl && evidenceUrl !== requestedUrl) {
    issues.push('provided runtime evidence url does not match --runtime-url')
  }
  return {
    kind,
    runtimeUrl: requestedUrl,
    evidenceUrl,
    hostBacked,
    captured,
    issues,
  }
}

export function evaluateRuntimeCaptureForProfile({ profile = 'preview', capture }) {
  if (profile !== 'delivery') return { ok: true, issues: [] }
  if (capture?.kind === 'captured-host') return { ok: true, issues: [] }
  if (capture?.kind === 'provided-host' && getLightFlowFeatureFlags().allowProvidedHostEvidence) {
    return { ok: true, issues: [] }
  }
  return {
    ok: false,
    issues: [
      `delivery acceptance requires captured-host runtime evidence; current runtimeCapture=${capture?.kind || 'missing'}`,
    ],
  }
}
