import React from "react"

export type CheckboxItem = {
  content: string | number
  id: string | number
  disabled?: boolean
}
export interface CheckboxProps {
  autoFocus?: boolean
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  focusable?: boolean
}
export interface CheckboxGroupProps {
  className?: string
  placement?: string
  data: CheckboxItem[] | string[] | number[]
  defaultValue?: string[] | number[]
  disabled?: boolean
  name?: string
  onChange?: (checkedList: string[] | number[]) => void
  style?: React.CSSProperties
  value?: string[] | number[]
}
declare class Group extends React.Component<CheckboxGroupProps, any> {
}
declare class Checkbox extends React.Component<CheckboxProps, any> {
  static Group = Group
}
export default Checkbox

