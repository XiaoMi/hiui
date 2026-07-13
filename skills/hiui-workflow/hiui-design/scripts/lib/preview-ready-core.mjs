import fs from 'node:fs/promises'
import path from 'node:path'
import { computeManagedPageSourceSnapshot, normalizeContractPath } from './managed-page-artifacts.mjs'
import {
  getRulesOnlyPageContractsDir,
  getRequiredRegionsForPageType,
  toContractSlug,
} from './rules-only-page-contracts.mjs'
import { inspectManagedPageVisualTokens } from './visual-token-baseline.mjs'

export const DEFAULT_TIMEOUT_MS = 15000

export function buildPreviewReadyFixtureReport() {
  return {
    ok: true,
    previewReady: true,
    checks: [
      { detail: 'src/pages/orders/index.tsx exists', key: 'page-exists', ok: true },
      {
        detail: 'Detected page type: table-basic (informational only)',
        key: 'page-type',
        ok: true,
      },
      {
        detail:
          'managed chart section=not-declared; Any inserted chart still has to stay on the approved HiUI chart stack. Only independent analysis blocks should be promoted into chart-section.',
        key: 'chart-governance',
        ok: true,
      },
      {
        detail: 'No preview URL was provided. Accepted static file-exists fallback.',
        key: 'browser-preview',
        ok: true,
        skipped: true,
      },
    ],
    normalizedPagePath: 'src/pages/orders/index.tsx',
    pageTypeId: 'table-basic',
    managedChartSection: 'not-declared',
    chartGovernance:
      'Any inserted chart still has to stay on the approved HiUI chart stack. Only independent analysis blocks should be promoted into chart-section.',
    qualityChecks: [
      {
        detail:
          'Found managed page contract: .local-context/hiui-design/contracts/src-pages-orders-index.json',
        key: 'contract-exists',
        ok: true,
      },
      { detail: 'workflow.status=finalized; deliveryStatus=finalized', key: 'workflow-finalized', ok: true },
      { detail: 'Runtime smoke is not required for this page contract.', key: 'runtime-smoke-pass', ok: true },
    ],
    qualityVerified: true,
    requiredRegions: ['header', 'white-body', 'query-filter', 'table', 'pagination'],
    runtimeSmokeRequired: false,
    runtimeSmokeRequirementReason: '',
    sourceSnapshotHash: 'preview-ready-contract-fixture-source',
    usedStaticFallback: true,
  }
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function loadManagedPageContract(targetRoot, pagePath) {
  const normalizedPagePath = normalizeContractPath(targetRoot, pagePath)
  const contractSlug =
    toContractSlug(normalizedPagePath.replace(/\.[cm]?[jt]sx?$/, '')) || 'managed-page-contract'
  const contractsDir = getRulesOnlyPageContractsDir(targetRoot)
  const contractJsonPath = path.join(contractsDir, `${contractSlug}.json`)

  if (!(await fileExists(contractJsonPath))) {
    return null
  }

  const contractRaw = await fs.readFile(contractJsonPath, 'utf8')
  return {
    contractJsonPath,
    contract: JSON.parse(contractRaw),
    normalizedPagePath,
  }
}

function extractPageTypeId(pageRaw, contract) {
  const contractPageType = String(contract?.pageTypeId || '').trim()
  if (contractPageType) {
    return contractPageType
  }

  const matched = String(pageRaw || '').match(/data-hiui5-page-type="([^"]+)"/)
  return matched?.[1] ? String(matched[1]).trim() : ''
}

function hasManagedChartSection(contract) {
  return Array.isArray(contract?.regionMapping)
    ? contract.regionMapping.some(
        (item) => String(item?.region || '').trim().toLowerCase() === 'chart-section'
      )
    : false
}

function getManagedChartGovernanceSummary(contract, pageTypeId) {
  if (pageTypeId === 'data-visualization') {
    return {
      managedChartSection: 'required-by-page-type',
      chartGovernance:
        'data-visualization keeps charts and the detail table in one managed analytics workspace; all chart rendering must stay on the approved HiUI chart stack.',
    }
  }

  if (hasManagedChartSection(contract)) {
    return {
      managedChartSection: 'declared',
      chartGovernance:
        'The page keeps its original page type. chart-section here only marks an independent analysis block; any inserted chart still has to stay on the approved HiUI chart stack.',
    }
  }

  return {
    managedChartSection: 'not-declared',
    chartGovernance:
      'Any inserted chart still has to stay on the approved HiUI chart stack. Only independent analysis blocks should be promoted into chart-section.',
  }
}

