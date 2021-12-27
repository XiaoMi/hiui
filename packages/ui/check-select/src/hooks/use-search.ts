import React, { useState, useCallback, useMemo } from 'react'
import { CheckSelectItem } from '../types'
import { useLatestRef } from '@hi-ui/use-latest'
import { __DEV__ } from '@hi-ui/env'
import { isArrayNonEmpty, isFunction } from '@hi-ui/type-assertion'

/**
 * 支持搜索功能的 hook
 */
export const useSearch = (
  flattedData: CheckSelectItem[],
  filter?: (keyword: string, option: CheckSelectItem) => boolean
) => {
  const [searchValue, setSearchValue] = useState('')
  const [matchedNodes, setMatchedNodes] = useState<CheckSelectItem[]>([])

  const flattedDataRef = useLatestRef(flattedData)

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const nextSearchValue = evt.target.value

      setSearchValue(nextSearchValue)

      // 匹配到搜索的节点，将这些节点进行展开显示，其它均隐藏
      const matchedNodes = getMatchedNodes(flattedDataRef.current, nextSearchValue, filter)
      setMatchedNodes(matchedNodes)
    },
    [flattedDataRef, filter]
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
  flattedData: CheckSelectItem[],
  searchValue: string,
  filter?: (keyword: string, option: CheckSelectItem) => boolean
): CheckSelectItem[] => {
  if (!searchValue) return []

  const matchedResult: any[] = []
  const shouldFilter = isFunction(filter)

  // 1. 先对于 groupTitle 匹配
  // 2. 若未匹配到。再对其 children 进行 title 匹配
  for (let i = 0; i < flattedData.length; i++) {
    const optionOrGroup = flattedData[i]

    if ('groupTitle' in optionOrGroup) {
      // search for OptionGroup

      // @ts-ignore
      const shouldReserved = shouldFilter && filter(searchValue, optionOrGroup) === true

      if (shouldReserved) {
        matchedResult.push(optionOrGroup)
        continue
      }

      if (typeof optionOrGroup.groupTitle === 'string') {
        // 匹配策略：`String.include`
        if (optionOrGroup.groupTitle.includes(searchValue)) {
          matchedResult.push(optionOrGroup)
          continue
        }
      } else {
        if (__DEV__) {
          console.info(
            'WARNING: The `optionGroup.groupTitle` should be `string` when searchable is enabled.'
          )
        }
      }

      if (isArrayNonEmpty(optionOrGroup.children)) {
        const matchedChildren = optionOrGroup.children.filter((node) => {
          if (shouldFilter) {
            // @ts-ignore
            return filter(searchValue, optionOrGroup)
          }

          if (typeof node.title !== 'string') {
            if (__DEV__) {
              console.info(
                'WARNING: The `option.title` should be `string` when searchable is enabled.'
              )
            }
            return false
          }

          return node.title.includes?.(searchValue)
        })

        if (isArrayNonEmpty(matchedChildren)) {
          const matchedOptionOrGroup = { ...optionOrGroup, children: matchedChildren }
          matchedResult.push(matchedOptionOrGroup)
        }
      }
    } else {
      // search for Option
      // @ts-ignore
      const shouldReserved = shouldFilter && filter(searchValue, optionOrGroup) === true

      if (shouldReserved) {
        matchedResult.push(optionOrGroup)
        continue
      }

      if (typeof optionOrGroup.title === 'string') {
        // 匹配策略：`String.include`
        if (optionOrGroup.title.includes(searchValue)) {
          matchedResult.push(optionOrGroup)
        }
      } else {
        if (__DEV__) {
          console.info('WARNING: The `option.title` should be `string` when searchable is enabled.')
        }
      }
    }
  }

  return matchedResult
}
