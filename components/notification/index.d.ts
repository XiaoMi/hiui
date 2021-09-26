import React from "react"

export interface NotificationProps {
  key: string
  type?: 'info' | 'success' | 'error' | 'warning'
  title?: string
  content: string | JSX.Element
  closeable?: boolean
  duration?: number
  confirmText?: string
  style?: React.CSSProperties
  className?: string
  onClose?: (e: React.MouseEvent) => void
  onConfirm?: () => void
}

export interface NotificationOptions extends NotificationProps {}

const OpenFun: (options: NotificationOptions) => void
const CloseFun: (key: string) => void
declare class Notification extends React.Component<NotificationProps, any> {
  static open = OpenFun
  static close = CloseFun
}
export default Notification
