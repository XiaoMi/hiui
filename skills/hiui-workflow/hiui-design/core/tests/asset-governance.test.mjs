import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildGenerationDecision,
  buildManagedPageMeta,
  normalizeGenerationDecision,
  normalizeGenerationMode,
  resolveAssetGovernance,
  resolveAssetGovernanceState,
  resolvePageTypeGovernancePolicy,
  resolveReferenceAssetTemplatePathForMode,
} from '../generators/asset-governance.mjs'

test('normalizeGenerationMode infers official-runtime from legacy meta payloads', () => {
  assert.equal(
    normalizeGenerationMode({
      assetSource: '.local-context/hiui-design/core/runtime-families/official-runtime',
    }),
    'official-runtime'
  )
  assert.equal(
    normalizeGenerationMode({
      assetSource: '.local-context/hiui-design/core/page-assets/table-basic',
    }),
    'canonical'
  )
  assert.equal(
    normalizeGenerationMode({
      assetSource: '.local-context/hiui-design/templates/archetypes/host-integration/table-basic/page.template.tsx',
    }),
    'reference-asset'
  )
})

test('resolveAssetGovernance keeps non-legacy canonical compatibility pages on official-mirror governance', () => {
  const governance = resolveAssetGovernance({
    pageType: 'full-page-detail',
    generationMode: 'canonical',
    assetSource: '.local-context/hiui-design/core/page-assets/full-page-detail',
    projectMode: 'host-integration',
    projectType: 'brownfield',
  })

  assert.equal(governance.assetMode, 'official-mirror')
  assert.equal(governance.standardsSource, 'hiui-design-official')
  assert.equal(governance.standardsBaselineType, 'official-reference-source')
  assert.equal(
    governance.standardsBaselinePath,
    '.local-context/hiui-design/reference/host-integration/src/pages/full-page-detail.tsx'
  )
  assert.equal(governance.syncStatus, 'managed-by-parity-manifest')
})

test('buildManagedPageMeta writes governance block for official runtime pages', () => {
  const meta = buildManagedPageMeta({
    generatedAt: '2026-07-13T00:00:00.000Z',
    pageType: 'table-stat',
    assetSource: '.local-context/hiui-design/core/runtime-families/official-runtime',
    schemaSource: '.local-context/hiui-design/core/recipes/probes/table-stat.schema.json',
    generator: 'hiui-pagegen',
    generationMode: 'official-runtime',
    officialRuntime: {
      pageId: 'table-stat',
      resolvedPageId: 'table-stat',
      title: '官方数据统计表',
      registrySource: '.local-context/hiui-design/core/runtime-families/official-runtime-pages.json',
      subappRoot: 'subapps/typical-page-shell-runtime',
    },
  })

  assert.equal(meta.generatorMode, 'official-runtime')
  assert.equal(meta.runtimeFamily, 'official-runtime')
  assert.equal(meta.assetGovernance.assetMode, 'official-runtime-entry')
  assert.equal(meta.assetGovernance.syncStatus, 'managed-by-official-runtime-registry')
})

test('buildManagedPageMeta keeps explicit reference asset metadata when provided', () => {
  const meta = buildManagedPageMeta({
    generatedAt: '2026-07-15T00:00:00.000Z',
    pageType: 'table-basic',
    assetSource: '.local-context/hiui-design/templates/archetypes/host-integration/table-basic/page.template.tsx',
    schemaSource: '.local-context/hiui-design/core/recipes/probes/table-basic.schema.json',
    generationMode: 'reference-asset',
    referenceAsset: {
      mode: 'explicit-asset',
      source: 'page-type-manifest',
      generationStrategy: 'copy-example-source-replace-business-slots',
      pageTypeRegistrySource: '.local-context/hiui-design/rules/common.page-types.json',
      shell: 'TablePageFrame',
      examplePath: 'src/typical-page-reuse/pages/basic-table.tsx',
      assetExamplePath: 'examples/host-integration/src/pages/basic-table.tsx',
      templateAssetSource:
        '.local-context/hiui-design/templates/archetypes/host-integration/table-basic/page.template.tsx',
      canonicalComponentPath: '',
    },
    generationDecision: buildGenerationDecision({
      requestedMode: '',
      governancePreferredMode: 'reference-asset',
      finalMode: 'reference-asset',
      projectMode: 'host-integration',
      projectType: 'greenfield',
    }),
  })

  assert.equal(meta.generatorMode, 'reference-asset')
  assert.equal(meta.runtimeFamily, 'reference-asset')
  assert.equal(meta.assetGovernance.assetMode, 'reference-asset')
  assert.equal(meta.assetGovernance.standardsBaselineType, 'reference-example')
  assert.equal(meta.assetGovernance.standardsBaselinePath, 'src/typical-page-reuse/pages/basic-table.tsx')
  assert.equal(meta.referenceAsset?.mode, 'explicit-asset')
  assert.equal(meta.referenceAsset?.source, 'page-type-manifest')
  assert.equal(meta.generationDecision?.source, 'governance-preferred')
  assert.equal(meta.generationDecision?.projectMode, 'host-integration')
  assert.equal(
    meta.referenceAsset?.generationStrategy,
    'copy-example-source-replace-business-slots'
  )
  assert.equal(meta.referenceAsset?.examplePath, 'src/typical-page-reuse/pages/basic-table.tsx')
})

