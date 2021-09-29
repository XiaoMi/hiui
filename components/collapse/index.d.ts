import React from "react"
export interface CollapseProps {
  accordion?: boolean
  defaultActiveId?: string | string[]
  activeId?: string | string[] | number | number[]
  arrowPlacement?: 'left' | 'right'
  showArrow?: boolean
  onChange?: () => void
  children: JSX.Element
  style?: React.CSSProperties
  className?: string
}
export interface CollapsePanelProps {
  id?: string
  title?: string | JSX.Element
  disabled?: boolean
  extra?: React.ReactNode
}
declare class Panel extends React.Component<CollapsePanelProps, any> {
}
declare class Collapse extends React.Component<CollapseProps, any> {
  static Panel = Panel
}
export default Collapse
