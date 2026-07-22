import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { buildPlan } from '../plan-page-task.mjs'
import { resolveDeliveryBindingStatus } from '../../core/generators/delivery-status.mjs'

const INTERNAL_BUFFER_BYTES = 16 * 1024 * 1024
const PAGE_FILE_EXTENSIONS = new Set(['.jsx', '.tsx'])

export const LEGACY_LIGHTWEIGHT_PUBLIC_COMMANDS = Object.freeze([
  'typical-page:legacy:new',
  'typical-page:legacy:rewrite',
])

function normalizeOptionalString(value) {
  const normalized = String(value || '').trim()
  return normalized ? normalized : ''
}

function normalizePagePath(pagePath) {
  const normalized = normalizeOptionalString(pagePath).replace(/\\/g, '/')
  if (!normalized) {
    return ''
  }

  const ext = path.extname(normalized)
  if (PAGE_FILE_EXTENSIONS.has(ext)) {
    return normalized
  }

  return `${normalized.replace(/\/$/, '')}/index.tsx`
}

export function parseLegacyLightweightArgs(argv) {
  const options = {
    page: '',
    change: '',
    pageTypeId: '',
    target: process.cwd(),
    line: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (!arg.startsWith('--')) {
      throw new Error(`Unknown argument: ${arg}`)
    }

    const value = argv[index + 1]
    if (value === undefined || value.startsWith('--')) {
      throw new Error(`Missing value for ${arg}`)
    }

    if (arg === '--page') options.page = value
    else if (arg === '--change') options.change = value
    else if (arg === '--page-type') options.pageTypeId = value
    else if (arg === '--target') options.target = value
    else if (arg === '--line') options.line = value
    else throw new Error(`Unknown argument: ${arg}`)

    index += 1
  }

  if (!options.page) {
    throw new Error('Missing required argument: --page')
  }

  if (!options.change) {
    throw new Error('Missing required argument: --change')
  }

  options.page = normalizePagePath(options.page)
  options.target = path.resolve(options.target)
  return options
}

function resolveDeliveryPlugin(plan) {
  const candidates = Array.isArray(plan?.pageComponent?.candidates) ? plan.pageComponent.candidates : []
  const overlayCandidates = candidates.filter((candidate) => candidate?.projectOverlay === true)
  const selected =
    overlayCandidates.find((candidate) => candidate?.available === true) || overlayCandidates[0] || null

  if (!selected) {
    return {
      id: '',
      status: 'missing',
      source: '',
    }
  }

  return {
    id: normalizeOptionalString(selected.componentId),
    status: selected.available === true ? 'available' : 'blocked',
    source: normalizeOptionalString(selected.registryKind || selected.source || 'project-delivery-plugin-overlay'),
  }
}

function summarizeBlockingReason(plan, fallbackReason = '') {
  const blockerCode = Array.isArray(plan?.currentExecutionState?.blockerCodes)
    ? normalizeOptionalString(plan.currentExecutionState.blockerCodes[0])
    : ''
  const blockingIssue = Array.isArray(plan?.blockingIssues) ? plan.blockingIssues[0] : null
  const blockingReason = Array.isArray(plan?.blockingReasons)
    ? normalizeOptionalString(plan.blockingReasons[0])
    : ''

  if (blockerCode === 'MANAGED_INSTANCE_MIGRATION_REQUIRED') {
    return '当前旧页面还不是可安全重写的标准页面实例，缺少 managed contract/source/shell/reference 证据。'
  }

  if (blockingReason === 'missing pageType') {
    return '当前输入无法唯一识别页型，双入口不会猜测页型。'
  }

  if (blockingReason.startsWith('unknown pageType:')) {
    return `传入的 --page-type 不受支持：${blockingReason.replace('unknown pageType:', '').trim()}。`
  }

  if (blockingReason.includes('composite layout requires explicit split/composite contract')) {
    return '当前任务命中了组合页或非典型布局，双入口只覆盖单页典型页。'
  }

  if (blockingIssue?.message) {
    return blockingIssue.message
  }

  if (blockingReason) {
    return blockingReason
  }

  return fallbackReason || '当前条件还不足以安全走标准组件重写主链。'
}

function summarizeNextAction({ commandName, plan, pageTypeId, fallbackAction = '' }) {
  const blockerCode = Array.isArray(plan?.currentExecutionState?.blockerCodes)
    ? normalizeOptionalString(plan.currentExecutionState.blockerCodes[0])
    : ''
  const blockingReason = Array.isArray(plan?.blockingReasons)
    ? normalizeOptionalString(plan.blockingReasons[0])
    : ''

  if (blockerCode === 'MANAGED_INSTANCE_MIGRATION_REQUIRED') {
    return `先补齐当前页面的 managed instance 标记，再重新运行 \`${commandName}\`。`
  }

  if (blockingReason === 'missing pageType') {
    return `补充唯一 \`--page-type\` 后重新运行 \`${commandName}\`。`
  }

  if (blockingReason.startsWith('unknown pageType:')) {
    return '改用受支持的典型页 page type 后重试。'
  }

  if (blockingReason.includes('composite layout requires explicit split/composite contract')) {
    return '将任务收窄成单页典型页，或改走维护者专项流程。'
  }

  if (pageTypeId) {
    return `修复阻断事实后，按 \`${pageTypeId}\` 重新运行 \`${commandName}\`。`
  }

  return fallbackAction || `修复阻断事实后重新运行 \`${commandName}\`。`
}

