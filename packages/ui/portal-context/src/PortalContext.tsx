import { createContext, useContext } from 'react'

export const PortalContext = createContext<UsePortalContext>(null)

export const usePortalContext = () => {
  const context = useContext(PortalContext)

  return context
}

export type UsePortalContext = { container?: HTMLElement | null | undefined } | null | undefined
