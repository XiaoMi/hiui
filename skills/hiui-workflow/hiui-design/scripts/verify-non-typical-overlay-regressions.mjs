#!/usr/bin/env node

import assert from 'node:assert'
import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  getManagedPageSourceCommentLines,
  getManagedPageSourceOwnershipAttributes,
  getManagedPageSourceRootAttributes,
  validateManagedPageSource,
} from './lib/managed-page-source-guard.mjs'
import {
  buildRulesOnlyPageContract,
  renderRulesOnlyPageContractMarkdown,
  toContractSlug,
} from './lib/rules-only-page-contracts.mjs'

const currentFilePath = fileURLToPath(import.meta.url)
const scriptDir = path.dirname(currentFilePath)
const startPageScriptPath = path.join(scriptDir, 'typical-page-start-page.mjs')
const runtimeSmokeScriptPath = path.join(scriptDir, 'typical-page-runtime-smoke.mjs')

const generatedPagePath = path.join('src', 'pages', 'synthetic-non-typical-overlay', 'index.jsx')
const HEIGHT_CHAIN_MARKER = 'does not keep the list-page height chain'
const STICKY_PAGINATION_MARKER = 'does not keep pagination bottom-docked inside the list workspace'

function buildTableBasicOverlayContract(options = {}) {
  const { includeTopology = true } = options

  return buildRulesOnlyPageContract({
    pageType: {
      id: 'table-basic',
      label: '普通表格',
      shell: 'TablePageFrame',
      assetExamplePath: 'examples/host-integration/src/pages/basic-table.tsx',
    },
    generatedPagePath,
    hostArchetypePath: '@hiui-design/typical-page-shells/pro-table-page::TablePageFrame',
    archetypeMode: 'host-integration',
    scrollStrategy: 'table-body-scroll',
    ...(includeTopology
      ? {
          topology: 'non-typical-overlay',
          layoutStrategy: 'parallel-sections',
          nonTypicalScope: ['filter-pane', 'review-list', 'trend-chart', 'detail-body'],
          runtimeSmokePlan: {
            required: true,
            reason:
              'non-typical-overlay pages combine a typical page shell with additional cross-region layout, so they must prove the composed runtime behavior in a real browser.',
          },
        }
      : {}),
    regionMapping: [
      { region: 'header', target: 'ManagedWorkbenchPageFrame.header' },
      { region: 'white-body', target: 'ManagedWorkbenchPageFrame.whiteBody' },
      { region: 'query-filter', target: 'filter side pane' },
      { region: 'table', target: 'review table panel' },
      { region: 'pagination', target: 'review table pagination' },
    ],
    ownershipMode: 'page-surface-owns-workspace',
    ownershipMapping: [
      { role: 'content-slot', target: 'ManagedWorkbenchPageFrame.root' },
      { role: 'white-body', target: 'ManagedWorkbenchPageFrame.whiteBody' },
      { role: 'outer-padding', target: 'ManagedWorkbenchPageFrame.root' },
      { role: 'main-scroll', target: 'ManagedWorkbenchPageFrame.workspaceScroll' },
    ],
    adapterContract: {
      requiredCapabilities: ['header-slot', 'white-body', 'query-filter', 'table', 'pagination'],
      allowedOverrides: [],
      forbiddenEscapes: [],
      localBypasses: [],
    },
    semanticContract: {
      queryFilterRegionRole: 'table-query-filter',
      dimensionSwitchControl: 'not-applicable',
      listShellComposition: 'page-type-shell',
      spacingOwnership: 'single-owner',
      areaChartFill: 'not-applicable',
    },
    workflow: {
      status: 'started',
      deliveryStatus: 'not-finalized',
      preflightStatus: 'not-run',
      sourceGateStatus: 'not-run',
      doctorStatus: 'not-run',
      lastCommand: 'verify-non-typical-overlay-regressions',
    },
  })
}

function renderJsxAttributes(attributes) {
  return attributes.map((attr) => `${attr.name}="${attr.value}"`).join('\n      ')
}

