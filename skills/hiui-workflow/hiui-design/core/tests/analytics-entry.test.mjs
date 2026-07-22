import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { normalizeAnalyticsArgs } from '../generators/analytics.mjs'
import { runGenerate } from '../generators/generate.mjs'
import { PAGEGEN_ROOT, REPO_ROOT } from '../generators/shared.mjs'

const analyticsSchemaPath = '.local-context/hiui-design/core/recipes/probes/data-visualization.schema.json'

test('normalizeAnalyticsArgs pins the analytics entry to data-visualization', () => {
  const resolved = normalizeAnalyticsArgs({
    page: 'src/views/dashboard/index',
    change: '生成经营分析看板',
  })

  assert.equal(resolved['page-type'], 'data-visualization')
  assert.equal(resolved.page, 'src/views/dashboard/index')
  assert.equal(resolved.change, '生成经营分析看板')
})

test('normalizeAnalyticsArgs keeps an explicit data-visualization page type', () => {
  const resolved = normalizeAnalyticsArgs({
    'page-type': 'data-visualization',
    page: 'src/views/dashboard/index',
  })

  assert.equal(resolved['page-type'], 'data-visualization')
})

test('normalizeAnalyticsArgs rejects non-analytics page types', () => {
  assert.throws(
    () =>
      normalizeAnalyticsArgs({
        'page-type': 'table-stat',
        page: 'src/views/dashboard/index',
      }),
    /typical-page:analytics 只支持 data-visualization 页型/
  )
})

test('runGenerate accepts an overridden command name for wrapper entries', async () => {
  await assert.rejects(
    () =>
      runGenerate(
        {},
        {
          commandName: 'typical-page:analytics',
        }
      ),
    /缺少 --page/
  )
})

test('analytics keeps canonical delivery mode but marks data-visualization pages as managed analytics shells', async () => {
  const page = `src/views/hiui-pagegen-probe/analytics-canonical-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)
  const safeName = page.replace(/[\\/]/g, '__')
  const outputPath = path.resolve(PAGEGEN_ROOT, 'outputs', `generate-${safeName}.json`)

  try {
    await runGenerate(
      {
        page,
        'page-type': 'data-visualization',
        schema: analyticsSchemaPath,
        change: '生成区域巡检运营看板，关注任务趋势、来源构成和区域排行',
        force: true,
        'dry-run-report': true,
      },
      {
        commandName: 'typical-page:analytics',
      }
    )

    const source = await fs.readFile(path.resolve(pageDir, 'index.tsx'), 'utf8')
    const meta = JSON.parse(
      await fs.readFile(path.resolve(pageDir, 'hiui-pagegen.meta.json'), 'utf8')
    )
    const output = JSON.parse(await fs.readFile(outputPath, 'utf8'))

    assert.match(source, /hiui-pagegen generation-mode: canonical/)
    assert.match(source, /hiui-pagegen generation-strategy: managed-analytics/)
    assert.match(source, /hiui-pagegen asset profile: managed-analytics-shell/)
    assert.match(source, /hiui-pagegen delivery role: managed-analytics-business-shell/)
    assert.match(source, /hiui-pagegen template marker: data-visualization/)
    assert.doesNotMatch(source, /useHostAdapter/)
    assert.equal(meta.generatorMode, 'canonical')
    assert.equal(meta.runtimeFamily, 'local-managed-analytics')
    assert.equal(meta.generationStrategy, 'managed-analytics')
    assert.equal(meta.assetGovernance?.profileId, 'managed-analytics-shell')
    assert.equal(meta.assetGovernance?.deliveryRole, 'managed-analytics-business-shell')
    assert.equal(output.generationMode, 'canonical')
  } finally {
    await fs.rm(pageDir, { recursive: true, force: true })
    await fs.rm(outputPath, { force: true })
  }
})

test('data-visualization generation rejects implicit probe schema fallback', async () => {
  const page = `src/views/hiui-pagegen-probe/analytics-missing-schema-${process.pid}-${Date.now()}`

  await assert.rejects(
    () =>
      runGenerate(
        {
          page,
          'page-type': 'data-visualization',
          change: '生成客服服务质量数据看板，关注响应时长和满意度',
          force: true,
          'dry-run-report': true,
        },
        {
          commandName: 'typical-page:analytics',
        }
      ),
    /不再默认回退到 probe schema/
  )
})
