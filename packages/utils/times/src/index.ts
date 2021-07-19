// The maximum length of an array
const MAX_ARRAY_LENGTH = 4294967295

/**
 * Invokes the iteratee `length` times, returning an array of the results of
 * each `iteratee(index)`.
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
