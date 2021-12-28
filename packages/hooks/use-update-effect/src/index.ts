import React, { useRef, useEffect } from 'react'

/**
 * A hook that running effect when component update, like componentUpdate life cycle.
 */
export const useUpdateEffect = (effect: React.EffectCallback, deps: React.DependencyList) => {
  const mountedRef = useRef(false)

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return undefined
    }
    return effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export type UseUpdateEffectReturn = ReturnType<typeof useUpdateEffect>
