import { createContext, useContext } from 'react'

interface TreeContext {
  selectedId?: string
  onSelect?: (node: any) => void
  disabled?: boolean
  draggable?: boolean
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
