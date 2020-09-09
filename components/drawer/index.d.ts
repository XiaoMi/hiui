import { CSSProperties } from "react"

interface Props {
  title?: string | JSX.Element
  visible?: boolean
  closable?: boolean
  maskClosable?: boolean
  showMask?: boolean
  width?: number
  footer?: JSX.Element
  placement?: 'left' | 'right'
  onClose?: (e: MouseEvent) => void
}
declare const Drawer: React.ComponentType<Props>
export default Drawer
