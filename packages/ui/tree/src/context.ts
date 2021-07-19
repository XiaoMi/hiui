import { createContext, useContext } from 'react'
import { TreeNodeData } from './TreeNode'

interface TreeContext {
  selectedId?: string
  onSelect?: (node: any) => void
  disabled?: boolean
  draggable?: boolean
  onExpand?: () => void
  onDragStart?: (dragNode: TreeNodeData) => void
  onDragEnd?: (dragNode: TreeNodeData) => void
  onDragOver?: any
  onDrop?: (
    dragNode: TreeNodeData,
    dropNode: TreeNodeData,
    data: { before: any; after: any },
    level: number
  ) => boolean | void
  onLoadChildren?: () => void
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
