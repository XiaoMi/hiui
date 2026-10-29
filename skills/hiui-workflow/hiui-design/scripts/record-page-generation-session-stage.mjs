#!/usr/bin/env node

import path from 'node:path'

import {
  buildPageGenerationSessionRef,
  recordPageGenerationSessionStage,
} from './lib/page-generation-session-trace.mjs'
import { getContextScriptPath } from './lib/skill-identity.mjs'

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

function parseTimestamp(value, flag) {
  const normalized = normalizeString(value)
  if (!normalized) return null
  const parsed = Date.parse(normalized)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid timestamp for ${flag}: ${value}`)
  }
  return parsed
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    sessionId: '',
    source: 'page-generation-workflow',
    stage: '',
    status: 'success',
    startedAtMs: null,
    finishedAtMs: null,
    detailsJson: '',
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
    if (arg === '--source') {
      options.source = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--stage') {
      options.stage = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--status') {
      options.status = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--started-at-ms') {
      options.startedAtMs = Number(readRequiredArg(argv, index, arg))
      index += 1
      continue
    }
    if (arg === '--finished-at-ms') {
      options.finishedAtMs = Number(readRequiredArg(argv, index, arg))
      index += 1
      continue
    }
    if (arg === '--started-at') {
      options.startedAtMs = parseTimestamp(readRequiredArg(argv, index, arg), arg)
      index += 1
      continue
    }
    if (arg === '--finished-at') {
      options.finishedAtMs = parseTimestamp(readRequiredArg(argv, index, arg), arg)
      index += 1
      continue
    }
    if (arg === '--details-json') {
      options.detailsJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(
        `Usage: node ${getContextScriptPath('record-page-generation-session-stage.mjs')} --session-id <id> --stage <name> [--target <project-root>] [--source <workflow-source>] [--status <started|success|blocked|failed>] [--started-at-ms <ms> | --started-at <iso>] [--finished-at-ms <ms> | --finished-at <iso>] [--details-json <json>] [--json]`
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!normalizeString(options.sessionId)) {
    throw new Error('Missing --session-id <id>')
  }
  if (!normalizeString(options.stage)) {
    throw new Error('Missing --stage <name>')
  }
  if (options.startedAtMs != null && !Number.isFinite(options.startedAtMs)) {
    throw new Error('Invalid --started-at-ms value')
  }
  if (options.finishedAtMs != null && !Number.isFinite(options.finishedAtMs)) {
    throw new Error('Invalid --finished-at-ms value')
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const targetRoot = path.resolve(options.target)
  let details = {}
  if (options.detailsJson) {
    try {
      details = JSON.parse(options.detailsJson)
    } catch (error) {
      throw new Error(`Invalid JSON passed to --details-json: ${error.message}`, { cause: error })
    }
  }

  const finishedAtMs = options.finishedAtMs ?? Date.now()
  const startedAtMs = options.startedAtMs ?? finishedAtMs
  const sessionContext = await recordPageGenerationSessionStage({
    targetRoot,
    sessionId: options.sessionId,
    source: options.source,
    stage: options.stage,
    status: options.status,
    startedAtMs,
    finishedAtMs,
    details,
  })

  const result = {
    schema: 'hiui-design-page-generation-session-stage-record.v1',
    targetRoot,
    sessionId: options.sessionId,
    stage: options.stage,
    status: options.status,
    tracePath: sessionContext?.tracePath || '',
    sessionTrace: buildPageGenerationSessionRef(sessionContext, {
      currentStage: options.stage,
      currentStatus: options.status,
    }),
  }

  if (options.json) {
    console.log(`${JSON.stringify(result, null, 2)}\n`)
    return
  }

  console.log('page generation session stage recorded')
  console.log(`- session id: ${result.sessionId}`)
  console.log(`- stage: ${result.stage}`)
  console.log(`- status: ${result.status}`)
  console.log(`- trace path: ${result.tracePath}`)
}

await main()
