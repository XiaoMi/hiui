import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { REPO_ROOT } from '../generators/shared.mjs'
import {
  collectMissingVisualDeps,
  resolveRequestedVisualSpecIds,
  resolveVisualVerificationRuntime,
  resolveVisualSpecIdFromPagePath,
} from '../verify/verify-visual.mjs'

async function createVisualSpecPageFixture({ pageType = 'table-basic' } = {}) {
  const page = `src/views/hiui-pagegen-probe/visual-spec-${pageType}-${process.pid}-${Date.now()}`
  const pageDir = path.resolve(REPO_ROOT, page)

  await fs.mkdir(pageDir, { recursive: true })
  await fs.writeFile(
    path.resolve(pageDir, 'page.schema.json'),
    `${JSON.stringify(
      {
        pageType,
        title: '视觉校验测试页',
      },
      null,
      2
    )}\n`,
    'utf8'
  )
  await fs.writeFile(
    path.resolve(pageDir, 'hiui-pagegen.meta.json'),
    `${JSON.stringify(
      {
        pageType,
        officialRuntime: {
          pageId: pageType,
        },
      },
      null,
      2
    )}\n`,
    'utf8'
  )

  return {
    page,
    cleanup: async () => {
      await fs.rm(pageDir, { recursive: true, force: true })
    },
  }
}

test('resolveVisualSpecIdFromPagePath maps a managed page path to its pageType baseline', async () => {
  const fixture = await createVisualSpecPageFixture()

  try {
    const resolved = resolveVisualSpecIdFromPagePath(fixture.page)
    assert.equal(resolved, 'table-basic')
  } finally {
    await fixture.cleanup()
  }
})

test('resolveRequestedVisualSpecIds accepts --page-path for managed pages', async () => {
  const fixture = await createVisualSpecPageFixture()

  try {
    const resolved = resolveRequestedVisualSpecIds(
      {
        'page-path': fixture.page,
      },
      {
        specs: [{ id: 'table-basic' }, { id: 'table-stat' }],
      }
    )

    assert.deepEqual(resolved, ['table-basic'])
  } finally {
    await fixture.cleanup()
  }
})

test('resolveRequestedVisualSpecIds auto-detects page paths passed through --page', async () => {
  const fixture = await createVisualSpecPageFixture()

  try {
    const resolved = resolveRequestedVisualSpecIds(
      {
        page: fixture.page,
      },
      {
        specs: [{ id: 'table-basic' }, { id: 'table-stat' }],
      }
    )

    assert.deepEqual(resolved, ['table-basic'])
  } finally {
    await fixture.cleanup()
  }
})

test('resolveVisualSpecIdFromPagePath rejects file paths and requires a page directory', async () => {
  const fixture = await createVisualSpecPageFixture()

  try {
    assert.throws(
      () => resolveVisualSpecIdFromPagePath(`${fixture.page}/index.tsx`),
      /--page-path 必须指向页面目录/
    )
  } finally {
    await fixture.cleanup()
  }
})

test('collectMissingVisualDeps reports missing visual verification modules explicitly', () => {
  const missing = collectMissingVisualDeps((moduleName) => {
    if (moduleName === 'pixelmatch') {
      return `/mock/${moduleName}.js`
    }

    throw new Error(`missing:${moduleName}`)
  })

  assert.deepEqual(missing, ['playwright', 'pngjs'])
})

test('resolveVisualVerificationRuntime blocks when downstream projects cannot provide baseline diff runtime', () => {
  const runtime = resolveVisualVerificationRuntime({
    args: {},
    subappRootExists: false,
    officialUrlReady: false,
  })

  assert.equal(runtime.status, 'blocked')
  assert.match(runtime.reason, /缺少 .*typical-page-shell-runtime/)
})

test('resolveVisualVerificationRuntime marks project-url-only mode as limited evidence when --url is provided', () => {
  const runtime = resolveVisualVerificationRuntime({
    args: {
      url: 'http://127.0.0.1:4174/customer-service/service-quality-dashboard',
    },
    subappRootExists: false,
    officialUrlReady: false,
  })

  assert.equal(runtime.status, 'project-url-only')
  assert.equal(runtime.explicitUrl, 'http://127.0.0.1:4174/customer-service/service-quality-dashboard')
})
