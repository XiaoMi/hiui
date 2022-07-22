import React, { useEffect } from 'react'

/**
 * A hook that running effect when component mounted, like componentDidMount life cycle.
 */
export const useDidMount = (effect: React.EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}

export type UseDidMountReturn = ReturnType<typeof useDidMount>
