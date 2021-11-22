import { isArray, isNullish } from '@hi-ui/type-assertion'

export type AnyFunction<T = any> = (...args: T[]) => any

export const noop: AnyFunction = () => {}

export const callAllFuncs = <T extends AnyFunction>(...funcs: (T | undefined)[]) => {
  return function mergedFunc(...args: any) {
    funcs.forEach((func) => {
      func && func(...args)
    })
  }
}

export const toArray = <T>(arg: T | T[] | undefined): T[] => {
  if (isNullish(arg)) return []
  return isArray(arg) ? arg : [arg]
}
