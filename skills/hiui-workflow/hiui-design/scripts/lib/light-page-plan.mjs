import fs from 'node:fs/promises'
import path from 'node:path'

export const LIGHT_PAGE_PLAN_SCHEMA_VERSION = 'hiui-light-page-plan.v1'
export const LIGHT_PAGE_PLAN_OUTPUT_DIR = '.local-context/hiui-design/outputs/light-plans'

const VALID_MODES = new Set(['legacy-host-compatible', 'rules-only', 'host-integration'])
const VALID_DATA_MODES = new Set(['mock', 'real', 'hybrid', 'unknown'])
const VALID_VALIDATION_LEVELS = new Set(['preview', 'delivery'])
const VALID_SOURCE_TYPES = new Set(['ai-generated', 'script-derived', 'manual', 'migration'])
const PAGE_TYPE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u

function issue(code, message, pathLabel = '') {
  return { code, message, path: pathLabel }
}

function isPlainObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

function normalizeString(value) {
  return String(value ?? '').trim()
}

export function toPosixPath(value) {
  return normalizeString(value).replace(/\\/g, '/')
}

export function hasUnsafePathSegment(value) {
  const normalized = toPosixPath(value)
  return (
    !normalized ||
    path.isAbsolute(normalized) ||
    normalized.startsWith('~') ||
    normalized.split('/').some((part) => part === '..')
  )
}

export function normalizePlanRelativePath(value) {
  return toPosixPath(value).replace(/^\.\//u, '').replace(/\/+$|\s+$/gu, '')
}

export function toLightPlanSlug(pagePath) {
  const normalized = normalizePlanRelativePath(pagePath).replace(/\.[cm]?[jt]sx?$/u, '')
  return normalized.replace(/[^a-zA-Z0-9_-]+/g, '__') || 'page'
}

export function getDefaultLightPlanPath(targetRoot, pagePath) {
  return path.join(targetRoot, LIGHT_PAGE_PLAN_OUTPUT_DIR, `${toLightPlanSlug(pagePath)}.json`)
}

export function resolvePlanPath(targetRoot, planPath) {
  const root = path.resolve(targetRoot || process.cwd())
  const rawPlanPath = normalizeString(planPath)
  if (!rawPlanPath) {
    return {
      ok: false,
      path: '',
      issues: [issue('missing-plan-path', 'Missing light page plan path.', 'plan')],
    }
  }

  const absolutePath = path.isAbsolute(rawPlanPath) ? path.resolve(rawPlanPath) : path.resolve(root, rawPlanPath)
  const relativePath = path.relative(root, absolutePath)
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return {
      ok: false,
      path: absolutePath,
      issues: [issue('plan-path-outside-target', 'Light page plan path must stay inside target root.', 'plan')],
    }
  }

  return { ok: true, path: absolutePath, relativePath: relativePath.replace(/\\/g, '/'), issues: [] }
}

export function normalizeLightPagePlan(rawPlan) {
  const source = isPlainObject(rawPlan?.source) ? rawPlan.source : {}
  return {
    schemaVersion: normalizeString(rawPlan?.schemaVersion),
    mode: normalizeString(rawPlan?.mode),
    pageType: normalizeString(rawPlan?.pageType),
    pagePath: normalizePlanRelativePath(rawPlan?.pagePath),
    writeScope: Array.isArray(rawPlan?.writeScope)
      ? rawPlan.writeScope.map(normalizePlanRelativePath).filter(Boolean)
      : [],
    dataMode: normalizeString(rawPlan?.dataMode || 'unknown'),
    validationLevel: normalizeString(rawPlan?.validationLevel || 'preview'),
    createdAt: normalizeString(rawPlan?.createdAt),
    source: {
      type: normalizeString(source.type),
      summary: normalizeString(source.summary),
      ...(normalizeString(source.requestId) ? { requestId: normalizeString(source.requestId) } : {}),
      ...(Array.isArray(source.evidenceRefs)
        ? { evidenceRefs: source.evidenceRefs.map(normalizeString).filter(Boolean) }
        : {}),
    },
    ...(Array.isArray(rawPlan?.notes) ? { notes: rawPlan.notes.map(normalizeString).filter(Boolean) } : {}),
  }
}

