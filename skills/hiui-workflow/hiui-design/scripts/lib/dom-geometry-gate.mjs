import { runQueryFilterSurfaceCheck, runWhiteBodySurfaceCheck } from './runtime-surface-gates.mjs'

function numberOrNull(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function normalizeRect(rect) {
  if (!rect || typeof rect !== 'object') return null
  const left = numberOrNull(rect.left)
  const top = numberOrNull(rect.top)
  const width = numberOrNull(rect.width)
  const height = numberOrNull(rect.height)
  const right = numberOrNull(rect.right) ?? (left !== null && width !== null ? left + width : null)
  const bottom = numberOrNull(rect.bottom) ?? (top !== null && height !== null ? top + height : null)
  if ([left, top, width, height, right, bottom].some((value) => value === null)) return null
  return { left, top, width, height, right, bottom }
}

function pushIssue(issues, code, message, severity = 'error') {
  issues.push({ code, message, severity })
}

const DRAWER_SHELL_RIGHT_TOLERANCE = 64

function getGeometry(runtimeEvidence) {
  return runtimeEvidence?.geometry && typeof runtimeEvidence.geometry === 'object' ? runtimeEvidence.geometry : {}
}

const REQUIRED_GEOMETRY_KEYS_BY_PAGE_TYPE = {
  'table-basic': ['root', 'header', 'whiteBody', 'queryFilter', 'table', 'pagination'],
  'tree-table': ['root', 'header', 'whiteBody', 'queryFilter', 'table', 'pagination'],
  'table-stat': ['root', 'header', 'whiteBody', 'queryFilter', 'table', 'pagination'],
  'tree-split': ['root', 'header', 'whiteBody', 'splitWorkspace', 'tree', 'rightMain', 'queryFilter', 'table', 'pagination'],
  'drawer-form': ['root', 'drawerShell', 'drawerBody', 'formBody', 'drawerFooter'],
  'drawer-detail': ['root', 'drawerShell', 'drawerBody', 'detailBody', 'drawerFooter'],
  'full-page-edit': ['root', 'header', 'formBody', 'footer', 'footerActions'],
  'full-page-detail': ['root', 'header', 'whiteBody', 'detailBody'],
  'feedback-status': ['root', 'header', 'whiteBody', 'feedbackPanel'],
}

function getComputedStyles(runtimeEvidence) {
  return runtimeEvidence?.computedStyles && typeof runtimeEvidence.computedStyles === 'object' ? runtimeEvidence.computedStyles : {}
}

function normalizeStyleMap(styles) {
  if (!styles || typeof styles !== 'object') return null
  return Object.fromEntries(Object.entries(styles).map(([key, value]) => [key, String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')]))
}

export function runDomGeometryGate({ runtimeEvidence = null, profile = 'preview', pageType = '' } = {}) {
  const result = runtimeEvidence?.result && typeof runtimeEvidence.result === 'object' ? runtimeEvidence.result : {}
  const resolvedPageType = String(pageType || result.pageType || 'table-basic')
  const geometry = getGeometry(runtimeEvidence)
  const computedStyles = getComputedStyles(runtimeEvidence)
  const root = normalizeRect(geometry.root)
  const header = normalizeRect(geometry.header)
  const whiteBody = normalizeRect(geometry.whiteBody)
  const splitWorkspace = normalizeRect(geometry.splitWorkspace)
  const tree = normalizeRect(geometry.tree)
  const rightMain = normalizeRect(geometry.rightMain)
  const queryFilter = normalizeRect(geometry.queryFilter)
  const table = normalizeRect(geometry.table)
  const pagination = normalizeRect(geometry.pagination)
  const formBody = normalizeRect(geometry.formBody)
  const detailBody = normalizeRect(geometry.detailBody)
  const footer = normalizeRect(geometry.footer)
  const footerActions = normalizeRect(geometry.footerActions)
  const drawerShell = normalizeRect(geometry.drawerShell)
  const drawerBody = normalizeRect(geometry.drawerBody)
  const drawerFooter = normalizeRect(geometry.drawerFooter)
  const feedbackPanel = normalizeRect(geometry.feedbackPanel)
  const rootStyles = normalizeStyleMap(computedStyles.root)
  const issues = []

  const queryFilterSurface = runQueryFilterSurfaceCheck({ result, profile })
  issues.push(...queryFilterSurface.issues)
  if (Number(result.tableCount || 0) > 1) {
    pushIssue(issues, 'duplicate-table', 'runtime DOM contains more than one table surface', 'warning')
  }

  const geometryByKey = { root, header, whiteBody, splitWorkspace, tree, rightMain, queryFilter, table, pagination, formBody, detailBody, footer, footerActions, drawerShell, drawerBody, drawerFooter, feedbackPanel }
  const requiredGeometryKeys = REQUIRED_GEOMETRY_KEYS_BY_PAGE_TYPE[resolvedPageType] || REQUIRED_GEOMETRY_KEYS_BY_PAGE_TYPE['table-basic']
  const missingGeometryKeys = requiredGeometryKeys.filter((key) => !geometryByKey[key])
  if (missingGeometryKeys.length > 0) {
    pushIssue(
      issues,
      'geometry-missing',
      `runtime evidence must include ${missingGeometryKeys.join('/')} geometry for ${resolvedPageType}`,
      profile === 'delivery' ? 'error' : 'warning'
    )
  }

  if (header && (header.height < 48 || header.height > 88)) {
    pushIssue(issues, 'header-height-out-of-range', 'header height should stay within the typical page rhythm')
  }
  const whiteBodySurface = runWhiteBodySurfaceCheck({ root, whiteBody, rootStyles, profile })
  issues.push(...whiteBodySurface.issues)
  if (header && whiteBody && whiteBody.top < header.bottom - 1) {
    pushIssue(issues, 'white-body-overlaps-header', 'white body should start after the page header')
  }
  if (queryFilter && table && queryFilter.top > table.top) {
    pushIssue(issues, 'query-filter-after-table', 'query filter should appear before the table')
  }
  if (table && pagination && pagination.top < table.top) {
    pushIssue(issues, 'pagination-before-table', 'pagination should appear after the table')
  }
  if (splitWorkspace && tree && !(
    tree.left >= splitWorkspace.left - 1 &&
    tree.right <= splitWorkspace.right + 1 &&
    tree.top >= splitWorkspace.top - 1 &&
    tree.bottom <= splitWorkspace.bottom + 1
  )) {
    pushIssue(issues, 'tree-outside-split-workspace', 'tree-split left tree must stay inside the split workspace')
  }
  if (splitWorkspace && rightMain && !(
    rightMain.left >= splitWorkspace.left - 1 &&
    rightMain.right <= splitWorkspace.right + 1 &&
    rightMain.top >= splitWorkspace.top - 1 &&
    rightMain.bottom <= splitWorkspace.bottom + 1
  )) {
    pushIssue(issues, 'right-main-outside-split-workspace', 'tree-split right main must stay inside the split workspace')
  }
  if (tree && rightMain && rightMain.left < tree.right - 1) {
    pushIssue(issues, 'right-main-left-of-tree', 'tree-split right main should appear to the right of the tree')
  }
  if (footer && footerActions && (footerActions.bottom > footer.bottom + 1 || footerActions.top < footer.top - 1)) {
    pushIssue(issues, 'footer-actions-outside-footer', 'footer actions must stay inside the page footer')
  }
  if (formBody && footer && footer.top < formBody.bottom - 1) {
    pushIssue(issues, 'form-footer-overlaps-body', 'full-page edit footer should appear after the form body')
  }
  if (drawerShell && drawerBody && !(
    drawerBody.left >= drawerShell.left - 1 &&
    drawerBody.right <= drawerShell.right + DRAWER_SHELL_RIGHT_TOLERANCE &&
    drawerBody.top >= drawerShell.top - 1 &&
    drawerBody.bottom <= drawerShell.bottom + 1
  )) {
    pushIssue(issues, 'drawer-body-outside-shell', 'drawer body must stay inside the governed drawer shell')
  }
  if (drawerShell && drawerFooter && !(
    drawerFooter.left >= drawerShell.left - 1 &&
    drawerFooter.right <= drawerShell.right + DRAWER_SHELL_RIGHT_TOLERANCE &&
    drawerFooter.top >= drawerShell.top - 1 &&
    drawerFooter.bottom <= drawerShell.bottom + 1
  )) {
    pushIssue(issues, 'drawer-footer-outside-shell', 'drawer footer must stay inside the governed drawer shell')
  }
  if (drawerBody && drawerFooter && drawerFooter.top < drawerBody.bottom - 1) {
    pushIssue(issues, 'drawer-footer-overlaps-body', 'drawer footer should appear after the drawer body')
  }

  const blockingIssues = profile === 'delivery' ? issues.filter((issue) => issue.severity !== 'warning') : []
  return {
    ok: blockingIssues.length === 0,
    issues,
    blockingIssues,
    geometry: { root, header, whiteBody, splitWorkspace, tree, rightMain, queryFilter, table, pagination, formBody, detailBody, footer, footerActions, drawerShell, drawerBody, drawerFooter, feedbackPanel },
    computedStyles: { root: rootStyles },
    metrics: {
      ...whiteBodySurface.metrics,
    },
  }
}
