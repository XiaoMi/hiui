import { isNil, isPlainObject } from 'lodash-es'

export function localCompare(a: unknown, b: unknown) {
  try {
    // 字符串，直接比较
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b)
    }

    // null/undefined/空对象/空数组，认为相等
    if (isNil(a) || isNil(b)) return 0
    if (isPlainObject(a) || isPlainObject(b)) return 0
    if (Array.isArray(a) || Array.isArray(b)) return 0

    // 其他类型，转换为字符串比较
    const aStr = String(a)
    const bStr = String(b)
    return aStr.localeCompare(bStr)
  } catch (error) {
    console.log('utils.sort.localCompare', error)
    return 0
  }
}
