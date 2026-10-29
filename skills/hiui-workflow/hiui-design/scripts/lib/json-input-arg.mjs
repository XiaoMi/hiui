import fs from 'node:fs/promises'
import path from 'node:path'

function normalizeString(value) {
  return String(value || '').trim()
}

export async function resolveJsonOrPathArg(rawValue, { targetRoot = process.cwd(), label = 'JSON input' } = {}) {
  const normalizedValue = normalizeString(rawValue)
  if (!normalizedValue) return null

  try {
    if (normalizedValue.startsWith('{') || normalizedValue.startsWith('[')) {
      return JSON.parse(normalizedValue)
    }

    const absolutePath = path.isAbsolute(normalizedValue)
      ? normalizedValue
      : path.resolve(targetRoot, normalizedValue)
    const fileContent = await fs.readFile(absolutePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    throw new Error(
      `Invalid JSON or path passed to ${label}: ${error instanceof Error ? error.message : String(error)}`,
      error instanceof Error ? { cause: error } : undefined
    )
  }
}
