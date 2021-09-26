import React from 'react'
export type TagItem = {
  title?: string;
  tagId?: string | number;
  closable?: boolean;
  editable?: boolean;
}

export interface TagProps {
  type?: 'primary' | 'success' | 'warning' | 'danger'
  appearance?: 'default' | 'line'
  shape?: 'round' | 'square'
  color?: string
  style?: React.CSSProperties
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export interface TagGroupProps {
  data?: TagItem[]
  editable?: boolean
  onAdd?: (addNode: TagItem, index: number) => void
  onEdit?: (addNode: TagItem, index: number) => void
  onDelete?: (addNode: TagItem, index: number) => void
}

declare class TagGroup extends React.Component<TagGroupProps, any> {
}
declare class Tag extends React.Component<TagProps, any> {
  static Group = TagGroup
}
export default Tag
