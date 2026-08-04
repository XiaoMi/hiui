import fs from 'node:fs/promises'
import path from 'node:path'
import { CANONICAL_SHELL_BY_PAGE_TYPE } from './legacy-runtime-provenance.mjs'

export const RUNTIME_PROVIDER_CONTRACT_RELATIVE_PATH = '.local-context/hiui-design/outputs/runtime-provider-contract.json'
export const RUNTIME_ROOT_STYLES_RELATIVE_PATH = 'src/hiui-runtime/styles.css'
export const RUNTIME_SHARED_LIST_RELATIVE_PATH = 'src/hiui-runtime/shared/list.tsx'
export const RUNTIME_FULL_PAGE_EDIT_RELATIVE_PATH = 'src/hiui-runtime/pages/FullPageEditPage.tsx'

export const REQUIRED_REGION_MARKERS_BY_PAGE_TYPE = {
  'table-basic': ['query-filter', 'table', 'pagination'],
  'tree-table': ['query-filter', 'table', 'pagination'],
  'table-stat': ['query-filter', 'stat-section', 'table', 'pagination'],
  'tree-split': ['split-workspace', 'tree', 'right-main', 'query-filter', 'table', 'pagination'],
  'drawer-form': ['form-body'],
  'drawer-detail': ['detail-body'],
  'full-page-edit': ['form-body'],
  'full-page-detail': ['detail-body'],
  'feedback-status': ['feedback-panel'],
}

const MANAGED_RUNTIME_PAGE_COMPONENT_BY_PAGE_TYPE = {
  'table-basic': 'TableBasicPage',
  'tree-table': 'TreeTablePage',
  'table-stat': 'TableStatPage',
  'tree-split': 'TreeSplitPage',
  'drawer-form': 'DrawerFormPage',
  'drawer-detail': 'DrawerDetailPage',
  'full-page-edit': 'FullPageEditPage',
  'full-page-detail': 'FullPageDetailPage',
  'feedback-status': 'FeedbackStatusPage',
}

function normalizeRelativePath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\.\//, '')
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(filePath) {
  if (!(await pathExists(filePath))) return null
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

function issue(code, message, file = RUNTIME_PROVIDER_CONTRACT_RELATIVE_PATH) {
  return { code, message, file, severity: 'error' }
}

function extractCssBlock(source, selector) {
  const selectorIndex = source.indexOf(selector)
  if (selectorIndex < 0) return ''
  const openIndex = source.indexOf('{', selectorIndex + selector.length)
  if (openIndex < 0) return ''
  let depth = 0
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index]
    if (char === '{') depth += 1
    if (char === '}') {
      depth -= 1
      if (depth === 0) return source.slice(openIndex + 1, index)
    }
  }
  return ''
}

function readCssDeclarations(block) {
  const declarations = new Map()
  for (const declaration of block.split(';')) {
    const separatorIndex = declaration.indexOf(':')
    if (separatorIndex < 0) continue
    const property = declaration.slice(0, separatorIndex).trim().toLowerCase()
    const value = declaration.slice(separatorIndex + 1).trim().toLowerCase().replace(/\s+/g, ' ')
    if (property && value) declarations.set(property, value)
  }
  return declarations
}

function isOneOf(value, acceptedValues) {
  return acceptedValues.includes(String(value || '').trim().toLowerCase().replace(/\s+/g, ' '))
}

async function verifyRootSurfaceCss(targetRoot, issues) {
  const stylesPath = path.join(targetRoot, RUNTIME_ROOT_STYLES_RELATIVE_PATH)
  if (!(await pathExists(stylesPath))) {
    issues.push(issue('runtimeProvider.rootSurfaceCss.missing', `runtime root stylesheet is missing: ${RUNTIME_ROOT_STYLES_RELATIVE_PATH}`, RUNTIME_ROOT_STYLES_RELATIVE_PATH))
    return
  }

  const source = await fs.readFile(stylesPath, 'utf8')
  const rootSelector = `[data-hiui-page-root='legacy-host-compatible']`
  const block = extractCssBlock(source, rootSelector) || extractCssBlock(source, `[data-hiui-page-root="legacy-host-compatible"]`)
  if (!block) {
    issues.push(issue('runtimeProvider.rootSurfaceCss.selector', 'runtime root stylesheet must define [data-hiui-page-root=legacy-host-compatible]', RUNTIME_ROOT_STYLES_RELATIVE_PATH))
    return
  }

  const declarations = readCssDeclarations(block)
  const requiredDeclarations = [
    ['display', ['flex'], 'runtimeProvider.rootSurfaceCss.display', 'runtime page root must use display:flex so TablePageFrame can stretch its white body'],
    ['flex-direction', ['column'], 'runtimeProvider.rootSurfaceCss.flexDirection', 'runtime page root must use flex-direction:column so header and body stack vertically'],
    ['flex', ['1 1 0%', '1 1 0px', '1'], 'runtimeProvider.rootSurfaceCss.flex', 'runtime page root must use flex:1 1 0% so it fills the host content area'],
    ['align-self', ['stretch'], 'runtimeProvider.rootSurfaceCss.alignSelf', 'runtime page root must use align-self:stretch inside flex hosts'],
    ['height', ['100%'], 'runtimeProvider.rootSurfaceCss.height', 'runtime page root must use height:100% to complete the height chain'],
    ['min-height', ['0'], 'runtimeProvider.rootSurfaceCss.minHeight', 'runtime page root must use min-height:0 to allow the white body to shrink and scroll correctly'],
    ['min-width', ['0'], 'runtimeProvider.rootSurfaceCss.minWidth', 'runtime page root must use min-width:0 to prevent horizontal overflow in flex layouts'],
    ['overflow', ['hidden'], 'runtimeProvider.rootSurfaceCss.overflow', 'runtime page root must use overflow:hidden so internal white body owns scrolling'],
  ]

  for (const [property, acceptedValues, code, message] of requiredDeclarations) {
    if (!isOneOf(declarations.get(property), acceptedValues)) issues.push(issue(code, message, RUNTIME_ROOT_STYLES_RELATIVE_PATH))
  }
}

