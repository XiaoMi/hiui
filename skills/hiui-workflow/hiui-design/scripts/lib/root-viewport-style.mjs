import fs from 'node:fs/promises'
import path from 'node:path'

import { detectHostProfile } from './detect-host-profile.mjs'

const STYLE_FILE_PATTERN = /\.(css|scss|sass|less)$/i
const SOURCE_FILE_PATTERN = /\.[cm]?[jt]sx?$/i
const REMOTE_STYLE_SOURCE_PATTERN = /^(?:https?:)?\/\//i
const APP_ENTRY_CANDIDATES = [
  'src/main.tsx',
  'src/main.ts',
  'src/main.jsx',
  'src/main.js',
  'src/index.tsx',
  'src/index.ts',
  'src/index.jsx',
  'src/index.js',
  'src/application.tsx',
  'src/application.ts',
  'src/application.jsx',
  'src/application.js',
  'src/app.tsx',
  'src/app.ts',
  'src/app.jsx',
  'src/app.js',
  'pages/_app.tsx',
  'pages/_app.ts',
  'src/pages/_app.tsx',
  'src/pages/_app.ts',
  'app/layout.tsx',
  'app/layout.ts',
  'src/app/layout.tsx',
  'src/app/layout.ts',
]
const SOURCE_RESOLUTION_EXTENSIONS = [
  '.tsx',
  '.ts',
  '.jsx',
  '.js',
  '.mts',
  '.cts',
  '.mjs',
  '.cjs',
]
const STYLE_RESOLUTION_EXTENSIONS = ['.css', '.scss', '.sass', '.less']
const ROOT_VIEWPORT_CONTAINER_SELECTORS = ['#root', '#app', '#__next']
const GLOBAL_TYPOGRAPHY_SELECTORS = [':root', 'html', 'body', ...ROOT_VIEWPORT_CONTAINER_SELECTORS]
const STARTER_SHELL_COMPONENT_CANDIDATES = [
  'src/App.tsx',
  'src/App.ts',
  'src/App.jsx',
  'src/App.js',
  'src/app.tsx',
  'src/app.ts',
  'src/app.jsx',
  'src/app.js',
]

function normalizeImportSpecifier(specifier = '') {
  return String(specifier || '')
    .trim()
    .replace(/[?#].*$/, '')
    .replace(/^~/, '')
}

function isStyleImportSpecifier(specifier = '') {
  return STYLE_FILE_PATTERN.test(normalizeImportSpecifier(specifier))
}

function isNodeModulesPath(filePath = '') {
  return String(filePath || '').includes(`${path.sep}node_modules${path.sep}`)
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function collectStyleFiles(rootDir) {
  if (!(await pathExists(rootDir))) return []

  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectStyleFiles(absolutePath)))
      continue
    }

    if (entry.isFile() && STYLE_FILE_PATTERN.test(entry.name)) {
      files.push(absolutePath)
    }
  }

  return files.sort()
}

function parsePackageSpecifier(specifier = '') {
  const normalizedSpecifier = normalizeImportSpecifier(specifier)
  if (!normalizedSpecifier || normalizedSpecifier.startsWith('.') || normalizedSpecifier.startsWith('/')) {
    return null
  }
  if (normalizedSpecifier.startsWith('@/') || normalizedSpecifier.startsWith('~/')) {
    return null
  }

  const segments = normalizedSpecifier.split('/').filter(Boolean)
  if (segments.length === 0) return null

  if (normalizedSpecifier.startsWith('@')) {
    if (segments.length < 2) return null
    return {
      packageName: segments.slice(0, 2).join('/'),
      subpath: segments.slice(2).join('/'),
    }
  }

  return {
    packageName: segments[0],
    subpath: segments.slice(1).join('/'),
  }
}

function extractPackageExportTarget(entry) {
  if (typeof entry === 'string' && entry.trim()) {
    return entry.trim()
  }

  if (Array.isArray(entry)) {
    for (const item of entry) {
      const candidate = extractPackageExportTarget(item)
      if (candidate) return candidate
    }
    return ''
  }

  if (!entry || typeof entry !== 'object') {
    return ''
  }

  for (const key of ['style', 'browser', 'import', 'default', 'module', 'require']) {
    const candidate = extractPackageExportTarget(entry[key])
    if (candidate) return candidate
  }

  for (const value of Object.values(entry)) {
    const candidate = extractPackageExportTarget(value)
    if (candidate) return candidate
  }

  return ''
}

async function resolvePackageExportStyleImport(specifier, targetRoot) {
  const parsed = parsePackageSpecifier(specifier)
  if (!parsed || !parsed.packageName || !parsed.subpath) return ''

  const packageRoot = path.join(targetRoot, 'node_modules', parsed.packageName)
  const packageJsonPath = path.join(packageRoot, 'package.json')
  if (!(await pathExists(packageJsonPath))) return ''

  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
    const exportKey = `./${parsed.subpath}`
    const exportedTarget = extractPackageExportTarget(packageJson?.exports?.[exportKey])
    if (!exportedTarget) return ''

    const resolvedPath = path.resolve(packageRoot, exportedTarget)
    return (await pathExists(resolvedPath)) ? resolvedPath : ''
  } catch {
    return ''
  }
}

function extractImportSpecifiers(source) {
  const patterns = [
    /(?:import|export)\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g,
    /import\s+['"]([^'"]+)['"]/g,
    /import\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]
  const specifiers = new Set()

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1]) specifiers.add(match[1])
    }
  }

  return [...specifiers]
}

