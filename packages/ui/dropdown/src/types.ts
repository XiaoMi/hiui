import { ValueOf } from '@hi-ui/core'

export const TriggerActionEnum = {
  CLICK: 'click',
  CONTEXTMENU: 'contextmenu',
  HOVER: 'hover',
} as const

export const triggerActions = Object.values(TriggerActionEnum)

// 对外暴露同名联合类型

// eslint-disable-next-line no-redeclare
export type TriggerActionEnum = ValueOf<typeof TriggerActionEnum>
