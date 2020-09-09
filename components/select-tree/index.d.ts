import { CSSProperties } from "react"

type DataItem = {
  id: string | number
  title: string
  children?: DataItem[]
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
  showCheckedMode?: 'ALL' | 'PARENT' | 'CHILD'
  mode?: 'normal' | 'breadcrumb'
  defaultExpandAll?: boolean
  defaultExpandIds?: string[] | number[]
  expandIds?: string[] | number[]
  dataSource?: DataSource | DataSourFun
  value?: DataItem[] | string[] | number[]
  defaultValue?: DataItem[] | string[] | number[]
  searchMode?: 'highlight' | 'filter'
  onChange?: (selectedIds: string[], changedItem: DataItem) => void
  overlayClassName?: string
}
declare const SelectTree: React.ComponentType<Props>
export default SelectTree
