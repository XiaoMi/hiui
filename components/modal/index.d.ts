import React from "react"

interface ModalBaseProps {
  className?: string
  title?: string | JSX.Element
  cancelText?: string
  confirmText?: string
  onConfirm?: (e: React.MouseEvent) => void
  onCancel?: (e: React.MouseEvent) => void
}

export interface ModalProps extends ModalBaseProps {
  visible?: boolean
  closeable?: boolean
  maskClosable?: boolean
  size?: 'default' | 'large'
  style?: React.CSSProperties
  footer?: JSX.Element | null
  style?: React.CSSProperties
  confirmLoading?: boolean
  modalContentRef?: React.Ref<HTMLDivElement | null>
}

export interface ModalOptions extends ModalBaseProps {
  content?: string | JSX.Element
  type?: 'default' | 'success' | 'error' | 'warning' | 'info'
}

const confirmFun: (options: ModalOptions) => void

declare class Modal extends React.Component<ModalProps, any> {
  static confirm = confirmFun
}
export default Modal
