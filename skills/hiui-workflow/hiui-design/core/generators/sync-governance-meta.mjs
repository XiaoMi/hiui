import fs from 'fs'
import path from 'path'
import {
  PAGEGEN_ROOT,
  REPO_ROOT,
  assert,
  parseArgs,
  readJson,
  readOfficialRuntimeRegistry,
  readProjectModeLock,
  relativeToRoot,
  writeJson,
} from './shared.mjs'
import {
  buildGenerationDecision,
  buildManagedPageMeta,
  normalizeGenerationDecision,
  normalizeGenerationMode,
  resolvePreferredGenerationMode,
  resolveReferenceAssetTemplatePathForMode,
} from './asset-governance.mjs'

function walkForMetaFiles(currentDir, results) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true })

  entries.forEach((entry) => {
    const nextPath = path.resolve(currentDir, entry.name)

    if (entry.isDirectory()) {
      walkForMetaFiles(nextPath, results)
      return
    }

    if (entry.isFile() && entry.name === 'hiui-pagegen.meta.json') {
      results.push(nextPath)
    }
  })
}

function resolveManagedMetaFiles() {
  const results = []
  walkForMetaFiles(path.resolve(REPO_ROOT, 'src'), results)
  return results.sort()
}

function inferGenerationDecisionForSync({ meta, pageType, generationMode, projectModeLock }) {
  const existingDecision = normalizeGenerationDecision(meta.generationDecision, generationMode)
  if (existingDecision) {
    return existingDecision
  }

  const projectMode = projectModeLock?.mode || ''
  const preferredGenerationMode = resolvePreferredGenerationMode({
    pageType,
    projectMode,
    projectType: projectModeLock?.projectType,
    officialRuntimeAvailable: Boolean(readOfficialRuntimeRegistry()[pageType]),
    referenceAssetTemplateAvailable: Boolean(
      resolveReferenceAssetTemplatePathForMode({
        projectMode,
        pageType,
      })
    ),
  })

  if (preferredGenerationMode && preferredGenerationMode === generationMode) {
    return buildGenerationDecision({
      requestedMode: '',
      governancePreferredMode: preferredGenerationMode,
      finalMode: generationMode,
      projectMode,
      projectType: projectModeLock?.projectType,
    })
  }

  if (!preferredGenerationMode) {
    return buildGenerationDecision({
      requestedMode: '',
      governancePreferredMode: '',
      finalMode: generationMode,
      projectMode,
      projectType: projectModeLock?.projectType,
    })
  }

  return null
}

function syncMetaFile(metaPath, checkOnly, projectModeLock) {
  const meta = readJson(metaPath)
  const pageDir = path.dirname(metaPath)
  const schemaPath = path.resolve(pageDir, 'page.schema.json')
  assert(fs.existsSync(schemaPath), `缺少页面 schema：${relativeToRoot(schemaPath)}`)

  const schema = readJson(schemaPath)
  const generationMode = normalizeGenerationMode(meta)
  const nextMeta = buildManagedPageMeta({
    generatedAt: meta.generatedAt || new Date().toISOString(),
    pageType: schema.pageType,
    assetSource: meta.assetSource,
    schemaSource: meta.schemaSource,
    generator: meta.generator || 'hiui-pagegen',
    generationMode,
    officialRuntime: meta.officialRuntime,
    referenceAsset: meta.referenceAsset,
    generationDecision: inferGenerationDecisionForSync({
      meta,
      pageType: schema.pageType,
      generationMode,
      projectModeLock,
    }),
  })

  const currentSerialized = `${JSON.stringify(meta, null, 2)}\n`
  const nextSerialized = `${JSON.stringify(nextMeta, null, 2)}\n`
  const changed = currentSerialized !== nextSerialized

  if (changed && !checkOnly) {
    writeJson(metaPath, nextMeta)
  }

  return {
    page: relativeToRoot(pageDir),
    meta: relativeToRoot(metaPath),
    changed,
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const checkOnly = Boolean(args.check)
  const metaFiles = resolveManagedMetaFiles()
  const projectModeLock = readProjectModeLock()
  const results = metaFiles.map((metaPath) => syncMetaFile(metaPath, checkOnly, projectModeLock))
  const changed = results.filter((entry) => entry.changed)
  const outputPath = path.resolve(PAGEGEN_ROOT, 'outputs', 'sync-governance-meta.json')

  writeJson(outputPath, {
    syncedAt: new Date().toISOString(),
    mode: checkOnly ? 'check' : 'write',
    changedCount: changed.length,
    pages: results,
  })

  if (checkOnly && changed.length > 0) {
    console.error(`governance meta drift detected: ${changed.map((entry) => entry.page).join(', ')}`)
    process.exitCode = 1
    return
  }

  console.log(
    `hiui-pagegen sync-governance-meta ${checkOnly ? 'checked' : 'updated'}: ${relativeToRoot(outputPath)}`
  )
}

main()
