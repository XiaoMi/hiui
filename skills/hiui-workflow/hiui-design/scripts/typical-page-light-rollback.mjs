#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { readLightPagePlan } from './lib/light-page-plan.mjs'
import { assertWithinWriteScope } from './lib/write-scope-gate.mjs'

const PAGE_CONTRACTS_RELATIVE_DIR = '.local-context/hiui-design/outputs/page-contracts'
const LEGACY_ACCEPTANCE_RELATIVE_DIR = '.local-context/hiui-design/outputs/legacy-acceptance'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-light-rollback.mjs" --plan <light-plan.json> [--target <project-root>] [--apply] [--json]

Default is dry-run. Pass --apply to delete files after writeScope verification.
`)
}

function parseArgs(argv) {
  const options = { target: process.cwd(), plan: '', apply: false, json: false }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--apply') {
      options.apply = true
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
    if (arg === '--target' || arg === '--plan') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--plan') options.plan = value
      index += 1
      continue
    }
    throw new Error(`Unknown argument: ${arg}`)
  }
  if (!options.plan) throw new Error('Missing required --plan')
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

function pageInstancePath(targetRoot, pagePath) {
  const absolutePage = path.resolve(targetRoot, pagePath)
  return /\.[cm]?[jt]sx?$/u.test(pagePath) ? absolutePage : path.join(absolutePage, 'page.instance.tsx')
}

function reportSlugForPage(pagePath) {
  return toPosixPath(pagePath).replace(/\.[cm]?[jt]sx?$/u, '').replace(/[^a-zA-Z0-9_-]+/g, '__') || 'legacy-page'
}

async function findContractPaths(targetRoot, generatedPagePath) {
  const contractsDir = path.join(targetRoot, PAGE_CONTRACTS_RELATIVE_DIR)
  const entries = (await fs.readdir(contractsDir).catch(() => [])).filter((entry) => entry.endsWith('.json')).sort()
  const paths = []
  for (const entry of entries) {
    const contractPath = path.join(contractsDir, entry)
    const contract = await readJsonIfExists(contractPath).catch(() => null)
    if (toPosixPath(contract?.generatedPagePath) === toPosixPath(generatedPagePath)) {
      paths.push(contractPath)
      paths.push(contractPath.replace(/\.json$/u, '.md'))
    }
  }
  return paths
}

async function findAcceptancePaths(targetRoot, pagePath) {
  const acceptanceDir = path.join(targetRoot, LEGACY_ACCEPTANCE_RELATIVE_DIR)
  const slug = reportSlugForPage(pagePath)
  const entries = await fs.readdir(acceptanceDir).catch(() => [])
  return entries.filter((entry) => entry.startsWith(slug)).map((entry) => path.join(acceptanceDir, entry))
}

async function collectRollbackCandidates({ targetRoot, plan }) {
  const instancePath = pageInstancePath(targetRoot, plan.pagePath)
  const pageDir = path.dirname(instancePath)
  const generatedPagePath = toPosixPath(path.relative(targetRoot, instancePath))
  const candidates = [
    instancePath,
    path.join(pageDir, 'page.slots.ts'),
    path.join(pageDir, 'page.request.ts'),
    path.join(pageDir, 'index.tsx'),
    ...(await findContractPaths(targetRoot, generatedPagePath)),
    ...(await findAcceptancePaths(targetRoot, plan.pagePath)),
  ]
  return [...new Set(candidates)].sort()
}

async function removeFileIfExists(filePath) {
  if (!(await pathExists(filePath))) return 'missing'
  const stats = await fs.lstat(filePath)
  if (!stats.isFile()) return 'skipped-not-file'
  await fs.unlink(filePath)
  return 'deleted'
}

async function runRollback(options) {
  const targetRoot = path.resolve(options.target)
  const planResult = await readLightPagePlan(options.plan, { targetRoot })
  if (!planResult.ok) {
    throw new Error(planResult.issues.map((item) => item.message).join('; '))
  }
  const candidates = await collectRollbackCandidates({ targetRoot, plan: planResult.plan })
  for (const candidatePath of candidates) {
    await assertWithinWriteScope({ targetRoot, candidatePath, writeScope: planResult.plan.writeScope })
  }
  const files = []
  for (const candidate of candidates) {
    const relativePath = toPosixPath(path.relative(targetRoot, candidate))
    const exists = await pathExists(candidate)
    const status = options.apply ? await removeFileIfExists(candidate) : exists ? 'would-delete' : 'missing'
    files.push({ path: relativePath, status })
  }
  return {
    schemaVersion: 'hiui-light-rollback-result.v1',
    status: options.apply ? 'applied' : 'dry-run',
    applied: options.apply,
    plan: planResult.relativePath,
    files,
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const result = await runRollback(options)
  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log('[hiui-design][typical-page:light-rollback]')
    console.log(`- status: ${result.status}`)
    for (const file of result.files) console.log(`- ${file.status}: ${file.path}`)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[typical-page:light-rollback] ${message}`)
    process.exit(1)
  })
}
