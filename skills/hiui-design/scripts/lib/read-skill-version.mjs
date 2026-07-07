import fs from 'node:fs/promises'
import path from 'node:path'

function parseVersionFile(content) {
  const metadata = {}

  for (const rawLine of String(content || '').split('\n')) {
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

export async function readSkillVersion(skillRoot) {
  const versionPath = path.join(skillRoot, 'rules', 'VERSION')
  const metadata = parseVersionFile(await fs.readFile(versionPath, 'utf8'))
  return metadata.version || '0.0.0'
}
