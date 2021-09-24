export interface Props {
  title?: string | JSX.Element
  content: string | JSX.Element
  placement?: 'top' | 'right' | 'bottom' | 'left'
  trigger?: 'click' | 'focus' | 'hover'
  visible?: boolean
  style?: React.CSSProperties
  className?: string
  overlayClassName?: string
}
declare const Popover: React.ComponentType<Props>
export default Popover
