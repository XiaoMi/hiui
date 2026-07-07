import crypto from 'node:crypto'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import {
  getManagedPageRuntimeSmokeRequirement,
  getRulesOnlyOutputRoot,
  getRulesOnlyPageContractsDir,
  renderRulesOnlyPageContractMarkdown,
} from './rules-only-page-contracts.mjs'

const LOCAL_SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']
const MANAGED_PAGE_SOURCE_ROOTS = ['src/views', 'src/pages']
const MANAGED_PAGE_SOURCE_MARKERS = Object.freeze([
  'hiui-design example alignment',
  'hiui-design page-type:',
  'hiui-design archetype:',
  'hiui-design shell:',
  'hiui-design example:',
  'hiui-design host-adapter:',
  'hiui-design host-archetype:',
  'hiui-design scroll-strategy:',
  'data-hiui5-scroll-strategy',
  'data-hiui5-host-adapter',
])

function readTextIfExists(targetPath) {
  if (!targetPath || !fs.existsSync(targetPath)) {
    return ''
  }

  return fs.readFileSync(targetPath, 'utf8')
}

function toPosixPath(targetPath) {
  return String(targetPath || '').split(path.sep).join('/')
}

export function normalizeContractPath(targetRoot, inputPath) {
  if (!inputPath) return ''
  const absolutePath = path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(targetRoot, inputPath)
  return toPosixPath(path.relative(targetRoot, absolutePath))
}

function collectManagedPageSourceFiles(targetRoot) {
  const files = []

  function walk(currentPath) {
    if (!fs.existsSync(currentPath)) {
      return
    }

    const stat = fs.statSync(currentPath)
    if (stat.isDirectory()) {
      fs.readdirSync(currentPath, { withFileTypes: true }).forEach((entry) => {
        walk(path.join(currentPath, entry.name))
      })
      return
    }

    const relativePath = normalizeContractPath(targetRoot, currentPath)
    if (!LOCAL_SOURCE_EXTENSIONS.includes(path.extname(currentPath).toLowerCase())) {
      return
    }

    const raw = readTextIfExists(currentPath)
    if (!raw) return
    if (!MANAGED_PAGE_SOURCE_MARKERS.some((marker) => raw.includes(marker))) {
      return
    }

    files.push({
      absolutePath: currentPath,
      relativePath,
      raw,
    })
  }

  MANAGED_PAGE_SOURCE_ROOTS.forEach((root) => {
    walk(path.join(targetRoot, root))
  })

  return files.sort((left, right) => left.relativePath.localeCompare(right.relativePath))
}

