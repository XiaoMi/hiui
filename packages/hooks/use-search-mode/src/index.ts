import React, { useCallback, useState } from 'react'
import { isArray, isArrayNonEmpty } from '@hi-ui/type-assertion'
import { UseDataSource, useDataSource } from '@hi-ui/use-data-source'
import { invariant } from '@hi-ui/env'
import { filterTree, getNodeAncestors, cloneTree } from '@hi-ui/tree-utils'

/**
 * TODO: What is useSearchMode
 */
export const useSearchMode = ({ searchable: searchableProp, strategies }: UseSearchModeProps) => {
  const [keyword, setKeyword] = useState('')

  // 搜索时的临时节点数据
  const [stateInSearch, setStateInSearch] = useState<any>({
    matched: false,
    data: [],
    expandedIds: [],
  })

  const resetState = useCallback(() => {
    setStateInSearch({
      matched: false,
      data: [],
      expandedIds: [],
    })
  }, [])

  // 搜索策略，优先级按数组查找顺序
  const strategy = strategies.find((strategy) => {
    return strategy && strategy.enabled
  })

  // 帮助用户自动开启 searchable
  const searchable = searchableProp === false ? false : !!strategy
  const searchMode: string = (searchable && strategy && strategy.name) || ''

  const onSearch = useCallback(
    (keyword: string) => {
      if (!searchable) return

      setKeyword(keyword)

      if (keyword) {
        strategy.run(keyword, setStateInSearch)
      }
    },
    [searchable, strategy]
  )

  const inSearch = !!keyword
  const isEmpty = inSearch && stateInSearch.data.length === 0

  return {
    searchable,
    searchMode,
    keyword,
    onSearch,
    inSearch,
    isEmpty,
    state: stateInSearch,
    setStateInSearch,
    resetState,
  }
}

export interface UseSearchModeProps<T = any> {
  /**
   * 节点搜索模式，仅在mode=normal模式下生效
   */
  searchMode?: 'highlight' | 'filter'
  /**
   * 自定义搜索过滤器，仅在 searchable 为 true 时有效
   * 第一个参数为输入的关键字，
   * 第二个为数据项，返回值为 true 时将出现在结果项
   */
  filterOption?: (keyword: string, item: any) => boolean
  /**
   * 开启检索
   */
  searchable?: boolean
  /**
   * 异步加载数据
   */
  dataSource?: UseDataSource<T>
  //  DataSourceFun | TreeSelectDataSource | Promise<TreeSelectDataItem[]>
  strategies: any[]
}

export type UseSearchModeReturn = ReturnType<typeof useSearchMode>

export const useAsyncSearch = ({ dataSource }: any) => {
  // 提到外部
  const { loading, hasError, loadRemoteData } = useDataSource({ dataSource, validate: isArray })

  const onAsyncSearch = useCallback(
    (keyword: string, dispatch) => {
      // setStatus('loading')
      loadRemoteData(keyword)
        .then((asyncData: any) => {
          // setStatus('fulfilled')
          dispatch({
            matched: isArrayNonEmpty(asyncData),
            data: asyncData,
            expandedIds: [],
          })
        })
        .catch(() => {
          // setStatus('rejected')
        })
    },
    [loadRemoteData]
  )

  return { name: 'dataSource', enabled: !!dataSource, run: onAsyncSearch, loading, hasError }
}

export const useTreeCustomSearch = ({ data, filterOption }: any) => {
  const onCustomSearch = useCallback(
    (keyword: string, dispatch: any) => {
      const matchedNodes = filterTree(data, (node) => filterOption(keyword, node))
      // filterOption 模式展开全部 ? 用户自行控制 expanded 展开
      // const filteredNodeIds = visitTree.map((item) => {
      // return item.id
      // })
      dispatch({
        matched: isArrayNonEmpty(matchedNodes),
        data: matchedNodes,
        expandedIds: [],
      })
    },
    [data, filterOption]
  )

  return { name: 'filterOption', enabled: !!filterOption, run: onCustomSearch }
}

export const useHighlightSearch = ({ data, flattedData, searchMode }: any) => {
  const onSearch = useCallback(
    (keyword: string, dispatch: any) => {
      // 1. 展开匹配节点树
      // 2. 高亮匹配节点文本
      const matchedNodes = getMatchedNodes(flattedData, keyword)
      const filteredNodeIds = getFilteredIds(matchedNodes)

      dispatch({
        matched: isArrayNonEmpty(matchedNodes),
        data: data,
        expandedIds: filteredNodeIds,
      })
    },
    [data, flattedData]
  )

  return { name: 'highlight', enabled: searchMode === 'highlight', run: onSearch }
}

