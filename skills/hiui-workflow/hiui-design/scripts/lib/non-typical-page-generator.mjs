import fs from 'node:fs/promises'
import path from 'node:path'
import {
  annotateGeneratedArtifacts,
  summarizeGeneratedArtifacts,
} from './generation-artifact-policy.mjs'
import { collectNonTypicalPageSanityViolations } from './non-typical-page-sanity.mjs'
import { ensureRouteMountablePageExport } from './page-export-contract.mjs'

function normalizeRelativePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
}

function stripScriptModuleExtension(value) {
  return String(value || '').replace(/\.(?:[cm]?[jt]sx?)$/, '')
}

function normalizeNonTypicalTargetBusinessPath(value) {
  const normalized = normalizeRelativePath(value)
  if (!normalized) return ''

  return /\.[cm]?[jt]sx?$/i.test(path.posix.basename(normalized))
    ? normalizeRelativePath(path.posix.dirname(normalized))
    : normalized
}

function ensureRelativeImportPath(value) {
  const normalized = String(value || '').replace(/\\/g, '/')
  if (!normalized) return './'
  return normalized.startsWith('.') ? normalized : `./${normalized}`
}

function shouldPreserveExplicitReactImport(brief) {
  const hostProfile = brief?.hostProfile || {}
  if (hostProfile.legacyReactRuntime !== true) return false

  const framework = String(hostProfile.framework || '').trim()
  const riskTags = Array.isArray(hostProfile.riskTags) ? hostProfile.riskTags : []
  return (
    [
      'rspack-module-federation',
      'webpack-module-federation',
      'micro-frontend',
      'rspack-react',
      'webpack-react',
    ].includes(framework) ||
    riskTags.includes('module-federation')
  )
}

function getReactHooksImportLine(brief) {
  return shouldPreserveExplicitReactImport(brief)
    ? "import React, { useMemo, useState } from 'react'"
    : "import { useMemo, useState } from 'react'"
}

function ensureDestIsSafe(targetRoot, dest) {
  if (!dest) throw new Error('Missing non-typical generation destination')
  if (path.isAbsolute(dest)) throw new Error('Non-typical generation destination must be project-relative')

  const absDest = path.resolve(targetRoot, dest)
  if (!absDest.startsWith(`${targetRoot}${path.sep}`)) {
    throw new Error(`Non-typical generation destination escapes target root: ${dest}`)
  }

  return absDest
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

function toGeneratedSourceTag(label) {
  return `hiui-design:generated:${label}`
}

const IMPLEMENTATION_NOTE_PATTERNS = [
  /^(?:展示|默认|支持|保留|保持|突出|强调|通过|切换)/u,
  /(?:需要|需|须)展示/u,
  /支持.+切换/u,
  /待接入/u,
  /后续/u,
  /占位/u,
  /默认/u,
  /仍需/u,
  /可(?:暂|先)/u,
  /驱动/u,
  /同步/u,
  /保持一致/u,
  /结构不变/u,
  /顶部信息栏/u,
  /顶部摘要/u,
  /头部信息/u,
  /表格字段包含/u,
  /明细(?:区|表)/u,
  /显示\s*\d+\s*个操作/u,
  /只保留/u,
  /无抽检/u,
  /统一(?:字段|状态|头部|切换|摘要)?/u,
  /徽标/u,
  /日志入口/u,
  /点击切换/u,
  /辅助(?:确认|校对)/u,
  /状态条/u,
  /聚焦/u,
  /计数/u,
]

function normalizeText(value) {
  return String(value || '').trim()
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

function isImplementationNoteText(value) {
  const text = normalizeText(value)
  if (!text) return false
  return IMPLEMENTATION_NOTE_PATTERNS.some((pattern) => pattern.test(text))
}

function sanitizeVisibleText(value) {
  const text = normalizeText(value)
  if (!text) return ''
  return isImplementationNoteText(text) ? '' : text
}

function sanitizeVisibleTextList(values) {
  if (!Array.isArray(values)) return []
  return values
    .map((item) => sanitizeVisibleText(item))
    .filter(Boolean)
}

function uniqueStrings(values) {
  return [...new Set((Array.isArray(values) ? values : []).map((item) => normalizeText(item)).filter(Boolean))]
}

function toDisplayCarrierPolicy(value, fallback) {
  const source = isPlainObject(value) ? value : {}
  return {
    controlComplexity:
      normalizeText(source.controlComplexity) || normalizeText(fallback?.controlComplexity),
    controlTarget:
      normalizeText(source.controlTarget) || normalizeText(fallback?.controlTarget),
    preferredCarrier:
      normalizeText(source.preferredCarrier) || normalizeText(fallback?.preferredCarrier),
  }
}

function toSelectionTablePolicy(value) {
  const source = isPlainObject(value) ? value : {}
  return {
    preferredCarrier: normalizeText(source.preferredCarrier) || 'table',
    cellWrap: normalizeText(source.cellWrap) || 'nowrap',
    overflowX: normalizeText(source.overflowX) || 'auto',
    statusCarrier: normalizeText(source.statusCarrier) || 'tag',
    actionCarrier: normalizeText(source.actionCarrier) || 'button-link',
  }
}

function toStatusTabs(items) {
  if (!Array.isArray(items) || items.length === 0) return []

  return items
    .map((item, index) => {
      if (isPlainObject(item)) {
        return {
          key: normalizeText(item.key) || normalizeText(item.label) || `status-${index + 1}`,
          label: normalizeText(item.label) || `状态${index + 1}`,
          count: normalizeCountText(item.count),
        }
      }

      const label = normalizeText(item)
      return {
        key: label || `status-${index + 1}`,
        label: label || `状态${index + 1}`,
        count: '0',
      }
    })
    .filter((item) => item.label)
}

function toTableColumns(items) {
  if (!Array.isArray(items) || items.length === 0) return []

  return items
    .map((item, index) => {
      if (isPlainObject(item)) {
        const label = normalizeText(item.label) || `列${index + 1}`
        return {
          key: normalizeText(item.key) || `column-${index + 1}`,
          kind: normalizeText(item.kind) || 'text',
          label,
        }
      }

      const label = normalizeText(item)
      return {
        key: label || `column-${index + 1}`,
        kind: 'text',
        label: label || `列${index + 1}`,
      }
    })
    .filter((item) => item.label)
}

function collectImplementationNotesFromSections(items, notes) {
  if (!Array.isArray(items)) return
  for (const item of items) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue
    if (isImplementationNoteText(item.summary)) {
      notes.push(normalizeText(item.summary))
    }
    for (const bullet of Array.isArray(item.bulletPoints) ? item.bulletPoints : []) {
      if (isImplementationNoteText(bullet)) {
        notes.push(normalizeText(bullet))
      }
    }
  }
}

function resolveDisplayContentPlan(decisionPackage = {}) {
  if (decisionPackage.displayContentPlan && typeof decisionPackage.displayContentPlan === 'object') {
    return decisionPackage.displayContentPlan
  }
  if (decisionPackage.sampleContentPlan && typeof decisionPackage.sampleContentPlan === 'object') {
    return decisionPackage.sampleContentPlan
  }
  return {}
}

function resolveImplementationNotes(decisionPackage = {}) {
  const explicitNotes = uniqueStrings(decisionPackage.implementationNotes)
  if (explicitNotes.length > 0) return explicitNotes

  const notes = []
  const legacyContentPlan = decisionPackage.sampleContentPlan
  if (legacyContentPlan && typeof legacyContentPlan === 'object') {
    if (isImplementationNoteText(decisionPackage.regionPlan?.readingFlow)) {
      notes.push(normalizeText(decisionPackage.regionPlan.readingFlow))
    }
    collectImplementationNotesFromSections(legacyContentPlan.detailGroups, notes)
    collectImplementationNotesFromSections(legacyContentPlan.primarySections, notes)
    for (const selectionItem of Array.isArray(legacyContentPlan.selectionItems)
      ? legacyContentPlan.selectionItems
      : []) {
      if (!selectionItem || typeof selectionItem !== 'object' || Array.isArray(selectionItem)) continue
      if (isImplementationNoteText(selectionItem.summary)) {
        notes.push(normalizeText(selectionItem.summary))
      }
      collectImplementationNotesFromSections(selectionItem.detailGroups, notes)
    }
  }

  return uniqueStrings(notes)
}

function toFactList(items, fallbackPrefix = '信息') {
  if (!Array.isArray(items) || items.length === 0) return []

  return items.map((item, index) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return {
        label: String(item.label || `${fallbackPrefix}${index + 1}`),
        value: String(item.value || '--'),
      }
    }

    return {
      label: `${fallbackPrefix}${index + 1}`,
      value: String(item || '--'),
    }
  })
}

