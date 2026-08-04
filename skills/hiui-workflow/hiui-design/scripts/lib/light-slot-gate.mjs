import fs from 'node:fs/promises'

const LIST_PAGE_TYPES = new Set(['table-basic', 'table-stat', 'tree-table'])

function issue(code, message, path = '', severity = 'error') {
  return { code, message, path, severity }
}

function normalizeString(value) {
  return String(value ?? '').trim()
}

function extractArraySection(source, slotId) {
  const marker = new RegExp(`${slotId}\\s*:\\s*\\[`, 'u')
  const match = marker.exec(source)
  if (!match) return ''
  const openIndex = source.indexOf('[', match.index)
  if (openIndex < 0) return ''
  let depth = 0
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index]
    if (char === '[') depth += 1
    if (char === ']') depth -= 1
    if (depth === 0) return source.slice(openIndex, index + 1)
  }
  return ''
}

function extractStringValues(source, propertyName) {
  const pattern = new RegExp(`${propertyName}\\s*:\\s*['\"]([^'\"]+)['\"]`, 'gu')
  return [...source.matchAll(pattern)].map((match) => match[1]).filter(Boolean)
}

function hasEmptyObjectSlot(source, slotId) {
  return new RegExp(`${slotId}\\s*:\\s*\\{\\s*\\}`, 'u').test(source)
}

function hasBooleanTrue(source, propertyName) {
  return new RegExp(`${propertyName}\\s*:\\s*true\\b`, 'u').test(source)
}

function extractActionHandlerObjectSource(instanceSource) {
  const match = /(?:const|let|var)\s+actionHandlers\s*=\s*\{/u.exec(instanceSource)
  if (!match) return ''
  const openIndex = instanceSource.indexOf('{', match.index)
  let depth = 0
  for (let index = openIndex; index < instanceSource.length; index += 1) {
    const char = instanceSource[index]
    if (char === '{') depth += 1
    if (char === '}') depth -= 1
    if (depth === 0) return instanceSource.slice(openIndex, index + 1)
  }
  return ''
}

function implementedHandlerNames(instanceSource) {
  const handlersObject = extractActionHandlerObjectSource(instanceSource)
  if (!handlersObject) return { names: new Set(), analyzable: false }
  const names = new Set()
  for (const match of handlersObject.matchAll(/(?:^|[,{\s])([a-zA-Z_$][\w$]*)\s*:/gu)) {
    names.add(match[1])
  }
  for (const match of handlersObject.matchAll(/(?:^|[,{\s])([a-zA-Z_$][\w$]*)\s*\(/gu)) {
    names.add(match[1])
  }
  return { names, analyzable: true }
}

export function evaluateLightSlotSource({ slotsSource, instanceSource = '', plan = {}, limits = {} }) {
  const issues = []
  const normalizedPlan = {
    pageType: normalizeString(plan.pageType),
    dataMode: normalizeString(plan.dataMode || 'unknown'),
    validationLevel: normalizeString(plan.validationLevel || 'preview'),
  }
  const queryFields = extractArraySection(slotsSource, 'queryFields')
  const tableColumns = extractArraySection(slotsSource, 'tableColumns')
  const rowActions = extractArraySection(slotsSource, 'rowActions')
  const declaredHandlers = [
    ...extractStringValues(slotsSource, 'handler'),
  ]

  if (!slotsSource.includes('export const slots')) {
    issues.push(issue('slots-export-not-found', 'Unable to find `export const slots`; slot gate needs manual review.', 'slots', 'warning'))
  }

  if (LIST_PAGE_TYPES.has(normalizedPlan.pageType)) {
    const disablesDefaultKeyword = hasBooleanTrue(slotsSource, 'disableDefaultKeywordSearch')
    if (!disablesDefaultKeyword && extractStringValues(queryFields, 'name').includes('keyword')) {
      issues.push(issue('query-keyword-conflict', 'Default keyword search conflicts with queryFields.name=keyword. Set disableDefaultKeywordSearch=true or rename the business field.', 'queryFields'))
    }
  }

  if (declaredHandlers.length > 0) {
    const implemented = implementedHandlerNames(instanceSource)
    if (!implemented.analyzable) {
      issues.push(issue('action-handlers-not-analyzable', 'actionHandlers object is not statically analyzable; handler coverage needs manual review.', 'actionHandlers', 'warning'))
    } else {
      for (const handlerName of declaredHandlers) {
        if (!implemented.names.has(handlerName)) {
          issues.push(issue('action-handler-missing', `Declared handler ${handlerName} is not implemented in actionHandlers.`, 'actionHandlers'))
        }
      }
    }
  }

  if (normalizedPlan.validationLevel === 'delivery' && normalizedPlan.dataMode === 'mock') {
    issues.push(issue('mock-data-delivery-blocked', 'dataMode=mock cannot be promoted to delivery-ready.', 'dataMode'))
  }
  if (normalizedPlan.validationLevel === 'delivery' && hasEmptyObjectSlot(slotsSource, 'apiBinding')) {
    issues.push(issue('empty-api-binding-delivery-blocked', 'apiBinding={} cannot be promoted to delivery-ready without a real request contract.', 'apiBinding'))
  }

  const queryFieldLimit = Number(limits.maxQueryFields || 6)
  const tableColumnLimit = Number(limits.maxTableColumns || 12)
  const rowActionLimit = Number(limits.maxRowActions || 4)
  const queryFieldCount = extractStringValues(queryFields, 'name').length
  const tableColumnCount = extractStringValues(tableColumns, 'dataIndex').length || extractStringValues(tableColumns, 'title').length
  const rowActionCount = extractStringValues(rowActions, 'id').length || extractStringValues(rowActions, 'handler').length

  if (queryFieldCount > queryFieldLimit) {
    issues.push(issue('query-field-count-exceeded', `queryFields count ${queryFieldCount} exceeds limit ${queryFieldLimit}.`, 'queryFields'))
  }
  if (tableColumnCount > tableColumnLimit) {
    issues.push(issue('table-column-count-exceeded', `tableColumns count ${tableColumnCount} exceeds limit ${tableColumnLimit}.`, 'tableColumns'))
  }
  if (rowActionCount > rowActionLimit) {
    issues.push(issue('row-action-count-exceeded', `rowActions count ${rowActionCount} exceeds limit ${rowActionLimit}.`, 'rowActions'))
  }

  return {
    ok: issues.every((item) => item.severity !== 'error'),
    status: issues.some((item) => item.severity === 'error') ? 'failed' : issues.length > 0 ? 'needs-manual-review' : 'passed',
    issues,
    facts: {
      queryFieldCount,
      tableColumnCount,
      rowActionCount,
      declaredHandlers,
    },
  }
}

export async function runLightSlotGate({ slotsPath, instancePath = '', plan = {}, limits = {} }) {
  const slotsSource = await fs.readFile(slotsPath, 'utf8')
  const instanceSource = instancePath ? await fs.readFile(instancePath, 'utf8').catch(() => '') : ''
  return evaluateLightSlotSource({ slotsSource, instanceSource, plan, limits })
}