function extractCssImportSpecifiers(source) {
  const patterns = [
    /@import\s+['"]([^'"]+)['"]/g,
    /@import\s+url\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]
  const specifiers = new Set()

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1]) specifiers.add(match[1])
    }
  }

  return [...specifiers]
}

async function detectAppEntryFile(targetRoot) {
  for (const candidate of APP_ENTRY_CANDIDATES) {
    const absolutePath = path.join(targetRoot, candidate)
    if (!(await pathExists(absolutePath))) continue
    return absolutePath
  }

  return ''
}

function resolveImportBase(fromFile, specifier, targetRoot) {
  const normalizedSpecifier = normalizeImportSpecifier(specifier)
  if (!normalizedSpecifier) return ''

  if (normalizedSpecifier.startsWith('.')) {
    return path.resolve(path.dirname(fromFile), normalizedSpecifier)
  }

  if (normalizedSpecifier.startsWith('@/') || normalizedSpecifier.startsWith('~/')) {
    return path.join(targetRoot, 'src', normalizedSpecifier.slice(2))
  }

  if (normalizedSpecifier.startsWith('/src/')) {
    return path.join(targetRoot, normalizedSpecifier.slice(1))
  }

  return ''
}

async function resolveImportPath(fromFile, specifier, extensions, targetRoot, allowIndex = true) {
  const resolvedBase = resolveImportBase(fromFile, specifier, targetRoot)
  if (!resolvedBase) return ''
  const candidates = new Set([resolvedBase])

  for (const extension of extensions) {
    candidates.add(`${resolvedBase}${extension}`)
  }

  if (allowIndex) {
    for (const extension of extensions) {
      candidates.add(path.join(resolvedBase, `index${extension}`))
    }
  }

  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate
  }

  return ''
}

async function resolveNonLocalStyleImport(specifier, targetRoot) {
  const normalizedSpecifier = normalizeImportSpecifier(specifier)
  if (!normalizedSpecifier) {
    return {
      resolvedPath: '',
      specifier: '',
      verifiable: false,
    }
  }

  if (REMOTE_STYLE_SOURCE_PATTERN.test(normalizedSpecifier) || normalizedSpecifier.startsWith('data:')) {
    return {
      resolvedPath: '',
      specifier: normalizedSpecifier,
      verifiable: false,
    }
  }

  const candidate = path.join(targetRoot, 'node_modules', normalizedSpecifier)
  if (await pathExists(candidate)) {
    return {
      resolvedPath: candidate,
      specifier: normalizedSpecifier,
      verifiable: true,
    }
  }

  const exportedCandidate = await resolvePackageExportStyleImport(normalizedSpecifier, targetRoot)
  if (exportedCandidate) {
    return {
      resolvedPath: exportedCandidate,
      specifier: normalizedSpecifier,
      verifiable: true,
    }
  }

  return {
    resolvedPath: '',
    specifier: normalizedSpecifier,
    verifiable: false,
  }
}

async function collectRuntimeStyleFiles({ entryFile, targetRoot }) {
  if (!entryFile) {
    return {
      entryFile: '',
      externalStyleImports: [],
      sourceFiles: [],
      styleFiles: [],
    }
  }

  const sourceQueue = [entryFile]
  const visitedSourceFiles = new Set()
  const styleQueue = []
  const visitedStyleFiles = new Set()
  const styleFiles = new Set()
  const externalStyleImports = new Map()

  while (sourceQueue.length > 0) {
    const currentFile = sourceQueue.shift()
    if (!currentFile || visitedSourceFiles.has(currentFile)) continue
    visitedSourceFiles.add(currentFile)

    const raw = await fs.readFile(currentFile, 'utf8')
    for (const specifier of extractImportSpecifiers(raw)) {
      if (isStyleImportSpecifier(specifier)) {
        const styleFile = await resolveImportPath(
          currentFile,
          specifier,
          STYLE_RESOLUTION_EXTENSIONS,
          targetRoot,
          false
        )
        if (styleFile && styleFile.startsWith(targetRoot) && !isNodeModulesPath(styleFile)) {
          styleFiles.add(styleFile)
          styleQueue.push(styleFile)
          continue
        }

        const externalStyleImport = await resolveNonLocalStyleImport(specifier, targetRoot)
        if (externalStyleImport.specifier) {
          const issueKey = `${currentFile}::${externalStyleImport.specifier}`
          externalStyleImports.set(issueKey, {
            filePath: currentFile,
            resolvedPath: externalStyleImport.resolvedPath,
            specifier: externalStyleImport.specifier,
            verifiable: externalStyleImport.verifiable,
          })
        }

        if (externalStyleImport.resolvedPath && !visitedStyleFiles.has(externalStyleImport.resolvedPath)) {
          styleFiles.add(externalStyleImport.resolvedPath)
          styleQueue.push(externalStyleImport.resolvedPath)
        }
        continue
      }

      const sourceFile = await resolveImportPath(
        currentFile,
        specifier,
        SOURCE_RESOLUTION_EXTENSIONS,
        targetRoot
      )
      if (sourceFile && sourceFile.startsWith(targetRoot) && SOURCE_FILE_PATTERN.test(sourceFile)) {
        sourceQueue.push(sourceFile)
      }
    }
  }

  while (styleQueue.length > 0) {
    const currentFile = styleQueue.shift()
    if (!currentFile || visitedStyleFiles.has(currentFile)) continue
    visitedStyleFiles.add(currentFile)

    const raw = await fs.readFile(currentFile, 'utf8')
    for (const specifier of extractCssImportSpecifiers(raw)) {
      const nestedStyleFile = await resolveImportPath(
        currentFile,
        specifier,
        STYLE_RESOLUTION_EXTENSIONS,
        targetRoot,
        false
      )
      if (nestedStyleFile && nestedStyleFile.startsWith(targetRoot) && !isNodeModulesPath(nestedStyleFile)) {
        styleFiles.add(nestedStyleFile)
        styleQueue.push(nestedStyleFile)
        continue
      }

      if (!isStyleImportSpecifier(specifier)) continue

      const externalStyleImport = await resolveNonLocalStyleImport(specifier, targetRoot)
      if (externalStyleImport.specifier) {
        const issueKey = `${currentFile}::${externalStyleImport.specifier}`
        externalStyleImports.set(issueKey, {
          filePath: currentFile,
          resolvedPath: externalStyleImport.resolvedPath,
          specifier: externalStyleImport.specifier,
          verifiable: externalStyleImport.verifiable,
        })
      }

      if (externalStyleImport.resolvedPath && !visitedStyleFiles.has(externalStyleImport.resolvedPath)) {
        styleFiles.add(externalStyleImport.resolvedPath)
        styleQueue.push(externalStyleImport.resolvedPath)
      }
    }
  }

  return {
    entryFile,
    externalStyleImports: [...externalStyleImports.values()].sort((left, right) =>
      `${left.filePath}:${left.specifier}`.localeCompare(`${right.filePath}:${right.specifier}`)
    ),
    sourceFiles: [...visitedSourceFiles].sort(),
    styleFiles: [...styleFiles].sort(),
  }
}

