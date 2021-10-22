import React, { useState, useCallback, useMemo } from 'react'
import { CheckSelectOptionOrOptionGroupItem } from '../types'
import { useLatestRef } from '@hi-ui/use-latest'
import { __DEV__ } from '@hi-ui/env'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'

/**
 * 支持搜索功能的 hook
 */
export const useSearch = (
  flattedData: CheckSelectOptionOrOptionGroupItem[],
  filter?: (option: CheckSelectOptionOrOptionGroupItem) => boolean
) => {
  const [searchValue, setSearchValue] = useState('')
  const [matchedNodes, setMatchedNodes] = useState<CheckSelectOptionOrOptionGroupItem[]>([])

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
  flattedData: CheckSelectOptionOrOptionGroupItem[],
  searchValue: string,
  filter?: (option: CheckSelectOptionOrOptionGroupItem) => boolean
): CheckSelectOptionOrOptionGroupItem[] => {
  if (!searchValue) return []
  console.log(flattedData)

  const matchedResult: any[] = []
  // 1. 先对于 groupTitle 匹配
  // 2. 若未匹配到。再对其 children 进行 title 匹配
  for (let i = 0; i < flattedData.length; i++) {
    const optionOrGroup = flattedData[i]

    if (typeof optionOrGroup.groupTitle === 'string') {
      if (filter && filter(optionOrGroup)) break

      // 匹配策略：`String.include`
      if (optionOrGroup.groupTitle.includes(searchValue)) {
        matchedResult.push(optionOrGroup)
        continue
      }
    } else {
      if (typeof optionOrGroup.title !== 'string') {
        if (__DEV__) {
          console.info('WARNING: The `option.title` should be `string` when searchable is enabled.')
        }
        continue
      }

      if (filter && filter(optionOrGroup)) break

      if (optionOrGroup.title.includes(searchValue)) {
        matchedResult.push(optionOrGroup)
        continue
      }
    }

    if (isArrayNonEmpty(optionOrGroup.children)) {
      const matchedChildren = optionOrGroup.children.filter((node) => {
        if (typeof node.title !== 'string') {
          if (__DEV__) {
            console.info(
              'WARNING: The `option.title` should be `string` when searchable is enabled.'
            )
          }
          return false
        }

        if (filter && filter(node)) return false

        return node.title.includes?.(searchValue)
      })

      if (isArrayNonEmpty(matchedChildren)) {
        const matchedOptionOrGroup = { ...optionOrGroup, children: matchedChildren }
        matchedResult.push(matchedOptionOrGroup)
      }
    }
  }

  return matchedResult
}
