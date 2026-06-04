const fs = require('fs')
const path = require('path')
const { IMPORT_STATEMENT, ENTRY_CANDIDATES } = require('./constants')

const IMPORT_PATTERNS = [
  /import\s+['"]@hi-ui\/patch-for-react['"]\s*;?/,
  /require\s*\(\s*['"]@hi-ui\/patch-for-react['"]\s*\)/,
]

function hasPatchImport (content) {
  return IMPORT_PATTERNS.some((pattern) => pattern.test(content))
}

function findEntryFromIndexHtml (projectRoot) {
  const htmlPath = path.join(projectRoot, 'index.html')
  if (!fs.existsSync(htmlPath)) return null

  const html = fs.readFileSync(htmlPath, 'utf8')
  const match = html.match(/<script[^>]+src=["']([^"']+)["']/i)
  if (!match) return null

  const src = match[1].replace(/^\//, '')
  const candidate = path.join(projectRoot, src)
  return fs.existsSync(candidate) ? candidate : null
}

function findEntryFile (projectRoot, entryPath) {
  if (entryPath) {
    const resolved = path.resolve(projectRoot, entryPath)
    if (!fs.existsSync(resolved)) {
      const error = new Error(`Entry file not found: ${resolved}`)
      error.code = 'ENTRY_NOT_FOUND'
      throw error
    }
    return resolved
  }

  for (const relative of ENTRY_CANDIDATES) {
    const candidate = path.join(projectRoot, relative)
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }

  const fromHtml = findEntryFromIndexHtml(projectRoot)
  if (fromHtml) return fromHtml

  const error = new Error(
    `Could not detect project entry file. Use --entry to specify (e.g. src/index.tsx).`
  )
  error.code = 'ENTRY_NOT_FOUND'
  throw error
}

function findDirectiveInsertIndex (lines) {
  let index = 0

  if (lines[0] && lines[0].startsWith('#!')) {
    index = 1
  }

  while (index < lines.length) {
    const line = lines[index].trim()
    if (!line) {
      index += 1
      continue
    }
    if (
      line === "'use client'" ||
      line === '"use client"' ||
      line === "'use strict'" ||
      line === '"use strict"'
    ) {
      index += 1
      continue
    }
    break
  }

  return index
}

function injectPatchImport (content) {
  if (hasPatchImport(content)) {
    return { content, inserted: false, alreadyPresent: true }
  }

  const lines = content.split('\n')
  const insertAt = findDirectiveInsertIndex(lines)
  lines.splice(insertAt, 0, IMPORT_STATEMENT)

  return {
    content: lines.join('\n'),
    inserted: true,
    alreadyPresent: false,
  }
}

function updateEntryFile (entryPath, options) {
  const raw = fs.readFileSync(entryPath, 'utf8')
  const result = injectPatchImport(raw)

  if (result.alreadyPresent) {
    return {
      entryPath,
      inserted: false,
      alreadyPresent: true,
    }
  }

  if (!options.dryRun) {
    fs.writeFileSync(entryPath, result.content, 'utf8')
  }

  return {
    entryPath,
    inserted: true,
    alreadyPresent: false,
    importLine: IMPORT_STATEMENT,
  }
}

module.exports = {
  hasPatchImport,
  findEntryFile,
  findDirectiveInsertIndex,
  injectPatchImport,
  updateEntryFile,
}
