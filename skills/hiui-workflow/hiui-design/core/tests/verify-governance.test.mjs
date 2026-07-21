import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { buildGenerationDecision, resolveAssetGovernanceState } from '../generators/asset-governance.mjs'
import { runGenerate } from '../generators/generate.mjs'
import { verifyPageLite } from '../verify/verify-lite.mjs'
import { verifyPageStrict } from '../verify/verify-strict.mjs'
import { PAGEGEN_ROOT, PROJECT_MODE_LOCK_PATH, REPO_ROOT } from '../generators/shared.mjs'

const PAGEGEN_SCAFFOLD_TEMPLATE_ROOT = path.resolve(
  REPO_ROOT,
  '.local-context',
  'hiui-design',
  'templates',
  'pagegen-runtime-scaffold',
  'src',
  'hiui-pagegen'
)
const PAGEGEN_SCAFFOLD_DEST_ROOT = path.resolve(REPO_ROOT, 'src', 'hiui-pagegen')

async function withTemporaryProjectMode(modePayload, run) {
  const previous = await fs.readFile(PROJECT_MODE_LOCK_PATH, 'utf8')
  await fs.writeFile(PROJECT_MODE_LOCK_PATH, `${JSON.stringify(modePayload, null, 2)}\n`, 'utf8')

  try {
    return await run()
  } finally {
    await fs.writeFile(PROJECT_MODE_LOCK_PATH, previous, 'utf8')
  }
}

function buildManagedPageOutputs(page) {
  const safeName = page.replace(/[\\/]/g, '__')
  return {
    generate: path.resolve(PAGEGEN_ROOT, 'outputs', `generate-${safeName}.json`),
    verifyLite: path.resolve(PAGEGEN_ROOT, 'outputs', `verify-lite-${safeName}.json`),
    verifyStrict: path.resolve(PAGEGEN_ROOT, 'outputs', `verify-strict-${safeName}.json`),
  }
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function seedRepoPagegenScaffoldForTests() {
  const copiedFiles = []

  async function walk(relativeDir = '') {
    const currentDir = path.join(PAGEGEN_SCAFFOLD_TEMPLATE_ROOT, relativeDir)
    const entries = await fs.readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const nextRelative = relativeDir ? path.join(relativeDir, entry.name) : entry.name
      const sourcePath = path.join(PAGEGEN_SCAFFOLD_TEMPLATE_ROOT, nextRelative)
      const destPath = path.join(PAGEGEN_SCAFFOLD_DEST_ROOT, nextRelative)

      if (entry.isDirectory()) {
        await walk(nextRelative)
        continue
      }

      if (!entry.isFile() || (await pathExists(destPath))) {
        continue
      }

      await fs.mkdir(path.dirname(destPath), { recursive: true })
      await fs.copyFile(sourcePath, destPath)
      copiedFiles.push(destPath)
    }
  }

  await walk()

  return async () => {
    for (const filePath of copiedFiles.reverse()) {
      await fs.rm(filePath, { force: true })
    }
  }
}

