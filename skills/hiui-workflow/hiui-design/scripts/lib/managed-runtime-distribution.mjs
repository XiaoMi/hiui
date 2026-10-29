import fs from 'node:fs/promises'
import path from 'node:path'

const TEXT_TEMPLATE_EXTENSIONS = new Set([
  '.css',
  '.d.ts',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.sass',
  '.scss',
  '.ts',
  '.tsx',
])

function ensureRelativeImportPath(relativePath = '') {
  if (!relativePath) return './'
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, 'utf8')
  } catch {
    return null
  }
}

async function readBufferIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath)
  } catch {
    return null
  }
}

async function collectAllFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectAllFiles(absPath)))
      continue
    }

    if (entry.isFile()) {
      files.push(absPath)
    }
  }

  return files
}

function isTextTemplateFile(filePath) {
  if (filePath.endsWith('.d.ts')) return true
  return TEXT_TEMPLATE_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

function rewriteCheckerFriendlyStyleSidecarImports(source = '') {
  return source
    .replace(
      /(^|\n)(\s*)import\s+([A-Za-z_$][\w$]*)\s+from\s+(["'][^"']+\.module\.scss\.js["']);?/g,
      '$1$2import * as $3 from $4;'
    )
    .replace(
      /(^|\n)(\s*)import\s+\{\s*default\s+as\s+([A-Za-z_$][\w$]*)\s*\}\s+from\s+(["'][^"']+\.module\.scss\.js["']);?/g,
      '$1$2import * as $3 from $4;'
    )
}

function hasExplicitImportExtension(specifier = '') {
  return /\.(?:[cm]?[jt]sx?|d\.ts|json|css|scss|sass)$/i.test(specifier)
}

async function resolveExplicitDeclarationImportPath(specifier, sourcePath) {
  if (!specifier.startsWith('.') || hasExplicitImportExtension(specifier)) {
    return ''
  }

  const sourceDir = path.dirname(sourcePath)
  const absoluteBasePath = path.resolve(sourceDir, specifier)
  const directDeclarationPath = `${absoluteBasePath}.d.ts`
  if (await pathExists(directDeclarationPath)) {
    return ensureRelativeImportPath(
      path.relative(sourceDir, directDeclarationPath).replace(/\\/g, '/')
    )
  }

  const indexDeclarationPath = path.join(absoluteBasePath, 'index.d.ts')
  if (await pathExists(indexDeclarationPath)) {
    return ensureRelativeImportPath(
      path.relative(sourceDir, indexDeclarationPath).replace(/\\/g, '/')
    )
  }

  return ''
}

async function replaceImportSpecifiersAsync(source = '', sourcePath = '') {
  const patterns = [/(from\s+['"])([^'"]+)(['"])/g, /(import\s*['"])([^'"]+)(['"])/g]
  let nextSource = source

  for (const pattern of patterns) {
    const matches = [...nextSource.matchAll(pattern)]
    if (matches.length === 0) continue

    let rebuiltSource = ''
    let cursor = 0

    for (const match of matches) {
      const matchIndex = match.index ?? 0
      const [fullMatch, prefix, specifier, suffix] = match
      rebuiltSource += nextSource.slice(cursor, matchIndex)

      const rewrittenSpecifier = await resolveExplicitDeclarationImportPath(
        specifier,
        sourcePath
      )
      rebuiltSource += rewrittenSpecifier
        ? `${prefix}${rewrittenSpecifier}${suffix}`
        : fullMatch
      cursor = matchIndex + fullMatch.length
    }

    rebuiltSource += nextSource.slice(cursor)
    nextSource = rebuiltSource
  }

  return nextSource
}

async function transformManagedRuntimeProjectTextFile(sourcePath, content) {
  let nextContent = content

  if (/\.(?:[cm]?[jt]sx?)$/i.test(sourcePath)) {
    nextContent = rewriteCheckerFriendlyStyleSidecarImports(nextContent)
  }

  if (sourcePath.endsWith('.d.ts')) {
    nextContent = await replaceImportSpecifiersAsync(nextContent, sourcePath)
  }

  return nextContent
}

export async function collectManagedLocalRuntimeProjectDistributionFiles({
  sourceRoot,
  targetRoot,
  annotateTargetDiff = false,
}) {
  const sourceFiles = await collectAllFiles(sourceRoot)

  if (sourceFiles.length === 0) {
    throw new Error(`Managed local runtime source assets are missing under ${sourceRoot}`)
  }

  const files = []
  for (const sourcePath of sourceFiles) {
    const relativePath = path.relative(sourceRoot, sourcePath)
    const destPath = path.join(targetRoot, relativePath)

    if (isTextTemplateFile(sourcePath)) {
      const rawContent = await fs.readFile(sourcePath, 'utf8')
      const content = await transformManagedRuntimeProjectTextFile(sourcePath, rawContent)
      const existingContent = annotateTargetDiff ? await readTextIfExists(destPath) : null
      const identical = annotateTargetDiff && existingContent === content
      files.push({
        sourcePath,
        destPath,
        content,
        identical,
        writeStatus: identical ? 'skip-identical' : 'write',
      })
      continue
    }

    const binaryContent = await fs.readFile(sourcePath)
    const existingBinaryContent = annotateTargetDiff ? await readBufferIfExists(destPath) : null
    const identical =
      annotateTargetDiff &&
      Buffer.isBuffer(existingBinaryContent) &&
      existingBinaryContent.equals(binaryContent)
    files.push({
      sourcePath,
      destPath,
      binaryContent,
      identical,
      writeStatus: identical ? 'skip-identical' : 'write',
    })
  }

  return files
}
