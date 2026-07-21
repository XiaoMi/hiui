#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { autoLaunchHostIntegrationPreview } from './lib/host-integration-browser-launch.mjs'
import { RULES_ONLY_REFERENCE_PAGES_GLOB } from './lib/reference-assets.mjs'
import { runProjectEngineeringGate } from './lib/setup-engineering-gate.mjs'

const DEFAULT_REGISTRY = process.env.HIUI_DESIGN_LCM_REGISTRY || ''
const GIT_REGISTRY = process.env.HIUI_DESIGN_LCM_GIT_REGISTRY || ''

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/setup-for-designers.mjs" [--mode <auto|rules-only|host-integration|legacy-host-compatible>] [--line <line-id>] [--with-host-assets] [--dest <relative-dir>] [--route-file <relative-file>] [--shells-spec <version>] [--install] [--no-install] [--install-timeout-ms <ms>] [--force] [--skip-link] [--skip-lcm] [--skip-doctor-gate] [--init-i18n] [--skip-i18n-init] [--skip-project-images-init] [--skip-open-browser]

Default behavior:
  - if lcm exists, initialize project context and link to Cursor when available
  - detect the target project type automatically
  - greenfield React/Vite apps default to host-integration
  - existing systems default to non-gallery installation paths, and incompatible legacy runtimes are routed into legacy-host-compatible bridge mode, which still allows typical-page components through planner-selected carrier / runtimeAdapterProof paths
  - do not provision src/translation i18n baseline unless --init-i18n is passed
  - auto-provision src/typical-page-reuse/assets project image catalog scaffold unless --skip-project-images-init is passed
  - run typical-page:doctor immediately after setup and stop on doctor failures
  - validate the target project's build result after doctor; lint is also checked when a script exists and reported as an explainable follow-up item
  - after a successful host-integration setup, auto-start a local dev server when needed and open the first typical-page sample unless --skip-open-browser is passed