async function createGeneratedTableBasicPage({
  mode = '',
  projectMode = 'rules-only',
  projectType = 'greenfield',
} = {}) {
  const page = `src/views/hiui-pagegen-probe/table-basic-${mode || 'reference-asset'}-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)
  const outputs = buildManagedPageOutputs(page)
  const cleanupSeededScaffold = mode === 'canonical'
    ? await seedRepoPagegenScaffoldForTests()
    : async () => {}

  await withTemporaryProjectMode(
    {
      mode: projectMode,
      source: 'test',
      recommendedMode: projectMode,
      framework: 'react',
      projectType,
      runtime: 'webpack',
      routing: 'react-router',
      confirmedAt: new Date().toISOString(),
    },
    async () => {
      await runGenerate({
        page,
        'page-type': 'table-basic',
        change: '新增一个普通表格页面，包含筛选、表格和分页',
        force: true,
        'dry-run-report': true,
        ...(mode ? { mode } : {}),
      })
    }
  )

  return {
    page,
    pageDir,
    outputs,
    cleanup: async () => {
      await fs.rm(pageDir, { recursive: true, force: true })
      await fs.rm(outputs.generate, { force: true })
      await fs.rm(outputs.verifyLite, { force: true })
      await fs.rm(outputs.verifyStrict, { force: true })
      await cleanupSeededScaffold()
    },
  }
}

async function updateJson(filePath, transform) {
  const previous = JSON.parse(await fs.readFile(filePath, 'utf8'))
  const next = await transform(previous)
  await fs.writeFile(filePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
}

test('verifyPageLite accepts existing managed pages with governance metadata', async () => {
  const fixture = await createGeneratedTableBasicPage()

  try {
    const result = await withTemporaryProjectMode(
      {
        mode: 'rules-only',
        source: 'test',
        recommendedMode: 'rules-only',
        framework: 'react',
        projectType: 'greenfield',
        runtime: 'webpack',
        routing: 'react-router',
        confirmedAt: new Date().toISOString(),
      },
      async () => verifyPageLite(fixture.page)
    )

    assert.equal(result.status, 'passed')
    assert.equal(result.pageType, 'table-basic')
    assert.equal(result.deliveryShape, 'reference-asset-page')
  } finally {
    await fixture.cleanup()
  }
})

test('verifyPageLite rejects runtime-entry wrappers when meta still declares canonical', async () => {
  const page = `src/views/hiui-pagegen-probe/canonical-meta-runtime-entry-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)
  const verifyLiteOutput = path.resolve(
    PAGEGEN_ROOT,
    'outputs',
    `verify-lite-${page.replace(/[\\/]/g, '__')}.json`
  )
  const fixture = await createGeneratedTableBasicPage()

  try {
    await fs.mkdir(pageDir, { recursive: true })
    await fs.writeFile(
      path.resolve(pageDir, 'index.tsx'),
      `import React from 'react'
import { useHostAdapter } from '../../../hiui-pagegen/host/useHostAdapter'
import { OfficialRuntimeEntryPage } from '../../../hiui-pagegen/runtime-entry/OfficialRuntimeEntryPage'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

function CanonicalMetaRuntimeEntryPage() {
  const hostAdapter = useHostAdapter()

  return (
    <div className={styles.pageRoot} data-hiui-pagegen-template="table-basic">
      <OfficialRuntimeEntryPage
        hostAdapter={hostAdapter}
        pageType="table-basic"
        runtimePageId="basic-table"
        title="官方基础表格"
        schema={pageSchema}
      />
    </div>
  )
}

export default CanonicalMetaRuntimeEntryPage
`,
      'utf8'
    )
    await fs.writeFile(
      path.resolve(pageDir, 'index.module.scss'),
      `.pageRoot {\n  min-height: 100%;\n}\n`,
      'utf8'
    )
    await fs.copyFile(
      path.resolve(fixture.pageDir, 'page.schema.json'),
      path.resolve(pageDir, 'page.schema.json')
    )
    await fs.copyFile(
      path.resolve(fixture.pageDir, 'hiui-pagegen.meta.json'),
      path.resolve(pageDir, 'hiui-pagegen.meta.json')
    )

    await assert.rejects(
      () =>
        withTemporaryProjectMode(
          {
            mode: 'rules-only',
            source: 'test',
            recommendedMode: 'rules-only',
            framework: 'react',
            projectType: 'greenfield',
            runtime: 'webpack',
            routing: 'react-router',
            confirmedAt: new Date().toISOString(),
          },
          async () => verifyPageLite(page)
        ),
      /页面元数据声明 generationMode=reference-asset，但实际交付形态是 runtime-entry/
    )
  } finally {
    await fs.rm(pageDir, { recursive: true, force: true })
    await fs.rm(verifyLiteOutput, { force: true })
    await fixture.cleanup()
  }
})

