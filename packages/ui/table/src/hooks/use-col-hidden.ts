import { useEffect, useMemo, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { TableProps } from '../Table'
import { parseLocalArray } from '../utils'

const DEFAULT_COLUMNS = [] as []
/**
 * 列操作逻辑
 */
export const useColHidden = ({
  uniqueId,
  columns = DEFAULT_COLUMNS,
  hiddenColKeys: hiddenColKeysProp,
  onHiddenColKeysChange,
}: TableProps) => {
  const cacheKey = uniqueId ? `${uniqueId}_hiddenColKeys` : ''

  const [_hiddenColKeys, setHiddenColKeys] = useUncontrolledState<string[]>(
    () => {
      return parseLocalArray({
        key: cacheKey,
        defaultValue: [],
      })
    },
    hiddenColKeysProp,
    onHiddenColKeysChange
  )

  // 保证 includes 匹配 column，是有效的可展示的列
  const hiddenColKeys = useMemo(() => {
    return _hiddenColKeys.filter((dataKey: any) => typeof dataKey === 'string' && dataKey !== '')
  }, [_hiddenColKeys])

  useEffect(() => {
    if (!cacheKey) return
    window.localStorage.setItem(cacheKey, JSON.stringify(hiddenColKeys))
  }, [cacheKey, hiddenColKeys])

  // 用于维护列操作时显隐临时状态
  const [cacheHiddenColKeys, setCacheHiddenColKeys] = useState(hiddenColKeys)

  const visibleCols = useMemo(() => {
    // TODO: 支持隐藏叶子结点，而不是根节点

    // @ts-ignore
    return columns.filter((col) => !hiddenColKeys.includes(col.dataKey))
  }, [columns, hiddenColKeys])

  return {
    visibleCols,
    hiddenColKeys,
    setHiddenColKeys,
    cacheHiddenColKeys,
    setCacheHiddenColKeys,
  }
}

export type UseColHiddenReturn = ReturnType<typeof useColHidden>
