import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { processFinalizeCliOptions } from '../../scripts/finalize-usage.mjs'

const PROJECT_MODE_RELATIVE_PATH = '.local-context/hiui-design/outputs/project-mode.json'
const PROJECT_INTEGRATION_STATE_RELATIVE_PATH =
  '.local-context/hiui-design/outputs/project-integration-state.json'
const GENERATED_PAGE_FILES = [
  'index.tsx',
  'index.module.scss',
  'page.schema.json',
  'hiui-pagegen.meta.json',
]

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

export function normalizeReportMode(mode) {
  const normalizedMode = String(mode || '').trim()
  if (normalizedMode === 'host-compatible') {
    return 'legacy-host-compatible'
  }
  if (
    ['host-integration', 'rules-only', 'legacy-host-compatible'].includes(normalizedMode)
  ) {
    return normalizedMode
  }
  return ''
}

export function resolveReportMode({ repoRoot, explicitReportMode = '', env = process.env }) {
  const explicit = normalizeReportMode(explicitReportMode)
  if (explicit) {
    return {
      reportMode: explicit,
      source: 'cli',
    }
  }

  const envMode = normalizeReportMode(
    env.HIUI_PAGEGEN_REPORT_MODE || env.HIUI_DESIGN_REPORT_MODE || ''
  )
  if (envMode) {
    return {
      reportMode: envMode,
      source: 'env',
    }
  }

  const projectMode = readJsonIfExists(path.resolve(repoRoot, PROJECT_MODE_RELATIVE_PATH))
  const projectModeValue = normalizeReportMode(projectMode?.mode)
  if (projectModeValue) {
    return {
      reportMode: projectModeValue,
      source: 'project-mode-lock',
    }
  }

  const integrationState = readJsonIfExists(
    path.resolve(repoRoot, PROJECT_INTEGRATION_STATE_RELATIVE_PATH)
  )
  const integrationMode = normalizeReportMode(integrationState?.mode)
  if (integrationMode) {
    return {
      reportMode: integrationMode,
      source: 'project-integration-state',
    }
  }

  return {
    reportMode: 'legacy-host-compatible',
    source: 'fallback-default',
  }
}

export function buildFallbackPrompt({
  pageType,
  targetPagePath,
  generationMode,
  schemaSource,
}) {
  const promptParts = [
    'hiui-design auto-report fallback prompt',
    `pageType=${pageType}`,
    `page=${targetPagePath}`,
    `generationMode=${generationMode}`,
  ]

  if (schemaSource) {
    promptParts.push(`schema=${schemaSource}`)
  }

  return promptParts.join('; ')
}

export function resolveUsagePrompt({
  explicitPrompt = '',
  env = process.env,
  pageType,
  targetPagePath,
  generationMode,
  schemaSource,
}) {
  const cliPrompt = String(explicitPrompt || '').trim()
  if (cliPrompt) {
    return {
      prompt: cliPrompt,
      source: 'cli',
      synthesized: false,
    }
  }

  const envPrompt = String(
    env.HIUI_PAGEGEN_USAGE_PROMPT || env.HIUI_DESIGN_TASK_PROMPT || ''
  ).trim()
  if (envPrompt) {
    return {
      prompt: envPrompt,
      source: 'env',
      synthesized: false,
    }
  }

  return {
    prompt: buildFallbackPrompt({
      pageType,
      targetPagePath,
      generationMode,
      schemaSource,
    }),
    source: 'fallback',
    synthesized: true,
  }
}

function computeGeneratedSnapshotHash({ repoRoot, targetPagePath }) {
  const pageRoot = path.resolve(repoRoot, targetPagePath)
  const hash = crypto.createHash('sha256')

  GENERATED_PAGE_FILES.forEach((fileName) => {
    const filePath = path.resolve(pageRoot, fileName)
    if (!fs.existsSync(filePath)) {
      return
    }

    hash.update(fileName)
    hash.update('\n')
    hash.update(fs.readFileSync(filePath))
    hash.update('\n')
  })

  return hash.digest('hex')
}

function buildRunId({ reportMode, targetPagePath, snapshotHash }) {
  return crypto
    .createHash('sha256')
    .update(`hiui-pagegen:generate:${reportMode}:${targetPagePath}:${snapshotHash}`)
    .digest('hex')
}

function normalizeUsageStatsStatus(usageResult) {
  const status = String(usageResult?.status || '').trim()
  const exitCode = Number(usageResult?.exit_code ?? 0)

  if (status === 'completed') return 'completed'
  if (status === 'requires_network_authorization' || exitCode === 21) {
    return 'requires_authorization'
  }
  if (status === 'flush_incomplete' || exitCode === 24) return 'failed_retryable'
  if (!usageResult?.ok || exitCode !== 0) return 'failed_non_retryable'
  return 'completed'
}

export function summarizeUsageReport(report = null) {
  if (!report) {
    return null
  }

  return {
    dryRun: Boolean(report.dryRun),
    message: String(report.message || '').trim(),
    ok: Boolean(report.ok),
    promptSource: String(report.promptSource || '').trim(),
    reportMode: String(report.reportMode || '').trim(),
    reportModeSource: String(report.reportModeSource || '').trim(),
    requiresNetworkAuthorization: Boolean(report.requiresNetworkAuthorization),
    status: String(report.status || '').trim(),
    synthesizedPrompt: Boolean(report.synthesizedPrompt),
    usageStatsStatus: String(report.usageStatsStatus || '').trim(),
  }
}

export async function reportGeneratedPageUsage({
  repoRoot,
  explicitPrompt = '',
  explicitReportMode = '',
  generationMode,
  pageType,
  schemaSource = '',
  targetPagePath,
  env = process.env,
  timeoutMs = 5000,
  workspaceRoot = repoRoot,
  dryRun = env.HIUI_PAGEGEN_USAGE_DRY_RUN === '1',
}) {
  const { reportMode, source: reportModeSource } = resolveReportMode({
    repoRoot,
    explicitReportMode,
    env,
  })
  const { prompt, source: promptSource, synthesized } = resolveUsagePrompt({
    explicitPrompt,
    env,
    pageType,
    targetPagePath,
    generationMode,
    schemaSource,
  })
  const snapshotHash = computeGeneratedSnapshotHash({
    repoRoot,
    targetPagePath,
  })
  const usageResult = await processFinalizeCliOptions({
    dryRun,
    event: 'skill_run',
    flushOnly: false,
    prompt,
    reportMode,
    runId: buildRunId({
      reportMode,
      targetPagePath,
      snapshotHash,
    }),
    skillName: 'hiui-design',
    success: true,
    timeoutMs,
    workspaceRoot,
  })

  return {
    dryRun: Boolean(dryRun),
    message: String(usageResult?.message || '').trim(),
    ok: Boolean(usageResult?.ok),
    promptSource,
    reportMode,
    reportModeSource,
    requiresNetworkAuthorization: Boolean(usageResult?.requires_network_authorization),
    status: String(usageResult?.status || '').trim(),
    synthesizedPrompt: synthesized,
    usageStatsStatus: normalizeUsageStatsStatus(usageResult),
  }
}
