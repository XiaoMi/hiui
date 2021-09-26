import React from "react"

export type TabsItem = {
  tabTitle: string | JSX.Element
  tabDesc: string | JSX.Element
  tabId: string | number
  closeable: boolean
  disabled: boolean
  animation: boolean
  newIndex?: number
}
export interface TabsProps {
  type?: 'desc' | 'card' | 'button' | 'editable' | 'line'
  placement?: 'vertical' | 'horizontal'
  defaultActiveId?: string | number
  activeId?: string | number
  max?: number
  canScroll?: boolean
  draggable?: boolean
  style?: React.CSSProperties
  className?: string
  onTabClick?: (tabKey: string | number, event: React.MouseEvent) => void
  onEdit?: (action: 'add' | 'delete', index: number, tabKey: string | number) => void
  onDragStart?: (dragNode: TabsItem) => void
  onDropEnd?: (dragNode: TabsItem, dropNode: TabsItem) => void
  onDrop?: (dragNode: TabsItem, dropNode: TabsItem) => void
  onAdd?: () => void
  onDelete?: (deleteNode: TabsItem, index: number) => void
  onBeforeDelete?: (deleteNode: TabsItem) => void
}
export interface TabsPaneProps {
  tabTitle: string | JSX.Element
  tabDesc?: string | JSX.Element
  tabId: string | number
  closeable?: boolean
  disabled?: boolean
  animation?: boolean
  style?: React.CSSProperties
  className?: string
}
declare class Pane extends React.Component<TabsPaneProps, any> {
}
declare class Tabs extends React.Component<TabsProps, any> {
  static Pane = Pane
}
export default Tabs

