import fs from 'node:fs/promises'
import path from 'node:path'

import {
  getManagedPagesRegistryJsonPath,
  getManagedPagesRegistryMarkdownPath,
  syncManagedPageRegistry,
} from './managed-page-artifacts.mjs'
import { getRulesOnlyPageContractsDir } from './rules-only-page-contracts.mjs'

function toPosixPath(value) {
  return String(value || '').split(path.sep).join('/').replace(/\\/g, '/')
}

function normalizeRelativePath(targetRoot, filePath) {
  return toPosixPath(path.isAbsolute(filePath) ? path.relative(targetRoot, filePath) : filePath)
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
  try {
    return { exists: true, data: JSON.parse(await fs.readFile(filePath, 'utf8')), error: '' }
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      return { exists: false, data: null, error: '' }
    }
    return { exists: true, data: null, error: error instanceof Error ? error.message : String(error) }
  }
}

async function listContractJsonFiles(contractsDir) {
  try {
    return (await fs.readdir(contractsDir, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => path.join(contractsDir, entry.name))
      .sort((left, right) => left.localeCompare(right))
  } catch {
    return []
  }
}

async function copyFileToBackup({ targetRoot, sourcePath, backupRoot }) {
  if (!(await pathExists(sourcePath))) return ''
  const relativePath = normalizeRelativePath(targetRoot, sourcePath)
  const backupPath = path.join(backupRoot, relativePath)
  await fs.mkdir(path.dirname(backupPath), { recursive: true })
  await fs.copyFile(sourcePath, backupPath)
  return backupPath
}

function contractMarkdownPathForJson(jsonPath) {
  return jsonPath.replace(/\.json$/u, '.md')
}

export async function inspectStaleManagedOutputs(targetRoot) {
  const contractsDir = getRulesOnlyPageContractsDir(targetRoot)
  const registryJsonPath = getManagedPagesRegistryJsonPath(targetRoot)
  const registryMarkdownPath = getManagedPagesRegistryMarkdownPath(targetRoot)
  const contractJsonFiles = await listContractJsonFiles(contractsDir)
  const staleContracts = []
  const liveContractPagePaths = new Set()

  for (const contractPath of contractJsonFiles) {
    const parsed = await readJsonIfExists(contractPath)
    const relativeContractPath = normalizeRelativePath(targetRoot, contractPath)
    if (parsed.error || !parsed.data) {
      staleContracts.push({
        contractPath: relativeContractPath,
        markdownPath: normalizeRelativePath(targetRoot, contractMarkdownPathForJson(contractPath)),
        generatedPagePath: '',
        reason: parsed.error ? `invalid contract json: ${parsed.error}` : 'contract json is empty',
      })
      continue
    }

    const generatedPagePath = normalizeRelativePath(targetRoot, String(parsed.data.generatedPagePath || '').trim())
    if (!generatedPagePath) {
      staleContracts.push({
        contractPath: relativeContractPath,
        markdownPath: normalizeRelativePath(targetRoot, contractMarkdownPathForJson(contractPath)),
        generatedPagePath: '',
        reason: 'generatedPagePath is missing',
      })
      continue
    }

    if (!(await pathExists(path.join(targetRoot, generatedPagePath)))) {
      staleContracts.push({
        contractPath: relativeContractPath,
        markdownPath: normalizeRelativePath(targetRoot, contractMarkdownPathForJson(contractPath)),
        generatedPagePath,
        reason: `generated page source does not exist: ${generatedPagePath}`,
      })
      continue
    }

    liveContractPagePaths.add(generatedPagePath)
  }

  const registryJson = await readJsonIfExists(registryJsonPath)
  const registryEntries = Array.isArray(registryJson.data?.entries) ? registryJson.data.entries : []
  const staleRegistryEntries = []
  for (const entry of registryEntries) {
    const generatedPagePath = normalizeRelativePath(targetRoot, String(entry?.generatedPagePath || '').trim())
    if (!generatedPagePath) {
      staleRegistryEntries.push({ generatedPagePath: '', reason: 'registry entry generatedPagePath is missing' })
      continue
    }
    if (!liveContractPagePaths.has(generatedPagePath)) {
      staleRegistryEntries.push({ generatedPagePath, reason: 'registry entry has no live matching contract' })
    }
  }

  const hasRegistryParseError = Boolean(registryJson.error)
  const hasStaleOutputs = staleContracts.length > 0 || staleRegistryEntries.length > 0 || hasRegistryParseError

  return {
    status: hasStaleOutputs ? 'stale-found' : 'clean',
    contractsDir: normalizeRelativePath(targetRoot, contractsDir),
    registryJsonPath: normalizeRelativePath(targetRoot, registryJsonPath),
    registryMarkdownPath: normalizeRelativePath(targetRoot, registryMarkdownPath),
    staleContracts,
    staleRegistryEntries,
    registryParseError: registryJson.error,
  }
}

export async function cleanStaleManagedOutputs(targetRoot, { apply = false, backupId = '' } = {}) {
  const inspection = await inspectStaleManagedOutputs(targetRoot)
  if (!apply || inspection.status === 'clean') {
    return {
      ...inspection,
      dryRun: !apply,
      backupRoot: '',
      removedFiles: [],
      backedUpFiles: [],
      registrySync: null,
    }
  }

  const timestamp = backupId || new Date().toISOString().replace(/[:.]/g, '-')
  const backupRoot = path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', '.stale-backup', timestamp)
  const removedFiles = []
  const backedUpFiles = []

  for (const staleContract of inspection.staleContracts) {
    for (const relativePath of [staleContract.contractPath, staleContract.markdownPath].filter(Boolean)) {
      const absolutePath = path.join(targetRoot, relativePath)
      const backupPath = await copyFileToBackup({ targetRoot, sourcePath: absolutePath, backupRoot })
      if (backupPath) backedUpFiles.push(normalizeRelativePath(targetRoot, backupPath))
      if (await pathExists(absolutePath)) {
        await fs.rm(absolutePath, { force: true })
        removedFiles.push(relativePath)
      }
    }
  }

  for (const relativePath of [inspection.registryJsonPath, inspection.registryMarkdownPath]) {
    const backupPath = await copyFileToBackup({ targetRoot, sourcePath: path.join(targetRoot, relativePath), backupRoot })
    if (backupPath) backedUpFiles.push(normalizeRelativePath(targetRoot, backupPath))
  }

  const registrySync = await syncManagedPageRegistry(targetRoot, { skipIfUnchanged: false })

  return {
    ...(await inspectStaleManagedOutputs(targetRoot)),
    dryRun: false,
    backupRoot: normalizeRelativePath(targetRoot, backupRoot),
    removedFiles,
    backedUpFiles,
    registrySync: {
      changed: registrySync.changed,
      jsonChanged: registrySync.jsonChanged,
      markdownChanged: registrySync.markdownChanged,
      count: registrySync.count,
    },
  }
}
