import { ValueOf } from '@hi-ui/core'

export const BadgeTypeEnum = {
  DOT: 'dot',
  BUBBLE: 'bubble',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type BadgeTypeEnum = ValueOf<typeof BadgeTypeEnum>
