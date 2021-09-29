import React from "react"

export type DropdownItem = {
  title: string | JSX.Element
  id: string | number
  disabled?: boolean
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
}

export interface TriggersArray {
  [index: number]: 'click' | 'contextmenu' | 'hover'
}
export interface DropdownProps {
  trigger?: TriggersArray[number] | TriggersArray
  data: DropdownItem[]
  title: string | JSX.Element
  type?: 'text' | 'button' | 'group'
  placement?: 'bottom-start' | 'top-start' | 'bottom' | 'top'
  disabled?: boolean
  width?: number
  className?: string
  style?: React.CSSProperties
  onClick?: (id: string | number) => void
  onButtonClick?: (event: React.MouseEvent) => void
  overlayClassName?: string
}
declare const Dropdown: React.ComponentType<DropdownProps>
export default Dropdown
