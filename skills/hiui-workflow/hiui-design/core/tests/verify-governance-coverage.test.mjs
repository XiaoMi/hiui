import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'

import { ASSET_GOVERNANCE_REGISTRY_PATH } from '../generators/asset-governance.mjs'
import { verifyGovernanceCoverage } from '../verify/verify-governance-coverage.mjs'

async function withTemporaryJsonFile(filePath, transform, run) {
  const previous = await fs.readFile(filePath, 'utf8')
  const parsed = JSON.parse(previous)
  const next = await transform(parsed)
  await fs.writeFile(filePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8')

  try {
    return await run()
  } finally {
    await fs.writeFile(filePath, previous, 'utf8')
  }
}

test('verifyGovernanceCoverage passes with the checked-in legacy component-first governance alignment', () => {
  const result = verifyGovernanceCoverage()

  assert.equal(result.status, 'passed')
  assert.equal(result.blockingIssues.length, 0)
})

test('verifyGovernanceCoverage fails when legacy truth-source priority drops the direct-standard primary asset', async () => {
  await withTemporaryJsonFile(
    ASSET_GOVERNANCE_REGISTRY_PATH,
    async (registry) => {
      registry.pageTypeProfiles['table-basic'].truthSourcePriorityByContext = {
        ...(registry.pageTypeProfiles['table-basic'].truthSourcePriorityByContext || {}),
      }
      registry.pageTypeProfiles['table-basic'].truthSourcePriorityByContext['legacy-host-compatible:any'] = [
        'reference-asset',
        'official-runtime-entry',
        'legacy-delivery-plugin',
        'managed-fallback',
        'legacy',
      ]
      return registry
    },
    async () => {
      const result = verifyGovernanceCoverage()

      assert.equal(result.status, 'failed')
      assert.ok(
        result.blockingIssues.some((issue) =>
          String(issue || '').includes('table-basic legacy truthSourcePriority 与 runtime bridge resolutionOrder 不一致')
        ),
        JSON.stringify(result.blockingIssues, null, 2)
      )
    }
  )
})
