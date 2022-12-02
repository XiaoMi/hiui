import { useMemo } from 'react'
import { TableProps } from '../Table'

const DEFAULT_COLUMNS = [] as []

/**
 * 列设置
 */
export const useColSet = ({
  columns = DEFAULT_COLUMNS,
  sortedColKeys: sortedColKeysProp,
  hiddenColKeys: hiddenColKeysProp,
}: TableProps) => {
  const isColumnsEqual: boolean = useMemo(() => {
    // 判断columns和之前的是不是一样的，如果之前columns对不上，那么认为设置数据无效。
    if (!sortedColKeysProp) {
      return true
    }
    if (columns.length !== sortedColKeysProp.length) {
      return false
    }

    for (let cIndex = 0; cIndex < columns.length; cIndex++) {
      let exist: boolean = false
      const dataKey = columns[cIndex]?.dataKey
      for (let sIndex = 0; sIndex < sortedColKeysProp.length; sIndex++) {
        if (dataKey === sortedColKeysProp[sIndex]) {
          exist = true
          break
        }
      }
      if (!exist) {
        return false
      }
    }
    return true
  }, [columns, sortedColKeysProp])

  return {
    sortedColKeys: isColumnsEqual ? sortedColKeysProp : undefined,
    hiddenColKeys: isColumnsEqual ? hiddenColKeysProp : undefined,
  }
}

export type UseColSetReturn = ReturnType<typeof useColSet>