function renderSyntheticOverlaySource(contract) {
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const ownershipAttrs = new Map(
    getManagedPageSourceOwnershipAttributes(contract).map((attr) => [attr.role, attr])
  )

  return `import styles from './overlay.module.scss'

/* hiui-design shell-carrier: ManagedWorkbenchPageFrame */
/* hiui-design shell-inheritance: shared-shell-carrier */
${commentLines.map((line) => `/* ${line} */`).join('\n')}

export default function SyntheticNonTypicalOverlayPage() {
  return (
    <main
      className={styles.pageRoot}
      ${renderJsxAttributes(rootAttrs)}
      data-hiui5-shell-carrier="ManagedWorkbenchPageFrame"
      data-hiui5-shell-inheritance="shared-shell-carrier"
      ${ownershipAttrs.get('content-slot')?.name || 'data-hiui5-owner-content-slot'}="true"
      ${ownershipAttrs.get('outer-padding')?.name || 'data-hiui5-owner-outer-padding'}="true"
      ${ownershipAttrs.get('main-scroll')?.name || 'data-hiui5-owner-main-scroll'}="true"
    >
      <header data-hiui5-region="header" />
      <section
        className={styles.whiteBody}
        data-hiui5-region="white-body"
        ${ownershipAttrs.get('white-body')?.name || 'data-hiui5-owner-white-body'}="true"
      >
        <aside className={styles.filterPane} data-hiui5-region="query-filter" />
        <section className={styles.mainPane}>
          <section className={styles.trendPanel} data-hiui5-non-typical-region="trend-chart" />
          <section className={styles.tableRegion} data-hiui5-region="table">
            <div className="hi-v5-table" />
            <div data-hiui5-region="pagination" />
          </section>
        </section>
      </section>
    </main>
  )
}
`
}

function renderSyntheticOverlayStyle() {
  return `.pageRoot {
  min-height: 100vh;
  overflow: visible;
}

.whiteBody {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 16px;
  overflow: visible;
}

.filterPane {
  min-height: 720px;
}

.mainPane {
  min-width: 0;
}

.trendPanel {
  min-height: 120px;
}

.tableRegion {
  min-width: 0;
  padding-inline: 20px;
}
`
}

