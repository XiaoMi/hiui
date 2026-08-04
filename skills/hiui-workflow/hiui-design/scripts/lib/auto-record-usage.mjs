import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const DISABLED_VALUES = new Set(['0', 'false', 'no', 'off', 'disabled'])
const OPEN_SOURCE_VALUES = new Set(['open-source', 'open_source', 'public', 'oss'])
const SUPPORTED_REPORT_MODES = new Set(['rules-only', 'host-integration', 'legacy-host-compatible'])

function normalizeString(value) {
  return String(value || '').trim()
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function isAutoUsageDisabledByEnv() {
  const value = normalizeString(process.env.HIUI_DESIGN_AUTO_RECORD_USAGE).toLowerCase()
  return value ? DISABLED_VALUES.has(value) : false
}

function isOpenSourceRuntime() {
  const edition = normalizeString(process.env.HIUI_DESIGN_EDITION).toLowerCase()
  const distribution = normalizeString(process.env.HIUI_DESIGN_DISTRIBUTION).toLowerCase()
  return OPEN_SOURCE_VALUES.has(edition) || OPEN_SOURCE_VALUES.has(distribution)
}

function resolveTimeoutMs(timeoutMs) {
  const envTimeout = Number(process.env.HIUI_DESIGN_AUTO_RECORD_USAGE_TIMEOUT_MS)
  if (Number.isFinite(envTimeout) && envTimeout > 0) return envTimeout
  const explicitTimeout = Number(timeoutMs)
  return Number.isFinite(explicitTimeout) && explicitTimeout > 0 ? explicitTimeout : 5000
}

function stableRunId({ commandName, pagePath, reportMode, sourceSnapshotHash }) {
  const hash = crypto
    .createHash('sha256')
    .update([
      'hiui-design-auto-usage',
      commandName,
      reportMode,
      pagePath,
      sourceSnapshotHash,
    ].map(normalizeString).join('\n'))
    .digest('hex')
    .slice(0, 24)
  return `auto-${hash}`
}

function sanitizeRecordUsageResult(parsed, exitCode) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null
  }

  return {
    ok: Boolean(parsed.ok),
    status: normalizeString(parsed.status) || (exitCode === 0 ? 'unknown' : 'failed'),
    exitCode,
    page: normalizeString(parsed.page),
    requiresNetworkAuthorization: Boolean(parsed.requires_network_authorization),
    nextAction: normalizeString(parsed.next_action),
    message: normalizeString(parsed.message),
    pending: parsed.pending && typeof parsed.pending === 'object'
      ? {
          count: Number(parsed.pending.count || 0),
          path: normalizeString(parsed.pending.path),
        }
      : null,
    queue: parsed.queue && typeof parsed.queue === 'object'
      ? {
          queued: Boolean(parsed.queue.queued),
          pendingCount: Number(parsed.queue.pendingCount || 0),
          path: normalizeString(parsed.queue.path),
        }
      : null,
    serviceUrl: normalizeString(parsed.service_url),
    hasServiceToken: Boolean(parsed.has_service_token),
  }
}

export async function autoRecordGeneratedPageUsage({
  commandName,
  pagePath,
  prompt,
  reportMode,
  skillRoot,
  sourceSnapshotHash = '',
  targetRoot,
  timeoutMs = 5000,
} = {}) {
  const normalizedPagePath = normalizeString(pagePath)
  const normalizedReportMode = normalizeString(reportMode)
  const normalizedTargetRoot = path.resolve(normalizeString(targetRoot) || process.cwd())
  const normalizedSkillRoot = path.resolve(normalizeString(skillRoot) || process.cwd())

  if (isAutoUsageDisabledByEnv()) {
    return {
      attempted: false,
      ok: false,
      status: 'skipped',
      reason: 'disabled_by_HIUI_DESIGN_AUTO_RECORD_USAGE',
    }
  }

  if (isOpenSourceRuntime()) {
    return {
      attempted: false,
      ok: false,
      status: 'not_applicable',
      reason: 'open_source_runtime',
    }
  }

  if (!normalizedPagePath) {
    return {
      attempted: false,
      ok: false,
      status: 'failed_non_retryable',
      reason: 'missing_page_path',
    }
  }

  if (!SUPPORTED_REPORT_MODES.has(normalizedReportMode)) {
    return {
      attempted: false,
      ok: false,
      status: 'failed_non_retryable',
      reason: `unsupported_report_mode:${normalizedReportMode || 'empty'}`,
    }
  }

  const recordUsageScript = path.join(normalizedSkillRoot, 'scripts', 'record-usage.mjs')
  const usageRuntimeFile = path.join(normalizedSkillRoot, 'scripts', 'lib', 'log-usage-event.mjs')
  const statsConfigFile = path.join(normalizedSkillRoot, 'scripts', 'lib', 'stats-config.mjs')

  if (
    !(await pathExists(recordUsageScript)) ||
    !(await pathExists(usageRuntimeFile)) ||
    !(await pathExists(statsConfigFile))
  ) {
    return {
      attempted: false,
      ok: false,
      status: 'not_applicable',
      reason: 'usage_runtime_unavailable',
    }
  }

  const normalizedPrompt = normalizeString(prompt) ||
    `Generated ${normalizedPagePath} with ${normalizeString(commandName) || 'hiui-design'}`
  const runId = stableRunId({
    commandName,
    pagePath: normalizedPagePath,
    reportMode: normalizedReportMode,
    sourceSnapshotHash,
  })
  const args = [
    recordUsageScript,
    '--target',
    normalizedTargetRoot,
    '--page',
    normalizedPagePath,
    '--report-mode',
    normalizedReportMode,
    '--prompt',
    normalizedPrompt,
    '--run-id',
    runId,
    '--timeout-ms',
    String(resolveTimeoutMs(timeoutMs)),
    '--json',
  ]

  const result = spawnSync(process.execPath, args, {
    cwd: normalizedTargetRoot,
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 16 * 1024 * 1024,
  })

  let parsed = null
  try {
    parsed = JSON.parse(result.stdout || '{}')
  } catch {
    parsed = null
  }

  const summary = sanitizeRecordUsageResult(parsed, result.status ?? 0)
  return {
    attempted: true,
    ok: Boolean(summary?.ok),
    status: summary?.status || 'failed_non_retryable',
    exitCode: result.status ?? 0,
    command: 'typical-page:record-usage',
    runId,
    page: normalizedPagePath,
    reportMode: normalizedReportMode,
    requiresNetworkAuthorization: Boolean(summary?.requiresNetworkAuthorization || result.status === 21),
    nextAction: summary?.nextAction || (result.status === 21 ? 'request_network_authorization_and_rerun_finalize_usage_flush_only' : ''),
    message: summary?.message || normalizeString(result.stderr || result.stdout),
    pending: summary?.pending || null,
    queue: summary?.queue || null,
    serviceUrl: summary?.serviceUrl || '',
    hasServiceToken: Boolean(summary?.hasServiceToken),
  }
}
