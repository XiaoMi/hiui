import fs from 'node:fs/promises'
import path from 'node:path'

export const LEGACY_RUNTIME_SURFACE_SCHEMA_VERSION = 'legacy-runtime-surface-facts.v1'
export const LEGACY_RUNTIME_DIR = 'src/hiui-runtime'

const CORE_RUNTIME_FILES = [
  'src/hiui-runtime/HiuiLegacyPage.tsx',
  'src/hiui-runtime/types.ts',
  'src/hiui-runtime/styles.css',
  'src/hiui-runtime/page-specs/index.ts',
]

const LEGACY_STYLE_SCOPE = "[data-hiui-page-root='legacy-host-compatible']"

function normalizePageTypeIds(pageTypeIds = []) {
  return Array.isArray(pageTypeIds)
    ? pageTypeIds.map((pageTypeId) => String(pageTypeId || '').trim()).filter(Boolean)
    : []
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

async function readTextIfExists(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch {
    return ''
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function toProjectPath(targetRoot, relativePath) {
  return path.join(targetRoot, relativePath)
}

function pageTypeSpecPath(pageTypeId) {
  return `src/hiui-runtime/page-specs/${pageTypeId}.ts`
}

export async function collectLegacyRuntimeSurfaceFacts({
  targetRoot,
  requiredPageTypes = [],
  optionalPageTypes = [],
} = {}) {
  if (!targetRoot) {
    throw new Error('collectLegacyRuntimeSurfaceFacts requires targetRoot')
  }

  const normalizedRequiredPageTypes = unique(normalizePageTypeIds(requiredPageTypes))
  const normalizedOptionalPageTypes = unique(normalizePageTypeIds(optionalPageTypes))
  const runtimeFiles = []

  for (const relativePath of CORE_RUNTIME_FILES) {
    runtimeFiles.push({
      path: relativePath,
      exists: await fileExists(toProjectPath(targetRoot, relativePath)),
    })
  }

  const missingRuntimeFiles = runtimeFiles.filter((file) => !file.exists).map((file) => file.path)
  const stylesSource = await readTextIfExists(toProjectPath(targetRoot, 'src/hiui-runtime/styles.css'))
  const styleScopeReady = stylesSource.includes(LEGACY_STYLE_SCOPE)
  const pageTypeSpecs = []

  for (const pageTypeId of unique([...normalizedRequiredPageTypes, ...normalizedOptionalPageTypes])) {
    const relativePath = pageTypeSpecPath(pageTypeId)
    pageTypeSpecs.push({
      pageTypeId,
      path: relativePath,
      required: normalizedRequiredPageTypes.includes(pageTypeId),
      exists: await fileExists(toProjectPath(targetRoot, relativePath)),
    })
  }

  const runtimeSurfaceCoveredPageTypes = pageTypeSpecs
    .filter((spec) => spec.required && spec.exists)
    .map((spec) => spec.pageTypeId)
  const missingRuntimeSurfacePageTypes = normalizedRequiredPageTypes.filter(
    (pageTypeId) => !runtimeSurfaceCoveredPageTypes.includes(pageTypeId)
  )
  const blockingReasons = []

  if (missingRuntimeFiles.length > 0) {
    blockingReasons.push(
      `legacy runtime surface is incomplete because required runtime files are missing: ${missingRuntimeFiles.join(', ')}`
    )
  }
  if (!styleScopeReady) {
    blockingReasons.push(`legacy runtime surface is incomplete because src/hiui-runtime/styles.css does not declare ${LEGACY_STYLE_SCOPE}`)
  }
  if (missingRuntimeSurfacePageTypes.length > 0) {
    blockingReasons.push(
      `legacy runtime surface is incomplete because required PageSpec files are missing for page types: ${missingRuntimeSurfacePageTypes.join(', ')}`
    )
  }

  const runtimeSurfaceReady =
    missingRuntimeFiles.length === 0 && styleScopeReady && missingRuntimeSurfacePageTypes.length === 0

  return {
    schemaVersion: LEGACY_RUNTIME_SURFACE_SCHEMA_VERSION,
    status: runtimeSurfaceReady ? 'ready' : 'blocked',
    runtimeSurfaceReady,
    runtimeDir: LEGACY_RUNTIME_DIR,
    runtimeFiles,
    missingRuntimeFiles,
    styleScope: LEGACY_STYLE_SCOPE,
    styleScopeReady,
    requiredPageTypes: normalizedRequiredPageTypes,
    optionalPageTypes: normalizedOptionalPageTypes,
    pageTypeSpecs,
    runtimeSurfaceCoveredPageTypes,
    missingRuntimeSurfacePageTypes,
    blockingReasons,
  }
}
