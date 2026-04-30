import React from 'react'
import { GlobalContext, UseGlobalContext } from './GlobalContext'
import { __DEV__ } from '@hi-ui/env'

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children, value }) => {
  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}

export interface GlobalProviderProps {
  value: UseGlobalContext
  children?: React.ReactNode
}

if (__DEV__) {
  GlobalProvider.displayName = 'GlobalProvider'
}
