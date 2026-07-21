import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import {
  buildManagedAnalyticsArtifacts,
} from '../generators/managed-analytics-contracts.mjs'
import { runAnalytics } from '../generators/analytics.mjs'
import { PAGEGEN_ROOT, REPO_ROOT, readJson } from '../generators/shared.mjs'

const analyticsSchema = readJson(
  path.resolve(PAGEGEN_ROOT, 'recipes', 'probes', 'data-visualization.schema.json')
)
const analyticsSchemaPath = '.local-context/hiui-design/core/recipes/probes/data-visualization.schema.json'

test('buildManagedAnalyticsArtifacts blocks generic analytics scaffolds without a meaningful brief', () => {
  const result = buildManagedAnalyticsArtifacts({
    pageType: 'data-visualization',
    targetPagePath: 'src/views/analytics-blocked-probe',
    schema: analyticsSchema,
    changeText: '生成数据看板',
  })

  assert.equal(result?.status, 'blocked')
  assert.match(result?.blockingReasons?.[0] || '', /业务 brief/)
})

test('buildManagedAnalyticsArtifacts blocks analytics briefs whose business semantics drift from schema', () => {
  const result = buildManagedAnalyticsArtifacts({
    pageType: 'data-visualization',
    targetPagePath: 'src/views/analytics-semantic-drift-probe',
    schema: analyticsSchema,
    changeText: '生成手机零售经营数据看板，关注销量趋势、渠道构成、库存状态和门店排行',
  })

  assert.equal(result?.status, 'blocked')
  assert.ok(
    result?.blockingReasons?.some((reason) => /业务语义/.test(reason)),
    'expected semantic drift blocking reason'
  )
})

test('buildManagedAnalyticsArtifacts allows same-domain synonymous briefs when semantic mismatch evidence is weak', () => {
  const result = buildManagedAnalyticsArtifacts({
    pageType: 'data-visualization',
    targetPagePath: 'src/views/analytics-semantic-synonym-probe',
    schema: analyticsSchema,
    changeText: '生成区域服务履约看板，关注工时波动、来源分布和达标率',
  })

  assert.equal(result?.status, 'ready')
})

test('buildManagedAnalyticsArtifacts blocks briefs when some requested analysis intents are not covered by schema charts', () => {
  const result = buildManagedAnalyticsArtifacts({
    pageType: 'data-visualization',
    targetPagePath: 'src/views/analytics-intent-gap-probe',
    schema: {
      pageType: 'data-visualization',
      title: '巡检任务分析',
      charts: [
        {
          key: 'trend',
          title: '近30天任务趋势',
          type: 'line',
          data: [{ label: '01', value: 1 }],
        },
      ],
    },
    changeText: '生成巡检任务看板，关注任务趋势和闭环状态',
  })

  assert.equal(result?.status, 'blocked')
  assert.ok(
    result?.blockingReasons?.some((reason) => /未被 schema\.charts 承接/.test(reason)),
    'expected missing intent blocking reason'
  )
})

