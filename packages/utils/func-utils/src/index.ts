import { clone } from '@hi-ui/object-utils'
import { isArray, isNullish, isObjectLike, isFunction } from '@hi-ui/type-assertion'

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
 * @deprecated Remove funcs when published RC, please use normalizeArray in `@hi-ui/array-utils`
 */
export const toArray = <T>(arg: T | T[] | undefined): T[] => {
  if (isNullish(arg)) return []
  return isArray(arg) ? arg : [arg]
}

/**
 * Get value by deep key in nested object
 *
 * @deprecated Remove funcs when published RC
 *
 * @refs https://github.com/Flcwl/unext/blob/master/src/get.ts
 * @example
 *
 * get({ a: { b: 3 } }, ['a', 'b']) // 3
 */
export const getNested = <T, E>(
  obj: E,
  paths: (string | number)[] | string | number
): T | undefined => {
  paths = toArray(paths)
  const props = paths.map((p) => p + '').filter((p) => p !== '')

  let target: any = obj
  let i = 0
  const len = props.length

  for (; i < len; ++i) {
    if (isNullish(target)) {
      break
    }

    target = target[props[i]]
  }

  return i === len ? target : undefined
}

/**
 * Set value to deep key in nested object
 *
 * @deprecated Remove funcs when published RC
 *
 * @example
 *
 * setNested({ a: { b: 2 } }, ['a', 'b'], 4) // { a: { b: 4 } }
 */
export const setNested = <T>(obj: T, paths: (string | number)[] | string | number, value: any) => {
  paths = toArray(paths)

  // just support array
  const props: (string | number)[] = []
  paths.forEach((p) => {
    if (Number.isSafeInteger(p)) {
      props.push(p)
    } else {
      p = p + ''

      if (p !== '') {
        props.push(p)
      }
    }
  })

  const lastIndex = props.length - 1
  let i = 0
  let key
  let objValue
  // using clone keep pure
  obj = clone(obj)
  let target: any = obj

  while (i < lastIndex) {
    key = props[i++]
    objValue = target[key]

    if (isObjectLike(objValue)) {
      target[key] = clone(objValue)
    } else {
      // using array when path's type is number
      target[key] = typeof props[i] === 'number' ? [] : {}
    }

    target = target[key]
  }

  target[props[i]] = value

  return obj
}

/**
 * 如果值是函数，则执行使用返回值，
 * 否则直接使用值
 */
export const runIfFunc = <T, R>(valueOrFn: T | ((...fnArgs: R[]) => T), ...args: R[]): T => {
  return isFunction(valueOrFn) ? valueOrFn.apply(null, args) : valueOrFn
}

/**
 * 函数防抖优化
 * @param func 被优化函数
 * @param delay 抖动间隔
 * @returns
 */
export const debounce = <T extends AnyFunction>(func?: T, delay = 150) => {
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

export type DebounceReturn = ReturnType<typeof debounce>
