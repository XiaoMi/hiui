import { CSSProperties } from "react"

type DataItem = {
  content: string
  id: string | number
  disabled?: boolean
}
interface Props {
  autoFocus?: boolean
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  className?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}
interface GroupProps {
  className?: string
  placement?: string
  data: DataItem[] | string[] | number[]
  defaultValue?: string[] | number[]
  disabled?: boolean
  name?: string
  onChange?: (checkedList: string[] | number[]) => void
  style?: CSSProperties
  value?: string[] | number[]
}
declare class Group extends React.Component<GroupProps, any> {
}
declare class Checkbox extends React.Component<Props, any> {
  static Group = Group
}
export default Checkbox

