import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

function isSkillRoot(candidatePath) {
  return (
    fs.existsSync(path.join(candidatePath, 'SKILL.md')) &&
    fs.existsSync(path.join(candidatePath, '.context.jsonc'))
  )
}

export function resolveSkillRoot(metaUrl) {
  let currentPath = path.dirname(fileURLToPath(metaUrl))

  while (true) {
    if (isSkillRoot(currentPath)) return currentPath

    const parentPath = path.dirname(currentPath)
    if (parentPath === currentPath) {
      throw new Error(`Unable to resolve hiui-design skill root from ${metaUrl}`)
    }
    currentPath = parentPath
  }
}

export function resolveSkillPath(metaUrl, ...segments) {
  return path.join(resolveSkillRoot(metaUrl), ...segments)
}