function renderSyntheticOverlayHtml() {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>synthetic non-typical overlay</title>
    <style>
      html,
      body {
        margin: 0;
        min-height: 100%;
      }

      body {
        font-family: Arial, sans-serif;
      }

      [data-hiui5-page-type='table-basic'] {
        width: 1184px;
        min-height: 1200px;
        margin: 0 auto;
        overflow: visible;
      }

      [data-hiui5-region='header'] {
        box-sizing: border-box;
        height: 60px;
        display: flex;
        align-items: center;
      }

      .hi-v5-page-header__title {
        font-size: 18px;
        font-weight: 600;
      }

      .hi-v5-page-header__extra {
        margin-left: auto;
      }

      [data-hiui5-region='white-body'] {
        box-sizing: border-box;
        height: 1140px;
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
        gap: 16px;
        overflow: visible;
      }

      [data-hiui5-region='query-filter'] {
        min-height: 1106px;
      }

      .main-pane {
        min-width: 0;
        padding-top: 120px;
      }

      .trend-panel {
        height: 64px;
      }

      [data-hiui5-region='table'] {
        box-sizing: border-box;
        min-width: 0;
        padding-inline: 20px;
        overflow: visible;
      }
    </style>
  </head>
  <body>
    <main
      data-hiui5-page-type="table-basic"
      data-hiui5-topology="non-typical-overlay"
      data-hiui5-shell="TablePageFrame"
      data-hiui5-scroll-strategy="table-body-scroll"
    >
      <header data-hiui5-region="header">
        <div class="hi-v5-page-header__title">Synthetic overlay</div>
        <div class="hi-v5-page-header__extra">Actions</div>
      </header>
      <section data-hiui5-region="white-body">
        <aside data-hiui5-region="query-filter"></aside>
        <section class="main-pane">
          <section class="trend-panel"></section>
          <section data-hiui5-region="table">
            <div style="height: 280px"></div>
            <div data-hiui5-region="pagination"></div>
          </section>
        </section>
      </section>
    </main>
  </body>
</html>
`
}

async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function removeTree(targetPath) {
  if (!(await pathExists(targetPath))) {
    return
  }

  const stat = await fs.lstat(targetPath)
  if (!stat.isDirectory()) {
    await fs.unlink(targetPath)
    return
  }

  const entries = await fs.readdir(targetPath)
  for (const entry of entries) {
    await removeTree(path.join(targetPath, entry))
  }
  await fs.rmdir(targetPath)
}

async function writeSyntheticSourceFixture(tempRoot, contract) {
  await ensureDir(path.dirname(path.join(tempRoot, generatedPagePath)))
  await fs.writeFile(path.join(tempRoot, generatedPagePath), renderSyntheticOverlaySource(contract), 'utf8')
  await fs.writeFile(
    path.join(tempRoot, 'src', 'pages', 'synthetic-non-typical-overlay', 'overlay.module.scss'),
    renderSyntheticOverlayStyle(),
    'utf8'
  )
}

async function writeRuntimeSmokeContractFixture(tempRoot, contract) {
  const contractSlug = toContractSlug(generatedPagePath.replace(/\.[cm]?[jt]sx?$/, ''))
  const contractDir = path.join(tempRoot, '.local-context', 'hiui-design', 'outputs', 'page-contracts')
  await ensureDir(contractDir)
  await fs.writeFile(path.join(contractDir, `${contractSlug}.json`), `${JSON.stringify(contract, null, 2)}\n`, 'utf8')
  await fs.writeFile(path.join(contractDir, `${contractSlug}.md`), renderRulesOnlyPageContractMarkdown(contract), 'utf8')
}

function findMarkerMessage(errors, marker) {
  return errors.find((item) => item.includes(marker)) || ''
}

function runNodeScript(scriptPath, args, cwd) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    encoding: 'utf8',
    env: process.env,
  })

  if (result.error) {
    throw result.error
  }

  return result
}

function runNodeScriptAsync(scriptPath, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd,
      encoding: 'utf8',
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('error', reject)
    child.on('close', (status) => {
      resolve({
        status,
        stdout,
        stderr,
      })
    })
  })
}

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })

  const address = server.address()
  assert(address && typeof address === 'object', 'Expected local HTTP server to expose an address.')
  return `http://127.0.0.1:${address.port}/synthetic-non-typical-overlay`
}

async function closeServer(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error)
      else resolve()
    })
  })
}

