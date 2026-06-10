#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SYNC_MANIFEST_FILENAME = '.typical-page-sync-manifest.json'

function printUsage() {
  console.log(`Usage:
  node scripts/sync-host-integration.mjs --target <project-root> [--dest <relative-dir>] [--mode <host-integration|reference-only>] [--line <line-id>] [--force]

Options:
  --target   Target project root. Required.
  --dest     Relative output directory inside target project. Default: src/typical-page-reuse
  --mode     Output mode. Default: host-integration
  --line     Optional business-line overlay id. Example: after-sales
  --force    Overwrite existing files.
`)
}

function parseArgs(argv) {
  const options = {
    dest: 'src/typical-page-reuse',
    force: false,
    line: '',
    mode: 'host-integration',
    target: '',
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--force') {
      options.force = true
      continue
    }

    if (arg === '--target' || arg === '--dest' || arg === '--mode' || arg === '--line') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      options[arg.slice(2)] = value
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.target) {
    throw new Error('Missing required --target <project-root>')
  }

  if (!['host-integration', 'reference-only'].includes(options.mode)) {
    throw new Error('Expected --mode to be host-integration or reference-only')
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

function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

async function readSyncManifest(outputRoot) {
  const manifestPath = path.join(outputRoot, SYNC_MANIFEST_FILENAME)
  if (!(await pathExists(manifestPath))) {
    return {
      manifestPath,
      data: {
        version: 1,
        files: {},
      },
    }
  }

  try {
    const raw = await fs.readFile(manifestPath, 'utf8')
    const parsed = JSON.parse(raw)
    return {
      manifestPath,
      data: {
        version: 1,
        files: parsed?.files ?? {},
      },
    }
  } catch {
    return {
      manifestPath,
      data: {
        version: 1,
        files: {},
      },
    }
  }
}

async function writeSyncManifest(manifestPath, manifestData) {
  await ensureDir(path.dirname(manifestPath))
  await fs.writeFile(manifestPath, `${JSON.stringify(manifestData, null, 2)}\n`, 'utf8')
}

async function copyFileWithPolicy({
  sourcePath,
  targetPath,
  relativePath,
  force,
  manifestFiles,
}) {
  const sourceBuffer = await fs.readFile(sourcePath)
  const sourceHash = hashBuffer(sourceBuffer)
  const exists = await pathExists(targetPath)
  const previousSyncedHash = manifestFiles[relativePath]?.sourceHash ?? ''

  if (!exists) {
    await ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, sourceBuffer)
    manifestFiles[relativePath] = { sourceHash }
    return { status: 'created', targetPath, relativePath }
  }

  const targetBuffer = await fs.readFile(targetPath)
  const targetHash = hashBuffer(targetBuffer)

  if (targetHash === sourceHash) {
    manifestFiles[relativePath] = { sourceHash }
    return { status: 'up-to-date', targetPath, relativePath }
  }

  if (force) {
    await ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, sourceBuffer)
    manifestFiles[relativePath] = { sourceHash }
    return { status: 'overwritten', targetPath, relativePath }
  }

  if (previousSyncedHash && previousSyncedHash === targetHash) {
    await ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, sourceBuffer)
    manifestFiles[relativePath] = { sourceHash }
    return { status: 'refreshed', targetPath, relativePath }
  }

  return {
    status: previousSyncedHash ? 'conflict' : 'untracked-existing',
    targetPath,
    relativePath,
  }
}

async function collectFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absPath)))
    } else if (entry.isFile()) {
      files.push(absPath)
    }
  }

  return files
}

