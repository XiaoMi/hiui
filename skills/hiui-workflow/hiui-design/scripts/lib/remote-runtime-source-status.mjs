import fs from 'node:fs/promises'
import path from 'node:path'

import { REMOTE_RUNTIME_SOURCE_STATUS_RELATIVE_PATH } from './skill-identity.mjs'

export const REMOTE_RUNTIME_SOURCE_CHECK_STATUS = {
  NOT_RUN: 'not-run',
  PASS: 'pass',
  FAIL: 'fail',
}

export const REMOTE_RUNTIME_SOURCE_OBSERVATION_KIND = {
  NONE: '',
  REMOTE_ENTRY_UNREACHABLE: 'remote-entry-unreachable',
  REMOTE_ENTRY_REACHABLE_BUT_EXPOSE_MISSING: 'remote-entry-reachable-but-expose-missing',
  REMOTE_ENTRY_REACHABLE_BUT_MANAGED_PUBLISH_SIGNATURE_MISSING:
    'remote-entry-reachable-but-managed-publish-signature-missing',
  REMOTE_ENTRY_REACHABLE_AND_EXPOSE_FOUND: 'remote-entry-reachable-and-expose-found',
}

const ALLOWED_CHECK_STATUSES = new Set(Object.values(REMOTE_RUNTIME_SOURCE_CHECK_STATUS))
const ALLOWED_OBSERVATION_KINDS = new Set(Object.values(REMOTE_RUNTIME_SOURCE_OBSERVATION_KIND))

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function ensureDir(targetPath) {
  await fs.mkdir(targetPath, { recursive: true })
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function cloneJsonValue(value) {
  if (value == null) return null
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => cloneJsonValue(item))
      .filter((item) => item !== undefined)
  }
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [String(key), cloneJsonValue(item)])
        .filter(([, item]) => item !== undefined)
    )
  }
  return undefined
}

function normalizeCheckStatus(value, fallback = REMOTE_RUNTIME_SOURCE_CHECK_STATUS.NOT_RUN) {
  const normalizedValue = normalizeString(value)
  if (ALLOWED_CHECK_STATUSES.has(normalizedValue)) {
    return normalizedValue
  }
  return fallback
}

function normalizeSingleCheck(check = {}) {
  const derivedStatus =
    typeof check?.ok === 'boolean'
      ? check.ok
        ? REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS
        : REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL
      : REMOTE_RUNTIME_SOURCE_CHECK_STATUS.NOT_RUN

  return {
    status: normalizeCheckStatus(check?.status, derivedStatus),
    detail: normalizeString(check?.detail) || normalizeString(check?.reason),
    evidence: cloneJsonValue(check?.evidence) ?? {},
  }
}

function normalizeChecks(checks = {}) {
  if (Array.isArray(checks)) {
    return Object.fromEntries(
      checks
        .map((check) => {
          const id = normalizeString(check?.id)
          if (!id) return null
          return [id, normalizeSingleCheck(check)]
        })
        .filter(Boolean)
    )
  }

  if (!checks || typeof checks !== 'object') {
    return {}
  }

  return Object.fromEntries(
    Object.entries(checks)
      .map(([id, check]) => {
        const normalizedId = normalizeString(id)
        if (!normalizedId) return null
        return [normalizedId, normalizeSingleCheck(check)]
      })
      .filter(Boolean)
  )
}

function normalizeOverallStatus(status = {}, normalizedChecks = {}) {
  const explicitStatus = normalizeCheckStatus(status?.status, '')
  if (explicitStatus) {
    return explicitStatus
  }

  const checkStatuses = Object.values(normalizedChecks).map((check) => check.status)
  if (checkStatuses.includes(REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL)) {
    return REMOTE_RUNTIME_SOURCE_CHECK_STATUS.FAIL
  }
  if (
    checkStatuses.length > 0 &&
    checkStatuses.every((value) => value === REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS)
  ) {
    return REMOTE_RUNTIME_SOURCE_CHECK_STATUS.PASS
  }
  return REMOTE_RUNTIME_SOURCE_CHECK_STATUS.NOT_RUN
}

function normalizeRemoteRuntimeSourceStatus(status = {}) {
  const checks = normalizeChecks(status?.checks)

  return {
    schema:
      normalizeString(status?.schema) || 'hiui-design-remote-runtime-source-status.v2',
    updatedAt: normalizeString(status?.updatedAt),
    updatedBy: normalizeString(status?.updatedBy),
    status: normalizeOverallStatus(status, checks),
    mode: normalizeString(status?.mode),
    remoteEntryUrl: normalizeString(status?.remoteEntryUrl),
    exposeName: normalizeString(status?.exposeName),
    checks,
    evidence: cloneJsonValue(status?.evidence) ?? {},
    observation: normalizeObservation(status?.observation),
  }
}

function normalizeObservationKind(value) {
  const normalizedValue = normalizeString(value)
  if (ALLOWED_OBSERVATION_KINDS.has(normalizedValue)) {
    return normalizedValue
  }
  return REMOTE_RUNTIME_SOURCE_OBSERVATION_KIND.NONE
}

function normalizeObservation(observation = {}) {
  if (!observation || typeof observation !== 'object') {
    return {
      kind: REMOTE_RUNTIME_SOURCE_OBSERVATION_KIND.NONE,
      reason: '',
      nextCommand: '',
    }
  }

  return {
    kind: normalizeObservationKind(observation?.kind),
    reason: normalizeString(observation?.reason),
    nextCommand: normalizeString(observation?.nextCommand),
  }
}

export function resolveRemoteRuntimeSourceStatusPath(targetRoot) {
  return path.join(targetRoot, REMOTE_RUNTIME_SOURCE_STATUS_RELATIVE_PATH)
}

export async function readRemoteRuntimeSourceStatus(targetRoot) {
  const statusPath = resolveRemoteRuntimeSourceStatusPath(targetRoot)
  if (!(await pathExists(statusPath))) return null
  return normalizeRemoteRuntimeSourceStatus(JSON.parse(await fs.readFile(statusPath, 'utf8')))
}

export async function writeRemoteRuntimeSourceStatus({ targetRoot, status }) {
  const statusPath = resolveRemoteRuntimeSourceStatusPath(targetRoot)
  const nextStatus = normalizeRemoteRuntimeSourceStatus({
    ...status,
    updatedAt: new Date().toISOString(),
  })

  await ensureDir(path.dirname(statusPath))
  await fs.writeFile(statusPath, `${JSON.stringify(nextStatus, null, 2)}\n`, 'utf8')
  return nextStatus
}