async function main() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-non-typical-overlay-'))
  const overlayContract = buildTableBasicOverlayContract({ includeTopology: true })
  const pureTableContract = buildTableBasicOverlayContract({ includeTopology: false })
  let server = null

  try {
    await fs.writeFile(
      path.join(tempRoot, 'package.json'),
      `${JSON.stringify({ name: 'hiui-non-typical-overlay-fixture', private: true, version: '0.0.0' }, null, 2)}\n`,
      'utf8'
    )

    await writeSyntheticSourceFixture(tempRoot, overlayContract)
    const overlaySourceErrors = validateManagedPageSource({
      contract: overlayContract,
      generatedPagePath,
      targetRoot: tempRoot,
    })

    const overlayHeightMessage = findMarkerMessage(overlaySourceErrors, HEIGHT_CHAIN_MARKER)
    const overlayStickyMessage = findMarkerMessage(overlaySourceErrors, STICKY_PAGINATION_MARKER)
    assert.strictEqual(
      overlayHeightMessage,
      '',
      `non-typical-overlay should not inherit pure list height-chain failure: ${overlayHeightMessage}`
    )
    assert.strictEqual(
      overlayStickyMessage,
      '',
      `non-typical-overlay should not inherit pure list sticky-pagination failure: ${overlayStickyMessage}`
    )

    await writeSyntheticSourceFixture(tempRoot, pureTableContract)
    const pureSourceErrors = validateManagedPageSource({
      contract: pureTableContract,
      generatedPagePath,
      targetRoot: tempRoot,
    })
    const pureHeightMessage = findMarkerMessage(pureSourceErrors, HEIGHT_CHAIN_MARKER)
    const pureStickyMessage = findMarkerMessage(pureSourceErrors, STICKY_PAGINATION_MARKER)
    assert(
      pureHeightMessage,
      'pure table-basic contract should still fail the list height-chain guard for the same side-pane source.'
    )
    assert(
      pureStickyMessage,
      'pure table-basic contract should still fail the sticky-pagination guard for the same side-pane source.'
    )

    const startPageRoot = path.join(tempRoot, 'start-page-contract')
    await ensureDir(startPageRoot)
    await fs.writeFile(
      path.join(startPageRoot, 'package.json'),
      `${JSON.stringify({ name: 'hiui-overlay-start-page-fixture', private: true, version: '0.0.0' }, null, 2)}\n`,
      'utf8'
    )
    const startPageResult = runNodeScript(
      startPageScriptPath,
      [
        '--target',
        startPageRoot,
        '--mode',
        'host-integration',
        '--page-type',
        'table-basic',
        '--page',
        generatedPagePath,
        '--topology',
        'non-typical-overlay',
        '--layout-strategy',
        'parallel-sections',
        '--non-typical-scope',
        'filter-pane,review-list,trend-chart,detail-body',
        '--runtime-smoke',
        'auto',
        '--json',
      ],
      startPageRoot
    )
    assert.strictEqual(
      startPageResult.status,
      0,
      `start-page overlay fixture failed.\nstdout:\n${startPageResult.stdout}\nstderr:\n${startPageResult.stderr}`
    )
    const startPageJson = JSON.parse(String(startPageResult.stdout || '').trim())
    assert.strictEqual(startPageJson.topology?.id, 'non-typical-overlay')
    assert.strictEqual(startPageJson.layoutStrategy, 'parallel-sections')
    assert.deepStrictEqual(startPageJson.nonTypicalScope, [
      'filter-pane',
      'review-list',
      'trend-chart',
      'detail-body',
    ])
    assert.strictEqual(startPageJson.runtimeSmokePlan?.required, true)
    assert.strictEqual(startPageJson.contract?.workflow?.runtimeSmokeStatus, 'not-run')

    await writeSyntheticSourceFixture(tempRoot, overlayContract)
    await writeRuntimeSmokeContractFixture(tempRoot, overlayContract)
    server = http.createServer((request, response) => {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
      response.end(renderSyntheticOverlayHtml())
    })
    const url = await listen(server)
    const runtimeSmokeResult = await runNodeScriptAsync(
      runtimeSmokeScriptPath,
      ['--target', tempRoot, '--url', url, '--page', generatedPagePath, '--profile', 'dom'],
      tempRoot
    )
    assert.strictEqual(
      runtimeSmokeResult.status,
      0,
      `runtime-smoke overlay fixture failed.\nstdout:\n${runtimeSmokeResult.stdout}\nstderr:\n${runtimeSmokeResult.stderr}`
    )
    assert.match(runtimeSmokeResult.stdout, /topology: non-typical-overlay/)
    assert.match(runtimeSmokeResult.stdout, /scroll strategy matches contract/)
    assert.match(runtimeSmokeResult.stdout, /overlay query-filter is allowed to render as a managed side pane/)
    assert.match(runtimeSmokeResult.stdout, /overlay table region is allowed to sit beside the query-filter pane/)

    console.log('[verify-non-typical-overlay-regressions] PASS')
    console.log(`- pure table-basic height-chain regression remains caught: ${pureHeightMessage}`)
    console.log(`- pure table-basic sticky-pagination regression remains caught: ${pureStickyMessage}`)
    console.log('- non-typical-overlay source guard skips the two pure list false positives')
    console.log('- start-page writes topology/layout/nonTypicalScope/runtimeSmokePlan')
    console.log('- runtime-smoke validates overlay DOM semantics and passes')
  } finally {
    if (server) {
      await closeServer(server)
    }
    await removeTree(tempRoot)
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[verify-non-typical-overlay-regressions] ${message}`)
  process.exit(1)
})
