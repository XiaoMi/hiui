import React, { useState, useCallback, useMemo } from 'react'
import { SelectItem } from '../types'
import { useLatestRef } from '@hi-ui/use-latest'
import { __DEV__ } from '@hi-ui/env'

/**
 * 支持搜索功能的 hook
 */
export const useSearch = (flattedData: SelectItem[], filter?: (option: SelectItem) => boolean) => {
  const [searchValue, setSearchValue] = useState('')
  const [matchedNodes, setMatchedNodes] = useState<SelectItem[]>([])

  const flattedDataRef = useLatestRef(flattedData)

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const nextSearchValue = evt.target.value

      setSearchValue(nextSearchValue)

      // 匹配到搜索的节点，将这些节点进行展开显示，其它均隐藏
      const matchedNodes = getMatchedNodes(flattedDataRef.current, nextSearchValue, filter)

      setMatchedNodes(matchedNodes)
    },
    [flattedDataRef]
  )

  const inputProps = useMemo(
    () => ({
      value: searchValue,
      onChange: handleChange,
    }),
    [searchValue, handleChange]
  )

  const resetSearch = useCallback(() => {
    setSearchValue('')
  }, [])

  const isSearch = !!searchValue
  const isEmpty = isSearch && matchedNodes.length === 0

  return [isSearch, matchedNodes, inputProps, isEmpty, resetSearch] as const
}

/**
 * 从 value 中 找到指定的 options（逐层查找）
 */
const getMatchedNodes = (
  flattedData: SelectItem[],
  searchValue: string,
  filter?: (option: SelectItem) => boolean
): SelectItem[] => {
  if (!searchValue) return []

  return flattedData.filter((node) => {
    if (typeof node.title !== 'string') {
      if (__DEV__) {
        console.info('WARNING: The `option.title` should be `string` when searchable is enabled.')
      }
      return false
    }

    if (filter && filter(node)) return false

    // 匹配策略：`String.include`
    return node.title.includes?.(searchValue)
  })
}
