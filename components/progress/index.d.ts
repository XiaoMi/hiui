export interface Props {
  apperance?: 'bar' | 'circle' | 'dashboard'
  size?: 'large' | 'default' | 'small'
  active?: boolean
  content?: string | JSX.Element
  showInfo?: boolean
  type?: 	'primary' | 'success' | 'warning' | 'error'
  radius?: number
  placement?: 'inside' | 'outside'
  width?: string | number
  height?: string | number
  style?: React.CSSProperties
  className?: string
}
declare const Progress: React.ComponentType<Props>
export default Progress
