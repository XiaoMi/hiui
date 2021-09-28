import React from "react"

export interface DrawerProps {
  title?: string | JSX.Element
  visible?: boolean
  closable?: boolean
  maskClosable?: boolean
  showMask?: boolean
  width?: number
  footer?: JSX.Element
  placement?: 'left' | 'right'
  onClose?: (e: React.MouseEvent) => void
  style?: React.CSSProperties
  className?: string
}

declare const Drawer: React.ComponentType<DrawerProps>
export default Drawer
