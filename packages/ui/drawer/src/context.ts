import { createContext, useContext } from 'react'

import { UseDrawerReturn } from './use-drawer'

const DrawerContext = createContext<Omit<UseDrawerReturn, 'rootProps'> | null>(null)

export const DrawerProvider = DrawerContext.Provider

export const useDrawerContext = () => {
  const context = useContext(DrawerContext)

  if (!context) {
    throw new Error('The DrawerContext context should using in Drawer.')
  }

  return context
}