test('buildManagedPageMeta upgrades analytics canonical pages into managed analytics shells', () => {
  const meta = buildManagedPageMeta({
    generatedAt: '2026-07-15T00:00:00.000Z',
    pageType: 'data-visualization',
    assetSource: '.local-context/hiui-design/core/page-assets/data-visualization',
    schemaSource: '.local-context/hiui-design/core/recipes/probes/data-visualization.schema.json',
    generationMode: 'canonical',
  })

  assert.equal(meta.generatorMode, 'canonical')
  assert.equal(meta.runtimeFamily, 'local-managed-analytics')
  assert.equal(meta.generationStrategy, 'managed-analytics')
  assert.equal(meta.assetGovernance.profileId, 'managed-analytics-shell')
  assert.equal(meta.assetGovernance.assetMode, 'managed-analytics-shell')
  assert.equal(meta.assetGovernance.assetClass, 'managed-analytics-shell')
  assert.equal(meta.assetGovernance.deliveryRole, 'managed-analytics-business-shell')
  assert.equal(meta.assetGovernance.parityContract, 'managed-analytics-wrapper-required')
})

test('normalizeGenerationDecision derives explicit canonical intent for governance gating', () => {
  const decision = normalizeGenerationDecision(
    {
      requestedMode: 'canonical',
      governancePreferredMode: 'reference-asset',
      finalMode: 'canonical',
      projectMode: 'rules-only',
      projectType: 'greenfield',
    },
    'canonical'
  )

  assert.deepEqual(decision, {
    requestedMode: 'canonical',
    governancePreferredMode: 'reference-asset',
    finalMode: 'canonical',
    source: 'explicit-request',
    projectMode: 'rules-only',
    projectType: 'greenfield',
  })
})

test('resolvePageTypeGovernancePolicy defaults ordinary typical pages to standard-result truth', () => {
  const policy = resolvePageTypeGovernancePolicy('table-basic')

  assert.equal(policy.compatibilityProfile, 'legacy-standard-result')
  assert.equal(policy.canonicalProfile, 'legacy-standard-result')
  assert.deepEqual(policy.truthSourcePriority, [
    'direct-standard-component',
    'reference-asset',
    'official-runtime-entry',
    'legacy-delivery-plugin',
    'managed-fallback',
    'legacy',
  ])
})

test('resolvePageTypeGovernancePolicy preserves example-first routes for greenfield host-integration contexts', () => {
  const policy = resolvePageTypeGovernancePolicy('table-basic', {
    projectMode: 'host-integration',
    projectType: 'greenfield',
  })

  assert.equal(policy.compatibilityProfile, 'official-mirror')
  assert.equal(policy.canonicalProfile, 'official-mirror')
  assert.deepEqual(policy.truthSourcePriority, [
    'reference-asset',
    'official-runtime-entry',
    'official-mirror',
    'managed-fallback',
    'legacy',
  ])
  assert.deepEqual(policy.preferredGenerationModes, {
    'host-integration:greenfield': 'reference-asset',
    'rules-only:greenfield': 'reference-asset',
  })
})

test('resolvePageTypeGovernancePolicy switches legacy-host-compatible ordinary pages to component-first truth priority', () => {
  const policy = resolvePageTypeGovernancePolicy('table-basic', {
    projectMode: 'legacy-host-compatible',
    projectType: 'brownfield',
  })

  assert.equal(policy.compatibilityProfile, 'legacy-standard-result')
  assert.equal(policy.deliveryBindingProfile, 'legacy-delivery-plugin')
  assert.deepEqual(policy.truthSourcePriority, [
    'direct-standard-component',
    'reference-asset',
    'official-runtime-entry',
    'legacy-delivery-plugin',
    'managed-fallback',
    'legacy',
  ])
  assert.deepEqual(policy.preferredGenerationModes, {
    'host-integration:greenfield': 'reference-asset',
    'rules-only:greenfield': 'reference-asset',
  })
})

test('resolveAssetGovernanceState exposes richer reference-asset governance facts', () => {
  const governanceState = resolveAssetGovernanceState({
    pageType: 'table-basic',
    generationMode: 'reference-asset',
    assetSource: '.local-context/hiui-design/templates/archetypes/host-integration/table-basic/page.template.tsx',
    referenceAsset: {
      mode: 'explicit-asset',
      examplePath: 'src/typical-page-reuse/pages/basic-table.tsx',
    },
  })

  assert.equal(governanceState.governanceSchemaVersion, 'asset-governance.v3')
  assert.equal(governanceState.profileId, 'reference-asset')
  assert.equal(governanceState.assetClass, 'reference-example')
  assert.equal(governanceState.deliveryRole, 'managed-business-page-template')
  assert.equal(governanceState.readiness, 'production-ready')
  assert.equal(governanceState.parityStatus, 'example-anchored')
  assert.deepEqual(governanceState.preferredContexts, [
    'host-integration:greenfield',
    'rules-only:greenfield',
  ])
  assert.deepEqual(governanceState.allowedModes, [
    'host-integration',
    'rules-only',
    'legacy-host-compatible',
  ])
})

