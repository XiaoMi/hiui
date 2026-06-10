import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const planScript = path.join(skillRoot, 'scripts', 'plan-page-task.mjs')

function runPlan(args) {
  const result = spawnSync(process.execPath, [planScript, ...args, '--json'], {
    cwd: skillRoot,
    encoding: 'utf8',
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  return JSON.parse(result.stdout)
}

test('plan-page-task builds an implementation-ready plan for an explicit typical page type', () => {
  const plan = runPlan([
    '--change',
    '新增一个数据看板页面',
    '--page-type',
    'table-stat',
    '--mode',
    'rules-only',
    '--target',
    skillRoot,
  ])

  assert.equal(plan.taskLevel.id, 'new-page-or-rearchitecture')
  assert.equal(plan.mode.id, 'rules-only')
  assert.equal(plan.pageType.id, 'table-stat')
  assert.equal(plan.canStartImplementation, true)
  assert.deepEqual(plan.blockingReasons, [])
  assert.ok(plan.contractFieldsNeeded.includes('layoutStrategy'))
  assert.ok(plan.contractFieldsNeeded.includes('shellInheritanceStrategy'))
  assert.ok(plan.requiredCommands.some((item) => item.script === 'typical-page:start-page'))
})

test('plan-page-task blocks full generation when page type is missing', () => {
  const plan = runPlan([
    '--change',
    '新增一个审批管理页面',
    '--mode',
    'rules-only',
    '--target',
    skillRoot,
  ])

  assert.equal(plan.canStartImplementation, false)
  assert.ok(plan.blockingReasons.includes('missing pageType'))
  assert.equal(plan.isNonTypical, true)
})