function collectSelectorBlocks(source, selector) {
  const blocks = []
  const pattern = /([^{}]+)\{([^{}]*)\}/g

  for (const match of source.matchAll(pattern)) {
    const selectorText = match[1] ?? ''
    if (!selectorListIncludes(selectorText, selector)) continue

    blocks.push({
      body: match[2] ?? '',
      end: match.index + match[0].length,
      full: match[0],
      selectorText,
      start: match.index,
    })
  }

  return blocks
}

function extractFirstDomNodeInfo(source = '') {
  const firstDomTagMatch = source.match(/<([a-z][\w-]*)([^>]*)>/)
  if (!firstDomTagMatch) {
    return {
      tagName: '',
      attrSource: '',
    }
  }

  const [, tagName = '', attrSource = ''] = firstDomTagMatch
  return {
    tagName: String(tagName || '').trim().toLowerCase(),
    attrSource,
  }
}

function extractDomNodeSelectors(tagName = '', attrSource = '') {
  const selectors = new Set()
  const normalizedTagName = String(tagName || '').trim().toLowerCase()
  if (normalizedTagName) selectors.add(normalizedTagName)

  const classNameMatch = String(attrSource || '').match(/className\s*=\s*["']([^"']+)["']/)
  if (classNameMatch?.[1]) {
    for (const token of classNameMatch[1].split(/\s+/).map((item) => item.trim()).filter(Boolean)) {
      selectors.add(`.${token}`)
    }
  }

  const idMatch = String(attrSource || '').match(/id\s*=\s*["']([^"']+)["']/)
  if (idMatch?.[1]) {
    selectors.add(`#${idMatch[1].trim()}`)
  }

  return [...selectors]
}

function selectorListIncludes(selectorText, selector) {
  return selectorText
    .split(',')
    .some((item) => item.trim() === selector)
}

function hasBodyCenteringBlock(blockBody) {
  const normalized = blockBody.toLowerCase()
  const hasFlexOrGrid =
    /display\s*:\s*(?:flex|grid)/.test(normalized)
  const hasCentering =
    /place-items\s*:\s*center/.test(normalized) ||
    /align-items\s*:\s*center/.test(normalized) ||
    /justify-content\s*:\s*center/.test(normalized)

  return hasFlexOrGrid && hasCentering
}

function normalizeDeclarationValue(line, property) {
  return line
    .replace(new RegExp(`^${property}\\s*:\\s*`), '')
    .replace(/;$/, '')
    .trim()
}

function extractDeclarationValues(blockBody, property) {
  const pattern = new RegExp(`(?:^|[;\\n\\r])\\s*${property}\\s*:\\s*([^;]+)`, 'gi')
  const values = []

  for (const match of String(blockBody || '').matchAll(pattern)) {
    const value = String(match[1] || '').trim()
    if (value) values.push(value)
  }

  return values
}

function normalizeCssValue(value = '') {
  return String(value || '').trim().toLowerCase().replace(/^['"]|['"]$/g, '')
}

function isNeutralLetterSpacingValue(value = '') {
  const normalized = normalizeCssValue(value)
  return (
    !normalized ||
    normalized === 'normal' ||
    normalized === '0' ||
    normalized === '0px' ||
    normalized === '0rem' ||
    normalized === '0em'
  )
}

function isNeutralFontShorthandValue(value = '') {
  const normalized = normalizeCssValue(value)
  if (!normalized) return true

  if (['inherit', 'initial', 'unset', 'revert', 'normal'].includes(normalized)) {
    return true
  }

  const sizeMatch = normalized.match(/(?:^|\s)(\d*\.?\d+(?:px|rem|em|%))(?:\s*\/\s*([^\s]+))?/)
  if (!sizeMatch) return false

  const fontSize = normalizeCssValue(sizeMatch[1])
  const lineHeight = normalizeCssValue(sizeMatch[2])
  const hasBaselineFontSize = fontSize === '14px'
  const hasBaselineLineHeight = !lineHeight || lineHeight === '22px' || lineHeight === 'normal'

  return hasBaselineFontSize && hasBaselineLineHeight
}

function isNeutralFontSizeValue(value = '') {
  const normalized = normalizeCssValue(value)
  if (!normalized) return true

  return (
    ['inherit', 'initial', 'unset', 'revert', 'normal'].includes(normalized) ||
    normalized === '14px' ||
    /^var\([^)]*14px[^)]*\)$/.test(normalized)
  )
}

