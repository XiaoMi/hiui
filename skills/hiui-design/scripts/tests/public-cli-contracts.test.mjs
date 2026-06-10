import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const manifestPath = path.join(skillRoot, 'scripts', 'public-cli-contracts.json')

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(skillRoot, relativePath), 'utf8'))
}

function commandArgs(entry) {
  return entry.command.map((arg) => (arg === '<skillRoot>' ? skillRoot : arg))
}

function getPathValue(value, pathParts) {
  return pathParts.reduce((current, part) => current?.[part], value)
}

test('public CLI contract manifest separates machine, human, and maintainer tiers', async () => {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
  assert.equal(manifest.version, 1)
  assert.ok(Array.isArray(manifest.tiers['machine-public']))
  assert.ok(Array.isArray(manifest.tiers['human-cli']))
  assert.ok(Array.isArray(manifest.tiers['maintainer-only']))
})

test('shipped machine-public CLI JSON contracts match their checked-in fixtures', async () => {
  const manifest = await readJson('scripts/public-cli-contracts.json')
  const shippedEntries = manifest.tiers['machine-public'].filter(
    (entry) => entry.status === 'shipped' && entry.jsonContract === 'shipped'
  )

  assert.ok(shippedEntries.length > 0)

  for (const entry of shippedEntries) {
    const result = spawnSync(
      process.execPath,
      [path.join(skillRoot, entry.script), ...commandArgs(entry)],
      {
        cwd: skillRoot,
        encoding: 'utf8',
        maxBuffer: 16 * 1024 * 1024,
      }
    )

    assert.equal(result.status, entry.expectedExitCode ?? 0, result.stderr || result.stdout)

    const actual = JSON.parse(result.stdout)
    const expected = await readJson(entry.fixture)
    assert.deepEqual(actual, expected, `${entry.id} JSON output drifted from fixture`)

    for (const field of entry.requiredTopLevelFields || []) {
      assert.ok(Object.hasOwn(actual, field), `${entry.id} missing top-level field ${field}`)
    }

    for (const nested of entry.requiredNestedFields || []) {
      const value = getPathValue(actual, nested.path)
      assert.ok(value && typeof value === 'object', `${entry.id} missing nested path ${nested.path.join('.')}`)
      for (const field of nested.fields || []) {
        assert.ok(Object.hasOwn(value, field), `${entry.id} missing nested field ${nested.path.join('.')}.${field}`)
      }
    }
  }
})