function toSectionList(items, fallbackTitle = '区块') {
  if (!Array.isArray(items) || items.length === 0) return []

  return items.map((item, index) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return {
        title: String(item.title || `${fallbackTitle}${index + 1}`),
        summary: sanitizeVisibleText(item.summary),
        fields: toFactList(item.fields || [], '字段'),
        bulletPoints: sanitizeVisibleTextList(item.bulletPoints),
      }
    }

    return {
      title: `${fallbackTitle}${index + 1}`,
      summary: sanitizeVisibleText(item),
      fields: [],
      bulletPoints: [],
    }
  })
}

function toActionList(items) {
  if (!Array.isArray(items) || items.length === 0) return []

  return items.map((label, index) => ({
    key: `action-${index + 1}`,
    label: String(label || `操作${index + 1}`),
    kind: index === 0 ? 'primary' : 'secondary',
  }))
}

function fallbackFactsFromText(items, fallbackPrefix) {
  if (!Array.isArray(items) || items.length === 0) return []
  return items.map((item, index) => ({
    label: `${fallbackPrefix}${index + 1}`,
    value: String(item || '--'),
  }))
}

const BACKLESS_NAVIGATION_ACTIONS = new Set([
  'append-existing-registry',
  'manual-register-existing-registry',
  'materialize-implicit-feature-entry',
  'create-formal-shell-and-mount-entry',
])

function shouldHideBackForFormalNavigationEntry(brief) {
  const navigationAction = String(
    brief?.pageGenerationDecision?.navigationMountAction?.action || ''
  ).trim()

  return BACKLESS_NAVIGATION_ACTIONS.has(navigationAction)
}

function resolveNonTypicalPageHeaderPlan(brief) {
  const decisionPackage = brief.nonTypicalExecutionBrief?.decisionPackage || {}
  const pageHeaderPlan =
    decisionPackage.pageHeaderPlan && typeof decisionPackage.pageHeaderPlan === 'object'
      ? decisionPackage.pageHeaderPlan
      : {}

  return {
    ...pageHeaderPlan,
    hasBack: shouldHideBackForFormalNavigationEntry(brief) ? false : pageHeaderPlan.hasBack === true,
  }
}

function buildStageItems(sampleContentPlan, decisionPackage, inputSummary) {
  const sourceItems = Array.isArray(sampleContentPlan?.sourceItems)
    ? sampleContentPlan.sourceItems
    : decisionPackage.primaryWorkflows.map((item) => ({
        label: item,
        summary: decisionPackage.pageGoal,
        badge: '',
      }))

  const primarySections = toSectionList(
    sampleContentPlan?.primarySections || decisionPackage.primaryWorkflows,
    '处理区块'
  )
  const snapshotFacts = toFactList(
    sampleContentPlan?.snapshotFacts || fallbackFactsFromText(inputSummary.knowns, '已知条件'),
    '快照'
  )

  return sourceItems.map((item, index) => ({
    key: `stage-${index + 1}`,
    label: String(item.label || `阶段${index + 1}`),
    summary: sanitizeVisibleText(item.summary || decisionPackage.pageGoal),
    badge: String(item.badge || ''),
    detailGroups:
      primarySections[index] != null ? [primarySections[index]] : primarySections.slice(0, 1),
    snapshotFacts,
  }))
}

function buildSelectionItems(sampleContentPlan, decisionPackage, inputSummary) {
  const explicitItems = Array.isArray(sampleContentPlan?.selectionItems)
    ? sampleContentPlan.selectionItems
    : null
  const sourceItems = explicitItems || sampleContentPlan?.sourceItems || decisionPackage.primaryWorkflows

  const fallbackDetailGroups = toSectionList(
    sampleContentPlan?.detailGroups || sampleContentPlan?.primarySections || decisionPackage.primaryWorkflows,
    '详情区块'
  )
  const fallbackSummaryFacts = toFactList(
    sampleContentPlan?.summaryFacts ||
      sampleContentPlan?.snapshotFacts ||
      fallbackFactsFromText(inputSummary.knowns, '摘要'),
    '摘要'
  )

  return (Array.isArray(sourceItems) ? sourceItems : []).map((item, index) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return {
        key: String(item.key || `selection-${index + 1}`),
        label: String(item.label || `对象${index + 1}`),
        summary: sanitizeVisibleText(item.summary || decisionPackage.pageGoal),
        badge: String(item.badge || ''),
        detailGroups: toSectionList(item.detailGroups || fallbackDetailGroups, '详情区块'),
        summaryFacts: toFactList(item.summaryFacts || fallbackSummaryFacts, '摘要'),
        metrics: toFactList(item.metrics || [], '指标'),
        detailHeader: isPlainObject(item.detailHeader) ? item.detailHeader : null,
        statusTabs: toStatusTabs(item.statusTabs),
        statusTabsPolicy: isPlainObject(item.statusTabsPolicy) ? item.statusTabsPolicy : null,
        detailTable: isPlainObject(item.detailTable) ? item.detailTable : null,
      }
    }

    return {
      key: `selection-${index + 1}`,
      label: String(item || `对象${index + 1}`),
      summary: decisionPackage.pageGoal,
      badge: '',
      detailGroups: fallbackDetailGroups,
      summaryFacts: fallbackSummaryFacts,
    }
  })
}

