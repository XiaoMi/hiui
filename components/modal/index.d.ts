import React from "react"
export interface ModalProps {
  title?: string | JSX.Element
  visible?: boolean
  closeable?: boolean
  maskClosable?: boolean
  cancelText?: string
  confirmText?: string
  size?: 'default' | 'large'
  style?: React.CSSProperties
  footer?: JSX.Element | null
  onCancel?: (e: React.MouseEvent) => void
  onConfirm?: (e: React.MouseEvent) => void
  style?: React.CSSProperties
  className?: string
  confirmLoading?: boolean
}

export interface ModalOptions extends ModalProps {}

const confirmFun: (options: ModalOptions) => void

declare class Modal extends React.Component<ModalProps, any> {
  static confirm = confirmFun
}
export default Modal
