#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { inspectIntegrationReadiness } from './lib/integration-readiness.mjs'
import { loadGenerationBrief } from './lib/load-generation-brief.mjs'
import { materializeNonTypicalPageFiles } from './lib/non-typical-page-generator.mjs'
import {
  getNonTypicalRealProjectValidationScenario,
  listNonTypicalRealProjectValidationScenarios,
} from './lib/non-typical-real-project-validation-scenarios.mjs'
import {
  DEFAULT_NON_TYPICAL_PROJECT_CHECK_PROFILE,
  resolveNonTypicalProjectCheckPlan,
  runNonTypicalProjectCheck,
} from './lib/non-typical-project-check.mjs'
import { resolveProjectContextPath } from './lib/skill-identity.mjs'

const REPORT_JSON_FILENAME = 'NON_TYPICAL_REAL_PROJECT_VALIDATION_REPORT.json'
const REPORT_MD_FILENAME = 'NON_TYPICAL_REAL_PROJECT_VALIDATION_REPORT.md'

function readRequiredArg(argv, index, name) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`)
  return value
}

function normalizeString(value) {
  return String(value || '').trim()
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value))
}

function asErrorMessage(error) {
  if (!error) return 'Unknown error'
  return error.message || String(error)
}

function parseArgs(argv) {
  const options = {
    target: '',
    scenario: 'all',
    mode: '',
    projectCheckCommand: '',
    projectCheckProfile: DEFAULT_NON_TYPICAL_PROJECT_CHECK_PROFILE,
    force: false,
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--target') {
      options.target = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--scenario') {
      options.scenario = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--mode') {
      options.mode = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--project-check-command') {
      options.projectCheckCommand = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--project-check-profile') {
      options.projectCheckProfile = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--force') {
      options.force = true
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      const scenarioIds = listNonTypicalRealProjectValidationScenarios()
        .map((item) => item.id)
        .join(', ')
      console.log(
        `Usage: node .local-context/hiui-design/scripts/validate-non-typical-real-project.mjs --target <project-root> [--scenario all|${scenarioIds}] [--mode rules-only|host-integration] [--project-check-profile auto|typecheck-only|none] [--project-check-command "<cmd>"] [--force] [--json]`
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!normalizeString(options.target)) {
    throw new Error('Missing --target <project-root>')
  }

  return options
}

function resolveScenarioSelection(selection) {
  const normalizedSelection = normalizeString(selection || 'all')
  if (!normalizedSelection || normalizedSelection === 'all') {
    return listNonTypicalRealProjectValidationScenarios()
  }

  return [getNonTypicalRealProjectValidationScenario(normalizedSelection)]
}

function buildMarkdownReport(report) {
  const lines = [
    '# Non-Typical Real Project Validation Report',
    '',
    `- generatedAt: ${report.generatedAt}`,
    `- targetRoot: ${report.targetRoot}`,
    `- mode: ${report.mode}`,
    `- status: ${report.status}`,
    `- scenarioCount: ${report.summary.totalScenarios}`,
    `- passedScenarioCount: ${report.summary.passedScenarios}`,
    `- failedScenarioCount: ${report.summary.failedScenarios}`,
    '',
    '## Integration Readiness',
    '',
    `- status: ${report.integrationReadiness.status}`,
    `- ready: ${report.integrationReadiness.ready}`,
    `- appliedMode: ${report.integrationReadiness.appliedMode}`,
    `- reason: ${report.integrationReadiness.reason}`,
    '',
    '## Scenarios',
    '',
  ]

  for (const scenario of report.scenarios) {
    lines.push(`### ${scenario.id}`)
    lines.push('')
    lines.push(`- label: ${scenario.label}`)
    lines.push(`- expectedOutcome: ${scenario.expectedOutcome}`)
    lines.push(`- actualOutcome: ${scenario.actualOutcome}`)
    lines.push(`- status: ${scenario.status}`)
    lines.push(`- reason: ${scenario.reason}`)
    if (scenario.coordinationPatternId) {
      lines.push(`- coordinationPatternId: ${scenario.coordinationPatternId}`)
    }
    if (scenario.files.length > 0) {
      lines.push(`- files:`)
      for (const filePath of scenario.files) {
        lines.push(`  - ${filePath}`)
      }
    }
    lines.push('')
  }

  lines.push('## Project Check')
  lines.push('')
  lines.push(`- status: ${report.projectCheck.status}`)
  lines.push(`- profile: ${report.projectCheck.profile || DEFAULT_NON_TYPICAL_PROJECT_CHECK_PROFILE}`)
  lines.push(`- command: ${report.projectCheck.command || '—'}`)
  lines.push(
    `- selectedChecks: ${
      Array.isArray(report.projectCheck.selectedChecks) && report.projectCheck.selectedChecks.length > 0
        ? report.projectCheck.selectedChecks.join(', ')
        : '—'
    }`
  )
  lines.push(`- selectionReason: ${report.projectCheck.selectionReason || report.projectCheck.reason}`)
  lines.push(`- reason: ${report.projectCheck.reason}`)

  return `${lines.join('\n')}\n`
}