`)
}

function parseArgs(argv) {
  let dest = 'src/typical-page-reuse'
  const passthrough = []
  let skipDoctorGate = false
  let skipLink = false
  let skipLcm = false
  let skipOpenBrowser = false

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--skip-doctor-gate') {
      skipDoctorGate = true
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

    if (arg === '--skip-open-browser') {
      skipOpenBrowser = true
      continue
    }

    if (arg === '--with-host-assets') {
      passthrough.push('--mode', 'host-integration')
      continue
    }

    if (arg === '--with-reference-assets') {
      passthrough.push('--mode', 'rules-only')
      continue
    }

    if (
      arg === '--install' ||
      arg === '--no-install' ||
      arg === '--force' ||
      arg === '--init-i18n' ||
      arg === '--skip-i18n-init' ||
      arg === '--skip-project-images-init'
    ) {
      passthrough.push(arg)
      continue
    }

    if (
      arg === '--mode' ||
      arg === '--line' ||
      arg === '--dest' ||
      arg === '--route-file' ||
      arg === '--shells-spec' ||
      arg === '--install-timeout-ms'
    ) {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      passthrough.push(arg, value)
      if (arg === '--dest') {
        dest = value
      }
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return { dest, passthrough, skipDoctorGate, skipLink, skipLcm, skipOpenBrowser }
}

function info(message) {
  console.log(`✓ ${message}`)
}

function warn(message) {
  console.warn(`⚠ ${message}`)
}

function runCommand(command, args, { allowFailure = false, capture = false, cwd = process.cwd() } = {}) {
  const result = spawnSync(command, args, {
    cwd,
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

  info('初始化 lcm')
  if (!DEFAULT_REGISTRY) {
    return {
      ok: false,
      skipped: true,
      reason: 'HIUI_DESIGN_LCM_REGISTRY is not configured.',
    }
  }

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
    warn('HIUI_DESIGN_LCM_GIT_REGISTRY 未配置，跳过共享 registry 注入')
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

function runApplyScript({ applyScript, passthrough }) {
  info('安装典型页规则能力与固定脚本')
  runCommand(process.execPath, [applyScript, ...passthrough])
}

function runDoctorGate({ doctorScript, projectRoot, skipDoctorGate }) {
  if (skipDoctorGate) {
    warn('按 --skip-doctor-gate 跳过接入完成后的 doctor 阻断校验，仅建议在高级维护或源仓库排障时使用')
    return
  }

  info('执行 typical-page doctor 作为接入完成门槛')
  const result = runCommand(process.execPath, [doctorScript, '--target', projectRoot], {
    allowFailure: true,
    capture: true,
    cwd: projectRoot,
  })

  if ((result.status ?? 1) === 0) {
    process.stdout.write(result.stdout ?? '')
    if ((result.stdout ?? '').includes('Typical Page Doctor: WARN')) {
      warn('doctor 以 WARN 结束：可以继续，但仅应按当前项目命中的兼容/手工路径生成，不要忽略报告里的约束')
    } else {
      info('doctor 通过，可以继续生成业务典型页')
    }
    return
  }

  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')
  throw new Error(
    'typical-page doctor 未通过。请先修复 doctor 输出中的硬失败项，再继续生成业务页；如确需跳过，仅在明确知晓风险时使用 --skip-doctor-gate'
  )
}

async function runEngineeringGate({ projectRoot }) {
  info('执行工程闭环校验（build 必跑；lint 若存在则给出可解释结果）')
  const report = await runProjectEngineeringGate({ projectRoot })

  for (const check of report.checks) {
    if (check.status === 'passed') {
      info(`${check.label} 校验通过 (${check.command})`)
      continue
    }

    if (check.status === 'missing') {
      warn(`未检测到 ${check.label} script，当前跳过该项工程校验`)
      continue
    }

    if (check.stdout) {
      process.stdout.write(check.stdout)
    }

    if (check.stderr) {
      process.stderr.write(check.stderr)
    }

    if (check.blocking) {
      throw new Error(
        `工程闭环校验失败：${check.label} 未通过（${check.command}）。请先修复该问题，再继续把当前项目视为 hiui-design 接入完成。`
      )
    }

    warn(
      `${check.label} 未通过（${check.command}）。当前不会阻断安装，但它不再被静默忽略；请把失败结果当作后续必须解释/处理的工程项。`
    )
  }

  if (report.status === 'passed') {
    info('工程闭环校验通过')
    return
  }

  warn('工程闭环校验已完成，但仍有缺失或非阻断项需要解释；不要把 doctor 通过误当成完整工程完成态')
}

async function main() {
  try {
    const rawArgs = process.argv.slice(2)
    const { dest, passthrough, skipDoctorGate, skipLink, skipLcm, skipOpenBrowser } = parseArgs(rawArgs)
    const projectRoot = process.cwd()
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const applyScript = path.join(scriptDir, 'apply-in-current-project.mjs')
    const doctorScript = path.join(scriptDir, 'typical-page-doctor.mjs')
    const lcmAvailable = hasLcm()
    const rerunCommand = formatCurrentSetupCommand(rawArgs)

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

    runApplyScript({ applyScript, passthrough: [...passthrough, '--skip-open-browser'] })
    runDoctorGate({ doctorScript, projectRoot, skipDoctorGate })
    await runEngineeringGate({ projectRoot })

    if (!skipOpenBrowser) {
      const launchResult = await autoLaunchHostIntegrationPreview({
        targetRoot: projectRoot,
        outputRootRelative: dest,
        logger: console,
      })

      if (launchResult.status === 'not-applicable') {
        // no-op: this run did not end in an auto-launchable host-integration setup
      } else if (launchResult.status !== 'skipped') {
        info(`host-integration 示例页已打开：${launchResult.url}`)
      } else if (launchResult.detail) {
        warn(`未自动打开 host-integration 示例页：${launchResult.detail}`)
      }
    }

    console.log('')
    info('设计师模式安装完成')
    console.log('- 后续同步：pnpm typical-page:designer-setup 或 npm run typical-page:designer-setup')
    console.log('- `typical-page:designer-setup` 默认已自动执行 doctor、build 校验，并在 lint script 存在时给出可解释结果；后续页面生成默认沿用已写入的 project mode lock')
    console.log('- 页面生成前先执行 `pnpm typical-page:plan-page-task -- --json ...` 或 `npm run typical-page:plan-page-task -- --json ...` 获取机器计划')
    console.log('- 后续若手工改宿主、依赖、路由或样式入口，再手动执行 pnpm typical-page:doctor 或 npm run typical-page:doctor')
    console.log('- 接入阶段默认已自动补齐 `src/translation/*`、`messages.ts` 与 `i18n:sync`；后续若需要重同步 locale 基线，再执行 pnpm typical-page:i18n:init 或 npm run typical-page:i18n:init')
    console.log('- 页面生成先确认 project mode lock，再判页型：.local-context/hiui-design/rules/page-type-map.md')
    console.log('- 命中现成页型后再读默认规则：.local-context/hiui-design/docs/generation/figma-page-rules.md')
    console.log('- 命中细页型后再读：.local-context/hiui-design/docs/generation/figma-pages/README.md')
    console.log('- 典型页高频组件先看：.local-context/hiui-design/docs/hiui-v5-quick-reference.md')
    console.log('- 非典型页面或长尾组件选型再看：.local-context/hiui-design/docs/generation/non-typical-component-routing.md 与 docs/generation/hiui-v5-component-map.md')
    console.log('- 需要实际照着写 kickoff 时，直接看：.local-context/hiui-design/docs/generation/ai-kickoff-template.md 里的“非典型页面 kickoff 示例”')
    console.log('- 只有 project mode 缺失、过期或冲突时，才重新读取 mode-selection.md 判断目标项目类型')
    console.log('- 如果识别为已有框架，默认不会把模版页面、路由或宿主桥接挂进项目源码；请直接在目标项目既有目录结构中生成业务页')
    console.log(`- 旧系统会默认把一份 reference-only 示例页同步到：${RULES_ONLY_REFERENCE_PAGES_GLOB}；这只是本地参考/回退资产，不表示 legacy-host-compatible 禁用典型页组件`)
    console.log('- 若 reference 目录被手工清理，再回退使用 skill 内示例：.local-context/hiui-design/examples/host-integration/src/pages/*')
    console.log('- 若当前项目走 rules-only，或 legacy-host-compatible 但尚未命中 page-component fast path，先用 `pnpm typical-page:plan-page-task -- --page-type <id> --page <generated-page-path> --json` 锁定计划，再用 `pnpm typical-page:start-page -- --page-type <id> --page <generated-page-path>` 生成带 source contract 的起手骨架。若 legacy-host-compatible 计划已选中 pageComponent，则默认主链是 `page-component + runtime bridge + slot fill`；此时 reference 只作本地参考/回退资产，不是默认翻译结果。')
    console.log('- 页面实现过程中，先补齐 host region / ownership 映射，再执行 `pnpm typical-page:preflight -- --page <generated-page-path>` 提前暴露 contract 占位符、source marker 与 transitive helper 污染。')
    console.log('- 快速典型页完成口径是当前页可预览、preflight 通过、lint / build 可解释；正式验收、发布、结构修复或 ownership / marker 变化时才执行 `typical-page:finalize-page`。')
    console.log('- 如果是数据统计页，参考 table-stat.tsx；如果是全页编辑，参考 full-page-edit.tsx，但不要把 reference-only 目录当成正式 gallery 接进项目，也不要把它误解成 legacy-host-compatible 只能走 reference/fallback。')
    console.log('- 只有明确需要基线联调页和宿主桥接示例时，才执行 typical-page:apply:host-assets 或 setup-for-designers.mjs --mode host-integration')
    console.log('- 若目标项目里还残留旧视觉依赖或旧演示页，请先清理，再安装典型页依赖')
    console.log('- 如果脚本卡在 lcm init，请检查 HIUI_DESIGN_LCM_REGISTRY 是否可访问；必要时把同一条命令切到沙箱外重跑')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`setup-for-designers failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

await main()
