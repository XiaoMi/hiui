#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  computeManagedPageSourceSnapshot,
  syncManagedPageRegistry,
  writeManagedPageContractArtifacts,
} from './lib/managed-page-artifacts.mjs'
import { evaluateManagedInstanceReadinessFromSource } from './lib/managed-page-instance-readiness.mjs'
import { getManagedPageSourceCommentLines } from './lib/managed-page-source-guard.mjs'
import {
  buildManagedPageWorkflowMetadata,
  findManagedPageContractEntry as selectManagedPageContractEntry,
  getRulesOnlyPageContractsDir,
  loadRulesOnlyPageContracts,
  normalizeContractPath,
  reconcileManagedPageRuntimeSmokeWorkflow,
  removeDuplicateManagedPageContractArtifacts,
  toManagedPageContractSlugForPage,
} from './lib/rules-only-page-contracts.mjs'

const scriptRoot = path.dirname(fileURLToPath(import.meta.url))
const skillRoot = path.resolve(scriptRoot, '..')
const writeContractScript = path.join(scriptRoot, 'write-rules-only-page-contract.mjs')

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/resolve-managed-page-instance.mjs" --page <relative-page-path> [--page-type <page-type-id>] [--mode <rules-only|legacy-host-compatible|host-integration>] [--target <project-root>] [--line <line-id>] [--json]

Notes:
  - This command is a ResolveBlockingFacts recovery action for existing pages that still lack the minimum managed-instance facts required by plan-page-task.
  - It may register a missing page contract and inject missing hiui-design source markers, then resets stale/failed workflow facts back to a re-plannable baseline.
  - It does not declare delivery complete and does not replace ValidateInstance / WriteContract / Preflight in the main lifecycle.