test('runAnalytics writes managed analytics companion contracts for ready briefs', async () => {
  const page = `src/views/hiui-pagegen-probe/analytics-contract-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)
  const safeName = page.replace(/[\\/]/g, '__')
  const outputPath = path.resolve(PAGEGEN_ROOT, 'outputs', `generate-${safeName}.json`)

  try {
    await runAnalytics({
      page,
      schema: analyticsSchemaPath,
      change: '生成区域巡检运营看板，关注任务趋势、来源构成、闭环状态和区域排行',
      force: true,
      'dry-run-report': true,
    })

    const chartUsageContract = JSON.parse(
      await fs.readFile(path.resolve(pageDir, 'chart-usage.contract.json'), 'utf8')
    )
    const analyticsLayoutPlan = JSON.parse(
      await fs.readFile(path.resolve(pageDir, 'analytics-layout.plan.json'), 'utf8')
    )
    const output = JSON.parse(await fs.readFile(outputPath, 'utf8'))

    assert.equal(chartUsageContract.schemaVersion, 'chart-usage-contract.v1')
    assert.equal(chartUsageContract.contractStatus, 'ready')
    assert.ok(Array.isArray(chartUsageContract.requiredDocs))
    assert.ok(chartUsageContract.requiredDocs.length >= 3)
    assert.ok(Array.isArray(chartUsageContract.chartIntentItems))
    assert.ok(chartUsageContract.chartIntentItems.length > 0)
    assert.match(chartUsageContract.chartIntentItems[0].businessQuestion, /是否|哪里|如何/)
    assert.match(chartUsageContract.chartIntentItems[0].chartChoiceReason, /使用/)
    const groupedColumnIntent = chartUsageContract.chartIntentItems.find(
      (item) => item.sourceChartType === 'groupedColumn'
    )
    assert.ok(groupedColumnIntent, 'expected groupedColumn intent item')
    assert.equal(groupedColumnIntent.chartType, 'grouped-column')
    assert.notEqual(groupedColumnIntent.visualRole, 'TODO_VISUAL_ROLE')
    assert.notEqual(groupedColumnIntent.regionPriority, 'TODO_REGION_PRIORITY')
    assert.notEqual(groupedColumnIntent.preferredRegionSize, 'TODO_REGION_SIZE')
    assert.equal(analyticsLayoutPlan.schemaVersion, 'analytics-layout-plan.v1')
    assert.equal(analyticsLayoutPlan.layoutArchetype, 'parallel-sections')
    assert.equal(analyticsLayoutPlan.layoutStrategy, 'parallel-comparison-analysis')
    assert.equal(analyticsLayoutPlan.writeScope?.schemaVersion, 'task-write-scope.v1')
    assert.equal(output.analyticsArtifacts?.status, 'ready')
    assert.equal(output.analyticsArtifacts?.layoutArchetype, 'parallel-sections')
    assert.equal(output.analyticsArtifacts?.kickoffFacts?.generationStrategy, 'managed-analytics')
    assert.equal(output.analyticsArtifacts?.kickoffFacts?.contractGate, 'frozen-before-business-jsx')
    assert.equal(output.runtimeFamily, 'local-managed-analytics')
    assert.equal(output.generationStrategy, 'managed-analytics')
    assert.equal(output.assetGovernance?.profileId, 'managed-analytics-shell')
    assert.equal(output.assetGovernance?.deliveryRole, 'managed-analytics-business-shell')
    assert.equal(output.analyticsArtifacts?.kickoffFacts?.chartIntentCount, chartUsageContract.chartIntentItems.length)
    assert.equal(
      output.analyticsArtifacts?.kickoffFacts?.writeScope?.schemaVersion,
      'task-write-scope.v1'
    )
    assert.equal(
      output.analyticsArtifacts?.chartUsageContractFile,
      `${page}/chart-usage.contract.json`
    )
  } finally {
    await fs.rm(pageDir, { recursive: true, force: true })
    await fs.rm(outputPath, { force: true })
  }
})

test('runAnalytics fails closed when the managed analytics brief is too weak', async () => {
  const page = `src/views/hiui-pagegen-probe/analytics-weak-brief-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)

  await assert.rejects(
    () =>
      runAnalytics({
        page,
        schema: analyticsSchemaPath,
        change: '生成数据看板',
        force: true,
        'dry-run-report': true,
      }),
    /必须先冻结最小分析契约/
  )

  await fs.rm(pageDir, { recursive: true, force: true })
})

test('runAnalytics fails closed when the analytics brief and schema business semantics do not match', async () => {
  const page = `src/views/hiui-pagegen-probe/analytics-semantic-drift-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)

  await assert.rejects(
    () =>
      runAnalytics({
        page,
        schema: analyticsSchemaPath,
        change: '生成手机零售经营数据看板，关注销量趋势、渠道构成、库存状态和门店排行',
        force: true,
        'dry-run-report': true,
      }),
    /业务语义/
  )

  await fs.rm(pageDir, { recursive: true, force: true })
})
