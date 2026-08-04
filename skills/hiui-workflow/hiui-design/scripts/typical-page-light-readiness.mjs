#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { readLightPagePlan } from './lib/light-page-plan.mjs'
import { validateWriteScopePatterns } from './lib/write-scope-gate.mjs'
import { runLightSlotGate } from './lib/light-slot-gate.mjs'
import { runAdapterGate } from './lib/adapter-gate.mjs'
import { isLegacyAcceptanceReadyStatus } from './lib/legacy-acceptance-status.mjs'
import { RUNTIME_SEAL_RELATIVE_PATH, summarizeRuntimeSealHash } from './lib/legacy-runtime-provenance.mjs'

const ACCEPTANCE_DIR = '.local-context/hiui-design/outputs/legacy-acceptance'
const PAGE_CONTRACT_DIR = '.local-context/hiui-design/outputs/page-contracts'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-light-readiness.mjs" --plan <light-plan.json> [--target <project-root>] [--profile <preview|delivery>] [--acceptance-report <json>] [--json]

Summarizes light plan, writeScope, slot, adapter, and acceptance readiness.
`)
}

function parseArgs(argv) {
  const options = { target: process.cwd(), plan: '', profile: 'preview', acceptanceReport: '', json: false }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }
    if (arg === '--target' || arg === '--plan' || arg === '--profile' || arg === '--acceptance-report') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--plan') options.plan = value
      if (arg === '--profile') options.profile = value
      if (arg === '--acceptance-report') options.acceptanceReport = value
      index += 1
      continue
    }
    throw new Error(`Unknown argument: ${arg}`)
  }
  if (!options.plan) throw new Error('Missing required --plan')
  if (!['preview', 'delivery'].includes(options.profile)) throw new Error('Expected --profile to be preview or delivery')
  return options
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(filePath) {
  if (!(await pathExists(filePath))) return null
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

function toPosixPath(value) {
  return String(value || '').replace(/\\/g, '/')
}

function pagePaths(targetRoot, pagePath) {
  const absolutePage = path.resolve(targetRoot, pagePath)
  const instancePath = /\.[cm]?[jt]sx?$/u.test(pagePath) ? absolutePage : path.join(absolutePage, 'page.instance.tsx')
  return {
    instancePath,
    slotsPath: path.join(path.dirname(instancePath), 'page.slots.ts'),
  }
}

function reportSlugForPage(pagePath) {
  return toPosixPath(pagePath).replace(/\.[cm]?[jt]sx?$/u, '').replace(/[^a-zA-Z0-9_-]+/g, '__') || 'legacy-page'
}

function toContractSlug(value) {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/[^a-zA-Z0-9/_-]+/g, '-')
    .replace(/\//g, '__')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
}

function pageContractPath(targetRoot, pagePath) {
  const paths = pagePaths(targetRoot, pagePath)
  const generatedPagePath = toPosixPath(path.relative(targetRoot, paths.instancePath))
  const slug = toContractSlug(generatedPagePath.replace(/\.[cm]?[jt]sx?$/u, '')) || 'legacy-page'
  return {
    absolutePath: path.join(targetRoot, PAGE_CONTRACT_DIR, `${slug}.json`),
    relativePath: toPosixPath(path.join(PAGE_CONTRACT_DIR, `${slug}.json`)),
  }
}

async function findAcceptanceReport(targetRoot, pagePath, explicitPath) {
  if (explicitPath) {
    const resolvedPath = path.isAbsolute(explicitPath) ? explicitPath : path.join(targetRoot, explicitPath)
    return { path: explicitPath, report: await readJsonIfExists(resolvedPath) }
  }
  const acceptanceDir = path.join(targetRoot, ACCEPTANCE_DIR)
  const slug = reportSlugForPage(pagePath)
  const entries = (await fs.readdir(acceptanceDir).catch(() => [])).filter((entry) => entry.startsWith(slug) && entry.endsWith('.json')).sort()
  const latest = entries.at(-1)
  if (!latest) return { path: '', report: null }
  return { path: toPosixPath(path.join(ACCEPTANCE_DIR, latest)), report: await readJsonIfExists(path.join(acceptanceDir, latest)) }
}

async function runRuntimeSealReadiness({ targetRoot, pagePath, profile }) {
  const contractPath = pageContractPath(targetRoot, pagePath)
  const contract = await readJsonIfExists(contractPath.absolutePath)
  const runtimeSeal = await readJsonIfExists(path.join(targetRoot, RUNTIME_SEAL_RELATIVE_PATH))
  const expectedHash = String(contract?.generationProfile?.runtimeSealHash || '').trim()
  const currentHash = summarizeRuntimeSealHash(runtimeSeal)
  const warnings = []
  const issues = []

  if (!contract) {
    issues.push('page contract is missing; run typical-page:legacy:new or typical-page:legacy:rewrite before readiness')
  }
  if (!runtimeSeal) {
    issues.push('runtime-seal-missing: .local-context/hiui-design/outputs/runtime-seal.json is missing; re-run typical-page:apply:legacy')
  }
  if (contract && !expectedHash) {
    const message = 'contract-runtime-facts-missing: page contract does not include generationProfile.runtimeSealHash; regenerate or rewrite the page contract'
    if (profile === 'delivery') issues.push(message)
    else warnings.push(message)
  }
  if (expectedHash && runtimeSeal && expectedHash !== currentHash) {
    issues.push('invalidated-runtime-drift: page contract runtimeSealHash does not match the current runtime-seal.json')
  }

  return step(issues.length === 0, {
    contractPath: contractPath.relativePath,
    runtimeSealPath: RUNTIME_SEAL_RELATIVE_PATH,
    expectedHash,
    currentHash,
    warnings,
    issues,
  })
}

function step(ok, detail = {}) {
  return { status: ok ? 'passed' : 'failed', ok, ...detail }
}

async function runReadiness(options) {
  const targetRoot = path.resolve(options.target)
  const planResult = await readLightPagePlan(options.plan, { targetRoot })
  const steps = {
    plan: step(planResult.ok, { path: planResult.relativePath, issues: planResult.issues || [] }),
  }

  if (!planResult.ok) {
    return { schemaVersion: 'hiui-light-readiness-result.v1', status: 'blocked', targetRoot, profile: options.profile, steps }
  }

  const writeScope = validateWriteScopePatterns(planResult.plan.writeScope)
  steps.writeScope = step(writeScope.ok, { issues: writeScope.issues || [], patterns: writeScope.patterns || [] })

  const paths = pagePaths(targetRoot, planResult.plan.pagePath)
  const slotGate = await runLightSlotGate({
    slotsPath: paths.slotsPath,
    instancePath: paths.instancePath,
    plan: planResult.plan,
  })
  steps.slotGate = step(slotGate.ok, { issues: slotGate.issues, warnings: slotGate.warnings })

  const adapterGate = await runAdapterGate({ targetRoot, profile: options.profile })
  steps.adapterGate = step(adapterGate.ok, { issues: adapterGate.issues, blockingIssues: adapterGate.blockingIssues })

  steps.runtimeSeal = await runRuntimeSealReadiness({
    targetRoot,
    pagePath: planResult.plan.pagePath,
    profile: options.profile,
  })

  const acceptance = await findAcceptanceReport(targetRoot, planResult.plan.pagePath, options.acceptanceReport)
  const reportStatus = String(acceptance.report?.status || '').trim()
  const acceptanceOk = options.profile === 'delivery'
    ? reportStatus === 'delivery-ready'
    : isLegacyAcceptanceReadyStatus(reportStatus)
  steps.acceptance = step(acceptanceOk, {
    path: acceptance.path,
    reportStatus,
    requiredStatus: options.profile === 'delivery' ? 'delivery-ready' : 'preview-ready|delivery-ready',
    issues: acceptanceOk ? [] : [`acceptance report is missing or not ${options.profile}-ready`],
  })

  const ok = Object.values(steps).every((item) => item.ok)
  return {
    schemaVersion: 'hiui-light-readiness-result.v1',
    status: ok ? 'ready' : 'blocked',
    targetRoot,
    profile: options.profile,
    pageType: planResult.plan.pageType,
    pagePath: planResult.plan.pagePath,
    steps,
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const result = await runReadiness(options)
  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log('[hiui-design][typical-page:light-readiness]')
    console.log(`- status: ${result.status}`)
    for (const [name, item] of Object.entries(result.steps)) console.log(`- ${name}: ${item.status}`)
  }
  if (result.status !== 'ready') process.exit(1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[typical-page:light-readiness] ${message}`)
    process.exit(1)
  })
}
