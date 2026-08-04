import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'

const SHELL_PACKAGE_NAME = '@hiui-design/typical-page-shells'

const CRITICAL_EXPORTS = [
  { module: '@hiui-design/typical-page-shells/pro-table-page', exportName: 'TablePageFrame' },
  { module: '@hiui-design/typical-page-shells/pro-list-page', exportName: 'ProListPageProvider' },
  { module: '@hiui-design/typical-page-shells/schema-field-map', exportName: 'TypicalPageFieldMapProvider' },
  { module: '@hi-ui/form', exportName: 'FormLabel', whenPackageResolves: '@hi-ui/form' },
]

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

function findDeclaredDependency(pkg, depName) {
  return String(
    pkg?.dependencies?.[depName] ||
      pkg?.devDependencies?.[depName] ||
      pkg?.peerDependencies?.[depName] ||
      pkg?.optionalDependencies?.[depName] ||
      ''
  ).trim()
}

function collectPackageAliases(pkg) {
  const aliases = []
  for (const sectionName of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    const section = pkg?.[sectionName] || {}
    for (const [name, spec] of Object.entries(section)) {
      const text = String(spec || '')
      if (!text.startsWith('npm:')) continue
      aliases.push({ section: sectionName, alias: name, target: text.slice(4) })
    }
  }
  return aliases
}

async function collectWebpackAliasFacts(targetRoot) {
  const webpackPath = path.join(targetRoot, 'build', 'webpack.base.conf.js')
  if (!(await pathExists(webpackPath))) return []
  const text = await fs.readFile(webpackPath, 'utf8')
  const facts = []
  const aliasPattern = /['"]([^'"]+)['"]\s*:\s*paths\.resolveApp\(['"]([^'"]+)['"]\)/g
  for (const match of text.matchAll(aliasPattern)) {
    facts.push({ alias: match[1], target: match[2], source: normalizeRelativePath(path.relative(targetRoot, webpackPath)) })
  }
  return facts
}

function findPackageJsonFromResolved(resolvedPath, packageName) {
  const parts = normalizeRelativePath(resolvedPath).split('/')
  const packageParts = packageName.startsWith('@') ? packageName.split('/') : [packageName]
  for (let index = parts.length; index > 0; index -= 1) {
    const candidate = parts.slice(0, index)
    const tail = candidate.slice(-packageParts.length)
    if (tail.join('/') === packageParts.join('/')) {
      return `${candidate.join('/')}/package.json`
    }
  }
  return ''
}

async function readPackageJsonForModule(resolver, packageName) {
  try {
    const packageJsonPath = resolver.resolve(`${packageName}/package.json`)
    const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
    return { ok: true, packageJsonPath, packageJson: pkg, error: '' }
  } catch (packageJsonError) {
    try {
      const resolvedEntry = resolver.resolve(packageName)
      const packageJsonPath = findPackageJsonFromResolved(resolvedEntry, packageName)
      if (!packageJsonPath) {
        return { ok: false, packageJsonPath: '', packageJson: null, error: packageJsonError.message }
      }
      const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
      return { ok: true, packageJsonPath, packageJson: pkg, error: '' }
    } catch (entryError) {
      return { ok: false, packageJsonPath: '', packageJson: null, error: entryError.message || packageJsonError.message }
    }
  }
}

function splitPackageModuleName(moduleName) {
  const parts = String(moduleName || '').split('/')
  if (parts[0]?.startsWith('@')) {
    return {
      packageName: parts.slice(0, 2).join('/'),
      subpath: parts.length > 2 ? `./${parts.slice(2).join('/')}` : '.',
    }
  }
  return {
    packageName: parts[0] || '',
    subpath: parts.length > 1 ? `./${parts.slice(1).join('/')}` : '.',
  }
}

function selectExportTarget(exportEntry) {
  if (typeof exportEntry === 'string') return exportEntry
  if (!exportEntry || typeof exportEntry !== 'object') return ''
  for (const condition of ['import', 'module', 'default', 'require']) {
    const target = selectExportTarget(exportEntry[condition])
    if (target) return target
  }
  return ''
}

async function resolveModulePath(resolver, moduleName) {
  try {
    return { ok: true, modulePath: resolver.resolve(moduleName), error: '' }
  } catch (requireResolveError) {
    const { packageName, subpath } = splitPackageModuleName(moduleName)
    if (!packageName) {
      return { ok: false, modulePath: '', error: requireResolveError.message }
    }

    const packageResult = await readPackageJsonForModule(resolver, packageName)
    const exportEntry = packageResult.packageJson?.exports?.[subpath]
    const exportTarget = selectExportTarget(exportEntry)
    if (!packageResult.ok || !exportTarget) {
      return { ok: false, modulePath: '', error: requireResolveError.message }
    }

    const modulePath = path.resolve(path.dirname(packageResult.packageJsonPath), exportTarget)
    if (!(await pathExists(modulePath))) {
      return { ok: false, modulePath: '', error: `export target does not exist: ${exportTarget}` }
    }

    return { ok: true, modulePath, error: '' }
  }
}

