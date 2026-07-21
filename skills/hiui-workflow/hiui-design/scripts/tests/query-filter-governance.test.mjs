import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildQueryFilterSemanticDefaults,
  validateManagedQueryFilterFieldSemantics,
} from '../lib/query-filter-governance.mjs'

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
