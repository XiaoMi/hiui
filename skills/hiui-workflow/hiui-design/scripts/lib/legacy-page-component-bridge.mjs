import { getAdapterRegistryEntry } from './adapter-registry.mjs'

function normalizeModeId(mode) {
  if (mode === 'host-compatible') return 'legacy-host-compatible'
  return String(mode || '').trim()
}

export function legacyHostFamilyGate({ mode, legacyHostFamily }) {
  if (normalizeModeId(mode) !== 'legacy-host-compatible') {
    return { allowed: true, reason: '', hostFamily: null }
  }

  if (legacyHostFamily?.status !== 'matched') {
    const missingFacts = Array.isArray(legacyHostFamily?.missingFacts) ? legacyHostFamily.missingFacts : []
    const missingFactsLabel = missingFacts.length > 0
      ? missingFacts.map((fact) => String(fact).replaceAll('-', ' ')).join(' and ')
      : 'legacy host family'
    const blockingReason = Array.isArray(legacyHostFamily?.blockingReasons)
      ? legacyHostFamily.blockingReasons.find(Boolean)
      : ''
    return {
      allowed: false,
      reason:
        blockingReason ||
        `legacy host family is not matched; provide ${missingFactsLabel} facts before selecting a page component`,
      hostFamily: legacyHostFamily || null,
    }
  }

  return { allowed: true, reason: '', hostFamily: legacyHostFamily }
}

export function runtimeAdapterProofForComponent({
  component,
  hostFamilyGate = null,
  legacyHostFamily = null,
  mode,
  skillRoot,
}) {
  if (normalizeModeId(mode) !== 'legacy-host-compatible') return null

  const resolvedHostFamilyGate =
    hostFamilyGate || legacyHostFamilyGate({ mode: 'legacy-host-compatible', legacyHostFamily })

  const support = component?.legacyRuntimeAdapterSupport || null
  const adapterId = support?.defaultAdapterId || component?.adapterIds?.[0] || ''
  const adapter = adapterId ? getAdapterRegistryEntry(adapterId, { skillRoot }) : null
  const requiredCapabilities = Array.isArray(support?.requiredAdapterCapabilities)
    ? support.requiredAdapterCapabilities
    : []
  const allowedResponsibilities = Array.isArray(adapter?.allowedResponsibilities)
    ? adapter.allowedResponsibilities
    : []
  const missingCapabilities = requiredCapabilities.filter(
    (capability) => !allowedResponsibilities.includes(capability)
  )

  if (!support) {
    return {
      required: true,
      status: 'blocked',
      kind: 'legacy-runtime-adapter',
      adapterId,
      responsibility: adapter?.responsibility || '',
      reason: 'page component does not declare legacy runtime adapter support',
      missingCapabilities,
    }
  }

  if (!adapter) {
    return {
      required: true,
      status: 'blocked',
      kind: support.adapterKind || 'legacy-runtime-adapter',
      adapterId,
      responsibility: '',
      reason: `legacy runtime adapter ${adapterId || '(missing)'} is not registered`,
      missingCapabilities,
    }
  }

  if (!resolvedHostFamilyGate.allowed) {
    return {
      required: true,
      status: 'blocked',
      kind: support.adapterKind || adapter.kind || 'legacy-runtime-adapter',
      adapterId,
      responsibility: adapter.responsibility || 'runtime-bridge-only',
      reason: resolvedHostFamilyGate.reason,
      missingCapabilities,
    }
  }

  if (missingCapabilities.length > 0) {
    return {
      required: true,
      status: 'blocked',
      kind: support.adapterKind || adapter.kind || 'legacy-runtime-adapter',
      adapterId,
      responsibility: adapter.responsibility || 'runtime-bridge-only',
      reason: 'legacy runtime adapter is missing required capabilities',
      missingCapabilities,
    }
  }

  return {
    required: true,
    status: 'available',
    kind: support.adapterKind || adapter.kind || 'legacy-runtime-adapter',
    adapterId,
    responsibility: adapter.responsibility || 'runtime-bridge-only',
    reason: 'legacy runtime adapter is available for the certified page component',
    missingCapabilities: [],
  }
}
