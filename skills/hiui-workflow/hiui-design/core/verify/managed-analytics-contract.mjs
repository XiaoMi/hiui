import fs from 'fs'
import path from 'path'
import { readJson, relativeToRoot } from '../generators/shared.mjs'
import { analyzeManagedAnalyticsRolePlan } from '../../scripts/lib/managed-analytics-policy.mjs'
import {
  ANALYTICS_CHART_USAGE_CONTRACT_FILE,
  ANALYTICS_LAYOUT_PLAN_FILE,
  resolveManagedAnalyticsRequiredDocs,
} from '../generators/managed-analytics-contracts.mjs'

const MANAGED_ANALYTICS_LAYOUT_ARCHETYPES = new Set([
  'primary-secondary',
  'linear-stack',
  'parallel-sections',
])

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function normalizeDocIds(entries) {
  return new Set(
    (Array.isArray(entries) ? entries : [])
      .map((entry) => String(entry?.id || '').trim())
      .filter(Boolean)
  )
}

function assertManagedAnalyticsItemField(item, field, index) {
  assert(
    String(item?.[field] || '').trim(),
    `chart-usage.contract.json 中 chartIntentItems[${index}].${field} 不能为空`
  )
}

export function verifyManagedAnalyticsContract({ pageDir, targetPagePath }) {
  const chartUsageContractPath = path.resolve(pageDir, ANALYTICS_CHART_USAGE_CONTRACT_FILE)
  const analyticsLayoutPlanPath = path.resolve(pageDir, ANALYTICS_LAYOUT_PLAN_FILE)

  assert(
    fs.existsSync(chartUsageContractPath),
    `缺少数据可视化 contract：${relativeToRoot(chartUsageContractPath)}`
  )
  assert(
    fs.existsSync(analyticsLayoutPlanPath),
    `缺少数据可视化 layout plan：${relativeToRoot(analyticsLayoutPlanPath)}`
  )

  const chartUsageContract = readJson(chartUsageContractPath)
  const analyticsLayoutPlan = readJson(analyticsLayoutPlanPath)
  const checkedFiles = [
    relativeToRoot(chartUsageContractPath),
    relativeToRoot(analyticsLayoutPlanPath),
  ]
  const requiredDocIds = normalizeDocIds(resolveManagedAnalyticsRequiredDocs())
  const contractDocIds = normalizeDocIds(chartUsageContract.requiredDocs)
  const layoutDocIds = normalizeDocIds(analyticsLayoutPlan.requiredDocs)

  assert(
    String(chartUsageContract.schemaVersion || '').trim() === 'chart-usage-contract.v1',
    `chart-usage.contract.json.schemaVersion 必须是 chart-usage-contract.v1，收到 ${chartUsageContract.schemaVersion || '(missing)'}`
  )
  assert(
    String(analyticsLayoutPlan.schemaVersion || '').trim() === 'analytics-layout-plan.v1',
    `analytics-layout.plan.json.schemaVersion 必须是 analytics-layout-plan.v1，收到 ${analyticsLayoutPlan.schemaVersion || '(missing)'}`
  )
  assert(
    String(chartUsageContract.contractStatus || '').trim() === 'ready',
    `chart-usage.contract.json.contractStatus 必须是 ready，收到 ${chartUsageContract.contractStatus || '(missing)'}`
  )
  assert(
    Array.isArray(chartUsageContract.chartIntentItems) &&
      chartUsageContract.chartIntentItems.length > 0,
    'chart-usage.contract.json.chartIntentItems 不能为空'
  )

  requiredDocIds.forEach((requiredDocId) => {
    assert(
      contractDocIds.has(requiredDocId),
      `chart-usage.contract.json.requiredDocs 缺少 ${requiredDocId}`
    )
    assert(
      layoutDocIds.has(requiredDocId),
      `analytics-layout.plan.json.requiredDocs 缺少 ${requiredDocId}`
    )
  })

  chartUsageContract.chartIntentItems.forEach((item, index) => {
    for (const field of [
      'chartId',
      'title',
      'businessQuestion',
      'informationTask',
      'chartType',
      'readingLane',
      'chartChoiceReason',
      'priority',
    ]) {
      assertManagedAnalyticsItemField(item, field, index)
    }
  })

  const layoutArchetype = String(analyticsLayoutPlan.layoutArchetype || '').trim()
  assert(
    MANAGED_ANALYTICS_LAYOUT_ARCHETYPES.has(layoutArchetype),
    `analytics-layout.plan.json.layoutArchetype 非法：${layoutArchetype || '(missing)'}`
  )
  assert(
    String(analyticsLayoutPlan.layoutStrategy || '').trim(),
    'analytics-layout.plan.json.layoutStrategy 不能为空'
  )
  assert(
    String(analyticsLayoutPlan.visualBaselinePlan?.schemaVersion || '').trim() ===
      'analytics-visual-baseline-plan.v1',
    'analytics-layout.plan.json.visualBaselinePlan 缺少受管 visual baseline'
  )
  assert(
    String(analyticsLayoutPlan.visualizationRolePlan?.schemaVersion || '').trim() ===
      'analytics-visualization-role-plan.v1',
    'analytics-layout.plan.json.visualizationRolePlan 缺少受管 role plan'
  )
  assert(
    String(analyticsLayoutPlan.writeScope?.schemaVersion || '').trim() === 'task-write-scope.v1',
    'analytics-layout.plan.json.writeScope 缺少受管写入边界'
  )

  const rolePlanAnalysis = analyzeManagedAnalyticsRolePlan({
    chartUsageContract,
    visualizationRolePlan: analyticsLayoutPlan.visualizationRolePlan,
  })

  assert(
    Array.isArray(rolePlanAnalysis.issues) && rolePlanAnalysis.issues.length === 0,
    rolePlanAnalysis.issues
      .map((issue) => issue?.detail)
      .filter(Boolean)
      .join('\n') || `${targetPagePath} 的 managed analytics role plan 未通过校验`
  )

  return {
    status: 'passed',
    checkedFiles,
    strictChecks: ['managed-analytics-contract', 'managed-analytics-role-plan'],
    chartCount: chartUsageContract.chartIntentItems.length,
    layoutArchetype,
    layoutStrategy: String(analyticsLayoutPlan.layoutStrategy || '').trim(),
  }
}
