import React from "react"

export type FilterItem = {
  id?: string | number
  content?: string | JSX.Element
  disabled?: boolean
}
export interface FilterProps {
  label?: string[]
  labelWidth?: number
  showUnderline?: boolean
  data?: FilterItem[]
  defaultValue?: string[] | number[]
  value?: string[] | number[]
  onChange?: (value: number | string) => void
}
declare const Filter: React.ComponentType<FilterProps>
export default Filter
