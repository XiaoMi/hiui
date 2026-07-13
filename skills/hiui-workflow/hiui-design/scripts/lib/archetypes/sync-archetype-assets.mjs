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

async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
}

async function copyTree({ sourceRoot, destRoot, force = false }) {
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

    if (entry.isDirectory()) {
      copied.push(...(await copyTree({ sourceRoot: sourcePath, destRoot: destPath, force })))
      continue
    }

    if (!entry.isFile()) continue

    if (!force && (await pathExists(destPath))) {
      continue
    }

    await ensureDir(path.dirname(destPath))
    await fs.copyFile(sourcePath, destPath)
    copied.push(destPath)
  }

  return copied
}

async function copyPath({ sourcePath, destPath, force = false }) {
  if (!(await pathExists(sourcePath))) {
    return []
  }

  const sourceStats = await fs.lstat(sourcePath)

  if (sourceStats.isDirectory()) {
    return copyTree({ sourceRoot: sourcePath, destRoot: destPath, force })
  }

  if (!sourceStats.isFile()) {
    return []
  }

  if (!force && (await pathExists(destPath))) {
    return []
  }

  await ensureDir(path.dirname(destPath))
  await fs.copyFile(sourcePath, destPath)
  return [destPath]
}

export async function syncArchetypeAssets({ skillRoot, targetRoot, mode, force = false }) {
  const syncPairs = [
    {
      sourcePath: path.join(skillRoot, 'SKILL.md'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'SKILL.md'),
    },
    {
      sourcePath: path.join(skillRoot, 'agents'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'agents'),
    },
    {
      sourcePath: path.join(skillRoot, 'archetypes'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'archetypes'),
    },
    {
      sourcePath: path.join(skillRoot, 'config'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'config'),
    },
    {
      sourcePath: path.join(skillRoot, 'docs'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'docs'),
    },
    {
      sourcePath: path.join(skillRoot, 'examples'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'examples'),
    },
    {
      sourcePath: path.join(skillRoot, 'manifests'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'manifests'),
    },
    {
      sourcePath: path.join(skillRoot, 'reference'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'reference'),
    },
    {
      sourcePath: path.join(skillRoot, 'rules'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'rules'),
    },
    {
      sourcePath: path.join(skillRoot, 'schemas'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'schemas'),
    },
    {
      sourcePath: path.join(skillRoot, 'scripts'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'scripts'),
    },
    {
      sourcePath: path.join(skillRoot, 'templates'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'templates'),
    },
    {
      sourcePath: path.join(skillRoot, 'vendor'),
      destPath: path.join(targetRoot, '.local-context', 'hiui-design', 'vendor'),
    },
  ]

  const copiedFiles = []
  for (const pair of syncPairs) {
    copiedFiles.push(...(await copyPath({ ...pair, force })))
  }

  return {
    mode,
    copiedFiles,
    destRoot: path.join(targetRoot, '.local-context', 'hiui-design'),
  }
}
