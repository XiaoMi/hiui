export const isThenable = <T = AnyType>(
  thing?: PromiseLike<T> | unknown | void
): thing is PromiseLike<T> => {
  return !!(thing && typeof thing === 'object' && thing !== null && 'then' in thing)
}