function buildProcessStageSyncModel(brief) {
  const decisionPackage = brief.nonTypicalExecutionBrief.decisionPackage
  const pageHeaderPlan = resolveNonTypicalPageHeaderPlan(brief)
  const sampleContentPlan = resolveDisplayContentPlan(decisionPackage)
  const inputSummary = brief.nonTypicalConversationOutput?.inputSummary || {}

  const contextFacts = toFactList(
    sampleContentPlan.contextFacts || fallbackFactsFromText(inputSummary.knowns, '上下文'),
    '上下文'
  )
  const stageItems = buildStageItems(sampleContentPlan, decisionPackage, inputSummary)
  const fallbackPrimarySections = toSectionList(
    sampleContentPlan.primarySections || decisionPackage.primaryWorkflows,
    '主区块'
  )
  const snapshotFacts = toFactList(
    sampleContentPlan.snapshotFacts || fallbackFactsFromText(inputSummary.evidence, '快照'),
    '快照'
  )

  return {
    title: pageHeaderPlan.title,
    hasBack: pageHeaderPlan.hasBack === true,
    pageGoal: decisionPackage.pageGoal,
    readingFlow: '',
    hostConflictPolicy: pageHeaderPlan.hostConflictPolicy,
    restorePolicy: pageHeaderPlan.restorePolicy,
    mountRegionFillPolicy: decisionPackage.whiteBodyPlan.mountRegionFillPolicy,
    hostEscalationRule: decisionPackage.whiteBodyPlan.hostEscalationRule,
    headerActions: toActionList(pageHeaderPlan.primaryActions),
    footerActions: toActionList(pageHeaderPlan.primaryActions),
    contextFacts,
    stageItems,
    primarySections: fallbackPrimarySections,
    snapshotFacts,
  }
}

function findMatchingSection(detailGroups, patterns = []) {
  if (!Array.isArray(detailGroups) || detailGroups.length === 0) return null
  return (
    detailGroups.find((section) => {
      const title = normalizeText(section?.title)
      return patterns.some((pattern) => pattern.test(title))
    }) || null
  )
}

function findMatchingFactValue(facts, patterns = []) {
  if (!Array.isArray(facts) || facts.length === 0) return ''
  const matchedFact = facts.find((fact) => {
    const label = normalizeText(fact?.label)
    return patterns.some((pattern) => pattern.test(label))
  })
  return normalizeText(matchedFact?.value)
}

function normalizeCountText(value) {
  const text = normalizeText(value)
  return text || '0'
}

