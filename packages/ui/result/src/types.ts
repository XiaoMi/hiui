import { ValueOf } from 'packages/core/core/lib/types'
import { HiBaseSizeEnum } from '@hi-ui/core'

export const ResultTypeEnum = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type ResultTypeEnum = ValueOf<typeof ResultTypeEnum>

export type ResultImageSizeEnum = HiBaseSizeEnum | undefined
