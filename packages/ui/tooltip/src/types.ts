import { ValueOf } from '@hi-ui/core'

export const TriggerActionEnum = {
  CLICK: 'click',
  CONTEXTMENU: 'contextmenu',
  HOVER: 'hover',
  FOCUS: 'focus',
} as const

export const triggerActions = Object.values(TriggerActionEnum)

// 对外暴露同名联合类型

// eslint-disable-next-line no-redeclare
export type TriggerActionEnum = ValueOf<typeof TriggerActionEnum>
export type TooltipTriggerActionEnum = TriggerActionEnum | undefined
