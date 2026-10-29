import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { createTelemetryRuntime } from './usage-telemetry.mjs'

export const PAGE_GENERATION_SESSION_TRACE_SCHEMA = 'hiui-design-page-generation-session-trace.v1'
export const PAGE_GENERATION_SESSION_REF_SCHEMA = 'hiui-design-page-generation-session-ref.v1'
export const PAGE_GENERATION_SESSION_TRACE_FILENAME = 'PAGE_GEN_SESSION_TRACE.json'
export const PAGE_GENERATION_STAGE_RESULT_SCHEMA = 'hiui-design-page-generation-stage-result.v1'
export const PAGE_GENERATION_BLOCKED_SNAPSHOT_SCHEMA = 'hiui-design-page-generation-blocked-snapshot.v1'
export const PAGE_GENERATION_LATEST_BLOCKED_REASON_FILENAME = 'LATEST_BLOCKED_REASON.json'

const TELEMETRY_DIRNAME = 'telemetry'
const PAGE_GENERATION_SESSIONS_DIRNAME = 'page-generation-sessions'
const PAGE_GENERATION_STAGE_RESULTS_DIRNAME = 'stage-results'
const PAGE_GENERATION_BLOCKED_SNAPSHOTS_DIRNAME = 'blocked-snapshots'

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeRelativePath(value) {
  return normalizeString(value).replace(/\\/gu, '/').replace(/^\/+/u, '')
}

function toIso(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(value).toISOString()
  }
  return new Date().toISOString()
}

function toDurationMs(startedAtMs, finishedAtMs) {
  if (!Number.isFinite(startedAtMs) || !Number.isFinite(finishedAtMs)) return 0
  return Math.max(0, Math.round(finishedAtMs - startedAtMs))
}

function maybeSetString(target, key, value) {
  const normalized = normalizeString(value)
  if (normalized) target[key] = normalized
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeString(item)).filter(Boolean)
  }
  const normalized = normalizeString(value)
  return normalized ? [normalized] : []
}

function sanitizeFileSegment(value) {
  const normalized = normalizeString(value)
    .replace(/[^a-z0-9._-]+/giu, '-')
    .replace(/^-+/u, '')
    .replace(/-+$/u, '')
  return normalized || 'unknown'
}

function inferBlockedBy(details, resultPayload) {
  const detailBlockedBy = normalizeStringArray(details?.blockedBy)
  if (detailBlockedBy.length > 0) return detailBlockedBy

  const payloadBlockedBy = normalizeStringArray(resultPayload?.blockedBy)
  if (payloadBlockedBy.length > 0) return payloadBlockedBy

  return []
}

function inferBlockingReason(status, details, resultPayload) {
  const normalizedStatus = normalizeString(status)
  const normalizedResultStatus = normalizeString(details?.resultStatus)
  const effectiveStatus = ['blocked', 'failed'].includes(normalizedStatus)
    ? normalizedStatus
    : ['blocked', 'failed'].includes(normalizedResultStatus)
      ? normalizedResultStatus
      : ''

  if (!effectiveStatus) {
    return ''
  }

  return (
    normalizeString(details?.blockingReason) ||
    normalizeString(details?.reason) ||
    normalizeString(resultPayload?.reason) ||
    ''
  )
}

function inferNextCommand(details, resultPayload) {
  return (
    normalizeString(details?.nextCommand) ||
    normalizeString(resultPayload?.nextCommand) ||
    normalizeString(resultPayload?.pageTaskGate?.nextCommand) ||
    normalizeString(resultPayload?.pageTypeCapability?.nextCommand) ||
    ''
  )
}

function inferRequiredManualActions(details, resultPayload) {
  const fromDetails = normalizeStringArray(details?.requiredManualActions)
  if (fromDetails.length > 0) return fromDetails
  return normalizeStringArray(resultPayload?.requiredManualActions)
}

