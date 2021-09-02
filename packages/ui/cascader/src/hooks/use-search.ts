import React, { useState, useCallback } from 'react'
import { FlattedCascaderItem } from '../types'
import { useLatestRef } from '@hi-ui/use-latest'

/**
 * 支持搜索功能的 hook
 */
export const useSearch = (flattedData: FlattedCascaderItem[], upMatch: boolean) => {
  const [searchValue, setSearchValue] = useState('')
  const [matchedNodes, setMatchedNodes] = useState<FlattedCascaderItem[]>([])

  const flattedDataRef = useLatestRef(flattedData)

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const nextSearchValue = evt.target.value

      setSearchValue(nextSearchValue)

      // 匹配到搜索的节点，将这些节点进行展开显示，其它均隐藏
      const matchedNodes = upMatch
        ? getMatchedUpMatchNodes(flattedDataRef.current, nextSearchValue)
        : getMatchedNodes(flattedDataRef.current, nextSearchValue)
      console.log(matchedNodes)

      setMatchedNodes(matchedNodes)
    },
    [upMatch]
  )

  const inputProps = {
    value: searchValue,
    onChange: handleChange,
  }

  const isSearch = !!searchValue
  const isEmpty = isSearch && matchedNodes.length === 0

  return [isSearch, matchedNodes, inputProps, isEmpty] as const
}

/**
 * 从 value 中 找到指定的 options（逐层查找）
 */
const getMatchedNodes = (
  flattedData: FlattedCascaderItem[],
  searchValue: string
): FlattedCascaderItem[] => {
  if (!searchValue) return []

  return flattedData.filter((node) => {
    if (typeof node.title !== 'string') return false
    if (!node.checkable) return false

    // 匹配策略：`String.include`
    return node.title.includes?.(searchValue)
  })
}

/**
 * 从 value 中 找到指定的 options（逐层并向上查找）
 */
const getMatchedUpMatchNodes = (
  flattedData: FlattedCascaderItem[],
  searchValue: string
): FlattedCascaderItem[] => {
  if (!searchValue) return []

  const visitedResultSet = new Set<React.ReactText>()

  return flattedData.filter((node) => {
    if (!node.checkable) return false

    while (node.parent) {
      if (visitedResultSet.has(node.id)) {
        return true
      }

      if (typeof node.title === 'string') {
        if (node.title.includes?.(searchValue)) {
          visitedResultSet.add(node.id)
          return true
        }
      }

      node = node.parent
    }
    return false
  })
}
