import { React.CSSProperties } from "react"

export type DataItem = {
  content: string
  id: string | number
  disabled?: boolean
}
export type NodeData = {
  tabTitle: string | JSX.Element
  tabDesc: string | JSX.Element
  tabId: string | number
  closeable: boolean
  disabled: boolean
  animation: boolean
  newIndex?: number
}
export interface Props {
  type?: 'desc' | 'card' | 'button' | 'editable' | 'line'
  placement?: 'vertical' | 'horizontal'
  defaultActiveId?: string | number
  activeId?: string | number
  max?: number
  canScroll?: boolean
  draggable?: boolean
  style?: React.CSSProperties
  className?: string
  onTabClick?: (tabKey: string | number, event: MouseEvent) => void
  onEdit?: (action: 'add' | 'delete', index: number, tabKey: string | number) => void
  onDragStart?: (dragNode: NodeData) => void
  onDropEnd?: (dragNode: NodeData, dropNode: NodeData) => void
  onDrop?: (dragNode: NodeData, dropNode: NodeData) => void
  onAdd?: () => void
  onDelete?: (deleteNode: NodeData, index: number) => void
  onBeforeDelete?: (deleteNode: NodeData) => void
}
export interface PaneProps {
  tabTitle: string | JSX.Element
  tabDesc?: string | JSX.Element
  tabId: string | number
  closeable?: boolean
  disabled?: boolean
  animation?: boolean
  style?: React.CSSProperties
  className?: string
}
declare class Pane extends React.Component<PaneProps, any> {
}
declare class Tabs extends React.Component<Props, any> {
  static Pane = Pane
}
export default Tabs

