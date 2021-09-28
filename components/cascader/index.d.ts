import React from 'react'
export type CascaderItem = {
  id: string | number
  content: string
  disabled?: boolean
  children?: CascaderItem[]
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
  emptyContent?: string | React.ReactNode
  displayRender?: (value: string[] | number[]) => string
  onChange?: (value: string[] | number[]) => void
  onOpen?: () => void
  onClose?: () => void
  overlayClassName?: string
  style?: React.CSSProperties
  className?: string
}
declare const Cascader: React.ComponentType<CascaderProps>
export default Cascader
