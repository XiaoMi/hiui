#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {
  computeManagedPageSourceSnapshot,
  syncManagedPageRegistry,
} from './lib/managed-page-artifacts.mjs'
import {
  getManagedPageRuntimeSmokeRequirement,
  getManagedPageSplitPaneContract,
  getRulesOnlyPageContractsDir,
  normalizeContractPath,
  reconcileManagedPageRuntimeSmokeWorkflow,
  renderRulesOnlyPageContractMarkdown,
  toContractSlug,
} from './lib/rules-only-page-contracts.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-runtime-smoke.mjs" --url <http-url> [--page <relative-page-path>] [--target <project-root>] [--page-type <id>] [--timeout <ms>] [--profile <dom|viewport|visual|all>] [--viewport <width>x<height> ...] [--json] [--contract-fixture <visual-missing>]

Example:
  npm run typical-page:runtime-smoke -- --url http://localhost:5174/#/operations-dashboard --page src/views/dashboard/index.tsx --page-type data-visualization
`)
}

function parseViewport(value) {
  const match = String(value || '').trim().match(/^(\d+)x(\d+)$/i)
  if (!match) {
    throw new Error(`Invalid viewport "${value}". Expected <width>x<height>, for example 1440x900.`)
  }

  return {
    width: Number(match[1]),
    height: Number(match[2]),
  }
}

function parseArgs(argv) {
  const options = {
    contractFixture: '',
    json: false,
    page: '',
    pageType: '',
    profile: 'all',
    target: process.cwd(),
    timeout: 15000,
    url: '',
    viewports: [],
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (
      arg === '--url' ||
      arg === '--page' ||
      arg === '--target' ||
      arg === '--page-type' ||
      arg === '--timeout' ||
      arg === '--profile' ||
      arg === '--viewport' ||
      arg === '--contract-fixture'
    ) {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--url') options.url = value
      if (arg === '--page') options.page = value
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--page-type') options.pageType = value
      if (arg === '--timeout') options.timeout = Number(value)
      if (arg === '--profile') options.profile = value
      if (arg === '--viewport') options.viewports.push(parseViewport(value))
      if (arg === '--contract-fixture') options.contractFixture = value
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.url) {
    throw new Error('Missing --url')
  }

  if (!Number.isFinite(options.timeout) || options.timeout <= 0) {
    throw new Error('Expected --timeout to be a positive number')
  }

  if (!['dom', 'viewport', 'visual', 'all'].includes(options.profile)) {
    throw new Error('Expected --profile to be one of: dom, viewport, visual, all')
  }

  if (options.contractFixture && !['visual-missing'].includes(options.contractFixture)) {
    throw new Error('Expected --contract-fixture to be one of: visual-missing')
  }

  if (options.viewports.length === 0) {
    options.viewports.push({ width: 1440, height: 1200 })
  }

  return options
}

async function loadManagedPageContract(targetRoot, pagePath) {
  const normalizedPagePath = normalizeContractPath(targetRoot, pagePath)
  const contractSlug =
    toContractSlug(normalizedPagePath.replace(/\.[cm]?[jt]sx?$/, '')) || 'managed-page-contract'
  const contractsDir = getRulesOnlyPageContractsDir(targetRoot)
  const contractJsonPath = path.join(contractsDir, `${contractSlug}.json`)
  const contractMarkdownPath = path.join(contractsDir, `${contractSlug}.md`)
  const contractRaw = await fs.readFile(contractJsonPath, 'utf8')
  const contract = JSON.parse(contractRaw)

  return {
    normalizedPagePath,
    contractSlug,
    contractJsonPath,
    contractMarkdownPath,
    contract,
  }
}

async function persistRuntimeSmokeResult({
  contractContext,
  outputRoot,
  reportLines,
  sourceSnapshotHash,
  status,
  targetRoot,
}) {
  if (!contractContext) {
    return
  }

  const reportDir = path.join(outputRoot, 'runtime-smoke')
  const reportPath = path.join(reportDir, `${contractContext.contractSlug}.md`)
  await fs.mkdir(reportDir, { recursive: true })
  await fs.writeFile(reportPath, `${reportLines.join('\n')}\n`, 'utf8')

  const requirement = getManagedPageRuntimeSmokeRequirement(contractContext.contract)
  const reconciled = reconcileManagedPageRuntimeSmokeWorkflow(
    contractContext.contract,
    {
      ...contractContext.contract.workflow,
      runtimeSmokeStatus: status,
      runtimeSmokeSnapshotHash: sourceSnapshotHash,
      runtimeSmokeReportPath: reportPath,
    },
    sourceSnapshotHash
  )

  contractContext.contract.workflow = {
    ...(contractContext.contract.workflow || {}),
    runtimeSmokeStatus: requirement.required ? reconciled.runtimeSmokeStatus : 'not-required',
    runtimeSmokeSnapshotHash: requirement.required ? reconciled.runtimeSmokeSnapshotHash : '',
    runtimeSmokeReportPath: requirement.required ? reconciled.runtimeSmokeReportPath : '',
    lastCommand: 'typical-page:runtime-smoke',
  }

  if (!requirement.required && status !== 'pass') {
    reportLines.push('', `Note: runtime smoke is not a required gate for this page. Recorded status: ${status}.`)
  }

  await fs.writeFile(
    contractContext.contractJsonPath,
    `${JSON.stringify(contractContext.contract, null, 2)}\n`,
    'utf8'
  )
  await fs.writeFile(
    contractContext.contractMarkdownPath,
    renderRulesOnlyPageContractMarkdown(contractContext.contract),
    'utf8'
  )
  await syncManagedPageRegistry(targetRoot)
}

async function loadPlaywright() {
  try {
    return await import('playwright')
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    const nodeVersion = String(process.versions?.node || process.version || '').trim()
    const nodeMajor = Number.parseInt(nodeVersion.split('.')[0] || '', 10)
    const missingPackage =
      detail.includes("Cannot find package 'playwright'") ||
      detail.includes("Cannot find module 'playwright'")
    const installHint = missingPackage
      ? Number.isFinite(nodeMajor) && nodeMajor > 0 && nodeMajor < 16
        ? `Current workspace Node.js is v${nodeVersion}. Newer Playwright releases often require Node.js >=16, so install a workspace-compatible Playwright version before rerunning runtime smoke.`
        : 'Install playwright in this workspace, then rerun runtime smoke.'
      : Number.isFinite(nodeMajor) && nodeMajor > 0 && nodeMajor < 16
        ? `Current workspace Node.js is v${nodeVersion}. If playwright is installed but still cannot load, verify that the installed Playwright release supports this Node.js runtime.`
        : 'Verify that playwright and its browser binaries are installed correctly in this workspace before rerunning runtime smoke.'
    throw new Error(
      `playwright is not available in this workspace. Import error: ${detail} Hint: ${installHint}`
    )
  }
}

function formatCheck(ok, label, detail) {
  return `${ok ? '[PASS]' : '[FAIL]'} ${label}${detail ? `\n  ${detail}` : ''}`
}

function buildRuntimeSmokeJsonReport({
  checks,
  errorMessage = '',
  options,
  sourceSnapshotHash = '',
  status,
}) {
  const visualRequired = ['visual', 'all'].includes(options?.profile || 'all')
  return {
    status,
    profile: options?.profile || 'all',
    page: options?.page || '',
    pageType: options?.pageType || '',
    url: options?.url || '',
    sourceSnapshotHash,
    viewports: options?.viewports || [],
    checks,
    visualEvidence: {
      required: visualRequired,
      status: visualRequired ? 'missing' : 'not-required',
      baselinePolicy: 'capture-only-no-diff',
      screenshotDir: '',
      screenshots: [],
    },
    artifacts: {
      markdownReportPath: '',
      jsonReportPath: '',
      screenshots: [],
    },
    ...(errorMessage ? { errorMessage } : {}),
  }
}

function buildContractFixtureReport({ options, sourceSnapshotHash = '' }) {
  const message = 'runtime smoke contract fixture: visual evidence missing before browser execution'
  return buildRuntimeSmokeJsonReport({
    checks: [
      {
        id: 'runtime-smoke-contract-fixture',
        status: 'fail',
        message,
      },
    ],
    errorMessage: message,
    options,
    sourceSnapshotHash,
    status: 'fail',
  })
}

function emitJson(payload) {
  console.log(JSON.stringify(payload, null, 2))
}

async function main() {
  let options = null
  let contractContext = null
  let outputRoot = ''
  let sourceSnapshotHash = ''
  let reportLines = []
  let status = 'fail'

  try {
    options = parseArgs(process.argv.slice(2))
    outputRoot = path.join(options.target, '.local-context', 'hiui-design', 'outputs')
    if (options.page) {
      contractContext = await loadManagedPageContract(options.target, options.page)
      sourceSnapshotHash = computeManagedPageSourceSnapshot({
        generatedPagePath: contractContext.normalizedPagePath,
        targetRoot: options.target,
      }).hash
      if (!options.pageType) {
        options.pageType = String(contractContext.contract?.pageTypeId || '').trim()
      }
    }

    if (options.contractFixture) {
      const report = buildContractFixtureReport({ options, sourceSnapshotHash })
      emitJson(report)
      process.exitCode = 1
      return
    }

    const { chromium } = await loadPlaywright()
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } })

    try {
      await page.goto(options.url, { waitUntil: 'networkidle', timeout: options.timeout })

      const expectedPageType =
        options.pageType && options.pageType.trim()
          ? options.pageType.trim()
          : null
      const rootSelector = expectedPageType
        ? `[data-hiui5-page-type="${expectedPageType}"]`
        : '[data-hiui5-page-type]'

      await page.waitForSelector(rootSelector, { timeout: options.timeout })

      const splitPaneContract = contractContext
        ? getManagedPageSplitPaneContract(contractContext.contract)
        : null

      const result = await page.evaluate((config) => {
        const { mode, rootSelector, splitPaneContract } = config
        const root = document.querySelector(rootSelector)
        if (!(root instanceof HTMLElement)) {
          return {
            fatal: `Missing root node for selector ${rootSelector}`,
          }
        }

        const getRect = (element) => {
          const rect = element.getBoundingClientRect()
          return {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            right: rect.right + window.scrollX,
            width: rect.width,
            height: rect.height,
          }
        }

        const getOverflow = (element) => {
          const style = window.getComputedStyle(element)
          return {
            overflow: style.overflow,
            overflowX: style.overflowX,
            overflowY: style.overflowY,
          }
        }

        const getPaddingBox = (element) => {
          if (!(element instanceof HTMLElement)) {
            return {
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              paddingLeft: 0,
            }
          }

          const style = window.getComputedStyle(element)
          return {
            paddingTop: Number.parseFloat(style.paddingTop) || 0,
            paddingRight: Number.parseFloat(style.paddingRight) || 0,
            paddingBottom: Number.parseFloat(style.paddingBottom) || 0,
            paddingLeft: Number.parseFloat(style.paddingLeft) || 0,
          }
        }

        const getSurfaceBox = (element) => {
          if (!(element instanceof HTMLElement)) {
            return {
              backgroundColor: '',
              borderRadius: 0,
              borderTopWidth: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              paddingLeft: 0,
            }
          }

          const style = window.getComputedStyle(element)
          return {
            backgroundColor: style.backgroundColor,
            borderRadius: Number.parseFloat(style.borderRadius) || 0,
            borderTopWidth: Number.parseFloat(style.borderTopWidth) || 0,
            paddingTop: Number.parseFloat(style.paddingTop) || 0,
            paddingRight: Number.parseFloat(style.paddingRight) || 0,
            paddingBottom: Number.parseFloat(style.paddingBottom) || 0,
            paddingLeft: Number.parseFloat(style.paddingLeft) || 0,
          }
        }

        const describeElement = (element) => {
          if (!element) return '(window)'
          const parts = [element.tagName.toLowerCase()]
          if (element.id) parts.push(`#${element.id}`)
          if (element.classList.length > 0) {
            parts.push(`.${[...element.classList].slice(0, 3).join('.')}`)
          }
          if (element instanceof HTMLElement && element.dataset.hiui5PageType) {
            parts.push(`[data-hiui5-page-type="${element.dataset.hiui5PageType}"]`)
          }
          return parts.join('')
        }

        const isScrollContainer = (element) => {
          if (!(element instanceof HTMLElement)) return false
          const overflow = getOverflow(element)
          const allowsScroll =
            ['auto', 'scroll'].includes(overflow.overflowY) ||
            ['auto', 'scroll'].includes(overflow.overflow)

          return allowsScroll && element.scrollHeight > element.clientHeight + 24
        }

        const resolvePageScrollOwner = () => {
          let current = root.parentElement
          while (current instanceof HTMLElement) {
            if (isScrollContainer(current)) {
              return current
            }
            current = current.parentElement
          }

          return null
        }

        const resolveScopedElement = (selector) => {
          if (!selector) return null
          const scoped = root.querySelector(selector)
          if (scoped instanceof HTMLElement) return scoped
          const global = document.querySelector(selector)
          return global instanceof HTMLElement ? global : null
        }

        const inspectScrollOwner = (element) => {
          const initialScrollTop = element ? element.scrollTop : 0
          const clientHeight = element ? element.clientHeight : 0
          const scrollHeight = element ? element.scrollHeight : 0
          const scrollTarget = Math.max(0, scrollHeight - clientHeight)

          if (element) {
            element.scrollTo({ top: scrollTarget, behavior: 'instant' })
          }

          const afterScrollTop = element ? element.scrollTop : 0

          return {
            label: describeElement(element),
            clientHeight,
            scrollHeight,
            moved: afterScrollTop > initialScrollTop,
            overflow: getOverflow(element),
          }
        }

        const inspectHorizontalBox = (element) => ({
          label: describeElement(element),
          clientWidth: element ? element.clientWidth : 0,
          scrollWidth: element ? element.scrollWidth : 0,
          overflow: getOverflow(element),
        })

        const isHorizontalScrollContainer = (element) => {
          if (!(element instanceof HTMLElement)) return false
          const overflow = getOverflow(element)
          const allowsHorizontalScroll =
            ['auto', 'scroll'].includes(overflow.overflowX) ||
            ['auto', 'scroll'].includes(overflow.overflow)

          return allowsHorizontalScroll && element.scrollWidth > element.clientWidth + 4
        }

        const resolveHorizontalScrollOwnerWithin = (element) => {
          if (!(element instanceof HTMLElement)) return null

          const candidates = [element, ...element.querySelectorAll('*')]
          let bestCandidate = null
          let bestDepth = -1

          for (const candidate of candidates) {
            if (!(candidate instanceof HTMLElement) || !isHorizontalScrollContainer(candidate)) {
              continue
            }

            let depth = 0
            let current = candidate
            while (current && current !== element) {
              depth += 1
              current = current.parentElement
            }

            if (depth >= bestDepth) {
              bestCandidate = candidate
              bestDepth = depth
            }
          }

          return bestCandidate
        }

        if (mode === 'split-pane') {
          const leftPane = resolveScopedElement(splitPaneContract?.leftPaneSelector)
          const rightPane = resolveScopedElement(splitPaneContract?.rightPaneSelector)
          const tableRegion = resolveScopedElement(splitPaneContract?.tableRegionSelector)
          const splitWorkspace = resolveScopedElement('[data-hiui5-region="split-workspace"]')

          if (!(leftPane instanceof HTMLElement)) {
            return { fatal: `Missing split left pane for selector ${splitPaneContract?.leftPaneSelector}` }
          }

          if (!(rightPane instanceof HTMLElement)) {
            return {
              fatal: `Missing split right pane for selector ${splitPaneContract?.rightPaneSelector}`,
            }
          }

          if (!(tableRegion instanceof HTMLElement)) {
            return {
              fatal: `Missing table region for selector ${splitPaneContract?.tableRegionSelector}`,
            }
          }

          const leftMetrics = inspectScrollOwner(leftPane)
          const rightMetrics = inspectScrollOwner(rightPane)
          const rootScrollMetrics = inspectScrollOwner(root)
          const splitWorkspaceScrollMetrics = inspectScrollOwner(splitWorkspace)
          const rootHorizontalMetrics = inspectHorizontalBox(root)
          const rightHorizontalMetrics = inspectHorizontalBox(rightPane)
          const tableHorizontalMetrics = inspectHorizontalBox(tableRegion)
          const tableHorizontalOwner = resolveHorizontalScrollOwnerWithin(tableRegion)
          const rootPaddingMetrics = getPaddingBox(root)
          const splitWorkspacePaddingMetrics = getPaddingBox(splitWorkspace)
          const rootOverflow = getOverflow(root)
          const splitWorkspaceOverflow = getOverflow(splitWorkspace)

          return {
            mode,
            pageType: root.dataset.hiui5PageType || '',
            scrollStrategy: root.dataset.hiui5ScrollStrategy || '',
            outerPaddingOwner: root.dataset.hiui5OwnerOuterPadding || '',
            leftPaneLabel: leftMetrics.label,
            rightPaneLabel: rightMetrics.label,
            rootLabel: describeElement(root),
            splitWorkspaceLabel: describeElement(splitWorkspace),
            leftPaneClientHeight: leftMetrics.clientHeight,
            leftPaneScrollHeight: leftMetrics.scrollHeight,
            leftPaneMoved: leftMetrics.moved,
            rightPaneClientHeight: rightMetrics.clientHeight,
            rightPaneScrollHeight: rightMetrics.scrollHeight,
            rightPaneMoved: rightMetrics.moved,
            rootMoved: rootScrollMetrics.moved,
            splitWorkspaceMoved: splitWorkspaceScrollMetrics.moved,
            leftOverflow: leftMetrics.overflow,
            rightOverflow: rightMetrics.overflow,
            rootOverflow,
            splitWorkspaceOverflow,
            rootPaddingLeft: rootPaddingMetrics.paddingLeft,
            rootPaddingRight: rootPaddingMetrics.paddingRight,
            splitWorkspacePaddingLeft: splitWorkspacePaddingMetrics.paddingLeft,
            splitWorkspacePaddingRight: splitWorkspacePaddingMetrics.paddingRight,
            tableOverflow: getOverflow(tableRegion),
            tableInsideRightPane: rightPane.contains(tableRegion),
            rootClientWidth: rootHorizontalMetrics.clientWidth,
            rootScrollWidth: rootHorizontalMetrics.scrollWidth,
            rootHorizontalOverflow: rootHorizontalMetrics.overflow,
            rightPaneClientWidthForWidth: rightHorizontalMetrics.clientWidth,
            rightPaneScrollWidth: rightHorizontalMetrics.scrollWidth,
            rightPaneHorizontalOverflow: rightHorizontalMetrics.overflow,
            tableClientWidth: tableHorizontalMetrics.clientWidth,
            tableScrollWidth: tableHorizontalMetrics.scrollWidth,
            tableHorizontalOverflow: tableHorizontalMetrics.overflow,
            tableRegionOwnsHorizontalOverflow: isHorizontalScrollContainer(tableRegion),
            tableHorizontalOwnerExists: tableHorizontalOwner instanceof HTMLElement,
            tableHorizontalOwnerLabel: describeElement(tableHorizontalOwner),
            tableHorizontalOwnerWithinTable:
              tableHorizontalOwner instanceof HTMLElement && tableRegion.contains(tableHorizontalOwner),
            tableHorizontalOwnerIsRegion: tableHorizontalOwner === tableRegion,
          }
        }

        const headerRegion = document.querySelector('[data-hiui5-region="header"]')
        const headerTitle = headerRegion?.querySelector('.hi-v5-page-header__title')
        const headerExtra = headerRegion?.querySelector('.hi-v5-page-header__extra')
        const whiteBody = root.querySelector('[data-hiui5-region="white-body"]')
        const queryFilter = root.querySelector('[data-hiui5-region="query-filter"]')
        const tableRegion = root.querySelector('[data-hiui5-region="table"]')

        if (!(whiteBody instanceof HTMLElement)) {
          return { fatal: 'Missing [data-hiui5-region="white-body"]' }
        }

        if (!(queryFilter instanceof HTMLElement)) {
          return { fatal: 'Missing [data-hiui5-region="query-filter"]' }
        }

        if (!(tableRegion instanceof HTMLElement)) {
          return { fatal: 'Missing [data-hiui5-region="table"]' }
        }

        const headerRect = getRect(headerRegion)
        const headerTitleRect = getRect(headerTitle)
        const headerExtraRect = getRect(headerExtra)
        const headerPaddingBox = getPaddingBox(headerRegion)
        const rootRect = getRect(root)
        const whiteRect = getRect(whiteBody)
        const filterRect = getRect(queryFilter)
        const tableRect = getRect(tableRegion)
        const paginationRegion = root.querySelector('[data-hiui5-region="pagination"]')
        const paginationRect = getRect(paginationRegion)
        const rootHorizontalMetrics = inspectHorizontalBox(root)
        const whiteHorizontalMetrics = inspectHorizontalBox(whiteBody)
        const tableHorizontalMetrics = inspectHorizontalBox(tableRegion)
        const tableHorizontalOwner = resolveHorizontalScrollOwnerWithin(tableRegion)
        const firstTierSectionSurfaceViolations = Array.from(whiteBody.children)
          .filter((element) => element instanceof HTMLElement)
          .map((element) => {
            const region = element.getAttribute('data-hiui5-region') || ''
            const surface = getSurfaceBox(element)
            const hasVisibleSurface =
              surface.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
              surface.borderRadius > 0 ||
              surface.borderTopWidth > 0
            const hasLocalInset =
              surface.paddingTop > 4 ||
              surface.paddingRight > 4 ||
              surface.paddingBottom > 4 ||
              surface.paddingLeft > 4
            const allowSurface =
              region === 'query-filter' ||
              (region === 'table' && element.getAttribute('data-hiui5-table-shell') === 'joined')

            return {
              label: describeElement(element),
              region,
              hasLocalInset,
              hasVisibleSurface,
              violates: !allowSurface && hasVisibleSurface && hasLocalInset,
            }
          })
          .filter((item) => item.violates)
        const articleOverlapViolations = Array.from(whiteBody.querySelectorAll('article'))
          .filter((element) => element instanceof HTMLElement)
          .flatMap((article) => {
            const children = Array.from(article.children).filter((item) => item instanceof HTMLElement)
            const articleLabel = describeElement(article)
            const overlaps = []

            for (let i = 0; i < children.length; i += 1) {
              for (let j = i + 1; j < children.length; j += 1) {
                const leftRect = children[i].getBoundingClientRect()
                const rightRect = children[j].getBoundingClientRect()
                const verticalOverlap =
                  Math.min(leftRect.bottom, rightRect.bottom) - Math.max(leftRect.top, rightRect.top)
                const horizontalOverlap =
                  Math.min(leftRect.right, rightRect.right) - Math.max(leftRect.left, rightRect.left)

                if (verticalOverlap > 2 && horizontalOverlap > 24) {
                  overlaps.push(
                    `${articleLabel}: child ${i + 1} overlaps child ${j + 1} by ${Math.round(verticalOverlap)}px`
                  )
                }
              }
            }

            return overlaps
          })

        const pageScrollOwner = resolvePageScrollOwner()
        const pageScrollOwnerLabel = describeElement(pageScrollOwner)
        const pageScrollOwnerClientHeight = pageScrollOwner ? pageScrollOwner.clientHeight : window.innerHeight
        const pageScrollOwnerScrollHeight = pageScrollOwner ? pageScrollOwner.scrollHeight : document.documentElement.scrollHeight
        const initialScrollTop = pageScrollOwner ? pageScrollOwner.scrollTop : window.scrollY
        const scrollTarget = Math.max(0, pageScrollOwnerScrollHeight - pageScrollOwnerClientHeight)
        if (pageScrollOwner) {
          pageScrollOwner.scrollTo({ top: scrollTarget, behavior: 'instant' })
        } else {
          window.scrollTo({ top: scrollTarget, behavior: 'instant' })
        }
        const afterScrollTop = pageScrollOwner ? pageScrollOwner.scrollTop : window.scrollY

        return {
          pageType: root.dataset.hiui5PageType || '',
          scrollStrategy: root.dataset.hiui5ScrollStrategy || '',
          headerExists: headerRegion instanceof HTMLElement,
          headerExtraExists: headerExtra instanceof HTMLElement,
          headerRect,
          headerTitleRect,
          headerExtraRect,
          headerPaddingBox,
          rootRect,
          whiteRect,
          filterRect,
          tableRect,
          paginationExists: paginationRegion instanceof HTMLElement,
          paginationRect,
          viewportHeight: window.innerHeight,
          documentHeight: document.documentElement.scrollHeight,
          pageScrollMoves: afterScrollTop > initialScrollTop,
          pageScrollOwner: pageScrollOwnerLabel,
          pageScrollOwnerClientHeight,
          pageScrollOwnerScrollHeight,
          whiteOverflow: getOverflow(whiteBody),
          tableOverflow: getOverflow(tableRegion),
          rootClientWidth: rootHorizontalMetrics.clientWidth,
          rootScrollWidth: rootHorizontalMetrics.scrollWidth,
          rootHorizontalOverflow: rootHorizontalMetrics.overflow,
          whiteClientWidth: whiteHorizontalMetrics.clientWidth,
          whiteScrollWidth: whiteHorizontalMetrics.scrollWidth,
          whiteHorizontalOverflow: whiteHorizontalMetrics.overflow,
          tableClientWidth: tableHorizontalMetrics.clientWidth,
          tableScrollWidth: tableHorizontalMetrics.scrollWidth,
          tableHorizontalOverflow: tableHorizontalMetrics.overflow,
          tableRegionOwnsHorizontalOverflow: isHorizontalScrollContainer(tableRegion),
          tableHorizontalOwnerExists: tableHorizontalOwner instanceof HTMLElement,
          tableHorizontalOwnerLabel: describeElement(tableHorizontalOwner),
          tableHorizontalOwnerWithinTable:
            tableHorizontalOwner instanceof HTMLElement && tableRegion.contains(tableHorizontalOwner),
          tableHorizontalOwnerIsRegion: tableHorizontalOwner === tableRegion,
          firstTierSectionSurfaceViolations,
          articleOverlapViolations,
          paginationWithinTable:
            paginationRegion instanceof HTMLElement && tableRegion.contains(paginationRegion),
        }
      }, {
        mode:
          splitPaneContract &&
          splitPaneContract.enabled &&
          splitPaneContract.leftPaneScroll === 'independent-pane-scroll' &&
          splitPaneContract.rightPaneScroll === 'independent-pane-scroll'
            ? 'split-pane'
            : 'page-scroll',
        rootSelector,
        splitPaneContract,
      })

      if (result.fatal) {
        throw new Error(result.fatal)
      }

      const checks = []
      if (result.mode === 'split-pane') {
        const leftCanScroll =
          result.leftPaneScrollHeight > result.leftPaneClientHeight + 24 && result.leftPaneMoved
        const rightCanScroll =
          result.rightPaneScrollHeight > result.rightPaneClientHeight + 24 && result.rightPaneMoved
        const rootDoesNotOwnVerticalScroll =
          !['auto', 'scroll'].includes(result.rootOverflow.overflowY) &&
          !['auto', 'scroll'].includes(result.rootOverflow.overflow) &&
          !result.rootMoved
        const splitWorkspaceDoesNotOwnVerticalScroll =
          !['auto', 'scroll'].includes(result.splitWorkspaceOverflow.overflowY) &&
          !['auto', 'scroll'].includes(result.splitWorkspaceOverflow.overflow) &&
          !result.splitWorkspaceMoved
        const splitShellHasNoExtraOuterPadding =
          result.outerPaddingOwner !== 'none' ||
          (result.rootPaddingLeft <= 4 &&
            result.rootPaddingRight <= 4 &&
            result.splitWorkspacePaddingLeft <= 4 &&
            result.splitWorkspacePaddingRight <= 4)
        const tableWrapperDoesNotScroll =
          !['auto', 'scroll'].includes(result.tableOverflow.overflowY) &&
          !['auto', 'scroll'].includes(result.tableOverflow.overflow)
        const rootDoesNotOverflowHorizontally = result.rootScrollWidth <= result.rootClientWidth + 4
        const rightPaneDoesNotOverflowHorizontally =
          result.rightPaneScrollWidth <= result.rightPaneClientWidthForWidth + 4
        const tableRegionDoesNotOwnHorizontalOverflow = !result.tableRegionOwnsHorizontalOverflow
        const tableHorizontalOverflowIsContained =
          !result.tableHorizontalOwnerExists ||
          (result.tableHorizontalOwnerWithinTable && !result.tableHorizontalOwnerIsRegion)

        checks.push(
          formatCheck(
            leftCanScroll,
            'left pane scroll owner can scroll independently',
            `leftPane=${result.leftPaneLabel}, scrollHeight=${result.leftPaneScrollHeight}, clientHeight=${result.leftPaneClientHeight}, scrollMoved=${String(result.leftPaneMoved)}`
          )
        )
        checks.push(
          formatCheck(
            rightCanScroll,
            'right pane scroll owner can scroll independently',
            `rightPane=${result.rightPaneLabel}, scrollHeight=${result.rightPaneScrollHeight}, clientHeight=${result.rightPaneClientHeight}, scrollMoved=${String(result.rightPaneMoved)}`
          )
        )
        checks.push(
          formatCheck(
            rootDoesNotOwnVerticalScroll,
            'page root does not steal vertical scrolling from the split panes',
            `root=${result.rootLabel}, overflow=${result.rootOverflow.overflow}, overflowY=${result.rootOverflow.overflowY}, scrollMoved=${String(result.rootMoved)}`
          )
        )
        checks.push(
          formatCheck(
            splitWorkspaceDoesNotOwnVerticalScroll,
            'split workspace does not steal vertical scrolling from the split panes',
            `workspace=${result.splitWorkspaceLabel}, overflow=${result.splitWorkspaceOverflow.overflow}, overflowY=${result.splitWorkspaceOverflow.overflowY}, scrollMoved=${String(result.splitWorkspaceMoved)}`
          )
        )
        checks.push(
          formatCheck(
            splitShellHasNoExtraOuterPadding,
            'split shell does not reintroduce outer padding when outer-padding owner is none',
            `outerPaddingOwner=${result.outerPaddingOwner || '(missing)'}, rootPadding=${result.rootPaddingLeft}/${result.rootPaddingRight}, workspacePadding=${result.splitWorkspacePaddingLeft}/${result.splitWorkspacePaddingRight}`
          )
        )
        checks.push(
          formatCheck(
            result.tableInsideRightPane,
            'table region stays inside the declared right pane',
            `rightPane=${result.rightPaneLabel}`
          )
        )
        checks.push(
          formatCheck(
            tableWrapperDoesNotScroll,
            'table region does not create a second local vertical scroll under the right pane',
            `overflow=${result.tableOverflow.overflow}, overflowY=${result.tableOverflow.overflowY}`
          )
        )
        checks.push(
          formatCheck(
            rootDoesNotOverflowHorizontally,
            'split workspace does not overflow horizontally',
            `scrollWidth=${result.rootScrollWidth}, clientWidth=${result.rootClientWidth}, overflowX=${result.rootHorizontalOverflow.overflowX}`
          )
        )
        checks.push(
          formatCheck(
            rightPaneDoesNotOverflowHorizontally,
            'right pane stays width-adaptive and does not overflow horizontally',
            `scrollWidth=${result.rightPaneScrollWidth}, clientWidth=${result.rightPaneClientWidthForWidth}, overflowX=${result.rightPaneHorizontalOverflow.overflowX}`
          )
        )
        checks.push(
          formatCheck(
            tableRegionDoesNotOwnHorizontalOverflow,
            'table region is not the horizontal scroll owner',
            `tableRegion=${result.tableClientWidth}/${result.tableScrollWidth}, overflowX=${result.tableHorizontalOverflow.overflowX}`
          )
        )
        checks.push(
          formatCheck(
            tableHorizontalOverflowIsContained,
            'any horizontal overflow stays inside a descendant table wrapper',
            `owner=${result.tableHorizontalOwnerLabel}, ownerWithinTable=${String(result.tableHorizontalOwnerWithinTable)}, ownerIsRegion=${String(result.tableHorizontalOwnerIsRegion)}`
          )
        )
      } else {
        const pageFitsViewport =
          result.pageScrollOwnerScrollHeight <= result.pageScrollOwnerClientHeight + 24
        const pageCanScroll =
          pageFitsViewport ||
          (result.pageScrollOwnerScrollHeight > result.pageScrollOwnerClientHeight + 24 &&
            result.pageScrollMoves)
        const headerKeepsSixtyPxBaseline =
          Math.round(result.headerRect.height) === 60 &&
          result.headerPaddingBox.paddingTop <= 1 &&
          result.headerPaddingBox.paddingBottom <= 1
        const headerTitleVerticallyCentered =
          !result.headerExists ||
          Math.abs(
            result.headerRect.top + result.headerRect.height / 2 -
              (result.headerTitleRect.top + result.headerTitleRect.height / 2)
          ) <= 6
        const headerExtraVerticallyCentered =
          !result.headerExtraExists ||
          Math.abs(
            result.headerRect.top + result.headerRect.height / 2 -
              (result.headerExtraRect.top + result.headerExtraRect.height / 2)
          ) <= 6
        const headerExtraDockedRight =
          !result.headerExtraExists ||
          Math.abs(result.headerRect.right - result.headerExtraRect.right) <= 24
        const headerExtraSeparatedFromTitle =
          !result.headerExtraExists ||
          result.headerExtraRect.left >= result.headerTitleRect.right + 16
        const whiteBodyStartsNearHeader =
          !result.headerExists || result.whiteRect.top - result.headerRect.bottom <= 8
        const whiteBodyContinuous = result.whiteRect.bottom >= result.tableRect.bottom - 4
        const tableAfterFilter = result.tableRect.top >= result.filterRect.bottom - 4
        const dashboardControlStripCompact =
          result.pageType !== 'data-visualization' || result.filterRect.height <= 72
        const whiteBodyDoesNotClip =
          !['hidden', 'auto', 'scroll'].includes(result.whiteOverflow.overflowY) &&
          !['hidden', 'auto', 'scroll'].includes(result.whiteOverflow.overflow)
        const tableWrapperDoesNotScroll =
          !['auto', 'scroll'].includes(result.tableOverflow.overflowY) &&
          !['auto', 'scroll'].includes(result.tableOverflow.overflow)
        const rootDoesNotOverflowHorizontally = result.rootScrollWidth <= result.rootClientWidth + 4
        const whiteBodyDoesNotOverflowHorizontally =
          result.whiteScrollWidth <= result.whiteClientWidth + 4
        const tableRegionDoesNotOwnHorizontalOverflow = !result.tableRegionOwnsHorizontalOverflow
        const tableHorizontalOverflowIsContained =
          !result.tableHorizontalOwnerExists ||
          (result.tableHorizontalOwnerWithinTable && !result.tableHorizontalOwnerIsRegion)
        const topLevelSectionsKeepSingleWhiteBodySurface =
          result.firstTierSectionSurfaceViolations.length === 0
        const articlesDoNotOverlap = result.articleOverlapViolations.length === 0
        const paginationStaysInsideTableShell =
          result.paginationExists && result.paginationWithinTable

        checks.push(
          formatCheck(
            result.scrollStrategy === 'page-scroll',
            'scroll strategy is page-scroll',
            `actual: ${result.scrollStrategy || '(missing)'}`
          )
        )
        checks.push(
          formatCheck(
            headerKeepsSixtyPxBaseline,
            'header keeps the shared 60px height contract without extra root padding',
            `height=${Math.round(result.headerRect.height)}, paddingTop=${Math.round(result.headerPaddingBox.paddingTop)}, paddingBottom=${Math.round(result.headerPaddingBox.paddingBottom)}`
          )
        )
        checks.push(
          formatCheck(
            headerTitleVerticallyCentered,
            'header title stays vertically centered inside the 60px shared header slot',
            `headerCenter=${Math.round(result.headerRect.top + result.headerRect.height / 2)}, titleCenter=${Math.round(result.headerTitleRect.top + result.headerTitleRect.height / 2)}`
          )
        )
        checks.push(
          formatCheck(
            headerExtraVerticallyCentered,
            'header actions stay vertically centered inside the 60px shared header slot',
            `headerCenter=${Math.round(result.headerRect.top + result.headerRect.height / 2)}, extraCenter=${Math.round(result.headerExtraRect.top + result.headerExtraRect.height / 2)}`
          )
        )
        checks.push(
          formatCheck(
            pageCanScroll,
            'page-level scroll owner can scroll the dashboard or the dashboard already fits in one viewport',
            `scrollOwner=${result.pageScrollOwner || '(window)'}, scrollHeight=${result.pageScrollOwnerScrollHeight}, clientHeight=${result.pageScrollOwnerClientHeight}, scrollMoved=${String(result.pageScrollMoves)}, pageFitsViewport=${String(pageFitsViewport)}`
          )
        )
        checks.push(
          formatCheck(
            headerExtraDockedRight,
            'header extra actions stay docked to the far right edge of the PageHeader',
            `header.right=${Math.round(result.headerRect.right)}, extra.right=${Math.round(result.headerExtraRect.right)}`
          )
        )
        checks.push(
          formatCheck(
            headerExtraSeparatedFromTitle,
            'header extra actions are separated from the title instead of collapsing next to it',
            `title.right=${Math.round(result.headerTitleRect.right)}, extra.left=${Math.round(result.headerExtraRect.left)}`
          )
        )
        checks.push(
          formatCheck(
            whiteBodyStartsNearHeader,
            'white-body starts immediately below the shared header without an extra top gap',
            `header.bottom=${Math.round(result.headerRect.bottom)}, whiteBody.top=${Math.round(result.whiteRect.top)}`
          )
        )
        checks.push(
          formatCheck(
            whiteBodyContinuous,
            'white-body extends through the table region',
            `whiteBody.bottom=${Math.round(result.whiteRect.bottom)}, table.bottom=${Math.round(result.tableRect.bottom)}`
          )
        )
        checks.push(
          formatCheck(
            dashboardControlStripCompact,
            'dashboard control strip stays compact on the desktop baseline viewport',
            `pageType=${result.pageType || '(missing)'}, filter.height=${Math.round(result.filterRect.height)}`
          )
        )
        checks.push(
          formatCheck(
            tableAfterFilter,
            'table region remains visible below query filter',
            `filter.bottom=${Math.round(result.filterRect.bottom)}, table.top=${Math.round(result.tableRect.top)}`
          )
        )
        checks.push(
          formatCheck(
            whiteBodyDoesNotClip,
            'white-body does not become a clipping container',
            `overflow=${result.whiteOverflow.overflow}, overflowY=${result.whiteOverflow.overflowY}`
          )
        )
        checks.push(
          formatCheck(
            tableWrapperDoesNotScroll,
            'table wrapper does not create a nested local scroll',
            `overflow=${result.tableOverflow.overflow}, overflowY=${result.tableOverflow.overflowY}`
          )
        )
        checks.push(
          formatCheck(
            rootDoesNotOverflowHorizontally,
            'page root does not overflow horizontally',
            `scrollWidth=${result.rootScrollWidth}, clientWidth=${result.rootClientWidth}, overflowX=${result.rootHorizontalOverflow.overflowX}`
          )
        )
        checks.push(
          formatCheck(
            whiteBodyDoesNotOverflowHorizontally,
            'white-body remains width-adaptive to the page root',
            `scrollWidth=${result.whiteScrollWidth}, clientWidth=${result.whiteClientWidth}, overflowX=${result.whiteHorizontalOverflow.overflowX}`
          )
        )
        checks.push(
          formatCheck(
            topLevelSectionsKeepSingleWhiteBodySurface,
            'top-level white-body sections do not reintroduce surfaced cards or duplicate inset owners',
            result.firstTierSectionSurfaceViolations.length > 0
              ? `violations=${result.firstTierSectionSurfaceViolations.map((item) => `${item.label}[region=${item.region || '(none)'}]`).join(', ')}`
              : 'no surfaced top-level section wrappers detected'
          )
        )
        checks.push(
          formatCheck(
            articlesDoNotOverlap,
            'article-based cards do not contain overlapping child blocks',
            result.articleOverlapViolations.length > 0
              ? result.articleOverlapViolations.join(' | ')
              : 'no card overlap detected'
          )
        )
        checks.push(
          formatCheck(
            tableRegionDoesNotOwnHorizontalOverflow,
            'table region is not the horizontal scroll owner',
            `tableRegion=${result.tableClientWidth}/${result.tableScrollWidth}, overflowX=${result.tableHorizontalOverflow.overflowX}`
          )
        )
        checks.push(
          formatCheck(
            tableHorizontalOverflowIsContained,
            'any horizontal overflow stays inside a descendant table wrapper',
            `owner=${result.tableHorizontalOwnerLabel}, ownerWithinTable=${String(result.tableHorizontalOwnerWithinTable)}, ownerIsRegion=${String(result.tableHorizontalOwnerIsRegion)}`
          )
        )
        checks.push(
          formatCheck(
            paginationStaysInsideTableShell,
            'pagination stays inside the managed table shell',
            `paginationExists=${String(result.paginationExists)}, paginationWithinTable=${String(result.paginationWithinTable)}`
          )
        )
      }

      const failures = checks.filter((item) => item.startsWith('[FAIL]'))

      reportLines = [
        'Typical Page Runtime Smoke',
        `- url: ${options.url}`,
        `- page: ${options.page || '(not-bound-to-contract)'}`,
        `- page type: ${result.pageType || '(missing)'}`,
        `- scroll strategy: ${result.scrollStrategy || '(missing)'}`,
        ...(result.mode === 'split-pane'
          ? [
              `- split mode: independent-pane-scroll`,
              `- left pane: ${result.leftPaneLabel || '(missing)'}`,
              `- right pane: ${result.rightPaneLabel || '(missing)'}`,
            ]
          : [
              `- page scroll owner: ${result.pageScrollOwner || '(window)'}`,
              `- root bottom: ${Math.round(result.rootRect.bottom)}`,
              `- white-body bottom: ${Math.round(result.whiteRect.bottom)}`,
              `- table bottom: ${Math.round(result.tableRect.bottom)}`,
            ]),
        ...(sourceSnapshotHash ? [`- source snapshot hash: ${sourceSnapshotHash}`] : []),
        '',
        ...checks,
      ]

      reportLines.forEach((line) => console.log(line))

      if (failures.length > 0) {
        status = 'fail'
        process.exitCode = 1
      } else {
        status = 'pass'
      }
    } finally {
      await browser.close()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    reportLines = [
      'Typical Page Runtime Smoke',
      `- url: ${options?.url || '(missing)'}`,
      `- page: ${options?.page || '(not-bound-to-contract)'}`,
      ...(sourceSnapshotHash ? [`- source snapshot hash: ${sourceSnapshotHash}`] : []),
      '',
      `[FAIL] runtime smoke execution failed`,
      `  ${message}`,
    ]
    status = 'fail'
    if (options?.json) {
      emitJson(
        buildRuntimeSmokeJsonReport({
          checks: [
            {
              id: 'runtime-smoke-execution',
              status: 'fail',
              message: 'runtime smoke execution failed',
              detail: message,
            },
          ],
          errorMessage: message,
          options,
          sourceSnapshotHash,
          status,
        })
      )
    } else {
      console.error(`typical-page-runtime-smoke failed: ${message}`)
      printUsage()
    }
    process.exitCode = 1
  } finally {
    try {
      await persistRuntimeSmokeResult({
        contractContext,
        outputRoot,
        reportLines:
          reportLines.length > 0
            ? reportLines
            : [
                'Typical Page Runtime Smoke',
                `- url: ${options?.url || '(missing)'}`,
                `- page: ${options?.page || '(not-bound-to-contract)'}`,
                ...(sourceSnapshotHash ? [`- source snapshot hash: ${sourceSnapshotHash}`] : []),
                '',
                `[FAIL] runtime smoke exited without producing a report`,
              ],
        sourceSnapshotHash,
        status,
        targetRoot: options?.target || process.cwd(),
      })
    } catch (persistError) {
      const detail = persistError instanceof Error ? persistError.message : String(persistError)
      console.error(`typical-page-runtime-smoke failed to persist contract state: ${detail}`)
      process.exitCode = 1
    }
  }
}

main()
