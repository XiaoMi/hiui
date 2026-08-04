#!/usr/bin/env node

import path from 'node:path'
import { readLightPagePlan } from './lib/light-page-plan.mjs'
import { runLightSlotGate } from './lib/light-slot-gate.mjs'
import {
  getChangedFiles,
  isPageSourceFile,
  loadContracts,
  parseDiffArgs,
  readFileSafe,
  scoreCandidate,
  toPosixPath,
  usesTypicalPageShellPackage,
  CONTRACT_MARKER,
  CANDIDATE_IGNORE_MARKER,
  TYPICAL_PAGE_SHELL_PACKAGE,
} from './lib/detection/typical-page-candidates.mjs'
import { validateManagedPageSlotBoundary } from './lib/managed-page-source-guard.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-slot-gate.mjs" [--file <page>] [--files <a,b>] [--base <sha> --head <sha>]
  node ".local-context/hiui-design/scripts/typical-page-slot-gate.mjs" --plan <light-plan.json> [--target <project-root>] [--json]

Checks that changed managed pages stay within business-slot boundaries.
It is intentionally lighter than source-gate: it requires a page contract and blocks locked-shell/provenance bypasses,
but does not require finalized source snapshots.`)
}

function parseArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    printUsage()
    process.exit(0)
  }
  if (argv.includes('--plan')) {
    const options = { mode: 'plan', plan: '', target: process.cwd(), json: false }
    for (let index = 0; index < argv.length; index += 1) {
      const arg = argv[index]
      if (arg === '--json') {
        options.json = true
        continue
      }
      if (arg === '--plan' || arg === '--target') {
        const value = argv[index + 1]
        if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
        if (arg === '--plan') options.plan = value
        if (arg === '--target') options.target = path.resolve(value)
        index += 1
        continue
      }
      throw new Error(`Unknown argument for --plan mode: ${arg}`)
    }
    if (!options.plan) throw new Error('Missing required --plan')
    return options
  }
  return parseDiffArgs(argv)
}

function resolvePageDir(pagePath) {
  const normalized = String(pagePath || '').trim().replace(/\\/g, '/')
  if (/\.[cm]?[jt]sx?$/u.test(normalized)) return path.posix.dirname(normalized)
  return normalized.replace(/\/$/u, '')
}

async function runPlanSlotGate(options) {
  const planResult = await readLightPagePlan(options.plan, { targetRoot: options.target })
  if (!planResult.ok) {
    return {
      status: 'failed',
      issues: planResult.issues,
      planPath: planResult.relativePath || options.plan,
    }
  }
  const pageDir = resolvePageDir(planResult.plan.pagePath)
  const slotsPath = path.join(options.target, pageDir, 'page.slots.ts')
  const instancePath = path.join(options.target, pageDir, 'page.instance.tsx')
  const result = await runLightSlotGate({
    slotsPath,
    instancePath,
    plan: planResult.plan,
  })
  return {
    status: result.status,
    ok: result.ok,
    issues: result.issues,
    facts: result.facts,
    planPath: planResult.relativePath,
    pagePath: planResult.plan.pagePath,
  }
}

function isManagedCandidate({ filePath, fileContent, contractEntry }) {
  if (!isPageSourceFile(filePath)) return false
  if (fileContent.includes(CANDIDATE_IGNORE_MARKER)) return false
  if (contractEntry) return true
  if (fileContent.includes(CONTRACT_MARKER)) return true
  if (usesTypicalPageShellPackage(fileContent)) return true
  return scoreCandidate(filePath, fileContent).isCandidate
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.mode === 'plan') {
    const result = await runPlanSlotGate(options)
    if (options.json) {
      console.log(JSON.stringify(result, null, 2))
    } else if (result.ok) {
      console.log(`[typical-page-slot-gate] ${result.status}: ${result.pagePath}`)
    } else {
      console.error('[typical-page-slot-gate] Light slot gate failed.')
      result.issues.forEach((failure) => console.error(`  - ${failure.path || 'slots'}: ${failure.message}`))
    }
    if (!result.ok) process.exit(1)
    return
  }
  const changedFiles = getChangedFiles(options).map((filePath) => toPosixPath(filePath))
  const contracts = loadContracts()
  const failures = []
  const checkedPages = []

  for (const filePath of changedFiles.filter(isPageSourceFile)) {
    const fileContent = readFileSafe(filePath)
    const contractEntry = contracts.get(filePath)

    if (!isManagedCandidate({ filePath, fileContent, contractEntry })) {
      continue
    }

    if (!contractEntry) {
      if (fileContent.includes(CONTRACT_MARKER)) {
        failures.push(
          `${filePath} declares "${CONTRACT_MARKER}" but no page contract exists. Slot-gate can only approve edits that are bound to a managed page contract.`
        )
      } else if (usesTypicalPageShellPackage(fileContent)) {
        failures.push(
          `${filePath} imports "${TYPICAL_PAGE_SHELL_PACKAGE}" but is not registered as a managed page. Add a contract before treating this as a slot-only edit.`
        )
      } else {
        failures.push(
          `${filePath} looks like a typical-page candidate but is not registered. Run plan/start-page/write-contract before slot-only edits.`
        )
      }
      continue
    }

    const errors = validateManagedPageSlotBoundary({
      contract: contractEntry.contract,
      sourceRaw: fileContent,
      pathLabel: filePath,
    })

    if (errors.length > 0) {
      failures.push(...errors)
    } else {
      checkedPages.push(filePath)
    }
  }

  if (failures.length > 0) {
    console.error('[typical-page-slot-gate] Slot boundary enforcement failed.')
    failures.forEach((failure) => console.error(`  - ${failure}`))
    process.exit(1)
  }

  if (checkedPages.length === 0) {
    console.log('[typical-page-slot-gate] No managed slot-only page changes detected.')
    return
  }

  console.log(
    `[typical-page-slot-gate] Checked ${checkedPages.length} managed page(s): ${checkedPages
      .map((filePath) => path.relative(process.cwd(), path.join(process.cwd(), filePath)) || filePath)
      .join(', ')}`
  )
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[typical-page-slot-gate] ${message}`)
  process.exit(1)
})
