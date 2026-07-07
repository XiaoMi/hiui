import fs from 'node:fs'
import path from 'node:path'
import { CONTRACT_MARKER } from './detection/typical-page-candidates.mjs'
import {
  getManagedPageLocalBypasses,
  getManagedPageSemanticContract,
  getRequiredOwnershipRolesForPageType,
  getRequiredRegionsForPageType,
} from './rules-only-page-contracts.mjs'
import {
  getAdapterRegistryEntry,
  isLocalBypassContainmentAllowed,
} from './adapter-registry.mjs'

export const PAGE_TYPE_MARKER_PREFIX = 'hiui-design page-type:'
export const ARCHETYPE_MARKER_PREFIX = 'hiui-design archetype:'
export const SHELL_MARKER_PREFIX = 'hiui-design shell:'
export const TEMPLATE_MARKER_PREFIX = 'hiui-design template:'
export const EXAMPLE_MARKER_PREFIX = 'hiui-design example:'
export const HOST_ADAPTER_MARKER_PREFIX = 'hiui-design host-adapter:'
export const HOST_ARCHETYPE_MARKER_PREFIX = 'hiui-design host-archetype:'
export const SCROLL_STRATEGY_MARKER_PREFIX = 'hiui-design scroll-strategy:'
export const TOPOLOGY_MARKER_PREFIX = 'hiui-design topology:'
export const LAYOUT_STRATEGY_MARKER_PREFIX = 'hiui-design layout-strategy:'
const FIXED_TEMPLATE_PAGE_TYPES = new Set([
  'data-visualization',
  'table-stat',
  'full-page-edit',
  'full-page-detail',
])

const CRITICAL_REGION_CAPABILITIES_PATH = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '..',
  '..',
  'rules',
  'critical-region-capabilities.json'
)

let criticalRegionCapabilitiesCache = null

