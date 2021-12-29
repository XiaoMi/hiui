import { FormFieldPath } from './../types'

export const setProp = (o: any, filed: any, value: any) => {
  o[filed] = value
  return o
}

// TODO: 支持 数字字符串持久化 唯一化
export const stringify = (field: FormFieldPath) => {
  return JSON.stringify(field)
}

export const parse = (fieldStr: string) => {
  return JSON.parse(fieldStr) as FormFieldPath
}