test('resolveAssetGovernanceState marks canonical mirrors as compatibility shells instead of source-of-truth pages', () => {
  const governanceState = resolveAssetGovernanceState({
    pageType: 'full-page-detail',
    generationMode: 'canonical',
    assetSource: '.local-context/hiui-design/core/page-assets/full-page-detail',
    projectMode: 'host-integration',
    projectType: 'brownfield',
  })

  assert.equal(governanceState.profileId, 'official-mirror')
  assert.equal(governanceState.assetMode, 'official-mirror')
  assert.equal(governanceState.assetClass, 'canonical-asset')
  assert.equal(governanceState.deliveryRole, 'compatibility-canonical-shell')
  assert.equal(governanceState.readiness, 'compatibility-ready')
  assert.equal(governanceState.parityStatus, 'parity-manifest-required')
  assert.equal(governanceState.compatibilityProfileId, 'official-mirror')
  assert.equal(governanceState.parityContract, 'required')
  assert.equal(governanceState.driftWhitelistPolicy, 'zero-or-explicit-whitelist')
  assert.deepEqual(governanceState.preferredContexts, [
    'legacy-host-compatible:any',
    'host-integration:brownfield',
  ])
  assert.deepEqual(governanceState.truthSourcePriority, [
    'reference-asset',
    'official-runtime-entry',
    'official-mirror',
    'managed-fallback',
    'legacy',
  ])
})

test('buildManagedPageMeta carries legacy component-first truth priority into managed page metadata', () => {
  const meta = buildManagedPageMeta({
    generatedAt: '2026-07-16T00:00:00.000Z',
    pageType: 'table-basic',
    assetSource: '.local-context/hiui-design/core/page-assets/table-basic',
    schemaSource: '.local-context/hiui-design/core/recipes/probes/table-basic.schema.json',
    generationMode: 'canonical',
    generationDecision: buildGenerationDecision({
      requestedMode: '',
      governancePreferredMode: '',
      finalMode: 'canonical',
      projectMode: 'legacy-host-compatible',
      projectType: 'brownfield',
    }),
  })

  assert.equal(meta.assetGovernance.profileId, 'legacy-standard-result')
  assert.equal(meta.assetGovernance.assetMode, 'standard-result-asset')
  assert.equal(meta.assetGovernance.deliveryBindingProfileId, 'legacy-delivery-plugin')
  assert.deepEqual(meta.assetGovernance.truthSourcePriority, [
    'direct-standard-component',
    'reference-asset',
    'official-runtime-entry',
    'legacy-delivery-plugin',
    'managed-fallback',
    'legacy',
  ])
})

test('resolveAssetGovernanceState exposes managed-fallback governance debt controls', () => {
  const governanceState = resolveAssetGovernanceState({
    pageType: 'non-registered-page-type',
    generationMode: 'canonical',
    assetSource: '.local-context/hiui-design/core/page-assets/non-registered-page-type',
  })

  assert.equal(governanceState.profileId, 'managed-fallback')
  assert.equal(governanceState.assetMode, 'managed-fallback')
  assert.equal(governanceState.owner, 'hiui-design-asset-governance')
  assert.equal(governanceState.replacementTarget, 'reference-asset-or-page-component')
  assert.equal(governanceState.expiryPolicy, 'must-not-become-default')
  assert.deepEqual(governanceState.entryCriteria, [
    'standard-primary-asset-unavailable',
    'structure-upgrade-required',
    'host-constraint-explicitly-blocks-primary-chain',
  ])
  assert.deepEqual(governanceState.exitCriteria, [
    'official-mirror-available',
    'reference-asset-available',
    'page-component-ready',
  ])
})

test('resolvePageTypeGovernancePolicy allows analytics page types to override the default greenfield route', () => {
  const policy = resolvePageTypeGovernancePolicy('data-visualization')

  assert.equal(policy.preferredGenerationModes['host-integration:greenfield'], 'canonical')
  assert.equal(policy.preferredGenerationModes['rules-only:greenfield'], 'canonical')
  assert.equal(policy.compatibilityProfile, 'managed-analytics-shell')
})

test('resolveReferenceAssetTemplatePathForMode falls back to host-integration templates for rules-only gaps', () => {
  const templatePath = resolveReferenceAssetTemplatePathForMode({
    projectMode: 'rules-only',
    pageType: 'table-basic',
  })

  assert.equal(
    templatePath.endsWith(
      '/.local-context/hiui-design/templates/archetypes/host-integration/table-basic/page.template.tsx'
    ),
    true
  )
})
