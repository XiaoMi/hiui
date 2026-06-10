import assert from 'node:assert/strict'
import test from 'node:test'

import {
  PUBLIC_HIUI_V5_SOURCE_LABEL,
  sanitizeHiuiV5SourceLabel,
} from '../lib/hiui-v5-knowledge.mjs'

test('HiUI v5 public source labels do not expose maintainer-local paths', () => {
  assert.equal(
    sanitizeHiuiV5SourceLabel('../../../private-source/.local-context/hiui-v5/README.md'),
    PUBLIC_HIUI_V5_SOURCE_LABEL,
  )
  assert.equal(sanitizeHiuiV5SourceLabel('/Users/name/work/hiui-v5/README.md'), PUBLIC_HIUI_V5_SOURCE_LABEL)
  assert.equal(sanitizeHiuiV5SourceLabel('C:/Users/name/work/hiui-v5/README.md'), PUBLIC_HIUI_V5_SOURCE_LABEL)
})

test('HiUI v5 source label sanitizer preserves public labels and empty fallback', () => {
  assert.equal(sanitizeHiuiV5SourceLabel(PUBLIC_HIUI_V5_SOURCE_LABEL), PUBLIC_HIUI_V5_SOURCE_LABEL)
  assert.equal(sanitizeHiuiV5SourceLabel(''), 'manifests/hiui-v5-components.json')
})
