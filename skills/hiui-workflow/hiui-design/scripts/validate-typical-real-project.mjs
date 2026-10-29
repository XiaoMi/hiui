#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildGenerationBriefResult } from './generation-brief.mjs'
import { inspectIntegrationReadiness } from './lib/integration-readiness.mjs'
import {
  DEFAULT_PROJECT_CHECK_PROFILE,
  resolveManagedProjectCheckPlan,
  runManagedProjectCheck,
} from './lib/non-typical-project-check.mjs'
import {
  inspectPageTaskGate,
  syncPageTaskStatusFromPreflight,
} from './lib/page-task-gate.mjs'
import { readProjectPageTaskStatus, resolveProjectPageTaskStatusPath } from './lib/page-task-status.mjs'
import { writePageTypeCapabilityArtifacts } from './lib/page-type-capability-report.mjs'
import { resolveProjectContextPath } from './lib/skill-identity.mjs'
import { verifyStyleDeliveryDecision } from './lib/style-delivery-decision.mjs'
import {
  getTypicalRealProjectValidationScenario,
  listTypicalRealProjectValidationScenarios,
} from './lib/typical-real-project-validation-scenarios.mjs'
import { runGeneratePageFromBrief } from './generate-page-from-brief.mjs'

const REPORT_JSON_FILENAME = 'TYPICAL_PAGE_REAL_PROJECT_VALIDATION_REPORT.json'
const REPORT_MD_FILENAME = 'TYPICAL_PAGE_REAL_PROJECT_VALIDATION_REPORT.md'

function toFileSafeTimestamp(value) {
  return normalizeString(value).replace(/[:.]/g, '-')
}

function buildValidationReportArtifactPaths(outputDir, generatedAt) {
  const safeTimestamp = toFileSafeTimestamp(generatedAt)
  const snapshotSuffix = `${safeTimestamp}.${process.pid}`

  return {
    latestJsonPath: path.join(outputDir, REPORT_JSON_FILENAME),
    latestMdPath: path.join(outputDir, REPORT_MD_FILENAME),
    snapshotJsonPath: path.join(
      outputDir,
      `TYPICAL_PAGE_REAL_PROJECT_VALIDATION_REPORT.${snapshotSuffix}.json`
    ),
    snapshotMdPath: path.join(
      outputDir,
      `TYPICAL_PAGE_REAL_PROJECT_VALIDATION_REPORT.${snapshotSuffix}.md`
    ),
  }
}

