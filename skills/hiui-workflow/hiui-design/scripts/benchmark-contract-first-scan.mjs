#!/usr/bin/env node

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { formatInstallModeUsage } from './lib/mode-contract.mjs'
import { getContextScriptPath } from './lib/skill-identity.mjs'

function normalizeString(value) {
  return String(value || '').trim()
}

function readRequiredArg(argv, index, flag) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${flag}`)
  return value
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    pageType: '',
    mode: 'auto',
    dest: '',
    title: '',
    routePath: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') continue

    if (arg === '--target') {
      options.target = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--page-type') {
      options.pageType = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--mode') {
      options.mode = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--dest') {
      options.dest = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--title') {
      options.title = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--route-path') {
      options.routePath = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(
        `Usage: node ${getContextScriptPath('benchmark-contract-first-scan.mjs')} --target <project-root> --page-type <id> --dest <relative-dir> --title <title> [--route-path <path>] [--mode <${formatInstallModeUsage()}>] [--json]`
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.pageType) throw new Error('Missing required --page-type')
  if (!options.dest) throw new Error('Missing required --dest')
  if (!options.title) throw new Error('Missing required --title')

  return options
}

async function readTraceSummary(traceFilePath) {
  const raw = await fs.readFile(traceFilePath, 'utf8').catch(() => '')
  const counts = {}
  const events = []

  for (const line of raw.split('\n').filter(Boolean)) {
    try {
      const payload = JSON.parse(line)
      const eventName = normalizeString(payload?.name) || 'unknown'
      counts[eventName] = (counts[eventName] || 0) + 1
      events.push(payload)
    } catch {
      continue
    }
  }

  return {
    counts,
    totalEvents: events.length,
    events,
  }
}

function getCount(summary, eventName) {
  return Number(summary?.counts?.[eventName] || 0)
}

async function resetTraceFile(traceFilePath) {
  await fs.rm(traceFilePath, { force: true })
}

function runNodeScript(scriptPath, args, { cwd, env }) {
  const startedAt = Date.now()
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    env,
    encoding: 'utf8',
  })
  const durationMs = Date.now() - startedAt
  return {
    durationMs,
    result,
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const targetRoot = path.resolve(options.target)
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const traceDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-design-scan-benchmark-'))
  const traceFilePath = path.join(traceDir, 'scan-trace.jsonl')
  const env = {
    ...process.env,
    HIUI_DESIGN_SCAN_TRACE_FILE: traceFilePath,
  }

  const preflightScriptPath = path.join(scriptDir, 'typical-page-preflight.mjs')
  const generationBriefScriptPath = path.join(scriptDir, 'generation-brief.mjs')
  const planScriptPath = path.join(scriptDir, 'plan-page-task.mjs')
  const generateScriptPath = path.join(scriptDir, 'generate-page-from-brief.mjs')

  const baseArgs = [
    '--target',
    targetRoot,
    '--page-type',
    options.pageType,
    '--dest',
    options.dest,
    '--title',
    options.title,
    '--mode',
    options.mode,
    '--json',
  ]
  if (options.routePath) {
    baseArgs.push('--route-path', options.routePath)
  }

  await resetTraceFile(traceFilePath)
  const preflightRun = runNodeScript(
    preflightScriptPath,
    ['--target', targetRoot, '--mode', options.mode, '--json'],
    {
      cwd: skillRoot,
      env,
    }
  )
  if (preflightRun.result.status !== 0) {
    throw new Error(preflightRun.result.stderr || preflightRun.result.stdout || 'preflight failed')
  }
  const preflightPayload = JSON.parse(preflightRun.result.stdout)
  const preflightTrace = await readTraceSummary(traceFilePath)

  await resetTraceFile(traceFilePath)
  const generationBriefRun = runNodeScript(generationBriefScriptPath, baseArgs, {
    cwd: skillRoot,
    env,
  })
  if (generationBriefRun.result.status !== 0) {
    throw new Error(
      generationBriefRun.result.stderr || generationBriefRun.result.stdout || 'generation-brief failed'
    )
  }
  const generationBriefPayload = JSON.parse(generationBriefRun.result.stdout)

  const planRun = runNodeScript(planScriptPath, baseArgs, {
    cwd: skillRoot,
    env,
  })
  if (planRun.result.status !== 0) {
    throw new Error(planRun.result.stderr || planRun.result.stdout || 'plan-page-task failed')
  }
  const planPayload = JSON.parse(planRun.result.stdout)

  const generateRun = runNodeScript(
    generateScriptPath,
    [...baseArgs.filter((item) => item !== '--json'), '--dry-run', '--json'],
    {
      cwd: skillRoot,
      env,
    }
  )
  if (generateRun.result.status !== 0) {
    throw new Error(
      generateRun.result.stderr || generateRun.result.stdout || 'generate-page-from-brief failed'
    )
  }
  const generatePayload = JSON.parse(generateRun.result.stdout)
  const downstreamTrace = await readTraceSummary(traceFilePath)

  const downstreamRepeatedNavigationScanCount =
    getCount(downstreamTrace, 'evaluate-project-generation-readiness') +
    getCount(downstreamTrace, 'detect-formal-navigation') +
    getCount(downstreamTrace, 'inspect-app-entry-mount-plan')
  const repeatedProjectScanAvoided = downstreamRepeatedNavigationScanCount === 0

  const payload = {
    schema: 'hiui-design-contract-first-scan-benchmark.v1',
    status:
      preflightPayload.status === 'pass' &&
      repeatedProjectScanAvoided &&
      getCount(preflightTrace, 'detect-formal-navigation') >= 1 &&
      getCount(downstreamTrace, 'read-project-host-contract') >= 1
        ? 'pass'
        : 'fail',
    targetRoot,
    scenario: {
      pageType: options.pageType,
      dest: options.dest,
      title: options.title,
      routePath: options.routePath,
      mode: options.mode,
    },
    phases: {
      preflight: {
        durationMs: preflightRun.durationMs,
        payloadStatus: preflightPayload.status,
        traceCounts: preflightTrace.counts,
      },
      downstreamContractFirst: {
        durationMs:
          generationBriefRun.durationMs + planRun.durationMs + generateRun.durationMs,
        commands: {
          generationBriefDurationMs: generationBriefRun.durationMs,
          planPageTaskDurationMs: planRun.durationMs,
          generatePageFromBriefDurationMs: generateRun.durationMs,
        },
        traceCounts: downstreamTrace.counts,
      },
    },
    assertions: {
      preflightDetectFormalNavigationCount: getCount(preflightTrace, 'detect-formal-navigation'),
      preflightDetectHostProfileCount: getCount(preflightTrace, 'detect-host-profile'),
      preflightInspectAppEntryMountPlanCount: getCount(
        preflightTrace,
        'inspect-app-entry-mount-plan'
      ),
      downstreamDetectFormalNavigationCount: getCount(downstreamTrace, 'detect-formal-navigation'),
      downstreamDetectHostProfileCount: getCount(downstreamTrace, 'detect-host-profile'),
      downstreamInspectAppEntryMountPlanCount: getCount(
        downstreamTrace,
        'inspect-app-entry-mount-plan'
      ),
      downstreamEvaluateProjectGenerationReadinessCount: getCount(
        downstreamTrace,
        'evaluate-project-generation-readiness'
      ),
      downstreamReadProjectHostContractCount: getCount(
        downstreamTrace,
        'read-project-host-contract'
      ),
      downstreamRepeatedProjectScanCount: downstreamRepeatedNavigationScanCount,
      downstreamAuxiliaryHostProfileScanCount: getCount(
        downstreamTrace,
        'detect-host-profile'
      ),
      repeatedProjectScanAvoided,
    },
    resultConsistency: {
      briefDefaultBusinessPageDir: generationBriefPayload?.requestedBusiness?.defaultBusinessPageDir,
      planTargetBusinessPath: planPayload?.startFrom?.targetBusinessPath,
      generateDestDir: generatePayload?.destDir,
      briefNavigationMountAction: generationBriefPayload?.pageGenerationDecision?.navigationMountAction?.action,
      planNavigationMountAction: planPayload?.navigationMountAction?.action,
      generateNavigationMountAction: generatePayload?.navigationMountAction?.action,
    },
  }

  if (options.json) {
    console.log(JSON.stringify(payload, null, 2))
  } else if (payload.status === 'pass') {
    console.log(
      `pass: downstream contract-first chain avoided repeated navigation rescans (contract reads=${payload.assertions.downstreamReadProjectHostContractCount})`
    )
  } else {
    console.log(
      `fail: downstream repeated navigation scan count=${payload.assertions.downstreamRepeatedProjectScanCount}`
    )
  }
}

try {
  await main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
}
