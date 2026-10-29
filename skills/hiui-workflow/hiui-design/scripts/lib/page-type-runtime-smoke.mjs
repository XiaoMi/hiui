import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

export const FULL_PAGE_DETAIL_RUNTIME_SMOKE_BLOCKER_ID =
  'full-page-detail-runtime-smoke-failed'

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeStringArray(values) {
  return Array.isArray(values)
    ? [...new Set(values.map((value) => normalizeString(value)).filter(Boolean))]
    : []
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

function resolveBridgeHelperPath(targetRoot) {
  return path.join(
    targetRoot,
    '.local-context',
    'hiui-design',
    'examples',
    'host-integration',
    'build',
    'hiui5-peer-replacement-bridge.cjs'
  )
}

function loadSpecialBridgeAliasMap(targetRequire, targetRoot) {
  try {
    const bridgeHelperPath = resolveBridgeHelperPath(targetRoot)
    const bridgeHelper = targetRequire(bridgeHelperPath)
    return bridgeHelper?.SPECIAL_PACKAGE_ALIAS_MAP || {}
  } catch {
    return {}
  }
}

function shouldInspectFullPageDetailRuntime({ pageTypeId = '', hostProfile = {} } = {}) {
  if (normalizeString(pageTypeId) !== 'full-page-detail') return false

  const framework = normalizeString(hostProfile?.framework)
  const riskTags = normalizeStringArray(hostProfile?.riskTags)
  const hasModuleFederationSignal =
    ['rspack-module-federation', 'webpack-module-federation', 'micro-frontend'].includes(
      framework
    ) || riskTags.includes('module-federation')

  return hasModuleFederationSignal && riskTags.includes('mixed-hiui-runtime')
}

function getPageTypeRuntimeSmokeRequests(pageTypeId = '') {
  if (normalizeString(pageTypeId) === 'full-page-detail') {
    return [
      '@hi-ui/schema-group',
      '@hi-ui/schema-group/descriptions',
      '@hi-ui/schema-group/table',
    ]
  }

  return []
}

async function inspectRuntimeRequest({
  targetRequire,
  request,
  resolvePaths,
  specialBridgeAliasMap,
}) {
  let resolvedPath = ''

  try {
    resolvedPath =
      specialBridgeAliasMap?.[request] || targetRequire.resolve(request, { paths: resolvePaths })
    await import(`${pathToFileURL(resolvedPath).href}?hiuiPageTypeRuntimeSmoke=${Date.now()}`)

    return {
      request,
      ok: true,
      resolvedPath,
      detail: '',
    }
  } catch (error) {
    return {
      request,
      ok: false,
      resolvedPath,
      detail: error?.message || String(error),
    }
  }
}

function buildFailureSummary(results = []) {
  return results
    .filter((item) => item?.ok === false)
    .map((item) => `${item.request}: ${normalizeString(item.detail)}`)
    .join('; ')
}

export async function inspectPageTypeRuntimeSmoke({
  targetRoot,
  pageTypeId = '',
  hostProfile = {},
}) {
  if (!shouldInspectFullPageDetailRuntime({ pageTypeId, hostProfile })) {
    return {
      status: 'not-applicable',
      blockerId: '',
      pageTypeId: normalizeString(pageTypeId),
      checkedRequests: [],
      failures: [],
      reason: '',
    }
  }

  const packageJsonPath = path.join(targetRoot, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    return {
      status: 'not-applicable',
      blockerId: '',
      pageTypeId: normalizeString(pageTypeId),
      checkedRequests: [],
      failures: [],
      reason: '',
    }
  }

  const requests = getPageTypeRuntimeSmokeRequests(pageTypeId)
  const targetRequire = createRequire(packageJsonPath)
  const resolvePaths = [targetRoot]
  const specialBridgeAliasMap = loadSpecialBridgeAliasMap(targetRequire, targetRoot)
  const results = []

  for (const request of requests) {
    results.push(
      await inspectRuntimeRequest({
        targetRequire,
        request,
        resolvePaths,
        specialBridgeAliasMap,
      })
    )
  }

  const failures = results.filter((item) => item.ok === false)
  if (failures.length === 0) {
    return {
      status: 'pass',
      blockerId: '',
      pageTypeId: normalizeString(pageTypeId),
      checkedRequests: results,
      failures: [],
      reason: 'Runtime smoke requests loaded successfully.',
    }
  }

  return {
    status: 'fail',
    blockerId: FULL_PAGE_DETAIL_RUNTIME_SMOKE_BLOCKER_ID,
    pageTypeId: normalizeString(pageTypeId),
    checkedRequests: results,
    failures,
    reason: buildFailureSummary(results),
  }
}
