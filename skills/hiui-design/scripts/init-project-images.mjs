#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/init-project-images.mjs" [--target <project-root>] [--force]

Default behavior:
  - create src/typical-page-reuse/assets/project-product-images.ts when missing
  - create src/typical-page-reuse/assets/product-catalog/ when missing
  - seed the default product image pack without overwriting existing project assets
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    force: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--force') {
      options.force = true
      continue
    }

    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --target')
      }
      options.target = path.resolve(value)
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

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

async function ensureTemplateFiles(rootDir, relativePaths) {
  const missing = []

  for (const relativePath of relativePaths) {
    const absolutePath = path.join(rootDir, relativePath)
    if (!(await pathExists(absolutePath))) {
      missing.push(relativePath)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      [
        `missing template assets under ${rootDir}`,
        'required:',
        ...missing.map((relativePath) => `- ${relativePath}`),
      ].join('\n')
    )
  }
}

async function listFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absPath)))
      continue
    }

    if (entry.isFile()) {
      files.push(absPath)
    }
  }

  return files
}

async function copyTemplateFile({ from, to, force }) {
  const existed = await pathExists(to)
  if (existed && !force) {
    return 'unchanged'
  }

  await ensureDir(path.dirname(to))
  await fs.copyFile(from, to)
  return existed ? 'overwritten' : 'written'
}

async function copyTemplateDirectory({ fromDir, toDir, force }) {
  const copiedFiles = []
  const preservedFiles = []
  const sourceFiles = await listFiles(fromDir)

  for (const sourceFile of sourceFiles) {
    const relativePath = path.relative(fromDir, sourceFile)
    const targetFile = path.join(toDir, relativePath)
    const result = await copyTemplateFile({
      from: sourceFile,
      to: targetFile,
      force,
    })

    if (result === 'unchanged') {
      preservedFiles.push(relativePath)
      continue
    }

    copiedFiles.push(relativePath)
  }

  return { copiedFiles, preservedFiles }
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const templatesRoot = path.join(skillRoot, 'templates', 'project-images')
    const targetRoot = options.target
    const assetsRoot = path.join(targetRoot, 'src', 'typical-page-reuse', 'assets')
    const registryPath = path.join(assetsRoot, 'project-product-images.ts')
    const productCatalogDir = path.join(assetsRoot, 'product-catalog')
    const productCatalogTemplateDir = path.join(templatesRoot, 'src', 'typical-page-reuse', 'assets', 'product-catalog')
    const registryTemplatePath = path.join(
      templatesRoot,
      'src',
      'typical-page-reuse',
      'assets',
      'project-product-images.ts'
    )
    const assetTypesTemplatePath = path.join(
      templatesRoot,
      'src',
      'typical-page-reuse',
      'assets',
      'asset-modules.d.ts'
    )
    const assetTypesPath = path.join(assetsRoot, 'asset-modules.d.ts')
    const seededFiles = []
    const preservedFiles = []
    const requiredTemplatePaths = [
      path.join('src', 'typical-page-reuse', 'assets', 'project-product-images.ts'),
      path.join('src', 'typical-page-reuse', 'assets', 'asset-modules.d.ts'),
      path.join('src', 'typical-page-reuse', 'assets', 'product-catalog'),
      path.join('src', 'typical-page-reuse', 'assets', 'product-catalog', 'README.md'),
    ]

    await ensureTemplateFiles(templatesRoot, requiredTemplatePaths)

    await ensureDir(assetsRoot)

    const registryResult = await copyTemplateFile({
      from: registryTemplatePath,
      to: registryPath,
      force: options.force,
    })

    if (registryResult === 'unchanged') {
      preservedFiles.push(path.relative(targetRoot, registryPath))
    } else {
      seededFiles.push(path.relative(targetRoot, registryPath))
    }

    const assetTypesResult = await copyTemplateFile({
      from: assetTypesTemplatePath,
      to: assetTypesPath,
      force: options.force,
    })

    if (assetTypesResult === 'unchanged') {
      preservedFiles.push(path.relative(targetRoot, assetTypesPath))
    } else {
      seededFiles.push(path.relative(targetRoot, assetTypesPath))
    }

    const catalogSyncResult = await copyTemplateDirectory({
      fromDir: productCatalogTemplateDir,
      toDir: productCatalogDir,
      force: options.force,
    })

    for (const relativePath of catalogSyncResult.copiedFiles) {
      seededFiles.push(path.relative(targetRoot, path.join(productCatalogDir, relativePath)))
    }
    for (const relativePath of catalogSyncResult.preservedFiles) {
      preservedFiles.push(path.relative(targetRoot, path.join(productCatalogDir, relativePath)))
    }

    console.log('[init-project-images] default image pack is ready.')
    console.log(`- target: ${targetRoot}`)
    console.log(`- registry: ${path.relative(targetRoot, registryPath)}`)
    console.log(`- asset dir: ${path.relative(targetRoot, productCatalogDir)}`)
    console.log(`- synced image files: ${catalogSyncResult.copiedFiles.filter((file) => file.endsWith('.png')).length}`)
    if (seededFiles.length > 0) {
      console.log(`- seeded files: ${seededFiles.join(', ')}`)
    }
    if (preservedFiles.length > 0) {
      console.log(`- preserved existing files: ${preservedFiles.join(', ')}`)
    }
    console.log('- next: if the project already has official product images, replace the default pack by dropping the real assets into the same catalog and updating the registry with `--force` only when you explicitly want to refresh the baseline files.')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[init-project-images] failed: ${message}`)
    process.exit(1)
  }
}

main()
