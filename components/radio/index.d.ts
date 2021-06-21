type DataItem = {
  content: string
  id: string | number
  disabled?: boolean
}
interface Props {
  value?: string | number
  autoFocus?: boolean
  checked?: boolean
  disabled?: boolean
  style?: CSSProperties
  className?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}
interface GroupProps {
  placement?: 'vertical' | 'horizontal'
  data: DataItem[]
  value?: string | number
  defaultValue?: string | number
  disabled?: boolean
  type?: 'default' | 'button'
  onChange?: (value: string) => void
}
declare class Group extends React.Component<GroupProps, any> {
}
declare class Radio extends React.Component<Props, any> {
  static Group = Group
}
export default Radio