`)
}

function parseArgs(argv) {
  const options = {
    json: false,
    line: '',
    mode: '',
    page: '',
    pageTypeId: '',
    target: process.cwd(),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--page' || arg === '--page-type' || arg === '--mode' || arg === '--target' || arg === '--line') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--page') options.page = value
      if (arg === '--page-type') options.pageTypeId = value
      if (arg === '--mode') options.mode = value
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--line') options.line = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.page) {
    throw new Error('Missing --page')
  }

  return options
}

function inferSourcePageTypeId(sourceRaw) {
  return (
    sourceRaw.match(/data-hiui5-page-type=["']([^"']+)["']/)?.[1] ||
    sourceRaw.match(/hiui-design page-type:\s*([^\s*]+)/)?.[1] ||
    ''
  )
}

async function readProjectMode(targetRoot) {
  const factPath = path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'project-mode.json')
  try {
    const fact = JSON.parse(await fs.readFile(factPath, 'utf8'))
    return String(fact?.mode || '').trim()
  } catch {
    return ''
  }
}

async function findManagedContractEntry(targetRoot, normalizedPagePath) {
  try {
    const contractsResult = await loadRulesOnlyPageContracts(targetRoot)
    return selectManagedPageContractEntry(contractsResult.contracts, normalizedPagePath)
  } catch {
    return null
  }
}

function toContractFact(contract) {
  if (!contract || typeof contract !== 'object') {
    return null
  }

  return {
    pageTypeId: String(contract.pageTypeId || '').trim(),
    workflowStatus: String(contract?.workflow?.status || '').trim(),
    preflightStatus: String(contract?.workflow?.preflightStatus || '').trim(),
  }
}

function contractNeedsBaselineRefresh(contract) {
  if (!contract || typeof contract !== 'object') {
    return true
  }

  if (!String(contract.pageTypeId || '').trim()) {
    return true
  }

  if (!Array.isArray(contract.regionMapping) || contract.regionMapping.length === 0) {
    return true
  }

  if (!Array.isArray(contract.ownershipMapping)) {
    return true
  }

  if (!contract.generationProfile || typeof contract.generationProfile !== 'object') {
    return true
  }

  if (!contract.productionContract || typeof contract.productionContract !== 'object') {
    return true
  }

  return false
}

function prependMissingCommentLines(sourceRaw, missingCommentLines) {
  if (!Array.isArray(missingCommentLines) || missingCommentLines.length === 0) {
    return sourceRaw
  }

  const source = String(sourceRaw || '')
  const bom = source.startsWith('\uFEFF') ? '\uFEFF' : ''
  let body = bom ? source.slice(1) : source
  let preservedPrefix = bom

  if (body.startsWith('#!')) {
    const newlineIndex = body.indexOf('\n')
    if (newlineIndex === -1) {
      preservedPrefix += body
      body = ''
    } else {
      preservedPrefix += body.slice(0, newlineIndex + 1)
      body = body.slice(newlineIndex + 1)
    }
  }

  const commentBlock = missingCommentLines.map((line) => `/* ${line} */`).join('\n')
  const separator = body && !body.startsWith('\n') ? '\n' : ''
  return `${preservedPrefix}${commentBlock}${separator}${body}`
}

function normalizeWorkflowForRecovery(workflow, contract, sourceSnapshotHash) {
  const previous = workflow && typeof workflow === 'object' ? workflow : {}
  const normalized = buildManagedPageWorkflowMetadata({
    ...previous,
    status: 'contract-written',
    deliveryStatus: String(previous.deliveryStatus || '').trim() || 'not-finalized',
    preflightStatus: 'not-run',
    preflightStage: '',
    readyForImplementation: false,
    readyForDelivery: false,
    deferredChecks: [],
    lastCommand: 'resolve-managed-page-instance',
    sourceSnapshotHash,
  })
  const runtimeSmokeWorkflow = reconcileManagedPageRuntimeSmokeWorkflow(
    contract,
    previous,
    sourceSnapshotHash
  )

  return {
    ...normalized,
    ...runtimeSmokeWorkflow,
    sourceSnapshotHash,
    lastCommand: 'resolve-managed-page-instance',
  }
}

function printHumanReadableReport(report) {
  console.log(`Managed page instance recovery: ${report.status}`)
  console.log(`- page: ${report.page}`)
  console.log(`- page type: ${report.pageTypeId || '(unknown)'}`)
  console.log(`- mode: ${report.mode || '(unknown)'}`)
  console.log(`- blocker codes before: ${report.blockerCodesBefore.join(', ') || '(none)'}`)
  console.log(`- blocker codes after: ${report.blockerCodesAfter.join(', ') || '(none)'}`)
  console.log(`- actions performed: ${report.actionsPerformed.join(', ') || '(none)'}`)
  console.log(`- source markers added: ${report.sourceMarkersAdded.join(', ') || '(none)'}`)
  console.log(`- source snapshot hash: ${report.sourceSnapshotHash || '(none)'}`)
  console.log(`- contract json: ${report.contract.jsonPath || '(none)'}`)
  console.log(`- contract markdown: ${report.contract.markdownPath || '(none)'}`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const targetRoot = path.resolve(options.target)
  const normalizedPagePath = normalizeContractPath(targetRoot, options.page)
  const absolutePagePath = path.join(targetRoot, normalizedPagePath)
  const pageExists = await fs
    .access(absolutePagePath)
    .then(() => true)
    .catch(() => false)

  if (!pageExists) {
    throw new Error(`Managed page instance recovery requires an existing page source: ${normalizedPagePath}`)
  }

  let sourceRaw = await fs.readFile(absolutePagePath, 'utf8')
  let contractEntry = await findManagedContractEntry(targetRoot, normalizedPagePath)
  const contractBefore = contractEntry?.contract || null
  const readinessBefore = evaluateManagedInstanceReadinessFromSource({
    contract: toContractFact(contractBefore),
    pageExists: true,
    sourceRaw,
  })
  const inferredMode =
    String(options.mode || '').trim() ||
    String(contractBefore?.archetypeMode || '').trim() ||
    await readProjectMode(targetRoot) ||
    'rules-only'
  const pageTypeId =
    String(options.pageTypeId || '').trim() ||
    String(contractBefore?.pageTypeId || '').trim() ||
    inferSourcePageTypeId(sourceRaw)

  if (!pageTypeId) {
    throw new Error(
      `Unable to infer page type for ${normalizedPagePath}. Pass --page-type explicitly or restore the source page-type marker first.`
    )
  }

  const actionsPerformed = []
  let contractCreated = false

  if (!contractEntry || contractNeedsBaselineRefresh(contractEntry.contract)) {
    const canonicalContractId = toManagedPageContractSlugForPage(normalizedPagePath) || pageTypeId
    const args = [
      writeContractScript,
      '--target',
      targetRoot,
      '--page-type',
      pageTypeId,
      '--page',
      normalizedPagePath,
      '--mode',
      inferredMode,
      '--preset',
      'standard',
      '--id',
      canonicalContractId,
    ]
    if (options.line) {
      args.push('--line', options.line)
    }

    const result = spawnSync(process.execPath, args, {
      cwd: targetRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        HIUI_DESIGN_ALLOW_LEGACY_PAGEGEN: '1',
        HIUI_DESIGN_SUPPRESS_DEPRECATION_WARNING: '1',
      },
    })
    if (result.status !== 0) {
      throw new Error(result.stderr || result.stdout || 'write-rules-only-page-contract failed')
    }

    contractEntry = await findManagedContractEntry(targetRoot, normalizedPagePath)
    if (!contractEntry) {
      throw new Error(
        `Managed page contract registration did not produce a contract for ${normalizedPagePath} under ${normalizeContractPath(
          targetRoot,
          getRulesOnlyPageContractsDir(targetRoot)
        )}`
      )
    }

    contractCreated = !contractBefore
    actionsPerformed.push(contractCreated ? 'write-managed-page-contract' : 'refresh-managed-page-contract-baseline')
  }

  const contract = contractEntry.contract
  const sourceCommentLines = getManagedPageSourceCommentLines(contract)
  const missingCommentLines = sourceCommentLines.filter((line) => !sourceRaw.includes(line))
  if (missingCommentLines.length > 0) {
    const updatedSource = prependMissingCommentLines(sourceRaw, missingCommentLines)
    if (updatedSource !== sourceRaw) {
      await fs.writeFile(absolutePagePath, updatedSource, 'utf8')
      sourceRaw = updatedSource
      actionsPerformed.push('inject-managed-source-markers')
    }
  }

  const sourceSnapshot = computeManagedPageSourceSnapshot({
    generatedPagePath: normalizedPagePath,
    targetRoot,
  })
  const recoveredContract = {
    ...contract,
    workflow: normalizeWorkflowForRecovery(contract.workflow, contract, sourceSnapshot.hash),
  }
  const contractJsonPath = contractEntry.filePath
  const contractMarkdownPath = contractJsonPath.replace(/\.json$/u, '.md')
  const writeResult = await writeManagedPageContractArtifacts({
    contract: recoveredContract,
    contractJsonPath,
    contractMarkdownPath,
  })

  if (writeResult.changed) {
    actionsPerformed.push(contractCreated ? 'refresh-managed-page-artifacts' : 'update-managed-page-artifacts')
  }

  const removedArtifacts = await removeDuplicateManagedPageContractArtifacts(
    targetRoot,
    normalizedPagePath,
    contractEntry.filePath
  )
  if (removedArtifacts.length > 0) {
    actionsPerformed.push('remove-duplicate-managed-contract-artifacts')
  }

  await syncManagedPageRegistry(targetRoot)

  const readinessAfter = evaluateManagedInstanceReadinessFromSource({
    contract: toContractFact(recoveredContract),
    pageExists: true,
    sourceRaw,
  })
  const report = {
    schemaVersion: 'managed-page-instance-recovery-report.v1',
    status: readinessAfter.status === 'ready' ? 'resolved' : 'blocked',
    page: normalizedPagePath,
    pageTypeId,
    mode: inferredMode,
    blockerCodesBefore: Array.isArray(readinessBefore.blockerCodes) ? readinessBefore.blockerCodes : [],
    blockerCodesAfter: Array.isArray(readinessAfter.blockerCodes) ? readinessAfter.blockerCodes : [],
    actionsPerformed,
    sourceMarkersAdded: missingCommentLines,
    sourceSnapshotHash: sourceSnapshot.hash,
    contract: {
      jsonPath: normalizeContractPath(targetRoot, contractJsonPath),
      markdownPath: normalizeContractPath(targetRoot, contractMarkdownPath),
      existed: Boolean(contractBefore),
      created: contractCreated,
    },
    removedArtifacts,
  }

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    printHumanReadableReport(report)
  }

  if (report.status !== 'resolved') {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
