export const __DEV__ = process.env.NODE_ENV !== 'production'

export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)