function parseLooseNumber(value) {
  const digits = String(value || '').replace(/[^\d.-]/g, '')
  if (!digits) return 0
  const parsed = Number(digits)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatAmount(value) {
  if (!Number.isFinite(value) || value <= 0) return '--'
  return `￥${new Intl.NumberFormat('zh-CN').format(Math.round(value))}`
}

function splitHumanList(value) {
  const text = normalizeText(value)
  if (!text) return []

  return text
    .replace(/[。；;]+$/g, '')
    .replace(/和/g, '、')
    .split(/[、,，/／]/u)
    .map((item) => normalizeText(item))
    .filter(Boolean)
}

function buildSelectionMetricFacts(summaryFacts = []) {
  const organizationMetric = {
    label: '机构数量统计',
    value:
      findMatchingFactValue(summaryFacts, [/机构数量统计/u, /机构.*数量/u, /机构数/u]) || '--',
  }
  const goodsMetric = {
    label: '商品数量统计',
    value:
      findMatchingFactValue(summaryFacts, [/商品数量统计/u, /商品.*数量/u, /物品.*数量/u, /件数/u]) || '--',
  }
  const amountMetric = {
    label: '物品总价金额',
    value:
      findMatchingFactValue(summaryFacts, [/物品总价金额/u, /总价/u, /金额/u, /总金额/u]) || '--',
  }

  return [organizationMetric, goodsMetric, amountMetric]
}

function buildSelectionTableColumns(detailGroups = [], explicitColumns = []) {
  const explicitColumnList = toTableColumns(explicitColumns)
  if (explicitColumnList.length > 0) return explicitColumnList

  const ruleSection = findMatchingSection(detailGroups, [/明细表/u, /表格/u, /字段/u])
  const sourceText =
    normalizeText(ruleSection?.summary) ||
    ruleSection?.bulletPoints?.find((item) => /字段/u.test(normalizeText(item))) ||
    ''
  const matchedFields = sourceText.match(/(?:字段包含|字段包括|字段为)(.+)$/u)
  const labels = splitHumanList(matchedFields?.[1] || sourceText)

  const fallbackLabels = ['售卖单号', '状态标签', '机构信息', '物品属性', '品相', '物品数量', '物品金额', '操作']
  const normalizedLabels = labels.length > 0 ? labels : fallbackLabels

  return normalizedLabels.map((label, index) => {
    const normalizedLabel = normalizeText(label) || `列${index + 1}`

    let key = `column-${index + 1}`
    let kind = 'text'

    if (/单号/u.test(normalizedLabel)) key = 'orderNo'
    else if (/状态/u.test(normalizedLabel)) {
      key = 'status'
      kind = 'status'
    } else if (/机构/u.test(normalizedLabel)) key = 'organizationInfo'
    else if (/属性/u.test(normalizedLabel)) key = 'itemAttribute'
    else if (/品相/u.test(normalizedLabel)) key = 'quality'
    else if (/数量/u.test(normalizedLabel)) key = 'quantity'
    else if (/金额|总价|价格/u.test(normalizedLabel)) key = 'amount'
    else if (/操作/u.test(normalizedLabel)) {
      key = 'actions'
      kind = 'actions'
    }

    return {
      key,
      kind,
      label: normalizedLabel,
    }
  })
}

function buildSelectionStatusTabs(detailGroups = [], explicitTabItems = []) {
  const explicitTabList = toStatusTabs(explicitTabItems)
  if (explicitTabList.length > 0) return explicitTabList

  const statusSection = findMatchingSection(detailGroups, [/状态切换/u, /状态.*tab/u, /状态筛选/u])
  const explicitFields = Array.isArray(statusSection?.fields) ? statusSection.fields : []
  const derivedTabs = explicitFields
    .map((item, index) => ({
      key: normalizeText(item?.key) || normalizeText(item?.label) || `status-${index + 1}`,
      label: normalizeText(item?.label) || `状态${index + 1}`,
      count: normalizeCountText(item?.value),
    }))
    .filter((item) => item.label)

  if (derivedTabs.length > 0) return derivedTabs

  return [
    { key: '全部', label: '全部', count: '0' },
    { key: '待仓库处理', label: '待仓库处理', count: '0' },
    { key: '待驻厂抽检', label: '待驻厂抽检', count: '0' },
    { key: '待仓库发货', label: '待仓库发货', count: '0' },
    { key: '已完成', label: '已完成', count: '0' },
  ]
}

function buildSelectionActionPolicy(detailGroups = []) {
  const ruleSection = findMatchingSection(detailGroups, [/明细表/u, /表格/u, /字段/u])
  const explicitFields = Array.isArray(ruleSection?.fields) ? ruleSection.fields : []

  const pendingWarehouseActions =
    splitHumanList(
      explicitFields.find((item) => /待仓库处理/u.test(normalizeText(item?.label)))?.value
    ) || []
  const defaultActions =
    splitHumanList(
      explicitFields.find((item) => /其他状态/u.test(normalizeText(item?.label)))?.value
    ) || []

  return {
    pendingWarehouseActions:
      pendingWarehouseActions.length > 0
        ? pendingWarehouseActions
        : ['抽检', '标段信息', '日志'],
    defaultActions: defaultActions.length > 0 ? defaultActions : ['标段信息', '日志'],
  }
}

function inferSelectionRowQuality(statusLabel, rowIndex) {
  if (/抽检/u.test(statusLabel)) return rowIndex === 0 ? '待抽检' : '抽检中'
  if (/发货/u.test(statusLabel)) return rowIndex === 0 ? '待出库' : '备货完成'
  if (/完成/u.test(statusLabel)) return '已完成'
  if (/失败|驳回/u.test(statusLabel)) return '待复核'
  return rowIndex === 0 ? '标准' : '良好'
}

function buildSelectionDetailRows({
  orderNo,
  orderName,
  department,
  metrics,
  statusTabs,
  columns,
  actionPolicy,
}) {
  const organizationCount = parseLooseNumber(
    findMatchingFactValue(metrics, [/机构数量统计/u, /机构/u])
  )
  const totalQuantity = parseLooseNumber(
    findMatchingFactValue(metrics, [/商品数量统计/u, /数量/u])
  )
  const totalAmount = parseLooseNumber(
    findMatchingFactValue(metrics, [/物品总价金额/u, /金额/u, /总价/u])
  )
  const unitAmount =
    totalAmount > 0 && totalQuantity > 0 ? totalAmount / totalQuantity : totalAmount > 0 ? totalAmount / 6 : 0

  function createRow(statusLabel, statusCount, rowIndex) {
    const safeStatusCount = Math.max(statusCount, 1)
    const rowQuantity = Math.max(1, Math.floor((totalQuantity || safeStatusCount * 3) / safeStatusCount) + rowIndex)
    const rowAmount = unitAmount > 0 ? Math.max(1, Math.round(rowQuantity * unitAmount)) : 0
    const baseCells = {
      orderNo,
      status: statusLabel,
      organizationInfo: department
        ? `${department} · ${organizationCount || '--'} 个机构`
        : organizationCount > 0
          ? `${organizationCount} 个机构`
          : '--',
      itemAttribute: orderName ? `${orderName}物资-${rowIndex + 1}` : `物资批次-${rowIndex + 1}`,
      quality: inferSelectionRowQuality(statusLabel, rowIndex),
      quantity: String(rowQuantity),
      amount: rowAmount > 0 ? formatAmount(rowAmount) : '--',
    }

    return {
      key: `${statusLabel}-${rowIndex + 1}`,
      cells: Object.fromEntries(columns.map((column) => [column.key, baseCells[column.key] || '--'])),
      actions: (statusLabel === '待仓库处理'
        ? actionPolicy.pendingWarehouseActions
        : actionPolicy.defaultActions
      ).map((label, actionIndex) => ({
        key: `${statusLabel}-${rowIndex + 1}-action-${actionIndex + 1}`,
        label,
        kind: actionIndex === 0 ? 'primary' : 'secondary',
      })),
    }
  }

  const specificTabs = statusTabs.filter((tab) => normalizeText(tab.label) !== '全部')
  const rowsByStatus = {}

  for (const tab of specificTabs) {
    const statusCount = parseLooseNumber(tab.count)
    const rowCount = statusCount > 0 ? Math.min(3, statusCount) : 0
    rowsByStatus[tab.key] = Array.from({ length: rowCount }, (_, index) =>
      createRow(tab.label, statusCount, index)
    )
  }

  const aggregateRows = specificTabs.flatMap((tab) => rowsByStatus[tab.key] || []).slice(0, 8)
  const allTab = statusTabs.find((tab) => normalizeText(tab.label) === '全部')
  if (allTab) {
    rowsByStatus[allTab.key] =
      aggregateRows.length > 0 ? aggregateRows : [createRow('待仓库处理', 3, 0), createRow('已完成', 2, 1)]
  }

  return rowsByStatus
}

function resolveSelectionDetailDefaultStatus(statusTabs, currentBadge) {
  const normalizedBadge = normalizeText(currentBadge)
  if (!Array.isArray(statusTabs) || statusTabs.length === 0) return ''

  if (/仓库处理/u.test(normalizedBadge)) {
    return statusTabs.find((item) => /待仓库处理/u.test(item.label))?.key || statusTabs[0].key
  }

  if (/完成/u.test(normalizedBadge)) {
    return statusTabs.find((item) => /已完成/u.test(item.label))?.key || statusTabs[0].key
  }

  return statusTabs[0].key
}

function buildSelectionFilterOptions(selectionItems = [], sampleContentPlan = {}) {
  const explicitFilters = Array.isArray(sampleContentPlan.selectionFilters)
    ? sampleContentPlan.selectionFilters
    : Array.isArray(sampleContentPlan.leftFilters)
      ? sampleContentPlan.leftFilters
      : []

  if (explicitFilters.length > 0) {
    return explicitFilters
      .map((item, index) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          return {
            key: normalizeText(item.key) || normalizeText(item.label) || `filter-${index + 1}`,
            label: normalizeText(item.label) || `筛选${index + 1}`,
            count: normalizeCountText(item.count),
          }
        }

        const label = normalizeText(item)
        return {
          key: label || `filter-${index + 1}`,
          label: label || `筛选${index + 1}`,
          count: '',
        }
      })
      .filter((item) => item.label)
  }

  const countsByBadge = new Map()
  for (const item of selectionItems) {
    const badge = normalizeText(item.badge)
    if (!badge) continue
    countsByBadge.set(badge, (countsByBadge.get(badge) || 0) + 1)
  }

  return [...countsByBadge.entries()].map(([label, count]) => ({
    key: label,
    label,
    count: String(count),
  }))
}

