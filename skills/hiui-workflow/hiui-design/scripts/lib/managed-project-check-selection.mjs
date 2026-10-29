function normalizeString(value) {
  return String(value || '').trim()
}

export function resolveManagedGenerationProjectCheckSelection({
  dryRun = false,
  semanticReadiness = null,
  artifactSummary = {},
} = {}) {
  const readiness =
    semanticReadiness && typeof semanticReadiness === 'object'
      ? semanticReadiness
      : { status: 'unknown', ready: true, blockedBy: [], reason: '' }
  const businessSemanticArtifactCount = Number(artifactSummary?.businessSemanticArtifactCount || 0)

  if (dryRun) {
    return {
      strategy: 'skip-dry-run',
      selectedProfile: 'none',
      shouldRun: false,
      reason:
        'Dry-run only validates the generation contract and should not spend project-check budget before files are materialized.',
    }
  }

  if (businessSemanticArtifactCount > 0) {
    return {
      strategy: 'business-artifacts-written',
      selectedProfile: 'auto',
      shouldRun: true,
      reason:
        'Business-bearing page artifacts were written, so the next engineering verification should prefer the local auto project-check profile.',
    }
  }

  return {
    strategy: 'support-artifacts-only',
    selectedProfile: 'typecheck-only',
    shouldRun: true,
    reason:
      'Only support artifacts changed, so a lighter typecheck-only project check is sufficient as the next engineering step.',
  }
}
