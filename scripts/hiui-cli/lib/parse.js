function parseDescriptionFromMarkdown (markdown) {
  const titleMatch = markdown.match(/^#\s+(.+)$/m)
  if (!titleMatch) return ''

  const afterTitle = markdown.slice(titleMatch.index + titleMatch[0].length)
  const sectionMatch = afterTitle.match(/^([\s\S]*?)(?=^##\s+)/m)
  return sectionMatch ? sectionMatch[1].trim() : ''
}

/**
 * Parse component names from llms.txt index content.
 */
function parseComponentListFromIndex (indexText) {
  const names = new Set()
  const patterns = [
    /\/llms\/([a-z0-9-]+)\.md/gi,
    /\/components\/([a-z0-9-]+)\.md/gi,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(indexText)) !== null) {
      names.add(match[1].toLowerCase())
    }
  }

  return Array.from(names).sort()
}

/**
 * Split a markdown table row into cells, respecting escaped pipes.
 */
const ESCAPED_PIPE = '\u0001'

function splitTableRow (line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .replace(/\\\|/g, ESCAPED_PIPE)
    .split('|')
    .map((cell) =>
      cell
        .trim()
        .replace(new RegExp(ESCAPED_PIPE, 'g'), '|')
        .replace(/^\((required)\)$/i, '$1')
    )
}

function isTableSeparator (line) {
  return /^\|[\s:|-]+\|$/.test(line.trim())
}

function parseMarkdownTable (lines) {
  if (!lines.length) return []

  const header = splitTableRow(lines[0])
  const rows = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line.startsWith('|')) continue
    if (isTableSeparator(line)) continue

    const cells = splitTableRow(line)
    if (cells.length < 2) continue

    const row = {}
    header.forEach((key, index) => {
      row[key] = cells[index] !== undefined ? cells[index] : '-'
    })
    rows.push(row)
  }

  return rows
}

/**
 * Extract props tables from the ## Props section of component markdown.
 */
function parsePropsFromMarkdown (markdown) {
  const propsSectionMatch = markdown.match(/^##\s+Props\s*$/m)
  if (!propsSectionMatch) {
    return { description: '', groups: [] }
  }

  const propsStart = propsSectionMatch.index
  const afterProps = markdown.slice(propsStart)
  const nextH2 = afterProps.slice('## Props'.length).search(/^##\s+/m)
  const propsBlock =
    nextH2 === -1
      ? afterProps
      : afterProps.slice(0, '## Props'.length + nextH2)

  const description = parseDescriptionFromMarkdown(markdown)

  const groups = []
  const subsectionRegex = /^###\s+(.+?)\s*$/gm
  const matches = []
  let match

  while ((match = subsectionRegex.exec(propsBlock)) !== null) {
    matches.push({
      title: match[1].trim(),
      start: match.index + match[0].length,
    })
  }

  if (!matches.length) {
    const tableLines = extractTableLines(propsBlock)
    const rows = normalizePropRows(parseMarkdownTable(tableLines))
    if (rows.length) {
      groups.push({ name: 'Props', props: rows })
    }
    return { description, groups }
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i]
    const end =
      i + 1 < matches.length ? matches[i + 1].start : propsBlock.length
    const sectionBody = propsBlock.slice(current.start, end)
    const tableLines = extractTableLines(sectionBody)
    const rows = normalizePropRows(parseMarkdownTable(tableLines))

    if (rows.length) {
      groups.push({
        name: current.title.replace(/\s+Props$/i, '').trim() || current.title,
        props: rows,
      })
    }
  }

  return { description, groups }
}

function extractTableLines (text) {
  const lines = text.split('\n')
  const tableLines = []
  let inTable = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('|')) {
      inTable = true
      tableLines.push(trimmed)
    } else if (inTable) {
      break
    }
  }

  return tableLines
}

function normalizePropRows (rows) {
  const keyMap = {
    参数: 'name',
    name: 'name',
    说明: 'description',
    description: 'description',
    类型: 'type',
    type: 'type',
    可选值: 'enum',
    enum: 'enum',
    默认值: 'default',
    default: 'default',
  }

  return rows.map((row) => {
    const normalized = {
      name: '',
      description: '',
      type: '',
      enum: '',
      default: '',
      required: false,
    }

    Object.keys(row).forEach((key) => {
      const mapped = keyMap[key.trim()] || key.trim().toLowerCase()
      let value = row[key]

      if (mapped === 'name') {
        const requiredMatch = value.match(/\(required\)/i)
        if (requiredMatch) {
          normalized.required = true
          value = value.replace(/\s*\(required\)/gi, '').trim()
        }
        const starMatch = value.match(/\*\s*$/)
        if (starMatch) {
          normalized.required = true
          value = value.replace(/\*/g, '').trim()
        }
      }

      if (normalized[mapped] !== undefined) {
        normalized[mapped] = value
      }
    })

    return normalized
  })
}

function formatPropsAsText (parsed) {
  const lines = []

  if (parsed.description) {
    lines.push(parsed.description)
    lines.push('')
  }

  parsed.groups.forEach((group) => {
    lines.push(`### ${group.name}`)
    lines.push('')
    group.props.forEach((prop) => {
      const required = prop.required ? ' (required)' : ''
      lines.push(`- ${prop.name}${required}`)
      if (prop.description) lines.push(`  ${prop.description}`)
      if (prop.type) lines.push(`  type: ${prop.type}`)
      if (prop.enum && prop.enum !== '-') lines.push(`  enum: ${prop.enum}`)
      if (prop.default && prop.default !== '-') {
        lines.push(`  default: ${prop.default}`)
      }
      lines.push('')
    })
  })

  return lines.join('\n').trim()
}

module.exports = {
  parseDescriptionFromMarkdown,
  parseComponentListFromIndex,
  parsePropsFromMarkdown,
  parseMarkdownTable,
  splitTableRow,
  formatPropsAsText,
}
