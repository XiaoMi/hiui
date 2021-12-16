import { useEffect, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { UseTableProps } from '../use-table'

const DEFAULT_COLUMNS = [] as []
/**
 * 列操作逻辑
 */
export const useColHidden = ({
  uniqueId,
  columns = DEFAULT_COLUMNS,
  hiddenColKeys: hiddenColKeysProp,
  onHiddenColKeysChange,
}: UseTableProps) => {
  const [_hiddenColKeys, setHiddenColKeys] = useUncontrolledState(
    () =>
      parseLocalArray({
        key: `${uniqueId}_hiddenColKeys`,
        disabled: !uniqueId,
        defaultValue: [],
      }),
    hiddenColKeysProp,
    onHiddenColKeysChange
  )

  // 用于维护列操作时显隐临时状态
  const [cacheHiddenColKeys, setCacheHiddenColKeys] = useState(_hiddenColKeys)

  // 过滤掉 undefined 和 null，保证 includes 匹配 column（对象可能未声明 `key` 属性 ） 是有效的可展示的列
  const hiddenColKeys = _hiddenColKeys.filter((key: any) => key != null)
  // const mergedColumns = sortCols.filter((col: any) => !hiddenColKeys.includes(getColKeyValue(col)))

  useEffect(() => {
    if (uniqueId) {
      window.localStorage.setItem(`${uniqueId}_hiddenColKeys`, JSON.stringify(hiddenColKeys))
    }
  }, [uniqueId, hiddenColKeys])

  return {
    // mergedColumns,
    hiddenColKeys,
    cacheHiddenColKeys,
    setCacheHiddenColKeys,
    setHiddenColKeys,
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