function buildSelectionSearchConfig(selectionItems = [], detailTableColumns = [], sampleContentPlan = {}) {
  const explicitSearch =
    sampleContentPlan.selectionSearch && typeof sampleContentPlan.selectionSearch === 'object'
      ? sampleContentPlan.selectionSearch
      : sampleContentPlan.leftSearch && typeof sampleContentPlan.leftSearch === 'object'
        ? sampleContentPlan.leftSearch
        : null

  if (explicitSearch) {
    return {
      placeholder: normalizeText(explicitSearch.placeholder) || '单号 / 名称 / 部门',
      emptyText: normalizeText(explicitSearch.emptyText) || '暂无匹配结果',
      preferredCarrier: normalizeText(explicitSearch.preferredCarrier) || 'search',
    }
  }

  const firstItem = selectionItems[0] || {}
  const nameLabel =
    (firstItem.summaryFacts || []).find((fact) => /名称/u.test(normalizeText(fact.label)))?.label || '名称'
  const departmentLabel =
    findMatchingSection(firstItem.detailGroups || [], [/顶部摘要/u, /头部/u])?.fields?.find((fact) =>
      /部门/u.test(normalizeText(fact.label))
    )?.label || '申请部门'
  const idLabel =
    detailTableColumns.find((column) => /单号/u.test(normalizeText(column.label)))?.label || '单号'

  return {
    placeholder: [idLabel, nameLabel, departmentLabel].filter(Boolean).join(' / '),
    emptyText: '暂无匹配结果',
    preferredCarrier: 'search',
  }
}

function buildSelectionDetailItems(sampleContentPlan, decisionPackage, inputSummary) {
  const baseItems = buildSelectionItems(sampleContentPlan, decisionPackage, inputSummary)

  return baseItems.map((item, index) => {
    const detailGroups = Array.isArray(item.detailGroups) ? item.detailGroups : []
    const summaryFacts = Array.isArray(item.summaryFacts) ? item.summaryFacts : []
    const detailHeaderPlan = isPlainObject(item.detailHeader) ? item.detailHeader : {}
    const detailTablePlan = isPlainObject(item.detailTable) ? item.detailTable : {}
    const topSection = findMatchingSection(detailGroups, [/顶部摘要/u, /头部/u])
    const orderName =
      findMatchingFactValue(summaryFacts, [/售卖单名称/u, /名称/u, /单据名称/u]) || item.label
    const department =
      findMatchingFactValue(topSection?.fields, [/申请部门/u, /部门/u, /机构信息/u]) || '--'
    const applicant =
      findMatchingFactValue(summaryFacts, [/申请人/u, /提交人/u]) || '--'
    const applyNo =
      findMatchingFactValue(summaryFacts, [/申请单号/u, /售卖申请单号/u]) || '--'
    const applyTime =
      findMatchingFactValue(summaryFacts, [/申请时间/u, /创建时间/u, /提交时间/u]) || '--'
    const statusLabel =
      item.badge ||
      findMatchingFactValue(topSection?.fields, [/状态标签/u, /状态/u]) ||
      '待处理'
    const detailHeaderFacts = [
      { label: '售卖申请单号', value: applyNo },
      { label: '申请人', value: applicant },
      { label: '申请时间', value: applyTime },
    ]
    const explicitMetrics = toFactList(item.metrics || [], '指标')
    const metrics = explicitMetrics.length > 0 ? explicitMetrics : buildSelectionMetricFacts(summaryFacts)
    const detailTableColumns = buildSelectionTableColumns(detailGroups, detailTablePlan.columns)
    const statusTabs = buildSelectionStatusTabs(detailGroups, item.statusTabs)
    const actionPolicy = buildSelectionActionPolicy(detailGroups)
    const detailTableRows = buildSelectionDetailRows({
      actionPolicy,
      columns: detailTableColumns,
      department,
      metrics,
      orderName,
      orderNo: item.label,
      statusTabs,
    })

    return {
      ...item,
      key: item.key || `selection-${index + 1}`,
      title: orderName,
      summary:
        [department !== '--' ? department : '', applicant !== '--' ? `申请人 ${applicant}` : '']
          .filter(Boolean)
          .join(' · ') || sanitizeVisibleText(item.summary),
      badge: statusLabel,
      metrics,
      searchKeywords: uniqueStrings([item.label, orderName, department, applicant, item.summary]),
      detailHeader: {
        title: normalizeText(detailHeaderPlan.title) || orderName,
        statusLabel: normalizeText(detailHeaderPlan.statusLabel) || statusLabel,
        actionLabel: normalizeText(detailHeaderPlan.actionLabel) || '查看日志',
        facts: toFactList(detailHeaderPlan.facts || detailHeaderFacts, '头部信息'),
        metrics: toFactList(detailHeaderPlan.metrics || metrics, '指标'),
      },
      statusTabs,
      statusTabsPolicy: toDisplayCarrierPolicy(item.statusTabsPolicy, {
        controlComplexity: 'single-dimension-switch',
        controlTarget: 'detail-table',
        preferredCarrier: 'tabs',
      }),
      defaultStatusKey: resolveSelectionDetailDefaultStatus(statusTabs, statusLabel),
      detailTable: {
        columns: detailTableColumns,
        rowsByStatus: isPlainObject(detailTablePlan.rowsByStatus)
          ? detailTablePlan.rowsByStatus
          : detailTableRows,
        tablePolicy: toSelectionTablePolicy(detailTablePlan.tablePolicy),
      },
    }
  })
}

