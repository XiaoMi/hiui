#!/usr/bin/env node

import assert from 'node:assert'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const currentFilePath = fileURLToPath(import.meta.url)
const scriptDir = path.dirname(currentFilePath)
const startPageScriptPath = path.join(scriptDir, 'typical-page-start-page.mjs')
const writeContractScriptPath = path.join(scriptDir, 'write-rules-only-page-contract.mjs')
const preflightScriptPath = path.join(scriptDir, 'typical-page-preflight.mjs')
const previewReadyScriptPath = path.join(scriptDir, 'report-preview-ready-usage.mjs')

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

async function writeFixturePackageJson(targetRoot, packageName) {
  await ensureDir(targetRoot)
  await fs.writeFile(
    path.join(targetRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: packageName,
        private: true,
        version: '0.0.0',
      },
      null,
      2
    )}\n`,
    'utf8'
  )
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

function parseJsonOutput(result, label) {
  const stdout = String(result.stdout || '').trim()
  if (!stdout) {
    throw new Error(`${label} did not emit JSON output.\nstderr:\n${result.stderr || ''}`)
  }

  try {
    return JSON.parse(stdout)
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`${label} emitted invalid JSON: ${detail}\nstdout:\n${stdout}\nstderr:\n${result.stderr || ''}`)
  }
}

function assertRequiredRegions(contract, expectedRegions) {
  const actualRegions = Array.isArray(contract?.regionMapping)
    ? contract.regionMapping.map((item) => String(item?.region || '').trim())
    : []

  for (const expectedRegion of expectedRegions) {
    assert(
      actualRegions.includes(expectedRegion),
      `Expected contract to keep region ${expectedRegion}, received: ${actualRegions.join(', ')}`
    )
  }
}

async function readJson(targetPath) {
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

async function main() {
  if (!(await pathExists(previewReadyScriptPath))) {
    console.log('[verify-managed-chart-flow-regressions] SKIP: report-preview-ready-usage.mjs is not shipped in this package scope.')
    return
  }

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-chart-flow-'))
  const detailRoot = path.join(tempRoot, 'full-page-detail-chart-section')
  const statRoot = path.join(tempRoot, 'table-stat-chart-section')
  const contractReuseRoot = path.join(tempRoot, 'write-contract-reuse')

  try {
    await writeFixturePackageJson(detailRoot, 'managed-chart-detail-fixture')
    await writeFixturePackageJson(statRoot, 'managed-chart-stat-fixture')
    await writeFixturePackageJson(contractReuseRoot, 'managed-chart-contract-fixture')

    const detailStartResult = runNodeScript(
      startPageScriptPath,
      [
        '--mode',
        'rules-only',
        '--target',
        detailRoot,
        '--page-type',
        'full-page-detail',
        '--page',
        'src/pages/detail/index.jsx',
        '--region',
        'chart-section=analytics-pane',
      ],
      detailRoot
    )
    assert.strictEqual(
      detailStartResult.status,
      0,
      `full-page-detail start-page failed.\nstdout:\n${detailStartResult.stdout}\nstderr:\n${detailStartResult.stderr}`
    )

    const detailContractPath = path.join(
      detailRoot,
      '.local-context',
      'hiui-design',
      'outputs',
      'page-contracts',
      'src__pages__detail__index.json'
    )
    const detailEntryPath = path.join(detailRoot, 'src', 'pages', 'detail', 'index.jsx')
    const detailSectionsPath = path.join(detailRoot, 'src', 'pages', 'detail', 'sections.jsx')
    const detailContract = await readJson(detailContractPath)
    const detailEntryRaw = await fs.readFile(detailEntryPath, 'utf8')
    const detailSectionsRaw = await fs.readFile(detailSectionsPath, 'utf8')

    assertRequiredRegions(detailContract, ['header', 'white-body', 'detail-body', 'chart-section'])
    assert(
      /chartSection=\{<DetailSupportingSections \/>}/.test(detailEntryRaw),
      'full-page-detail start-page should wire chartSection into ManagedFullPageDetailShell when chart-section is declared.'
    )
    assert(
      /SectionBlock region="chart-section"/.test(detailSectionsRaw),
      'full-page-detail sections artifact should expose a managed chart-section block.'
    )

    const detailPreflightResult = runNodeScript(
      preflightScriptPath,
      ['--target', detailRoot, '--page', 'src/pages/detail/index.jsx', '--json'],
      detailRoot
    )
    assert.strictEqual(
      detailPreflightResult.status,
      1,
      'full-page-detail preflight fixture should still fail because TODO mappings remain unresolved.'
    )
    const detailPreflightJson = parseJsonOutput(detailPreflightResult, 'full-page-detail preflight')
    assert.strictEqual(detailPreflightJson.managedChartSection, 'declared')
    assert.match(
      String(detailPreflightJson.chartGovernance || ''),
      /original page type/i,
      'preflight should explain that chart-section does not promote full-page-detail into data-visualization.'
    )

    const statStartResult = runNodeScript(
      startPageScriptPath,
      [
        '--mode',
        'rules-only',
        '--target',
        statRoot,
        '--page-type',
        'table-stat',
        '--page',
        'src/pages/table-stat/index.jsx',
        '--region',
        'chart-section=analytics-pane',
      ],
      statRoot
    )
    assert.strictEqual(
      statStartResult.status,
      0,
      `table-stat start-page failed.\nstdout:\n${statStartResult.stdout}\nstderr:\n${statStartResult.stderr}`
    )

    const statEntryPath = path.join(statRoot, 'src', 'pages', 'table-stat', 'index.jsx')
    const statEntryRaw = await fs.readFile(statEntryPath, 'utf8')
    assert(
      /data-hiui5-region="chart-section"/.test(statEntryRaw),
      'table-stat template should emit data-hiui5-region="chart-section" when chart-section is declared.'
    )
    assert(
      /hiui-design chart-stack: approved-wrapper/.test(statEntryRaw),
      'table-stat template should keep the approved-wrapper marker on optional chart-section placeholders.'
    )

    const previewReadyResult = runNodeScript(
      previewReadyScriptPath,
      [
        '--target',
        statRoot,
        '--page',
        'src/pages/table-stat/index.jsx',
        '--report-mode',
        'rules-only',
        '--prompt',
        'managed chart flow regression',
        '--allow-static-fallback',
        '--dry-run',
      ],
      statRoot
    )
    assert.strictEqual(
      previewReadyResult.status,
      0,
      'preview-ready fixture should now pass via the lightweight static fallback when the page file exists.'
    )
    const previewReadyJson = parseJsonOutput(previewReadyResult, 'table-stat preview-ready')
    assert.strictEqual(previewReadyJson.previewReady, true)
    assert.strictEqual(previewReadyJson.managedChartSection, 'declared')
    assert.match(String(previewReadyJson.chartGovernance || ''), /original page type/i)
    assert.strictEqual(previewReadyJson.usedStaticFallback, true)
    assert(
      Array.isArray(previewReadyJson.requiredRegions) &&
        previewReadyJson.requiredRegions.includes('chart-section'),
      'preview-ready payload should carry chart-section in requiredRegions once the contract declares it.'
    )
    const chartGovernanceCheck = Array.isArray(previewReadyJson.checks)
      ? previewReadyJson.checks.find((item) => item?.key === 'chart-governance')
      : null
    assert(chartGovernanceCheck, 'preview-ready payload should expose a chart-governance check.')
    assert.strictEqual(chartGovernanceCheck?.ok, true)

    const existingContractPath = path.join(
      contractReuseRoot,
      '.local-context',
      'hiui-design',
      'outputs',
      'page-contracts',
      'src__pages__table-stat__index.json'
    )
    await ensureDir(path.dirname(existingContractPath))
    await fs.writeFile(
      existingContractPath,
      `${JSON.stringify(
        {
          version: 12,
          pageTypeId: 'table-stat',
          ownershipMode: 'host-slot-owns-workspace',
          regionMapping: [
            { region: 'header', target: 'old-header' },
            { region: 'white-body', target: 'old-white-body' },
            { region: 'stat-section', target: 'old-stat' },
            { region: 'query-filter', target: 'old-query' },
            { region: 'table', target: 'old-table' },
            { region: 'pagination', target: 'old-pagination' },
            { region: 'legacy-extra', target: 'old-extra' },
          ],
          ownershipMapping: [
            { role: 'content-slot', target: 'old-content-slot' },
            { role: 'white-body', target: 'old-white-body-owner' },
            { role: 'outer-padding', target: 'old-outer-padding' },
            { role: 'main-scroll', target: 'old-main-scroll' },
            { role: 'legacy-role', target: 'old-legacy-role' },
          ],
          workflow: {},
        },
        null,
        2
      )}\n`,
      'utf8'
    )

    const writeContractResult = runNodeScript(
      writeContractScriptPath,
      [
        '--target',
        contractReuseRoot,
        '--mode',
        'rules-only',
        '--page-type',
        'table-stat',
        '--page',
        'src/pages/table-stat/index.jsx',
        '--archetype',
        'src/host/table-stat-archetype.jsx',
        '--region',
        'chart-section=new-chart-slot',
      ],
      contractReuseRoot
    )
    assert.strictEqual(
      writeContractResult.status,
      0,
      `write-contract reuse fixture failed.\nstdout:\n${writeContractResult.stdout}\nstderr:\n${writeContractResult.stderr}`
    )

    const reusedContract = await readJson(existingContractPath)
    assertRequiredRegions(reusedContract, [
      'header',
      'white-body',
      'stat-section',
      'query-filter',
      'table',
      'pagination',
      'chart-section',
    ])
    assert.strictEqual(
      reusedContract.regionMapping.find((item) => item.region === 'chart-section')?.target,
      'new-chart-slot'
    )
    assert.strictEqual(
      reusedContract.regionMapping.find((item) => item.region === 'legacy-extra')?.target,
      'old-extra'
    )
    assert.strictEqual(reusedContract.ownershipMode, 'host-slot-owns-workspace')
    assert.strictEqual(
      reusedContract.ownershipMapping.find((item) => item.role === 'legacy-role')?.target,
      'old-legacy-role'
    )
    assert.match(String(writeContractResult.stdout || ''), /managed chart section: declared/)

    console.log('[verify-managed-chart-flow-regressions] PASS')
    console.log('- full-page-detail start-page keeps original page type while wiring a declared chart-section into scaffold + preflight output')
    console.log('- table-stat start-page and preview-ready payload both expose declared chart-section with global chart governance wording')
    console.log('- write-contract keeps required regions, preserves existing mappings, and appends chart-section as an additive managed region')
  } finally {
    await removeTree(tempRoot)
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[verify-managed-chart-flow-regressions] ${message}`)
  process.exit(1)
})
