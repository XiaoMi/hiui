import React from 'react'

export interface AlertProps {
  prefixCls?: string
  style?: React.CSSProperties
  className?: string
  type?: 'primary' | 'warning' | 'success' | 'danger'
  theme?: 'hiui-blue' | 'orange' | 'cyan' | 'blue' | 'purple'
  title: string
  content?: string
  closeable?: boolean
  duration?: null | number
  onClose?: () => void
}

declare class Alert extends React.Component<AlertProps, any> {}

export default Alert
