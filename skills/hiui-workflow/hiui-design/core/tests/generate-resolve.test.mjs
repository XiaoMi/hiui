import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { resolveGenerateEntryArgs, runGenerate } from '../generators/generate.mjs'
import { PAGEGEN_ROOT, REPO_ROOT } from '../generators/shared.mjs'

test('resolveGenerateEntryArgs keeps explicit page type and target path untouched', async () => {
  const resolved = await resolveGenerateEntryArgs({
    'page-type': 'table-stat',
    page: 'src/views/hiui-pagegen-probe/table-stat',
  })

  assert.equal(resolved.pageType, 'table-stat')
  assert.equal(resolved.targetPagePath, 'src/views/hiui-pagegen-probe/table-stat')
  assert.equal(resolved.resolutionSource, 'explicit-cli')
})

test('resolveGenerateEntryArgs auto-resolves page type when page path is explicit', async () => {
  const resolved = await resolveGenerateEntryArgs({
    change: '生成一个报名管理数据统计表页面',
    page: 'src/views/hiui-pagegen-probe/generated-table-stat',
  })

  assert.equal(resolved.pageType, 'table-stat')
  assert.equal(resolved.targetPagePath, 'src/views/hiui-pagegen-probe/generated-table-stat')
  assert.equal(resolved.resolutionSource, 'generate:lightweight-page-type-resolver')
  assert.equal(resolved.resolveResult?.status, 'ready')
})

test('resolveGenerateEntryArgs keeps tree-split on the canonical single-page path', async () => {
  const resolved = await resolveGenerateEntryArgs({
    change: '生成一个左树右表页面',
    page: 'src/views/hiui-pagegen-probe/generated-tree-split',
  })

  assert.equal(resolved.pageType, 'tree-split')
  assert.equal(resolved.targetPagePath, 'src/views/hiui-pagegen-probe/generated-tree-split')
  assert.equal(resolved.resolutionSource, 'generate:lightweight-page-type-resolver')
  assert.equal(resolved.resolveResult?.status, 'ready')
})

test('resolveGenerateEntryArgs does not misclassify tree-table as tree-split', async () => {
  const resolved = await resolveGenerateEntryArgs({
    change: '生成一个树形表格页面',
    page: 'src/views/hiui-pagegen-probe/generated-tree-table',
  })

  assert.equal(resolved.pageType, 'tree-table')
  assert.equal(resolved.targetPagePath, 'src/views/hiui-pagegen-probe/generated-tree-table')
  assert.equal(resolved.resolutionSource, 'generate:lightweight-page-type-resolver')
  assert.equal(resolved.resolveResult?.status, 'ready')
})

test('resolveGenerateEntryArgs requires explicit page path for canonical generate', async () => {
  await assert.rejects(
    () =>
      resolveGenerateEntryArgs({
        change: '生成一个报名管理数据统计表页面',
      }),
    /缺少 --page。typical-page:generate 不负责猜业务页面落点/
  )
})

test('resolveGenerateEntryArgs rejects file paths passed through --page', async () => {
  await assert.rejects(
    () =>
      resolveGenerateEntryArgs({
        'page-type': 'table-stat',
        page: 'src/views/hiui-pagegen-probe/generated-table-stat/index.tsx',
      }),
    /--page 必须指向页面目录/
  )
})

test('resolveGenerateEntryArgs requires --change when page type is omitted', async () => {
  await assert.rejects(
    () => resolveGenerateEntryArgs({ page: 'src/views/hiui-pagegen-probe/generated-table-stat' }),
    /缺少 --page-type。请显式提供 --page-type，或提供 --change 让 generate 只做轻量页型解析/
  )
})

test('resolveGenerateEntryArgs blocks composite requests and redirects to planner', async () => {
  await assert.rejects(
    () =>
      resolveGenerateEntryArgs({
        change: '生成一个统计表页面，并在同屏右侧增加详情面板',
        page: 'src/views/hiui-pagegen-probe/generated-table-stat',
      }),
    /generate page-type resolve blocked:.*same-screen composite or overlay evidence/
  )
})

test('runGenerate rejects official-runtime outside legacy-host-compatible mode', async () => {
  await assert.rejects(
    () =>
      runGenerate({
        page: 'src/views/hiui-pagegen-probe/generated-tree-table-runtime-entry',
        'page-type': 'tree-table',
        mode: 'official-runtime',
      }),
    /仅允许在 legacy-host-compatible 模式下使用 official-runtime/
  )
})

test('runGenerate defaults host-integration greenfield table-basic pages to reference-asset mode', async () => {
  const page = `src/views/hiui-pagegen-probe/reference-asset-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)
  const safeName = page.replace(/[\\/]/g, '__')
  const outputPath = path.resolve(PAGEGEN_ROOT, 'outputs', `generate-${safeName}.json`)

  try {
    await runGenerate({
      page,
      'page-type': 'table-basic',
      force: true,
      'dry-run-report': true,
    })

    const source = await fs.readFile(path.resolve(pageDir, 'index.tsx'), 'utf8')
    const meta = JSON.parse(
      await fs.readFile(path.resolve(pageDir, 'hiui-pagegen.meta.json'), 'utf8')
    )
    const output = JSON.parse(await fs.readFile(outputPath, 'utf8'))

    assert.match(source, /hiui-pagegen reference mode: explicit-asset/)
    assert.match(source, /hiui-pagegen template marker: table-basic/)
    assert.match(source, /hiui-pagegen reference strategy: copy-example-source-replace-business-slots/)
    assert.match(source, /src\/typical-page-reuse\/pages\/basic-table\.tsx/)
    assert.match(source, /hiui-pagegen generation-mode: reference-asset/)
    assert.doesNotMatch(source, /index\.module\.scss/)
    assert.equal(meta.generatorMode, 'reference-asset')
    assert.equal(meta.runtimeFamily, 'reference-asset')
    assert.equal(
      meta.assetSource,
      '.local-context/hiui-design/templates/archetypes/host-integration/table-basic/page.template.tsx'
    )
    assert.equal(meta.referenceAsset?.mode, 'explicit-asset')
    assert.equal(meta.referenceAsset?.source, 'page-type-manifest')
    assert.equal(meta.referenceAsset?.shell, 'TablePageFrame')
    assert.equal(
      meta.referenceAsset?.generationStrategy,
      'copy-example-source-replace-business-slots'
    )
    assert.equal(meta.referenceAsset?.examplePath, 'src/typical-page-reuse/pages/basic-table.tsx')
    assert.equal(
      meta.referenceAsset?.assetExamplePath,
      'examples/host-integration/src/pages/basic-table.tsx'
    )
    assert.equal(meta.referenceAsset?.canonicalComponentPath, '')
    assert.equal(output.generationMode, 'reference-asset')
    assert.equal(output.referenceAsset?.mode, 'explicit-asset')
    assert.equal(output.referenceAsset?.source, 'page-type-manifest')
  } finally {
    await fs.rm(pageDir, { recursive: true, force: true })
    await fs.rm(outputPath, { force: true })
  }
})
