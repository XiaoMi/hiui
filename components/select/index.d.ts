import React from "react"

export type SelectItem = {
  id: string | number
  title: string
  disabled?: boolean
  children?: SelectItem[]
}
export type SelectGroupData = {
  groupTitle: string
  groupId: string | number
  children: SelectItem
}
export type SelectDataSource = {
  url: string
  type?: 'get' | 'post'
  data?: object
  params?: object
  headers?: object
  withCredentials?: boolean
  error?: (error: object) => void
  mode?: 'same-origin' | 'cors' | 'no-cors' | 'navigate'
  transformResponse?: (response: object) => SelectItem[]
}
export type FieldNames = {
  id?: string
  title?: string
  disabled?: string
  children?: string
}
const DataSourFun: (keyword: string) => SelectDataSource
const FilterOptionFun: (keyword: string, item: SelectItem) => boolean
export interface SelectProps {
  type?: 'single' | 'multiple'
  data?: SelectItem[] | SelectGroupData[]
  fieldNames?: FieldNames
  dataSource?: SelectDataSource | DataSourFun
  value?: string | string[]
  defaultValue?: string | string[]
  showCheckAll?: boolean
  showJustSelected?: boolean
  placement?: 'bottom-start' | 'top-start' | 'bottom' | 'top'
  multipleWrap?: 'wrap' | 'nowrap'
  searchable?: boolean
  filterOption?: FilterOptionFun
  clearable?: boolean
  autoload?: boolean
  disabled?: boolean
  placeholder?: string
  emptyContent?: string | JSX.Element
  optionWidth?: number
  bordered?: boolean
  style?: React.CSSProperties
  className?: string
  onChange?: (selectedIds: string[], changedItem: SelectItem, changedItems: SelectItem[]) => void
  onSearch?: (keyword: string) => void
  onOverlayScroll?: (e: Event<HTMLDivElement>) => void
  render?: (item: SelectItem, selected: boolean) => JSX.Element
  renderExtraFooter?: () => JSX.Element
  overlayClassName?: string
  setOverlayContainer?: (triggerNode: any) => any
  onBlur?: () => void
}
declare const Select: React.ComponentType<SelectProps>
export default Select
