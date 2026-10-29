import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import {
  normalizeInstallRelativePath,
  shouldExcludeInstallPath,
} from './install-path-policy.mjs'

const CONTEXT_SYNC_MANIFEST_FILENAME = '.hiui-design-context-sync-manifest.json'

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

function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

function parseJsonBuffer(buffer) {
  try {
    return JSON.parse(buffer.toString('utf8'))
  } catch {
    return null
  }
}

async function readJson(targetPath) {
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

export async function loadInstallContract(skillRoot) {
  const contractPath = path.join(skillRoot, 'skill.manifest.json')
  const contract = await readJson(contractPath)
  const requiredPaths = Array.isArray(contract.requiredPaths) ? contract.requiredPaths : []

  if (requiredPaths.length === 0) {
    throw new Error(`Install contract ${contractPath} is missing requiredPaths`)
  }

  return {
    contractPath,
    requiredPaths,
  }
}

async function collectFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath)))
      continue
    }

    if (entry.isFile()) {
      files.push(absolutePath)
    }
  }

  return files
}

async function expandRequiredPaths(skillRoot, requiredPaths) {
  const files = []

  for (const relativePath of requiredPaths) {
    const sourcePath = path.join(skillRoot, relativePath)
    if (!(await pathExists(sourcePath))) {
      throw new Error(`Install contract references a missing source path: ${sourcePath}`)
    }

    const stat = await fs.stat(sourcePath)
    if (stat.isDirectory()) {
      files.push(...(await collectFiles(sourcePath)))
      continue
    }

    if (stat.isFile()) {
      files.push(sourcePath)
      continue
    }

    throw new Error(`Unsupported install-contract entry type: ${sourcePath}`)
  }

  return [...new Set(files)]
    .filter((sourcePath) => !shouldExcludeInstallPath(path.relative(skillRoot, sourcePath)))
    .sort((a, b) => a.localeCompare(b))
}

async function readSyncManifest(targetContextRoot) {
  const manifestPath = path.join(targetContextRoot, CONTEXT_SYNC_MANIFEST_FILENAME)
  if (!(await pathExists(manifestPath))) {
    return {
      manifestPath,
      data: {
        version: 1,
        files: {},
      },
    }
  }

  try {
    return {
      manifestPath,
      data: JSON.parse(await fs.readFile(manifestPath, 'utf8')),
    }
  } catch {
    return {
      manifestPath,
      data: {
        version: 1,
        files: {},
      },
    }
  }
}

async function writeSyncManifest(manifestPath, manifestData) {
  await ensureDir(path.dirname(manifestPath))
  await fs.writeFile(manifestPath, `${JSON.stringify(manifestData, null, 2)}\n`, 'utf8')
}

async function copyFileWithPolicy({
  sourcePath,
  targetPath,
  relativePath,
  force,
  manifestFiles,
}) {
  const sourceBuffer = await fs.readFile(sourcePath)
  const sourceHash = hashBuffer(sourceBuffer)
  const targetExists = await pathExists(targetPath)
  const previousSyncedHash = manifestFiles[relativePath]?.sourceHash ?? ''

  if (!targetExists) {
    await ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, sourceBuffer)
    manifestFiles[relativePath] = { sourceHash }
    return { status: 'created', targetPath, relativePath }
  }

  const targetBuffer = await fs.readFile(targetPath)
  const targetHash = hashBuffer(targetBuffer)

  if (targetHash === sourceHash) {
    manifestFiles[relativePath] = { sourceHash }
    return { status: 'up-to-date', targetPath, relativePath }
  }

  if (force) {
    await ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, sourceBuffer)
    manifestFiles[relativePath] = { sourceHash }
    return { status: 'overwritten', targetPath, relativePath }
  }

  if (previousSyncedHash && previousSyncedHash === targetHash) {
    await ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, sourceBuffer)
    manifestFiles[relativePath] = { sourceHash }
    return { status: 'refreshed', targetPath, relativePath }
  }

  if (!previousSyncedHash && relativePath === '.context.jsonc') {
    const sourceContext = parseJsonBuffer(sourceBuffer)
    const targetContext = parseJsonBuffer(targetBuffer)
    const sourceName = String(sourceContext?.name || '').trim()
    const targetName = String(targetContext?.name || '').trim()
    const sourceContextType = String(sourceContext?.contextType || '').trim()
    const targetContextType = String(targetContext?.contextType || '').trim()

    // lcm/bootstrap may pre-create a minimal hiui-design .context.jsonc before the
    // full project-local context is materialized. Treat that placeholder as safe
    // to refresh so first-time ensure/apply can complete without --force-context-sync.
    if (
      sourceName &&
      sourceName === targetName &&
      (!targetContextType || !sourceContextType || targetContextType === sourceContextType)
    ) {
      await ensureDir(path.dirname(targetPath))
      await fs.writeFile(targetPath, sourceBuffer)
      manifestFiles[relativePath] = { sourceHash }
      return { status: 'refreshed', targetPath, relativePath }
    }
  }

  return {
    status: previousSyncedHash ? 'conflict' : 'untracked-existing',
    targetPath,
    relativePath,
  }
}

export async function syncProjectContext({
  skillRoot,
  targetRoot,
  contextDirName = 'hiui-design',
  force = false,
}) {
  const targetContextRoot = path.join(targetRoot, '.local-context', contextDirName)
  const resolvedSkillRoot = path.resolve(skillRoot)
  const resolvedTargetContextRoot = path.resolve(targetContextRoot)

  if (resolvedSkillRoot === resolvedTargetContextRoot) {
    return {
      status: 'already-materialized',
      targetContextRoot: resolvedTargetContextRoot,
      summary: {
        created: 0,
        refreshed: 0,
        overwritten: 0,
        'up-to-date': 0,
        conflict: 0,
        'untracked-existing': 0,
      },
      syncManifestPath: path.join(resolvedTargetContextRoot, CONTEXT_SYNC_MANIFEST_FILENAME),
      copiedFiles: [],
      contractPath: path.join(skillRoot, 'skill.manifest.json'),
    }
  }

  const { contractPath, requiredPaths } = await loadInstallContract(skillRoot)
  const sourceFiles = await expandRequiredPaths(skillRoot, requiredPaths)
  const { manifestPath, data: manifestData } = await readSyncManifest(targetContextRoot)
  const results = []

  for (const sourcePath of sourceFiles) {
    const relativePath = normalizeInstallRelativePath(path.relative(skillRoot, sourcePath))
    const targetPath = path.join(targetContextRoot, relativePath)
    results.push(
      await copyFileWithPolicy({
        sourcePath,
        targetPath,
        relativePath,
        force,
        manifestFiles: manifestData.files,
      }),
    )
  }

  await writeSyncManifest(manifestPath, manifestData)

  const summary = results.reduce(
    (acc, item) => {
      acc[item.status] += 1
      return acc
    },
    {
      created: 0,
      refreshed: 0,
      overwritten: 0,
      'up-to-date': 0,
      conflict: 0,
      'untracked-existing': 0,
    },
  )

  const hasConflicts = summary.conflict > 0 || summary['untracked-existing'] > 0
  const hasWrites = summary.created > 0 || summary.refreshed > 0 || summary.overwritten > 0

  return {
    status: hasConflicts ? 'completed-with-conflicts' : hasWrites ? 'materialized' : 'up-to-date',
    targetContextRoot,
    summary,
    syncManifestPath: manifestPath,
    copiedFiles: results
      .filter((item) => ['created', 'refreshed', 'overwritten'].includes(item.status))
      .map((item) => item.relativePath),
    contractPath,
  }
}
