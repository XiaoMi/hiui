import { ValueOf } from 'packages/core/core/lib/types'

export const ResultTypeEnum = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type ResultTypeEnum = ValueOf<typeof ResultTypeEnum>

export type ResultImageSizeEnum = 'sm' | 'md' | 'lg' | undefined
