import React from "react"

export type SelectTreeItem = {
  id: string | number
  title: string
  children?: SelectTreeItem[]
}
export type SelectTreeDataSource = {
  url: string
  type?: 'get' | 'post'
  data?: object
  params?: object
  headers?: object
  mode?: 'same-origin' | 'cors' | 'no-cors' | 'navigate'
  transformResponse?: (response: object) => SelectTreeItem[]
}

const DataSourFun: (keyword: string) => SelectTreeDataSource
const FilterOptionFun: (keyword: string, item: SelectTreeItem) => boolean
export interface SelectTreeProps {
  type?: 'single' | 'multiple'
  data?: SelectTreeItem[]
  showCheckedMode?: 'ALL' | 'PARENT' | 'CHILD'
  mode?: 'normal' | 'breadcrumb'
  defaultExpandAll?: boolean
  disabled?: boolean
  bordered?: boolean
  defaultExpandIds?: string[] | number[]
  expandIds?: string[] | number[]
  dataSource?: SelectTreeDataSource | DataSourFun
  searchMode?: 'highlight' | 'filter'
  overlayClassName?: string
  optionWidth?: number
  autoload?: boolean
  placeholder?: string
  emptyContent?: string | JSX.Element
  defaultValue?: SelectTreeItem[] | string[] | number[] | string
  onChange?: (selectedIds: string[] | string, changedItem: SelectTreeItem | SelectTreeItem[], currentNode: SelectTreeItem) => void
  valueRender?: (item: SelectTreeItem) => JSX.Element
  style?: React.CSSProperties
  value?: SelectTreeItem[] | string[] | number[] | string
  className?: string
}
declare const SelectTree: React.ComponentType<SelectTreeProps>
export default SelectTree
