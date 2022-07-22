import { isNullish, isObject, isObjectLike } from '@hi-ui/type-assertion'
import { normalizeArray } from '@hi-ui/array-utils'

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

/**
 * Will return the object type for any structure
 */
export const getObjectType = (o: unknown): string => Object.prototype.toString.call(o).slice(8, -1)

export const clone = <T>(obj: T): T => {
  if (isNullish(obj)) return obj

  const objType = getObjectType(obj)

  switch (objType) {
    case 'Date':
      const objDate: Date = obj as any
      const clonedDate = new Date()
      clonedDate.setTime(objDate.getTime())

      return (clonedDate as any) as T

    case 'Object':
      const copiedObject: any = {}

      for (const key in obj) {
        copiedObject[key] = clone(obj[key])
      }
      return copiedObject as T

    case 'Array':
      const copiedArray = []
      const objArray: Record<string, any>[] = obj as any

      for (let i = 0; i < objArray.length; ++i) {
        copiedArray.push(clone(objArray[i]))
      }

      return (copiedArray as any) as T
    default:
      // not need clone such as `BitInt`, `BitFloat`, 'RegExp'
      return obj
  }
}

/**
 * 循环引用检查
 */
// function isCyclic(obj: Object): boolean {
//   const visitedItems: Object[] = []

//   function detect(obj: any) {
//     if (obj && getObjectType(obj) === 'Object') {
//       if (visitedItems.indexOf(obj) !== -1) return true

//       visitedItems.push(obj)

//       for (const key in obj) {
//         if (hasOwnProp(obj, key) && detect(obj[key])) {
//           return true
//         }
//       }
//     }
//     return false
//   }

//   return detect(obj)
// }

/**
 * Merge object deep
 */
export const merge = <T extends Object, E extends T>(
  source: T,
  override: E | null | undefined
): T => {
  if (!override) return source
  if (!source) return clone(override)

  const target: any = source

  for (const key in override) {
    if (hasOwnProp(override, key)) {
      if (isObject(override[key])) {
        if (isObject((source as any)[key])) {
          target[key] = merge((source as any)[key], override[key])
        } else {
          target[key] = clone(override[key])
        }
      } else if (Array.isArray(override[key])) {
        if (Array.isArray((source as any)[key])) {
          target[key] = merge((source as any)[key], override[key])
        } else {
          target[key] = clone(override[key])
        }
      } else {
        target[key] = override[key]
      }
    }
  }

  return target as T
}

/**
 * Transform object to paths
 */
export const object2Paths = <T extends Object>(props: T) => {
  const objectPaths = [] as any[]

  const dig = (obj: any, parents: (string | number)[]) => {
    if (Array.isArray(obj)) {
      obj.forEach((value, index) => {
        const paths = [...parents, index]
        dig(value, paths)
      })
    } else if (isObject(obj)) {
      Object.keys(obj).forEach((key) => {
        const value = obj[key]
        const paths = [...parents, key]
        dig(value, paths)
      })
    } else {
      const varItem = [...parents, obj] as any[]
      objectPaths.push(varItem)
    }
  }

  dig(props, [])
  return objectPaths
}