test('verifyPageLite rejects reference-asset pages that drift from strict example parity', async () => {
  const page = `src/views/hiui-pagegen-probe/reference-asset-strict-parity-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)
  const verifyLiteOutput = path.resolve(
    PAGEGEN_ROOT,
    'outputs',
    `verify-lite-${page.replace(/[\\/]/g, '__')}.json`
  )
  const fixture = await createGeneratedTableBasicPage()

  try {
    await fs.mkdir(pageDir, { recursive: true })
    await fs.writeFile(
      path.resolve(pageDir, 'index.tsx'),
      `import React from 'react'
import styles from './index.module.scss'
import pageSchema from './page.schema.json'
import { useHostAdapter } from '../../../hiui-pagegen/host/useHostAdapter'

export default function DriftedReferenceAssetPage() {
  useHostAdapter()

  return (
    <div className={styles.pageRoot} data-hiui-pagegen-template="table-basic">
      <div>{pageSchema.title}</div>
    </div>
  )
}
`,
      'utf8'
    )
    await fs.writeFile(
      path.resolve(pageDir, 'index.module.scss'),
      `.pageRoot {\n  overflow: auto;\n}\n`,
      'utf8'
    )
    await fs.copyFile(
      path.resolve(fixture.pageDir, 'page.schema.json'),
      path.resolve(pageDir, 'page.schema.json')
    )
    await fs.copyFile(
      path.resolve(fixture.pageDir, 'hiui-pagegen.meta.json'),
      path.resolve(pageDir, 'hiui-pagegen.meta.json')
    )

    await assert.rejects(
      () =>
        withTemporaryProjectMode(
          {
            mode: 'rules-only',
            source: 'test',
            recommendedMode: 'rules-only',
            framework: 'react',
            projectType: 'greenfield',
            runtime: 'webpack',
            routing: 'react-router',
            confirmedAt: new Date().toISOString(),
          },
          async () => verifyPageLite(page)
        ),
      /strict parity/
    )
  } finally {
    await fs.rm(pageDir, { recursive: true, force: true })
    await fs.rm(verifyLiteOutput, { force: true })
    await fixture.cleanup()
  }
})

test('verifyPageLite resolves strict parity examples from installed reference assets when repo examples are unavailable', async () => {
  const page = `src/views/hiui-pagegen-probe/reference-asset-installed-example-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)
  const verifyLiteOutput = path.resolve(
    PAGEGEN_ROOT,
    'outputs',
    `verify-lite-${page.replace(/[\\/]/g, '__')}.json`
  )
  const fixture = await createGeneratedTableBasicPage()

  try {
    await fs.mkdir(pageDir, { recursive: true })
    await fs.copyFile(path.resolve(fixture.pageDir, 'index.tsx'), path.resolve(pageDir, 'index.tsx'))
    await fs.copyFile(
      path.resolve(fixture.pageDir, 'index.module.scss'),
      path.resolve(pageDir, 'index.module.scss')
    )
    await fs.copyFile(
      path.resolve(fixture.pageDir, 'page.schema.json'),
      path.resolve(pageDir, 'page.schema.json')
    )

    const meta = JSON.parse(
      await fs.readFile(path.resolve(fixture.pageDir, 'hiui-pagegen.meta.json'), 'utf8')
    )
    meta.referenceAsset = {
      ...meta.referenceAsset,
      examplePath: 'src/typical-page-reuse/pages/__missing-basic-table.tsx',
      assetExamplePath: 'examples/host-integration/src/pages/basic-table.tsx',
    }
    meta.assetGovernance = {
      ...meta.assetGovernance,
      standardsBaselinePath: 'src/typical-page-reuse/pages/__missing-basic-table.tsx',
    }
    await fs.writeFile(
      path.resolve(pageDir, 'hiui-pagegen.meta.json'),
      `${JSON.stringify(meta, null, 2)}\n`,
      'utf8'
    )

    const result = await withTemporaryProjectMode(
      {
        mode: 'rules-only',
        source: 'test',
        recommendedMode: 'rules-only',
        framework: 'react',
        projectType: 'greenfield',
        runtime: 'webpack',
        routing: 'react-router',
        confirmedAt: new Date().toISOString(),
      },
      async () => verifyPageLite(page)
    )
    assert.equal(result.status, 'passed')
    assert.equal(result.deliveryShape, 'reference-asset-page')
  } finally {
    await fs.rm(pageDir, { recursive: true, force: true })
    await fs.rm(verifyLiteOutput, { force: true })
    await fixture.cleanup()
  }
})