function readRequiredArg(argv, index, name) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`)
  return value
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeString(item)).filter(Boolean)
  }

  const normalized = normalizeString(value)
  return normalized ? [normalized] : []
}

function asErrorMessage(error) {
  if (!error) return 'Unknown error'
  return error.message || String(error)
}

function pathRelative(targetRoot, targetPath = '') {
  const normalized = normalizeString(targetPath)
  if (!normalized) return ''
  const relativePath = path.relative(targetRoot, normalized)
  return relativePath && !relativePath.startsWith('..') ? relativePath : normalized
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return null
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

function parseArgs(argv) {
  const options = {
    target: '',
    scenario: 'all',
    mode: '',
    projectCheckCommand: '',
    projectCheckProfile: DEFAULT_PROJECT_CHECK_PROFILE,
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
      const scenarioIds = listTypicalRealProjectValidationScenarios()
        .map((item) => item.id)
        .join(', ')
      console.log(
        `Usage: node .local-context/hiui-design/scripts/validate-typical-real-project.mjs --target <project-root> [--scenario all|${scenarioIds}] [--mode rules-only|host-integration] [--project-check-profile auto|typecheck-only|none] [--project-check-command "<cmd>"] [--force] [--json]`
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
    return listTypicalRealProjectValidationScenarios()
  }

  return [getTypicalRealProjectValidationScenario(normalizedSelection)]
}

function renderScenarioFiles(files = []) {
  if (!Array.isArray(files) || files.length === 0) return ['- files: —']

  return ['- files:', ...files.map((item) => `  - ${item}`)]
}

function renderScenarioChecks(checks = []) {
  if (!Array.isArray(checks) || checks.length === 0) return []
  return ['- checks:', ...checks.map((item) => `  - ${item}`)]
}

function buildMarkdownReport(report) {
  const lines = [
    '# Typical Real Project Validation Report',
    '',
    `- generatedAt: ${report.generatedAt}`,
    `- targetRoot: ${report.targetRoot}`,
    `- mode: ${report.mode}`,
    `- status: ${report.status}`,
    `- scenarioCount: ${report.summary.totalScenarios}`,
    `- passedScenarioCount: ${report.summary.passedScenarios}`,
    `- failedScenarioCount: ${report.summary.failedScenarios}`,
    '',
    '## Artifacts',
    '',
    `- latestJsonPath: ${report.artifacts?.latestJsonPath || '—'}`,
    `- latestMdPath: ${report.artifacts?.latestMdPath || '—'}`,
    `- snapshotJsonPath: ${report.artifacts?.snapshotJsonPath || '—'}`,
    `- snapshotMdPath: ${report.artifacts?.snapshotMdPath || '—'}`,
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
    lines.push(`- validationKind: ${scenario.validationKind}`)
    lines.push(`- pageTypeId: ${scenario.pageTypeId || '—'}`)
    lines.push(`- expectedOutcome: ${scenario.expectedOutcome}`)
    lines.push(`- actualOutcome: ${scenario.actualOutcome}`)
    lines.push(`- status: ${scenario.status}`)
    lines.push(`- reason: ${scenario.reason}`)
    if (scenario.blockedBy) {
      lines.push(`- blockedBy: ${scenario.blockedBy}`)
    }
    if (scenario.generation?.status) {
      lines.push(`- generationStatus: ${scenario.generation.status}`)
    }
    if (scenario.generation?.parentFlowPatchStatus) {
      lines.push(`- parentFlowPatchStatus: ${scenario.generation.parentFlowPatchStatus}`)
    }
    if (scenario.generation?.businessSemanticPass) {
      lines.push(`- businessSemanticPass: ${scenario.generation.businessSemanticPass}`)
    }
    if (scenario.generation?.fileWriteSummary) {
      const summary = scenario.generation.fileWriteSummary
      lines.push(
        `- fileWriteSummary: planned=${summary.plannedFileCount} written=${summary.writtenFileCount} skippedIdentical=${summary.skippedIdenticalFileCount} managedRuntimeSkipped=${summary.managedRuntimeFilesSkippedAsIdentical}`
      )
    }
    lines.push(...renderScenarioChecks(scenario.checks))
    lines.push(...renderScenarioFiles(scenario.files))
    lines.push('')
  }

  lines.push('## Project Check')
  lines.push('')
  lines.push(`- status: ${report.projectCheck.status}`)
  lines.push(`- profile: ${report.projectCheck.profile || DEFAULT_PROJECT_CHECK_PROFILE}`)
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

function getScenarioForce(scenario, force) {
  return force || scenario.force === true
}

function buildScenarioOptions({ targetRoot, scenario, mode, force }) {
  return {
    target: targetRoot,
    pageType: scenario.pageTypeId,
    pageFamily: scenario.pageFamilyId || '',
    mode,
    inputMode: 'page-prompt',
    localizationMode: 'none',
    line: '',
    dest: scenario.dest,
    relatedPagePath: scenario.relatedPagePath || '',
    title: scenario.title,
    routePath: scenario.routePath,
    detailSectionsJson: Array.isArray(scenario.detailSections)
      ? JSON.stringify(scenario.detailSections)
      : '',
    feedbackVariantId: '',
    pageAdjustmentContract: '',
    confirmedGenerationInputJson: '',
    navigationMountContract: scenario.navigationMountContract
      ? JSON.stringify(scenario.navigationMountContract)
      : '',
    exposeName: '',
    testBaseUrl: '',
    briefFile: '',
    force,
    dryRun: false,
    json: false,
    targetExplicit: true,
    telemetryPrompt: '',
    telemetryPromptFile: '',
  }
}

function buildGeneratePageCliArgs({ targetRoot, scenario, mode, force }) {
  const args = [
    'scripts/generate-page.mjs',
    '--target',
    targetRoot,
    '--page-type',
    scenario.pageTypeId,
    '--mode',
    mode,
    '--input-mode',
    'page-prompt',
    '--localization-mode',
    'none',
    '--dest',
    scenario.dest,
    '--title',
    scenario.title,
    '--validation-profile',
    'light',
    '--project-check-profile',
    'none',
    '--json',
  ]

  if (normalizeString(scenario.relatedPagePath)) {
    args.push('--related-page-path', scenario.relatedPagePath)
  }
  if (normalizeString(scenario.routePath)) {
    args.push('--route-path', scenario.routePath)
  }
  if (Array.isArray(scenario.detailSections)) {
    args.push('--detail-sections-json', JSON.stringify(scenario.detailSections))
  }
  if (scenario.navigationMountContract) {
    args.push('--navigation-mount-contract', JSON.stringify(scenario.navigationMountContract))
  }
  if (force) {
    args.push('--force')
  }

  return args
}

const SCENARIO_SETUP_FIXTURES = {}

async function materializeScenarioSetupFixture(targetRoot, scenario) {
  const fixtureId = normalizeString(scenario?.setupFixtureId)
  if (!fixtureId) return

  const fixtureWriter = SCENARIO_SETUP_FIXTURES[fixtureId]
  if (typeof fixtureWriter !== 'function') {
    throw new Error(`Unknown scenario setup fixture: ${fixtureId}`)
  }

  await fixtureWriter(targetRoot)
}

async function materializeScenarioSetupFiles(targetRoot, scenario) {
  for (const file of Array.isArray(scenario.setupFiles) ? scenario.setupFiles : []) {
    const relativePath = normalizeString(file?.path)
    if (!relativePath) continue

    const absolutePath = path.join(targetRoot, relativePath)
    await fs.mkdir(path.dirname(absolutePath), { recursive: true })
    await fs.writeFile(absolutePath, String(file?.content || ''), 'utf8')
  }
}

async function prepareScenarioTarget({ targetRoot, skillRoot, mode, scenario }) {
  await materializeScenarioSetupFixture(targetRoot, scenario)
  await materializeScenarioSetupFiles(targetRoot, scenario)
  const refreshedGate = await syncPageTaskStatusFromPreflight({
    targetRoot,
    updatedBy: 'scripts/validate-typical-real-project.mjs',
    mode,
  })
  await writePageTypeCapabilityArtifacts({
    skillRoot,
    targetRoot,
    generationReadiness: refreshedGate.generationReadiness,
    pageTaskStatus: refreshedGate.pageTaskStatus,
  })
  return refreshedGate
}

function resolveScenarioExecutionCwd() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
}

async function runScenarioGeneration({ targetRoot, scenario, mode, force }) {
  const generationEntry = normalizeString(scenario.generationEntry || 'brief')
  const effectiveForce = getScenarioForce(scenario, force)

  if (generationEntry === 'single-entry') {
    const args = buildGeneratePageCliArgs({
      targetRoot,
      scenario,
      mode,
      force: effectiveForce,
    })
    const result = spawnSync(process.execPath, args, {
      cwd: resolveScenarioExecutionCwd(),
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    })
    const rawOutput = result.stdout || result.stderr || ''

    let payload = null
    if (result.stdout) {
      try {
        payload = JSON.parse(result.stdout)
      } catch {
        payload = null
      }
    }

    if (!payload) {
      throw new Error(
        rawOutput || `generate-page.mjs exited with code ${result.status ?? 1} without JSON output.`
      )
    }

    return {
      generationEntry,
      rawResult: payload,
      generation: payload.generation || null,
    }
  }

  const generation = await runGeneratePageFromBrief(
    buildScenarioOptions({
      targetRoot,
      scenario,
      mode,
      force: effectiveForce,
    }),
    {
      targetRoot,
      emitOutput: false,
    }
  )

  return {
    generationEntry,
    rawResult: generation,
    generation,
  }
}

function readNestedStatus(object, key) {
  return normalizeString(object?.[key]?.status)
}

function pushFailure(failures, condition, message) {
  if (!condition) {
    failures.push(message)
  }
}

async function collectGenerationEvidence({ targetRoot, scenario, generationRun }) {
  const generation = generationRun.generation || generationRun.rawResult?.generation || generationRun.rawResult || null
  const actualGenerationStatus =
    normalizeString(generation?.status) ||
    normalizeString(generationRun.rawResult?.status) ||
    'error'
  const files = Array.isArray(generation?.files)
    ? generation.files.map((item) => pathRelative(targetRoot, item.destPath))
    : []
  const metadataPath = normalizeString(scenario.dest)
    ? path.join(targetRoot, scenario.dest, 'hiui-pagegen.meta.json')
    : ''
  const metadata = metadataPath ? await readJsonIfExists(metadataPath) : null
  const styleDeliveryOwner = normalizeString(
    generation?.styleDeliveryDecision?.owner || metadata?.styleDeliveryDecision?.owner
  )
  const styleDeliveryVerification =
    generation?.styleDeliveryDecision || metadata?.styleDeliveryDecision
      ? await verifyStyleDeliveryDecision({
          targetRoot,
          styleDeliveryDecision: generation?.styleDeliveryDecision || metadata?.styleDeliveryDecision,
        })
      : null

  return {
    generation,
    actualGenerationStatus,
    files,
    metadata,
    styleDeliveryOwner,
    styleDeliveryVerification,
  }
}

function buildGenerationSummary(generation) {
  if (!generation || typeof generation !== 'object') return null

  return {
    status: normalizeString(generation.status),
    templatePass: readNestedStatus(generation, 'templatePass'),
    engineeringPass: readNestedStatus(generation, 'engineeringPass'),
    navigationFlowPass: readNestedStatus(generation, 'navigationFlowPass'),
    businessSemanticPass: readNestedStatus(generation, 'businessSemanticPass'),
    technicalPass: readNestedStatus(generation, 'technicalPass'),
    businessPass: readNestedStatus(generation, 'businessPass'),
    parentFlowPatchStatus: normalizeString(generation.parentFlowPatchStatus),
    fileWriteSummary: {
      plannedFileCount: Number(generation.plannedFileCount || 0),
      writtenFileCount: Number(generation.writtenFileCount || 0),
      skippedIdenticalFileCount: Number(generation.skippedIdenticalFileCount || 0),
      managedRuntimeFilesSkippedAsIdentical: Number(
        generation.managedRuntimeFilesSkippedAsIdentical || 0
      ),
    },
  }
}

async function validateStandardGenerationScenario({
  targetRoot,
  skillRoot,
  mode,
  scenario,
  force,
}) {
  try {
    await prepareScenarioTarget({ targetRoot, skillRoot, mode, scenario })
    const generationRun = await runScenarioGeneration({
      targetRoot,
      scenario,
      mode,
      force,
    })
    const evidence = await collectGenerationEvidence({
      targetRoot,
      scenario,
      generationRun,
    })
    const failures = []
    const checks = []
    const expectedWrite = scenario.expectedOutcome === 'written'
    const wroteExpectedResult = expectedWrite && evidence.actualGenerationStatus === 'written'

    pushFailure(
      failures,
      !expectedWrite || evidence.actualGenerationStatus === 'written',
      `expected generator status written, but got ${evidence.actualGenerationStatus}`
    )
    if (wroteExpectedResult) {
      checks.push(`generation status=${evidence.actualGenerationStatus}`)
    }

    if (scenario.expectedStyleDeliveryOwner) {
      pushFailure(
        failures,
        evidence.styleDeliveryOwner === normalizeString(scenario.expectedStyleDeliveryOwner),
        `expected styleDeliveryDecision.owner=${scenario.expectedStyleDeliveryOwner}, but got ${evidence.styleDeliveryOwner || '—'}`
      )
      if (evidence.styleDeliveryOwner) {
        checks.push(`style owner=${evidence.styleDeliveryOwner}`)
      }
    }

    if (typeof scenario.expectedStyleDeliveryVerified === 'boolean') {
      pushFailure(
        failures,
        Boolean(evidence.styleDeliveryVerification?.ok) === scenario.expectedStyleDeliveryVerified,
        `expected style delivery verification=${scenario.expectedStyleDeliveryVerified}, but got ${evidence.styleDeliveryVerification?.ok === true}`
      )
      checks.push(`style delivery verified=${evidence.styleDeliveryVerification?.ok === true}`)
    }

    const generation = evidence.generation || {}
    const expectedStatusChecks = [
      ['expectedTemplatePass', readNestedStatus(generation, 'templatePass'), 'templatePass'],
      ['expectedEngineeringPass', readNestedStatus(generation, 'engineeringPass'), 'engineeringPass'],
      ['expectedNavigationFlowPass', readNestedStatus(generation, 'navigationFlowPass'), 'navigationFlowPass'],
      ['expectedBusinessSemanticPass', readNestedStatus(generation, 'businessSemanticPass'), 'businessSemanticPass'],
      ['expectedTechnicalPass', readNestedStatus(generation, 'technicalPass'), 'technicalPass'],
      ['expectedBusinessPass', readNestedStatus(generation, 'businessPass'), 'businessPass'],
    ]
    for (const [field, actualValue, label] of expectedStatusChecks) {
      if (!scenario[field]) continue
      pushFailure(
        failures,
        actualValue === normalizeString(scenario[field]),
        `expected ${label}=${scenario[field]}, but got ${actualValue || '—'}`
      )
      if (actualValue) {
        checks.push(`${label}=${actualValue}`)
      }
    }

    if (scenario.expectedParentFlowPatchStatus) {
      const actualParentFlowPatchStatus = normalizeString(generation.parentFlowPatchStatus)
      pushFailure(
        failures,
        actualParentFlowPatchStatus === normalizeString(scenario.expectedParentFlowPatchStatus),
        `expected parentFlowPatchStatus=${scenario.expectedParentFlowPatchStatus}, but got ${actualParentFlowPatchStatus || '—'}`
      )
      if (actualParentFlowPatchStatus) {
        checks.push(`parent flow patch=${actualParentFlowPatchStatus}`)
      }
    }

    if (scenario.expectedBackNavigationStrategy) {
      const actualBackNavigationStrategy = normalizeString(generation.backNavigationStrategy)
      pushFailure(
        failures,
        actualBackNavigationStrategy === normalizeString(scenario.expectedBackNavigationStrategy),
        `expected backNavigationStrategy=${scenario.expectedBackNavigationStrategy}, but got ${actualBackNavigationStrategy || '—'}`
      )
      if (actualBackNavigationStrategy) {
        checks.push(`back navigation=${actualBackNavigationStrategy}`)
      }
    }

    if (typeof scenario.expectedManualPatchSuggestion === 'boolean') {
      const actualManualPatchSuggestion = Boolean(
        generation.manualPatchSuggestion && typeof generation.manualPatchSuggestion === 'object'
      )
      pushFailure(
        failures,
        actualManualPatchSuggestion === scenario.expectedManualPatchSuggestion,
        `expected manualPatchSuggestion present=${scenario.expectedManualPatchSuggestion}, but got ${actualManualPatchSuggestion}`
      )
      checks.push(`manual patch suggestion=${actualManualPatchSuggestion}`)
    }

    if (scenario.expectedManualPatchSuggestionStatus) {
      const actualManualPatchSuggestionStatus = normalizeString(
        generation.manualPatchSuggestion?.status || evidence.metadata?.manualPatchSuggestion?.status
      )
      pushFailure(
        failures,
        actualManualPatchSuggestionStatus === normalizeString(scenario.expectedManualPatchSuggestionStatus),
        `expected manualPatchSuggestion.status=${scenario.expectedManualPatchSuggestionStatus}, but got ${actualManualPatchSuggestionStatus || '—'}`
      )
      if (actualManualPatchSuggestionStatus) {
        checks.push(`manual patch status=${actualManualPatchSuggestionStatus}`)
      }
    }

    if (scenario.expectedParentSourcePath) {
      const parentSourcePath = path.join(targetRoot, scenario.expectedParentSourcePath)
      const parentSource = await fs.readFile(parentSourcePath, 'utf8').catch(() => '')
      for (const snippet of normalizeStringArray(scenario.expectedParentSourceIncludes)) {
        pushFailure(
          failures,
          parentSource.includes(snippet),
          `expected parent source ${scenario.expectedParentSourcePath} to include ${JSON.stringify(snippet)}`
        )
      }
      checks.push(`parent source checked=${scenario.expectedParentSourcePath}`)
    }

    return {
      id: scenario.id,
      label: scenario.label,
      validationKind: normalizeString(scenario.validationKind || 'generation'),
      pageTypeId: scenario.pageTypeId || '',
      expectedOutcome: scenario.expectedOutcome,
      actualOutcome: evidence.actualGenerationStatus === 'written' ? 'written' : evidence.actualGenerationStatus,
      status: failures.length === 0 ? 'pass' : 'fail',
      reason:
        failures.length === 0
          ? 'Scenario wrote files successfully and matched the expected generation, navigation, and semantic signals.'
          : failures.join('; '),
      blockedBy: '',
      files: evidence.files,
      checks,
      generation: buildGenerationSummary(generation),
      styleDeliveryOwner: evidence.styleDeliveryOwner,
      styleDeliveryVerified:
        evidence.styleDeliveryVerification?.ok === true
          ? true
          : evidence.styleDeliveryVerification?.ok === false
            ? false
            : null,
    }
  } catch (error) {
    const message = asErrorMessage(error)
    const blockedPayload = error?.payload || null
    const actualOutcome = blockedPayload?.status === 'blocked-before-write' ? 'blocked' : 'error'
    const matchedBlockedBy =
      scenario.expectedOutcome === 'blocked' &&
      normalizeString(scenario.expectedBlockedBy) &&
      normalizeString(blockedPayload?.blockedBy) === normalizeString(scenario.expectedBlockedBy)

    return {
      id: scenario.id,
      label: scenario.label,
      validationKind: normalizeString(scenario.validationKind || 'generation'),
      pageTypeId: scenario.pageTypeId || '',
      expectedOutcome: scenario.expectedOutcome,
      actualOutcome,
      status:
        scenario.expectedOutcome === 'blocked' && blockedPayload && matchedBlockedBy
          ? 'pass'
          : 'fail',
      reason:
        scenario.expectedOutcome === 'blocked' && blockedPayload && matchedBlockedBy
          ? blockedPayload.reason || 'Scenario was blocked as expected.'
          : message,
      blockedBy: normalizeString(blockedPayload?.blockedBy),
      files: [],
      checks: [],
      generation: null,
      styleDeliveryOwner: '',
      styleDeliveryVerified: null,
    }
  }
}

async function withTemporaryFileMutation(filePath, mutate) {
  const originalContent = await fs.readFile(filePath, 'utf8')
  const nextContent = await mutate(originalContent)
  await fs.writeFile(filePath, nextContent, 'utf8')

  return async () => {
    await fs.writeFile(filePath, originalContent, 'utf8')
  }
}

function parseJsonOutput(stdout = '', stderr = '') {
  const output = normalizeString(stdout) || normalizeString(stderr)
  if (!output) return null
  return JSON.parse(output)
}

async function runPlannerGateProbe({ targetRoot }) {
  const args = ['scripts/plan-page-task.mjs', '--target', targetRoot, '--json']
  const result = spawnSync(process.execPath, args, {
    cwd: resolveScenarioExecutionCwd(),
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  })

  if (result.status !== 0 || !normalizeString(result.stdout)) {
    throw new Error(result.stderr || result.stdout || 'plan-page-task gate probe failed without JSON output.')
  }

  return parseJsonOutput(result.stdout, result.stderr)
}

async function validateGateStaleButRecoverableScenario({
  targetRoot,
  skillRoot,
  mode,
  scenario,
}) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  const statusPath = resolveProjectPageTaskStatusPath(targetRoot)
  let restorePackageJson = null

  try {
    await prepareScenarioTarget({ targetRoot, skillRoot, mode, scenario })
    restorePackageJson = await withTemporaryFileMutation(packageJsonPath, async (content) => `${content}\n`)

    const pageTaskGate = await inspectPageTaskGate({ targetRoot, skillRoot })
    const statusFile = await readProjectPageTaskStatus(targetRoot)
    const planner = await runPlannerGateProbe({ targetRoot })
    const briefResult = await buildGenerationBriefResult(
      {
        target: targetRoot,
        mode,
        json: true,
      },
      {
        targetRoot,
        skillRoot,
      }
    )
    const briefPayload = briefResult.payload || {}

    const failures = []
    const checks = []
    const expectedStaleInputs = normalizeStringArray(scenario.expectedGateStaleInputs)
    const plannerGate = planner?.readinessGate || {}
    const briefGate = briefPayload?.pageTaskGate || {}

    pushFailure(
      failures,
      normalizeString(pageTaskGate.status) === normalizeString(scenario.expectedGateStatus),
      `expected inspectPageTaskGate.status=${scenario.expectedGateStatus}, but got ${pageTaskGate.status || '—'}`
    )
    pushFailure(
      failures,
      normalizeString(statusFile?.pageTaskReadiness) === normalizeString(scenario.expectedGateStatus),
      `expected PROJECT_PAGE_TASK_STATUS.pageTaskReadiness=${scenario.expectedGateStatus}, but got ${statusFile?.pageTaskReadiness || '—'}`
    )
    pushFailure(
      failures,
      normalizeString(plannerGate.status) === normalizeString(scenario.expectedGateStatus),
      `expected planner readinessGate.status=${scenario.expectedGateStatus}, but got ${plannerGate.status || '—'}`
    )
    pushFailure(
      failures,
      normalizeString(briefGate.status) === normalizeString(scenario.expectedGateStatus),
      `expected brief pageTaskGate.status=${scenario.expectedGateStatus}, but got ${briefGate.status || '—'}`
    )
    pushFailure(
      failures,
      normalizeString(statusFile?.nextRequiredAction) === normalizeString(scenario.expectedGateNextRequiredAction) &&
        normalizeString(plannerGate.nextRequiredAction) === normalizeString(scenario.expectedGateNextRequiredAction) &&
        normalizeString(briefGate.nextRequiredAction) === normalizeString(scenario.expectedGateNextRequiredAction),
      `expected nextRequiredAction=${scenario.expectedGateNextRequiredAction} across status, planner, and brief`
    )
    pushFailure(
      failures,
      statusFile?.canAutoRecover === scenario.expectedGateCanAutoRecover &&
        plannerGate.canAutoRecover === scenario.expectedGateCanAutoRecover &&
        briefGate.canAutoRecover === scenario.expectedGateCanAutoRecover,
      `expected canAutoRecover=${scenario.expectedGateCanAutoRecover} across status, planner, and brief`
    )

    const statusStaleInputs = normalizeStringArray(statusFile?.staleInputs)
    const plannerStaleInputs = normalizeStringArray(plannerGate?.staleInputs)
    const briefStaleInputs = normalizeStringArray(briefGate?.staleInputs)
    for (const expectedStaleInput of expectedStaleInputs) {
      pushFailure(
        failures,
        statusStaleInputs.includes(expectedStaleInput) &&
          plannerStaleInputs.includes(expectedStaleInput) &&
          briefStaleInputs.includes(expectedStaleInput),
        `expected stale input ${expectedStaleInput} across status, planner, and brief`
      )
    }

    pushFailure(
      failures,
      normalizeString(statusFile?.gateStatusReason) === normalizeString(pageTaskGate.gateStatusReason) &&
        normalizeString(plannerGate.reason) === normalizeString(pageTaskGate.gateStatusReason) &&
        normalizeString(briefGate.gateStatusReason) === normalizeString(pageTaskGate.gateStatusReason),
      'expected gateStatusReason to be reused consistently across status, planner, and brief'
    )
    pushFailure(
      failures,
      normalizeString(briefPayload.blockedBy) === normalizeString(scenario.expectedBlockedBy),
      `expected generation-brief blockedBy=${scenario.expectedBlockedBy}, but got ${briefPayload.blockedBy || '—'}`
    )

    checks.push(`status=${pageTaskGate.status}`)
    checks.push(`nextRequiredAction=${pageTaskGate.nextRequiredAction}`)
    checks.push(`staleInputs=${statusStaleInputs.join(', ')}`)

    return {
      id: scenario.id,
      label: scenario.label,
      validationKind: normalizeString(scenario.validationKind),
      pageTypeId: scenario.pageTypeId || '',
      expectedOutcome: scenario.expectedOutcome,
      actualOutcome: normalizeString(briefPayload.blockedBy) ? 'blocked' : 'error',
      status: failures.length === 0 ? 'pass' : 'fail',
      reason:
        failures.length === 0
          ? 'Freshness drift downgraded PROJECT_PAGE_TASK_STATUS.json, planner, and generation brief to the same stale preflight gate.'
          : failures.join('; '),
      blockedBy: normalizeString(briefPayload.blockedBy),
      files: [pathRelative(targetRoot, statusPath)],
      checks,
      generation: null,
      styleDeliveryOwner: '',
      styleDeliveryVerified: null,
    }
  } catch (error) {
    return {
      id: scenario.id,
      label: scenario.label,
      validationKind: normalizeString(scenario.validationKind),
      pageTypeId: scenario.pageTypeId || '',
      expectedOutcome: scenario.expectedOutcome,
      actualOutcome: 'error',
      status: 'fail',
      reason: asErrorMessage(error),
      blockedBy: '',
      files: [pathRelative(targetRoot, statusPath)],
      checks: [],
      generation: null,
      styleDeliveryOwner: '',
      styleDeliveryVerified: null,
    }
  } finally {
    if (restorePackageJson) {
      await restorePackageJson()
    }
    const resetGate = await syncPageTaskStatusFromPreflight({
      targetRoot,
      updatedBy: 'scripts/validate-typical-real-project.mjs',
      mode,
    })
    await writePageTypeCapabilityArtifacts({
      skillRoot,
      targetRoot,
      generationReadiness: resetGate.generationReadiness,
      pageTaskStatus: resetGate.pageTaskStatus,
    })
  }
}

async function validateManagedRuntimeSecondPageScenario({
  targetRoot,
  skillRoot,
  mode,
  scenario,
  force,
}) {
  try {
    await prepareScenarioTarget({ targetRoot, skillRoot, mode, scenario })
    const steps = Array.isArray(scenario.steps) ? scenario.steps : []
    if (steps.length < 2) {
      throw new Error('managed-runtime-second-page-no-identical-rewrite requires at least two generation steps.')
    }

    const executedSteps = []
    for (const step of steps) {
      const generationRun = await runScenarioGeneration({
        targetRoot,
        scenario: {
          ...step,
          force: getScenarioForce(scenario, force),
        },
        mode,
        force,
      })
      const evidence = await collectGenerationEvidence({
        targetRoot,
        scenario: step,
        generationRun,
      })
      executedSteps.push({
        step,
        evidence,
      })
    }

    const second = executedSteps.at(-1)
    const generation = second?.evidence?.generation || {}
    const failures = []
    const checks = [
      `second-step status=${second?.evidence?.actualGenerationStatus || '—'}`,
      `planned=${Number(generation.plannedFileCount || 0)}`,
      `written=${Number(generation.writtenFileCount || 0)}`,
      `skippedIdentical=${Number(generation.skippedIdenticalFileCount || 0)}`,
      `managedRuntimeSkipped=${Number(generation.managedRuntimeFilesSkippedAsIdentical || 0)}`,
    ]

    pushFailure(
      failures,
      second?.evidence?.actualGenerationStatus === 'written',
      `expected second generation status written, but got ${second?.evidence?.actualGenerationStatus || '—'}`
    )
    pushFailure(
      failures,
      Number(generation.skippedIdenticalFileCount || 0) >=
        Number(scenario.expectedSkippedIdenticalFileCountMin || 0),
      `expected skippedIdenticalFileCount >= ${scenario.expectedSkippedIdenticalFileCountMin}, but got ${generation.skippedIdenticalFileCount || 0}`
    )
    pushFailure(
      failures,
      Number(generation.managedRuntimeFilesSkippedAsIdentical || 0) >=
        Number(scenario.expectedManagedRuntimeFilesSkippedAsIdenticalMin || 0),
      `expected managedRuntimeFilesSkippedAsIdentical >= ${scenario.expectedManagedRuntimeFilesSkippedAsIdenticalMin}, but got ${generation.managedRuntimeFilesSkippedAsIdentical || 0}`
    )
    if (scenario.expectedPlannedGreaterThanWritten === true) {
      pushFailure(
        failures,
        Number(generation.plannedFileCount || 0) > Number(generation.writtenFileCount || 0),
        `expected plannedFileCount > writtenFileCount, but got ${generation.plannedFileCount || 0} <= ${generation.writtenFileCount || 0}`
      )
    }

    const expectedStatusChecks = [
      ['expectedTemplatePass', readNestedStatus(generation, 'templatePass'), 'templatePass'],
      ['expectedEngineeringPass', readNestedStatus(generation, 'engineeringPass'), 'engineeringPass'],
      ['expectedNavigationFlowPass', readNestedStatus(generation, 'navigationFlowPass'), 'navigationFlowPass'],
      ['expectedTechnicalPass', readNestedStatus(generation, 'technicalPass'), 'technicalPass'],
    ]
    for (const [field, actualValue, label] of expectedStatusChecks) {
      if (!scenario[field]) continue
      pushFailure(
        failures,
        actualValue === normalizeString(scenario[field]),
        `expected ${label}=${scenario[field]}, but got ${actualValue || '—'}`
      )
    }

    return {
      id: scenario.id,
      label: scenario.label,
      validationKind: normalizeString(scenario.validationKind),
      pageTypeId: scenario.pageTypeId || '',
      expectedOutcome: scenario.expectedOutcome,
      actualOutcome: second?.evidence?.actualGenerationStatus === 'written' ? 'written' : 'error',
      status: failures.length === 0 ? 'pass' : 'fail',
      reason:
        failures.length === 0
          ? 'Subsequent generation skipped identical managed runtime files and reported the write delta correctly.'
          : failures.join('; '),
      blockedBy: '',
      files: second?.evidence?.files || [],
      checks,
      generation: buildGenerationSummary(generation),
      styleDeliveryOwner: '',
      styleDeliveryVerified: null,
    }
  } catch (error) {
    return {
      id: scenario.id,
      label: scenario.label,
      validationKind: normalizeString(scenario.validationKind),
      pageTypeId: scenario.pageTypeId || '',
      expectedOutcome: scenario.expectedOutcome,
      actualOutcome: 'error',
      status: 'fail',
      reason: asErrorMessage(error),
      blockedBy: '',
      files: [],
      checks: [],
      generation: null,
      styleDeliveryOwner: '',
      styleDeliveryVerified: null,
    }
  }
}

async function validateScenario({ targetRoot, skillRoot, mode, scenario, force }) {
  const validationKind = normalizeString(scenario.validationKind || 'generation')

  if (validationKind === 'gate-stale-but-recoverable') {
    return validateGateStaleButRecoverableScenario({
      targetRoot,
      skillRoot,
      mode,
      scenario,
    })
  }

  if (validationKind === 'managed-runtime-second-page-no-identical-rewrite') {
    return validateManagedRuntimeSecondPageScenario({
      targetRoot,
      skillRoot,
      mode,
      scenario,
      force,
    })
  }

  return validateStandardGenerationScenario({
    targetRoot,
    skillRoot,
    mode,
    scenario,
    force,
  })
}

async function resolveProjectCheck({
  targetRoot,
  scenarios,
  projectCheckProfile,
  projectCheckCommand,
}) {
  const hasWrittenScenario = scenarios.some((scenario) => scenario.actualOutcome === 'written')
  if (!hasWrittenScenario) {
    return {
      status: 'not-run',
      profile: normalizeString(projectCheckProfile || DEFAULT_PROJECT_CHECK_PROFILE),
      command: '',
      reason: 'No scenario wrote files, so project check was not run.',
      selectionReason: 'No scenario wrote files, so project check was not run.',
      selectedChecks: [],
      exitCode: null,
      stdout: '',
      stderr: '',
    }
  }

  const plan = await resolveManagedProjectCheckPlan({
    targetRoot,
    projectCheckProfile,
    projectCheckCommand,
  })
  return runManagedProjectCheck(targetRoot, plan)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const targetRoot = path.resolve(options.target)
  const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const outputDir = path.dirname(resolveProjectContextPath(targetRoot, 'outputs', 'marker'))
  const generatedAt = new Date().toISOString()
  const artifacts = buildValidationReportArtifactPaths(outputDir, generatedAt)
  const selectedScenarios = resolveScenarioSelection(options.scenario)
  const integrationReadiness = await inspectIntegrationReadiness(targetRoot)
  const mode = normalizeString(options.mode || integrationReadiness.appliedMode || 'rules-only')
  const scenarios = []

  for (const scenario of selectedScenarios) {
    scenarios.push(
      await validateScenario({
        targetRoot,
        skillRoot,
        mode,
        scenario,
        force: options.force,
      })
    )
  }

  const projectCheck = await resolveProjectCheck({
    targetRoot,
    scenarios,
    projectCheckProfile: options.projectCheckProfile,
    projectCheckCommand: options.projectCheckCommand,
  })

  const failedScenarios = scenarios.filter((scenario) => scenario.status !== 'pass').length
  const report = {
    schema: 'hiui-design-typical-real-project-validation-report.v2',
    generatedAt,
    targetRoot,
    mode,
    status:
      failedScenarios === 0 && projectCheck.status !== 'fail'
        ? 'pass'
        : 'fail',
    artifacts,
    integrationReadiness,
    summary: {
      totalScenarios: scenarios.length,
      passedScenarios: scenarios.length - failedScenarios,
      failedScenarios,
    },
    scenarios,
    projectCheck,
  }

  await fs.mkdir(outputDir, { recursive: true })
  const reportJson = `${JSON.stringify(report, null, 2)}\n`
  const reportMd = buildMarkdownReport(report)
  await fs.writeFile(artifacts.latestJsonPath, reportJson, 'utf8')
  await fs.writeFile(artifacts.latestMdPath, reportMd, 'utf8')
  await fs.writeFile(artifacts.snapshotJsonPath, reportJson, 'utf8')
  await fs.writeFile(artifacts.snapshotMdPath, reportMd, 'utf8')

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  console.log(reportMd)
}

await main()
