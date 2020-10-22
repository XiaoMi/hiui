interface Options {
  key: string
  type?: 'info' | 'success' | 'error' | 'warning'
  title?: string
  content: string | JSX.Element
  closeable?: boolean
  duration?: number
  confirmText?: string
  onClose?: (e: MouseEvent) => void
  onConfirm?: () => void
}
const OpenFun: (options: Options) => void
const CloseFun: (key: string) => void
declare class Notification extends React.Component<Props, any> {
  static open = OpenFun
  static close = CloseFun
}
export default Notification
