import { useEffect, useState } from 'react'
import { TreeNodeData } from '../TreeNode'

/**
 * 一个缓存数据的 hook
 * @param data
 * @returns
 */
export const useCache = (data: TreeNodeData[]) => {
  const [internalData, setInternalData] = useState(data)

  useEffect(() => {
    setInternalData(data)
  }, [data])

  return [internalData, setInternalData] as const
}
