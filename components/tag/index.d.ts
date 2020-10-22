interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger'
  appearance?: 'default' | 'line'
  onClick?: (e: MouseEvent) => void
}
declare const Tag: React.ComponentType<Props>
export default Tag
