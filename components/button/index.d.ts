interface ButtonProps {
  type?: 'primary' | 'line' | 'success' | 'danger' | 'default' | 'warning'
  size?: 'large' | 'small' | 'normal' | 'default'
  appearance?: 'button' | 'link'
  className?: string
  style?: object
  disabled?: boolean
  href?: string
  loading?: boolean
  target?: '_self' | '_blank' | '_parent' | '_top'
  icon?: string
  onClick?: () => void
}
declare const Button: React.ComponentType<Props>
export default Button