function buildSelectionDetailSyncModel(brief) {
  const decisionPackage = brief.nonTypicalExecutionBrief.decisionPackage
  const pageHeaderPlan = resolveNonTypicalPageHeaderPlan(brief)
  const sampleContentPlan = resolveDisplayContentPlan(decisionPackage)
  const inputSummary = brief.nonTypicalConversationOutput?.inputSummary || {}
  const selectionItems = buildSelectionDetailItems(sampleContentPlan, decisionPackage, inputSummary)
  const detailTableColumns =
    selectionItems[0]?.detailTable?.columns || buildSelectionTableColumns(sampleContentPlan.detailGroups)

  return {
    title: pageHeaderPlan.title,
    hasBack: pageHeaderPlan.hasBack === true,
    pageGoal: decisionPackage.pageGoal,
    readingFlow: '',
    hostConflictPolicy: pageHeaderPlan.hostConflictPolicy,
    restorePolicy: pageHeaderPlan.restorePolicy,
    mountRegionFillPolicy: decisionPackage.whiteBodyPlan.mountRegionFillPolicy,
    hostEscalationRule: decisionPackage.whiteBodyPlan.hostEscalationRule,
    headerActions: toActionList(pageHeaderPlan.primaryActions),
    footerActions: toActionList(pageHeaderPlan.primaryActions),
    leftSearch: buildSelectionSearchConfig(selectionItems, detailTableColumns, sampleContentPlan),
    leftFilters: buildSelectionFilterOptions(selectionItems, sampleContentPlan),
    leftFiltersPolicy: toDisplayCarrierPolicy(sampleContentPlan.leftFiltersPolicy, {
      controlComplexity: 'light',
      controlTarget: 'selection-list',
      preferredCarrier: 'tag',
    }),
    selectionItems,
    detailTableColumns,
    fallbackSummaryFacts: toFactList(
      sampleContentPlan.summaryFacts || fallbackFactsFromText(inputSummary.knowns, '摘要'),
      '摘要'
    ),
  }
}

function buildProcessStageSyncPageContent({ brief, primitivesImportPath }) {
  const model = buildProcessStageSyncModel(brief)

  return `${getReactHooksImportLine(brief)}
import styles from './index.module.scss'
import { PageOwnedMountBoundary } from './page-owned-mount-support'
import {
  ActionStrip,
  NonTypicalPageFrame,
  SectionGroup,
  SnapshotPane,
  StageRail,
  WhiteBodyWorkspace,
} from ${JSON.stringify(primitivesImportPath)}

const pageModel = ${JSON.stringify(model, null, 2)}

export default function GeneratedNonTypicalProcessStagePage() {
  const [activeStageKey, setActiveStageKey] = useState(pageModel.stageItems[0]?.key || '')
  const shouldSuppressSharedHeader =
    pageModel.hostConflictPolicy === 'auto-hide-while-mounted' &&
    pageModel.restorePolicy === 'restore-on-unmount'

  const activeStage = useMemo(
    () => pageModel.stageItems.find((item) => item.key === activeStageKey) || pageModel.stageItems[0] || null,
    [activeStageKey]
  )

  const activeSections =
    Array.isArray(activeStage?.detailGroups) && activeStage.detailGroups.length > 0
      ? activeStage.detailGroups
      : pageModel.primarySections

  const activeSnapshotFacts =
    Array.isArray(activeStage?.snapshotFacts) && activeStage.snapshotFacts.length > 0
      ? activeStage.snapshotFacts
      : pageModel.snapshotFacts

  return (
    <PageOwnedMountBoundary suppressSharedHeader={shouldSuppressSharedHeader}>
      <NonTypicalPageFrame
        hasBack={pageModel.hasBack}
        headerActions={pageModel.headerActions}
        title={pageModel.title}
      >
        <WhiteBodyWorkspace>
          <div className={styles.processWorkspace}>
            <div className={styles.sideStack}>
              <SnapshotPane
                facts={pageModel.contextFacts}
                title="业务上下文"
              />
          </div>

            <div className={styles.sideStack}>
              <StageRail
                activeKey={activeStage?.key || ''}
                items={pageModel.stageItems}
                onChange={setActiveStageKey}
                summary={pageModel.readingFlow}
                title="处理阶段"
              />
            </div>

            <div className={styles.primaryStack}>
              {activeSections.map((section) => (
                <SectionGroup
                  bulletPoints={section.bulletPoints}
                  fields={section.fields}
                  key={section.title}
                  summary={section.summary}
                  title={section.title}
                />
              ))}
              <ActionStrip actions={pageModel.footerActions} />
            </div>

            <div className={styles.sideStack}>
              <SnapshotPane
                facts={activeSnapshotFacts}
                title="订单快照"
              />
            </div>
          </div>
        </WhiteBodyWorkspace>
      </NonTypicalPageFrame>
    </PageOwnedMountBoundary>
  )
}
`
}

function buildSelectionDetailSyncPageContent({ brief, primitivesImportPath }) {
  const model = buildSelectionDetailSyncModel(brief)

  return `${getReactHooksImportLine(brief)}
import styles from './index.module.scss'
import { PageOwnedMountBoundary } from './page-owned-mount-support'
import {
  ActionStrip,
  DataTable,
  DetailHeaderPane,
  NonTypicalPageFrame,
  SelectionPane,
  StatusTabStrip,
  WhiteBodyWorkspace,
} from ${JSON.stringify(primitivesImportPath)}

const pageModel = ${JSON.stringify(model, null, 2)}

export default function GeneratedNonTypicalSelectionDetailPage() {
  const [activeSelectionKey, setActiveSelectionKey] = useState(pageModel.selectionItems[0]?.key || '')
  const [selectionKeyword, setSelectionKeyword] = useState('')
  const [activeFilterKey, setActiveFilterKey] = useState('')
  const [activeStatusKey, setActiveStatusKey] = useState('')
  const shouldSuppressSharedHeader =
    pageModel.hostConflictPolicy === 'auto-hide-while-mounted' &&
    pageModel.restorePolicy === 'restore-on-unmount'

  const filteredSelectionItems = useMemo(() => {
    const normalizedKeyword = selectionKeyword.trim().toLowerCase()

    return pageModel.selectionItems.filter((item) => {
      const matchesFilter = activeFilterKey ? item.badge === activeFilterKey : true
      if (!matchesFilter) return false

      if (!normalizedKeyword) return true

      const searchText = (item.searchKeywords || []).join(' ').toLowerCase()
      return searchText.includes(normalizedKeyword)
    })
  }, [selectionKeyword, activeFilterKey])

  const activeSelection = useMemo(
    () =>
      filteredSelectionItems.find((item) => item.key === activeSelectionKey) ||
      filteredSelectionItems[0] ||
      null,
    [activeSelectionKey, filteredSelectionItems]
  )

  const availableStatusTabs = useMemo(
    () => (Array.isArray(activeSelection?.statusTabs) ? activeSelection.statusTabs : []),
    [activeSelection]
  )
  const resolvedActiveStatusKey =
    availableStatusTabs.find((item) => item.key === activeStatusKey)?.key ||
    activeSelection?.defaultStatusKey ||
    availableStatusTabs[0]?.key ||
    ''

  const rowsByStatus = activeSelection?.detailTable?.rowsByStatus || {}
  const activeDetailRows =
    rowsByStatus[resolvedActiveStatusKey] || rowsByStatus[availableStatusTabs[0]?.key || ''] || []

  return (
    <PageOwnedMountBoundary suppressSharedHeader={shouldSuppressSharedHeader}>
      <NonTypicalPageFrame
        hasBack={pageModel.hasBack}
        headerActions={pageModel.headerActions}
        title={pageModel.title}
      >
        <WhiteBodyWorkspace>
          <div className={styles.selectionWorkspace}>
            <div className={styles.sideStack}>
              <SelectionPane
                activeKey={activeSelection?.key || ''}
                activeFilterKey={activeFilterKey}
                emptyText={pageModel.leftSearch?.emptyText || '暂无匹配结果'}
                filterCarrier={pageModel.leftFiltersPolicy?.preferredCarrier || 'tag'}
                filterPolicy={pageModel.leftFiltersPolicy}
                filters={pageModel.leftFilters}
                items={filteredSelectionItems}
                onChange={setActiveSelectionKey}
                onFilterChange={setActiveFilterKey}
                onSearchChange={setSelectionKeyword}
                searchCarrier={pageModel.leftSearch?.preferredCarrier || 'search'}
                searchPlaceholder={pageModel.leftSearch?.placeholder || ''}
                searchValue={selectionKeyword}
                summary={pageModel.readingFlow}
                title="售卖单列表"
              />
            </div>

            <div className={styles.primaryStack}>
              <DetailHeaderPane
                actionLabel={activeSelection?.detailHeader?.actionLabel || ''}
                facts={activeSelection?.detailHeader?.facts || pageModel.fallbackSummaryFacts}
                metrics={activeSelection?.detailHeader?.metrics || []}
                status={activeSelection?.detailHeader?.statusLabel || ''}
                title={activeSelection?.detailHeader?.title || activeSelection?.title || '--'}
              />
              <StatusTabStrip
                activeKey={resolvedActiveStatusKey}
                onChange={setActiveStatusKey}
                policy={activeSelection?.statusTabsPolicy}
                tabs={availableStatusTabs}
              />
              <DataTable
                columns={activeSelection?.detailTable?.columns || pageModel.detailTableColumns}
                emptyText="当前状态暂无明细数据"
                policy={activeSelection?.detailTable?.tablePolicy}
                rows={activeDetailRows}
              />
              <ActionStrip actions={pageModel.footerActions} />
            </div>
          </div>
        </WhiteBodyWorkspace>
      </NonTypicalPageFrame>
    </PageOwnedMountBoundary>
  )
}
`
}

