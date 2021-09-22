import { CSSProperties } from "react"

type DataItem = {
  id: string | number
  title: string
  disabled?: boolean
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
  fieldNames?: FieldNames
  disabled?: boolean
  bordered?: boolean
  defaultExpandIds?: string[] | number[]
  expandIds?: string[] | number[]
  dataSource?: DataSource | DataSourFun
  searchMode?: 'highlight' | 'filter'
  overlayClassName?: string
  optionWidth?: number
  autoload?: boolean
  placeholder?: string
  emptyContent?: string | JSX.Element
  defaultValue?: DataItem[] | string[] | number[] | string
  onChange?: (selectedIds: string[] | string, changedItem: DataItem | DataItem[], currentNode: DataItem) => void
  valueRender?: (item: DataItem) => JSX.Element
  style?: CSSProperties
  value?: DataItem[] | string[] | number[] | string
  className?: string
}
declare const SelectTree: React.ComponentType<Props>
export default SelectTree
