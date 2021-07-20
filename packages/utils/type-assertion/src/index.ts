export type Dict<T = any> = Record<string, T>

/**
 * Assert is an array
 */
export const isArray = <T>(arg: unknown): arg is Array<T> => Array.isArray(arg)

/**
 * Assert is an objectLike
 * TODO: Assert the return type
 */
const isObjectLike = (arg: unknown): arg is any => !!arg && typeof arg === 'object'

/**
 * Assert is an object，ignoring assertions of `Map`, `Set`, `Date` .etc
 */
export const isObject = (arg: unknown): arg is Dict => isObjectLike(arg) && !isArray(arg)

/**
 * Assert is an PromiseLike
 */
export const isPromise = <T>(arg: unknown): arg is PromiseLike<T> =>
  (isObjectLike(arg) || typeof arg === 'function') && typeof arg.then === 'function'