export function validateLightPagePlan(rawPlan, options = {}) {
  const issues = []
  if (!isPlainObject(rawPlan)) {
    return {
      ok: false,
      plan: null,
      issues: [issue('invalid-plan-object', 'Light page plan must be a JSON object.', '')],
    }
  }

  const plan = normalizeLightPagePlan(rawPlan)
  if (plan.schemaVersion !== LIGHT_PAGE_PLAN_SCHEMA_VERSION) {
    issues.push(issue('invalid-schema-version', `Expected ${LIGHT_PAGE_PLAN_SCHEMA_VERSION}.`, 'schemaVersion'))
  }
  if (!VALID_MODES.has(plan.mode)) {
    issues.push(issue('invalid-mode', 'Light page plan mode is not supported.', 'mode'))
  }
  if (!PAGE_TYPE_PATTERN.test(plan.pageType)) {
    issues.push(issue('invalid-page-type', 'Light page plan pageType must be a kebab-case page type id.', 'pageType'))
  }
  if (Array.isArray(options.knownPageTypes) && options.knownPageTypes.length > 0 && !options.knownPageTypes.includes(plan.pageType)) {
    issues.push(issue('unknown-page-type', `Unknown pageType: ${plan.pageType}.`, 'pageType'))
  }
  if (hasUnsafePathSegment(plan.pagePath)) {
    issues.push(issue('unsafe-page-path', 'Light page plan pagePath must be a non-empty relative path without traversal.', 'pagePath'))
  }
  if (!Array.isArray(plan.writeScope) || plan.writeScope.length === 0) {
    issues.push(issue('missing-write-scope', 'Light page plan writeScope must contain at least one relative path pattern.', 'writeScope'))
  } else {
    for (const [index, scope] of plan.writeScope.entries()) {
      if (hasUnsafePathSegment(scope)) {
        issues.push(issue('unsafe-write-scope', 'Light page plan writeScope entries must be relative and must not escape the project.', `writeScope.${index}`))
      }
    }
  }
  if (!VALID_DATA_MODES.has(plan.dataMode)) {
    issues.push(issue('invalid-data-mode', 'Light page plan dataMode is not supported.', 'dataMode'))
  }
  if (!VALID_VALIDATION_LEVELS.has(plan.validationLevel)) {
    issues.push(issue('invalid-validation-level', 'Light page plan validationLevel is not supported.', 'validationLevel'))
  }
  if (!plan.createdAt || Number.isNaN(Date.parse(plan.createdAt))) {
    issues.push(issue('invalid-created-at', 'Light page plan createdAt must be a valid date-time string.', 'createdAt'))
  }
  if (!VALID_SOURCE_TYPES.has(plan.source.type)) {
    issues.push(issue('invalid-source-type', 'Light page plan source.type is not supported.', 'source.type'))
  }
  if (!plan.source.summary) {
    issues.push(issue('missing-source-summary', 'Light page plan source.summary is required.', 'source.summary'))
  }

  return { ok: issues.length === 0, plan, issues }
}

export async function readLightPagePlan(planPath, options = {}) {
  const targetRoot = options.targetRoot || process.cwd()
  const resolved = resolvePlanPath(targetRoot, planPath)
  if (!resolved.ok) {
    return { ok: false, plan: null, path: resolved.path, relativePath: '', issues: resolved.issues }
  }

  let rawText = ''
  try {
    rawText = await fs.readFile(resolved.path, 'utf8')
  } catch (error) {
    return {
      ok: false,
      plan: null,
      path: resolved.path,
      relativePath: resolved.relativePath,
      issues: [issue('plan-read-failed', error instanceof Error ? error.message : String(error), 'plan')],
    }
  }

  let rawPlan
  try {
    rawPlan = JSON.parse(rawText)
  } catch (error) {
    return {
      ok: false,
      plan: null,
      path: resolved.path,
      relativePath: resolved.relativePath,
      issues: [issue('plan-json-invalid', error instanceof Error ? error.message : String(error), 'plan')],
    }
  }

  const validation = validateLightPagePlan(rawPlan, options)
  return {
    ...validation,
    path: resolved.path,
    relativePath: resolved.relativePath,
  }
}
