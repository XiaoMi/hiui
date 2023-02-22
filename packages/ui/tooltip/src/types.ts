import { ValueOf } from '@hi-ui/core'

export const TooltipTriggerActionEnum = {
  CLICK: 'click',
  CONTEXTMENU: 'contextmenu',
  HOVER: 'hover',
  FOCUS: 'focus',
} as const

// 对外暴露同名联合类型

// eslint-disable-next-line no-redeclare
export type TooltipTriggerActionEnum = ValueOf<typeof TooltipTriggerActionEnum> | undefined

export interface TooltipHelpers {
  close: () => void
  update: () => void
}
