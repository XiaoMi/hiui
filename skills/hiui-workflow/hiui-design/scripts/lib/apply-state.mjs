import fs from 'node:fs/promises'
import path from 'node:path'
import { isRecognizedInstallMode } from './mode-contract.mjs'
import {
  APPLY_PROGRESS_RELATIVE_PATH,
  APPLY_STATE_RELATIVE_PATH,
} from './skill-identity.mjs'

export const APPLY_PROGRESS_STATUS = {
  IN_PROGRESS: 'in-progress',
  FAILED: 'failed',
}

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

export function resolveApplyStatePath(targetRoot) {
  return path.join(targetRoot, APPLY_STATE_RELATIVE_PATH)
}

export function resolveApplyProgressPath(targetRoot) {
  return path.join(targetRoot, APPLY_PROGRESS_RELATIVE_PATH)
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeApplyStatePayload(applyState = {}) {
  const {
    previewRuntimeMode: _previewRuntimeMode,
    previewRuntimeVersion: _previewRuntimeVersion,
    previewMaterializedAt: _previewMaterializedAt,
    ...rest
  } = applyState
  const appliedMode = normalizeString(applyState.appliedMode)

  return {
    ...rest,
    appliedSkillVersion: normalizeString(applyState.appliedSkillVersion),
    appliedAt: normalizeString(applyState.appliedAt),
    appliedMode: isRecognizedInstallMode(appliedMode, { allowAuto: false })
      ? appliedMode
      : '',
  }
}

function normalizeApplyProgressStatus(value) {
  const normalizedValue = normalizeString(value)
  return Object.values(APPLY_PROGRESS_STATUS).includes(normalizedValue)
    ? normalizedValue
    : ''
}

function normalizeApplyProgressPayload(applyProgress = {}) {
  return {
    schema: normalizeString(applyProgress.schema) || 'hiui-design-apply-progress.v1',
    skillVersion: normalizeString(applyProgress.skillVersion),
    status: normalizeApplyProgressStatus(applyProgress.status),
    stage: normalizeString(applyProgress.stage),
    requestedMode: normalizeString(applyProgress.requestedMode),
    startedAt: normalizeString(applyProgress.startedAt),
    updatedAt: normalizeString(applyProgress.updatedAt),
    detail: normalizeString(applyProgress.detail),
    lastError: normalizeString(applyProgress.lastError),
  }
}

export async function readApplyState(applyStatePath) {
  if (!(await pathExists(applyStatePath))) return null
  return normalizeApplyStatePayload(
    JSON.parse(await fs.readFile(applyStatePath, 'utf8')),
  )
}

export async function readApplyProgress(applyProgressPath) {
  if (!(await pathExists(applyProgressPath))) return null
  return normalizeApplyProgressPayload(
    JSON.parse(await fs.readFile(applyProgressPath, 'utf8')),
  )
}

export async function readAppliedInstallMode(targetRoot) {
  const applyStatePath = resolveApplyStatePath(targetRoot)
  const applyState = await readApplyState(applyStatePath)
  const appliedMode = normalizeString(applyState?.appliedMode)

  if (!isRecognizedInstallMode(appliedMode, { allowAuto: false })) {
    return ''
  }

  return appliedMode
}

export async function writeApplyState({
  applyStatePath,
  skillVersion,
  appliedMode,
}) {
  const normalizedAppliedMode = normalizeString(appliedMode)
  const appliedAt = new Date().toISOString()
  const nextState = {
    appliedSkillVersion: skillVersion,
    appliedAt,
  }

  if (isRecognizedInstallMode(normalizedAppliedMode, { allowAuto: false })) {
    nextState.appliedMode = normalizedAppliedMode
  }

  await ensureDir(path.dirname(applyStatePath))
  await fs.writeFile(applyStatePath, `${JSON.stringify(nextState, null, 2)}\n`, 'utf8')
}

export async function writeApplyProgress({
  applyProgressPath,
  skillVersion,
  requestedMode,
  stage,
  status = APPLY_PROGRESS_STATUS.IN_PROGRESS,
  startedAt = '',
  detail = '',
  lastError = '',
}) {
  const updatedAt = new Date().toISOString()
  const normalizedStartedAt = normalizeString(startedAt) || updatedAt
  const nextProgress = normalizeApplyProgressPayload({
    schema: 'hiui-design-apply-progress.v1',
    skillVersion,
    status,
    stage,
    requestedMode,
    startedAt: normalizedStartedAt,
    updatedAt,
    detail,
    lastError,
  })

  await ensureDir(path.dirname(applyProgressPath))
  await fs.writeFile(applyProgressPath, `${JSON.stringify(nextProgress, null, 2)}\n`, 'utf8')
  return nextProgress
}

export async function clearApplyProgress(applyProgressPath) {
  if (!applyProgressPath) return
  await fs.rm(applyProgressPath, { force: true })
}
