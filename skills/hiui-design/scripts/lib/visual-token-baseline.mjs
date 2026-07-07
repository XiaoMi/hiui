import fs from 'node:fs/promises'
import path from 'node:path'

const LOCAL_SCRIPT_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']
const LOCAL_STYLE_EXTENSIONS = ['.css', '.scss', '.sass', '.less']
const ALLOWED_RAW_FONT_SIZES = new Set(['12', '14', '16', '18', '24'])

function toPosixPath(targetPath) {
  return String(targetPath || '').split(path.sep).join('/')
}

function normalizeRelativePath(targetRoot, targetPath) {
  return toPosixPath(path.relative(targetRoot, targetPath))
}

async function fileExists(targetPath) {
  try {
    const stat = await fs.stat(targetPath)
    return stat.isFile()
  } catch {
    return false
  }
}

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, 'utf8')
  } catch {
    return ''
  }
}

function extractImportSpecifiers(source) {
  return Array.from(
    String(source || '').matchAll(
      /import\s+(?:type\s+)?(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    )
  )
    .map((match) => match[1] || match[2] || '')
    .filter(Boolean)
}

function cleanImportSpecifier(specifier) {
  return String(specifier || '').split('?')[0]
}

async function firstExistingFile(candidates) {
  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return candidate
    }
  }

  return ''
}

async function resolveLocalImportPath({ importerPath, specifier, targetRoot, extensions }) {
  const cleaned = cleanImportSpecifier(specifier)
  if (!cleaned) return ''

  let basePath = ''
  if (cleaned.startsWith('@/')) {
    basePath = path.join(targetRoot, 'src', cleaned.slice(2))
  } else if (cleaned.startsWith('.')) {
    basePath = path.resolve(path.dirname(importerPath), cleaned)
  } else {
    return ''
  }

  const currentExtension = path.extname(basePath).toLowerCase()
  if (currentExtension && !extensions.includes(currentExtension)) {
    return ''
  }

  const hasKnownExtension = extensions.includes(currentExtension)
  const candidates = hasKnownExtension
    ? [basePath]
    : [
        basePath,
        ...extensions.map((extension) => `${basePath}${extension}`),
        ...extensions.map((extension) => path.join(basePath, `index${extension}`)),
      ]

  return firstExistingFile(candidates)
}

function stripCommentsPreservingLines(raw) {
  return String(raw || '')
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
    .replace(/\/\/.*$/gm, '')
}

function lineNumberAt(raw, index) {
  return String(raw || '').slice(0, index).split('\n').length
}

function normalizeFontSizeValue(value) {
  const numeric = String(value || '').trim()
  return numeric.endsWith('.0') ? numeric.slice(0, -2) : numeric
}

function collectRawFontSizeViolations({ raw, relativePath }) {
  const source = stripCommentsPreservingLines(raw)
  const violations = []
  const patterns = [
    {
      label: 'font-size',
      regex: /\bfont-size\s*:\s*(-?\d+(?:\.\d+)?)px\b/gi,
    },
    {
      label: 'font shorthand',
      regex: /(?:^|[;{\n]\s*)font\s*:\s*[^;{}\n]*?\b(-?\d+(?:\.\d+)?)px\b/gi,
    },
    {
      label: 'fontSize',
      regex: /\bfontSize\s*(?::|=)\s*(?:\{\s*)?['"]?(-?\d+(?:\.\d+)?)(?:px)?['"]?/gi,
    },
  ]

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern.regex)) {
      const value = normalizeFontSizeValue(match[1])
      if (ALLOWED_RAW_FONT_SIZES.has(value)) {
        continue
      }

      violations.push({
        detail: `${relativePath}:${lineNumberAt(source, match.index || 0)} uses ${pattern.label} ${match[1]}px; allowed raw font-size tokens are 12px, 14px, 16px, 18px, and metric 24px.`,
        line: lineNumberAt(source, match.index || 0),
        relativePath,
        token: `${match[1]}px`,
      })
    }
  }

  const seen = new Set()
  return violations.filter((violation) => {
    const key = `${violation.relativePath}:${violation.line}:${violation.token}`
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

export async function inspectManagedPageVisualTokens({
  entryFilePath,
  targetRoot,
  maxFiles = 24,
}) {
  const visitedSources = new Set()
  const visitedStyles = new Set()
  const sourceFiles = []
  const styleFiles = []

  async function visitSource(filePath) {
    if (!filePath || visitedSources.has(filePath) || visitedSources.size >= maxFiles) {
      return
    }

    const raw = await readTextIfExists(filePath)
    if (!raw) return

    visitedSources.add(filePath)
    sourceFiles.push({
      raw,
      relativePath: normalizeRelativePath(targetRoot, filePath),
    })

    for (const specifier of extractImportSpecifiers(raw)) {
      const stylePath = await resolveLocalImportPath({
        importerPath: filePath,
        specifier,
        targetRoot,
        extensions: LOCAL_STYLE_EXTENSIONS,
      })
      if (stylePath && !visitedStyles.has(stylePath)) {
        const styleRaw = await readTextIfExists(stylePath)
        visitedStyles.add(stylePath)
        styleFiles.push({
          raw: styleRaw,
          relativePath: normalizeRelativePath(targetRoot, stylePath),
        })
      }

      const sourcePath = await resolveLocalImportPath({
        importerPath: filePath,
        specifier,
        targetRoot,
        extensions: LOCAL_SCRIPT_EXTENSIONS,
      })
      if (sourcePath) {
        await visitSource(sourcePath)
      }
    }
  }

  await visitSource(entryFilePath)

  const inspectedFiles = [...sourceFiles, ...styleFiles].map((item) => item.relativePath).sort()
  const violations = [...sourceFiles, ...styleFiles].flatMap((item) =>
    collectRawFontSizeViolations(item)
  )

  return {
    allowedRawFontSizes: [...ALLOWED_RAW_FONT_SIZES].map((value) => `${value}px`),
    inspectedFiles,
    violations,
  }
}