async function validateWriteScenario({
  skillRoot,
  targetRoot,
  mode,
  scenario,
  force,
}) {
  const brief = await loadGenerationBrief({
    targetRoot,
    skillRoot,
    pageFamilyId: 'non-typical-page',
    mode,
    inputMode: scenario.output.inputSummary.inputMode,
    dest: scenario.dest,
    title: scenario.title,
    nonTypicalConversationOutput: cloneJson(scenario.output),
  })

  if (brief.schema === 'hiui-design-generation-brief-blocked.v1') {
    throw new Error(
      `Real project validation cannot continue because page-task readiness is blocked: ${brief.pageTaskGate?.status || 'unknown'}`
    )
  }

  const materialized = await materializeNonTypicalPageFiles({
    skillRoot,
    targetRoot,
    brief,
    force,
    dryRun: false,
  })

  return {
    status: materialized.sanity?.status === 'pass' ? 'pass' : 'fail',
    actualOutcome: 'written',
    reason:
      materialized.sanity?.status === 'pass'
        ? 'Scenario wrote files and passed non-typical sanity.'
        : `Scenario wrote files but sanity returned ${materialized.sanity?.status || 'unknown'}.`,
    coordinationPatternId: materialized.coordinationPatternId || '',
    files: (materialized.files || []).map((item) => path.relative(targetRoot, item.destPath)),
    sanity: materialized.sanity || null,
  }
}

async function validateBlockedScenario({
  skillRoot,
  targetRoot,
  mode,
  scenario,
}) {
  try {
    await loadGenerationBrief({
      targetRoot,
      skillRoot,
      pageFamilyId: 'non-typical-page',
      mode,
      inputMode: scenario.output.inputSummary.inputMode,
      dest: scenario.dest,
      title: scenario.title,
      nonTypicalConversationOutput: cloneJson(scenario.output),
    })

    return {
      status: 'fail',
      actualOutcome: 'unexpected-brief-created',
      reason: 'Scenario should have been blocked, but a family brief was created.',
      coordinationPatternId: '',
      files: [],
      sanity: null,
    }
  } catch (error) {
    const message = asErrorMessage(error)
    const expectedPatterns = Array.isArray(scenario.expectedErrorPatterns)
      ? scenario.expectedErrorPatterns
      : []
    const matchedPattern = expectedPatterns.find((pattern) => message.includes(pattern))

    return {
      status: matchedPattern ? 'pass' : 'fail',
      actualOutcome: 'blocked',
      reason: matchedPattern
        ? `Scenario correctly blocked with expected validation message: ${matchedPattern}`
        : `Scenario blocked, but error message did not match expectations: ${message}`,
      coordinationPatternId: '',
      files: [],
      sanity: null,
      errorMessage: message,
    }
  }
}

async function validateScenario(context) {
  const { scenario } = context

  if (scenario.expectedOutcome === 'write') {
    return {
      id: scenario.id,
      label: scenario.label,
      expectedOutcome: scenario.expectedOutcome,
      ...(await validateWriteScenario(context)),
    }
  }

  return {
    id: scenario.id,
    label: scenario.label,
    expectedOutcome: scenario.expectedOutcome,
    ...(await validateBlockedScenario(context)),
  }
}

async function writeValidationReports(targetRoot, report) {
  const outputRoot = resolveProjectContextPath(targetRoot, 'outputs')
  await fs.mkdir(outputRoot, { recursive: true })

  await fs.writeFile(
    path.join(outputRoot, REPORT_JSON_FILENAME),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8'
  )
  await fs.writeFile(
    path.join(outputRoot, REPORT_MD_FILENAME),
    buildMarkdownReport(report),
    'utf8'
  )
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const targetRoot = path.resolve(options.target)
  const integrationReadiness = await inspectIntegrationReadiness(targetRoot)
  const mode = normalizeString(options.mode || integrationReadiness.appliedMode || 'rules-only')
  const scenarios = resolveScenarioSelection(options.scenario)
  const scenarioResults = []

  for (const scenario of scenarios) {
    scenarioResults.push(
      await validateScenario({
        skillRoot,
        targetRoot,
        mode,
        scenario,
        force: options.force,
      })
    )
  }

  const allScenariosPassed = scenarioResults.every((item) => item.status === 'pass')
  const projectCheckPlan = await resolveNonTypicalProjectCheckPlan({
    targetRoot,
    projectCheckCommand: options.projectCheckCommand,
    projectCheckProfile: options.projectCheckProfile,
    nodePath: process.execPath,
  })
  const projectCheck = allScenariosPassed
    ? runNonTypicalProjectCheck(targetRoot, projectCheckPlan)
    : {
        status: 'skipped',
        profile: projectCheckPlan.profile,
        command: projectCheckPlan.command,
        reason: 'Project check was skipped because one or more validation scenarios failed.',
        selectionReason: projectCheckPlan.reason,
        selectedChecks: projectCheckPlan.selectedChecks,
        exitCode: null,
        stdout: '',
        stderr: '',
      }
  const status = allScenariosPassed && projectCheck.status !== 'fail' ? 'pass' : 'fail'
  const report = {
    schema: 'hiui-design-non-typical-real-project-validation-report.v1',
    generatedAt: new Date().toISOString(),
    targetRoot,
    mode,
    status,
    integrationReadiness: {
      ready: Boolean(integrationReadiness.ready),
      status: normalizeString(integrationReadiness.status),
      appliedMode: normalizeString(integrationReadiness.appliedMode),
      reason: normalizeString(integrationReadiness.reason),
    },
    summary: {
      totalScenarios: scenarioResults.length,
      passedScenarios: scenarioResults.filter((item) => item.status === 'pass').length,
      failedScenarios: scenarioResults.filter((item) => item.status !== 'pass').length,
    },
    scenarios: scenarioResults,
    projectCheck,
  }

  await writeValidationReports(targetRoot, report)

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log(buildMarkdownReport(report))
  }

  if (status !== 'pass') {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(asErrorMessage(error))
  process.exit(1)
})
