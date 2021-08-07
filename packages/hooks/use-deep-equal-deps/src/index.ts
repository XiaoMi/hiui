import { useRef } from 'react'

/**
 * A hook using for deps to deep compare
 *
 * @param deps
 * @returns
 */
export const useDeepEqualDeps = <T>(deps: T): boolean => {
  const ref = useRef<T>()
  const sameShapeRef = useRef(false)

  if (deepEqualLite(deps, ref.current) === false) {
    ref.current = deps
    sameShapeRef.current = !sameShapeRef.current
  }

  console.log('sameShapeRef.current', sameShapeRef.current)

  return sameShapeRef.current
}

const has = Object.prototype.hasOwnProperty

/**
 * Deep Compare for value，only support for basic types, object, array.
 *
 * WARNING: Use only when you have to.
 *
 * @param a
 * @param b
 * @returns
 */
const deepEqualLite = (a: any, b: any) => {
  if (a === b) return true

  let ctor, len
  if (a && b && (ctor = a.constructor) === b.constructor) {
    if (ctor === Array) {
      if ((len = a.length) === b.length) {
        while (len-- && deepEqualLite(a[len], b[len]));
      }
      return len === -1
    }

    if (!ctor || typeof a === 'object') {
      len = 0
      for (ctor in a) {
        if (has.call(a, ctor) && ++len && !has.call(b, ctor)) return false
        if (!(ctor in b) || !deepEqualLite(a[ctor], b[ctor])) return false
      }
      return Object.keys(b).length === len
    }
  }

  // eslint-disable-next-line no-self-compare
  return a !== a && b !== b
}
