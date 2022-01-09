import { useMemo } from 'react'
import { parseChildren } from '../utils'

export const useData = ({ data, children, fieldNames }: any) => {
  return useMemo(() => {
    let mergedData

    // data 优先级大于内嵌式组合
    if (Array.isArray(data)) {
      mergedData = data
      // 支持 fieldNames
    } else if (children) {
      mergedData = parseChildren(children)
    }

    return mergedData
  }, [children, data])
}
