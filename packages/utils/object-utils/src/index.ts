import clone from 'lodash.clone'
import { isNullish, isObjectLike } from '@hi-ui/type-assertion'
import { normalizeArray } from '@hi-ui/array-utils'

export { default as clone } from 'lodash.clone'
export { default as cloneDeep } from 'lodash.clonedeep'

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwnProp = (obj: object, key: string): boolean => hasOwnProperty.call(obj, key)

/**
 * Get value by deep key in nested object
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
  paths = normalizeArray(paths)
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
export const setNested = <T>(obj: T, paths: (string | number)[] | string | number, value: any) => {
  paths = normalizeArray(paths)

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
