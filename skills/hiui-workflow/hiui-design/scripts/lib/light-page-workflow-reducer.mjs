export const LIGHT_PAGE_WORKFLOW_STATUSES = [
  'planned',
  'generated',
  'generated-blocked',
  'preview-ready',
  'delivery-ready',
  'failed',
]

const STATUS_RANK = new Map(LIGHT_PAGE_WORKFLOW_STATUSES.map((status, index) => [status, index]))

function normalizeStatus(status) {
  const normalized = String(status || '').trim()
  return STATUS_RANK.has(normalized) ? normalized : ''
}

function shouldPreventRegression(previousStatus, nextStatus) {
  const previousRank = STATUS_RANK.get(previousStatus)
  const nextRank = STATUS_RANK.get(nextStatus)
  if (previousRank === undefined || nextRank === undefined) return false
  if (nextStatus === 'failed' || nextStatus === 'generated-blocked') return false
  if (previousStatus === 'failed' || previousStatus === 'generated-blocked') return false
  return nextRank < previousRank
}

export function reduceLightPageWorkflow(previousWorkflow = {}, event = {}) {
  const previous = previousWorkflow && typeof previousWorkflow === 'object' ? previousWorkflow : {}
  const eventType = String(event.type || '').trim()
  const timestamp = String(event.at || '').trim() || new Date().toISOString()
  const previousLightStatus = normalizeStatus(previous.lightFlowStatus || previous.status)
  let nextLightStatus = ''

  if (eventType === 'plan-created') nextLightStatus = 'planned'
  if (eventType === 'generation-completed') nextLightStatus = event.blocked ? 'generated-blocked' : 'generated'
  if (eventType === 'acceptance-completed') nextLightStatus = normalizeStatus(event.status) || 'failed'
  if (eventType === 'failed') nextLightStatus = 'failed'
  if (!nextLightStatus) {
    throw new Error(`Unsupported light page workflow event: ${eventType || 'missing'}`)
  }
  if (shouldPreventRegression(previousLightStatus, nextLightStatus)) {
    nextLightStatus = previousLightStatus
  }

  return {
    ...previous,
    lightFlowStatus: nextLightStatus,
    lightFlowUpdatedAt: timestamp,
    lightFlowLastEvent: eventType,
    lightPlanPath: String(event.lightPlanPath || previous.lightPlanPath || '').trim(),
    generationStatus: String(event.generationStatus || previous.generationStatus || '').trim(),
    acceptanceProfile: String(event.acceptanceProfile || previous.acceptanceProfile || '').trim(),
    acceptanceStatus: String(event.acceptanceStatus || (eventType === 'acceptance-completed' ? event.status : '') || previous.acceptanceStatus || '').trim(),
  }
}
