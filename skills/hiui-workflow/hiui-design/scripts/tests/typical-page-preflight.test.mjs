import assert from 'node:assert/strict'
import test from 'node:test'

import {
  checkIdForFailure,
  derivePreflightExecutionState,
  failureCodeForCheckId,
} from '../typical-page-preflight.mjs'

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
  const message =
    'src/pages/orders/index.tsx declares queryFilterBaseline=managed-query-filter-fields, but source never consumes that baseline through QueryFilter/queryFields. Move the page onto the managed query field chain instead of leaving filters on handwritten businessSlots.queryFilter controls.'

  assert.equal(checkIdForFailure(message), 'managedFilterChain')
  assert.equal(
    failureCodeForCheckId(checkIdForFailure(message)),
    'HIUI022_MANAGED_FILTER_CHAIN_MISSING'
  )
})
