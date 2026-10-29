import fs from 'node:fs/promises'
import path from 'node:path'

export const READY_GENERATION_BRIEF_SCHEMA = 'hiui5-generation-brief.v2'
export const BLOCKED_GENERATION_BRIEF_SCHEMA = 'hiui-design-generation-brief-blocked.v1'
export const DEFAULT_GENERATION_BRIEF_FILENAME = 'GENERATION_BRIEF.json'

function normalizeString(value) {
  return String(value || '').trim()
}

export function resolveGenerationBriefFilePath({ briefFile = '', targetRoot = '' } = {}) {
  const normalizedBriefFile = normalizeString(briefFile)
  if (!normalizedBriefFile) return ''

  if (path.isAbsolute(normalizedBriefFile)) {
    return path.resolve(normalizedBriefFile)
  }

  return path.resolve(targetRoot || process.cwd(), normalizedBriefFile)
}

export function resolveSessionGenerationBriefFilePath({
  targetRoot = '',
  sessionTracePath = '',
  briefFile = '',
} = {}) {
  const explicitPath = resolveGenerationBriefFilePath({ briefFile, targetRoot })
  if (explicitPath) return explicitPath

  if (normalizeString(sessionTracePath)) {
    return path.join(path.dirname(path.resolve(sessionTracePath)), DEFAULT_GENERATION_BRIEF_FILENAME)
  }

  return path.resolve(
    targetRoot || process.cwd(),
    '.hiui-design-cache',
    'telemetry',
    DEFAULT_GENERATION_BRIEF_FILENAME
  )
}

export async function writeGenerationBriefFile({
  briefFile = '',
  targetRoot = '',
  sessionTracePath = '',
  payload,
} = {}) {
  const briefFilePath = resolveSessionGenerationBriefFilePath({
    briefFile,
    targetRoot,
    sessionTracePath,
  })
  await fs.mkdir(path.dirname(briefFilePath), { recursive: true })
  await fs.writeFile(briefFilePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  return briefFilePath
}

export async function readReadyGenerationBriefFile({
  briefFile = '',
  targetRoot = '',
  expectedTargetRoot = '',
} = {}) {
  const briefFilePath = resolveGenerationBriefFilePath({ briefFile, targetRoot })
  if (!briefFilePath) {
    throw new Error('Missing --brief-file <file>')
  }

  let raw = ''
  try {
    raw = await fs.readFile(briefFilePath, 'utf8')
  } catch (error) {
    throw new Error(`Failed to read --brief-file at ${briefFilePath}: ${error.message}`, {
      cause: error,
    })
  }

  let brief = null
  try {
    brief = JSON.parse(raw)
  } catch (error) {
    throw new Error(`Invalid JSON in --brief-file ${briefFilePath}: ${error.message}`, {
      cause: error,
    })
  }

  const schema = normalizeString(brief?.schema)
  if (schema === BLOCKED_GENERATION_BRIEF_SCHEMA) {
    throw new Error(
      `--brief-file ${briefFilePath} contains a blocked generation brief. Re-run generation-brief after typical-page:preflight opens the page-task gate.`
    )
  }
  if (schema !== READY_GENERATION_BRIEF_SCHEMA) {
    throw new Error(
      `--brief-file ${briefFilePath} must contain schema ${READY_GENERATION_BRIEF_SCHEMA}; received ${schema || 'unknown'}.`
    )
  }

  const briefTargetRootRaw = normalizeString(brief?.targetRoot)
  if (!briefTargetRootRaw) {
    throw new Error(
      `--brief-file ${briefFilePath} is missing brief.targetRoot, so the downstream command cannot verify which project the brief belongs to.`
    )
  }

  const briefTargetRoot = path.resolve(briefTargetRootRaw)
  if (expectedTargetRoot && path.resolve(expectedTargetRoot) !== briefTargetRoot) {
    throw new Error(
      `--target ${path.resolve(expectedTargetRoot)} does not match brief.targetRoot ${briefTargetRoot} in --brief-file ${briefFilePath}.`
    )
  }

  return {
    brief,
    briefFilePath,
    targetRoot: briefTargetRoot,
  }
}
