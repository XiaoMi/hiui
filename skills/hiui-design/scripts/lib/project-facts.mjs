import fs from 'node:fs/promises'
import path from 'node:path'
import { buildProjectCapabilities } from './asset-control-surface.mjs'
import { detectHostProfile } from './detect-host-profile.mjs'
import { detectLegacyHostFamily } from './legacy-host-family-registry.mjs'

const HOST_PROFILE_FINGERPRINT_PATHS = [
  'package.json',
  'src',
  'vite.config.ts',
  'vite.config.tsx',
  'vite.config.mts',
  'vite.config.js',
  'vite.config.jsx',
  'vite.config.mjs',
  'vite.config.cjs',
  'vite.config.cts',
  'next.config.ts',
  'next.config.js',
  'next.config.mjs',
  'next.config.cjs',
  '.umirc.ts',
  '.umirc.js',
  'config/config.ts',
  'config/config.js',
  'app/layout.tsx',
  'app/layout.ts',
  'src/app/layout.tsx',
  'src/app/layout.ts',
  'pages/_app.tsx',
  'pages/_app.ts',
  'src/pages/_app.tsx',
  'src/pages/_app.ts',
  'src/app.tsx',
  'src/app.ts',
  'src/layouts',
  'src/pages',
  'src/router',
]

const LEGACY_HOST_FINGERPRINT_PATHS = [
  'package.json',
  'src',
  'build',
  '.local-context/hiui-design/outputs/project-mode.json',
  '.local-context/hiui-design/outputs/legacy-host-boundary.json',
]

const PROJECT_CAPABILITIES_FINGERPRINT_PATHS = [
  'package.json',
  'src',
  'src/pages',
  'src/views',
  'src/router',
  'src/routes.tsx',
  'src/routes.ts',
  'src/routes.jsx',
  'src/translation',
  'src/i18n',
  'src/locales',
  '.local-context/hiui-design/outputs/project-mode.json',
  '.local-context/hiui-design/outputs/project-page-component-registry.json',
]

const PROJECT_FACTS_SCHEMA_VERSION = 'project-fact-cache.v1'

function normalizeModeKey(modeOverride = '') {
  const value = String(modeOverride || '').trim()
  if (!value || value === 'auto') {
    return 'auto'
  }
  return value
}

async function pathStamp(targetPath) {
  try {
    const stat = await fs.stat(targetPath)
    return {
      exists: true,
      kind: stat.isDirectory() ? 'directory' : 'file',
      mtimeMs: Math.trunc(stat.mtimeMs),
      size: stat.isFile() ? stat.size : 0,
    }
  } catch {
    return {
      exists: false,
      kind: 'missing',
      mtimeMs: 0,
      size: 0,
    }
  }
}

async function buildFingerprint(targetRoot, fingerprintPaths = []) {
  const entries = {}
  for (const rawPath of Array.from(new Set(fingerprintPaths.filter(Boolean)))) {
    const absolutePath = path.isAbsolute(rawPath) ? rawPath : path.join(targetRoot, rawPath)
    const label = path.isAbsolute(rawPath) ? rawPath : rawPath.replace(/\\/g, '/')
    entries[label] = await pathStamp(absolutePath)
  }
  return entries
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return null
  }
}

async function cacheRootExists(targetRoot) {
  try {
    const stat = await fs.stat(path.join(targetRoot, '.local-context', 'hiui-design'))
    return stat.isDirectory()
  } catch {
    return false
  }
}

function cacheFilePath(targetRoot, factId, modeKey = '') {
  const fileName = modeKey && modeKey !== 'auto' ? `${factId}.${modeKey}.json` : `${factId}.json`
  return path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'project-facts', fileName)
}

async function loadCachedProjectFact({
  targetRoot,
  factId,
  modeKey = '',
  fingerprintPaths = [],
  compute,
}) {
  const fingerprint = await buildFingerprint(targetRoot, fingerprintPaths)
  const usePersistentCache = await cacheRootExists(targetRoot)
  const cachePath = cacheFilePath(targetRoot, factId, modeKey)

  if (usePersistentCache) {
    const cached = await readJsonIfExists(cachePath)
    if (
      cached?.schemaVersion === PROJECT_FACTS_SCHEMA_VERSION &&
      JSON.stringify(cached.fingerprint || {}) === JSON.stringify(fingerprint)
    ) {
      return cached.payload
    }
  }

  const payload = await compute()

  if (usePersistentCache) {
    await fs.mkdir(path.dirname(cachePath), { recursive: true })
    await fs.writeFile(
      cachePath,
      `${JSON.stringify(
        {
          schemaVersion: PROJECT_FACTS_SCHEMA_VERSION,
          factId,
          modeKey,
          fingerprint,
          payload,
        },
        null,
        2
      )}\n`,
      'utf8'
    )
  }

  return payload
}

export async function loadHostProfileFact({ targetRoot, options = {} }) {
  return loadCachedProjectFact({
    targetRoot,
    factId: 'host-profile',
    fingerprintPaths: HOST_PROFILE_FINGERPRINT_PATHS,
    compute: () => detectHostProfile(targetRoot, options),
  })
}

export async function loadLegacyHostFamilyFact({ targetRoot, skillRoot, modeOverride = '' }) {
  const modeKey = normalizeModeKey(modeOverride)
  return loadCachedProjectFact({
    targetRoot,
    factId: 'legacy-host-family',
    modeKey,
    fingerprintPaths: LEGACY_HOST_FINGERPRINT_PATHS,
    compute: () => detectLegacyHostFamily({ targetRoot, skillRoot, modeOverride }),
  })
}

export async function loadProjectCapabilitiesFact({
  targetRoot,
  skillRoot,
  modeOverride = '',
  legacyHostFamily = null,
}) {
  const modeKey = normalizeModeKey(modeOverride)
  const fingerprintPaths = [
    ...PROJECT_CAPABILITIES_FINGERPRINT_PATHS,
    path.join(skillRoot, 'rules', 'page-mold-registry.json'),
    path.join(skillRoot, 'rules', 'adapter-registry.json'),
    path.join(skillRoot, 'rules', 'page-component-registry.json'),
    path.join(skillRoot, 'rules', 'common.page-types.json'),
  ]

  return loadCachedProjectFact({
    targetRoot,
    factId: 'project-capabilities',
    modeKey,
    fingerprintPaths,
    compute: () =>
      buildProjectCapabilities({
        targetRoot,
        skillRoot,
        modeOverride,
        legacyHostFamilyOverride: legacyHostFamily,
      }),
  })
}
