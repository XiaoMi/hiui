import fs from 'fs'
import path from 'path'
import http from 'http'
import https from 'https'
import { spawn } from 'child_process'
import { createRequire } from 'module'
import { pathToFileURL } from 'url'
import {
  PAGEGEN_ROOT,
  REPO_ROOT,
  assert,
  assertPageDirectoryArg,
  ensureDir,
  parseArgs,
  readJson,
  readOfficialRuntimeRegistry,
  readProjectModeLock,
  relativeToRoot,
  writeJson,
} from '../generators/shared.mjs'
import {
  readAssetGovernanceRegistry,
  resolveAssetGovernanceState,
  resolvePageTypeGovernancePolicy,
} from '../generators/asset-governance.mjs'

const VISUAL_ROOT = path.resolve(PAGEGEN_ROOT, 'visual')
const SUBAPP_ROOT = path.resolve(PAGEGEN_ROOT, '../../subapps/typical-page-shell-runtime')
const SPECS_PATH = path.resolve(VISUAL_ROOT, 'specs.json')
const OUTPUT_ROOT = path.resolve(PAGEGEN_ROOT, 'outputs', 'visual')
const LOG_ROOT = path.resolve(OUTPUT_ROOT, 'logs')
const DEFAULT_TIMEOUT = 120000
const OFFICIAL_MIRROR_MAX_DIFF_RATIO = 0.05
const OFFICIAL_URL = 'http://127.0.0.1:4173/'
const VISUAL_DEPENDENCY_MODULES = ['playwright', 'pixelmatch', 'pngjs']

