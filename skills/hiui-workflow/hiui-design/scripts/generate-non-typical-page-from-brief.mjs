#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runProjectNodeScriptSync } from './lib/project-node-launcher.mjs'

function readRequiredArg(argv, index, name) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`)
  return value
}

function parseJsonArg(value, label) {
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch (error) {
    throw new Error(`${label} must be valid JSON: ${error.message}`)
  }
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    pageFamily: 'non-typical-page',
    mode: 'rules-only',
    inputMode: 'page-prompt',
    dest: '',
    title: '',
    nonTypicalConversationOutputJson: '',
    confirmedGenerationInputJson: '',
    confirmedDesignRestoreInputJson: '',
    force: false,
    dryRun: false,
    json: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--target') {
      options.target = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--page-family') {
      options.pageFamily = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--mode') {
      options.mode = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--input-mode') {
      options.inputMode = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--dest') {
      options.dest = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--title') {
      options.title = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--non-typical-conversation-output-json') {
      options.nonTypicalConversationOutputJson = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--confirmed-generation-input-json') {
      options.confirmedGenerationInputJson = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--confirmed-design-restore-input-json') {
      options.confirmedDesignRestoreInputJson = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--force') {
      options.force = true
      continue
    }
    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node .local-context/hiui-design/scripts/generate-non-typical-page-from-brief.mjs --dest <dir> --title <title> --non-typical-conversation-output-json <json> [--target <root>] [--page-family non-typical-page] [--mode rules-only|host-integration] [--input-mode page-prompt|prototype-screenshot|figma-design-restore] [--confirmed-generation-input-json <json>] [--confirmed-design-restore-input-json <json>] [--force] [--dry-run] [--json]`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  parseJsonArg(
    options.nonTypicalConversationOutputJson,
    '--non-typical-conversation-output-json'
  )
  parseJsonArg(
    options.confirmedGenerationInputJson,
    '--confirmed-generation-input-json'
  )
  parseJsonArg(
    options.confirmedDesignRestoreInputJson,
    '--confirmed-design-restore-input-json'
  )
  const delegatedScriptPath = path.join(skillRoot, 'scripts', 'generate-page-from-brief.mjs')
  const delegatedArgs = [
    delegatedScriptPath,
    '--target',
    options.target,
    '--page-family',
    options.pageFamily,
    '--mode',
    options.mode,
    '--input-mode',
    options.inputMode,
    '--dest',
    options.dest,
    '--title',
    options.title,
    '--non-typical-conversation-output-json',
    options.nonTypicalConversationOutputJson,
  ]

  if (options.confirmedGenerationInputJson) {
    delegatedArgs.push(
      '--confirmed-generation-input-json',
      options.confirmedGenerationInputJson
    )
  }
  if (options.confirmedDesignRestoreInputJson) {
    delegatedArgs.push(
      '--confirmed-design-restore-input-json',
      options.confirmedDesignRestoreInputJson
    )
  }
  if (options.force) delegatedArgs.push('--force')
  if (options.dryRun) delegatedArgs.push('--dry-run')
  delegatedArgs.push('--json')

  const { result: delegated } = await runProjectNodeScriptSync({
    targetRoot: options.target,
    scriptPath: delegatedArgs[0],
    scriptArgs: delegatedArgs.slice(1),
    cwd: skillRoot,
    capture: true,
    maxBuffer: 16 * 1024 * 1024,
  })

  if (delegated.error) {
    throw delegated.error
  }

  if ((delegated.status ?? 1) !== 0) {
    const blockedPayload = delegated.stdout?.trim() || ''
    if (options.json && blockedPayload.startsWith('{')) {
      process.stdout.write(`${blockedPayload}\n`)
      process.exitCode = 1
      return
    }

    throw new Error(delegated.stderr?.trim() || blockedPayload || 'generate-page-from-brief failed')
  }

  const delegatedPayload = JSON.parse(delegated.stdout)

  const payload = {
    status: delegatedPayload.status,
    dryRun: delegatedPayload.dryRun,
    files: delegatedPayload.files,
    sanity: delegatedPayload.sanity,
    inputMode: delegatedPayload.inputMode || null,
    confirmedDesignRestoreInput: delegatedPayload.confirmedDesignRestoreInput || null,
    coordinationPatternId: delegatedPayload.coordinationPatternId,
    targetBusinessPath: delegatedPayload.targetBusinessPath,
    pageFamily: delegatedPayload.nonTypicalExecutionBrief?.pageFamily || '',
    workflowId: delegatedPayload.nonTypicalExecutionBrief?.workflowId || '',
    readiness: delegatedPayload.nonTypicalExecutionBrief?.readiness || null,
    designMappingPlan: delegatedPayload.nonTypicalExecutionBrief?.designMappingPlan || null,
  }

  if (options.json) {
    console.log(JSON.stringify(payload, null, 2))
    return
  }

  console.log(`# Non-Typical Page Generation`)
  console.log(``)
  console.log(`- status: ${payload.status}`)
  console.log(`- pageFamily: ${payload.pageFamily}`)
  console.log(`- workflowId: ${payload.workflowId}`)
  console.log(`- coordinationPatternId: ${payload.coordinationPatternId}`)
  console.log(`- targetBusinessPath: ${payload.targetBusinessPath}`)
  console.log(`- readiness.generatorReady: ${payload.readiness?.generatorReady === true ? 'true' : 'false'}`)
  console.log(``)
  console.log(`## Files`)
  for (const file of payload.files) {
    console.log(`- ${path.relative(options.target, file.destPath)}`)
  }
}

main().catch((error) => {
  console.error(error.message || String(error))
  process.exit(1)
})
