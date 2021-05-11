import { CSSProperties } from "react"

type DataItem = {
  id: string | number
  title: string
  disabled?: boolean
  children?: DataItem[]
}
export type DataSource = {
  url: string
  type?: 'get' | 'post'
  data?: object
  params?: object
  headers?: object
  mode?: 'same-origin' | 'cors' | 'no-cors' | 'navigate'
  transformResponse?: (response: object) => DataItem[]
}
type FieldNames = {
  id?: string
  title?: string
  disabled?: string
  children?: string
}
const DataSourFun: (keyword: string) => DataSource
const FilterOptionFun: (keyword: string, item: DataItem) => boolean
interface Props {
  type?: 'single' | 'multiple'
  data?: DataItem[]
  fieldNames?: FieldNames
  dataSource?: DataSource | DataSourFun
  value?: string | string[]
  defaultValue?: string | string[]
  showCheckAll?: boolean
  showJustSelected?: boolean
  multipleWrap?: 'wrap' | 'nowrap'
  searchable?: boolean
  filterOption?: FilterOptionFun
  clearable?: boolean
  autoload?: boolean
  disabled?: boolean
  placeholder?: string
  emptyContent?: string | JSX.Element
  style?: CSSProperties
  optionWidth?: number
  bordered?: boolean
  style?: CSSProperties
  className?: string
  onChange?: (selectedIds: string[], changedItem: DataItem, changedItems: DataItem[]) => void
  onSearch?: (keyword: string) => void
  onOverlayScroll?: (e: Event<HTMLDivElement>) => void
  render?: (item: DataItem, selected: boolean) => JSX.Element
  overlayClassName?: string
  setOverlayContainer?: (triggerNode: any) => any
}
declare const Select: React.ComponentType<Props>
export default Select
