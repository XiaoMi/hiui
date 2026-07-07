import fs from 'node:fs/promises'
import path from 'node:path'

function stripWrappingQuotes(value) {
  if (!value) return value
  const trimmed = value.trim()

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }

  return trimmed
}

function parseFrontmatterName(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return ''

  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const nameMatch = line.match(/^name:\s*(.+)$/)
    if (nameMatch) {
      return stripWrappingQuotes(nameMatch[1])
    }
  }

  return ''
}

export async function resolveSkillName(skillRoot) {
  const skillFilePath = path.join(skillRoot, 'SKILL.md')

  try {
    const content = await fs.readFile(skillFilePath, 'utf8')
    return parseFrontmatterName(content) || path.basename(skillRoot)
  } catch {
    return path.basename(skillRoot)
  }
}
