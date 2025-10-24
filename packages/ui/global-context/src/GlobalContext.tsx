import { createContext, useContext } from 'react'

export const GlobalContext = createContext<UseGlobalContext>({})

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)

  return context
}

export type UseGlobalContext = { size?: 'sm' | 'md' }
