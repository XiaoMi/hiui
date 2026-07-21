import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateHostProfiles } from '../lib/workflow-bundle.mjs'
import { resolveTargetDescriptor } from '../lib/workflow-hosts.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const hostProfilesPath = path.resolve(__dirname, '..', '..', 'bundle', 'host-profiles.json')
const hostProfiles = JSON.parse(await readFile(hostProfilesPath, 'utf8'))

validateHostProfiles(hostProfiles, hostProfilesPath)

test('codex host resolves to the codex skills root', () => {
  const result = resolveTargetDescriptor({
    host: 'codex',
    purpose: 'install',
    env: {
      WORKFLOW_HOME: '/tmp/codex-home',
    },
  }, hostProfiles)

  assert.equal(result.host, 'codex')
  assert.equal(result.resolution, 'host-profile')
  assert.equal(result.targetRoot, path.resolve('/tmp/codex-home', 'skills'))
})

test('generic host requires an explicit target', () => {
  assert.throws(() => {
    resolveTargetDescriptor({
      host: 'generic',
      purpose: 'install',
      env: {},
    }, hostProfiles)
  }, /requires --target <skills-dir>/)
})

test('install requires host or target', () => {
  assert.throws(() => {
    resolveTargetDescriptor({
      purpose: 'install',
      env: {},
    }, hostProfiles)
  }, /Missing install destination/)
})

test('verify without host or target stays in source-only mode', () => {
  const result = resolveTargetDescriptor({
    purpose: 'verify',
    env: {},
  }, hostProfiles)

  assert.equal(result.resolution, 'source-only')
  assert.equal(result.targetRoot, '')
})

test('explicit target wins for generic host', () => {
  const result = resolveTargetDescriptor({
    host: 'generic',
    target: '/tmp/generic-host-skills',
    purpose: 'install',
    env: {},
  }, hostProfiles)

  assert.equal(result.host, 'generic')
  assert.equal(result.resolution, 'explicit-target')
  assert.equal(result.targetRoot, path.resolve('/tmp/generic-host-skills'))
})