function isNeutralLineHeightValue(value = '') {
  const normalized = normalizeCssValue(value)
  if (!normalized) return true

  return (
    ['inherit', 'initial', 'unset', 'revert', 'normal'].includes(normalized) ||
    normalized === '22px' ||
    /^var\([^)]*22px[^)]*\)$/.test(normalized)
  )
}

function collectTypographyPollutionReasons(blockBody) {
  const reasons = []

  if (extractDeclarationValues(blockBody, 'text-align').some((value) => normalizeCssValue(value) === 'center')) {
    reasons.push('text-align: center')
  }

  if (extractDeclarationValues(blockBody, 'font').some((value) => !isNeutralFontShorthandValue(value))) {
    reasons.push('font shorthand')
  }

  if (extractDeclarationValues(blockBody, 'font-size').some((value) => !isNeutralFontSizeValue(value))) {
    reasons.push('font-size')
  }

  if (extractDeclarationValues(blockBody, 'line-height').some((value) => !isNeutralLineHeightValue(value))) {
    reasons.push('line-height')
  }

  if (extractDeclarationValues(blockBody, 'letter-spacing').some((value) => !isNeutralLetterSpacingValue(value))) {
    reasons.push('non-default letter-spacing')
  }

  return reasons
}

function hasTypographyPollutionBlock(blockBody) {
  return collectTypographyPollutionReasons(blockBody).length > 0
}

function parseDeclarationLine(line = '') {
  const match = String(line || '').trim().match(/^([a-z-]+)\s*:\s*(.+?);?$/i)
  if (!match) return null

  return {
    property: String(match[1] || '').trim().toLowerCase(),
    value: String(match[2] || '').trim(),
  }
}

function shouldDropTypographyDeclaration(declaration) {
  if (!declaration?.property) return false

  switch (declaration.property) {
    case 'text-align':
      return normalizeCssValue(declaration.value) === 'center'
    case 'font':
      return !isNeutralFontShorthandValue(declaration.value)
    case 'font-size':
      return !isNeutralFontSizeValue(declaration.value)
    case 'line-height':
      return !isNeutralLineHeightValue(declaration.value)
    case 'letter-spacing':
      return !isNeutralLetterSpacingValue(declaration.value)
    default:
      return false
  }
}

function patchTypographyBlock(blockBody) {
  const lines = blockBody.split('\n')
  const nextLines = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      nextLines.push(line)
      continue
    }

    const declaration = parseDeclarationLine(trimmed)
    if (shouldDropTypographyDeclaration(declaration)) {
      continue
    }

    nextLines.push(line)
  }

  return nextLines.join('\n')
}

function isViewportFillingWidthValue(value = '') {
  const normalized = String(value || '').trim().toLowerCase()
  if (!normalized) return false

  return (
    normalized === '100%' ||
    normalized === '100vw' ||
    normalized === '100dvw' ||
    normalized === '100lvw' ||
    normalized === '100svw' ||
    normalized === 'stretch' ||
    normalized === 'auto' ||
    normalized === 'inherit' ||
    normalized === 'initial' ||
    normalized === 'unset'
  )
}

function hasConstrainedWidthDeclaration(blockBody) {
  return extractDeclarationValues(blockBody, 'width').some((value) => !isViewportFillingWidthValue(value))
}

function hasRootBoxingBlock(blockBody) {
  const normalized = blockBody.toLowerCase()
  const hasMaxWidth = /max-width\s*:/.test(normalized)
  const hasAutoMargin = /margin\s*:\s*0\s+auto/.test(normalized) || /margin-inline\s*:\s*auto/.test(normalized)
  const hasPadding = /padding\s*:/.test(normalized)
  const hasConstrainedWidth = hasConstrainedWidthDeclaration(blockBody)

  return hasMaxWidth || hasConstrainedWidth || (hasAutoMargin && hasPadding) || (hasMaxWidth && hasAutoMargin)
}

function extractStarterShellSelectors(source = '') {
  const { tagName, attrSource } = extractFirstDomNodeInfo(source)
  if (!tagName) return []
  return extractDomNodeSelectors(tagName, attrSource)
}

function extractInlineStyleSource(attrSource = '') {
  const match = String(attrSource || '').match(/style\s*=\s*\{\{([\s\S]*?)\}\}/)
  return String(match?.[1] || '').trim()
}

function extractInlineStyleMap(styleSource = '') {
  const styleMap = new Map()
  const pattern = /([A-Za-z_$][\w$]*)\s*:\s*([^,}]+)/g

  for (const match of String(styleSource || '').matchAll(pattern)) {
    const property = String(match[1] || '').trim()
    const value = String(match[2] || '').trim()
    if (!property || !value) continue
    styleMap.set(property, value)
  }

  return styleMap
}

