import { CSSProperties } from "react"

type DataItem = {
  title: string | JSX.Element
  id: string | number
  disabled?: boolean
  href?: string
}
interface TriggersArray {
  [index: number]: 'click' | 'contextmenu' | 'hover'
}
interface Props {
  trigger?: TriggersArray[number] | TriggersArray
  data: DataItem[]
  title: string | JSX.Element
  type?: 'text' | 'button' | 'group'
  placement?: 'bottom-start' | 'top-start' | 'bottom' | 'top'
  disabled?: boolean
  width?: number
  className?: string
  style?: CSSProperties
  onClick?: (id: string | number) => void
  onButtonClick?: (event: MouseEvent) => void
  overlayClassName?: string
}
declare const Dropdown: React.ComponentType<Props>
export default Dropdown
