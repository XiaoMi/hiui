function hasAnyPattern(sourceRaw, patterns) {
  return patterns.some((pattern) => pattern.test(String(sourceRaw || '')))
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const QUERY_FILTER_FIELD_RENDER_PROFILES = Object.freeze([
  'shared-query-filter-skin',
  'not-applicable',
])

export const QUERY_FILTER_KEYWORD_FIELD_ROLES = Object.freeze([
  'search-input',
  'not-applicable',
])

export const QUERY_FILTER_TEXT_FIELD_ROLES = Object.freeze([
  'filter-text-input',
  'not-applicable',
])

export const QUERY_FILTER_SELECT_DATE_FIELD_SURFACE_POLICIES = Object.freeze([
  'shared-query-filter-surface',
  'not-applicable',
])

export const QUERY_FILTER_SURFACE_BASELINES = Object.freeze([
  'query-filter-contained-shared-surface',
  'not-applicable',
])

export const QUERY_FILTER_SEMANTIC_KEYS = Object.freeze([
  'queryFieldRenderProfile',
  'keywordFieldRole',
  'textFieldRole',
  'selectDateFieldSurfacePolicy',
  'filterSurfaceBaseline',
])

export const MANAGED_QUERY_FILTER_FIELD_POLICY = 'search-input-plus-filter-text-input'

export const QUERY_FILTER_FAILURE_CODES = Object.freeze({
  fieldRoleDrift: 'HIUI051_QUERY_FILTER_FIELD_ROLE_DRIFT',
  surfaceMismatch: 'HIUI052_QUERY_FILTER_SURFACE_MISMATCH',
})

const MANAGED_QUERY_FILTER_SEMANTIC_DEFAULTS = Object.freeze({
  queryFieldRenderProfile: 'shared-query-filter-skin',
  keywordFieldRole: 'search-input',
  textFieldRole: 'filter-text-input',
  selectDateFieldSurfacePolicy: 'shared-query-filter-surface',
  filterSurfaceBaseline: 'query-filter-contained-shared-surface',
})

const NOT_APPLICABLE_QUERY_FILTER_SEMANTIC_DEFAULTS = Object.freeze({
  queryFieldRenderProfile: 'not-applicable',
  keywordFieldRole: 'not-applicable',
  textFieldRole: 'not-applicable',
  selectDateFieldSurfacePolicy: 'not-applicable',
  filterSurfaceBaseline: 'not-applicable',
})

export const QUERY_FILTER_SURFACE_KINDS = Object.freeze({
  transparentOrMissing: 'transparent-or-missing',
  white: 'white',
  filled: 'filled',
})

export function buildQueryFilterSemanticDefaults({ managed = false } = {}) {
  return managed
    ? { ...MANAGED_QUERY_FILTER_SEMANTIC_DEFAULTS }
    : { ...NOT_APPLICABLE_QUERY_FILTER_SEMANTIC_DEFAULTS }
}

export function queryFilterSemanticFactsRequired({
  semanticContract = {},
  requiredRegions = [],
} = {}) {
  return (
    String(semanticContract.queryFilterRegionRole || '').trim() === 'table-query-filter' &&
    Array.isArray(requiredRegions) &&
    requiredRegions.includes('query-filter')
  )
}

export function getQueryFilterSemanticValidationProfile({
  pageTypeId = '',
  queryFilterRegionRole = '',
  requiredRegions = [],
} = {}) {
  const normalizedPageTypeId = String(pageTypeId || '').trim()
  const normalizedRole = String(queryFilterRegionRole || '').trim()

  if (normalizedPageTypeId === 'data-visualization') {
    if (normalizedRole === 'dashboard-control-strip') {
      return 'dashboard-control-strip'
    }

    if (normalizedRole === 'table-query-filter') {
      return 'data-visualization-table-query-filter'
    }
  }

  return queryFilterSemanticFactsRequired({
    semanticContract: { queryFilterRegionRole: normalizedRole },
    requiredRegions,
  })
    ? 'managed-query-filter-page'
    : 'not-applicable'
}

export function buildQueryFilterSemanticValueSetErrors(semanticContract = {}) {
  const errors = []

  if (!QUERY_FILTER_FIELD_RENDER_PROFILES.includes(semanticContract.queryFieldRenderProfile)) {
    errors.push(
      `semanticContract.queryFieldRenderProfile must be one of: ${QUERY_FILTER_FIELD_RENDER_PROFILES.join(', ')}; received ${semanticContract.queryFieldRenderProfile || '(missing)'}`
    )
  }

  if (!QUERY_FILTER_KEYWORD_FIELD_ROLES.includes(semanticContract.keywordFieldRole)) {
    errors.push(
      `semanticContract.keywordFieldRole must be one of: ${QUERY_FILTER_KEYWORD_FIELD_ROLES.join(', ')}; received ${semanticContract.keywordFieldRole || '(missing)'}`
    )
  }

  if (!QUERY_FILTER_TEXT_FIELD_ROLES.includes(semanticContract.textFieldRole)) {
    errors.push(
      `semanticContract.textFieldRole must be one of: ${QUERY_FILTER_TEXT_FIELD_ROLES.join(', ')}; received ${semanticContract.textFieldRole || '(missing)'}`
    )
  }

  if (
    !QUERY_FILTER_SELECT_DATE_FIELD_SURFACE_POLICIES.includes(
      semanticContract.selectDateFieldSurfacePolicy
    )
  ) {
    errors.push(
      `semanticContract.selectDateFieldSurfacePolicy must be one of: ${QUERY_FILTER_SELECT_DATE_FIELD_SURFACE_POLICIES.join(', ')}; received ${semanticContract.selectDateFieldSurfacePolicy || '(missing)'}`
    )
  }

  if (!QUERY_FILTER_SURFACE_BASELINES.includes(semanticContract.filterSurfaceBaseline)) {
    errors.push(
      `semanticContract.filterSurfaceBaseline must be one of: ${QUERY_FILTER_SURFACE_BASELINES.join(', ')}; received ${semanticContract.filterSurfaceBaseline || '(missing)'}`
    )
  }

  return errors
}

export function buildQueryFilterSemanticProfileErrors({
  semanticContract = {},
  profile = 'not-applicable',
} = {}) {
  switch (String(profile || '').trim()) {
    case 'managed-query-filter-page':
      return [
        semanticContract.queryFieldRenderProfile === 'shared-query-filter-skin'
          ? null
          : 'query-filter pages must keep semanticContract.queryFieldRenderProfile=shared-query-filter-skin so the managed region stays on one filter field chain.',
        semanticContract.keywordFieldRole === 'search-input'
          ? null
          : 'query-filter pages must keep semanticContract.keywordFieldRole=search-input so keyword lookup stays on managed search semantics.',
        semanticContract.textFieldRole === 'filter-text-input'
          ? null
          : 'query-filter pages must keep semanticContract.textFieldRole=filter-text-input so non-keyword text filters do not collapse into duplicate search boxes.',
        semanticContract.selectDateFieldSurfacePolicy === 'shared-query-filter-surface'
          ? null
          : 'query-filter pages must keep semanticContract.selectDateFieldSurfacePolicy=shared-query-filter-surface so select/date controls stay on the managed filter surface.',
        semanticContract.filterSurfaceBaseline === 'query-filter-contained-shared-surface'
          ? null
          : 'query-filter pages must keep semanticContract.filterSurfaceBaseline=query-filter-contained-shared-surface so all filter controls resolve to one shared surface baseline.',
      ].filter(Boolean)
    case 'dashboard-control-strip':
      return [
        semanticContract.queryFieldRenderProfile === 'not-applicable'
          ? null
          : 'data-visualization dashboard-control-strip contracts must keep semanticContract.queryFieldRenderProfile=not-applicable so page-global controls do not masquerade as QueryFilter field semantics.',
        semanticContract.keywordFieldRole === 'not-applicable'
          ? null
          : 'data-visualization dashboard-control-strip contracts must keep semanticContract.keywordFieldRole=not-applicable because the managed region is not a keyword search carrier.',
        semanticContract.textFieldRole === 'not-applicable'
          ? null
          : 'data-visualization dashboard-control-strip contracts must keep semanticContract.textFieldRole=not-applicable because the managed region is not a QueryFilter text-field chain.',
        semanticContract.selectDateFieldSurfacePolicy === 'not-applicable'
          ? null
          : 'data-visualization dashboard-control-strip contracts must keep semanticContract.selectDateFieldSurfacePolicy=not-applicable because page-global controls do not share QueryFilter surface semantics.',
        semanticContract.filterSurfaceBaseline === 'not-applicable'
          ? null
          : 'data-visualization dashboard-control-strip contracts must keep semanticContract.filterSurfaceBaseline=not-applicable so the top control strip does not regress into a QueryFilter surface contract.',
      ].filter(Boolean)
    case 'data-visualization-table-query-filter':
      return [
        semanticContract.queryFieldRenderProfile === 'shared-query-filter-skin'
          ? null
          : 'data-visualization table-query-filter contracts must keep semanticContract.queryFieldRenderProfile=shared-query-filter-skin so the managed region remains a real QueryFilter field chain.',
        semanticContract.keywordFieldRole === 'search-input'
          ? null
          : 'data-visualization table-query-filter contracts must keep semanticContract.keywordFieldRole=search-input so keyword lookup stays on managed search semantics.',
        semanticContract.textFieldRole === 'filter-text-input'
          ? null
          : 'data-visualization table-query-filter contracts must keep semanticContract.textFieldRole=filter-text-input so non-keyword filters do not collapse into duplicate search boxes.',
        semanticContract.selectDateFieldSurfacePolicy === 'shared-query-filter-surface'
          ? null
          : 'data-visualization table-query-filter contracts must keep semanticContract.selectDateFieldSurfacePolicy=shared-query-filter-surface so picker controls stay on the managed QueryFilter surface.',
        semanticContract.filterSurfaceBaseline === 'query-filter-contained-shared-surface'
          ? null
          : 'data-visualization table-query-filter contracts must keep semanticContract.filterSurfaceBaseline=query-filter-contained-shared-surface so the managed region preserves the shared filter surface baseline.',
      ].filter(Boolean)
    case 'not-applicable':
    default:
      return [
        semanticContract.queryFieldRenderProfile === 'not-applicable'
          ? null
          : 'non-query-filter contracts must keep semanticContract.queryFieldRenderProfile=not-applicable.',
        semanticContract.keywordFieldRole === 'not-applicable'
          ? null
          : 'non-query-filter contracts must keep semanticContract.keywordFieldRole=not-applicable.',
        semanticContract.textFieldRole === 'not-applicable'
          ? null
          : 'non-query-filter contracts must keep semanticContract.textFieldRole=not-applicable.',
        semanticContract.selectDateFieldSurfacePolicy === 'not-applicable'
          ? null
          : 'non-query-filter contracts must keep semanticContract.selectDateFieldSurfacePolicy=not-applicable.',
        semanticContract.filterSurfaceBaseline === 'not-applicable'
          ? null
          : 'non-query-filter contracts must keep semanticContract.filterSurfaceBaseline=not-applicable.',
      ].filter(Boolean)
  }
}

export const QUERY_FILTER_FIELD_ROLE_DRIFT_FAILURE_FRAGMENTS = Object.freeze([
  'non-keyword text filters drift into search-input semantics',
  'ordinary text filters must stay on filter-text-input semantics',
  'multiple SearchInput/Search affordances',
])

export const QUERY_FILTER_SURFACE_MISMATCH_FAILURE_FRAGMENTS = Object.freeze([
  'non-keyword text filters fall back to bare Input skin instead of the shared query-filter surface',
  'shared filter-text-input / filled baseline',
  'mix grey and white text boxes',
])

const QUERY_FILTER_SELECT_DATE_COMPONENT_NAMES = Object.freeze([
  'Select',
  'DatePicker',
  'Cascader',
  'TreeSelect',
  'TimePicker',
  'SchemaSelectField',
  'SchemaDateField',
  'SchemaCascaderField',
  'SchemaTreeSelectField',
  'SchemaTimeField',
  'ManagedQuerySelectField',
  'ManagedQueryDateRangeField',
])

const MANAGED_QUERY_FILTER_FIELD_FACTORY_COMPONENT_NAMES = Object.freeze({
  createManagedQuerySearchField: 'ManagedQuerySearchField',
  createManagedQueryTextField: 'ManagedQueryTextField',
  createManagedQuerySelectField: 'ManagedQuerySelectField',
  createManagedQueryDateRangeField: 'ManagedQueryDateRangeField',
})

const QUERY_FILTER_SCHEMA_DSL_COMPONENT_NAMES = Object.freeze({
  Text: 'SchemaTextField',
  Select: 'SchemaSelectField',
  Date: 'SchemaDateField',
  Cascader: 'SchemaCascaderField',
  TreeSelect: 'SchemaTreeSelectField',
  Time: 'SchemaTimeField',
})

export function buildQueryFilterFieldRoleDriftMessage(pathLabel, fieldSummary) {
  return `${pathLabel} uses the managed QueryFilter field chain but non-keyword text filters drift into search-input semantics (${fieldSummary}). Keep only the keyword field on search-input semantics; ordinary text filters must stay on filter-text-input semantics instead of rendering multiple SearchInput/Search affordances.`
}

export function buildQueryFilterSurfaceMismatchMessage(pathLabel, fieldSummary) {
  return `${pathLabel} uses the managed QueryFilter field chain but non-keyword text filters fall back to bare Input skin instead of the shared query-filter surface (${fieldSummary}). Keep ordinary text filters on the shared filter-text-input / filled baseline so one QueryFilter does not mix grey and white text boxes.`
}

export function isQueryFilterFieldRoleDriftFailureMessage(message) {
  const text = String(message || '')
  return QUERY_FILTER_FIELD_ROLE_DRIFT_FAILURE_FRAGMENTS.some((fragment) =>
    text.includes(fragment)
  )
}

export function isQueryFilterSurfaceMismatchFailureMessage(message) {
  const text = String(message || '')
  return QUERY_FILTER_SURFACE_MISMATCH_FAILURE_FRAGMENTS.some((fragment) =>
    text.includes(fragment)
  )
}

export function collectDirectQueryFilterFieldSnippets(sourceRaw) {
  const fieldSnippetPattern =
    /{[\s\S]{0,280}?(?:field\s*:\s*['"][^'"]+['"]|label\s*:\s*['"][^'"]+['"])[\s\S]{0,560}?component\s*:\s*<[\s\S]{0,420}?(?:\/>|<\/[A-Za-z][A-Za-z0-9.]*>)[\s\S]{0,180}?}/g
  const fieldFactoryPattern =
    /\bcreateManagedQuery(?:Search|Text|Select|DateRange)Field\s*\(\s*{[\s\S]{0,720}?(?:field\s*:\s*['"][^'"]+['"]|label\s*:\s*['"][^'"]+['"])[\s\S]{0,720}?}\s*\)/g
  const fieldDslPattern =
    /\bF\(\s*[\s\S]{0,220}?,\s*['"][^'"]+['"]\s*\)\s*\.(?:Text|Select|Date|Cascader|TreeSelect|Time)\([\s\S]{0,720}?\)\s*\.val/g

  const collectBracketBalancedArrays = (patterns) => {
    const arrays = []
    const seen = new Set()

    for (const pattern of patterns) {
      for (const match of String(sourceRaw || '').matchAll(pattern)) {
        const sourceText = String(sourceRaw || '')
        const anchorIndex = typeof match.index === 'number' ? match.index : -1
        if (anchorIndex < 0) {
          continue
        }

        let startIndex = sourceText.indexOf('[', anchorIndex)
        if (startIndex < 0) {
          continue
        }

        let depth = 0
        let quote = ''
        let escaped = false

        for (let cursor = startIndex; cursor < sourceText.length; cursor += 1) {
          const char = sourceText[cursor]

          if (quote) {
            if (escaped) {
              escaped = false
              continue
            }

            if (char === '\\') {
              escaped = true
              continue
            }

            if (char === quote) {
              quote = ''
            }

            continue
          }

          if (char === '"' || char === "'" || char === '`') {
            quote = char
            continue
          }

          if (char === '[') {
            depth += 1
            continue
          }

          if (char === ']') {
            depth -= 1

            if (depth === 0) {
              const arraySnippet = sourceText.slice(startIndex, cursor + 1)
              if (!seen.has(arraySnippet)) {
                seen.add(arraySnippet)
                arrays.push(arraySnippet)
              }
              break
            }
          }
        }
      }
    }

    return arrays
  }

  const fieldCarrierArrays = collectBracketBalancedArrays([
    /filterFields\s*=/g,
    /\b(?:const|let|var)\s+queryFields\s*=/g,
    /queryFields\s*=\s*\{/g,
  ])

  return fieldCarrierArrays
    .flatMap((snippet) => [
      ...Array.from(snippet.matchAll(fieldSnippetPattern)),
      ...Array.from(snippet.matchAll(fieldFactoryPattern)),
      ...Array.from(snippet.matchAll(fieldDslPattern)),
    ])
    .map((match) => String(match[0] || ''))
    .filter(Boolean)
}

function extractLiteralObjectValue(snippet, propName) {
  if (!snippet) return ''

  const patterns = [
    new RegExp(`\\b${escapeRegExp(propName)}\\s*:\\s*['"]([^'"]+)['"]`),
    new RegExp(`\\b${escapeRegExp(propName)}\\s*:\\s*\\{\\s*['"]([^'"]+)['"]\\s*\\}`),
  ]

  for (const pattern of patterns) {
    const match = String(snippet || '').match(pattern)
    if (match?.[1]) {
      return String(match[1]).trim()
    }
  }

  return ''
}

function extractQueryFilterFieldComponentName(snippet) {
  for (const [factoryName, componentName] of Object.entries(
    MANAGED_QUERY_FILTER_FIELD_FACTORY_COMPONENT_NAMES
  )) {
    if (new RegExp(`\\b${escapeRegExp(factoryName)}\\s*\\(`).test(String(snippet || ''))) {
      return componentName
    }
  }

  for (const [dslMethodName, componentName] of Object.entries(
    QUERY_FILTER_SCHEMA_DSL_COMPONENT_NAMES
  )) {
    if (new RegExp(`\\.${escapeRegExp(dslMethodName)}\\s*\\(`).test(String(snippet || ''))) {
      return componentName
    }
  }

  const match = String(snippet || '').match(/component\s*:\s*<\s*([A-Z][A-Za-z0-9.]*)\b/)
  return match?.[1] ? String(match[1]).trim() : ''
}

function extractSchemaDslFieldName(snippet) {
  const match = String(snippet || '').match(
    /\bF\(\s*[\s\S]{0,220}?,\s*['"]([^'"]+)['"]\s*\)/
  )

  return match?.[1] ? String(match[1]).trim() : ''
}

function extractSchemaDslLabel(snippet) {
  const directMatch = String(snippet || '').match(/\bF\(\s*['"]([^'"]+)['"]\s*,/)
  if (directMatch?.[1]) {
    return String(directMatch[1]).trim()
  }

  const translateMatch = String(snippet || '').match(/\bF\(\s*t\(\s*['"]([^'"]+)['"]\s*\)\s*,/)
  return translateMatch?.[1] ? String(translateMatch[1]).trim() : ''
}

function extractLiteralJsxPropValue(snippet, propName) {
  if (!snippet) return ''

  const patterns = [
    new RegExp(`\\b${escapeRegExp(propName)}\\s*=\\s*['"]([^'"]+)['"]`),
    new RegExp(`\\b${escapeRegExp(propName)}\\s*=\\s*\\{\\s*['"]([^'"]+)['"]\\s*\\}`),
  ]

  for (const pattern of patterns) {
    const match = String(snippet || '').match(pattern)
    if (match?.[1]) {
      return String(match[1]).trim()
    }
  }

  return ''
}

function isKeywordQueryFilterFieldSnippet(snippet) {
  const fieldName = extractLiteralObjectValue(snippet, 'field') || extractSchemaDslFieldName(snippet)
  const label = extractLiteralObjectValue(snippet, 'label') || extractSchemaDslLabel(snippet)

  return (
    hasAnyPattern(fieldName, [/^(keyword|keywords|search|searchKey|searchValue|query|queryKey)$/i]) ||
    hasAnyPattern(label, [/^(关键词|关键字|搜索|搜索词)$/])
  )
}

function isNonKeywordTextQueryFilterFieldSnippet(snippet) {
  if (!snippet || isKeywordQueryFilterFieldSnippet(snippet)) {
    return false
  }

  return [
    'Input',
    'SearchInput',
    'Search',
    'AutoComplete',
    'SchemaTextField',
    'ManagedQuerySearchField',
    'ManagedQueryTextField',
  ].includes(extractQueryFilterFieldComponentName(snippet))
}

function isSelectDateLikeQueryFilterFieldSnippet(snippet) {
  if (!snippet || isKeywordQueryFilterFieldSnippet(snippet)) {
    return false
  }

  return QUERY_FILTER_SELECT_DATE_COMPONENT_NAMES.includes(
    extractQueryFilterFieldComponentName(snippet)
  )
}

function summarizeQueryFilterFieldSnippet(snippet) {
  return (
    extractLiteralObjectValue(snippet, 'field') ||
    extractSchemaDslFieldName(snippet) ||
    extractLiteralObjectValue(snippet, 'label') ||
    extractSchemaDslLabel(snippet) ||
    extractQueryFilterFieldComponentName(snippet) ||
    'unknown-field'
  )
}

function collectDirectQueryFilterKeywordInputSnippets(sourceRaw) {
  return collectDirectQueryFilterFieldSnippets(sourceRaw).filter(
    (snippet) =>
      isKeywordQueryFilterFieldSnippet(snippet) &&
      ['Input', 'SchemaTextField'].includes(extractQueryFilterFieldComponentName(snippet))
  )
}

function sourceUsesManagedQueryFilterFieldChain(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /\bQueryFilter\b/,
    /\b(?:const|let|var)\s+queryFields\s*=/,
    /\bqueryFields\s*=\s*\{/,
  ])
}

function sourceDeclaresManagedQueryFilterBaseline(sourceRaw) {
  return hasAnyPattern(sourceRaw, [
    /\bqueryFilterBaseline\s*:\s*['"]managed-query-filter-fields['"]/,
    /['"]managed-query-filter-fields['"]/,
  ])
}

function snippetKeepsSearchInputSemantics(snippet) {
  if (!snippet) return false

  if (
    /\bSearchInput\b/.test(snippet) ||
    /<Search\b/.test(snippet) ||
    /\bcreateManagedQuerySearchField\s*\(/.test(snippet)
  ) {
    return true
  }

  const keepsFilledAppearance =
    /appearance\s*=\s*['"]filled['"]/.test(snippet) ||
    /appearance\s*=\s*\{\s*['"]filled['"]\s*\}/.test(snippet) ||
    /appearance\s*:\s*['"]filled['"]/.test(snippet)
  const keepsSearchAffordance =
    /\bSearchOutlined\b/.test(snippet) ||
    /icon\s*=\s*['"]search['"]/.test(snippet) ||
    /prefix\s*=\s*\{[\s\S]{0,80}search/i.test(snippet) ||
    /suffix\s*=\s*\{[\s\S]{0,80}search/i.test(snippet)

  return keepsFilledAppearance && keepsSearchAffordance
}

function snippetKeepsSharedQueryFilterTextSurface(snippet) {
  if (!snippet) return false

  const componentName = extractQueryFilterFieldComponentName(snippet)
  if (
    ['SearchInput', 'Search', 'ManagedQuerySearchField', 'ManagedQueryTextField'].includes(
      componentName
    )
  ) {
    return true
  }

  if (!['Input', 'AutoComplete', 'SchemaTextField'].includes(componentName)) {
    return true
  }

  return (
    /appearance\s*=\s*['"]filled['"]/.test(snippet) ||
    /appearance\s*=\s*\{\s*['"]filled['"]\s*\}/.test(snippet) ||
    /appearance\s*:\s*['"]filled['"]/.test(snippet)
  )
}

function snippetHasExplicitWhiteSurfaceStyle(snippet) {
  return hasAnyPattern(snippet, [
    /\bbackground(?:Color)?\s*:\s*['"](?:#fff(?:fff)?|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)|rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*1\s*\))['"]/i,
    /\bbackground(?:Color)?\s*=\s*['"](?:#fff(?:fff)?|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)|rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*1\s*\))['"]/i,
  ])
}

function snippetDriftsSharedQueryFilterSelectDateSurface(snippet) {
  if (!snippet || !isSelectDateLikeQueryFilterFieldSnippet(snippet)) {
    return false
  }

  const appearance =
    extractLiteralJsxPropValue(snippet, 'appearance') ||
    extractLiteralObjectValue(snippet, 'appearance')
  if (appearance && !['filled', 'contained'].includes(appearance)) {
    return true
  }

  return snippetHasExplicitWhiteSurfaceStyle(snippet)
}

export function validateManagedQueryFilterFieldSemantics({
  semanticContract = {},
  sourceRaw,
  pathLabel,
}) {
  const errors = []
  const directQueryFilterKeywordInputSnippets = collectDirectQueryFilterKeywordInputSnippets(sourceRaw)
  const directQueryFilterFieldSnippets = collectDirectQueryFilterFieldSnippets(sourceRaw)
  const nonKeywordTextQueryFilterFieldSnippets = directQueryFilterFieldSnippets.filter(
    isNonKeywordTextQueryFilterFieldSnippet
  )
  const selectDateQueryFilterFieldSnippets = directQueryFilterFieldSnippets.filter(
    isSelectDateLikeQueryFilterFieldSnippet
  )
  const usesManagedQueryFilterFieldChain = sourceUsesManagedQueryFilterFieldChain(sourceRaw)
  const expectsManagedQueryFilterFieldChain =
    semanticContract.queryFieldRenderProfile === 'shared-query-filter-skin' &&
    semanticContract.filterSurfaceBaseline === 'query-filter-contained-shared-surface'
  const declaresManagedQueryFilterBaseline = sourceDeclaresManagedQueryFilterBaseline(sourceRaw)
  const losesSearchInputSemantics =
    usesManagedQueryFilterFieldChain &&
    directQueryFilterKeywordInputSnippets.length > 0 &&
    directQueryFilterKeywordInputSnippets.some(
      (snippet) => !snippetKeepsSearchInputSemantics(snippet)
    )
  const nonKeywordFieldRoleDriftSnippets =
    usesManagedQueryFilterFieldChain &&
    semanticContract.queryFieldRenderProfile === 'shared-query-filter-skin' &&
    semanticContract.textFieldRole === 'filter-text-input'
      ? nonKeywordTextQueryFilterFieldSnippets.filter((snippet) =>
          snippetKeepsSearchInputSemantics(snippet)
        )
      : []
  const nonKeywordFieldSurfaceMismatchSnippets =
    usesManagedQueryFilterFieldChain &&
    semanticContract.queryFieldRenderProfile === 'shared-query-filter-skin' &&
    semanticContract.filterSurfaceBaseline === 'query-filter-contained-shared-surface'
      ? [
          ...nonKeywordTextQueryFilterFieldSnippets.filter(
            (snippet) =>
              !snippetKeepsSearchInputSemantics(snippet) &&
              !snippetKeepsSharedQueryFilterTextSurface(snippet)
          ),
          ...selectDateQueryFilterFieldSnippets.filter(
            (snippet) => snippetDriftsSharedQueryFilterSelectDateSurface(snippet)
          ),
        ]
      : []

  if (expectsManagedQueryFilterFieldChain && !usesManagedQueryFilterFieldChain) {
    errors.push(
      declaresManagedQueryFilterBaseline
        ? `${pathLabel} declares queryFilterBaseline=managed-query-filter-fields, but source never consumes that baseline through QueryFilter/queryFields. Move the page onto the managed query field chain instead of leaving filters on handwritten businessSlots.queryFilter controls.`
        : `${pathLabel} declares semanticContract.queryFieldRenderProfile=shared-query-filter-skin and filterSurfaceBaseline=query-filter-contained-shared-surface, but source never enters the managed QueryFilter/queryFields field chain. Move the page onto QueryFilter/queryFields plus managed-query-filter-fields before treating it as a managed filter baseline.`
    )
  }

  if (losesSearchInputSemantics) {
    errors.push(
      `${pathLabel} uses the managed QueryFilter field chain but the keyword search field regresses to a plain Input. Keep the table-stat/list baseline search semantics with SearchInput/Search, or keep Input on QueryFilter's filled + search-icon affordance instead of a bare text box.`
    )
  }

  if (nonKeywordFieldRoleDriftSnippets.length > 0) {
    errors.push(
      buildQueryFilterFieldRoleDriftMessage(
        pathLabel,
        [...new Set(nonKeywordFieldRoleDriftSnippets.map(summarizeQueryFilterFieldSnippet))].join(
          ', '
        )
      )
    )
  }

  if (nonKeywordFieldSurfaceMismatchSnippets.length > 0) {
    errors.push(
      buildQueryFilterSurfaceMismatchMessage(
        pathLabel,
        [
          ...new Set(nonKeywordFieldSurfaceMismatchSnippets.map(summarizeQueryFilterFieldSnippet)),
        ].join(', ')
      )
    )
  }

  return errors
}

export function normalizeQueryFilterSurfaceColor(value) {
  return String(value || '')
    .replace(/\s+/g, '')
    .toLowerCase()
}

export function classifyQueryFilterSurfaceKind(value) {
  const normalized = normalizeQueryFilterSurfaceColor(value)

  if (
    !normalized ||
    normalized === 'transparent' ||
    normalized === 'rgba(0,0,0,0)'
  ) {
    return QUERY_FILTER_SURFACE_KINDS.transparentOrMissing
  }

  if (
    normalized === 'rgb(255,255,255)' ||
    normalized === 'rgba(255,255,255,1)'
  ) {
    return QUERY_FILTER_SURFACE_KINDS.white
  }

  return QUERY_FILTER_SURFACE_KINDS.filled
}

export function isWhiteLikeQueryFilterSurfaceColor(value) {
  const surfaceKind = classifyQueryFilterSurfaceKind(value)

  return (
    surfaceKind === QUERY_FILTER_SURFACE_KINDS.transparentOrMissing ||
    surfaceKind === QUERY_FILTER_SURFACE_KINDS.white
  )
}
