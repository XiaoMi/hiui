#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'

import {
  PAGE_GENERATION_SESSION_TRACE_FILENAME,
  PAGE_GENERATION_SESSION_TRACE_SCHEMA,
} from './lib/page-generation-session-trace.mjs'
import { getContextScriptPath } from './lib/skill-identity.mjs'
import { createTelemetryRuntime } from './lib/usage-telemetry.mjs'

const TELEMETRY_DIRNAME = 'telemetry'
const PAGE_GENERATION_SESSIONS_DIRNAME = 'page-generation-sessions'
const ENGINEERING_CHAIN_ONLY_COVERAGE = 'engineering-chain-only'
const WORKFLOW_AND_ENGINEERING_CHAIN_COVERAGE = 'workflow-and-engineering-chain'
const UPSTREAM_FIRST_CODE_READY_STAGE = 'upstream-first-code-ready'
const UPSTREAM_REPAIR_ROUND_COMPLETE_STAGE = 'upstream-repair-round-complete'
const UPSTREAM_DONE_STAGE = 'upstream-done'

function readRequiredArg(argv, index, flag) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`)
  }
  return value
}

function normalizeString(value) {
  return String(value || '').trim()
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    sessionId: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--target' || arg === '--workspace-root') {
      options.target = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }

    if (arg === '--session-id') {
      options.sessionId = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        `Usage: node ${getContextScriptPath('report-page-generation-session-trace.mjs')} [--target <project-root>] [--session-id <id>] [--json]`
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return null
  }
}

function toMs(value) {
  const normalized = normalizeString(value)
  if (!normalized) return null
  const parsed = Date.parse(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function buildEventIndex(events = []) {
  const index = new Map()
  for (const event of Array.isArray(events) ? events : []) {
    const stage = normalizeString(event?.stage)
    if (stage) {
      index.set(stage, event)
    }
  }
  return index
}

function readEventFinishedAtMs(event) {
  return toMs(event?.finishedAt) ?? toMs(event?.startedAt)
}

function durationBetweenMs(startedAtMs, finishedAtMs) {
  if (!Number.isFinite(startedAtMs) || !Number.isFinite(finishedAtMs)) {
    return null
  }
  return Math.max(0, Math.round(finishedAtMs - startedAtMs))
}

function stageDuration(event) {
  if (!event || !Number.isFinite(event.durationMs)) {
    return null
  }
  return Math.max(0, Math.round(event.durationMs))
}

function formatMs(value) {
  if (!Number.isFinite(value)) {
    return 'n/a'
  }
  return `${Math.round(value)}ms`
}

function summarizeTrace(trace, tracePath) {
  const events = Array.isArray(trace?.events) ? trace.events : []
  const eventIndex = buildEventIndex(events)
  const sessionStartEvent = eventIndex.get('sessionStart')
  const briefReadyEvent = eventIndex.get('briefReady')
  const planReadyEvent = eventIndex.get('planReady')
  const firstCodeReadyEvent = eventIndex.get('firstCodeReady')
  const doneEvent = eventIndex.get('done')
  const upstreamFirstCodeReadyEvent = eventIndex.get(UPSTREAM_FIRST_CODE_READY_STAGE)
  const upstreamDoneEvent = eventIndex.get(UPSTREAM_DONE_STAGE)
  const upstreamRepairRoundEvents = events.filter(
    (event) => normalizeString(event?.stage) === UPSTREAM_REPAIR_ROUND_COMPLETE_STAGE
  )

  const sessionStartAtMs = toMs(sessionStartEvent?.startedAt) ?? toMs(trace?.createdAt)
  const briefReadyAtMs = readEventFinishedAtMs(briefReadyEvent)
  const planReadyAtMs = readEventFinishedAtMs(planReadyEvent)
  const firstCodeReadyAtMs = readEventFinishedAtMs(firstCodeReadyEvent)
  const doneAtMs = readEventFinishedAtMs(doneEvent) ?? toMs(trace?.updatedAt)
  const upstreamFirstCodeReadyAtMs = readEventFinishedAtMs(upstreamFirstCodeReadyEvent)
  const upstreamDoneAtMs = readEventFinishedAtMs(upstreamDoneEvent)
  const upstreamCoverageStatus =
    upstreamFirstCodeReadyEvent && upstreamDoneEvent
      ? 'complete'
      : upstreamFirstCodeReadyEvent || upstreamDoneEvent || upstreamRepairRoundEvents.length
        ? 'partial'
        : 'none'
  const coverage =
    upstreamCoverageStatus === 'none'
      ? ENGINEERING_CHAIN_ONLY_COVERAGE
      : WORKFLOW_AND_ENGINEERING_CHAIN_COVERAGE
  const coverageNote =
    upstreamCoverageStatus === 'none'
      ? 'Only covers hiui-design local engineering chain stages. Model request and conversation wait time are not included.'
      : 'Includes hiui-design local engineering chain stages plus upstream workflow stages explicitly recorded by the caller. Any stage not recorded by the caller remains unobserved.'

  return {
    schema: 'hiui-design-page-generation-session-trace-report.v1',
    coverage,
    coverageNote,
    workspaceRoot: normalizeString(trace?.targetRoot),
    tracePath: normalizeString(tracePath),
    sessionId: normalizeString(trace?.sessionId),
    createdAt: normalizeString(trace?.createdAt),
    updatedAt: normalizeString(trace?.updatedAt),
    currentStage: normalizeString(trace?.currentStage),
    currentStatus: normalizeString(trace?.currentStatus),
    summary: {
      sourceChain: Array.isArray(trace?.summary?.sourceChain) ? trace.summary.sourceChain : [],
      pageTypeId: normalizeString(trace?.summary?.pageTypeId),
      pageFamilyId: normalizeString(trace?.summary?.pageFamilyId),
      title: normalizeString(trace?.summary?.title),
      routePath: normalizeString(trace?.summary?.routePath),
      targetBusinessPath: normalizeString(trace?.summary?.targetBusinessPath),
      mode: normalizeString(trace?.summary?.mode),
      inputMode: normalizeString(trace?.summary?.inputMode),
    },
    stageDurationsMs: {
      briefReady: stageDuration(briefReadyEvent),
      planReady: stageDuration(planReadyEvent),
      firstCodeReady: stageDuration(firstCodeReadyEvent),
      done: stageDuration(doneEvent),
    },
    fileWriteSummary: {
      plannedFileCount: Number(firstCodeReadyEvent?.details?.plannedFileCount || 0),
      writtenFileCount: Number(firstCodeReadyEvent?.details?.writtenFileCount || 0),
      skippedIdenticalFileCount: Number(firstCodeReadyEvent?.details?.skippedIdenticalFileCount || 0),
      managedRuntimeWrittenFileCount: Number(
        firstCodeReadyEvent?.details?.managedRuntimeWrittenFileCount || 0
      ),
    },
    upstreamWorkflow: {
      coverageStatus: upstreamCoverageStatus,
      stageNames: {
        firstCodeReady: UPSTREAM_FIRST_CODE_READY_STAGE,
        repairRoundComplete: UPSTREAM_REPAIR_ROUND_COMPLETE_STAGE,
        done: UPSTREAM_DONE_STAGE,
      },
      repairRoundCount: upstreamRepairRoundEvents.length,
      stageDurationsMs: {
        firstCodeReady: stageDuration(upstreamFirstCodeReadyEvent),
        done: stageDuration(upstreamDoneEvent),
      },
      elapsedMs: {
        sessionStartToFirstCodeReady: durationBetweenMs(
          sessionStartAtMs,
          upstreamFirstCodeReadyAtMs
        ),
        sessionStartToDone: durationBetweenMs(sessionStartAtMs, upstreamDoneAtMs),
      },
    },
    elapsedMs: {
      sessionStartToBriefReady: durationBetweenMs(sessionStartAtMs, briefReadyAtMs),
      briefReadyToPlanReady: durationBetweenMs(briefReadyAtMs, planReadyAtMs),
      briefReadyToFirstCodeReady: durationBetweenMs(briefReadyAtMs, firstCodeReadyAtMs),
      sessionStartToDone: durationBetweenMs(sessionStartAtMs, doneAtMs),
    },
  }
}

async function loadSessionTraceReport(targetRoot, sessionId = '') {
  const runtime = await createTelemetryRuntime(targetRoot)
  const sessionsRoot = path.join(
    runtime.cacheDir,
    TELEMETRY_DIRNAME,
    PAGE_GENERATION_SESSIONS_DIRNAME
  )
  let sessionDirs = []
  try {
    sessionDirs = await fs.readdir(sessionsRoot, { withFileTypes: true })
  } catch {
    sessionDirs = []
  }

  const traces = []
  for (const entry of sessionDirs) {
    if (!entry.isDirectory()) continue
    if (sessionId && entry.name !== sessionId) continue
    const tracePath = path.join(sessionsRoot, entry.name, PAGE_GENERATION_SESSION_TRACE_FILENAME)
    const trace = await readJsonIfExists(tracePath)
    if (!trace || trace.schema !== PAGE_GENERATION_SESSION_TRACE_SCHEMA) continue
    traces.push({
      trace,
      tracePath,
      sortAt:
        toMs(trace.updatedAt) ??
        toMs(trace.createdAt) ??
        toMs(trace.events?.at(-1)?.finishedAt) ??
        0,
    })
  }

  if (!traces.length) {
    const selector = normalizeString(sessionId)
      ? `session ${normalizeString(sessionId)}`
      : 'latest session'
    throw new Error(
      `No page generation session trace found for ${selector} under ${sessionsRoot}`
    )
  }

  traces.sort((left, right) => right.sortAt - left.sortAt)
  const selected = traces[0]
  return summarizeTrace(selected.trace, selected.tracePath)
}

function printTextReport(report) {
  console.log('page generation session trace')
  console.log(`- coverage: ${report.coverage}`)
  console.log(`- coverage note: ${report.coverageNote}`)
  console.log(`- workspace: ${report.workspaceRoot}`)
  console.log(`- session id: ${report.sessionId}`)
  console.log(`- trace path: ${report.tracePath}`)
  console.log(`- status: ${report.currentStatus || 'unknown'} (${report.currentStage || 'unknown'})`)

  const pageSummary = [
    report.summary.pageTypeId,
    report.summary.title,
    report.summary.routePath,
    report.summary.targetBusinessPath,
  ].filter(Boolean)
  if (pageSummary.length) {
    console.log(`- page: ${pageSummary.join(' | ')}`)
  }
  console.log(
    `- file writes: planned=${report.fileWriteSummary.plannedFileCount} written=${report.fileWriteSummary.writtenFileCount} skippedIdentical=${report.fileWriteSummary.skippedIdenticalFileCount} managedRuntimeWritten=${report.fileWriteSummary.managedRuntimeWrittenFileCount}`
  )

  console.log('stage durations')
  console.log(`- briefReady: ${formatMs(report.stageDurationsMs.briefReady)}`)
  console.log(`- planReady: ${formatMs(report.stageDurationsMs.planReady)}`)
  console.log(`- firstCodeReady: ${formatMs(report.stageDurationsMs.firstCodeReady)}`)
  console.log(`- done: ${formatMs(report.stageDurationsMs.done)}`)

  console.log('elapsed timeline')
  console.log(`- sessionStart -> briefReady: ${formatMs(report.elapsedMs.sessionStartToBriefReady)}`)
  console.log(`- briefReady -> planReady: ${formatMs(report.elapsedMs.briefReadyToPlanReady)}`)
  console.log(
    `- briefReady -> firstCodeReady: ${formatMs(report.elapsedMs.briefReadyToFirstCodeReady)}`
  )
  console.log(`- sessionStart -> done: ${formatMs(report.elapsedMs.sessionStartToDone)}`)

  if (report.upstreamWorkflow?.coverageStatus !== 'none') {
    console.log('upstream workflow')
    console.log(`- coverage status: ${report.upstreamWorkflow.coverageStatus}`)
    console.log(
      `- upstream first code ready: ${formatMs(
        report.upstreamWorkflow.elapsedMs.sessionStartToFirstCodeReady
      )}`
    )
    console.log(
      `- upstream done: ${formatMs(report.upstreamWorkflow.elapsedMs.sessionStartToDone)}`
    )
    console.log(`- repair rounds: ${report.upstreamWorkflow.repairRoundCount}`)
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const report = await loadSessionTraceReport(options.target, options.sessionId)

  if (options.json) {
    console.log(`${JSON.stringify(report, null, 2)}\n`)
    return
  }

  printTextReport(report)
}

await main()
