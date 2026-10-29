#!/usr/bin/env node

import fs from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { collectCodeRegistrationEvidence } from './lib/code-registration-evidence.mjs'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import {
  REMOTE_RUNTIME_SOURCE_OBSERVATION_KIND,
  REMOTE_RUNTIME_SOURCE_CHECK_STATUS,
  writeRemoteRuntimeSourceStatus,
} from './lib/remote-runtime-source-status.mjs'

function readRequiredArg(argv, index, name) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`)
  return value
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    exposeName: '',
    remoteEntryUrl: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--target') {
      options.target = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--expose-name') {
      options.exposeName = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--remote-entry-url') {
      options.remoteEntryUrl = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node scripts/verify-remote-runtime-source.mjs --target <dir> --expose-name <Name> [--remote-entry-url <url>] [--json]'
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.exposeName) {
    throw new Error('Missing --expose-name <Name>')
  }

  return options
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function toExposeName(value) {
  const normalizedValue = normalizeString(value)
  if (!normalizedValue) return ''
  return normalizedValue.startsWith('./') ? normalizedValue : `./${normalizedValue}`
}

function toRemoteEntryUrl(origin = '', filename = 'remoteEntry.js') {
  const normalizedOrigin = normalizeString(origin)
  const normalizedFilename = normalizeString(filename).replace(/^\/+/, '')
  if (!normalizedOrigin || !normalizedFilename) return ''

  try {
    return new URL(normalizedFilename, normalizedOrigin.endsWith('/') ? normalizedOrigin : `${normalizedOrigin}/`).toString()
  } catch {
    return ''
  }
}

function normalizeRuntimeSourceList(value) {
  return Array.isArray(value) ? value.map((item) => normalizeString(item)).filter(Boolean) : []
}

function unique(values) {
  return [...new Set((Array.isArray(values) ? values : []).filter(Boolean))]
}

function normalizeRelativeModulePath(value = '') {
  return normalizeString(value)
    .replace(/\\/gu, '/')
    .replace(/^\.\//u, '')
    .replace(/\.(?:tsx|ts|jsx|js|mjs|cjs)$/iu, '')
    .replace(/\/index$/iu, '')
}

function toExpectedRemoteEntryModuleToken(value = '') {
  const normalized = normalizeRelativeModulePath(value)
  return normalized ? `./${normalized}` : ''
}

function extractExposeRuntimeBlock(source = '', exposeName = '') {
  const normalizedExposeName = toExposeName(exposeName)
  if (!source || !normalizedExposeName) return ''
  const exposeIndex = source.indexOf(JSON.stringify(normalizedExposeName))
  if (exposeIndex < 0) return ''
  const nextExposeIndex = source.indexOf('",()=>', exposeIndex + normalizedExposeName.length)
  if (nextExposeIndex < 0) {
    return source.slice(exposeIndex)
  }
  return source.slice(exposeIndex, nextExposeIndex)
}

function extractCandidateAssetUrls(remoteEntryUrl, remoteEntrySource) {
  const candidates = new Set()
  const assetPattern = /['"`]([^'"`\n]+\.js(?:\?[^'"`\n]*)?)['"`]/g
  let match = assetPattern.exec(remoteEntrySource)

  while (match) {
    const rawValue = normalizeString(match[1])
    if (!rawValue || /remoteEntry\.js(?:\?|$)/i.test(rawValue)) {
      match = assetPattern.exec(remoteEntrySource)
      continue
    }

    try {
      candidates.add(new URL(rawValue, remoteEntryUrl).toString())
    } catch {
      // Ignore non-URL-like tokens.
    }

    match = assetPattern.exec(remoteEntrySource)
  }

  return [...candidates].slice(0, 40)
}

function extractWebpackPublicPath(remoteEntryUrl, remoteEntrySource) {
  const publicPathMatch = remoteEntrySource.match(
    /\b[A-Za-z_$][\w$]*\.p\s*=\s*["'`]([^"'`]+)["'`]/u
  )
  const rawPublicPath = publicPathMatch?.[1]

  if (!rawPublicPath) {
    return new URL('./', remoteEntryUrl).toString()
  }

  return new URL(rawPublicPath, remoteEntryUrl).toString()
}

function extractExposeChunkAssetUrls(remoteEntryUrl, exposeBlockSource, remoteEntrySource) {
  if (!exposeBlockSource) return []
  const chunkIds = unique(
    [...exposeBlockSource.matchAll(/\.e\((?:"([^"]+)"|'([^']+)'|`([^`]+)`|(\d+))\)/g)].map(
      (match) => match[1] || match[2] || match[3] || match[4] || ''
    )
  )
  const publicPath = extractWebpackPublicPath(remoteEntryUrl, remoteEntrySource)
  return chunkIds.map((chunkId) => new URL(`js/${chunkId}.js`, publicPath).toString())
}

function remoteEntryResolvesExpectedTarget(blockSource = '', expectedExposeTarget = '') {
  const normalizedExpectedTarget = toExpectedRemoteEntryModuleToken(expectedExposeTarget)
  if (!blockSource || !normalizedExpectedTarget) return false
  return blockSource.includes(normalizedExpectedTarget)
}

function discoverManagedPublishSignature({
  remoteEntrySource = '',
  exposeBlockSource = '',
  expectedExposeTarget = '',
  runtimeSources = [],
} = {}) {
  const normalizedExpectedTarget = toExpectedRemoteEntryModuleToken(expectedExposeTarget)
  const normalizedExpectedTargetBase = normalizedExpectedTarget.replace(/^\.\//u, '')
  const sourcesToInspect = [
    exposeBlockSource,
    remoteEntrySource,
    ...normalizeRuntimeSourceList(runtimeSources),
  ].filter(Boolean)

  const match = (predicate) => sourcesToInspect.some((source) => predicate(source))
  const targetPointsToMfEntry = normalizedExpectedTargetBase
    ? match(
        (source) =>
          source.includes(normalizedExpectedTargetBase) ||
          source.includes(`${normalizedExpectedTargetBase}/mf-entry`)
      )
    : match((source) => /\/mf-entry(?:\.tsx|\.jsx|\.ts|\.js)?/.test(source))

  if (targetPointsToMfEntry) {
    return {
      discovered: true,
      source: 'remote-entry-mf-entry-path',
      detail: 'remoteEntry.js resolves the expose to mf-entry',
    }
  }

  if (match((source) => source.includes('ManagedMfPublishEntry'))) {
    return {
      discovered: true,
      source: 'managed-publish-entry-symbol',
      detail: 'live runtime source contains ManagedMfPublishEntry',
    }
  }

  if (
    match((source) => source.includes('BusinessShell')) &&
    match(
      (source) =>
        source.includes('hiui-design-runtime/styles.css') ||
        source.includes('/styles.css')
    )
  ) {
    return {
      discovered: true,
      source: 'business-shell-and-styles',
      detail: 'live runtime source contains BusinessShell and managed runtime styles',
    }
  }

  return {
    discovered: false,
    source: '',
    detail: 'live runtime source does not contain a managed publish signature',
  }
}

function buildExplicitRemoteEntryMismatch(explicitRemoteEntryUrl = '', allowedSources = []) {
  const normalizedExplicitUrl = normalizeString(explicitRemoteEntryUrl)
  const normalizedAllowedSources = normalizeRuntimeSourceList(allowedSources)

  if (!normalizedExplicitUrl || normalizedAllowedSources.length === 0) {
    return { mismatched: false, normalizedExplicitUrl, normalizedAllowedSources }
  }

  return {
    mismatched: !normalizedAllowedSources.includes(normalizedExplicitUrl),
    normalizedExplicitUrl,
    normalizedAllowedSources,
  }
}

export function resolveRemoteEntryUrl({
  remoteDebugContract = {},
  explicitRemoteEntryUrl = '',
} = {}) {
  const normalizedExplicitUrl = normalizeString(explicitRemoteEntryUrl)
  if (normalizedExplicitUrl) {
    return {
      remoteEntryUrl: normalizedExplicitUrl,
      source: 'cli',
    }
  }

  const localRuntimeSources = Array.isArray(remoteDebugContract?.localRuntimeSources)
    ? remoteDebugContract.localRuntimeSources
        .map((item) => normalizeString(item))
        .filter(Boolean)
    : []

  for (const candidate of localRuntimeSources) {
    if (/remoteEntry\.js(?:[?#].*)?$/i.test(candidate)) {
      return {
        remoteEntryUrl: candidate,
        source: 'localRuntimeSources',
      }
    }
  }

  const localOrigins = Array.isArray(remoteDebugContract?.localOrigins)
    ? remoteDebugContract.localOrigins
        .map((item) => normalizeString(item))
        .filter(Boolean)
    : []
  const remoteEntryFilenames = Array.isArray(remoteDebugContract?.remoteEntryFilenames)
    ? remoteDebugContract.remoteEntryFilenames
        .map((item) => normalizeString(item))
        .filter(Boolean)
    : []

  for (const origin of localOrigins) {
    for (const filename of remoteEntryFilenames) {
      const remoteEntryUrl = toRemoteEntryUrl(origin, filename)
      if (remoteEntryUrl) {
        return {
          remoteEntryUrl,
          source: 'localOrigins+remoteEntryFilename',
        }
      }
    }
  }

  return {
    remoteEntryUrl: '',
    source: 'unresolved',
  }
}

export function remoteEntryContainsExpose(source = '', exposeName = '') {
  const normalizedExposeName = toExposeName(exposeName)
  if (!source || !normalizedExposeName) return false
  if (source.includes(normalizedExposeName)) return true

  const escapedExposeName = normalizedExposeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`['"\`]${escapedExposeName}['"\`]`).test(source)
}

async function readRemoteEntrySource(remoteEntryUrl) {
  const parsedUrl = new URL(remoteEntryUrl)
  const transport = parsedUrl.protocol === 'https:' ? https : http

  return new Promise((resolve, reject) => {
    const request = transport.request(
      parsedUrl,
      {
        method: 'GET',
        headers: {
          'cache-control': 'no-cache',
        },
      },
      (response) => {
        const chunks = []

        response.on('data', (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        })
        response.on('end', () => {
          resolve({
            ok:
              typeof response.statusCode === 'number' &&
              response.statusCode >= 200 &&
              response.statusCode < 300,
            status: response.statusCode || 0,
            body: Buffer.concat(chunks).toString('utf8'),
          })
        })
      }
    )

    request.setTimeout(5000, () => {
      request.destroy(new Error('request timed out after 5000ms'))
    })
    request.on('error', (error) => {
      reject(error)
    })
    request.end()
  })
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function buildRemoteRuntimeSourceFailure({
  targetRoot,
  hostProfile,
  exposeName,
  remoteEntryUrl,
  remoteEntryUrlSource,
  checks,
  evidence,
  observation,
  updatedBy = 'scripts/verify-remote-runtime-source.mjs',
}) {
  return writeRemoteRuntimeSourceStatus({
    targetRoot,
    status: {
      status: REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL,
      mode: normalizeString(hostProfile?.remoteDebugContract?.mode),
      remoteEntryUrl,
      exposeName,
      checks,
      evidence: {
        ...evidence,
        remoteEntryUrlSource,
        readmePath: normalizeString(hostProfile?.readmePath),
      },
      observation,
      updatedBy,
    },
  })
}

function buildObservation({
  kind = REMOTE_RUNTIME_SOURCE_OBSERVATION_KIND.NONE,
  reason = '',
  nextCommand = '',
} = {}) {
  return { kind, reason, nextCommand }
}

export async function verifyRemoteRuntimeSource({
  targetRoot,
  exposeName,
  remoteEntryUrl = '',
  updatedBy = 'scripts/verify-remote-runtime-source.mjs',
} = {}) {
  const resolvedTargetRoot = path.resolve(targetRoot || process.cwd())
  if (!(await pathExists(path.join(resolvedTargetRoot, 'package.json')))) {
    throw new Error(`Target root does not look like a project: ${resolvedTargetRoot}`)
  }

  const normalizedExposeName = toExposeName(exposeName)
  const hostProfile = await detectHostProfile(resolvedTargetRoot)
  const remoteDebugContract = hostProfile?.remoteDebugContract || {}
  const proxyContractDeclared = remoteDebugContract.enabled === true
  const explicitRemoteEntryMismatch = buildExplicitRemoteEntryMismatch(
    remoteEntryUrl,
    remoteDebugContract.localRuntimeSources,
  )
  const resolvedRemoteEntry = resolveRemoteEntryUrl({
    remoteDebugContract,
    explicitRemoteEntryUrl: remoteEntryUrl,
  })
  const verifyCommand = normalizedExposeName
    ? `node ${path.posix.join('.local-context', 'hiui-design', 'scripts', 'verify-remote-runtime-source.mjs')} --expose-name ${normalizedExposeName.replace(/^\.\//, '')}`
    : ''
  const codeRegistrationEvidence = await collectCodeRegistrationEvidence({
    targetRoot: resolvedTargetRoot,
    exposeName: normalizedExposeName,
    expectedExposeName: normalizedExposeName,
    requireEntryFileEvidence: false,
    requireAddPageEvidence: false,
  })
  const exactExpose =
    codeRegistrationEvidence?.checks?.moduleFederation?.evidence?.exactExpose || null
  const expectedExposeTarget = normalizeString(exactExpose?.sourcePath || '')
  const expectsManagedPublishSignature = /(?:^|\/)mf-entry(?:\.(?:tsx|ts|jsx|js|mjs|cjs))?$/i.test(
    expectedExposeTarget
  )

  const checks = {
    proxyContractDeclared: {
      status: proxyContractDeclared
        ? REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS
        : REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL,
      detail: proxyContractDeclared
        ? 'remote debug contract is explicitly declared for this host profile'
        : 'host profile does not declare an explicit Camora/proxy/localOrigin runtime debug contract',
      evidence: {
        mode: normalizeString(remoteDebugContract.mode),
        hasExplicitRuntimeDebugEvidence:
          remoteDebugContract.hasExplicitRuntimeDebugEvidence === true,
      },
    },
    localSourceAvailable: {
      status: REMOTE_RUNTIME_SOURCE_CHECK_STATUS.NOT_RUN,
      detail: '',
      evidence: {},
    },
    exposeDiscovered: {
      status: REMOTE_RUNTIME_SOURCE_CHECK_STATUS.NOT_RUN,
      detail: '',
      evidence: {},
    },
    exposeResolved: {
      status: REMOTE_RUNTIME_SOURCE_CHECK_STATUS.NOT_RUN,
      detail: '',
      evidence: {},
    },
    managedPublishSignatureDiscovered: {
      status: expectsManagedPublishSignature
        ? REMOTE_RUNTIME_SOURCE_CHECK_STATUS.NOT_RUN
        : REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS,
      detail: expectsManagedPublishSignature
        ? ''
        : 'managed publish signature is not required for this expose target',
      evidence: {
        expectedExposeTarget,
        required: expectsManagedPublishSignature,
      },
    },
  }
  const evidence = {
    localRuntimeSources: normalizeRuntimeSourceList(remoteDebugContract.localRuntimeSources),
    localOrigins: Array.isArray(remoteDebugContract.localOrigins)
      ? remoteDebugContract.localOrigins
      : [],
    remoteEntryFilenames: Array.isArray(remoteDebugContract.remoteEntryFilenames)
      ? remoteDebugContract.remoteEntryFilenames
      : [],
  }

  if (!proxyContractDeclared) {
    return buildRemoteRuntimeSourceFailure({
      targetRoot: resolvedTargetRoot,
      hostProfile,
      exposeName: normalizedExposeName,
      remoteEntryUrl: resolvedRemoteEntry.remoteEntryUrl,
      remoteEntryUrlSource: resolvedRemoteEntry.source,
      checks,
      evidence,
      observation: buildObservation({
        reason:
          'host profile does not declare an explicit Camora/proxy/localOrigin runtime debug contract',
        nextCommand: verifyCommand,
      }),
      updatedBy,
    })
  }

  if (explicitRemoteEntryMismatch.mismatched) {
    checks.localSourceAvailable = {
      status: REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL,
      detail:
        'explicit remoteEntry.js URL does not match the host contract localRuntimeSources; refusing to verify against a different local runtime source',
      evidence: {
        remoteEntryUrl: explicitRemoteEntryMismatch.normalizedExplicitUrl,
        allowedRemoteEntryUrls: explicitRemoteEntryMismatch.normalizedAllowedSources,
      },
    }

    return buildRemoteRuntimeSourceFailure({
      targetRoot: resolvedTargetRoot,
      hostProfile,
      exposeName: normalizedExposeName,
      remoteEntryUrl: explicitRemoteEntryMismatch.normalizedExplicitUrl,
      remoteEntryUrlSource: 'cli-mismatch',
      checks,
      evidence,
      observation: buildObservation({
        reason:
          'explicit remoteEntry.js URL is outside the host contract localRuntimeSources; verify the declared local runtime source instead of a different loopback address',
        nextCommand: verifyCommand,
      }),
      updatedBy,
    })
  }

  if (!resolvedRemoteEntry.remoteEntryUrl) {
    checks.localSourceAvailable = {
      status: REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL,
      detail:
        'could not derive a local remoteEntry.js URL from host profile hints; pass --remote-entry-url explicitly',
      evidence: {
        remoteEntryUrlSource: resolvedRemoteEntry.source,
      },
    }

    return buildRemoteRuntimeSourceFailure({
      targetRoot: resolvedTargetRoot,
      hostProfile,
      exposeName: normalizedExposeName,
      remoteEntryUrl: '',
      remoteEntryUrlSource: resolvedRemoteEntry.source,
      checks,
      evidence,
      observation: buildObservation({
        reason:
          'could not derive a local remoteEntry.js URL from host profile hints; pass --remote-entry-url explicitly',
        nextCommand: verifyCommand,
      }),
      updatedBy,
    })
  }

  let remoteEntryResponse
  try {
    remoteEntryResponse = await readRemoteEntrySource(resolvedRemoteEntry.remoteEntryUrl)
  } catch (error) {
    checks.localSourceAvailable = {
      status: REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL,
      detail: `failed to fetch local remoteEntry.js: ${error.message}`,
      evidence: {
        remoteEntryUrl: resolvedRemoteEntry.remoteEntryUrl,
      },
    }

    return buildRemoteRuntimeSourceFailure({
      targetRoot: resolvedTargetRoot,
      hostProfile,
      exposeName: normalizedExposeName,
      remoteEntryUrl: resolvedRemoteEntry.remoteEntryUrl,
      remoteEntryUrlSource: resolvedRemoteEntry.source,
      checks,
      evidence,
      observation: buildObservation({
        kind: REMOTE_RUNTIME_SOURCE_OBSERVATION_KIND.REMOTE_ENTRY_UNREACHABLE,
        reason: `failed to fetch local remoteEntry.js from ${resolvedRemoteEntry.remoteEntryUrl}`,
        nextCommand: verifyCommand,
      }),
      updatedBy,
    })
  }

  if (!remoteEntryResponse.ok) {
    checks.localSourceAvailable = {
      status: REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL,
      detail: `local remoteEntry.js responded with HTTP ${remoteEntryResponse.status}`,
      evidence: {
        remoteEntryUrl: resolvedRemoteEntry.remoteEntryUrl,
        httpStatus: remoteEntryResponse.status,
      },
    }

    return buildRemoteRuntimeSourceFailure({
      targetRoot: resolvedTargetRoot,
      hostProfile,
      exposeName: normalizedExposeName,
      remoteEntryUrl: resolvedRemoteEntry.remoteEntryUrl,
      remoteEntryUrlSource: resolvedRemoteEntry.source,
      checks,
      evidence,
      observation: buildObservation({
        kind: REMOTE_RUNTIME_SOURCE_OBSERVATION_KIND.REMOTE_ENTRY_UNREACHABLE,
        reason: `local remoteEntry.js at ${resolvedRemoteEntry.remoteEntryUrl} responded with HTTP ${remoteEntryResponse.status}`,
        nextCommand: verifyCommand,
      }),
      updatedBy,
    })
  }

  checks.localSourceAvailable = {
    status: REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS,
    detail: 'local remoteEntry.js is reachable',
    evidence: {
      remoteEntryUrl: resolvedRemoteEntry.remoteEntryUrl,
      httpStatus: remoteEntryResponse.status,
      contentLength: remoteEntryResponse.body.length,
    },
  }

  const exposeDiscovered = remoteEntryContainsExpose(
    remoteEntryResponse.body,
    normalizedExposeName,
  )
  const exposeBlockSource = exposeDiscovered
    ? extractExposeRuntimeBlock(remoteEntryResponse.body, normalizedExposeName)
    : ''
  const candidateAssetUrls = exposeDiscovered
    ? unique([
        ...extractExposeChunkAssetUrls(
          resolvedRemoteEntry.remoteEntryUrl,
          exposeBlockSource,
          remoteEntryResponse.body,
        ),
        ...extractCandidateAssetUrls(resolvedRemoteEntry.remoteEntryUrl, remoteEntryResponse.body),
      ]).slice(0, 40)
    : []
  const assetResponses = await Promise.all(
    candidateAssetUrls.map(async (assetUrl) => {
      try {
        const response = await readRemoteEntrySource(assetUrl)
        return response.ok ? { ok: true, url: assetUrl, body: response.body } : { ok: false, url: assetUrl, body: '' }
      } catch {
        return { ok: false, url: assetUrl, body: '' }
      }
    })
  )
  const fetchedRuntimeAssets = assetResponses.filter((item) => item.ok)
  const exposeResolved =
    exposeDiscovered && expectsManagedPublishSignature
      ? remoteEntryResolvesExpectedTarget(exposeBlockSource, expectedExposeTarget)
      : exposeDiscovered
  const managedPublishSignature = discoverManagedPublishSignature({
    remoteEntrySource: remoteEntryResponse.body,
    exposeBlockSource,
    expectedExposeTarget,
    runtimeSources: fetchedRuntimeAssets.map((item) => item.body),
  })

  checks.exposeDiscovered = {
    status: exposeDiscovered
      ? REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS
      : REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL,
    detail: exposeDiscovered
      ? `remoteEntry.js contains expose ${normalizedExposeName}`
      : `remoteEntry.js does not contain expose ${normalizedExposeName}`,
    evidence: {
      remoteEntryUrl: resolvedRemoteEntry.remoteEntryUrl,
      exposeName: normalizedExposeName,
    },
  }
  checks.exposeResolved = {
    status: exposeDiscovered
      ? expectsManagedPublishSignature
        ? exposeResolved
          ? REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS
          : REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL
        : REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS
      : REMOTE_RUNTIME_SOURCE_CHECK_STATUS.NOT_RUN,
    detail: exposeDiscovered
      ? expectsManagedPublishSignature
        ? exposeResolved
          ? `remoteEntry.js resolves ${normalizedExposeName} to ${toExpectedRemoteEntryModuleToken(expectedExposeTarget)}`
          : `remoteEntry.js exposes ${normalizedExposeName}, but the live mapping does not resolve to ${toExpectedRemoteEntryModuleToken(expectedExposeTarget)}`
        : 'managed publish target resolution is not required for this expose target'
      : '',
    evidence: {
      exposeName: normalizedExposeName,
      expectedExposeTarget,
      exposeBlockSourceSnippet: exposeBlockSource.slice(0, 400),
      resolvedChunkAssetUrls: extractExposeChunkAssetUrls(
        resolvedRemoteEntry.remoteEntryUrl,
        exposeBlockSource,
        remoteEntryResponse.body,
      ),
      exactExpose,
    },
  }
  checks.managedPublishSignatureDiscovered = {
    status: expectsManagedPublishSignature
      ? managedPublishSignature.discovered
        ? REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS
        : REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL
      : REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS,
    detail: expectsManagedPublishSignature
      ? managedPublishSignature.detail
      : 'managed publish signature is not required for this expose target',
    evidence: {
      expectedExposeTarget,
      required: expectsManagedPublishSignature,
      discoveredBy: managedPublishSignature.source,
      candidateAssetCount: candidateAssetUrls.length,
      fetchedAssetCount: fetchedRuntimeAssets.length,
      fetchedAssetUrls: fetchedRuntimeAssets.map((item) => item.url),
      exactExpose,
    },
  }

  const passWhenExposeFound =
    exposeDiscovered &&
    (!expectsManagedPublishSignature || exposeResolved) &&
    (!expectsManagedPublishSignature || managedPublishSignature.discovered)
  const missingManagedPublishSignature =
    exposeDiscovered &&
    expectsManagedPublishSignature &&
    (!exposeResolved || !managedPublishSignature.discovered)

  return writeRemoteRuntimeSourceStatus({
    targetRoot: resolvedTargetRoot,
    status: {
      status: passWhenExposeFound
        ? REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS
        : REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL,
      mode: normalizeString(remoteDebugContract.mode),
      remoteEntryUrl: resolvedRemoteEntry.remoteEntryUrl,
      exposeName: normalizedExposeName,
      checks,
      evidence: {
        ...evidence,
        remoteEntryUrlSource: resolvedRemoteEntry.source,
        readmePath: normalizeString(hostProfile?.readmePath),
      },
      observation: buildObservation({
        kind: passWhenExposeFound
          ? REMOTE_RUNTIME_SOURCE_OBSERVATION_KIND.REMOTE_ENTRY_REACHABLE_AND_EXPOSE_FOUND
          : missingManagedPublishSignature
            ? REMOTE_RUNTIME_SOURCE_OBSERVATION_KIND.REMOTE_ENTRY_REACHABLE_BUT_MANAGED_PUBLISH_SIGNATURE_MISSING
            : REMOTE_RUNTIME_SOURCE_OBSERVATION_KIND.REMOTE_ENTRY_REACHABLE_BUT_EXPOSE_MISSING,
        reason: passWhenExposeFound
          ? `live remoteEntry.js already exposes ${normalizedExposeName} and resolves to the managed publish path`
          : missingManagedPublishSignature
            ? `live remoteEntry.js exposes ${normalizedExposeName}, but the managed publish signature for ${toExpectedRemoteEntryModuleToken(expectedExposeTarget)} is still missing`
            : exposeDiscovered
              ? `live remoteEntry.js is reachable and exposes ${normalizedExposeName}, but the live mapping does not yet prove the expected publish target`
              : `live remoteEntry.js is reachable but still does not expose ${normalizedExposeName}`,
        nextCommand: verifyCommand,
      }),
      updatedBy,
    },
  })
}

function renderMarkdown(result) {
  const lines = [
    '# Remote Runtime Source Verification',
    '',
    `- status: ${result.status}`,
    `- mode: ${result.mode || '—'}`,
    `- remoteEntryUrl: ${result.remoteEntryUrl || '—'}`,
    `- exposeName: ${result.exposeName || '—'}`,
    `- observation: ${result.observation?.kind || '—'}`,
    `- observationReason: ${result.observation?.reason || '—'}`,
    '',
    '## Checks',
    '',
    ...Object.entries(result.checks || {}).map(
      ([checkId, check]) => `- ${checkId}: ${check.status} — ${check.detail || '—'}`
    ),
    '',
  ]
  return lines.join('\n')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const result = await verifyRemoteRuntimeSource({
    targetRoot: options.target,
    exposeName: options.exposeName,
    remoteEntryUrl: options.remoteEntryUrl,
  })

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log(renderMarkdown(result))
  }

  process.exitCode =
    result.status === REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS ? 0 : 1
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : ''
if (invokedPath && import.meta.url === invokedPath) {
  await main()
}
