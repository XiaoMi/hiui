import { ValueOf } from '@hi-ui/core'

// TODO: 抽离公告定义
export const ModalType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type ModalTypeEnum = ValueOf<typeof ModalType>
