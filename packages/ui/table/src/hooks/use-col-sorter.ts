import { useEffect, useMemo, useState } from 'react'
import { useUpdateEffect } from '@hi-ui/use-update-effect'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestRef } from '@hi-ui/use-latest'
import { TableProps } from './../Table'
import { parseLocalArray } from '../utils'

const DEFAULT_COLUMNS = [] as []

/**
 * 列排序
 */
export const useColSorter = ({
  uniqueId,
  columns = DEFAULT_COLUMNS,
  sortedColKeys: sortedColKeysProp,
  onSortedColKeysChange,
}: TableProps) => {
  const cacheKey = uniqueId ? `${uniqueId}_sortCols` : ''

  const [sortedColKeys, setSortColKeys] = useUncontrolledState<string[]>(
    () => {
      return parseLocalArray({
        key: cacheKey,
        defaultValue: columns.map((column) => column.dataKey),
      })
    },
    sortedColKeysProp,
    onSortedColKeysChange
  )

  useUpdateEffect(() => {
    // 当column发生改变的时候，同步 setting 的 sortedCols 设置
    setSortColKeys(columns.map((column) => column.dataKey!))
  }, [columns])

  const columnsLatestRef = useLatestRef(columns)

  const sortedCols = useMemo(() => {
    const columnsMap = columnsLatestRef.current.reduce((prev, cur) => {
      prev[cur.dataKey!] = cur
      return prev
    }, {} as any)

    return sortedColKeys.map((colKey) => columnsMap[colKey]).filter(Boolean)
  }, [sortedColKeys, columnsLatestRef])

  useEffect(() => {
    if (!cacheKey) return
    window.localStorage.setItem(cacheKey, JSON.stringify(sortedColKeys))
  }, [cacheKey, sortedColKeys])

  // 用于维护列操作时排序临时状态（（未确认保存时））
  const [cacheSortedCols, setCacheSortedCols] = useState(sortedCols)

  return {
    sortedCols,
    setSortColKeys,
    cacheSortedCols,
    setCacheSortedCols,
  }
}

export type UseColSorterReturn = ReturnType<typeof useColSorter>
