import React from 'react'
import { ContainerContext } from './ContainerContext'

export const ContainerProvider: React.FC<ContainerProviderProps> = ({ children, container }) => {
  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>
}

export interface ContainerProviderProps {
  /**
   * 指定 portal 的容器
   */
  container?: HTMLElement | null
}
