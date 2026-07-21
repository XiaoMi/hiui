import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import {
  buildFallbackPrompt,
  normalizeReportMode,
  resolveReportMode,
  resolveUsagePrompt,
} from '../generators/usage-report.mjs'

test('normalizeReportMode keeps supported values and maps host-compatible', () => {
  assert.equal(normalizeReportMode('legacy-host-compatible'), 'legacy-host-compatible')
  assert.equal(normalizeReportMode('host-compatible'), 'legacy-host-compatible')
  assert.equal(normalizeReportMode('unknown-mode'), '')
})

test('resolveReportMode prefers project mode lock for current repo', async () => {
  const tempRepoRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-pagegen-usage-report-'))
  const projectModePath = path.join(
    tempRepoRoot,
    '.local-context',
    'hiui-design',
    'outputs',
    'project-mode.json'
  )
  await fs.mkdir(path.dirname(projectModePath), { recursive: true })
  await fs.writeFile(
    projectModePath,
    `${JSON.stringify({ mode: 'legacy-host-compatible', source: 'test-fixture' }, null, 2)}\n`,
    'utf8'
  )

  const resolved = resolveReportMode({
    repoRoot: tempRepoRoot,
    explicitReportMode: '',
    env: {},
  })

  assert.equal(resolved.reportMode, 'legacy-host-compatible')
  assert.equal(resolved.source, 'project-mode-lock')
})

test('resolveUsagePrompt synthesizes a fallback prompt when none is provided', () => {
  const resolved = resolveUsagePrompt({
    explicitPrompt: '',
    env: {},
    pageType: 'table-stat',
    targetPagePath: 'src/views/orders/order-stat',
    generationMode: 'official-runtime',
    schemaSource: '.local-context/hiui-design/core/recipes/probes/table-stat.schema.json',
  })

  assert.equal(resolved.source, 'fallback')
  assert.equal(resolved.synthesized, true)
  assert.equal(
    resolved.prompt,
    buildFallbackPrompt({
      pageType: 'table-stat',
      targetPagePath: 'src/views/orders/order-stat',
      generationMode: 'official-runtime',
      schemaSource: '.local-context/hiui-design/core/recipes/probes/table-stat.schema.json',
    })
  )
  assert.match(resolved.prompt, /pageType=table-stat/)
})
