import fs from 'node:fs/promises'
import path from 'node:path'

import { getPageFamilyContract } from './page-family-contract.mjs'
import { getPageFamilyWorkflowEntry } from './load-page-family-workflow-manifest.mjs'
import {
  AI_GENERATION_READY_CONTEXT_FILENAME,
  PAGE_TYPE_CAPABILITY_REPORT_FILENAME,
  resolveProjectContextPath,
} from './skill-identity.mjs'

export const NON_TYPICAL_GENERATOR_READINESS_EVALUATION_JSON_FILENAME =
  'NON_TYPICAL_GENERATOR_READINESS_EVALUATION.json'
export const NON_TYPICAL_GENERATOR_READINESS_EVALUATION_MD_FILENAME =
  'NON_TYPICAL_GENERATOR_READINESS_EVALUATION.md'
export const NON_TYPICAL_REAL_PROJECT_VALIDATION_REPORT_FILENAME =
  'NON_TYPICAL_REAL_PROJECT_VALIDATION_REPORT.json'
export const NON_TYPICAL_GENERATOR_READINESS_PAGE_FAMILY = 'non-typical-page'
export const REQUIRED_NON_TYPICAL_SCENARIO_ASSERTIONS = [
  {
    id: 'process-stage-positive',
    expectedOutcome: 'written',
  },
  {
    id: 'selection-detail-positive',
    expectedOutcome: 'written',
  },
  {
    id: 'boundary-partial',
    expectedOutcome: 'blocked',
  },
  {
    id: 'negative-analytics',
    expectedOutcome: 'blocked',
  },
]

export const NON_TYPICAL_MANUAL_REVIEW_TARGETS = [
  {
    path: 'SKILL.md',
    focus: 'Do not misstate non-typical-page as unlimited public-open beyond the validated v1 scope.',
  },
  {
    path: 'docs/README.md',
    focus: 'Keep the public reading order and readiness wording aligned with the current release state.',
  },
  {
    path: 'docs/generation/non-typical-ai-generation-guidance.md',
    focus: 'State that the family generator exists, that validated v1 scope is open, and that legacy reconstruction remains closed.',
  },
  {
    path: 'docs/generation/input-modes.md',
    focus: 'Keep non-typical execution capability wording aligned with the workflow manifest state.',
  },
  {
    path: 'docs/generation/page-generation-workflow.md',
    focus: 'Ensure workflow wording does not confuse internal generator wiring with outward release state.',
  },
  {
    path: 'docs/architecture/non-typical-page-readiness-checklist.md',
    focus: 'Keep the current-state and one-line outward wording synchronized with the actual release decision.',
  },
  {
    path: 'docs/generation/page-family-workflows.manifest.json',
    focus: 'If generatorReady changes, all outward wording above must change in the same release batch.',
  },
  {
    path: 'docs/architecture/non-typical-generator-ready-manual-review-checklist.md',
    focus: 'Use this checklist as the fixed human review scope for public wording and future scope expansion.',
  },
]

function normalizeString(value) {
  return String(value || '').trim()
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value))
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

function createCheck({ id, label, required = true, status, reason, detail = '' }) {
  return {
    id,
    label,
    required,
    status,
    reason,
    detail,
  }
}

function getNonTypicalFamilyEntry(container) {
  const entries = Array.isArray(container?.pageFamilyCapabilityReport?.pageFamilies)
    ? container.pageFamilyCapabilityReport.pageFamilies
    : []
  return entries.find((entry) => normalizeString(entry?.id) === NON_TYPICAL_GENERATOR_READINESS_PAGE_FAMILY) || null
}