function buildResultBase({ commandName, plan, deliveryPlugin }) {
  return {
    command: commandName,
    page: normalizeOptionalString(plan?.targetPage?.page || plan?.targetPage?.path || ''),
    pageType: normalizeOptionalString(plan?.pageType?.id),
    selectedResultAsset: normalizeOptionalString(plan?.primaryGenerationAsset?.id),
    selectedDeliveryPlugin: normalizeOptionalString(deliveryPlugin.id),
  }
}

function buildBlockedResult({
  commandName,
  plan,
  deliveryPlugin,
  primaryReason,
  nextAction,
}) {
  return {
    ...buildResultBase({ commandName, plan, deliveryPlugin }),
    status: 'blocked',
    primaryReason,
    nextAction,
  }
}

function runStartPage({
  plan,
  pagePath,
  pageTypeId,
  targetRoot,
  intent,
}) {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const startPageScript = path.resolve(scriptDir, '..', 'typical-page-start-page.mjs')
  const args = [
    startPageScript,
    '--page-type',
    pageTypeId,
    '--page',
    pagePath,
    '--mode',
    'legacy-host-compatible',
    '--target',
    targetRoot,
    '--plan-json',
    JSON.stringify(plan),
    '--json',
  ]

  if (intent === 'rewrite') {
    args.push('--force')
  }

  const result = spawnSync(process.execPath, args, {
    cwd: targetRoot,
    encoding: 'utf8',
    maxBuffer: INTERNAL_BUFFER_BYTES,
    env: {
      ...process.env,
      HIUI_DESIGN_ALLOW_LEGACY_PAGEGEN: '1',
      HIUI_DESIGN_SUPPRESS_DEPRECATION_WARNING: '1',
    },
  })

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || '').trim() || 'typical-page:start-page failed')
  }

  try {
    return JSON.parse(result.stdout)
  } catch (error) {
    throw new Error(
      `typical-page:start-page returned non-JSON output: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

function runSilentNodeScript({ scriptName, args, targetRoot }) {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const scriptPath = path.resolve(scriptDir, '..', scriptName)
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: targetRoot,
    encoding: 'utf8',
    maxBuffer: INTERNAL_BUFFER_BYTES,
    env: {
      ...process.env,
      HIUI_DESIGN_SUPPRESS_DEPRECATION_WARNING: '1',
    },
  })

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || '').trim() || `${scriptName} failed`)
  }

  return result.stdout
}

function runInternalLightweightChecks({ plan, pagePath, targetRoot }) {
  const relevantCommands = Array.isArray(plan?.requiredActions)
    ? plan.requiredActions
        .map((action) => normalizeOptionalString(action?.command))
        .filter((command) => command === 'typical-page:slot-gate' || command === 'typical-page:source-gate')
    : []

  for (const command of relevantCommands) {
    if (command === 'typical-page:slot-gate') {
      runSilentNodeScript({
        scriptName: 'typical-page-slot-gate.mjs',
        args: ['--file', pagePath],
        targetRoot,
      })
    }

    if (command === 'typical-page:source-gate') {
      runSilentNodeScript({
        scriptName: 'typical-page-source-gate.mjs',
        args: ['--file', pagePath],
        targetRoot,
      })
    }
  }

  const absolutePagePath = path.resolve(targetRoot, pagePath)
  if (!fs.existsSync(absolutePagePath)) {
    throw new Error(`标准结果资产未成功落盘：${pagePath}`)
  }

  return resolveDeliveryBindingStatus(pagePath)
}

function buildReadyResult({ commandName, plan, deliveryPlugin }) {
  return {
    ...buildResultBase({ commandName, plan, deliveryPlugin }),
    status: 'ready',
  }
}

function printTextResult(result) {
  console.log(`[hiui-design][${result.command}]`)
  console.log(`- page type: ${result.pageType || '(unresolved)'}`)
  console.log(`- standard result asset: ${result.selectedResultAsset || '(missing)'}`)
  console.log(`- delivery plugin: ${result.selectedDeliveryPlugin || '(missing)'}`)
  console.log(`- status: ${result.status}`)

  if (result.status === 'blocked') {
    console.log(`- reason: ${result.primaryReason}`)
    console.log(`- next step: ${result.nextAction}`)
  }
}

export async function runLegacyLightweightSurface({
  argv,
  commandName,
  intent,
}) {
  const options = parseLegacyLightweightArgs(argv)
  const plan = await buildPlan({
    target: options.target,
    page: options.page,
    change: options.change,
    pageTypeId: options.pageTypeId,
    line: options.line,
    mode: 'legacy-host-compatible',
    deliveryLevel: '',
  })

  const deliveryPlugin = resolveDeliveryPlugin(plan)
  const resolvedPageType = normalizeOptionalString(plan?.pageType?.id)
  const resultAsset = normalizeOptionalString(plan?.primaryGenerationAsset?.id)

  if (normalizeOptionalString(plan?.mode?.id) !== 'legacy-host-compatible') {
    const result = buildBlockedResult({
      commandName,
      plan,
      deliveryPlugin,
      primaryReason: '当前项目不是 legacy-host-compatible 主树，这组双入口只服务 legacy 主树。',
      nextAction: '改用标准 `typical-page:init/generate/analytics/verify` 公开命令。',
    })

    if (options.json) {
      console.log(JSON.stringify(result, null, 2))
    } else {
      printTextResult(result)
    }
    return result
  }

  if (!resolvedPageType) {
    const result = buildBlockedResult({
      commandName,
      plan,
      deliveryPlugin,
      primaryReason: summarizeBlockingReason(plan),
      nextAction: summarizeNextAction({ commandName, plan, pageTypeId: resolvedPageType }),
    })

    if (options.json) {
      console.log(JSON.stringify(result, null, 2))
    } else {
      printTextResult(result)
    }
    return result
  }

  if (!resultAsset) {
    const result = buildBlockedResult({
      commandName,
      plan,
      deliveryPlugin,
      primaryReason: '当前页型还没有可用的标准页面组件结果资产，不能安全走模板优先主链。',
      nextAction: summarizeNextAction({
        commandName,
        plan,
        pageTypeId: resolvedPageType,
        fallbackAction: '先补齐标准页面组件资产后再重试。',
      }),
    })

    if (options.json) {
      console.log(JSON.stringify(result, null, 2))
    } else {
      printTextResult(result)
    }
    return result
  }

  if (!deliveryPlugin.id || deliveryPlugin.status !== 'available') {
    const result = buildBlockedResult({
      commandName,
      plan,
      deliveryPlugin,
      primaryReason: '当前项目缺少已认证的 legacy delivery plugin，无法闭合模板实例与宿主绑定证明。',
      nextAction: summarizeNextAction({
        commandName,
        plan,
        pageTypeId: resolvedPageType,
        fallbackAction: '先补齐 certified delivery plugin 后再重试。',
      }),
    })

    if (options.json) {
      console.log(JSON.stringify(result, null, 2))
    } else {
      printTextResult(result)
    }
    return result
  }

  if (plan.status !== 'ready' || plan?.currentExecutionState?.status !== 'ready') {
    const result = buildBlockedResult({
      commandName,
      plan,
      deliveryPlugin,
      primaryReason: summarizeBlockingReason(plan),
      nextAction: summarizeNextAction({ commandName, plan, pageTypeId: resolvedPageType }),
    })

    if (options.json) {
      console.log(JSON.stringify(result, null, 2))
    } else {
      printTextResult(result)
    }
    return result
  }

  try {
    runStartPage({
      plan,
      pagePath: options.page,
      pageTypeId: resolvedPageType,
      targetRoot: options.target,
      intent,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const primaryReason = message.includes('Refusing to overwrite existing scaffold artifacts')
      ? '目标路径已经存在页面实例，`legacy:new` 不会覆盖现有页面。'
      : message
    const nextAction = message.includes('Refusing to overwrite existing scaffold artifacts')
      ? '改用 `typical-page:legacy:rewrite` 重写现有页面，或换一个新的目标路径。'
      : `修复阻断问题后重新运行 \`${commandName}\`。`
    const result = buildBlockedResult({
      commandName,
      plan,
      deliveryPlugin,
      primaryReason,
      nextAction,
    })

    if (options.json) {
      console.log(JSON.stringify(result, null, 2))
    } else {
      printTextResult(result)
    }
    return result
  }

  try {
    const bindingStatus = runInternalLightweightChecks({
      plan,
      pagePath: options.page,
      targetRoot: options.target,
    })

    if (bindingStatus.status !== 'ready') {
      const result = buildBlockedResult({
        commandName,
        plan,
        deliveryPlugin,
        primaryReason:
          bindingStatus.detail || 'legacy delivery binding proof is not ready',
        nextAction: `补齐当前页的 delivery plugin / adapter 证明后，重新运行 \`${commandName}\`。`,
      })

      if (options.json) {
        console.log(JSON.stringify(result, null, 2))
      } else {
        printTextResult(result)
      }
      return result
    }
  } catch (error) {
    const result = buildBlockedResult({
      commandName,
      plan,
      deliveryPlugin,
      primaryReason: error instanceof Error ? error.message : String(error),
      nextAction: `修复结果资产或 slot/source/binding 轻验收失败项后，重新运行 \`${commandName}\`。`,
    })

    if (options.json) {
      console.log(JSON.stringify(result, null, 2))
    } else {
      printTextResult(result)
    }
    return result
  }

  const result = buildReadyResult({
    commandName,
    plan,
    deliveryPlugin,
  })

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    printTextResult(result)
  }

  return result
}
