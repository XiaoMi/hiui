#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import { loadArchetypeDefinition } from './lib/archetypes/load-archetype-manifest.mjs'
import {
  loadRulesOnlyPageContracts,
  normalizeContractPath,
} from './lib/rules-only-page-contracts.mjs'
import {
  classifyTypicalPageTargetPath,
  getTypicalPageReuseBlockingReason,
} from './lib/typical-page-route-ownership.mjs'
import {
  getEditableSlotsForPageType,
  getLockedRegionsForPageType,
  getMoldIdForPageType,
  getSlotManifestForPageType,
} from './lib/page-mold-registry.mjs'
import {
  isPageComponentCertificationValid,
  isPageComponentCertified,
  listPageComponentsForModeAndPageType,
  loadPageComponentCertification,
  supportedModesForPageComponent,
} from './lib/page-component-registry.mjs'
import { resolveRuntimeBridgeProfileForComponent } from './lib/runtime-bridge-profile-registry.mjs'
import { getAdapterRegistryEntry } from './lib/adapter-registry.mjs'
import { buildProjectCapabilities } from './lib/asset-control-surface.mjs'

const CONTRACT_VERSION = 4
const LIST_SHELL_PAGE_TYPES = new Set([
  'table-basic',
  'table-stat',
  'tree-table',
  'data-visualization',
])

const SLOT_FAST_PATH_PAGE_TYPES = new Set([
  'table-basic',
  'table-stat',
  'tree-table',
  'tree-split',
  'drawer-form',
  'drawer-detail',
  'feedback-status',
  'full-page-edit',
  'full-page-detail',
])

const ANALYTICS_PAGE_TYPES = new Set(['data-visualization'])
const TABLE_RECIPE_PAGE_TYPES = new Set(['table-basic', 'table-stat', 'tree-table'])
const SPLIT_RECIPE_PAGE_TYPES = new Set(['tree-split'])
const EDIT_RECIPE_PAGE_TYPES = new Set(['drawer-form', 'drawer-detail', 'full-page-edit', 'full-page-detail'])
const FEEDBACK_RECIPE_PAGE_TYPES = new Set(['feedback-status'])

const EXPLICIT_I18N_PATTERN = /\b(i18n|locale|locales|translation|translations|translate|translated|multilingual|multi-language|internationali[sz]ation|rtl|l10n|english)\b|国际化|多语言|本地化|翻译|双语|英文|英语|阿拉伯|从右到左/i

const HIGH_RISK_TRANSLATION_MAP_PAGE_TYPES = new Set([
  'table-stat',
  'tree-split',
  'drawer-form',
  'drawer-detail',
  'full-page-edit',
  'full-page-detail',
])

const TEMPLATE_START_MODES = new Set([
  'rules-only',
  'legacy-host-compatible',
  'host-integration',
])

const PAGE_TYPE_ROLE_HINTS = {
  'table-basic': {
    role: 'browse',
    label: '列表查询',
    primaryExpression: 'table',
  },
  'table-stat': {
    role: 'analyze-list',
    label: '统计列表',
    primaryExpression: 'metrics-table',
  },
  'data-visualization': {
    role: 'analyze',
    label: '数据分析',
    primaryExpression: 'charts',
  },
  'tree-table': {
    role: 'hierarchy-browse',
    label: '树形表格',
    primaryExpression: 'tree-table',
  },
  'tree-split': {
    role: 'hierarchy-split',
    label: '左树右表',
    primaryExpression: 'tree-table-split',
  },
  'drawer-form': {
    role: 'edit',
    label: '抽屉表单',
    primaryExpression: 'form',
  },
  'drawer-detail': {
    role: 'inspect',
    label: '抽屉详情',
    primaryExpression: 'descriptions',
  },
  'feedback-status': {
    role: 'feedback',
    label: '异常反馈',
    primaryExpression: 'result',
  },
  'full-page-edit': {
    role: 'edit',
    label: '全页编辑',
    primaryExpression: 'form',
  },
  'full-page-detail': {
    role: 'inspect',
    label: '全页详情',
    primaryExpression: 'descriptions',
  },
}

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/plan-page-task.mjs" --change <text> [--page-type <page-type-id>] [--mode <auto|rules-only|host-integration|legacy-host-compatible|host-compatible>] [--delivery-level <auto|A|B|C>] [--target <project-root>] [--page <relative-page-path>] [--json]

Notes:
  - This is the machine planning entry for page-related work.
  - It does not implement the page; it returns task level, routing facts, required docs, required commands, contract fields, and blocking reasons.
