type DataItem = {
  id?: string | number
  content?: string | JSX.Element
  disabled?: boolean
}
export interface Props {
  label?: string[]
  labelWidth?: number
  showUnderline?: boolean
  data?: DataItem[]
  defaultValue?: string[] | number[]
  value?: string[] | number[]
  onChange?: (value: number | string) => void
}
declare const Filter: React.ComponentType<Props>
export default Filter
