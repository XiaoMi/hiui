import { useEffect, useState } from 'react'

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
  }, [data])

  return [internalData, setInternalData] as const
}
