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

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value))
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizePageTypePreviewContract(pageType = {}) {
  const nextPageType = cloneJson(pageType)
  const baseTemplatePath = normalizeString(nextPageType?.generationContract?.baseTemplatePath)

  nextPageType.runtimeExamplePath =
    normalizeString(nextPageType.runtimeExamplePath) || baseTemplatePath
  nextPageType.globalPreviewRoute =
    normalizeString(nextPageType.globalPreviewRoute) || normalizeString(nextPageType.smokePath)

  return nextPageType
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
    .map((pageType) => normalizePageTypePreviewContract(pageType))
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
  const baseManifestPath = path.join(skillRoot, 'docs', 'generation', 'page-types.manifest.json')
  const rawBaseManifest = await readJson(baseManifestPath)
  const baseManifest = {
    ...rawBaseManifest,
    pageTypes: (rawBaseManifest?.pageTypes ?? []).map((pageType) =>
      normalizePageTypePreviewContract(pageType)
    ),
  }

  if (!line) {
    return {
      manifest: baseManifest,
      manifestPath: baseManifestPath,
      baseManifestPath,
      overlayPath: '',
      lineId: '',
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
  }
}
