import { isArray, isNullish } from '@hi-ui/type-assertion'
export { default as uniqBy } from 'lodash.uniqby'

export const NOOP_ARRAY = [] as []

/**
 * 抹平结构为数组
 */
export const normalizeArray = <T>(arg: T | T[]) => {
  if (isNullish(arg)) return []
  return isArray(arg) ? arg : [arg]
}
