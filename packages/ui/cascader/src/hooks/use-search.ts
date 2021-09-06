import React, { useState, useCallback, useMemo } from 'react'
import { FlattedCascaderItem } from '../types'
import { useLatestRef } from '@hi-ui/use-latest'
import { __DEV__ } from '@hi-ui/env'

/**
 * 支持搜索功能的 hook
 */
export const useSearch = (
  flattedData: FlattedCascaderItem[],
  upMatch: boolean,
  filter: (option: FlattedCascaderItem) => boolean
) => {
  const [searchValue, setSearchValue] = useState('')
  const [matchedNodes, setMatchedNodes] = useState<FlattedCascaderItem[]>([])

  const flattedDataRef = useLatestRef(flattedData)

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const nextSearchValue = evt.target.value

      setSearchValue(nextSearchValue)

      // 匹配到搜索的节点，将这些节点进行展开显示，其它均隐藏
      const matchedNodes = upMatch
        ? getMatchedUpMatchNodes(flattedDataRef.current, nextSearchValue, filter)
        : getMatchedNodes(flattedDataRef.current, nextSearchValue, filter)

      console.log('matchedNodes', upMatch, matchedNodes)

      setMatchedNodes(matchedNodes)
    },
    [upMatch, flattedDataRef]
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
  flattedData: FlattedCascaderItem[],
  searchValue: string,
  filter: (option: FlattedCascaderItem) => boolean
): FlattedCascaderItem[] => {
  if (!searchValue) return []

  return flattedData.filter((node) => {
    if (typeof node.title !== 'string') {
      if (__DEV__) {
        console.info('WARNING: The `option.title` should be `string` when searchable is enabled.')
      }
      return false
    }

    if (filter(node)) return false

    // 匹配策略：`String.include`
    return node.title.includes?.(searchValue)
  })
}

/**
 * 从 value 中 找到指定的 options（逐层并向上查找）
 */
const getMatchedUpMatchNodes = (
  flattedData: FlattedCascaderItem[],
  searchValue: string,
  filter: (option: FlattedCascaderItem) => boolean
): FlattedCascaderItem[] => {
  if (!searchValue) return []

  const visitedResultSet = new Set<React.ReactText>()

  return flattedData.filter((node) => {
    if (filter(node)) return false

    while (node.parent) {
      if (visitedResultSet.has(node.id)) {
        return true
      }

      if (typeof node.title === 'string') {
        if (node.title.includes?.(searchValue)) {
          visitedResultSet.add(node.id)
          return true
        }
      } else {
        if (__DEV__) {
          console.info('WARNING: The `option.title` should be `string` when searchable is enabled.')
        }
      }

      node = node.parent
    }
    return false
  })
}
