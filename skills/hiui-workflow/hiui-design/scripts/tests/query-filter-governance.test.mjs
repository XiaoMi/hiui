import assert from 'node:assert/strict'
import test from 'node:test'

import {
  QUERY_FILTER_FAILURE_CODES,
  QUERY_FILTER_SURFACE_KINDS,
  MANAGED_QUERY_FILTER_FIELD_POLICY,
  buildQueryFilterSemanticDefaults,
  buildQueryFilterSemanticProfileErrors,
  buildQueryFilterSemanticValueSetErrors,
  classifyQueryFilterSurfaceKind,
  getQueryFilterSemanticValidationProfile,
  isQueryFilterFieldRoleDriftFailureMessage,
  isQueryFilterSurfaceMismatchFailureMessage,
  queryFilterSemanticFactsRequired,
  validateManagedQueryFilterFieldSemantics,
} from '../lib/query-filter-governance.mjs'

test('query-filter-governance exposes managed and not-applicable semantic defaults', () => {
  assert.deepEqual(buildQueryFilterSemanticDefaults({ managed: true }), {
    queryFieldRenderProfile: 'shared-query-filter-skin',
    keywordFieldRole: 'search-input',
    textFieldRole: 'filter-text-input',
    selectDateFieldSurfacePolicy: 'shared-query-filter-surface',
    filterSurfaceBaseline: 'query-filter-contained-shared-surface',
  })
  assert.deepEqual(buildQueryFilterSemanticDefaults({ managed: false }), {
    queryFieldRenderProfile: 'not-applicable',
    keywordFieldRole: 'not-applicable',
    textFieldRole: 'not-applicable',
    selectDateFieldSurfacePolicy: 'not-applicable',
    filterSurfaceBaseline: 'not-applicable',
  })
  assert.equal(MANAGED_QUERY_FILTER_FIELD_POLICY, 'search-input-plus-filter-text-input')
})

test('query-filter-governance derives semantic validation profiles from page context', () => {
  assert.equal(
    getQueryFilterSemanticValidationProfile({
      pageTypeId: 'table-basic',
      queryFilterRegionRole: 'table-query-filter',
      requiredRegions: ['header', 'query-filter', 'table'],
    }),
    'managed-query-filter-page'
  )
  assert.equal(
    getQueryFilterSemanticValidationProfile({
      pageTypeId: 'data-visualization',
      queryFilterRegionRole: 'dashboard-control-strip',
      requiredRegions: ['header', 'query-filter', 'table'],
    }),
    'dashboard-control-strip'
  )
  assert.equal(
    getQueryFilterSemanticValidationProfile({
      pageTypeId: 'data-visualization',
      queryFilterRegionRole: 'table-query-filter',
      requiredRegions: ['header', 'query-filter', 'table'],
    }),
    'data-visualization-table-query-filter'
  )
  assert.equal(
    getQueryFilterSemanticValidationProfile({
      pageTypeId: 'full-page-edit',
      queryFilterRegionRole: 'not-applicable',
      requiredRegions: ['header', 'form-body'],
    }),
    'not-applicable'
  )
})

test('query-filter-governance validates semantic value sets and profile baselines', () => {
  const valueErrors = buildQueryFilterSemanticValueSetErrors({
    queryFieldRenderProfile: 'bad-profile',
    keywordFieldRole: 'bad-keyword-role',
    textFieldRole: 'bad-text-role',
    selectDateFieldSurfacePolicy: 'bad-select-policy',
    filterSurfaceBaseline: 'bad-surface',
  })

  assert.equal(valueErrors.length, 5)
  assert.ok(
    buildQueryFilterSemanticProfileErrors({
      semanticContract: buildQueryFilterSemanticDefaults({ managed: false }),
      profile: 'managed-query-filter-page',
    }).some((error) => error.includes('queryFieldRenderProfile=shared-query-filter-skin'))
  )
  assert.ok(
    buildQueryFilterSemanticProfileErrors({
      semanticContract: buildQueryFilterSemanticDefaults({ managed: true }),
      profile: 'dashboard-control-strip',
    }).some((error) => error.includes('queryFieldRenderProfile=not-applicable'))
  )
})

