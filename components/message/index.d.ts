import React from 'react'

export interface MessageProps {}

export type MessageOptions = {
  type?: 'info' | 'success' | 'error' | 'warning'
  title: string
  duration?: number
  style?: React.CSSProperties
  className?: string
  onClick?: (event: React.MouseEvent) => void
  onClose?: () => void
}
const OpenFun: (options: MessageOptions) => void
declare class Message extends React.Component<MessageProps, any> {
  static open = OpenFun
}
export default Message
