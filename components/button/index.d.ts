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
interface ButtonGroupProps {
  className?: string
  style?: object
  prefixCls?: string
}
declare class ButtonGroup extends React.Component<ButtonGroupProps, any> {
}
declare class Button extends React.Component<ButtonProps, any> {
  static Group = ButtonGroup
}
export default Button
