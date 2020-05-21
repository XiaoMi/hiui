interface Props {
  clearable?: boolean
  allowHalf?: boolean
  useEmoji?: boolean
  disabled?: boolean
  count?: number
  defaultValue?: number
  value?: number
  tooltips?: string[]
  onChange?: (value: number) => void
}
declare const Rate: React.ComponentType<Props>
export default Rate
