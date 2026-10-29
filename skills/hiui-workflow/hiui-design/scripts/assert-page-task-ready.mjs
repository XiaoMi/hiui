#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { inspectPageTaskGate } from './lib/page-task-gate.mjs'
import { PAGE_TASK_READINESS } from './lib/page-task-status.mjs'
import { getContextScriptPath } from './lib/skill-identity.mjs'

function printUsage() {
  console.log(`Usage: node "${getContextScriptPath('assert-page-task-ready.mjs')}" [--target <project-root>] [--json]`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --target')
      options.target = value
      index += 1
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function normalizeString(value) {
  return String(value || '').trim()
}

function uniqueStrings(values, fallback = []) {
  const nextValues = Array.isArray(values) ? values : fallback
  return [...new Set(nextValues.map((value) => normalizeString(value)).filter(Boolean))]
}

function writeToStream(stream, text) {
  return new Promise((resolve, reject) => {
    stream.write(text, (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const gate = await inspectPageTaskGate({
    targetRoot: path.resolve(options.target),
    skillRoot,
  })

  const payload = {
    schema: 'hiui-design-assert-page-task-ready.v1',
    ...gate,
    allowedActions:
      gate.status === PAGE_TASK_READINESS.READY_TO_GENERATE
        ? []
        : uniqueStrings(gate.allowedActions),
    forbiddenActions:
      gate.status === PAGE_TASK_READINESS.READY_TO_GENERATE
        ? []
        : uniqueStrings(gate.forbiddenActions),
  }

  if (options.json) {
    await writeToStream(process.stdout, `${JSON.stringify(payload, null, 2)}\n`)
  } else if (payload.status === PAGE_TASK_READINESS.READY_TO_GENERATE) {
    await writeToStream(process.stdout, 'Project is ready for hiui-design page tasks.\n')
  } else {
    await writeToStream(process.stderr, 'Project is not ready for hiui-design page tasks.\n')
    await writeToStream(process.stderr, `Reason: ${payload.reason}\n`)
    await writeToStream(process.stderr, `Next: ${payload.nextCommand}\n`)
  }

  if (payload.status !== PAGE_TASK_READINESS.READY_TO_GENERATE) {
    process.exit(1)
  }
}

await main()
