import { CSSProperties } from "react"

export type DataItem = {
  title: string | JSX.Element
  id: string | number
  disabled?: boolean
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
}

export interface TriggersArray {
  [index: number]: 'click' | 'contextmenu' | 'hover'
}
export interface Props {
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
