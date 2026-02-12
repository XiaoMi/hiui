import { useState, useCallback } from 'react'

export function useUpdate(prefix?: string) {
  const [state, setState] = useState(0)

  const forceUpdate = useCallback(() => {
    return setState((prev) => prev + 1)
  }, [])

  return [prefix ? `${prefix}_${state}` : `${state}`, forceUpdate] as const
}
