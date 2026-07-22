import type React from 'react'

export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type RequestConfig = {
  method?: RequestMethod
  url: string
  params?: Record<string, unknown>
  data?: Record<string, unknown>
  headers?: Record<string, string>
  init?: RequestInit
}

export type ConfirmOptions = {
  title?: string
  content?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  [key: string]: unknown
}

export type HostAdapter = {
  navigate: (to: string) => void
  request: <T>(config: RequestConfig) => Promise<T | null>
  message: {
    success: (text: string) => void
    error: (text: string) => void
    warning: (text: string) => void
  }
  modal: {
    confirm: (options: ConfirmOptions) => void
  }
  i18n?: {
    t: (key: string, fallback?: string) => string
  }
}
