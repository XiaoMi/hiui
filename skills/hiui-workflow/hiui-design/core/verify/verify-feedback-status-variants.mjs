import fs from 'fs'
import path from 'path'
import http from 'http'
import https from 'https'
import { spawn } from 'child_process'
import { createRequire } from 'module'
import {
  PAGEGEN_ROOT,
  REPO_ROOT,
  assert,
  ensureDir,
  parseArgs,
  readJson,
  readOfficialRuntimeRegistry,
  relativeToRoot,
  resolveOfficialRuntimePageIdForSchema,
  writeJson,
} from '../generators/shared.mjs'

const SUBAPP_ROOT = path.resolve(PAGEGEN_ROOT, '../../subapps/typical-page-shell-runtime')
const OFFICIAL_URL = 'http://127.0.0.1:4173/'
const DEFAULT_TIMEOUT = 120000
const DEFAULT_VIEWPORT = { width: 1440, height: 1200 }
const VARIANTS_PATH = path.resolve(PAGEGEN_ROOT, 'recipes', 'probes', 'feedback-status.variants.json')
const OUTPUT_ROOT = path.resolve(PAGEGEN_ROOT, 'outputs', 'feedback-status-variants')
const LOG_ROOT = path.resolve(OUTPUT_ROOT, 'logs')

function parseVariantList(raw) {
  return String(raw || '')
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
}

function encodeUnicodeBase64(rawValue) {
  return Buffer.from(rawValue, 'utf8').toString('base64')
}

function buildSchemaPayload(schema) {
  return encodeUnicodeBase64(
    JSON.stringify({
      pageType: 'feedback-status',
      schema,
    })
  )
}

function buildVariantUrl(pageId, schema) {
  const url = new URL(OFFICIAL_URL)
  url.searchParams.set('page', pageId)
  url.searchParams.set('standalone', '1')
  url.searchParams.set('schemaPayload', buildSchemaPayload(schema))
  return url.toString()
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

function killProcess(entry) {
  if (!entry?.child || entry.child.killed) {
    entry?.close?.()
    return
  }

  entry.child.kill('SIGTERM')
  entry.close?.()
}

function loadChromium() {
  const requireFromSubapp = createRequire(path.resolve(SUBAPP_ROOT, 'package.json'))
  const playwright = requireFromSubapp('playwright')
  return playwright.chromium
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const timeoutMs = Number(args.timeout || DEFAULT_TIMEOUT)
  const requestedVariants = new Set(parseVariantList(args.variant))
  const variants = readJson(VARIANTS_PATH)
  const selectedVariants = requestedVariants.size
    ? variants.filter((item) => requestedVariants.has(item.variant))
    : variants

  assert(selectedVariants.length > 0, '没有命中任何 feedback-status variant，请检查 --variant 参数')

  const registry = readOfficialRuntimeRegistry()
  const runtimeEntry = registry['feedback-status']
  assert(runtimeEntry, '缺少 feedback-status 官方 runtime 注册信息')

  ensureDir(OUTPUT_ROOT)
  const managedProcesses = []
  const summaryPath = path.resolve(OUTPUT_ROOT, 'report.json')

  try {
    if (!(await isUrlReady(OFFICIAL_URL))) {
      const officialServer = spawnLoggedProcess({
        command: 'pnpm',
        args: ['--dir', 'subapps/typical-page-shell-runtime', 'dev'],
        cwd: REPO_ROOT,
        logName: 'feedback-status-variants-runtime.log',
      })
      managedProcesses.push(officialServer)
    }

    await waitForUrl(OFFICIAL_URL, timeoutMs)

    const chromium = loadChromium()
    const browser = await chromium.launch({ headless: true })
    const specs = []

    try {
      for (const variantSpec of selectedVariants) {
        const schema = {
          pageType: 'feedback-status',
          ...variantSpec,
        }
        const resolvedPageId = resolveOfficialRuntimePageIdForSchema(
          'feedback-status',
          runtimeEntry,
          schema
        )
        const url = buildVariantUrl(resolvedPageId, schema)
        const outputDir = path.resolve(OUTPUT_ROOT, variantSpec.variant)
        ensureDir(outputDir)
        const screenshotPath = path.resolve(outputDir, 'runtime.png')
        const page = await browser.newPage({
          viewport: DEFAULT_VIEWPORT,
          deviceScaleFactor: 1,
          colorScheme: 'light',
        })

        try {
          await page.goto(url, { waitUntil: 'networkidle' })
          await page.waitForSelector('main[data-runtime="typical-page-shell"]', { timeout: 30000 })
          await page.waitForTimeout(1200)

          const bodyText = await page.locator('body').innerText()
          assert(
            bodyText.includes(schema.title),
            `variant=${variantSpec.variant} 页面未命中标题文案：${schema.title}`
          )
          assert(
            bodyText.includes(schema.panelTitle),
            `variant=${variantSpec.variant} 页面未命中面板标题文案：${schema.panelTitle}`
          )
          assert(
            bodyText.includes(schema.docLinkText),
            `variant=${variantSpec.variant} 页面未命中说明文案：${schema.docLinkText}`
          )

          await page.screenshot({
            path: screenshotPath,
            animations: 'disabled',
            fullPage: true,
          })

          specs.push({
            variant: variantSpec.variant,
            status: 'passed',
            resolvedPageId,
            url,
            screenshotPath: relativeToRoot(screenshotPath),
            assertedTexts: [schema.title, schema.panelTitle, schema.docLinkText],
          })
        } finally {
          await page.close()
        }
      }
    } finally {
      await browser.close()
    }

    writeJson(summaryPath, {
      verifiedAt: new Date().toISOString(),
      status: 'passed',
      registrySource: relativeToRoot(path.resolve(PAGEGEN_ROOT, 'runtime-families', 'official-runtime-pages.json')),
      variantsSource: relativeToRoot(VARIANTS_PATH),
      specs,
    })

    console.log(`hiui-pagegen feedback-status variant proof passed: ${relativeToRoot(summaryPath)}`)
  } catch (error) {
    writeJson(summaryPath, {
      verifiedAt: new Date().toISOString(),
      status: 'failed',
      blockingIssues: [error instanceof Error ? error.message : String(error)],
      registrySource: relativeToRoot(path.resolve(PAGEGEN_ROOT, 'runtime-families', 'official-runtime-pages.json')),
      variantsSource: relativeToRoot(VARIANTS_PATH),
    })
    console.error(`hiui-pagegen feedback-status variant proof failed: ${relativeToRoot(summaryPath)}`)
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  } finally {
    managedProcesses.forEach(killProcess)
  }
}

main()
