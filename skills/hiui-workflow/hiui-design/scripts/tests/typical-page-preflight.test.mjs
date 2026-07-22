import assert from 'node:assert/strict'
import test from 'node:test'

import {
  checkIdForFailure,
  derivePreflightExecutionState,
  failureCodeForCheckId,
  findLegacyRuntimeAdapterFailures,
  findManagedAnalyticsContractFailures,
  shouldRequireLegacyRuntimeAdapterProof,
} from '../typical-page-preflight.mjs'

function legacyPageComponentContract(runtimeAdapterProof) {
  return {
    archetypeMode: 'legacy-host-compatible',
    pageTypeId: 'table-basic',
    generationProfile: {
      schemaVersion: 'generation-profile.v1',
      strategy: 'page-component',
      mode: 'legacy-host-compatible',
      pageComponentId: 'standard-table-basic-page.v1',
      pageComponentStatus: 'selected',
      ...(runtimeAdapterProof === undefined ? {} : { runtimeAdapterProof }),
    },
  }
}

test('legacy page-component contracts require runtime adapter proof', () => {
  const contract = legacyPageComponentContract()

  assert.equal(shouldRequireLegacyRuntimeAdapterProof(contract), true)

  const failures = findLegacyRuntimeAdapterFailures(contract)
  assert.equal(failures.length, 1)
  assert.match(failures[0], /Missing legacy runtime adapter proof/)
  assert.equal(checkIdForFailure(failures[0]), 'legacyRuntimeAdapter')
  assert.equal(failureCodeForCheckId('legacyRuntimeAdapter'), 'LEGACY_RUNTIME_ADAPTER_MISMATCH')
})

test('legacy runtime adapter proof rejects component translation responsibilities', () => {
  const failures = findLegacyRuntimeAdapterFailures(
    legacyPageComponentContract({
      kind: 'component-translation-adapter',
      status: 'blocked',
      responsibility: 'component-translation',
      responsibilities: [
        'request-schema-binding',
        'replace-query-filter-with-legacy-form',
      ],
      allowedResponsibilities: ['wrap-typical-page-as-business-page-component'],
    })
  )

  assert.equal(failures.length, 4)
  assert.match(failures[0], /expected "legacy-runtime-adapter"/)
  assert.match(failures[1], /expected "available"/)
  assert.match(failures[2], /runtime-bridge-only/)
  assert.match(failures[3], /cannot authorize component translation/)
})

test('legacy runtime adapter proof accepts runtime-bridge-only page-component usage', () => {
  const failures = findLegacyRuntimeAdapterFailures(
    legacyPageComponentContract({
      required: true,
      status: 'available',
      kind: 'legacy-runtime-adapter',
      adapterId: 'legacy-runtime-adapter',
      responsibility: 'runtime-bridge-only',
      missingCapabilities: [],
    })
  )

  assert.deepEqual(failures, [])
})

test('legacy runtime bridge alias still requires runtime adapter proof', () => {
  const contract = {
    archetypeMode: 'legacy-host-compatible',
    pageTypeId: 'table-basic',
    generationProfile: {
      schemaVersion: 'generation-profile.v1',
      strategy: 'managed-template-or-archetype-slot-fill',
      legacyStrategyId: 'runtime-bridged-page-component',
      mode: 'legacy-host-compatible',
    },
  }

  assert.equal(shouldRequireLegacyRuntimeAdapterProof(contract), true)

  const failures = findLegacyRuntimeAdapterFailures(contract)
  assert.equal(failures.length, 1)
  assert.match(failures[0], /Missing legacy runtime adapter proof/)
})

test('non-legacy contracts do not require legacy runtime adapter proof', () => {
  const contract = {
    archetypeMode: 'host-integration',
    generationProfile: {
      strategy: 'page-component',
      mode: 'host-integration',
      pageComponentId: 'standard-table-basic-page.v1',
    },
  }

  assert.equal(shouldRequireLegacyRuntimeAdapterProof(contract), false)
  assert.deepEqual(findLegacyRuntimeAdapterFailures(contract), [])
})