function collectRequiredRegions(pageTypeId, contract) {
  const regions = []
  const seen = new Set()

  for (const region of pageTypeId ? getRequiredRegionsForPageType(pageTypeId) : []) {
    const normalized = String(region || '').trim()
    if (!normalized || seen.has(normalized)) {
      continue
    }
    seen.add(normalized)
    regions.push(normalized)
  }

  for (const item of Array.isArray(contract?.regionMapping) ? contract.regionMapping : []) {
    const normalized = String(item?.region || '').trim()
    if (!normalized || seen.has(normalized)) {
      continue
    }
    seen.add(normalized)
    regions.push(normalized)
  }

  return regions
}

async function loadPlaywrightMaybe() {
  try {
    return await import('playwright')
  } catch {
    return null
  }
}

async function runBrowserPreviewCheck({ timeoutMs, url }) {
  if (!url) {
    return {
      detail: 'No preview URL was provided. Accepted static file-exists fallback.',
      ok: true,
      skipped: true,
    }
  }

  const playwright = await loadPlaywrightMaybe()
  if (!playwright) {
    return {
      detail: 'Playwright is not available in the current workspace. Accepted static file-exists fallback.',
      ok: true,
      skipped: true,
    }
  }

  const { chromium } = playwright
  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } })
    const consoleErrors = []
    const pageErrors = []

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text())
      }
    })

    page.on('pageerror', (error) => {
      pageErrors.push(error instanceof Error ? error.message : String(error))
    })

    await page.goto(url, { waitUntil: 'networkidle', timeout: timeoutMs })
    await page.waitForTimeout(400)

    const evaluated = await page.evaluate(() => {
      const overlay = document.querySelector('vite-error-overlay')
      const visibleElements = Array.from(document.body?.querySelectorAll('*') || []).filter((node) => {
        if (!(node instanceof HTMLElement)) {
          return false
        }

        if (['SCRIPT', 'STYLE', 'LINK', 'META'].includes(node.tagName)) {
          return false
        }

        const style = window.getComputedStyle(node)
        const rect = node.getBoundingClientRect()
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
      })

      return {
        hasVisibleContent: visibleElements.length > 0,
        overlayVisible: Boolean(overlay),
        visibleElementCount: visibleElements.length,
      }
    })

    const problems = []
    const warnings = []

    if (!evaluated.hasVisibleContent) {
      problems.push('Preview page has no visible content')
    }

    if (evaluated.overlayVisible) {
      problems.push('Vite error overlay is visible')
    }

    if (pageErrors.length > 0) {
      warnings.push(`pageerror: ${pageErrors.join(' | ')}`)
    }

    if (consoleErrors.length > 0) {
      warnings.push(`console.error: ${consoleErrors.join(' | ')}`)
    }

    return {
      detail:
        problems.length > 0
          ? problems.join('; ')
          : `Preview rendered successfully: ${url}${warnings.length > 0 ? `; warnings: ${warnings.join(' | ')}` : ''}`,
      ok: problems.length === 0,
      skipped: false,
      warnings,
    }
  } catch (error) {
    return {
      detail: error instanceof Error ? error.message : String(error),
      ok: false,
      skipped: false,
    }
  } finally {
    await browser.close()
  }
}

