import { useEffect, useState } from 'react'
import { UseTableProps } from '../use-table'

const DEFAULT_COLUMNS = [] as []

/**
 * 列排序
 */
export const useColSorter = ({ uniqueId, columns = DEFAULT_COLUMNS }: UseTableProps) => {
  const [sortCols, setSortCols] = useState(() => {
    return parseLocalArray({
      key: `${uniqueId}_sortCols`,
      disabled: !uniqueId,
      defaultValue: columns,
    })
  })

  useEffect(() => {
    if (!uniqueId) return
    window.localStorage.setItem(`${uniqueId}_sortCols`, JSON.stringify(sortCols))
  }, [uniqueId, sortCols])

  // 用于维护列操作时排序临时状态
  const [cacheSortCols, setCacheSortCols] = useState(sortCols)

  // 当column发生改变的时候，同步 setting 的 sortCols 设置
  useEffect(() => {
    setSortCols(columns)
  }, [columns])

  return {
    // mergedColumns,
    sortCols,
    cacheSortCols,
    setCacheSortCols,
  }
}

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