function inferMutatedFiles(details, resultPayload) {
  const fromDetails = normalizeStringArray(details?.mutatedFiles)
  if (fromDetails.length > 0) return fromDetails
  return normalizeStringArray(resultPayload?.writtenFiles)
}

function inferEvidenceFiles(details, resultPayload) {
  const fromDetails = normalizeStringArray(details?.evidenceFiles)
  if (fromDetails.length > 0) return fromDetails

  return normalizeStringArray(
    resultPayload?.projectHostContract?.path ||
      resultPayload?.pageTypeCapability?.sourcePath ||
      resultPayload?.outputTargetEvidence?.selectedEntryPath
  )
}

function shouldWriteBlockedSnapshot(status, blockedBy, blockingReason) {
  const normalizedStatus = normalizeString(status)
  return (
    normalizedStatus === 'blocked' ||
    (normalizedStatus === 'failed' && (blockedBy.length > 0 || Boolean(blockingReason)))
  )
}

function buildTraceSummary({ brief = null, options = {}, source = '', targetRoot = '' } = {}) {
  const summary = {
    sourceChain: [],
  }

  maybeSetString(summary, 'targetRoot', targetRoot)
  maybeSetString(summary, 'source', source)
  maybeSetString(
    summary,
    'pageTypeId',
    brief?.pageType?.id ||
      (brief?.pageSelector?.kind === 'page-type' ? brief.pageSelector.id : '') ||
      options.pageType
  )
  maybeSetString(
    summary,
    'pageFamilyId',
    (brief?.pageSelector?.kind === 'page-family' ? brief.pageSelector.id : '') || options.pageFamily
  )
  maybeSetString(summary, 'title', brief?.requestedBusiness?.title || options.title)
  maybeSetString(summary, 'routePath', brief?.requestedBusiness?.routePath || options.routePath)
  maybeSetString(
    summary,
    'targetBusinessPath',
    brief?.requestedBusiness?.targetBusinessPath || brief?.requestedBusiness?.dest || options.dest
  )
  maybeSetString(summary, 'mode', brief?.mode || options.mode)
  maybeSetString(
    summary,
    'inputMode',
    (typeof brief?.inputMode === 'string' ? brief.inputMode : brief?.inputMode?.id) || options.inputMode
  )

  if (normalizeString(source)) {
    summary.sourceChain = [normalizeString(source)]
  }

  return summary
}

function mergeTraceSummary(existing = {}, next = {}) {
  const merged = {
    ...existing,
  }

  for (const key of [
    'targetRoot',
    'source',
    'pageTypeId',
    'pageFamilyId',
    'title',
    'routePath',
    'targetBusinessPath',
    'mode',
    'inputMode',
  ]) {
    if (normalizeString(next[key])) {
      merged[key] = normalizeString(next[key])
    }
  }

  const sourceChain = [
    ...(Array.isArray(existing.sourceChain) ? existing.sourceChain : []),
    ...(Array.isArray(next.sourceChain) ? next.sourceChain : []),
  ]
    .map((item) => normalizeString(item))
    .filter(Boolean)

  merged.sourceChain = Array.from(new Set(sourceChain))
  return merged
}

