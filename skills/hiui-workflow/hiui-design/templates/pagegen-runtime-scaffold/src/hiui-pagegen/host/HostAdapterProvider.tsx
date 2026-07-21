import React, { createContext } from 'react'
import defaultHostAdapter from './host-config'
import type { HostAdapter } from './types'

export const HostAdapterContext = createContext<HostAdapter>(defaultHostAdapter)

export type HostAdapterProviderProps = {
  adapter?: HostAdapter
  children: React.ReactNode
}

export function HostAdapterProvider({
  adapter = defaultHostAdapter,
  children,
}: HostAdapterProviderProps) {
  return <HostAdapterContext.Provider value={adapter}>{children}</HostAdapterContext.Provider>
}

export default HostAdapterProvider