function readCriticalRegionCapabilities() {
  if (criticalRegionCapabilitiesCache) {
    return criticalRegionCapabilitiesCache
  }

  try {
    criticalRegionCapabilitiesCache = JSON.parse(readTextIfExists(CRITICAL_REGION_CAPABILITIES_PATH) || '{}')
  } catch {
    criticalRegionCapabilitiesCache = {}
  }

  return criticalRegionCapabilitiesCache
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function readTextIfExists(targetPath) {
  if (!targetPath || !fs.existsSync(targetPath)) {
    return ''
  }

  return fs.readFileSync(targetPath, 'utf8')
}

function resolveProjectSkillRoot(targetRoot) {
  const projectSkillRoot = path.join(targetRoot, '.local-context', 'hiui-design')
  const adapterRegistryPath = path.join(projectSkillRoot, 'rules', 'adapter-registry.json')

  return fs.existsSync(adapterRegistryPath) ? projectSkillRoot : undefined
}

function extractImportSpecifiers(source) {
  return Array.from(
    source.matchAll(
      /import\s+(?:type\s+)?(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    )
  )
    .map((match) => match[1] || match[2] || '')
    .filter(Boolean)
}

function readImportedStyleSources(sourceFilePath, sourceRaw) {
  return extractImportSpecifiers(sourceRaw)
    .filter((specifier) => specifier.startsWith('.') && /\.(?:css|scss)$/.test(specifier))
    .map((specifier) => path.resolve(path.dirname(sourceFilePath), specifier))
    .filter((absPath) => fs.existsSync(absPath))
    .map((absPath) => readTextIfExists(absPath))
    .join('\n')
}

const LOCAL_SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']
const QUERYFILTER_UPSTREAM_FIELDMAP_ESCAPE = 'hiui-design allow-queryfilter-with-upstream-fieldmap'
const SAFE_EXTERNAL_UI_PACKAGE_PREFIXES = [
  '@hi-ui/',
  '@hiui-design/',
  '@ant-design/charts',
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
]

function resolveLocalScriptImportPath({ sourceFilePath, specifier, targetRoot }) {
  if (!specifier) return ''

  let basePath = ''
  if (specifier.startsWith('@/')) {
    basePath = path.join(targetRoot, 'src', specifier.slice(2))
  } else if (specifier.startsWith('.')) {
    basePath = path.resolve(path.dirname(sourceFilePath), specifier)
  } else {
    return ''
  }

  const candidates = [
    basePath,
    ...LOCAL_SOURCE_EXTENSIONS.map((extension) => `${basePath}${extension}`),
    ...LOCAL_SOURCE_EXTENSIONS.map((extension) => path.join(basePath, `index${extension}`)),
  ]

  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || ''
}

function collectImportedLocalContext({
  entryFilePath,
  targetRoot,
  maxFiles = 24,
}) {
  const visited = new Set()
  const sourceChunks = []
  const styleChunks = []
  const fileSources = []

  function visit(filePath) {
    if (!filePath || visited.has(filePath) || visited.size >= maxFiles || !fs.existsSync(filePath)) {
      return
    }

    visited.add(filePath)
    const raw = readTextIfExists(filePath)
    if (!raw) return

    const isMockFixture = /\.(?:mock|fixture)\.[cm]?[jt]sx?$/.test(filePath)
    if (!isMockFixture) {
      sourceChunks.push(raw)
    }
    fileSources.push({
      filePath,
      sourceRaw: raw,
    })
    styleChunks.push(readImportedStyleSources(filePath, raw))

    for (const specifier of extractImportSpecifiers(raw)) {
      const resolvedFilePath = resolveLocalScriptImportPath({
        sourceFilePath: filePath,
        specifier,
        targetRoot,
      })
      if (resolvedFilePath) {
        visit(resolvedFilePath)
      }
    }
  }

  visit(entryFilePath)

  return {
    sourceRaw: sourceChunks.filter(Boolean).join('\n'),
    styleRaw: styleChunks.filter(Boolean).join('\n'),
    fileSources,
    visitedFiles: [...visited],
  }
}

function extractImportDeclarations(sourceRaw) {
  return Array.from(
    String(sourceRaw || '').matchAll(
      /import\s+(?!type\b)([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g
    )
  ).map((match) => ({
    importClause: String(match[1] || '').trim(),
    packageSpec: String(match[2] || '').trim(),
  }))
}

function isSafeExternalUiPackage(packageSpec) {
  return SAFE_EXTERNAL_UI_PACKAGE_PREFIXES.some((prefix) => {
    if (packageSpec === prefix) {
      return true
    }

    if (prefix.endsWith('/')) {
      return packageSpec.startsWith(prefix)
    }

    return packageSpec.startsWith(`${prefix}/`)
  })
}

function extractImportedBindings(importClause) {
  const bindings = new Set()
  const normalizedClause = String(importClause || '').replace(/\btype\s+/g, '').trim()
  if (!normalizedClause) {
    return []
  }

  const namedMatch = normalizedClause.match(/\{([\s\S]*?)\}/)
  if (namedMatch) {
    for (const item of String(namedMatch[1] || '').split(',')) {
      const cleaned = item.trim()
      if (!cleaned) continue
      const [leftPart] = cleaned.split(/\s+as\s+/i)
      const aliasPart = cleaned.split(/\s+as\s+/i)[1]
      const binding = String(aliasPart || leftPart || '').trim()
      if (binding) bindings.add(binding)
    }
  }

  const clauseWithoutNamed = normalizedClause.replace(/\{[\s\S]*?\}/g, '').trim()
  for (const part of clauseWithoutNamed.split(',')) {
    const cleaned = part.trim()
    if (!cleaned) continue

    const namespaceMatch = cleaned.match(/^\*\s+as\s+([A-Za-z_$][\w$]*)$/)
    if (namespaceMatch) {
      bindings.add(namespaceMatch[1])
      continue
    }

    if (/^[A-Za-z_$][\w$]*$/.test(cleaned)) {
      bindings.add(cleaned)
    }
  }

  return [...bindings]
}

function bindingLooksLikeJsxComponent(binding) {
  return /^[A-Z][\w$]*$/.test(String(binding || '').trim())
}

function bindingAppearsInJsx(sourceRaw, binding) {
  const escapedBinding = escapeRegExp(binding)
  return new RegExp(
    `<${escapedBinding}\\b|jsx\\s*\\(\\s*${escapedBinding}\\b|createElement\\s*\\(\\s*${escapedBinding}\\b`
  ).test(sourceRaw)
}

function collectExternalUiImportCandidates(sourceRaw) {
  const candidates = []

  for (const declaration of extractImportDeclarations(sourceRaw)) {
    if (
      !declaration.packageSpec ||
      declaration.packageSpec.startsWith('.') ||
      declaration.packageSpec.startsWith('@/') ||
      isSafeExternalUiPackage(declaration.packageSpec)
    ) {
      continue
    }

    const importedBindings = extractImportedBindings(declaration.importClause)
    const jsxBindings = importedBindings.filter(
      (binding) => bindingLooksLikeJsxComponent(binding) && bindingAppearsInJsx(sourceRaw, binding)
    )

    if (jsxBindings.length === 0) {
      continue
    }

    candidates.push({
      packageSpec: declaration.packageSpec,
      bindings: jsxBindings,
    })
  }

  return candidates
}

function summarizeExternalUiCandidates(candidates) {
  return collectUniqueSnippets(
    candidates.map((candidate) => `${candidate.packageSpec} (${candidate.bindings.join(', ')})`),
    6
  )
}

function resolveContractLinkedPath(targetRoot, contractPath) {
  const normalized = String(contractPath || '').trim()
  if (!normalized) return ''
  return path.resolve(targetRoot, normalized)
}

function hasPageLevelOwnerMarkers(sourceRaw) {
  return (
    /data-hiui5-owner-(?:content-slot|white-body|outer-padding|main-scroll)\b/.test(sourceRaw) ||
    /data-hiui5-region\s*=\s*['"]header['"]/.test(sourceRaw)
  )
}

function mountsManagedShellInEntry(sourceRaw) {
  return (
    /\bFixedDashboardPageFrame\b/.test(sourceRaw) ||
    /\bManagedWorkbenchPageFrame\b/.test(sourceRaw) ||
    /\bManagedFullPageDetailShell\b/.test(sourceRaw) ||
    /\bManagedContextMainSplitShell\b/.test(sourceRaw) ||
    /\bTablePageFrame\b/.test(sourceRaw) ||
    /\bStatListPageFrame\b/.test(sourceRaw) ||
    /\bTreeSplitPageFrame\b/.test(sourceRaw) ||
    /\bProEditPage\b/.test(sourceRaw) ||
    /\bProDetailPage\b/.test(sourceRaw) ||
    /\bProFormDrawer\b/.test(sourceRaw) ||
    /\bProDetailDrawer\b/.test(sourceRaw) ||
    /\bFeedbackStatePanel\b/.test(sourceRaw)
  )
}

function isSharedManagedShellHelperFile(filePath, targetRoot) {
  const relativePath = path.relative(targetRoot, filePath).replace(/\\/g, '/')
  return /(^|\/)src\/typical-page-reuse\/components\/managed-page\/.+\.[cm]?[jt]sx?$/.test(
    relativePath
  )
}

function validateLocalBypassContracts({
  contract,
  sourceRaw,
  importedLocalContext,
  targetRoot,
  pathLabel,
}) {
  const errors = []
  const entryCandidates = collectExternalUiImportCandidates(sourceRaw)

  if (entryCandidates.length > 0) {
    errors.push(
      `${pathLabel} directly imports external UI packages (${summarizeExternalUiCandidates(
        entryCandidates
      ).join(
        '; '
      )}). Managed pages must keep third-party UI dependencies behind local adapter / token-bridge wrappers instead of mounting them in the page entry.`
    )
  }

  const localBypasses = getManagedPageLocalBypasses(contract)
  const hostAdapterId = String(contract?.adapterContract?.hostAdapterId || '').trim()
  const registrySkillRoot = resolveProjectSkillRoot(targetRoot)
  const localFileSources = Array.isArray(importedLocalContext?.fileSources)
    ? importedLocalContext.fileSources.filter(
        (entry) =>
          path.resolve(entry.filePath) !== path.resolve(path.join(targetRoot, contract.generatedPagePath)) &&
          !isSharedManagedShellHelperFile(path.resolve(entry.filePath), targetRoot)
      )
    : []
  const candidateMap = new Map()

  for (const fileEntry of localFileSources) {
    for (const candidate of collectExternalUiImportCandidates(fileEntry.sourceRaw)) {
      const existing = candidateMap.get(candidate.packageSpec) || {
        packageSpec: candidate.packageSpec,
        bindings: new Set(),
        filePaths: new Set(),
      }
      candidate.bindings.forEach((binding) => existing.bindings.add(binding))
      existing.filePaths.add(path.resolve(fileEntry.filePath))
      candidateMap.set(candidate.packageSpec, existing)
    }
  }

  for (const candidate of candidateMap.values()) {
    const bypass = localBypasses.find((entry) => entry.packageSpec === candidate.packageSpec)

    if (!bypass) {
      errors.push(
        `${pathLabel} reaches external UI package ${candidate.packageSpec} through local helper code (${[
          ...candidate.filePaths,
        ]
          .map((filePath) => path.relative(targetRoot, filePath))
          .join(
            ', '
          )}), but contract.adapterContract.localBypasses does not declare that package. Declare the capability gap, adapter path, token bridge path, and containment before continuing.`
      )
      continue
    }

    if (
      hostAdapterId &&
      bypass.ownerContainment &&
      !isLocalBypassContainmentAllowed(hostAdapterId, bypass.ownerContainment, { skillRoot: registrySkillRoot })
    ) {
      errors.push(
        `${pathLabel} declares localBypasses package ${candidate.packageSpec}, but ownerContainment ${bypass.ownerContainment} is not allowed by adapter-registry entry ${hostAdapterId}. Keep third-party primitives inside the adapter's declared leaf/control containment.`
      )
    }

    const adapterAbsPath = resolveContractLinkedPath(targetRoot, bypass.adapterPath)
    if (!adapterAbsPath || !fs.existsSync(adapterAbsPath)) {
      errors.push(
        `${pathLabel} declares localBypasses package ${candidate.packageSpec}, but adapterPath ${bypass.adapterPath || '(missing)'} does not exist.`
      )
    } else {
      const adapterRaw = readTextIfExists(adapterAbsPath)
      if (!candidate.filePaths.has(adapterAbsPath)) {
        errors.push(
          `${pathLabel} declares localBypasses package ${candidate.packageSpec}, but adapterPath ${bypass.adapterPath} is not the local file that imports that package. Keep the third-party dependency behind the named adapter instead of scattering it across helpers.`
        )
      }

      if (adapterRaw && hasPageLevelOwnerMarkers(adapterRaw)) {
        errors.push(
          `${pathLabel} declares localBypasses package ${candidate.packageSpec}, but adapterPath ${bypass.adapterPath} exposes page-level owner/header markers. Third-party adapters must stay inside local section/panel bodies and cannot become white-body / outer-padding / main-scroll / header carriers.`
        )
      }
    }

    const tokenBridgeAbsPath = resolveContractLinkedPath(targetRoot, bypass.tokenBridgePath)
    if (!tokenBridgeAbsPath || !fs.existsSync(tokenBridgeAbsPath)) {
      errors.push(
        `${pathLabel} declares localBypasses package ${candidate.packageSpec}, but tokenBridgePath ${bypass.tokenBridgePath || '(missing)'} does not exist.`
      )
    }
  }

  return errors
}

function countLiteralAttr(sourceRaw, attrName, attrValue) {
  const pattern = new RegExp(
    `${escapeRegExp(attrName)}\\s*=\\s*(['"])${escapeRegExp(attrValue)}\\1`,
    'g'
  )
  return Array.from(sourceRaw.matchAll(pattern)).length
}

function countObjectLiteralKeyValue(sourceRaw, key, value) {
  const pattern = new RegExp(
    `(['"])${escapeRegExp(key)}\\1\\s*:\\s*(['"])${escapeRegExp(value)}\\2`,
    'g'
  )
  return Array.from(sourceRaw.matchAll(pattern)).length
}

function hasLiteralAttr(sourceRaw, attrName, attrValue) {
  return countLiteralAttr(sourceRaw, attrName, attrValue) > 0
}

function buildAttrPresencePattern(attrName) {
  return `${escapeRegExp(attrName)}(?:\\s*=\\s*(?:\\{[^}]*\\}|"[^"]*"|'[^']*'))?`
}

function countAttrPresence(sourceRaw, attrName) {
  const pattern = new RegExp(buildAttrPresencePattern(attrName), 'g')
  return Array.from(sourceRaw.matchAll(pattern)).length
}

function stripLeadingJsxNoise(content) {
  return String(content || '')
    .replace(/^(?:\s|\{\/\*[\s\S]*?\*\/\})+/, '')
    .trimStart()
}

function hasNonSelfClosingAttrContainer(sourceRaw, attrName, attrValue) {
  const pattern = new RegExp(
    `<([A-Za-z][\\w.]*)[^>]*${escapeRegExp(attrName)}\\s*=\\s*(['"])${escapeRegExp(
      attrValue
    )}\\2[^>]*>([\\s\\S]*?)<\\/\\1>`,
    'g'
  )

  return Array.from(sourceRaw.matchAll(pattern)).some((match) => {
    const inner = String(match[3] || '').trim()
    return Boolean(inner)
  })
}

function hasNonSelfClosingAttrPresenceContainer(sourceRaw, attrName) {
  const pattern = new RegExp(
    `<([A-Za-z][\\w.]*)[^>]*${buildAttrPresencePattern(attrName)}[^>]*>([\\s\\S]*?)<\\/\\1>`,
    'g'
  )

  return Array.from(sourceRaw.matchAll(pattern)).some((match) => {
    const inner = String(match[2] || '').trim()
    return Boolean(inner)
  })
}

function countToken(sourceRaw, token) {
  if (!token) return 0
  return Array.from(sourceRaw.matchAll(new RegExp(escapeRegExp(token), 'g'))).length
}

function countManagedRootAttrSignals(sourceRaw, attrName, attrValue) {
  return countLiteralAttr(sourceRaw, attrName, attrValue) + countObjectLiteralKeyValue(sourceRaw, attrName, attrValue)
}

function usesFixedDashboardPageFrame(sourceRaw) {
  return /\b(FixedDashboardPageFrame|ManagedWorkbenchPageFrame)\b/.test(sourceRaw)
}

function inheritsManagedHeaderFromHostSlot(sourceRaw) {
  return (
    (usesFixedDashboardPageFrame(sourceRaw) && /\bHostPageHeaderPortal\b/.test(sourceRaw)) ||
    /\bHostHeaderSlot\b/.test(sourceRaw)
  )
}

function hasManagedRegionCarrier(sourceRaw, regionName) {
  if (hasNonSelfClosingAttrContainer(sourceRaw, 'data-hiui5-region', regionName)) {
    return true
  }

  if (regionName === 'header' && inheritsManagedHeaderFromHostSlot(sourceRaw)) {
    return true
  }

  if (
    mountsRealShellRuntime(sourceRaw, 'StatListPageFrame') &&
    ['header', 'stat-section', 'query-filter', 'table', 'pagination'].includes(regionName)
  ) {
    if (regionName === 'query-filter') {
      return /\bqueryFields\s*=/.test(sourceRaw) || /\bQueryFilter\b/.test(sourceRaw)
    }

    if (regionName === 'stat-section') {
      return /\bstatSection\s*=/.test(sourceRaw) || /\bStatOverviewGrid\b/.test(sourceRaw)
    }

    return true
  }

  if (regionName === 'header' && /\b(?:HostPageHeaderPortal|TypicalPageHeaderPortal)\b/.test(sourceRaw)) {
    return true
  }

  if (regionName === 'form-body') {
    return /\bproEditPageShellStyles\.formScrollBody\b/.test(sourceRaw)
  }

  if (regionName === 'footer') {
    return /\bproEditPageShellStyles\.inlineEditFooter\b/.test(sourceRaw)
  }

  if (regionName === 'detail-body') {
    return /\b(detailBody|Descriptions|SchemaDescriptionsBridge)\b/.test(sourceRaw)
  }

  if (regionName === 'stat-section' || regionName === 'chart-section') {
    return new RegExp(`\\bSectionBlock\\b[\\s\\S]{0,240}\\bregion\\s*=\\s*["']${escapeRegExp(regionName)}["']`).test(
      sourceRaw
    )
  }

  if (regionName === 'query-filter') {
    return /\bDashboardControlStrip\b/.test(sourceRaw)
  }

  if (regionName === 'table' || regionName === 'pagination') {
    return /\bJoinedTableSection\b/.test(sourceRaw)
  }

  return false
}

function hasManagedShellCarrier(sourceRaw, attrName, attrValue) {
  if (hasNonSelfClosingAttrContainer(sourceRaw, attrName, attrValue)) {
    return true
  }

  return usesFixedDashboardPageFrame(sourceRaw) && countObjectLiteralKeyValue(sourceRaw, attrName, attrValue) > 0
}

function extractLiteralClassNamesForAttr(sourceRaw, attrName, attrValue) {
  const pattern = new RegExp(
    `<[A-Za-z][\\w.:-]*[^>]*className\\s*=\\s*(['"])([^'"]+)\\1[^>]*${escapeRegExp(attrName)}\\s*=\\s*(['"])${escapeRegExp(
      attrValue
    )}\\3[^>]*>|<[A-Za-z][\\w.:-]*[^>]*${escapeRegExp(attrName)}\\s*=\\s*(['"])${escapeRegExp(
      attrValue
    )}\\4[^>]*className\\s*=\\s*(['"])([^'"]+)\\5[^>]*>`,
    'g'
  )
  const modulePattern = new RegExp(
    `<[A-Za-z][\\w.:-]*[^>]*className\\s*=\\s*\\{\\s*styles\\.([\\w-]+)\\s*\\}[^>]*${escapeRegExp(attrName)}\\s*=\\s*(['"])${escapeRegExp(
      attrValue
    )}\\2[^>]*>|<[A-Za-z][\\w.:-]*[^>]*${escapeRegExp(attrName)}\\s*=\\s*(['"])${escapeRegExp(
      attrValue
    )}\\3[^>]*className\\s*=\\s*\\{\\s*styles\\.([\\w-]+)\\s*\\}[^>]*>`,
    'g'
  )

  const classNames = new Set()

  for (const match of sourceRaw.matchAll(pattern)) {
    const rawClassName = match[2] || match[6] || ''
    rawClassName
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => classNames.add(item))
  }

  for (const match of sourceRaw.matchAll(modulePattern)) {
    const moduleClassName = match[1] || match[4] || ''
    if (moduleClassName) {
      classNames.add(moduleClassName)
    }
  }

  return [...classNames]
}

function extractLiteralClassNamesForAttrPresence(sourceRaw, attrName) {
  const attrPattern = buildAttrPresencePattern(attrName)
  const pattern = new RegExp(
    `<[A-Za-z][\\w.:-]*[^>]*className\\s*=\\s*(['"])([^'"]+)\\1[^>]*${attrPattern}[^>]*>|<[A-Za-z][\\w.:-]*[^>]*${attrPattern}[^>]*className\\s*=\\s*(['"])([^'"]+)\\3[^>]*>`,
    'g'
  )
  const modulePattern = new RegExp(
    `<[A-Za-z][\\w.:-]*[^>]*className\\s*=\\s*\\{\\s*styles\\.([\\w-]+)\\s*\\}[^>]*${attrPattern}[^>]*>|<[A-Za-z][\\w.:-]*[^>]*${attrPattern}[^>]*className\\s*=\\s*\\{\\s*styles\\.([\\w-]+)\\s*\\}[^>]*>`,
    'g'
  )

  const classNames = new Set()

  for (const match of sourceRaw.matchAll(pattern)) {
    const rawClassName = match[2] || match[4] || ''
    rawClassName
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => classNames.add(item))
  }

  for (const match of sourceRaw.matchAll(modulePattern)) {
    const moduleClassName = match[1] || match[2] || ''
    if (moduleClassName) {
      classNames.add(moduleClassName)
    }
  }

  return [...classNames]
}

function getRoleSpecificOwnershipAttrName(role) {
  return `data-hiui5-owner-${role}`
}

function hasOwnershipContainer(sourceRaw, role) {
  if (
    usesFixedDashboardPageFrame(sourceRaw) &&
    countObjectLiteralKeyValue(sourceRaw, getRoleSpecificOwnershipAttrName(role), 'true') > 0
  ) {
    return true
  }

  return (
    hasNonSelfClosingAttrContainer(sourceRaw, 'data-hiui5-owner', role) ||
    hasNonSelfClosingAttrPresenceContainer(sourceRaw, getRoleSpecificOwnershipAttrName(role))
  )
}

function countOwnershipMarkers(sourceRaw, role) {
  const legacyCount = countLiteralAttr(sourceRaw, 'data-hiui5-owner', role)
  const scopedCount = countAttrPresence(sourceRaw, getRoleSpecificOwnershipAttrName(role))
  const fixedDashboardObjectCount = usesFixedDashboardPageFrame(sourceRaw)
    ? countObjectLiteralKeyValue(sourceRaw, getRoleSpecificOwnershipAttrName(role), 'true')
    : 0
  return Math.max(legacyCount, scopedCount, fixedDashboardObjectCount)
}

function extractOwnershipClassNames(sourceRaw, role) {
  return [
    ...new Set([
      ...extractLiteralClassNamesForAttr(sourceRaw, 'data-hiui5-owner', role),
      ...extractLiteralClassNamesForAttrPresence(sourceRaw, getRoleSpecificOwnershipAttrName(role)),
    ]),
  ]
}

function collectOpenTagSnippetsForAttr(sourceRaw, attrName, attrValue) {
  const pattern = new RegExp(
    `<[A-Za-z][\\w.:-]*[^>]*${escapeRegExp(attrName)}\\s*=\\s*(['"])${escapeRegExp(
      attrValue
    )}\\1[^>]*>`,
    'g'
  )

  return Array.from(sourceRaw.matchAll(pattern), (match) => String(match[0] || '')).filter(Boolean)
}

function collectOpenTagSnippetsForAttrPresence(sourceRaw, attrName) {
  const pattern = new RegExp(
    `<[A-Za-z][\\w.:-]*[^>]*${buildAttrPresencePattern(attrName)}[^>]*>`,
    'g'
  )

  return Array.from(sourceRaw.matchAll(pattern), (match) => String(match[0] || '')).filter(Boolean)
}

function collectOwnershipInlineStyleSnippets(sourceRaw, role) {
  return [
    ...collectOpenTagSnippetsForAttr(sourceRaw, 'data-hiui5-owner', role),
    ...collectOpenTagSnippetsForAttrPresence(sourceRaw, getRoleSpecificOwnershipAttrName(role)),
  ]
}

function collectRegionInlineStyleSnippets(sourceRaw, regionName) {
  return collectOpenTagSnippetsForAttr(sourceRaw, 'data-hiui5-region', regionName)
}

function collectOwnershipStyleSnippets(sourceRaw, styleRaw, role) {
  return [
    ...collectStyleSnippetsForClassNames(styleRaw, extractOwnershipClassNames(sourceRaw, role)),
    ...collectOwnershipInlineStyleSnippets(sourceRaw, role),
  ]
}

function collectRegionStyleSnippets(sourceRaw, styleRaw, regionName) {
  return [
    ...collectStyleSnippetsForClassNames(
      styleRaw,
      extractLiteralClassNamesForAttr(sourceRaw, 'data-hiui5-region', regionName)
    ),
    ...collectRegionInlineStyleSnippets(sourceRaw, regionName),
  ]
}

function hasAnyPattern(sourceRaw, patterns) {
  return patterns.some((pattern) => pattern.test(sourceRaw))
}

function getContractRegionNames(contract) {
  const regionNames = Array.isArray(contract?.regionMapping)
    ? contract.regionMapping
        .map((item) => String(item?.region || '').trim())
        .filter(Boolean)
    : []

  if (regionNames.length === 0) {
    return getRequiredRegionsForPageType(contract.pageTypeId)
  }

  const seen = new Set()
  return regionNames.filter((region) => {
    const normalized = region.toLowerCase()
    if (seen.has(normalized)) {
      return false
    }

    seen.add(normalized)
    return true
  })
}

function getNormalizedContractRegions(contract) {
  return new Set(getContractRegionNames(contract).map((region) => region.toLowerCase()))
}

function sourceDeclaresApprovedChartWrapper(sourceRaw) {
  return (
    sourceRaw.includes('hiui-design chart-stack: approved-wrapper') ||
    hasLiteralAttr(sourceRaw, 'data-hiui5-chart-stack', 'approved-wrapper')
  )
}

function hasIndependentChartSectionSignals(sourceRaw, styleRaw) {
  return (
    hasAdaptiveChartBodyMarkers(sourceRaw) ||
    hasBareChartCardChildren(sourceRaw) ||
    hasAnyPattern(sourceRaw, [/\b(chartGrid|chartCard|chartSection)\b/]) ||
    hasAnyPattern(styleRaw, [/\.(chartGrid|chartCard|chartSection)\b/])
  )
}

function detectChartStackSignals({ contract, sourceRaw, styleRaw }) {
  const contractRegions = getNormalizedContractRegions(contract)
  const declaresChartRegion =
    contractRegions.has('chart-section') || hasLiteralAttr(sourceRaw, 'data-hiui5-region', 'chart-section')
  const usesAntDesignCharts = /@ant-design\/charts/.test(sourceRaw)
  const usesApprovedChartWrapper = sourceDeclaresApprovedChartWrapper(sourceRaw)
  const mentionsChartComponents = hasAnyPattern(sourceRaw, [
    /\b(Line|Area|Column|Bar|Pie|DualAxes|Gauge|Liquid|Radar|Funnel)\b/,
    /\bwithHiuiResponsiveChart\b/,
    /\bwithHiuiMiniChart\b/,
  ])
  const mentionsChartCopy = /(图表|趋势图|柱状图|折线图|面积图|雷达图|仪表盘|双轴图|漏斗图|水波图)/.test(
    sourceRaw
  )
  const mentionsChartLikeClassNames =
    hasAnyPattern(sourceRaw, [/\b(trendChart|chartGrid|chartCard|chartSection|sparkline|scoreRing|trendBar)\b/]) ||
    hasAnyPattern(styleRaw, [/\.(trendChart|chartGrid|chartCard|chartSection|sparkline|scoreRing|trendBar)\b/])
  const heuristicChartSignals =
    mentionsChartComponents || mentionsChartCopy || mentionsChartLikeClassNames
  const heuristicChartPageExclusions = new Set([
    'feedback-status',
    'full-page-detail',
    'table-basic',
    'table-stat',
    'tree-table',
    'tree-split',
    'full-page-edit',
    'drawer-form',
    'drawer-detail',
  ])
  const independentChartSectionSignals =
    declaresChartRegion || hasIndependentChartSectionSignals(sourceRaw, styleRaw)
  const requiresChartStackCheck =
    contract.pageTypeId === 'data-visualization' ||
    declaresChartRegion ||
    usesAntDesignCharts ||
    usesApprovedChartWrapper ||
    (!heuristicChartPageExclusions.has(contract.pageTypeId) && heuristicChartSignals)
  const usesPrimitiveChartFallback = hasAnyPattern(sourceRaw, [
    /<svg\b/,
    /\bbuildAreaPath\b/,
    /\bbuildLinePath\b/,
    /\bgetContext\s*\(/,
    /\bPath2D\b/,
    /\bcreateElement\s*\(\s*['"]svg['"]/,
  ])
  const usesCssChartFallback =
    requiresChartStackCheck &&
    !usesAntDesignCharts &&
    !usesApprovedChartWrapper &&
    hasAnyPattern(`${sourceRaw}\n${styleRaw}`, [/\bconic-gradient\b/i, /\btrendBar\b/, /\bscoreRing\b/])

  return {
    declaresChartRegion,
    independentChartSectionSignals,
    requiresChartStackCheck,
    usesAntDesignCharts,
    usesApprovedChartWrapper,
    usesHandRolledChartFallback: usesPrimitiveChartFallback || usesCssChartFallback,
  }
}

function mentionsColumnLikeChart(sourceRaw) {
  return (
    /\b<Column\b/.test(sourceRaw) ||
    /\bchartType\s*=\s*["']column["']/.test(sourceRaw) ||
    /\btype\s*:\s*["']interval["']/.test(sourceRaw)
  )
}

function mentionsBarLikeChart(sourceRaw) {
  return /\b<Bar\b/.test(sourceRaw) || /\bchartType\s*=\s*["']bar["']/.test(sourceRaw)
}

function mentionsAreaChart(sourceRaw) {
  return /\b<Area\b/.test(sourceRaw) || /\bchartType\s*=\s*["']area["']/.test(sourceRaw)
}

function usesHiuiChartBaseline(sourceRaw) {
  return (
    /\bwithHiuiResponsiveChart\b/.test(sourceRaw) ||
    /\bwithHiuiMiniChart\b/.test(sourceRaw) ||
    /\bhiuiChartTheme\b/.test(sourceRaw)
  )
}

function usesHiuiChartColorContract(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /\bcreateHiuiColorScale\b/,
    /\bcreateHiuiCategoricalDomainScale\b/,
    /\bcreateHiuiSingleSeriesScale\b/,
    /\bcreateHiuiDualSeriesScale\b/,
    /\bcreateHiuiSemanticColorScale\b/,
    /\bcreateHiuiColorRelationsScale\b/,
    /\bhiuiCategoricalPalette\b/,
    /\bhiuiDualSeriesPalette\b/,
    /\bhiuiSemanticChartColors\b/,
    /\bhiuiChartTokens\b/,
  ])
}

function usesColumnLikeChartHelper(sourceRaw) {
  return (
    /\bwithHiuiColumnLikeChart\b/.test(sourceRaw) ||
    /\bcreateHiuiColumnLikeScale\b/.test(sourceRaw) ||
    /\bcreateHiuiColumnLikeColorScale\b/.test(sourceRaw)
  )
}

function usesBarLikeChartHelper(sourceRaw) {
  return (
    /\bwithHiuiBarLikeChart\b/.test(sourceRaw) ||
    /\bcreateHiuiBarLikeScale\b/.test(sourceRaw) ||
    /\bcreateHiuiBarLikeColorScale\b/.test(sourceRaw)
  )
}

function hasApprovedAreaPointDeviation(sourceRaw) {
  return (
    sourceRaw.includes('hiui-design chart-area: explicit-points-approved') ||
    hasLiteralAttr(sourceRaw, 'data-hiui5-area-points', 'approved')
  )
}

function usesChartLabelAsColorValue(sourceRaw) {
  const categoricalFieldNames = ['series', 'label', 'type', 'phase', 'team', 'stage', 'name']

  return categoricalFieldNames.some((fieldName) => {
    const escapedFieldName = escapeRegExp(fieldName)

    return hasAnyPattern(sourceRaw, [
      new RegExp(
        `\\b(?:color|fill|stroke)\\s*:\\s*\\(\\s*\\{[^}]*\\b${escapedFieldName}\\b[^}]*\\}\\s*\\)\\s*=>\\s*${escapedFieldName}\\b`
      ),
      new RegExp(
        `\\b(?:color|fill|stroke)\\s*:\\s*\\([^)]*\\)\\s*=>\\s*[A-Za-z_$][\\w$]*\\s*(?:\\.\\s*${escapedFieldName}\\b|\\[\\s*['"]${escapedFieldName}['"]\\s*\\])`
      ),
      new RegExp(
        `\\bresolveHiuiSeriesColor\\s*\\(\\s*(?:${escapedFieldName}\\b|[A-Za-z_$][\\w$]*\\s*(?:\\.\\s*${escapedFieldName}\\b|\\[\\s*['"]${escapedFieldName}['"]\\s*\\]))\\s*\\)`
      ),
    ])
  })
}

function collectObjectLiteralSnippetsForVariables(sourceRaw, variableNames) {
  return variableNames.flatMap((variableName) =>
    Array.from(
      String(sourceRaw || '').matchAll(
        new RegExp(`\\b(?:const|let|var)\\s+${escapeRegExp(variableName)}\\b`, 'g')
      )
    )
      .map((match) => extractBalancedStyleBlock(sourceRaw, match.index ?? -1))
      .filter(Boolean)
  )
}

function collectAreaConfigSnippets(sourceRaw) {
  const areaTagSnippets = collectComponentOpenTagSnippets(sourceRaw, 'Area')
  const spreadConfigNames = Array.from(
    new Set(
      areaTagSnippets.flatMap((snippet) =>
        Array.from(snippet.matchAll(/\{\s*\.\.\.\s*([A-Za-z_$][\w$]*)\s*\}/g)).map((match) => match[1])
      )
    )
  )

  return [
    ...areaTagSnippets,
    ...collectObjectLiteralSnippetsForVariables(sourceRaw, spreadConfigNames),
  ]
}

function enablesAreaPointMarkers(sourceRaw) {
  return collectAreaConfigSnippets(sourceRaw).some(
    (snippet) =>
      /\bpoint\s*:\s*true\b/.test(snippet) ||
      /\bpoint\s*:\s*\{/.test(snippet) ||
      /\bpoint\s*=\s*\{\s*true\s*\}/.test(snippet) ||
      /\bpoint\s*=\s*\{\s*\{/.test(snippet)
  )
}

function collectNumericPropertyValues(sourceRaw, propertyName) {
  return Array.from(
    String(sourceRaw || '').matchAll(
      new RegExp(`\\b${escapeRegExp(propertyName)}\\s*:\\s*([0-9]*\\.?[0-9]+)`, 'g')
    )
  )
    .map((match) => Number(match[1]))
    .filter((value) => Number.isFinite(value))
}

function hasExplicitAreaFillBinding(sourceRaw) {
  return /\bfill\s*:\s*[^,}\n]+/.test(sourceRaw)
}

function collectCompactCardRadiusValues(sourceRaw, styleRaw) {
  const sourceSnippets = [
    ...collectObjectLiteralSnippetsForVariables(sourceRaw, ['metricCard', 'chartCard', 'surfaceCard']),
    ...collectLocalObjectSnippets(sourceRaw, ['metricCard', 'chartCard', 'surfaceCard', 'statCard', 'statsCard']),
  ]
  const styleSnippets = [
    ...collectPreciseStyleBlocks(styleRaw, [
      /\.metricCard\b[\s\S]{0,120}\{/gi,
      /\.chartCard\b[\s\S]{0,120}\{/gi,
      /\.surfaceCard\b[\s\S]{0,120}\{/gi,
      /\.statCard\b[\s\S]{0,120}\{/gi,
      /\.statsCard\b[\s\S]{0,120}\{/gi,
    ]),
  ]
  const snippets = [...sourceSnippets, ...styleSnippets]

  return snippets.flatMap((snippet) => {
    const jsValues = Array.from(
      String(snippet || '').matchAll(/\bborderRadius\s*:\s*([0-9]*\.?[0-9]+)/g)
    ).map((match) => Number(match[1]))
    const cssValues = Array.from(
      String(snippet || '').matchAll(/\bborder-radius\s*:\s*([0-9]*\.?[0-9]+)px?\b/gi)
    ).map((match) => Number(match[1]))
    return [...jsValues, ...cssValues].filter((value) => Number.isFinite(value))
  })
}

function hasBackgroundOrRadiusSignal(snippet) {
  return /(background(?:-color)?\s*:|backgroundColor\s*:|border-radius\s*:|borderRadius\s*:)/i.test(
    snippet
  )
}

function hasWorkspaceChromeSignal(snippet) {
  return /(height\s*:\s*calc\(100vh\s*-\s*60px\)|background(?:-color)?\s*:|backgroundColor\s*:|border-radius\s*:|borderRadius\s*:|overflow(?:-[xy])?\s*:\s*auto|overflow(?:X|Y)?\s*:\s*['"]?auto)/i.test(
    snippet
  )
}

function hasPaddingSignal(snippet) {
  return /padding(?:-[a-z]+)?\s*:|padding[A-Z][A-Za-z]*\s*:/i.test(snippet)
}

function hasGapSignal(snippet) {
  return /\bgap\s*:|rowGap\s*:|columnGap\s*:/i.test(snippet)
}

function hasBorderBoxSignal(snippet) {
  return /(box-sizing\s*:\s*border-box|boxSizing\s*:\s*['"]border-box['"])/i.test(snippet)
}

function hasZeroMinInlineSizeSignal(snippet) {
  return (
    /(min-inline-size|min-width)\s*:\s*0(?:px)?\b/i.test(snippet) ||
    /(minInlineSize|minWidth)\s*:\s*['"]?0(?:px)?['"]?\b/i.test(snippet)
  )
}

function hasAutoFitGridTrackSignal(snippet) {
  return /(repeat\(\s*auto-(fit|fill)\s*,|gridTemplateColumns\s*:\s*['"][^'"]*auto-(fit|fill))/i.test(
    snippet
  )
}

function hasSplitRightTrackHardMinSignal(snippet) {
  return /grid-template-columns\s*:[^;]*minmax\([^)]*\)\s+minmax\(\s*(?:[1-9]\d*(?:\.\d+)?(?:px|rem))\s*,/i.test(
    snippet
  )
}

function hasHorizontalOverflowOwnerSignal(snippet) {
  const overflowXValues = collectPropertyValues(snippet, 'overflow-x')
  if (overflowXValues.some((value) => /^(auto|scroll)\b/i.test(stripQuotedValue(value)))) {
    return true
  }

  const overflowValues = collectPropertyValues(snippet, 'overflow')
  return overflowValues.some((value) => {
    const tokens = stripQuotedValue(value)
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)

    if (tokens.length === 0) {
      return false
    }

    return ['auto', 'scroll'].includes(tokens[0])
  })
}

function hasContentWidthEscapeSignal(snippet) {
  return ['width', 'inline-size', 'min-width', 'min-inline-size'].some((propertyName) =>
    collectPropertyValues(snippet, propertyName).some((value) =>
      /^(max-content|min-content|fit-content)\b/i.test(stripQuotedValue(value))
    )
  )
}

function toCamelCaseProperty(propertyName) {
  return String(propertyName || '').replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

function stripQuotedValue(value) {
  const normalized = String(value || '').trim().replace(/,$/, '')
  if (
    (normalized.startsWith("'") && normalized.endsWith("'")) ||
    (normalized.startsWith('"') && normalized.endsWith('"'))
  ) {
    return normalized.slice(1, -1).trim()
  }

  return normalized
}

function collectPropertyValues(snippet, propertyName) {
  const propertyNames = [propertyName, toCamelCaseProperty(propertyName)]
  const values = []

  for (const candidateName of propertyNames) {
    const declarationPattern = new RegExp(
      `(?<![\\w-])${escapeRegExp(candidateName)}\\s*:\\s*([^;},\\n]+(?:\\s+[^;},\\n]+){0,3})`,
      'gi'
    )

    for (const match of String(snippet || '').matchAll(declarationPattern)) {
      const value = stripQuotedValue(match[1])
      if (value) {
        values.push(value)
      }
    }
  }

  return values
}

function snippetDeclaresProperty(snippet, propertyName) {
  return collectPropertyValues(snippet, propertyName).length > 0
}

function snippetHasTokenValue(snippet, propertyName, expectedPattern) {
  return collectPropertyValues(snippet, propertyName).some((value) =>
    expectedPattern.test(stripQuotedValue(value))
  )
}

function snippetHasDisplayFlex(snippet) {
  return snippetHasTokenValue(snippet, 'display', /^flex\b/i)
}

function snippetHasFlexDirectionColumn(snippet) {
  return snippetHasTokenValue(snippet, 'flex-direction', /^column\b/i)
}

function snippetHasFlexOne(snippet) {
  return snippetHasTokenValue(snippet, 'flex', /^1(?:\s|$)/i)
}

function snippetHasMinHeightZero(snippet) {
  return snippetHasTokenValue(snippet, 'min-height', /^0(?:px)?$/i)
}

function snippetHasOverflowAuto(snippet) {
  return (
    snippetHasTokenValue(snippet, 'overflow', /^auto(?:\s|$)/i) ||
    snippetHasTokenValue(snippet, 'overflow-y', /^auto(?:\s|$)/i)
  )
}

function snippetHasFlexShrinkZero(snippet) {
  return snippetHasTokenValue(snippet, 'flex-shrink', /^0(?:px)?$/i)
}

function snippetHasJustifyContentFlexEnd(snippet) {
  return snippetHasTokenValue(snippet, 'justify-content', /^flex-end\b/i)
}

function tokenImpliesPositiveSpacing(rawToken) {
  const token = String(rawToken || '').trim()
  if (!token) return false

  if (/^0(?:\.0+)?(?:px|r?em|vh|vw|%)?$/i.test(token)) {
    return false
  }

  const numericMatch = token.match(/^(-?\d+(?:\.\d+)?)(?:px|r?em|vh|vw|%)?$/i)
  if (numericMatch) {
    return Number(numericMatch[1]) > 0
  }

  return !/^calc\(\s*0(?:\.0+)?(?:px|r?em|vh|vw|%)?\s*\)$/i.test(token)
}

function getBottomSpacingToken(rawValue) {
  const tokens = stripQuotedValue(rawValue)
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (tokens.length === 0) return ''
  if (tokens.length === 1) return tokens[0]
  if (tokens.length === 2) return tokens[0]
  return tokens[2]
}

function getRowGapToken(rawValue) {
  const tokens = stripQuotedValue(rawValue)
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (tokens.length === 0) return ''
  return tokens[0]
}

function snippetHasPositiveBottomSpacing(snippet, propertyName) {
  return collectPropertyValues(snippet, propertyName).some((rawValue) =>
    tokenImpliesPositiveSpacing(getBottomSpacingToken(rawValue))
  )
}

function snippetHasPositiveRowGap(snippet) {
  return (
    collectPropertyValues(snippet, 'row-gap').some((rawValue) =>
      tokenImpliesPositiveSpacing(stripQuotedValue(rawValue))
    ) ||
    collectPropertyValues(snippet, 'gap').some((rawValue) =>
      tokenImpliesPositiveSpacing(getRowGapToken(rawValue))
    )
  )
}

function hasGridStructureSignal(snippet) {
  return (
    /(display\s*:\s*grid|display\s*:\s*['"]grid['"])/i.test(snippet) ||
    /(grid-template-columns\s*:|gridTemplateColumns\s*:)/i.test(snippet)
  )
}

function getSourceSurfaceSignals(styleRaw) {
  const surfacedSectionSelectors = [
    /\.section\b[\s\S]{0,240}\{/gi,
    /__section\b[\s\S]{0,240}\{/gi,
    /\.detailSection\b[\s\S]{0,240}\{/gi,
    /\.detail-section\b[\s\S]{0,240}\{/gi,
  ]

  return surfacedSectionSelectors
    .flatMap((pattern) => Array.from(styleRaw.matchAll(pattern)))
    .map((match) => {
      const start = match.index ?? -1
      if (start < 0) return ''
      return styleRaw.slice(start, Math.min(styleRaw.length, start + 320))
    })
    .filter(Boolean)
}

function getDetailSurfaceSignals(styleRaw) {
  const surfacedSelectors = [
    /\.summary\b[\s\S]{0,240}\{/gi,
    /__summary\b[\s\S]{0,240}\{/gi,
    /\.section\b[\s\S]{0,240}\{/gi,
    /__section\b[\s\S]{0,240}\{/gi,
    /\.detailSection\b[\s\S]{0,240}\{/gi,
    /\.detail-section\b[\s\S]{0,240}\{/gi,
  ]

  return surfacedSelectors
    .flatMap((pattern) => Array.from(styleRaw.matchAll(pattern)))
    .map((match) => {
      const start = match.index ?? -1
      if (start < 0) return ''
      return styleRaw.slice(start, Math.min(styleRaw.length, start + 320))
    })
    .filter(Boolean)
}

function hasVerticalDescriptionsPlacement(sourceRaw) {
  return (
    /placement\s*=\s*['"]vertical['"]/.test(sourceRaw) ||
    /placement\s*:\s*['"]vertical['"]/.test(sourceRaw)
  )
}

function hasThreeColumnDescriptions(sourceRaw) {
  return /column\s*=\s*\{?\s*3\s*\}?/.test(sourceRaw) || /column\s*:\s*3/.test(sourceRaw)
}

function hasHeaderVerticalCentering(styleRaw) {
  return (
    /align-items\s*:\s*center/i.test(styleRaw) &&
    /(?:min-height|height)\s*:\s*60px/i.test(styleRaw)
  )
}

function hasHeaderTitleBaseline(styleRaw) {
  const snippets = collectStyleSnippets(styleRaw, [/\.header-title\b[\s\S]{0,220}\{/gi], 260)
  return snippets.some(
    (snippet) =>
      /font-size\s*:\s*18px/i.test(snippet) &&
      /font-weight\s*:\s*600/i.test(snippet)
  )
}

function hasFixedDescriptionsLabelWidth(sourceRaw) {
  return (
    /labelWidth\s*=\s*\{?\s*\d+\s*\}?/.test(sourceRaw) ||
    /labelWidth\s*:\s*\d+/.test(sourceRaw)
  )
}

function hasLeftDescriptionsLabelPlacement(sourceRaw) {
  return (
    /labelPlacement\s*=\s*['"]left['"]/.test(sourceRaw) ||
    /labelPlacement\s*:\s*['"]left['"]/.test(sourceRaw)
  )
}

function hasClearedDescriptionsLabelWidth(sourceRaw) {
  return (
    /labelWidth\s*=\s*\{\s*(?:null|undefined)\s*\}/.test(sourceRaw) ||
    /labelWidth\s*:\s*(?:null|undefined)/.test(sourceRaw)
  )
}

function usesSchemaDescriptionsBridge(sourceRaw) {
  return /\bSchemaDescriptionsBridge\b/.test(sourceRaw)
}

function usesVerticalDetailDescriptions(sourceRaw) {
  return (
    /\b(Descriptions|SchemaDescriptionsBridge)\b/.test(sourceRaw) &&
    hasVerticalDescriptionsPlacement(sourceRaw)
  )
}

function hasQueryFilterCompatibleSemantics(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /\bQueryFilter\b/,
    /\bSearchForm\b/,
    /\bPageTable\b/,
    /<\s*TablePageFrame\b/,
    /<\s*StatListPageFrame\b/,
    /\bProListPageProvider\b/,
    /\bqueryFields\b/,
    /\bsearchConfig\b/,
    /\bgetSearchFields\b/,
    /\bPageFormItemType\b/,
    /\bsearchPanelConfig\b/,
  ])
}

function hasStrongQueryFilterProof(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /<\s*(QueryFilter|SearchForm|TablePageFrame|StatListPageFrame|ProListPageProvider)\b/,
    /\bqueryFields\s*=/,
    /\bqueryFields\s*:/,
    /\bsearchConfig\s*=/,
    /\bsearchConfig\s*:/,
    /\bgetSearchFields\b/,
    /\bsearchPanelConfig\s*=/,
    /\bsearchPanelConfig\s*:/,
  ])
}

function hasStrongCarrierProofForCapability({ contract, sourceRaw, styleRaw, regionName, capability }) {
  const shellName = CANONICAL_SHELL_BY_PAGE_TYPE.get(contract?.pageTypeId)
  if (shellName && mountsRealShellRuntime(sourceRaw, shellName)) {
    return true
  }

  switch (capability) {
    case 'hiui.queryFilter':
      return hasStrongQueryFilterProof(sourceRaw)
    case 'hiui.table':
      return /<\s*(Table|PageTable|JoinedTableSection)\b/.test(sourceRaw)
    case 'hiui.pagination':
      return /<\s*(Pagination|JoinedTableSection|PageTable)\b/.test(sourceRaw)
    case 'hiui.detailContent':
      return /<\s*(Descriptions|ProDetailPage|ProDetailDrawer|ManagedFullPageDetailShell)\b/.test(sourceRaw)
    case 'hiui.form':
      return /<\s*(Form|FormItem|ProEditPage|ProFormDrawer|SchemaFormBridge|ManagedFullPageEditShell)\b/.test(sourceRaw)
    case 'hiui.formFooter':
      return /(<\s*(ProEditPage|FormFooter|ActionFooter)\b|\binlineEditFooter\b|\bfooter\s*=|\bfooter\s*:)/.test(sourceRaw)
    case 'hiui.drawerContent':
      return /<\s*(ProDetailDrawer|ProFormDrawer|Drawer)\b/.test(sourceRaw)
    case 'hiui.treePanel':
      return /<\s*(Tree|TreeSelect|TreeSplitPageFrame|ManagedContextMainSplitShell)\b/.test(sourceRaw)
    case 'hiui.feedbackShell':
      return /<\s*(FeedbackStatePanel|Empty|Result|Exception|Feedback)\b/.test(sourceRaw)
    case 'hiui.whiteBodySurface':
      return (
        /<\s*(TablePageFrame|StatListPageFrame|ProDetailPage|ManagedFullPageDetailShell|FeedbackStatePanel)\b/.test(sourceRaw) ||
        collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'white-body').some(hasBackgroundOrRadiusSignal)
      )
    default:
      return hasManagedRegionCarrier(sourceRaw, regionName)
  }
}

function collectCarrierCriticalRequirements(contract) {
  const matrix = readCriticalRegionCapabilities()
  const pageTypeConfig = matrix?.pageTypes?.[contract?.pageTypeId]
  const carrierCritical = pageTypeConfig?.carrierCritical || {}

  return Object.entries(carrierCritical).map(([regionName, capability]) => ({
    regionName,
    capability: String(capability || ''),
  }))
}

function validateCriticalRegionProof({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const requirements = collectCarrierCriticalRequirements(contract)

  for (const requirement of requirements) {
    const regionDeclared =
      getNormalizedContractRegions(contract).has(requirement.regionName.toLowerCase()) ||
      hasLiteralAttr(sourceRaw, 'data-hiui5-region', requirement.regionName)

    if (!regionDeclared) {
      continue
    }

    if (
      hasStrongCarrierProofForCapability({
        contract,
        sourceRaw,
        styleRaw,
        regionName: requirement.regionName,
        capability: requirement.capability,
      })
    ) {
      continue
    }

    errors.push(
      `${pathLabel} declares carrier-critical region ${requirement.regionName} but does not provide valid ${requirement.capability} proof. data-hiui5-region, comments, contract fields, raw primitives, and page-local DOM/CSS are only claims; carrier-critical regions must be backed by a managed shell/component, certified adapter, upstream host carrier, or governed waiver.`
    )
  }

  return errors
}

function extractComponentClassNames(sourceRaw, componentName) {
  const escapedComponentName = escapeRegExp(componentName)
  const patterns = [
    new RegExp(
      `<${escapedComponentName}\\b[^>]{0,480}?className\\s*=\\s*\\{\\s*styles\\.([A-Za-z0-9_]+)\\s*\\}`,
      'g'
    ),
    new RegExp(
      `<${escapedComponentName}\\b[^>]{0,480}?className\\s*=\\s*\\{\\s*styles\\[['"]([^'"]+)['"]\\]\\s*\\}`,
      'g'
    ),
  ]

  return [
    ...new Set(
      patterns.flatMap((pattern) =>
        Array.from(sourceRaw.matchAll(pattern), (match) =>
          String(match[1] || '').trim()
        ).filter(Boolean)
      )
    ),
  ]
}

function snippetOverridesPageHeaderRootLayout(snippet) {
  return hasAnyPattern(String(snippet || ''), [
    /(display\s*:\s*(flex|grid)|display\s*:\s*['"](flex|grid)['"])/i,
    /(justify-content\s*:|justifyContent\s*:)/i,
    /(flex-direction\s*:|flexDirection\s*:)/i,
    /(grid-template-columns\s*:|gridTemplateColumns\s*:)/i,
  ])
}

function hasDashboardControlFieldLabels(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /dashboardControlLabelStyle[\s\S]{0,220}<Radio\.Group\b/,
    /dashboardControlLabelStyle[\s\S]{0,220}<Select\b/,
    /<div[^>]*>\s*\{t\(['"`](统计维度|风险等级|业务线|排序方式)['"`]\)\}\s*<\/div>[\s\S]{0,220}<(Radio\.Group|Select)\b/,
  ])
}

function hasLooseTablePaginationSiblingPattern(sourceRaw) {
  return /data-hiui5-region\s*=\s*['"]table['"][\s\S]{0,2000}<\/(?:div|section)>\s*<(?:div|section)[^>]*data-hiui5-region\s*=\s*['"]pagination['"]/i.test(
    sourceRaw
  )
}

function hasShellCarrierMarker(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /hiui-design shell-carrier:/,
    /hiui-design shell-inheritance:/,
    /data-hiui5-shell-carrier\s*=/,
    /data-hiui5-shell-inheritance\s*=/,
  ])
}

function declaresContextMainSplitLayout(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /hiui-design layout archetype:\s*context-main-split/i,
    /data-hiui5-layout-group\s*=\s*["']context-main-split["']/,
  ])
}

function mountsRealContextMainSplitShell(sourceRaw) {
  return hasAnyPattern(sourceRaw, [/\bContextMainSplitScaffold\b/, /\bTreeSplitPageFrame\b/])
}

function hasAdaptiveChartBodyMarkers(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /data-hiui5-chart-body\s*=/,
    /data-hiui5-chart-card\s*=/,
  ])
}

function hasBareChartCardChildren(sourceRaw) {
  return /<ChartCard\b[\s\S]{0,480}<\s*(Area|Line|Bar)\b/.test(sourceRaw)
}

function mountsRealShellRuntime(sourceRaw, shellName) {
  return new RegExp(`<${escapeRegExp(shellName)}\\b`).test(sourceRaw)
}

export function declaresDomAliasForManagedShell(sourceRaw, shellName) {
  return new RegExp(
    `(?:const|let|var)\\s+${escapeRegExp(shellName)}\\s*=\\s*['\"](?:div|section|main|article|aside|span)['\"]`
  ).test(sourceRaw)
}

export function hasHiddenManagedShellMount(sourceRaw, shellName) {
  return new RegExp(
    `<${escapeRegExp(shellName)}\\b[^>]*(?:style\\s*=\\s*\\{\\s*\\{[^}]*display\\s*:\\s*['\"]none['\"]|hidden\\b|aria-hidden\\s*=\\s*['\"]true['\"])`
  ).test(sourceRaw)
}

function normalizeRelativeSourcePath(value) {
  return String(value || '').trim().replace(/\\/g, '/').replace(/^\.\//, '')
}

const CANONICAL_SHELL_BY_PAGE_TYPE = new Map([
  ['table-basic', 'TablePageFrame'],
  ['tree-table', 'TablePageFrame'],
  ['table-stat', 'StatListPageFrame'],
  ['data-visualization', 'StatListPageFrame'],
  ['tree-split', 'TreeSplitPageFrame'],
  ['drawer-form', 'ProFormDrawer'],
  ['drawer-detail', 'ProDetailDrawer'],
  ['feedback-status', 'FeedbackStatePanel'],
  ['full-page-edit', 'ProEditPage'],
  ['full-page-detail', 'ProDetailPage'],
])

const SHELL_SLOT_SUMMARY_BY_PAGE_TYPE = new Map([
  ['table-basic', 'header/query-filter/table/pagination'],
  ['tree-table', 'header/query-filter/table/pagination'],
  ['table-stat', 'header/stat-section/query-filter/table/pagination'],
  ['data-visualization', 'header/control-strip/chart-section/table'],
  ['tree-split', 'header/split-workspace/left-tree/right-list/table/pagination'],
  ['drawer-form', 'drawer-header/drawer-body/form-body/drawer-footer'],
  ['drawer-detail', 'drawer-header/drawer-body/detail-body/drawer-footer'],
  ['feedback-status', 'header/white-body/feedback-panel'],
  ['full-page-edit', 'header/form-body/footer'],
  ['full-page-detail', 'header/white-body/detail-body'],
])

function declaresNonTypicalOverlay(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /hiui-design non-typical:\s*true/i,
    /data-hiui5-non-typical\s*=\s*["']true["']/i,
  ])
}

function getCanonicalShellForContract(contract) {
  const pageTypeId = String(contract?.pageTypeId || '').trim()
  const declaredShell = String(contract?.shell || '').trim()
  const canonicalShell = CANONICAL_SHELL_BY_PAGE_TYPE.get(pageTypeId) || ''

  if (!canonicalShell || declaredShell !== canonicalShell) {
    return ''
  }

  return canonicalShell
}

function validateDeclaredShellAuthenticity({ contract, sourceRaw, pathLabel }) {
  const errors = []
  const canonicalShell = getCanonicalShellForContract(contract)

  if (!canonicalShell) {
    return errors
  }

  if (declaresNonTypicalOverlay(sourceRaw)) {
    return errors
  }

  if (declaresDomAliasForManagedShell(sourceRaw, canonicalShell)) {
    errors.push(
      `${pathLabel} declares ${canonicalShell} as a DOM/string alias. Managed shell names must refer to executable shell components or certified shell carriers; do not alias ${canonicalShell} to div/section/main to satisfy source markers.`
    )
  }

  if (hasHiddenManagedShellMount(sourceRaw, canonicalShell)) {
    errors.push(
      `${pathLabel} mounts <${canonicalShell}> as a hidden proof node. Hidden shells do not carry real page geometry; managed pages must render the shell or use a named shell-carrier inheritance marker.`
    )
  }

  const mountsShell = mountsRealShellRuntime(sourceRaw, canonicalShell)
  const declaresCarrier = hasShellCarrierMarker(sourceRaw)

  if (mountsShell || declaresCarrier) {
    return errors
  }

  const pageTypeId = String(contract?.pageTypeId || '').trim()
  const slotSummary = SHELL_SLOT_SUMMARY_BY_PAGE_TYPE.get(pageTypeId) || 'the page-type regions'

  errors.push(
    `${pathLabel} declares shell=${canonicalShell} for ${pageTypeId} but neither mounts <${canonicalShell}> nor declares a named shell-carrier inheritance marker. Typical pages must start from the executable example shell; rules may replace business slots (${slotSummary}) but must not synthesize a look-alike shell from primitives.`
  )

  return errors
}

function isCanonicalTableFramePage(contract) {
  return (
    ['table-basic', 'tree-table'].includes(String(contract?.pageTypeId || '').trim()) &&
    String(contract?.shell || '').trim() === 'TablePageFrame'
  )
}

function rebuildsTableFrameSkeletonLocally(sourceRaw) {
  return (
    !mountsRealShellRuntime(sourceRaw, 'TablePageFrame') &&
    /\b(?:PageHeader|HostPageHeaderPortal|TypicalPageHeaderPortal)\b/.test(sourceRaw) &&
    /\bProListPage\b/.test(sourceRaw) &&
    /\bQueryFilter\b/.test(sourceRaw) &&
    /<Table\b/.test(sourceRaw)
  )
}

function hasTableFrameHorizontalInsetSignal(snippet) {
  return hasAnyPattern(String(snippet || ''), [
    /padding-inline\s*:\s*(?:var\(|\$|(?:1[6-9]|[2-9]\d)px)/i,
    /padding-left\s*:\s*(?:var\(|\$|(?:1[6-9]|[2-9]\d)px)/i,
    /padding-right\s*:\s*(?:var\(|\$|(?:1[6-9]|[2-9]\d)px)/i,
    /padding\s*:\s*(?:0|0px)\s+(?:var\(|\$|(?:1[6-9]|[2-9]\d)px)/i,
    /paddingInline\s*:\s*['"]?(?:1[6-9]|[2-9]\d)(?:px)?['"]?/i,
    /paddingInlineStart\s*:\s*['"]?(?:1[6-9]|[2-9]\d)(?:px)?['"]?/i,
    /paddingInlineEnd\s*:\s*['"]?(?:1[6-9]|[2-9]\d)(?:px)?['"]?/i,
  ])
}

function hasCanonicalTableFrameBodyInset({ sourceRaw, styleRaw }) {
  const snippets = [
    ...collectRegionStyleSnippets(sourceRaw, styleRaw, 'table'),
    ...collectStyleSnippets(styleRaw, [
      /\.(?:tableContainer|tableRegion|tableViewport)\b[\s\S]{0,240}\{/gi,
    ]),
    ...collectLocalObjectSnippets(sourceRaw, ['tableContainer', 'tableRegion', 'tableViewport']),
  ]

  return snippets.some(hasTableFrameHorizontalInsetSignal)
}

function hasDashboardDimensionSwitchSemantics(sourceRaw) {
  const hasSwitchControls = hasAnyPattern(sourceRaw, [
    /\bRadio(?:\.Group)?\b/,
    /\.Radio\s*\(/,
    /\bTabs\b/,
    /\bSegmented\b/,
    /\btype\s*=\s*['"]button['"]/,
    /\btype\s*:\s*['"]button['"]/,
  ])
  const hasDashboardControlStripCarrier = /\bDashboardControlStrip\b/.test(sourceRaw)
  const hasDimensionSignals = hasAnyPattern(sourceRaw, [
    /(筛选维度|统计维度|时间维度|查看维度|时间粒度|统计粒度)/,
    /['"`]day['"`]/,
    /['"`]week['"`]/,
    /['"`]month['"`]/,
    /['"`]year['"`]/,
    /['"`]日['"`]/,
    /['"`]周['"`]/,
    /['"`]月['"`]/,
    /['"`]年['"`]/,
  ])

  return hasSwitchControls && (hasDimensionSignals || hasDashboardControlStripCarrier)
}

function usesQueryFilterForDimensionSwitch(sourceRaw) {
  if (!hasDashboardDimensionSwitchSemantics(sourceRaw)) {
    return false
  }

  return hasAnyPattern(sourceRaw, [
    /const\s+\w*queryFields\b[\s\S]{0,1600}\.Radio\s*\(/,
    /\bQueryFilter\b[\s\S]{0,800}(筛选维度|统计维度|时间维度|查看维度|时间粒度|统计粒度)/,
  ])
}

function collectDirectQueryFilterKeywordInputSnippets(sourceRaw) {
  const patterns = [
    /{[\s\S]{0,280}field\s*:\s*['"](keyword|keywords|search|searchKey|searchValue|query|queryKey)['"][\s\S]{0,480}component\s*:\s*<Input\b[\s\S]{0,360}(?:\/>|<\/Input>)/gi,
    /{[\s\S]{0,280}label\s*:\s*['"](关键词|关键字|搜索|搜索词)['"][\s\S]{0,480}component\s*:\s*<Input\b[\s\S]{0,360}(?:\/>|<\/Input>)/g,
  ]

  return patterns
    .flatMap((pattern) => Array.from(sourceRaw.matchAll(pattern)))
    .map((match) => String(match[0] || ''))
    .filter(Boolean)
}

function snippetKeepsSearchInputSemantics(snippet) {
  if (!snippet) return false

  if (/\bSearchInput\b/.test(snippet) || /<Search\b/.test(snippet)) {
    return true
  }

  const keepsFilledAppearance =
    /appearance\s*=\s*['"]filled['"]/.test(snippet) ||
    /appearance\s*=\s*\{\s*['"]filled['"]\s*\}/.test(snippet) ||
    /appearance\s*:\s*['"]filled['"]/.test(snippet)
  const keepsSearchAffordance =
    /\bSearchOutlined\b/.test(snippet) ||
    /icon\s*=\s*['"]search['"]/.test(snippet) ||
    /prefix\s*=\s*\{[\s\S]{0,80}search/i.test(snippet) ||
    /suffix\s*=\s*\{[\s\S]{0,80}search/i.test(snippet)

  return keepsFilledAppearance && keepsSearchAffordance
}

function collectQueryFilterOpenTagSnippets(sourceRaw) {
  return collectComponentOpenTagSnippets(sourceRaw, 'QueryFilter', 1600)
}

function queryFilterSnippetForcesInlineLabels(snippet) {
  return snippetEnablesBooleanProp(snippet, 'showLabel')
}

function extractLiteralPropValue(snippet, propName) {
  if (!snippet) return ''

  const patterns = [
    new RegExp(`\\b${escapeRegExp(propName)}\\s*=\\s*['"]([^'"]+)['"]`),
    new RegExp(`\\b${escapeRegExp(propName)}\\s*=\\s*\\{\\s*['"]([^'"]+)['"]\\s*\\}`),
    new RegExp(`\\b${escapeRegExp(propName)}\\s*:\\s*['"]([^'"]+)['"]`),
  ]

  for (const pattern of patterns) {
    const match = snippet.match(pattern)
    if (match?.[1]) {
      return String(match[1]).trim()
    }
  }

  return ''
}

function queryFilterSnippetDriftsContainedAppearance(snippet) {
  const appearance = extractLiteralPropValue(snippet, 'appearance')
  return Boolean(appearance) && appearance !== 'contained'
}

function queryFilterSnippetAddsAlwaysVisibleResetAction(snippet) {
  if (!snippet || !/\bappend\s*=/.test(snippet) || !/<Button\b/.test(snippet)) {
    return false
  }

  return hasAnyPattern(snippet, [
    /\bResetOutlined\b/,
    /\bClearOutlined\b/,
    />\s*(?:重置|清空|Reset|Clear)\s*</,
  ])
}

function hasApprovedStatSectionProof(sourceRaw) {
  return (
    /<\s*StatOverviewGrid\b/.test(sourceRaw) ||
    hasLiteralAttr(sourceRaw, 'data-hiui5-stat-presentation', 'cards')
  )
}

function hasTreeSplitDriftSignals(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /\bTreeSplitPageFrame\b/,
    /\bContextMainSplitScaffold\b/,
    /data-hiui5-region\s*=\s*['"]left-tree['"]/,
    /data-hiui5-region\s*=\s*['"]right-list['"]/,
    /data-hiui5-region\s*=\s*['"]split-workspace['"]/,
    /data-hiui5-shell\s*=\s*['"]TreeSplitPageFrame['"]/,
  ])
}

function treeTableEnablesPaginationAutoHide(sourceRaw) {
  const directPaginationUsesAutoHide = collectComponentOpenTagSnippets(sourceRaw, 'Pagination').some(
    (snippet) => snippetEnablesBooleanProp(snippet, 'autoHide')
  )

  if (directPaginationUsesAutoHide) {
    return true
  }

  return hasAnyPattern(sourceRaw, [
    /\bpaginationProps\s*=\s*\{\s*\{[\s\S]{0,240}\bautoHide\s*:\s*true[\s\S]{0,240}\}\s*\}/,
    /\bpaginationProps\s*:\s*\{[\s\S]{0,240}\bautoHide\s*:\s*true[\s\S]{0,240}\}/,
    /\bpagination\s*=\s*\{\s*\{[\s\S]{0,240}\bautoHide\s*:\s*true[\s\S]{0,240}\}\s*\}/,
    /\bpagination\s*:\s*\{[\s\S]{0,240}\bautoHide\s*:\s*true[\s\S]{0,240}\}/,
  ])
}

function hasApprovedTreeTableInlineTreeProof(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /\brenderTreeTableTextEllipsis\b/,
    /\btreeSwitcherCol\b/,
    /\bdefaultExpandedRowKeys\b/,
    /\bexpandedRowKeys\b/,
    /data-hiui5-tree-table-presentation\s*=\s*['"]inline-tree['"]/,
    /hiui-design tree-table-presentation:\s*inline-tree/i,
  ])
}

function collectStyleSnippets(styleRaw, patterns, radius = 320) {
  return patterns
    .flatMap((pattern) => Array.from(styleRaw.matchAll(pattern)))
    .map((match) => {
      const start = match.index ?? -1
      if (start < 0) return ''
      return styleRaw.slice(start, Math.min(styleRaw.length, start + radius))
    })
    .filter(Boolean)
}

function collectLocalObjectSnippets(sourceRaw, objectNames, radius = 360) {
  return objectNames.flatMap((objectName) =>
    collectStyleSnippets(
      String(sourceRaw || ''),
      [new RegExp(`\\b${escapeRegExp(objectName)}\\s*:\\s*\\{`, 'g')],
      radius
    )
  )
}

function extractBalancedStyleBlock(styleRaw, startIndex) {
  const source = String(styleRaw || '')
  const openBraceIndex = source.indexOf('{', startIndex)
  if (openBraceIndex < 0) {
    return ''
  }

  let depth = 0
  for (let index = openBraceIndex; index < source.length; index += 1) {
    const char = source[index]
    if (char === '{') {
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return source.slice(startIndex, index + 1)
      }
    }
  }

  return source.slice(startIndex)
}

function collectPreciseStyleBlocks(styleRaw, patterns) {
  return patterns
    .flatMap((pattern) => Array.from(String(styleRaw || '').matchAll(pattern)))
    .map((match) => extractBalancedStyleBlock(styleRaw, match.index ?? -1))
    .filter(Boolean)
}

function collectStyleSnippetsForClassNames(styleRaw, classNames, radius = 320) {
  return classNames.flatMap((className) =>
    collectStyleSnippets(
      styleRaw,
      [new RegExp(`\\.${escapeRegExp(className)}\\b[\\s\\S]{0,240}\\{`, 'gi')],
      radius
    )
  )
}

function collectPreciseStyleBlocksForClassNames(styleRaw, classNames) {
  return classNames.flatMap((className) =>
    collectPreciseStyleBlocks(styleRaw, [
      new RegExp(`\\.${escapeRegExp(className)}\\b[\\s\\S]{0,240}\\{`, 'gi'),
    ])
  )
}

function collectFieldConfigSnippets(sourceRaw) {
  const fieldMatches = Array.from(
    sourceRaw.matchAll(/field\s*:\s*['"]([^'"]+)['"]/g)
  )

  return fieldMatches.map((match, index) => {
    const snippetStart = match.index ?? 0
    const snippetEnd =
      fieldMatches[index + 1]?.index ?? Math.min(sourceRaw.length, snippetStart + 1400)

    return {
      field: match[1],
      snippet: sourceRaw.slice(snippetStart, snippetEnd),
    }
  })
}

function hasUndeclaredHeaderSubtitle(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /\bsubTitle\s*=/,
    /\bsubTitle\s*:/,
    /\bsubtitle\s*=/i,
    /\bsubtitle\s*:/i,
    /\bpageSubtitle\b/,
    /\bheaderSubtitle\b/,
  ])
}

function hasUndeclaredDetailGroupSubtitle(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /<DetailSection\b[^>]*\bsubtitle\s*=/,
    /\bfunction\s+DetailSection\s*\(\s*\{[^}]*\bsubtitle\b[^}]*\}\s*\)/,
    /\bstyles\.sectionDescription\b/,
  ])
}

function hasUndeclaredChartExplanationCopy(sourceRaw) {
  return hasAnyPattern(sourceRaw, [/\bstyles\.chartDescription\b/])
}

function hasInlineHeaderHeightBaseline(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /\bminHeight\s*:\s*['"]?60(?:px)?['"]?/i,
    /\bheight\s*:\s*['"]?60(?:px)?['"]?/i,
  ])
}

function hasInlineHeaderPaddingReset(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /\bpaddingBlock\s*:\s*['"]?0(?:px)?['"]?/i,
    /\bpaddingTop\s*:\s*['"]?0(?:px)?['"]?/i,
    /\bpaddingBottom\s*:\s*['"]?0(?:px)?['"]?/i,
    /\bpadding\s*:\s*['"]?0(?:px)?(?:\s+0(?:px)?){1,3}['"]?/i,
  ])
}

function hasInlineHeaderTitleBaseline(sourceRaw) {
  return (
    /\bfontSize\s*:\s*['"]?18(?:px)?['"]?/i.test(sourceRaw) &&
    /\bfontWeight\s*:\s*['"]?600['"]?/i.test(sourceRaw)
  )
}

function hasSupportedHeaderHeightBaseline(sourceRaw, styleRaw) {
  return (
    /\bManagedPageHeader\b/.test(sourceRaw) ||
    inheritsManagedHeaderFromHostSlot(sourceRaw) ||
    /\bHostPageHeaderPortal\b/.test(sourceRaw) ||
    mountsRealShellRuntime(sourceRaw, 'StatListPageFrame') ||
    hasHeaderVerticalCentering(styleRaw) ||
    hasInlineHeaderHeightBaseline(sourceRaw)
  )
}

function hasSupportedHeaderPaddingBaseline(sourceRaw, styleRaw) {
  return (
    mountsRealShellRuntime(sourceRaw, 'StatListPageFrame') ||
    hasInlineHeaderPaddingReset(sourceRaw) ||
    /padding-block\s*:\s*0(?:px)?/i.test(styleRaw) ||
    (/padding-top\s*:\s*0(?:px)?/i.test(styleRaw) &&
      /padding-bottom\s*:\s*0(?:px)?/i.test(styleRaw))
  )
}

function hasSupportedHeaderTitleBaseline(sourceRaw, styleRaw) {
  return (
    /\bManagedPageHeader\b/.test(sourceRaw) ||
    inheritsManagedHeaderFromHostSlot(sourceRaw) ||
    mountsRealShellRuntime(sourceRaw, 'StatListPageFrame') ||
    hasHeaderTitleBaseline(styleRaw) ||
    hasInlineHeaderTitleBaseline(sourceRaw)
  )
}

function hasBackIntent(sourceRaw) {
  return /ArrowLeftOutlined/.test(sourceRaw) || /返回旧版|返回列表|返回\b/.test(sourceRaw)
}

function usesRightActionBackIntent(sourceRaw) {
  const hasOnBack = /\bonBack\s*=/.test(sourceRaw)
  const usesTitleExtra = /titleExtra=\{/.test(sourceRaw) || /extra=\{/.test(sourceRaw)
  return !hasOnBack && usesTitleExtra && hasBackIntent(sourceRaw)
}

function collectQueryFilterAppendSnippets(sourceRaw) {
  const patterns = [
    /<QueryFilter\b[\s\S]{0,2400}\bappend\s*=\s*\{[\s\S]{0,1800}\}/g,
    /\bappend\s*:\s*\[[\s\S]{0,1600}\]/g,
  ]

  return patterns
    .flatMap((pattern) => Array.from(sourceRaw.matchAll(pattern)))
    .map((match) => String(match[0] || ''))
    .filter(Boolean)
}

function hasCustomQueryButtonInQueryFilter(sourceRaw) {
  const snippets = collectQueryFilterAppendSnippets(sourceRaw)
  if (snippets.length === 0) return false

  return snippets.some((snippet) =>
    hasAnyPattern(snippet, [
      /<Button\b[\s\S]{0,240}>\s*查询\s*<\/Button>/,
      /<Button\b[\s\S]{0,240}>\s*搜索\s*<\/Button>/,
      /['"]查询['"]/,
      /['"]搜索['"]/,
    ])
  )
}

function usesPlainButtonForAllFilters(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /<Button\b[\s\S]{0,260}>\s*全部筛选\s*<\/Button>/,
    /<Button\b[\s\S]{0,260}children=\{['"]全部筛选['"]\}/,
  ])
}

function collectOperationActionButtonSnippets(sourceRaw) {
  return Array.from(
    sourceRaw.matchAll(
      /<Button\b[\s\S]{0,280}>\s*(处理|详情|编辑|查看|审核|分配|启用|停用|删除|复制)\s*<\/Button>/g
    )
  )
    .map((match) => String(match[0] || ''))
    .filter(Boolean)
}

function snippetKeepsPrimaryLinkAction(snippet) {
  if (!snippet) return false

  const usesLinkAppearance =
    /appearance\s*=\s*['"]link['"]/.test(snippet) ||
    /appearance\s*=\s*\{\s*['"]link['"]\s*\}/.test(snippet)
  const usesPrimaryType =
    /type\s*=\s*['"]primary['"]/.test(snippet) ||
    /type\s*=\s*\{\s*['"]primary['"]\s*\}/.test(snippet)
  const usesLineType =
    /type\s*=\s*['"]line['"]/.test(snippet) ||
    /type\s*=\s*\{\s*['"]line['"]\s*\}/.test(snippet)

  return usesLinkAppearance && usesPrimaryType && !usesLineType
}

function collectComponentOpenTagSnippets(sourceRaw, componentName, radius = 960) {
  return Array.from(
    String(sourceRaw || '').matchAll(
      new RegExp(`<${escapeRegExp(componentName)}\\b[\\s\\S]{0,${radius}}?(?:\\/?>)`, 'g')
    )
  )
    .map((match) => String(match[0] || ''))
    .filter(Boolean)
}

function snippetEnablesBooleanProp(snippet, propName) {
  if (!snippet || !new RegExp(`\\b${escapeRegExp(propName)}\\b`).test(snippet)) {
    return false
  }

  if (
    new RegExp(`\\b${escapeRegExp(propName)}\\s*=\\s*\\{\\s*false\\s*\\}`).test(snippet) ||
    new RegExp(`\\b${escapeRegExp(propName)}\\s*=\\s*\\{\\s*!0\\s*\\}`).test(snippet)
  ) {
    return false
  }

  return true
}

function directTableUsesEnabledProp(sourceRaw, propName) {
  return collectComponentOpenTagSnippets(sourceRaw, 'Table').some((snippet) =>
    snippetEnablesBooleanProp(snippet, propName)
  )
}

function hasApprovedStatusTagSemantics(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /<Tag\b/,
    /\bStatusTag\b/,
    /\bManagedStatusTag\b/,
    /\bManagedRiskTag\b/,
    /hiui-design status-presentation:\s*(tag|shared-renderer)/,
    /data-hiui5-status-presentation\s*=\s*['"](tag|shared-renderer)['"]/,
  ])
}

function hasStatusLikeSemantics(sourceRaw) {
  return (
    /\bTable\b/.test(sourceRaw) &&
    hasAnyPattern(sourceRaw, [
      /\briskLevel\b/,
      /\bstatusKey\b/,
      /\bRISK_LEVEL_LABEL_KEYS\b/,
      /\bSTATUS_LABEL_KEYS\b/,
      /\bstatusLabel\b/,
      /\bstatusType\b/,
    ])
  )
}

function hasCustomStatusPillImplementation(sourceRaw, styleRaw) {
  return hasAnyPattern(`${sourceRaw}\n${styleRaw}`, [
    /\bcreateRiskLevelStyle\b/,
    /\bstatusPillBase\b/,
    /\bstatusBadge\b/,
    /\briskBadge\b/,
    /\briskPill\b/,
    /\bseverityPill\b/,
    /borderRadius\s*:\s*999/,
  ])
}

function hasApprovedCompoundTableCellMarker(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /hiui-design table-cell:\s*compound-approved/,
    /data-hiui5-table-cell-composition\s*=\s*['"]compound-approved['"]/,
  ])
}

function hasCompoundTableCellPresentation(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /\btableCellMeta\b/,
    /\btableCellPrimary\b/,
    /\bcellMeta\b/,
    /\bcellPrimary\b/,
    /render\s*:\s*\([^)]*\)\s*=>[\s\S]{0,520}<div[\s\S]{0,240}<div[\s\S]{0,240}<div/,
  ])
}

function hasWrappedTableActionCells(sourceRaw) {
  const actionCellSnippets = collectLocalObjectSnippets(sourceRaw, [
    'tableCellAction',
    'actionCell',
    'rowActionCell',
    'tableActions',
    'actionWrap',
  ])

  return actionCellSnippets.some((snippet) =>
    /flexWrap\s*:\s*['"]wrap['"]/.test(snippet) || /flex-wrap\s*:\s*wrap/.test(snippet)
  )
}

function hasMultipleActionButtonsInSingleCell(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /dataKey\s*:\s*['"]actions['"][\s\S]{0,520}<Button\b[\s\S]{0,260}<Button\b/,
    /title\s*:\s*t\(['"](调度操作|操作)['"]\)[\s\S]{0,520}<Button\b[\s\S]{0,260}<Button\b/,
  ])
}

function fixedDashboardFrameOverridesShellChrome(sourceRaw) {
  if (!usesFixedDashboardPageFrame(sourceRaw)) {
    return false
  }

  return hasAnyPattern(sourceRaw, [
    /\bpageRootStyle\s*=/,
    /\bwhiteBodyStyle\s*=/,
    /\bpageRootProps\s*=\s*\{\{[\s\S]{0,600}\bstyle\s*:/,
    /\bwhiteBodyProps\s*=\s*\{\{[\s\S]{0,600}\bstyle\s*:/,
  ])
}

function hasStickyPaginationDock(paginationSnippets) {
  return paginationSnippets.some(
    (snippet) =>
      /position\s*:\s*sticky/i.test(snippet) &&
      /bottom\s*:\s*0/i.test(snippet) &&
      /flex-shrink\s*:\s*0/i.test(snippet)
  )
}

function keepsListWorkspaceHeightChain({
  sourceRaw,
  styleRaw,
}) {
  const outerPaddingSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'outer-padding')
  const whiteBodySnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'white-body')
  const mainScrollSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'main-scroll')
  const tableRegionSnippets = collectRegionStyleSnippets(sourceRaw, styleRaw, 'table')
  const paginationSnippets = collectRegionStyleSnippets(sourceRaw, styleRaw, 'pagination')
  const shellKeepsListWorkspaceHeightChain =
    mountsRealShellRuntime(sourceRaw, 'TablePageFrame') ||
    mountsRealShellRuntime(sourceRaw, 'StatListPageFrame')

  const outerPaddingKeepsFlexColumn =
    shellKeepsListWorkspaceHeightChain ||
    outerPaddingSnippets.some(
      (snippet) => snippetHasDisplayFlex(snippet) && snippetHasFlexDirectionColumn(snippet)
    )
  const whiteBodyKeepsFlexColumn = whiteBodySnippets.some(
    (snippet) =>
      snippetHasFlexOne(snippet) &&
      snippetHasMinHeightZero(snippet) &&
      snippetHasDisplayFlex(snippet) &&
      snippetHasFlexDirectionColumn(snippet)
  )
  const mainScrollKeepsScrollOwner =
    shellKeepsListWorkspaceHeightChain ||
    mainScrollSnippets.some(
      (snippet) =>
        snippetHasFlexOne(snippet) &&
        snippetHasMinHeightZero(snippet) &&
        snippetHasOverflowAuto(snippet)
    )
  const shellKeepsFlexibleTableBody = shellKeepsListWorkspaceHeightChain
  const tableRegionKeepsFlexibleBody = shellKeepsFlexibleTableBody || tableRegionSnippets.some(
    (snippet) => snippetHasFlexOne(snippet) && snippetHasMinHeightZero(snippet)
  )
  const paginationKeepsStickyDock =
    shellKeepsFlexibleTableBody || hasStickyPaginationDock(paginationSnippets)

  return {
    outerPaddingKeepsFlexColumn,
    whiteBodyKeepsFlexColumn,
    mainScrollKeepsScrollOwner,
    tableRegionKeepsFlexibleBody,
    paginationKeepsStickyDock,
    whiteBodySnippets,
  }
}

function inspectPageScrollWorkspace({
  sourceRaw,
  styleRaw,
}) {
  const whiteBodySnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'white-body')
  const mainScrollSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'main-scroll')
  const tableRegionSnippets = collectRegionStyleSnippets(sourceRaw, styleRaw, 'table')
  const paginationSnippets = collectRegionStyleSnippets(sourceRaw, styleRaw, 'pagination')

  const hasClippingOrScrollOverflow = (snippet) =>
    /(overflow(?:-[xy])?\s*:\s*(hidden|auto|scroll))/i.test(snippet) &&
    !/(overflow(?:-[xy])?\s*:\s*visible)/i.test(snippet)

  return {
    whiteBodyBlocksPageFlow: whiteBodySnippets.some((snippet) => hasClippingOrScrollOverflow(snippet)),
    mainScrollCreatesNestedScroll: mainScrollSnippets.some((snippet) =>
      hasClippingOrScrollOverflow(snippet)
    ),
    tableRegionCreatesNestedScroll: tableRegionSnippets.some(
      (snippet) =>
        /(overflow(?:-[xy])?\s*:\s*(auto|scroll))/i.test(snippet) ||
        /\bmax-height\s*:/i.test(snippet) ||
        /\bheight\s*:\s*calc\(/i.test(snippet)
    ),
    paginationKeepsStickyDock: hasStickyPaginationDock(paginationSnippets),
  }
}

function getRequiredHostAdapterId(contract) {
  const explicitHostAdapterId = String(contract?.adapterContract?.hostAdapterId || '').trim()

  if (explicitHostAdapterId) {
    return explicitHostAdapterId
  }

  return ''
}

function getManagedPageTemplateAssetPath(contract) {
  if (!(contract?.strictExampleGeneration && FIXED_TEMPLATE_PAGE_TYPES.has(contract?.pageTypeId))) {
    return ''
  }

  const templateDir = String(contract?.archetypeTemplatePath || '').trim().replace(/\\/g, '/')
  if (!templateDir) {
    return ''
  }

  return `${templateDir.replace(/\/+$/, '')}/page.template.tsx`
}

function getManagedPageContractTopologyId(contract) {
  const topology = contract?.topology
  if (topology && typeof topology === 'object') {
    return String(topology.id || '').trim()
  }

  return String(topology || '').trim()
}

function isNonTypicalOverlayContract(contract) {
  return getManagedPageContractTopologyId(contract) === 'non-typical-overlay'
}

function buildSourceContractCommentLines(contract) {
  const commentLines = [
    CONTRACT_MARKER,
    `${EXAMPLE_MARKER_PREFIX} ${contract.examplePath}`,
    `${PAGE_TYPE_MARKER_PREFIX} ${contract.pageTypeId}`,
    `${ARCHETYPE_MARKER_PREFIX} ${contract.archetypeId}`,
    `${SHELL_MARKER_PREFIX} ${contract.shell}`,
  ]

  const templateAssetPath = getManagedPageTemplateAssetPath(contract)
  if (templateAssetPath) {
    commentLines.push(`${TEMPLATE_MARKER_PREFIX} ${templateAssetPath}`)
  }

  if (contract.scrollStrategy) {
    commentLines.push(`${SCROLL_STRATEGY_MARKER_PREFIX} ${contract.scrollStrategy}`)
  }

  const topologyId = getManagedPageContractTopologyId(contract)
  if (topologyId) {
    commentLines.push(`${TOPOLOGY_MARKER_PREFIX} ${topologyId}`)
  }

  if (contract.layoutStrategy) {
    commentLines.push(`${LAYOUT_STRATEGY_MARKER_PREFIX} ${contract.layoutStrategy}`)
  }

  const requiredHostAdapterId = getRequiredHostAdapterId(contract)
  if (requiredHostAdapterId) {
    commentLines.push(`${HOST_ADAPTER_MARKER_PREFIX} ${requiredHostAdapterId}`)

    if (contract.hostArchetypePath) {
      commentLines.push(`${HOST_ARCHETYPE_MARKER_PREFIX} ${contract.hostArchetypePath}`)
    }
  }

  return commentLines
}

export function getManagedPageSourceCommentLines(contract) {
  return buildSourceContractCommentLines(contract)
}

export function getManagedPageSourceRootAttributes(contract) {
  const rootAttrs = [
    { name: 'data-hiui5-example', value: contract.examplePath },
    { name: 'data-hiui5-page-type', value: contract.pageTypeId },
    { name: 'data-hiui5-archetype', value: contract.archetypeId },
    { name: 'data-hiui5-shell', value: contract.shell },
  ]

  const templateAssetPath = getManagedPageTemplateAssetPath(contract)
  if (templateAssetPath) {
    rootAttrs.push({ name: 'data-hiui5-template', value: templateAssetPath })
  }

  if (contract.scrollStrategy) {
    rootAttrs.push({
      name: 'data-hiui5-scroll-strategy',
      value: contract.scrollStrategy,
    })
  }

  const topologyId = getManagedPageContractTopologyId(contract)
  if (topologyId) {
    rootAttrs.push({
      name: 'data-hiui5-topology',
      value: topologyId,
    })
  }

  if (contract.layoutStrategy) {
    rootAttrs.push({
      name: 'data-hiui5-layout-strategy',
      value: contract.layoutStrategy,
    })
  }

  const requiredHostAdapterId = getRequiredHostAdapterId(contract)
  if (requiredHostAdapterId) {
    rootAttrs.push({
      name: 'data-hiui5-host-adapter',
      value: requiredHostAdapterId,
    })
  }

  return rootAttrs
}

export function getManagedPageSourceRegionAttributes(contract) {
  return getContractRegionNames(contract).map((region) => ({
    name: 'data-hiui5-region',
    value: region,
  }))
}

function getManagedPageSourceOwnershipRoles(contract) {
  const shell = String(contract?.shell || '').trim()

  if (contract?.pageTypeId === 'full-page-detail' && shell === 'ProDetailPage') {
    return ['content-slot', 'white-body']
  }

  return getRequiredOwnershipRolesForPageType(contract.pageTypeId)
}

export function getManagedPageSourceOwnershipAttributes(contract) {
  return getManagedPageSourceOwnershipRoles(contract).map((role) => ({
    legacyName: 'data-hiui5-owner',
    legacyValue: role,
    name: getRoleSpecificOwnershipAttrName(role),
    role,
    value: 'true',
  }))
}

function isLegacyPageComponentFastPathContract(contract) {
  const generationProfile = contract?.generationProfile || {}
  return (
    String(contract?.archetypeMode || '').trim() === 'legacy-host-compatible' &&
    String(generationProfile.strategy || '').trim() === 'page-component' &&
    String(generationProfile.startFrom || '').trim() === 'page-component' &&
    Boolean(String(generationProfile.pageComponentId || '').trim()) &&
    Boolean(String(generationProfile.runtimeBridgeProfileId || '').trim())
  )
}

function validateLegacyPageComponentFastPathSource({ contract, sourceRaw, pathLabel }) {
  const errors = []
  const generationProfile = contract?.generationProfile || {}
  const runtimeComponentSource = String(generationProfile.runtimeComponentSource || '').trim()
  const runtimeBridgeProfileId = String(generationProfile.runtimeBridgeProfileId || '').trim()
  const pageComponentId = String(generationProfile.pageComponentId || '').trim()

  for (const line of buildSourceContractCommentLines(contract)) {
    if (!sourceRaw.includes(line)) {
      errors.push(`${pathLabel} is missing source contract marker "${line}".`)
    }
  }

  const requiredRuntimeBridgeMarkers = [
    `runtime bridge profile: ${runtimeBridgeProfileId}`,
    `selected component: ${pageComponentId}`,
    `runtime shell source: ${runtimeComponentSource}`,
  ]
  for (const marker of requiredRuntimeBridgeMarkers) {
    if (!sourceRaw.includes(marker)) {
      errors.push(
        `${pathLabel} is missing runtime bridge marker "${marker}". Legacy page-component fast path must keep the selected component and bridge profile machine-checkable.`
      )
    }
  }

  if (!/slot-adapter\.stub/.test(sourceRaw)) {
    errors.push(
      `${pathLabel} does not import the runtime bridge slot adapter stub. Legacy page-component fast path must bind business slots through an explicit slot adapter boundary.`
    )
  }

  if (!/\badaptedSlots\.businessSlots\b/.test(sourceRaw)) {
    errors.push(
      `${pathLabel} does not route businessSlots through adaptedSlots.businessSlots. Legacy page-component fast path must fill certified business slots instead of rebuilding shell regions locally.`
    )
  }

  if (!/\badaptedSlots\.controlledExtensions\b/.test(sourceRaw)) {
    errors.push(
      `${pathLabel} does not expose adaptedSlots.controlledExtensions. Legacy page-component fast path must keep Level 1 controlled extensions on the slot adapter boundary.`
    )
  }

  if (!/\badaptedSlots\.runtimeBridge\b/.test(sourceRaw)) {
    errors.push(
      `${pathLabel} does not expose adaptedSlots.runtimeBridge. Legacy page-component fast path must keep runtime inputs at the bridge boundary instead of in local shell reimplementation.`
    )
  }

  if (!/\bRuntimeBridgeShellAny\b/.test(sourceRaw) && !/\bRuntimeBridgeShell\b/.test(sourceRaw)) {
    errors.push(
      `${pathLabel} does not mount the resolved runtime bridge shell. Legacy page-component fast path must render the planner-selected runtime shell instead of page-local white-body/header/table primitives.`
    )
  }

  return errors
}

function validateCommonSourceContract({ contract, sourceRaw, pathLabel }) {
  const errors = []
  const usesManagedShellEntry = mountsManagedShellInEntry(sourceRaw)

  for (const line of buildSourceContractCommentLines(contract)) {
    if (!sourceRaw.includes(line)) {
      errors.push(`${pathLabel} is missing source contract marker "${line}".`)
    }
  }

  for (const attr of getManagedPageSourceRootAttributes(contract)) {
    const count = countManagedRootAttrSignals(sourceRaw, attr.name, attr.value)
    if (count === 0) {
      errors.push(
        `${pathLabel} is missing ${attr.name}="${attr.value}". Managed pages must expose a machine-checkable root archetype fingerprint.`
      )
    } else if (count > 1) {
      errors.push(
        `${pathLabel} declares ${attr.name}="${attr.value}" ${count} times. Keep one root identity for page type / archetype / shell.`
      )
    }
  }

  if (usesManagedShellEntry) {
    return errors
  }

  for (const attr of getManagedPageSourceRegionAttributes(contract)) {
    if (
      attr.value === 'header-leading' &&
      (/\bonBack\s*=/.test(sourceRaw) || hasLiteralAttr(sourceRaw, 'data-hiui5-leading-back', 'true'))
    ) {
      continue
    }

    if (!hasManagedRegionCarrier(sourceRaw, attr.value)) {
      errors.push(
        `${pathLabel} is missing a real layout container for ${attr.name}="${attr.value}". Required contract regions must be attached to actual rendered wrappers, not hidden anchors or self-closing placeholders.`
      )
    }
  }

  for (const attr of getManagedPageSourceOwnershipAttributes(contract)) {
    if (!hasOwnershipContainer(sourceRaw, attr.role)) {
      errors.push(
        `${pathLabel} is missing a real ownership container for ${attr.name} or ${attr.legacyName}="${attr.legacyValue}". Ownership roles must be attached to the actual workspace wrappers, not hidden anchors.`
      )
    }
  }

  if (countLiteralAttr(sourceRaw, 'data-hiui5-region', 'white-body') > 1) {
    errors.push(
      `${pathLabel} declares multiple data-hiui5-region="white-body" anchors. White-body-based pages must keep a single white-body owner.`
    )
  }

  for (const role of getManagedPageSourceOwnershipRoles(contract)) {
    if (countOwnershipMarkers(sourceRaw, role) > 1) {
      errors.push(
        `${pathLabel} declares multiple ${role} ownership anchors. Each workspace role must stay singular so the page does not fall back to double workspace / double white-body / double scroll ownership.`
      )
    }
  }

  return errors
}

function validateNamedHostAdapterTranslation({ contract, sourceRaw, targetRoot, pathLabel }) {
  const errors = []
  const requiredHostAdapterId = getRequiredHostAdapterId(contract)

  if (!requiredHostAdapterId) {
    return errors
  }

  const registryEntry = getAdapterRegistryEntry(requiredHostAdapterId, {
    skillRoot: resolveProjectSkillRoot(targetRoot),
  })
  if (!registryEntry) {
    errors.push(
      `${pathLabel} declares host adapter ${requiredHostAdapterId}, but rules/adapter-registry.json does not register that adapter. Register its responsibilities and localBypass containment before using it as source proof.`
    )
  }

  if (!hasManagedShellCarrier(sourceRaw, 'data-hiui5-host-adapter', requiredHostAdapterId)) {
    errors.push(
      `${pathLabel} must expose one real shell carrier with data-hiui5-host-adapter="${requiredHostAdapterId}". In ${contract.archetypeMode}, generated pages must be built by copying the packaged example shell and anchoring it to one registered host adapter family, not by approximating the example with local primitives.`
    )
  }

  const expectedHostArchetypePath = String(contract.hostArchetypePath || '').trim()
  const generatedPagePath = normalizeRelativeSourcePath(contract.generatedPagePath || pathLabel)
  const normalizedHostArchetypePath = normalizeRelativeSourcePath(expectedHostArchetypePath)

  if (expectedHostArchetypePath && normalizedHostArchetypePath === generatedPagePath) {
    errors.push(
      `${pathLabel} declares hostArchetypePath as the generated page itself. Host archetype provenance must point to a pre-existing template, reference, scaffold, or host page; a page cannot certify its own shell/adapter inheritance.`
    )
  }

  if (
    expectedHostArchetypePath &&
    !sourceRaw.includes(`${HOST_ARCHETYPE_MARKER_PREFIX} ${expectedHostArchetypePath}`)
  ) {
    errors.push(
      `${pathLabel} is missing the host-archetype source marker for ${expectedHostArchetypePath}. rules-only / legacy-host-compatible pages must bind the generated page back to one concrete host archetype path so copied-example generation stays machine-checkable.`
    )
  }

  return errors
}

export function validateManagedPageSlotBoundary({ contract, sourceRaw, pathLabel }) {
  const errors = []
  const declaredShell = String(contract?.shell || '').trim()
  const canonicalShell = getCanonicalShellForContract(contract) || declaredShell

  if (canonicalShell) {
    if (declaresDomAliasForManagedShell(sourceRaw, canonicalShell)) {
      errors.push(
        `${pathLabel} changes locked shell boundary by aliasing ${canonicalShell} to a DOM/string element. Slot edits may update business fields, data, copy, actions, and adapters only; they must not replace the managed shell.`
      )
    }

    if (hasHiddenManagedShellMount(sourceRaw, canonicalShell)) {
      errors.push(
        `${pathLabel} changes locked shell boundary by mounting hidden <${canonicalShell}> proof nodes. Slot edits must keep real shell geometry visible or use a certified shell carrier.`
      )
    }
  }

  const expectedHostArchetypePath = normalizeRelativeSourcePath(contract?.hostArchetypePath || '')
  const generatedPagePath = normalizeRelativeSourcePath(contract?.generatedPagePath || pathLabel)
  if (expectedHostArchetypePath && expectedHostArchetypePath === generatedPagePath) {
    errors.push(
      `${pathLabel} changes provenance boundary by making hostArchetypePath point to the generated page itself. Slot edits cannot self-certify their mold or adapter source.`
    )
  }

  return errors
}

function validateRequiredCapabilities({ contract, sourceRaw, pathLabel }) {
  const errors = []
  const requiredCapabilities = Array.isArray(contract.adapterContract?.requiredCapabilities)
    ? contract.adapterContract.requiredCapabilities
    : []

  if (
    requiredCapabilities.includes('leading-back') &&
    !/\bonBack\s*=/.test(sourceRaw) &&
    !hasLiteralAttr(sourceRaw, 'data-hiui5-leading-back', 'true')
  ) {
    errors.push(
      `${pathLabel} declares the leading-back capability in its contract but source does not expose onBack or data-hiui5-leading-back="true".`
    )
  }

  if (
    requiredCapabilities.includes('table') &&
    !/\b(Table|PageTable)\b/.test(sourceRaw) &&
    !mountsRealShellRuntime(sourceRaw, 'StatListPageFrame') &&
    !mountsRealShellRuntime(sourceRaw, 'TablePageFrame') &&
    !mountsRealShellRuntime(sourceRaw, 'TreeSplitPageFrame')
  ) {
    errors.push(
      `${pathLabel} declares the table capability in its contract but source does not reference Table/PageTable semantics.`
    )
  }

  if (
    requiredCapabilities.includes('pagination') &&
    !/\bPagination\b/.test(sourceRaw) &&
    !mountsRealShellRuntime(sourceRaw, 'StatListPageFrame') &&
    !mountsRealShellRuntime(sourceRaw, 'TablePageFrame') &&
    !mountsRealShellRuntime(sourceRaw, 'TreeSplitPageFrame')
  ) {
    errors.push(
      `${pathLabel} declares the pagination capability in its contract but source does not reference Pagination semantics.`
    )
  }

  if (
    requiredCapabilities.includes('detail-body') &&
    !/\b(Descriptions|SchemaDescriptionsBridge)\b/.test(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} declares the detail-body capability in its contract but source does not reference Descriptions semantics.`
    )
  }

  return errors
}

function truncateSnippet(value, max = 80) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim()
  if (!normalized) return ''
  return normalized.length > max ? `${normalized.slice(0, max - 3)}...` : normalized
}

function collectUniqueSnippets(matches, maxCount = 3) {
  const seen = new Set()
  const results = []

  for (const match of matches) {
    const snippet = truncateSnippet(match)
    if (!snippet || seen.has(snippet)) continue
    seen.add(snippet)
    results.push(snippet)
    if (results.length >= maxCount) break
  }

  return results
}

function collectHardcodedCopySnippets(sourceRaw) {
  const matches = []
  const attrPattern =
    /\b(?:placeholder|title|label|emptyText|description|okText|cancelText|aria-label)\s*=\s*(['"])(?=[^'"]*[\u3400-\u9fff])[^'"]+\1/g
  const objectPattern =
    /\b(?:title|label|placeholder|description|text|emptyText|okText|cancelText)\s*:\s*(['"])(?=[^'"]*[\u3400-\u9fff])[^'"]+\1/g
  const jsxTextPattern = />\s*[^<{]*[\u3400-\u9fff][^<{]*\s*</g

  matches.push(...Array.from(sourceRaw.matchAll(attrPattern), (match) => match[0]))
  matches.push(...Array.from(sourceRaw.matchAll(objectPattern), (match) => match[0]))
  matches.push(
    ...Array.from(sourceRaw.matchAll(jsxTextPattern), (match) =>
      String(match[0] || '').replace(/[><]/g, ' ')
    )
  )

  return collectUniqueSnippets(matches).filter(
    (snippet) => !/\bt\s*\(\s*['"`][^'"`]*[\u3400-\u9fff]/.test(snippet)
  )
}

function collectPhysicalDirectionSnippets(sourceRaw, styleRaw) {
  const matches = []
  const sourcePatterns = [
    /\b(?:marginLeft|marginRight|paddingLeft|paddingRight|borderLeft(?:Width|Color|Style)?|borderRight(?:Width|Color|Style)?)\b\s*:/g,
    /style\s*=\s*\{\{[\s\S]{0,240}\b(?:left|right)\b\s*:/g,
    /\btextAlign\b\s*:\s*['"](left|right)['"]/g,
  ]
  const stylePatterns = [
    /\b(?:margin|padding|border)-(?:left|right)\b/g,
    /\b(?:left|right)\s*:/g,
    /\btext-align\s*:\s*(?:left|right)\b/g,
  ]

  for (const pattern of sourcePatterns) {
    matches.push(...Array.from(sourceRaw.matchAll(pattern), (match) => match[0]))
  }

  for (const pattern of stylePatterns) {
    matches.push(...Array.from(styleRaw.matchAll(pattern), (match) => match[0]))
  }

  return collectUniqueSnippets(matches)
}

function collectHandwrittenFormatterSnippets(sourceRaw) {
  const matches = []
  const patterns = [
    /\.toFixed\s*\(/g,
    /\bgetMonth\s*\(/g,
    /\bgetDate\s*\(/g,
    /\bgetFullYear\s*\(/g,
    /(['"`$€£¥])\s*\+\s*[A-Za-z_$][\w$.]*/g,
    /[A-Za-z_$][\w$.]*\s*\+\s*(['"`%])/g,
    /\.toUpperCase\s*\(\s*\)/g,
    /\.sort\s*\(\s*\)/g,
  ]

  for (const pattern of patterns) {
    matches.push(...Array.from(sourceRaw.matchAll(pattern), (match) => match[0]))
  }

  return collectUniqueSnippets(matches)
}

function validateI18nBaseline({ sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const hardcodedCopySnippets = collectHardcodedCopySnippets(sourceRaw)
  const physicalDirectionSnippets = collectPhysicalDirectionSnippets(sourceRaw, styleRaw)
  const handwrittenFormatterSnippets = collectHandwrittenFormatterSnippets(sourceRaw)

  if (hardcodedCopySnippets.length > 0) {
    errors.push(
      `${pathLabel} still contains obvious hardcoded user-facing copy (${hardcodedCopySnippets.join(
        '; '
      )}). Managed pages must route visible text through the project i18n runtime / bridge instead of writing literals directly in JSX or config objects.`
    )
  }

  if (physicalDirectionSnippets.length > 0) {
    errors.push(
      `${pathLabel} still uses physical direction properties (${physicalDirectionSnippets.join(
        '; '
      )}). Managed pages must prefer logical properties so RTL locales can flip without rewriting page-level layout.`
    )
  }

  if (handwrittenFormatterSnippets.length > 0) {
    errors.push(
      `${pathLabel} still uses handwritten locale formatting signals (${handwrittenFormatterSnippets.join(
        '; '
      )}). Dates, numbers, currency, percent, casing, and sorting must go through Intl or the project-level formatter bridge.`
    )
  }

  return errors
}

const COMMON_COMPONENT_SKELETON_GUARDS = [
  { componentName: 'PageHeader', prefixes: ['hi-v5-page-header'], allowedProps: [] },
  { componentName: 'QueryFilter', prefixes: ['hi-v5-query-filter'], allowedProps: [] },
  { componentName: 'Table', prefixes: ['hi-v5-table'], allowedProps: [] },
  {
    componentName: 'Descriptions',
    prefixes: ['hi-v5-descriptions'],
    allowedProps: ['display', 'justify-content', 'text-align', 'width'],
  },
  { componentName: 'Timeline', prefixes: ['hi-v5-timeline'], allowedProps: [] },
  { componentName: 'Empty', prefixes: ['hi-v5-empty'], allowedProps: [] },
  { componentName: 'Tag', prefixes: ['hi-v5-tag'], allowedProps: [] },
  { componentName: 'Progress', prefixes: ['hi-v5-progress'], allowedProps: [] },
  { componentName: 'Steps', prefixes: ['hi-v5-steps'], allowedProps: [] },
]

function extractCssPropertyNames(snippet) {
  return [...new Set(Array.from(String(snippet || '').matchAll(/\b([a-z-]+)\s*:/gi), (match) => String(match[1] || '').toLowerCase()).filter(Boolean))]
}

function collectCommonComponentSlotOverrideSnippets(sourceRaw) {
  const matches = []

  for (const { componentName } of COMMON_COMPONENT_SKELETON_GUARDS) {
    const pattern = new RegExp(
      `<${escapeRegExp(componentName)}\\b[\\s\\S]{0,800}\\b(?:classNames|styles)\\s*=`,
      'g'
    )
    matches.push(...Array.from(sourceRaw.matchAll(pattern), (match) => match[0]))
  }

  return collectUniqueSnippets(matches)
}

function collectCommonComponentSkeletonSelectorMutations(sourceRaw, styleRaw) {
  const violations = []

  for (const { componentName, prefixes, allowedProps } of COMMON_COMPONENT_SKELETON_GUARDS) {
    const allowedPropSet = new Set(allowedProps.map((prop) => String(prop).toLowerCase()))

    for (const prefix of prefixes) {
      const sourceSelectorPatterns = [
        new RegExp(`:global\\(\\s*\\.${escapeRegExp(prefix)}[\\w-]*`, 'gi'),
        new RegExp(`::v-deep[\\s\\S]{0,120}\\.${escapeRegExp(prefix)}[\\w-]*`, 'gi'),
        new RegExp(`/deep/[\\s\\S]{0,120}\\.${escapeRegExp(prefix)}[\\w-]*`, 'gi'),
      ]
      const styleSelectorPatterns = [
        new RegExp(`\\.${escapeRegExp(prefix)}[\\w-]*[^\\{]{0,160}\\{`, 'gi'),
      ]

      const snippets = [
        ...collectStyleSnippets(String(sourceRaw || ''), sourceSelectorPatterns, 360),
        ...collectStyleSnippets(String(styleRaw || ''), [...sourceSelectorPatterns, ...styleSelectorPatterns], 360),
      ]
      for (const snippet of snippets) {
        const propertyNames = extractCssPropertyNames(snippet)
        const forbiddenProps = propertyNames.filter((prop) => !allowedPropSet.has(prop))

        if (propertyNames.length === 0) {
          continue
        }

        if (forbiddenProps.length === 0) {
          continue
        }

        const detail = forbiddenProps.length > 0 ? `${componentName} <- ${forbiddenProps.join(', ')}` : componentName
        violations.push(detail)
      }
    }
  }

  return collectUniqueSnippets(violations, 6)
}

function collectLegacyHiuiResidueSnippets(sourceRaw, styleRaw) {
  const matches = []
  const patterns = [/\bhi-v4-[\w-]+\b/g, /\b--hi-v4-[\w-]+\b/g, /\bHiUI\s*4(?:\.0)?\b/g, /\bHiUI4(?:\.0)?\b/g]

  for (const pattern of patterns) {
    matches.push(...Array.from(String(sourceRaw || '').matchAll(pattern), (match) => match[0]))
    matches.push(...Array.from(String(styleRaw || '').matchAll(pattern), (match) => match[0]))
  }

  return collectUniqueSnippets(matches, 6)
}

function validateCommonComponentSkeletonIntegrity({ sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const slotOverrideSnippets = collectCommonComponentSlotOverrideSnippets(sourceRaw)
  const selectorMutationSnippets = collectCommonComponentSkeletonSelectorMutations(
    sourceRaw,
    styleRaw
  )
  const legacyHiuiResidueSnippets = collectLegacyHiuiResidueSnippets(sourceRaw, styleRaw)

  if (slotOverrideSnippets.length > 0) {
    errors.push(
      `${pathLabel} overrides HiUI common-component skeleton slots via classNames/styles (${slotOverrideSnippets.join(
        '; '
      )}). Business pages must not restyle PageHeader, QueryFilter, Table, Descriptions, Timeline, Empty, Tag, Progress, or Steps through internal slot overrides.`
    )
  }

  if (selectorMutationSnippets.length > 0) {
    errors.push(
      `${pathLabel} directly targets HiUI common-component skeleton selectors from local page styles (${selectorMutationSnippets.join(
        '; '
      )}). This is treated as host-style contamination because business-page styles must not mutate the internal .hi-v5-* skeleton of common components.`
    )
  }

  if (legacyHiuiResidueSnippets.length > 0) {
    errors.push(
      `${pathLabel} still carries legacy HiUI v4 residue (${legacyHiuiResidueSnippets.join(
        '; '
      )}). Current pages must clear hi-v4 selectors, variables, and old-version wording before they can pass host-style contamination audit.`
    )
  }

  return errors
}

function snippetPropertyHasPxAtLeast(snippet, propertyName, minPx) {
  const declarationPattern = new RegExp(`${escapeRegExp(propertyName)}\\s*:\\s*([^;,}\\n]+)`, 'gi')

  for (const match of String(snippet || '').matchAll(declarationPattern)) {
    const declaration = String(match[1] || '')
    for (const valueMatch of declaration.matchAll(/(\d+(?:\.\d+)?)(?:px)?/gi)) {
      if (Number(valueMatch[1]) >= minPx) {
        return true
      }
    }
  }

  return false
}

function getOwnershipMappingTarget(contract, role) {
  const entry = Array.isArray(contract?.ownershipMapping)
    ? contract.ownershipMapping.find(
        (item) => String(item?.role || '').trim().toLowerCase() === String(role || '').trim().toLowerCase()
      )
    : null

  return String(entry?.target || '').trim()
}

function normalizeOwnerTarget(value) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')

  if (!normalized) return ''
  if (normalized === 'true') return 'true'
  if (normalized === 'none' || normalized === 'not-applicable') return 'none'
  if (/host-(slot|content|outlet)|hostslot|host-content-slot|host-slot/.test(normalized)) {
    return 'host-slot'
  }
  if (/main-content-outlet|content-outlet/.test(normalized)) {
    return 'main-content-outlet'
  }
  if (/white-body|whitebody|main-white-body|page-surface|main-white-body-workspace/.test(normalized)) {
    return 'white-body'
  }
  if (/page-root|pageroot|page-root-owner/.test(normalized)) {
    return 'page-root'
  }
  if (/section-root|section-body|card-body|panel-body/.test(normalized)) {
    return 'section-root'
  }

  return normalized
}

function collectRoleSpecificOwnerValues(sourceRaw, role) {
  const attrName = getRoleSpecificOwnershipAttrName(role)
  const pattern = new RegExp(
    `${escapeRegExp(attrName)}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{\\s*(['"])([^'"]+)\\3\\s*\\}))?`,
    'g'
  )

  return Array.from(String(sourceRaw || '').matchAll(pattern), (match) =>
    normalizeOwnerTarget(match[1] || match[2] || match[4] || 'true')
  ).filter(Boolean)
}

function getSourceOrContractOwnerTarget({ contract, sourceRaw, role }) {
  const sourceValues = collectRoleSpecificOwnerValues(sourceRaw, role).filter((value) => value !== 'true')
  if (sourceValues.length > 0) {
    return sourceValues[0]
  }

  return normalizeOwnerTarget(getOwnershipMappingTarget(contract, role))
}

function collectManagedRootStyleSnippets(sourceRaw, styleRaw) {
  const rootClassNames = [
    ...extractLiteralClassNamesForAttrPresence(sourceRaw, 'data-hiui-design-page'),
    ...extractLiteralClassNamesForAttrPresence(sourceRaw, 'data-hiui5-page-type'),
  ]

  return [
    ...collectPreciseStyleBlocksForClassNames(styleRaw, [...new Set(rootClassNames)]),
    ...collectOpenTagSnippetsForAttrPresence(sourceRaw, 'data-hiui-design-page'),
    ...collectOpenTagSnippetsForAttrPresence(sourceRaw, 'data-hiui5-page-type'),
  ]
}

function snippetHasRootPaddingChrome(snippet) {
  return [
    'padding',
    'padding-inline',
    'padding-left',
    'padding-right',
    'padding-block',
    'padding-top',
    'padding-bottom',
    'paddingInline',
    'paddingLeft',
    'paddingRight',
    'paddingBlock',
    'paddingTop',
    'paddingBottom',
  ].some((propertyName) => snippetPropertyHasPxAtLeast(snippet, propertyName, 8))
}

function snippetHasVisibleBackground(snippet) {
  const declarationPattern = /(background(?:-color)?|backgroundColor)\s*:\s*([^;,}\n]+)/gi

  for (const match of String(snippet || '').matchAll(declarationPattern)) {
    const value = String(match[2] || '').trim().toLowerCase()
    if (!value) continue
    if (
      value === 'transparent' ||
      value === 'none' ||
      value === 'inherit' ||
      value === 'initial' ||
      value === 'unset' ||
      /rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/.test(value)
    ) {
      continue
    }

    return true
  }

  return false
}

function snippetHasRootRadiusChrome(snippet) {
  return (
    snippetPropertyHasPxAtLeast(snippet, 'border-radius', 1) ||
    snippetPropertyHasPxAtLeast(snippet, 'borderRadius', 1)
  )
}

function snippetHasVerticalScrollOwner(snippet) {
  return /(overflow|overflow-y|overflowY)\s*:\s*(auto|scroll)/i.test(String(snippet || ''))
}

function collectHeaderRegionClassNames(sourceRaw) {
  return extractLiteralClassNamesForAttr(sourceRaw, 'data-hiui5-region', 'header')
}

function collectPrimaryBodyRegionClassNames(contract, sourceRaw) {
  const regionOrderByPageType = {
    'table-basic': ['query-filter', 'stat-section', 'table'],
    'table-stat': ['stat-section', 'query-filter', 'table'],
    'tree-table': ['query-filter', 'table'],
    'tree-split': ['left-tree', 'query-filter', 'table'],
    'data-visualization': ['stat-section', 'chart-section', 'query-filter', 'table'],
    'full-page-edit': ['form-body'],
    'full-page-detail': ['detail-body'],
    'drawer-form': ['drawer-body'],
    'drawer-detail': ['drawer-body'],
    'feedback-status': ['feedback-body'],
  }

  const orderedRegionNames = regionOrderByPageType[contract?.pageTypeId] || ['white-body']
  const classNames = []

  for (const regionName of orderedRegionNames) {
    classNames.push(...extractLiteralClassNamesForAttr(sourceRaw, 'data-hiui5-region', regionName))
  }

  if (classNames.length === 0) {
    classNames.push(...extractLiteralClassNamesForAttr(sourceRaw, 'data-hiui5-region', 'white-body'))
  }

  return [...new Set(classNames)]
}

function validateWorkspaceChromeOwnership({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const ownershipRoles = new Set(getManagedPageSourceOwnershipRoles(contract))

  if (!ownershipRoles.has('white-body')) {
    return errors
  }

  const outerPaddingSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'outer-padding')
  const whiteBodySnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'white-body')
  const mainScrollSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'main-scroll')

  const outerPaddingCreatesSecondSurface = outerPaddingSnippets.some((snippet) =>
    hasBackgroundOrRadiusSignal(snippet)
  )
  const mainScrollCreatesSecondSurface = mainScrollSnippets.some((snippet) =>
    hasBackgroundOrRadiusSignal(snippet)
  )
  const outerPaddingOwnsScrollChrome = outerPaddingSnippets.some((snippet) =>
    /(overflow(?:-[xy])?\s*:\s*(hidden|auto|scroll))/i.test(snippet)
  )
  const mainScrollCreatesViewportShell = mainScrollSnippets.some((snippet) =>
    /height\s*:\s*calc\(100vh\s*-\s*60px\)/i.test(snippet)
  )
  const whiteBodyCreatesVisibleSurface = whiteBodySnippets.some((snippet) =>
    hasBackgroundOrRadiusSignal(snippet)
  )

  if (whiteBodyCreatesVisibleSurface && (outerPaddingCreatesSecondSurface || mainScrollCreatesSecondSurface)) {
    errors.push(
      `${pathLabel} lets outer-padding/main-scroll rebuild a second visible surface on top of the white-body owner. White-body pages must keep one visible white workspace instead of degrading into double workspace / double white-body shells.`
    )
  }

  if (outerPaddingOwnsScrollChrome || mainScrollCreatesViewportShell) {
    errors.push(
      `${pathLabel} moves viewport-level shell behavior onto outer-padding/main-scroll. Keep shell-level viewport height and clipping with the packaged page shell or host outlet, not with a second page-local wrapper.`
    )
  }

  return errors
}

function validateRootChromeOwnership({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const contentSlotOwner = getSourceOrContractOwnerTarget({ contract, sourceRaw, role: 'content-slot' })
  const whiteBodyOwner = getSourceOrContractOwnerTarget({ contract, sourceRaw, role: 'white-body' })
  const outerPaddingOwner = getSourceOrContractOwnerTarget({ contract, sourceRaw, role: 'outer-padding' })
  const mainScrollOwner = getSourceOrContractOwnerTarget({ contract, sourceRaw, role: 'main-scroll' })
  const hostOwnsContentAndScroll = contentSlotOwner === 'host-slot' && mainScrollOwner === 'host-slot'
  const pageRootTakesOnlyOuterPadding =
    hostOwnsContentAndScroll && whiteBodyOwner === 'none' && outerPaddingOwner === 'page-root'
  const hostSlotShell =
    hostOwnsContentAndScroll &&
    outerPaddingOwner === 'host-slot' &&
    (whiteBodyOwner === 'none' || whiteBodyOwner === 'host-slot')

  if (pageRootTakesOnlyOuterPadding) {
    errors.push(
      `${pathLabel} splits host-slot ownership by assigning content-slot/main-scroll to host-slot while page-root owns outer-padding and white-body is none. Host-integrated non-typical pages must either keep outer-padding on the host slot or promote the page root into a continuous white-body/page-surface owner.`
    )
  }

  if (!hostSlotShell) {
    return errors
  }

  const rootStyleSnippets = collectManagedRootStyleSnippets(sourceRaw, styleRaw)
  const rootOwnsPadding = rootStyleSnippets.some(snippetHasRootPaddingChrome)
  const rootOwnsVisibleSurface = rootStyleSnippets.some(
    (snippet) => snippetHasVisibleBackground(snippet) || snippetHasRootRadiusChrome(snippet)
  )
  const rootOwnsScroll = rootStyleSnippets.some(snippetHasVerticalScrollOwner)

  if (rootOwnsPadding || rootOwnsVisibleSurface || rootOwnsScroll) {
    const reasons = []
    if (rootOwnsPadding) reasons.push('page-level padding')
    if (rootOwnsVisibleSurface) reasons.push('visible background/radius')
    if (rootOwnsScroll) reasons.push('overflow auto/scroll')

    errors.push(
      `${pathLabel} declares a host-slot-shell ownership chain but the managed page root still owns ${reasons.join(
        ', '
      )}. In host-slot-shell pages, the root must stay layout-only; keep padding/background/radius/scroll on the host slot or on local section/card bodies according to the contract.`
    )
  }

  return errors
}

function validateNestedSpacingOwnership({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const ownershipRoles = new Set(getManagedPageSourceOwnershipRoles(contract))

  if (!ownershipRoles.has('white-body')) {
    return errors
  }

  const whiteBodySnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'white-body')
  const outerPaddingSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'outer-padding')

  const whiteBodyOwnsLargeRhythm = whiteBodySnippets.some(
    (snippet) =>
      snippetPropertyHasPxAtLeast(snippet, 'padding', 16) ||
      snippetPropertyHasPxAtLeast(snippet, 'gap', 16)
  )
  const outerPaddingOwnsLargeInset = outerPaddingSnippets.some((snippet) =>
    snippetPropertyHasPxAtLeast(snippet, 'padding', 16)
  )

  if (whiteBodyOwnsLargeRhythm && outerPaddingOwnsLargeInset) {
    errors.push(
      `${pathLabel} lets outer-padding and white-body both own 16px+ layout inset. Keep page-level inset on one owner only; otherwise managed pages drift into oversized double-spacing shells.`
    )
  }

  const firstTierRegionNames = getContractRegionNames(contract).filter(
    (region) => !['header', 'white-body', 'pagination'].includes(String(region || '').toLowerCase())
  )
  const firstTierRegionSnippets = firstTierRegionNames.flatMap((regionName) =>
    collectRegionStyleSnippets(sourceRaw, styleRaw, regionName)
  )
  const compoundedRegionWrappers = firstTierRegionSnippets.filter((snippet) => {
    const ownsLargeRhythm =
      snippetPropertyHasPxAtLeast(snippet, 'gap', 16) ||
      snippetPropertyHasPxAtLeast(snippet, 'padding', 16)
    const isLayoutWrapper =
      /(display\s*:\s*(flex|grid))/i.test(snippet) &&
      /(flex-direction\s*:\s*column|grid-template-columns|grid-template-rows)/i.test(snippet)

    return ownsLargeRhythm && isLayoutWrapper
  })

  if (whiteBodyOwnsLargeRhythm && compoundedRegionWrappers.length > 0) {
    errors.push(
      `${pathLabel} stacks 16px+ spacing on both the white-body owner and a first-tier region wrapper. Keep page rhythm on the single workspace owner and move local spacing down to real cards/grids instead of nesting generic section containers.`
    )
  }

  if (outerPaddingOwnsLargeInset && compoundedRegionWrappers.length > 0) {
    errors.push(
      `${pathLabel} lets outer-padding and a first-tier region wrapper both own 16px+ layout rhythm. Managed pages must keep exactly one page-level spacing owner; move section spacing into inner content cards/grids instead of the region wrapper itself.`
    )
  }

  return errors
}

function validateHeaderBodyGapBaseline({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const headerClassNames = collectHeaderRegionClassNames(sourceRaw)
  const bodyClassNames = collectPrimaryBodyRegionClassNames(contract, sourceRaw)

  if (headerClassNames.length === 0 || bodyClassNames.length === 0) {
    return errors
  }

  const headerSnippets = collectStyleSnippetsForClassNames(styleRaw, headerClassNames)
  const bodySnippets = collectStyleSnippetsForClassNames(styleRaw, bodyClassNames)

  const headerCreatesLargeBottomGap = headerSnippets.some(
    (snippet) =>
      snippetPropertyHasPxAtLeast(snippet, 'margin-bottom', 24) ||
      snippetPropertyHasPxAtLeast(snippet, 'padding-bottom', 24)
  )
  const bodyCreatesLargeTopGap = bodySnippets.some(
    (snippet) =>
      snippetPropertyHasPxAtLeast(snippet, 'margin-top', 24) ||
      snippetPropertyHasPxAtLeast(snippet, 'padding-top', 24)
  )

  if (headerCreatesLargeBottomGap || bodyCreatesLargeTopGap) {
    errors.push(
      `${pathLabel} adds an oversized gap between the title/header region and the first body region. Do not leave a large blank band under the title; keep the header-to-body rhythm on the packaged baseline instead of stacking extra top/bottom spacing on both sides.`
    )
  }

  return errors
}

function validateFullPageDetailStructure({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []

  if (contract.pageTypeId !== 'full-page-detail') {
    return errors
  }

  if (!hasVerticalDescriptionsPlacement(sourceRaw)) {
    errors.push(
      `${pathLabel} does not keep Descriptions in vertical placement. Full-page-detail fields must use top/bottom label-value distribution instead of inline horizontal rows.`
    )
  }

  if (!hasThreeColumnDescriptions(sourceRaw)) {
    errors.push(
      `${pathLabel} does not keep a 3-column detail grid. Full-page-detail must preserve the example's three-column grouped layout.`
    )
  }

  const detailSurfaceSnippets = getDetailSurfaceSignals(styleRaw).filter(hasBackgroundOrRadiusSignal)
  if (detailSurfaceSnippets.length > 0) {
    errors.push(
      `${pathLabel} surfaces summary/section blocks as independent cards. Full-page-detail must keep one white-body workspace and use grouped Descriptions inside it instead of stacking summary cards or per-section white cards.`
    )
  }

  if (!hasSupportedHeaderHeightBaseline(sourceRaw, styleRaw)) {
    errors.push(
      `${pathLabel} header styles do not declare 60px height/min-height plus align-items:center. Legacy-host-compatible full-page-detail headers must stay vertically centered inside the header region.`
    )
  }

  if (!hasSupportedHeaderTitleBaseline(sourceRaw, styleRaw)) {
    errors.push(
      `${pathLabel} does not keep the full-page-detail title on the 18px / 600 baseline. Host PageHeader implementations must own the title typography instead of depending on unrelated page styles.`
    )
  }

  if (
    /<PageHeader\b[\s\S]{0,360}\bstyle=\{\{[\s\S]{0,220}\balignItems\s*:\s*['"]center['"][\s\S]{0,220}\b(?:minHeight|height)\s*:\s*['"]?60(?:px)?['"]?[\s\S]{0,220}\}\}/.test(
      sourceRaw
    )
  ) {
    errors.push(
      `${pathLabel} forces 60px height and alignItems:center on the PageHeader root. Keep the 60px rhythm on the host header slot or shared header carrier; PageHeader root should not become a fake flex centering shell.`
    )
  }

  if (usesVerticalDetailDescriptions(sourceRaw) && hasFixedDescriptionsLabelWidth(sourceRaw)) {
    errors.push(
      `${pathLabel} hard-codes labelWidth on vertical detail Descriptions. Let detail labels size to their content instead of pinning a fixed label width, otherwise the label text visually centers inside a forced-width box and drifts away from the left reading edge.`
    )
  }

  if (usesVerticalDetailDescriptions(sourceRaw) && !hasLeftDescriptionsLabelPlacement(sourceRaw)) {
    errors.push(
      `${pathLabel} does not explicitly freeze vertical detail labelPlacement to left. Detail-shell pages must not rely on upstream or browser defaults to keep labels starting from the left reading edge.`
    )
  }

  if (
    usesSchemaDescriptionsBridge(sourceRaw) &&
    usesVerticalDetailDescriptions(sourceRaw) &&
    !hasClearedDescriptionsLabelWidth(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} relies on SchemaDescriptionsBridge hidden vertical detail defaults. Clear the bridge-inherited fixed labelWidth at the source boundary instead of trusting transitive defaults to preserve the detail-shell layout.`
    )
  }

  if (hasUndeclaredDetailGroupSubtitle(sourceRaw)) {
    errors.push(
      `${pathLabel} adds undeclared subtitle/explanatory copy under full-page-detail group titles. Keep grouped sections on the example baseline: title only, without auto-generated subtitle rows or helper narration.`
    )
  }

  if (hasUndeclaredChartExplanationCopy(sourceRaw)) {
    errors.push(
      `${pathLabel} adds chart explanation copy inside full-page-detail supplementary panels even though the page contract does not declare chart narration. Do not inject chartDescription-style helper text such as trend explanations or load summaries unless the requirement explicitly asks for it.`
    )
  }

  return errors
}

function validateFullPageDetailSingleShell({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []

  if (contract.pageTypeId !== 'full-page-detail' || String(contract.shell || '').trim() !== 'ProDetailPage') {
    return errors
  }

  const proDetailShellSnippets = collectStyleSnippets(styleRaw, [/\.pageContainer\b[\s\S]{0,240}\{/gi], 360)
  const shellOwnsWorkspaceChrome = proDetailShellSnippets.some(
    (snippet) =>
      /height\s*:\s*calc\(100vh\s*-\s*60px\)/i.test(snippet) &&
      /overflow\s*:\s*auto/i.test(snippet) &&
      hasBackgroundOrRadiusSignal(snippet)
  )

  if (!shellOwnsWorkspaceChrome) {
    return errors
  }

  const localWhiteBodyClassNames = [
    ...extractLiteralClassNamesForAttr(sourceRaw, 'data-hiui5-region', 'white-body'),
    ...extractOwnershipClassNames(sourceRaw, 'white-body'),
  ]
  const localOuterPaddingClassNames = extractOwnershipClassNames(sourceRaw, 'outer-padding')
  const localMainScrollClassNames = extractOwnershipClassNames(sourceRaw, 'main-scroll')

  const localWhiteBodySnippets = collectStyleSnippetsForClassNames(styleRaw, localWhiteBodyClassNames)
  const localOuterPaddingSnippets = collectStyleSnippetsForClassNames(styleRaw, localOuterPaddingClassNames)
  const localMainScrollSnippets = collectStyleSnippetsForClassNames(styleRaw, localMainScrollClassNames)

  const localWhiteBodyRebuildsSurface = localWhiteBodySnippets.some((snippet) =>
    hasWorkspaceChromeSignal(snippet)
  )
  const localOuterPaddingRebuildsShell = localOuterPaddingSnippets.some(
    (snippet) => hasPaddingSignal(snippet) || hasWorkspaceChromeSignal(snippet)
  )
  const localMainScrollRebuildsShell = localMainScrollSnippets.some(
    (snippet) => /overflow\s*:\s*auto/i.test(snippet) || /height\s*:\s*calc\(100vh\s*-\s*60px\)/i.test(snippet)
  )

  if (localWhiteBodyRebuildsSurface || localOuterPaddingRebuildsShell || localMainScrollRebuildsShell) {
    errors.push(
      `${pathLabel} duplicates the ProDetailPage workspace shell with local white-body / outer-padding / main-scroll wrappers. ProDetailPage already owns the page height, white surface, radius, and main scrolling; the page source may only add content spacing inside that shell, not a second height/overflow/background layer.`
    )
  }

  return errors
}

function validateFullPageEditStructure({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []

  if (contract.pageTypeId !== 'full-page-edit') {
    return errors
  }

  const surfacedSectionSnippets = getSourceSurfaceSignals(styleRaw).filter(hasBackgroundOrRadiusSignal)
  if (surfacedSectionSnippets.length > 0) {
    errors.push(
      `${pathLabel} wraps full-page-edit sections in surfaced cards. The archetype requires one white-body form workspace plus one footer, not one white card per top-level section.`
    )
  }

  if (hasUndeclaredHeaderSubtitle(sourceRaw)) {
    errors.push(
      `${pathLabel} adds subtitle/subTitle content to the full-page-edit header even though the example does not declare any subtitle area. Do not inject undeclared header copy.`
    )
  }

  if (usesRightActionBackIntent(sourceRaw)) {
    errors.push(
      `${pathLabel} moves the back affordance into titleExtra/right actions instead of a leading onBack action. In full-page-edit, the return path belongs to the header-leading slot, not the right toolbar.`
    )
  }

  if (!hasSupportedHeaderHeightBaseline(sourceRaw, styleRaw)) {
    errors.push(
      `${pathLabel} does not keep the full-page-edit header on the 60px height baseline. Use the real PageHeader/header carrier with 60px vertical rhythm instead of a taller custom title block.`
    )
  }

  if (!hasSupportedHeaderTitleBaseline(sourceRaw, styleRaw)) {
    errors.push(
      `${pathLabel} does not keep the full-page-edit title on the 18px / 600 baseline. Do not let local page styles or custom markup drift away from the packaged header typography.`
    )
  }

  if (
    /<PageHeader\b[\s\S]{0,360}\bstyle=\{\{[\s\S]{0,220}\balignItems\s*:\s*['"]center['"][\s\S]{0,220}\b(?:minHeight|height)\s*:\s*['"]?60(?:px)?['"]?[\s\S]{0,220}\}\}/.test(
      sourceRaw
    )
  ) {
    errors.push(
      `${pathLabel} forces 60px height and alignItems:center on the PageHeader root. Keep the 60px rhythm on the host header slot or shared header carrier; PageHeader root should not become a fake flex centering shell.`
    )
  }

  if (
    /extra=\{[\s\S]{0,400}<Button\b[^>]*\bstyle=\{\{[\s\S]{0,160}\b(?:minHeight|height)\s*:\s*60\b[\s\S]{0,160}\}\}[^>]*>/.test(
      sourceRaw
    )
  ) {
    errors.push(
      `${pathLabel} stretches the PageHeader extra button to the 60px header height. Keep header action buttons on the native HiUI button size baseline; the 60px rhythm belongs to PageHeader, not the button itself.`
    )
  }

  if (/footer=\{/.test(sourceRaw) && /\bLayout\b/.test(sourceRaw)) {
    errors.push(
      `${pathLabel} uses a generic Layout.footer-style slot for full-page-edit actions. Keep edit actions in the archetype footer region instead of a generic layout footer.`
    )
  }

  const usesProEditPage = /\bProEditPage\b/.test(sourceRaw) && /<ProEditPage\b/.test(sourceRaw)
  const usesProEditContextDependents =
    /<Form\b/.test(sourceRaw) ||
    /<(CancelButton|StashButton|SubmitButton)\b/.test(sourceRaw) ||
    /\buseProEditPageContext\b/.test(sourceRaw)
  const hasProEditProviderSignal =
    /\bProEditPageProvider\b/.test(sourceRaw) || /\buseProEditPageContext\b/.test(sourceRaw)

  if (usesProEditPage && usesProEditContextDependents && !hasProEditProviderSignal) {
    errors.push(
      `${pathLabel} mounts ProEditPage with Form/edit actions but does not keep a ProEditPageProvider or equivalent edit context chain. This causes runtime white screens when the edit shell reads edit-page context.`
    )
  }

  const compactFullSpanFieldViolations = collectFieldConfigSnippets(sourceRaw)
    .map((item) => {
      const componentMatch = item.snippet.match(/component\s*:\s*['"](input|select|checkSelect|switch)['"]/)
      const colSpanMatch = item.snippet.match(/colSpan\s*:\s*3\b/)

      if (!componentMatch || !colSpanMatch || /allowFullSpan\s*:\s*true/.test(item.snippet)) {
        return null
      }

      return {
        field: item.field,
        component: componentMatch[1],
        snippet: item.snippet,
      }
    })
    .filter(Boolean)

  if (compactFullSpanFieldViolations.length > 0) {
    const summary = compactFullSpanFieldViolations
      .map((item) => `${item.field}:${item.component}`)
      .join(', ')
    errors.push(
      `${pathLabel} expands compact editable controls to full-row colSpan=3 (${summary}). In full-page-edit, input/select/checkSelect/switch fields should stay in the 3-column grid by default; reserve full-row span for textarea/media/upload or explicit long-text deviations.`
    )
  }

  const footerClassNames = extractLiteralClassNamesForAttr(
    sourceRaw,
    'data-hiui5-region',
    'footer'
  )

  const outerPaddingSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'outer-padding')
  const whiteBodySnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'white-body')
  const mainScrollSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'main-scroll')
  const footerSnippets = [
    ...collectStyleSnippetsForClassNames(styleRaw, footerClassNames),
    ...collectRegionStyleSnippets(sourceRaw, styleRaw, 'footer'),
  ]
  const shellKeepsStickyFooterHeightChain = mountsRealShellRuntime(sourceRaw, 'ProEditPage')
  const uploadUsesCustomContent =
    /<Upload[\s\S]{0,400}\bcontent=\{/.test(sourceRaw) || /\bcontent=\{uploadContent\}/.test(sourceRaw)
  const uploadTriggerHasExtraIcon = uploadUsesCustomContent && /UploadOutlined/.test(sourceRaw)

  if (uploadTriggerHasExtraIcon) {
    errors.push(
      `${pathLabel} customizes Upload trigger content with UploadOutlined while also using the host Upload component. Do not add a second upload icon when the host trigger already renders one.`
    )
  }

  const outerPaddingKeepsFlexColumn =
    shellKeepsStickyFooterHeightChain ||
    outerPaddingSnippets.some(
      (snippet) => snippetHasDisplayFlex(snippet) && snippetHasFlexDirectionColumn(snippet)
    )
  const whiteBodyKeepsFlexColumn =
    shellKeepsStickyFooterHeightChain ||
    whiteBodySnippets.some(
      (snippet) =>
        snippetHasDisplayFlex(snippet) &&
        snippetHasFlexDirectionColumn(snippet) &&
        snippetHasMinHeightZero(snippet)
    )
  const mainScrollKeepsScrollOwner =
    shellKeepsStickyFooterHeightChain ||
    mainScrollSnippets.some(
      (snippet) =>
        snippetHasFlexOne(snippet) &&
        snippetHasMinHeightZero(snippet) &&
        snippetHasOverflowAuto(snippet)
    )
  const footerKeepsFixedSibling =
    shellKeepsStickyFooterHeightChain ||
    footerSnippets.some((snippet) => snippetHasFlexShrinkZero(snippet))
  const footerActionsRightAligned =
    shellKeepsStickyFooterHeightChain ||
    footerSnippets.some((snippet) => snippetHasJustifyContentFlexEnd(snippet))
  const footerUsesBoxShadow = footerSnippets.some((snippet) => /box-shadow\s*:/i.test(snippet))
  const mainScrollAddsOuterPadding = mainScrollSnippets.some((snippet) =>
    /padding\s*:\s*(20px|'20px|"20px)/i.test(snippet)
  )

  if (
    !(outerPaddingKeepsFlexColumn && whiteBodyKeepsFlexColumn && mainScrollKeepsScrollOwner && footerKeepsFixedSibling)
  ) {
    errors.push(
      `${pathLabel} does not keep the full-page-edit height chain required by the sticky footer. Outer-padding and white-body wrappers must stay flex columns, main-scroll must remain flex:1 + min-height:0 + overflow:auto, and footer must stay a flex-shrink:0 sibling instead of falling back into normal document flow.`
    )
  }

  if (footerSnippets.length > 0 && !footerActionsRightAligned) {
    errors.push(
      `${pathLabel} defines a footer action area that is not right-aligned. Full-page-edit footer actions must stay on the right edge of the footer region.`
    )
  }

  if (footerUsesBoxShadow) {
    errors.push(
      `${pathLabel} adds box-shadow to the full-page-edit footer. inlineEditFooter should keep the archetype's flat white background plus divider edge, not a floating card shadow.`
    )
  }

  if (mainScrollAddsOuterPadding) {
    errors.push(
      `${pathLabel} adds outer padding directly on the full-page-edit scroll body. Keep spacing inside form/card structure instead of wrapping formScrollBody with 20px padding.`
    )
  }

  return errors
}

function collectFullPageEditBaseFormSpacingSnippets(sourceRaw, styleRaw) {
  const selectorPatterns = [
    /\.hi-v5-form-item(?![\w-])[\s\S]{0,120}\{/gi,
    /\.hi-v5-form(?![\w-])[\s\S]{0,120}\{/gi,
    /\.hi-v5-form-label(?![\w-])[\s\S]{0,120}\{/gi,
    /\.hi-v5-form-item__label(?![\w-])[\s\S]{0,120}\{/gi,
  ]

  return collectPreciseStyleBlocks(styleRaw, selectorPatterns)
}

function collectLikelyFullPageEditFieldGridSnippets(sourceRaw, styleRaw) {
  const fieldGridClassNames = new Set([
    ...extractLiteralClassNamesForAttr(sourceRaw, 'data-hiui5-region', 'form-body'),
    ...Array.from(
      String(sourceRaw || '').matchAll(
        /\bstyles\.([A-Za-z0-9_-]*(?:groupGrid|fieldGrid|formGrid|fieldsGrid|editGrid|grid)[A-Za-z0-9_-]*)\b/g
      ),
      (match) => String(match[1] || '')
    ),
  ])

  const explicitFieldGridSnippets = [...fieldGridClassNames].flatMap((className) =>
    collectPreciseStyleBlocks(
      styleRaw,
      [new RegExp(`\\.${escapeRegExp(className)}(?![\\w-])[\\s\\S]{0,120}\\{`, 'gi')]
    )
  )
  const fallbackGridSnippets = collectPreciseStyleBlocks(
    styleRaw,
    [/\.(?:groupGrid|fieldGrid|formGrid|fieldsGrid|editGrid)(?![\w-])[\s\S]{0,120}\{/gi]
  )

  return [...new Set([...explicitFieldGridSnippets, ...fallbackGridSnippets])]
}

function validateFullPageEditFormSpacingOwnership({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []

  if (contract.pageTypeId !== 'full-page-edit') {
    return errors
  }

  const baseFormSpacingOverrides = collectFullPageEditBaseFormSpacingSnippets(sourceRaw, styleRaw).filter(
    (snippet) =>
      snippetDeclaresProperty(snippet, 'margin-top') ||
      snippetDeclaresProperty(snippet, 'margin-bottom') ||
      snippetDeclaresProperty(snippet, 'padding-top') ||
      snippetDeclaresProperty(snippet, 'padding-bottom')
  )

  if (baseFormSpacingOverrides.length > 0) {
    errors.push(
      `${pathLabel} overrides .hi-v5-form-item / .hi-v5-form / .hi-v5-form-label spacing at page level. In full-page-edit, field vertical rhythm belongs to FormItem and section structure, not page-local overrides of HiUI base form skeleton classes.`
    )
  }

  const fieldGridSpacingViolations = collectLikelyFullPageEditFieldGridSnippets(sourceRaw, styleRaw).filter(
    (snippet) =>
      hasGridStructureSignal(snippet) &&
      (snippetHasPositiveRowGap(snippet) ||
        snippetHasPositiveBottomSpacing(snippet, 'padding') ||
        snippetHasPositiveBottomSpacing(snippet, 'margin') ||
        snippetHasPositiveBottomSpacing(snippet, 'padding-bottom') ||
        snippetHasPositiveBottomSpacing(snippet, 'margin-bottom'))
  )

  if (fieldGridSpacingViolations.length > 0) {
    errors.push(
      `${pathLabel} lets the full-page-edit field grid own vertical rhythm through row-gap or bottom spacing. Field grids may own columns and horizontal gutter only; do not use grid row-gap, padding-bottom, margin-bottom, or last-row whitespace to create footer separation.`
    )
  }

  return errors
}

function validateHeaderPortalStructure({ sourceRaw, pathLabel }) {
  const errors = []
  const portalMatchers = [
    { portalName: 'PageHeaderPortal', pattern: /<PageHeaderPortal\b[^>]*>([\s\S]*?)<\/PageHeaderPortal>/g },
    { portalName: 'HostPageHeaderPortal', pattern: /<HostPageHeaderPortal\b[^>]*>([\s\S]*?)<\/HostPageHeaderPortal>/g },
    {
      portalName: 'TypicalPageHeaderPortal',
      pattern: /<TypicalPageHeaderPortal\b[^>]*>([\s\S]*?)<\/TypicalPageHeaderPortal>/g,
    },
  ]

  for (const { portalName, pattern } of portalMatchers) {
    for (const match of sourceRaw.matchAll(pattern)) {
      const body = stripLeadingJsxNoise(match[1] || '')
      const firstTag = body.match(/^<([A-Za-z0-9_.]+)/)?.[1] || ''

      if (firstTag && firstTag !== 'PageHeader') {
        errors.push(
          `${pathLabel} mounts ${portalName} with a wrapper node before PageHeader. Keep the portal carrier direct-child as the real PageHeader instead of inserting a div for region markers or local layout shells.`
        )
      }
    }
  }

  return errors
}

function validateHeaderShellCarriers({ sourceRaw, pathLabel }) {
  const errors = []
  const directPackagePortalImportPattern =
    /import\s*\{[^}]*\bTypicalPageHeaderPortal\b[^}]*\}\s*from\s*['"]@hiui-design\/typical-page-shells\/host['"]/
  const duplicatedHeaderRegionCount = countLiteralAttr(sourceRaw, 'data-hiui5-region', 'header')
  const visibleHeaderShellPattern =
    /<([a-z][\w:-]*)\b[^>]*data-hiui5-region\s*=\s*(['"])header\2[^>]*>/g

  if (directPackagePortalImportPattern.test(sourceRaw)) {
    errors.push(
      `${pathLabel} imports TypicalPageHeaderPortal directly from @hiui-design/typical-page-shells/host. Managed pages must mount header regions through the target project's strict host adapter portal or a shared fixed frame helper; do not rely on the package portal fallback inside business pages.`
    )
  }

  if (duplicatedHeaderRegionCount > 1) {
    errors.push(
      `${pathLabel} declares data-hiui5-region="header" ${duplicatedHeaderRegionCount} times. Managed pages must keep one header carrier only; duplicate header anchors usually become an empty white strip plus a second content-local header.`
    )
  }

  for (const match of sourceRaw.matchAll(visibleHeaderShellPattern)) {
    const tagName = String(match[1] || '').toLowerCase()
    errors.push(
      `${pathLabel} attaches data-hiui5-region="header" to a visible <${tagName}> wrapper. Header region anchors must live on the host header portal carrier instead of a DOM shell that renders an extra white strip above the workspace.`
    )
  }

  if (/\bExampleAppShell\b/.test(sourceRaw)) {
    errors.push(
      `${pathLabel} references ExampleAppShell inside a managed page import chain. Business pages must bind to the existing host layout contract instead of rebuilding a second preview shell with its own header/footer slots.`
    )
  }

  return errors
}

function validatePageLocalHeaderCarrier({ sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const importsCreatePortal = /import\s*\{[^}]*\bcreatePortal\b[^}]*\}\s*from\s*['"]react-dom['"]/.test(
    sourceRaw
  )
  const rendersPageHeader = /<PageHeader\b/.test(sourceRaw)
  const definesLocalHeaderPortal = hasAnyPattern(sourceRaw, [
    /function\s+[A-Za-z0-9_]*(?:Page)?HeaderPortal\b/,
    /const\s+[A-Za-z0-9_]*(?:Page)?HeaderPortal\s*=/,
    /function\s+[A-Za-z0-9_]*Header[A-Za-z0-9_]*Portal\b/,
    /const\s+[A-Za-z0-9_]*Header[A-Za-z0-9_]*Portal\s*=/,
  ])

  if (importsCreatePortal && rendersPageHeader) {
    errors.push(
      `${pathLabel} imports createPortal while rendering PageHeader. Managed business pages must inherit the header carrier from a shipped example, managed shell, shared host adapter, or upstream host slot; do not mount PageHeader through a page-local portal.`
    )
  }

  if (definesLocalHeaderPortal && rendersPageHeader) {
    errors.push(
      `${pathLabel} defines a page-local header portal component. Header is a carrier-critical region: copy or bind the registered host adapter/example and fill only pageTitle/headerExtra/onBack slots instead of owning the portal carrier in the business page.`
    )
  }

  const pageHeaderClassNames = extractComponentClassNames(sourceRaw, 'PageHeader')
  const pageHeaderStyleSnippets = collectStyleSnippetsForClassNames(styleRaw, pageHeaderClassNames)
  const overridesHeaderGeometry = pageHeaderStyleSnippets.some((snippet) =>
    hasAnyPattern(snippet, [
      /(?:^|[;\s])height\s*:/i,
      /(?:^|[;\s])min-height\s*:/i,
      /(?:^|[;\s])padding(?:-[a-z]+)?\s*:/i,
      /(?:^|[;\s])align-items\s*:/i,
      /(?:^|[;\s])display\s*:\s*(?:flex|grid)/i,
    ])
  )
  const overridesHiuiHeaderSkeleton = /\.hi-v5-page-header[\w_-]*\b[\s\S]{0,240}\{[\s\S]{0,240}(?:height|min-height|padding|align-items|display)\s*:/i.test(
    styleRaw
  )

  if (overridesHeaderGeometry || overridesHiuiHeaderSkeleton) {
    errors.push(
      `${pathLabel} overrides PageHeader geometry in page-local styles. Header height, padding, align-items, portal carrier, and .hi-v5-page-header skeleton belong to the managed shell/adapter, not the business page.`
    )
  }

  return errors
}

function declaresNonTypicalOverlayContractOrSource({ contract, sourceRaw }) {
  return (
    String(contract?.topology || '').trim() === 'non-typical-overlay' ||
    /hiui-design\s+topology:\s*non-typical-overlay/i.test(sourceRaw) ||
    /data-hiui5-topology\s*=\s*['"]non-typical-overlay['"]/.test(sourceRaw)
  )
}

function validateNonTypicalStrategyProof({ contract, sourceRaw, pathLabel }) {
  const errors = []
  if (!declaresNonTypicalOverlayContractOrSource({ contract, sourceRaw })) {
    return errors
  }

  const contractLayoutStrategy = String(contract?.layoutStrategy || contract?.layout?.strategy || '').trim()
  const contractLayoutArchetype = String(contract?.layoutArchetype || contract?.layout?.archetype || '').trim()
  const hasLayoutStrategy = Boolean(contractLayoutStrategy) || hasAnyPattern(sourceRaw, [
    /hiui-design\s+layout-strategy:\s*[^\n*]+/i,
    /data-hiui5-layout-strategy\s*=/,
  ])
  const hasLayoutArchetype = Boolean(contractLayoutArchetype) || hasAnyPattern(sourceRaw, [
    /hiui-design\s+layout\s+archetype:\s*[^\n*]+/i,
    /data-hiui5-layout-group\s*=/,
  ])
  const hasRuntimeEvidence = hasAnyPattern(sourceRaw, [
    /data-hiui5-layout-strategy\s*=/,
    /data-hiui5-layout-group\s*=/,
    /data-hiui5-layout-region\s*=/,
    /data-hiui5-layout-item\s*=/,
    /data-hiui5-non-typical-region\s*=/,
  ])
  const hasContractEvidence = Boolean(
    contract?.strategyEvidence || contract?.layout?.strategyEvidence || contract?.nonTypicalScope
  )

  if (!hasLayoutStrategy || !hasLayoutArchetype) {
    errors.push(
      `${pathLabel} declares non-typical-overlay without complete layout strategy proof. Non-typical pages must carry layout strategy and layout archetype through plan, contract, source markers, and runtime markers instead of relying on the topology marker alone.`
    )
  }

  if (!hasRuntimeEvidence && !hasContractEvidence) {
    errors.push(
      `${pathLabel} declares non-typical-overlay but provides no strategy evidence. Add runtime layout markers or contract strategyEvidence that proves the selected layout strategy, without forcing a fixed summary/main/aside structure.`
    )
  }

  return errors
}

function validateQueryFilterFieldMapSupport({ sourceRaw, pathLabel }) {
  const errors = []

  if (!/<QueryFilter\b/.test(sourceRaw)) {
    return errors
  }

  if (sourceRaw.includes(QUERYFILTER_UPSTREAM_FIELDMAP_ESCAPE)) {
    return errors
  }

  const hasFieldMapProvider = hasAnyPattern(sourceRaw, [
    /<([A-Za-z0-9_.]*FieldMapProvider)\b/,
    /\bTypicalPageFieldMapProvider\b/,
  ])

  if (!hasFieldMapProvider) {
    errors.push(
      `${pathLabel} renders QueryFilter without a colocated FieldMapProvider. Schema-driven QueryFilter fields must keep FieldMapProvider / TypicalPageFieldMapProvider semantics, or explicitly annotate hiui-design allow-queryfilter-with-upstream-fieldmap when the provider is mounted higher in the host tree.`
    )
  }

  return errors
}

function isProjectCertifiedCarrierDelivery(contract) {
  const kind = String(contract?.generationProfile?.selectedDeliveryAssetKind || '').trim()
  return kind === 'project-certified-carrier' || kind === 'project-certified-carrier-set'
}

function collectLikelyPageHeaderWrapperClassNames(sourceRaw) {
  const patterns = [
    /<(?:div|section|header)\b[^>]{0,320}className\s*=\s*\{\s*styles\.([A-Za-z0-9_]+)\s*\}[^>]{0,320}>\s*(?:<HostHeaderSlot\b[^>]*>\s*)?<PageHeader\b/g,
    /<(?:div|section|header)\b[^>]{0,320}className\s*=\s*\{\s*styles\[['"]([^'"]+)['"]\]\s*\}[^>]{0,320}>\s*(?:<HostHeaderSlot\b[^>]*>\s*)?<PageHeader\b/g,
  ]

  return [
    ...new Set(
      patterns.flatMap((pattern) =>
        Array.from(sourceRaw.matchAll(pattern), (match) =>
          String(match[1] || '').trim()
        ).filter(Boolean)
      )
    ),
  ]
}

function collectPxPropertyValues(snippet, propertyName) {
  return collectPropertyValues(snippet, propertyName)
    .map((value) => {
      const match = stripQuotedValue(value).match(/^([0-9]*\.?[0-9]+)px$/i)
      return match ? Number(match[1]) : null
    })
    .filter((value) => Number.isFinite(value))
}

function snippetKeepsHeader60pxBaseline(snippet) {
  const headerHeights = [
    ...collectPxPropertyValues(snippet, 'min-height'),
    ...collectPxPropertyValues(snippet, 'height'),
  ]
  const keeps60pxHeight = headerHeights.some((value) => Math.abs(value - 60) < 0.001)
  const keepsVerticalCenter = /align-items\s*:\s*center/i.test(String(snippet || ''))

  return keeps60pxHeight && keepsVerticalCenter
}

function snippetDriftsHeader60pxBaseline(snippet) {
  const headerHeights = [
    ...collectPxPropertyValues(snippet, 'min-height'),
    ...collectPxPropertyValues(snippet, 'height'),
  ]

  return headerHeights.some((value) => Math.abs(value - 60) >= 0.001)
}

function validateProjectCertifiedCarrierListBaseline({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const rolloutPageTypes = new Set(['table-basic', 'table-stat', 'tree-table'])
  const pageTypeId = String(contract?.pageTypeId || '').trim()
  const expectsStatSection = getNormalizedContractRegions(contract).has('stat-section')

  if (!isProjectCertifiedCarrierDelivery(contract) || !rolloutPageTypes.has(pageTypeId)) {
    return errors
  }

  const hasMachineCheckableHeaderCarrier = hasAnyPattern(sourceRaw, [
    /data-hiui5-region\s*=\s*['"]header['"]/,
    /<\s*(HostPageHeaderPortal|TypicalPageHeaderPortal|ManagedPageHeader)\b/,
  ])

  if (!hasMachineCheckableHeaderCarrier) {
    errors.push(
      `${pathLabel} routes table-basic through a project-certified carrier but does not expose a machine-checkable header carrier. Carriers in the rollout path must declare data-hiui5-region="header" or a recognized header portal so header ownership/60px baseline can be enforced before runtime.`
    )
  }

  const headerWrapperClassNames = [
    ...new Set([
      ...collectHeaderRegionClassNames(sourceRaw),
      ...collectLikelyPageHeaderWrapperClassNames(sourceRaw),
    ]),
  ]
  const headerWrapperSnippets = collectPreciseStyleBlocksForClassNames(styleRaw, headerWrapperClassNames)

  if (
    headerWrapperSnippets.length === 0 ||
    !headerWrapperSnippets.some(snippetKeepsHeader60pxBaseline)
  ) {
    errors.push(
      `${pathLabel} does not prove a 60px header baseline on the project-certified table-basic carrier. Carrier-owned header wrappers must keep min-height/height: 60px plus align-items: center instead of relying on accidental upstream defaults.`
    )
  } else if (headerWrapperSnippets.some(snippetDriftsHeader60pxBaseline)) {
    errors.push(
      `${pathLabel} lets the project-certified table-basic carrier drift away from the 60px header baseline. Keep carrier header wrappers fixed to 60px instead of 56/64px or content-driven heights.`
    )
  }

  const pageHeaderIndex = sourceRaw.search(/<PageHeader\b/)
  const whiteBodyIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]white-body['"]/)
  const statSectionIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]stat-section['"]/)
  const queryFilterIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]query-filter['"]/)
  const tableIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]table['"]/)
  const paginationIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]pagination['"]/)
  const expectsPaginationRegion = getNormalizedContractRegions(contract).has('pagination')
  const outerPaddingSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'outer-padding')
  const whiteBodySnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'white-body')
  const mainScrollSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'main-scroll')
  const tableRegionSnippets = collectRegionStyleSnippets(sourceRaw, styleRaw, 'table')

  if (pageHeaderIndex >= 0 && whiteBodyIndex >= 0 && pageHeaderIndex > whiteBodyIndex) {
    errors.push(
      `${pathLabel} renders PageHeader after the white-body region. strict rollout list carriers must keep the page header outside the white-body workspace instead of letting the title/header collapse into the body stack.`
    )
  }

  if (expectsStatSection && statSectionIndex >= 0 && whiteBodyIndex >= 0 && statSectionIndex < whiteBodyIndex) {
    errors.push(
      `${pathLabel} renders the stat-section before the white-body region on a strict project-certified table-stat carrier. table-stat carriers must keep stat cards inside the shared white-body workspace instead of floating them above it.`
    )
  }

  if (expectsStatSection && statSectionIndex >= 0 && queryFilterIndex >= 0 && statSectionIndex > queryFilterIndex) {
    errors.push(
      `${pathLabel} places the managed stat-section after the query-filter region inside the project-certified carrier. table-stat carriers must keep the stat card section before QueryFilter so the page reads as “metrics -> filters -> table”.`
    )
  }

  if (queryFilterIndex >= 0 && tableIndex >= 0 && queryFilterIndex > tableIndex) {
    errors.push(
      `${pathLabel} places the managed query-filter region after the table region inside the project-certified carrier. strict rollout list carriers must keep QueryFilter before the table content.`
    )
  }

  if (expectsPaginationRegion && tableIndex >= 0 && paginationIndex >= 0 && tableIndex > paginationIndex) {
    errors.push(
      `${pathLabel} places the managed pagination region before the table region inside the project-certified carrier. strict rollout list carriers must keep pagination after the table body instead of inserting it into the middle of the white-body flow.`
    )
  }

  if (
    (expectsStatSection && statSectionIndex < 0) ||
    queryFilterIndex < 0 ||
    tableIndex < 0 ||
    whiteBodyIndex < 0 ||
    (expectsPaginationRegion && paginationIndex < 0)
  ) {
    errors.push(
      `${pathLabel} does not expose the white-body/${expectsStatSection ? 'stat-section/' : ''}query-filter/table${expectsPaginationRegion ? '/pagination' : ''} marker chain on the strict project-certified ${pageTypeId} carrier. Rollout carriers must keep these regions machine-checkable instead of hiding them behind opaque wrappers.`
    )
  }

  if (pageTypeId === 'table-stat' && !hasApprovedStatSectionProof(sourceRaw)) {
    errors.push(
      `${pathLabel} routes table-stat through a project-certified carrier but does not prove a real stat card section. strict table-stat rollout requires StatOverviewGrid semantics or an explicit data-hiui5-stat-presentation="cards" marker instead of tabs, plain counts, or loose summary text.`
    )
  }

  if (pageTypeId === 'tree-table' && hasTreeSplitDriftSignals(sourceRaw)) {
    errors.push(
      `${pathLabel} routes tree-table through a project-certified carrier but drifts into left-tree/right-list split semantics. strict tree-table rollout must keep tree structure inside the single table region instead of exposing TreeSplitPageFrame, split-workspace, left-tree, or right-list markers.`
    )
  }

  if (pageTypeId === 'tree-table' && treeTableEnablesPaginationAutoHide(sourceRaw)) {
    errors.push(
      `${pathLabel} enables pagination autoHide on a strict project-certified tree-table rollout. Tree-table pagination must stay visible and machine-checkable instead of disappearing when the list becomes short or collapses to one page.`
    )
  }

  if (pageTypeId === 'tree-table' && !hasApprovedTreeTableInlineTreeProof(sourceRaw)) {
    errors.push(
      `${pathLabel} routes tree-table through a project-certified carrier but does not prove inline-tree semantics inside the table region. strict tree-table rollout requires a stable proof such as renderTreeTableTextEllipsis, treeSwitcherCol, expanded-row state, or an explicit data-hiui5-tree-table-presentation="inline-tree" marker instead of a plain list table pretending to be a tree table.`
    )
  }

  const projectCarrierOwnsHorizontalOverflow = [
    ...outerPaddingSnippets,
    ...whiteBodySnippets,
    ...mainScrollSnippets,
    ...tableRegionSnippets,
  ].some(hasHorizontalOverflowOwnerSignal)

  if (projectCarrierOwnsHorizontalOverflow) {
    errors.push(
      `${pathLabel} lets the project-certified table-basic carrier own horizontal scrolling at outer-padding/white-body/main-scroll/table region level. Keep horizontal overflow inside an inner table wrapper; the carrier itself must stay width-adaptive.`
    )
  }

  const queryFilterSnippets = collectQueryFilterOpenTagSnippets(sourceRaw)

  if (queryFilterSnippets.some(queryFilterSnippetForcesInlineLabels)) {
    errors.push(
      `${pathLabel} explicitly enables showLabel on inline QueryFilter inside the strict project-certified table-basic rollout. Typical list pages must keep QueryFilter on the no-label inline baseline instead of reintroducing a second row of external field labels.`
    )
  }

  if (queryFilterSnippets.some(queryFilterSnippetDriftsContainedAppearance)) {
    errors.push(
      `${pathLabel} overrides QueryFilter appearance away from the shared contained baseline inside the strict project-certified table-basic rollout. Keep inline QueryFilter on contained unless the page is explicitly moved out of the typical list contract.`
    )
  }

  if (queryFilterSnippets.some(queryFilterSnippetAddsAlwaysVisibleResetAction)) {
    errors.push(
      `${pathLabel} appends a plain reset/clear Button into inline QueryFilter during the strict project-certified table-basic rollout. Typical list pages should keep the default QueryFilter rhythm: no always-visible reset button in append, and clear only appears through the managed all-filter flow when values exist.`
    )
  }

  return errors
}

function validateProjectCertifiedCarrierFullPageEditBaseline({
  contract,
  sourceRaw,
  styleRaw,
  pathLabel,
}) {
  const errors = []

  if (
    !isProjectCertifiedCarrierDelivery(contract) ||
    String(contract?.pageTypeId || '').trim() !== 'full-page-edit'
  ) {
    return errors
  }

  const hasMachineCheckableHeaderCarrier = hasAnyPattern(sourceRaw, [
    /data-hiui5-region\s*=\s*['"]header['"]/,
    /<\s*(HostPageHeaderPortal|TypicalPageHeaderPortal|ManagedPageHeader)\b/,
  ])

  if (!hasMachineCheckableHeaderCarrier) {
    errors.push(
      `${pathLabel} routes full-page-edit through a project-certified carrier but does not expose a machine-checkable header carrier. strict full-page-edit rollout requires data-hiui5-region="header" or a recognized header portal so header ownership and 60px rhythm can be enforced before runtime.`
    )
  }

  const headerWrapperClassNames = [
    ...new Set([
      ...collectHeaderRegionClassNames(sourceRaw),
      ...collectLikelyPageHeaderWrapperClassNames(sourceRaw),
    ]),
  ]
  const headerWrapperSnippets = collectPreciseStyleBlocksForClassNames(styleRaw, headerWrapperClassNames)

  if (
    headerWrapperSnippets.length === 0 ||
    !headerWrapperSnippets.some(snippetKeepsHeader60pxBaseline)
  ) {
    errors.push(
      `${pathLabel} does not prove a 60px header baseline on the project-certified full-page-edit carrier. Carrier-owned header wrappers must keep min-height/height: 60px plus align-items: center instead of relying on accidental upstream defaults.`
    )
  } else if (headerWrapperSnippets.some(snippetDriftsHeader60pxBaseline)) {
    errors.push(
      `${pathLabel} lets the project-certified full-page-edit carrier drift away from the 60px header baseline. Keep carrier header wrappers fixed to 60px instead of 56/64px or content-driven heights.`
    )
  }

  const pageHeaderIndex = sourceRaw.search(/<PageHeader\b/)
  const whiteBodyIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]white-body['"]/)
  const formBodyIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]form-body['"]/)
  const footerIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]footer['"]/)
  const footerActionsIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]footer-actions['"]/)

  if (pageHeaderIndex >= 0 && whiteBodyIndex >= 0 && pageHeaderIndex > whiteBodyIndex) {
    errors.push(
      `${pathLabel} renders PageHeader after the white-body region on a strict project-certified full-page-edit carrier. Keep the shared header outside the white-body workspace instead of collapsing it into the form stack.`
    )
  }

  if (formBodyIndex >= 0 && footerIndex >= 0 && formBodyIndex > footerIndex) {
    errors.push(
      `${pathLabel} places the managed footer before the form-body region inside the project-certified carrier. full-page-edit carriers must keep form-body before footer so sticky actions stay at the bottom of the page shell.`
    )
  }

  if (footerIndex >= 0 && footerActionsIndex >= 0 && footerActionsIndex < footerIndex) {
    errors.push(
      `${pathLabel} places footer-actions before the footer region inside the project-certified carrier. full-page-edit carriers must keep footer-actions inside the managed footer region instead of floating action containers above it.`
    )
  }

  if (whiteBodyIndex < 0 || formBodyIndex < 0 || footerIndex < 0 || footerActionsIndex < 0) {
    errors.push(
      `${pathLabel} does not expose the white-body/form-body/footer/footer-actions marker chain on the strict project-certified full-page-edit carrier. Rollout carriers must keep these regions machine-checkable instead of hiding edit-shell ownership behind opaque wrappers.`
    )
  }

  return errors
}

function validateProjectCertifiedCarrierDrawerFormBaseline({
  contract,
  sourceRaw,
  styleRaw,
  pathLabel,
}) {
  const errors = []

  if (
    !isProjectCertifiedCarrierDelivery(contract) ||
    String(contract?.pageTypeId || '').trim() !== 'drawer-form'
  ) {
    return errors
  }

  const hasMachineCheckableHeaderCarrier = hasAnyPattern(sourceRaw, [
    /data-hiui5-region\s*=\s*['"]header['"]/,
    /<\s*(HostPageHeaderPortal|TypicalPageHeaderPortal|ManagedPageHeader)\b/,
  ])

  if (!hasMachineCheckableHeaderCarrier) {
    errors.push(
      `${pathLabel} routes drawer-form through a project-certified carrier but does not expose a machine-checkable header carrier. strict drawer-form rollout requires data-hiui5-region="header" or a recognized header portal so page-header ownership and 60px rhythm can be enforced before runtime.`
    )
  }

  const headerWrapperClassNames = [
    ...new Set([
      ...collectHeaderRegionClassNames(sourceRaw),
      ...collectLikelyPageHeaderWrapperClassNames(sourceRaw),
    ]),
  ]
  const headerWrapperSnippets = collectPreciseStyleBlocksForClassNames(styleRaw, headerWrapperClassNames)

  if (
    headerWrapperSnippets.length === 0 ||
    !headerWrapperSnippets.some(snippetKeepsHeader60pxBaseline)
  ) {
    errors.push(
      `${pathLabel} does not prove a 60px header baseline on the project-certified drawer-form carrier. Carrier-owned header wrappers must keep min-height/height: 60px plus align-items: center instead of relying on accidental upstream defaults.`
    )
  } else if (headerWrapperSnippets.some(snippetDriftsHeader60pxBaseline)) {
    errors.push(
      `${pathLabel} lets the project-certified drawer-form carrier drift away from the 60px header baseline. Keep carrier header wrappers fixed to 60px instead of 56/64px or content-driven heights.`
    )
  }

  const hasMachineCheckableDrawerShell = hasAnyPattern(sourceRaw, [
    /data-hiui5-shell\s*=\s*['"]ProFormDrawer['"]/,
    /data-hiui5-owner-drawer-shell\s*=\s*['"]true['"]/,
    /data-hiui5-region\s*=\s*['"]drawer-shell['"]/,
    /<\s*ProFormDrawer\b/,
  ])

  if (!hasMachineCheckableDrawerShell) {
    errors.push(
      `${pathLabel} routes drawer-form through a project-certified carrier but does not expose a machine-checkable drawer shell. strict drawer-form rollout requires data-hiui5-shell="ProFormDrawer", data-hiui5-owner-drawer-shell="true", or an equivalent governed drawer-shell marker before runtime.`
    )
  }

  const drawerBodyIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]drawer-body['"]/)
  const formBodyIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]form-body['"]/)
  const drawerFooterIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]drawer-footer['"]/)
  const footerActionsIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]footer-actions['"]/)

  if (
    drawerBodyIndex < 0 ||
    formBodyIndex < 0 ||
    drawerFooterIndex < 0 ||
    footerActionsIndex < 0
  ) {
    errors.push(
      `${pathLabel} does not expose the drawer-body/form-body/drawer-footer/footer-actions marker chain on the strict project-certified drawer-form carrier. Rollout carriers must keep these regions machine-checkable instead of hiding drawer shell ownership behind opaque wrappers.`
    )
  } else {
    if (formBodyIndex < drawerBodyIndex) {
      errors.push(
        `${pathLabel} places form-body before the drawer-body region inside the project-certified carrier. drawer-form carriers must keep form-body inside the managed drawer-body region instead of flattening body semantics into free-form wrappers.`
      )
    }

    if (drawerFooterIndex < formBodyIndex) {
      errors.push(
        `${pathLabel} places the managed drawer-footer before the form-body region inside the project-certified carrier. drawer-form carriers must keep form-body before drawer-footer so actions stay pinned to the bottom of the drawer shell.`
      )
    }

    if (footerActionsIndex < drawerFooterIndex) {
      errors.push(
        `${pathLabel} places footer-actions before the drawer-footer region inside the project-certified carrier. drawer-form carriers must keep footer-actions inside the managed drawer-footer region instead of floating action containers above it.`
      )
    }
  }

  return errors
}

function validateProjectCertifiedCarrierFullPageDetailBaseline({
  contract,
  sourceRaw,
  styleRaw,
  pathLabel,
}) {
  const errors = []

  if (
    !isProjectCertifiedCarrierDelivery(contract) ||
    String(contract?.pageTypeId || '').trim() !== 'full-page-detail'
  ) {
    return errors
  }

  const hasMachineCheckableHeaderCarrier = hasAnyPattern(sourceRaw, [
    /data-hiui5-region\s*=\s*['"]header['"]/,
    /<\s*(HostPageHeaderPortal|TypicalPageHeaderPortal|ManagedPageHeader)\b/,
  ])

  if (!hasMachineCheckableHeaderCarrier) {
    errors.push(
      `${pathLabel} routes full-page-detail through a project-certified carrier but does not expose a machine-checkable header carrier. strict full-page-detail rollout requires data-hiui5-region="header" or a recognized header portal so header ownership and 60px rhythm can be enforced before runtime.`
    )
  }

  const headerWrapperClassNames = [
    ...new Set([
      ...collectHeaderRegionClassNames(sourceRaw),
      ...collectLikelyPageHeaderWrapperClassNames(sourceRaw),
    ]),
  ]
  const headerWrapperSnippets = collectPreciseStyleBlocksForClassNames(styleRaw, headerWrapperClassNames)

  if (
    headerWrapperSnippets.length === 0 ||
    !headerWrapperSnippets.some(snippetKeepsHeader60pxBaseline)
  ) {
    errors.push(
      `${pathLabel} does not prove a 60px header baseline on the project-certified full-page-detail carrier. Carrier-owned header wrappers must keep min-height/height: 60px plus align-items: center instead of relying on accidental upstream defaults.`
    )
  } else if (headerWrapperSnippets.some(snippetDriftsHeader60pxBaseline)) {
    errors.push(
      `${pathLabel} lets the project-certified full-page-detail carrier drift away from the 60px header baseline. Keep carrier header wrappers fixed to 60px instead of 56/64px or content-driven heights.`
    )
  }

  const pageHeaderIndex = sourceRaw.search(/<PageHeader\b/)
  const whiteBodyIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]white-body['"]/)
  const detailBodyIndex = sourceRaw.search(/data-hiui5-region\s*=\s*['"]detail-body['"]/)

  if (pageHeaderIndex >= 0 && whiteBodyIndex >= 0 && pageHeaderIndex > whiteBodyIndex) {
    errors.push(
      `${pathLabel} renders PageHeader after the white-body region on a strict project-certified full-page-detail carrier. Keep the shared header outside the white-body workspace instead of collapsing it into the detail stack.`
    )
  }

  if (whiteBodyIndex < 0 || detailBodyIndex < 0) {
    errors.push(
      `${pathLabel} does not expose the white-body/detail-body marker chain on the strict project-certified full-page-detail carrier. Rollout carriers must keep these regions machine-checkable instead of hiding detail-shell ownership behind opaque wrappers.`
    )
  } else if (detailBodyIndex < whiteBodyIndex) {
    errors.push(
      `${pathLabel} places detail-body before the white-body region inside the project-certified carrier. full-page-detail carriers must keep detail-body inside the managed white-body workspace instead of flattening detail content into shell-adjacent wrappers.`
    )
  }

  return errors
}

function validateListLikeStructure({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const listLikeTypes = new Set(['table-basic', 'table-stat', 'data-visualization', 'tree-table'])
  const fixedWorkspaceListTypes = new Set(['table-basic', 'table-stat', 'tree-table'])
  const stickyPaginationPageTypes = new Set(['table-basic', 'table-stat', 'tree-table', 'tree-split'])
  const semanticContract = getManagedPageSemanticContract(contract)
  const outerPaddingSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'outer-padding')
  const whiteBodySnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'white-body')
  const mainScrollSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'main-scroll')
  const tableRegionSnippets = collectRegionStyleSnippets(sourceRaw, styleRaw, 'table')
  const pageHeaderClassNames = extractComponentClassNames(sourceRaw, 'PageHeader')
  const pageHeaderRootLayoutSnippets = collectStyleSnippetsForClassNames(
    styleRaw,
    pageHeaderClassNames
  ).filter(snippetOverridesPageHeaderRootLayout)
  const managedCardShellSnippets = collectLocalObjectSnippets(sourceRaw, [
    'statCard',
    'riskCard',
    'recordCard',
  ])
  const managedCardShellsMissingBorderBox = managedCardShellSnippets.filter(
    (snippet) => hasBackgroundOrRadiusSignal(snippet) && !hasBorderBoxSignal(snippet)
  )
  const managedResponsiveGridSnippets = collectLocalObjectSnippets(sourceRaw, [
    'statGrid',
    'riskGrid',
    'recordGrid',
  ]).filter(hasAutoFitGridTrackSignal)
  const managedResponsiveGridsMissingMinWidth = managedResponsiveGridSnippets.filter(
    (snippet) => !hasZeroMinInlineSizeSignal(snippet)
  )
  const riskMetricGridSnippets = collectLocalObjectSnippets(sourceRaw, ['riskMetricGrid'])
  const riskMetricGridUsesFixedThreeColumns = riskMetricGridSnippets.some((snippet) =>
    /(repeat\(\s*3\s*,|gridTemplateColumns\s*:\s*['"]repeat\(\s*3\s*,)/i.test(snippet)
  )

  if (!listLikeTypes.has(contract.pageTypeId)) {
    return errors
  }

  if (isCanonicalTableFramePage(contract) && !mountsRealShellRuntime(sourceRaw, 'TablePageFrame')) {
    if (rebuildsTableFrameSkeletonLocally(sourceRaw)) {
      errors.push(
        `${pathLabel} declares shell=TablePageFrame but rebuilds the frame locally from PageHeader/QueryFilter/Table. table-basic/tree-table pages must mount TablePageFrame directly, or move the full frame geometry into a named shared shell-carrier instead of page-local wrappers.`
      )
    }

    if (!hasCanonicalTableFrameBodyInset({ sourceRaw, styleRaw })) {
      errors.push(
        `${pathLabel} does not expose the TablePageFrame table-body horizontal inset contract. The table region/container must preserve the canonical table area padding (for example padding-inline: 20px or padding: 0 20px) so table columns do not touch the white-body edges.`
      )
    }
  }

  if (contract.pageTypeId === 'data-visualization' && contract.scrollStrategy !== 'page-scroll') {
    errors.push(
      `${pathLabel} declares scrollStrategy=${contract.scrollStrategy || '(missing)'} for data-visualization. Dashboard/workbench pages must keep page-scroll so charts and table remain in one continuous white-body reading flow.`
    )
  }

  if (
    fixedWorkspaceListTypes.has(contract.pageTypeId) &&
    contract.scrollStrategy !== 'table-body-scroll'
  ) {
    errors.push(
      `${pathLabel} declares scrollStrategy=${contract.scrollStrategy || '(missing)'} for ${contract.pageTypeId}. List/table pages must keep table-body-scroll so pagination and white-body height chain stay stable.`
    )
  }

  if (contract.pageTypeId === 'data-visualization' && contract.scrollStrategy === 'page-scroll') {
    const pageScrollSignals = inspectPageScrollWorkspace({ sourceRaw, styleRaw })

    if (pageScrollSignals.whiteBodyBlocksPageFlow) {
      errors.push(
        `${pathLabel} clips the white-body workspace with overflow hidden/auto on a page-scroll data-visualization page. The white-body must stay visually continuous through charts and table instead of becoming a clipping container.`
      )
    }

    if (pageScrollSignals.mainScrollCreatesNestedScroll) {
      errors.push(
        `${pathLabel} turns main-scroll into a nested scroll/clipping owner on a page-scroll data-visualization page. Let the route outlet own the page scroll instead of trapping the dashboard inside a secondary scroll container.`
      )
    }

    if (pageScrollSignals.tableRegionCreatesNestedScroll) {
      errors.push(
        `${pathLabel} gives the table region its own scroll/max-height constraints on a page-scroll data-visualization page. The detail table must remain in normal document flow below the filter region instead of becoming a nested scroll box.`
      )
    }

    if (pageScrollSignals.paginationKeepsStickyDock) {
      errors.push(
        `${pathLabel} keeps pagination bottom-docked on a page-scroll data-visualization page. Sticky bottom pagination belongs to table-body-scroll list pages, not dashboards with continuous page scrolling.`
      )
    }
  }

  const usesTableSemantics = /\b(Table|PageTable)\b/.test(sourceRaw)
  const usesPaginationSemantics = /\bPagination\b/.test(sourceRaw)
  const directTableUsesStriped = directTableUsesEnabledProp(sourceRaw, 'striped')
  const directTableUsesBordered = directTableUsesEnabledProp(sourceRaw, 'bordered')
  const usesStatusLikeTableSemantics = hasStatusLikeSemantics(sourceRaw)
  const hasStatusTagInheritance = hasApprovedStatusTagSemantics(sourceRaw)
  const usesCustomStatusPills = hasCustomStatusPillImplementation(sourceRaw, styleRaw)
  const usesCompoundTableCells = hasCompoundTableCellPresentation(sourceRaw)
  const allowsCompoundTableCells = hasApprovedCompoundTableCellMarker(sourceRaw)
  const wrapsActionCells = hasWrappedTableActionCells(sourceRaw)
  const hasMultiButtonActionCells = hasMultipleActionButtonsInSingleCell(sourceRaw)
  const usesPrimitiveFilterSemantics = hasAnyPattern(sourceRaw, [
    /\bInput\b/,
    /\bSelect\b/,
    /\bDatePicker\b/,
    /\bCascader\b/,
    /\bAutoComplete\b/,
    /\bCheckbox\b/,
    /\bRadio\b/,
  ])
  const usesQueryFilterCompatibleSemantics = hasQueryFilterCompatibleSemantics(sourceRaw)
  const usesDashboardDimensionSwitch = hasDashboardDimensionSwitchSemantics(sourceRaw)
  const allowsDashboardControlStripWithoutQueryFilter =
    contract.pageTypeId === 'data-visualization' &&
    semanticContract.queryFilterRegionRole === 'dashboard-control-strip' &&
    usesDashboardDimensionSwitch
  const usesListShellSemantics = hasAnyPattern(sourceRaw, [
    /\b(QueryFilter|SearchForm|TablePageFrame|StatListPageFrame|PageTable|ProListPageProvider)\b/,
    /\bTypicalPageFieldMapProvider\b/,
    /\bgetSearchFields\b/,
    /\bsearchConfig\b/,
  ])

  if (usesTableSemantics) {
    if (directTableUsesStriped) {
      errors.push(
        `${pathLabel} enables striped rows on a direct Table. Managed list/table shells must inherit the shared flat table baseline instead of reintroducing zebra-striping at page level.`
      )
    }

    if (directTableUsesBordered) {
      errors.push(
        `${pathLabel} enables bordered mode on a direct Table. Managed list/table shells must keep the shared borderless table baseline instead of adding page-local grid chrome.`
      )
    }

    const outerContainersOwnHorizontalOverflow = [
      ...outerPaddingSnippets,
      ...whiteBodySnippets,
      ...mainScrollSnippets,
    ].some(hasHorizontalOverflowOwnerSignal)

    if (outerContainersOwnHorizontalOverflow) {
      errors.push(
        `${pathLabel} lets outer workspace containers own horizontal scrolling around a managed table. Tables must fit the parent container first, and any horizontal scroll that remains must stay inside the table's own internal wrapper instead of white-body/main-scroll/page shells.`
      )
    }

    const tableRegionOwnsHorizontalOverflow = tableRegionSnippets.some(hasHorizontalOverflowOwnerSignal)
    if (tableRegionOwnsHorizontalOverflow) {
      errors.push(
        `${pathLabel} makes the managed table region itself the horizontal scroll owner. Keep horizontal overflow inside an inner table wrapper; the data-hiui5-region="table" container must stay width-adaptive to its parent.`
      )
    }

    const tableRegionUsesContentWidth = tableRegionSnippets.some(hasContentWidthEscapeSignal)
    if (tableRegionUsesContentWidth) {
      errors.push(
        `${pathLabel} sizes the managed table region by content width keywords such as max-content/min-content/fit-content. Business table regions must adapt to the parent container width instead of expanding the surrounding workspace.`
      )
    }

    if (usesStatusLikeTableSemantics && usesCustomStatusPills && !hasStatusTagInheritance) {
      errors.push(
        `${pathLabel} renders status/risk labels with page-local pill styles instead of Tag/shared status-renderer semantics. Managed pages must inherit risk/status presentation from shared components rather than hand-building colored spans.`
      )
    }

    if (usesCompoundTableCells && !allowsCompoundTableCells) {
      errors.push(
        `${pathLabel} renders compound table cells without an explicit approved marker. Default managed table columns keep one primary semantic per cell and stay single-line unless the contract explicitly approves a compound cell renderer.`
      )
    }

    if (wrapsActionCells) {
      errors.push(
        `${pathLabel} allows row-action cells to wrap. Managed table actions must stay single-line; if actions overflow, move secondary actions into a dropdown/menu instead of using flex-wrap.`
      )
    }

    if (hasMultiButtonActionCells) {
      errors.push(
        `${pathLabel} places multiple Buttons directly inside one row-action cell. Managed list/table pages default to one primary link action plus overflow affordances, not multi-button action stacks inside each row.`
      )
    }
  }

  const directQueryFilterKeywordInputSnippets = collectDirectQueryFilterKeywordInputSnippets(sourceRaw)
  const losesSearchInputSemantics =
    /\bQueryFilter\b/.test(sourceRaw) &&
    directQueryFilterKeywordInputSnippets.length > 0 &&
    directQueryFilterKeywordInputSnippets.some(
      (snippet) => !snippetKeepsSearchInputSemantics(snippet)
    )

  if (
    usesTableSemantics &&
    usesPaginationSemantics &&
    usesPrimitiveFilterSemantics &&
    !usesListShellSemantics &&
    contract.pageTypeId !== 'table-stat'
  ) {
    errors.push(
      `${pathLabel} rebuilds a list page from primitive filter controls + Table + Pagination without referencing a canonical list shell. This is the exact drift pattern that archetype generation is supposed to forbid.`
    )
  }

  if (
    contract.adapterContract?.requiredCapabilities?.includes('query-filter') &&
    semanticContract.queryFilterRegionRole !== 'dashboard-control-strip' &&
    !usesQueryFilterCompatibleSemantics &&
    !allowsDashboardControlStripWithoutQueryFilter
  ) {
    errors.push(
      `${pathLabel} declares a query-filter region but source does not reference QueryFilter or a recognized schema/list-search bridge. Typical list pages must keep QueryFilter semantics instead of hand-written filter bars.`
    )
  }

  if (
    usesPrimitiveFilterSemantics &&
    !usesQueryFilterCompatibleSemantics &&
    !(
      allowsDashboardControlStripWithoutQueryFilter &&
      !hasAnyPattern(sourceRaw, [
        /\bInput\b/,
        /\bSelect\b/,
        /\bDatePicker\b/,
        /\bCascader\b/,
        /\bAutoComplete\b/,
        /\bCheckbox\b/,
      ])
    )
  ) {
    errors.push(
      `${pathLabel} hand-builds its filter region from primitive Input/Select/DatePicker controls without QueryFilter-compatible semantics. Replace the raw filter bar with QueryFilter or a recognized host search shell.`
    )
  }

  if (
    contract.pageTypeId === 'data-visualization' &&
    semanticContract.queryFilterRegionRole === 'dashboard-control-strip' &&
    usesQueryFilterForDimensionSwitch(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} routes dashboard dimension/view switching through QueryFilter-style queryFields. In data-visualization pages, controls such as 日/周/月/年 must stay as Radio.Group/Tabs/Segmented control-strip semantics; reserve QueryFilter for real data filters above the detail table or chart filter strip.`
    )
  }

  if (
    contract.pageTypeId === 'data-visualization' &&
    semanticContract.queryFilterRegionRole === 'dashboard-control-strip' &&
    /\bQueryFilter\b/.test(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} still imports or renders QueryFilter even though semanticContract.queryFilterRegionRole=dashboard-control-strip. For data-visualization, the managed query-filter region defaults to a dashboard control strip; switch to Radio.Group/Tabs/Segmented, or explicitly rewrite the contract if this page truly promotes a detail-table QueryFilter into the managed region contract.`
    )
  }

  if (
    contract.pageTypeId === 'data-visualization' &&
    semanticContract.queryFilterRegionRole === 'dashboard-control-strip' &&
    !usesDashboardDimensionSwitch
  ) {
    errors.push(
      `${pathLabel} does not expose dashboard control-strip semantics for the managed query-filter region. Data-visualization pages must model this region as Radio.Group / Tabs / Segmented style view switching instead of leaving it structurally present but semantically ambiguous.`
    )
  }

  if (
    contract.pageTypeId === 'data-visualization' &&
    semanticContract.queryFilterRegionRole === 'dashboard-control-strip' &&
    hasDashboardControlFieldLabels(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} renders dashboard-control-strip filters with explicit field labels above Radio.Group/Select controls. This region is a control strip, not a form grid: segmented buttons stay unlabeled, and dropdown labels must be carried by the control itself instead of a second-row caption.`
    )
  }

  if (
    contract.pageTypeId === 'data-visualization' &&
    semanticContract.queryFilterRegionRole === 'table-query-filter' &&
    !usesQueryFilterCompatibleSemantics
  ) {
    errors.push(
      `${pathLabel} declares semanticContract.queryFilterRegionRole=table-query-filter but source does not keep QueryFilter-compatible semantics. Either restore a real QueryFilter bridge or switch the contract back to dashboard-control-strip.`
    )
  }

  if (
    contract.pageTypeId === 'data-visualization' &&
    semanticContract.listShellComposition === 'forbid-table-list-scaffold' &&
    hasAnyPattern(sourceRaw, [
      /\bProListPageProvider\b/,
      /\bTablePageFrame\b/,
      /\bsearchConfig\b/,
      /\bsearchPanelConfig\b/,
      /\bgetSearchFields\b/,
      /\bsearchSchema\b/,
    ])
  ) {
    errors.push(
      `${pathLabel} rebuilds data-visualization on top of list-page search/table scaffolding such as ProListPageProvider/TablePageFrame/searchConfig. Keep the dashboard on its own page-type shell so “指标卡 + 图表 + 明细表” does not degrade into a list page with charts appended above it.`
    )
  }

  if (
    contract.pageTypeId === 'data-visualization' &&
    contract.shell === 'StatListPageFrame' &&
    contract.archetypeMode !== 'host-integration' &&
    !mountsRealShellRuntime(sourceRaw, 'StatListPageFrame') &&
    !hasShellCarrierMarker(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} declares shell=StatListPageFrame but source does not mount the packaged shell and does not declare a shared shell-carrier inheritance marker. rules-only / legacy-host-compatible analytics pages must make runtime skeleton inheritance explicit instead of only copying page-type comments and region attrs.`
    )
  }

  if (hasUndeclaredHeaderSubtitle(sourceRaw)) {
    errors.push(
      `${pathLabel} adds subtitle/subTitle content to a list-page header even though the packaged list examples do not expose a subtitle row by default. Do not inject undeclared header copy.`
    )
  }

  if (hasBackIntent(sourceRaw) && usesRightActionBackIntent(sourceRaw)) {
    errors.push(
      `${pathLabel} routes the return action through right-side toolbar buttons instead of a PageHeader onBack affordance. If a list page exposes a return path, keep it on the real header-leading back button.`
    )
  }

  if (pageHeaderRootLayoutSnippets.length > 0) {
    errors.push(
      `${pathLabel} changes the PageHeader root into a local flex/grid layout carrier. Keep header docking on the canonical PageHeader content/title/extra rhythm, or move shell-level layout responsibility into the shared shell carrier instead of the page-local PageHeader root class.`
    )
  }

  if (fixedDashboardFrameOverridesShellChrome(sourceRaw)) {
    errors.push(
      `${pathLabel} overrides shared dashboard shell chrome through pageRootStyle/whiteBodyStyle or inline style-bearing props. Pages mounted on FixedDashboardPageFrame/ManagedWorkbenchPageFrame must inherit header/outer-padding/white-body geometry from the shared frame instead of redefining shell chrome at page level.`
    )
  }

  const usesCanonicalListShell =
    mountsRealShellRuntime(sourceRaw, 'TablePageFrame') ||
    mountsRealShellRuntime(sourceRaw, 'StatListPageFrame')

  if (!usesCanonicalListShell && !hasSupportedHeaderHeightBaseline(sourceRaw, styleRaw)) {
    errors.push(
      `${pathLabel} does not keep the list-page header on the 60px height baseline. Reuse the canonical PageHeader/header carrier rhythm instead of a custom taller title block.`
    )
  }

  if (!usesCanonicalListShell && !hasSupportedHeaderPaddingBaseline(sourceRaw, styleRaw)) {
    errors.push(
      `${pathLabel} does not normalize the PageHeader root padding back to the 60px shared header contract. Keep PageHeader root margin/padding reset in the shared header portal or in the explicit header carrier instead of letting the default 14px vertical inset stretch the shell.`
    )
  }

  if (!usesCanonicalListShell && !hasSupportedHeaderTitleBaseline(sourceRaw, styleRaw)) {
    errors.push(
      `${pathLabel} does not keep the list-page title on the 18px / 600 baseline. Header typography must stay aligned with the table-stat/table-basic example header.`
    )
  }

  if (
    contract.pageTypeId === 'data-visualization' &&
    managedCardShellsMissingBorderBox.length > 0
  ) {
    errors.push(
      `${pathLabel} defines local stat/risk/record card shells without boxSizing: border-box. In data-visualization pages, auto-fit cards must keep border-box sizing or the white-body width chain will be widened by card padding + border.`
    )
  }

  if (
    contract.pageTypeId === 'data-visualization' &&
    managedResponsiveGridsMissingMinWidth.length > 0
  ) {
    errors.push(
      `${pathLabel} mounts auto-fit stat/risk/record grids without minInlineSize/minWidth guards. Responsive grids in managed dashboards must keep minInlineSize: 0 so cards shrink inside the white-body instead of promoting overflow to ancestor shells.`
    )
  }

  if (
    contract.pageTypeId === 'data-visualization' &&
    riskMetricGridUsesFixedThreeColumns
  ) {
    errors.push(
      `${pathLabel} fixes risk metric blocks to repeat(3, ...) columns. Managed risk cards must keep responsive metrics instead of hard-coding three tracks, otherwise the card will reintroduce overlap/compression regressions in narrower shells.`
    )
  }

  if (losesSearchInputSemantics) {
    errors.push(
      `${pathLabel} uses direct QueryFilter filterFields but the keyword search field regresses to a plain Input. Keep the table-stat/list baseline search semantics with SearchInput/Search, or keep Input on QueryFilter's filled + search-icon affordance instead of a bare text box.`
    )
  }

  if (hasCustomQueryButtonInQueryFilter(sourceRaw)) {
    errors.push(
      `${pathLabel} adds a custom 查询/搜索 button into QueryFilter append actions. QueryFilter pages must rely on its built-in search semantics and should not append a second query button.`
    )
  }

  if (/全部筛选/.test(sourceRaw) && usesPlainButtonForAllFilters(sourceRaw)) {
    errors.push(
      `${pathLabel} renders “全部筛选” with a plain Button. Keep the trailing all-filter control on FilterButton semantics instead of a generic button so placement and count affordance stay aligned with the example.`
    )
  }

  const listWorkspaceSignals = keepsListWorkspaceHeightChain({ sourceRaw, styleRaw })
  const shouldApplyPureListWorkspaceRules = !isNonTypicalOverlayContract(contract)
  if (
    shouldApplyPureListWorkspaceRules &&
    fixedWorkspaceListTypes.has(contract.pageTypeId) &&
    !usesCanonicalListShell
  ) {
    if (
      !(
        listWorkspaceSignals.outerPaddingKeepsFlexColumn &&
        listWorkspaceSignals.whiteBodyKeepsFlexColumn &&
        listWorkspaceSignals.mainScrollKeepsScrollOwner &&
        listWorkspaceSignals.tableRegionKeepsFlexibleBody
      )
    ) {
      errors.push(
        `${pathLabel} does not keep the list-page height chain required by the white-body workspace. outer-padding, main-scroll, white-body, and table body must remain one flex column chain so the white-body extends to the bottom instead of collapsing to content height.`
      )
    }
  }

  if (
    shouldApplyPureListWorkspaceRules &&
    stickyPaginationPageTypes.has(contract.pageTypeId) &&
    !usesCanonicalListShell &&
    !listWorkspaceSignals.paginationKeepsStickyDock
  ) {
    errors.push(
      `${pathLabel} does not keep pagination bottom-docked inside the list workspace. Pagination must remain a sticky bottom sibling inside the white-body instead of drifting into normal document flow.`
    )
  }

  const whiteBodyUsesShadow = listWorkspaceSignals.whiteBodySnippets.some((snippet) =>
    /box-shadow\s*:/i.test(snippet)
  )
  if (whiteBodyUsesShadow) {
    errors.push(
      `${pathLabel} adds box-shadow to the main white-body workspace. Table-stat/list pages must keep a flat white-body instead of introducing an extra floating-card shadow.`
    )
  }

  if (
    (contract.pageTypeId === 'data-visualization' || contract.pageTypeId === 'table-stat') &&
    hasLooseTablePaginationSiblingPattern(sourceRaw) &&
    !/data-hiui5-table-shell\s*=\s*['"]joined['"]/.test(sourceRaw) &&
    !mountsRealShellRuntime(sourceRaw, 'StatListPageFrame')
  ) {
    errors.push(
      `${pathLabel} renders table and pagination as loose sibling regions without one table shell. Table content and pagination must stay inside the same shell/workspace footer chain instead of drifting into separate standalone blocks.`
    )
  }

  const operationActionButtonSnippets = collectOperationActionButtonSnippets(sourceRaw)
  const nonLinkActionButtons = operationActionButtonSnippets.filter(
    (snippet) => !snippetKeepsPrimaryLinkAction(snippet)
  )
  if (nonLinkActionButtons.length > 0) {
    errors.push(
      `${pathLabel} renders row actions with non-link button semantics. Default row actions in list pages must stay blue primary-link actions instead of line/default/black buttons.`
    )
  }

  if (contract.pageTypeId === 'table-stat' || contract.pageTypeId === 'data-visualization') {
    const usesCustomStatCardSignals = hasAnyPattern(sourceRaw, [
      /\bstatsGrid\b/,
      /\bstatGrid\b/,
      /\bstatCard\b/,
      /\bstatValue\b/,
      /\bstatLabel\b/,
      /\bstatusCountMap\b/,
    ])
    const usesApprovedCustomStatPresentation =
      usesCustomStatCardSignals &&
      hasLiteralAttr(sourceRaw, 'data-hiui5-stat-presentation', 'cards')
    const statCardSurfaceSnippets = collectStyleSnippets(styleRaw, [
      /\.statCard\b[\s\S]{0,240}\{/gi,
      /\.stat-card\b[\s\S]{0,240}\{/gi,
      /\.statsCard\b[\s\S]{0,240}\{/gi,
    ]).filter(hasBackgroundOrRadiusSignal)

    if (
      contract.pageTypeId === 'table-stat' &&
      !(
        /\bStatOverviewGrid\b/.test(sourceRaw) ||
        usesApprovedCustomStatPresentation ||
        usesCustomStatCardSignals
      )
    ) {
      errors.push(
        `${pathLabel} is declared as table-stat but source does not render a real stat card section. Tabs or plain counts are not an acceptable replacement for stat-section.`
      )
    }

    if (
      usesCustomStatCardSignals &&
      !/\bStatOverviewGrid\b/.test(sourceRaw) &&
      !usesApprovedCustomStatPresentation
    ) {
      errors.push(
        `${pathLabel} hand-builds stat cards without declaring an approved stat-section presentation. Custom legacy-host stat cards must be explicitly marked as data-hiui5-stat-presentation="cards" and remain inside the white-body workspace.`
      )
    }

    if (statCardSurfaceSnippets.length > 0 && !usesApprovedCustomStatPresentation) {
      errors.push(
        `${pathLabel} paints custom stat cards as independent surfaced blocks. Stats must stay inside one white-body workspace and follow the archetype stat-section semantics.`
      )
    }
  }

  if (contract.pageTypeId === 'tree-table') {
    if (/\bTreeSplitPageFrame\b/.test(sourceRaw) || hasLiteralAttr(sourceRaw, 'data-hiui5-region', 'left-tree')) {
      errors.push(
        `${pathLabel} mixes tree-split semantics into a tree-table page. Tree-table keeps tree semantics inside the table region instead of splitting into left-tree/right-list workspaces.`
      )
    }
  }

  return errors
}

function validateChartStackStructure({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const chartSignals = detectChartStackSignals({ contract, sourceRaw, styleRaw })

  if (!chartSignals.requiresChartStackCheck) {
    return errors
  }

  if (chartSignals.independentChartSectionSignals && !chartSignals.declaresChartRegion) {
    errors.push(
      `${pathLabel} renders an independent chart analysis block but neither the page contract nor the source declares data-hiui5-region="chart-section". Any hiui-design managed page may embed charts, but independent chart sections must be promoted into a managed chart-section so detail/list/dashboard variants stay machine-checkable consistently.`
    )
  }

  if (!(chartSignals.usesAntDesignCharts || chartSignals.usesApprovedChartWrapper)) {
    errors.push(
      `${pathLabel} contains chart-like content but does not import @ant-design/charts or declare an approved chart wrapper. Any hiui-design managed page with charts must stay on the formal chart stack instead of local CSS/div fallbacks.`
    )
  }

  if (chartSignals.usesHandRolledChartFallback) {
    errors.push(
      `${pathLabel} contains chart-like content but hand-builds visuals with svg/canvas/CSS primitives such as conic-gradient or custom trend bars. Managed pages must keep chart rendering on @ant-design/charts or an explicitly approved wrapper.`
    )
  }

  if (
    chartSignals.independentChartSectionSignals &&
    hasBareChartCardChildren(sourceRaw) &&
    !hasAdaptiveChartBodyMarkers(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} mounts Area/Line/Bar directly as bare ChartCard children without an adaptive chart-body carrier. Independent chart analysis blocks must keep chart cards machine-checkable through a dedicated chart body marker/container instead of treating charts as free-floating blocks.`
    )
  }

  return errors
}

function validateChartDesignBaseline({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const chartSignals = detectChartStackSignals({ contract, sourceRaw, styleRaw })

  if (!chartSignals.requiresChartStackCheck) {
    return errors
  }

  if (
    chartSignals.usesAntDesignCharts &&
    !chartSignals.usesApprovedChartWrapper &&
    !usesHiuiChartBaseline(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} renders charts without the shared HiUI chart baseline. Managed pages must wrap chart configs with withHiuiResponsiveChart/withHiuiMiniChart or an explicitly approved wrapper so theme, axis, legend, and tooltip tokens do not fall back to library defaults.`
    )
  }

  if (
    chartSignals.usesAntDesignCharts &&
    !chartSignals.usesApprovedChartWrapper &&
    !usesHiuiChartColorContract(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} renders charts without the shared HiUI color contract baseline. Managed pages must keep chart colors on the shared contract helpers/tokens so single-series, dual-series, categorical, and semantic-state colors do not drift with library defaults or data order.`
    )
  }

  if (chartSignals.usesAntDesignCharts && usesChartLabelAsColorValue(sourceRaw)) {
    errors.push(
      `${pathLabel} treats chart category labels as direct color values. Localized series/type/team/stage text must stay in colorField and scale.color.domain; bind actual hex slots through createHiuiCategoricalDomainScale, createHiuiColorScale, or resolveHiuiSeriesColor with canonical semantic keys instead of returning label text from color/fill/stroke callbacks.`
    )
  }

  if (
    mentionsColumnLikeChart(sourceRaw) &&
    !chartSignals.usesApprovedChartWrapper &&
    !usesColumnLikeChartHelper(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} contains column-like charts but does not reuse the shared column helper baseline. Column, stacked-column, grouped-column, and interval bars inside dual-axes must use createHiuiColumnLikeScale/createHiuiColumnLikeColorScale/withHiuiColumnLikeChart so the HiUI 1:2 band spacing is enforced consistently.`
    )
  }

  if (
    mentionsBarLikeChart(sourceRaw) &&
    !chartSignals.usesApprovedChartWrapper &&
    !usesBarLikeChartHelper(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} contains bar charts but does not reuse the shared bar helper baseline. Bar charts must use createHiuiBarLikeScale/createHiuiBarLikeColorScale/withHiuiBarLikeChart so the HiUI 1:1 width-gap ratio is enforced consistently.`
    )
  }

  if (
    mentionsAreaChart(sourceRaw) &&
    enablesAreaPointMarkers(sourceRaw) &&
    !hasApprovedAreaPointDeviation(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} enables point markers in an area chart without an explicit approved deviation. HiUI-managed area charts default to line/area only; if product or design requires points, record the approval in source before deviating.`
    )
  }

  if (mentionsAreaChart(sourceRaw)) {
    const fillOpacityValues = collectNumericPropertyValues(sourceRaw, 'fillOpacity')
    const hasNonCanonicalAreaFillOpacity = fillOpacityValues.some(
      (value) => Math.abs(value - 0.2) > 0.0001
    )

    if (hasNonCanonicalAreaFillOpacity) {
      errors.push(
        `${pathLabel} assigns non-canonical fillOpacity values to an area chart. Single-series HiUI area charts must keep fill opacity at 0.2 instead of scattering per-metric opacity variants.`
      )
    }

    if (/\bstroke\s*:/.test(sourceRaw) && !hasExplicitAreaFillBinding(sourceRaw)) {
      errors.push(
        `${pathLabel} styles an area-chart stroke but does not bind an explicit fill color. HiUI single-series area charts must keep stroke and fill on the same color token, with the fill expressed as that token at 20% opacity.`
      )
    }
  }

  if (contract.pageTypeId === 'data-visualization') {
    const compactCardRadiusValues = collectCompactCardRadiusValues(sourceRaw, styleRaw)
    const hasNonCanonicalCompactCardRadius = compactCardRadiusValues.some(
      (value) => Math.abs(value - 8) > 0.0001
    )

    if (hasNonCanonicalCompactCardRadius) {
      errors.push(
        `${pathLabel} drifts compact analytics cards away from the 8px radius baseline. In data-visualization pages, metric cards, chart cards, and other compact analysis cards must stay on the compact-card radius instead of expanding to 12/16px surfaces.`
      )
    }
  }

  return errors
}

function validateManagedShellComposition({ sourceRaw, styleRaw, pathLabel }) {
  const errors = []
  const usesManagedDetailShell = /\bManagedFullPageDetailShell\b/.test(sourceRaw)
  const usesManagedSplitShell = /\bManagedContextMainSplitShell\b/.test(sourceRaw)

  if (!usesManagedDetailShell && !usesManagedSplitShell) {
    return errors
  }

  const forbiddenOwnerAnchors = [
    'data-hiui5-owner-content-slot',
    'data-hiui5-owner-white-body',
    'data-hiui5-owner-outer-padding',
    'data-hiui5-owner-main-scroll',
  ]

  for (const anchor of forbiddenOwnerAnchors) {
    if (new RegExp(anchor).test(sourceRaw)) {
      errors.push(
        `${pathLabel} uses a managed shell but still declares ${anchor} in page-local source. Managed shells own workspace anchors; keep page entry/sections focused on business slots only.`
      )
    }
  }

  if (usesManagedDetailShell) {
    const forbiddenDetailRegions = ['white-body', 'header']
    for (const region of forbiddenDetailRegions) {
      if (new RegExp(`data-hiui5-region\\s*=\\s*["']${escapeRegExp(region)}["']`).test(sourceRaw)) {
        errors.push(
          `${pathLabel} mounts ManagedFullPageDetailShell but still declares data-hiui5-region="${region}" locally. The managed detail shell owns header and white-body regions.`
        )
      }
    }
  }

  if (usesManagedSplitShell) {
    const forbiddenSplitRegions = ['split-workspace', 'left-context', 'right-main']
    for (const region of forbiddenSplitRegions) {
      if (new RegExp(`data-hiui5-region\\s*=\\s*["']${escapeRegExp(region)}["']`).test(sourceRaw)) {
        errors.push(
          `${pathLabel} mounts ManagedContextMainSplitShell but still declares data-hiui5-region="${region}" locally. The managed split shell owns split-workspace and pane region anchors.`
        )
      }
    }

    if (/data-hiui5-resize-handle/.test(sourceRaw)) {
      errors.push(
        `${pathLabel} mounts ManagedContextMainSplitShell but still declares a local resize handle. Split resize behavior must stay inside the managed split shell.`
      )
    }
  }

  const forbiddenShellClassPatterns = [
    /\.pageRoot\b/,
    /\.workspace\b/,
    /\.whiteBody\b/i,
    /\.mainScroll\b/i,
    /\.leftPane\b/,
    /\.rightPane\b/,
    /\.splitHandle\b/,
  ]

  if (forbiddenShellClassPatterns.some((pattern) => pattern.test(styleRaw))) {
    errors.push(
      `${pathLabel} uses a managed shell but keeps page-local shell class names such as pageRoot/workspace/leftPane/rightPane/splitHandle. Move shell geometry back into the managed shell and keep local styles scoped to sections/cards only.`
    )
  }

  return errors
}

function validateTreeSplitStructure({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []

  if (contract.pageTypeId !== 'tree-split') {
    return errors
  }

  const mentionsTreeSemantics = hasAnyPattern(sourceRaw, [/\bTree\b/, /\btreeData\b/, /\bTreeSelect\b/])
  const mentionsListSemantics =
    /\b(Table|PageTable|Pagination)\b/.test(sourceRaw) ||
    (mountsRealShellRuntime(sourceRaw, 'TreeSplitPageFrame') && /\btableFields\s*=/.test(sourceRaw))

  if (!mentionsTreeSemantics) {
    errors.push(
      `${pathLabel} is declared as tree-split but source does not reference tree semantics. A split page without a real tree region is just a relabeled generic list page.`
    )
  }

  if (!mentionsListSemantics) {
    errors.push(
      `${pathLabel} is declared as tree-split but source does not reference list/table semantics on the right side.`
    )
  }

  if (mountsRealShellRuntime(sourceRaw, 'TreeSplitPageFrame')) {
    return errors
  }

  const outerPaddingSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'outer-padding')
  const whiteBodySnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'white-body')
  const mainScrollSnippets = collectOwnershipStyleSnippets(sourceRaw, styleRaw, 'main-scroll')
  const tableRegionSnippets = collectRegionStyleSnippets(sourceRaw, styleRaw, 'table')
  const bodySnippets = collectStyleSnippetsForClassNames(
    styleRaw,
    collectPrimaryBodyRegionClassNames(contract, sourceRaw),
    480
  )
  const splitWorkspaceSnippets = collectStyleSnippetsForClassNames(
    styleRaw,
    [
      'splitWorkspace',
      'split-workspace',
      'mainSplit',
      'main-split',
      'splitContainer',
      'split-container',
      'leftColumn',
      'left-column',
      'rightColumn',
      'right-column',
      'leftPane',
      'left-pane',
      'rightPane',
      'right-pane',
      'leftTree',
      'left-tree',
      'rightList',
      'right-list',
    ],
    480
  )
  const rightPaneSnippets = collectStyleSnippetsForClassNames(
    styleRaw,
    [
      'rightColumn',
      'right-column',
      'rightPane',
      'right-pane',
      'rightList',
      'right-list',
      'detailPane',
      'detail-pane',
      'contentPane',
      'content-pane',
      'primaryPane',
      'primary-pane',
      'mainPane',
      'main-pane',
    ],
    480
  )
  const splitTrackUsesHardMin =
    hasSplitRightTrackHardMinSignal(sourceRaw) ||
    splitWorkspaceSnippets.some(hasSplitRightTrackHardMinSignal)
  const splitHasZeroMinInlineSizeGuard = [
    ...outerPaddingSnippets,
    ...whiteBodySnippets,
    ...mainScrollSnippets,
    ...splitWorkspaceSnippets,
    ...rightPaneSnippets,
    ...bodySnippets,
  ].some(hasZeroMinInlineSizeSignal)
  const outerContainersOwnHorizontalOverflow = [
    ...outerPaddingSnippets,
    ...whiteBodySnippets,
    ...mainScrollSnippets,
  ].some(hasHorizontalOverflowOwnerSignal)

  if (splitTrackUsesHardMin) {
    errors.push(
      `${pathLabel} hard-codes a tree-split right track with minmax(<fixed>, 1fr). Split detail panes must stay elastic by default, using tracks such as minmax(0, 1fr) instead of forcing a hard right-pane minimum width.`
    )
  }

  if (!splitHasZeroMinInlineSizeGuard) {
    errors.push(
      `${pathLabel} declares tree-split without any min-inline-size: 0 / min-width: 0 safeguard on the elastic split chain. Split layouts must explicitly allow the right-side list/detail area to shrink with the parent container instead of stretching the whole workspace.`
    )
  }

  if (outerContainersOwnHorizontalOverflow) {
    errors.push(
      `${pathLabel} lets split workspace shells own horizontal scrolling. In tree-split pages, page/white-body/main-scroll containers must not become the horizontal overflow owner for the table area.`
    )
  }

  const tableRegionOwnsHorizontalOverflow = tableRegionSnippets.some(hasHorizontalOverflowOwnerSignal)
  if (tableRegionOwnsHorizontalOverflow) {
    errors.push(
      `${pathLabel} makes the managed table region the horizontal scroll owner inside tree-split. Keep horizontal overflow inside an inner table wrapper so the right pane itself stays width-adaptive and only the table content scrolls horizontally when needed.`
    )
  }

  return errors
}

function validateContextMainSplitStructure({ sourceRaw, pathLabel }) {
  const errors = []

  if (!declaresContextMainSplitLayout(sourceRaw)) {
    return errors
  }

  const usesProDetailPageShell =
    /\bProDetailPage\b/.test(sourceRaw) && /<ProDetailPage\b/.test(sourceRaw)
  const usesProEditPageShell =
    /\bProEditPage\b/.test(sourceRaw) && /<ProEditPage\b/.test(sourceRaw)
  const usesManualSplitShell = hasAnyPattern(sourceRaw, [
    /styles\.(workspace|splitWorkspace|mainSplit|splitContainer|leftPane|rightPane|splitHandle|splitter)\b/,
    /\b(leftPaneWidth|handleResizeStart|onResizeStart)\b/,
  ])
  const hasGovernedSplitShellEvidence =
    mountsRealContextMainSplitShell(sourceRaw) || hasShellCarrierMarker(sourceRaw)

  if (usesProDetailPageShell || usesProEditPageShell) {
    errors.push(
      `${pathLabel} mounts ${usesProDetailPageShell ? 'ProDetailPage' : 'ProEditPage'} while declaring context-main-split. Complex right-pane content must stay inside a governed split carrier instead of replacing the page shell.`
    )
  }

  if (!hasGovernedSplitShellEvidence) {
    errors.push(
      usesManualSplitShell
        ? `${pathLabel} hand-builds a split-looking workspace/leftPane/rightPane shell without governed split-carrier evidence. Mount TreeSplitPageFrame/ContextMainSplitScaffold directly or declare shell-inheritance + shell-carrier markers for the host-translated split helper before business JSX starts.`
        : `${pathLabel} declares context-main-split but source neither mounts a governed split carrier nor exposes shell-inheritance/shell-carrier markers. Split pane selectors alone do not prove split-shell reuse.`
    )
  }

  return errors
}

function validateDrawerStructure({ contract, sourceRaw, styleRaw, pathLabel }) {
  const errors = []

  if (!['drawer-form', 'drawer-detail'].includes(contract.pageTypeId)) {
    return errors
  }

  const mentionsDrawerSemantics = hasAnyPattern(sourceRaw, [
    /\bDrawer\b/,
    /\bXMSDrawer\b/,
    /\bProFormDrawer\b/,
    /\bProDetailDrawer\b/,
  ])

  if (!mentionsDrawerSemantics) {
    errors.push(
      `${pathLabel} is declared as ${contract.pageTypeId} but source does not reference any drawer semantics. This usually means the page was rebuilt as a generic page container instead of one drawer shell.`
    )
  }

  if (
    contract.pageTypeId === 'drawer-detail' &&
    !/\b(Descriptions|SchemaDescriptionsBridge)\b/.test(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} is declared as drawer-detail but source does not reference detail semantics.`
    )
  }

  if (contract.pageTypeId === 'drawer-detail' && usesVerticalDetailDescriptions(sourceRaw) && hasFixedDescriptionsLabelWidth(sourceRaw)) {
    errors.push(
      `${pathLabel} hard-codes labelWidth on vertical drawer-detail Descriptions. Keep drawer-detail labels on auto width so text starts from the left edge instead of appearing centered inside a fixed label box.`
    )
  }

  if (
    contract.pageTypeId === 'drawer-detail' &&
    usesVerticalDetailDescriptions(sourceRaw) &&
    !hasLeftDescriptionsLabelPlacement(sourceRaw)
  ) {
    errors.push(
      `${pathLabel} does not explicitly freeze drawer-detail labelPlacement to left. Drawer detail fields must keep a deterministic left reading edge instead of inheriting implicit defaults.`
    )
  }

  if (
    contract.pageTypeId === 'drawer-form' &&
    !hasAnyPattern(sourceRaw, [/\bForm\b/, /\bSchemaForm\b/, /\bFormItem\b/, /\bTextarea\b/])
  ) {
    errors.push(
      `${pathLabel} is declared as drawer-form but source does not reference form semantics.`
    )
  }

  if (contract.pageTypeId === 'drawer-form') {
    if (/\bDivider\b/.test(sourceRaw)) {
      errors.push(
        `${pathLabel} introduces Divider semantics inside drawer-form. Group separation in drawer-form should stay within the packaged drawer-form rhythm instead of adding Divider rows.`
      )
    }

    const footerRegionClassNames = extractLiteralClassNamesForAttr(
      sourceRaw,
      'data-hiui5-region',
      'drawer-footer'
    )
    const footerActionRegionClassNames = extractLiteralClassNamesForAttr(
      sourceRaw,
      'data-hiui5-region',
      'footer-actions'
    )
    const footerSnippets = collectStyleSnippetsForClassNames(styleRaw, [
      ...footerRegionClassNames,
      ...footerActionRegionClassNames,
    ])
    const footerActionsRightAligned = footerSnippets.some((snippet) =>
      /justify-content\s*:\s*flex-end/i.test(snippet)
    )
    const footerStillDivided = /hi-v5-drawer__footer--divided/.test(sourceRaw)
    const footerUsesShadow = footerSnippets.some((snippet) => /box-shadow\s*:/i.test(snippet))

    if (footerSnippets.length > 0 && !footerActionsRightAligned) {
      errors.push(
        `${pathLabel} defines drawer-form footer actions that are not right-aligned. Keep primary actions on the right edge of the drawer footer region.`
      )
    }

    if (footerStillDivided || footerUsesShadow) {
      errors.push(
        `${pathLabel} keeps divided/shadowed drawer footer treatment in drawer-form. Remove drawer footer top-line/shadow treatment and keep the packaged flat footer rhythm.`
      )
    }
  }

  return errors
}

function validateFeedbackStatusStructure({ contract, sourceRaw, pathLabel }) {
  const errors = []

  if (contract.pageTypeId !== 'feedback-status') {
    return errors
  }

  const mentionsFeedbackSemantics = hasAnyPattern(sourceRaw, [
    /\bEmptyState\b/,
    /\bResult\b/,
    /\bException\b/,
    /\bFeedbackStatePanel\b/,
  ])

  if (!mentionsFeedbackSemantics) {
    errors.push(
      `${pathLabel} is declared as feedback-status but source does not reference empty / result / feedback semantics.`
    )
  }

  if (hasAnyPattern(sourceRaw, [/<\s*Table\b/, /<\s*Descriptions\b/, /<\s*Form\b/])) {
    errors.push(
      `${pathLabel} mixes list/detail/form semantics into a feedback-status page. Feedback pages should not reuse list, detail, or form shells as their primary surface.`
    )
  }

  return errors
}

function validateDemoToolingIsolation({ sourceRaw, pathLabel }) {
  const errors = []
  const demoToolingPatterns = [
    /\bPromptCopyFloatingButton\b/,
    /prompt-copy-floating-button/,
    /\btypicalExamplePrompts\b/,
    /\bexamplePrompt\s*[:=]/,
  ]

  if (hasAnyPattern(sourceRaw, demoToolingPatterns)) {
    errors.push(
      `${pathLabel} includes demo prompt-copy tooling. PromptCopyFloatingButton/examplePrompt belongs to the host-integration example gallery only and must not be copied into generated typical pages.`
    )
  }

  return errors
}

export function renderManagedPageSourceContractSnippet(contract) {
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const regionAttrs = getManagedPageSourceRegionAttributes(contract)
  const ownerAttrs = getManagedPageSourceOwnershipAttributes(contract)
  const lines = [
    '<>',
    '{/* source contract markers */}',
    ...commentLines.map((line) => `{/* ${line} */}`),
    '<div',
    ...rootAttrs.map((attr) => `  ${attr.name}="${attr.value}"`),
    '>',
  ]

  if (regionAttrs.length > 0) {
    lines.push('  {/* required region anchors */}')
    regionAttrs.forEach((attr) => {
      lines.push(`  <div ${attr.name}="${attr.value}">`)
      lines.push(`    {/* ${attr.value} content */}`)
      lines.push('  </div>')
    })
  }

  if (ownerAttrs.length > 0) {
    lines.push('  {/* required ownership anchors */}')
    ownerAttrs.forEach((attr) => {
      lines.push(`  <div ${attr.name}="${attr.value}">`)
      lines.push(`    {/* ${attr.role} workspace wrapper */}`)
      lines.push('  </div>')
    })
  }

  lines.push('</div>')
  lines.push('</>')
  return lines.join('\n')
}

export function validateManagedPageSource({ contract, generatedPagePath, targetRoot }) {
  const sourceAbsPath = path.join(targetRoot, generatedPagePath)
  const sourceRaw = readTextIfExists(sourceAbsPath)
  const pathLabel = path.relative(targetRoot, sourceAbsPath) || generatedPagePath

  if (!sourceRaw) {
    return [`${pathLabel} does not exist or cannot be read.`]
  }

  const importedLocalContext = collectImportedLocalContext({
    entryFilePath: sourceAbsPath,
    targetRoot,
  })
  const extendedSourceRaw = importedLocalContext.sourceRaw || sourceRaw
  const extendedStyleRaw = importedLocalContext.styleRaw || readImportedStyleSources(sourceAbsPath, sourceRaw)

  if (isLegacyPageComponentFastPathContract(contract)) {
    return [
      ...validateLegacyPageComponentFastPathSource({
        contract,
        sourceRaw: extendedSourceRaw,
        pathLabel,
      }),
      ...validateProjectCertifiedCarrierListBaseline({
        contract,
        sourceRaw: extendedSourceRaw,
        styleRaw: extendedStyleRaw,
        pathLabel,
      }),
      ...validateProjectCertifiedCarrierFullPageEditBaseline({
        contract,
        sourceRaw: extendedSourceRaw,
        styleRaw: extendedStyleRaw,
        pathLabel,
      }),
      ...validateProjectCertifiedCarrierDrawerFormBaseline({
        contract,
        sourceRaw: extendedSourceRaw,
        styleRaw: extendedStyleRaw,
        pathLabel,
      }),
      ...validateProjectCertifiedCarrierFullPageDetailBaseline({
        contract,
        sourceRaw: extendedSourceRaw,
        styleRaw: extendedStyleRaw,
        pathLabel,
      }),
      ...validateManagedPageSlotBoundary({
        contract,
        sourceRaw: extendedSourceRaw,
        pathLabel,
      }),
      ...validateDemoToolingIsolation({ sourceRaw: extendedSourceRaw, pathLabel }),
    ]
  }

  return [
    ...validateCommonSourceContract({ contract, sourceRaw, pathLabel }),
    ...validateDeclaredShellAuthenticity({ contract, sourceRaw: extendedSourceRaw, pathLabel }),
    ...validateManagedShellComposition({
      sourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateNamedHostAdapterTranslation({
      contract,
      sourceRaw: extendedSourceRaw,
      targetRoot,
      pathLabel,
    }),
    ...validateRequiredCapabilities({ contract, sourceRaw: extendedSourceRaw, pathLabel }),
    ...validateCriticalRegionProof({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateLocalBypassContracts({
      contract,
      sourceRaw,
      importedLocalContext,
      targetRoot,
      pathLabel,
    }),
    ...validateI18nBaseline({ sourceRaw: extendedSourceRaw, styleRaw: extendedStyleRaw, pathLabel }),
    ...validateCommonComponentSkeletonIntegrity({
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateWorkspaceChromeOwnership({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateRootChromeOwnership({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateNestedSpacingOwnership({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateHeaderBodyGapBaseline({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validatePageLocalHeaderCarrier({
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateNonTypicalStrategyProof({ contract, sourceRaw: extendedSourceRaw, pathLabel }),
    ...validateHeaderPortalStructure({ sourceRaw: extendedSourceRaw, pathLabel }),
    ...validateHeaderShellCarriers({ sourceRaw: extendedSourceRaw, pathLabel }),
    ...validateQueryFilterFieldMapSupport({ sourceRaw: extendedSourceRaw, pathLabel }),
    ...validateProjectCertifiedCarrierListBaseline({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateProjectCertifiedCarrierFullPageEditBaseline({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateProjectCertifiedCarrierDrawerFormBaseline({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateProjectCertifiedCarrierFullPageDetailBaseline({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateListLikeStructure({ contract, sourceRaw: extendedSourceRaw, styleRaw: extendedStyleRaw, pathLabel }),
    ...validateChartStackStructure({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateChartDesignBaseline({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateContextMainSplitStructure({
      sourceRaw: extendedSourceRaw,
      pathLabel,
    }),
    ...validateTreeSplitStructure({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateDrawerStructure({ contract, sourceRaw: extendedSourceRaw, styleRaw: extendedStyleRaw, pathLabel }),
    ...validateFeedbackStatusStructure({ contract, sourceRaw: extendedSourceRaw, pathLabel }),
    ...validateDemoToolingIsolation({ sourceRaw: extendedSourceRaw, pathLabel }),
    ...validateFullPageEditStructure({ contract, sourceRaw: extendedSourceRaw, styleRaw: extendedStyleRaw, pathLabel }),
    ...validateFullPageEditFormSpacingOwnership({
      contract,
      sourceRaw: extendedSourceRaw,
      styleRaw: extendedStyleRaw,
      pathLabel,
    }),
    ...validateFullPageDetailStructure({ contract, sourceRaw: extendedSourceRaw, styleRaw: extendedStyleRaw, pathLabel }),
    ...validateFullPageDetailSingleShell({ contract, sourceRaw, styleRaw: extendedStyleRaw, pathLabel }),
  ]
}
