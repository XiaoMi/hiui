import { CSSProperties } from "react"
interface Props {
  title?: string | JSX.Element
  visible?: boolean
  closeable?: boolean
  maskCloseable?: boolean
  cancelText?: string
  confirmText?: string
  size?: 'default' | 'large'
  style?: CSSProperties
  footer?: JSX.Element | null
  onCancel?: (e: MouseEvent) => void
  onConfirm?: (e: MouseEvent) => void
  style?: CSSProperties
  className?: string
}
declare const Modal: React.ComponentType<Props>
export default Modal
