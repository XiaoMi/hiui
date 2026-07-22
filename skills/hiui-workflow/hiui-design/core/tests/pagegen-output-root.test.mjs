import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { PAGEGEN_ROOT } from '../generators/shared.mjs'

test('pagegen runtime outputs live under core/outputs', () => {
  const pagegenOutputRoot = path.resolve(PAGEGEN_ROOT, 'outputs')

  assert.equal(pagegenOutputRoot, path.resolve(PAGEGEN_ROOT, 'outputs'))
  assert.equal(path.relative(PAGEGEN_ROOT, pagegenOutputRoot), 'outputs')
})