test('verifyPageLite rejects canonical pages that bypass a preferred reference-asset route without explicit intent', async () => {
  const fixture = await createGeneratedTableBasicPage({
    mode: 'canonical',
    projectMode: 'host-integration',
  })

  await updateJson(path.resolve(fixture.pageDir, 'hiui-pagegen.meta.json'), (meta) => {
    delete meta.generationDecision
    return meta
  })

  try {
    await assert.rejects(
      () =>
        withTemporaryProjectMode(
          {
            mode: 'host-integration',
            source: 'test',
            recommendedMode: 'host-integration',
            framework: 'react',
            projectType: 'greenfield',
            runtime: 'webpack',
            routing: 'react-router',
            confirmedAt: new Date().toISOString(),
          },
          async () => verifyPageLite(fixture.page)
        ),
      /若确需 canonical，必须显式传入 --mode canonical/
    )
  } finally {
    await fixture.cleanup()
  }
})

test('verifyPageLite accepts canonical pages when explicit canonical intent is preserved in metadata', async () => {
  const fixture = await createGeneratedTableBasicPage({
    mode: 'canonical',
    projectMode: 'host-integration',
  })

  await updateJson(path.resolve(fixture.pageDir, 'hiui-pagegen.meta.json'), (meta) => ({
    ...meta,
    generationDecision: buildGenerationDecision({
      requestedMode: 'canonical',
      governancePreferredMode: 'reference-asset',
      finalMode: 'canonical',
      projectMode: 'host-integration',
      projectType: 'greenfield',
    }),
  }))

  try {
    const result = await withTemporaryProjectMode(
      {
        mode: 'host-integration',
        source: 'test',
        recommendedMode: 'host-integration',
        framework: 'react',
        projectType: 'greenfield',
        runtime: 'webpack',
        routing: 'react-router',
        confirmedAt: new Date().toISOString(),
      },
      async () => verifyPageLite(fixture.page)
    )
    assert.equal(result.status, 'passed')
    assert.equal(result.deliveryShape, 'canonical-compat-page')
  } finally {
    await fixture.cleanup()
  }
})

test('verifyPageLite rejects canonical compatibility pages on the legacy-host-compatible mainline', async () => {
  const fixture = await createGeneratedTableBasicPage({
    mode: 'canonical',
    projectMode: 'host-integration',
  })

  await updateJson(path.resolve(fixture.pageDir, 'hiui-pagegen.meta.json'), (meta) => ({
    ...meta,
    assetGovernance: resolveAssetGovernanceState({
      pageType: 'table-basic',
      generationMode: 'canonical',
      assetSource: meta.assetSource,
      projectMode: 'legacy-host-compatible',
      projectType: 'brownfield',
    }),
    generationDecision: buildGenerationDecision({
      requestedMode: 'canonical',
      governancePreferredMode: '',
      finalMode: 'canonical',
      projectMode: 'legacy-host-compatible',
      projectType: 'brownfield',
    }),
  }))

  try {
    await assert.rejects(
      () =>
        withTemporaryProjectMode(
          {
            mode: 'legacy-host-compatible',
            source: 'test',
            recommendedMode: 'legacy-host-compatible',
            framework: 'react',
            projectType: 'brownfield',
            runtime: 'webpack',
            routing: 'react-router',
            confirmedAt: new Date().toISOString(),
          },
          async () => verifyPageLite(fixture.page)
        ),
      /legacy-host-compatible 主链下不再接受 canonical 兼容交付/
    )
  } finally {
    await fixture.cleanup()
  }
})

