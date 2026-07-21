import { Message, Modal } from '@hi-ui/hiui'
import type { HostAdapter, RequestConfig } from './types'

export const hostAdapterConfig = {
  projectId: 'hiui-design-generated-project',
  requestMethods: ['get', 'post', 'put', 'patch', 'delete'],
  messageApi: '@hi-ui/hiui/Message',
  modalApi: '@hi-ui/hiui/Modal',
}

function appendQueryParams(url: string, params?: Record<string, unknown>) {
  if (!params || Object.keys(params).length === 0) {
    return url
  }

  const baseOrigin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://localhost'
  const nextUrl = new URL(url, baseOrigin)

  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return
    nextUrl.searchParams.set(key, String(value))
  })

  if (/^https?:\/\//i.test(url)) {
    return nextUrl.toString()
  }

  return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
}

async function request<T>({
  method = 'get',
  url,
  params,
  data,
  headers,
  init,
}: RequestConfig): Promise<T | null> {
  if (typeof fetch !== 'function') {
    return null
  }

  const normalizedMethod = method.toUpperCase()
  const isBodyMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(normalizedMethod)
  const requestUrl = appendQueryParams(url, isBodyMethod ? undefined : params)
  const response = await fetch(requestUrl, {
    method: normalizedMethod,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: isBodyMethod && (data || params) ? JSON.stringify(data || params) : undefined,
    ...(init || {}),
  })

  if (!response.ok) {
    throw new Error(`host request failed: ${response.status}`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return response.text() as Promise<T>
}

export const defaultHostAdapter: HostAdapter = {
  navigate: (to) => {
    if (typeof window !== 'undefined') {
      window.location.hash = to
    }
  },
  request,
  message: {
    success: (text) => Message.open({ type: 'success', title: text }),
    error: (text) => Message.open({ type: 'error', title: text }),
    warning: (text) => Message.open({ type: 'warning', title: text }),
  },
  modal: {
    confirm: (options) => {
      Modal.confirm({
        title: options.title,
        content: options.content,
        onConfirm: options.onConfirm,
        onCancel: options.onCancel,
      } as never)
    },
  },
  i18n: {
    t: (key, fallback) => fallback || key,
  },
}

export default defaultHostAdapter
