import { createContext, useContext } from 'react'

import { UseAnchorReturn } from './use-anchor'

const AnchorContext = createContext<Omit<UseAnchorReturn, 'rootProps'> | null>(null)

export const AnchorProvider = AnchorContext.Provider

export const useAnchorContext = () => {
  const context = useContext(AnchorContext)

  if (!context) {
    throw new Error('The AnchorContext context should using in Anchor.')
  }

  return context
}