function buildNonTypicalPageStyleContent() {
  return `.processWorkspace,
.selectionWorkspace {
  display: grid;
  gap: 16px;
  min-height: 100%;
  min-width: 0;
}

.processWorkspace {
  grid-template-columns: minmax(220px, 0.95fr) minmax(180px, 0.8fr) minmax(0, 1.4fr) minmax(240px, 0.95fr);
}

.selectionWorkspace {
  grid-template-columns: minmax(300px, 0.92fr) minmax(0, 1.6fr);
}

.primaryStack,
.sideStack {
  display: grid;
  align-content: start;
  gap: 16px;
  min-width: 0;
}

@media (max-width: 1400px) {
  .processWorkspace {
    grid-template-columns: minmax(220px, 0.95fr) minmax(0, 1.4fr);
  }

  .selectionWorkspace {
    grid-template-columns: minmax(280px, 0.92fr) minmax(0, 1.25fr);
  }
}

@media (max-width: 960px) {
  .processWorkspace,
  .selectionWorkspace {
    grid-template-columns: minmax(0, 1fr);
  }
}
`
}

function buildNonTypicalPagegenMetaContent({
  brief,
  targetBusinessPath,
  plannedFiles = [],
}) {
  const generatorStatus =
    brief.nonTypicalExecutionBrief.readiness?.status || 'generator-ready-public-open'
  const decisionPackage = brief.nonTypicalExecutionBrief.decisionPackage || {}
  const pageHeaderPlan = resolveNonTypicalPageHeaderPlan(brief)
  const implementationNotes = resolveImplementationNotes(decisionPackage)
  const payload = {
    schema: 'hiui-design-non-typical-pagegen-meta.v1',
    generatedAt: new Date().toISOString(),
    pageFamily: brief.nonTypicalExecutionBrief.pageFamily,
    inputMode: brief.inputMode ?? {},
    confirmationPolicy: {
      mode: brief.executionPolicy?.confirmationMode || '',
      requiresChatConfirmation: Boolean(brief.executionPolicy?.requiresChatConfirmation),
      confirmedPageFamily: brief.executionPolicy?.confirmedPageFamily || '',
      confirmedPageType: brief.executionPolicy?.confirmedPageType || '',
      finalPromptAvailable: Boolean(brief.executionPolicy?.finalPromptAvailable),
    },
    confirmedDesignRestoreInput: brief.confirmedDesignRestoreInput ?? null,
    workflowId: brief.nonTypicalExecutionBrief.workflowId,
    coordinationPatternId:
      brief.nonTypicalExecutionBrief.coordinationPattern?.coordinationPatternId ||
      brief.nonTypicalExecutionBrief.coordinationBindings?.coordinationPatternId ||
      '',
    targetBusinessPath,
    runtimePrimitivesPath: 'src/runtime/non-typical-primitives',
    pageOwnedSupportPath: `${normalizeRelativePath(targetBusinessPath)}/page-owned-mount-support`,
    designMapPath: brief.nonTypicalExecutionBrief.designMappingPlan?.designMapPath || '',
    restorePrimitivePlan: brief.nonTypicalExecutionBrief.restorePrimitivePlan ?? null,
    pageHeaderPlan,
    whiteBodyPlan: decisionPackage.whiteBodyPlan || {},
    implementationNotes,
    generatorStatus,
    generationSemanticReadiness: {
      status: generatorStatus,
      ready: generatorStatus === 'generator-ready-public-open',
      reason: normalizeText(brief.nonTypicalExecutionBrief.readiness?.reason),
      source: 'non-typical-execution-brief',
    },
    artifactSummary: summarizeGeneratedArtifacts(plannedFiles),
  }

  return `${JSON.stringify(payload, null, 2)}\n`
}

async function collectRuntimePrimitiveFiles({ skillRoot, targetRoot }) {
  const sourceRoot = path.join(
    skillRoot,
    'examples',
    'host-integration',
    'src',
    'runtime',
    'non-typical-primitives'
  )
  const targetRootPath = path.join(targetRoot, 'src', 'runtime', 'non-typical-primitives')
  const fileNames = ['index.tsx', 'index.module.scss']

  const files = []
  for (const fileName of fileNames) {
    const sourcePath = path.join(sourceRoot, fileName)
    if (!(await pathExists(sourcePath))) {
      throw new Error(`Missing non-typical primitive source: ${sourcePath}`)
    }

    files.push({
      sourcePath,
      destPath: path.join(targetRootPath, fileName),
      content: await fs.readFile(sourcePath, 'utf8'),
      isRuntimePrimitive: true,
    })
  }

  return files
}