async function resolveAssetRoots(skillRoot, line) {
  const roots = [path.join(skillRoot, 'examples', 'host-integration')]

  if (!line) {
    return roots
  }

  const businessLineRoot = path.join(skillRoot, 'examples', 'business-lines', line, 'host-integration')
  if (await pathExists(businessLineRoot)) {
    roots.push(businessLineRoot)
  }

  return roots
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const assetRoots = await resolveAssetRoots(skillRoot, options.line)

    const targetRoot = path.resolve(options.target)
    const outputRoot = path.join(targetRoot, options.dest)
    const { manifestPath, data: manifestData } = await readSyncManifest(outputRoot)

    const targetExists = await pathExists(targetRoot)
    if (!targetExists) {
      throw new Error(`Target project root does not exist: ${targetRoot}`)
    }

    if (assetRoots.length === 0) {
      throw new Error('No host-integration asset roots were resolved.')
    }

    const results = []

    for (const assetRoot of assetRoots) {
      const assetExists = await pathExists(assetRoot)
      if (!assetExists) {
        throw new Error(`Skill asset directory is missing: ${assetRoot}`)
      }

      const assetFiles = await collectFiles(assetRoot)

      for (const sourcePath of assetFiles) {
        const relativePath = path.relative(assetRoot, sourcePath)
        const normalizedRelativePath = relativePath.startsWith(`src${path.sep}`)
          ? relativePath.slice(`src${path.sep}`.length)
          : relativePath
        const targetPath = path.join(outputRoot, normalizedRelativePath)
        const result = await copyFileWithPolicy({
          sourcePath,
          targetPath,
          relativePath: normalizedRelativePath.split(path.sep).join('/'),
          force: options.force,
          manifestFiles: manifestData.files,
        })
        results.push(result)
      }
    }

    await writeSyncManifest(manifestPath, manifestData)

    const summary = results.reduce(
      (acc, item) => {
        acc[item.status] += 1
        return acc
      },
      {
        created: 0,
        refreshed: 0,
        overwritten: 0,
        'up-to-date': 0,
        conflict: 0,
        'untracked-existing': 0,
      }
    )

    console.log(
      options.mode === 'reference-only'
        ? 'Reference-only typical-page assets synced.'
        : 'Host integration assets synced.'
    )
    console.log(`Target root: ${targetRoot}`)
    console.log(`Output dir : ${outputRoot}`)
    console.log(
      `Asset roots: ${assetRoots.map((rootPath) => path.relative(skillRoot, rootPath).replace(/\\/g, '/')).join(', ')}`
    )
    console.log(
      `Created: ${summary.created}, Refreshed: ${summary.refreshed}, Overwritten: ${summary.overwritten}, Up-to-date: ${summary['up-to-date']}, Conflicts: ${summary.conflict}, Untracked existing: ${summary['untracked-existing']}`
    )
    console.log(`Manifest  : ${manifestPath}`)
    if (summary.conflict > 0 || summary['untracked-existing'] > 0) {
      console.log('')
      console.log('Warnings:')
      console.log('- Some synced files differ from the source-of-truth example assets and were left untouched.')
      console.log('- If this output directory is still a managed smoke/gallery area, rerun with --force to refresh it.')
      console.log('- If those files already contain project-specific edits, review the diff before overwriting.')
    }
    console.log('')
    console.log('Next steps:')
    if (options.mode === 'reference-only') {
      console.log(`1. Lock a single example page from ${path.join(options.dest, 'pages')} before generating each reference-only business page.`)
      console.log('2. Generate the real business page inside the target project’s existing page/feature structure instead of mounting this reference tree as live routes.')
      console.log(
        '3. For each reference-only business page, run `pnpm typical-page:start-page -- --page-type <id> --page <generated-page-path>`, then `pnpm typical-page:preflight -- --page <generated-page-path>`, and only treat delivery as complete after `pnpm typical-page:finalize-page -- --page-type <id> --page <generated-page-path> --archetype <host-archetype-path> --region <name=target> ...`.'
      )
      console.log(
        '4. If you later need a smoke gallery or host bridge demo, rerun bootstrap/apply in host-integration mode instead of wiring this reference tree into the main route tree.'
      )
    } else {
      console.log(
        `1. Run bootstrap/apply so package.json picks up @hiui-design/typical-page-shells, peer deps, and host-side direct deps in ${targetRoot}`
      )
      console.log(`2. Mount routes from ${path.join(options.dest, 'routes', 'config.tsx')}`)
      console.log(
        `3. For Vite projects, verify the @hi-ui/schema-types alias or apply ${path.join(options.dest, 'VITE_ALIAS_SNIPPET.md')}`
      )
      console.log(`4. Review ${path.join(options.dest, 'CHECKLIST.md')} before merging into the target project`)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`sync-host-integration failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

await main()
