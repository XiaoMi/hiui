import { ReactNode, CSSProperties } from 'react'

export interface DataItem {
  id?: string | number
  content?: string | ReactNode
  label?: string | ReactNode
  disabled?: boolean
  checked?: boolean
  value?: string
  render?: (item: DataItem, checked: boolean) => ReactNode
}

interface ClickEvent {
  content?: string | ReactNode
  checked?: boolean
}

export interface GroupProps {
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
export interface CheckProps {
  className?: string
  autoFocus?: boolean
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  style?: CSSProperties
  indeterminate?: boolean
  name?: string // 缺失文档
  theme?: string // 缺失文档
  focusable?: boolean // 缺失文档
  children?: any // 缺失文档
  value?: string | number // 缺失文档
  Group: GroupProps
  render?: (item?: DataItem, checked?: boolean, checkedDom?: ReactNode) => ReactNode
  onChange?: (checkedIds: string[] | number[]) => void
  onClick?: (item: ClickEvent) => void
}
