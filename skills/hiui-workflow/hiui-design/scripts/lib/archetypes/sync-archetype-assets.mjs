import fs from 'node:fs/promises'
import path from 'node:path'
import {
  buildSyncPairsFromManifest,
  loadSyncManifestForModeProfile,
  manifestPathIsExcluded,
  normalizeSyncProfile,
} from './sync-profile-manifest.mjs'

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
}

async function fileContentMatches(sourcePath, destPath) {
  if (!(await pathExists(destPath))) return false
  const [sourceContent, destContent] = await Promise.all([
    fs.readFile(sourcePath),
    fs.readFile(destPath),
  ])
  return sourceContent.equals(destContent)
}

function isIgnoredSyncPath(relativePath, extraIgnorePatterns = []) {
  const normalized = relativePath.split(path.sep).join('/')
  return (
    normalized === 'core/outputs' ||
    normalized.startsWith('core/outputs/') ||
    manifestPathIsExcluded(normalized, extraIgnorePatterns)
  )
}

async function copyTree({ sourceRoot, destRoot, ignoreRootPath = sourceRoot, force = false, extraIgnorePatterns = [] }) {
  if (!(await pathExists(sourceRoot))) {
    return []
  }

  const copied = []
  const entries = await fs.readdir(sourceRoot, { withFileTypes: true })
  await ensureDir(destRoot)

  for (const entry of entries) {
    if (entry.name === '.DS_Store') {
      continue
    }

    const sourcePath = path.join(sourceRoot, entry.name)
    const destPath = path.join(destRoot, entry.name)
    const relativePath = path.relative(ignoreRootPath, sourcePath)

    if (isIgnoredSyncPath(relativePath, extraIgnorePatterns)) {
      continue
    }

    if (entry.isDirectory()) {
      copied.push(
        ...(await copyTree({ sourceRoot: sourcePath, destRoot: destPath, ignoreRootPath, force, extraIgnorePatterns }))
      )
      continue
    }

    if (!entry.isFile()) continue

    if (!force && (await fileContentMatches(sourcePath, destPath))) {
      continue
    }

    await ensureDir(path.dirname(destPath))
    await fs.copyFile(sourcePath, destPath)
    copied.push(destPath)
  }

  return copied
}

async function copyPath({ sourcePath, destPath, ignoreRootPath = sourcePath, force = false, extraIgnorePatterns = [] }) {
  if (!(await pathExists(sourcePath))) {
    return []
  }

  const sourceStats = await fs.lstat(sourcePath)

  if (sourceStats.isDirectory()) {
    return copyTree({ sourceRoot: sourcePath, destRoot: destPath, ignoreRootPath, force, extraIgnorePatterns })
  }

  if (!sourceStats.isFile()) {
    return []
  }

  if (!force && (await fileContentMatches(sourcePath, destPath))) {
    return []
  }

  await ensureDir(path.dirname(destPath))
  await fs.copyFile(sourcePath, destPath)
  return [destPath]
}

async function removeStaleIgnoredPaths(destRoot) {
  const cleanedPaths = []
  const staleCoreOutputsPath = path.join(destRoot, 'core', 'outputs')

  if (await pathExists(staleCoreOutputsPath)) {
    await fs.rm(staleCoreOutputsPath, { recursive: true, force: true })
    cleanedPaths.push(staleCoreOutputsPath)
  }

  return cleanedPaths
}

function buildWorkbenchSyncPairs(skillRoot, destRoot) {
  return [
    {
      sourcePath: path.join(skillRoot, 'SKILL.md'),
      destPath: path.join(destRoot, 'SKILL.md'),
    },
    {
      sourcePath: path.join(skillRoot, 'agents'),
      destPath: path.join(destRoot, 'agents'),
    },
    {
      sourcePath: path.join(skillRoot, 'archetypes'),
      destPath: path.join(destRoot, 'archetypes'),
    },
    {
      sourcePath: path.join(skillRoot, 'config'),
      destPath: path.join(destRoot, 'config'),
    },
    {
      sourcePath: path.join(skillRoot, 'core'),
      destPath: path.join(destRoot, 'core'),
    },
    {
      sourcePath: path.join(skillRoot, 'docs'),
      destPath: path.join(destRoot, 'docs'),
    },
    {
      sourcePath: path.join(skillRoot, 'examples'),
      destPath: path.join(destRoot, 'examples'),
    },
    {
      sourcePath: path.join(skillRoot, 'manifests'),
      destPath: path.join(destRoot, 'manifests'),
    },
    {
      sourcePath: path.join(skillRoot, 'reference'),
      destPath: path.join(destRoot, 'reference'),
    },
    {
      sourcePath: path.join(skillRoot, 'rules'),
      destPath: path.join(destRoot, 'rules'),
    },
    {
      sourcePath: path.join(skillRoot, 'schemas'),
      destPath: path.join(destRoot, 'schemas'),
    },
    {
      sourcePath: path.join(skillRoot, 'scripts'),
      destPath: path.join(destRoot, 'scripts'),
    },
    {
      sourcePath: path.join(skillRoot, 'templates'),
      destPath: path.join(destRoot, 'templates'),
    },
    {
      sourcePath: path.join(skillRoot, 'vendor'),
      destPath: path.join(destRoot, 'vendor'),
    },
  ]
}

export async function syncArchetypeAssets({ skillRoot, targetRoot, mode, force = false, syncProfile = 'minimal' }) {
  const destRoot = path.join(targetRoot, '.local-context', 'hiui-design')
  const normalizedSyncProfile = normalizeSyncProfile(syncProfile)
  const manifestResult = await loadSyncManifestForModeProfile(skillRoot, { mode, syncProfile: normalizedSyncProfile })
  const syncPairs = manifestResult
    ? await buildSyncPairsFromManifest({ skillRoot, destRoot, manifest: manifestResult.manifest })
    : buildWorkbenchSyncPairs(skillRoot, destRoot)
  const extraIgnorePatterns = manifestResult?.manifest.exclude || []

  const cleanedPaths = await removeStaleIgnoredPaths(destRoot)
  const copiedFiles = []
  for (const pair of syncPairs) {
    copiedFiles.push(...(await copyPath({ ...pair, ignoreRootPath: skillRoot, force, extraIgnorePatterns })))
  }

  return {
    mode,
    syncProfile: normalizedSyncProfile,
    manifestPath: manifestResult?.manifestPath || '',
    copiedFiles,
    cleanedPaths,
    destRoot,
  }
}
