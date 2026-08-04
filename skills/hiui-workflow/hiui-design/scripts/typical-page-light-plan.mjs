#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import {
  LIGHT_PAGE_PLAN_OUTPUT_DIR,
  LIGHT_PAGE_PLAN_SCHEMA_VERSION,
  getDefaultLightPlanPath,
  normalizePlanRelativePath,
  validateLightPagePlan,
} from './lib/light-page-plan.mjs'

const PROJECT_MODE_RELATIVE_PATH = '.local-context/hiui-design/outputs/project-mode.json'
const PROJECT_INTEGRATION_STATE_RELATIVE_PATH = '.local-context/hiui-design/outputs/project-integration-state.json'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-light-plan.mjs" --page-type <id> --page <page-dir> --summary <text> [--target <project-root>] [--mode <legacy-host-compatible|rules-only|host-integration>] [--data-mode <mock|real|hybrid|unknown>] [--validation-level <preview|delivery>] [--output <path>] [--source-type <ai-generated|script-derived|manual|migration>] [--request-id <id>] [--line <line-id>] [--json]

Writes:
  - ${LIGHT_PAGE_PLAN_OUTPUT_DIR}/<page-slug>.json by default

This command creates the lightweight plan required by the legacy fast path.
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    mode: '',
    pageType: '',
    page: '',
    summary: '',
    dataMode: 'unknown',
    validationLevel: 'preview',
    output: '',
    sourceType: 'script-derived',
    requestId: '',
    line: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--') {
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
    const valueArgs = new Set([
      '--target',
      '--mode',
      '--page-type',
      '--page',
      '--summary',
      '--data-mode',
      '--validation-level',
      '--output',
      '--source-type',
      '--request-id',
      '--line',
    ])
    if (!valueArgs.has(arg)) throw new Error(`Unknown argument: ${arg}`)
    const value = argv[index + 1]
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
    if (arg === '--target') options.target = path.resolve(value)
    if (arg === '--mode') options.mode = value
    if (arg === '--page-type') options.pageType = value
    if (arg === '--page') options.page = value
    if (arg === '--summary') options.summary = value
    if (arg === '--data-mode') options.dataMode = value
    if (arg === '--validation-level') options.validationLevel = value
    if (arg === '--output') options.output = value
    if (arg === '--source-type') options.sourceType = value
    if (arg === '--request-id') options.requestId = value
    if (arg === '--line') options.line = value
    index += 1
  }

  if (!options.pageType) throw new Error('Missing required --page-type')
  if (!options.page) throw new Error('Missing required --page')
  if (!options.summary) throw new Error('Missing required --summary')
  return options
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return null
  }
}

function normalizeMode(mode) {
  const value = String(mode || '').trim()
  if (value === 'host-compatible') return 'legacy-host-compatible'
  return value
}

async function resolveProjectMode(targetRoot, explicitMode) {
  const normalizedExplicitMode = normalizeMode(explicitMode)
  if (normalizedExplicitMode) return { mode: normalizedExplicitMode, source: 'argument' }

  const projectMode = await readJsonIfExists(path.join(targetRoot, PROJECT_MODE_RELATIVE_PATH))
  const projectModeValue = normalizeMode(projectMode?.mode || projectMode?.recommendedMode)
  if (projectModeValue) return { mode: projectModeValue, source: PROJECT_MODE_RELATIVE_PATH }

  const projectIntegration = await readJsonIfExists(path.join(targetRoot, PROJECT_INTEGRATION_STATE_RELATIVE_PATH))
  const projectIntegrationMode = normalizeMode(projectIntegration?.mode || projectIntegration?.recommendedMode)
  if (projectIntegrationMode) return { mode: projectIntegrationMode, source: PROJECT_INTEGRATION_STATE_RELATIVE_PATH }

  throw new Error(`Unable to resolve project mode. Pass --mode or run project integration first.`)
}

function buildDefaultWriteScope({ mode, pagePath }) {
  const normalizedPagePath = normalizePlanRelativePath(pagePath)
  const pageDir = normalizedPagePath.replace(/\.[cm]?[jt]sx?$/u, '').replace(/\/index$/u, '')
  const scope = [
    `${pageDir}/**`,
    '.local-context/hiui-design/outputs/light-plans/**',
    '.local-context/hiui-design/outputs/page-contracts/**',
    '.local-context/hiui-design/outputs/legacy-acceptance/**',
  ]
  if (mode === 'legacy-host-compatible') {
    scope.push('src/hiui-runtime/**')
    scope.push('.local-context/hiui-design/host-contract.json')
    scope.push('.local-context/hiui-design/outputs/runtime-compatibility-lock.json')
  }
  return [...new Set(scope)]
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const targetRoot = path.resolve(options.target)
  const { manifest } = await loadPageTypeManifest({ skillRoot, line: options.line })
  const knownPageTypes = manifest.pageTypes.map((pageType) => pageType.id)
  const modeFacts = await resolveProjectMode(targetRoot, options.mode)
  const pagePath = normalizePlanRelativePath(options.page)
  const plan = {
    schemaVersion: LIGHT_PAGE_PLAN_SCHEMA_VERSION,
    mode: modeFacts.mode,
    pageType: String(options.pageType || '').trim(),
    pagePath,
    writeScope: buildDefaultWriteScope({ mode: modeFacts.mode, pagePath }),
    dataMode: String(options.dataMode || '').trim() || 'unknown',
    validationLevel: String(options.validationLevel || '').trim() || 'preview',
    createdAt: new Date().toISOString(),
    source: {
      type: String(options.sourceType || '').trim() || 'script-derived',
      summary: String(options.summary || '').trim(),
      ...(options.requestId ? { requestId: String(options.requestId).trim() } : {}),
      evidenceRefs: [modeFacts.source],
    },
  }
  const validation = validateLightPagePlan(plan, { knownPageTypes })
  if (!validation.ok) {
    const message = validation.issues.map((item) => `${item.path || 'plan'}: ${item.message}`).join('; ')
    throw new Error(message)
  }

  const outputPath = options.output
    ? path.resolve(targetRoot, options.output)
    : getDefaultLightPlanPath(targetRoot, pagePath)
  const relativeOutputPath = path.relative(targetRoot, outputPath).replace(/\\/g, '/')
  if (relativeOutputPath.startsWith('..') || path.isAbsolute(relativeOutputPath)) {
    throw new Error('Light plan output must stay inside target root.')
  }
  await writeJson(outputPath, validation.plan)

  const result = {
    schemaVersion: 'hiui-light-page-plan-result.v1',
    status: 'written',
    target: targetRoot,
    planPath: relativeOutputPath,
    mode: validation.plan.mode,
    pageType: validation.plan.pageType,
    pagePath: validation.plan.pagePath,
    validationLevel: validation.plan.validationLevel,
    dataMode: validation.plan.dataMode,
  }
  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log('[hiui-design][typical-page:light-plan]')
    console.log(`- status: ${result.status}`)
    console.log(`- plan: ${result.planPath}`)
    console.log(`- pageType: ${result.pageType}`)
    console.log(`- validationLevel: ${result.validationLevel}`)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[typical-page:light-plan] ${message}`)
    process.exit(1)
  })
}
