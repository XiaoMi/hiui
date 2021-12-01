import { isArray } from '@hi-ui/type-assertion'

export const NOOP_ARRAY = [] as []

/**
 * 抹平结构为数组
 */
export const normalizeArray = <T>(arg: T | T[]) => (isArray(arg) ? Array.from(new Set(arg)) : [arg])