test('verifyPageStrict rejects official runtime entry pages outside legacy-host-compatible mode', async () => {
  const page = `src/views/hiui-pagegen-probe/invalid-runtime-entry-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)
  const safeName = page.replace(/[\\/]/g, '__')
  const verifyLiteOutput = path.resolve(PAGEGEN_ROOT, 'outputs', `verify-lite-${safeName}.json`)
  const verifyStrictOutput = path.resolve(PAGEGEN_ROOT, 'outputs', `verify-strict-${safeName}.json`)
  const fixture = await createGeneratedTableBasicPage()

  try {
    await fs.mkdir(pageDir, { recursive: true })
    await fs.writeFile(
      path.resolve(pageDir, 'index.tsx'),
      `import React from 'react'
import { useHostAdapter } from '../../../hiui-pagegen/host/useHostAdapter'
import { OfficialRuntimeEntryPage } from '../../../hiui-pagegen/runtime-entry/OfficialRuntimeEntryPage'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

function InvalidRuntimeEntryPage() {
  const hostAdapter = useHostAdapter()

  return (
    <div className={styles.pageRoot} data-hiui-pagegen-template="table-basic">
      <OfficialRuntimeEntryPage
        hostAdapter={hostAdapter}
        pageType="table-basic"
        runtimePageId="basic-table"
        title="官方基础表格"
        schema={pageSchema}
      />
    </div>
  )
}

export default InvalidRuntimeEntryPage
`,
      'utf8'
    )
    await fs.writeFile(
      path.resolve(pageDir, 'index.module.scss'),
      `.pageRoot {\n  min-height: 100%;\n}\n`,
      'utf8'
    )
    await fs.copyFile(
      path.resolve(fixture.pageDir, 'page.schema.json'),
      path.resolve(pageDir, 'page.schema.json')
    )
    await fs.writeFile(
      path.resolve(pageDir, 'hiui-pagegen.meta.json'),
      `${JSON.stringify(
        {
          generatedAt: '2026-07-14T16:00:00.000Z',
          pageType: 'table-basic',
          assetSource: '.local-context/hiui-design/core/runtime-families/official-runtime',
          schemaSource: '.local-context/hiui-design/core/recipes/probes/table-basic.schema.json',
          generator: 'hiui-pagegen',
          generatorMode: 'official-runtime',
          runtimeFamily: 'official-runtime',
          assetGovernance: {
            governanceSchemaVersion: 'asset-governance.v3',
            profileId: 'official-runtime-entry',
            assetMode: 'official-runtime-entry',
            assetClass: 'runtime-entry',
            deliveryRole: 'official-runtime-wrapper',
            standardsSource: 'hiui-design-official',
            standardsBaselineType: 'official-runtime-registry',
            standardsBaselinePath:
              '.local-context/hiui-design/core/runtime-families/official-runtime-pages.json',
            standardsVersion: null,
            syncStatus: 'managed-by-official-runtime-registry',
            lifecycle: 'preferred',
            readiness: 'production-ready',
            parityStatus: 'registry-locked',
            preferredContexts: ['legacy-host-compatible:any'],
            allowedModes: ['legacy-host-compatible'],
            truthSourcePriority: [
              'reference-asset',
              'official-runtime-entry',
              'official-mirror',
              'managed-fallback',
              'legacy',
            ],
            preferredGenerationModes: {
              'host-integration:greenfield': 'reference-asset',
              'rules-only:greenfield': 'reference-asset',
            },
            profileSource:
              '.local-context/hiui-design/core/asset-governance/governance-registry.json',
            pageTypePolicySource:
              '.local-context/hiui-design/core/asset-governance/governance-registry.json',
          },
          officialRuntime: {
            pageId: 'basic-table',
            resolvedPageId: 'basic-table',
            title: '官方基础表格',
            registrySource:
              '.local-context/hiui-design/core/runtime-families/official-runtime-pages.json',
            subappRoot: 'subapps/typical-page-shell-runtime',
          },
        },
        null,
        2
      )}\n`,
      'utf8'
    )

    await assert.rejects(
      () =>
        withTemporaryProjectMode(
          {
            mode: 'host-integration',
            source: 'test',
            recommendedMode: 'host-integration',
            framework: 'react',
            projectType: 'greenfield',
            runtime: 'webpack',
            routing: 'react-router',
            confirmedAt: new Date().toISOString(),
          },
          async () => verifyPageStrict(page)
        ),
      /仅允许在 legacy-host-compatible 模式下使用 official-runtime/
    )
  } finally {
    await fs.rm(pageDir, { recursive: true, force: true })
    await fs.rm(verifyLiteOutput, { force: true })
    await fs.rm(verifyStrictOutput, { force: true })
    await fixture.cleanup()
  }
})
