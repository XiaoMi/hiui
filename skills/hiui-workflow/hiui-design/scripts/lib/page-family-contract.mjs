const PAGE_FAMILY_CONTRACTS = Object.freeze({
  'typical-page': Object.freeze({
    label: '典型页面',
    supportsBusinessSlotReplacement: true,
    supportsLocalAdjustment: true,
    supportedAdaptationModes: ['family-default', 'local-adjustment'],
    independentWorkflowCategory: 'rule-driven-workflow',
    legacyRefactorContractMode: 'none',
    workflowManifestPath: '',
    archetypeManifestPath: '',
    coordinationPatternManifestPath: '',
    description:
      'Typical pages default to official-template business-slot replacement, and may use controlled local adjustment when the base shell still remains dominant.',
  }),
  'analytics-page': Object.freeze({
    label: '分析页面',
    supportsBusinessSlotReplacement: false,
    supportsLocalAdjustment: true,
    localAdjustmentImplementationBoundary:
      'structure-composition-only; page-level freehand component semantics are forbidden',
    supportedAdaptationModes: ['family-default', 'local-adjustment'],
    independentWorkflowCategory: 'data-visualization-workflow',
    legacyRefactorContractMode: 'analytics-refactor-contract',
    workflowManifestPath: '',
    archetypeManifestPath: '',
    coordinationPatternManifestPath: '',
    description:
      'Analytics pages keep the shell and whiteBody fixed, generate content by workflow rules, and may use local adjustment only as structure composition over managed primitives; page-level freehand component semantics remain forbidden.',
  }),
  'non-typical-page': Object.freeze({
    label: '非典型页面',
    supportsBusinessSlotReplacement: false,
    supportsLocalAdjustment: false,
    supportedAdaptationModes: ['family-default'],
    independentWorkflowCategory: 'non-typical-workflow',
    legacyRefactorContractMode: 'family-specific-contract',
    workflowManifestPath: 'docs/generation/page-family-workflows.manifest.json',
    archetypeManifestPath: 'docs/generation/non-typical-workflow-archetypes.json',
    coordinationPatternManifestPath: 'docs/generation/non-typical-workflow-archetypes.json',
    description:
      'Non-typical pages use family-specific pre-code guidance, a minimal contract, workflow manifests, and sample validation for rules-composition decisions; planner, brief, and family generator are publicly open for the validated v1 scope, while legacy reconstruction remains blocked.',
  }),
})

export function listKnownPageFamilies() {
  return Object.keys(PAGE_FAMILY_CONTRACTS)
}

export function isKnownPageFamily(pageFamily) {
  const normalized = String(pageFamily || '').trim()
  return Boolean(PAGE_FAMILY_CONTRACTS[normalized])
}

export function getPageFamilyContract(pageFamily) {
  const normalized = String(pageFamily || '').trim()
  const contract = PAGE_FAMILY_CONTRACTS[normalized]

  if (!contract) {
    throw new Error(
      `Unknown pageFamily "${normalized}". Known page families: ${listKnownPageFamilies().join(', ')}`
    )
  }

  return {
    id: normalized,
    ...contract,
  }
}
