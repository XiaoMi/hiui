import { useEffect, useState } from 'react'

/**
 * A hook using for data cache that compatible with the controlled and uncontrolled modes coexist.
 */
export const useCache = <T>(data: T) => {
  const [internalData, setInternalData] = useState(data)

  useEffect(() => {
    setInternalData(data)
  }, [data])

  return [internalData, setInternalData] as const
}

export type UseCacheReturn = ReturnType<typeof useCache>
