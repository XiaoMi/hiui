import clone from 'lodash/clone'
import { isArray, isNullish, isObjectLike } from '@hi-ui/type-assertion'

export type AnyFunction<T = any> = (...args: T[]) => any

export const noop: AnyFunction = () => {}

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwnProp = (obj: object, key: string): boolean => hasOwnProperty.call(obj, key)

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

/**
 * Get value by deep key in nested object
 *
 * @refs https://github.com/Flcwl/unext/blob/master/src/get.ts
 * @example
 *
 * get({ a: { b: 3 } }, ['a', 'b']) // 3
 */
export const getNested = <T, E>(obj: E, paths: (string | number)[]): T | undefined => {
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
 * @example
 *
 * setNested({ a: { b: 2 } }, ['a', 'b'], 4) // { a: { b: 4 } }
 */
export const setNested = <T>(obj: T, paths: (string | number)[], value: any) => {
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
