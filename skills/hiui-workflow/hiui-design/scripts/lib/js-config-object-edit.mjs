export function findMatchingBrace(source, openBraceIndex) {
  let quote = ''
  let escaped = false
  let lineComment = false
  let blockComment = false
  let depth = 0

  for (let index = openBraceIndex; index < source.length; index += 1) {
    const char = source[index]
    const nextChar = source[index + 1]

    if (lineComment) {
      if (char === '\n') lineComment = false
      continue
    }

    if (blockComment) {
      if (char === '*' && nextChar === '/') {
        blockComment = false
        index += 1
      }
      continue
    }

    if (quote) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (char === quote) {
        quote = ''
      }
      continue
    }

    if (char === '/' && nextChar === '/') {
      lineComment = true
      index += 1
      continue
    }

    if (char === '/' && nextChar === '*') {
      blockComment = true
      index += 1
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '{') {
      depth += 1
      continue
    }

    if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return index
      }
    }
  }

  return -1
}

export function findObjectPropertyRange(source, propertyName) {
  const pattern = new RegExp(`(?:['"]${propertyName}['"]|\\b${propertyName}\\b)\\s*:`, 'g')

  for (const match of source.matchAll(pattern)) {
    const colonIndex = source.indexOf(':', match.index)
    if (colonIndex < 0) continue

    let cursor = colonIndex + 1
    while (cursor < source.length && /\s/.test(source[cursor])) {
      cursor += 1
    }

    if (source[cursor] !== '{') continue

    const closeIndex = findMatchingBrace(source, cursor)
    if (closeIndex < 0) continue

    return { openBraceIndex: cursor, closeBraceIndex: closeIndex }
  }

  return null
}

export function findRootConfigObjectRange(source) {
  const patterns = [
    /defineConfig\s*\(/g,
    /export\s+default\s*\{/g,
    /module\.exports\s*=\s*\{/g,
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(source)
    if (!match) continue
    const openBraceIndex = pattern.source.includes('\\{')
      ? source.indexOf('{', match.index)
      : source.indexOf('{', match.index + match[0].length)
    if (openBraceIndex < 0) continue
    const closeBraceIndex = findMatchingBrace(source, openBraceIndex)
    if (closeBraceIndex < 0) continue
    return { openBraceIndex, closeBraceIndex }
  }

  return null
}

export function insertIntoObjectLiteral(source, objectRange, entryText) {
  const beforeClose = source.slice(0, objectRange.closeBraceIndex)
  const afterClose = source.slice(objectRange.closeBraceIndex)
  const lineStart = source.lastIndexOf('\n', objectRange.closeBraceIndex - 1) + 1
  const closingIndent = source.slice(lineStart, objectRange.closeBraceIndex).match(/^\s*/)?.[0] ?? ''
  const innerIndent = `${closingIndent}  `
  const trimmedBefore = beforeClose.trimEnd()
  const separator = trimmedBefore.endsWith('{') || trimmedBefore.endsWith(',') ? '' : ','
  const body = entryText
    .split('\n')
    .map((line) => `${innerIndent}${line}`)
    .join('\n')

  return `${beforeClose}${separator}\n${body}\n${closingIndent}${afterClose}`
}

export function hasPathBinding(source = '') {
  return [
    /import\s+path\s+from\s+['"]node:path['"]/,
    /import\s+path\s+from\s+['"]path['"]/,
    /import\s+\*\s+as\s+path\s+from\s+['"]node:path['"]/,
    /import\s+\*\s+as\s+path\s+from\s+['"]path['"]/,
    /const\s+path\s*=\s*require\(\s*['"]node:path['"]\s*\)/,
    /const\s+path\s*=\s*require\(\s*['"]path['"]\s*\)/,
  ].some((pattern) => pattern.test(source))
}

export function ensureEsmPathImport(source = '') {
  if (hasPathBinding(source)) {
    return {
      source,
      inserted: false,
    }
  }

  const lines = source.split('\n')
  let insertIndex = 0
  let lastImportIndex = -1

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim()

    if (trimmed.startsWith('import ')) {
      lastImportIndex = index
      continue
    }

    if (trimmed === '' && lastImportIndex >= 0) {
      insertIndex = index
      break
    }

    if (trimmed !== '') {
      insertIndex = lastImportIndex >= 0 ? lastImportIndex + 1 : 0
      break
    }

    insertIndex = index + 1
  }

  if (lastImportIndex >= 0 && insertIndex === 0) {
    insertIndex = lastImportIndex + 1
  }

  const nextLines = [
    ...lines.slice(0, insertIndex),
    `import path from 'node:path'`,
    ...lines.slice(insertIndex),
  ]

  return {
    source: `${nextLines.join('\n')}\n`,
    inserted: true,
  }
}