function sourceDeclaresExport(source, exportName) {
  const escaped = exportName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}\\b`).test(source)
}

async function resolveCriticalExport(resolver, targetRoot, criticalExport) {
  try {
    const resolved = await resolveModulePath(resolver, criticalExport.module)
    if (!resolved.ok) throw new Error(resolved.error)
    const modulePath = resolved.modulePath
    const source = await fs.readFile(modulePath, 'utf8')
    const ok = sourceDeclaresExport(source, criticalExport.exportName)
    return {
      module: criticalExport.module,
      exportName: criticalExport.exportName,
      status: ok ? 'ready' : 'blocked',
      resolvedPath: normalizeRelativePath(path.relative(targetRoot, modulePath)),
      blockingReason: ok ? '' : `${criticalExport.module} does not expose ${criticalExport.exportName}`,
    }
  } catch (error) {
    return {
      module: criticalExport.module,
      exportName: criticalExport.exportName,
      status: 'blocked',
      resolvedPath: '',
      blockingReason: `Cannot resolve ${criticalExport.module}: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

export async function collectLegacyRuntimePeerResolution({ targetRoot } = {}) {
  const resolvedTargetRoot = await fs.realpath(targetRoot)
  const targetPkg = await readJsonIfExists(path.join(resolvedTargetRoot, 'package.json'))
  const shellSpec = findDeclaredDependency(targetPkg, SHELL_PACKAGE_NAME)
  const targetRequire = createRequire(path.join(resolvedTargetRoot, 'package.json'))
  const packageAliases = collectPackageAliases(targetPkg)
  const webpackAliases = await collectWebpackAliasFacts(resolvedTargetRoot)

  if (!shellSpec) {
    return {
      schemaVersion: 'legacy-runtime-peer-resolution.v1',
      status: 'unknown',
      shellDeclaredSpec: '',
      shellPackagePath: '',
      resolvedPackages: [],
      criticalExports: [],
      aliasFacts: { packageAliases, webpack: webpackAliases },
      blockingReasons: ['target package.json does not declare @hiui-design/typical-page-shells; peer/export resolution cannot be proven yet'],
    }
  }

  const shellPackage = await readPackageJsonForModule(targetRequire, SHELL_PACKAGE_NAME)
  if (!shellPackage.ok) {
    return {
      schemaVersion: 'legacy-runtime-peer-resolution.v1',
      status: 'blocked',
      shellDeclaredSpec: shellSpec,
      shellPackagePath: '',
      resolvedPackages: [],
      criticalExports: [],
      aliasFacts: { packageAliases, webpack: webpackAliases },
      blockingReasons: [`Cannot resolve ${SHELL_PACKAGE_NAME} from target project: ${shellPackage.error}`],
    }
  }

  const shellRequire = createRequire(shellPackage.packageJsonPath)
  const peerDependencies = shellPackage.packageJson?.peerDependencies || {}
  const resolvedPackages = []
  const blockingReasons = []

  for (const [packageName, requestedRange] of Object.entries(peerDependencies)) {
    const resolved = await readPackageJsonForModule(shellRequire, packageName)
    if (!resolved.ok) {
      resolvedPackages.push({ packageName, requestedRange, status: 'blocked', version: '', packagePath: '', blockingReason: resolved.error })
      blockingReasons.push(`Cannot resolve peer ${packageName}: ${resolved.error}`)
      continue
    }
    resolvedPackages.push({
      packageName,
      requestedRange,
      status: 'ready',
      version: String(resolved.packageJson?.version || ''),
      packagePath: normalizeRelativePath(path.relative(targetRoot, resolved.packageJsonPath)),
      blockingReason: '',
    })
  }

  const criticalExports = []
  for (const criticalExport of CRITICAL_EXPORTS) {
    if (criticalExport.whenPackageResolves) {
      const candidate = await readPackageJsonForModule(shellRequire, criticalExport.whenPackageResolves)
      if (!candidate.ok) continue
    }
    const result = await resolveCriticalExport(shellRequire, resolvedTargetRoot, criticalExport)
    criticalExports.push(result)
    if (result.status === 'blocked') blockingReasons.push(result.blockingReason)
  }

  return {
    schemaVersion: 'legacy-runtime-peer-resolution.v1',
    status: blockingReasons.length > 0 ? 'blocked' : 'ready',
    shellDeclaredSpec: shellSpec,
    shellPackagePath: normalizeRelativePath(path.relative(resolvedTargetRoot, shellPackage.packageJsonPath)),
    resolvedPackages,
    criticalExports,
    aliasFacts: { packageAliases, webpack: webpackAliases },
    blockingReasons,
  }
}
