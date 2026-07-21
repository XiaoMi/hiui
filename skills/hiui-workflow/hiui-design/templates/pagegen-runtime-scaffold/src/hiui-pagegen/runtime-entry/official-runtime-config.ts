declare global {
  interface Window {
    __HIUI_PAGEGEN_OFFICIAL_RUNTIME_ORIGIN__?: string
  }
}

const DEFAULT_OFFICIAL_RUNTIME_ORIGIN = 'http://localhost:4173'
const LOCAL_STORAGE_KEY = 'hiui-pagegen:official-runtime-origin'
const FEEDBACK_STATUS_VARIANT_PAGE_MAP: Record<string, string> = {
  'empty-state': 'empty-state',
  'load-fail': 'load-fail',
  'network-error': 'network-error',
  'no-permission': 'no-permission',
  'page-not-found': 'page-not-found',
  'intranet-offline': 'intranet-offline',
  'under-construction': 'under-construction',
}

function normalizeOrigin(rawOrigin?: string | null) {
  const trimmed = String(rawOrigin || '').trim().replace(/\/+$/, '')
  return trimmed || DEFAULT_OFFICIAL_RUNTIME_ORIGIN
}

function encodeUnicodeBase64(rawValue: string) {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(unescape(encodeURIComponent(rawValue)))
  }

  return Buffer.from(rawValue, 'utf8').toString('base64')
}

export function resolveOfficialRuntimeOrigin() {
  if (typeof window === 'undefined') {
    return DEFAULT_OFFICIAL_RUNTIME_ORIGIN
  }

  const globalOrigin = normalizeOrigin(window.__HIUI_PAGEGEN_OFFICIAL_RUNTIME_ORIGIN__)
  if (globalOrigin !== DEFAULT_OFFICIAL_RUNTIME_ORIGIN) {
    return globalOrigin
  }

  try {
    const storedOrigin = normalizeOrigin(window.localStorage.getItem(LOCAL_STORAGE_KEY))
    if (storedOrigin !== DEFAULT_OFFICIAL_RUNTIME_ORIGIN) {
      return storedOrigin
    }
  } catch {
    // Ignore localStorage access errors and fall back to the default dev origin.
  }

  return DEFAULT_OFFICIAL_RUNTIME_ORIGIN
}

export function encodeOfficialRuntimePayload(payload: Record<string, unknown>) {
  return encodeUnicodeBase64(JSON.stringify(payload))
}

export function buildOfficialRuntimePageUrl(
  pageId: string,
  origin = resolveOfficialRuntimeOrigin(),
  extraParams: Record<string, string> = {}
) {
  const url = new URL(`${normalizeOrigin(origin)}/`)
  url.searchParams.set('page', pageId)
  url.searchParams.set('standalone', '1')

  Object.entries(extraParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value)
    }
  })

  return url.toString()
}

export function resolveOfficialRuntimePageId(
  pageType: string,
  runtimePageId: string,
  schema?: Record<string, unknown>
) {
  if (pageType !== 'feedback-status') {
    return runtimePageId
  }

  const requestedVariant = String(schema?.variant || '').trim()
  return FEEDBACK_STATUS_VARIANT_PAGE_MAP[requestedVariant] || runtimePageId
}

export function getOfficialRuntimeOriginStorageKey() {
  return LOCAL_STORAGE_KEY
}