test('managed analytics preflight helper blocks unresolved chartUsageContract placeholders', () => {
  const placeholderFailures = findManagedAnalyticsContractFailures({
    pageTypeId: 'data-visualization',
    layoutStrategy: 'focus-plus-supporting-analysis',
    layoutArchetype: 'primary-secondary',
    generationProfile: {
      strategy: 'managed-analytics',
    },
    chartUsageContract: {
      schemaVersion: 'chart-usage-contract.v1',
      chartIntentItems: [
        {
          chartId: 'TODO_CHART_ID',
          title: 'TODO_CHART_TITLE',
          businessQuestion: 'TODO_BUSINESS_QUESTION',
          informationTask: 'TODO_INFORMATION_TASK',
          chartType: 'TODO_CHART_TYPE',
          readingLane: 'TODO_READING_LANE',
        },
      ],
    },
  })

  assert.ok(
    placeholderFailures.some((message) => message.includes('still contains scaffold placeholders')),
    placeholderFailures.join('\n')
  )
})

test('managed analytics preflight helper blocks missing primary lane and generic typical-page fallback', () => {
  const failures = findManagedAnalyticsContractFailures({
    pageTypeId: 'data-visualization',
    layoutStrategy: 'typical-page',
    layoutArchetype: 'primary-secondary',
    generationProfile: {
      strategy: 'managed-analytics',
    },
    chartUsageContract: {
      schemaVersion: 'chart-usage-contract.v1',
      contractStatus: 'ready',
      chartIntentItems: [
        {
          chartId: 'conversion',
          title: '转化趋势',
          businessQuestion: '候选人在哪个阶段掉队',
          informationTask: 'trend',
          chartType: 'line',
          readingLane: 'secondary',
        },
        {
          chartId: 'risk',
          title: '风险分布',
          businessQuestion: '哪些岗位存在风险',
          informationTask: 'comparison',
          chartType: 'bar',
          readingLane: 'secondary',
        },
      ],
    },
  })

  assert.ok(
    failures.some((message) => message.includes('layoutStrategy=typical-page is invalid')),
    failures.join('\n')
  )
  assert.ok(
    failures.some((message) => message.includes('at least one primary readingLane')),
    failures.join('\n')
  )
})

test('preflight classifies managed filter chain regressions into dedicated failure codes', () => {
  const missingQueryFilterMessage =
    'src/pages/orders/index.tsx declares a query-filter region but source does not reference QueryFilter or a recognized schema/list-search bridge. Typical list pages must keep QueryFilter semantics instead of hand-written filter bars.'
  const primitiveBarMessage =
    'src/pages/orders/index.tsx hand-builds its filter region from primitive Input/Select/DatePicker controls without QueryFilter-compatible semantics. Replace the raw filter bar with QueryFilter or a recognized host search shell.'

  assert.equal(checkIdForFailure(missingQueryFilterMessage), 'managedFilterChain')
  assert.equal(
    failureCodeForCheckId(checkIdForFailure(missingQueryFilterMessage)),
    'HIUI022_MANAGED_FILTER_CHAIN_MISSING'
  )
  assert.equal(checkIdForFailure(primitiveBarMessage), 'managedFilterChain')
})

test('preflight keeps delivery closed when source-gate or runtime-smoke are still pending', () => {
  const executionState = derivePreflightExecutionState({
    failures: [],
    warnings: [],
    workflowStatus: 'preflight-pass',
    pendingDeliveryChecks: ['sourceGate', 'runtimeSmoke'],
  })

  assert.equal(executionState.preflightStage, 'implementation')
  assert.equal(executionState.readyForImplementation, true)
  assert.equal(executionState.readyForDelivery, false)
  assert.deepEqual(executionState.deferredChecks, ['sourceGate', 'runtimeSmoke'])
})