function parsePageIds(raw) {
  return String(raw || '')
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function requestUrl(targetUrl) {
  const client = targetUrl.startsWith('https:') ? https : http

  return new Promise((resolve, reject) => {
    const req = client.get(targetUrl, (response) => {
      response.resume()
      if (response.statusCode && response.statusCode >= 200 && response.statusCode < 500) {
        resolve(response.statusCode)
        return
      }
      reject(new Error(`unexpected status: ${response.statusCode || 'unknown'}`))
    })

    req.on('error', reject)
    req.setTimeout(3000, () => {
      req.destroy(new Error('timeout'))
    })
  })
}

async function waitForUrl(targetUrl, timeoutMs) {
  const startedAt = Date.now()
  let lastError = ''

  while (Date.now() - startedAt < timeoutMs) {
    try {
      await requestUrl(targetUrl)
      return
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
      await delay(1000)
    }
  }

  throw new Error(`等待服务超时：${targetUrl}；最后错误：${lastError}`)
}

async function isUrlReady(targetUrl) {
  try {
    await requestUrl(targetUrl)
    return true
  } catch {
    return false
  }
}

function spawnLoggedProcess({ command, args, cwd, logName }) {
  ensureDir(LOG_ROOT)
  const logPath = path.resolve(LOG_ROOT, logName)
  const stream = fs.createWriteStream(logPath, { flags: 'w' })
  const child = spawn(command, args, {
    cwd,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  child.stdout.on('data', (chunk) => {
    stream.write(chunk)
  })
  child.stderr.on('data', (chunk) => {
    stream.write(chunk)
  })

  return {
    child,
    logPath,
    close: () => stream.end(),
  }
}

function looksLikePagePath(token) {
  const normalized = String(token || '').trim()
  return (
    normalized.includes('/') ||
    normalized.includes('\\') ||
    normalized.endsWith('.tsx') ||
    normalized.endsWith('.jsx') ||
    normalized.startsWith('src/')
  )
}

function killProcess(entry) {
  if (!entry?.child || entry.child.killed) {
    entry?.close?.()
    return
  }

  entry.child.kill('SIGTERM')
  entry.close?.()
}

export function collectMissingVisualDeps(resolveModule) {
  return VISUAL_DEPENDENCY_MODULES.filter((moduleName) => {
    try {
      resolveModule(moduleName)
      return false
    } catch {
      return true
    }
  })
}

export function resolveVisualVerificationRuntime({
  args = {},
  subappRootExists = fs.existsSync(SUBAPP_ROOT),
  officialUrlReady = false,
} = {}) {
  const explicitUrl = String(args.url || '').trim()

  if (officialUrlReady || subappRootExists) {
    return {
      status: 'baseline-diff',
      explicitUrl,
    }
  }

  if (explicitUrl) {
    return {
      status: 'project-url-only',
      explicitUrl,
      reason:
        '当前项目未内置 typical-page-shell-runtime，已降级为业务页面可达性/截图模式，不执行官方基线 diff。',
    }
  }

  return {
    status: 'blocked',
    explicitUrl: '',
    reason: `当前项目缺少 ${relativeToRoot(
      SUBAPP_ROOT
    )}，无法执行官方基线 visual diff。该 visual gate 不再静默跳过；请补齐该运行时，或传入 --url <project-preview-url> 进入受限项目页面模式。`,
  }
}

export function resolveVisualSpecIdFromPagePath(
  targetPagePath,
  { repoRoot = REPO_ROOT, readJsonImpl = readJson } = {}
) {
  assertPageDirectoryArg(targetPagePath, { flagName: '--page-path' })
  const pageDir = path.resolve(repoRoot, targetPagePath)
  const schemaPath = path.resolve(pageDir, 'page.schema.json')
  const metaPath = path.resolve(pageDir, 'hiui-pagegen.meta.json')

  assert(
    fs.existsSync(schemaPath) || fs.existsSync(metaPath),
    `未找到业务页面定义：${targetPagePath}；请确认页面目录下至少包含 page.schema.json 或 hiui-pagegen.meta.json`
  )

  const schema = fs.existsSync(schemaPath) ? readJsonImpl(schemaPath) : null
  const meta = fs.existsSync(metaPath) ? readJsonImpl(metaPath) : null
  const resolvedSpecId = String(
    schema?.pageType || meta?.pageType || meta?.officialRuntime?.pageId || ''
  ).trim()

  assert(
    resolvedSpecId,
    `无法从 ${targetPagePath} 解析视觉基线页型；请补齐 page.schema.json.pageType 或 hiui-pagegen.meta.json.pageType`
  )

  return resolvedSpecId
}

export function resolveRequestedVisualSpecIds(
  args = {},
  { specs = [], repoRoot = REPO_ROOT, readJsonImpl = readJson } = {}
) {
  const explicitPagePath = String(args['page-path'] || '').trim()
  if (explicitPagePath) {
    return [resolveVisualSpecIdFromPagePath(explicitPagePath, { repoRoot, readJsonImpl })]
  }

  const requestedPages = parsePageIds(args.page)
  if (requestedPages.length === 0) {
    return specs.map((spec) => spec.id)
  }

  return requestedPages.map((pageToken) =>
    looksLikePagePath(pageToken)
      ? resolveVisualSpecIdFromPagePath(pageToken, { repoRoot, readJsonImpl })
      : pageToken
  )
}

function loadVisualDeps() {
  const requireFromSubapp = createRequire(path.resolve(SUBAPP_ROOT, 'package.json'))
  const missingModules = collectMissingVisualDeps((moduleName) => requireFromSubapp.resolve(moduleName))

  assert(
    missingModules.length === 0,
    `视觉校验依赖缺失：${missingModules.join(', ')}。请先在 ${relativeToRoot(
      SUBAPP_ROOT
    )} 补齐这些依赖后再执行 typical-page:verify:visual。`
  )

  const playwright = requireFromSubapp('playwright')
  const pixelmatch = requireFromSubapp('pixelmatch')
  const { PNG } = requireFromSubapp('pngjs')

  return {
    chromium: playwright.chromium,
    pixelmatch,
    PNG,
  }
}

function buildPreviewPageUrl(pageId) {
  return `${OFFICIAL_URL}?page=${pageId}&standalone=1#${pageId}`
}

function buildOfficialPageUrl(pageId) {
  return `${OFFICIAL_URL}?page=${pageId}&standalone=1#${pageId}`
}

async function capturePageScreenshot(page, url, viewport, outputPath, readySelector) {
  await page.setViewportSize(viewport)
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector(readySelector, { timeout: 30000 })
  await page.waitForTimeout(1200)
  await page.screenshot({
    path: outputPath,
    animations: 'disabled',
    fullPage: true,
  })
}

function expandPngToCanvas(PNG, sourcePng, width, height) {
  const canvas = new PNG({
    width,
    height,
    colorType: 6,
  })

  canvas.data.fill(255)
  PNG.bitblt(sourcePng, canvas, 0, 0, sourcePng.width, sourcePng.height, 0, 0)
  return canvas
}

function comparePngFiles({ PNG, pixelmatch, actualPath, expectedPath, diffPath }) {
  const actual = PNG.sync.read(fs.readFileSync(actualPath))
  const expected = PNG.sync.read(fs.readFileSync(expectedPath))
  const width = Math.max(actual.width, expected.width)
  const height = Math.max(actual.height, expected.height)
  const actualCanvas = expandPngToCanvas(PNG, actual, width, height)
  const expectedCanvas = expandPngToCanvas(PNG, expected, width, height)
  const diff = new PNG({ width, height })
  diff.data.fill(255)

  const mismatchedPixels = pixelmatch(
    actualCanvas.data,
    expectedCanvas.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.1,
      alpha: 0.5,
      diffColor: [255, 71, 87],
      diffColorAlt: [255, 159, 26],
    }
  )

  fs.writeFileSync(diffPath, PNG.sync.write(diff))

  return {
    actualSize: { width: actual.width, height: actual.height },
    expectedSize: { width: expected.width, height: expected.height },
    canvasSize: { width, height },
    mismatchedPixels,
    diffRatio: mismatchedPixels / (width * height),
  }
}

function resolveSpecGate(spec, governanceRegistry, officialRuntimeRegistry, projectModeLock) {
  const pagePolicy = resolvePageTypeGovernancePolicy(spec.id, {
    projectMode: projectModeLock?.mode,
    projectType: projectModeLock?.projectType,
  })
  const canonicalGovernance = resolveAssetGovernanceState({
    pageType: spec.id,
    generationMode: 'canonical',
    projectMode: projectModeLock?.mode,
    projectType: projectModeLock?.projectType,
  })
  const canonicalProfile = pagePolicy.compatibilityProfile || pagePolicy.canonicalProfile || 'legacy'
  const runtimeEntry = officialRuntimeRegistry[spec.id] || null

  if (canonicalProfile === 'official-mirror' && canonicalGovernance.parityStatus === 'parity-manifest-required') {
    assert(runtimeEntry, `${spec.id} 已声明 official-mirror，但缺少官方 runtime registry 记录`)
    assert(
      canonicalGovernance.parityContract === 'required',
      `${spec.id} official-mirror 缺少 parityContract=required`
    )
    assert(
      canonicalGovernance.driftWhitelistPolicy === 'zero-or-explicit-whitelist',
      `${spec.id} official-mirror 缺少 driftWhitelistPolicy=zero-or-explicit-whitelist`
    )
    assert(
      spec.previewPageId === `pagegen-${spec.id}`,
      `${spec.id} previewPageId=${spec.previewPageId || ''}，official-mirror 页型必须固定为 pagegen-${spec.id}`
    )
    assert(
      spec.officialPageId === runtimeEntry.pageId,
      `${spec.id} officialPageId=${spec.officialPageId || ''}，必须与官方 runtime registry 的 ${runtimeEntry.pageId} 保持一致`
    )
  }

  const configuredMaxDiffRatio = Number(spec.maxDiffRatio || 0.1)
  const cappedMaxDiffRatio =
    canonicalProfile === 'official-mirror'
      ? Math.min(configuredMaxDiffRatio, OFFICIAL_MIRROR_MAX_DIFF_RATIO)
      : configuredMaxDiffRatio

  return {
    canonicalProfile,
    runtimeEntry,
    configuredMaxDiffRatio,
    effectiveMaxDiffRatio: cappedMaxDiffRatio,
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const timeoutMs = Number(args.timeout || DEFAULT_TIMEOUT)
  const thresholdOverride = args.threshold ? Number(args.threshold) : null
  const specs = readJson(SPECS_PATH)
  const requestedSpecIds = new Set(resolveRequestedVisualSpecIds(args, { specs }))
  const governanceRegistry = readAssetGovernanceRegistry()
  const officialRuntimeRegistry = readOfficialRuntimeRegistry()
  const projectModeLock = readProjectModeLock()
  const selectedSpecs = requestedSpecIds.size
    ? specs.filter((spec) => requestedSpecIds.has(spec.id))
    : specs

  assert(selectedSpecs.length > 0, '没有命中任何视觉基线页，请检查 --page 参数')

  ensureDir(OUTPUT_ROOT)
  const summaryPath = path.resolve(OUTPUT_ROOT, 'report.json')

  const managedProcesses = []
  let latestSummary = null

  try {
    const officialUrlReady = await isUrlReady(OFFICIAL_URL)
    const runtimePlan = resolveVisualVerificationRuntime({
      args,
      subappRootExists: fs.existsSync(SUBAPP_ROOT),
      officialUrlReady,
    })

    if (runtimePlan.status === 'blocked') {
      const summary = {
        verifiedAt: new Date().toISOString(),
        status: 'blocked',
        mode: 'baseline-diff-unavailable',
        reason: runtimePlan.reason,
        specs: [],
      }
      writeJson(summaryPath, summary)
      throw new Error(runtimePlan.reason)
    }

    if (runtimePlan.status === 'project-url-only') {
      await waitForUrl(runtimePlan.explicitUrl, timeoutMs)
      const summary = {
        verifiedAt: new Date().toISOString(),
        status: 'blocked',
        mode: 'project-url-only',
        reason: `${runtimePlan.reason} 项目 URL 模式只能提供 reachability 证据，不能替代官方基线 diff。`,
        url: runtimePlan.explicitUrl,
        reachability: 'reachable',
        specs: selectedSpecs.map((spec) => ({
          id: spec.id,
          label: spec.label,
          status: 'blocked',
          mode: 'project-url-only',
          url: runtimePlan.explicitUrl,
        })),
      }
      writeJson(summaryPath, summary)
      throw new Error(summary.reason)
    }

    if (!officialUrlReady) {
      const officialServer = spawnLoggedProcess({
        command: 'pnpm',
        args: ['--dir', 'subapps/typical-page-shell-runtime', 'dev'],
        cwd: REPO_ROOT,
        logName: 'official-runtime.log',
      })
      managedProcesses.push(officialServer)
    }

    await waitForUrl(OFFICIAL_URL, timeoutMs)

    let chromium
    let pixelmatch
    let PNG
    try {
      ;({ chromium, pixelmatch, PNG } = loadVisualDeps())
    } catch (error) {
      const fallbackReason = error instanceof Error ? error.message : String(error)

      if (runtimePlan.explicitUrl) {
        await waitForUrl(runtimePlan.explicitUrl, timeoutMs)
        const summary = {
          verifiedAt: new Date().toISOString(),
          status: 'blocked',
          mode: 'project-url-only',
          reason: `${fallbackReason}；项目 URL 模式只能提供 reachability 证据，不能替代官方基线 diff。`,
          url: runtimePlan.explicitUrl,
          reachability: 'reachable',
          specs: selectedSpecs.map((spec) => ({
            id: spec.id,
            label: spec.label,
            status: 'blocked',
            mode: 'project-url-only',
            url: runtimePlan.explicitUrl,
          })),
        }
        writeJson(summaryPath, summary)
        throw new Error(summary.reason)
      }

      const summary = {
        verifiedAt: new Date().toISOString(),
        status: 'blocked',
        mode: 'baseline-diff-unavailable',
        reason: fallbackReason,
        specs: [],
      }
      writeJson(summaryPath, summary)
      throw new Error(fallbackReason)
    }
    const browser = await chromium.launch({ headless: true })
    const reports = []

    try {
      for (const spec of selectedSpecs) {
      const gate = resolveSpecGate(spec, governanceRegistry, officialRuntimeRegistry, projectModeLock)
        const pageOutputDir = path.resolve(OUTPUT_ROOT, spec.id)
        ensureDir(pageOutputDir)
        const previewImagePath = path.resolve(pageOutputDir, 'preview.png')
        const officialImagePath = path.resolve(pageOutputDir, 'official.png')
        const diffImagePath = path.resolve(pageOutputDir, 'diff.png')

        const previewPage = await browser.newPage({
          viewport: spec.viewport,
          deviceScaleFactor: 1,
          colorScheme: 'light',
        })
        const officialPage = await browser.newPage({
          viewport: spec.viewport,
          deviceScaleFactor: 1,
          colorScheme: 'light',
        })

        try {
          await capturePageScreenshot(
            previewPage,
            buildPreviewPageUrl(spec.previewPageId),
            spec.viewport,
            previewImagePath,
            'main[data-runtime="typical-page-shell"]'
          )
          await capturePageScreenshot(
            officialPage,
            buildOfficialPageUrl(spec.officialPageId),
            spec.viewport,
            officialImagePath,
            'main[data-runtime="typical-page-shell"]'
          )
        } finally {
          await previewPage.close()
          await officialPage.close()
        }

        const comparison = comparePngFiles({
          PNG,
          pixelmatch,
          actualPath: previewImagePath,
          expectedPath: officialImagePath,
          diffPath: diffImagePath,
        })

        const maxDiffRatio =
          thresholdOverride != null && Number.isFinite(thresholdOverride)
            ? Math.min(gate.effectiveMaxDiffRatio, thresholdOverride)
            : gate.effectiveMaxDiffRatio

        reports.push({
          id: spec.id,
          label: spec.label,
          status: comparison.diffRatio <= maxDiffRatio ? 'passed' : 'failed',
          canonicalProfile: gate.canonicalProfile,
          visualTruthPageId: gate.runtimeEntry?.pageId || spec.officialPageId,
          configuredMaxDiffRatio: gate.configuredMaxDiffRatio,
          maxDiffRatio,
          previewUrl: buildPreviewPageUrl(spec.previewPageId),
          officialUrl: buildOfficialPageUrl(spec.officialPageId),
          previewImagePath: relativeToRoot(previewImagePath),
          officialImagePath: relativeToRoot(officialImagePath),
          diffImagePath: relativeToRoot(diffImagePath),
          ...comparison,
        })
      }
    } finally {
      await browser.close()
    }

    const summary = {
      verifiedAt: new Date().toISOString(),
      status: reports.every((item) => item.status === 'passed') ? 'passed' : 'failed',
      specs: reports,
    }
    latestSummary = summary
    writeJson(summaryPath, summary)

    console.log(`hiui-pagegen verify-visual report: ${relativeToRoot(summaryPath)}`)

    const failures = reports.filter((item) => item.status !== 'passed')
    if (failures.length > 0) {
      throw new Error(
        failures
          .map(
            (item) =>
              `${item.id} 视觉差异超阈值：${(item.diffRatio * 100).toFixed(2)}% > ${(
                item.maxDiffRatio * 100
              ).toFixed(2)}%`
          )
          .join('\n')
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    writeJson(summaryPath, {
      ...(latestSummary || {
        verifiedAt: new Date().toISOString(),
        specs: [],
      }),
      status: 'failed',
      errorMessage: message,
    })
    console.error(`hiui-pagegen verify-visual failed: ${relativeToRoot(summaryPath)}`)
    console.error(message)
    process.exitCode = 1
  } finally {
    managedProcesses.forEach(killProcess)
  }
}

const isDirectExecution = (() => {
  if (!process.argv[1]) {
    return false
  }

  try {
    return fs.realpathSync(path.resolve(process.argv[1])) === fs.realpathSync(new URL(import.meta.url))
  } catch {
    return import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
  }
})()

if (isDirectExecution) {
  main()
}
