import React, { createContext, useContext } from 'react'
import { TreeNodeEventData, TreeNodeDragDirection } from './types'

interface TreeContext {
  selectable?: boolean
  onSelect?: (node: TreeNodeEventData) => void
  onExpand?: (node: TreeNodeEventData, shouldExpanded: boolean) => Promise<void>
  draggable?: boolean
  onDragStart?: (dragNode: TreeNodeEventData) => void
  onDragEnd?: (dragNode: TreeNodeEventData) => void
  onDrop?: (
    dragId: React.ReactText,
    dropId: React.ReactText,
    direction: TreeNodeDragDirection
  ) => void
  onDragLeave?: (node: TreeNodeEventData) => void
  onDragOver?: (node: TreeNodeEventData) => void
  onLoadChildren?: (node: TreeNodeEventData) => void | Promise<any>
  checkable?: boolean
  onCheck?: (checkedNode: TreeNodeEventData, shouldChecked: boolean) => void
  titleRender?: (node: TreeNodeEventData) => React.ReactNode
  onFocus?: (node: TreeNodeEventData) => void
  showLine?: boolean
  collapseIcon?: React.ReactNode
  expandIcon?: React.ReactNode
  leafIcon?: React.ReactNode
  onContextMenu?: (event: React.MouseEvent, node: TreeNodeEventData) => void
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