test('preflight classifies QueryFilter baseline drift into dedicated failure codes', () => {
  const baselineMessages = [
    'src/pages/orders/index.tsx explicitly enables showLabel on inline QueryFilter inside the strict project-certified table-basic rollout. Typical list pages must keep QueryFilter on the no-label inline baseline instead of reintroducing a second row of external field labels.',
    'src/pages/orders/index.tsx overrides QueryFilter appearance away from the shared contained baseline inside the strict project-certified table-basic rollout. Keep inline QueryFilter on contained unless the page is explicitly moved out of the typical list contract.',
    "src/pages/orders/index.tsx uses direct QueryFilter filterFields but the keyword search field regresses to a plain Input. Keep the table-stat/list baseline search semantics with SearchInput/Search, or keep Input on QueryFilter's filled + search-icon affordance instead of a bare text box.",
    'src/pages/orders/index.tsx renders “全部筛选” with a plain Button. Keep the trailing all-filter control on FilterButton semantics instead of a generic button so placement and count affordance stay aligned with the example.',
  ]

  for (const message of baselineMessages) {
    assert.equal(checkIdForFailure(message), 'queryFilterBaseline')
    assert.equal(
      failureCodeForCheckId(checkIdForFailure(message)),
      'HIUI023_QUERY_FILTER_BASELINE_DRIFT'
    )
  }
})

test('preflight classifies managed QueryFilter baseline declaration without field-chain consumption as managed-filter-chain failure', () => {
  const message =
    'src/pages/orders/index.tsx declares queryFilterBaseline=managed-query-filter-fields, but source never consumes that baseline through QueryFilter/queryFields. Move the page onto the managed query field chain instead of leaving filters on handwritten businessSlots.queryFilter controls.'

  assert.equal(checkIdForFailure(message), 'managedFilterChain')
  assert.equal(
    failureCodeForCheckId(checkIdForFailure(message)),
    'HIUI022_MANAGED_FILTER_CHAIN_MISSING'
  )
})

test('preflight classifies QueryFilter field-role drift into dedicated failure codes', () => {
  const message =
    'src/pages/orders/index.tsx uses direct QueryFilter filterFields but non-keyword text filters drift into search-input semantics (withdrawId, merchantName). Keep only the keyword field on search-input semantics; ordinary text filters must stay on filter-text-input semantics instead of rendering multiple SearchInput/Search affordances.'

  assert.equal(checkIdForFailure(message), 'queryFilterFieldRoleDrift')
  assert.equal(
    failureCodeForCheckId(checkIdForFailure(message)),
    'HIUI051_QUERY_FILTER_FIELD_ROLE_DRIFT'
  )
})

test('preflight classifies QueryFilter surface mismatch into dedicated failure codes', () => {
  const message =
    'src/pages/orders/index.tsx uses direct QueryFilter filterFields but non-keyword text filters fall back to bare Input skin instead of the shared query-filter surface (withdrawId). Keep ordinary text filters on the shared filter-text-input / filled baseline so one QueryFilter does not mix grey and white text boxes.'

  assert.equal(checkIdForFailure(message), 'queryFilterSurfaceMismatch')
  assert.equal(
    failureCodeForCheckId(checkIdForFailure(message)),
    'HIUI052_QUERY_FILTER_SURFACE_MISMATCH'
  )
})

test('preflight classifies host-style contamination into dedicated failure codes', () => {
  const messages = [
    'src/pages/orders/index.tsx directly targets HiUI common-component skeleton selectors from local page styles (QueryFilter <- padding). This is treated as host-style contamination because business-page styles must not mutate the internal .hi-v5-* skeleton of common components.',
    'src/pages/orders/index.tsx overrides PageHeader geometry in page-local styles. Header height, padding, align-items, portal carrier, and .hi-v5-page-header skeleton belong to the managed shell/adapter, not the business page.',
  ]

  for (const message of messages) {
    assert.equal(checkIdForFailure(message), 'hostStyleContamination')
    assert.equal(
      failureCodeForCheckId(checkIdForFailure(message)),
      'HIUI024_HOST_STYLE_CONTAMINATION'
    )
  }
})