function normalizeInlineStyleValue(value = '') {
  return String(value || '')
    .trim()
    .replace(/,$/, '')
    .replace(/^['"`]|['"`]$/g, '')
    .toLowerCase()
}

function inlineStyleMapHasPadding(styleMap) {
  return [
    'padding',
    'paddingInline',
    'paddingBlock',
    'paddingInlineStart',
    'paddingInlineEnd',
    'paddingBlockStart',
    'paddingBlockEnd',
  ].some((property) => styleMap.has(property))
}

function hasInlineRootBoxing(styleMap) {
  const width = normalizeInlineStyleValue(styleMap.get('width'))
  const maxWidth = normalizeInlineStyleValue(styleMap.get('maxWidth'))
  const margin = normalizeInlineStyleValue(styleMap.get('margin'))
  const marginInline = normalizeInlineStyleValue(styleMap.get('marginInline'))
  const hasConstrainedWidth = width && !isViewportFillingWidthValue(width)
  const hasMaxWidth = Boolean(maxWidth)
  const hasAutoMargin = margin.includes('auto') || marginInline.includes('auto')
  const hasPadding = inlineStyleMapHasPadding(styleMap)

  return hasConstrainedWidth || hasMaxWidth || (hasAutoMargin && hasPadding) || (hasMaxWidth && hasAutoMargin)
}

function collectInlineTypographyPollutionReasons(styleMap) {
  const reasons = []

  if (normalizeInlineStyleValue(styleMap.get('textAlign')) === 'center') {
    reasons.push('textAlign: center')
  }

  if (!isNeutralFontShorthandValue(normalizeInlineStyleValue(styleMap.get('font')))) {
    reasons.push('font shorthand')
  }

  if (!isNeutralFontSizeValue(normalizeInlineStyleValue(styleMap.get('fontSize')))) {
    reasons.push('fontSize')
  }

  if (!isNeutralLineHeightValue(normalizeInlineStyleValue(styleMap.get('lineHeight')))) {
    reasons.push('lineHeight')
  }

  if (!isNeutralLetterSpacingValue(normalizeInlineStyleValue(styleMap.get('letterSpacing')))) {
    reasons.push('non-default letterSpacing')
  }

  return reasons
}

function inspectStarterShellInlineStyle(styleSource, filePath, selector = 'starter shell root') {
  const styleMap = extractInlineStyleMap(styleSource)
  const issues = []

  if (hasInlineRootBoxing(styleMap)) {
    issues.push({
      detail: `${selector} uses constrained inline width/maxWidth/auto-margin/padding starter shell boxing, which keeps the first public app shell constrained instead of letting the typical page fill the viewport`,
      filePath,
      kind: 'starter-shell-boxing',
    })
  }

  const typographyReasons = collectInlineTypographyPollutionReasons(styleMap)
  if (typographyReasons.length > 0) {
    issues.push({
      detail: `${selector} applies inline ${typographyReasons.join(', ')} on the public shell baseline, which can leak typography pollution into the typical page shell`,
      filePath,
      kind: 'typography-pollution',
    })
  }

  return issues
}

function dedupeIssues(issues = []) {
  const seen = new Set()
  return issues.filter((issue) => {
    const key = `${issue.kind}::${issue.filePath}::${issue.detail}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function isRelevantInlineRootSelector(tagName, attrSource, starterShellSelectors = []) {
  const selectors = extractDomNodeSelectors(tagName, attrSource)
  const starterSelectorSet = new Set(starterShellSelectors)
  return selectors.some(
    (selector) =>
      selector === 'main' ||
      ROOT_VIEWPORT_CONTAINER_SELECTORS.includes(selector) ||
      starterSelectorSet.has(selector)
  )
}

function inspectReachableInlineRootStyles(source, filePath, starterShellSelectors = []) {
  const { tagName, attrSource } = extractFirstDomNodeInfo(source)
  if (!tagName || !isRelevantInlineRootSelector(tagName, attrSource, starterShellSelectors)) {
    return []
  }

  const inlineStyleSource = extractInlineStyleSource(attrSource)
  if (!inlineStyleSource) return []

  return inspectStarterShellInlineStyle(
    inlineStyleSource,
    filePath,
    extractDomNodeSelectors(tagName, attrSource)[0] || tagName || 'public shell root'
  )
}

function extractCssInJsBlocks(source = '') {
  const blocks = []
  const globalPatterns = [
    /\bcreateGlobalStyle(?:<[^`]+>)?\s*`([\s\S]*?)`/g,
    /\binjectGlobal\s*`([\s\S]*?)`/g,
    /\bcss\s*`([\s\S]*?)`/g,
  ]
  for (const pattern of globalPatterns) {
    for (const match of String(source || '').matchAll(pattern)) {
      const cssText = String(match[1] || '').trim()
      if (!cssText) continue
      blocks.push({
        cssText,
        kind: 'global',
        selectorLabel: 'CSS-in-JS global block',
      })
    }
  }

  const styledPattern =
    /(?:const|let|var)\s+([A-Z][\w$]*)\s*=\s*styled(?:\.([a-z][\w-]*)|\(\s*['"]([a-z][\w-]*)['"]\s*\))\s*`([\s\S]*?)`/g
  for (const match of String(source || '').matchAll(styledPattern)) {
    const componentName = String(match[1] || '').trim()
    const tagName = String(match[2] || match[3] || '').trim().toLowerCase()
    const cssText = String(match[4] || '').trim()
    if (!componentName || !tagName || !cssText) continue

    blocks.push({
      componentName,
      cssText,
      kind: 'styled',
      selectorLabel: componentName,
      tagName,
    })
  }

  return blocks
}

function inspectCssInJsSource(source, filePath, starterShellSelectors = []) {
  const issues = []

  for (const block of extractCssInJsBlocks(source)) {
    if (block.kind === 'global') {
      issues.push(
        ...inspectStyleSource(block.cssText, filePath, starterShellSelectors).map((issue) => ({
          ...issue,
          detail: `${issue.detail} (detected inside CSS-in-JS)`,
        }))
      )
      continue
    }

    const rootLikeStyledTag = ['main', 'div', 'section'].includes(block.tagName)
    const rootLikeComponentName =
      /(AppShell|ShellLayout|RootLayout|AppLayout|AppRoot|ShellRoot|PublicShell|HostShell)/.test(
        block.componentName
      )
    if (!rootLikeStyledTag || !rootLikeComponentName) continue

    if (hasRootBoxingBlock(block.cssText)) {
      issues.push({
        detail: `${block.selectorLabel} uses constrained width/max-width/auto-margin/padding starter shell boxing via CSS-in-JS, which keeps the first public app shell constrained instead of letting the typical page fill the viewport`,
        filePath,
        kind: 'starter-shell-boxing',
      })
    }

    const typographyReasons = collectTypographyPollutionReasons(block.cssText)
    if (typographyReasons.length > 0) {
      issues.push({
        detail: `${block.selectorLabel} sets ${typographyReasons.join(', ')} on the public shell baseline via CSS-in-JS, which can leak typography pollution into the typical page shell`,
        filePath,
        kind: 'typography-pollution',
      })
    }
  }

  return dedupeIssues(issues)
}

async function detectStarterShellInfo(targetRoot, hostProfile) {
  if (hostProfile?.projectType !== 'greenfield') {
    return {
      selectors: [],
      sourceFile: '',
      inlineStyleSource: '',
      rootTagName: '',
    }
  }

  for (const relativePath of STARTER_SHELL_COMPONENT_CANDIDATES) {
    const absolutePath = path.join(targetRoot, relativePath)
    if (!(await pathExists(absolutePath))) continue
    const raw = await fs.readFile(absolutePath, 'utf8')
    const { tagName, attrSource } = extractFirstDomNodeInfo(raw)
    if (!tagName) continue
    const selectors = extractStarterShellSelectors(raw)
    return {
      selectors,
      sourceFile: absolutePath,
      inlineStyleSource: extractInlineStyleSource(attrSource),
      rootTagName: tagName,
    }
  }

  return {
    selectors: [],
    sourceFile: '',
    inlineStyleSource: '',
    rootTagName: '',
  }
}

function patchBodyBlock(blockBody) {
  const lines = blockBody.split('\n')
  const nextLines = []
  let hasMargin = false
  let hasWidth = false
  let hasMinWidth = false
  let hasMinHeight = false

  for (const line of lines) {
    const trimmed = line.trim().toLowerCase()
    if (!trimmed) {
      nextLines.push(line)
      continue
    }

    if (shouldDropTypographyDeclaration(parseDeclarationLine(trimmed))) continue
    if (/^display\s*:/.test(trimmed) && /(flex|grid)/.test(trimmed)) continue
    if (/^place-items\s*:/.test(trimmed) && trimmed.includes('center')) continue
    if (/^align-items\s*:/.test(trimmed) && trimmed.includes('center')) continue
    if (/^justify-content\s*:/.test(trimmed) && trimmed.includes('center')) continue

    if (/^margin\s*:/.test(trimmed)) hasMargin = true
    if (/^width\s*:/.test(trimmed)) hasWidth = true
    if (/^min-width\s*:/.test(trimmed)) hasMinWidth = true
    if (/^min-height\s*:/.test(trimmed)) hasMinHeight = true

    nextLines.push(line)
  }

  const indent = lines.find((line) => line.trim())?.match(/^\s*/)?.[0] ?? '  '
  if (!hasMargin) nextLines.push(`${indent}margin: 0;`)
  if (!hasWidth) nextLines.push(`${indent}width: 100%;`)
  if (!hasMinWidth) nextLines.push(`${indent}min-width: 320px;`)
  if (!hasMinHeight) nextLines.push(`${indent}min-height: 100vh;`)

  return nextLines.join('\n')
}

function patchRootBlock(blockBody) {
  const lines = blockBody.split('\n')
  const nextLines = []
  let hasWidth = false
  let hasMinHeight = false

  for (const line of lines) {
    const trimmed = line.trim().toLowerCase()
    if (!trimmed) {
      nextLines.push(line)
      continue
    }

    if (shouldDropTypographyDeclaration(parseDeclarationLine(trimmed))) continue
    if (/^max-width\s*:/.test(trimmed)) continue
    if (/^margin\s*:/.test(trimmed) && trimmed.includes('auto')) continue
    if (/^margin-inline\s*:/.test(trimmed) && trimmed.includes('auto')) continue
    if (/^padding\s*:/.test(trimmed)) continue
    if (/^width\s*:/.test(trimmed) && !isViewportFillingWidthValue(normalizeDeclarationValue(trimmed, 'width'))) {
      continue
    }

    if (/^width\s*:/.test(trimmed)) hasWidth = true
    if (/^min-height\s*:/.test(trimmed)) hasMinHeight = true

    nextLines.push(line)
  }

  const indent = lines.find((line) => line.trim())?.match(/^\s*/)?.[0] ?? '  '
  if (!hasWidth) nextLines.push(`${indent}width: 100%;`)
  if (!hasMinHeight) nextLines.push(`${indent}min-height: 100vh;`)

  return nextLines.join('\n')
}

function patchCssSelectorBlocks(source, selector, blockPatcher, issuePredicate) {
  let changed = false
  const blocks = collectSelectorBlocks(source, selector)
  if (blocks.length === 0) {
    return { changed, nextSource: source }
  }

  let nextSource = source
  for (const block of [...blocks].reverse()) {
    if (!issuePredicate(block.body)) continue
    const patchedBody = blockPatcher(block.body)
    if (patchedBody === block.body) continue
    changed = true
    nextSource =
      nextSource.slice(0, block.start) +
      `${block.selectorText}{${patchedBody}}` +
      nextSource.slice(block.end)
  }

  return { changed, nextSource }
}

function inspectStyleSource(source, filePath, starterShellSelectors = []) {
  const issues = []
  for (const block of collectSelectorBlocks(source, 'body')) {
    if (hasBodyCenteringBlock(block.body)) {
      issues.push({
        detail: 'body uses centered flex/grid starter layout, which constrains the host shell viewport',
        filePath,
        kind: 'body-centering',
      })
      break
    }
  }

  for (const selector of ROOT_VIEWPORT_CONTAINER_SELECTORS) {
    for (const block of collectSelectorBlocks(source, selector)) {
      if (hasRootBoxingBlock(block.body)) {
        const detailReason = hasConstrainedWidthDeclaration(block.body)
          ? 'uses constrained width/max-width/auto-margin/padding root boxing'
          : 'uses max-width/auto-margin/padding starter boxing'
        issues.push({
          detail: `${selector} ${detailReason}, which keeps the host shell inside a boxed root container instead of letting it fill the viewport`,
          filePath,
          kind: 'root-boxing',
        })
        break
      }
    }
  }

  for (const selector of GLOBAL_TYPOGRAPHY_SELECTORS) {
    for (const block of collectSelectorBlocks(source, selector)) {
      const typographyReasons = collectTypographyPollutionReasons(block.body)
      if (typographyReasons.length === 0) continue

      issues.push({
        detail: `${selector} sets ${typographyReasons.join(', ')} on the public shell baseline, which can leak host typography into the typical page shell`,
        filePath,
        kind: 'typography-pollution',
      })
      break
    }
  }

  for (const selector of starterShellSelectors) {
    for (const block of collectSelectorBlocks(source, selector)) {
      if (hasRootBoxingBlock(block.body)) {
        issues.push({
          detail: `${selector} uses constrained width/max-width/auto-margin/padding starter shell boxing, which keeps the first public app shell constrained instead of letting the typical page fill the viewport`,
          filePath,
          kind: 'starter-shell-boxing',
        })
        break
      }

      const typographyReasons = collectTypographyPollutionReasons(block.body)
      if (typographyReasons.length > 0) {
        issues.push({
          detail: `${selector} sets ${typographyReasons.join(', ')} on the first public app shell baseline, which can leak typography pollution into the typical page shell`,
          filePath,
          kind: 'typography-pollution',
        })
        break
      }
    }
  }

  return issues
}

export async function inspectViewportRootStyles(targetRoot, options = {}) {
  const hostProfile =
    options?.hostProfile ||
    (await detectHostProfile(targetRoot, {
      ignoreRelativePaths: ['src/typical-page-preview'],
    }))
  const starterShellInfo = await detectStarterShellInfo(targetRoot, hostProfile)
  const starterShellSelectors = starterShellInfo.selectors
  const entryFile = await detectAppEntryFile(targetRoot)
  const runtimeStyles = await collectRuntimeStyleFiles({
    entryFile,
    targetRoot,
  })
  const styleFiles = runtimeStyles.styleFiles
  const issues = []

  for (const filePath of styleFiles) {
    const raw = await fs.readFile(filePath, 'utf8')
    issues.push(...inspectStyleSource(raw, filePath, starterShellSelectors))
  }

  for (const sourceFile of runtimeStyles.sourceFiles || []) {
    const raw = await fs.readFile(sourceFile, 'utf8')
    issues.push(...inspectReachableInlineRootStyles(raw, sourceFile, starterShellSelectors))
    issues.push(...inspectCssInJsSource(raw, sourceFile, starterShellSelectors))
  }

  for (const styleImport of runtimeStyles.externalStyleImports || []) {
    if (styleImport.verifiable || styleImport.resolvedPath) continue

    issues.push({
      detail: `${styleImport.specifier} is a non-local style source imported from ${path.relative(targetRoot, styleImport.filePath)} and could not be inspected for root baseline pollution; move it to a verifiable local or installed stylesheet before opening the hiui-design page-task gate`,
      filePath: styleImport.filePath,
      kind: 'unverifiable-public-shell',
    })
  }

  if (starterShellInfo.inlineStyleSource) {
    issues.push(
      ...inspectStarterShellInlineStyle(
        starterShellInfo.inlineStyleSource,
        starterShellInfo.sourceFile,
        starterShellSelectors[0] || starterShellInfo.rootTagName || 'starter shell root'
      )
    )
  }

  return {
    entryFile,
    externalStyleImports: runtimeStyles.externalStyleImports || [],
    starterShellSelectors,
    issues: dedupeIssues(issues),
    projectType: hostProfile.projectType || '',
    styleFiles,
  }
}

function summarizeIssues(targetRoot, issues) {
  return issues
    .map((issue) => `${path.relative(targetRoot, issue.filePath)} (${issue.kind})`)
    .join(', ')
}

async function writeViewportRootSnippet({ outputRoot, issues, targetRoot }) {
  const snippetPath = path.join(outputRoot, 'ROOT_VIEWPORT_STYLE_SNIPPET.md')
  const issueList = issues
    .map((issue) => `- ${path.relative(targetRoot, issue.filePath)}: ${issue.detail}`)
    .join('\n')

  const content = `# Root Viewport Style Snippet

Preview host shells must render directly against the viewport instead of staying inside a boxed starter root container.

## Detected blockers

${issueList}

## Apply these root layout rules

\`\`\`css
body {
  margin: 0;
  width: 100%;
  min-width: 320px;
  min-height: 100vh;
}

html {
  width: 100%;
  min-height: 100vh;
}

#root,
#app,
#__next {
  width: 100%;
  min-height: 100vh;
}
\`\`\`

## Remove these starter constraints

- \`body { display: flex; place-items: center; }\`
- \`body { justify-content: center; align-items: center; }\`
- \`#root { max-width: 1280px; margin: 0 auto; padding: 2rem; }\`
- \`#root { width: 1126px; }\`
- \`#app { max-width: 1280px; margin: 0 auto; padding: 2rem; }\`
- \`#app { width: 1126px; }\`
- \`#__next { max-width: 1280px; margin: 0 auto; padding: 2rem; }\`
- \`#__next { width: 1126px; }\`

## Keep the public typography baseline neutral

- Do not set \`font\` shorthand, \`font-size\`, \`line-height\`, non-default \`letter-spacing\`, or \`text-align: center\` on \`:root\`, \`html\`, \`body\`, \`#root\`, \`#app\`, \`#__next\`, or the first public app shell.
- Apply the same rule to CSS-in-JS global blocks, inline root styles, and external stylesheet imports on the entry path.
- If the entire page text grows or shrinks together, fix the host baseline or revert the public shell typography override instead of patching individual business pages.
`

  await fs.mkdir(path.dirname(snippetPath), { recursive: true })
  await fs.writeFile(snippetPath, content, 'utf8')
  return snippetPath
}

export async function patchViewportRootStyles({ targetRoot, outputRoot }) {
  const initial = await inspectViewportRootStyles(targetRoot)
  if (initial.issues.length === 0) {
    return {
      issueSummary: '',
      patchedFiles: [],
      snippetPath: '',
      status: 'already-compatible',
      styleFiles: initial.styleFiles,
    }
  }

  const filesToPatch = [...new Set(initial.issues.map((issue) => issue.filePath))].filter(
    (filePath) =>
      STYLE_FILE_PATTERN.test(filePath) &&
      filePath.startsWith(targetRoot) &&
      !isNodeModulesPath(filePath)
  )
  const patchedFiles = []

  for (const filePath of filesToPatch) {
    const raw = await fs.readFile(filePath, 'utf8')
    let nextSource = raw
    const bodyResult = patchCssSelectorBlocks(
      nextSource,
      'body',
      patchBodyBlock,
      (blockBody) => hasBodyCenteringBlock(blockBody) || hasTypographyPollutionBlock(blockBody)
    )
    nextSource = bodyResult.nextSource
    const rootTypographySelectors = [':root', 'html']
    for (const selector of rootTypographySelectors) {
      const typographyResult = patchCssSelectorBlocks(
        nextSource,
        selector,
        patchTypographyBlock,
        hasTypographyPollutionBlock
      )
      nextSource = typographyResult.nextSource
    }
    for (const selector of ROOT_VIEWPORT_CONTAINER_SELECTORS) {
      const rootResult = patchCssSelectorBlocks(
        nextSource,
        selector,
        patchRootBlock,
        (blockBody) => hasRootBoxingBlock(blockBody) || hasTypographyPollutionBlock(blockBody)
      )
      nextSource = rootResult.nextSource
    }
    for (const selector of initial.starterShellSelectors || []) {
      const shellResult = patchCssSelectorBlocks(
        nextSource,
        selector,
        patchRootBlock,
        (blockBody) => hasRootBoxingBlock(blockBody) || hasTypographyPollutionBlock(blockBody)
      )
      nextSource = shellResult.nextSource
    }

    if (nextSource !== raw) {
      await fs.writeFile(filePath, nextSource, 'utf8')
      patchedFiles.push(filePath)
    }
  }

  const nextInspection = await inspectViewportRootStyles(targetRoot)
  if (nextInspection.issues.length === 0) {
    return {
      issueSummary: '',
      patchedFiles,
      snippetPath: '',
      status: patchedFiles.length > 0 ? 'patched' : 'already-compatible',
      styleFiles: nextInspection.styleFiles,
    }
  }

  const snippetPath = await writeViewportRootSnippet({
    outputRoot,
    issues: nextInspection.issues,
    targetRoot,
  })

  return {
    issueSummary: summarizeIssues(targetRoot, nextInspection.issues),
    patchedFiles,
    snippetPath,
    status: 'snippet-only',
    styleFiles: nextInspection.styleFiles,
  }
}

export function formatViewportRootIssueDetail(targetRoot, issues) {
  if (issues.length === 0) {
    return 'No centered body starter layout or boxed root mount style was detected in the target project styles.'
  }

  return issues
    .map((issue) => `${path.relative(targetRoot, issue.filePath)}: ${issue.detail}`)
    .join(' ')
}
