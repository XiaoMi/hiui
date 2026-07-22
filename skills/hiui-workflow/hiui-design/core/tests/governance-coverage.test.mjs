import assert from 'node:assert/strict'
import test from 'node:test'
import { verifyGovernanceCoverage } from '../verify/verify-governance-coverage.mjs'

test('official-mirror and managed-analytics-shell page types have governance coverage', () => {
  const result = verifyGovernanceCoverage()

  assert.equal(result.status, 'passed')
  assert.equal(result.coveredPageTypes.length, 10)
  assert.ok(result.coveredPageTypes.includes('data-visualization'))
})