test('preflight classifies list workspace width ownership drift into dedicated failure codes', () => {
  const messages = [
    'src/pages/orders/index.tsx lets the project-certified table-basic carrier own horizontal scrolling at outer-padding/white-body/main-scroll/table region level. Keep horizontal overflow inside an inner table wrapper; the carrier itself must stay width-adaptive.',
    'src/pages/orders/index.tsx makes the managed table region itself the horizontal scroll owner. Keep horizontal overflow inside an inner table wrapper; the data-hiui5-region="table" container must stay width-adaptive to its parent.',
    'src/pages/orders/index.tsx sizes the managed table region by content width keywords such as max-content/min-content/fit-content. Business table regions must adapt to the parent container width instead of expanding the surrounding workspace.',
  ]

  for (const message of messages) {
    assert.equal(checkIdForFailure(message), 'listWorkspaceWidth')
    assert.equal(
      failureCodeForCheckId(checkIdForFailure(message)),
      'HIUI025_LIST_WORKSPACE_WIDTH_OWNER_DRIFT'
    )
  }
})

test('preflight classifies dashboard control-strip drift into dedicated failure codes', () => {
  const orderMessage =
    'src/pages/dashboard/index.tsx places dashboard-control-strip after the stat-section. data-visualization pages must keep the page-global control strip at the top of the white-body, before stat cards and chart sections.'
  const panelizedMessage =
    'src/pages/dashboard/index.tsx wraps dashboard-control-strip in panel chrome such as background, border, radius, or shadow. The page-global control strip must stay a plain row at the top of the white-body instead of regressing into a grey query panel.'
  const mixedScopeMessage =
    'src/pages/dashboard/index.tsx merges dashboard control-strip semantics and QueryFilter detail filters into the same control row. Page-global time/view switching must stay in the top control strip, while QueryFilter remains a separate detail filter near the detail table.'

  assert.equal(checkIdForFailure(orderMessage), 'controlStripOrderDrift')
  assert.equal(
    failureCodeForCheckId(checkIdForFailure(orderMessage)),
    'HIUI042_CONTROL_STRIP_ORDER_DRIFT'
  )
  assert.equal(checkIdForFailure(panelizedMessage), 'controlStripPanelized')
  assert.equal(
    failureCodeForCheckId(checkIdForFailure(panelizedMessage)),
    'HIUI043_CONTROL_STRIP_PANELIZED'
  )
  assert.equal(checkIdForFailure(mixedScopeMessage), 'mixedScopeControlRow')
  assert.equal(
    failureCodeForCheckId(checkIdForFailure(mixedScopeMessage)),
    'HIUI044_MIXED_SCOPE_CONTROL_ROW'
  )
})

test('preflight classifies detail QueryFilter placement drift on dashboard pages into dedicated failure codes', () => {
  const messages = [
    'src/pages/dashboard/index.tsx places a detail QueryFilter before the chart-section on a dashboard-control-strip page. Keep the page-global control strip at the top, and if the page needs real detail filters, place QueryFilter next to the detail table instead of ahead of the analysis body.',
    'src/pages/dashboard/index.tsx places a detail QueryFilter after the detail table on a dashboard-control-strip page. Real detail filters must stay adjacent to the table and appear before the detail rows, not below them.',
  ]

  for (const message of messages) {
    assert.equal(checkIdForFailure(message), 'detailQueryFilterPlacementDrift')
    assert.equal(
      failureCodeForCheckId(checkIdForFailure(message)),
      'HIUI045_DETAIL_QUERY_FILTER_PLACEMENT_DRIFT'
    )
  }
})