function buildMarkdownReport(report) {
  const lines = [
    '# Non-Typical Generator Readiness Evaluation',
    '',
    `- generatedAt: ${report.generatedAt}`,
    `- targetRoot: ${report.targetRoot}`,
    `- pageFamily: ${report.pageFamily}`,
    `- status: ${report.status}`,
    `- evidenceStatus: ${report.evidenceStatus}`,
    `- releaseRecommendation: ${report.releaseRecommendation}`,
    '',
    '## Current Public State',
    '',
    `- generatorReady: ${report.currentPublicState.generatorReady}`,
    `- plannerReady: ${report.currentPublicState.plannerReady}`,
    `- briefReady: ${report.currentPublicState.briefReady}`,
    `- legacyRefactorReady: ${report.currentPublicState.legacyRefactorReady}`,
    `- workflowStatus: ${report.currentPublicState.workflowStatus}`,
    '',
    '## Evidence Checks',
    '',
  ]

  for (const check of report.evidenceChecks) {
    lines.push(`### ${check.id}`)
    lines.push('')
    lines.push(`- label: ${check.label}`)
    lines.push(`- required: ${check.required ? 'true' : 'false'}`)
    lines.push(`- status: ${check.status}`)
    lines.push(`- reason: ${check.reason}`)
    if (check.detail) {
      lines.push(`- detail: ${check.detail}`)
    }
    lines.push('')
  }

  lines.push('## Inputs')
  lines.push('')
  lines.push(`- manifestPath: ${report.inputs.manifestPath}`)
  lines.push(`- contractPath: ${report.inputs.contractPath}`)
  lines.push(`- capabilityReportPath: ${report.inputs.capabilityReportPath}`)
  lines.push(`- aiGenerationReadyContextPath: ${report.inputs.aiGenerationReadyContextPath}`)
  lines.push(`- realProjectValidationReportPath: ${report.inputs.realProjectValidationReportPath}`)
  lines.push('')
  lines.push('## Conclusion')
  lines.push('')
  lines.push(`- reason: ${report.reason}`)
  lines.push('')
  lines.push('## Manual Review Targets')
  lines.push('')
  for (const target of report.manualReviewTargets) {
    lines.push(`- ${target.path}: ${target.focus}`)
  }

  return `${lines.join('\n')}\n`
}