export async function evaluatePreviewReady(options) {
  const normalizedPagePath = normalizeContractPath(options.target, options.page)
  const absolutePagePath = path.join(options.target, normalizedPagePath)

  if (!(await fileExists(absolutePagePath))) {
    const checks = [
      {
        detail: `${normalizedPagePath} does not exist`,
        key: 'page-exists',
        ok: false,
      },
    ]

    return {
      checks,
      normalizedPagePath,
      pageTypeId: '',
      managedChartSection: 'not-declared',
      chartGovernance:
        'Any inserted chart still has to stay on the approved HiUI chart stack. Only independent analysis blocks should be promoted into chart-section.',
      previewReady: false,
      qualityChecks: checks,
      qualityVerified: false,
      requiredRegions: [],
      runtimeSmokeRequired: false,
      runtimeSmokeRequirementReason: '',
      sourceSnapshotHash: '',
      usedStaticFallback: false,
    }
  }

  const [contractContext, pageRaw] = await Promise.all([
    loadManagedPageContract(options.target, normalizedPagePath),
    fs.readFile(absolutePagePath, 'utf8'),
  ])
  const pageTypeId = extractPageTypeId(pageRaw, contractContext?.contract)
  const chartGovernanceSummary = getManagedChartGovernanceSummary(
    contractContext?.contract || null,
    pageTypeId
  )
  const browserCheck = await runBrowserPreviewCheck({
    timeoutMs: options.timeoutMs,
    url: options.url,
  })
  const visualTokenInspection = await inspectManagedPageVisualTokens({
    entryFilePath: absolutePagePath,
    targetRoot: options.target,
  })
  const sourceSnapshot = computeManagedPageSourceSnapshot({
    generatedPagePath: normalizedPagePath,
    targetRoot: options.target,
  })

  const checks = [
    {
      detail: `${normalizedPagePath} exists`,
      key: 'page-exists',
      ok: true,
    },
    {
      detail: pageTypeId
        ? `Detected page type: ${pageTypeId} (informational only)`
        : 'Page type is not detected, but this no longer blocks preview readiness',
      key: 'page-type',
      ok: true,
    },
    {
      detail: `managed chart section=${chartGovernanceSummary.managedChartSection}; ${chartGovernanceSummary.chartGovernance}`,
      key: 'chart-governance',
      ok: true,
    },
    {
      detail:
        visualTokenInspection.violations.length > 0
          ? visualTokenInspection.violations
              .slice(0, 6)
              .map((violation) => violation.detail)
              .join('; ')
          : `No unregistered raw font-size tokens found in page source or imported local styles (${visualTokenInspection.allowedRawFontSizes.join(', ')}).`,
      inspectedFiles: visualTokenInspection.inspectedFiles,
      key: 'visual-token-baseline',
      ok: visualTokenInspection.violations.length === 0,
      violations: visualTokenInspection.violations,
    },
    {
      detail: browserCheck.detail,
      key: 'browser-preview',
      ok: browserCheck.ok,
      skipped: browserCheck.skipped,
    },
  ]

  const runtimeSmokeRequired = Boolean(contractContext?.contract?.runtimeSmokePlan?.required)
  const runtimeSmokeRequirementReason = runtimeSmokeRequired
    ? String(contractContext?.contract?.runtimeSmokePlan?.reason || '').trim()
    : ''
  const qualityChecks = [
    {
      detail: contractContext?.contractJsonPath
        ? `Found managed page contract: ${normalizeContractPath(options.target, contractContext.contractJsonPath)}`
        : 'Managed page contract is missing',
      key: 'contract-exists',
      ok: Boolean(contractContext?.contractJsonPath),
    },
    {
      detail: runtimeSmokeRequired
        ? `Runtime smoke is required for this page contract${runtimeSmokeRequirementReason ? `: ${runtimeSmokeRequirementReason}` : '.'}`
        : 'Runtime smoke is not required for this page contract.',
      key: 'runtime-smoke-requirement',
      ok: true,
    },
  ]
  const qualityVerified = checks.every((item) => item.ok) && qualityChecks.every((item) => item.ok)

  return {
    checks,
    normalizedPagePath,
    pageTypeId,
    managedChartSection: chartGovernanceSummary.managedChartSection,
    chartGovernance: chartGovernanceSummary.chartGovernance,
    previewReady: checks.every((item) => item.ok),
    qualityChecks,
    qualityVerified,
    requiredRegions: collectRequiredRegions(pageTypeId, contractContext?.contract || null),
    runtimeSmokeRequired,
    runtimeSmokeRequirementReason,
    sourceSnapshotHash: sourceSnapshot.hash,
    usedStaticFallback: browserCheck.skipped,
  }
}
