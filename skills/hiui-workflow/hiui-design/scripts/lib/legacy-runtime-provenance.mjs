import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

export const RUNTIME_SEAL_RELATIVE_PATH = '.local-context/hiui-design/outputs/runtime-seal.json'
export const LEGACY_RUNTIME_TARGET_DIR = 'src/hiui-runtime'

export const CANONICAL_SHELL_BY_PAGE_TYPE = {
  'table-basic': 'TablePageFrame',
  'tree-table': 'TablePageFrame',
  'table-stat': 'StatListPageFrame',
  'tree-split': 'TreeSplitPageFrame',
  'drawer-form': 'ProFormDrawer',
  'drawer-detail': 'ProDetailDrawer',
  'full-page-edit': 'ProEditPage',
  'full-page-detail': 'ProDetailPage',
}

export const CRITICAL_IMPORTS_BY_PAGE_TYPE = {
  'table-basic': [
    {
      module: '@hiui-design/typical-page-shells/pro-table-page',
      exportName: 'TablePageFrame',
    },
  ],
  'tree-table': [
    {
      module: '@hiui-design/typical-page-shells/pro-table-page',
      exportName: 'TablePageFrame',
    },
  ],
  'table-stat': [
    {
      module: '@hiui-design/typical-page-shells/pro-stat-page',
      exportName: 'StatListPageFrame',
    },
  ],
  'tree-split': [
    {
      module: '@hiui-design/typical-page-shells/pro-tree-split-page',
      exportName: 'TreeSplitPageFrame',
    },
  ],
  'drawer-form': [
    {
      module: '@hiui-design/typical-page-shells/pro-form-drawer',
      exportName: 'ProFormDrawer',
    },
  ],
  'drawer-detail': [
    {
      module: '@hiui-design/typical-page-shells/pro-detail-drawer',
      exportName: 'ProDetailDrawer',
    },
  ],
  'full-page-edit': [
    {
      module: '@hiui-design/typical-page-shells/pro-edit-page',
      exportName: 'ProEditPage',
    },
  ],
  'full-page-detail': [
    {
      module: '@hiui-design/typical-page-shells/pro-detail-page',
      exportName: 'ProDetailPage',
    },
  ],
}

export const RUNTIME_ENTRY_BY_PAGE_TYPE = {
  'table-basic': 'pages/TableBasicPage.tsx',
  'tree-table': 'pages/TreeTablePage.tsx',
  'table-stat': 'pages/TableStatPage.tsx',
  'tree-split': 'pages/TreeSplitPage.tsx',
  'drawer-form': 'pages/DrawerFormPage.tsx',
  'drawer-detail': 'pages/DrawerDetailPage.tsx',
  'full-page-edit': 'pages/FullPageEditPage.tsx',
  'full-page-detail': 'pages/FullPageDetailPage.tsx',
  'feedback-status': 'pages/FeedbackStatusPage.tsx',
}

const ALLOWED_EXTENSION_GLOBS = ['src/hiui-runtime/adapters/**', 'src/hiui-runtime/host-overrides/**']

const PAGE_TYPE_BRANCH_PATTERNS = {
  'table-basic': /<\s*TablePageFrame\b/,
  'tree-table': /<\s*TablePageFrame\b/,
  'table-stat': /<\s*StatListPageFrame\b/,
  'tree-split': /<\s*TreeSplitPageFrame\b/,
  'drawer-form': /<\s*ProFormDrawer\b/,
  'drawer-detail': /<\s*ProDetailDrawer\b/,
  'full-page-edit': /<\s*ProEditPage\b/,
  'full-page-detail': /<\s*ProDetailPage\b/,
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

async function collectFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await collectFiles(entryPath))
    } else if (entry.isFile()) {
      files.push(entryPath)
    }
  }

  return files.sort()
}

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex')
}

async function readRulesVersion(skillRoot) {
  const versionPath = path.join(skillRoot, 'rules', 'VERSION')
  const text = await fs.readFile(versionPath, 'utf8')
  const match = /^version:\s*(\S+)/m.exec(text)
  return match?.[1] || ''
}

export function summarizeRuntimeSealHash(runtimeSeal) {
  const sealedCoreFiles = Array.isArray(runtimeSeal?.sealedCoreFiles) ? runtimeSeal.sealedCoreFiles : []
  return sealedCoreFiles
    .map((file) => `${file?.targetPath || ''}:${file?.sha256 || ''}`)
    .filter(Boolean)
    .join('|')
}

