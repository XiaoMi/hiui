import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { pathToFileURL } from 'url'
import {
  OFFICIAL_RUNTIME_REGISTRY_PATH,
  PAGEGEN_ROOT,
  REPO_ROOT,
  assert,
  parseArgs,
  readJson,
  readOfficialRuntimeRegistry,
  relativeToRoot,
  writeJson,
} from '../generators/shared.mjs'
import { normalizeGenerationMode } from '../generators/asset-governance.mjs'
import { verifyPageLite } from './verify-lite.mjs'

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function extractTarEntry(tarballPath, entryPath) {
  try {
    return execFileSync('tar', ['-xOf', tarballPath, entryPath], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  } catch (error) {
    throw new Error(
      `无法读取官方 snapshot：${relativeToRoot(tarballPath)}#${entryPath}\n${error.stderr || error.message}`
    )
  }
}

function expectTokensPresent(raw, tokens, ownerLabel, failures) {
  tokens.forEach((token) => {
    if (!raw.includes(token)) {
      failures.push(`${ownerLabel} 缺少关键片段：${token}`)
    }
  })
}

function expectTokensAbsent(raw, tokens, ownerLabel, failures) {
  tokens.forEach((token) => {
    if (raw.includes(token)) {
      failures.push(`${ownerLabel} 出现禁止片段：${token}`)
    }
  })
}

function expectRegionOrder(raw, regions, ownerLabel, failures) {
  if (!Array.isArray(regions) || regions.length === 0) {
    return
  }

  let previousIndex = -1

  regions.forEach((region) => {
    const marker = `data-hiui5-region="${region}"`
    const index = raw.indexOf(marker)

    if (index < 0) {
      failures.push(`${ownerLabel} 缺少区域标记：${marker}`)
      return
    }

    if (index <= previousIndex) {
      failures.push(
        `${ownerLabel} 区域顺序错误：${region} 必须位于前序区域之后（期望顺序：${regions.join(' -> ')}）`
      )
      return
    }

    previousIndex = index
  })
}

function resolveOfficialBaseline(parity) {
  if (parity.officialSnapshot) {
    const tarballPath = path.resolve(REPO_ROOT, parity.officialSnapshot.tarball)
    const entryPath = parity.officialSnapshot.entry

    return {
      label: `官方 ${parity.pageType} snapshot`,
      raw: extractTarEntry(tarballPath, entryPath),
      checkedFile: `${parity.officialSnapshot.tarball}#${entryPath}`,
      requiredTokens: parity.officialSnapshot.requiredTokens || [],
      forbiddenTokens: parity.officialSnapshot.forbiddenTokens || [],
    }
  }

  if (parity.officialSource) {
    const sourcePath = path.resolve(REPO_ROOT, parity.officialSource.path)
    assert(fs.existsSync(sourcePath), `缺少官方 baseline 源文件：${relativeToRoot(sourcePath)}`)

    return {
      label: `官方 ${parity.pageType} 参考实现`,
      raw: readText(sourcePath),
      checkedFile: relativeToRoot(sourcePath),
      requiredTokens: parity.officialSource.requiredTokens || [],
      forbiddenTokens: parity.officialSource.forbiddenTokens || [],
    }
  }

  throw new Error(`parity manifest 缺少官方 baseline：${parity.pageType}`)
}

function isManagedAnalyticsShell(assetGovernance = {}) {
  const profileId = String(assetGovernance?.profileId || '').trim()
  const deliveryRole = String(assetGovernance?.deliveryRole || '').trim()

  return (
    profileId === 'managed-analytics-shell' ||
    deliveryRole === 'managed-analytics-business-shell'
  )
}

function resolveGeneratedParityContract({
  parity,
  pageType,
  generationMode,
  assetGovernance,
}) {
  if (generationMode === 'reference-asset') {
    return {
      contract: {
        requiredTokens:
          parity.referenceAssetPage?.requiredTokens ||
          parity.canonicalSource?.requiredTokens ||
          parity.generatedPage?.requiredTokens ||
          [],
        forbiddenTokens:
          parity.referenceAssetPage?.forbiddenTokens || parity.generatedPage?.forbiddenTokens || [],
      },
      ownerLabel: `${pageType} reference-asset 业务页`,
      strictChecks: ['reference-asset-page-parity-manifest'],
    }
  }

  if (isManagedAnalyticsShell(assetGovernance)) {
    return {
      contract: parity.managedAnalyticsWrapper || {
        requiredTokens: [
          'CanonicalDataVisualizationPage',
          'schema={schema}',
          'className={styles.pageRoot}',
        ],
        forbiddenTokens: ['useHostAdapter', 'OfficialRuntimeEntryPage', '.local-context/hiui-design'],
      },
      ownerLabel: `${pageType} managed analytics wrapper`,
      strictChecks: ['managed-analytics-wrapper-parity-manifest'],
    }
  }

  return {
    contract: parity.generatedPage || { requiredTokens: [], forbiddenTokens: [] },
    ownerLabel: `${pageType} 生成页`,
    strictChecks: ['generated-page-parity-manifest'],
  }
}

function runParityChecks(targetPagePath, pageType, generationMode = 'canonical', assetGovernance = null) {
  const parityPath = path.resolve(PAGEGEN_ROOT, 'parity', `${pageType}.json`)
  assert(fs.existsSync(parityPath), `缺少 parity manifest：${relativeToRoot(parityPath)}`)
  const parity = readJson(parityPath)
  const pageDir = path.resolve(REPO_ROOT, targetPagePath)
  const pageFile = path.resolve(pageDir, 'index.tsx')
  const pageRaw = readText(pageFile)
  const failures = []
  const checkedFiles = [relativeToRoot(pageFile)]
  const strictChecks = ['official-baseline-required-tokens']
  const officialBaseline = resolveOfficialBaseline(parity)
  const generatedParityContract = resolveGeneratedParityContract({
    parity,
    pageType,
    generationMode,
    assetGovernance,
  })

  checkedFiles.push(officialBaseline.checkedFile)
  strictChecks.push(...generatedParityContract.strictChecks)
  expectTokensPresent(officialBaseline.raw, officialBaseline.requiredTokens, officialBaseline.label, failures)
  expectTokensAbsent(officialBaseline.raw, officialBaseline.forbiddenTokens, officialBaseline.label, failures)
  expectTokensPresent(
    pageRaw,
    generatedParityContract.contract.requiredTokens || [],
    generatedParityContract.ownerLabel,
    failures
  )
  expectTokensAbsent(
    pageRaw,
    generatedParityContract.contract.forbiddenTokens || [],
    generatedParityContract.ownerLabel,
    failures
  )

  if (generationMode === 'canonical' && parity.canonicalSource) {
    const canonicalPath = path.resolve(REPO_ROOT, parity.canonicalSource.path)
    assert(fs.existsSync(canonicalPath), `缺少 canonical 资产：${relativeToRoot(canonicalPath)}`)
    const canonicalRaw = readText(canonicalPath)
    checkedFiles.push(relativeToRoot(canonicalPath))
    strictChecks.push('canonical-source-parity-manifest')

    expectTokensPresent(
      canonicalRaw,
      parity.canonicalSource.requiredTokens || [],
      `${pageType} canonical 资产`,
      failures
    )
    expectTokensAbsent(
      canonicalRaw,
      parity.canonicalSource.forbiddenTokens || [],
      `${pageType} canonical 资产`,
      failures
    )

    expectRegionOrder(
      canonicalRaw,
      parity.canonicalSource.requiredRegionOrder || [],
      `${pageType} canonical 资产`,
      failures
    )

    if (pageType === 'table-basic') {
      const inheritsOfficialTableFrameClearFilter =
        canonicalRaw.includes('TablePageFrame') &&
        canonicalRaw.includes('ProListPageProvider') &&
        canonicalRaw.includes('TypicalPageFieldMapProvider')

      if (!inheritsOfficialTableFrameClearFilter) {
        const clearButtonBlockMatch = canonicalRaw.match(/key="clear-filter"[\s\S]{0,260}<\/Button>/)
        if (!clearButtonBlockMatch) {
          failures.push('table-basic canonical 资产缺少 clear-filter 按钮块')
        } else {
          const clearButtonBlock = clearButtonBlockMatch[0]
          if (/type=/.test(clearButtonBlock)) {
            failures.push('table-basic clear-filter 不应显式声明 type；需保持官方默认 Button 语义')
          }
          if (/appearance=/.test(clearButtonBlock)) {
            failures.push('table-basic clear-filter 不应显式声明 appearance；需保持官方默认 Button 语义')
          }
        }
      }

      strictChecks.push('clear-button-default-button-semantics')
    }
  }

  return {
    parityManifest: relativeToRoot(parityPath),
    checkedFiles,
    status: failures.length ? 'failed' : 'passed',
    blockingIssues: failures,
    strictChecks,
  }
}

export function verifyPageStrict(targetPagePath) {
  const liteResult = verifyPageLite(targetPagePath)
  const schemaFile = path.resolve(REPO_ROOT, targetPagePath, 'page.schema.json')
  const metaFile = path.resolve(REPO_ROOT, targetPagePath, 'hiui-pagegen.meta.json')
  const pageFile = path.resolve(REPO_ROOT, targetPagePath, 'index.tsx')
  const schema = readJson(schemaFile)
  const meta = readJson(metaFile)
  const generationMode = normalizeGenerationMode(meta)
  const strictChecks = ['host-adapter-only', 'no-legacy-chain', 'asset-governance-metadata']
  let pageSpecificResult = {
    status: 'passed',
    blockingIssues: [],
    strictChecks: [],
  }

  if (generationMode === 'official-runtime') {
    const pageRaw = readText(pageFile)
    const officialRuntimeRegistry = readOfficialRuntimeRegistry()
    const officialRuntimeEntry = officialRuntimeRegistry[schema.pageType]
    const failures = []

    assert(
      officialRuntimeEntry,
      `页型 ${schema.pageType} 未在官方 runtime 注册表登记：${relativeToRoot(OFFICIAL_RUNTIME_REGISTRY_PATH)}`
    )
    assert(
      meta.officialRuntime?.pageId === officialRuntimeEntry.pageId,
      `officialRuntime.pageId=${meta.officialRuntime?.pageId || ''} 与注册表 ${officialRuntimeEntry.pageId} 不一致`
    )
    expectTokensPresent(
      pageRaw,
      ['OfficialRuntimeEntryPage', 'useHostAdapter', `runtimePageId="${officialRuntimeEntry.pageId}"`],
      `${schema.pageType} 官方 runtime 入口页`,
      failures
    )
      assert(failures.length === 0, failures.join('\n'))

      pageSpecificResult = {
      status: 'passed',
      blockingIssues: [],
      strictChecks: [
        'official-runtime-registry',
        'official-runtime-entry-wrapper',
        'official-runtime-resolved-page-id',
        'official-runtime-asset-governance',
      ],
      parityManifest: relativeToRoot(OFFICIAL_RUNTIME_REGISTRY_PATH),
      checkedFiles: [relativeToRoot(pageFile), relativeToRoot(OFFICIAL_RUNTIME_REGISTRY_PATH)],
    }
  } else {
    const parityPath = path.resolve(PAGEGEN_ROOT, 'parity', `${schema.pageType}.json`)
    if (meta.assetGovernance?.assetMode === 'official-mirror') {
      assert(fs.existsSync(parityPath), `official-mirror 资产缺少 parity manifest：${relativeToRoot(parityPath)}`)
      pageSpecificResult = runParityChecks(
        targetPagePath,
        schema.pageType,
        generationMode,
        meta.assetGovernance
      )
      pageSpecificResult.strictChecks = [
        ...(pageSpecificResult.strictChecks || []),
        'official-mirror-parity-lock',
      ]
    } else if (fs.existsSync(parityPath)) {
      pageSpecificResult = runParityChecks(
        targetPagePath,
        schema.pageType,
        generationMode,
        meta.assetGovernance
      )
    }
  }

  return {
    ...liteResult,
    deliveryShape: liteResult.deliveryShape,
    deliveryShapeReason: liteResult.deliveryShapeReason,
    status: pageSpecificResult.status,
    blockingIssues: pageSpecificResult.blockingIssues,
    strictChecks: [
      ...strictChecks,
      ...(liteResult.managedAnalyticsContract?.strictChecks || []),
      ...(pageSpecificResult.strictChecks || []),
    ],
    parityManifest: pageSpecificResult.parityManifest,
    checkedFiles: [
      ...(liteResult.managedAnalyticsContract?.checkedFiles || []),
      ...(pageSpecificResult.checkedFiles || []),
    ],
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const targetPagePath = args.page
  assert(targetPagePath, '请通过 --page 指定目标页面目录，不要传 index.tsx 文件路径')

  const outputsDir = path.resolve(PAGEGEN_ROOT, 'outputs')
  fs.mkdirSync(outputsDir, { recursive: true })
  const safeName = targetPagePath.replace(/[\\/]/g, '__')
  const outputPath = path.resolve(outputsDir, `verify-strict-${safeName}.json`)

  try {
    const strictResult = verifyPageStrict(targetPagePath)
    writeJson(outputPath, {
      verifiedAt: new Date().toISOString(),
      ...strictResult,
    })

    assert(strictResult.status === 'passed', strictResult.blockingIssues.join('\n'))
    console.log(`hiui-pagegen verify-strict passed: ${relativeToRoot(outputPath)}`)
  } catch (error) {
    const failurePayload = {
      verifiedAt: new Date().toISOString(),
      page: targetPagePath,
      status: 'failed',
      blockingIssues: [error.message],
    }

    writeJson(outputPath, failurePayload)
    console.error(`hiui-pagegen verify-strict failed: ${relativeToRoot(outputPath)}`)
    console.error(error.message)
    process.exitCode = 1
  }
}

const isDirectExecution = (() => {
  if (!process.argv[1]) {
    return false
  }

  try {
    return fs.realpathSync(path.resolve(process.argv[1])) === fs.realpathSync(new URL(import.meta.url))
  } catch {
    return import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
  }
})()

if (isDirectExecution) {
  main()
}
