import { CSSProperties } from "react"

type DataItem = {
  id: string | number
  title: string
  disabled?: boolean
}
type DataSource = {
  url: string
  type?: 'get' | 'post'
  data?: object
  params?: object
  headers?: object
  mode?: 'same-origin' | 'cors' | 'no-cors' | 'navigate'
  transformResponse?: (response: object) => DataItem[]
}
const DataSourFun: (keyword: string) => DataSource
interface Props {
  type?: 'single' | 'multiple'
  data?: DataItem[]
  dataSource?: DataSource | DataSourFun
  value?: string | string[]
  defaultValue?: string | string[]
  showCheckAll?: boolean
  multipleWrap?: 'wrap' | 'nowrap'
  searchable?: boolean
  clearable?: boolean
  autoload?: boolean
  disabled?: boolean
  placeholder?: string
  emptyContent?: string | JSX.Element
  style?: CSSProperties
  optionWidth?: number
  onChange?: (selectedIds: string[], changedItem: DataItem) => void
  filterOption?: (keyword: string, item: DataItem) => boolean
  render?: (item: DataItem, selected: boolean) => JSX.Element
}
declare const Select: React.ComponentType<Props>
export default Select
