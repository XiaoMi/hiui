import React from 'react'
type TagNode = {
  title?: string
  tagId?: string | number
  closable?: boolean
  editable?: boolean
}
interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger'
  appearance?: 'default' | 'line'
  shape?: 'round' | 'square'
  color?: string
  style?: CSSProperties
  className?: string
  onClick?: (e: MouseEvent) => void
}

interface TagGroupProps {
  data?: TagNode[]
  editable?: boolean
  onAdd?:(addNode:TagNode, index:number) => void
  onEdit?:(addNode:TagNode, index:number) => void
  onDelete?:(addNode:TagNode, index:number) => void
}

declare class TagGroup extends React.Component<TagGroupProps, any> {
}
declare class Tag extends React.Component<Props, any> {
  static Group = TagGroup
}
export default Tag
