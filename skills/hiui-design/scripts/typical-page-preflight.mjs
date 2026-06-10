#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadArchetypeDefinition } from './lib/archetypes/load-archetype-manifest.mjs'
import {
  computeManagedPageSourceSnapshot,
  syncManagedPageRegistry,
} from './lib/managed-page-artifacts.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import { validateManagedPageSource } from './lib/managed-page-source-guard.mjs'
import {
  getManagedPageSemanticContract,
  getManagedPageRuntimeSmokeRequirement,
  getRequiredOwnershipRolesForPageType,
  getRequiredRegionsForPageType,
  loadRulesOnlyPageContracts,
  normalizeContractPath,
  reconcileManagedPageRuntimeSmokeWorkflow,
  renderRulesOnlyPageContractMarkdown,
  validateRulesOnlyPageContract,
} from './lib/rules-only-page-contracts.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-preflight.mjs" --page <relative-page-path> [--target <project-root>] [--line <line-id>] [--json]

Default behavior:
  - loads the page contract for the given managed page
  - checks unresolved placeholder mappings before implementation continues
  - runs the same source-level guard used by typical-page:source-gate, including transitive local imports
  - refreshes contract.workflow.preflightStatus so CI and collaborators can see whether the page cleared preflight
`)
}

function parseArgs(argv) {
  const options = {
    json: false,
    line: '',
    page: '',
    target: process.cwd(),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--page' || arg === '--target' || arg === '--line') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--page') options.page = value
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

function findUnresolvedMappings(contract) {
  const failures = []
  const regionMappings = Array.isArray(contract?.regionMapping) ? contract.regionMapping : []
  const ownershipMappings = Array.isArray(contract?.ownershipMapping) ? contract.ownershipMapping : []

  for (const mapping of regionMappings) {
    if (String(mapping?.target || '').includes('TODO:')) {
      failures.push(`regionMapping.${mapping.region} still points to a TODO target`)
    }
  }

  for (const mapping of ownershipMappings) {
    if (String(mapping?.target || '').includes('TODO:')) {
      failures.push(`ownershipMapping.${mapping.role} still points to a TODO target`)
    }
  }

  if (String(contract?.hostArchetypePath || '').includes('TODO:')) {
    failures.push('hostArchetypePath still points to a TODO target')
  }

  return failures
}

function hasManagedChartSection(contract) {
  return Array.isArray(contract?.regionMapping)
    ? contract.regionMapping.some(
        (item) => String(item?.region || '').trim().toLowerCase() === 'chart-section'
      )
    : false
}

function getManagedChartGovernanceSummary(contract) {
  const pageTypeId = String(contract?.pageTypeId || '').trim()
  const pageTypeLabel = String(contract?.pageTypeLabel || pageTypeId || 'current page').trim()
  const chartSectionDeclared = hasManagedChartSection(contract)

  if (pageTypeId === 'data-visualization') {
    return {
      managedChartSection: 'required-by-page-type',
      chartGovernance:
        'data-visualization keeps charts and the detail table in one managed analytics workspace; all chart rendering must stay on the approved HiUI chart stack.',
    }
  }

  if (chartSectionDeclared) {
    return {
      managedChartSection: 'declared',
      chartGovernance: `${pageTypeLabel} keeps its original page type. chart-section here means the page owns an independent analysis block, not that the page has been promoted to data-visualization. Any inserted chart still has to follow the HiUI managed chart stack.`,
    }
  }

  return {
    managedChartSection: 'not-declared',
    chartGovernance:
      'Any inserted chart still has to follow the HiUI managed chart stack. Only promote a local chart area into chart-section when the requirement forms an independent analysis block with its own section boundary.',
  }
}

function isChartGovernanceFailure(message) {
  return [
    'chart-section',
    'chart stack',
    'chart-like content',
    'approved chart wrapper',
    '@ant-design/charts',
    'withHiuiResponsiveChart',
    'withHiuiMiniChart',
    'adaptive chart-body',
    'Area/Line/Bar',
  ].some((fragment) => String(message || '').includes(fragment))
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function findDirectoryArtifactFailures({ generatedPagePath, targetRoot }) {
  const failures = []
  const entryPath = path.join(targetRoot, generatedPagePath)
  const extension = path.extname(entryPath)
  const baseName = path.basename(entryPath, extension)

  if (baseName !== 'index') {
    return failures
  }

  const sectionsPath = path.join(path.dirname(entryPath), `sections${extension}`)
  const sectionsStylePath = path.join(path.dirname(entryPath), 'sections.module.scss')

  if (!(await pathExists(sectionsPath))) {
    failures.push(
      `${generatedPagePath} is a directory-page entry but ${normalizeContractPath(targetRoot, sectionsPath)} is missing`
    )
  }

  if (!(await pathExists(sectionsStylePath))) {
    failures.push(
      `${generatedPagePath} is a directory-page entry but ${normalizeContractPath(targetRoot, sectionsStylePath)} is missing`
    )
  }

  if (failures.length > 0) {
    return failures
  }

  const entryRaw = await fs.readFile(entryPath, 'utf8')
  const sectionsRaw = await fs.readFile(sectionsPath, 'utf8')

  if (!/from ['"]\.\/sections['"]/.test(entryRaw)) {
    failures.push(
      `${generatedPagePath} is a directory-page entry but does not import ./sections. Directory-page managed entries must compose business sections from a sibling sections artifact.`
    )
  }

  if (!/\.\/sections\.module\.scss['"]/.test(sectionsRaw)) {
    failures.push(
      `${normalizeContractPath(targetRoot, sectionsPath)} does not import ./sections.module.scss. Directory-page sections must keep local business styles in the sibling sections.module.scss artifact.`
    )
  }

  return failures
}

async function writeContractArtifacts(contractEntry) {
  await fs.writeFile(
    contractEntry.filePath,
    `${JSON.stringify(contractEntry.contract, null, 2)}\n`,
    'utf8'
  )
  await fs.writeFile(
    contractEntry.filePath.replace(/\.json$/, '.md'),
    renderRulesOnlyPageContractMarkdown(contractEntry.contract),
    'utf8'
  )
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const targetRoot = path.resolve(options.target)
    const normalizedPagePath = normalizeContractPath(targetRoot, options.page)
    const contractsResult = await loadRulesOnlyPageContracts(targetRoot)
    const contractEntry = contractsResult.contracts.find(
      (entry) => entry?.contract?.generatedPagePath === normalizedPagePath
    )

    if (!contractEntry?.contract) {
      throw new Error(
        `${normalizedPagePath} is not registered as a managed page. Run typical-page:start-page first. Use typical-page:write-contract only for low-level maintenance when a managed contract already exists conceptually.`
      )
    }

    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const { manifest } = await loadPageTypeManifest({ skillRoot, line: options.line })
    const archetypeDefinition = await loadArchetypeDefinition({
      skillRoot,
      pageTypeId: contractEntry.contract.pageTypeId,
    })
    const baselineSpecPath = path.join(
      skillRoot,
      'docs',
      'validation',
      'archetype-smoke-baselines.json'
    )
    const baselineSpec = JSON.parse(await fs.readFile(baselineSpecPath, 'utf8'))
    const contractValidation = validateRulesOnlyPageContract({
      contract: contractEntry.contract,
      manifest,
      targetRoot,
      archetypeDefinition,
      baselineSpec,
    })
    const unresolvedMappings = findUnresolvedMappings(contractEntry.contract)
    const directoryArtifactFailures = await findDirectoryArtifactFailures({
      generatedPagePath: normalizedPagePath,
      targetRoot,
    })
    const sourceErrors = validateManagedPageSource({
      contract: contractEntry.contract,
      generatedPagePath: normalizedPagePath,
      targetRoot,
    })
    const snapshot = computeManagedPageSourceSnapshot({
      generatedPagePath: normalizedPagePath,
      targetRoot,
    })
    const failures = [
      ...contractValidation.errors,
      ...unresolvedMappings,
      ...directoryArtifactFailures,
      ...sourceErrors,
    ]

    const previousWorkflow = contractEntry.contract.workflow || {}
    const previousSnapshotHash = String(previousWorkflow.sourceSnapshotHash || '').trim()
    const wasFinalized = String(previousWorkflow.status || '').trim() === 'finalized'
    const runtimeSmokeWorkflow = reconcileManagedPageRuntimeSmokeWorkflow(
      contractEntry.contract,
      previousWorkflow,
      snapshot.hash
    )
    const workflowStatus =
      wasFinalized && previousSnapshotHash && previousSnapshotHash !== snapshot.hash
        ? 'stale'
        : failures.length === 0 && !wasFinalized
          ? 'preflight-pass'
          : previousWorkflow.status || 'started'

    contractEntry.contract.workflow = {
      ...previousWorkflow,
      status: workflowStatus,
      deliveryStatus: workflowStatus === 'stale' ? 'stale' : previousWorkflow.deliveryStatus || 'not-finalized',
      preflightStatus: failures.length > 0 ? 'fail' : 'pass',
      runtimeSmokeStatus: runtimeSmokeWorkflow.runtimeSmokeStatus,
      runtimeSmokeSnapshotHash: runtimeSmokeWorkflow.runtimeSmokeSnapshotHash,
      runtimeSmokeReportPath: runtimeSmokeWorkflow.runtimeSmokeReportPath,
      sourceSnapshotHash: snapshot.hash,
      staleReason:
        workflowStatus === 'stale'
          ? 'Source snapshot changed after finalize-page. Re-run typical-page:finalize-page on the latest page source.'
          : '',
      lastCommand: 'typical-page:preflight',
    }
    await writeContractArtifacts(contractEntry)
    await syncManagedPageRegistry(targetRoot)

    const payload = {
      pageTypeId: contractEntry.contract.pageTypeId,
      pageTypeLabel: contractEntry.contract.pageTypeLabel,
      workflowStatus: contractEntry.contract.workflow?.status || '(missing)',
      preflightStatus: contractEntry.contract.workflow?.preflightStatus || '(missing)',
      runtimeSmokeRequired: getManagedPageRuntimeSmokeRequirement(contractEntry.contract).required,
      runtimeSmokeStatus: contractEntry.contract.workflow?.runtimeSmokeStatus || '(missing)',
      examplePath: contractEntry.contract.examplePath,
      hostArchetypePath: contractEntry.contract.hostArchetypePath,
      requiredRegions: getRequiredRegionsForPageType(contractEntry.contract.pageTypeId),
      requiredOwnershipRoles: getRequiredOwnershipRolesForPageType(contractEntry.contract.pageTypeId),
      requiredCapabilities: contractEntry.contract.adapterContract?.requiredCapabilities || [],
      semanticContract: getManagedPageSemanticContract(contractEntry.contract),
      ...getManagedChartGovernanceSummary(contractEntry.contract),
      i18nStrategy: contractEntry.contract.i18nBaseline?.runtimePolicy || '(not-declared)',
      formatterPolicy: contractEntry.contract.i18nBaseline?.formatterPolicy || [],
      warnings: contractValidation.warnings.filter((warning) => !warning.startsWith('generated:')),
      failures,
    }

    if (options.json) {
      console.log(JSON.stringify(payload, null, 2))
      process.exit(failures.length > 0 ? 1 : 0)
    }

    console.log('[typical-page:preflight] Summary:')
    console.log(`- page type: ${payload.pageTypeLabel} (${payload.pageTypeId})`)
    console.log(`- workflow status: ${payload.workflowStatus}`)
    console.log(`- preflight status: ${payload.preflightStatus}`)
    console.log(`- example path: ${payload.examplePath}`)
    console.log(`- host archetype path: ${payload.hostArchetypePath}`)
    console.log(
      `- runtime smoke: required=${String(payload.runtimeSmokeRequired)}, status=${payload.runtimeSmokeStatus}`
    )
    console.log(`- required regions: ${payload.requiredRegions.join(', ') || '(none)'}`)
    console.log(
      `- required ownership roles: ${payload.requiredOwnershipRoles.join(', ') || '(none)'}`
    )
    console.log(`- required capabilities: ${payload.requiredCapabilities.join(', ') || '(none)'}`)
    console.log(
      `- semantic contract: query-filter=${payload.semanticContract.queryFilterRegionRole}, dimension-switch=${payload.semanticContract.dimensionSwitchControl}, list-shell=${payload.semanticContract.listShellComposition}, spacing=${payload.semanticContract.spacingOwnership}, area-fill=${payload.semanticContract.areaChartFill}`
    )
    console.log(`- managed chart section: ${payload.managedChartSection}`)
    console.log(`- chart governance: ${payload.chartGovernance}`)
    console.log(`- i18n strategy: ${payload.i18nStrategy}`)
    console.log(`- formatter policy: ${payload.formatterPolicy.join(', ') || '(none)'}`)

    if (payload.warnings.length > 0) {
      console.log('- contract warnings:')
      payload.warnings.forEach((warning) => {
        console.log(`  - ${warning}`)
      })
    }

    if (payload.failures.length > 0) {
      const chartFailures = payload.failures.filter((failure) => isChartGovernanceFailure(failure))
      console.error(
        '[typical-page:preflight] Failed. Current-page implementation must stop until contract placeholders and source-level issues are cleared.'
      )
      console.error(
        '[typical-page:preflight] Source checks include transitive local imports, so helper contamination is reported here before finalize-page.'
      )
      if (chartFailures.length > 0) {
        console.error(
          '[typical-page:preflight] Chart governance note: any inserted chart still follows the managed HiUI chart stack, and only independent analysis blocks should be declared as chart-section.'
        )
      }
      payload.failures.forEach((failure) => {
        console.error(`  - ${failure}`)
      })
      process.exit(1)
    }

    console.log('[typical-page:preflight] PASS')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[typical-page:preflight] ${message}`)
    printUsage()
    process.exit(1)
  }
}

main()
