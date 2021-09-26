import React from 'react'
export type CascaderItem = {
  content: string
  id: string | number
  disabled?: boolean
}
export type CascaderFieldNames = {
  label?: string
  value?: string
  children?: string
}
export interface CascaderProps {
  fieldNames?: CascaderFieldNames
  data: CascaderItem
  value: string[] | number[]
  defaultValue: string[] | number[]
  expandTrigger?: 'click' | 'hover'
  searchable?: boolean
  bordered?: boolean
  filterOption?: (keyword: string, item: CascaderItem) => boolean
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
declare const Cascader: React.ComponentType<CascaderProps>
export default Cascader