export async function buildRuntimeSeal({
  targetRoot,
  skillRoot,
  runtimeSourceDir = 'runtime/legacy/src',
  runtimeTargetDir = LEGACY_RUNTIME_TARGET_DIR,
  rulesVersion = '',
} = {}) {
  const sourceRoot = path.join(skillRoot, runtimeSourceDir)
  const files = await collectFiles(sourceRoot)
  const resolvedRulesVersion = rulesVersion || await readRulesVersion(skillRoot)
  const sealedCoreFiles = []

  for (const sourcePath of files) {
    const relativeSourcePath = normalizeRelativePath(path.relative(skillRoot, sourcePath))
    const relativeRuntimePath = normalizeRelativePath(path.relative(sourceRoot, sourcePath))
    const targetPath = normalizeRelativePath(path.join(runtimeTargetDir, relativeRuntimePath))
    const content = await fs.readFile(sourcePath, 'utf8')
    sealedCoreFiles.push({
      targetPath,
      sourcePath: relativeSourcePath,
      sha256: sha256(content),
      required: true,
    })
  }

  return {
    schemaVersion: 'runtime-seal.v1',
    mode: 'legacy-host-compatible',
    runtimeCoreVersion: resolvedRulesVersion,
    rulesVersion: resolvedRulesVersion,
    sourceHashAlgorithm: 'sha256',
    sourceSkillRoot: normalizeRelativePath(skillRoot),
    generatedAt: new Date().toISOString(),
    sealedCoreFiles,
    allowedExtensionGlobs: ALLOWED_EXTENSION_GLOBS,
    canonicalShellByPageType: CANONICAL_SHELL_BY_PAGE_TYPE,
    runtimeEntryByPageType: RUNTIME_ENTRY_BY_PAGE_TYPE,
    criticalImportsByPageType: CRITICAL_IMPORTS_BY_PAGE_TYPE,
  }
}

export async function writeRuntimeSeal({ targetRoot, seal }) {
  const outputPath = path.join(targetRoot, RUNTIME_SEAL_RELATIVE_PATH)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify(seal, null, 2)}\n`, 'utf8')
  return {
    path: outputPath,
    relativePath: RUNTIME_SEAL_RELATIVE_PATH,
    seal,
  }
}

export async function readRuntimeSeal({ targetRoot } = {}) {
  return readJsonIfExists(path.join(targetRoot, RUNTIME_SEAL_RELATIVE_PATH))
}

function issue(code, message, file = RUNTIME_SEAL_RELATIVE_PATH) {
  return { code, message, path: normalizeRelativePath(file) }
}

export async function verifyRuntimeSeal({ targetRoot } = {}) {
  const sealPath = path.join(targetRoot, RUNTIME_SEAL_RELATIVE_PATH)
  const seal = await readJsonIfExists(sealPath)
  const issues = []

  if (!seal) {
    issues.push(issue('runtime.seal.missing', `Missing ${RUNTIME_SEAL_RELATIVE_PATH}. Re-run typical-page:apply:legacy so runtime provenance is recorded.`))
    return { ok: false, seal: null, issues }
  }
  if (seal.schemaVersion !== 'runtime-seal.v1') {
    issues.push(issue('runtime.seal.invalid', 'runtime seal schemaVersion must be runtime-seal.v1'))
  }
  if (seal.mode !== 'legacy-host-compatible') {
    issues.push(issue('runtime.seal.mode', 'runtime seal mode must be legacy-host-compatible'))
  }

  const sealedCoreFiles = Array.isArray(seal.sealedCoreFiles) ? seal.sealedCoreFiles : []
  if (sealedCoreFiles.length === 0) {
    issues.push(issue('runtime.seal.empty', 'runtime seal must declare sealedCoreFiles'))
  }

  for (const file of sealedCoreFiles) {
    const relativeTargetPath = normalizeRelativePath(file?.targetPath)
    const expectedHash = String(file?.sha256 || '').trim()
    if (!relativeTargetPath || !expectedHash) {
      issues.push(issue('runtime.seal.invalidFile', 'runtime seal file entries must include targetPath and sha256'))
      continue
    }
    const absoluteTargetPath = path.join(targetRoot, relativeTargetPath)
    if (!(await pathExists(absoluteTargetPath))) {
      issues.push(issue('runtime.core.missing', `Missing sealed runtime core file ${relativeTargetPath}`, relativeTargetPath))
      continue
    }
    const actualHash = sha256(await fs.readFile(absoluteTargetPath, 'utf8'))
    if (actualHash !== expectedHash) {
      issues.push(issue('runtime.core.mutated', `Sealed runtime core file changed: ${relativeTargetPath}`, relativeTargetPath))
    }
  }

  return { ok: issues.length === 0, seal, issues }
}

function hasNamedImport(source, exportName, moduleName) {
  const escapedModule = moduleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`import\\s+\\{[^}]*\\b${exportName}\\b[^}]*\\}\\s+from\\s+['"]${escapedModule}['"]`).test(source)
}