function buildSessionId() {
  return `pagegen_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return null
  }
}

async function writeTrace(tracePath, payload) {
  await fs.mkdir(path.dirname(tracePath), { recursive: true })
  await fs.writeFile(tracePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

async function writeJson(filePath, payload) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

async function resolveTraceState(targetRoot, sessionId, env = process.env) {
  const runtime = await createTelemetryRuntime(targetRoot, env)
  const traceDir = path.join(
    runtime.cacheDir,
    TELEMETRY_DIRNAME,
    PAGE_GENERATION_SESSIONS_DIRNAME,
    sessionId
  )
  const tracePath = path.join(traceDir, PAGE_GENERATION_SESSION_TRACE_FILENAME)
  const trace =
    (await readJsonIfExists(tracePath)) || {
      schema: PAGE_GENERATION_SESSION_TRACE_SCHEMA,
      sessionId,
      targetRoot: runtime.workspaceRoot,
      createdAt: toIso(),
      updatedAt: toIso(),
      currentStage: '',
      currentStatus: '',
      summary: {
        sourceChain: [],
      },
      events: [],
    }

  return {
    runtime,
    trace,
    tracePath,
  }
}

export async function openPageGenerationSession({
  targetRoot,
  sessionId = '',
  brief = null,
  options = {},
  source = '',
  env = process.env,
} = {}) {
  const nextSessionId =
    normalizeString(sessionId) || normalizeString(brief?.sessionTrace?.sessionId) || buildSessionId()
  const { runtime, trace, tracePath } = await resolveTraceState(targetRoot, nextSessionId, env)
  const summary = buildTraceSummary({
    brief,
    options,
    source,
    targetRoot: runtime.workspaceRoot,
  })
  const nextTrace = {
    ...trace,
    targetRoot: runtime.workspaceRoot,
    updatedAt: toIso(),
    summary: mergeTraceSummary(trace.summary, summary),
  }

  if (!Array.isArray(nextTrace.events)) {
    nextTrace.events = []
  }

  if (!nextTrace.events.some((event) => normalizeString(event?.stage) === 'sessionStart')) {
    const startedAt = toIso()
    nextTrace.currentStage = 'sessionStart'
    nextTrace.currentStatus = 'started'
    nextTrace.events.push({
      stage: 'sessionStart',
      source: normalizeString(source) || 'unknown',
      status: 'started',
      startedAt,
      finishedAt: startedAt,
      durationMs: 0,
      details: {
        source: normalizeString(source) || 'unknown',
      },
    })
  }

  await writeTrace(tracePath, nextTrace)

  return {
    sessionId: nextSessionId,
    targetRoot: runtime.workspaceRoot,
    tracePath,
    traceDir: path.dirname(tracePath),
  }
}

export async function recordPageGenerationSessionStage({
  sessionContext = null,
  targetRoot = '',
  sessionId = '',
  brief = null,
  options = {},
  source = '',
  stage = '',
  status = 'success',
  startedAtMs,
  finishedAtMs = Date.now(),
  details = {},
  resultPayload = null,
  env = process.env,
} = {}) {
  const resolvedTargetRoot = normalizeString(sessionContext?.targetRoot || targetRoot)
  const resolvedSessionId = normalizeString(sessionContext?.sessionId || sessionId)
  if (!resolvedTargetRoot || !resolvedSessionId || !normalizeString(stage)) {
    return null
  }

  const { trace, tracePath } = await resolveTraceState(resolvedTargetRoot, resolvedSessionId, env)
  const traceDir = path.dirname(tracePath)
  const summary = buildTraceSummary({
    brief,
    options,
    source,
    targetRoot: resolvedTargetRoot,
  })
  const nextTrace = {
    ...trace,
    updatedAt: toIso(finishedAtMs),
    currentStage: normalizeString(stage),
    currentStatus: normalizeString(status) || 'success',
    summary: mergeTraceSummary(trace.summary, summary),
    events: Array.isArray(trace.events) ? [...trace.events] : [],
  }

  const stageName = normalizeString(stage)
  const sourceName = normalizeString(source) || 'unknown'
  const statusName = normalizeString(status) || 'success'
  const stageEvent = {
    stage: normalizeString(stage),
    source: sourceName,
    status: statusName,
    startedAt: toIso(startedAtMs),
    finishedAt: toIso(finishedAtMs),
    durationMs: toDurationMs(startedAtMs, finishedAtMs),
    details: details && typeof details === 'object' ? details : {},
  }
  nextTrace.events.push(stageEvent)

  await writeTrace(tracePath, nextTrace)
  const blockedBy = inferBlockedBy(stageEvent.details, resultPayload)
  const blockingReason = inferBlockingReason(statusName, stageEvent.details, resultPayload)
  const nextCommand = inferNextCommand(stageEvent.details, resultPayload)
  const requiredManualActions = inferRequiredManualActions(stageEvent.details, resultPayload)
  const mutatedFiles = inferMutatedFiles(stageEvent.details, resultPayload)
  const evidenceFiles = inferEvidenceFiles(stageEvent.details, resultPayload)
  const stageId = normalizeString(stageEvent.details?.stageId) || stageName
  const eventIndex = nextTrace.events.length
  const stageResultPayload = {
    schema: PAGE_GENERATION_STAGE_RESULT_SCHEMA,
    sessionId: resolvedSessionId,
    targetRoot: resolvedTargetRoot,
    stageId,
    stage: stageName,
    source: sourceName,
    status: statusName,
    eventIndex,
    startedAt: stageEvent.startedAt,
    finishedAt: stageEvent.finishedAt,
    durationMs: stageEvent.durationMs,
    blockingReason,
    blockedBy,
    nextCommand,
    requiredManualActions,
    mutatedFiles,
    evidenceFiles,
    details: stageEvent.details,
    resultPayload:
      resultPayload && typeof resultPayload === 'object'
        ? resultPayload
        : null,
  }
  const stageResultPath = path.join(
    traceDir,
    PAGE_GENERATION_STAGE_RESULTS_DIRNAME,
    `${String(eventIndex).padStart(4, '0')}-${sanitizeFileSegment(stageId)}-${sanitizeFileSegment(statusName)}.json`
  )
  await writeJson(stageResultPath, stageResultPayload)

  let blockedSnapshotPath = ''
  let blockedSnapshotArchivePath = ''
  if (shouldWriteBlockedSnapshot(statusName, blockedBy, blockingReason)) {
    const blockedSnapshotPayload = {
      schema: PAGE_GENERATION_BLOCKED_SNAPSHOT_SCHEMA,
      sessionId: resolvedSessionId,
      targetRoot: resolvedTargetRoot,
      stageId,
      stage: stageName,
      source: sourceName,
      status: statusName,
      eventIndex,
      blockingReason,
      blockedBy,
      nextCommand,
      requiredManualActions,
      mutatedFiles,
      evidenceFiles,
      tracePath,
      stageResultPath,
      resultPayload:
        resultPayload && typeof resultPayload === 'object'
          ? resultPayload
          : null,
    }
    blockedSnapshotPath = path.join(traceDir, PAGE_GENERATION_LATEST_BLOCKED_REASON_FILENAME)
    await writeJson(blockedSnapshotPath, blockedSnapshotPayload)
    blockedSnapshotArchivePath = path.join(
      traceDir,
      PAGE_GENERATION_BLOCKED_SNAPSHOTS_DIRNAME,
      `${String(eventIndex).padStart(4, '0')}-${sanitizeFileSegment(stageId)}-${sanitizeFileSegment(statusName)}.json`
    )
    await writeJson(blockedSnapshotArchivePath, blockedSnapshotPayload)
  }

  return {
    sessionId: resolvedSessionId,
    targetRoot: resolvedTargetRoot,
    tracePath,
    traceDir,
    stageResultPath,
    blockedSnapshotPath,
    blockedSnapshotArchivePath,
  }
}

export function buildPageGenerationSessionRef(
  sessionContext,
  { currentStage = '', currentStatus = '' } = {}
) {
  if (!sessionContext?.sessionId || !sessionContext?.tracePath) {
    return null
  }

  return {
    schema: PAGE_GENERATION_SESSION_REF_SCHEMA,
    sessionId: normalizeString(sessionContext.sessionId),
    tracePath: normalizeString(sessionContext.tracePath),
    currentStage: normalizeString(currentStage),
    currentStatus: normalizeString(currentStatus),
  }
}
