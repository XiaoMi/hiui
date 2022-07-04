import React from "react"

export interface PopoverProps {
  title?: string | JSX.Element
  content: string | JSX.Element
  placement?: 'top' | 'right' | 'bottom' | 'left'
  trigger?: 'click' | 'focus' | 'hover' | 'right-click'
  visible?: boolean
  style?: React.CSSProperties
  className?: string
  overlayClassName?: string
}
declare const Popover: React.ComponentType<PopoverProps>
export default Popover
