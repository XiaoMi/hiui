const fs = require('fs')
const path = require('path')
const {
  CLASS_V4,
  CLASS_V5,
  CLASS_PREFIX_V4,
  CLASS_PREFIX_V5,
  SKIP_DIRS,
  SKIP_FILES,
  MAX_FILE_SIZE,
} = require('./constants')

function replaceToken (content, from, to) {
  if (!content.includes(from)) {
    return { content, count: 0 }
  }

  const parts = content.split(from)
  return {
    content: parts.join(to),
    count: parts.length - 1,
  }
}

function replaceClassNames (content, classReplace) {
  const tokens = classReplace || {
    fromDot: CLASS_V4,
    toDot: CLASS_V5,
    fromPrefix: CLASS_PREFIX_V4,
    toPrefix: CLASS_PREFIX_V5,
  }

  let count = 0
  let next = content

  const dotReplaced = replaceToken(next, tokens.fromDot, tokens.toDot)
  next = dotReplaced.content
  count += dotReplaced.count

  const prefixReplaced = replaceToken(next, tokens.fromPrefix, tokens.toPrefix)
  next = prefixReplaced.content
  count += prefixReplaced.count

  return { content: next, count }
}

function shouldScanFile (filePath) {
  const base = path.basename(filePath)
  if (SKIP_FILES.has(base)) return false
  return true
}

function collectProjectFiles (rootDir) {
  const results = []

  function walk (dir) {
    let entries

    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch (err) {
      return
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue
        walk(fullPath)
        continue
      }

      if (!shouldScanFile(fullPath)) continue
      results.push(fullPath)
    }
  }

  walk(rootDir)
  return results
}

function replaceClassNamesInProject (rootDir, options) {
  const dryRun = !!options.dryRun
  const classReplace = options.classReplace

  if (!classReplace) {
    return { updatedFiles: [], totalReplacements: 0 }
  }

  const files = collectProjectFiles(rootDir)
  const updatedFiles = []
  let totalReplacements = 0

  files.forEach((filePath) => {
    let stat

    try {
      stat = fs.statSync(filePath)
    } catch (err) {
      return
    }

    if (!stat.isFile() || stat.size > MAX_FILE_SIZE) return

    let raw

    try {
      raw = fs.readFileSync(filePath, 'utf8')
    } catch (err) {
      return
    }

    const hasV4Class =
      raw.includes(classReplace.fromDot) ||
      raw.includes(classReplace.fromPrefix)
    if (!hasV4Class) return

    const { content, count } = replaceClassNames(raw, classReplace)
    if (!count) return

    if (!dryRun) {
      fs.writeFileSync(filePath, content, 'utf8')
    }

    totalReplacements += count
    updatedFiles.push({
      file: filePath,
      replacements: count,
    })
  })

  return {
    updatedFiles,
    totalReplacements,
  }
}

module.exports = {
  replaceClassNames,
  collectProjectFiles,
  replaceClassNamesInProject,
}
