#!/usr/bin/env node

import path from 'node:path'

import {
  buildPageGenerationSessionRef,
  openPageGenerationSession,
} from './lib/page-generation-session-trace.mjs'
import { getContextScriptPath } from './lib/skill-identity.mjs'

function readRequiredArg(argv, index, flag) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`)
  }
  return value
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    sessionId: '',
    source: 'page-generation-workflow',
    pageType: '',
    pageFamily: '',
    title: '',
    routePath: '',
    dest: '',
    mode: '',
    inputMode: '',
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
    if (arg === '--page-type') {
      options.pageType = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--page-family') {
      options.pageFamily = readRequiredArg(argv, index, arg)
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
    if (arg === '--dest') {
      options.dest = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--mode') {
      options.mode = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--input-mode') {
      options.inputMode = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(
        `Usage: node ${getContextScriptPath('open-page-generation-session.mjs')} [--target <project-root>] [--session-id <id>] [--source <workflow-source>] [--page-type <id>] [--page-family <id>] [--title <title>] [--route-path <path>] [--dest <dir>] [--mode <mode>] [--input-mode <mode>] [--json]`
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function buildResult(sessionContext) {
  return {
    schema: 'hiui-design-page-generation-session-open-result.v1',
    targetRoot: sessionContext.targetRoot,
    sessionId: sessionContext.sessionId,
    tracePath: sessionContext.tracePath,
    sessionTrace: buildPageGenerationSessionRef(sessionContext, {
      currentStage: 'sessionStart',
      currentStatus: 'started',
    }),
    nextStep:
      'Reuse this sessionId in generation-brief.mjs / plan-page-task.mjs / generate-page-from-brief.mjs and record upstream workflow stages into the same trace when available.',
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const targetRoot = path.resolve(options.target)
  const sessionContext = await openPageGenerationSession({
    targetRoot,
    sessionId: options.sessionId,
    source: options.source,
    options,
  })
  const result = buildResult(sessionContext)

  if (options.json) {
    console.log(`${JSON.stringify(result, null, 2)}\n`)
    return
  }

  console.log('page generation session opened')
  console.log(`- session id: ${result.sessionId}`)
  console.log(`- workspace: ${result.targetRoot}`)
  console.log(`- trace path: ${result.tracePath}`)
}

await main()