export const useFilterSearch = ({
  enabled,
  searchMode = 'filter',
  data,
  flattedData,
  exclude,
}: any) => {
  const onSearch = useCallback(
    (keyword: string, dispatch: any) => {
      // 1. 展开匹配节点树
      // 2. 高亮匹配节点文本
      // 3. 过滤掉（隐藏）不相干的兄弟和祖先节点
      const matchedNodes = getMatchedNodes(flattedData, keyword, exclude)
      const filteredNodeIds = getFilteredIds(matchedNodes)
      const showData = getSearchedData(
        cloneTree(data),
        matchedNodes.map((v) => v.id),
        filteredNodeIds
      )

      dispatch({
        matched: isArrayNonEmpty(matchedNodes),
        data: showData,
        expandedIds: filteredNodeIds,
      })
    },
    [data, flattedData]
  )

  return { name: searchMode, enabled, run: onSearch }
}

export const useNormalFilterSearch = ({ enabled, searchMode = 'filter', data, exclude }: any) => {
  const onSearch = useCallback(
    (keyword: string, dispatch: any) => {
      // 1. 展开匹配节点树
      // 2. 高亮匹配节点文本
      // 3. 过滤掉（隐藏）不相干的兄弟和祖先节点
      const matchedNodes = getMatchedNodes(data, keyword, exclude)

      dispatch({
        matched: isArrayNonEmpty(matchedNodes),
        data: matchedNodes,
      })
    },
    [data]
  )

  return { name: searchMode, enabled, run: onSearch }
}

export const useTreeUpMatchSearch = ({ enabled, flattedData, data, exclude }: any) => {
  const onSearch = useCallback(
    (keyword: string, dispatch: any) => {
      // 1. 从子至父匹配节点
      // 2. 高亮匹配节点文本
      // 3. 过滤掉（隐藏）不相干的兄弟和祖先节点
      const matchedNodes = getMatchedUpMatchNodes(flattedData, keyword, exclude)

      dispatch({
        matched: isArrayNonEmpty(matchedNodes),
        data: matchedNodes,
      })
    },
    [flattedData]
  )

  return { name: 'upMatch', enabled, run: onSearch }
}

/**
 * 从 value 中 找到指定的 options（逐层查找）
 */
const getMatchedNodes = (
  data: any[],
  keyword: string,
  exclude?: (option: any) => boolean
): any[] => {
  if (!keyword) return []

  return data.filter((node) => {
    if (exclude && exclude(node)) return false

    return matchStrategy(node.title, keyword) !== -1
  })
}

const getFilteredIds = (matchedNodes: any[]) => {
  const expandNodeIdsSet = new Set<React.ReactText>()

  matchedNodes.forEach((item) => {
    if (isArrayNonEmpty(item.children)) {
      expandNodeIdsSet.add(item.id)
    }
    const ancestors = getNodeAncestors(item)
    ancestors.forEach((ancestor) => {
      expandNodeIdsSet.add(ancestor.id)
    })
  })
  return Array.from(expandNodeIdsSet)
}

/**
 * 获取搜索高亮展示的数据
 */
const getSearchedData = (
  treeData: any[],
  matchedIds: React.ReactText[],
  filteredIds: React.ReactText[]
) => {
  for (let i = 0; i < treeData.length; ++i) {
    const node = treeData[i]
    if (matchedIds.includes(node.id)) {
      // do nothing
    } else if (filteredIds.includes(node.id)) {
      if (node.children) {
        getSearchedData(node.children, matchedIds, filteredIds)
      }
    } else {
      treeData.splice(i, 1)
      i = i - 1
    }
  }

  return treeData
}

/**
 * 从 value 中 找到指定的 options（逐层并向上查找）
 */
const getMatchedUpMatchNodes = (
  flattedData: any[],
  keyword: string,
  filter: (option: any) => boolean
): any[] => {
  if (!keyword) return []

  const visitedResultSet = new Set<React.ReactText>()

  return flattedData.filter((node) => {
    if (filter && filter(node)) return false

    while (node.parent) {
      if (visitedResultSet.has(node.id)) {
        return true
      }

      if (matchStrategy(node.title, keyword) !== -1) {
        visitedResultSet.add(node.id)
        return true
      }

      node = node.parent
    }
    return false
  })
}

/**
 * 匹配策略
 */
export const matchStrategy = (content: unknown, keyword: string, ignoreCase = true) => {
  if (typeof content !== 'string') {
    invariant(true, 'The `title` should be `string` when searchable is enabled.')

    // 返回 -1 表示无法完成匹配
    return -1
  }

  if (ignoreCase) {
    // 忽略大小写敏感进行匹配
    return content.toLowerCase().indexOf(keyword.toLowerCase())
  }

  return content.indexOf(keyword)
}
