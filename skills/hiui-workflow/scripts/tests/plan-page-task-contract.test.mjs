import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import {
  buildPlannerContractFields,
  buildWorkflowRequiredActions,
} from '../../hiui-design/scripts/plan-page-task.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..', '..', '..')
const planScriptPath = path.join(
  repoRoot,
  'skills',
  'hiui-workflow',
  'hiui-design',
  'scripts',
  'plan-page-task.mjs',
)
const publicContractsPath = path.join(
  repoRoot,
  'skills',
  'hiui-workflow',
  'hiui-design',
  'scripts',
  'public-cli-contracts.json',
)

function runNode(args) {
  return spawnSync('node', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    env: process.env,
  })
}

test('plan-page-task public contract declares workflow planner fields', async () => {
  const contracts = JSON.parse(await readFile(publicContractsPath, 'utf8'))
  const requiredFields = contracts.commands?.['plan-page-task']?.jsonOutput?.requiredFields || []

  for (const field of [
    'plan',
    'facts',
    'canStartImplementation',
    'currentExecutionState',
    'requiredActions',
    'formalAcceptanceActions',
  ]) {
    assert.equal(requiredFields.includes(field), true, `missing required field ${field}`)
  }
})

test('plan-page-task minimal gate probe emits workflow planner contract fields', () => {
  const result = runNode([
    planScriptPath,
    '--target',
    repoRoot,
    '--json',
  ])

  assert.equal(result.status, 0, result.stderr)

  const plan = JSON.parse(result.stdout)

  assert.equal(plan.plan.status, 'blocked')
  assert.equal(plan.currentExecutionState.status, 'blocked')
  assert.equal(plan.canStartImplementation, false)
  assert.equal(Array.isArray(plan.requiredActions), true)
  assert.equal(Array.isArray(plan.formalAcceptanceActions), true)
  assert.equal(plan.requiredActions[0]?.command, 'typical-page-ensure')
  assert.equal(plan.requiredActions[0]?.phase, 'ResolveBlockingFacts')
})

test('ready typical planner contract exposes generate-page as the primary action', () => {
  const basePlan = {
    requiredDocs: ['docs/generation/page-generation-workflow.md'],
    requiredCommands: [
      {
        id: 'project-typecheck',
        phase: 'project-gate',
        command: 'pnpm typecheck',
        projectLocalCommand: 'pnpm typecheck',
        reason: 'Run the target project type-level validation.',
      },
    ],
    formalAcceptanceCommands: [
      {
        id: 'typical-page-doctor',
        phase: 'formal-acceptance',
        command: 'node doctor.mjs --json',
        projectLocalCommand: 'node doctor.mjs --json',
        reason: 'Run doctor when the workflow level is formal-e2e.',
      },
    ],
    blockingReasons: [],
    integrationReadiness: {
      status: 'ready',
      ready: true,
    },
    projectHostContract: {
      status: 'valid',
    },
    writeReadiness: 'ready',
    readinessGate: {
      status: 'ready-to-generate',
      staleInputs: [],
    },
    nonTypicalExecutionBrief: null,
  }

  const brief = {
    pageSelector: {
      kind: 'page-type',
      id: 'table-basic',
    },
    pageType: {
      id: 'table-basic',
    },
    requestedBusiness: {
      targetBusinessPath: 'src/pages/demo-page',
      dest: 'src/pages/demo-page',
      title: '演示页',
      routePath: 'demo-page',
      feedbackVariantId: '',
      detailSections: [],
    },
    mode: 'rules-only',
    inputMode: {
      id: 'page-prompt',
    },
    localizationMode: 'none',
    pageAdjustmentContract: null,
  }

  const requiredActions = buildWorkflowRequiredActions({
    plan: basePlan,
    planningGateKind: '',
    brief,
    options: {},
    targetRoot: '/tmp/project',
    skillRoot: '/tmp/skill',
    relatedPagePath: '',
  })

  assert.equal(requiredActions[0]?.command, 'generate-page')
  assert.equal(requiredActions[0]?.phase, 'GenerateOrEdit')

  const plan = buildPlannerContractFields(basePlan, {
    planningGateKind: '',
    requiredActions,
  })

  assert.equal(plan.plan.status, 'ready')
  assert.equal(plan.facts.status, 'ready')
  assert.equal(plan.canStartImplementation, true)
  assert.equal(plan.currentExecutionState.status, 'ready')
  assert.equal(plan.currentExecutionState.nextCommand, 'generate-page')
  assert.equal(plan.requiredDocs[0]?.readMode, 'required')
  assert.equal(plan.formalAcceptanceActions[0]?.command, 'typical-page-doctor')
  assert.equal(plan.formalAcceptanceActions[0]?.phase, 'FormalAcceptance')
})