export async function evaluateNonTypicalGeneratorReadiness({
  skillRoot,
  targetRoot,
  pageFamily = NON_TYPICAL_GENERATOR_READINESS_PAGE_FAMILY,
} = {}) {
  const normalizedPageFamily = normalizeString(pageFamily) || NON_TYPICAL_GENERATOR_READINESS_PAGE_FAMILY
  if (normalizedPageFamily !== NON_TYPICAL_GENERATOR_READINESS_PAGE_FAMILY) {
    throw new Error(
      `Unsupported page family "${normalizedPageFamily}". Only ${NON_TYPICAL_GENERATOR_READINESS_PAGE_FAMILY} is supported by this evaluator.`
    )
  }

  const { entry: workflowEntry, manifestPath } = await getPageFamilyWorkflowEntry({
    skillRoot,
    pageFamily: normalizedPageFamily,
  })
  const familyContract = getPageFamilyContract(normalizedPageFamily)
  const contractPath = path.join(skillRoot, 'docs', 'generation', 'non-typical-page-contract.json')
  const contract = JSON.parse(await fs.readFile(contractPath, 'utf8'))

  const capabilityReportPath = resolveProjectContextPath(
    targetRoot,
    'outputs',
    PAGE_TYPE_CAPABILITY_REPORT_FILENAME
  )
  const aiGenerationReadyContextPath = resolveProjectContextPath(
    targetRoot,
    'outputs',
    AI_GENERATION_READY_CONTEXT_FILENAME
  )
  const realProjectValidationReportPath = resolveProjectContextPath(
    targetRoot,
    'outputs',
    NON_TYPICAL_REAL_PROJECT_VALIDATION_REPORT_FILENAME
  )

  const capabilityReport = await readJsonIfExists(capabilityReportPath)
  const aiGenerationReadyContext = await readJsonIfExists(aiGenerationReadyContextPath)
  const realProjectValidationReport = await readJsonIfExists(realProjectValidationReportPath)

  const capabilityFamily = getNonTypicalFamilyEntry(capabilityReport)
  const aiContextFamily = getNonTypicalFamilyEntry(aiGenerationReadyContext)
  const evidenceChecks = []

  evidenceChecks.push(
    createCheck({
      id: 'workflow-readiness-contract',
      label: 'Workflow manifest readiness baseline',
      status:
        workflowEntry.plannerReady === true &&
        workflowEntry.briefReady === true &&
        workflowEntry.legacyRefactorReady === false
          ? 'pass'
          : 'fail',
      reason:
        workflowEntry.plannerReady === true &&
        workflowEntry.briefReady === true &&
        workflowEntry.legacyRefactorReady === false
          ? 'Planner/brief are wired and legacy refactor remains intentionally closed.'
          : 'Workflow manifest readiness baseline is inconsistent with the expected non-typical public contract.',
      detail: `plannerReady=${workflowEntry.plannerReady === true}, briefReady=${workflowEntry.briefReady === true}, generatorReady=${workflowEntry.generatorReady === true}, legacyRefactorReady=${workflowEntry.legacyRefactorReady === true}`,
    })
  )

  evidenceChecks.push(
    createCheck({
      id: 'contract-source-consistency',
      label: 'Contract and workflow manifest source consistency',
      status:
        normalizeString(contract?.executionReadiness?.source) ===
          'docs/generation/page-family-workflows.manifest.json' &&
        familyContract.workflowManifestPath === 'docs/generation/page-family-workflows.manifest.json' &&
        familyContract.coordinationPatternManifestPath ===
          'docs/generation/non-typical-workflow-archetypes.json'
          ? 'pass'
          : 'fail',
      reason:
        normalizeString(contract?.executionReadiness?.source) ===
          'docs/generation/page-family-workflows.manifest.json' &&
        familyContract.workflowManifestPath === 'docs/generation/page-family-workflows.manifest.json' &&
        familyContract.coordinationPatternManifestPath ===
          'docs/generation/non-typical-workflow-archetypes.json'
          ? 'Execution readiness source and family contract stay aligned with the canonical manifests.'
          : 'Execution readiness source drifted between the public contract and family contract helpers.',
      detail: `contract.executionReadiness.source=${normalizeString(contract?.executionReadiness?.source)}; familyContract.workflowManifestPath=${familyContract.workflowManifestPath}`,
    })
  )

  evidenceChecks.push(
    createCheck({
      id: 'capability-report-consistency',
      label: 'Target capability outputs stay aligned with workflow manifest',
      status:
        capabilityFamily &&
        aiContextFamily &&
        capabilityFamily.plannerReady === (workflowEntry.plannerReady === true) &&
        capabilityFamily.briefReady === (workflowEntry.briefReady === true) &&
        capabilityFamily.generatorReady === (workflowEntry.generatorReady === true) &&
        aiContextFamily.plannerReady === (workflowEntry.plannerReady === true) &&
        aiContextFamily.briefReady === (workflowEntry.briefReady === true) &&
        aiContextFamily.generatorReady === (workflowEntry.generatorReady === true)
          ? 'pass'
          : 'fail',
      reason:
        capabilityFamily && aiContextFamily
          ? 'Capability report and AI generation ready context match the current family workflow manifest.'
          : 'Capability report or AI generation ready context is missing the non-typical family entry. Refresh the target project context and rerun typical-page preflight before evaluating readiness again.',
      detail: `capabilityReportPresent=${Boolean(capabilityReport)}; aiGenerationReadyContextPresent=${Boolean(aiGenerationReadyContext)}; capabilityFamilyPresent=${Boolean(capabilityFamily)}; aiContextFamilyPresent=${Boolean(aiContextFamily)}; remediation=node scripts/ensure-in-current-project.mjs --target <project-root> --force-context-sync && node .local-context/hiui-design/scripts/typical-page-preflight.mjs --target <project-root>`,
    })
  )

  evidenceChecks.push(
    createCheck({
      id: 'real-project-validation-pass',
      label: 'Real project validation report passed',
      status:
        realProjectValidationReport?.status === 'pass' &&
        realProjectValidationReport?.integrationReadiness?.ready === true
          ? 'pass'
          : 'fail',
      reason:
        realProjectValidationReport?.status === 'pass' &&
        realProjectValidationReport?.integrationReadiness?.ready === true
          ? 'Real target project validation completed with a passing status.'
          : 'Real target project validation report is missing or did not pass.',
      detail: `reportPresent=${Boolean(realProjectValidationReport)}; reportStatus=${normalizeString(realProjectValidationReport?.status)}; integrationReady=${realProjectValidationReport?.integrationReadiness?.ready === true}`,
    })
  )

  const scenarioFailures = REQUIRED_NON_TYPICAL_SCENARIO_ASSERTIONS.filter((expectedScenario) => {
    const actualScenario = Array.isArray(realProjectValidationReport?.scenarios)
      ? realProjectValidationReport.scenarios.find(
          (item) => normalizeString(item?.id) === expectedScenario.id
        )
      : null
    return !actualScenario || actualScenario.status !== 'pass' || actualScenario.actualOutcome !== expectedScenario.expectedOutcome
  })

  evidenceChecks.push(
    createCheck({
      id: 'scenario-coverage',
      label: 'Required scenario coverage passed in real project validation',
      status: scenarioFailures.length === 0 ? 'pass' : 'fail',
      reason:
        scenarioFailures.length === 0
          ? 'Required positive, boundary, and negative scenarios all passed in the real project validation report.'
          : 'One or more required scenarios are missing or did not produce the expected outcome.',
      detail:
        scenarioFailures.length === 0
          ? REQUIRED_NON_TYPICAL_SCENARIO_ASSERTIONS.map((item) => item.id).join(', ')
          : scenarioFailures
              .map((item) => `${item.id}:${item.expectedOutcome}`)
              .join(', '),
    })
  )

  evidenceChecks.push(
    createCheck({
      id: 'minimal-engineering-check',
      label: 'Real project minimal engineering check passed',
      status: realProjectValidationReport?.projectCheck?.status === 'pass' ? 'pass' : 'fail',
      reason:
        realProjectValidationReport?.projectCheck?.status === 'pass'
          ? 'Real project validation passed a minimal engineering check.'
          : 'Real project validation did not record a passing minimal engineering check.',
      detail: `projectCheck.status=${normalizeString(realProjectValidationReport?.projectCheck?.status)}; selectedChecks=${Array.isArray(realProjectValidationReport?.projectCheck?.selectedChecks) ? realProjectValidationReport.projectCheck.selectedChecks.join(',') : ''}`,
    })
  )

  evidenceChecks.push(
    createCheck({
      id: 'manual-doc-review',
      label: 'Manual outward wording review for current public scope',
      required: false,
      status: 'manual',
      reason:
        'Machine checks cannot prove all outward wording is safe. A human must confirm SKILL/doc/public entry wording remains aligned with the current public scope.',
      detail:
        'This is intentionally non-blocking for evidenceStatus, but it blocks automatic manifest mutation.',
    })
  )

  const failedRequiredChecks = evidenceChecks.filter(
    (check) => check.required && check.status !== 'pass'
  )
  const evidenceStatus = failedRequiredChecks.length === 0 ? 'pass' : 'fail'
  const currentGeneratorReady = workflowEntry.generatorReady === true
  const releaseRecommendation =
    evidenceStatus !== 'pass'
      ? 'blocked'
      : currentGeneratorReady
        ? 'already-open'
        : 'candidate-ready-manual-review-required'

  const reason =
    releaseRecommendation === 'blocked'
      ? failedRequiredChecks.map((item) => `${item.id}: ${item.reason}`).join(' ')
      : releaseRecommendation === 'already-open'
        ? 'Evidence checks passed and generatorReady is already true in the workflow manifest.'
        : 'Evidence checks passed. Keep generatorReady under explicit manual control; do not auto-flip the manifest without final outward wording review.'

  return {
    schema: 'hiui-design-non-typical-generator-readiness-evaluation.v1',
    generatedAt: new Date().toISOString(),
    targetRoot,
    pageFamily: normalizedPageFamily,
    status: evidenceStatus === 'pass' ? 'pass' : 'fail',
    evidenceStatus,
    releaseRecommendation,
    reason,
    currentPublicState: {
      plannerReady: workflowEntry.plannerReady === true,
      briefReady: workflowEntry.briefReady === true,
      generatorReady: currentGeneratorReady,
      legacyRefactorReady: workflowEntry.legacyRefactorReady === true,
      workflowStatus: normalizeString(workflowEntry.status),
    },
    inputs: {
      manifestPath,
      contractPath,
      capabilityReportPath,
      aiGenerationReadyContextPath,
      realProjectValidationReportPath,
    },
    manualReviewTargets: cloneJson(NON_TYPICAL_MANUAL_REVIEW_TARGETS),
    evidenceChecks: cloneJson(evidenceChecks),
  }
}

export async function writeNonTypicalGeneratorReadinessEvaluation({
  skillRoot,
  targetRoot,
  pageFamily = NON_TYPICAL_GENERATOR_READINESS_PAGE_FAMILY,
} = {}) {
  const report = await evaluateNonTypicalGeneratorReadiness({
    skillRoot,
    targetRoot,
    pageFamily,
  })
  const outputRoot = resolveProjectContextPath(targetRoot, 'outputs')
  await fs.mkdir(outputRoot, { recursive: true })

  const reportJsonPath = path.join(outputRoot, NON_TYPICAL_GENERATOR_READINESS_EVALUATION_JSON_FILENAME)
  const reportMarkdownPath = path.join(outputRoot, NON_TYPICAL_GENERATOR_READINESS_EVALUATION_MD_FILENAME)

  await fs.writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  await fs.writeFile(reportMarkdownPath, buildMarkdownReport(report), 'utf8')

  return {
    report,
    reportJsonPath,
    reportMarkdownPath,
  }
}
