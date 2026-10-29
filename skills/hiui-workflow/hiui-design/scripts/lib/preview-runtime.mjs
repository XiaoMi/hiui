import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'

export const DEFAULT_PREVIEW_RUNTIME_HOST = '127.0.0.1'
export const DEFAULT_PREVIEW_RUNTIME_PORT = '41731'
export const DEFAULT_PREVIEW_RUNTIME_EXAMPLE_ROUTE = '/table/common/basic'

function normalizeHost(host) {
  return String(host || DEFAULT_PREVIEW_RUNTIME_HOST).trim() || DEFAULT_PREVIEW_RUNTIME_HOST
}

function normalizePort(port) {
  return String(port || DEFAULT_PREVIEW_RUNTIME_PORT).trim() || DEFAULT_PREVIEW_RUNTIME_PORT
}

function normalizeRoute(route) {
  const normalizedRoute = String(route || DEFAULT_PREVIEW_RUNTIME_EXAMPLE_ROUTE).trim()
  if (!normalizedRoute) return DEFAULT_PREVIEW_RUNTIME_EXAMPLE_ROUTE
  return normalizedRoute.startsWith('/') ? normalizedRoute : `/${normalizedRoute}`
}

export function buildPreviewRuntimeBaseUrl(options = {}) {
  const host = normalizeHost(options.host)
  const port = normalizePort(options.port)
  return `http://${host}:${port}`
}

export function buildPreviewRuntimeExampleUrl(options = {}) {
  const baseUrl = buildPreviewRuntimeBaseUrl(options)
  const route = normalizeRoute(options.route)
  return new URL(route, `${baseUrl}/`).toString()
}

export function createPreviewRuntimeStartCommand(options = {}) {
  const host = normalizeHost(options.host)
  const port = normalizePort(options.port)
  return `node scripts/start-preview-runtime.mjs --host ${host} --port ${port} --strict-port`
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

export async function probePreviewRuntime(options = {}) {
  const baseUrl = buildPreviewRuntimeBaseUrl(options)
  const exampleUrl = buildPreviewRuntimeExampleUrl(options)

  try {
    const response = await fetchWithTimeout(baseUrl, Number(options.timeoutMs) || 1500)
    if (!response.ok) {
      return {
        ok: false,
        status: 'http-error',
        baseUrl,
        exampleUrl,
        detail: `preview runtime probe returned HTTP ${response.status}`,
      }
    }

    const html = await response.text()
    if (!html.includes('hiui-design preview runtime')) {
      return {
        ok: false,
        status: 'unexpected-content',
        baseUrl,
        exampleUrl,
        detail: 'port is reachable, but it is not serving the hiui-design preview runtime',
      }
    }

    return {
      ok: true,
      status: 'ready',
      baseUrl,
      exampleUrl,
      detail: '',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      ok: false,
      status: 'unreachable',
      baseUrl,
      exampleUrl,
      detail: message,
    }
  }
}

function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs)
  })
}

export async function ensurePreviewRuntimeReady(options = {}) {
  const {
    skillRoot,
    host = DEFAULT_PREVIEW_RUNTIME_HOST,
    port = DEFAULT_PREVIEW_RUNTIME_PORT,
    route = DEFAULT_PREVIEW_RUNTIME_EXAMPLE_ROUTE,
    probeTimeoutMs = 1500,
    startupTimeoutMs = 20000,
    pollIntervalMs = 500,
  } = options

  if (!skillRoot) {
    throw new Error('ensurePreviewRuntimeReady requires skillRoot')
  }

  const startCommand = createPreviewRuntimeStartCommand({ host, port })
  const logPath = path.join(os.tmpdir(), `hiui-design-preview-runtime-${normalizePort(port)}.log`)
  const existingRuntime = await probePreviewRuntime({
    host,
    port,
    route,
    timeoutMs: probeTimeoutMs,
  })

  if (existingRuntime.ok) {
    return {
      ...existingRuntime,
      status: 'already-running',
      logPath,
      startCommand,
    }
  }

  const stdoutHandle = await fs.open(logPath, 'a')
  try {
    const child = spawn(
      process.execPath,
      [
        path.join(skillRoot, 'scripts', 'start-preview-runtime.mjs'),
        '--host',
        normalizeHost(host),
        '--port',
        normalizePort(port),
        '--strict-port',
      ],
      {
        cwd: skillRoot,
        detached: true,
        stdio: ['ignore', stdoutHandle.fd, stdoutHandle.fd],
      }
    )

    child.unref()
  } finally {
    await stdoutHandle.close()
  }

  const deadline = Date.now() + startupTimeoutMs
  while (Date.now() < deadline) {
    await wait(pollIntervalMs)
    const runtime = await probePreviewRuntime({
      host,
      port,
      route,
      timeoutMs: probeTimeoutMs,
    })

    if (runtime.ok) {
      return {
        ...runtime,
        status: 'started',
        logPath,
        startCommand,
      }
    }
  }

  const finalProbe = await probePreviewRuntime({
    host,
    port,
    route,
    timeoutMs: probeTimeoutMs,
  })

  return {
    ...finalProbe,
    status: 'start-timeout',
    logPath,
    startCommand,
  }
}
