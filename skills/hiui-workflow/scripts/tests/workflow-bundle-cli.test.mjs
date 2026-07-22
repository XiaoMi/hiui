import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..', '..', '..')
const localLockPath = path.join(repoRoot, 'skills', 'hiui-workflow', 'bundle', 'workflow-bundle.local.lock.json')
const installScriptPath = path.join(repoRoot, 'skills', 'hiui-workflow', 'scripts', 'install-workflow-bundle.mjs')
const verifyScriptPath = path.join(repoRoot, 'skills', 'hiui-workflow', 'scripts', 'verify-workflow-bundle.mjs')

function runNode(args, env = {}) {
  return spawnSync('node', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...env,
    },
    maxBuffer: 32 * 1024 * 1024,
  })
}

test('install cli fails closed without host or target', () => {
  const result = runNode([
    installScriptPath,
    '--lockfile',
    localLockPath,
    '--dry-run',
    '--json',
  ])

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Missing install destination/)
})

test('install cli resolves codex host via WORKFLOW_HOME', () => {
  const result = runNode([
    installScriptPath,
    '--lockfile',
    localLockPath,
    '--dry-run',
    '--host',
    'codex',
    '--json',
  ], {
    WORKFLOW_HOME: '/tmp/hiui-workflow-cli-codex',
  })

  assert.equal(result.status, 0, result.stderr)
  const report = JSON.parse(result.stdout)
  assert.equal(report.host, 'codex')
  assert.equal(report.targetResolution, 'host-profile')
  assert.equal(report.targetRoot, path.resolve('/tmp/hiui-workflow-cli-codex', 'skills'))
})

test('install cli accepts explicit target for generic host', () => {
  const result = runNode([
    installScriptPath,
    '--lockfile',
    localLockPath,
    '--dry-run',
    '--host',
    'generic',
    '--target',
    '/tmp/hiui-workflow-cli-generic',
    '--json',
  ])

  assert.equal(result.status, 0, result.stderr)
  const report = JSON.parse(result.stdout)
  assert.equal(report.host, 'generic')
  assert.equal(report.targetResolution, 'explicit-target')
  assert.equal(report.targetRoot, path.resolve('/tmp/hiui-workflow-cli-generic'))
})

test('verify cli keeps source-only mode without host or target', () => {
  const result = runNode([
    verifyScriptPath,
    '--lockfile',
    localLockPath,
    '--json',
  ])

  assert.equal(result.status, 0, result.stderr)
  const report = JSON.parse(result.stdout)
  assert.equal(report.status, 'passed')
  assert.equal(report.targetResolution, 'source-only')
  assert.equal(report.targetRoot, '')
})

test('release smoke can install to an explicit temporary target', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-workflow-cli-release-'))

  try {
    const releaseScriptPath = path.join(repoRoot, 'skills', 'hiui-workflow', 'scripts', 'release-workflow-bundle.mjs')
    const result = runNode([
      releaseScriptPath,
      '--lockfile',
      localLockPath,
      '--target',
      targetRoot,
      '--json',
    ])

    assert.equal(result.status, 0, result.stderr)
    const report = JSON.parse(result.stdout)
    assert.equal(report.status, 'passed')
    assert.equal(report.targetResolution, 'explicit-target')
    assert.equal(report.targetRoot, path.resolve(targetRoot))
  } finally {
    await fs.rm(targetRoot, { recursive: true, force: true })
  }
})
