function normalizeNamedPageExportPattern(pattern) {
  const normalized = String(pattern || '').trim()
  return normalized || '*Page'
}

function matchesNamedPageExportPattern(name, pattern = '*Page') {
  const normalizedName = String(name || '').trim()
  const normalizedPattern = normalizeNamedPageExportPattern(pattern)
  if (!normalizedName) return false

  if (!normalizedPattern.includes('*')) {
    return normalizedName === normalizedPattern
  }

  if (normalizedPattern === '*') return true

  const [prefix, suffix] = normalizedPattern.split('*')
  return normalizedName.startsWith(prefix || '') && normalizedName.endsWith(suffix || '')
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findNamedPageExportName(source = '', pattern = '*Page') {
  const exportPatterns = [
    /(?:^|\n)\s*export\s+function\s+([A-Za-z_$][\w$]*)\s*\(/m,
    /(?:^|\n)\s*export\s+const\s+([A-Za-z_$][\w$]*)\s*=/m,
    /(?:^|\n)\s*export\s+class\s+([A-Za-z_$][\w$]*)\b/m,
  ]

  for (const exportPattern of exportPatterns) {
    const match = exportPattern.exec(source)
    const exportName = String(match?.[1] || '').trim()
    if (exportName && matchesNamedPageExportPattern(exportName, pattern)) {
      return exportName
    }
  }

  return ''
}

function findDefaultNamedPageExportName(source = '', pattern = '*Page') {
  const exportPatterns = [
    /(?:^|\n)\s*export\s+default\s+function\s+([A-Za-z_$][\w$]*)\s*\(/m,
    /(?:^|\n)\s*export\s+default\s+class\s+([A-Za-z_$][\w$]*)\b/m,
  ]

  for (const exportPattern of exportPatterns) {
    const match = exportPattern.exec(source)
    const exportName = String(match?.[1] || '').trim()
    if (exportName && matchesNamedPageExportPattern(exportName, pattern)) {
      return exportName
    }
  }

  return ''
}

function hasNamedPageExport(source = '', exportName = '') {
  const normalizedExportName = String(exportName || '').trim()
  if (!normalizedExportName) return false

  const exportPatterns = [
    new RegExp(`(?:^|\\n)\\s*export\\s+function\\s+${escapeRegExp(normalizedExportName)}\\s*\\(`, 'm'),
    new RegExp(`(?:^|\\n)\\s*export\\s+const\\s+${escapeRegExp(normalizedExportName)}\\s*=`, 'm'),
    new RegExp(`(?:^|\\n)\\s*export\\s+class\\s+${escapeRegExp(normalizedExportName)}\\b`, 'm'),
    new RegExp(
      `(?:^|\\n)\\s*export\\s*\\{[^\\n}]*\\b${escapeRegExp(normalizedExportName)}\\b[^\\n}]*\\}`,
      'm'
    ),
  ]

  return exportPatterns.some((exportPattern) => exportPattern.test(source))
}

function hasDefaultPageExport(source = '', exportName = '') {
  const normalizedExportName = String(exportName || '').trim()
  if (!normalizedExportName) return false

  const exportPatterns = [
    new RegExp(`(?:^|\\n)\\s*export\\s+default\\s+${escapeRegExp(normalizedExportName)}\\b`, 'm'),
    new RegExp(
      `(?:^|\\n)\\s*export\\s+default\\s+function\\s+${escapeRegExp(normalizedExportName)}\\s*\\(`,
      'm'
    ),
    new RegExp(
      `(?:^|\\n)\\s*export\\s+default\\s+class\\s+${escapeRegExp(normalizedExportName)}\\b`,
      'm'
    ),
    new RegExp(
      `(?:^|\\n)\\s*export\\s*\\{[^\\n}]*\\b${escapeRegExp(normalizedExportName)}\\s+as\\s+default\\b[^\\n}]*\\}`,
      'm'
    ),
  ]

  return exportPatterns.some((exportPattern) => exportPattern.test(source))
}

function convertDefaultNamedPageExportToNamed(source = '', exportName = '') {
  const normalizedExportName = String(exportName || '').trim()
  if (!normalizedExportName) return source

  let nextSource = source.replace(
    new RegExp(
      `(^|\\n)(\\s*)export\\s+default\\s+function\\s+${escapeRegExp(normalizedExportName)}\\s*\\(`,
      'm'
    ),
    '$1$2export function ' + normalizedExportName + '('
  )

  if (nextSource !== source) return nextSource

  nextSource = source.replace(
    new RegExp(
      `(^|\\n)(\\s*)export\\s+default\\s+class\\s+${escapeRegExp(normalizedExportName)}\\b`,
      'm'
    ),
    '$1$2export class ' + normalizedExportName
  )

  return nextSource
}

function renameIdentifierWord(source = '', fromName = '', toName = '') {
  const normalizedFromName = String(fromName || '').trim()
  const normalizedToName = String(toName || '').trim()
  if (!normalizedFromName || !normalizedToName || normalizedFromName === normalizedToName) {
    return source
  }

  return source.replace(
    new RegExp(`\\b${escapeRegExp(normalizedFromName)}\\b`, 'g'),
    normalizedToName
  )
}

export function isRouteMountableModuleExportContract(moduleExportContract = {}) {
  return moduleExportContract?.routeMountable === true
}

export function resolveRouteMountablePageExportName(source = '', moduleExportContract = {}) {
  const pattern = normalizeNamedPageExportPattern(moduleExportContract?.namedPageExportPattern)
  return (
    findNamedPageExportName(source, pattern) ||
    findDefaultNamedPageExportName(source, pattern) ||
    ''
  )
}

export function ensureRouteMountablePageExport(
  source = '',
  moduleExportContract = {},
  { sourceLabel = 'page source' } = {}
) {
  if (!isRouteMountableModuleExportContract(moduleExportContract)) {
    return source
  }

  const pattern = normalizeNamedPageExportPattern(moduleExportContract?.namedPageExportPattern)
  const namedPageExportRequired = moduleExportContract?.namedPageExportRequired !== false
  const defaultExportRequired = moduleExportContract?.defaultExportRequired === true
  const exportName = resolveRouteMountablePageExportName(source, moduleExportContract)

  if (!exportName) {
    throw new Error(
      `${sourceLabel} is missing a route-mountable page export matching ${pattern}`
    )
  }

  let nextSource = source
  if (namedPageExportRequired && !hasNamedPageExport(nextSource, exportName)) {
    nextSource = convertDefaultNamedPageExportToNamed(nextSource, exportName)
  }

  if (namedPageExportRequired && !hasNamedPageExport(nextSource, exportName)) {
    throw new Error(
      `${sourceLabel} must provide a named page export ${exportName} that matches ${pattern}`
    )
  }

  if (defaultExportRequired && !hasDefaultPageExport(nextSource, exportName)) {
    nextSource = `${nextSource.replace(/\s*$/, '')}\n\nexport default ${exportName}\n`
  }

  return nextSource
}

export function preserveExpectedRouteMountablePageExport(
  source = '',
  expectedExportName = '',
  moduleExportContract = {},
  { sourceLabel = 'page source' } = {}
) {
  if (!isRouteMountableModuleExportContract(moduleExportContract)) {
    return source
  }

  const normalizedExpectedExportName = String(expectedExportName || '').trim()
  if (!normalizedExpectedExportName) {
    return source
  }

  const currentExportName = resolveRouteMountablePageExportName(source, moduleExportContract)
  if (!currentExportName || currentExportName === normalizedExpectedExportName) {
    return ensureRouteMountablePageExport(source, moduleExportContract, { sourceLabel })
  }

  const renamedSource = renameIdentifierWord(source, currentExportName, normalizedExpectedExportName)
  const nextSource = ensureRouteMountablePageExport(renamedSource, moduleExportContract, {
    sourceLabel,
  })
  const resolvedExportName = resolveRouteMountablePageExportName(nextSource, moduleExportContract)

  if (resolvedExportName !== normalizedExpectedExportName) {
    throw new Error(
      `${sourceLabel} could not preserve the expected route-mountable export ${normalizedExpectedExportName}`
    )
  }

  return nextSource
}

export function preserveExistingRouteMountablePageExport(
  source = '',
  existingSource = '',
  moduleExportContract = {},
  { sourceLabel = 'page source', existingSourceLabel = 'existing page source' } = {}
) {
  if (!isRouteMountableModuleExportContract(moduleExportContract)) {
    return source
  }

  const currentExportName = resolveRouteMountablePageExportName(source, moduleExportContract)
  if (!currentExportName) {
    return source
  }

  const existingExportName = resolveRouteMountablePageExportName(existingSource, moduleExportContract)
  if (!existingExportName) {
    return source
  }

  if (currentExportName === existingExportName) {
    return source
  }

  try {
    return preserveExpectedRouteMountablePageExport(
      source,
      existingExportName,
      moduleExportContract,
      { sourceLabel }
    )
  } catch (error) {
    throw new Error(
      `${sourceLabel} could not preserve the existing route-mountable export ${existingExportName} from ${existingSourceLabel}: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export function collectRouteMountablePageExportViolations(
  source = '',
  moduleExportContract = {},
  { sourceLabel = 'page source' } = {}
) {
  if (!isRouteMountableModuleExportContract(moduleExportContract)) {
    return []
  }

  const pattern = normalizeNamedPageExportPattern(moduleExportContract?.namedPageExportPattern)
  const namedPageExportRequired = moduleExportContract?.namedPageExportRequired !== false
  const defaultExportRequired = moduleExportContract?.defaultExportRequired === true
  const exportName = resolveRouteMountablePageExportName(source, moduleExportContract)
  const violations = []

  if (!exportName) {
    violations.push(
      `${sourceLabel} is missing a route-mountable page export matching ${pattern}`
    )
    return violations
  }

  if (namedPageExportRequired && !hasNamedPageExport(source, exportName)) {
    violations.push(
      `${sourceLabel} must provide a named page export ${exportName} that matches ${pattern}`
    )
  }

  if (defaultExportRequired && !hasDefaultPageExport(source, exportName)) {
    violations.push(`${sourceLabel} must provide a default export for ${exportName}`)
  }

  return violations
}
