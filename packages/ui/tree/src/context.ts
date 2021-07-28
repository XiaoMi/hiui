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
  onDrop?: any
  onLoadChildren?: () => void
  appearance?: 'linear' | 'normal'
  checkable?: boolean
  onNodeCheck?: any
  searchValue?: string
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
