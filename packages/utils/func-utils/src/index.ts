import { isFunction } from '@hi-ui/type-assertion'

export type AnyFunction<T = any> = (...args: T[]) => any

export const noop: AnyFunction = () => {}

export const callAllFuncs = <T extends AnyFunction>(...funcs: (T | undefined)[]) => {
  return function mergedFunc(...args: any) {
    funcs.forEach((func) => {
      func && func(...args)
    })
  }
}

/**
 * 如果值是函数，则执行使用返回值，
 * 否则直接使用值
 */
export const runIfFunc = <T, R>(valueOrFn: T | ((...fnArgs: R[]) => T), ...args: R[]): T => {
  return isFunction(valueOrFn) ? valueOrFn.apply(null, args) : valueOrFn
}
