import fs from 'node:fs/promises'
import path from 'node:path'

import { isRecognizedInstallMode } from './mode-contract.mjs'
import {
  APPLY_PROGRESS_FILENAME,
  APPLY_STATE_FILENAME,
  resolveProjectContextPathCandidates,
} from './skill-identity.mjs'
import {
  createUncheckedHostCompatibility,
  inspectHostCompatibilityLight,
} from './host-compat-light-gate.mjs'
import { readApplyProgress } from './apply-state.mjs'

export const REQUIRED_CONTEXT_MARKERS = [
  '.context.jsonc',
  path.join('scripts', 'apply-in-current-project.mjs'),
]

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return null
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

function buildMissingContextResult({ checkedRoots, contextRoot = '', contextDirName = '', missingMarkers = [] }) {
  const detail =
    checkedRoots.length > 0
      ? `Checked: ${checkedRoots.join(', ')}`
      : 'No project-local hiui-design context directory was checked.'
  const markerSuffix =
    missingMarkers.length > 0 ? ` Missing markers: ${missingMarkers.join(', ')}` : ''

  return {
    status: 'missing-context',
    ready: false,
    reason: `${detail}${markerSuffix}`.trim(),
    contextRoot,
    contextDirName,
    checkedRoots,
    missingMarkers,
    applyStatePath: '',
    applyProgressPath: '',
    appliedMode: '',
    applyProgress: null,
    applyProgressParseError: '',
    compatibilityWarnings: [],
    hostCompatibility: createUncheckedHostCompatibility(
      'Host compatibility was not evaluated because the project-local hiui-design context is missing.'
    ),
  }
}

async function readApplyProgressSafely(applyProgressPath) {
  try {
    return {
      applyProgress: await readApplyProgress(applyProgressPath),
      applyProgressParseError: '',
      compatibilityWarnings: [],
    }
  } catch (error) {
    return {
      applyProgress: null,
      applyProgressParseError: `Failed to parse apply progress at ${applyProgressPath}: ${error.message}`,
      compatibilityWarnings: ['invalid-apply-progress'],
    }
  }
}

export async function inspectIntegrationReadiness(targetRoot) {
  const checkedRoots = []

  for (const candidateRoot of resolveProjectContextPathCandidates(targetRoot)) {
    checkedRoots.push(candidateRoot)
    if (!(await pathExists(candidateRoot))) continue

    const missingMarkers = []
    for (const marker of REQUIRED_CONTEXT_MARKERS) {
      const markerPath = path.join(candidateRoot, marker)
      if (!(await pathExists(markerPath))) {
        missingMarkers.push(marker)
      }
    }

    const contextDirName = path.basename(candidateRoot)
    const compatibilityWarnings = contextDirName === 'hiui5-design' ? ['legacy-context-dir'] : []
    const applyStatePath = path.join(candidateRoot, 'outputs', APPLY_STATE_FILENAME)
    const applyProgressPath = path.join(candidateRoot, 'outputs', APPLY_PROGRESS_FILENAME)
    const {
      applyProgress,
      applyProgressParseError,
      compatibilityWarnings: applyProgressWarnings,
    } = await readApplyProgressSafely(applyProgressPath)
    compatibilityWarnings.push(...applyProgressWarnings)

    if (missingMarkers.length > 0) {
      return buildMissingContextResult({
        checkedRoots,
        contextRoot: candidateRoot,
        contextDirName,
        missingMarkers,
      })
    }

    if (!(await pathExists(applyStatePath))) {
      const applyProgressReason =
        applyProgress?.status === 'in-progress'
          ? ` Latest apply progress: ${applyProgress.stage || 'unknown-stage'} is still running. ${applyProgress.detail || ''}`.trim()
          : applyProgress?.status === 'failed'
            ? ` Latest apply attempt failed at ${applyProgress.stage || 'unknown-stage'}: ${applyProgress.lastError || applyProgress.detail || 'unknown error'}`.trim()
            : applyProgressParseError
              ? ` Ignored malformed apply progress file. ${applyProgressParseError}`.trim()
              : ''
      return {
        status: 'missing-apply-state',
        ready: false,
        reason: `Missing apply state file: ${applyStatePath}.${applyProgressReason ? ` ${applyProgressReason}` : ''}`.trim(),
        contextRoot: candidateRoot,
        contextDirName,
        checkedRoots,
        missingMarkers: [],
        applyStatePath,
        applyProgressPath,
        appliedMode: '',
        applyProgress,
        applyProgressParseError,
        compatibilityWarnings,
        hostCompatibility: createUncheckedHostCompatibility(
          'Host compatibility was not evaluated because apply-state is missing.'
        ),
      }
    }

    let applyState
    try {
      applyState = await readJsonIfExists(applyStatePath)
    } catch (error) {
      return {
        status: 'invalid-apply-state',
        ready: false,
        reason: `Failed to parse apply state at ${applyStatePath}: ${error.message}`,
        contextRoot: candidateRoot,
        contextDirName,
        checkedRoots,
        missingMarkers: [],
        applyStatePath,
        applyProgressPath,
        appliedMode: '',
        applyProgress,
        applyProgressParseError,
        compatibilityWarnings,
        hostCompatibility: createUncheckedHostCompatibility(
          'Host compatibility was not evaluated because apply-state is invalid.'
        ),
      }
    }

    const appliedMode = String(applyState?.appliedMode || '').trim()
    if (!isRecognizedInstallMode(appliedMode, { allowAuto: false })) {
      return {
        status: 'invalid-applied-mode',
        ready: false,
        reason: `Apply state at ${applyStatePath} must contain a recognized non-auto appliedMode.`,
        contextRoot: candidateRoot,
        contextDirName,
        checkedRoots,
        missingMarkers: [],
        applyStatePath,
        applyProgressPath,
        appliedMode,
        applyProgress,
        applyProgressParseError,
        compatibilityWarnings,
        hostCompatibility: createUncheckedHostCompatibility(
          'Host compatibility was not evaluated because appliedMode is invalid.'
        ),
      }
    }

    const hostCompatibility = await inspectHostCompatibilityLight(targetRoot, {
      appliedMode,
    })

    return {
      status: 'ready',
      ready: true,
      reason: compatibilityWarnings.length > 0
        ? `Project context is ready via legacy directory ${candidateRoot}.`
        : `Project context is ready at ${candidateRoot}.`,
      contextRoot: candidateRoot,
      contextDirName,
      checkedRoots,
      missingMarkers: [],
      applyStatePath,
      applyProgressPath,
      appliedMode,
      applyProgress,
      applyProgressParseError,
      compatibilityWarnings,
      hostCompatibility,
    }
  }

  return buildMissingContextResult({ checkedRoots })
}

export function isIntegrationReady(readiness) {
  return Boolean(readiness?.ready) && readiness?.status === 'ready'
}
