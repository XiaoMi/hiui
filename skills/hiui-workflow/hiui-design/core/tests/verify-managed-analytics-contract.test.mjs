import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { runAnalytics } from '../generators/analytics.mjs'
import { PAGEGEN_ROOT, PROJECT_MODE_LOCK_PATH, REPO_ROOT } from '../generators/shared.mjs'
import { verifyPageLite } from '../verify/verify-lite.mjs'
import { verifyPageStrict } from '../verify/verify-strict.mjs'

const analyticsSchemaPath = '.local-context/hiui-design/core/recipes/probes/data-visualization.schema.json'

async function withTemporaryProjectMode(modePayload, run) {
  const previous = await fs.readFile(PROJECT_MODE_LOCK_PATH, 'utf8')
  await fs.writeFile(PROJECT_MODE_LOCK_PATH, `${JSON.stringify(modePayload, null, 2)}\n`, 'utf8')

  try {
    return await run()
  } finally {
    await fs.writeFile(PROJECT_MODE_LOCK_PATH, previous, 'utf8')
  }
}

async function createAnalyticsPage() {
  const page = `src/views/hiui-pagegen-probe/verify-analytics-contract-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)
  const safeName = page.replace(/[\\/]/g, '__')
  const generateOutput = path.resolve(PAGEGEN_ROOT, 'outputs', `generate-${safeName}.json`)
  const verifyLiteOutput = path.resolve(PAGEGEN_ROOT, 'outputs', `verify-lite-${safeName}.json`)
  const verifyStrictOutput = path.resolve(PAGEGEN_ROOT, 'outputs', `verify-strict-${safeName}.json`)

  await withTemporaryProjectMode(
    {
      mode: 'rules-only',
      source: 'test',
      recommendedMode: 'rules-only',
      framework: 'react',
      projectType: 'greenfield',
      runtime: 'webpack',
      routing: 'react-router',
      confirmedAt: new Date().toISOString(),
    },
    async () => {
      await runAnalytics({
        page,
        schema: analyticsSchemaPath,
        change: '生成区域巡检运营看板，关注任务趋势、来源构成、闭环状态和区域排行',
        force: true,
        'dry-run-report': true,
      })
    }
  )

  return {
    page,
    pageDir,
    cleanup: async () => {
      await fs.rm(pageDir, { recursive: true, force: true })
      await fs.rm(generateOutput, { force: true })
      await fs.rm(verifyLiteOutput, { force: true })
      await fs.rm(verifyStrictOutput, { force: true })
    },
  }
}

test('verifyPageLite reports managed analytics contract checks for ready pages', async () => {
  const fixture = await createAnalyticsPage()

  try {
    const result = verifyPageLite(fixture.page)

    assert.equal(result.status, 'passed')
    assert.equal(result.managedAnalyticsContract?.status, 'passed')
    assert.equal(result.managedAnalyticsContract?.layoutArchetype, 'parallel-sections')
    assert.ok(result.managedAnalyticsContract?.strictChecks.includes('managed-analytics-contract'))
  } finally {
    await fixture.cleanup()
  }
})

test('verifyPageLite rejects data-visualization pages when chart usage contract is missing', async () => {
  const fixture = await createAnalyticsPage()

  await fs.rm(path.resolve(fixture.pageDir, 'chart-usage.contract.json'), { force: true })

  try {
    assert.throws(
      () => verifyPageLite(fixture.page),
      /缺少数据可视化 contract/
    )
  } finally {
    await fixture.cleanup()
  }
})

test('verifyPageLite rejects incomplete chart usage contract fields', async () => {
  const fixture = await createAnalyticsPage()
  const contractPath = path.resolve(fixture.pageDir, 'chart-usage.contract.json')
  const contract = JSON.parse(await fs.readFile(contractPath, 'utf8'))
  contract.chartIntentItems[0].businessQuestion = ''
  await fs.writeFile(contractPath, `${JSON.stringify(contract, null, 2)}\n`, 'utf8')

  try {
    assert.throws(
      () => verifyPageLite(fixture.page),
      /businessQuestion 不能为空/
    )
  } finally {
    await fixture.cleanup()
  }
})

test('verifyPageStrict passes managed analytics pages end-to-end before parity reporting', async () => {
  const fixture = await createAnalyticsPage()

  try {
    const result = verifyPageStrict(fixture.page)

    assert.equal(result.status, 'passed')
    assert.ok(result.strictChecks.includes('managed-analytics-contract'))
    assert.ok(result.strictChecks.includes('managed-analytics-role-plan'))
    assert.ok(result.strictChecks.includes('managed-analytics-wrapper-parity-manifest'))
    assert.ok(!result.strictChecks.includes('generated-page-parity-manifest'))
    assert.ok(result.checkedFiles.some((file) => file.endsWith('chart-usage.contract.json')))
  } finally {
    await fixture.cleanup()
  }
})
