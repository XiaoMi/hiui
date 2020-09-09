interface ButtonProps {
  value?: number
  defaultValue?: number
  step?: number
  min?: number
  max?: number
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}
declare const Counter: React.ComponentType<Props>
export default Counter