test('preflight classifies body-section layout and panelization drift into dedicated failure codes', () => {
  const layoutBypassMessage =
    'src/pages/orders/index.tsx places form-body before the drawer-body region inside the project-certified carrier. drawer-form carriers must keep form-body inside the managed drawer-body region instead of flattening body semantics into free-form wrappers.'
  const panelizedMessages = [
    'src/pages/orders/index.tsx surfaces summary/section blocks as independent cards. Full-page-detail must keep one white-body workspace and use grouped Descriptions inside it instead of stacking summary cards or per-section white cards.',
    'src/pages/orders/index.tsx wraps full-page-edit sections in surfaced cards. The archetype requires one white-body form workspace plus one footer, not one white card per top-level section.',
    'src/pages/orders/index.tsx duplicates the ProDetailPage workspace shell with local white-body / outer-padding / main-scroll wrappers. ProDetailPage already owns the page height, white surface, radius, and main scrolling; the page source may only add content spacing inside that shell, not a second height/overflow/background layer.',
  ]

  assert.equal(checkIdForFailure(layoutBypassMessage), 'bodySectionLayoutBypass')
  assert.equal(
    failureCodeForCheckId(checkIdForFailure(layoutBypassMessage)),
    'HIUI046_BODY_SECTION_LAYOUT_BYPASS'
  )

  for (const message of panelizedMessages) {
    assert.equal(checkIdForFailure(message), 'bodySectionPanelizationDrift')
    assert.equal(
      failureCodeForCheckId(checkIdForFailure(message)),
      'HIUI049_BODY_SECTION_PANELIZATION_DRIFT'
    )
  }
})

test('preflight classifies body-section spacing ownership drift into dedicated failure codes', () => {
  const messages = [
    'src/pages/orders/index.tsx overrides .hi-v5-form-item / .hi-v5-form / .hi-v5-form-label spacing at page level. In full-page-edit, field vertical rhythm belongs to FormItem and section structure, not page-local overrides of HiUI base form skeleton classes.',
    'src/pages/orders/index.tsx lets the full-page-edit field grid own vertical rhythm through row-gap or bottom spacing. Field grids may own columns and horizontal gutter only; do not use grid row-gap, padding-bottom, margin-bottom, or last-row whitespace to create footer separation.',
  ]

  for (const message of messages) {
    assert.equal(checkIdForFailure(message), 'bodySectionSpacingOwnerDrift')
    assert.equal(
      failureCodeForCheckId(checkIdForFailure(message)),
      'HIUI047_BODY_SECTION_SPACING_OWNER_DRIFT'
    )
  }
})

test('preflight classifies body-section contract scope and widget declaration drift into dedicated failure codes', () => {
  const undeclaredWidgetMessages = [
    'standard-drawer-form-page.v1 does not declare a supportingSections allowed extension. Body supporting widgets must stay inside page-component extension declarations instead of drifting into undeclared local scope.',
    'standard-drawer-form-page.v1 does not whitelist bodySectionContract.embeddedWidgetPolicy=section-toolbar in supportingSections allowedExtensions. Supporting body widgets must stay inside page-component extension declarations instead of drifting into undeclared local scope.',
  ]
  const scopeDriftMessages = [
    'semanticContract.bodySectionContract.embeddedWidgetPolicy=simple-table requires semanticContract.bodySectionContract.sectionComposition=groups-with-supporting-sections so governed supporting sections stay distinguishable from free-form body layout.',
    'semanticContract.bodySectionContract.sectionComposition=groups-with-supporting-sections requires a concrete embeddedWidgetPolicy (for example section-toolbar/simple-table/readonly-chart-summary/media-row) so preflight can explain which governed supporting widget expands the body scope.',
  ]

  for (const message of undeclaredWidgetMessages) {
    assert.equal(checkIdForFailure(message), 'embeddedWidgetUndeclared')
    assert.equal(
      failureCodeForCheckId(checkIdForFailure(message)),
      'HIUI048_EMBEDDED_WIDGET_UNDECLARED'
    )
  }

  for (const message of scopeDriftMessages) {
    assert.equal(checkIdForFailure(message), 'bodySectionScopeDrift')
    assert.equal(
      failureCodeForCheckId(checkIdForFailure(message)),
      'HIUI050_BODY_SECTION_SCOPE_DRIFT'
    )
  }
})