function readJsonFileSafe(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return {
      exists: false,
      data: null,
      error: '',
    }
  }

  try {
    return {
      exists: true,
      data: JSON.parse(fs.readFileSync(filePath, 'utf8')),
      error: '',
    }
  } catch (error) {
    return {
      exists: true,
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

async function readTextFileSafe(filePath) {
  try {
    return {
      exists: true,
      data: await fsp.readFile(filePath, 'utf8'),
      error: '',
    }
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      return {
        exists: false,
        data: '',
        error: '',
      }
    }

    return {
      exists: false,
      data: '',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

function normalizeRegistryEntry(entry) {
  return {
    generatedPagePath: String(entry?.generatedPagePath || '').trim(),
    pageTypeId: String(entry?.pageTypeId || '').trim(),
    pageTypeLabel: String(entry?.pageTypeLabel || '').trim(),
    examplePath: String(entry?.examplePath || '').trim(),
    hostArchetypePath: String(entry?.hostArchetypePath || '').trim(),
    archetypeId: String(entry?.archetypeId || '').trim(),
    hostAdapterId: String(entry?.hostAdapterId || '').trim(),
    scrollStrategy: String(entry?.scrollStrategy || '').trim(),
    workflowStatus: String(entry?.workflowStatus || '').trim(),
    preflightStatus: String(entry?.preflightStatus || '').trim(),
    sourceGateStatus: String(entry?.sourceGateStatus || '').trim(),
    doctorStatus: String(entry?.doctorStatus || '').trim(),
    runtimeSmokeRequired: Boolean(entry?.runtimeSmokeRequired),
    runtimeSmokeStatus: String(entry?.runtimeSmokeStatus || '').trim(),
    runtimeSmokeSnapshotHash: String(entry?.runtimeSmokeSnapshotHash || '').trim(),
    sourceSnapshotHash: String(entry?.sourceSnapshotHash || '').trim(),
    updatedAt: String(entry?.updatedAt || '').trim(),
  }
}

function normalizeBrokenRegistryEntry(entry) {
  return {
    path: String(entry?.path || '').trim(),
    error: String(entry?.error || '').trim(),
  }
}

function buildComparableRegistryPayload({ entries, brokenEntries }) {
  return {
    version: 1,
    count: Array.isArray(entries) ? entries.length : 0,
    entries: Array.isArray(entries) ? entries.map((entry) => normalizeRegistryEntry(entry)) : [],
    brokenEntries: Array.isArray(brokenEntries)
      ? brokenEntries.map((entry) => normalizeBrokenRegistryEntry(entry))
      : [],
  }
}

export function inspectManagedPageRegistry(targetRoot) {
  const contractsDir = getRulesOnlyPageContractsDir(targetRoot)
  const registryJsonPath = getManagedPagesRegistryJsonPath(targetRoot)
  const registryMarkdownPath = getManagedPagesRegistryMarkdownPath(targetRoot)
  const sourceFiles = collectManagedPageSourceFiles(targetRoot)
  const sourcePaths = sourceFiles.map((item) => item.relativePath)
  const sourcePathSet = new Set(sourcePaths)

  let contractFileNames = []
  try {
    contractFileNames = fs
      .readdirSync(contractsDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => entry.name)
      .sort()
  } catch {
    contractFileNames = []
  }

  const contracts = []
  const brokenContracts = []
  const duplicateContractTargets = []
  const contractPathMap = new Map()

  for (const fileName of contractFileNames) {
    const filePath = path.join(contractsDir, fileName)
    const parsed = readJsonFileSafe(filePath)
    if (parsed.error || !parsed.data) {
      brokenContracts.push(
        `${normalizeContractPath(targetRoot, filePath)} -> ${parsed.error || 'invalid json'}`
      )
      continue
    }

    const generatedPagePath = normalizeContractPath(
      targetRoot,
      String(parsed.data.generatedPagePath || '').trim()
    )
    if (!generatedPagePath) {
      brokenContracts.push(
        `${normalizeContractPath(targetRoot, filePath)} -> generatedPagePath is missing`
      )
      continue
    }

    if (contractPathMap.has(generatedPagePath)) {
      duplicateContractTargets.push(
        `${generatedPagePath} is declared by both ${contractPathMap.get(generatedPagePath)} and ${normalizeContractPath(targetRoot, filePath)}`
      )
      continue
    }

    contractPathMap.set(generatedPagePath, normalizeContractPath(targetRoot, filePath))
    contracts.push({
      filePath,
      generatedPagePath,
      contract: parsed.data,
      registryEntry: normalizeRegistryEntry(buildManagedPageRegistryEntry(parsed.data)),
    })
  }

  const contractsWithoutSourceFiles = contracts
    .filter((item) => !fs.existsSync(path.join(targetRoot, item.generatedPagePath)))
    .map(
      (item) =>
        `${item.generatedPagePath} is declared in ${normalizeContractPath(targetRoot, item.filePath)} but the page source file does not exist`
    )

  const sourceWithoutContracts = sourcePaths
    .filter((sourcePath) => !contractPathMap.has(sourcePath))
    .map(
      (sourcePath) =>
        `${sourcePath} exposes hiui-design managed-page markers but no contract exists under ${normalizeContractPath(targetRoot, contractsDir)}`
    )

  const contractsWithoutSourceMarkers = contracts
    .filter(
      (item) =>
        fs.existsSync(path.join(targetRoot, item.generatedPagePath)) && !sourcePathSet.has(item.generatedPagePath)
    )
    .map(
      (item) =>
        `${item.generatedPagePath} is registered in ${normalizeContractPath(targetRoot, item.filePath)} but the current source no longer exposes the managed-page markers that start-page/finalize expect`
    )

  const registryJson = readJsonFileSafe(registryJsonPath)
  const registryLoadError = registryJson.exists && registryJson.error ? registryJson.error : ''
  const actualRegistryEntries = Array.isArray(registryJson.data?.entries)
    ? registryJson.data.entries.map((entry) => normalizeRegistryEntry(entry))
    : []
  const actualRegistryMap = new Map(
    actualRegistryEntries.map((entry) => [entry.generatedPagePath, entry])
  )
  const expectedRegistryEntries = contracts
    .map((item) => item.registryEntry)
    .sort((left, right) => left.generatedPagePath.localeCompare(right.generatedPagePath))
  const expectedRegistryMap = new Map(
    expectedRegistryEntries.map((entry) => [entry.generatedPagePath, entry])
  )

  const missingRegistryEntries = expectedRegistryEntries
    .filter((entry) => !actualRegistryMap.has(entry.generatedPagePath))
    .map(
      (entry) =>
        `${entry.generatedPagePath} is registered by contract but missing from ${normalizeContractPath(targetRoot, registryJsonPath)}`
    )

  const mismatchedRegistryEntries = expectedRegistryEntries
    .filter((entry) => actualRegistryMap.has(entry.generatedPagePath))
    .filter((entry) => {
      const actualEntry = actualRegistryMap.get(entry.generatedPagePath)
      return JSON.stringify(actualEntry) !== JSON.stringify(entry)
    })
    .map((entry) => {
      const actualEntry = actualRegistryMap.get(entry.generatedPagePath)
      return `${entry.generatedPagePath} is out of sync in ${normalizeContractPath(
        targetRoot,
        registryJsonPath
      )}. Expected ${JSON.stringify(entry)}, received ${JSON.stringify(actualEntry)}`
    })

  const unexpectedRegistryEntries = actualRegistryEntries
    .filter((entry) => !expectedRegistryMap.has(entry.generatedPagePath))
    .map(
      (entry) =>
        `${entry.generatedPagePath} exists in ${normalizeContractPath(targetRoot, registryJsonPath)} but no matching contract exists`
    )

  const issues = [
    ...brokenContracts,
    ...duplicateContractTargets,
    ...contractsWithoutSourceFiles,
    ...sourceWithoutContracts,
    ...contractsWithoutSourceMarkers,
    ...(!fs.existsSync(registryMarkdownPath)
      ? [`${normalizeContractPath(targetRoot, registryMarkdownPath)} is missing`]
      : []),
    ...(registryLoadError
      ? [`${normalizeContractPath(targetRoot, registryJsonPath)} could not be parsed: ${registryLoadError}`]
      : []),
    ...missingRegistryEntries,
    ...mismatchedRegistryEntries,
    ...unexpectedRegistryEntries,
  ]

  return {
    contractsDir,
    registryJsonPath,
    registryMarkdownPath,
    sourceFiles,
    sourcePaths,
    contracts,
    expectedRegistryEntries,
    actualRegistryEntries,
    brokenContracts,
    duplicateContractTargets,
    contractsWithoutSourceFiles,
    sourceWithoutContracts,
    contractsWithoutSourceMarkers,
    missingRegistryEntries,
    mismatchedRegistryEntries,
    unexpectedRegistryEntries,
    registryLoadError,
    issues,
  }
}

function extractImportSpecifiers(source) {
  return Array.from(
    String(source || '').matchAll(
      /import\s+(?:type\s+)?(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    )
  )
    .map((match) => match[1] || match[2] || '')
    .filter(Boolean)
}

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

function resolveLocalStyleImportPaths({ sourceFilePath, sourceRaw }) {
  return extractImportSpecifiers(sourceRaw)
    .filter((specifier) => specifier.startsWith('.') && /\.(?:css|scss)$/.test(specifier))
    .map((specifier) => path.resolve(path.dirname(sourceFilePath), specifier))
    .filter((absolutePath) => fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile())
}

export function computeManagedPageSourceSnapshot({ generatedPagePath, targetRoot, maxFiles = 24 }) {
  const normalizedPagePath = normalizeContractPath(targetRoot, generatedPagePath)
  const entryFilePath = path.join(targetRoot, normalizedPagePath)
  const entries = []
  const visitedSourceFiles = new Set()
  const visitedStyleFiles = new Set()

  function pushEntry(type, absolutePath, raw) {
    const relativePath = normalizeContractPath(targetRoot, absolutePath)
    entries.push({
      type,
      path: relativePath,
      raw: String(raw || ''),
    })
  }

  function visitSource(filePath) {
    if (
      !filePath ||
      visitedSourceFiles.has(filePath) ||
      visitedSourceFiles.size >= maxFiles ||
      !fs.existsSync(filePath)
    ) {
      return
    }

    visitedSourceFiles.add(filePath)
    const raw = readTextIfExists(filePath)
    pushEntry('source', filePath, raw)

    for (const stylePath of resolveLocalStyleImportPaths({ sourceFilePath: filePath, sourceRaw: raw })) {
      if (visitedStyleFiles.has(stylePath)) continue
      visitedStyleFiles.add(stylePath)
      pushEntry('style', stylePath, readTextIfExists(stylePath))
    }

    for (const specifier of extractImportSpecifiers(raw)) {
      const resolvedPath = resolveLocalScriptImportPath({
        sourceFilePath: filePath,
        specifier,
        targetRoot,
      })
      if (resolvedPath) {
        visitSource(resolvedPath)
      }
    }
  }

  visitSource(entryFilePath)

  const normalizedEntries = entries
    .map((entry) => ({
      type: entry.type,
      path: entry.path,
      raw: entry.raw,
    }))
    .sort((left, right) => `${left.type}:${left.path}`.localeCompare(`${right.type}:${right.path}`))

  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(normalizedEntries))
    .digest('hex')

  return {
    generatedPagePath: normalizedPagePath,
    entryFilePath,
    files: normalizedEntries.map((entry) => `${entry.type}:${entry.path}`),
    hash: `sha256:${hash}`,
  }
}

export function shouldPreferCurrentManagedPageSourceSnapshotForRuntimeSmoke(contract) {
  const runtimeSmokeRequirement = getManagedPageRuntimeSmokeRequirement(contract)
  if (!runtimeSmokeRequirement.required) {
    return false
  }

  const runtimeSmokeStatus = String(contract?.workflow?.runtimeSmokeStatus || '').trim()
  return runtimeSmokeStatus === 'pass' || runtimeSmokeStatus === 'fail'
}

export function resolveManagedPageObservedSourceSnapshotHash({
  contract,
  targetRoot,
  preferCurrentSource = true,
}) {
  if (!preferCurrentSource) {
    return String(contract?.workflow?.sourceSnapshotHash || '').trim()
  }

  const generatedPagePath = String(contract?.generatedPagePath || '').trim()
  if (generatedPagePath) {
    const normalizedPagePath = normalizeContractPath(targetRoot, generatedPagePath)
    const entryFilePath = path.join(targetRoot, normalizedPagePath)
    if (fs.existsSync(entryFilePath) && fs.statSync(entryFilePath).isFile()) {
      return computeManagedPageSourceSnapshot({
        generatedPagePath: normalizedPagePath,
        targetRoot,
      }).hash
    }
  }

  return String(contract?.workflow?.sourceSnapshotHash || '').trim()
}

export function getManagedPagesRegistryJsonPath(targetRoot) {
  return path.join(getRulesOnlyOutputRoot(targetRoot), 'managed-pages.index.json')
}

export function getManagedPagesRegistryMarkdownPath(targetRoot) {
  return path.join(getRulesOnlyOutputRoot(targetRoot), 'managed-pages.index.md')
}

export function buildManagedPageRegistryEntry(contract) {
  const runtimeSmokeRequirement = getManagedPageRuntimeSmokeRequirement(contract)
  return {
    generatedPagePath: String(contract?.generatedPagePath || '').trim(),
    pageTypeId: String(contract?.pageTypeId || '').trim(),
    pageTypeLabel: String(contract?.pageTypeLabel || '').trim(),
    examplePath: String(contract?.examplePath || '').trim(),
    hostArchetypePath: String(contract?.hostArchetypePath || '').trim(),
    archetypeId: String(contract?.archetypeId || '').trim(),
    hostAdapterId: String(contract?.adapterContract?.hostAdapterId || '').trim(),
    scrollStrategy: String(contract?.scrollStrategy || '').trim(),
    workflowStatus: String(contract?.workflow?.status || '').trim(),
    preflightStatus: String(contract?.workflow?.preflightStatus || '').trim(),
    sourceGateStatus: String(contract?.workflow?.sourceGateStatus || '').trim(),
    doctorStatus: String(contract?.workflow?.doctorStatus || '').trim(),
    runtimeSmokeRequired: runtimeSmokeRequirement.required,
    runtimeSmokeStatus: String(contract?.workflow?.runtimeSmokeStatus || '').trim(),
    runtimeSmokeSnapshotHash: String(contract?.workflow?.runtimeSmokeSnapshotHash || '').trim(),
    sourceSnapshotHash: String(contract?.workflow?.sourceSnapshotHash || '').trim(),
    updatedAt:
      String(contract?.workflow?.finalizedAt || '').trim() ||
      String(contract?.workflow?.startedAt || '').trim() ||
      String(contract?.createdAt || '').trim(),
  }
}

function renderManagedPagesRegistryMarkdown(entries, brokenEntries) {
  const updatedAt = arguments[2] || new Date().toISOString()
  const lines = [
    '# Managed Pages Registry',
    '',
    `- updated at: ${updatedAt}`,
    `- managed page count: ${entries.length}`,
    '',
  ]

  if (entries.length === 0) {
    lines.push('No managed page contracts found.')
  } else {
    lines.push('| Page | Page Type | Workflow | Runtime Smoke | Adapter | Snapshot | Updated |')
    lines.push('| --- | --- | --- | --- | --- | --- | --- |')
    for (const entry of entries) {
      lines.push(
        `| \`${entry.generatedPagePath}\` | \`${entry.pageTypeId}\` | \`${entry.workflowStatus || '(missing)'}\` | \`${entry.runtimeSmokeRequired ? `${entry.runtimeSmokeStatus || '(missing)'} / required` : 'not-required'}\` | \`${entry.hostAdapterId || '(missing)'}\` | \`${entry.sourceSnapshotHash || '(missing)'}\` | \`${entry.updatedAt || '(missing)'}\` |`
      )
    }
  }

  if (brokenEntries.length > 0) {
    lines.push('', '## Broken Contract Files')
    for (const item of brokenEntries) {
      lines.push(`- \`${item.path}\`: ${item.error}`)
    }
  }

  return `${lines.join('\n')}\n`
}

export async function writeUtf8FileIfChanged(filePath, content) {
  const normalizedContent = String(content)
  const existing = await readTextFileSafe(filePath)
  if (!existing.error && existing.exists && existing.data === normalizedContent) {
    return {
      changed: false,
      filePath,
    }
  }

  await fsp.mkdir(path.dirname(filePath), { recursive: true })
  await fsp.writeFile(filePath, normalizedContent, 'utf8')
  return {
    changed: true,
    filePath,
  }
}

export async function writeManagedPageContractArtifacts({
  contract,
  contractJsonPath,
  contractMarkdownPath,
}) {
  const jsonResult = await writeUtf8FileIfChanged(
    contractJsonPath,
    `${JSON.stringify(contract, null, 2)}\n`
  )
  const markdownResult = await writeUtf8FileIfChanged(
    contractMarkdownPath,
    renderRulesOnlyPageContractMarkdown(contract)
  )

  return {
    changed: jsonResult.changed || markdownResult.changed,
    jsonChanged: jsonResult.changed,
    markdownChanged: markdownResult.changed,
  }
}

export async function syncManagedPageRegistry(targetRoot, { skipIfUnchanged = true } = {}) {
  const contractsDir = getRulesOnlyPageContractsDir(targetRoot)
  const registryJsonPath = getManagedPagesRegistryJsonPath(targetRoot)
  const registryMarkdownPath = getManagedPagesRegistryMarkdownPath(targetRoot)
  await fsp.mkdir(path.dirname(registryJsonPath), { recursive: true })

  let fileNames = []
  try {
    fileNames = (await fsp.readdir(contractsDir)).filter((fileName) => fileName.endsWith('.json'))
  } catch {
    fileNames = []
  }

  const entries = []
  const brokenEntries = []

  for (const fileName of fileNames.sort()) {
    const filePath = path.join(contractsDir, fileName)
    try {
      const contract = JSON.parse(await fsp.readFile(filePath, 'utf8'))
      entries.push(buildManagedPageRegistryEntry(contract))
    } catch (error) {
      brokenEntries.push({
        path: normalizeContractPath(targetRoot, filePath),
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  entries.sort((left, right) => left.generatedPagePath.localeCompare(right.generatedPagePath))

  const comparableRegistry = buildComparableRegistryPayload({
    entries,
    brokenEntries,
  })
  const existingRegistry = readJsonFileSafe(registryJsonPath)
  const existingComparableRegistry =
    existingRegistry.exists && !existingRegistry.error
      ? buildComparableRegistryPayload({
          entries: existingRegistry.data?.entries || [],
          brokenEntries: existingRegistry.data?.brokenEntries || [],
        })
      : null
  const registryChanged =
    !existingComparableRegistry ||
    JSON.stringify(existingComparableRegistry) !== JSON.stringify(comparableRegistry)
  const existingUpdatedAt = String(existingRegistry.data?.updatedAt || '').trim()
  const registryUpdatedAt =
    !registryChanged && existingUpdatedAt ? existingUpdatedAt : new Date().toISOString()
  const markdownContent = renderManagedPagesRegistryMarkdown(
    comparableRegistry.entries,
    comparableRegistry.brokenEntries,
    registryUpdatedAt
  )
  const existingMarkdown = await readTextFileSafe(registryMarkdownPath)
  const markdownChanged = existingMarkdown.error || existingMarkdown.data !== markdownContent

  if (skipIfUnchanged && !registryChanged && !markdownChanged) {
    return {
      ...existingRegistry.data,
      changed: false,
      jsonChanged: false,
      markdownChanged: false,
    }
  }

  const registry = {
    ...comparableRegistry,
    updatedAt: registryUpdatedAt,
  }

  const jsonResult = await writeUtf8FileIfChanged(
    registryJsonPath,
    `${JSON.stringify(registry, null, 2)}\n`
  )
  const markdownResult = await writeUtf8FileIfChanged(registryMarkdownPath, markdownContent)

  return {
    ...registry,
    changed: jsonResult.changed || markdownResult.changed,
    jsonChanged: jsonResult.changed,
    markdownChanged: markdownResult.changed,
  }
}
