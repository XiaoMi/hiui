import { createContext, useContext } from 'react'

interface CheckCascaderContext {
  onLoadChildren?: any
  onCheck?: any
  onSelect?: any
  disabled?: boolean
}

const checkCascaderContext = createContext<CheckCascaderContext>({})

export const CheckCascaderProvider = checkCascaderContext.Provider

export const useCheckCascaderContext = () => {
  const context = useContext(checkCascaderContext)

  if (!context) {
    throw new Error('The checkCascaderContext context should using in CheckCascader.')
  }

  return context
}
