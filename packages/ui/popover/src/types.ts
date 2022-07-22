import { ValueOf } from '@hi-ui/core'

export const PopoverTriggerActionEnum = {
  CLICK: 'click',
  CONTEXTMENU: 'contextmenu',
  HOVER: 'hover',
  FOCUS: 'focus',
} as const

// 对外暴露同名联合类型

// eslint-disable-next-line no-redeclare
export type PopoverTriggerActionEnum = ValueOf<typeof PopoverTriggerActionEnum>