`)
}

function parseMajorVersion(spec) {
  const match = String(spec || '').match(/(\d+)/)
  return match ? Number(match[1]) : 0
}

async function readTargetPackageJson(targetRoot) {
  try {
    return JSON.parse(await fs.readFile(path.join(targetRoot, 'package.json'), 'utf8'))
  } catch {
    return null
  }
}

function normalizeModeId(mode) {
  const value = String(mode || '').trim()
  if (value === 'host-compatible') return 'legacy-host-compatible'
  if (['host-integration', 'rules-only', 'legacy-host-compatible'].includes(value)) return value
  return ''
}

function parseBootstrapSummaryMode(raw) {
  const modeMatch = String(raw || '').match(/^- mode:\s*(\S+)/m)
  const recommendedModeMatch = String(raw || '').match(/^- recommended mode:\s*(\S+)/m)
  return normalizeModeId(modeMatch?.[1]) || normalizeModeId(recommendedModeMatch?.[1])
}

async function readProjectModeFact(targetRoot) {
  const lockPath = path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'project-mode.json')
  try {
    const lock = JSON.parse(await fs.readFile(lockPath, 'utf8'))
    const id = normalizeModeId(lock.mode || lock.id)
    if (id) {
      return {
        id,
        source: 'project-lock',
        factPath: '.local-context/hiui-design/outputs/project-mode.json',
      }
    }
  } catch {
    // Project mode locks are optional for older installs; fall through to bootstrap summaries.
  }

  const bootstrapSummaryPaths = [
    path.join(targetRoot, 'src', 'typical-page-reuse', 'BOOTSTRAP_SUMMARY.md'),
    path.join(targetRoot, '.local-context', 'hiui-design', 'BOOTSTRAP_SUMMARY.md'),
  ]

  for (const summaryPath of bootstrapSummaryPaths) {
    try {
      const raw = await fs.readFile(summaryPath, 'utf8')
      const id = parseBootstrapSummaryMode(raw)
      if (id) {
        return {
          id,
          source: 'bootstrap-summary',
          factPath: path.relative(targetRoot, summaryPath),
        }
      }
    } catch {
      // Older or reference-only installs may not have a bootstrap summary in this location.
    }
  }

  return null
}

async function readExistingPageFact(targetRoot, pagePath) {
  const normalizedPagePath = normalizeContractPath(targetRoot, pagePath)
  if (!normalizedPagePath) {
    return null
  }

  const absPagePath = path.join(targetRoot, normalizedPagePath)
  const pageExists = await fs
    .access(absPagePath)
    .then(() => true)
    .catch(() => false)
  const sourceRaw = pageExists
    ? await fs.readFile(absPagePath, 'utf8').catch(() => '')
    : ''
  const sourcePageTypeId =
    sourceRaw.match(/data-hiui5-page-type=["']([^"']+)["']/)?.[1] ||
    sourceRaw.match(/hiui-design page-type:\s*([^\s*]+)/)?.[1] ||
    ''
  let existingContract = null

  try {
    const contractsResult = await loadRulesOnlyPageContracts(targetRoot)
    existingContract =
      contractsResult.contracts.find(
        (entry) => entry?.contract?.generatedPagePath === normalizedPagePath
      )?.contract || null
  } catch {
    existingContract = null
  }

  return {
    page: normalizedPagePath,
    exists: pageExists,
    routeOwnership: classifyTypicalPageTargetPath(normalizedPagePath),
    sourcePageTypeId,
    contract: existingContract
      ? {
          pageTypeId: String(existingContract.pageTypeId || '').trim(),
          workflowStatus: String(existingContract.workflow?.status || '').trim(),
          preflightStatus: String(existingContract.workflow?.preflightStatus || '').trim(),
        }
      : null,
  }
}

function inferMode(pkg, hostProfile, requestedMode, projectModeFact = null) {
  if (requestedMode && requestedMode !== 'auto') {
    if (requestedMode === 'host-compatible') {
      return {
        id: 'legacy-host-compatible',
        source: 'explicit-alias:host-compatible',
      }
    }

    return { id: requestedMode, source: 'explicit' }
  }

  if (projectModeFact?.id) {
    return {
      id: projectModeFact.id,
      source: projectModeFact.source,
      factPath: projectModeFact.factPath,
      confirmed: true,
    }
  }

  const dependencies = {
    ...(pkg?.dependencies ?? {}),
    ...(pkg?.devDependencies ?? {}),
    ...(pkg?.peerDependencies ?? {}),
  }
  const reactMajor = parseMajorVersion(dependencies.react)
  const reactDomMajor = parseMajorVersion(dependencies['react-dom'])
  const hiuiMajor = parseMajorVersion(dependencies['@hi-ui/hiui'])
  const hasHiui5Alias = Boolean(dependencies.hiui5)

  if (
    (reactMajor > 0 && reactMajor < 18) ||
    (reactDomMajor > 0 && reactDomMajor < 18) ||
    (hasHiui5Alias && hiuiMajor > 0 && hiuiMajor < 5)
  ) {
    return { id: 'legacy-host-compatible', source: 'detected-dependencies' }
  }

  return {
    id: hostProfile?.recommendedMode || 'rules-only',
    source: hostProfile?.recommendedMode ? 'host-profile' : 'default',
  }
}

function inferTaskLevel(changeText, pageTypeId) {
  const text = String(changeText || '').toLowerCase()
  const hasCreateIntent = /(新增|新建|生成|创建|添加.*页面|重构|rearchitecture|redesign|route)/i.test(text)
  const hasStructuralChange = /(页壳|ownership|source marker|marker|依赖|路由|样式入口|宿主|滚动|scroll|provider|portal)/i.test(text)
  const isMinor =
    /(文案|copy|rename|改名|列名|颜色|间距|icon|图标|微调|修复|修改|调整|改成|替换|更新|标题|按钮文案|字段文案)/i.test(text) &&
    !hasCreateIntent &&
    !hasStructuralChange

  if (isMinor) {
    return { id: 'minor-edit', source: 'inferred-from-change' }
  }

  if (pageTypeId || hasCreateIntent || /(页面|route)/i.test(text)) {
    return { id: 'new-page-or-rearchitecture', source: 'inferred-from-change' }
  }

  return { id: 'managed-page-change', source: 'default' }
}

function dependencyNames(pkg) {
  return new Set(
    Object.keys({
      ...(pkg?.dependencies ?? {}),
      ...(pkg?.devDependencies ?? {}),
      ...(pkg?.peerDependencies ?? {}),
    })
  )
}

function inferI18nMode(changeText, pkg) {
  const text = String(changeText || '')
  if (EXPLICIT_I18N_PATTERN.test(text)) {
    return {
      id: 'full',
      source: 'explicit-change-request',
      reason: 'change request explicitly mentions i18n, locale, translation, language, or RTL requirements',
    }
  }

  const deps = dependencyNames(pkg)
  if (
    deps.has('i18next') ||
    deps.has('react-i18next') ||
    deps.has('react-intl') ||
    deps.has('react-intl-universal') ||
    deps.has('vue-i18n')
  ) {
    return {
      id: 'none',
      source: 'detected-project-i18n-runtime-without-explicit-request',
      reason: 'project has i18n runtime, but no explicit multilingual request was made; skip i18n flow',
    }
  }

  return {
    id: 'none',
    source: 'default-no-explicit-i18n',
    reason: 'no explicit i18n, locale, translation, language, or RTL requirement detected',
  }
}

function hasSpecialFastPathRequirement(changeText) {
  return /(特殊布局|非典型|跨页型|组合页|复杂图表|新增图表|图表组合|chart section|权限|状态流|批量|导入|导出|审核流|国际化验收|locale 验收|rtl|i18n|多语言|英文|英语|english)/i.test(
    String(changeText || '')
  )
}

function hasFormalAcceptanceRequirement(changeText) {
  return /(正式验收|发布验收|全量\s*gate|source-?gate|doctor|finalize|提测|发布|合入|不要.*warning|无.*warning|no[- ]?warning)/i.test(
    String(changeText || '')
  )
}

function inferDeliveryLevel({ changeText, deliveryLevel, fastPath, pageTypeId, pageUnits = [], taskLevel, topology }) {
  const text = String(changeText || '')
  const requested = String(deliveryLevel || 'auto').toUpperCase()
  const pageTypeIds = pageUnits.length > 0
    ? pageUnits.map((unit) => unit.pageType.id).filter(Boolean)
    : [pageTypeId].filter(Boolean)
  const hasDataVisualization = pageTypeIds.includes('data-visualization')
  const hasStrictTopology = ['single-page-composite', 'non-typical-overlay'].includes(topology?.id || '')

  if (requested === 'C' || hasFormalAcceptanceRequirement(text)) {
    return {
      id: 'C',
      label: '严格生成',
      source: requested === 'C' ? 'explicit-cli' : 'formal-acceptance-overlay',
      reason: 'formal acceptance or strict gate requirement was requested',
    }
  }

  if (hasStrictTopology) {
    return {
      id: 'C',
      label: '严格生成',
      source: 'topology',
      reason: 'non-typical or composite structure requires strict structural gates',
    }
  }

  if (taskLevel.id === 'minor-edit' || requested === 'B' || hasDataVisualization) {
    return {
      id: 'B',
      label: '标准生成',
      source: hasDataVisualization ? 'page-type:data-visualization' : requested === 'B' ? 'explicit-cli' : 'taskLevel',
      reason: hasDataVisualization
        ? 'data-visualization uses the visualization shell and chart governance instead of ordinary slot fast path'
        : 'existing typical-page or standard local edit',
    }
  }

  if (
    taskLevel.id === 'new-page-or-rearchitecture' &&
    fastPath.eligible &&
    pageTypeIds.length > 0 &&
    pageTypeIds.every((id) => SLOT_FAST_PATH_PAGE_TYPES.has(id))
  ) {
    return {
      id: 'A',
      label: '快速链路',
      source: 'page-type:slot-typical',
      reason: 'new slot-based typical page can be generated by replacing business slots',
    }
  }

  if (requested === 'A' && fastPath.eligible) {
    return {
      id: 'A',
      label: '快速链路',
      source: 'explicit-cli-with-slot-fast-path',
      reason: 'explicit fast request is allowed because the structural class supports slot fast path',
    }
  }

  return {
    id: 'B',
    label: '标准生成',
    source: 'default',
    reason: 'normal managed page generation',
  }
}

function acceptanceLevelForDeliveryLevel(deliveryLevel) {
  if (deliveryLevel.id === 'C') return 'formal'
  if (deliveryLevel.id === 'B') return 'standard'
  return 'preview'
}

function acceptanceReasonsForDeliveryLevel(deliveryLevel) {
  const source = deliveryLevel.source === 'formal-acceptance-overlay' || deliveryLevel.source === 'explicit-cli'
    ? 'user-intent'
    : deliveryLevel.source === 'topology' || deliveryLevel.source.startsWith('page-type:')
      ? 'task-risk'
      : 'plan-action'

  return [
    {
      source,
      reason: deliveryLevel.reason,
    },
  ]
}

function acceptanceProfileForDeliveryLevel(deliveryLevel, formalAcceptanceCommands) {
  const level = acceptanceLevelForDeliveryLevel(deliveryLevel)
  const profile = {
    level,
    source: deliveryLevel.source,
    reason: deliveryLevel.reason,
    formalRequired: level === 'formal',
    defaultActions: [],
    finalReportSections: ['pageStatus', 'preflightStatus', 'usageStatsStatus'],
  }

  if (level === 'formal') {
    profile.defaultActions = formalAcceptanceCommands.map((command) => command.script)
    profile.finalReportSections.splice(2, 0, 'formalAcceptanceStatus')
  }

  return profile
}

function usageStatsCommand({ deliveryLevel, taskLevel }) {
  return {
    script: 'typical-page:preview-ready',
    args: ['--page <new-page>', '--url <url>', '--report-mode <mode>', '--prompt <prompt>'],
    when: deliveryLevel.id === 'A'
      ? 'before final response after the fast-path page reaches preview_ready; maintainer/internal builds must still close usage stats for newly generated pages'
      : 'before final response after a renderable page preview exists',
    required: taskLevel.id !== 'minor-edit',
  }
}

function appendRequiredUsageStatsCommand(commands, { deliveryLevel, taskLevel }) {
  if (taskLevel.id === 'minor-edit') return commands
  if (commands.some((command) => command.script === 'typical-page:preview-ready')) return commands
  return [...commands, usageStatsCommand({ deliveryLevel, taskLevel })]
}

function finalReportContractForAcceptanceProfile(acceptanceProfile) {
  const formalRequired = Boolean(acceptanceProfile.formalRequired)
  const sections = Array.isArray(acceptanceProfile.finalReportSections)
    ? acceptanceProfile.finalReportSections
    : ['pageStatus', 'preflightStatus', 'usageStatsStatus']
  const statusFields = {
    pageStatus: ['not_started', 'generated', 'modified', 'blocked', 'failed'],
    preflightStatus: ['not_run', 'passed', 'failed', 'invalid'],
    usageStatsStatus: [
      'completed',
      'skipped',
      'requires_authorization',
      'failed_retryable',
      'failed_non_retryable',
    ],
  }

  if (sections.includes('formalAcceptanceStatus')) {
    statusFields.formalAcceptanceStatus = formalRequired
      ? ['not_run', 'passed', 'failed']
      : ['not_requested']
  }

  return {
    schemaVersion: 'final-report-contract.v1',
    sections,
    requiredStatusFields: sections.filter((section) => Object.hasOwn(statusFields, section)),
    statusFields,
    requiredEvidence: ['executedActions', 'changedFiles', 'validationCommands'],
    riskFields: ['blockingIssues', 'warnings', 'nextActions'],
    rules: [
      'Do not report formalAcceptanceStatus as passed unless formalAcceptanceActions were executed successfully.',
      'Do not hide preflight warnings or blockingIssues.',
      'Do not let usageStatsStatus failure override passed page/preflight status unless the page itself is not renderable.',
      'For every non-completed usageStatsStatus, include a concrete next action.',
    ],
  }
}

function hasNonTypicalPositiveEvidence(changeText) {
  return /(非典型|特殊布局|自定义.*工作台|自由编排|自由布局|无法套用典型|复杂工作台|多区块工作台|工作台.*多区块|工作台.*自由|运营工作台.*包含)/i.test(
    String(changeText || '')
  )
}

function hasTypicalOverlayEvidence(changeText) {
  const text = String(changeText || '')
  return (
    /(基础上|页面内|页内|详情页中|详情页内|列表页中|列表页内|嵌入|叠加|加上|增加|加入|新增|补充).{0,24}(图表|折线图|趋势|分析|详情|时间线|左侧|右侧|面板|分栏|区块|工作台)/i.test(text) ||
    /(图表|折线图|趋势|分析|详情|时间线|左侧|右侧|面板|分栏|区块|工作台).{0,24}(基础上|页面内|页内|详情页中|详情页内|列表页中|列表页内|嵌入|叠加|加上|增加|加入|新增|补充)/i.test(text)
  )
}

function hasInPageCompositeEvidence(changeText) {
  return /(一个页面内|同屏|左侧.*右侧|右侧.*左侧|主从|联动|split|左右分栏|左列表右详情|左树右表)/i.test(
    String(changeText || '')
  )
}

function hasTreeSplitBaselineEvidence(changeText) {
  return /(左树右表|tree[-\s]?split|树.*表|组织树.*表|类目树.*表|部门树.*表|左侧.*树.*右侧.*(列表|表格)|右侧.*(列表|表格).*左侧.*树)/i.test(
    String(changeText || '')
  )
}

function hasRowActionDetailEvidence(changeText) {
  return /(行操作|操作列|表格操作|列表操作).{0,12}(查看详情|详情)/i.test(
    String(changeText || '')
  )
}

function hasParallelPageIntentEvidence(changeText) {
  const text = String(changeText || '')
  return (
    /(同时|并且|另外|另加|再加|以及|和|、).{0,24}(列表页|列表|表格页|统计页|看板页|详情页|详情|编辑页|表单页|评审页|审核页|异常页|空状态)/i.test(text) ||
    /(列表页|列表|表格页|统计页|看板页|详情页|详情|编辑页|表单页|评审页|审核页|异常页|空状态).{0,24}(同时|并且|另外|另加|再加|以及|和|、).{0,24}(列表页|列表|表格页|统计页|看板页|详情页|详情|编辑页|表单页|评审页|审核页|异常页|空状态)/i.test(text)
  )
}

function createIntentUnit({ id, label, pageTypeId, primaryExpression, role, source }) {
  return {
    id,
    role,
    label,
    primaryExpression,
    candidatePageTypes: [pageTypeId],
    source,
  }
}

function addIntentUnit(units, unit) {
  if (units.some((item) => item.role === unit.role && item.candidatePageTypes[0] === unit.candidatePageTypes[0])) {
    return
  }

  units.push(unit)
}

function shouldInferAdditionalIntentsWithExplicitPageType(changeText) {
  const text = String(changeText || '')
  return (
    hasInPageCompositeEvidence(text) ||
    hasParallelPageIntentEvidence(text)
  )
}

function inferIntentUnits(changeText, explicitPageTypeId = '') {
  const text = String(changeText || '')
  const units = []

  if (explicitPageTypeId) {
    const hint = PAGE_TYPE_ROLE_HINTS[explicitPageTypeId] || {
      role: 'typical',
      label: explicitPageTypeId,
      primaryExpression: 'typical-page',
    }
    addIntentUnit(
      units,
      createIntentUnit({
        id: hint.role,
        role: hint.role,
        label: hint.label,
        pageTypeId: explicitPageTypeId,
        primaryExpression: hint.primaryExpression,
        source: 'explicit-page-type',
      })
    )

    if (!shouldInferAdditionalIntentsWithExplicitPageType(text)) {
      return units
    }

    if (
      explicitPageTypeId === 'tree-split' &&
      hasTreeSplitBaselineEvidence(text) &&
      !/(详情|编辑|表单|图表|看板|时间线|异常|空状态|审批|评审)/i.test(text)
    ) {
      return units
    }
  }

  if (/(左树右表|树.*表|组织树.*表|类目树.*表|部门树.*表)/i.test(text)) {
    addIntentUnit(
      units,
      createIntentUnit({
        id: 'hierarchy-split',
        role: 'hierarchy-split',
        label: '层级导航与表格',
        pageTypeId: 'tree-split',
        primaryExpression: 'tree-table-split',
        source: 'inferred-from-hierarchy-split-intent',
      })
    )
  } else if (/(树形表格|树表|层级表格|组织架构表|类目表格)/i.test(text)) {
    addIntentUnit(
      units,
      createIntentUnit({
        id: 'hierarchy-browse',
        role: 'hierarchy-browse',
        label: '树形表格',
        pageTypeId: 'tree-table',
        primaryExpression: 'tree-table',
        source: 'inferred-from-hierarchy-table-intent',
      })
    )
  }

  if (/(数据看板|可视化|图表看板|分析看板|趋势分析|经营看板)/i.test(text)) {
    addIntentUnit(
      units,
      createIntentUnit({
        id: 'analyze',
        role: 'analyze',
        label: '数据分析',
        pageTypeId: 'data-visualization',
        primaryExpression: 'charts',
        source: 'inferred-from-analysis-intent',
      })
    )
  } else if (/(数据统计表|统计列表|统计页|统计表|指标列表|指标卡.*表格|统计指标.*表格)/i.test(text)) {
    addIntentUnit(
      units,
      createIntentUnit({
        id: 'analyze-list',
        role: 'analyze-list',
        label: '统计列表',
        pageTypeId: 'table-stat',
        primaryExpression: 'metrics-table',
        source: 'inferred-from-stat-list-intent',
      })
    )
  }

  if (/(列表页|列表|表格页|查询页|清单页|台账|管理列表|表格管理)/i.test(text)) {
    addIntentUnit(
      units,
      createIntentUnit({
        id: 'browse',
        role: 'browse',
        label: '列表查询',
        pageTypeId: 'table-basic',
        primaryExpression: 'table',
        source: 'inferred-from-browse-intent',
      })
    )
  }

  if (/(抽屉详情|侧滑详情|侧边详情)/i.test(text)) {
    addIntentUnit(
      units,
      createIntentUnit({
        id: 'inspect',
        role: 'inspect',
        label: '抽屉详情',
        pageTypeId: 'drawer-detail',
        primaryExpression: 'descriptions',
        source: 'inferred-from-drawer-detail-intent',
      })
    )
  } else if (
    (/(详情页|详情信息页|详情查看页|查看.*详情页|只读详情|分组详情)/i.test(text) ||
      (hasParallelPageIntentEvidence(text) && /详情/.test(text)) ||
      (hasInPageCompositeEvidence(text) && /详情/.test(text))) &&
    !hasRowActionDetailEvidence(text)
  ) {
    addIntentUnit(
      units,
      createIntentUnit({
        id: 'inspect',
        role: 'inspect',
        label: '详情查看',
        pageTypeId: 'full-page-detail',
        primaryExpression: 'descriptions',
        source: 'inferred-from-detail-intent',
      })
    )
  }

  if (/(抽屉表单|侧滑表单|侧边表单|抽屉新建|抽屉编辑|侧滑新建|侧滑编辑)/i.test(text)) {
    addIntentUnit(
      units,
      createIntentUnit({
        id: 'edit',
        role: 'edit',
        label: '抽屉表单',
        pageTypeId: 'drawer-form',
        primaryExpression: 'form',
        source: 'inferred-from-drawer-form-intent',
      })
    )
  } else if (/(编辑页|新建页|创建页|修改页|配置页|表单页|处理页|评审页|审核页|审批处理页)/i.test(text)) {
    addIntentUnit(
      units,
      createIntentUnit({
        id: 'edit',
        role: 'edit',
        label: '编辑处理',
        pageTypeId: 'full-page-edit',
        primaryExpression: 'form',
        source: 'inferred-from-edit-intent',
      })
    )
  }

  if (/(异常反馈|无权限|无数据|加载失败|404|500|建设中|空状态)/i.test(text)) {
    addIntentUnit(
      units,
      createIntentUnit({
        id: 'feedback',
        role: 'feedback',
        label: '异常反馈',
        pageTypeId: 'feedback-status',
        primaryExpression: 'result',
        source: 'inferred-from-feedback-intent',
      })
    )
  }

  return units
}

function inferTopology({ changeText, explicitPageTypeId, intentUnits }) {
  if (hasNonTypicalPositiveEvidence(changeText)) {
    return {
      id: 'non-typical-overlay',
      source: 'positive-non-typical-evidence',
      confidence: 'high',
      reason: 'explicit custom/non-typical layout evidence',
    }
  }

  const treeSplitBaselineRoles = new Set(['hierarchy-split', 'browse'])
  const isExplicitTreeSplitBaseline =
    explicitPageTypeId === 'tree-split' &&
    intentUnits.length > 0 &&
    intentUnits.every((unit) => treeSplitBaselineRoles.has(unit.role)) &&
    hasTreeSplitBaselineEvidence(changeText)

  if (
    explicitPageTypeId &&
    !isExplicitTreeSplitBaseline &&
    (hasInPageCompositeEvidence(changeText) ||
      (explicitPageTypeId !== 'data-visualization' && hasTypicalOverlayEvidence(changeText)))
  ) {
    return {
      id: 'non-typical-overlay',
      source: 'explicit-page-type-with-overlay-evidence',
      confidence: 'high',
      reason: 'explicit page type is used as the base shell while the request adds in-page overlay sections',
    }
  }

  if (hasInPageCompositeEvidence(changeText) && intentUnits.length > 1) {
    return {
      id: 'single-page-composite',
      source: 'inferred-from-in-page-layout-evidence',
      confidence: 'medium',
      reason: 'multiple intents are requested inside one screen or linked split layout',
    }
  }

  if (intentUnits.length > 1) {
    return {
      id: 'multi-page-workflow',
      source: 'inferred-from-parallel-page-intents',
      confidence: 'high',
      reason: 'multiple page intents are listed without same-screen layout evidence',
    }
  }

  if (intentUnits.length === 1) {
    return {
      id: 'single-typical-page',
      source: explicitPageTypeId ? 'explicit-page-type' : 'inferred-from-page-intent',
      confidence: explicitPageTypeId ? 'high' : 'medium',
      reason: explicitPageTypeId ? 'explicit page type was provided' : 'one typical page intent was inferred',
    }
  }

  return {
    id: 'unresolved',
    source: 'insufficient-page-intent-evidence',
    confidence: 'low',
    reason: 'no stable typical page intent or positive non-typical evidence was found',
  }
}

function intentUnitsToPageUnits({ intentUnits, manifest }) {
  return intentUnits.map((unit, index) => {
    const pageTypeId = unit.candidatePageTypes[0] || ''
    const pageType = manifest.pageTypes.find((item) => item.id === pageTypeId)

    return {
      id: unit.id || `page-${index + 1}`,
      role: unit.role,
      label: unit.label,
      pageType: {
        id: pageType?.id || pageTypeId,
        label: pageType?.label || '',
        source: unit.source,
      },
      primaryExpression: unit.primaryExpression,
      candidatePageTypes: unit.candidatePageTypes,
      canUseFastPath: Boolean(pageType) && SLOT_FAST_PATH_PAGE_TYPES.has(pageType.id),
    }
  })
}

async function attachStartFromToPageUnits({ mode, pageUnits, skillRoot }) {
  return Promise.all(
    pageUnits.map(async (unit) => {
      if (!unit.pageType.id) {
        return unit
      }

      const pageType = {
        id: unit.pageType.id,
        label: unit.pageType.label,
        assetExamplePath: '',
        examplePath: '',
      }

      let archetype = null
      try {
        archetype = await loadArchetypeDefinition({ skillRoot, pageTypeId: unit.pageType.id })
      } catch {
        // Keep the unit usable; unknown archetype is handled by canUseFastPath/blocking logic.
      }

      const templatePath = await resolveTemplatePath({
        mode,
        pageTypeId: unit.pageType.id,
        skillRoot,
      })

      return {
        ...unit,
        startFrom: inferStartFrom({
          archetype,
          mode,
          pageType,
          templatePath,
        }),
      }
    })
  )
}

function summarizePageComponentCandidate(component, certification = null, { effectiveMode = '' } = {}) {
  const supportedModes = supportedModesForPageComponent(component)
  return {
    componentId: component.componentId,
    pageTypeId: component.pageTypeId,
    baseMoldId: component.baseMoldId,
    mode: component.mode,
    effectiveMode: effectiveMode || component.mode,
    supportedModes,
    status: component.status,
    certificationStatus: component.certificationStatus,
    certificationRef: component.certificationRef || '',
    certificationAvailable: isPageComponentCertificationValid(component, certification),
    available: isPageComponentCertified(component, certification),
    registryKind: component.__registryKind || 'skill-global',
    projectOverlay: component.__registryKind === 'project-overlay',
    fallbackPolicy: component.fallbackPolicy,
    adapterIds: Array.isArray(component.adapterIds) ? component.adapterIds : [],
    legacyRuntimeAdapterSupport: component.legacyRuntimeAdapterSupport || null,
    supportedExtensionLevels: Array.isArray(component.supportedExtensionLevels)
      ? component.supportedExtensionLevels
      : [],
    allowedExtensions: Array.isArray(component.allowedExtensions) ? component.allowedExtensions : [],
  }
}

function runtimeAdapterProofForComponent({ component, hostFamilyGate, mode, skillRoot }) {
  if (mode !== 'legacy-host-compatible') return null

  const support = component?.legacyRuntimeAdapterSupport || null
  const adapterId = support?.defaultAdapterId || component?.adapterIds?.[0] || ''
  const adapter = adapterId ? getAdapterRegistryEntry(adapterId, { skillRoot }) : null
  const requiredCapabilities = Array.isArray(support?.requiredAdapterCapabilities)
    ? support.requiredAdapterCapabilities
    : []
  const allowedResponsibilities = Array.isArray(adapter?.allowedResponsibilities)
    ? adapter.allowedResponsibilities
    : []
  const missingCapabilities = requiredCapabilities.filter(
    (capability) => !allowedResponsibilities.includes(capability)
  )

  if (!support) {
    return {
      required: true,
      status: 'blocked',
      kind: 'legacy-runtime-adapter',
      adapterId,
      responsibility: adapter?.responsibility || '',
      reason: 'page component does not declare legacy runtime adapter support',
      missingCapabilities,
    }
  }

  if (!adapter) {
    return {
      required: true,
      status: 'blocked',
      kind: support.adapterKind || 'legacy-runtime-adapter',
      adapterId,
      responsibility: '',
      reason: `legacy runtime adapter ${adapterId || '(missing)'} is not registered`,
      missingCapabilities,
    }
  }

  if (!hostFamilyGate.allowed) {
    return {
      required: true,
      status: 'blocked',
      kind: support.adapterKind || adapter.kind || 'legacy-runtime-adapter',
      adapterId,
      responsibility: adapter.responsibility || 'runtime-bridge-only',
      reason: hostFamilyGate.reason,
      missingCapabilities,
    }
  }

  if (missingCapabilities.length > 0) {
    return {
      required: true,
      status: 'blocked',
      kind: support.adapterKind || adapter.kind || 'legacy-runtime-adapter',
      adapterId,
      responsibility: adapter.responsibility || 'runtime-bridge-only',
      reason: 'legacy runtime adapter is missing required capabilities',
      missingCapabilities,
    }
  }

  return {
    required: true,
    status: 'available',
    kind: support.adapterKind || adapter.kind || 'legacy-runtime-adapter',
    adapterId,
    responsibility: adapter.responsibility || 'runtime-bridge-only',
    reason: 'legacy runtime adapter is available for the certified page component',
    missingCapabilities: [],
  }
}

function hasAvailablePageComponentCandidate(candidates) {
  return Array.isArray(candidates) && candidates.some((candidate) => candidate.available)
}

function legacyHostFamilyGate({ mode, legacyHostFamily }) {
  if (mode !== 'legacy-host-compatible') {
    return { allowed: true, reason: '', hostFamily: null }
  }

  if (legacyHostFamily?.status !== 'matched') {
    const missingFacts = Array.isArray(legacyHostFamily?.missingFacts) ? legacyHostFamily.missingFacts : []
    const missingFactsLabel = missingFacts.length > 0
      ? missingFacts.map((fact) => String(fact).replaceAll('-', ' ')).join(' and ')
      : 'legacy host family'
    const blockingReason = Array.isArray(legacyHostFamily?.blockingReasons)
      ? legacyHostFamily.blockingReasons.find(Boolean)
      : ''
    return {
      allowed: false,
      reason: blockingReason || `legacy host family is not matched; provide ${missingFactsLabel} facts before selecting a page component`,
      hostFamily: legacyHostFamily || null,
    }
  }

  return { allowed: true, reason: '', hostFamily: legacyHostFamily }
}

function summarizeLegacyHostFamilyForPlan(legacyHostFamily) {
  if (!legacyHostFamily) return null
  return {
    status: legacyHostFamily.status || '',
    hostFamilyId: legacyHostFamily.hostFamilyId || '',
    familyStatus: legacyHostFamily.familyStatus || '',
    confidence: legacyHostFamily.confidence || '',
    adapterPackId: legacyHostFamily.adapterPackId || '',
    matchedEvidence: Array.isArray(legacyHostFamily.matchedEvidence) ? legacyHostFamily.matchedEvidence : [],
    inferredFacts: legacyHostFamily.inferredFacts || {},
    missingFacts: Array.isArray(legacyHostFamily.missingFacts) ? legacyHostFamily.missingFacts : [],
    blockingReasons: Array.isArray(legacyHostFamily.blockingReasons) ? legacyHostFamily.blockingReasons : [],
  }
}

function uncertifiedProjectOverlayReason(candidates) {
  if (!Array.isArray(candidates)) return ''
  const candidate = candidates.find((item) => item?.projectOverlay && item.available === false)
  if (!candidate) return ''
  return `project-scoped carrier ${candidate.componentId} is present but not certified; do not treat it as a typical-page fallback shell before certification passes`
}

function selectPageComponentForPlan({ mode, pageTypeId, pageUnits = [], skillRoot, targetRoot, taskLevel, topology, legacyHostFamily = null }) {
  const hostFamilyGate = legacyHostFamilyGate({ mode, legacyHostFamily })
  const multiPageWorkflow = topology?.id === 'multi-page-workflow' && pageUnits.length > 0
  const multiPageTypeIds = multiPageWorkflow
    ? pageUnits.map((unit) => unit.pageType?.id).filter(Boolean)
    : []

  if (multiPageWorkflow && multiPageTypeIds.length > 0) {
    const entries = multiPageTypeIds.map((unitPageTypeId) => {
      const unitCandidates = mode && unitPageTypeId
        ? listPageComponentsForModeAndPageType({ mode, pageTypeId: unitPageTypeId, skillRoot, targetRoot })
        : []
      const unitCandidatesWithCertification = unitCandidates.map((component) => ({
        component,
        certification: loadPageComponentCertification(component, { skillRoot }),
      }))
      const unitSummarizedCandidates = unitCandidatesWithCertification.map(({ component, certification }) =>
        summarizePageComponentCandidate(component, certification, { effectiveMode: mode })
      )
      const unitSelectedEntry = hostFamilyGate.allowed
        ? unitCandidatesWithCertification.find(({ component, certification }) =>
            isPageComponentCertified(component, certification)
          ) || null
        : null

      return {
        pageTypeId: unitPageTypeId,
        selected: unitSelectedEntry?.component || null,
        candidates: unitSummarizedCandidates,
        runtimeAdapterProof: unitSelectedEntry?.component
          ? runtimeAdapterProofForComponent({
              component: unitSelectedEntry.component,
              hostFamilyGate,
              mode,
              skillRoot,
            })
          : hasAvailablePageComponentCandidate(unitSummarizedCandidates)
            ? runtimeAdapterProofForComponent({
                component: unitCandidatesWithCertification.find(({ component, certification }) =>
                  isPageComponentCertified(component, certification)
                )?.component,
                hostFamilyGate,
                mode,
                skillRoot,
              })
            : null,
      }
    })
    const selectedComponents = entries.map((entry) => entry.selected).filter(Boolean)
    const summarizedSelectedComponents = selectedComponents.map((component) => {
      const certification = loadPageComponentCertification(component, { skillRoot })
      return summarizePageComponentCandidate(component, certification, { effectiveMode: mode })
    })
    const everyUnitSelected = selectedComponents.length === multiPageTypeIds.length
    const hasAnalyticsUnit = multiPageTypeIds.some((id) => ANALYTICS_PAGE_TYPES.has(id))
    const eligibleTask = taskLevel.id === 'new-page-or-rearchitecture'

    if (everyUnitSelected && !hasAnalyticsUnit && eligibleTask) {
      const runtimeAdapterProofs = entries.map((entry) => entry.runtimeAdapterProof).filter(Boolean)
      return {
        schemaVersion: 'page-component-selection.v1',
        selected: true,
        componentId: 'page-units',
        pageTypeId: '',
        baseMoldId: 'page-units.managed-mold.v1',
        mode,
        certificationStatus: 'certified',
        certificationRef: '',
        source: 'page-component-registry',
        reason: 'certified page components are available for every page unit in this workflow',
        fallbackPolicy: 'managed-mold',
        legacyHostFamily: summarizeLegacyHostFamilyForPlan(hostFamilyGate.hostFamily),
        runtimeAdapterProof: runtimeAdapterProofs.length > 0
          ? {
              required: true,
              status: runtimeAdapterProofs.every((proof) => proof.status === 'available') ? 'available' : 'blocked',
              kind: 'legacy-runtime-adapter',
              adapterIds: runtimeAdapterProofs.map((proof) => proof.adapterId).filter(Boolean),
              reason: runtimeAdapterProofs.every((proof) => proof.status === 'available')
                ? 'legacy runtime adapters are available for every page unit'
                : 'one or more page units are missing legacy runtime adapter proof',
            }
          : null,
        components: summarizedSelectedComponents,
        candidates: entries.flatMap((entry) => entry.candidates),
      }
    }

    const blockedByRuntimeAdapter = !hostFamilyGate.allowed && entries.some((entry) =>
      hasAvailablePageComponentCandidate(entry.candidates)
    )

    return {
      schemaVersion: 'page-component-selection.v1',
      selected: false,
      componentId: '',
      pageTypeId: '',
      baseMoldId: '',
      mode,
      certificationStatus: entries.some((entry) => entry.candidates.length > 0) ? 'missing' : 'not_applicable',
      certificationRef: '',
      source: entries.some((entry) => entry.candidates.length > 0) ? 'page-component-registry' : 'no-matching-component',
      reason: !hostFamilyGate.allowed
        ? hostFamilyGate.reason
        : hasAnalyticsUnit
        ? 'data-visualization page units must use managed-analytics instead of page-component'
        : 'not every page unit has a certified page component for this mode; use managed mold or host archetype per unit',
      fallbackPolicy: entries.some((entry) =>
        entry.candidates.some((component) => component.fallbackPolicy === 'fail-closed-when-selected')
      )
        ? 'fail-closed-when-selected'
        : 'managed-mold',
      legacyHostFamily: summarizeLegacyHostFamilyForPlan(hostFamilyGate.hostFamily),
      blockedByRuntimeAdapter,
      runtimeAdapterProof: blockedByRuntimeAdapter
        ? entries.map((entry) => entry.runtimeAdapterProof).find(Boolean) || null
        : null,
      components: summarizedSelectedComponents,
      candidates: entries.flatMap((entry) => entry.candidates),
    }
  }

  const candidates = mode && pageTypeId
    ? listPageComponentsForModeAndPageType({ mode, pageTypeId, skillRoot, targetRoot })
    : []
  const candidatesWithCertification = candidates.map((component) => ({
    component,
    certification: loadPageComponentCertification(component, { skillRoot }),
  }))
  const summarizedCandidates = candidatesWithCertification.map(({ component, certification }) =>
    summarizePageComponentCandidate(component, certification, { effectiveMode: mode })
  )
  const selectedEntry = hostFamilyGate.allowed
    ? candidatesWithCertification.find(({ component, certification }) =>
        isPageComponentCertified(component, certification)
      ) || null
    : null
  const selected = selectedEntry?.component || null
  const availableCandidateEntry = candidatesWithCertification.find(({ component, certification }) =>
    isPageComponentCertified(component, certification)
  ) || null
  const projectOverlayReason = uncertifiedProjectOverlayReason(summarizedCandidates)
  const runtimeAdapterProof = selected
    ? runtimeAdapterProofForComponent({ component: selected, hostFamilyGate, mode, skillRoot })
    : availableCandidateEntry
      ? runtimeAdapterProofForComponent({
          component: availableCandidateEntry.component,
          hostFamilyGate,
          mode,
          skillRoot,
        })
      : null
  const singleTypicalPage = topology?.id === 'single-typical-page'
  const eligibleTask = taskLevel.id === 'new-page-or-rearchitecture'

  if (selected && singleTypicalPage && eligibleTask) {
    return {
      schemaVersion: 'page-component-selection.v1',
      selected: true,
      componentId: selected.componentId,
      pageTypeId: selected.pageTypeId,
      baseMoldId: selected.baseMoldId,
      mode,
      componentMode: selected.mode,
      supportedModes: supportedModesForPageComponent(selected),
      certificationStatus: selected.certificationStatus,
      certificationRef: selected.certificationRef,
      source: 'page-component-registry',
      reason: projectOverlayReason
        ? `certified page component is available for this mode and page type; ${projectOverlayReason}`
        : 'certified page component is available for this mode and page type',
      fallbackPolicy: selected.fallbackPolicy,
      legacyHostFamily: summarizeLegacyHostFamilyForPlan(hostFamilyGate.hostFamily),
      runtimeAdapterProof,
      candidates: summarizedCandidates,
    }
  }

  const blockedByRuntimeAdapter = !hostFamilyGate.allowed && hasAvailablePageComponentCandidate(summarizedCandidates)

  return {
    schemaVersion: 'page-component-selection.v1',
    selected: false,
    componentId: '',
    pageTypeId,
    baseMoldId: '',
    mode,
    certificationStatus: candidates.length > 0 ? 'missing' : 'not_applicable',
    certificationRef: '',
    source: candidates.length > 0 ? 'page-component-registry' : 'no-matching-component',
    reason: !hostFamilyGate.allowed
      ? hostFamilyGate.reason
      : projectOverlayReason
      ? `${projectOverlayReason}; use a certified page component, managed mold, or host archetype until certification passes`
      : candidates.length === 0
      ? 'no page component is registered for this mode and page type; use managed mold or host archetype'
      : singleTypicalPage && eligibleTask
        ? 'registered page component is not certified; use managed mold or host archetype until certification passes'
        : 'page component strategy only applies to new single typical pages; use the planned non-component route',
    fallbackPolicy: candidates.some((component) => component.fallbackPolicy === 'fail-closed-when-selected')
      ? 'fail-closed-when-selected'
      : 'managed-mold',
    legacyHostFamily: summarizeLegacyHostFamilyForPlan(hostFamilyGate.hostFamily),
    blockedByRuntimeAdapter,
    runtimeAdapterProof: blockedByRuntimeAdapter ? runtimeAdapterProof : null,
    candidates: summarizedCandidates,
  }
}

function runtimeBridgeCandidateComponentId(pageComponent) {
  if (pageComponent?.selected && pageComponent.componentId && pageComponent.componentId !== 'page-units') {
    return pageComponent.componentId
  }

  if (!Array.isArray(pageComponent?.candidates)) return ''
  const candidate = pageComponent.candidates.find((item) => item.available) || pageComponent.candidates[0]
  return String(candidate?.componentId || '').trim()
}

function runtimeBridgeProfileForPlan({ mode, pageComponent, skillRoot, targetRoot }) {
  if (mode !== 'legacy-host-compatible') return null
  if (pageComponent?.componentId === 'page-units') return null

  const componentId = runtimeBridgeCandidateComponentId(pageComponent)
  if (!componentId) return null

  return resolveRuntimeBridgeProfileForComponent({
    componentId,
    skillRoot,
    targetRoot,
  })
}

function usesRuntimeBridgedPageComponent({ mode, pageComponent, runtimeBridgeProfile }) {
  if (mode !== 'legacy-host-compatible') return false
  if (pageComponent?.componentId === 'page-units') return false
  return Boolean(
    pageComponent?.selected ||
    pageComponent?.blockedByRuntimeAdapter ||
    runtimeBridgeProfile?.status === 'available' ||
    runtimeBridgeProfile?.status === 'blocked'
  )
}

function extensionPolicyForPageComponent({ pageComponent }) {
  const selectedCandidates = pageComponent.selected
    ? Array.isArray(pageComponent.components) && pageComponent.components.length > 0
      ? pageComponent.components
      : [pageComponent.candidates.find((candidate) => candidate.componentId === pageComponent.componentId)].filter(Boolean)
    : []
  const representativeCandidate = selectedCandidates[0] || pageComponent.candidates[0] || null
  const supportedLevels = selectedCandidates.length > 1
    ? Array.from(
        new Set(
          selectedCandidates
            .flatMap((candidate) => candidate.supportedExtensionLevels || [])
            .filter((level) => selectedCandidates.every((candidate) => (candidate.supportedExtensionLevels || []).includes(level)))
        )
      )
    : representativeCandidate?.supportedExtensionLevels || [0]

  return {
    schemaVersion: 'extension-policy.v1',
    source: representativeCandidate ? 'page-component-registry' : 'managed-mold',
    status: pageComponent.selected ? 'component-controlled' : 'managed-mold-slots-only',
    defaultLevel: 0,
    maxLightweightLevel: pageComponent.selected && supportedLevels.includes(1) ? 1 : 0,
    supportedLevels,
    allowedExtensions: pageComponent.selected
      ? selectedCandidates.flatMap((candidate) => candidate.allowedExtensions || [])
      : [],
    rules: [
      'Level 0 uses only base mold editable slots.',
      'Level 1 is allowed only when declared by a certified page component.',
      'Level 2 structural extensions must leave the lightweight path and require an enhanced plan.',
      'Level 3 non-typical or composition changes must use non-typical/composition routing.',
      'Freeform children/customContent/renderAnything/extraLayout entry points are not lightweight extensions.',
    ],
  }
}

function inferGenerationStrategy({ fastPath, mode, pageComponent, pageTypeId, pageUnits, runtimeBridgeProfile, taskLevel, topology }) {
  const runtimeBridgeStrategyId = usesRuntimeBridgedPageComponent({
    mode,
    pageComponent,
    runtimeBridgeProfile,
  })
    ? 'runtime-bridged-page-component'
    : 'page-component'

  if (taskLevel.id === 'minor-edit') {
    return {
      id: 'reuse-existing-contract-for-minor-edit',
      normalizedId: 'controlled-extension',
      source: 'taskLevel',
      reason: 'minor edits should reuse the existing page contract and avoid full generation routing',
    }
  }

  if (topology.id === 'multi-page-workflow' && pageUnits.length > 0) {
    if (pageComponent?.selected) {
      return {
        id: 'run-page-components-per-page-unit',
        normalizedId: 'page-component',
        source: 'page-component-registry',
        reason: 'use certified page components for every page unit and fill governed business slots per route',
      }
    }

    return {
      id: pageUnits.every((unit) => unit.canUseFastPath) && fastPath.eligible
        ? 'run-fast-path-per-page-unit'
        : 'resolve-page-units-before-generation',
      normalizedId: 'managed-fallback',
      source: 'topology',
      reason: 'parallel page intents should be generated as separate typical pages unless same-screen layout evidence exists',
    }
  }

  if (topology.id === 'non-typical-overlay') {
    return {
      id: 'non-typical-constrained-assembly',
      normalizedId: 'non-typical',
      source: 'topology',
      reason: 'positive non-typical evidence requires constrained layout facts before JSX',
    }
  }

  if (topology.id === 'single-page-composite') {
    return {
      id: 'resolve-composite-layout-before-generation',
      normalizedId: 'non-typical',
      source: 'topology',
      reason: 'same-screen multi-intent layout needs split/composite contract before implementation',
    }
  }

  const pageTypeIds = pageUnits.length > 0
    ? pageUnits.map((unit) => unit.pageType.id).filter(Boolean)
    : [pageTypeId].filter(Boolean)

  if (pageTypeIds.some((id) => ANALYTICS_PAGE_TYPES.has(id))) {
    return {
      id: 'managed-analytics',
      normalizedId: 'managed-analytics',
      source: 'pageType',
      reason: 'data-visualization inherits the visualization shell and rules but must derive module layout from analysis goals',
    }
  }

  if (pageComponent?.blockedByRuntimeAdapter) {
    return {
      id: runtimeBridgeStrategyId,
      normalizedId: 'page-component',
      source: runtimeBridgeProfile?.status === 'blocked'
        ? 'runtime-bridge-profile'
        : 'legacy-runtime-adapter-gate',
      reason: pageComponent.runtimeAdapterProof?.reason || pageComponent.reason || 'legacy runtime adapter proof is required before selecting a page component',
    }
  }

  if (pageComponent?.selected) {
    return {
      id: runtimeBridgeStrategyId,
      normalizedId: 'page-component',
      source: runtimeBridgeProfile?.status === 'available'
        ? 'runtime-bridge-profile'
        : 'page-component-registry',
      reason: runtimeBridgeProfile?.status === 'available'
        ? `use runtime-bridged page component ${pageComponent.componentId} and fill governed business slots`
        : `use certified page component ${pageComponent.componentId} and fill governed business slots`,
    }
  }

  if (fastPath.eligible) {
    return {
      id: 'copy-template-or-host-archetype-and-replace-business-slots',
      normalizedId: 'managed-fallback',
      source: 'fastPath',
      reason: fastPath.reason,
    }
  }

  return {
    id: 'resolve-page-type-before-generation',
    normalizedId: 'managed-fallback',
    source: 'fallback',
    reason: 'page type is unresolved or fast path is disabled',
  }
}

function normalizedGenerationStrategyId(generationStrategy) {
  return generationStrategy?.normalizedId || generationStrategy?.id || 'managed-fallback'
}

function primaryPageComponentCandidateForPlan(pageComponent) {
  if (!Array.isArray(pageComponent?.candidates) || pageComponent.candidates.length === 0) {
    return null
  }

  if (
    pageComponent?.selected &&
    pageComponent.componentId &&
    pageComponent.componentId !== 'page-units'
  ) {
    return pageComponent.candidates.find((candidate) => candidate.componentId === pageComponent.componentId) || null
  }

  return pageComponent.candidates.find((candidate) => candidate.available) || pageComponent.candidates[0] || null
}

function deliveryAssetDescriptorForPlan({ generationStrategy, pageComponent, primaryGenerationAsset, startFrom }) {
  const strategyId = normalizedGenerationStrategyId(generationStrategy)
  if (strategyId === 'page-component') {
    if (primaryGenerationAsset?.type === 'page-components') {
      const deliveryKinds = uniqueValues(
        (Array.isArray(pageComponent?.components) ? pageComponent.components : []).map((component) =>
          component.projectOverlay ? 'project-certified-carrier' : 'direct-standard-component'
        )
      )

      return {
        kind: deliveryKinds.length === 1 ? `${deliveryKinds[0]}-set` : 'mixed-page-component-set',
        id: primaryGenerationAsset?.id || '',
        status: primaryGenerationAsset?.status || '',
        source: primaryGenerationAsset?.source || pageComponent?.source || '',
      }
    }

    const candidate = primaryPageComponentCandidateForPlan(pageComponent)
    return {
      kind: candidate?.projectOverlay ? 'project-certified-carrier' : 'direct-standard-component',
      id: primaryGenerationAsset?.id || candidate?.componentId || pageComponent?.componentId || '',
      status: primaryGenerationAsset?.status || (candidate ? 'blocked' : 'missing'),
      source: primaryGenerationAsset?.source || pageComponent?.source || '',
    }
  }

  if (strategyId === 'managed-analytics') {
    return {
      kind: 'managed-analytics-shell',
      id: primaryGenerationAsset?.id || '',
      status: primaryGenerationAsset?.status || '',
      source: primaryGenerationAsset?.source || '',
    }
  }

  const startPointToKind = {
    'host-archetype': 'host-archetype',
    template: 'mode-template',
    'reference-or-scaffold': 'reference-or-scaffold',
    scaffold: 'managed-scaffold',
    unresolved: 'unresolved',
  }
  const fallbackKind = startPointToKind[startFrom?.id || ''] || 'managed-fallback'

  return {
    kind: fallbackKind,
    id: primaryGenerationAsset?.id || startFrom?.id || '',
    status: primaryGenerationAsset?.status || '',
    source: primaryGenerationAsset?.source || startFrom?.source || '',
  }
}

function classifyCustomizationLevel({ generationStrategy, pageComponent, taskLevel, topology }) {
  const strategyId = normalizedGenerationStrategyId(generationStrategy)
  if (strategyId === 'managed-analytics') return 'analytics-extension'
  if (strategyId === 'non-typical') return 'true-non-typical'
  if (strategyId === 'managed-fallback') return 'structural-upgrade'
  if (taskLevel.id === 'minor-edit') return 'controlled-extension'
  if (pageComponent?.selected) return 'slot-fill'
  if (topology?.id === 'single-page-composite') return 'true-non-typical'
  return 'slot-fill'
}

function analyticsContractRequiredForPlan({ generationStrategy, pageTypeId, pageUnits }) {
  const pageTypeIds = pageUnits.length > 0
    ? pageUnits.map((unit) => unit.pageType?.id).filter(Boolean)
    : [pageTypeId].filter(Boolean)
  return normalizedGenerationStrategyId(generationStrategy) === 'managed-analytics' ||
    pageTypeIds.some((id) => ANALYTICS_PAGE_TYPES.has(id))
}

function deliverySummaryProfileForPlan({ acceptanceProfile, generationStrategy, mode }) {
  const strategyId = normalizedGenerationStrategyId(generationStrategy)
  const fullReportRequired = Boolean(acceptanceProfile?.formalRequired) ||
    mode === 'legacy-host-compatible' ||
    ['managed-analytics', 'managed-fallback', 'non-typical'].includes(strategyId)
  return {
    schemaVersion: 'delivery-summary-profile.v1',
    id: fullReportRequired ? 'full' : 'light',
    defaultOutput: fullReportRequired ? 'final-report' : 'delivery-summary',
    fullReportRequired,
    requiredFields: [
      'status',
      'projectMode',
      'generationStrategy',
      'generationRecipe',
      'primaryGenerationAsset',
      'customizationLevel',
      'validationStatus',
      'changedFiles',
      'remainingRisks',
    ],
    fullReportTriggers: [
      'legacy-migration',
      'true-non-typical',
      'managed-analytics-complexity',
      'structural-upgrade',
      'formal-acceptance',
      'preflight-or-smoke-failure',
      'explicit-user-request',
    ],
  }
}

function primaryGenerationAssetForPlan({ generationStrategy, pageComponent, pageTypeId, runtimeBridgeProfile, skillRoot, startFrom }) {
  const strategyId = normalizedGenerationStrategyId(generationStrategy)
  if (strategyId === 'page-component' && pageComponent?.selected) {
    if (Array.isArray(pageComponent.components) && pageComponent.components.length > 0) {
      const primaryGenerationAsset = {
        type: 'page-components',
        id: pageComponent.components.map((component) => component.componentId).join(','),
        componentIds: pageComponent.components.map((component) => component.componentId),
        status: 'available',
        source: pageComponent.source,
        baseMoldId: pageComponent.baseMoldId,
      }
      const deliveryAsset = deliveryAssetDescriptorForPlan({
        generationStrategy,
        pageComponent,
        primaryGenerationAsset,
        startFrom,
      })
      return {
        ...primaryGenerationAsset,
        deliveryAssetKind: deliveryAsset.kind,
      }
    }

    const primaryGenerationAsset = {
      type: 'page-component',
      id: pageComponent.componentId,
      status: 'available',
      source: pageComponent.source,
      baseMoldId: pageComponent.baseMoldId,
      ...(runtimeBridgeProfile
        ? {
            runtimeBridgeProfileId: runtimeBridgeProfile.profileId || '',
            deliveryMode: runtimeBridgeProfile.deliveryMode || '',
            runtimeComponentSource: runtimeBridgeProfile.runtimeAssetSource?.componentShell || '',
          }
        : {}),
    }
    const deliveryAsset = deliveryAssetDescriptorForPlan({
      generationStrategy,
      pageComponent,
      primaryGenerationAsset,
      startFrom,
    })
    return {
      ...primaryGenerationAsset,
      deliveryAssetKind: deliveryAsset.kind,
    }
  }
  if (strategyId === 'page-component') {
    const primaryCandidate = primaryPageComponentCandidateForPlan(pageComponent)
    const primaryGenerationAsset = {
      type: 'page-component',
      id: primaryCandidate?.componentId || pageComponent?.componentId || '',
      status: 'blocked',
      source: pageComponent?.source || 'page-component-registry',
      baseMoldId: primaryCandidate?.baseMoldId || pageComponent?.baseMoldId || (pageTypeId ? getMoldIdForPageType(pageTypeId, { skillRoot }) : ''),
      ...(runtimeBridgeProfile
        ? {
            runtimeBridgeProfileId: runtimeBridgeProfile.profileId || '',
            deliveryMode: runtimeBridgeProfile.deliveryMode || '',
            runtimeComponentSource: runtimeBridgeProfile.runtimeAssetSource?.componentShell || '',
          }
        : {}),
    }
    const deliveryAsset = deliveryAssetDescriptorForPlan({
      generationStrategy,
      pageComponent,
      primaryGenerationAsset,
      startFrom,
    })
    return {
      ...primaryGenerationAsset,
      deliveryAssetKind: deliveryAsset.kind,
    }
  }
  if (strategyId === 'managed-analytics') {
    const primaryGenerationAsset = {
      type: 'analytics-container',
      id: pageTypeId ? `${pageTypeId}.managed-analytics.v1` : 'managed-analytics.v1',
      status: 'available',
      source: 'docs/generation/figma-pages/data-visualization.md',
      baseMoldId: pageTypeId ? getMoldIdForPageType(pageTypeId, { skillRoot }) : '',
    }
    const deliveryAsset = deliveryAssetDescriptorForPlan({
      generationStrategy,
      pageComponent,
      primaryGenerationAsset,
      startFrom,
    })
    return {
      ...primaryGenerationAsset,
      deliveryAssetKind: deliveryAsset.kind,
    }
  }
  const primaryGenerationAsset = {
    type: startFrom?.id === 'unresolved' ? 'unresolved' : 'fallback-start-point',
    id: startFrom?.id || '',
    status: startFrom?.id && startFrom.id !== 'unresolved' ? 'fallback' : 'blocked',
    source: startFrom?.source || '',
    baseMoldId: pageTypeId ? getMoldIdForPageType(pageTypeId, { skillRoot }) : '',
  }
  const deliveryAsset = deliveryAssetDescriptorForPlan({
    generationStrategy,
    pageComponent,
    primaryGenerationAsset,
    startFrom,
  })
  return {
    ...primaryGenerationAsset,
    deliveryAssetKind: deliveryAsset.kind,
  }
}

function assetResolutionForPlan({ pageComponent, primaryGenerationAsset, generationStrategy, runtimeBridgeProfile, startFrom }) {
  const strategyId = normalizedGenerationStrategyId(generationStrategy)
  const deliveryAsset = deliveryAssetDescriptorForPlan({
    generationStrategy,
    pageComponent,
    primaryGenerationAsset,
    startFrom,
  })
  if (strategyId === 'page-component') {
    const adapterProof = pageComponent?.runtimeAdapterProof || null
    return {
      schemaVersion: 'asset-resolution.v1',
      status: pageComponent?.selected && primaryGenerationAsset?.status === 'available'
        ? 'available'
        : pageComponent?.candidates?.length > 0
          ? 'blocked'
          : 'missing',
      strategy: strategyId,
      semanticStrategyId: strategyId,
      assetType: primaryGenerationAsset?.type || 'page-component',
      deliveryAssetKind: deliveryAsset.kind,
      deliveryAssetId: deliveryAsset.id,
      componentId: pageComponent?.componentId || '',
      componentIds: Array.isArray(primaryGenerationAsset?.componentIds) ? primaryGenerationAsset.componentIds : [],
      pageTypeId: pageComponent?.pageTypeId || '',
      baseMoldId: pageComponent?.baseMoldId || primaryGenerationAsset?.baseMoldId || '',
      certificationLevel: pageComponent?.certificationStatus || 'not_applicable',
      certificationRef: pageComponent?.certificationRef || '',
      checkedBy: 'plan-page-task',
      source: pageComponent?.source || primaryGenerationAsset?.source || '',
      reason: pageComponent?.reason || '',
      ...(runtimeBridgeProfile
        ? {
            runtimeBridgeResolution: {
              status: runtimeBridgeProfile.status || 'not_applicable',
              profileId: runtimeBridgeProfile.profileId || '',
              matchedBy: runtimeBridgeProfile.matchedBy || '',
              deliveryMode: runtimeBridgeProfile.deliveryMode || '',
              runtimeComponentSource: runtimeBridgeProfile.runtimeAssetSource?.componentShell || '',
              wrapperTemplatePath: runtimeBridgeProfile.bridgeAssets?.wrapperTemplatePath || '',
              slotAdapterTemplatePath: runtimeBridgeProfile.bridgeAssets?.slotAdapterTemplatePath || '',
              reason: runtimeBridgeProfile.reason || '',
            },
          }
        : {}),
      adapterResolution: adapterProof
        ? {
            required: Boolean(adapterProof.required),
            status: adapterProof.status || 'not_applicable',
            kind: adapterProof.kind || '',
            adapterId: adapterProof.adapterId || '',
            adapterIds: Array.isArray(adapterProof.adapterIds) ? adapterProof.adapterIds : [],
            responsibility: adapterProof.responsibility || '',
            reason: adapterProof.reason || '',
            missingCapabilities: Array.isArray(adapterProof.missingCapabilities) ? adapterProof.missingCapabilities : [],
          }
        : {
            required: false,
            status: 'not_applicable',
            kind: '',
            adapterId: '',
            adapterIds: [],
            responsibility: '',
            reason: '',
            missingCapabilities: [],
          },
    }
  }

  return {
    schemaVersion: 'asset-resolution.v1',
    status: primaryGenerationAsset?.status === 'available' || primaryGenerationAsset?.status === 'fallback'
      ? primaryGenerationAsset.status
      : 'blocked',
    strategy: strategyId,
    semanticStrategyId: strategyId,
    assetType: primaryGenerationAsset?.type || '',
    deliveryAssetKind: deliveryAsset.kind,
    deliveryAssetId: deliveryAsset.id,
    componentId: '',
    componentIds: [],
    pageTypeId: '',
    baseMoldId: primaryGenerationAsset?.baseMoldId || '',
    certificationLevel: 'not_applicable',
    certificationRef: '',
    checkedBy: 'plan-page-task',
    source: primaryGenerationAsset?.source || '',
    reason: strategyId === 'managed-analytics'
      ? 'managed analytics asset resolution is governed by chartUsageContract and analytics rules'
      : 'managed fallback asset resolution is governed by startFrom and managed mold rules',
  }
}

function factsForPlan({ projectCapabilities, mode, targetPage, assetResolution }) {
  const blockingReasons = []
  const projectRootStatus = projectCapabilities?.projectRootValid ? 'valid' : 'unavailable'

  if (!mode?.id || mode.confirmed === false) {
    blockingReasons.push('project mode is not confirmed by plan-page-task')
  }

  if (targetPage?.routeOwnership?.isTypicalPageReuseAsset) {
    blockingReasons.push('target page is inside typical-page-reuse example assets instead of a business route')
  }

  if (assetResolution?.strategy === 'page-component' && assetResolution.status !== 'available') {
    blockingReasons.push(`page component asset is ${assetResolution.status}`)
  }

  if (
    assetResolution?.strategy === 'page-component' &&
    assetResolution?.runtimeBridgeResolution?.status === 'blocked'
  ) {
    blockingReasons.push(assetResolution.runtimeBridgeResolution.reason || 'runtime bridge profile is blocked')
  }

  return {
    schemaVersion: 'plan-facts.v1',
    status: blockingReasons.length > 0 ? 'blocked' : 'ready',
    sources: {
      capabilities: projectCapabilities?.schemaVersion || '',
      mode: mode?.factPath || (mode?.source === 'explicit' ? 'cli:--mode' : 'rules/mode-selection.md'),
      routeOwnership: 'typical-page-route-ownership',
      assetCatalog: assetResolution?.source || '',
    },
    digest: {
      mode: mode?.id || '',
      projectRoot: projectCapabilities?.projectRoot || '',
      routeRole: targetPage?.routeOwnership?.role || '',
      asset: assetResolution?.componentId || assetResolution?.assetType || '',
    },
    freshness: 'current-turn',
    projectRootStatus,
    internalChecks: [
      'project-root',
      'capabilities',
      'mode-lock',
      'route-ownership',
      'asset-resolution',
      ...(assetResolution?.strategy === 'page-component' ? ['component-certification'] : []),
      ...(assetResolution?.runtimeBridgeResolution ? ['runtime-bridge-profile'] : []),
    ],
    requiredAgentChecks: [],
    blockingReasons,
  }
}

function fallbackGenerationAssetForPlan({ generationStrategy, pageComponent, startFrom }) {
  const strategyId = normalizedGenerationStrategyId(generationStrategy)
  const trigger = strategyId === 'page-component'
    ? ''
    : strategyId === 'managed-analytics'
      ? 'analytics-contract-blocked'
      : strategyId === 'non-typical'
        ? 'structural-upgrade'
        : pageComponent?.candidates?.length > 0 && !pageComponent.selected
          ? 'component-missing'
          : 'managed-fallback'
  return {
    type: startFrom?.id || 'unresolved',
    id: startFrom?.templatePath || startFrom?.hostArchetypePath || startFrom?.examplePath || startFrom?.id || '',
    status: startFrom?.id && startFrom.id !== 'unresolved' ? 'fallback' : 'blocked',
    trigger,
    source: startFrom?.source || '',
  }
}

async function resolveTemplatePath({ mode, pageTypeId, skillRoot }) {
  if (!TEMPLATE_START_MODES.has(mode) || !pageTypeId) {
    return ''
  }

  const candidates = [
    path.join('templates', 'archetypes', mode, pageTypeId, 'page.template.tsx'),
    path.join('templates', 'archetypes', mode, pageTypeId, 'page.template.jsx'),
  ]

  for (const candidate of candidates) {
    try {
      await fs.access(path.join(skillRoot, candidate))
      return candidate
    } catch {
      // Continue looking for jsx/tsx variants.
    }
  }

  return ''
}

function startFromForLegacyPageComponent({ generationStrategy, mode, pageComponent }) {
  if (!usesLegacyPageComponentFastPath({ generationStrategy, mode })) {
    return null
  }

  return {
    id: 'page-component',
    source: pageComponent?.source || 'page-component-registry',
    templatePath: '',
    examplePath: '',
    hostArchetypePath: '',
    reason: pageComponent?.selected
      ? 'legacy-host-compatible uses the certified page component as the active start point; templates and host archetypes remain fallback-only.'
      : 'legacy-host-compatible stays on the page-component route until strategy explicitly degrades to managed-fallback; do not reinterpret template or host archetype assets as the active start point.',
  }
}

function inferStartFrom({ archetype, mode, pageType, templatePath }) {
  if (!pageType) {
    return {
      id: 'unresolved',
      source: 'missing-page-type',
      templatePath: '',
      examplePath: '',
      hostArchetypePath: '',
      reason: 'page type must be resolved before selecting a start asset',
    }
  }

  if (templatePath) {
    return {
      id: 'template',
      source: 'mode-template',
      templatePath,
      examplePath: archetype?.archetype?.examplePath || pageType.assetExamplePath || '',
      hostArchetypePath: '',
      reason: 'mode-specific page.template is available; copy it and replace business slots',
    }
  }

  const hostArchetypePath = archetype?.archetype?.modeAdapters?.[mode]?.hostArchetypePath || ''
  if (hostArchetypePath) {
    return {
      id: 'host-archetype',
      source: 'mode-adapter',
      templatePath: '',
      examplePath: archetype?.archetype?.examplePath || pageType.assetExamplePath || '',
      hostArchetypePath,
      reason: 'host archetype is available; copy the host-compatible skeleton and replace business slots',
    }
  }

  const examplePath = archetype?.archetype?.examplePath || pageType.assetExamplePath || pageType.examplePath || ''
  if (examplePath) {
    return {
      id: 'reference-or-scaffold',
      source: 'page-type-example',
      templatePath: '',
      examplePath,
      hostArchetypePath: '',
      reason: 'no mode-specific template exists; use start-page scaffold/reference while preserving the page shell contract',
    }
  }

  return {
    id: 'scaffold',
    source: 'start-page',
    templatePath: '',
    examplePath: '',
    hostArchetypePath: '',
    reason: 'no template or example asset was found; use start-page scaffold and keep contract gates enabled',
  }
}

function inferFastPath({ changeText, mode, pageTypeId, pageUnits = [], taskLevel, isNonTypical, i18nMode, topology }) {
  const pageTypeIds = pageUnits.length > 0
    ? pageUnits.map((unit) => unit.pageType.id).filter(Boolean)
    : [pageTypeId].filter(Boolean)
  const supportedTopology = ['single-typical-page', 'multi-page-workflow'].includes(topology?.id || '')
  const eligible =
    ['host-integration', 'rules-only', 'legacy-host-compatible'].includes(mode) &&
    pageTypeIds.length > 0 &&
    pageTypeIds.every((id) => SLOT_FAST_PATH_PAGE_TYPES.has(id)) &&
    supportedTopology &&
    !isNonTypical &&
    taskLevel.id === 'new-page-or-rearchitecture' &&
    i18nMode.id !== 'full' &&
    !hasSpecialFastPathRequirement(changeText)

  if (!eligible) {
    return {
      eligible: false,
      entry: '',
      reason: hasSpecialFastPathRequirement(changeText)
        ? 'special requirement disables template-copy fast path'
        : 'task does not match project-mode typical-page fast path',
    }
  }

  return {
    eligible: true,
    entry: pageTypeIds.length > 1
      ? 'run-template-copy-fast-path-per-page-unit'
      : 'copy-template-or-host-archetype-and-replace-business-slots',
    reason: pageTypeIds.length > 1
      ? `${mode} multi-page typical workflow without same-screen composite, non-typical, complex chart, or full i18n requirements`
      : `${mode} typical page without special layout, non-typical, complex chart, or full i18n requirements`,
  }
}

function parseArgs(argv) {
  const options = {
    change: '',
    deliveryLevel: 'auto',
    json: false,
    line: '',
    mode: 'auto',
    page: '',
    pageTypeId: '',
    target: process.cwd(),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }

    if (
      arg === '--change' ||
      arg === '--page-type' ||
      arg === '--mode' ||
      arg === '--delivery-level' ||
      arg === '--target' ||
      arg === '--page' ||
      arg === '--line'
    ) {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--change') options.change = value
      if (arg === '--delivery-level') options.deliveryLevel = value
      if (arg === '--page-type') options.pageTypeId = value
      if (arg === '--mode') options.mode = value
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--page') options.page = value
      if (arg === '--line') options.line = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.change) {
    throw new Error('Missing --change')
  }

  return options
}

function docsForPageTypes({ manifest, pageTypeIds }) {
  const docs = []

  for (const pageTypeId of pageTypeIds) {
    const pageType = manifest.pageTypes.find((item) => item.id === pageTypeId)
    if (!pageType) {
      continue
    }

    if (pageType.docEntry) {
      docs.push(pageType.docEntry)
    }

    for (const sharedDoc of pageType.sharedDocs || []) {
      docs.push(sharedDoc)
    }
  }

  return Array.from(new Set(docs))
}

function requiredDocsForPlan({
  fastPath,
  i18nMode,
  isNonTypical,
  manifest,
  mode,
  modeSource,
  pageComponent,
  pageTypeIds,
  taskLevel,
  topology,
}) {
  const docs = [
    'rules/QUICK-START.md',
    'rules/page-type-map.md',
    'rules/contract-regions.md',
    'rules/generation-rules.md',
    'docs/generation/ai-kickoff-template.md',
    'docs/generation/hiui5-visual-baseline.md',
  ]

  if (!['project-lock', 'bootstrap-summary', 'explicit', 'explicit-alias:host-compatible'].includes(modeSource)) {
    docs.splice(1, 0, 'rules/mode-selection.md')
  }

  if (isNonTypical) {
    docs.push('docs/generation/non-typical-pages.md')
  } else if (topology?.id === 'single-page-composite') {
    docs.push('docs/generation/implementation-checklist-template.md')
  } else if (pageTypeIds.length > 0) {
    docs.push('docs/generation/figma-page-rules.md')
  }

  docs.push(...docsForPageTypes({ manifest, pageTypeIds }))

  if (['rules-only', 'legacy-host-compatible'].includes(mode)) {
    docs.push('docs/generation/rules-only-example-alignment.md')
  }

  if (mode === 'rules-only' && !fastPath.eligible && taskLevel.id !== 'minor-edit') {
    docs.push('docs/generation/rules-only-component-matrix.md')
  }

  if (mode === 'legacy-host-compatible') {
    docs.push('docs/generation/legacy-host-compatibility.md')
  }

  if (pageComponent?.selected || pageComponent?.candidates?.length > 0) {
    docs.push('docs/generation/page-level-components.md')
    docs.push('docs/generation/component-certification.md')
    docs.push('docs/designer/page-component-preview.md')
    if (mode === 'legacy-host-compatible') {
      docs.push('rules/runtime-bridged-component-matrix.json')
    }
  }

  if (i18nMode.id === 'full') {
    docs.push('docs/generation/i18n-baseline.md')
  }

  return Array.from(new Set(docs))
}

function shouldGenerateTranslationMap({ deliveryLevel, mode, pageFact, pageTypeId }) {
  if (mode !== 'legacy-host-compatible') return false
  if (deliveryLevel.id === 'C') return true
  if (HIGH_RISK_TRANSLATION_MAP_PAGE_TYPES.has(pageTypeId)) return true
  if (pageFact?.pageTypeMigration) return true
  return false
}

function usesLegacyPageComponentFastPath({ generationStrategy, mode }) {
  return (
    mode === 'legacy-host-compatible' &&
    normalizedGenerationStrategyId(generationStrategy) === 'page-component'
  )
}

function shouldRequireSourceGateInPrimaryActions({
  deliveryLevel,
  generationStrategy,
  mode,
  pageFact,
  taskLevel,
}) {
  if (taskLevel.id === 'minor-edit') return false
  if (deliveryLevel.id === 'C') return false
  if (mode !== 'legacy-host-compatible') return false
  if (usesLegacyPageComponentFastPath({ generationStrategy, mode })) return false
  if (pageFact?.pageTypeMigration) return true
  return !pageFact?.exists
}

function shouldRequireSlotGateInPrimaryActions({
  deliveryLevel,
  generationStrategy,
  mode,
  pageFact,
  taskLevel,
}) {
  if (taskLevel.id === 'minor-edit') return false
  if (deliveryLevel.id === 'C') return false
  if (
    shouldRequireSourceGateInPrimaryActions({
      deliveryLevel,
      generationStrategy,
      mode,
      pageFact,
      taskLevel,
    })
  ) {
    return false
  }
  return true
}

function isSingleTypicalPageTarget({ topology, pageUnits }) {
  return topology?.id === 'single-typical-page' && pageUnits.length <= 1
}

function unitPageTargetArg(unit) {
  return `<${unit.id || 'page-unit'}-page>`
}

function perPageUnitCommands({ deliveryLevel, mode, pageUnits, taskLevel }) {
  const commands = []

  for (const unit of pageUnits) {
    const unitPageTypeId = unit.pageType?.id || ''
    const unitPageArg = unitPageTargetArg(unit)

    commands.push({
      script: 'resolve-business-route-target',
      args: ['--page-unit', unit.id || '<page-unit>', '--page', unitPageArg],
      when: `before generation, resolve a dedicated business route for ${unit.label || unitPageTypeId || unit.id || 'this page unit'} instead of collapsing multiple page units into one container path`,
    })
    commands.push({
      script: 'typical-page:start-page',
      args: ['--page-type', unitPageTypeId || '<page-type>', '--page', unitPageArg],
      when: `after the ${unit.label || unitPageTypeId || unit.id || 'page unit'} route is resolved, generate this page unit as an independent typical page`,
    })

    if (shouldGenerateTranslationMap({ deliveryLevel, mode, pageFact: null, pageTypeId: unitPageTypeId })) {
      commands.push({
        script: 'typical-page:translation-map',
        args: ['--page', unitPageArg, '--reason', 'legacy-translation-guard'],
        when: `after ${unit.label || unitPageTypeId || unit.id || 'the page unit'} business slot replacement and before preflight; legacy high-risk translation map is required per page unit`,
      })
    }

    if (shouldRequireSourceGateInPrimaryActions({ deliveryLevel, mode, pageFact: null, taskLevel })) {
      commands.push({
        script: 'typical-page:source-gate',
        args: ['--file', unitPageArg],
        when: `after ${unit.label || unitPageTypeId || unit.id || 'the page unit'} business slot replacement and before preflight; legacy per-unit generation requires source and adapter proof`,
      })
    } else if (shouldRequireSlotGateInPrimaryActions({ deliveryLevel, mode, pageFact: null, taskLevel })) {
      commands.push({
        script: 'typical-page:slot-gate',
        args: ['--file', unitPageArg],
        when: `after ${unit.label || unitPageTypeId || unit.id || 'the page unit'} business slot replacement and before preflight; verify the edit stayed inside managed business slots`,
      })
    }

    commands.push({
      script: 'typical-page:preflight',
      args: ['--page', unitPageArg],
      when: `after ${unit.label || unitPageTypeId || unit.id || 'the page unit'} template/host archetype generation and business slot replacement`,
    })
  }

  commands.push({
    script: 'typical-page:preview-ready',
    args: ['--page <page-unit-targets>', '--url <url>', '--report-mode <mode>', '--prompt <prompt>'],
    when: 'before final response after every page unit is renderable and each resolved business route has completed preflight',
    required: taskLevel.id !== 'minor-edit',
  })

  return commands
}

function compositePlanningCommands({ mode, pageFact }) {
  return [
    {
      script: 'typical-page:select-archetype',
      args: ['--page-type <page-type>'],
      when: 'after the primary page type is selected',
    },
    {
      script: 'typical-page:write-contract',
      args: [
        '--page-type <page-type>',
        pageFact?.page ? '--page <existing-page>' : '--page <new-page>',
        `--mode ${mode}`,
        '--preset standard',
      ],
      when: 'before any start-page or preflight command; same-screen composite requests must first declare the split/composite layout contract, region ownership, and page-unit boundaries',
    },
  ]
}

function requiredCommandsForTask({
  deliveryLevel,
  generationStrategy,
  mode,
  pageFact,
  pageTypeId,
  pageUnits = [],
  taskLevel,
  topology,
}) {
  if (taskLevel.id === 'minor-edit') {
    return [
      {
        script: 'reuse-existing-contract',
        args: [],
        when: 'before the small edit; only upgrade to doctor/finalize if shell, ownership, markers, dependencies, routes, or host/style entry points changed',
      },
    ]
  }

  if (topology?.id === 'multi-page-workflow' && pageUnits.length > 1) {
    return perPageUnitCommands({ deliveryLevel, mode, pageUnits, taskLevel })
  }

  if (topology?.id === 'single-page-composite') {
    return compositePlanningCommands({ mode, pageFact })
  }

  const existingContractPageTypeId = String(pageFact?.contract?.pageTypeId || '').trim()
  const singleTypicalTarget = isSingleTypicalPageTarget({ topology, pageUnits })
  const hasPageTypeMigration =
    singleTypicalTarget &&
    Boolean(pageFact?.page && existingContractPageTypeId && pageTypeId) &&
    existingContractPageTypeId !== pageTypeId
  const hasExistingSamePageType =
    singleTypicalTarget &&
    Boolean(pageFact?.page && pageFact.exists && existingContractPageTypeId && pageTypeId) &&
    existingContractPageTypeId === pageTypeId

  if (deliveryLevel.id === 'A') {
    const commands = [
      {
        script: 'typical-page:select-archetype',
        args: ['--page-type <page-type>'],
        when: 'after page type is selected',
      },
    ]

    if (hasPageTypeMigration) {
      commands.push({
        script: 'typical-page:write-contract',
        args: [
          '--page-type <page-type>',
          '--page <existing-page>',
          `--mode ${mode}`,
          '--preset standard',
        ],
        when: `before preflight; existing contract pageType is ${existingContractPageTypeId}, so refresh the managed contract instead of running preflight against stale rules`,
      })
    } else if (hasExistingSamePageType) {
      commands.push({
        script: 'reuse-existing-contract',
        args: ['--page <existing-page>'],
        when: 'existing managed page already matches the target page type; replace business slots in place and skip template copy',
      })
    } else {
      commands.push({
        script: 'typical-page:start-page',
        args: ['--page-type <page-type>', '--page <new-page>'],
        when: pageFact?.exists
          ? 'existing page path already exists; copy or translate the selected archetype carefully, preserving unrelated local files'
          : 'copy the managed template or host archetype before business slot replacement',
      })
    }

    commands.push(
      ...(shouldGenerateTranslationMap({ deliveryLevel, mode, pageFact, pageTypeId })
        ? [
            {
              script: 'typical-page:translation-map',
              args: ['--page <new-page>', '--reason legacy-translation-guard'],
              when: 'after business slot replacement and before preflight; legacy high-risk translation map is required',
            },
          ]
        : []),
      ...(shouldRequireSourceGateInPrimaryActions({
        deliveryLevel,
        generationStrategy,
        mode,
        pageFact,
        taskLevel,
      })
        ? [
            {
              script: 'typical-page:source-gate',
              args: [pageFact?.page ? '--file <existing-page>' : '--file <new-page>'],
              when: 'after business slot replacement and before preflight; legacy new/migration pages require source and adapter proof, not marker-only proof',
            },
          ]
        : []),
      ...(shouldRequireSlotGateInPrimaryActions({
        deliveryLevel,
        generationStrategy,
        mode,
        pageFact,
        taskLevel,
      })
        ? [
            {
              script: 'typical-page:slot-gate',
              args: [pageFact?.page ? '--file <existing-page>' : '--file <new-page>'],
              when: 'after business slot replacement and before preflight; verify the edit stayed inside managed business slots',
            },
          ]
        : []),
      {
        script: 'typical-page:preflight',
        args: [pageFact?.page ? '--page <existing-page>' : '--page <new-page>'],
        when: 'after template or host archetype copy and business slot replacement',
      },
    )

    return appendRequiredUsageStatsCommand(commands, { deliveryLevel, taskLevel })
  }

  return appendRequiredUsageStatsCommand([
    {
      script: 'typical-page:select-archetype',
      args: ['--page-type <page-type>'],
      when: 'after page type is selected',
    },
    {
      script: 'typical-page:start-page',
      args: ['--page-type <page-type>', '--page <new-page>'],
      when: hasPageTypeMigration
        ? 'page type migration detected; prefer typical-page:write-contract --preset standard before preflight if reusing this page path'
        : hasExistingSamePageType
          ? 'existing managed page already matches the target page type; prefer in-place business slot replacement instead of copying a new template'
        : 'before implementation',
    },
    ...(hasPageTypeMigration
      ? [
          {
            script: 'typical-page:write-contract',
            args: [
              '--page-type <page-type>',
              '--page <existing-page>',
              `--mode ${mode}`,
              '--preset standard',
            ],
            when: 'before preflight; refresh stale managed contract for the new page type',
          },
        ]
      : []),
    ...(shouldGenerateTranslationMap({ deliveryLevel, mode, pageFact, pageTypeId })
      ? [
          {
            script: 'typical-page:translation-map',
            args: ['--page <new-page>', '--reason legacy-translation-guard'],
            when: 'after implementation and before preflight; legacy high-risk translation map is required',
          },
        ]
      : []),
    ...(shouldRequireSourceGateInPrimaryActions({
      deliveryLevel,
      generationStrategy,
      mode,
      pageFact,
      taskLevel,
    })
      ? [
          {
            script: 'typical-page:source-gate',
            args: [pageFact?.page ? '--file <existing-page>' : '--file <new-page>'],
            when: 'after implementation and before preflight; legacy new/migration pages require source and adapter proof, not marker-only proof',
          },
        ]
      : []),
    ...(shouldRequireSlotGateInPrimaryActions({
      deliveryLevel,
      generationStrategy,
      mode,
      pageFact,
      taskLevel,
    })
      ? [
          {
            script: 'typical-page:slot-gate',
            args: [pageFact?.page ? '--file <existing-page>' : '--file <new-page>'],
            when: 'after implementation and before preflight; verify the edit stayed inside managed business slots',
          },
        ]
      : []),
    {
      script: 'typical-page:preflight',
      args: ['--page <new-page>'],
      when: 'before business JSX/detail implementation',
    },
    {
      script: 'npm run build',
      args: [],
      when: 'after implementation when the project exposes this script',
    },
    {
      script: 'npm run lint',
      args: [],
      when: 'after implementation when the project exposes this script',
    },
  ], { deliveryLevel, taskLevel })
}

function formalAcceptanceCommandsForTask({ deliveryLevel, taskLevel, topology, pageUnits = [] }) {
  if (
    taskLevel.id === 'minor-edit' ||
    deliveryLevel.id !== 'C' ||
    topology?.id === 'multi-page-workflow' ||
    topology?.id === 'single-page-composite' ||
    pageUnits.length > 1
  ) {
    return []
  }

  return [
    {
      script: 'typical-page:source-gate',
      args: ['--file <new-page>'],
      when: 'before formal managed-page acceptance',
    },
    {
      script: 'typical-page:doctor',
      args: [],
      when: 'before formal managed-page acceptance',
    },
    {
      script: 'typical-page:finalize-page',
      args: [
        '--page-type <page-type>',
        '--page <new-page>',
        '--archetype <host-archetype-path>',
        '--region <name=target>',
      ],
      when: 'before claiming formal managed delivery complete',
    },
  ]
}

function conditionalCommandsForTask({ deliveryLevel, taskLevel, topology, pageUnits = [] }) {
  if (
    taskLevel.id === 'minor-edit' ||
    deliveryLevel.id === 'A' ||
    topology?.id === 'multi-page-workflow' ||
    topology?.id === 'single-page-composite' ||
    pageUnits.length > 1
  ) {
    return []
  }

  return [
    {
      script: 'typical-page:runtime-smoke',
      args: ['--page <new-page>', '--url <url>'],
      when: 'runtime smoke is required by page type, scroll strategy, chart-section, or split pane contract',
    },
  ]
}

function actionToolForScript(script) {
  if (script === 'reuse-existing-contract') return 'file-edit'
  if (script === 'resolve-business-route-target') return 'manual-resolution'
  if (script === 'npm run build' || script === 'npm run lint') return 'shell-command'
  if (script.startsWith('typical-page:')) return 'npm-script'
  return 'node-script'
}

function actionPhaseForScript(script) {
  if (script === 'typical-page:select-archetype') return 'SelectStartPoint'
  if (script === 'typical-page:start-page') return 'GenerateOrEdit'
  if (script === 'typical-page:write-contract' || script === 'reuse-existing-contract') return 'WriteContract'
  if (script === 'typical-page:translation-map') return 'TranslationMap'
  if (script === 'typical-page:preflight') return 'Preflight'
  if (
    script === 'typical-page:source-gate' ||
    script === 'typical-page:doctor' ||
    script === 'typical-page:finalize-page'
  ) {
    return 'FormalAcceptance'
  }
  if (script === 'typical-page:runtime-smoke') return 'FormalAcceptance'
  if (script === 'typical-page:preview-ready') return 'UsageStats'
  if (script === 'resolve-business-route-target') return 'ResolveBlockingFacts'
  return 'GenerateOrEdit'
}

function actionIdForCommand(command, index) {
  return String(command.script || 'action')
    .replace(/^typical-page:/, '')
    .replace(/^npm run /, 'npm-')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || `action-${index + 1}`
}

function argsObjectForCommand(args) {
  const values = Array.isArray(args) ? args : []
  const result = {}
  for (let index = 0; index < values.length; index += 1) {
    const value = String(values[index] || '')
    const inlineMatch = value.match(/^(--[^\s=]+)\s+(.+)$/)
    if (inlineMatch) {
      result[inlineMatch[1]] = inlineMatch[2]
      continue
    }
    if (value.startsWith('--')) {
      const next = values[index + 1]
      if (next && !String(next).startsWith('--')) {
        result[value] = String(next)
        index += 1
      } else {
        result[value] = true
      }
    } else {
      result[`_${index}`] = value
    }
  }
  return result
}

function actionsForCommands(commands, { required = true } = {}) {
  return commands.map((command, index) => ({
    id: actionIdForCommand(command, index),
    phase: actionPhaseForScript(command.script || ''),
    tool: actionToolForScript(command.script || ''),
    command: command.script || '',
    args: argsObjectForCommand(command.args),
    required,
    reason: command.when || '',
    produces: [],
    displayCommand: [command.script, ...(command.args || [])].filter(Boolean).join(' '),
  }))
}

function uniqueValues(values) {
  return Array.from(new Set(values.filter(Boolean)))
}

function generationProfileForPlan({
  deliveryLevel,
  extensionPolicy,
  generationStrategy,
  mode,
  pageComponent,
  pageFact,
  pageTypeId,
  pageUnits,
  runtimeBridgeProfile,
  skillRoot,
  startFrom,
  taskLevel,
  topology,
}) {
  const pageTypeIds = pageUnits.length > 0
    ? pageUnits.map((unit) => unit.pageType?.id).filter(Boolean)
    : [pageTypeId].filter(Boolean)
  const primaryGenerationAsset = primaryGenerationAssetForPlan({
    generationStrategy,
    pageComponent,
    pageTypeId,
    runtimeBridgeProfile,
    skillRoot,
    startFrom,
  })
  const deliveryAsset = deliveryAssetDescriptorForPlan({
    generationStrategy,
    pageComponent,
    primaryGenerationAsset,
    startFrom,
  })
  const lockedRegions = uniqueValues(
    pageTypeIds.flatMap((id) => getLockedRegionsForPageType(id, { skillRoot }))
  )
  const editableSlots = uniqueValues(
    pageTypeIds.flatMap((id) => getEditableSlotsForPageType(id, { skillRoot }))
  )
  const slotManifest = pageTypeIds.length === 1
    ? getSlotManifestForPageType(pageTypeIds[0], { skillRoot })
    : []
  const requiredGates = ['preflight']
  const legacyPageComponentFastPath = usesLegacyPageComponentFastPath({
    generationStrategy,
    mode,
  })

  if (
    shouldRequireSourceGateInPrimaryActions({
      deliveryLevel,
      generationStrategy,
      mode,
      pageFact,
      taskLevel,
    })
  ) {
    requiredGates.unshift('source-gate')
  } else if (
    shouldRequireSlotGateInPrimaryActions({
      deliveryLevel,
      generationStrategy,
      mode,
      pageFact,
      taskLevel,
    })
  ) {
    requiredGates.unshift('slot-gate')
  }

  if (pageComponent?.selected) {
    requiredGates.push('page-instance-validation')
  }

  return {
    schemaVersion: 'generation-profile.v1',
    strategy: normalizedGenerationStrategyId(generationStrategy),
    legacyStrategyId: generationStrategy.id,
    selectedSemanticStrategy: normalizedGenerationStrategyId(generationStrategy),
    selectedSemanticVariantId: generationStrategy.id,
    selectedDeliveryAssetKind: deliveryAsset.kind,
    selectedDeliveryAssetId: deliveryAsset.id,
    selectedDeliveryAssetStatus: deliveryAsset.status,
    mode,
    pageComponentId: pageComponent?.selected ? pageComponent.componentId : '',
    pageComponentStatus: pageComponent?.selected ? 'selected' : 'not_selected',
    runtimeAdapterProof: pageComponent?.runtimeAdapterProof || null,
    ...(runtimeBridgeProfile
      ? {
          runtimeBridgeProfileId: runtimeBridgeProfile.profileId || '',
          runtimeBridgeStatus: runtimeBridgeProfile.status || '',
          runtimeComponentSource: runtimeBridgeProfile.runtimeAssetSource?.componentShell || '',
        }
      : {}),
    extensionPolicyStatus: extensionPolicy?.status || '',
    moldId: pageTypeIds.length === 1
      ? getMoldIdForPageType(pageTypeIds[0], { skillRoot })
      : 'page-units.managed-mold.v1',
    startFrom: legacyPageComponentFastPath ? 'page-component' : startFrom?.id || '',
    lockedRegions,
    editableSlots,
    slotManifest,
    requiredGates: uniqueValues(requiredGates),
    fallback: 'block-and-request-managed-mold-or-certified-adapter',
    sourceProofLevel:
      legacyPageComponentFastPath || mode !== 'legacy-host-compatible'
        ? 'slot-boundary-proof'
        : 'strict-source-adapter-proof',
    notes: [
      'Generate from the primary generation asset when available; use fallback start points only for managed-fallback cases.',
      'Do not synthesize page shell, critical regions, ownership, pagination/footer, or main-scroll from local primitives.',
      ...(pageComponent?.selected
        ? ['Use the certified page component implementation, then validate the business page instance before preflight.']
        : []),
      ...(runtimeBridgeProfile?.status === 'available'
        ? ['In legacy bridge mode, resolve runtime shell source from certification and keep wrapper/slot adapter runtime-thin.']
        : []),
      ...(legacyPageComponentFastPath
        ? ['Legacy page-component fast path uses slot-boundary validation; source-gate stays in fallback/formal acceptance branches instead of the primary slot-fill chain.']
        : []),
      ...(topology?.id === 'non-typical-overlay'
        ? ['Non-typical overlays must declare governed base mold and incremental scope before implementation.']
        : []),
      ...(normalizedGenerationStrategyId(generationStrategy) === 'managed-analytics'
        ? ['Managed analytics pages must build chartUsageContract before JSX and follow data visualization tokens/components.']
        : []),
    ],
  }
}

function firstResolvedPageTypeId(pageUnits, pageTypeId) {
  return pageUnits.length > 0
    ? pageUnits.map((unit) => unit.pageType?.id).find(Boolean) || pageTypeId || ''
    : pageTypeId || ''
}

function recipeStartingPointForPlan({ generationStrategy, primaryGenerationAsset, startFrom }) {
  const strategyId = normalizedGenerationStrategyId(generationStrategy)
  if (strategyId === 'page-component' && String(primaryGenerationAsset?.type || '').includes('page-component')) {
    return 'page-component'
  }
  if (strategyId === 'managed-analytics') {
    return 'managed-mold'
  }
  if (startFrom?.id === 'host-archetype') {
    return 'host-archetype'
  }
  if (['reference-or-scaffold', 'scaffold', 'template'].includes(startFrom?.id || '')) {
    return 'reference-or-scaffold'
  }
  return 'managed-mold'
}

function recipeRequiredAssetsForPlan({
  analyticsContractRequired,
  pageComponent,
  primaryGenerationAsset,
  runtimeBridgeProfile,
  startFrom,
}) {
  return uniqueValues([
    primaryGenerationAsset?.id || '',
    primaryGenerationAsset?.baseMoldId || '',
    pageComponent?.selected ? pageComponent.componentId : '',
    analyticsContractRequired ? 'chartUsageContract' : '',
    runtimeBridgeProfile?.profileId || '',
    runtimeBridgeProfile?.bridgeAssets?.wrapperTemplatePath || '',
    runtimeBridgeProfile?.bridgeAssets?.slotAdapterTemplatePath || '',
    startFrom?.hostArchetypePath || '',
    startFrom?.templatePath || '',
    startFrom?.examplePath || '',
  ])
}

function tablePageRecipeForPlan(recipeContext) {
  return {
    startingPoint: recipeContext.startingPoint,
    assemblyOrder: [
      'page header (outside white-body)',
      'white-body workspace',
      'QueryFilter',
      'table region',
      'pagination/footer',
      'empty/loading/error',
    ],
    requiredAssets: recipeContext.requiredAssets,
    forbiddenMoves: [
      'move the page header into white-body, table, or ad hoc cards',
      'invent a new shell owner',
      'replace QueryFilter with loose SearchForm + Table composition or ad hoc filter wrappers',
      'reassign pagination/footer ownership outside the managed contract',
      'replace the certified table region with ad hoc primitives',
    ],
    slotFillPolicy: 'fill only certified business slots and controlled extension regions',
    regionOwnership: ['page-header', 'white-body', 'query-filter', 'table', 'pagination-footer'],
    inlineChecks: [
      'page header stays outside the white-body workspace',
      'QueryFilter remains the managed search carrier inside white-body',
      'table remains the main content owner',
      'pagination/footer semantics remain unchanged after business filling',
    ],
  }
}

function splitPageRecipeForPlan(recipeContext) {
  return {
    startingPoint: recipeContext.startingPoint,
    assemblyOrder: [
      'page header (outside split workspace)',
      'split workspace carrier',
      'left tree region',
      'right QueryFilter',
      'right table/pagination',
    ],
    requiredAssets: recipeContext.requiredAssets,
    forbiddenMoves: [
      'move the page header into the split workspace or right list panel',
      'replace the split workspace carrier with ad hoc flex containers',
      'replace the right-side QueryFilter with loose SearchForm wrappers',
      'let outer shells or split panes steal table/list scroll ownership',
    ],
    slotFillPolicy: 'fill only governed tree, QueryFilter, table, and controlled extension regions',
    regionOwnership: ['page-header', 'split-workspace', 'left-tree', 'right-query-filter', 'right-table'],
    inlineChecks: [
      'page header stays outside the split workspace',
      'left tree remains the hierarchy/navigation owner',
      'right QueryFilter remains the managed search carrier for the list region',
      'right table and pagination keep the canonical list ownership chain',
    ],
  }
}

function analyticsPageRecipeForPlan(recipeContext) {
  return {
    startingPoint: recipeContext.startingPoint,
    assemblyOrder: [
      'chartUsageContract',
      'analysis layout',
      'chart mapping',
      'stat/compare blocks',
      'legend/tooltip/axis checks',
    ],
    requiredAssets: uniqueValues([...recipeContext.requiredAssets, 'chartUsageContract']),
    forbiddenMoves: [
      'create a free-form chart wall',
      'replace chart components with static images',
      'use default chart-library themes instead of managed analytics tokens',
    ],
    slotFillPolicy: 'fill analytics content only through chart-aware regions and approved stat blocks',
    regionOwnership: ['analytics-shell', 'analysis-layout', 'chart-region', 'stat-region'],
    inlineChecks: [
      'every chart answers a stated business question',
      'analysis layout preserves reading flow',
      'legend, tooltip, and axis rules remain aligned with analytics tokens',
    ],
  }
}

function editPageRecipeForPlan(recipeContext) {
  const isDrawerPage = recipeContext.pageTypeId === 'drawer-form' || recipeContext.pageTypeId === 'drawer-detail'
  const isFullPage = recipeContext.pageTypeId === 'full-page-edit' || recipeContext.pageTypeId === 'full-page-detail'

  return {
    startingPoint: recipeContext.startingPoint,
    assemblyOrder: isDrawerPage
      ? [
          'drawer shell',
          'drawer header',
          'primary form/detail body',
          'drawer footer actions',
        ]
      : [
          'page header / back navigation',
          'primary form/detail body',
          'secondary information region',
          'footer actions',
        ],
    requiredAssets: recipeContext.requiredAssets,
    forbiddenMoves: [
      'replace the managed carrier with ad hoc layout containers',
      ...(isDrawerPage
        ? ['rebuild a drawer page as a generic page container or nested cards']
        : []),
      ...(isFullPage
        ? ['move page header, back navigation, or footer actions into the form/detail body']
        : []),
      'move action ownership outside the managed footer or action bar',
      'add free-form body regions that bypass slot boundaries',
    ],
    slotFillPolicy: 'fill only approved form/detail slots and controlled secondary regions',
    regionOwnership: isDrawerPage
      ? ['drawer-shell', 'drawer-header', 'primary-region', 'drawer-footer']
      : ['page-header', 'primary-region', 'secondary-region', 'action-bar'],
    inlineChecks: [
      ...(isDrawerPage
        ? [
            'one drawer shell remains the outer owner',
            'drawer header/body/footer keep their managed ownership chain',
          ]
        : ['page header and back navigation stay outside the form/detail body']),
      'primary form/detail region keeps ownership',
      'submit or action flow stays aligned with the managed pattern',
    ],
  }
}

function feedbackPageRecipeForPlan(recipeContext) {
  return {
    startingPoint: recipeContext.startingPoint,
    assemblyOrder: ['shell', 'status panel', 'secondary guidance', 'action region'],
    requiredAssets: recipeContext.requiredAssets,
    forbiddenMoves: [
      'replace the managed feedback panel with loose primitives',
      'move action ownership outside the managed action region',
      'invent ungoverned secondary blocks',
    ],
    slotFillPolicy: 'fill business guidance and actions only inside approved feedback regions',
    regionOwnership: ['shell', 'status-panel', 'secondary-guidance', 'action-region'],
    inlineChecks: [
      'status panel remains the focal region',
      'secondary guidance stays subordinate to the result state',
      'actions remain inside the managed action region',
    ],
  }
}

function fallbackRecipeForPlan(recipeContext) {
  return {
    startingPoint: recipeContext.startingPoint,
    assemblyOrder: [
      'resolve managed skeleton',
      'fill approved business regions',
      'run required gates',
      'preflight',
    ],
    requiredAssets: recipeContext.requiredAssets,
    forbiddenMoves: [
      'fall back to a blank page',
      'invent shell or region ownership by hand',
      'bypass managed gates before delivery confirmation',
    ],
  }
}

function generationRecipeForPlan({
  analyticsContractRequired,
  generationStrategy,
  pageComponent,
  pageTypeId,
  pageUnits,
  primaryGenerationAsset,
  runtimeBridgeProfile,
  startFrom,
}) {
  const resolvedPageTypeId = firstResolvedPageTypeId(pageUnits, pageTypeId)
  const recipeContext = {
    pageTypeId: resolvedPageTypeId,
    startingPoint: recipeStartingPointForPlan({
      generationStrategy,
      primaryGenerationAsset,
      startFrom,
    }),
    requiredAssets: recipeRequiredAssetsForPlan({
      analyticsContractRequired,
      pageComponent,
      primaryGenerationAsset,
      runtimeBridgeProfile,
      startFrom,
    }),
  }

  if (normalizedGenerationStrategyId(generationStrategy) === 'managed-analytics' || ANALYTICS_PAGE_TYPES.has(resolvedPageTypeId)) {
    return analyticsPageRecipeForPlan(recipeContext)
  }

  if (TABLE_RECIPE_PAGE_TYPES.has(resolvedPageTypeId)) {
    return tablePageRecipeForPlan(recipeContext)
  }

  if (SPLIT_RECIPE_PAGE_TYPES.has(resolvedPageTypeId)) {
    return splitPageRecipeForPlan(recipeContext)
  }

  if (EDIT_RECIPE_PAGE_TYPES.has(resolvedPageTypeId)) {
    return editPageRecipeForPlan(recipeContext)
  }

  if (FEEDBACK_RECIPE_PAGE_TYPES.has(resolvedPageTypeId)) {
    return feedbackPageRecipeForPlan(recipeContext)
  }

  return fallbackRecipeForPlan(recipeContext)
}

function blockingIssueCode(reason) {
  const text = String(reason || '')
  if (text.includes('missing pageType')) return 'MISSING_PAGE_TYPE'
  if (text.includes('unknown pageType')) return 'PLAN_INVALID'
  if (text.includes('runtime bridge profile is missing')) return 'RUNTIME_BRIDGE_PROFILE_MISSING'
  if (text.includes('runtime bridge component shell could not be resolved')) return 'RUNTIME_BRIDGE_SOURCE_UNRESOLVED'
  if (text.includes('example gallery') || text.includes('src/typical-page-reuse')) {
    return 'ROUTE_OWNER_MISSING'
  }
  if (text.includes('composite layout')) return 'PLAN_BLOCKED'
  return 'PLAN_BLOCKED'
}

function blockingIssuesForReasons(reasons) {
  return reasons.map((reason) => ({
    code: blockingIssueCode(reason),
    source: 'plan',
    message: reason,
    blocking: true,
    autoFixable: false,
  }))
}

function contractFieldsNeeded({ analyticsContractRequired, generationStrategy, layoutArchetype, mode, pageComponent, pageTypeId, runtimeBridgeProfile, taskLevel }) {
  if (taskLevel.id === 'minor-edit') {
    return ['reuseExistingContract']
  }

  const fields = [
    'generatedPagePath',
    'pageTypeId',
    'archetypeMode',
    'examplePath',
    'hostArchetypePath',
    'regionMapping',
    'ownershipMode',
    'ownershipMapping',
    'layoutStrategy',
    'layoutArchetype',
    'workflow',
  ]

  if (
    ['rules-only', 'legacy-host-compatible'].includes(mode) &&
    LIST_SHELL_PAGE_TYPES.has(pageTypeId)
  ) {
    fields.push('shellInheritanceStrategy', 'shellCarrierPath')
  }

  if (layoutArchetype === 'context-main-split') {
    fields.push('splitShellInheritanceStrategy', 'splitShellCarrierPath')
  }

  if (pageComponent?.selected) {
    fields.push(
      'pageComponentId',
      'baseMoldId',
      'componentCertificationRef',
      'pageInstanceValidationStatus',
      'extensionPolicy'
    )
  }

  if (runtimeBridgeProfile) {
    fields.push(
      'runtimeBridgeProfileId',
      'runtimeBridgeDeliveryMode',
      'runtimeComponentSource',
      'runtimeBridgeWrapperTemplate',
      'runtimeBridgeSlotAdapterTemplate'
    )
  }

  if (analyticsContractRequired || normalizedGenerationStrategyId(generationStrategy) === 'managed-analytics') {
    fields.push(
      'generationStrategy',
      'analyticsContractRequired',
      'chartUsageContract',
      'analyticsLayoutStrategy',
      'chartTokenPolicy'
    )
  }

  return Array.from(new Set(fields))
}

async function buildPlan(options) {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const { manifest } = await loadPageTypeManifest({ skillRoot, line: options.line })
  const intentUnits = inferIntentUnits(options.change, options.pageTypeId)
  const topology = inferTopology({
    changeText: options.change,
    explicitPageTypeId: options.pageTypeId,
    intentUnits,
  })
  const rawPageUnits = intentUnitsToPageUnits({ intentUnits, manifest })
  const primaryPageUnit = rawPageUnits.length === 1 ? rawPageUnits[0] : null
  const effectivePageTypeId = options.pageTypeId || primaryPageUnit?.pageType.id || ''
  const pageType = effectivePageTypeId
    ? manifest.pageTypes.find((item) => item.id === effectivePageTypeId)
    : null
  const hostProfile = await detectHostProfile(options.target)
  const pkg = (await readTargetPackageJson(options.target)) || hostProfile.pkg
  const projectModeFact = await readProjectModeFact(options.target)
  const pageFact = await readExistingPageFact(options.target, options.page)
  const mode = inferMode(pkg, hostProfile, options.mode, projectModeFact)
  const projectCapabilities = buildProjectCapabilities({ targetRoot: options.target, skillRoot, modeOverride: mode.id })
  const pageUnits = await attachStartFromToPageUnits({
    mode: mode.id,
    pageUnits: rawPageUnits,
    skillRoot,
  })
  const taskLevel = inferTaskLevel(options.change, effectivePageTypeId)
  const i18nMode = inferI18nMode(options.change, pkg)
  const blockingReasons = []
  const routeOwnershipBlockingReason = pageFact?.page
    ? getTypicalPageReuseBlockingReason(pageFact.page)
    : ''

  if (options.pageTypeId && !pageType) {
    blockingReasons.push(`unknown pageType: ${options.pageTypeId}`)
  }

  if (routeOwnershipBlockingReason) {
    blockingReasons.push(routeOwnershipBlockingReason)
  }

  if (
    taskLevel.id === 'new-page-or-rearchitecture' &&
    topology.id === 'unresolved' &&
    !effectivePageTypeId
  ) {
    blockingReasons.push('missing pageType')
  }

  if (topology.id === 'single-page-composite' && pageUnits.length > 1) {
    blockingReasons.push('composite layout requires explicit split/composite contract before implementation')
  }

  const archetype = pageType
    ? await loadArchetypeDefinition({ skillRoot, pageTypeId: pageType.id })
    : null
  const isNonTypical = topology.id === 'non-typical-overlay' && taskLevel.id !== 'minor-edit'
  const layoutArchetype = topology.id === 'single-page-composite'
    ? 'context-main-split'
    : isNonTypical
      ? 'unknown'
      : 'typical-page'
  const fastPath = inferFastPath({
    changeText: options.change,
    mode: mode.id,
    pageTypeId: pageType?.id || effectivePageTypeId,
    pageUnits,
    taskLevel,
    isNonTypical,
    i18nMode,
    topology,
  })
  const deliveryLevel = inferDeliveryLevel({
    changeText: options.change,
    deliveryLevel: options.deliveryLevel,
    fastPath,
    pageTypeId: pageType?.id || effectivePageTypeId,
    pageUnits,
    taskLevel,
    topology,
  })
  const pageTypeIdsForDocs = pageUnits.length > 0
    ? pageUnits.map((unit) => unit.pageType.id).filter(Boolean)
    : [pageType?.id || effectivePageTypeId].filter(Boolean)
  const pageTypeIdForContract = pageTypeIdsForDocs[0] || ''
  const pageComponent = selectPageComponentForPlan({
    mode: mode.id,
    pageTypeId: pageTypeIdForContract,
    pageUnits,
    skillRoot,
    targetRoot: options.target,
    taskLevel,
    topology,
    legacyHostFamily: projectCapabilities.legacyHostFamily,
  })
  const runtimeBridgeProfile = runtimeBridgeProfileForPlan({
    mode: mode.id,
    pageComponent,
    skillRoot,
    targetRoot: options.target,
  })
  const extensionPolicy = extensionPolicyForPageComponent({ pageComponent })
  const generationStrategy = inferGenerationStrategy({
    fastPath,
    mode: mode.id,
    pageComponent,
    pageTypeId: pageTypeIdForContract,
    pageUnits,
    runtimeBridgeProfile,
    taskLevel,
    topology,
  })
  const usesPageUnitStart = pageUnits.length > 1 && topology.id !== 'non-typical-overlay'
  const resolvedPageTypeId = pageType?.id || effectivePageTypeId || primaryPageUnit?.pageType.id || ''
  const resolvedPageTypeLabel = pageType?.label || primaryPageUnit?.pageType.label || ''
  const resolvedPageTypeSource = options.pageTypeId
    ? 'explicit'
    : primaryPageUnit?.pageType.source || ''
  const startFrom = usesPageUnitStart
    ? {
        id: 'page-units',
        source: 'multi-page-workflow',
        templatePath: '',
        examplePath: '',
        hostArchetypePath: '',
        reason: 'start asset is resolved per pageUnits item',
      }
    : pageType
      ? startFromForLegacyPageComponent({
          generationStrategy,
          mode: mode.id,
          pageComponent,
        }) ||
        inferStartFrom({
          archetype,
          mode: mode.id,
          pageType,
          templatePath: await resolveTemplatePath({
            mode: mode.id,
            pageTypeId: pageType.id,
            skillRoot,
          }),
        })
      : inferStartFrom({ archetype: null, mode: mode.id, pageType: null, templatePath: '' })
  const generationProfile = generationProfileForPlan({
    deliveryLevel,
    extensionPolicy,
    generationStrategy,
    mode: mode.id,
    pageComponent,
    pageFact,
    pageTypeId: pageTypeIdForContract,
    pageUnits,
    runtimeBridgeProfile,
    skillRoot,
    startFrom,
    taskLevel,
    topology,
  })
  const customizationLevel = classifyCustomizationLevel({
    generationStrategy,
    pageComponent,
    taskLevel,
    topology,
  })
  const analyticsContractRequired = analyticsContractRequiredForPlan({
    generationStrategy,
    pageTypeId: pageTypeIdForContract,
    pageUnits,
  })
  const primaryGenerationAsset = primaryGenerationAssetForPlan({
    generationStrategy,
    pageComponent,
    pageTypeId: pageTypeIdForContract,
    runtimeBridgeProfile,
    skillRoot,
    startFrom,
  })
  const fallbackGenerationAsset = fallbackGenerationAssetForPlan({
    generationStrategy,
    pageComponent,
    startFrom,
  })
  const generationRecipe = generationRecipeForPlan({
    analyticsContractRequired,
    generationStrategy,
    pageComponent,
    pageTypeId: pageTypeIdForContract,
    pageUnits,
    primaryGenerationAsset,
    runtimeBridgeProfile,
    startFrom,
  })
  const pageTypeDocs = docsForPageTypes({ manifest, pageTypeIds: pageTypeIdsForDocs })
  const suggestedPageTypes = Array.from(
    new Set(
      intentUnits
        .flatMap((unit) => unit.candidatePageTypes || [])
        .filter(Boolean)
    )
  )
  const requiredCommands = routeOwnershipBlockingReason
    ? [
        {
          script: 'resolve-business-route-target',
          args: ['--page src/pages/<business-page>/index.jsx'],
          when: 'before any start-page, preflight, or write-contract command; current --page belongs to the example gallery/smoke baseline',
        },
      ]
    : requiredCommandsForTask({
        deliveryLevel,
        generationStrategy,
        mode: mode.id,
        pageFact,
        pageTypeId: pageTypeIdForContract,
        pageUnits,
        taskLevel,
        topology,
      })
  const formalAcceptanceCommands = formalAcceptanceCommandsForTask({
    deliveryLevel,
    taskLevel,
    topology,
    pageUnits,
  })
  const acceptanceProfile = acceptanceProfileForDeliveryLevel(deliveryLevel, formalAcceptanceCommands)
  const deliverySummaryProfile = deliverySummaryProfileForPlan({
    acceptanceProfile,
    generationStrategy,
    mode: mode.id,
  })
  const targetPage = pageFact
    ? {
        path: pageFact.page,
        page: pageFact.page,
        exists: pageFact.exists,
        routeOwnership: pageFact.routeOwnership,
        sourcePageTypeId: pageFact.sourcePageTypeId,
        contractPageTypeId: pageFact.contract?.pageTypeId || '',
        contractWorkflowStatus: pageFact.contract?.workflowStatus || '',
        pageTypeMigration: isSingleTypicalPageTarget({ topology, pageUnits }) &&
          Boolean(pageFact.contract?.pageTypeId && pageTypeIdForContract) &&
          pageFact.contract.pageTypeId !== pageTypeIdForContract,
      }
    : null
  const assetResolution = assetResolutionForPlan({
    generationStrategy,
    pageComponent,
    primaryGenerationAsset,
    runtimeBridgeProfile,
    startFrom,
  })
  const facts = factsForPlan({
    assetResolution,
    mode,
    projectCapabilities,
    targetPage,
  })
  const allBlockingReasons = Array.from(new Set([
    ...blockingReasons,
    ...facts.blockingReasons,
  ]))
  const planStatus = allBlockingReasons.length > 0 ? 'blocked' : 'ready'
  const requiredActions = actionsForCommands(requiredCommands)
  const formalAcceptanceActions = actionsForCommands(formalAcceptanceCommands, {
    required: acceptanceProfile.formalRequired,
  })
  facts.requiredAgentChecks = Array.from(new Set([
    ...requiredActions.map((action) => action.command).filter(Boolean),
    ...formalAcceptanceActions.map((action) => action.command).filter(Boolean),
    ...conditionalCommandsForTask({
      deliveryLevel,
      taskLevel,
      topology,
      pageUnits,
    }).map((command) => command.script).filter(Boolean),
  ]))
  const blockingIssues = blockingIssuesForReasons(allBlockingReasons)

  return {
    schemaVersion: 'page-task-plan.v1',
    status: planStatus,
    version: 1,
    contractVersion: CONTRACT_VERSION,
    taskLevel,
    deliveryLevel,
    facts,
    projectMode: mode,
    projectCapabilities,
    assetResolution,
    mode,
    topology,
    intentUnits,
    pageUnits,
    pageType: {
      id: usesPageUnitStart ? '' : resolvedPageTypeId,
      label: usesPageUnitStart ? '' : resolvedPageTypeLabel,
      source: usesPageUnitStart
        ? 'multi-page-request'
        : resolvedPageTypeSource,
    },
    isNonTypical,
    layoutOverlayRequired: isNonTypical || topology.id === 'single-page-composite',
    fastPath,
    generationStrategy,
    generationStrategyId: normalizedGenerationStrategyId(generationStrategy),
    generationProfile,
    generationRecipe,
    primaryGenerationAsset,
    fallbackGenerationAsset,
    customizationLevel,
    analyticsContractRequired,
    pageComponent,
    extensionPolicy,
    i18nMode,
    pageTypeDocs,
    startFrom,
    requiredDocs: requiredDocsForPlan({
      fastPath,
      i18nMode,
      isNonTypical,
      manifest,
      mode: mode.id,
      modeSource: mode.source,
      pageComponent,
      pageTypeIds: pageTypeIdsForDocs,
      taskLevel,
      topology,
    }),
    requiredActions,
    requiredCommands,
    acceptanceLevel: acceptanceLevelForDeliveryLevel(deliveryLevel),
    acceptanceProfile,
    acceptanceReasons: acceptanceReasonsForDeliveryLevel(deliveryLevel),
    deliverySummaryProfile,
    finalReportContract: finalReportContractForAcceptanceProfile(acceptanceProfile),
    formalAcceptanceActions,
    formalAcceptanceCommands,
    conditionalCommands: conditionalCommandsForTask({
      deliveryLevel,
      taskLevel,
      topology,
      pageUnits,
    }),
    contractFieldsNeeded: contractFieldsNeeded({
      analyticsContractRequired,
      generationStrategy,
      layoutArchetype,
      mode: mode.id,
      pageComponent,
      pageTypeId: pageTypeIdForContract,
      runtimeBridgeProfile,
      taskLevel,
    }),
    ...(runtimeBridgeProfile ? { runtimeBridgeProfile } : {}),
    kickoffSkeleton: {
      deliveryLevel: deliveryLevel.id,
      mode: mode.id,
      pageType: usesPageUnitStart ? '' : resolvedPageTypeId,
      topology: topology.id,
      pageUnits: pageUnits.map((unit) => ({
        id: unit.id,
        role: unit.role,
        pageType: unit.pageType.id,
      })),
      taskLevel: taskLevel.id,
      examplePath: archetype?.archetype?.examplePath || pageType?.assetExamplePath || '',
      templateDir: archetype?.archetype?.modeAdapters?.[mode.id]?.templateDir || '',
      startFrom: startFrom.id,
      generationStrategy: normalizedGenerationStrategyId(generationStrategy),
      generationRecipe: {
        startingPoint: generationRecipe.startingPoint,
        assemblyOrder: generationRecipe.assemblyOrder,
        requiredAssets: generationRecipe.requiredAssets,
      },
      primaryGenerationAsset: {
        type: primaryGenerationAsset.type,
        id: primaryGenerationAsset.id,
        status: primaryGenerationAsset.status,
      },
      fallbackGenerationAsset: {
        type: fallbackGenerationAsset.type,
        id: fallbackGenerationAsset.id,
        status: fallbackGenerationAsset.status,
        trigger: fallbackGenerationAsset.trigger,
      },
      customizationLevel,
      analyticsContractRequired,
      deliverySummaryProfile: deliverySummaryProfile.id,
      pageComponent: {
        selected: pageComponent.selected,
        componentId: pageComponent.componentId,
        source: pageComponent.source,
      },
      ...(runtimeBridgeProfile
        ? {
            runtimeBridgeProfile: {
              profileId: runtimeBridgeProfile.profileId,
              status: runtimeBridgeProfile.status,
              runtimeComponentSource: runtimeBridgeProfile.runtimeAssetSource?.componentShell || '',
            },
          }
        : {}),
      extensionPolicy: {
        status: extensionPolicy.status,
        maxLightweightLevel: extensionPolicy.maxLightweightLevel,
      },
      fastPath: fastPath.eligible,
      i18nMode: i18nMode.id,
    },
    runtimeSmokePlan: {
      required: deliveryLevel.id === 'C'
        ? true
        : taskLevel.id === 'minor-edit'
        ? false
        : pageUnits.length > 0
          ? pageUnits.some((unit) => unit.pageType.id === 'data-visualization')
          : (pageType?.id || effectivePageTypeId) === 'data-visualization',
      command: 'typical-page:runtime-smoke --page <new-page> --url <url>',
    },
    usagePolicy: {
      mode: 'follow-workspace-policy',
      source: 'PRIVACY.md',
      previewReadyRequired: taskLevel.id !== 'minor-edit',
      requireNetworkAuthorization: 'when usage script exits 21',
    },
    factsSource: {
      projectCapabilities: projectCapabilities.schemaVersion,
      mode: mode.factPath || (mode.source === 'explicit' ? 'cli:--mode' : 'rules/mode-selection.md'),
      pageTypes: 'rules/common.page-types.json',
      archetypes: 'archetypes/page-types/*/archetype.json',
      usagePolicy: 'PRIVACY.md',
    },
    targetPage,
    canStartImplementation: allBlockingReasons.length === 0,
    blockingReasons: allBlockingReasons,
    blockingIssues,
    suggestedPageTypes,
    decisionTracePath: '',
  }
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const plan = await buildPlan(options)

    if (options.json) {
      console.log(JSON.stringify(plan, null, 2))
      return
    }

    console.log('HiUI page task plan:')
    console.log(`- execution chain: ${plan.deliveryLevel.id} (${plan.deliveryLevel.label})`)
    console.log(`- task level: ${plan.taskLevel.id}`)
    console.log(`- mode: ${plan.mode.id}`)
    console.log(`- topology: ${plan.topology.id}`)
    console.log(`- page type: ${plan.pageType.id || '(missing)'}`)
    if (plan.pageUnits.length > 0) {
      console.log(`- page units: ${plan.pageUnits.map((unit) => `${unit.id}:${unit.pageType.id}`).join(', ')}`)
    }
    console.log(`- fast path: ${plan.fastPath.eligible ? 'yes' : 'no'}`)
    console.log(`- generation recipe start: ${plan.generationRecipe?.startingPoint || '(missing)'}`)
    if (Array.isArray(plan.generationRecipe?.assemblyOrder)) {
      console.log(`- generation recipe order: ${plan.generationRecipe.assemblyOrder.join(' -> ')}`)
    }
    console.log(`- i18n mode: ${plan.i18nMode.id}`)
    console.log(`- can start implementation: ${plan.canStartImplementation}`)
    if (plan.blockingReasons.length > 0) {
      console.log(`- blocking reasons: ${plan.blockingReasons.join('; ')}`)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`plan-page-task failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

main()
