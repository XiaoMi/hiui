#!/usr/bin/env node

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { evaluateInstallModeCapability } from './lib/install-mode-capability.mjs'
import { formatInstallModeUsage } from './lib/mode-contract.mjs'
import { CliUsageError, isCliUsageError } from './lib/cli-usage-error.mjs'
import { finalizeUsageSession, startUsageSession } from './lib/usage-telemetry.mjs'
import { ensureProjectNodeRuntime } from './lib/project-node-launcher.mjs'
import { runProjectNodeScriptSync } from './lib/project-node-launcher.mjs'

const REGISTRY_ENV = 'HIUI_DESIGN_LCM_REGISTRY'
const LEGACY_REGISTRY_ENV = 'HIUI_DESIGN_OPEN_LCM_REGISTRY'
const GIT_REGISTRY_ENV = 'HIUI_DESIGN_GIT_REGISTRY'
const LEGACY_GIT_REGISTRY_ENV = 'HIUI_DESIGN_OPEN_GIT_REGISTRY'
const DEFAULT_REGISTRY = String(process.env[REGISTRY_ENV] || process.env[LEGACY_REGISTRY_ENV] || '').trim()
const GIT_REGISTRY = String(process.env[GIT_REGISTRY_ENV] || process.env[LEGACY_GIT_REGISTRY_ENV] || '').trim()

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/setup-for-designers.mjs" [--mode <${formatInstallModeUsage()}>] [--line <line-id>] [--install] [--no-install] [--install-timeout-ms <ms>] [--skip-link] [--skip-lcm] [--with-doctor-gate] [--skip-doctor-gate] [--init-i18n] [--telemetry-prompt <text>] [--telemetry-prompt-file <path>]

Default behavior:
  - if lcm exists, initialize project context and link to Cursor when available
  - detect the target project type automatically for adapter guidance
  - auto mode reuses the recorded appliedMode when it exists
  - otherwise auto checks whether the target needs a project-local compatibility bridge: projects on the native carrier path go host-integration, projects that would need a local bridge go rules-only
  - preview examples now stay in the packaged preview runtime; the target project no longer materializes preview assets, and project setup does not auto-start preview
  - run typical-page:preflight first as the generation gate, and stop unless the page-task gate is ready
  - doctor is no longer the default onboarding gate; add --with-doctor-gate only for first-time acceptance, runtime troubleshooting, or formal handoff
  - internationalization baseline is not provisioned by default; add --init-i18n only when the user explicitly asks to connect i18n for this project
  - usage stats can capture the verbatim original user prompt via --telemetry-prompt-file (preferred) or --telemetry-prompt
