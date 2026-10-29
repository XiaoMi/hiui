#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadGenerationBrief } from './lib/load-generation-brief.mjs'
import { collectNonTypicalPageSanityViolations } from './lib/non-typical-page-sanity.mjs'

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

function normalizeNonTypicalTargetBusinessPath(value) {
  const normalized = String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
  if (!normalized) return ''

  return /\.[cm]?[jt]sx?$/i.test(path.posix.basename(normalized))
    ? String(path.posix.dirname(normalized)).replace(/^\.\/?$/, '')
    : normalized
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    pageFamily: 'non-typical-page',
    mode: 'rules-only',
    inputMode: 'page-prompt',
    dest: '',
    title: '',
    routePath: '',
    nonTypicalConversationOutputJson: '',
    confirmedGenerationInputJson: '',
    confirmedDesignRestoreInputJson: '',
    navigationMountContract: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--target') {
      options.target = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--page-family') {
      options.pageFamily = readRequiredArg(argv, index, arg)
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
    if (arg === '--non-typical-conversation-output-json') {
      options.nonTypicalConversationOutputJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--confirmed-generation-input-json') {
      options.confirmedGenerationInputJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--confirmed-design-restore-input-json') {
      options.confirmedDesignRestoreInputJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--navigation-mount-contract') {
      options.navigationMountContract = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node .local-context/hiui-design/scripts/non-typical-page-sanity.mjs --dest <dir> --title <title> --non-typical-conversation-output-json <json> [--target <root>] [--page-family non-typical-page] [--mode rules-only|host-integration] [--input-mode page-prompt|prototype-screenshot|figma-design-restore] [--route-path <path>] [--confirmed-generation-input-json <json>] [--confirmed-design-restore-input-json <json>] [--navigation-mount-contract <json-or-path>] [--json]'
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function readFileIfExists(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch {
    return ''
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const targetRoot = path.resolve(options.target)
  const nonTypicalConversationOutput = parseJsonArg(
    options.nonTypicalConversationOutputJson,
    '--non-typical-conversation-output-json'
  )
  const confirmedGenerationInput = parseJsonArg(
    options.confirmedGenerationInputJson,
    '--confirmed-generation-input-json'
  )
  const confirmedDesignRestoreInput = parseJsonArg(
    options.confirmedDesignRestoreInputJson,
    '--confirmed-design-restore-input-json'
  )

  const brief = await loadGenerationBrief({
    targetRoot,
    skillRoot,
    pageFamilyId: options.pageFamily,
    mode: options.mode,
    inputMode: options.inputMode,
    dest: options.dest,
    title: options.title,
    routePath: options.routePath,
    nonTypicalConversationOutput,
    confirmedGenerationInput,
    confirmedDesignRestoreInput,
    navigationMountContract: options.navigationMountContract,
  })

  if (!brief.nonTypicalExecutionBrief) {
    throw new Error('non-typical-page-sanity requires a resolved nonTypicalExecutionBrief')
  }

  const targetBusinessPath =
    normalizeNonTypicalTargetBusinessPath(
      brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
    )
  const pagePath = path.join(targetRoot, targetBusinessPath, 'index.tsx')
  const stylePath = path.join(targetRoot, targetBusinessPath, 'index.module.scss')
  const metaPath = path.join(targetRoot, targetBusinessPath, 'hiui-pagegen.meta.json')
  const runtimePrimitivePath = path.join(targetRoot, 'src', 'runtime', 'non-typical-primitives', 'index.tsx')
  const runtimePrimitiveStylePath = path.join(
    targetRoot,
    'src',
    'runtime',
    'non-typical-primitives',
    'index.module.scss'
  )
  const pageOwnedSupportPath = path.join(
    targetRoot,
    targetBusinessPath,
    'page-owned-mount-support',
    'index.tsx'
  )
  const pageOwnedSupportStylePath = path.join(
    targetRoot,
    targetBusinessPath,
    'page-owned-mount-support',
    'index.module.scss'
  )
  const plannedFiles = [
    { destPath: pagePath, content: await readFileIfExists(pagePath) },
    { destPath: stylePath, content: await readFileIfExists(stylePath) },
    { destPath: metaPath, content: await readFileIfExists(metaPath) },
    { destPath: runtimePrimitivePath, content: await readFileIfExists(runtimePrimitivePath) },
    { destPath: runtimePrimitiveStylePath, content: await readFileIfExists(runtimePrimitiveStylePath) },
    { destPath: pageOwnedSupportPath, content: await readFileIfExists(pageOwnedSupportPath) },
    { destPath: pageOwnedSupportStylePath, content: await readFileIfExists(pageOwnedSupportStylePath) },
  ].filter((file) => file.content)

  const violations = collectNonTypicalPageSanityViolations({
    plannedFiles,
    brief,
  })

  const result = {
    schema: 'hiui-design-non-typical-page-sanity-report.v1',
    status: violations.length === 0 ? 'pass' : 'blocked',
    targetRoot,
    pageFamily: brief.pageSelector?.id || brief.pageType?.pageFamily || '',
    targetBusinessPath,
    coordinationPatternId:
      brief.nonTypicalExecutionBrief.coordinationPattern?.coordinationPatternId ||
      brief.nonTypicalExecutionBrief.coordinationBindings?.coordinationPatternId ||
      '',
    filesChecked: plannedFiles.map((file) => path.relative(targetRoot, file.destPath)),
    violations,
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
    return
  }

  console.log(`# Non-Typical Page Sanity`)
  console.log('')
  console.log(`- status: ${result.status}`)
  console.log(`- pageFamily: ${result.pageFamily}`)
  console.log(`- targetBusinessPath: ${result.targetBusinessPath}`)
  console.log(`- coordinationPatternId: ${result.coordinationPatternId}`)

  if (result.filesChecked.length > 0) {
    console.log('')
    console.log('## Files Checked')
    for (const file of result.filesChecked) {
      console.log(`- ${file}`)
    }
  }

  if (result.violations.length > 0) {
    console.log('')
    console.log('## Violations')
    for (const violation of result.violations) {
      console.log(`- ${violation}`)
    }
  }
}

main().catch((error) => {
  console.error(error.message || String(error))
  process.exit(1)
})
