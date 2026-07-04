import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { matchesAnyPattern, normalizeRelativePath } from './distribution-rules.mjs'

const defaultManifestPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'distribution-manifest.json',
)

async function readDistributionManifest(manifestPath = defaultManifestPath) {
  const rawText = await fs.readFile(manifestPath, 'utf8')
  const manifest = JSON.parse(rawText)
  validateDistributionManifest(manifest)
  return manifest
}

function assertStringArray(value, label) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string' || !entry.trim())) {
    throw new Error(`${label} must be an array of non-empty strings`)
  }
}

function validateDistributionManifest(manifest) {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error('distribution manifest must be an object')
  }
  if (manifest.version !== 1) {
    throw new Error('distribution manifest version must be 1')
  }
  if (!manifest.targets || typeof manifest.targets !== 'object') {
    throw new Error('distribution manifest targets are required')
  }

  for (const targetName of ['runtime-mirror', 'team-package', 'open-source-package', 'open-source-dev-bundle']) {
    const target = manifest.targets[targetName]
    if (!target || typeof target !== 'object') {
      throw new Error(`distribution target missing: ${targetName}`)
    }
    assertStringArray(target.include, `${targetName}.include`)
    assertStringArray(target.exclude, `${targetName}.exclude`)
    assertStringArray(target.required, `${targetName}.required`)
    assertStringArray(target.forbidden, `${targetName}.forbidden`)
    if (target.manualEditsAllowed !== false) {
      throw new Error(`${targetName}.manualEditsAllowed must be false`)
    }
  }

  return true
}

function getDistributionTarget(manifest, targetName) {
  const target = manifest.targets?.[targetName]
  if (!target) {
    throw new Error(`Unknown distribution target: ${targetName}`)
  }
  return target
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function walkFiles(root, relativeDir = '') {
  const currentDir = path.join(root, relativeDir)
  const entries = await fs.readdir(currentDir, { withFileTypes: true }).catch((error) => {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return []
    }
    throw error
  })
  const files = []

  for (const entry of entries) {
    const relativePath = relativeDir ? path.join(relativeDir, entry.name) : entry.name
    const normalized = normalizeRelativePath(relativePath)

    if (entry.isDirectory()) {
      if (normalized === '.git' || normalized.startsWith('.git/')) {
        continue
      }
      files.push(...(await walkFiles(root, relativePath)))
      continue
    }

    if (entry.isFile() || entry.isSymbolicLink()) {
      files.push(normalized)
    }
  }

  return files.sort((left, right) => left.localeCompare(right))
}

function selectFilesForTarget(files, target) {
  return files.filter((file) => {
    if (!matchesAnyPattern(file, target.include)) return false
    if (matchesAnyPattern(file, target.exclude)) return false
    return true
  })
}

async function assertTargetRequirements(root, targetName, target, selectedFiles) {
  const selectedSet = new Set(selectedFiles.map(normalizeRelativePath))
  const missing = []
  const forbidden = []

  for (const requiredPath of target.required) {
    const normalized = normalizeRelativePath(requiredPath)
    if (selectedSet.has(normalized)) {
      continue
    }

    const hasChild = selectedFiles.some((file) => file.startsWith(`${normalized}/`))
    if (!hasChild) {
      missing.push(normalized)
    }
  }

  for (const file of selectedFiles) {
    if (matchesAnyPattern(file, target.forbidden)) {
      forbidden.push(file)
    }
  }

  if (missing.length || forbidden.length) {
    throw new Error(JSON.stringify({ target: targetName, missing, forbidden }, null, 2))
  }
}

function getTargetExcludePatterns(manifest, targetName) {
  return [...getDistributionTarget(manifest, targetName).exclude]
}

export {
  assertTargetRequirements,
  getDistributionTarget,
  getTargetExcludePatterns,
  readDistributionManifest,
  selectFilesForTarget,
  validateDistributionManifest,
  walkFiles,
}