test('query-filter-governance classifies failure messages and surface kinds', () => {
  assert.equal(QUERY_FILTER_FAILURE_CODES.fieldRoleDrift, 'HIUI051_QUERY_FILTER_FIELD_ROLE_DRIFT')
  assert.equal(QUERY_FILTER_FAILURE_CODES.surfaceMismatch, 'HIUI052_QUERY_FILTER_SURFACE_MISMATCH')
  assert.equal(classifyQueryFilterSurfaceKind('rgb(255, 255, 255)'), QUERY_FILTER_SURFACE_KINDS.white)
  assert.equal(classifyQueryFilterSurfaceKind('rgba(0, 0, 0, 0)'), QUERY_FILTER_SURFACE_KINDS.transparentOrMissing)
  assert.equal(classifyQueryFilterSurfaceKind('rgb(245, 247, 250)'), QUERY_FILTER_SURFACE_KINDS.filled)
  assert.equal(
    isQueryFilterFieldRoleDriftFailureMessage(
      'src/pages/orders/index.tsx uses the managed QueryFilter field chain but non-keyword text filters drift into search-input semantics (withdrawId). Keep only the keyword field on search-input semantics; ordinary text filters must stay on filter-text-input semantics instead of rendering multiple SearchInput/Search affordances.'
    ),
    true
  )
  assert.equal(
    isQueryFilterSurfaceMismatchFailureMessage(
      'src/pages/orders/index.tsx uses the managed QueryFilter field chain but non-keyword text filters fall back to bare Input skin instead of the shared query-filter surface (withdrawId). Keep ordinary text filters on the shared filter-text-input / filled baseline so one QueryFilter does not mix grey and white text boxes.'
    ),
    true
  )
})

test('query-filter-governance validates direct QueryFilter field semantics from source snippets', () => {
  const semanticContract = buildQueryFilterSemanticDefaults({ managed: true })
  const sourceRaw = `import { Input, SearchInput } from 'hiui5'
const queryFilter = (
  <QueryFilter
    filterFields={[
      {
        field: 'keyword',
        component: <SearchInput placeholder="关键词" />,
      },
      {
        field: 'withdrawId',
        component: <SearchInput placeholder="提现单号" />,
      },
      {
        field: 'merchantName',
        component: <Input placeholder="商户名称" />,
      },
    ]}
  />
)`

  const errors = validateManagedQueryFilterFieldSemantics({
    semanticContract,
    sourceRaw,
    pathLabel: 'src/pages/orders/index.tsx',
  })

  assert.equal(
    queryFilterSemanticFactsRequired({
      semanticContract: { queryFilterRegionRole: 'table-query-filter' },
      requiredRegions: ['header', 'query-filter', 'table'],
    }),
    true
  )
  assert.ok(errors.some((error) => error.includes('drift into search-input semantics')))
  assert.ok(
    errors.some((error) =>
      error.includes('fall back to bare Input skin instead of the shared query-filter surface')
    )
  )
})

test('query-filter-governance catches select/date controls that explicitly drift to line/white surfaces', () => {
  const semanticContract = buildQueryFilterSemanticDefaults({ managed: true })
  const sourceRaw = `import { DatePicker, SearchInput } from 'hiui5'
const queryFilter = (
  <QueryFilter
    filterFields={[
      {
        field: 'keyword',
        component: <SearchInput placeholder="关键词" />,
      },
      {
        field: 'dateRange',
        component: <DatePicker type="daterange" appearance="line" />,
      },
    ]}
  />
)`

  const errors = validateManagedQueryFilterFieldSemantics({
    semanticContract,
    sourceRaw,
    pathLabel: 'src/pages/orders/index.tsx',
  })

  assert.ok(
    errors.some((error) =>
      error.includes('fall back to bare Input skin instead of the shared query-filter surface')
    )
  )
  assert.ok(errors.some((error) => error.includes('dateRange')))
})

test('query-filter-governance accepts managed field-factory snippets on the shared baseline', () => {
  const semanticContract = buildQueryFilterSemanticDefaults({ managed: true })
  const sourceRaw = `import {
  createManagedQueryDateRangeField,
  createManagedQuerySearchField,
  createManagedQuerySelectField,
  createManagedQueryTextField,
} from '@/typical-page-reuse/query-filter/managed-query-filter-fields'
const queryFilter = (
  <QueryFilter
    filterFields={[
      createManagedQuerySearchField({ field: 'keyword', label: '关键词', placeholder: '请输入关键词' }),
      createManagedQueryTextField({ field: 'operatorMiId', label: '操作人米聊号', placeholder: '请输入操作人米聊号' }),
      createManagedQuerySelectField({ field: 'status', label: '状态', data: [] }),
      createManagedQueryDateRangeField({ field: 'dateRange', label: '创建时间', placeholder: ['开始时间', '结束时间'] }),
    ]}
  />
)`

  const errors = validateManagedQueryFilterFieldSemantics({
    semanticContract,
    sourceRaw,
    pathLabel: 'src/pages/orders/index.tsx',
  })

  assert.deepEqual(errors, [])
})

