export type AnyFunction<T = any> = (...args: T[]) => any

export const noop: AnyFunction = () => {}

export const callAllFuncs = <T extends AnyFunction>(...funcs: (T | undefined)[]) => {
  return function mergedFunc(...args: any) {
    funcs.forEach((func) => {
      func && func(...args)
    })
  }
}
