import fs from 'node:fs/promises'
import path from 'node:path'

export const DEFAULT_CHANGE_SIZE_LIMITS = {
  maxFiles: 50,
  maxLines: 3000,
}

function issue(code, message, pathLabel = '') {
  return { code, message, path: pathLabel }
}

function normalizeString(value) {
  return String(value ?? '').trim()
}

function normalizeProjectRelativePath(targetRoot, filePath) {
  const root = path.resolve(targetRoot || process.cwd())
  const absolutePath = path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(root, filePath)
  const relativePath = path.relative(root, absolutePath).replace(/\\/g, '/')
  if (!relativePath || relativePath.startsWith('..') || path.isAbsolute(relativePath)) return ''
  return relativePath
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function listFiles(rootPath) {
  if (!(await pathExists(rootPath))) return []
  const stats = await fs.lstat(rootPath)
  if (stats.isSymbolicLink()) return []
  if (stats.isFile()) return [rootPath]
  if (!stats.isDirectory()) return []

  const entries = await fs.readdir(rootPath, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue
    const entryPath = path.join(rootPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath)))
    } else if (entry.isFile()) {
      files.push(entryPath)
    }
  }
  return files
}

async function countLines(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    if (!raw) return 0
    return raw.split(/\r?\n/u).length - (raw.endsWith('\n') ? 1 : 0)
  } catch {
    return 0
  }
}

function topLevelBucket(relativePath) {
  const parts = String(relativePath || '').split('/').filter(Boolean)
  if (parts[0] === '.local-context' && parts[1] === 'hiui-design') {
    return parts.slice(0, 3).join('/') || '.local-context/hiui-design'
  }
  return parts[0] || '<root>'
}

export async function collectChangeSizeFacts({ targetRoot = process.cwd(), paths = [] }) {
  const root = path.resolve(targetRoot)
  const uniqueInputPaths = [...new Set(paths.map(normalizeString).filter(Boolean))]
  const files = []
  for (const inputPath of uniqueInputPaths) {
    const absolutePath = path.isAbsolute(inputPath) ? path.resolve(inputPath) : path.resolve(root, inputPath)
    const relativePath = normalizeProjectRelativePath(root, absolutePath)
    if (!relativePath) continue
    for (const filePath of await listFiles(absolutePath)) {
      const fileRelativePath = normalizeProjectRelativePath(root, filePath)
      if (fileRelativePath) files.push({ absolutePath: filePath, relativePath: fileRelativePath })
    }
  }

  const uniqueFiles = [...new Map(files.map((file) => [file.relativePath, file])).values()]
  let lineCount = 0
  const buckets = new Map()
  for (const file of uniqueFiles) {
    const lines = await countLines(file.absolutePath)
    lineCount += lines
    const bucket = topLevelBucket(file.relativePath)
    const previous = buckets.get(bucket) || { bucket, fileCount: 0, lineCount: 0 }
    previous.fileCount += 1
    previous.lineCount += lines
    buckets.set(bucket, previous)
  }

  return {
    fileCount: uniqueFiles.length,
    lineCount,
    files: uniqueFiles.map((file) => file.relativePath).sort(),
    buckets: [...buckets.values()].sort((left, right) => right.lineCount - left.lineCount || right.fileCount - left.fileCount),
  }
}

export function evaluateChangeSizeFacts(facts, limits = {}) {
  const maxFiles = Number.isFinite(Number(limits.maxFiles)) ? Number(limits.maxFiles) : DEFAULT_CHANGE_SIZE_LIMITS.maxFiles
  const maxLines = Number.isFinite(Number(limits.maxLines)) ? Number(limits.maxLines) : DEFAULT_CHANGE_SIZE_LIMITS.maxLines
  const issues = []
  if (facts.fileCount > maxFiles) {
    issues.push(issue('change-file-count-exceeded', `Change file count ${facts.fileCount} exceeds limit ${maxFiles}.`, 'fileCount'))
  }
  if (facts.lineCount > maxLines) {
    issues.push(issue('change-line-count-exceeded', `Change line count ${facts.lineCount} exceeds limit ${maxLines}.`, 'lineCount'))
  }
  return {
    ok: issues.length === 0,
    issues,
    limits: { maxFiles, maxLines },
    facts,
  }
}

export async function checkChangeSize(options) {
  const facts = await collectChangeSizeFacts(options)
  return evaluateChangeSizeFacts(facts, options?.limits)
}

export function summarizeChangeSize(result) {
  const issues = Array.isArray(result?.issues) ? result.issues : []
  const bucketSummary = Array.isArray(result?.facts?.buckets)
    ? result.facts.buckets.slice(0, 5).map((bucket) => `${bucket.bucket}:${bucket.fileCount} files/${bucket.lineCount} lines`).join(', ')
    : ''
  const issueSummary = issues.map((item) => item.message).join('; ')
  return [issueSummary, bucketSummary ? `top buckets: ${bucketSummary}` : ''].filter(Boolean).join('; ')
}
