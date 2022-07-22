import { ValueOf } from '@hi-ui/core'

export const AlertTypeEnum = {
  PRIMARY: 'primary',
  WARNING: 'warning',
  DANGER: 'danger',
  SUCCESS: 'success',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type AlertTypeEnum = ValueOf<typeof AlertTypeEnum>
