export const __DEV__ = process.env.NODE_ENV !== 'production'

export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const invariant = (condition: any, format: string, ...args: any[]) => {
  if (__DEV__) {
    if (!condition) {
      let argIndex = 0
      const message = `[HiUI] ` + format.replace(/%s/g, () => args[argIndex++])

      try {
        // To find the call stack of error.
        throw new Error(message)
      } catch (error) {
        // support for SSR.
        if (typeof console !== 'undefined') {
          console.error(error)
        }
      }
    }
  }
}