test('query-filter-governance validates queryFields DSL snippets from typical page shells', () => {
  const semanticContract = buildQueryFilterSemanticDefaults({ managed: true })
  const sourceRaw = `import { extendDsl, F, ReadonlyFieldCreator } from '@hi-ui/schema-core'
import { TablePageFrame } from '@hiui-design/typical-page-shells/pro-table-page'

const T = extendDsl(ReadonlyFieldCreator, {})

const queryFields = [
  F('关键词', 'keyword').Text().val,
  F('提现单号', 'withdrawId').Text().val,
  F('状态', 'status').Select({ data: [] }).val,
  F('创建时间', 'dateRange').Date({ type: 'daterange', appearance: 'line' }).val,
]

export default function OrdersPage() {
  return (
    <TablePageFrame
      title="提现查询"
      queryFields={queryFields}
      tableFields={[T('单号', 'id').val]}
      searchPlaceholder="用户名称 / 米聊 / 电话"
    />
  )
}`

  const errors = validateManagedQueryFilterFieldSemantics({
    semanticContract,
    sourceRaw,
    pathLabel: 'src/pages/orders/index.tsx',
  })

  assert.ok(
    errors.some((error) => error.includes('keyword search field regresses to a plain Input')),
    'queryFields keyword Text() should not replace the managed keyword-search baseline'
  )
  assert.ok(
    errors.some((error) =>
      error.includes('fall back to bare Input skin instead of the shared query-filter surface')
    ),
    'queryFields non-keyword Text() / line Date() should be recognized as surface drift'
  )
  assert.ok(errors.some((error) => error.includes('withdrawId')))
  assert.ok(errors.some((error) => error.includes('dateRange')))
})

test('query-filter-governance accepts managed field factories in queryFields shells', () => {
  const semanticContract = buildQueryFilterSemanticDefaults({ managed: true })
  const sourceRaw = `import { TablePageFrame } from '@hiui-design/typical-page-shells/pro-table-page'
import {
  createManagedQueryDateRangeField,
  createManagedQuerySelectField,
  createManagedQueryTextField,
} from '@/typical-page-reuse/query-filter/managed-query-filter-fields'

const queryFields = [
  createManagedQueryTextField({ field: 'withdrawId', label: '提现单号', placeholder: '请输入提现单号' }),
  createManagedQuerySelectField({ field: 'status', label: '状态', data: [] }),
  createManagedQueryDateRangeField({ field: 'dateRange', label: '创建时间', placeholder: ['开始时间', '结束时间'] }),
]

export default function OrdersPage() {
  return <TablePageFrame title="提现查询" queryFields={queryFields} tableFields={[]} searchPlaceholder="用户名称 / 米聊 / 电话" />
}`

  const errors = validateManagedQueryFilterFieldSemantics({
    semanticContract,
    sourceRaw,
    pathLabel: 'src/pages/orders/index.tsx',
  })

  assert.deepEqual(errors, [])
})

test('query-filter-governance rejects managed filter contracts that declare the baseline but never enter QueryFilter/queryFields', () => {
  const semanticContract = buildQueryFilterSemanticDefaults({ managed: true })
  const sourceRaw = `export const runtimeBridge = {
  queryFilterBaseline: 'managed-query-filter-fields',
}

export default function OrdersPage() {
  const businessSlots = {
    queryFilter: (
      <div>
        <Input appearance="filled" placeholder="关键词" />
        <Select appearance="contained" data={[]} />
        <DatePicker type="daterange" appearance="filled" />
      </div>
    ),
  }

  return <TablePageFrame businessSlots={businessSlots} />
}`

  const errors = validateManagedQueryFilterFieldSemantics({
    semanticContract,
    sourceRaw,
    pathLabel: 'src/pages/orders/index.tsx',
  })

  assert.ok(
    errors.some((error) =>
      error.includes('declares queryFilterBaseline=managed-query-filter-fields')
    ),
    errors.join('\n')
  )
})

test('query-filter-governance still rejects non-keyword text fields that misuse managed search factory semantics', () => {
  const semanticContract = buildQueryFilterSemanticDefaults({ managed: true })
  const sourceRaw = `import { createManagedQuerySearchField } from '@/typical-page-reuse/query-filter/managed-query-filter-fields'
const queryFilter = (
  <QueryFilter
    filterFields={[
      createManagedQuerySearchField({ field: 'keyword', label: '关键词', placeholder: '请输入关键词' }),
      createManagedQuerySearchField({ field: 'operatorMiId', label: '操作人米聊号', placeholder: '请输入操作人米聊号' }),
    ]}
  />
)`

  const errors = validateManagedQueryFilterFieldSemantics({
    semanticContract,
    sourceRaw,
    pathLabel: 'src/pages/orders/index.tsx',
  })

  assert.ok(errors.some((error) => error.includes('drift into search-input semantics')))
})
