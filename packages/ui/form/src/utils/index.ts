import { FormFieldPath } from './../types'
import { isArray, isNullish } from '@hi-ui/type-assertion'
import { clone, hasOwnProp } from '@hi-ui/object-utils'

// TODO: 支持 数字字符串持久化 唯一化
export const stringify = (field: FormFieldPath) => {
  return JSON.stringify(field)
}

export const parse = (fieldStr: string) => {
  return JSON.parse(fieldStr) as FormFieldPath
}

export const isValidField = (field: FormFieldPath | undefined): field is FormFieldPath => {
  if (isNullish(field) || field === '') return false
  if (isArray(field) && field.every((item) => isNullish(item) || item === '')) return false
  return true
}

export const mergeValues = <T extends Object, E extends T>(
  source: T,
  override: E | null | undefined
): T => {
  if (!override) return source
  if (!source) return clone(override)

  const target: any = clone(source)

  for (const key in override) {
    if (hasOwnProp(override, key)) {
      target[key] = override[key]
    }
  }

  return target as T
}

/**
 * 根据值的类型返回对应的空值
 */
export const getEmptyValueByType = (value: any): any => {
  // 优先处理特殊对象类型（instanceof 检查）
  if (isArray(value)) {
    return []
  }
  if (value instanceof Date) {
    return null
  }
  if (value instanceof RegExp) {
    return /(?:)/
  }
  if (value instanceof Map) {
    return new Map()
  }
  if (value instanceof Set) {
    return new Set()
  }
  // 注意：WeakMap 和 WeakSet 无法创建空实例，返回 null
  if (value instanceof WeakMap) {
    return null
  }
  if (value instanceof WeakSet) {
    return null
  }
  // 处理基本类型（typeof 检查）
  if (typeof value === 'symbol') {
    return Symbol('')
  }
  if (typeof value === 'bigint') {
    return BigInt(0)
  }
  if (typeof value === 'string') {
    return ''
  }
  if (typeof value === 'number') {
    return null
  }
  if (typeof value === 'boolean') {
    return false
  }
  if (typeof value === 'function') {
    // 函数类型重置为 undefined，因为函数不应该作为表单值
    return undefined
  }
  // 对于 null 值，保持为 null
  if (value === null) {
    return null
  }
  // 处理普通对象（必须在所有 instanceof 检查之后）
  if (typeof value === 'object') {
    return {}
  }
  // 其他类型（包括 undefined）默认返回 undefined
  return undefined
}
