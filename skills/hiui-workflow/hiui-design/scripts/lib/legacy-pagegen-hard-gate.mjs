import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {
  findManagedPageContractEntry,
  loadRulesOnlyPageContracts,
  normalizeContractPath,
} from './rules-only-page-contracts.mjs'
import { getLegacyPagegenGuidance } from './legacy-pagegen-deprecation.mjs'
import {
  LEGACY_INTEGRATION_SEAL_RELATIVE_PATH,
  PROJECT_INTEGRATION_STATE_RELATIVE_PATH,
} from './project-integration-state.mjs'

const CANONICAL_PAGEGEN_SCRIPTS = Object.freeze([
  'typical-page:init',
  'typical-page:generate',
  'typical-page:analytics',
  'typical-page:verify',
  'typical-page:verify:visual',
])
const PROJECT_MODE_FACT_RELATIVE_PATH = '.local-context/hiui-design/outputs/project-mode.json'

function hasCanonicalPagegenSurface(pkg) {
  const scripts = pkg?.scripts ?? {}
  return CANONICAL_PAGEGEN_SCRIPTS.every(
    (scriptName) => typeof scripts[scriptName] === 'string' && scripts[scriptName].trim()
  )
}

async function readTargetPackageJson(targetRoot) {
  try {
    const raw = await fs.readFile(path.join(targetRoot, 'package.json'), 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function isIntegratedPagegenProject(targetRoot, pkg) {
  if (hasCanonicalPagegenSurface(pkg)) {
    return true
  }

  const integrationFactCandidates = [
    PROJECT_MODE_FACT_RELATIVE_PATH,
    PROJECT_INTEGRATION_STATE_RELATIVE_PATH,
    LEGACY_INTEGRATION_SEAL_RELATIVE_PATH,
  ]

  for (const relativePath of integrationFactCandidates) {
    if (await pathExists(path.join(targetRoot, relativePath))) {
      return true
    }
  }

  return false
}

function isHistoricalManagedPageContractEntry(entry) {
  const contract = entry?.contract ?? {}
  const generatedPagePath = String(contract.generatedPagePath || '').trim()
  const workflow = contract.workflow ?? {}
  const generationProfile = contract.generationProfile ?? {}

  return (
    Boolean(generatedPagePath) &&
    Boolean(String(workflow.status || '').trim()) &&
    (
      String(generationProfile.strategy || '').trim() === 'page-component' ||
      String(generationProfile.legacyStrategyId || '').trim() === 'runtime-bridged-page-component' ||
      String(generationProfile.mode || '').trim() === 'legacy-host-compatible' ||
      String(contract.archetypeMode || '').trim() === 'legacy-host-compatible'
    )
  )
}

function collectPlanPageTargets(plan) {
  const pageTargets = new Set()
  const addPage = (value) => {
    const normalized = String(value || '').trim()
    if (!normalized || normalized.includes('<') || normalized.includes('>')) {
      return
    }

    pageTargets.add(normalized)
  }

  addPage(plan?.targetPage?.path)
  addPage(plan?.targetPage?.page)

  for (const unit of Array.isArray(plan?.pageUnits) ? plan.pageUnits : []) {
    addPage(unit?.path)
    addPage(unit?.page)
  }

  for (const actions of [plan?.requiredActions, plan?.formalAcceptanceActions]) {
    for (const action of Array.isArray(actions) ? actions : []) {
      if (action?.args && typeof action.args === 'object' && !Array.isArray(action.args)) {
        addPage(action.args['--page'])
      }
    }
  }

  return [...pageTargets]
}

function buildLegacyPagegenBlockedError({
  commandName,
  attemptedPages = [],
  historicalPages = [],
  blockReason,
}) {
  const guidance = getLegacyPagegenGuidance(commandName)
  const lines = [
    `[hiui-design][blocked] ${commandName} 默认不再用于当前项目的新页面生成。`,
    '[hiui-design][blocked] 当前项目已启用 lightweight managed pagegen：pnpm typical-page:init -> pnpm typical-page:generate/analytics -> pnpm typical-page:verify(:strict/:visual)。',
    `[hiui-design][blocked] ${blockReason}`,
  ]

  if (attemptedPages.length > 0) {
    lines.push(`[hiui-design][blocked] 目标页：${attemptedPages.join(', ')}`)
  }

  if (historicalPages.length > 0) {
    lines.push(
      `[hiui-design][blocked] 其中以下页面命中了历史 legacy managed-page contract：${historicalPages.join(', ')}`
    )
    lines.push(
      '[hiui-design][blocked] 但命中历史 contract 现在只表示“这是旧账”，不再表示旧页面生成链可以默认继续写入或完成交付。'
    )
  }

  if (guidance?.replacement) {
    lines.push(`[hiui-design][blocked] 改用：${guidance.replacement}`)
  }

  lines.push(
    '[hiui-design][blocked] 旧页面生成链现在默认禁写；只有显式 break-glass 才允许继续执行。确需强制绕过，请设置环境变量 HIUI_DESIGN_ALLOW_LEGACY_PAGEGEN=1。'
  )

  return new Error(lines.join('\n'))
}

export async function enforceLegacyPagegenHardGate({
  commandName,
  targetRoot,
  pagePath = '',
  plan = null,
  argv = [],
}) {
  if (process.env.HIUI_DESIGN_ALLOW_LEGACY_PAGEGEN === '1') {
    return { status: 'override' }
  }

  if (Array.isArray(argv) && argv.includes('--contract-fixture')) {
    return { status: 'fixture' }
  }

  const pkg = await readTargetPackageJson(targetRoot)
  if (!(await isIntegratedPagegenProject(targetRoot, pkg))) {
    return { status: 'inactive' }
  }

  if (commandName === 'typical-page:plan-page-task') {
    return { status: 'planner-readonly-allowed' }
  }

  const contractsResult = await loadRulesOnlyPageContracts(targetRoot)
  const attemptedPages = [
    ...new Set([
      String(pagePath || '').trim(),
      ...collectPlanPageTargets(plan),
    ].filter(Boolean)),
  ]

  if (attemptedPages.length === 0) {
    throw buildLegacyPagegenBlockedError({
      commandName,
      attemptedPages,
      blockReason:
        '未提供可识别的历史 managed-page 路径，旧链路不能再用于抽象规划或新页面起手。',
    })
  }

  const historicalPages = []
  const nonHistoricalPages = []

  for (const attemptedPage of attemptedPages) {
    const normalizedPagePath = normalizeContractPath(targetRoot, attemptedPage)
    const contractEntry = findManagedPageContractEntry(contractsResult.contracts, normalizedPagePath)

    if (contractEntry && isHistoricalManagedPageContractEntry(contractEntry)) {
      historicalPages.push(normalizedPagePath)
    } else {
      nonHistoricalPages.push(normalizedPagePath)
    }
  }

  throw buildLegacyPagegenBlockedError({
    commandName,
    attemptedPages,
    historicalPages,
    blockReason:
      nonHistoricalPages.length > 0
        ? '这些页面没有命中历史 legacy managed-page contract，说明你正在尝试用旧链路开新页，或对未纳入历史兼容范围的页面继续扩张旧流程。'
        : '这些页面虽然命中了历史 legacy managed-page contract，但旧页面生成链已经从“兼容可写”进一步降级为“默认禁写”。',
  })
}