export async function verifyCanonicalShellBinding({ targetRoot, pageType } = {}) {
  const runtimeEntry = RUNTIME_ENTRY_BY_PAGE_TYPE[pageType] || 'HiuiLegacyPage.tsx'
  const runtimePath = path.join(targetRoot, LEGACY_RUNTIME_TARGET_DIR, runtimeEntry)
  const relativeRuntimePath = normalizeRelativePath(path.relative(targetRoot, runtimePath))
  const issues = []
  const source = await pathExists(runtimePath) ? await fs.readFile(runtimePath, 'utf8') : ''
  const canonicalShell = CANONICAL_SHELL_BY_PAGE_TYPE[pageType]

  if (!source) {
    issues.push(issue('runtime.core.missing', `Missing ${relativeRuntimePath}`, relativeRuntimePath))
    return { ok: false, canonicalShell, issues }
  }
  if (!canonicalShell) {
    issues.push(issue('runtime.canonicalShell.unknownPageType', `No canonical shell is configured for pageType ${pageType}`, relativeRuntimePath))
    return { ok: false, canonicalShell, issues }
  }

  for (const criticalImport of CRITICAL_IMPORTS_BY_PAGE_TYPE[pageType] || []) {
    if (!hasNamedImport(source, criticalImport.exportName, criticalImport.module)) {
      issues.push(issue(
        'runtime.shellImport.missing',
        `${pageType} runtime must import ${criticalImport.exportName} from ${criticalImport.module}`,
        relativeRuntimePath,
      ))
    }
  }

  const branchPattern = PAGE_TYPE_BRANCH_PATTERNS[pageType]
  if (!branchPattern || !branchPattern.test(source)) {
    issues.push(issue(
      'runtime.canonicalShell.missing',
      `${pageType} runtime branch must render the canonical shell ${canonicalShell}`,
      relativeRuntimePath,
    ))
  }

  return { ok: issues.length === 0, canonicalShell, issues }
}

function extractPageTypeBranch(source, pageType) {
  const branchStart = source.search(new RegExp(`pageType\\s*===\\s*['"]${pageType}['"]`))
  if (branchStart < 0 && pageType === 'tree-table') {
    const sharedStart = source.search(/pageType\s*===\s*['"]table-basic['"][\s\S]{0,120}\|\|[\s\S]{0,120}pageType\s*===\s*['"]tree-table['"]|pageType\s*===\s*['"]table-basic['"][\s\S]{0,120}pageType\s*===\s*['"]tree-table['"]|pageType\s*===\s*['"]tree-table['"][\s\S]{0,120}pageType\s*===\s*['"]table-basic['"]/) 
    if (sharedStart >= 0) return source.slice(sharedStart, sharedStart + 2600)
  }
  if (branchStart < 0) return ''
  return source.slice(branchStart, branchStart + 2600)
}

export async function verifyPrimitiveRegionFallback({ targetRoot, pageType } = {}) {
  const runtimeEntry = RUNTIME_ENTRY_BY_PAGE_TYPE[pageType] || 'HiuiLegacyPage.tsx'
  const runtimePath = path.join(targetRoot, LEGACY_RUNTIME_TARGET_DIR, runtimeEntry)
  const relativeRuntimePath = normalizeRelativePath(path.relative(targetRoot, runtimePath))
  const source = await pathExists(runtimePath) ? await fs.readFile(runtimePath, 'utf8') : ''
  const branch = source || extractPageTypeBranch(source, pageType)
  const issues = []

  if (!source || !branch) return { ok: true, issues }

  const disallowedPatterns = [
    /\bNative(?:List|Table|Pagination|QueryFilter|PageHeader)\w*\b/,
    /<\s*Table\b/,
    /<\s*Pagination\b/,
    /<\s*QueryFilter\b/,
    /<\s*PageHeader\b/,
  ]

  for (const pattern of disallowedPatterns) {
    if (pattern.test(branch)) {
      issues.push(issue(
        'runtime.primitiveRegionFallback.disallowed',
        `${pageType} runtime branch must not use primitive region fallback matching ${pattern}; bind the canonical shell instead`,
        relativeRuntimePath,
      ))
    }
  }

  return { ok: issues.length === 0, issues }
}
