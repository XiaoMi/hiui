import { useEffect, useState } from 'react'
import { useDeepEqualDeps as useDeep } from '@hi-ui/use-deep-equal-deps'

/**
 * 一个缓存数据的 hook
 *
 * @param data
 * @returns
 */
export const useCache = <T>(data: T) => {
  const [internalData, setInternalData] = useState(data)

  useEffect(() => {
    setInternalData(data)
  }, [useDeep(data)])

  return [internalData, setInternalData] as const
}
