import fs from 'node:fs/promises'
import path from 'node:path'

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value))
}

export async function loadPageFamilyWorkflowManifest({ skillRoot }) {
  const manifestPath = path.join(skillRoot, 'docs', 'generation', 'page-family-workflows.manifest.json')
  const manifest = await readJson(manifestPath)

  return {
    manifest: cloneJson(manifest),
    manifestPath,
  }
}

export async function getPageFamilyWorkflowEntry({ skillRoot, pageFamily }) {
  const { manifest, manifestPath } = await loadPageFamilyWorkflowManifest({ skillRoot })
  const normalizedPageFamily = String(pageFamily || '').trim()
  const entry = Array.isArray(manifest.pageFamilies)
    ? manifest.pageFamilies.find((item) => String(item?.id || '').trim() === normalizedPageFamily)
    : null

  if (!entry) {
    throw new Error(
      `Unknown pageFamily workflow "${normalizedPageFamily}" in ${manifestPath}`
    )
  }

  return {
    entry: cloneJson(entry),
    manifestPath,
  }
}

export async function loadNonTypicalWorkflowArchetypes({ skillRoot }) {
  const archetypeManifestPath = path.join(
    skillRoot,
    'docs',
    'generation',
    'non-typical-workflow-archetypes.json'
  )
  const archetypes = await readJson(archetypeManifestPath)

  return {
    archetypes: cloneJson(archetypes),
    archetypeManifestPath,
    coordinationPatternManifestPath: archetypeManifestPath,
  }
}

function normalizeCoordinationPatternId(value) {
  return String(value || '').trim()
}

export async function getNonTypicalWorkflowArchetype({
  skillRoot,
  archetypeId,
  coordinationPatternId,
}) {
  const {
    archetypes,
    archetypeManifestPath,
    coordinationPatternManifestPath,
  } = await loadNonTypicalWorkflowArchetypes({
    skillRoot,
  })
  const normalizedArchetypeId = normalizeCoordinationPatternId(
    coordinationPatternId || archetypeId
  )
  const archetype = Array.isArray(archetypes.archetypes)
    ? archetypes.archetypes.find(
        (item) =>
          normalizeCoordinationPatternId(
            item?.coordinationPatternId || item?.archetypeId
          ) === normalizedArchetypeId
      )
    : null

  if (!archetype) {
    throw new Error(
      `Unknown non-typical coordination pattern "${normalizedArchetypeId}" (legacy archetype alias) in ${coordinationPatternManifestPath}`
    )
  }

  return {
    archetype: cloneJson(archetype),
    archetypeManifestPath,
    coordinationPatternManifestPath,
  }
}
