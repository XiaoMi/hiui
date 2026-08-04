import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { verifyLegacyPage } from '../typical-page-legacy-verify.mjs'
import { writeLegacyAcceptanceWorkflow } from './legacy-acceptance-contract-workflow.mjs'
import { normalizeLegacyAcceptanceProfile, resolveLegacyAcceptanceStatus } from './legacy-acceptance-status.mjs'
import { classifyRuntimeCapture, evaluateRuntimeCaptureForProfile } from './runtime-capture-semantics.mjs'
import { runVisualEvidenceGate } from './visual-evidence-gate.mjs'
import { runDomGeometryGate } from './dom-geometry-gate.mjs'
import { runAdapterGate } from './adapter-gate.mjs'
import { buildChromiumLaunchOptions, loadPlaywrightWithFallback } from './playwright-runtime.mjs'

const DEFAULT_REMOTE_ENTRY_RELATIVE_PATH = 'dist/remoteEntry.js'
const DEFAULT_REPORT_RELATIVE_DIR = '.local-context/hiui-design/outputs/legacy-acceptance'
const DEFAULT_WARNING_WAIVER_RELATIVE_PATH = '.local-context/hiui-design/outputs/accepted-warning-waivers.json'
const BUILD_P0_PATTERNS = [
  /\bERROR\b/,
  /ModuleNotFoundError/,
  /Failed to compile/,
  /ERR_OSSL_EVP_UNSUPPORTED/,
  /Cannot find module/,
  /export ['"].*['"] was not found in ['"]@hi-ui\/.*['"]/,
  /export ['"].*['"] was not found in ['"]@hiui-design\/.*['"]/,
  /Attempted import error/,
  /is not exported from/,
  /Module not found/,
  /Can't resolve/,
]
const BUILD_P1_PATTERNS = [
  /Unsatisfied version .* shared singleton module/,
  /Conflicting values for ['"]?process\.env/,
]
const BUILD_INFO_PATTERNS = [
  /asset size limit/,
  /Browserslist: browsers data/,
  /DeprecationWarning/,
]
const P0_CONSOLE_PATTERNS = [
  /Invalid hook call/i,
  /ChunkLoadError/i,
  /Loading chunk \d+ failed/i,
  /Script error/i,
]
const P1_CONSOLE_PATTERNS = [
  /FormField must pass a valid element as children/i,
  /Failed to load resource/i,
  /Unsatisfied version .* shared singleton module/i,
]
const REQUIRED_RUNTIME_REGIONS_BY_PAGE_TYPE = {
  'table-basic': ['query-filter', 'table', 'pagination'],
  'tree-table': ['query-filter', 'table', 'pagination'],
  'table-stat': ['query-filter', 'stat-section', 'table', 'pagination'],
  'tree-split': ['split-workspace', 'tree', 'right-main', 'query-filter', 'table', 'pagination'],
  'drawer-form': ['form-body'],
  'drawer-detail': ['detail-body'],
  'full-page-edit': ['form-body'],
  'full-page-detail': ['detail-body'],
  'feedback-status': ['feedback-panel'],
}
const REGION_VISIBILITY_KEY = {
  header: 'header',
  'white-body': 'whiteBody',
  'stat-section': 'statSection',
  'query-filter': 'queryFilter',
  'split-workspace': 'splitWorkspace',
  table: 'table',
  pagination: 'pagination',
  tree: 'tree',
  'right-main': 'rightMain',
  'form-body': 'formBody',
  'detail-body': 'detailBody',
  footer: 'footer',
  'footer-actions': 'footerActions',
  'drawer-shell': 'drawerShell',
  'drawer-body': 'drawerBody',
  'drawer-footer': 'drawerFooter',
  'feedback-panel': 'feedbackPanel',
}
const DEFAULT_VIEWPORT = { width: 1440, height: 900 }

function normalizeRelativePath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\.\//, '')
}

function resolveTargetPath(target, value) {
  if (!value) return ''
  return path.isAbsolute(value) ? value : path.join(target, value)
}

async function pathExists(filePath) {
  if (!filePath) return false
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(filePath) {
  if (!(await pathExists(filePath))) return null
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

function splitCommand(command) {
  return String(command || '').trim()
}

async function readPackageJson(target) {
  return readJsonIfExists(path.join(target, 'package.json'))
}

function discoverBuildCommand(pkg) {
  const scripts = pkg?.scripts || {}
  if (scripts['build:test']) return 'npm run build:test'
  if (scripts.build) return 'npm run build'
  return ''
}

function scanBuildLog(log) {
  return {
    p0: BUILD_P0_PATTERNS.filter((pattern) => pattern.test(log)).map((pattern) => ({ type: 'build', text: `build log matched ${pattern}` })),
    p1: BUILD_P1_PATTERNS.filter((pattern) => pattern.test(log)).map((pattern) => ({ type: 'build-warning', text: `build log matched ${pattern}` })),
    info: BUILD_INFO_PATTERNS.filter((pattern) => pattern.test(log)).map((pattern) => ({ type: 'build-info', text: `build log matched ${pattern}` })),
  }
}

function step(status, detail = {}) {
  return { status, ...detail }
}

function issueCode(issue) {
  return String(issue?.code || '').trim()
}

function filterIssuesByCode(issues, predicate) {
  return Array.isArray(issues) ? issues.filter((issue) => predicate(issueCode(issue))) : []
}

function toStepStatus(ok) {
  return ok ? 'passed' : 'failed'
}

function extractRuntimeResult(evidence) {
  if (!evidence || typeof evidence !== 'object') return {}
  if (evidence.result && typeof evidence.result === 'object') return evidence.result
  return evidence
}

function extractConsoleMessages(evidence) {
  if (!evidence || typeof evidence !== 'object') return []
  const rawMessages = Array.isArray(evidence.consoleMessages) ? evidence.consoleMessages : []
  return rawMessages.map((message) => ({
    type: String(message?.type || 'unknown'),
    text: String(message?.text || ''),
    location: message?.location && typeof message.location === 'object' ? message.location : undefined,
  }))
}

function parseViewport(value) {
  const normalized = String(value || '').trim()
  if (!normalized) return DEFAULT_VIEWPORT
  const match = normalized.match(/^(\d+)x(\d+)$/)
  if (!match) throw new Error(`Invalid viewport "${value}". Expected <width>x<height>, for example 1440x900.`)
  return { width: Number(match[1]), height: Number(match[2]) }
}

function isLegacyRuntimeHarnessUrl(runtimeUrl) {
  const normalized = String(runtimeUrl || '').trim()
  return /(?:^|\/)hiui-runtime-harness\.html(?:$|[?#])/i.test(normalized)
}

async function copyRequiredRuntimeVendor({ sourcePath, targetPath, packageName }) {
  if (!(await pathExists(sourcePath))) {
    return {
      ok: false,
      issue: `${packageName} UMD runtime is missing: ${normalizeRelativePath(sourcePath)}`,
    }
  }
  await fs.copyFile(sourcePath, targetPath)
  return { ok: true, issue: '' }
}

async function captureRuntimeEvidence({ target, page, runtimeUrl, timeout, viewport }) {
  const { chromium } = await loadPlaywrightWithFallback()
  const pageSlug = normalizeRelativePath(page).replace(/\.[cm]?[jt]sx?$/u, '').replace(/[^a-zA-Z0-9_-]+/g, '__') || 'legacy-page'
  const outputDir = path.join(target, DEFAULT_REPORT_RELATIVE_DIR)
  const evidencePath = path.join(outputDir, `${pageSlug}.runtime-evidence.json`)
  const screenshotPath = path.join(outputDir, `${pageSlug}.png`)
  await fs.mkdir(outputDir, { recursive: true })

  const browser = await chromium.launch(await buildChromiumLaunchOptions())
  const browserPage = await browser.newPage({ viewport })
  const consoleMessages = []
  browserPage.on('console', (message) => {
    consoleMessages.push({ type: message.type(), text: message.text(), location: message.location() })
  })
  browserPage.on('pageerror', (error) => {
    consoleMessages.push({ type: 'pageerror', text: error.message })
  })

  try {
    await browserPage.goto(runtimeUrl, { waitUntil: 'networkidle', timeout })
    await browserPage.waitForSelector('[data-hiui-page-root="legacy-host-compatible"]', { timeout })
    const waitSelectorsByPageType = {
      'table-basic': [
        '.hi-v5-query-filter',
        '.hi-v5-table, table',
        '.hi-v5-pagination',
      ],
      'table-stat': [
        '[data-hiui-legacy-region="stat-section"]',
        '.hi-v5-query-filter',
        '.hi-v5-table, table',
        '.hi-v5-pagination',
      ],
      'tree-table': [
        '.hi-v5-query-filter',
        '.hi-v5-table, table',
        '.hi-v5-pagination',
      ],
      'tree-split': [
        '[class*="mainSplit" i]',
        '[class*="rightColumn" i]',
        '.hi-v5-query-filter',
        '.hi-v5-table, table',
        '.hi-v5-pagination',
      ],
      'drawer-form': ['[data-hiui-legacy-region="form-body"]'],
      'drawer-detail': ['[data-hiui-legacy-region="detail-body"]'],
      'full-page-edit': ['[data-hiui-legacy-region="form-body"]'],
      'full-page-detail': ['[data-hiui-legacy-region="detail-body"]'],
      'feedback-status': ['[data-hiui-legacy-region="feedback-panel"]'],
    }
    const pageType = String(await browserPage.evaluate(() => document.querySelector('[data-hiui-page-root="legacy-host-compatible"]')?.getAttribute('data-hiui-legacy-page-type') || '') || '')
    const waitSelectors = waitSelectorsByPageType[pageType] || []
    for (const selector of waitSelectors) {
      await browserPage.waitForSelector(selector, { timeout })
    }
    const result = await browserPage.evaluate(() => {
      const root = document.querySelector('[data-hiui-page-root="legacy-host-compatible"]')
      const text = document.body?.innerText || ''
      const regionVisible = (selector) => {
        const element = document.querySelector(selector)
        if (!(element instanceof HTMLElement)) return false
        const style = window.getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0
      }
        return {
          rendered: Boolean(root),
          pageRoot: root?.getAttribute('data-hiui-page-root') || '',
          managedRuntime: root?.getAttribute('data-hiui-legacy-runtime') || '',
          pageType: root?.getAttribute('data-hiui-legacy-page-type') || '',
          slotSurface: root?.getAttribute('data-hiui-legacy-slot-surface') || '',
          shell: root?.getAttribute('data-hiui-legacy-shell') || '',
          regionOrder: root?.getAttribute('data-hiui-legacy-region-order') || '',
          queryFilterCount: document.querySelectorAll('.hi-v5-query-filter, [data-hiui5-region="query-filter"], [data-hiui-legacy-region="query-filter"]').length,
          tableCount: document.querySelectorAll('.hi-v5-table, [data-hiui5-region="table"], [data-hiui-legacy-region="table"]').length,
          paginationCount: document.querySelectorAll('.hi-v5-pagination, [data-hiui5-region="pagination"], [data-hiui-legacy-region="pagination"]').length,
          hasAllFilter: text.includes('全部筛选'),
          regionVisibility: {
            header: regionVisible('[data-hiui5-region="header"], [data-hiui-legacy-region="header"]'),
            whiteBody: regionVisible('[data-hiui5-region="white-body"], [data-hiui-legacy-region="white-body"], [class*="whiteBody" i]'),
            statSection: regionVisible('[data-hiui5-region="stat-section"], [data-hiui-legacy-region="stat-section"], .hi-v5-stat-section'),
            splitWorkspace: regionVisible('[data-hiui5-region="split-workspace"], [data-hiui-legacy-region="split-workspace"], [class*="mainSplit" i]'),
            queryFilter: regionVisible('[data-hiui5-region="query-filter"], [data-hiui-legacy-region="query-filter"], .hi-v5-query-filter'),
            table: regionVisible('[data-hiui5-region="table"], [data-hiui-legacy-region="table"], table, .hi-v5-table, [class*="table" i]'),
            pagination: regionVisible('[data-hiui5-region="pagination"], [data-hiui-legacy-region="pagination"], .hi-v5-pagination, [class*="pagination" i]'),
          tree: regionVisible('[data-hiui5-region="tree"], [data-hiui-legacy-region="tree"]'),
          rightMain: regionVisible('[data-hiui5-region="right-main"], [data-hiui-legacy-region="right-main"], [class*="rightColumn" i]'),
          formBody: regionVisible('[data-hiui5-region="form-body"], [data-hiui-legacy-region="form-body"]'),
          detailBody: regionVisible('[data-hiui5-region="detail-body"], [data-hiui-legacy-region="detail-body"]'),
          footer: regionVisible('[data-hiui5-region="footer"], [data-hiui-legacy-region="footer"]'),
          footerActions: regionVisible('[data-hiui5-region="footer-actions"], [data-hiui-legacy-region="footer-actions"]'),
          drawerShell: regionVisible('[data-hiui5-region="drawer-shell"], [data-hiui-legacy-region="drawer-shell"], [data-hiui5-owner-drawer-shell="true"]'),
          drawerBody: regionVisible('[data-hiui5-region="drawer-body"], [data-hiui-legacy-region="drawer-body"]'),
          drawerFooter: regionVisible('[data-hiui5-region="drawer-footer"], [data-hiui-legacy-region="drawer-footer"]'),
          feedbackPanel: regionVisible('[data-hiui5-region="feedback-panel"], [data-hiui-legacy-region="feedback-panel"]'),
        },
      }
    })
    const geometry = await browserPage.evaluate(() => {
      const rectFor = (selector) => {
        const element = document.querySelector(selector)
        if (!element) return null
        const rect = element.getBoundingClientRect()
        return {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        }
      }
      return {
        root: rectFor('[data-hiui-page-root="legacy-host-compatible"]'),
        header: rectFor('[data-hiui5-region="header"], [data-hiui-legacy-region="header"]'),
        whiteBody: rectFor('[data-hiui5-region="white-body"], [data-hiui-legacy-region="white-body"], [class*="whiteBody" i]'),
        statSection: rectFor('[data-hiui5-region="stat-section"], [data-hiui-legacy-region="stat-section"], .hi-v5-stat-section'),
        splitWorkspace: rectFor('[data-hiui5-region="split-workspace"], [data-hiui-legacy-region="split-workspace"], [class*="mainSplit" i]'),
        tree: rectFor('[data-hiui5-region="tree"], [data-hiui-legacy-region="tree"]'),
        rightMain: rectFor('[data-hiui5-region="right-main"], [data-hiui-legacy-region="right-main"], [class*="rightColumn" i]'),
        queryFilter: rectFor('[data-hiui5-region="query-filter"], [data-hiui-legacy-region="query-filter"], .hi-v5-query-filter'),
        table: rectFor('[data-hiui5-region="table"], [data-hiui-legacy-region="table"], table, .hi-v5-table'),
        pagination: rectFor('[data-hiui5-region="pagination"], [data-hiui-legacy-region="pagination"], .hi-v5-pagination'),
        formBody: rectFor('[data-hiui5-region="form-body"], [data-hiui-legacy-region="form-body"]'),
        detailBody: rectFor('[data-hiui5-region="detail-body"], [data-hiui-legacy-region="detail-body"]'),
        footer: rectFor('[data-hiui5-region="footer"], [data-hiui-legacy-region="footer"]'),
        footerActions: rectFor('[data-hiui5-region="footer-actions"], [data-hiui-legacy-region="footer-actions"]'),
        drawerShell: rectFor('[data-hiui5-region="drawer-shell"], [data-hiui-legacy-region="drawer-shell"], [data-hiui5-owner-drawer-shell="true"]'),
        drawerBody: rectFor('[data-hiui5-region="drawer-body"], [data-hiui-legacy-region="drawer-body"]'),
        drawerFooter: rectFor('[data-hiui5-region="drawer-footer"], [data-hiui-legacy-region="drawer-footer"]'),
        feedbackPanel: rectFor('[data-hiui5-region="feedback-panel"], [data-hiui-legacy-region="feedback-panel"]'),
      }
    })
    const computedStyles = await browserPage.evaluate(() => {
      const styleFor = (selector) => {
        const element = document.querySelector(selector)
        if (!element) return null
        const styles = window.getComputedStyle(element)
        return {
          display: styles.display,
          flex: styles.flex,
          flexDirection: styles.flexDirection,
          alignSelf: styles.alignSelf,
          height: styles.height,
          minHeight: styles.minHeight,
          minWidth: styles.minWidth,
          overflow: styles.overflow,
        }
      }
      return {
        root: styleFor('[data-hiui-page-root="legacy-host-compatible"]'),
        whiteBody: styleFor('[data-hiui5-region="white-body"], [data-hiui-legacy-region="white-body"], [class*="whiteBody" i]'),
      }
    })
    await browserPage.screenshot({ path: screenshotPath, fullPage: true })
    const evidence = {
      schemaVersion: 'legacy-runtime-evidence.v1',
      url: runtimeUrl,
      viewport,
      result,
      geometry,
      computedStyles,
      screenshotPath,
      consoleMessages,
    }
    await fs.writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8')
    return {
      evidence,
      evidencePath: normalizeRelativePath(path.relative(target, evidencePath)),
    }
  } finally {
    await browser.close()
  }
}

async function ensureLegacyRuntimeHarness({ target }) {
  const outputDir = path.join(target, 'dist')
  const harnessPath = path.join(outputDir, 'hiui-runtime-harness.html')
  const vendorDir = path.join(outputDir, 'vendor')
  const reactSourcePath = path.join(target, 'node_modules/react/umd/react.development.js')
  const reactDomSourcePath = path.join(target, 'node_modules/react-dom/umd/react-dom.development.js')
  const reactTargetPath = path.join(vendorDir, 'react.development.js')
  const reactDomTargetPath = path.join(vendorDir, 'react-dom.development.js')

  await fs.mkdir(vendorDir, { recursive: true })
  const vendorResults = [
    await copyRequiredRuntimeVendor({ sourcePath: reactSourcePath, targetPath: reactTargetPath, packageName: 'react' }),
    await copyRequiredRuntimeVendor({ sourcePath: reactDomSourcePath, targetPath: reactDomTargetPath, packageName: 'react-dom' }),
  ]
  const vendorIssues = vendorResults.filter((result) => !result.ok).map((result) => result.issue)
  if (vendorIssues.length > 0) {
    return {
      ok: false,
      harnessPath: normalizeRelativePath(path.relative(target, harnessPath)),
      issues: vendorIssues,
    }
  }

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HiUI Runtime Harness</title>
    <style>
      html,
      body,
      #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }

      body {
        overflow: hidden;
        background: #f5f7fa;
      }

      #root {
        display: flex;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      (async () => {
        const params = new URLSearchParams(window.location.search)
        const expose = params.get('expose') || './LogisticsManagement'
        const title = params.get('title') || expose
        const root = document.getElementById('root')

        const loadScript = (src) =>
          new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = src
            script.async = true
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('Failed to load ' + src))
            document.head.appendChild(script)
          })

        await loadScript('/vendor/react.development.js')
        await loadScript('/vendor/react-dom.development.js')
        await loadScript('/remoteEntry.js')

        const shareScopes = window.__webpack_share_scopes__ || (window.__webpack_share_scopes__ = { default: {} })
        if (!shareScopes.default) shareScopes.default = {}
        if (!window.serviceOperations || typeof window.serviceOperations.init !== 'function') {
          throw new Error('serviceOperations remote is not available')
        }

        const provideSharedModule = (module, version) => ({
          [version]: {
            get: () => Promise.resolve(() => module),
            from: 'hiui-runtime-harness',
            eager: true,
            loaded: true,
          },
        })

        const reactVersion = window.React?.version || '16.13.1'
        const reactDomVersion = window.ReactDOM?.version || reactVersion
        shareScopes.default.react = provideSharedModule(window.React, reactVersion)
        shareScopes.default['react-dom'] = provideSharedModule(window.ReactDOM, reactDomVersion)

        await window.serviceOperations.init(shareScopes.default)
        const factory = await window.serviceOperations.get(expose)
        const module = factory()
        const firstSharedModule = (sharedModule, name) => {
          const versions = Object.keys(sharedModule || {})
          if (versions.length === 0) throw new Error(name + ' shared module is not available')
          return sharedModule[versions[0]]
        }
        const react = (await firstSharedModule(shareScopes.default.react, 'react').get())()
        const reactDom = (await firstSharedModule(shareScopes.default['react-dom'], 'react-dom').get())()

        document.title = title

        const element = react.createElement(module.default)
        if (typeof reactDom.createRoot === 'function') {
          reactDom.createRoot(root).render(element)
        } else {
          reactDom.render(element, root)
        }
      })().catch((error) => {
        console.error(error)
        document.body.innerHTML = '<pre style="white-space:pre-wrap;padding:16px;color:#c00;">' +
          String(error && error.stack ? error.stack : error) +
          '</pre>'
      })
    </script>
  </body>
</html>
`
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(harnessPath, html, 'utf8')
  return {
    ok: true,
    harnessPath: normalizeRelativePath(path.relative(target, harnessPath)),
    vendorFiles: [
      normalizeRelativePath(path.relative(target, reactTargetPath)),
      normalizeRelativePath(path.relative(target, reactDomTargetPath)),
    ],
    issues: [],
  }
}

function classifyConsoleMessages(messages) {
  const p0 = []
  const p1 = []
  const info = []

  for (const message of messages) {
    const text = message.text || ''
    const locationUrl = String(message.location?.url || '')
    if (/favicon\.ico(?:$|[?#])/i.test(locationUrl) && /Failed to load resource/i.test(text)) {
      info.push(message)
      continue
    }
    if (message.type === 'pageerror' || (message.type === 'error' && P0_CONSOLE_PATTERNS.some((pattern) => pattern.test(text)))) {
      p0.push(message)
      continue
    }
    if (P1_CONSOLE_PATTERNS.some((pattern) => pattern.test(text)) || message.type === 'warning') {
      p1.push(message)
      continue
    }
    info.push(message)
  }

  return { p0, p1, info }
}

function normalizeWaivers(rawWaivers) {
  const list = Array.isArray(rawWaivers) ? rawWaivers : rawWaivers?.waivers
  return Array.isArray(list)
    ? list.map((waiver) => ({
        pattern: String(waiver?.pattern || '').trim(),
        reason: String(waiver?.reason || '').trim(),
        owner: String(waiver?.owner || '').trim(),
        expiresAt: String(waiver?.expiresAt || '').trim(),
      })).filter((waiver) => waiver.pattern && waiver.reason && waiver.owner && waiver.expiresAt)
    : []
}

function isWaiverActive(waiver, now = new Date()) {
  const expiresAt = Date.parse(waiver.expiresAt)
  return Number.isFinite(expiresAt) && expiresAt >= now.getTime()
}

function matchWaiver(message, waivers) {
  for (const waiver of waivers) {
    if (!isWaiverActive(waiver)) continue
    try {
      if (new RegExp(waiver.pattern).test(message.text)) return waiver
    } catch {
      if (message.text.includes(waiver.pattern)) return waiver
    }
  }
  return null
}

function applyWarningWaivers(p1Warnings, waivers) {
  const waived = []
  const unwaived = []
  for (const warning of p1Warnings) {
    const waiver = matchWaiver(warning, waivers)
    if (waiver) {
      waived.push({ warning, waiver })
    } else {
      unwaived.push(warning)
    }
  }
  return { waived, unwaived }
}

function validateRuntimeDomEvidence(evidence, pageType) {
  const result = extractRuntimeResult(evidence)
  const regionOrder = String(result.regionOrder || '')
  const regionVisibility = result.regionVisibility && typeof result.regionVisibility === 'object' ? result.regionVisibility : null
  const requiredRegions = REQUIRED_RUNTIME_REGIONS_BY_PAGE_TYPE[pageType] || REQUIRED_RUNTIME_REGIONS_BY_PAGE_TYPE['table-basic']
  const missingRegions = requiredRegions.filter((region) => !regionOrder.includes(region))
  const hiddenRegions = regionVisibility
    ? requiredRegions.filter((region) => regionVisibility[REGION_VISIBILITY_KEY[region] || region] !== true)
    : []
  const failures = []

  if (result.rendered !== true) failures.push('runtime evidence must set result.rendered=true')
  if (result.pageRoot !== 'legacy-host-compatible') failures.push('runtime evidence must prove pageRoot=legacy-host-compatible')
  if (!['HiuiLegacyPage', 'project-runtime-adapter'].includes(result.managedRuntime)) {
    failures.push('runtime evidence must prove managedRuntime=HiuiLegacyPage or project-runtime-adapter')
  }
  if (result.pageType !== pageType) failures.push(`runtime evidence must prove pageType=${pageType}`)
  if (result.slotSurface !== 'typed-slots') failures.push('runtime evidence must prove slotSurface=typed-slots')
  if (!result.shell) failures.push('runtime evidence must include the managed shell name')
  if (missingRegions.length > 0) failures.push(`runtime evidence missing region(s): ${missingRegions.join(', ')}`)
  if (hiddenRegions.length > 0) failures.push(`runtime evidence region(s) must be visible: ${hiddenRegions.join(', ')}`)

  return {
    ok: failures.length === 0,
    failures,
    result,
  }
}

async function validateVisualEvidence({ target, runtimeEvidence, visualEvidence }) {
  return runVisualEvidenceGate({ targetRoot: target, runtimeEvidence, visualEvidence, profile: 'preview' })
}

async function runBuildGate({ target, command }) {
  const normalizedCommand = splitCommand(command)
  if (!normalizedCommand) {
    return step('failed', {
      command: '',
      exitCode: null,
      issues: ['No build command found. Pass --build-command or add package.json scripts.build:test/build.'],
      logExcerpt: '',
    })
  }

  const result = spawnSync(normalizedCommand, {
    cwd: target,
    shell: true,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  })
  const log = `${result.stdout || ''}${result.stderr || ''}`
  const buildWarnings = scanBuildLog(log)
  const ok = result.status === 0 && buildWarnings.p0.length === 0
  return step(toStepStatus(ok), {
    command: normalizedCommand,
    exitCode: result.status,
    signal: result.signal || '',
    issues: [
      ...(result.status === 0 ? [] : [`build command exited with ${result.status}`]),
      ...buildWarnings.p0.map((warning) => warning.text),
    ],
    warningClassification: buildWarnings,
    logExcerpt: log.slice(-4000),
  })
}

async function writeReport({ target, page, report }) {
  const pageSlug = normalizeRelativePath(page).replace(/\.[cm]?[jt]sx?$/u, '').replace(/[^a-zA-Z0-9_-]+/g, '__') || 'legacy-page'
  const outputDir = path.join(target, DEFAULT_REPORT_RELATIVE_DIR)
  const outputPath = path.join(outputDir, `${pageSlug}.json`)
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  return normalizeRelativePath(path.relative(target, outputPath))
}

export async function runLegacyAcceptance(options) {
  const target = path.resolve(options.target || process.cwd())
  const page = normalizeRelativePath(options.page)
  const pageType = String(options.pageType || '').trim()
  const remoteEntry = normalizeRelativePath(options.remoteEntry || DEFAULT_REMOTE_ENTRY_RELATIVE_PATH)
  const acceptanceProfile = normalizeLegacyAcceptanceProfile(options.profile || options.acceptanceProfile)
  const pkg = await readPackageJson(target)
  const buildCommand = options.buildCommand || discoverBuildCommand(pkg)
  let runtimeEvidencePath = resolveTargetPath(target, options.runtimeEvidence || '')
  let runtimeEvidence = await readJsonIfExists(runtimeEvidencePath)
  let capturedRuntimeEvidencePath = ''
  const runtimeUrl = String(options.runtimeUrl || '').trim()
  const timeout = Number(options.timeout || 15000)
  const viewport = parseViewport(options.viewport)
  const visualEvidence = options.visualEvidence || ''
  const warningWaiverPath = resolveTargetPath(target, options.warningWaiver || DEFAULT_WARNING_WAIVER_RELATIVE_PATH)
  const warningWaivers = normalizeWaivers(await readJsonIfExists(warningWaiverPath))
  const steps = {}
  const issues = []

  const adapterGate = await runAdapterGate({ targetRoot: target, profile: acceptanceProfile })
  steps.adapterGate = step(toStepStatus(adapterGate.ok), {
    hostContractPath: adapterGate.hostContractPath,
    issues: adapterGate.issues,
    blockingIssues: adapterGate.blockingIssues,
  })
  if (!adapterGate.ok) issues.push('legacy adapter gate failed')

  const staticGate = await verifyLegacyPage({
    target,
    pageType,
    page,
    remoteEntry,
    requireRemoteEntry: false,
  })
  steps.staticGate = step(staticGate.status === 'passed' ? 'passed' : 'failed', {
    issues: staticGate.issues,
    checks: staticGate.checks,
  })
  steps.runtimeProvenance = step(
    staticGate.checks?.runtimeSeal && staticGate.checks?.runtimeCoreHash ? 'passed' : 'failed',
    {
      runtimeSeal: staticGate.files?.runtimeSeal || '',
      checks: {
        runtimeSeal: Boolean(staticGate.checks?.runtimeSeal),
        runtimeCoreHash: Boolean(staticGate.checks?.runtimeCoreHash),
      },
      issues: filterIssuesByCode(staticGate.issues, (code) => code.startsWith('runtime.seal') || code.startsWith('runtime.core')),
    }
  )
  if (steps.runtimeProvenance.status !== 'passed') issues.push('runtime provenance gate failed')

  steps.shellBinding = step(
    staticGate.checks?.runtimeCanonicalShell && staticGate.checks?.runtimePrimitiveFallback ? 'passed' : 'failed',
    {
      pageType,
      checks: {
        runtimeCanonicalShell: Boolean(staticGate.checks?.runtimeCanonicalShell),
        runtimePrimitiveFallback: Boolean(staticGate.checks?.runtimePrimitiveFallback),
      },
      issues: filterIssuesByCode(staticGate.issues, (code) => code.startsWith('runtime.canonicalShell') || code.startsWith('runtime.primitiveRegionFallback')),
    }
  )
  if (steps.shellBinding.status !== 'passed') issues.push('runtime shell binding gate failed')

  steps.peerResolution = step(
    staticGate.checks?.runtimePeerResolution ? 'passed' : 'failed',
    {
      runtimeCompatibilityLock: staticGate.files?.runtimeCompatibilityLock || '',
      checks: {
        runtimePeerResolution: Boolean(staticGate.checks?.runtimePeerResolution),
      },
      issues: filterIssuesByCode(staticGate.issues, (code) => code.startsWith('runtime.peerResolution') || code.startsWith('runtime.compatibilityLock')),
    }
  )
  if (steps.peerResolution.status !== 'passed') issues.push('runtime peer/export resolution gate failed')
  steps.runtimeProvider = step(
    staticGate.checks?.runtimeProvider ? 'passed' : 'failed',
    {
      runtimeProviderContract: staticGate.files?.runtimeProviderContract || '',
      declared: Boolean(staticGate.checks?.runtimeProviderDeclared),
      checks: {
        runtimeProvider: Boolean(staticGate.checks?.runtimeProvider),
      },
      issues: filterIssuesByCode(staticGate.issues, (code) => code.startsWith('runtimeProvider.')),
    }
  )
  if (steps.runtimeProvider.status !== 'passed') issues.push('runtime provider contract gate failed')
  if (staticGate.status !== 'passed') {
    issues.push('static legacy verification failed')
  }

  if (steps.staticGate.status === 'passed') {
    steps.build = await runBuildGate({ target, command: buildCommand })
    if (steps.build.status !== 'passed') issues.push('build gate failed')
  } else {
    steps.build = step('not-run', { reason: 'static legacy verification failed' })
  }

  if (steps.build.status === 'not-run') {
    steps.buildWarningClassification = step('not-run', { reason: steps.build.reason || 'build gate not run' })
  } else {
    const buildWarnings = steps.build.warningClassification || { p0: [], p1: [], info: [] }
    const buildP1WaiverResult = applyWarningWaivers(buildWarnings.p1, warningWaivers)
    steps.buildWarningClassification = step(
      buildWarnings.p0.length === 0 && buildP1WaiverResult.unwaived.length === 0 ? 'passed' : 'failed',
      {
        p0: buildWarnings.p0,
        p1: buildP1WaiverResult.unwaived,
        waivedP1: buildP1WaiverResult.waived,
        info: buildWarnings.info,
        waiverFile: normalizeRelativePath(path.relative(target, warningWaiverPath)),
        issues: [
          ...(buildWarnings.p0.length > 0 ? [`P0 build warnings: ${buildWarnings.p0.length}`] : []),
          ...(buildP1WaiverResult.unwaived.length > 0 ? [`P1 build warnings require fix or explicit waiver: ${buildP1WaiverResult.unwaived.length}`] : []),
        ],
      }
    )
    if (buildWarnings.p0.length > 0) issues.push('P0 build warnings found')
    if (buildP1WaiverResult.unwaived.length > 0) issues.push('P1 build warnings found')
  }

  if (steps.build.status === 'passed') {
    const remoteGate = await verifyLegacyPage({
      target,
      pageType,
      page,
      remoteEntry,
      requireRemoteEntry: true,
    })
    steps.remoteEntry = step(remoteGate.status === 'passed' ? 'passed' : 'failed', {
      issues: remoteGate.issues,
      checks: remoteGate.checks,
      file: remoteGate.files.remoteEntry,
    })
    if (remoteGate.status !== 'passed') issues.push('remoteEntry gate failed')
  } else {
    steps.remoteEntry = step('not-run', { reason: 'build gate did not pass' })
  }

  const runtimeHarnessRequired = steps.build.status === 'passed' && !runtimeEvidence && isLegacyRuntimeHarnessUrl(runtimeUrl)
  if (runtimeHarnessRequired) {
    const runtimeHarness = await ensureLegacyRuntimeHarness({ target })
    steps.runtimeHarness = step(toStepStatus(runtimeHarness.ok), {
      required: true,
      path: runtimeHarness.harnessPath,
      vendorFiles: runtimeHarness.vendorFiles || [],
      issues: runtimeHarness.issues,
    })
    if (!runtimeHarness.ok) issues.push('runtime harness gate failed')
  } else {
    steps.runtimeHarness = step('not-run', {
      required: false,
      reason: runtimeEvidence
        ? 'runtime evidence file was provided'
        : runtimeUrl
          ? 'runtime-url does not point to hiui-runtime-harness.html'
          : 'runtime-url was not provided',
    })
  }

  if (!runtimeEvidence && runtimeUrl && steps.runtimeHarness.status !== 'failed') {
    try {
      const captured = await captureRuntimeEvidence({ target, page, runtimeUrl, timeout, viewport })
      runtimeEvidence = captured.evidence
      capturedRuntimeEvidencePath = captured.evidencePath
      runtimeEvidencePath = path.join(target, captured.evidencePath)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      runtimeEvidence = null
      steps.runtimeCapture = step('failed', { url: runtimeUrl, issues: [message] })
      issues.push('runtime evidence capture failed')
    }
  } else if (!runtimeEvidence && runtimeUrl && steps.runtimeHarness.status === 'failed') {
    steps.runtimeCapture = step('failed', { url: runtimeUrl, issues: ['runtime harness gate failed before capture'] })
    issues.push('runtime evidence capture skipped after harness failure')
  } else if (runtimeUrl) {
    steps.runtimeCapture = step('skipped', { reason: 'runtime evidence file was provided', url: runtimeUrl })
  }

  if (!steps.runtimeCapture) {
    steps.runtimeCapture = runtimeUrl
      ? step('passed', { url: runtimeUrl, evidence: capturedRuntimeEvidencePath })
      : step('not-run', { reason: 'runtime-url was not provided' })
  }
  const runtimeCapture = classifyRuntimeCapture({ runtimeUrl, runtimeEvidence, capturedRuntimeEvidencePath })
  steps.runtimeCapture = step(steps.runtimeCapture.status, {
    ...steps.runtimeCapture,
    kind: runtimeCapture.kind,
    runtimeUrl: runtimeCapture.runtimeUrl,
    evidenceUrl: runtimeCapture.evidenceUrl,
    hostBacked: runtimeCapture.hostBacked,
    captured: runtimeCapture.captured,
    issues: [...(steps.runtimeCapture.issues || []), ...runtimeCapture.issues],
  })
  const runtimeCaptureProfileGate = evaluateRuntimeCaptureForProfile({ profile: acceptanceProfile, capture: runtimeCapture })
  if (!runtimeCaptureProfileGate.ok) {
    steps.runtimeCapture.status = 'failed'
    steps.runtimeCapture.issues = [...(steps.runtimeCapture.issues || []), ...runtimeCaptureProfileGate.issues]
    issues.push('runtime capture profile gate failed')
  } else if (runtimeEvidence && steps.runtimeCapture.status !== 'failed') {
    steps.runtimeCapture.status = 'passed'
  }

  if (runtimeEvidence) {
    const runtimeDom = validateRuntimeDomEvidence(runtimeEvidence, pageType)
    steps.runtimeDom = step(toStepStatus(runtimeDom.ok), {
      evidence: normalizeRelativePath(options.runtimeEvidence || capturedRuntimeEvidencePath || path.relative(target, runtimeEvidencePath)),
      result: runtimeDom.result,
      issues: runtimeDom.failures,
    })
    if (!runtimeDom.ok) issues.push('runtime DOM evidence failed')
  } else {
    steps.runtimeDom = step('failed', {
      evidence: normalizeRelativePath(options.runtimeEvidence || ''),
      issues: ['runtime DOM evidence is required; pass --runtime-url <url> or --runtime-evidence <json> generated by runtime smoke'],
    })
    issues.push('runtime DOM evidence missing')
  }

  const domGeometryGate = runDomGeometryGate({ runtimeEvidence, profile: acceptanceProfile, pageType })
  steps.domGeometry = step(toStepStatus(domGeometryGate.ok), {
    issues: domGeometryGate.issues,
    blockingIssues: domGeometryGate.blockingIssues,
    geometry: domGeometryGate.geometry,
    computedStyles: domGeometryGate.computedStyles,
    metrics: domGeometryGate.metrics,
  })
  if (!domGeometryGate.ok) issues.push('runtime DOM geometry failed')

  const visualGate = await runVisualEvidenceGate({
    targetRoot: target,
    runtimeEvidence,
    visualEvidence,
    profile: acceptanceProfile,
  })
  steps.visualEvidence = step(toStepStatus(visualGate.ok), {
    path: visualGate.path,
    source: visualGate.source,
    runtimeUrl: visualGate.runtimeUrl,
    viewport: visualGate.viewport,
    issues: visualGate.issues,
  })
  if (!visualGate.ok) issues.push('visual evidence missing')

  const warnings = classifyConsoleMessages(extractConsoleMessages(runtimeEvidence))
  const p1WaiverResult = applyWarningWaivers(warnings.p1, warningWaivers)
  steps.warningClassification = step(warnings.p0.length === 0 && p1WaiverResult.unwaived.length === 0 ? 'passed' : 'failed', {
    p0: warnings.p0,
    p1: p1WaiverResult.unwaived,
    waivedP1: p1WaiverResult.waived,
    waiverFile: normalizeRelativePath(path.relative(target, warningWaiverPath)),
    infoCount: warnings.info.length,
    issues: [
      ...(warnings.p0.length > 0 ? [`P0 console issues: ${warnings.p0.length}`] : []),
      ...(p1WaiverResult.unwaived.length > 0 ? [`P1 console warnings require fix or explicit waiver: ${p1WaiverResult.unwaived.length}`] : []),
    ],
  })
  if (warnings.p0.length > 0) issues.push('P0 console issues found')
  if (p1WaiverResult.unwaived.length > 0) issues.push('P1 console warnings found')

  const requiredStepStatuses = [
    steps.staticGate,
    steps.runtimeProvenance,
    steps.shellBinding,
    steps.peerResolution,
    steps.runtimeProvider,
    steps.adapterGate,
    ...(steps.runtimeHarness.required ? [steps.runtimeHarness] : []),
    steps.build,
    steps.buildWarningClassification,
    steps.remoteEntry,
    steps.runtimeCapture,
    steps.runtimeDom,
    steps.domGeometry,
    steps.visualEvidence,
    steps.warningClassification,
  ].map((item) => item.status)
  const accepted = requiredStepStatuses.every((status) => status === 'passed')
  const status = resolveLegacyAcceptanceStatus({ profile: acceptanceProfile, passed: accepted })
  const report = {
    schemaVersion: 'legacy-acceptance-result.v1',
    status,
    accepted,
    acceptanceProfile,
    target,
    pageType,
    page,
    remoteEntry,
    buildCommand,
    files: {
      runtimeEvidence: normalizeRelativePath(options.runtimeEvidence || capturedRuntimeEvidencePath || ''),
      visualEvidence: steps.visualEvidence.path,
    },
    steps,
    issues,
  }
  report.reportPath = await writeReport({ target, page, report })
  if (accepted) {
    report.contractWorkflow = await writeLegacyAcceptanceWorkflow({
      target,
      page,
      report,
      reportPath: report.reportPath,
    })
    report.reportPath = await writeReport({ target, page, report })
  } else {
    report.contractWorkflow = {
      status: 'skipped',
      changed: false,
      reason: 'legacy acceptance did not pass',
    }
    report.reportPath = await writeReport({ target, page, report })
  }
  return report
}
