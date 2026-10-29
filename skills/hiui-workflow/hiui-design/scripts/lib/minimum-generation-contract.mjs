const PAGE_TYPES_REQUIRING_MINIMUM_GENERATION_CONTRACT = new Set([
  'table-stat',
  'table-basic',
  'tree-split',
])

const MINIMUM_GENERATION_CONTRACT_KEYS = [
  'sectionSequence',
  'surfaceContract',
  'visualInvariants',
  'pitfallAlerts',
]

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeStringArray(values) {
  return Array.isArray(values)
    ? values.map((value) => normalizeString(value)).filter(Boolean)
    : []
}

export function requiresPageTypeSpecificMinimumGenerationContract(pageTypeId) {
  return PAGE_TYPES_REQUIRING_MINIMUM_GENERATION_CONTRACT.has(normalizeString(pageTypeId))
}

export function normalizeMinimumGenerationContract(contract = {}) {
  const normalized = {}

  for (const key of MINIMUM_GENERATION_CONTRACT_KEYS) {
    normalized[key] = normalizeStringArray(contract?.[key])
  }

  return normalized
}

export function validateMinimumGenerationContract({ pageTypeId, contract }) {
  if (!requiresPageTypeSpecificMinimumGenerationContract(pageTypeId)) {
    return []
  }

  if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
    return [`${pageTypeId}: missing minimumGenerationContract`]
  }

  const normalized = normalizeMinimumGenerationContract(contract)
  const violations = []

  for (const key of MINIMUM_GENERATION_CONTRACT_KEYS) {
    if (normalized[key].length === 0) {
      violations.push(`${pageTypeId}: minimumGenerationContract.${key} must be a non-empty array`)
    }
  }

  return violations
}
