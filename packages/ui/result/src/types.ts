import { ValueOf } from 'packages/core/core/lib/types'

export const ResultTypeEnum = {
  info: 'info',
  success: 'success',
  warn: 'warning',
  error: 'error',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type ResultTypeEnum = ValueOf<typeof ResultTypeEnum>
