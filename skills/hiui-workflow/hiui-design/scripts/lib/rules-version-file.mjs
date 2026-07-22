import fs from 'node:fs/promises'
import path from 'node:path'

export const VERSION_FILE_RELATIVE_PATH = 'rules/VERSION'

const DEFAULT_KEY_ORDER = [
  'version',
  'last-updated',
  'source-snapshot',
  'machine-facts-file',
  'machine-public-cli',
  'notes',
]

export function parseRulesVersionFile(content) {
  const metadata = {}
  let activeListKey = ''

  for (const rawLine of String(content || '').split('\n')) {
    const line = rawLine.replace(/\r$/, '')
    const trimmed = line.trim()

    if (!trimmed) {
      continue
    }

    const keyMatch = line.match(/^([a-z-]+):\s*(.*)$/)
    if (keyMatch) {
      const [, key, value] = keyMatch
      if (value) {
        metadata[key] = value
        activeListKey = ''
      } else {
        metadata[key] = []
        activeListKey = key
      }
      continue
    }

    const listMatch = line.match(/^\s*-\s+(.+)$/)
    if (listMatch && activeListKey) {
      if (!Array.isArray(metadata[activeListKey])) {
        metadata[activeListKey] = []
      }
      metadata[activeListKey].push(listMatch[1])
    }
  }

  return metadata
}

export function formatRulesVersionFile(metadata = {}) {
  const lines = []
  const renderedKeys = new Set()
  const allKeys = [
    ...DEFAULT_KEY_ORDER,
    ...Object.keys(metadata).filter((key) => !DEFAULT_KEY_ORDER.includes(key)),
  ]

  for (const key of allKeys) {
    if (renderedKeys.has(key) || !(key in metadata)) {
      continue
    }
    renderedKeys.add(key)

    const value = metadata[key]
    if (Array.isArray(value)) {
      lines.push(`${key}:`)
      for (const item of value) {
        lines.push(`  - ${String(item || '').trim()}`)
      }
      continue
    }

    const normalizedValue = String(value ?? '').trim()
    if (!normalizedValue) {
      continue
    }
    lines.push(`${key}: ${normalizedValue}`)
  }

  return `${lines.join('\n').trimEnd()}\n`
}

export async function readRulesVersionMetadata(skillRoot) {
  const versionFilePath = path.join(skillRoot, VERSION_FILE_RELATIVE_PATH)
  return parseRulesVersionFile(await fs.readFile(versionFilePath, 'utf8'))
}

export async function writeRulesVersionMetadata(skillRoot, metadata) {
  const versionFilePath = path.join(skillRoot, VERSION_FILE_RELATIVE_PATH)
  await fs.writeFile(versionFilePath, formatRulesVersionFile(metadata), 'utf8')
}

export function incrementPatchVersion(version) {
  const match = String(version || '').trim().match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!match) {
    throw new Error(`Unsupported rules/VERSION semver value: ${version || '(missing)'}`)
  }

  const [, major, minor, patch] = match
  return `${major}.${minor}.${Number(patch) + 1}`
}

export function formatIsoDate(date = new Date()) {
  return date.toISOString().slice(0, 10)
}
