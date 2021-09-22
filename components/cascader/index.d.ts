import React from "react"

type FieldNames = {
  label?: string
  value?: string
  children?: string
}

type DataItem = {
  id: string | number
  content: string
  disabled?: boolean
  children?: DataItem[]
}
interface Props {
  fieldNames?: FieldNames
  data: DataItem []
  value?: string[] | number[]
  defaultValue?: string[] | number[]
  expandTrigger?: 'click' | 'hover'
  searchable?: boolean
  bordered?: boolean
  filterOption?: (keyword: string, item: DataItem) => boolean
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
  style?: CSSProperties
  className?: string
}
declare const Cascader: React.ComponentType<Props>
export default Cascader
