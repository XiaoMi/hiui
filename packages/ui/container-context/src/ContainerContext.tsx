import { createContext, useContext } from 'react'

export const ContainerContext = createContext<UseContainerContext>(null)

export const useContainerContext = () => {
  const context = useContext(ContainerContext)

  return context
}

export type UseContainerContext = HTMLElement | null | undefined