`)
}

function findRequestedMode(argv) {
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--mode') return argv[i + 1] || ''
  }
  return ''
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeStringArray(value) {
  return Array.isArray(value) ? value.map((item) => normalizeString(item)).filter(Boolean) : []
}

function parseArgs(argv) {
  const passthrough = []
  let skipDoctorGate = false
  let withDoctorGate = false
  let skipLink = false
  let skipLcm = false
  let telemetryPrompt = ''
  let telemetryPromptFile = ''
  const deprecatedArgs = new Set(['--shells-spec'])
  const removedPreviewArgs = new Set([
    '--materialize-preview',
    '--with-host-assets',
    '--dest',
    '--route-file',
    '--force',
  ])

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--') {
      continue
    }

    if (arg === '--skip-doctor-gate') {
      skipDoctorGate = true
      continue
    }

    if (arg === '--with-doctor-gate') {
      withDoctorGate = true
      continue
    }

    if (arg === '--skip-link') {
      skipLink = true
      continue
    }

    if (arg === '--skip-lcm') {
      skipLcm = true
      continue
    }

    if (deprecatedArgs.has(arg)) {
      throw new CliUsageError(
        `${arg} is no longer supported. Managed local runtime dependencies now come from docs/onboarding/managed-local-runtime-dependencies.json, so remove this flag.`
      )
    }

    if (removedPreviewArgs.has(arg)) {
      throw new CliUsageError(
        `${arg} is no longer supported. Preview examples now stay in the packaged preview runtime and are not materialized into target projects.`
      )
    }

    if (
      arg === '--install' ||
      arg === '--no-install' ||
      arg === '--init-i18n'
    ) {
      passthrough.push(arg)
      continue
    }

    if (
      arg === '--mode' ||
      arg === '--line' ||
      arg === '--install-timeout-ms' ||
      arg === '--telemetry-prompt' ||
      arg === '--telemetry-prompt-file'
    ) {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new CliUsageError(`Missing value for ${arg}`)
      }
      if (arg === '--telemetry-prompt') {
        telemetryPrompt = value
        i += 1
        continue
      }
      if (arg === '--telemetry-prompt-file') {
        telemetryPromptFile = value
        i += 1
        continue
      }
      passthrough.push(arg, value)
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new CliUsageError(`Unknown argument: ${arg}`)
  }

  if (skipDoctorGate && withDoctorGate) {
    throw new CliUsageError('Do not pass both --with-doctor-gate and --skip-doctor-gate together')
  }

  return {
    passthrough,
    skipDoctorGate,
    withDoctorGate,
    skipLink,
    skipLcm,
    telemetryPrompt,
    telemetryPromptFile,
  }
}

function info(message) {
  console.log(`✓ ${message}`)
}

function warn(message) {
  console.warn(`⚠ ${message}`)
}

function formatAutoModeRecommendationReason(capability) {
  const hostProfile = capability?.hostProfile || {}
  const framework = normalizeString(hostProfile.framework) || 'unknown-framework'
  const projectType = normalizeString(hostProfile.projectType) || 'unknown-project-type'

  if (capability?.requiresPrivateCompatibilityBridge) {
    return `识别到 ${framework} / ${projectType}，不属于原生兼容载体；若走 host-integration，需要项目本地兼容桥，所以自动模式会推荐 rules-only。`
  }

  return `识别到 ${framework} / ${projectType}，属于原生兼容载体，不需要项目本地兼容桥，所以自动模式会推荐 host-integration。`
}

async function evaluateAutoModeRecommendation(targetRoot) {
  try {
    return await evaluateInstallModeCapability({
      targetRoot,
      ignoreRelativePaths: ['src/typical-page-preview'],
    })
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    warn(`自动模式推荐探测失败：${detail}`)
    return null
  }
}

function runCommand(command, args, { allowFailure = false, capture = false, cwd = process.cwd(), env = process.env } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
  })

  if (result.error) {
    if (allowFailure) return result
    throw result.error
  }

  if ((result.status ?? 1) !== 0 && !allowFailure) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || `${command} ${args.join(' ')} failed`)
  }

  return result
}

function formatCurrentSetupCommand(argv) {
  const suffix = argv.length > 0 ? ` ${argv.join(' ')}` : ''
  return `node ".local-context/hiui-design/scripts/setup-for-designers.mjs"${suffix}`
}

function isLikelySandboxOrRegistryFailure(detail) {
  const text = String(detail || '').toLowerCase()
  return [
    'registry.jsonc',
    'enotfound',
    'eai_again',
    'etimedout',
    'econnrefused',
    'operation not permitted',
    'sandbox',
    'network',
    'fetch failed',
  ].some((pattern) => text.includes(pattern))
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function isUsableSkillRoot(candidateRoot) {
  if (!candidateRoot) return false

  return (
    (await pathExists(path.join(candidateRoot, 'skill.manifest.json'))) &&
    (await pathExists(path.join(candidateRoot, 'scripts', 'apply-in-current-project.mjs'))) &&
    (await pathExists(path.join(candidateRoot, 'scripts', 'typical-page-preflight.mjs')))
  )
}

async function resolveInstalledSkillRoot({ currentSkillRoot }) {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex')
  const candidates = [path.join(codexHome, 'skills', 'hiui-design')]
  const normalizedCurrentSkillRoot = path.resolve(currentSkillRoot)

  for (const candidateRoot of candidates) {
    const normalizedCandidateRoot = path.resolve(candidateRoot)
    if (normalizedCandidateRoot === normalizedCurrentSkillRoot) continue
    if (await isUsableSkillRoot(normalizedCandidateRoot)) {
      return normalizedCandidateRoot
    }
  }

  return ''
}

async function resolveExecutionSkillRoot({ currentSkillRoot, projectRoot }) {
  const projectLocalSkillRoot = path.resolve(projectRoot, '.local-context', 'hiui-design')
  const normalizedCurrentSkillRoot = path.resolve(currentSkillRoot)

  if (normalizedCurrentSkillRoot !== projectLocalSkillRoot) {
    return currentSkillRoot
  }

  const installedSkillRoot = await resolveInstalledSkillRoot({
    currentSkillRoot: normalizedCurrentSkillRoot,
  })
  if (!installedSkillRoot) {
    return currentSkillRoot
  }

  info(`检测到项目本地 hiui-design 副本启动，后续接入脚本将优先复用已安装 skill 包：${installedSkillRoot}`)
  return installedSkillRoot
}

function hasLcm() {
  const result = spawnSync('lcm', ['--version'], { encoding: 'utf8', stdio: 'pipe' })
  return !result.error && (result.status ?? 1) === 0
}

async function ensureLcmInitialized(projectRoot) {
  const rcPath = path.join(projectRoot, '.local-context', '.lcm.rc.jsonc')
  if (await pathExists(rcPath)) {
    info('检测到 .local-context/.lcm.rc.jsonc，跳过 lcm 初始化')
    return { ok: true, skipped: false, reason: '' }
  }

  if (!DEFAULT_REGISTRY) {
    info('未配置开源版 lcm registry，跳过 lcm 初始化')
    return { ok: true, skipped: true, reason: 'no_open_registry_configured' }
  }

  info('初始化 lcm')
  const result = runCommand('lcm', ['init', '--registry', DEFAULT_REGISTRY], {
    allowFailure: true,
    capture: true,
  })

  if ((result.status ?? 1) === 0) {
    return { ok: true, skipped: false, reason: '' }
  }

  const detail = [result.stderr?.trim(), result.stdout?.trim()].filter(Boolean).join('\n')
  return {
    ok: false,
    skipped: true,
    reason: detail || `lcm init --registry ${DEFAULT_REGISTRY} failed`,
  }
}

function ensureRegistryAdded() {
  if (!GIT_REGISTRY) {
    info('未配置开源版共享 registry，跳过 registry add')
    return
  }
  info('添加典型页共享 registry')
  const result = runCommand('lcm', ['registry', 'add', GIT_REGISTRY], { allowFailure: true, capture: true })
  if ((result.status ?? 1) !== 0) {
    warn('registry 可能已存在，继续执行')
  }
}

function ensureCursorLink({ skipLink }) {
  if (skipLink) {
    warn('按 --skip-link 跳过 Cursor link')
    return
  }

  info('建立 Cursor link')
  const result = runCommand('lcm', ['link', '--for', 'cursor', '--yes'], {
    allowFailure: true,
    capture: true,
  })

  if ((result.status ?? 1) !== 0) {
    warn('Cursor link 未成功，稍后可手动执行 lcm link --for cursor --yes')
  }
}

function nestedTelemetryEnv() {
  return {
    ...process.env,
    HIUI_DESIGN_USAGE_NESTED: '1',
  }
}

async function runApplyScript({ applyScript, passthrough, projectRoot }) {
  info('安装典型页规则能力与固定脚本')
  const { result } = await runProjectNodeScriptSync({
    targetRoot: projectRoot,
    scriptPath: applyScript,
    scriptArgs: passthrough,
    cwd: projectRoot,
    env: nestedTelemetryEnv(),
  })

  if (result.error) {
    throw result.error
  }

  if ((result.status ?? 1) !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || `${applyScript} ${passthrough.join(' ')} failed`)
  }
}

function getPassthroughValue(passthrough, name) {
  const index = passthrough.indexOf(name)
  if (index === -1) return ''
  return passthrough[index + 1] || ''
}

async function runDoctorAcceptance({ doctorScript, projectRoot, withDoctorGate, skipDoctorGate, passthrough }) {
  if (!withDoctorGate) {
    if (skipDoctorGate) {
      warn(
        '默认已不再自动执行 doctor；--skip-doctor-gate 当前无需附加，将按 no-op 处理。若需要显式验收，请改用 --with-doctor-gate。'
      )
    }
    info('默认跳过 doctor；如需首次接入验收、运行时排障或正式交付证明，请显式附加 --with-doctor-gate')
    return
  }

  info('执行 typical-page doctor 作为显式验收')
  const doctorArgs = ['--target', projectRoot]
  const mode = getPassthroughValue(passthrough, '--mode')
  const line = getPassthroughValue(passthrough, '--line')
  const dest = getPassthroughValue(passthrough, '--dest')

  if (mode) doctorArgs.push('--mode', mode)
  if (line) doctorArgs.push('--line', line)
  if (dest) doctorArgs.push('--dest', dest)

  const { result } = await runProjectNodeScriptSync({
    targetRoot: projectRoot,
    scriptPath: doctorScript,
    scriptArgs: doctorArgs,
    allowFailure: true,
    capture: true,
    cwd: projectRoot,
    env: nestedTelemetryEnv(),
  })

  if ((result.status ?? 1) === 0) {
    process.stdout.write(result.stdout ?? '')
    info('doctor 通过，当前宿主验收完成')
    return
  }

  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')
  throw new Error(
    'typical-page doctor 未通过。请先修复 doctor 输出中的硬失败项，再继续交付；若当前目标只是打开页面任务门禁，可直接保留 preflight 结论并把 doctor 留到验收阶段。'
  )
}

function buildPreflightArgs({ projectRoot, passthrough }) {
  const args = ['--target', projectRoot, '--json']
  const mode = getPassthroughValue(passthrough, '--mode')
  if (mode) args.push('--mode', mode)
  return args
}

async function executeJsonNodeScript({ targetRoot, scriptPath, scriptArgs }) {
  const { result } = await runProjectNodeScriptSync({
    targetRoot,
    scriptPath,
    scriptArgs,
    capture: true,
    cwd: targetRoot,
    env: nestedTelemetryEnv(),
  })

  try {
    return {
      ok: (result.status ?? 1) === 0,
      result,
      payload: JSON.parse(result.stdout || '{}'),
    }
  } catch (error) {
    if ((result.status ?? 1) !== 0) {
      process.stdout.write(result.stdout ?? '')
      process.stderr.write(result.stderr ?? '')
      return { ok: false, result, payload: null }
    }
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`${scriptPath} 输出不是合法 JSON：${detail}`)
  }
}

function isManagedLegacyWebpackMfLane(hostProfile = {}) {
  const projectType = normalizeString(hostProfile?.projectType)
  const framework = normalizeString(hostProfile?.framework)
  const legacyReactRuntime = hostProfile?.legacyReactRuntime === true
  const hiuiFacts = hostProfile?.hiuiFacts || {}

  return (
    projectType === 'existing-system' &&
    ['webpack-module-federation', 'rspack-module-federation'].includes(framework) &&
    (legacyReactRuntime === true ||
      hiuiFacts.hasLegacyRuntimePackages === true ||
      hiuiFacts.hasMixedRuntimePackages === true)
  )
}

function ensureJsonExecutionPayload(execution, failureMessage) {
  if (execution.payload && typeof execution.payload === 'object') {
    return execution.payload
  }

  if (!execution.ok) {
    throw new Error(failureMessage)
  }

  return {}
}

async function runLegacyReactCompatClosure({ legacyReactCompatScript, projectRoot }) {
  info('检测到老 React 运行时兼容闭环未完成，尝试自动补齐兼容分支')
  const execution = await executeJsonNodeScript({
    targetRoot: projectRoot,
    scriptPath: legacyReactCompatScript,
    scriptArgs: ['--target', projectRoot, '--json'],
  })

  if (!execution.ok) {
    throw new Error('legacy-react-compat-autofix 执行失败。请先修复脚本错误后再继续。')
  }

  const payload = execution.payload || {}
  if (payload.status === 'patched') {
    info('已自动补齐老 React 兼容分支，重新执行 preflight')
    return payload
  }

  if (payload.status === 'already-compatible') {
    info('老 React 兼容分支已存在，重新执行 preflight 复核页面门禁')
    return payload
  }

  const actionHints = collectFailureActionHints(payload)
  throw new Error(
    `老 React 运行时兼容闭环仍未完成。${payload.reason || '请先补齐兼容分支。'}${formatFailureActionHints(
      actionHints
    )}`
  )
}

async function runLegacyHiui5BridgeClosure({ legacyHiui5BridgeScript, projectRoot }) {
  info('检测到老 Webpack/MF 宿主，尝试自动补齐 HiUI5 替换桥')
  const execution = await executeJsonNodeScript({
    targetRoot: projectRoot,
    scriptPath: legacyHiui5BridgeScript,
    scriptArgs: ['--target', projectRoot, '--json'],
  })
  const payload = ensureJsonExecutionPayload(
    execution,
    'legacy-hiui5-bridge-autofix 执行失败。请先修复脚本错误后再继续。'
  )

  if (payload.status === 'patched') {
    info('已自动补齐 HiUI5 替换桥，继续收口旧宿主兼容链')
    return payload
  }

  if (payload.status === 'already-compatible') {
    info('HiUI5 替换桥已存在，继续检查共享合同与依赖隔离')
    return payload
  }

  const actionHints = collectFailureActionHints(payload)
  throw new Error(
    `HiUI5 替换桥仍未补齐。${payload.reason || '请先补齐构建兼容桥。'}${formatFailureActionHints(
      actionHints
    )}`
  )
}

function canSkipLegacyMfSharedContractRepair(payload = {}) {
  const reason = normalizeString(payload.reason)
  return (
    reason === 'No risky legacy MF shared-contract signature was detected.' ||
    reason === 'Target project no longer declares a legacy @hi-ui/hiui runtime; shared-contract repair is not needed.'
  )
}

async function runLegacyMfSharedContractClosure({
  legacyMfSharedContractScript,
  projectRoot,
}) {
  info('复核老 Module Federation 共享合同，必要时自动改成多版本共享')
  const execution = await executeJsonNodeScript({
    targetRoot: projectRoot,
    scriptPath: legacyMfSharedContractScript,
    scriptArgs: ['--target', projectRoot, '--json'],
  })
  const payload = ensureJsonExecutionPayload(
    execution,
    'legacy-mf-shared-contract-autofix 执行失败。请先修复脚本错误后再继续。'
  )

  if (payload.status === 'patched') {
    info('已自动修复旧宿主共享合同，继续做依赖隔离复核')
    return payload
  }

  if (payload.status === 'already-compatible' || canSkipLegacyMfSharedContractRepair(payload)) {
    info('旧宿主共享合同无需额外修复，继续做依赖隔离复核')
    return payload
  }

  const actionHints = collectFailureActionHints(payload)
  throw new Error(
    `旧宿主共享合同仍未收口。${payload.reason || '请先修复共享依赖配置。'}${formatFailureActionHints(
      actionHints
    )}`
  )
}

async function runDependencyIsolationGate({
  dependencyIsolationScript,
  projectRoot,
}) {
  info('执行依赖隔离复核，确认桥接后的运行时版本不会再串线')
  const execution = await executeJsonNodeScript({
    targetRoot: projectRoot,
    scriptPath: dependencyIsolationScript,
    scriptArgs: [
      '--target',
      projectRoot,
      '--json',
      '--allow-pending-managed-local-runtime-materialization',
    ],
  })
  const payload = ensureJsonExecutionPayload(
    execution,
    'dependency-isolation-check 执行失败。请先修复脚本错误后再继续。'
  )

  if (execution.ok && payload.status === 'pass') {
    info('依赖隔离复核通过，继续重新执行 preflight')
    return payload
  }

  const failedDetails = Array.isArray(payload.failed)
    ? payload.failed.map((item) => normalizeString(item?.detail)).filter(Boolean)
    : []
  const requiredManualActions = failedDetails.length > 0
    ? failedDetails
    : [normalizeString(payload.decision?.nextAction) || '请先修复依赖隔离失败项。'].filter(Boolean)

  throw new Error(
    `依赖隔离复核仍未通过。${formatFailureActionHints({
      nextCommand: '',
      requiredManualActions,
    })}`
  )
}

async function runManagedLegacyWebpackMfOnboardingLane({
  legacyHiui5BridgeScript,
  legacyMfSharedContractScript,
  dependencyIsolationScript,
  projectRoot,
}) {
  info('进入老 Webpack Module Federation 受管兼容车道，按顺序补齐构建桥、共享合同和依赖隔离')
  await runLegacyHiui5BridgeClosure({ legacyHiui5BridgeScript, projectRoot })
  await runLegacyMfSharedContractClosure({
    legacyMfSharedContractScript,
    projectRoot,
  })
  await runDependencyIsolationGate({
    dependencyIsolationScript,
    projectRoot,
  })
}

async function runPreflightGate({
  preflightScript,
  legacyReactCompatScript,
  legacyHiui5BridgeScript,
  legacyMfSharedContractScript,
  dependencyIsolationScript,
  projectRoot,
  passthrough,
}) {
  const preflightArgs = buildPreflightArgs({ projectRoot, passthrough })
  let attemptedLegacyReactClosure = false
  let attemptedManagedLegacyLane = false
  const hostProfile = await detectHostProfile(projectRoot, {
    ignoreRelativePaths: ['src/typical-page-preview'],
  })
  const managedLegacyLane = isManagedLegacyWebpackMfLane(hostProfile)

  while (true) {
    info('执行 typical-page preflight 作为页面任务开门检查')
    const execution = await executeJsonNodeScript({
      targetRoot: projectRoot,
      scriptPath: preflightScript,
      scriptArgs: preflightArgs,
    })

    if (!execution.ok) {
      throw new Error('typical-page preflight 执行失败。请先修复脚本错误后再继续。')
    }

    const payload = execution.payload || {}

    const legacyReactCompatibilityClosure =
      payload?.legacyReactCompatibilityClosure &&
      typeof payload.legacyReactCompatibilityClosure === 'object'
        ? payload.legacyReactCompatibilityClosure
        : {}

    if (managedLegacyLane && !attemptedManagedLegacyLane) {
      if (
        !attemptedLegacyReactClosure &&
        legacyReactCompatibilityClosure.status === 'needs-closure' &&
        legacyReactCompatibilityClosure.autofixAvailable === true
      ) {
        attemptedLegacyReactClosure = true
        await runLegacyReactCompatClosure({ legacyReactCompatScript, projectRoot })
        continue
      }

      attemptedManagedLegacyLane = true
      await runManagedLegacyWebpackMfOnboardingLane({
        legacyHiui5BridgeScript,
        legacyMfSharedContractScript,
        dependencyIsolationScript,
        projectRoot,
      })
      continue
    }

    if (payload.status === 'pass') {
      info('preflight 通过，项目级页面任务已放行为 ready-to-generate')
      const runtimeExecution = summarizePreflightRuntimeExecutionHints(payload)
      if (runtimeExecution.environmentReady) {
        info('当前机器执行环境已就绪；后续进入具体页面 brief 时，再补页级执行判断。')
      } else if (runtimeExecution.status) {
        warn(
          `项目门禁已放行，但当前机器执行环境还未就绪（${runtimeExecution.status}）。${runtimeExecution.reason || '请先切到兼容 runtime。'}${runtimeExecution.nextCommand ? ` 下一步：${runtimeExecution.nextCommand}` : ''}`
        )
      }
      return payload
    }

    if (
      !attemptedLegacyReactClosure &&
      legacyReactCompatibilityClosure.status === 'needs-closure' &&
      legacyReactCompatibilityClosure.autofixAvailable === true
    ) {
      attemptedLegacyReactClosure = true
      await runLegacyReactCompatClosure({ legacyReactCompatScript, projectRoot })
      continue
    }

    const actionHints = collectFailureActionHints(payload)
    throw new Error(
      `typical-page preflight 未通过。${payload.pageTaskGate?.reason || payload.reason || '当前宿主兼容基线仍未满足。'}${formatFailureActionHints(
        actionHints
      )}`
    )
  }
}

function collectFailureActionHints(payload = {}) {
  const pageTaskGate =
    payload?.pageTaskGate && typeof payload.pageTaskGate === 'object' ? payload.pageTaskGate : {}
  const legacyReactCompatibilityClosure =
    payload?.legacyReactCompatibilityClosure && typeof payload.legacyReactCompatibilityClosure === 'object'
      ? payload.legacyReactCompatibilityClosure
      : {}
  const requiredManualActions =
    normalizeStringArray(payload.requiredManualActions).length > 0
      ? normalizeStringArray(payload.requiredManualActions)
      : normalizeStringArray(pageTaskGate.requiredManualActions).length > 0
        ? normalizeStringArray(pageTaskGate.requiredManualActions)
        : legacyReactCompatibilityClosure.status === 'needs-closure' &&
            legacyReactCompatibilityClosure.autofixAvailable !== true
          ? normalizeStringArray(legacyReactCompatibilityClosure.recommendedSteps)
          : normalizeStringArray(payload.details)
  const recommendedSteps =
    normalizeStringArray(payload.recommendedSteps).length > 0
      ? normalizeStringArray(payload.recommendedSteps)
      : normalizeStringArray(pageTaskGate.recommendedSteps).length > 0
        ? normalizeStringArray(pageTaskGate.recommendedSteps)
        : requiredManualActions

  return {
    nextCommand:
      normalizeString(payload.nextCommand) || normalizeString(pageTaskGate.nextCommand),
    requiredManualActions,
    recommendedSteps,
  }
}

function formatFailureActionHints({ nextCommand = '', requiredManualActions = [] } = {}) {
  let suffix = ''
  if (nextCommand) {
    suffix += ` 下一步：${nextCommand}`
  }

  if (requiredManualActions.length > 0) {
    suffix += ` 必做项：${requiredManualActions.join('；')}`
  }

  return suffix
}

function summarizePreflightRuntimeExecutionHints(payload = {}) {
  const runtimeExecutionHints =
    payload?.runtimeExecutionHints && typeof payload.runtimeExecutionHints === 'object'
      ? payload.runtimeExecutionHints
      : {}
  const rawExecutionReadiness =
    payload?.executionReadiness && typeof payload.executionReadiness === 'object'
      ? payload.executionReadiness
      : {}
  const runtimeStatus = String(runtimeExecutionHints.status || rawExecutionReadiness.status || '').trim()
  const environmentReady =
    runtimeExecutionHints.environmentReady === true ||
    (!runtimeStatus && payload?.status === 'pass') ||
    runtimeStatus === 'ready'

  return {
    status: runtimeStatus || (environmentReady ? 'ready' : ''),
    environmentReady,
    reason:
      String(runtimeExecutionHints.reason || '').trim() ||
      String(rawExecutionReadiness.reason || '').trim(),
    nextCommand:
      String(runtimeExecutionHints.nextCommand || '').trim() ||
      String(rawExecutionReadiness.nextCommand || '').trim(),
  }
}

function summarizeMfPublishEntryShellHints(payload = {}) {
  const pageTaskGate =
    payload?.pageTaskGate && typeof payload.pageTaskGate === 'object' ? payload.pageTaskGate : {}
  const integrationReadiness =
    pageTaskGate?.integrationReadiness && typeof pageTaskGate.integrationReadiness === 'object'
      ? pageTaskGate.integrationReadiness
      : payload?.integrationReadiness && typeof payload.integrationReadiness === 'object'
        ? payload.integrationReadiness
        : {}
  const publicShell =
    integrationReadiness?.hostCompatibility?.publicShell &&
    typeof integrationReadiness.hostCompatibility.publicShell === 'object'
      ? integrationReadiness.hostCompatibility.publicShell
      : {}
  const mfPublishEntryShell =
    publicShell?.mfPublishEntryShell && typeof publicShell.mfPublishEntryShell === 'object'
      ? publicShell.mfPublishEntryShell
      : {}

  return {
    required:
      publicShell.mfPublishEntryShellRequired === true || mfPublishEntryShell.required === true,
    ready:
      publicShell.mfPublishEntryShellReady === true || normalizeString(mfPublishEntryShell.status) === 'ready',
    reason:
      normalizeString(publicShell.mfPublishEntryShellReason) ||
      normalizeString(mfPublishEntryShell.reason),
    targetEntryPath:
      normalizeString(mfPublishEntryShell.targetEntryPath) ||
      normalizeString(publicShell.targetEntryPath),
  }
}

async function main() {
  let usageSession = null
  let reportMode = 'auto'
  let autoModeRecommendation = null
  let preflightPayload = null

  try {
    const rawArgs = process.argv.slice(2)
    const scriptPath = fileURLToPath(import.meta.url)
    const projectRoot = process.cwd()
    const runtimeReset = await ensureProjectNodeRuntime({
      targetRoot: projectRoot,
      scriptPath,
      scriptArgs: rawArgs,
      preferLoginShell: true,
    })
    if (runtimeReset.reexecuted) {
      process.exit(runtimeReset.exitCode ?? 0)
    }
    const {
      passthrough,
      skipDoctorGate,
      withDoctorGate,
      skipLink,
      skipLcm,
      telemetryPrompt,
      telemetryPromptFile,
    } = parseArgs(rawArgs)
    const requestedMode = findRequestedMode(rawArgs)
    reportMode = requestedMode || 'auto'
    const scriptDir = path.dirname(scriptPath)
    const executionSkillRoot = await resolveExecutionSkillRoot({
      currentSkillRoot: path.resolve(scriptDir, '..'),
      projectRoot,
    })
    const executionScriptDir = path.join(executionSkillRoot, 'scripts')
    const applyScript = path.join(executionScriptDir, 'apply-in-current-project.mjs')
    const doctorScript = path.join(executionScriptDir, 'typical-page-doctor.mjs')
    const preflightScript = path.join(executionScriptDir, 'typical-page-preflight.mjs')
    const legacyReactCompatScript = path.join(executionScriptDir, 'legacy-react-compat-autofix.mjs')
    const legacyHiui5BridgeScript = path.join(executionScriptDir, 'legacy-hiui5-bridge-autofix.mjs')
    const legacyMfSharedContractScript = path.join(executionScriptDir, 'legacy-mf-shared-contract-autofix.mjs')
    const dependencyIsolationScript = path.join(executionScriptDir, 'dependency-isolation-check.mjs')
    const lcmAvailable = hasLcm()
    const rerunCommand = formatCurrentSetupCommand(rawArgs)
    usageSession = await startUsageSession({
      prompt: telemetryPrompt,
      promptFile: telemetryPromptFile,
      reportMode,
      source: 'setup-for-designers',
      targetRoot: projectRoot,
    })
    autoModeRecommendation = await evaluateAutoModeRecommendation(projectRoot)

    if (skipLcm) {
      warn('按 --skip-lcm 跳过 lcm 初始化、registry 注入和 Cursor link，仅依赖项目内 hiui-design 继续接入。')
    } else if (lcmAvailable) {
      const lcmInitResult = await ensureLcmInitialized(projectRoot)

      if (lcmInitResult.ok) {
        ensureRegistryAdded()
        ensureCursorLink({ skipLink })
      } else {
        warn(`lcm 初始化失败：${lcmInitResult.reason}`)
        if (isLikelySandboxOrRegistryFailure(lcmInitResult.reason)) {
          warn(
            `如果当前运行在沙箱中，请把同一条接入命令切到沙箱外重跑：${rerunCommand}`
          )
        }
        warn('当前将跳过 lcm registry/link，仅依赖已复制到项目内的 hiui-design 继续接入。')
      }
    } else {
      warn('未检测到 lcm。当前将跳过项目上下文初始化与 Cursor link，仅依赖已复制到项目内的 hiui-design 继续接入。')
    }

    await runApplyScript({ applyScript, passthrough, projectRoot })
    preflightPayload = await runPreflightGate({
      preflightScript,
      legacyReactCompatScript,
      legacyHiui5BridgeScript,
      legacyMfSharedContractScript,
      dependencyIsolationScript,
      projectRoot,
      passthrough,
    })
    await runDoctorAcceptance({
      doctorScript,
      projectRoot,
      withDoctorGate,
      skipDoctorGate,
      passthrough,
    })

    console.log('')
    info('设计师模式安装完成')
    console.log('- 后续同步：pnpm typical-page:designer-setup 或 npm run typical-page:designer-setup')
    console.log('- 首次接入默认优先使用 `--mode auto`；它会先复用已记录的 `appliedMode`，没有记录时再按“是否需要项目本地兼容桥”决定落到 `host-integration` 或 `rules-only`')
    if (autoModeRecommendation) {
      console.log(
        `- 自动模式推荐：${autoModeRecommendation.recommendedMode}。原因：${formatAutoModeRecommendationReason(
          autoModeRecommendation
        )}`
      )
    }
    console.log('- `typical-page:designer-setup` 默认先跑 preflight 打开页面任务门禁；若命中老 React 或老 Webpack Module Federation 宿主，会按受管车道依次补运行时兼容、HiUI5 替换桥、共享合同和依赖隔离，再决定是否放行；doctor 只在显式附加 `--with-doctor-gate` 时运行')
    console.log('- 后续若手工改了宿主、依赖、路由、构建配置、入口文件或项目本地 `.context.jsonc`，先重跑 pnpm typical-page:preflight 或 npm run typical-page:preflight；首次接入重验收、异常排查或正式交付时再补 pnpm typical-page:doctor 或 npm run typical-page:doctor，或重跑 `pnpm run typical-page:designer-setup --with-doctor-gate` / `npm run typical-page:designer-setup -- --with-doctor-gate`')
    console.log('- 接入阶段默认不补齐国际化基线；只有用户明确要求时，才传 `--init-i18n`，或后续手动执行 `node ".local-context/hiui-design/scripts/init-i18n.mjs"`')
    console.log('- 先读生成原则：.local-context/hiui-design/docs/generation/generation-principles.md')
    console.log('- 再判页型：.local-context/hiui-design/docs/generation/page-type-map.md')
    console.log('- 命中现成页型后再读默认规则：.local-context/hiui-design/docs/generation/figma-page-rules.md')
    console.log('- 命中细页型后再读：.local-context/hiui-design/docs/generation/figma-pages/README.md')
    console.log('- 组件拿不准时再看：.local-context/hiui-design/docs/hiui-v5-quick-reference.md')
    console.log('- 默认会先判断目标项目类型：新项目优先接入受管宿主基线与官方 source assets；已有系统也先评估能否安全接入更完整的 host-integration 基线，不能证明安全时再退回 rules-only')
    console.log('- 官方 preview 始终留在 skill 包内 `preview-runtime/`；目标项目内不再保留 preview host、preview route 或 project-local gallery')
    console.log('- 如果识别为已有框架，默认不会把模版页面、路由或宿主桥接同步进项目；请直接在目标项目既有目录结构中生成业务页')
    console.log('- 不再使用 source-template 自动生成链路；旧系统请在目标项目既有目录内按规则手工落业务页，`examples/host-integration/src/pages/*` 只作官方母版与 runtime 对照，不是项目内 preview gallery')
    console.log('- 如果是数据统计页，优先对照 table-stat.tsx 的 runtime 版本；如果是全页编辑，优先对照 full-page-edit.tsx 的 runtime 版本，但不要把整套示例挂成项目内 preview 应用')
    console.log('- 若自动模式推荐 host-integration，表示当前项目更适合接入更完整的受管宿主基线；若推荐 rules-only，表示当前项目还需要项目本地兼容桥，不要在证据不足时硬切 host-integration')
    const mfPublishEntryShellHints = summarizeMfPublishEntryShellHints(preflightPayload)
    if (mfPublishEntryShellHints.required && !mfPublishEntryShellHints.ready) {
      warn(
        `项目级页面任务已放行，但微前端发布入口壳层仍未收口。${mfPublishEntryShellHints.reason || '当前只证明项目级 app entry 基线已就绪，不自动代表 direct expose 发布入口已带壳。'}${mfPublishEntryShellHints.targetEntryPath ? ` 目标入口：${mfPublishEntryShellHints.targetEntryPath}` : ''}`
      )
    }
    console.log('- 项目接入不会自动拉起 skill 包内 preview；如需查看官方示例，请在 hiui-design 根目录手动执行 `node scripts/start-preview-runtime.mjs`')
    console.log(
      `- 如需显式指定 registry，优先使用 \`${REGISTRY_ENV}\` / \`${GIT_REGISTRY_ENV}\`；旧的 \`${LEGACY_REGISTRY_ENV}\` / \`${LEGACY_GIT_REGISTRY_ENV}\` 仍保留兼容`
    )
    console.log('- 若目标项目里还残留旧视觉依赖或旧演示页，请先清理，再安装典型页依赖')
    console.log(
      `- 如果脚本卡在 lcm init --registry ${DEFAULT_REGISTRY || '<configured-open-registry>'}，通常是沙箱无法访问内部 registry；请把同一条命令切到沙箱外重跑`
    )
    await finalizeUsageSession(usageSession, {
      reportMode,
      success: true,
    })
  } catch (error) {
    await finalizeUsageSession(usageSession, {
      reportMode,
      success: false,
    })
    const message = error instanceof Error ? error.message : String(error)
    console.error(`setup-for-designers failed: ${message}`)
    if (isCliUsageError(error)) {
      printUsage()
    }
    process.exit(1)
  }
}

main()
