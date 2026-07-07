import fs from 'node:fs/promises'
import path from 'node:path'

export const HIUI_V5_COMPONENT_CATALOG_START = '<!-- BEGIN GENERATED HIUI V5 COMPONENT CATALOG -->'
export const PUBLIC_HIUI_V5_SOURCE_LABEL = 'HIUI_V5_DOCS_ROOT/README.md'
export const HIUI_V5_QUICK_REFERENCE_GROUPS = [
  { id: 'page-header-actions', label: '页头与操作区' },
  { id: 'list-filter', label: '列表与筛选' },
  { id: 'drawer-detail', label: '抽屉与详情' },
  { id: 'form-input', label: '表单' },
]

export async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

export async function readText(filePath) {
  return fs.readFile(filePath, 'utf8')
}

export async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

export async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

export function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim()
}

export function sanitizeHiuiV5SourceLabel(value, fallback = 'manifests/hiui-v5-components.json') {
  const label = String(value || '').replace(/\\/g, '/').trim()

  if (!label) {
    return fallback
  }

  if (
    label.startsWith('../') ||
    label.startsWith('/') ||
    /^[A-Za-z]:\//.test(label) ||
    label.includes('/.local-context/hiui-v5/')
  ) {
    return PUBLIC_HIUI_V5_SOURCE_LABEL
  }

  return label
}

export function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function parseHiuiV5ComponentIndex(readmeText) {
  const components = []
  const pattern = /^- \[([^\]]+)\]\((components\/[^)]+)\)：(.+)$/gm
  let match = pattern.exec(readmeText)

  while (match) {
    const label = normalizeWhitespace(match[1])
    const docPath = normalizeWhitespace(match[2])
    const summary = normalizeWhitespace(match[3])
    const componentName = label.split(/\s+/)[0]

    components.push({
      componentName,
      label,
      docPath,
      summary,
    })

    match = pattern.exec(readmeText)
  }

  if (!components.length) {
    throw new Error('No component index entries found in hiui-v5 README.md')
  }

  return components
}

export async function resolveHiuiV5DocsRoot(skillRoot, explicitSource = '') {
  const candidates = [
    explicitSource,
    process.env.HIUI_V5_DOCS_ROOT,
    path.resolve(process.cwd(), '.local-context', 'hiui-v5'),
    path.resolve(process.cwd(), 'hiui-v5'),
    path.resolve(skillRoot, '.local-context', 'hiui-v5'),
  ].filter(Boolean)

  for (const candidate of candidates) {
    const resolved = path.resolve(candidate)
    if (
      (await pathExists(path.join(resolved, 'README.md'))) &&
      (await pathExists(path.join(resolved, 'components')))
    ) {
      return resolved
    }
  }

  throw new Error(
    'Unable to locate hiui-v5 docs root. Pass --source <path-to-.local-context/hiui-v5> or set HIUI_V5_DOCS_ROOT.'
  )
}

export function collectExplicitComponentMentions(text, componentNames) {
  const mentions = new Set()

  for (const componentName of componentNames) {
    const pattern = new RegExp(
      `(^|[^A-Za-z0-9])${escapeRegex(componentName)}(?=$|[^A-Za-z0-9])`,
      'm',
    )
    if (pattern.test(text)) {
      mentions.add(componentName)
    }
  }

  return mentions
}

export function extractMarkdownSection(text, heading) {
  const escapedHeading = escapeRegex(heading)
  const pattern = new RegExp(`${escapedHeading}\\n([\\s\\S]*?)(?=\\n##\\s|$)`)
  const match = text.match(pattern)
  return match ? match[1] : ''
}

export function stripGeneratedHiuiV5Catalog(text) {
  const startIndex = text.indexOf(HIUI_V5_COMPONENT_CATALOG_START)
  if (startIndex === -1) {
    return text
  }

  return text.slice(0, startIndex)
}

export function extractCandidateCodeTokens(text) {
  const tokens = new Set()
  const codeSpanPattern = /`([^`]+)`/g
  let match = codeSpanPattern.exec(text)

  while (match) {
    const codeContent = match[1]
    if (
      codeContent.includes('/') ||
      codeContent.includes('@') ||
      codeContent.includes('.md') ||
      codeContent.includes('.mjs') ||
      codeContent.includes('.json') ||
      codeContent.includes('.tsx') ||
      codeContent.includes('.jsx') ||
      codeContent.includes('.ts') ||
      codeContent.includes('.js') ||
      codeContent.includes('.')
    ) {
      match = codeSpanPattern.exec(text)
      continue
    }

    const parts = codeContent.match(/[A-Za-z][A-Za-z0-9-]*/g) ?? []
    for (const part of parts) {
      if (
        /^[A-Z][A-Za-z0-9]*$/.test(part) ||
        /^[a-z]+(?:[A-Z][A-Za-z0-9]*)+$/.test(part) &&
          /(Card|Strip|Block|Band|Row|Pane|Workspace)$/.test(part)
      ) {
        tokens.add(part)
      }
    }

    match = codeSpanPattern.exec(text)
  }

  return tokens
}

export function buildHiuiV5ManifestPaths(skillRoot) {
  return {
    componentManifestPath: path.join(skillRoot, 'manifests', 'hiui-v5-components.json'),
    semanticRolesPath: path.join(skillRoot, 'manifests', 'hiui-v5-semantic-roles.json'),
    quickReferencePath: path.join(skillRoot, 'docs', 'hiui-v5-quick-reference.md'),
    routingDocPath: path.join(skillRoot, 'docs', 'generation', 'non-typical-component-routing.md'),
    aiKickoffTemplatePath: path.join(skillRoot, 'docs', 'generation', 'ai-kickoff-template.md'),
    componentMapDocPath: path.join(skillRoot, 'docs', 'generation', 'hiui-v5-component-map.md'),
  }
}
