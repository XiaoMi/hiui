import { CSSProperties } from "react"

type DataItem = {
  content: string
  id: string | number
  disabled?: boolean
}
interface Props {
  type?: 'desc' | 'card' | 'button' | 'editable'
  placement?: 'vertical' | 'horizontal'
  defaultActiveId?: string | number
  activeId?: string | number
  max?: number
  onTabClick?: (tabKey: string | number, event: MouseEvent) => void
  onEdit?: (action: 'add' | 'delete', index: number, tabKey: string | number) => void
}
interface PaneProps {
  tabTitle: string | JSX.Element
  tabDesc?: string | JSX.Element
  tabId: string | number
  closeable?: boolean
}
declare class Pane extends React.Component<PaneProps, any> {
}
declare class Tabs extends React.Component<Props, any> {
  static Pane = Pane
}
export default Tabs

