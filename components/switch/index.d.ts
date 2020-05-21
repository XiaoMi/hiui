interface Props {
  content?: string[] | JSX.Element[]
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
}
declare const Switch: React.ComponentType<Props>
export default Switch
