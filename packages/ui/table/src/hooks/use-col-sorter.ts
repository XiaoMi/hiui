import { useEffect, useState } from 'react'
import { useUpdateEffect } from '@hi-ui/use-update-effect'
import { UseTableProps } from '../use-table'
import { TableColumnItem } from '../types'

const DEFAULT_COLUMNS = [] as []

/**
 * 列排序
 */
export const useColSorter = ({ uniqueId, columns = DEFAULT_COLUMNS }: UseTableProps) => {
  const [sortedCols, setSortCols] = useState<TableColumnItem[]>(() => {
    return parseLocalArray({
      key: `${uniqueId}_sortCols`,
      disabled: !uniqueId,
      defaultValue: columns,
    })
  })

  useEffect(() => {
    if (!uniqueId) return
    window.localStorage.setItem(`${uniqueId}_sortCols`, JSON.stringify(sortedCols))
  }, [uniqueId, sortedCols])

  // 用于维护列操作时排序临时状态（（未确认保存时））
  const [cacheSortedCols, setCacheSortedCols] = useState(sortedCols)

  useUpdateEffect(() => {
    // 当column发生改变的时候，同步 setting 的 sortedCols 设置
    setSortCols(columns)
  }, [columns])

  return {
    sortedCols,
    setSortCols,
    cacheSortedCols,
    setCacheSortedCols,
  }
}

export type UseColSorterReturn = ReturnType<typeof useColSorter>

const parseLocalArray = ({ key, defaultValue, disabled }: any) => {
  if (!disabled) {
    try {
      let localArr = window.localStorage.getItem(key)

      if (localArr) {
        localArr = JSON.parse(localArr)

        if (Array.isArray(localArr)) {
          return localArr
        }
      }
    } catch (error) {}
  }

  return defaultValue
}
