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
