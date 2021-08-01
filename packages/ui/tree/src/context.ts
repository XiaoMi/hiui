import React, { createContext, useContext } from 'react'
import { FlattedTreeNodeData } from './types'

interface TreeContext {
  selectedId?: string
  onSelect?: (node: FlattedTreeNodeData) => void
  disabled?: boolean
  draggable?: boolean
  onExpand?: (expandedNode: FlattedTreeNodeData, isExpanded: boolean) => void
  onDragStart?: (dragNode: FlattedTreeNodeData) => void
  onDragEnd?: (dragNode: FlattedTreeNodeData) => void
  onDragOver?: any
  onDrop?: any
  onLoadChildren?: (node: FlattedTreeNodeData) => Promise<any>
  checkable?: boolean
  onNodeCheck: (checkedNode: FlattedTreeNodeData, checked: boolean) => void
  showLine?: boolean
  collapseIcon?: React.ReactNode
  expandIcon?: React.ReactNode
  leafIcon?: React.ReactNode
  titleRender?: (node: FlattedTreeNodeData) => React.ReactNode
}

const treeContext = createContext<TreeContext>({})

export const TreeProvider = treeContext.Provider

export const useTreeContext = () => {
  const context = useContext(treeContext)

  if (!context) {
    throw new Error('The TreeContext context is not defined.')
  }

  return context
}
