import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import http from 'node:http'
import https from 'node:https'

const DEFAULT_OUTPUT_ROOT = 'src/typical-page-reuse'
const DEFAULT_SAMPLE_PATH = '/table/common/basic'
const DEFAULT_BASE_URLS = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5174',
  'http://localhost:5174',
  'http://127.0.0.1:4173',
  'http://localhost:4173',
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3001',
  'http://localhost:3001',
  'http://127.0.0.1:8080',
  'http://localhost:8080',
]
const DEV_SERVER_WAIT_TIMEOUT_MS = 30000
const DEV_SERVER_POLL_INTERVAL_MS = 750
const PROBE_TIMEOUT_MS = 1500

async function pathExists(targetPath) {
  try {
    await fsp.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(filePath) {
  if (!(await pathExists(filePath))) return null
  const raw = await fsp.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function probeBaseUrl(baseUrl, timeoutMs = PROBE_TIMEOUT_MS) {
  return new Promise((resolve) => {
    let parsedUrl
    try {
      parsedUrl = new URL(`${baseUrl}/`)
    } catch {
      resolve(false)
      return
    }

    const client = parsedUrl.protocol === 'https:' ? https : http
    let settled = false
    const finish = (value) => {
      if (settled) return
      settled = true
      resolve(value)
    }

    const request = client.request(
      parsedUrl,
      {
        method: 'GET',
        headers: {
          accept: 'text/html,application/xhtml+xml',
        },
      },
      (response) => {
        response.resume()
        finish((response.statusCode ?? 0) >= 200 && (response.statusCode ?? 0) < 500)
      }
    )

    request.on('error', () => finish(false))
    request.setTimeout(timeoutMs, () => {
      request.destroy()
      finish(false)
    })
    request.end()
  })
}

async function waitForReachableBaseUrl(baseUrls, timeoutMs = DEV_SERVER_WAIT_TIMEOUT_MS) {
  const startedAt = Date.now()

  while (Date.now() - startedAt <= timeoutMs) {
    const probeResults = await Promise.all(
      baseUrls.map(async (baseUrl) => ({
        baseUrl,
        ok: await probeBaseUrl(baseUrl),
      }))
    )

    const reachable = probeResults.find((item) => item.ok)
    if (reachable) {
      return reachable.baseUrl
    }

    await sleep(DEV_SERVER_POLL_INTERVAL_MS)
  }

  return ''
}

function buildBrowserOpenCommand(url) {
  switch (process.platform) {
    case 'darwin':
      return { command: 'open', args: [url] }
    case 'win32':
      return { command: 'cmd', args: ['/c', 'start', '', url] }
    default:
      return { command: 'xdg-open', args: [url] }
  }
}

function openBrowser(url) {
  try {
    const { command, args } = buildBrowserOpenCommand(url)
    const child = spawn(command, args, {
      detached: true,
      stdio: 'ignore',
    })
    child.unref()
    return { ok: true, detail: '' }
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    }
  }
}

async function detectPackageManager(targetRoot) {
  const pkg = await readJsonIfExists(path.join(targetRoot, 'package.json'))
  const packageManager = typeof pkg?.packageManager === 'string' ? pkg.packageManager : ''

  if (packageManager.startsWith('pnpm@')) return 'pnpm'
  if (packageManager.startsWith('yarn@')) return 'yarn'
  if (packageManager.startsWith('npm@')) return 'npm'
  if (packageManager.startsWith('bun@')) return 'bun'

  const lockfiles = [
    ['pnpm-lock.yaml', 'pnpm'],
    ['yarn.lock', 'yarn'],
    ['package-lock.json', 'npm'],
    ['bun.lockb', 'bun'],
    ['bun.lock', 'bun'],
  ]

  for (const [filename, manager] of lockfiles) {
    if (await pathExists(path.join(targetRoot, filename))) {
      return manager
    }
  }

  return 'npm'
}

function getDevCommand(manager) {
  switch (manager) {
    case 'pnpm':
      return { command: 'pnpm', args: ['dev'] }
    case 'yarn':
      return { command: 'yarn', args: ['dev'] }
    case 'bun':
      return { command: 'bun', args: ['run', 'dev'] }
    case 'npm':
    default:
      return { command: 'npm', args: ['run', 'dev'] }
  }
}

function extractSummaryFact(summary, label) {
  const pattern = new RegExp(`^- ${label}:\\s*(.+)$`, 'm')
  return summary.match(pattern)?.[1]?.trim() ?? ''
}

async function readHostIntegrationSummary(targetRoot, outputRootRelative) {
  const summaryPath = path.join(targetRoot, outputRootRelative, 'BOOTSTRAP_SUMMARY.md')
  if (!(await pathExists(summaryPath))) {
    return { summaryPath, summary: '' }
  }

  const summary = await fsp.readFile(summaryPath, 'utf8')
  return { summaryPath, summary }
}

function isAutoLaunchableHostIntegrationSummary(summary) {
  const mode = extractSummaryFact(summary, 'mode')
  const routeIntegration = extractSummaryFact(summary, 'route integration')

  if (mode !== 'host-integration') {
    return { ok: false, reason: 'bootstrap summary does not indicate host-integration mode' }
  }

  const launchableRouteStatuses = new Set(['patched', 'already-mounted', 'mounted-in-app'])
  if (!launchableRouteStatuses.has(routeIntegration)) {
    return {
      ok: false,
      reason:
        routeIntegration === ''
          ? 'bootstrap summary is missing route integration status'
          : `route integration is ${routeIntegration}, so the example route is not guaranteed to be reachable automatically`,
    }
  }

  return { ok: true, reason: '' }
}

async function startDetachedDevServer({ targetRoot, outputRootRelative }) {
  const packageJson = await readJsonIfExists(path.join(targetRoot, 'package.json'))
  if (!packageJson?.scripts || typeof packageJson.scripts.dev !== 'string' || packageJson.scripts.dev.trim() === '') {
    return {
      ok: false,
      detail: 'package.json does not expose a usable scripts.dev entry',
      logPath: '',
    }
  }

  const manager = await detectPackageManager(targetRoot)
  const { command, args } = getDevCommand(manager)
  const logDir = path.join(targetRoot, outputRootRelative)
  const logPath = path.join(logDir, 'HOST_INTEGRATION_DEV_SERVER.log')

  await fsp.mkdir(logDir, { recursive: true })
  const outFd = fs.openSync(logPath, 'a')
  const errFd = fs.openSync(logPath, 'a')

  try {
    const child = spawn(command, args, {
      cwd: targetRoot,
      detached: true,
      stdio: ['ignore', outFd, errFd],
      env: {
        ...process.env,
        BROWSER: 'none',
      },
    })
    child.unref()
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
      logPath,
    }
  } finally {
    fs.closeSync(outFd)
    fs.closeSync(errFd)
  }

  return {
    ok: true,
    detail: `${command} ${args.join(' ')}`,
    logPath,
  }
}

export async function autoLaunchHostIntegrationPreview({
  targetRoot,
  outputRootRelative = DEFAULT_OUTPUT_ROOT,
  logger = console,
  samplePath = DEFAULT_SAMPLE_PATH,
} = {}) {
  const normalizedOutputRoot = outputRootRelative || DEFAULT_OUTPUT_ROOT
  const { summaryPath, summary } = await readHostIntegrationSummary(targetRoot, normalizedOutputRoot)

  if (!summary) {
    return {
      status: 'not-applicable',
      detail: `missing bootstrap summary at ${summaryPath}`,
      url: '',
      logPath: '',
    }
  }

  const launchable = isAutoLaunchableHostIntegrationSummary(summary)
  if (!launchable.ok) {
    return {
      status: 'not-applicable',
      detail: launchable.reason,
      url: '',
      logPath: '',
    }
  }

  const baseUrls = [...DEFAULT_BASE_URLS]
  const reachableBeforeStart = await waitForReachableBaseUrl(baseUrls, PROBE_TIMEOUT_MS)

  if (reachableBeforeStart) {
    const pageUrl = `${reachableBeforeStart}${samplePath}`
    const browserOpen = openBrowser(pageUrl)
    if (!browserOpen.ok) {
      return {
        status: 'skipped',
        detail: `local dev server is reachable, but opening the browser failed: ${browserOpen.detail}`,
        url: pageUrl,
        logPath: '',
      }
    }
    return {
      status: 'opened-existing-server',
      detail: 'opened the host-integration sample page on an already-running local dev server',
      url: pageUrl,
      logPath: '',
    }
  }

  const devServerStart = await startDetachedDevServer({
    targetRoot,
    outputRootRelative: normalizedOutputRoot,
  })

  if (!devServerStart.ok) {
    return {
      status: 'skipped',
      detail: devServerStart.detail,
      url: '',
      logPath: devServerStart.logPath,
    }
  }

  if (logger?.log) {
    logger.log(`- host-integration dev server: started in background via ${devServerStart.detail}`)
    if (devServerStart.logPath) {
      logger.log(`  log: ${devServerStart.logPath}`)
    }
  }

  const reachableAfterStart = await waitForReachableBaseUrl(baseUrls)

  if (!reachableAfterStart) {
    return {
      status: 'skipped',
      detail: devServerStart.logPath
        ? `started the dev server, but no common local preview URL became reachable within ${DEV_SERVER_WAIT_TIMEOUT_MS}ms; inspect ${devServerStart.logPath}`
        : `started the dev server, but no common local preview URL became reachable within ${DEV_SERVER_WAIT_TIMEOUT_MS}ms`,
      url: '',
      logPath: devServerStart.logPath,
    }
  }

  const pageUrl = `${reachableAfterStart}${samplePath}`
  const browserOpen = openBrowser(pageUrl)
  if (!browserOpen.ok) {
    return {
      status: 'skipped',
      detail: `started the dev server, but opening the browser failed: ${browserOpen.detail}`,
      url: pageUrl,
      logPath: devServerStart.logPath,
    }
  }
  return {
    status: 'started-dev-server-and-opened',
    detail: 'started the local dev server in the background and opened the host-integration sample page',
    url: pageUrl,
    logPath: devServerStart.logPath,
  }
}
