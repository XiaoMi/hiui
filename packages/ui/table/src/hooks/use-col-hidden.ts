import { useEffect, useMemo, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { TableProps } from '../Table'

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
  const [_hiddenColKeys, setHiddenColKeys] = useUncontrolledState<string[]>(
    () => {
      return parseLocalArray({
        key: `${uniqueId}_hiddenColKeys`,
        disabled: !uniqueId,
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
    if (!uniqueId) return
    window.localStorage.setItem(`${uniqueId}_hiddenColKeys`, JSON.stringify(hiddenColKeys))
  }, [uniqueId, hiddenColKeys])

  // 用于维护列操作时显隐临时状态
  const [cacheHiddenColKeys, setCacheHiddenColKeys] = useState(hiddenColKeys)

  const visibleCols = useMemo(() => {
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
