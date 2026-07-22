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

function isPathIgnored(targetPath, ignoredRoots) {
  return ignoredRoots.some(
    (ignoredRoot) =>
      targetPath === ignoredRoot || targetPath.startsWith(`${ignoredRoot}${path.sep}`)
  )
}

async function collectSourceFiles(rootDir, ignoredRoots = []) {
  if (!(await pathExists(rootDir))) return []

  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absPath = path.join(rootDir, entry.name)
    if (isPathIgnored(absPath, ignoredRoots)) {
      continue
    }

    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(absPath, ignoredRoots)))
      continue
    }

    if (entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name)) {
      files.push(absPath)
    }
  }

  return files
}

function hasDeclaredDependency(pkg, depName) {
  return Boolean(
    pkg?.dependencies?.[depName] ||
      pkg?.devDependencies?.[depName] ||
      pkg?.peerDependencies?.[depName]
  )
}

async function findFirstExistingPath(targetRoot, candidates) {
  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) {
      return absPath
    }
  }

  return ''
}

function getSourceMarkerSummary(targetRoot, markers) {
  return markers.map((marker) => path.relative(targetRoot, marker))
}

export async function detectHostProfile(targetRoot, options = {}) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  const pkg = await readJsonIfExists(packageJsonPath)
  const srcRoot = path.join(targetRoot, 'src')
  // Ignore synced smoke/reference assets so host-integration itself does not flip a greenfield app.
  const ignoredSourcePaths = (options.ignoreRelativePaths ?? [])
    .map((relativePath) => path.resolve(targetRoot, relativePath))
    .filter((ignoredPath) => ignoredPath.startsWith(srcRoot))
  const sourceFiles = await collectSourceFiles(srcRoot, ignoredSourcePaths)

  const viteConfigPath = await findFirstExistingPath(targetRoot, [
    'vite.config.ts',
    'vite.config.tsx',
    'vite.config.mts',
    'vite.config.js',
    'vite.config.jsx',
    'vite.config.mjs',
    'vite.config.cjs',
    'vite.config.cts',
  ])
  const nextConfigPath = await findFirstExistingPath(targetRoot, [
    'next.config.ts',
    'next.config.js',
    'next.config.mjs',
    'next.config.cjs',
  ])
  const nextAppLayoutPath = await findFirstExistingPath(targetRoot, [
    'app/layout.tsx',
    'app/layout.ts',
    'src/app/layout.tsx',
    'src/app/layout.ts',
  ])
  const nextPagesAppPath = await findFirstExistingPath(targetRoot, [
    'pages/_app.tsx',
    'pages/_app.ts',
    'src/pages/_app.tsx',
    'src/pages/_app.ts',
  ])
  const umiConfigPath = await findFirstExistingPath(targetRoot, [
    '.umirc.ts',
    '.umirc.js',
    'config/config.ts',
    'config/config.js',
  ])
  const umiAppPath = await findFirstExistingPath(targetRoot, ['src/app.tsx', 'src/app.ts'])
  const umiLayoutPath = await findFirstExistingPath(targetRoot, [
    'src/layouts/index.tsx',
    'src/layouts/index.ts',
  ])

  const existingStructureCandidates = [
    'src/components/layout',
    'src/layouts',
    'src/features',
    'src/pages',
    'src/router',
    'src/routes.tsx',
    'src/routes.ts',
    'src/routes.jsx',
    'src/containers',
  ]
  const existingStructureMarkers = []
  for (const candidate of existingStructureCandidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) {
      existingStructureMarkers.push(absPath)
    }
  }

  const hasVite = Boolean(viteConfigPath) || hasDeclaredDependency(pkg, 'vite')
  const hasReactRouter = hasDeclaredDependency(pkg, 'react-router-dom')
  const hasUmi =
    Boolean(umiConfigPath) ||
    hasDeclaredDependency(pkg, 'umi') ||
    hasDeclaredDependency(pkg, 'max') ||
    hasDeclaredDependency(pkg, '@umijs/max')
  const hasNext = Boolean(nextConfigPath) || hasDeclaredDependency(pkg, 'next')
  const hasMicroFrontend =
    hasDeclaredDependency(pkg, 'qiankun') ||
    hasDeclaredDependency(pkg, '@umijs/plugin-qiankun') ||
    hasDeclaredDependency(pkg, 'micro-app') ||
    hasDeclaredDependency(pkg, 'single-spa')

  const sourceCount = sourceFiles.length
  const looksGreenfield =
    sourceCount <= 20 &&
    existingStructureMarkers.length <= 1 &&
    !hasMicroFrontend &&
    !hasUmi &&
    !hasNext

  let framework = 'unknown'
  let runtime = 'unknown'
  let routing = 'unknown'
  let adapterDoc = ''

  if (hasMicroFrontend) {
    framework = 'micro-frontend'
    runtime = hasVite ? 'vite-react' : 'custom-react'
    routing = hasReactRouter ? 'react-router' : hasUmi ? 'umi-router' : 'unknown'
    adapterDoc = 'docs/onboarding/host-adapters/micro-frontend.md'
  } else if (hasNext) {
    framework = nextAppLayoutPath ? 'next-app-router' : 'next-pages-router'
    runtime = 'next'
    routing = 'next-file-routing'
    adapterDoc = nextAppLayoutPath
      ? 'docs/onboarding/host-adapters/next-app-router.md'
      : 'docs/onboarding/host-adapters/next-pages-router.md'
  } else if (hasUmi) {
    framework = hasDeclaredDependency(pkg, '@umijs/max') || hasDeclaredDependency(pkg, 'max') ? 'umi-max' : 'umi'
    runtime = 'umi'
    routing = 'umi-router'
    adapterDoc = 'docs/onboarding/host-adapters/umi.md'
  } else if (hasVite && hasReactRouter && looksGreenfield) {
    framework = 'react-vite-router'
    runtime = 'vite-react'
    routing = 'react-router'
  } else if (hasVite && hasReactRouter) {
    framework = 'react-vite-custom-layout'
    runtime = 'vite-react'
    routing = 'react-router'
  } else if (hasVite) {
    framework = looksGreenfield ? 'react-vite' : 'react-vite-custom-layout'
    runtime = 'vite-react'
  } else if (hasReactRouter) {
    framework = 'react-router-custom'
    runtime = 'custom-react'
    routing = 'react-router'
  }

  const projectType = looksGreenfield ? 'greenfield' : 'existing-system'

  let recommendedMode = 'rules-only'
  let strategy = 'compat'
  let reason =
    'Target project already looks like an existing system. Keep the current layout/container contract, use non-gallery rules/reference assets as needed, and adapt inside the existing host. If the project later resolves to legacy-host-compatible, ordinary typical pages may still use planner-selected page components through project-certified carriers or runtimeAdapterProof-backed standard components.'

  if (projectType === 'greenfield' && ['react-vite-router', 'react-vite', 'unknown'].includes(framework)) {
    recommendedMode = 'host-integration'
    strategy = 'bring-shell'
    reason =
      'Target project looks like a greenfield React/Vite app. It is safe to bring the current project host shell, smoke gallery, and route examples together.'
  } else if (framework === 'micro-frontend') {
    recommendedMode = 'rules-only'
    strategy = 'compat'
    reason =
      'Micro-frontend hosts should keep their own container contract. Prefer rules-only and adapt portal slots, height chain, and package singletons inside the existing host.'
  } else if (
    ['umi-max', 'umi', 'next-app-router', 'next-pages-router'].includes(framework)
  ) {
    recommendedMode = 'rules-only'
    strategy = 'compat'
    reason =
      'The detected framework has its own routing/layout conventions. Keep the existing host and adapt typical pages inside it instead of syncing the current project shell wholesale.'
  }

  const adapterEntryHints = []
  if (framework === 'next-app-router') {
    if (nextAppLayoutPath) adapterEntryHints.push(path.relative(targetRoot, nextAppLayoutPath))
  } else if (framework === 'next-pages-router') {
    if (nextPagesAppPath) adapterEntryHints.push(path.relative(targetRoot, nextPagesAppPath))
  } else if (framework === 'umi-max' || framework === 'umi') {
    if (umiAppPath) adapterEntryHints.push(path.relative(targetRoot, umiAppPath))
    if (umiLayoutPath) adapterEntryHints.push(path.relative(targetRoot, umiLayoutPath))
    if (umiConfigPath) adapterEntryHints.push(path.relative(targetRoot, umiConfigPath))
  }

  return {
    packageJsonPath,
    pkg,
    projectType,
    framework,
    runtime,
    routing,
    sourceCount,
    existingStructureMarkers,
    existingStructureSummary: getSourceMarkerSummary(targetRoot, existingStructureMarkers),
    viteConfigPath,
    umiConfigPath,
    umiAppPath,
    umiLayoutPath,
    nextConfigPath,
    nextAppLayoutPath,
    nextPagesAppPath,
    hasMicroFrontend,
    recommendedMode,
    strategy,
    reason,
    adapterDoc,
    adapterEntryHints,
  }
}
