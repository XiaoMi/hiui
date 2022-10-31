import { raf, caf } from '@hi-ui/raf'

/**
 * TODO: What is throttleByRaf
 */
export const throttleByRaf = (fn: (...args: any[]) => void) => {
  let timer: null | number = null

  const throttle = function (...args: any[]) {
    timer && caf(timer)
    timer = raf(() => {
      fn(...args)
      timer = null
    })
  }

  throttle.cancel = () => {
    caf(timer)
    timer = null
  }

  return throttle
}
