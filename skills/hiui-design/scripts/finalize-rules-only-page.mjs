#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  buildManagedPageWorkflowMetadata,
  getManagedPageRuntimeSmokeRequirement,
  getRulesOnlyPageContractsDir,
  normalizeContractPath,
  reconcileManagedPageRuntimeSmokeWorkflow,
  renderRulesOnlyPageContractMarkdown,
  toContractSlug,
} from './lib/rules-only-page-contracts.mjs'
import {
  computeManagedPageSourceSnapshot,
  syncManagedPageRegistry,
} from './lib/managed-page-artifacts.mjs'
import { validateManagedPageSource } from './lib/managed-page-source-guard.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/finalize-rules-only-page.mjs" --page-type <page-type-id> --page <generated-page-path> --archetype <host-archetype-path> --region <name=target> [--region <name=target> ...] [writer options ...] [--skip-doctor-gate]

Default behavior:
  1. write the rules-only page contract
  2. run typical-page source gate against the generated page
  3. run typical-page doctor as the generation gate
  4. succeed only when source gate + doctor both reach a warning-free PASS status for the current page
  5. the success result is valid only for the current source snapshot; after any structural/runtime/content change on this page, re-run finalize-page instead of reusing the old contract

Examples:
  npm run typical-page:finalize-page -- \\
    --page-type full-page-detail \\
    --page src/views/order/organization-detail/index.jsx \\
    --archetype src/views/engineer-management/details.tsx \\
    --region header=PageHeader顶部标题与leading返回区 \\
    --region white-body=FullPageCompatibleShell.surface单一白底主体 \\
    --region detail-body=FullPageCompatibleShell.body详情滚动区 \\
    --ownership-mode page-surface-owns-workspace \\
    --ownership content-slot=ss-v1-layout__content宿主内容槽 \\
    --ownership white-body=FullPageCompatibleShell.surface白底主体 \\
    --ownership outer-padding=FullPageCompatibleShell.workspace外层留白 \\
    --ownership main-scroll=detailBody详情滚动区

  npm run typical-page:finalize-page -- \\
    --page-type full-page-edit \\
    --page src/views/order/create-organization/index.jsx \\
    --archetype src/views/engineer-management/edit.tsx \\
    --region header=PageHeader顶部标题与leading返回区 \\
    --region white-body=FullPageCompatibleShell.surface单一白底主体 \\
    --region form-body=formBody编辑滚动区 \\
    --region footer=FullPageCompatibleShell.footer底部操作区 \\
    --ownership-mode page-surface-owns-workspace \\
    --ownership content-slot=ss-v1-layout__content宿主内容槽 \\
    --ownership white-body=FullPageCompatibleShell.surface白底主体 \\
    --ownership outer-padding=FullPageCompatibleShell.workspace外层留白 \\
    --ownership main-scroll=formBody编辑滚动区
