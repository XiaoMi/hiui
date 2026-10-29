function normalizeString(value) {
  return String(value || '').trim()
}

export function buildPageRelationStageDetails({
  brief = null,
  resultPayload = null,
  pageRelationDecision = null,
  pageRelationDecisionSource = '',
  relatedPagePath = '',
  expectedExposeTarget = '',
  persistedMetaPath = '',
} = {}) {
  const resolvedDecision =
    pageRelationDecision ||
    brief?.pageGenerationDecision?.pageRelationDecision ||
    resultPayload?.pageRelationDecision ||
    resultPayload?.pageGenerationDecision?.pageRelationDecision ||
    {}
  const resolvedRelatedPagePath =
    normalizeString(relatedPagePath) ||
    normalizeString(resultPayload?.relatedPagePath) ||
    normalizeString(brief?.outputTargetEvidence?.relatedPagePath) ||
    normalizeString(resultPayload?.outputTargetEvidence?.relatedPagePath)
  const resolvedExpectedExposeTarget =
    normalizeString(expectedExposeTarget) ||
    normalizeString(resultPayload?.expectedExposeTarget) ||
    normalizeString(resultPayload?.mfExposeTargetPath) ||
    normalizeString(resultPayload?.managedMfPublishEntry?.path)

  return {
    pageRelationKind: normalizeString(resolvedDecision?.kind) || 'undetermined',
    pageRelationConfidence: normalizeString(resolvedDecision?.confidence) || 'low',
    pageRelationReason: normalizeString(resolvedDecision?.reason),
    pageRelationDecisionSource:
      normalizeString(pageRelationDecisionSource) || normalizeString(resultPayload?.pageRelationDecisionSource),
    relatedPagePath: resolvedRelatedPagePath,
    targetBusinessPath:
      normalizeString(brief?.requestedBusiness?.targetBusinessPath) ||
      normalizeString(resultPayload?.requestedBusiness?.targetBusinessPath),
    expectedExposeTarget: resolvedExpectedExposeTarget,
    persistedMetaPath:
      normalizeString(persistedMetaPath) || normalizeString(resultPayload?.persistedMetaPath),
  }
}
