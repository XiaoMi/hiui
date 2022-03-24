import { FormFieldPath } from './../types'
import { isArray, isNullish } from '@hi-ui/type-assertion'

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
