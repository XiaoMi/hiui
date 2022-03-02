import { isArray, isNullish } from '@hi-ui/type-assertion'

export const NOOP_ARRAY = [] as []

/**
 * 抹平结构为数组
 */
export const normalizeArray = <T>(arg: T | T[]) => {
  if (isNullish(arg)) return []
  return isArray(arg) ? arg : [arg]
}

/**
 * 根据指定 key 去重
 */
export const uniqBy = <T extends Record<string, any>>(array: T[], keyName: string) => {
  const visitedSet = new Set<any>()

  return array.reduce((prev, cur) => {
    const key = cur[keyName]

    if (!visitedSet.has(key)) {
      visitedSet.add(key)
      prev.push(cur)
    }

    return prev
  }, [] as T[])
}

// The maximum length of an array
const MAX_ARRAY_LENGTH = 4294967295

/**
 * Invokes the iteratee `length` times, returning an array of the results of
 * each `iteratee(index)` and the index start with `0`.
 *
 * @param length number of iteratee
 * @param iteratee function of each iteratee
 * @returns
 */
export const times = <T>(length: number, iteratee: (index: number) => T) => {
  if (length < 1) {
    return []
  }

  if (length > MAX_ARRAY_LENGTH) {
    length = MAX_ARRAY_LENGTH
  }

  const result = new Array<T>(length)

  for (let i = 0; i < length; ++i) {
    result[i] = iteratee(i)
  }

  return result
}
