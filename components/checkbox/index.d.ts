import { React.CSSProperties } from "react"

export type DataItem = {
  content: string | number
  id: string | number
  disabled?: boolean
}
export interface Props {
  autoFocus?: boolean
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  className?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  focusable?: boolean
}
export interface GroupProps {
  className?: string
  placement?: string
  data: DataItem[] | string[] | number[]
  defaultValue?: string[] | number[]
  disabled?: boolean
  name?: string
  onChange?: (checkedList: string[] | number[]) => void
  style?: React.CSSProperties
  value?: string[] | number[]
}
declare class Group extends React.Component<GroupProps, any> {
}
declare class Checkbox extends React.Component<Props, any> {
  static Group = Group
}
export default Checkbox

