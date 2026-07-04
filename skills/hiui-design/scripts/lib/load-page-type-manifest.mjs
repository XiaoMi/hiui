import fs from 'node:fs/promises'
import path from 'node:path'

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8')
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value))
}

function parseVersionFile(content) {
  const metadata = {}

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trimEnd()
    if (!line || line.trimStart().startsWith('- ')) {
      continue
    }

    const match = line.match(/^([a-z-]+):\s*(.+)$/)
    if (!match) {
      continue
    }

    const [, key, value] = match
    metadata[key] = value
  }

  return metadata
}

function validateRulesVersion({ manifest, manifestPath, versionMetadata, versionPath }) {
  if (!versionMetadata.version) {
    throw new Error(`Missing "version" in ${versionPath}`)
  }

  if (!manifest.rulesVersion) {
    return
  }

  if (manifest.rulesVersion !== versionMetadata.version) {
    throw new Error(
      `Rules version mismatch: ${manifestPath} declares ${manifest.rulesVersion}, but ${versionPath} declares ${versionMetadata.version}`
    )
  }
}

function mergePageTypes(basePageTypes, overlay) {
  const nextPageTypes = cloneJson(basePageTypes ?? [])
  const indexById = new Map(nextPageTypes.map((pageType, index) => [pageType.id, index]))

  for (const [pageTypeId, patch] of Object.entries(overlay?.overrides ?? {})) {
    const existingIndex = indexById.get(pageTypeId)
    if (existingIndex === undefined) {
      nextPageTypes.push({ id: pageTypeId, ...cloneJson(patch) })
      indexById.set(pageTypeId, nextPageTypes.length - 1)
      continue
    }

    nextPageTypes[existingIndex] = {
      ...nextPageTypes[existingIndex],
      ...cloneJson(patch),
    }
  }

  for (const pageType of overlay?.pageTypes ?? []) {
    const existingIndex = indexById.get(pageType.id)
    if (existingIndex === undefined) {
      nextPageTypes.push(cloneJson(pageType))
      indexById.set(pageType.id, nextPageTypes.length - 1)
      continue
    }

    nextPageTypes[existingIndex] = {
      ...nextPageTypes[existingIndex],
      ...cloneJson(pageType),
    }
  }

  return nextPageTypes
}

function mergeManifest(baseManifest, overlay, overlayPath) {
  const nextManifest = cloneJson(baseManifest)

  for (const key of ['principlesDoc', 'routerDoc', 'registryDoc']) {
    if (overlay[key]) {
      nextManifest[key] = overlay[key]
    }
  }

  nextManifest.pageTypes = mergePageTypes(nextManifest.pageTypes, overlay)
  nextManifest.lineId = overlay.lineId ?? nextManifest.lineId ?? ''
  nextManifest.overlayPath = overlayPath
  return nextManifest
}

async function resolveOverlayPath(skillRoot, line) {
  const candidates = [
    path.join(skillRoot, 'manifests', 'business-lines', `${line}.page-types.overlay.json`),
    path.join(skillRoot, 'docs', 'business-lines', line, 'page-types.overlay.json'),
  ]

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate
    }
  }

  return ''
}

export async function loadPageTypeManifest({ skillRoot, line = '' }) {
  const baseManifestPath = path.join(skillRoot, 'rules', 'common.page-types.json')
  if (!(await pathExists(baseManifestPath))) {
    throw new Error(`Missing canonical page-type manifest: ${baseManifestPath}`)
  }
  const baseManifest = await readJson(baseManifestPath)
  const rulesVersionPath = path.join(skillRoot, 'rules', 'VERSION')
  const rulesVersionMetadata = (await pathExists(rulesVersionPath))
    ? parseVersionFile(await readText(rulesVersionPath))
    : {}

  validateRulesVersion({
    manifest: baseManifest,
    manifestPath: baseManifestPath,
    versionMetadata: rulesVersionMetadata,
    versionPath: rulesVersionPath,
  })

  if (!line) {
    return {
      manifest: baseManifest,
      manifestPath: baseManifestPath,
      baseManifestPath,
      overlayPath: '',
      lineId: '',
      rulesVersionPath,
      rulesVersionMetadata,
    }
  }

  const overlayPath = await resolveOverlayPath(skillRoot, line)
  if (!overlayPath) {
    throw new Error(
      `Missing business-line overlay for "${line}". Expected one of: manifests/business-lines/${line}.page-types.overlay.json or docs/business-lines/${line}/page-types.overlay.json`
    )
  }

  const overlay = await readJson(overlayPath)
  const manifest = mergeManifest(baseManifest, overlay, overlayPath)

  return {
    manifest,
    manifestPath: `${baseManifestPath} + ${overlayPath}`,
    baseManifestPath,
    overlayPath,
    lineId: overlay.lineId ?? line,
    rulesVersionPath,
    rulesVersionMetadata,
  }
}
