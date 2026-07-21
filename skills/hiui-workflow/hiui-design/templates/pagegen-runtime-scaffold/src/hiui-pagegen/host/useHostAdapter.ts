import { useContext } from 'react'
import defaultHostAdapter from './host-config'
import { HostAdapterContext } from './HostAdapterProvider'

export function useHostAdapter() {
  return useContext(HostAdapterContext) || defaultHostAdapter
}

export default useHostAdapter
