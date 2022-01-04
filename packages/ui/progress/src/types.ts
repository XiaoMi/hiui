import { ValueOf } from '@hi-ui/core'

export const ProgressTypeEnum = {
  PRIMARY: 'primary',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type ProgressTypeEnum = ValueOf<typeof ProgressTypeEnum>

export const ProgressSizeEnum = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type ProgressSizeEnum = ValueOf<typeof ProgressSizeEnum>

export const ProgressPlacementEnum = {
  inside: 'inside',
  outside: 'outside',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type ProgressPlacementEnum = ValueOf<typeof ProgressPlacementEnum>