function extractFunctionBody(source, functionName) {
  const match = new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)\\s*\\{`).exec(source)
  if (!match) return ''
  const openIndex = match.index + match[0].lastIndexOf('{')
  let depth = 0
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index]
    if (char === '{') depth += 1
    if (char === '}') {
      depth -= 1
      if (depth === 0) return source.slice(openIndex + 1, index)
    }
  }
  return ''
}

function importsNakedHiuiQueryControls(source) {
  const namedImportPattern = /import\s*\{([\s\S]*?)\}\s*from\s*['"]@hi-ui\/hiui['"]/g
  for (const match of source.matchAll(namedImportPattern)) {
    const importNames = match[1].split(',').map((item) => item.trim().split(/\s+as\s+/i)[0].trim())
    if (importNames.includes('Input') || importNames.includes('Select')) return true
  }
  return /import\s+(Input|Select)\s+from\s*['"]@hi-ui\/hiui['"]/.test(source)
}

function definesCustomQueryFieldRenderer(source) {
  if (/\brenderFormItem\b/.test(source)) return true
  const sourceWithoutEmptyRenderer = source.replace(/\brenderer\s*:\s*\{\s*\}\s*,?/g, '')
  return /\brenderer\s*:/.test(sourceWithoutEmptyRenderer)
}

function delegatesToManagedRuntimePage(source, pageType) {
  const componentName = MANAGED_RUNTIME_PAGE_COMPONENT_BY_PAGE_TYPE[pageType]
  if (!componentName) return false
  const importPattern = new RegExp(`import\\s*\\{[^}]*\\b${componentName}\\b[^}]*\\}\\s*from\\s*['"]\\.\\.\\/pages\\/${componentName}['"]`)
  const renderPattern = new RegExp(`<${componentName}\\b[\\s\\S]*\\bslots=\\{slots\\}`)
  return importPattern.test(source) && renderPattern.test(source)
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hasHiddenRegionMarker(source, marker) {
  const escapedMarker = escapeRegex(marker)
  const hiddenBeforeMarker = new RegExp(`<[^>]*(?:\\bhidden\\b|aria-hidden=\\{?['"]?true|display\\s*:\\s*['"]none)[^>]*data-hiui-legacy-region=["']${escapedMarker}["']`, 'i')
  const markerBeforeHidden = new RegExp(`<[^>]*data-hiui-legacy-region=["']${escapedMarker}["'][^>]*(?:\\bhidden\\b|aria-hidden=\\{?['"]?true|display\\s*:\\s*['"]none)`, 'i')
  return hiddenBeforeMarker.test(source) || markerBeforeHidden.test(source)
}

async function verifySharedQueryFilterSkin(targetRoot, issues) {
  const listPath = path.join(targetRoot, RUNTIME_SHARED_LIST_RELATIVE_PATH)
  if (!(await pathExists(listPath))) {
    issues.push(issue('runtimeProvider.sharedQueryFilterSkin.missing', `runtime shared list bridge is missing: ${RUNTIME_SHARED_LIST_RELATIVE_PATH}`, RUNTIME_SHARED_LIST_RELATIVE_PATH))
    return
  }

  const source = await fs.readFile(listPath, 'utf8')
  const queryFieldBody = extractFunctionBody(source, 'toSchemaQueryField')
  if (!queryFieldBody) {
    issues.push(issue('runtimeProvider.sharedQueryFilterSkin.queryFieldMapper', 'runtime shared list bridge must keep toSchemaQueryField as the query-field schema adapter', RUNTIME_SHARED_LIST_RELATIVE_PATH))
    return
  }
  if (importsNakedHiuiQueryControls(source) || /<(Input|Select)\b/.test(queryFieldBody) || /React\.createElement\((Input|Select)\b/.test(queryFieldBody)) {
    issues.push(issue('runtimeProvider.sharedQueryFilterSkin.nakedControl', 'QueryFilter fields must not render naked @hi-ui/hiui Input or Select controls; keep shared-query-filter-skin through schema fields', RUNTIME_SHARED_LIST_RELATIVE_PATH))
  }
  if (definesCustomQueryFieldRenderer(queryFieldBody)) {
    issues.push(issue('runtimeProvider.sharedQueryFilterSkin.customRenderer', 'QueryFilter fields must not define custom renderFormItem/renderer in toSchemaQueryField because it bypasses shared-query-filter-skin', RUNTIME_SHARED_LIST_RELATIVE_PATH))
  }
  if (!/type\s*===\s*['"]select['"][\s\S]*?return\s+['"]select['"]/.test(source)) {
    issues.push(issue('runtimeProvider.sharedQueryFilterSkin.selectValueType', 'select query fields must map to schema valueType select so shared-query-filter-skin resolves the official field skin', RUNTIME_SHARED_LIST_RELATIVE_PATH))
  }
}

async function verifyFullPageEditStructure(targetRoot, issues) {
  const pagePath = path.join(targetRoot, RUNTIME_FULL_PAGE_EDIT_RELATIVE_PATH)
  if (!(await pathExists(pagePath))) {
    issues.push(issue('runtimeProvider.fullPageEditStructure.missing', `full-page-edit runtime page is missing: ${RUNTIME_FULL_PAGE_EDIT_RELATIVE_PATH}`, RUNTIME_FULL_PAGE_EDIT_RELATIVE_PATH))
    return
  }

  const source = await fs.readFile(pagePath, 'utf8')
  const requiredPatterns = [
    ['provider', /\bProEditPageProvider\b/, 'full-page-edit runtime must wrap the page with ProEditPageProvider'],
    ['shell', /\bProEditPage\b/, 'full-page-edit runtime must render ProEditPage'],
    ['formBridge', /\bForm\b/, 'full-page-edit runtime must render the official Form bridge'],
    ['submitButton', /\bSubmitButton\b/, 'full-page-edit runtime must use the official SubmitButton'],
    ['cancelButton', /\bCancelButton\b/, 'full-page-edit runtime must use the official CancelButton'],
    ['formScrollBody', /proEditPageShellStyles\.formScrollBody/, 'full-page-edit runtime must use proEditPageShellStyles.formScrollBody'],
    ['inlineEditFooter', /proEditPageShellStyles\.inlineEditFooter/, 'full-page-edit runtime must use proEditPageShellStyles.inlineEditFooter'],
    ['headerPortal', /TypicalPageHeaderPortal/, 'full-page-edit runtime must render the header through TypicalPageHeaderPortal'],
    ['formBodyRegion', /data-hiui-legacy-region=["']form-body["']/, 'full-page-edit runtime must mark the form-body region'],
    ['footerRegion', /data-hiui-legacy-region=["']footer["']/, 'full-page-edit runtime must mark the footer region'],
    ['footerActionsRegion', /data-hiui-legacy-region=["']footer-actions["']/, 'full-page-edit runtime must mark the footer-actions region'],
  ]

  for (const [suffix, pattern, message] of requiredPatterns) {
    if (!pattern.test(source)) issues.push(issue(`runtimeProvider.fullPageEditStructure.${suffix}`, message, RUNTIME_FULL_PAGE_EDIT_RELATIVE_PATH))
  }
}

export async function readRuntimeProviderContract({ targetRoot } = {}) {
  return readJsonIfExists(path.join(targetRoot, RUNTIME_PROVIDER_CONTRACT_RELATIVE_PATH))
}

export function getRuntimeProviderPageEntry(contract, pageType) {
  const entry = contract?.pageTypes?.[pageType]
  if (contract?.provider !== 'project-runtime-adapter' || entry?.status !== 'ready') return null
  return {
    runtimeEntry: normalizeRelativePath(entry.runtimeEntry),
    componentName: String(entry.componentName || '').trim(),
    canonicalShell: String(entry.canonicalShell || '').trim(),
  }
}

export async function verifyRuntimeProviderContract({ targetRoot, pageType } = {}) {
  const contract = await readRuntimeProviderContract({ targetRoot })
  const issues = []
  if (!contract) return { ok: false, status: 'missing', contract: null, entry: null, issues: [] }

  await verifyRootSurfaceCss(targetRoot, issues)

  if (contract.schemaVersion !== 'hiui-runtime-provider-contract.v1') {
    issues.push(issue('runtimeProvider.schemaVersion', 'runtime provider contract schemaVersion must be hiui-runtime-provider-contract.v1'))
  }
  if (contract.mode !== 'legacy-host-compatible') {
    issues.push(issue('runtimeProvider.mode', 'runtime provider contract mode must be legacy-host-compatible'))
  }
  if (contract.provider !== 'project-runtime-adapter') {
    issues.push(issue('runtimeProvider.provider', 'runtime provider contract must declare provider project-runtime-adapter when replacing official shell runtime'))
  }

  const entry = contract.pageTypes?.[pageType]
  if (!entry) {
    issues.push(issue('runtimeProvider.pageType.missing', `runtime provider contract must declare pageTypes.${pageType}`))
  } else {
    const runtimeEntry = normalizeRelativePath(entry.runtimeEntry)
    const absoluteRuntimeEntry = path.join(targetRoot, runtimeEntry)
    const expectedShell = CANONICAL_SHELL_BY_PAGE_TYPE[pageType]
    const regionMarkers = Array.isArray(entry.regionMarkers) ? entry.regionMarkers.map((item) => String(item || '').trim()).filter(Boolean) : []
    const requiredMarkers = REQUIRED_REGION_MARKERS_BY_PAGE_TYPE[pageType] || []

    if (requiredMarkers.includes('query-filter')) await verifySharedQueryFilterSkin(targetRoot, issues)
    if (pageType === 'full-page-edit') await verifyFullPageEditStructure(targetRoot, issues)

    if (entry.status !== 'ready') issues.push(issue('runtimeProvider.pageType.status', `runtime provider pageTypes.${pageType}.status must be ready`))
    if (!runtimeEntry.startsWith('src/hiui-runtime/adapters/')) {
      issues.push(issue('runtimeProvider.runtimeEntry.boundary', `runtime provider runtimeEntry must stay under src/hiui-runtime/adapters/**; current value is ${runtimeEntry}`))
    }
    if (!String(entry.componentName || '').trim()) issues.push(issue('runtimeProvider.componentName', `runtime provider pageTypes.${pageType}.componentName is required`))
    if (expectedShell && entry.canonicalShell !== expectedShell) {
      issues.push(issue('runtimeProvider.canonicalShell', `runtime provider pageTypes.${pageType}.canonicalShell must be ${expectedShell}`))
    }
    if (entry.consumesTypedSlots !== true) {
      issues.push(issue('runtimeProvider.consumesTypedSlots', `runtime provider pageTypes.${pageType}.consumesTypedSlots must be true`))
    }
    for (const marker of requiredMarkers) {
      if (!regionMarkers.includes(marker)) issues.push(issue('runtimeProvider.regionMarker.missing', `runtime provider pageTypes.${pageType}.regionMarkers must include ${marker}`))
    }
    if (!(await pathExists(absoluteRuntimeEntry))) {
      issues.push(issue('runtimeProvider.runtimeEntry.missing', `runtime provider runtimeEntry file is missing: ${runtimeEntry}`, runtimeEntry))
    } else {
      const source = await fs.readFile(absoluteRuntimeEntry, 'utf8')
      if (!/\bslots\b/.test(source)) issues.push(issue('runtimeProvider.slotsBinding.missing', `runtime provider runtimeEntry must consume typed slots prop`, runtimeEntry))
      if (/from\s+['"].*src\/views\//.test(source) || /from\s+['"]\.\.\/\.\.\/views\//.test(source)) {
        issues.push(issue('runtimeProvider.businessImport.disallowed', `runtime provider runtimeEntry must not import business page source from src/views/**`, runtimeEntry))
      }
      const delegatedToManagedRuntimePage = delegatesToManagedRuntimePage(source, pageType)
      for (const marker of requiredMarkers) {
        if (hasHiddenRegionMarker(source, marker)) {
          issues.push(issue('runtimeProvider.sourceRegionMarker.hidden', `runtime provider runtimeEntry must not use hidden data-hiui-legacy-region="${marker}" as proof`, runtimeEntry))
        }
        const markerPattern = new RegExp(`data-hiui-legacy-region=["']${marker}["']`)
        if (!delegatedToManagedRuntimePage && !markerPattern.test(source)) issues.push(issue('runtimeProvider.sourceRegionMarker.missing', `runtime provider runtimeEntry source must render data-hiui-legacy-region="${marker}" or delegate to the managed runtime page`, runtimeEntry))
      }
    }
  }

  return {
    ok: issues.length === 0,
    status: issues.length === 0 ? 'ready' : 'blocked',
    contract,
    entry: getRuntimeProviderPageEntry(contract, pageType),
    issues,
  }
}
