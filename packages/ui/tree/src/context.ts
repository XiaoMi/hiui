import React, { createContext, useContext } from 'react'
import { TreeNodeEventData, TreeNodeDragDirection } from './types'

interface TreeContext {
  selectable?: boolean
  onSelect?: (node: TreeNodeEventData) => void
  onExpand?: (node: TreeNodeEventData, shouldExpanded: boolean) => Promise<void>
  draggable?: boolean
  dragNodeRef: React.MutableRefObject<TreeNodeEventData | null>
  onDragStart?: (evt: React.DragEvent, options: { dragNode: TreeNodeEventData }) => void
  onDragEnd?: (evt: React.DragEvent, options: { dragNode: TreeNodeEventData }) => void
  onDrop?: (
    evt: React.DragEvent,
    dragId: React.ReactText,
    dropId: React.ReactText,
    direction: TreeNodeDragDirection
  ) => void
  onDragLeave?: (
    evt: React.DragEvent,
    options: {
      // dragNode: TreeNodeEventData
      dropNode: TreeNodeEventData
    }
  ) => void
  onDragOver?: (
    evt: React.DragEvent,
    options: {
      // dragNode: TreeNodeEventData
      dropNode: TreeNodeEventData
    }
  ) => void
  onLoadChildren?: (node: TreeNodeEventData) => void | Promise<any>
  checkable?: boolean
  onCheck?: (checkedNode: TreeNodeEventData, shouldChecked: boolean) => void
  titleRender?: (node: TreeNodeEventData) => React.ReactNode
  onFocus?: (node: TreeNodeEventData) => void
  showLine?: boolean
  collapsedIcon?: React.ReactNode
  expandedIcon?: React.ReactNode
  leafIcon?: React.ReactNode
  onContextMenu?: (event: React.MouseEvent, node: TreeNodeEventData) => void
  checkOnSelect: boolean
  expandOnSelect?: boolean
}

const treeContext = createContext<TreeContext | null>(null)

export const TreeProvider = treeContext.Provider

export const useTreeContext = () => {
  const context = useContext(treeContext)

  if (!context) {
    throw new Error('The TreeContext context is not defined.')
  }

  return context
}
