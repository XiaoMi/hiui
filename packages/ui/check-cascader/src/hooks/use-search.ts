import React, { useState, useCallback } from 'react'
import { FlattedCheckCascaderItem } from '../types'
import { useLatestRef } from '@hi-ui/use-latest'
import { __DEV__ } from '@hi-ui/env'

/**
 * 支持搜索功能的 hook
 */
export const useSearch = (flattedData: FlattedCheckCascaderItem[], upMatch: boolean) => {
  const [searchValue, setSearchValue] = useState('')
  const [matchedNodes, setMatchedNodes] = useState<FlattedCheckCascaderItem[]>([])

  const flattedDataRef = useLatestRef(flattedData)

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const nextSearchValue = evt.target.value

      setSearchValue(nextSearchValue)

      // 匹配到搜索的节点，将这些节点进行展开显示，其它均隐藏
      const matchedNodes = upMatch
        ? getMatchedUpMatchNodes(flattedDataRef.current, nextSearchValue)
        : getMatchedNodes(flattedDataRef.current, nextSearchValue)

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
  flattedData: FlattedCheckCascaderItem[],
  searchValue: string
): FlattedCheckCascaderItem[] => {
  if (!searchValue) return []

  return flattedData.filter((node) => {
    if (!node.checkable) return false

    return matchStrategy(node.title, searchValue) !== -1
  })
}

/**
 * 从 value 中 找到指定的 options（逐层并向上查找）
 */
const getMatchedUpMatchNodes = (
  flattedData: FlattedCheckCascaderItem[],
  searchValue: string
): FlattedCheckCascaderItem[] => {
  if (!searchValue) return []

  const visitedResultSet = new Set<React.ReactText>()

  return flattedData.filter((node) => {
    if (!node.checkable) return false

    while (node.parent) {
      if (visitedResultSet.has(node.id)) {
        return true
      }

      // TODO: 自定义用户搜索，比如查询 id，或者异步搜索
      if (matchStrategy(node.title, searchValue) !== -1) {
        visitedResultSet.add(node.id)
        return true
      }

      node = node.parent
    }
    return false
  })
}

/**
 * 返回 -1 表示匹配失败
 */
export const matchStrategy = (content: unknown, keyword: string) => {
  if (typeof content !== 'string') {
    if (__DEV__) {
      console.warn('Warning: must be string type when enable searchable.')
    }
    return -1
  }
  // 忽略大小写匹配
  return content.toLowerCase().indexOf(keyword.toLowerCase())
}
