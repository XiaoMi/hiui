import path from 'node:path'
import { ensureLegacyReactDefaultImport } from './legacy-react-runtime.mjs'
import {
  getManagedLocalRuntimeStylePath,
  inferManagedLocalRuntimeSourceBaseDir,
} from './managed-local-runtime-contract.mjs'

export const MANAGED_MF_PUBLISH_ENTRY_MARKER =
  'hiui-design managed mf publish entry'

function normalizeRelativePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
}

function stripScriptModuleExtension(value) {
  return String(value || '').replace(/\.(?:[cm]?[jt]sx?)$/, '')
}

function ensureRelativeImportPath(value) {
  const normalized = String(value || '').replace(/\\/g, '/')
  if (!normalized) return './'
  return normalized.startsWith('.') ? normalized : `./${normalized}`
}

function normalizeStringArray(values) {
  return Array.isArray(values)
    ? values.map((value) => String(value || '').trim()).filter(Boolean)
    : []
}

export function buildManagedMfPublishEntryImportPlan({
  appEntrySource = '',
  hostProfile = null,
} = {}) {
  const normalizedEntrySource = String(appEntrySource || '')
  const importsReactCompatPatch =
    normalizedEntrySource.includes(`import '@hi-ui/patch-for-react'`) ||
    normalizedEntrySource.includes('import "@hi-ui/patch-for-react"') ||
    normalizeStringArray(hostProfile?.riskTags).includes('legacy-react-16')

  return {
    importsReactCompatPatch,
    importsShellStyles: true,
  }
}

export function inferManagedBusinessShellImportPath(publishEntryPath, shellPath = 'src/business-shell/app-frame.tsx') {
  const normalizedPublishEntryPath = normalizeRelativePath(publishEntryPath)
  const normalizedShellPath = normalizeRelativePath(shellPath)
  return ensureRelativeImportPath(
    stripScriptModuleExtension(
      path.posix.relative(path.posix.dirname(normalizedPublishEntryPath), normalizedShellPath)
    )
  )
}

export function inferManagedLocalRuntimeStyleImportPath(publishEntryPath = '') {
  const normalizedPublishEntryPath = normalizeRelativePath(publishEntryPath)
  const sourceBaseDir = inferManagedLocalRuntimeSourceBaseDir(normalizedPublishEntryPath)
  const managedStylePath = getManagedLocalRuntimeStylePath(sourceBaseDir)

  return ensureRelativeImportPath(
    path.posix.relative(path.posix.dirname(normalizedPublishEntryPath), managedStylePath)
  )
}

export function buildManagedMfPublishEntryContent({
  importPlan,
  shellImportPath = '',
  publishEntryPath = '',
  usesJavaScriptModule = false,
  hostProfile = null,
}) {
  const lines = [`// ${MANAGED_MF_PUBLISH_ENTRY_MARKER}`]
  if (importPlan?.importsReactCompatPatch) {
    lines.push("import '@hi-ui/patch-for-react'")
  }
  lines.push(`import ${JSON.stringify(inferManagedLocalRuntimeStyleImportPath(publishEntryPath))}`)

  if (!shellImportPath) {
    lines.push('')
    lines.push("export * from './index'")
    lines.push("export { default } from './index'")
    lines.push('')
    return lines.join('\n')
  }

  lines.push(`import BusinessShell from ${JSON.stringify(shellImportPath)}`)
  lines.push("import * as GeneratedPageModule from './index'")
  lines.push('')
  lines.push("export * from './index'")
  lines.push('')
  lines.push(
    usesJavaScriptModule
      ? `function resolveGeneratedPageExport(pageModule) {
  if (typeof pageModule.default === 'function') {
    return pageModule.default
  }

  const namedPageEntry =
    Object.entries(pageModule).find(
      ([exportName, exportedValue]) =>
        exportName !== 'default' &&
        exportName.endsWith('Page') &&
        /^[A-Z]/.test(exportName) &&
        typeof exportedValue === 'function'
    ) ||
    Object.entries(pageModule).find(
      ([exportName, exportedValue]) =>
        exportName !== 'default' &&
        /^[A-Z]/.test(exportName) &&
        typeof exportedValue === 'function'
    )

  if (namedPageEntry) {
    return namedPageEntry[1]
  }

  throw new Error('Managed MF publish entry could not resolve a page component export from ./index.')
}`
      : `function resolveGeneratedPageExport(pageModule: Record<string, any>): any {
  if (typeof pageModule.default === 'function') {
    return pageModule.default
  }

  const namedPageEntry =
    Object.entries(pageModule).find(
      ([exportName, exportedValue]) =>
        exportName !== 'default' &&
        exportName.endsWith('Page') &&
        /^[A-Z]/.test(exportName) &&
        typeof exportedValue === 'function'
    ) ||
    Object.entries(pageModule).find(
      ([exportName, exportedValue]) =>
        exportName !== 'default' &&
        /^[A-Z]/.test(exportName) &&
        typeof exportedValue === 'function'
    )

  if (namedPageEntry) {
    return namedPageEntry[1]
  }

  throw new Error('Managed MF publish entry could not resolve a page component export from ./index.')
}`
  )
  lines.push('')
  lines.push('const GeneratedPage = resolveGeneratedPageExport(GeneratedPageModule)')
  lines.push('')
  if (!usesJavaScriptModule) {
    lines.push(
      `export default function ManagedMfPublishEntry(props: Record<string, unknown>) {
  return (
    <BusinessShell {...props}>
      <GeneratedPage />
    </BusinessShell>
  )
}`
    )
  } else {
    lines.push(
      `export default function ManagedMfPublishEntry(props) {
  return (
    <BusinessShell {...props}>
      <GeneratedPage />
    </BusinessShell>
  )
}`
    )
  }
  lines.push('')

  return ensureLegacyReactDefaultImport(lines.join('\n'), hostProfile)
}

export function looksLikeManagedMfPublishEntryContent(source = '') {
  const text = String(source || '')
  return (
    text.includes(`// ${MANAGED_MF_PUBLISH_ENTRY_MARKER}`) ||
    (
      /import ['"][^'"]*hiui-design-runtime\/styles\.css['"]/.test(text) &&
      text.includes("import * as GeneratedPageModule from './index'") &&
      text.includes('const GeneratedPage = resolveGeneratedPageExport(GeneratedPageModule)') &&
      text.includes('export default function ManagedMfPublishEntry')
    )
  )
}
