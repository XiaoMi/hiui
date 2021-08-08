import React, { createContext, useContext } from 'react'
import { FlattedTreeNodeData } from './types'
import { TreeNodeProps } from './TreeNode'

interface TreeContext {
  selectedId?: React.ReactText
  onSelect?: (node: FlattedTreeNodeData) => void
  disabled?: boolean
  draggable?: boolean
  onExpand?: (node: TreeNodeProps) => Promise<void>
  onDragStart?: (dragNode: FlattedTreeNodeData) => void
  onDragEnd?: (dragNode: FlattedTreeNodeData) => void
  onDrop?: any
  onDragLeave?: (node: FlattedTreeNodeData) => void
  onDragOver?: (node: FlattedTreeNodeData) => void
  onLoadChildren?: (node: FlattedTreeNodeData) => Promise<any>
  checkable?: boolean
  onNodeCheck?: (checkedNode: FlattedTreeNodeData, checked: boolean) => void
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