`)
}

function parseArgs(argv) {
  const options = {
    line: '',
    skipDoctorGate: false,
    target: process.cwd(),
    writerArgs: [],
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--allow-warning-summary' || arg === '--allow-warning-detail') {
      throw new Error(
        `${arg} is no longer supported. finalize-page now blocks any current-page warning instead of allow-listing it.`
      )
    }

    if (arg === '--skip-doctor-gate') {
      options.skipDoctorGate = true
      continue
    }

    if (arg === '--target' || arg === '--line') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--line') options.line = value

      options.writerArgs.push(arg, value)
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    options.writerArgs.push(arg)
  }

  return options
}

function runNodeScript(scriptPath, args, extra = {}) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: extra.cwd || process.cwd(),
    encoding: 'utf8',
    stdio: extra.capture ? ['inherit', 'pipe', 'pipe'] : 'inherit',
  })
}

function findArgValue(argv, flag) {
  const index = argv.indexOf(flag)
  if (index < 0) return ''
  return argv[index + 1] || ''
}

function hasArg(argv, flag) {
  return argv.includes(flag)
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

  if (pageTypeId === 'data-visualization') {
    return {
      managedChartSection: 'required-by-page-type',
      chartGovernance:
        'data-visualization keeps charts and the detail table in one managed analytics workspace; all chart rendering must stay on the approved HiUI chart stack.',
    }
  }

  if (hasManagedChartSection(contract)) {
    return {
      managedChartSection: 'declared',
      chartGovernance:
        'The page keeps its original page type. chart-section here only marks an independent analysis block; any inserted chart still has to stay on the approved HiUI chart stack.',
    }
  }

  return {
    managedChartSection: 'not-declared',
    chartGovernance:
      'Any inserted chart still has to stay on the approved HiUI chart stack. Only independent analysis blocks should be promoted into chart-section.',
  }
}

function isManagedChartGovernanceFailure(message) {
  return [
    'chart-section',
    'chart stack',
    'chart-like content',
    'approved chart wrapper',
    '@ant-design/charts',
    'withHiuiResponsiveChart',
    'withHiuiMiniChart',
    'adaptive chart-body',
  ].some((fragment) => String(message || '').includes(fragment))
}

function appendMissingWriterArgsFromContract({ writerArgs, contract }) {
  const nextArgs = [...writerArgs]

  if (!hasArg(nextArgs, '--page-type') && contract?.pageTypeId) {
    nextArgs.push('--page-type', contract.pageTypeId)
  }

  if (!hasArg(nextArgs, '--archetype') && contract?.hostArchetypePath) {
    nextArgs.push('--archetype', contract.hostArchetypePath)
  }

  if (!hasArg(nextArgs, '--mode') && contract?.archetypeMode) {
    nextArgs.push('--mode', contract.archetypeMode)
  }

  if (!hasArg(nextArgs, '--scroll-strategy') && contract?.scrollStrategy) {
    nextArgs.push('--scroll-strategy', contract.scrollStrategy)
  }

  if (
    !hasArg(nextArgs, '--query-filter-region-role') &&
    contract?.semanticContract?.queryFilterRegionRole
  ) {
    nextArgs.push(
      '--query-filter-region-role',
      contract.semanticContract.queryFilterRegionRole
    )
  }

  if (!hasArg(nextArgs, '--ownership-mode') && contract?.ownershipMode) {
    nextArgs.push('--ownership-mode', contract.ownershipMode)
  }

  if (!hasArg(nextArgs, '--region')) {
    for (const entry of contract?.regionMapping || []) {
      if (entry?.region && entry?.target) {
        nextArgs.push('--region', `${entry.region}=${entry.target}`)
      }
    }
  }

  if (!hasArg(nextArgs, '--ownership')) {
    for (const entry of contract?.ownershipMapping || []) {
      if (entry?.role && entry?.target) {
        nextArgs.push('--ownership', `${entry.role}=${entry.target}`)
      }
    }
  }

  return nextArgs
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const writeContractScript = path.join(scriptDir, 'write-rules-only-page-contract.mjs')
    const doctorScript = path.join(scriptDir, 'typical-page-doctor.mjs')
    const pagePath = findArgValue(options.writerArgs, '--page')
    const contractId = findArgValue(options.writerArgs, '--id')
    const normalizedPagePath = normalizeContractPath(options.target, pagePath)
    const contractSlug =
      toContractSlug(contractId) ||
      toContractSlug(normalizedPagePath.replace(/\.[cm]?[jt]sx?$/, '')) ||
      'managed-page-contract'
    const contractsDir = getRulesOnlyPageContractsDir(options.target)
    const contractJsonPath = path.join(contractsDir, `${contractSlug}.json`)
    const contractMarkdownPath = path.join(contractsDir, `${contractSlug}.md`)
    const existingContract = await fs
      .readFile(contractJsonPath, 'utf8')
      .then((raw) => JSON.parse(raw))
      .catch(() => null)
    const writerArgs = appendMissingWriterArgsFromContract({
      writerArgs: options.writerArgs,
      contract: existingContract,
    })

    const writeResult = runNodeScript(writeContractScript, writerArgs, {
      cwd: options.target,
    })

    if (writeResult.status !== 0) {
      process.exit(writeResult.status || 1)
    }
    const contractRaw = await fs.readFile(contractJsonPath, 'utf8')
    const contract = JSON.parse(contractRaw)
    const sourceErrors = validateManagedPageSource({
      contract,
      generatedPagePath: pagePath,
      targetRoot: options.target,
    })
    const chartGovernanceSummary = getManagedChartGovernanceSummary(contract)

    if (sourceErrors.length > 0) {
      const chartFailures = sourceErrors.filter((error) => isManagedChartGovernanceFailure(error))
      console.error(
        '[typical-page-source-gate] Managed page source contract enforcement failed for the current page snapshot.'
      )
      if (chartFailures.length > 0) {
        console.error(
          `[typical-page-source-gate] Chart governance note: managed chart section=${chartGovernanceSummary.managedChartSection}; ${chartGovernanceSummary.chartGovernance}`
        )
      }
      sourceErrors.forEach((error) => {
        console.error(`  - ${error}`)
      })
      console.error(
        'finalize-rules-only-page: source gate failed before doctor. Current-page delivery must stop until the source contract and explicit facts are repaired. If this page changed after a previous finalize result, treat the old finalize output as stale and re-close the loop on the latest source.'
      )
      process.exit(1)
    }

    if (options.skipDoctorGate) {
      console.log(
        'finalize-rules-only-page: contract written and source gate passed, but doctor gate was skipped. This is not a delivery-ready finalize result, and it cannot be reused after later page changes.'
      )
      return
    }

    const doctorArgs = ['--target', options.target, '--json']
    if (options.line) {
      doctorArgs.push('--line', options.line)
    }

    const doctorResult = runNodeScript(doctorScript, doctorArgs, {
      cwd: options.target,
      capture: true,
    })

    const stdout = String(doctorResult.stdout || '').trim()
    const stderr = String(doctorResult.stderr || '').trim()

    if (doctorResult.status !== 0) {
      if (stdout) process.stdout.write(`${stdout}\n`)
      if (stderr) process.stderr.write(`${stderr}\n`)
      process.exit(doctorResult.status || 1)
    }

    let doctorJson = null
    try {
      doctorJson = JSON.parse(stdout)
    } catch (error) {
      if (stdout) process.stdout.write(`${stdout}\n`)
      if (stderr) process.stderr.write(`${stderr}\n`)
      throw new Error('Failed to parse doctor JSON output during finalize gate')
    }

    const hardFailures = Array.isArray(doctorJson?.checks)
      ? doctorJson.checks.filter((check) => !check?.ok && check?.severity === 'error')
      : []
    const manualChecks = Array.isArray(doctorJson?.checks)
      ? doctorJson.checks.filter((check) => !check?.ok && check?.severity === 'manual')
      : []
    const warningChecks = Array.isArray(doctorJson?.checks)
      ? doctorJson.checks.filter((check) => !check?.ok && check?.severity === 'warn')
      : []

    if (
      doctorJson?.status !== 'pass' ||
      hardFailures.length > 0 ||
      manualChecks.length > 0 ||
      warningChecks.length > 0
    ) {
      console.error(
        'finalize-rules-only-page: doctor did not reach a warning-free PASS status. Current-page delivery cannot finish with unresolved hard failures, manual steps, or warnings. After any follow-up page fix, re-run finalize-page on the latest source instead of relying on this failed attempt.'
      )
      console.error(`- report: ${doctorJson?.reportPath || '(unknown)'}`)
      console.error(`- smoke report: ${doctorJson?.smokeReportPath || '(unknown)'}`)
      for (const check of hardFailures) {
        console.error(`- ${check.summary}: ${check.detail || '(no detail)'}`)
      }
      for (const check of manualChecks) {
        console.error(`- ${check.summary}: ${check.detail || '(no detail)'}`)
      }
      for (const check of warningChecks) {
        console.error(`- ${check.summary}: ${check.detail || '(no detail)'}`)
      }
      process.exit(1)
    }

    const finalizedAt = new Date().toISOString()
    const sourceSnapshot = computeManagedPageSourceSnapshot({
      generatedPagePath: pagePath,
      targetRoot: options.target,
    })
    const runtimeSmokeRequirement = getManagedPageRuntimeSmokeRequirement(contract)
    const runtimeSmokeWorkflow = reconcileManagedPageRuntimeSmokeWorkflow(
      contract,
      contract.workflow || {},
      sourceSnapshot.hash
    )

    if (runtimeSmokeRequirement.required && runtimeSmokeWorkflow.runtimeSmokeStatus !== 'pass') {
      console.error(
        'finalize-rules-only-page: runtime smoke is required for this page type and scroll strategy, but the current source snapshot does not have a passing runtime-smoke result yet.'
      )
      console.error(`- requirement: ${runtimeSmokeRequirement.reason}`)
      console.error(`- source snapshot hash: ${sourceSnapshot.hash}`)
      console.error(
        '- next step: run typical-page:runtime-smoke with --page bound to this managed page on the current dev server, then re-run finalize-page on the same source snapshot.'
      )
      process.exit(1)
    }

    contract.workflow = buildManagedPageWorkflowMetadata({
      ...(contract.workflow || {}),
      status: 'finalized',
      deliveryStatus: 'finalized',
      startedAt: contract.workflow?.startedAt || contract.createdAt || finalizedAt,
      finalizedAt,
      preflightStatus: 'pass',
      sourceGateStatus: 'pass',
      doctorStatus: 'pass',
      runtimeSmokeStatus: runtimeSmokeWorkflow.runtimeSmokeStatus,
      runtimeSmokeSnapshotHash: runtimeSmokeWorkflow.runtimeSmokeSnapshotHash,
      runtimeSmokeReportPath: runtimeSmokeWorkflow.runtimeSmokeReportPath,
      sourceSnapshotHash: sourceSnapshot.hash,
      staleReason: '',
      reportPath: doctorJson?.reportPath || '',
      smokeReportPath: doctorJson?.smokeReportPath || '',
      lastCommand: 'typical-page:finalize-page',
    })

    await fs.writeFile(contractJsonPath, `${JSON.stringify(contract, null, 2)}\n`, 'utf8')
    await fs.writeFile(contractMarkdownPath, renderRulesOnlyPageContractMarkdown(contract), 'utf8')
    await syncManagedPageRegistry(options.target)

    console.log('finalize-rules-only-page: success')
    console.log(`- report: ${doctorJson?.reportPath || '(unknown)'}`)
    console.log(`- smoke report: ${doctorJson?.smokeReportPath || '(unknown)'}`)
    console.log(`- doctor status: ${doctorJson?.status || '(unknown)'}`)
    console.log(`- source snapshot hash: ${sourceSnapshot.hash}`)
    console.log(`- managed chart section: ${chartGovernanceSummary.managedChartSection}`)
    console.log(`- chart governance: ${chartGovernanceSummary.chartGovernance}`)
    console.log(
      '- note: this finalize result is bound to the current source snapshot. Re-run finalize-page after any structural, ownership, runtime-shell, or user-visible content change on this page.'
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`finalize-rules-only-page failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

main()