async function collectPageOwnedSupportFiles({ skillRoot, destDir }) {
  const sourceRoot = path.join(
    skillRoot,
    'examples',
    'host-integration',
    'src',
    'components',
    'hiui-design-runtime',
    'page-owned-mount-support'
  )
  const fileNames = ['index.tsx', 'index.module.scss', 'shared-header-node.ts']
  const files = []

  for (const fileName of fileNames) {
    const sourcePath = path.join(sourceRoot, fileName)
    if (!(await pathExists(sourcePath))) {
      throw new Error(`Missing non-typical page-owned support source: ${sourcePath}`)
    }

    files.push({
      sourcePath,
      destPath: path.join(destDir, 'page-owned-mount-support', fileName),
      content: await fs.readFile(sourcePath, 'utf8'),
    })
  }

  return files
}

async function collectConflictingExistingFiles(plannedFiles) {
  const conflicts = []

  for (const file of plannedFiles) {
    if (!(await pathExists(file.destPath))) continue

    const existingContent = await fs.readFile(file.destPath, 'utf8')
    if (existingContent !== file.content) {
      conflicts.push(file)
    }
  }

  return conflicts
}

export async function planNonTypicalPageFiles({ skillRoot, targetRoot, brief }) {
  if (!brief.nonTypicalExecutionBrief) {
    throw new Error('Non-typical execution brief is required before page generation')
  }

  if (brief.executionPolicy?.integrationGate !== 'ready-to-generate') {
    throw new Error(
      `Project page task gate is not ready for non-typical generation: ${brief.executionPolicy?.pageTaskGateStatus || 'unknown'}`
    )
  }

  const targetBusinessPath = normalizeRelativePath(
    normalizeNonTypicalTargetBusinessPath(
      brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
    )
  )
  const destDir = ensureDestIsSafe(targetRoot, targetBusinessPath)

  const coordinationPatternId =
    brief.nonTypicalExecutionBrief.coordinationPattern?.coordinationPatternId ||
    brief.nonTypicalExecutionBrief.coordinationBindings?.coordinationPatternId ||
    ''

  if (!['process-stage-sync', 'selection-detail-sync'].includes(coordinationPatternId)) {
    throw new Error(`Unsupported non-typical coordination pattern for generator: ${coordinationPatternId}`)
  }

  if (brief.nonTypicalExecutionBrief.decisionPackage?.dataShape?.chartUsage === 'primary') {
    throw new Error(
      'Primary chart-driven non-typical pages are not supported by the current experimental family generator'
    )
  }

  const primitivesImportPath = ensureRelativeImportPath(
    stripScriptModuleExtension(
      path.posix.relative(
        targetBusinessPath,
        normalizeRelativePath('src/runtime/non-typical-primitives/index.tsx')
      )
    ).replace(/\/index$/, '')
  )

  const pageContent =
    coordinationPatternId === 'process-stage-sync'
      ? buildProcessStageSyncPageContent({ brief, primitivesImportPath })
      : buildSelectionDetailSyncPageContent({ brief, primitivesImportPath })
  const normalizedPageContent = ensureRouteMountablePageExport(
    pageContent,
    {
      routeMountable: true,
      namedPageExportRequired: true,
      defaultExportRequired: true,
      namedPageExportPattern: '*Page',
    },
    { sourceLabel: 'generated non-typical page source' }
  )

  const pageFiles = [
    {
      sourcePath: toGeneratedSourceTag(`non-typical-page:${coordinationPatternId}`),
      destPath: path.join(destDir, 'index.tsx'),
      content: normalizedPageContent,
    },
    {
      sourcePath: toGeneratedSourceTag('non-typical-page:style'),
      destPath: path.join(destDir, 'index.module.scss'),
      content: buildNonTypicalPageStyleContent(),
    },
    {
      sourcePath: toGeneratedSourceTag('non-typical-page:meta'),
      destPath: path.join(destDir, 'hiui-pagegen.meta.json'),
      content: buildNonTypicalPagegenMetaContent({ brief, targetBusinessPath }),
    },
  ]
  const plannedFiles = annotateGeneratedArtifacts([
    ...(await collectRuntimePrimitiveFiles({ skillRoot, targetRoot })),
    ...(await collectPageOwnedSupportFiles({ skillRoot, destDir })),
    ...pageFiles,
  ])

  const metadataFile = plannedFiles.find((file) => path.basename(file.destPath) === 'hiui-pagegen.meta.json')
  if (metadataFile) {
    metadataFile.content = buildNonTypicalPagegenMetaContent({
      brief,
      targetBusinessPath,
      plannedFiles: plannedFiles.filter((file) => file !== metadataFile),
    })
  }

  return plannedFiles
}

export async function materializeNonTypicalPageFiles({
  skillRoot,
  targetRoot,
  brief,
  force = false,
  dryRun = false,
}) {
  const plannedFiles = await planNonTypicalPageFiles({ skillRoot, targetRoot, brief })
  const sanityViolations = collectNonTypicalPageSanityViolations({ plannedFiles, brief })
  if (sanityViolations.length > 0) {
    throw new Error(`Non-typical page sanity failed: ${sanityViolations.join('; ')}`)
  }
  const conflicts = await collectConflictingExistingFiles(plannedFiles)

  if (conflicts.length > 0 && !force) {
    throw new Error(
      `Destination files already exist for non-typical generation. Use --force only after review: ${conflicts
        .map((file) => file.destPath)
        .join(', ')}`
    )
  }

  if (!dryRun) {
    for (const file of plannedFiles) {
      await fs.mkdir(path.dirname(file.destPath), { recursive: true })
      await fs.writeFile(file.destPath, file.content, 'utf8')
    }
  }

  return {
    status: dryRun ? 'planned' : 'written',
    dryRun,
    files: plannedFiles.map((file) => ({
      sourcePath: file.sourcePath,
      destPath: file.destPath,
      artifactClass: file.artifactClass || '',
    })),
    sanity: {
      status: 'pass',
      violations: [],
    },
    coordinationPatternId:
      brief.nonTypicalExecutionBrief.coordinationPattern?.coordinationPatternId ||
      brief.nonTypicalExecutionBrief.coordinationBindings?.coordinationPatternId ||
      '',
    targetBusinessPath:
      normalizeNonTypicalTargetBusinessPath(
        brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
      ),
  }
}
