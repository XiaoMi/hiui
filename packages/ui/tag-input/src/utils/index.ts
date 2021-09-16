export const debounce = <T extends (...args: any[]) => void>(func?: T, delay = 150) => {
  let timer = 0

  const cancel = () => {
    if (timer) {
      window.clearTimeout(timer)
      timer = 0
    }
  }

  const debounceFn = (...args: any[]) => {
    if (timer) {
      cancel()
    }

    if (func) {
      timer = window.setTimeout(() => {
        func.apply(null, args)
        timer = 0
      }, delay)
    }
  }

  debounceFn.cancel = cancel

  return debounceFn as T & { cancel: () => void }
}
