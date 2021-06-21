interface Props {
  content?: string[] | JSX.Element[]
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  style?: CSSProperties
  className?: string
  onChange?: (checked: boolean) => void
}
declare const Switch: React.ComponentType<Props>
export default Switch
