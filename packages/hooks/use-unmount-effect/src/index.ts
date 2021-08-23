import React, { useEffect } from 'react'

/**
 * A hook for running when component unmount
 */
export const useUnmountEffect = (cleanup: () => void, deps: React.DependencyList = []) => {
  return useEffect(
    () => cleanup,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  )
}
