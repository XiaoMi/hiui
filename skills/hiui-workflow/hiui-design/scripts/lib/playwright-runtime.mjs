import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

async function pathExists(filePath) {
  if (!filePath) return false
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function resolveBundledNodeModulesRoot() {
  const execPath = String(process.execPath || '').trim()
  if (!execPath) return ''
  const nodeBinDir = path.dirname(execPath)
  const nodeRoot = path.dirname(nodeBinDir)
  return path.join(nodeRoot, 'node_modules')
}

function normalizePlaywrightModule(moduleExports) {
  return moduleExports?.chromium ? moduleExports : moduleExports?.default || moduleExports
}

function resolvePlaywrightNodeModuleRoots() {
  return [
    process.env.HIUI_DESIGN_PLAYWRIGHT_NODE_MODULES,
    ...String(process.env.NODE_PATH || '').split(path.delimiter),
    resolveBundledNodeModulesRoot(),
  ].map((item) => String(item || '').trim()).filter(Boolean)
}

async function importPlaywrightFromNodeModuleRoots() {
  for (const moduleRoot of resolvePlaywrightNodeModuleRoots()) {
    const candidate = path.join(moduleRoot, 'playwright', 'index.js')
    if (!(await pathExists(candidate))) continue
    try {
      return normalizePlaywrightModule(await import(pathToFileURL(candidate).href))
    } catch {
      continue
    }
  }
  return null
}

async function importBundledPlaywright() {
  const candidate = path.join(resolveBundledNodeModulesRoot(), 'playwright', 'index.js')
  if (!(await pathExists(candidate))) return null
  try {
    return normalizePlaywrightModule(await import(pathToFileURL(candidate).href))
  } catch {
    return null
  }
}

export async function loadPlaywrightWithFallback() {
  try {
    return normalizePlaywrightModule(await import('playwright'))
  } catch {
    const bundledPlaywright = await importPlaywrightFromNodeModuleRoots() || await importBundledPlaywright()
    if (bundledPlaywright) return bundledPlaywright
    throw new Error('playwright is not available in this workspace or the bundled runtime')
  }
}

export async function resolveChromiumExecutablePath() {
  const candidates = [
    process.env.HIUI_DESIGN_CHROMIUM_EXECUTABLE_PATH,
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_BIN,
    process.env.GOOGLE_CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  ]

  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate
  }

  return ''
}

export async function buildChromiumLaunchOptions(baseOptions = {}) {
  const executablePath = await resolveChromiumExecutablePath()
  return executablePath ? { ...baseOptions, executablePath } : { ...baseOptions }
}
