interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger'
  style?: CSSProperties
  className?: string
  appearance?: 'default' | 'line'
  onClick?: (e: MouseEvent) => void
}
declare const Tag: React.ComponentType<Props>
export default Tag
