import React from 'react'
import { PortalContext, UsePortalContext } from './PortalContext'
import { __DEV__ } from '@hi-ui/env'

export const PortalProvider: React.FC<PortalProviderProps> = ({ children, portal }) => {
  return <PortalContext.Provider value={portal}>{children}</PortalContext.Provider>
}

export interface PortalProviderProps {
  /**
   * 指定 portal 的容器
   */
  portal?: UsePortalContext
}

if (__DEV__) {
  PortalProvider.displayName = 'PortalProvider'
}
