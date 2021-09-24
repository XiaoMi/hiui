export type DataItem = {
  content: string
  id: string | number
  disabled?: boolean
}
export type FieldNames = {
  label?: string
  value?: string
  children?: string
}
export interface Props {
  fieldNames?: FieldNames
  data: DataItem
  value: string[] | number[]
  defaultValue: string[] | number[]
  expandTrigger?: 'click' | 'hover'
  searchable?: boolean
  bordered?: boolean
  filterOption?: (keyword: string, item: DataItem) => boolean
  clearable?: boolean
  disabled?: boolean
  changeOnSelect?: boolean
  placeholder?: string
  emptyContent?: string | JSX.Element
  displayRender?: (value: string[] | number[]) => string
  style?: object
  onChange?: (value: string[] | number[]) => void
  overlayClassName?: string
  style?: React.CSSProperties
  className?: string
}
declare const Card: React.ComponentType<Props>
export default Card
