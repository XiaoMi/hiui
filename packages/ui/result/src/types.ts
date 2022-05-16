import { ValueOf } from 'packages/core/core/lib/types'
import { HiBaseSizeEnum } from '@hi-ui/core'

export const ResultTypeEnum = {
  info: 'info',
  success: 'success',
  warn: 'warning',
  error: 'error',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type ResultTypeEnum = ValueOf<typeof ResultTypeEnum>

export type ResultImageSizeEnum = HiBaseSizeEnum | undefined
