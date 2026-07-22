import fs from 'node:fs/promises'
import path from 'node:path'

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return null
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

function hasLegacyEsSubpath(exportsField) {
  if (!exportsField) return true

  if (typeof exportsField === 'string') {
    return false
  }

  if (Array.isArray(exportsField)) {
    return exportsField.some((item) => hasLegacyEsSubpath(item))
  }

  if (typeof exportsField === 'object') {
    return Object.keys(exportsField).some((key) => key === './es' || key.startsWith('./es/'))
  }

  return false
}

export function parseLeadingMajorVersion(spec) {
  if (!spec) return 0
  const match = String(spec).match(/(\d+)/)
  return match ? Number(match[1]) : 0
}

export async function collectLegacyHiUiEsImports(rootDir) {
  const hits = []

  async function walk(currentDir) {
    if (!(await pathExists(currentDir))) return

    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const absPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        await walk(absPath)
        continue
      }

      if (!entry.isFile() || !/\.[cm]?[jt]sx?$/.test(entry.name)) {
        continue
      }

      const raw = await fs.readFile(absPath, 'utf8')
      const matches = [
        ...raw.matchAll(
          /(?:import|export)\s+[\s\S]*?\s+from\s+['"](@hi-ui\/hiui\/es(?:\/[^'"]+)?)['"]/g
        ),
        ...raw.matchAll(/import\s*\(\s*['"](@hi-ui\/hiui\/es(?:\/[^'"]+)?)['"]\s*\)/g),
        ...raw.matchAll(/require\(\s*['"](@hi-ui\/hiui\/es(?:\/[^'"]+)?)['"]\s*\)/g),
      ]

      if (matches.length > 0) {
        hits.push({
          filePath: absPath,
          specifiers: [...new Set(matches.map((match) => match[1]).filter(Boolean))],
        })
      }
    }
  }

  await walk(rootDir)
  return hits
}

export async function inspectInstalledRootRuntime({ targetRoot, pkg }) {
  const runtimeDeps = ['react', 'react-dom', '@hi-ui/hiui']
  const installedPackages = {}
  const driftItems = []

  for (const depName of runtimeDeps) {
    const packageJsonPath = path.join(targetRoot, 'node_modules', ...depName.split('/'), 'package.json')
    const installedPkg = await readJsonIfExists(packageJsonPath)
    const declaredSpec =
      pkg?.dependencies?.[depName] ||
      pkg?.devDependencies?.[depName] ||
      pkg?.peerDependencies?.[depName] ||
      ''

    const installedVersion = installedPkg?.version ?? ''
    const declaredMajor = parseLeadingMajorVersion(declaredSpec)
    const installedMajor = parseLeadingMajorVersion(installedVersion)

    const info = {
      depName,
      declaredSpec,
      declaredMajor,
      exists: Boolean(installedPkg),
      installedVersion,
      installedMajor,
      packageJsonPath,
      supportsLegacyEsSubpath:
        depName === '@hi-ui/hiui' ? hasLegacyEsSubpath(installedPkg?.exports) : true,
    }

    installedPackages[depName] = info

    if (!declaredSpec || !installedVersion || declaredMajor === 0 || installedMajor === 0) {
      continue
    }

    if (declaredMajor !== installedMajor) {
      driftItems.push({
        depName,
        declaredSpec,
        installedVersion,
        packageJsonPath,
        reason: `declared ${declaredSpec}, installed ${installedVersion}`,
      })
    }
  }

  return {
    installedPackages,
    driftItems,
  }
}

export function buildLegacyRuntimeGuardIssues({
  legacyHostRuntime,
  installedRootRuntime,
  legacyHiUiEsImports = [],
}) {
  const issues = []
  const installedReact = installedRootRuntime.installedPackages.react
  const installedReactDom = installedRootRuntime.installedPackages['react-dom']
  const installedHiUi = installedRootRuntime.installedPackages['@hi-ui/hiui']
  const legacyImportCount = legacyHiUiEsImports.length

  if (legacyHostRuntime?.incompatible) {
    for (const drift of installedRootRuntime.driftItems) {
      issues.push({
        id: `legacy-runtime-drift:${drift.depName}`,
        depName: drift.depName,
        summary: `${drift.depName} root runtime still matches the legacy host contract after installation`,
        detail: `${drift.reason}. The current install tree is no longer aligned with package.json for this legacy host. Installed package: ${drift.packageJsonPath}`,
      })
    }
  }

  if (
    legacyImportCount > 0 &&
    installedHiUi?.exists &&
    !installedHiUi.supportsLegacyEsSubpath
  ) {
    issues.push({
      id: 'legacy-hiui-es-abi',
      depName: '@hi-ui/hiui',
      summary:
        'legacy @hi-ui/hiui/es consumers still have a compatible root package ABI',
      detail: `${legacyImportCount} source files still import @hi-ui/hiui/es*, but node_modules/@hi-ui/hiui is ${installedHiUi.installedVersion} and no longer exposes ./es subpaths. Installed package: ${installedHiUi.packageJsonPath}`,
    })
  }

  if (
    legacyHostRuntime?.incompatible &&
    installedReact?.exists &&
    installedReact.declaredMajor > 0 &&
    installedReact.installedMajor >= 18 &&
    installedReact.declaredMajor < 18
  ) {
    issues.push({
      id: 'legacy-react-root-major',
      depName: 'react',
      summary: 'react root runtime is still pinned to the host-managed legacy major version',
      detail: `package.json declares ${installedReact.declaredSpec}, but node_modules/react is ${installedReact.installedVersion}. For legacy singleton hosts, this upgrades the root runtime contract instead of keeping hiui5 isolated to an alias lane. Installed package: ${installedReact.packageJsonPath}`,
    })
  }

  if (
    legacyHostRuntime?.incompatible &&
    installedReactDom?.exists &&
    installedReactDom.declaredMajor > 0 &&
    installedReactDom.installedMajor >= 18 &&
    installedReactDom.declaredMajor < 18
  ) {
    issues.push({
      id: 'legacy-react-dom-root-major',
      depName: 'react-dom',
      summary: 'react-dom root runtime is still pinned to the host-managed legacy major version',
      detail: `package.json declares ${installedReactDom.declaredSpec}, but node_modules/react-dom is ${installedReactDom.installedVersion}. For legacy singleton hosts, this upgrades the shared root runtime and can break the remote before any generated page renders. Installed package: ${installedReactDom.packageJsonPath}`,
    })
  }

  return issues
}

export function summarizeLegacyImportHits(targetRoot, hits) {
  return hits
    .slice(0, 6)
    .map((item) => `${path.relative(targetRoot, item.filePath)} <- ${item.specifiers.join(', ')}`)
    .join('; ')
}
