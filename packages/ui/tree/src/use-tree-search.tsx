import React, { useState, useMemo, useCallback, forwardRef } from 'react'
import { __DEV__ } from '@hi-ui/env'
import Input from '@hi-ui/input'
import { TreeDataItem, FlattedTreeNodeData, TreeNodeEventData } from './types'
import { useExpandProps } from './hooks'
import { cloneTree, getNodeAncestors } from '@hi-ui/tree-utils'
import { flattenTreeData } from './utils'
import { TreeProps, Tree, treePrefix } from './Tree'
import { SearchOutlined } from '@hi-ui/icons'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useLocaleContext } from '@hi-ui/core'
import { isUndef } from '@hi-ui/type-assertion'

import './styles/searchable-tree.scss'

const NOOP_ARRAY = [] as any[]

/**
 * 将 BaseTree 添加定制搜索功能，返回 SearchableTree
 *
 * @param props
 * @returns
 */
export const useTreeSearch = (BaseTree: Tree) => {
  const AdvancedTreeMemo = useMemo(() => {
    // 高阶组件
    const AdvancedTree = forwardRef<HTMLUListElement | null, SearchableTreeProps>(
      (
        {
          searchPlaceholder: searchPlaceholderProp,
          searchEmptyContent: searchEmptyContentProp,
          ...rest
        },
        ref
      ) => {
        const i18n = useLocaleContext()

        const searchPlaceholder = isUndef(searchPlaceholderProp)
          ? i18n.get('tree.searchPlaceholder')
          : searchPlaceholderProp
        const searchEmptyResult = isUndef(searchEmptyContentProp)
          ? i18n.get('tree.searchEmptyResult')
          : searchEmptyContentProp

        const { treeProps, searchInputProps, isEmpty } = useTreeSearchProps(rest)

        return (
          <>
            <div className={`${treeProps.prefixCls}-searcher`}>
              <Input
                {...searchInputProps}
                clearable
                clearableTrigger="always"
                placeholder={searchPlaceholder}
                prefix={searchInputProps.value ? null : <SearchOutlined />}
              />
              {isEmpty ? (
                <span className={`${treeProps.prefixCls}-searcher--empty`}>
                  {searchEmptyResult}
                </span>
              ) : null}
            </div>
            <BaseTree ref={ref} {...treeProps} />
          </>
        )
      }
    )

    if (__DEV__) {
      AdvancedTree.displayName = 'AdvancedTree'
    }

    return AdvancedTree
  }, [BaseTree])

  return AdvancedTreeMemo
}

export const useTreeSearchProps = <T extends SearchableTreeProps>(props: T) => {
  const {
    prefixCls = treePrefix,
    data,
    searchable = true,
    searchPlaceholder: searchPlaceholderProp,
    defaultExpandAll = false,
    expandedIds: expandedIdsProp,
    defaultExpandedIds = NOOP_ARRAY,
    onExpand,
    render: titleRender,
    draggable,
    onSearch,
    fieldNames,
    ...nativeTreeProps
  } = props

  const flattedData = useMemo(() => flattenTreeData(data, fieldNames), [data, fieldNames])

  // 拦截 expand：用于搜索时控制将搜到的结果高亮，并且自动展开节点
  // 但是对外仍然暴露 expand 相关 props 原有的功能
  const [expandedIds, tryToggleExpandedIds] = useExpandProps(
    flattedData,
    defaultExpandedIds,
    expandedIdsProp,
    onExpand,
    defaultExpandAll
  )

  const [searchValue, setSearchValue] = useState<string | string[]>('')
  const [matchedIds, setMatchedIds] = useState<React.ReactText[]>([])
  const [filteredIds, setFilteredIds] = useState<React.ReactText[]>([])

  const inSearch = searchable && !!searchValue
  const isEmpty = inSearch && matchedIds.length < 1

  // 拦截 titleRender，自定义高亮展示
  const proxyTitleRender = useCallback(
    (node: TreeNodeEventData) => {
      if (titleRender) {
        const ret = titleRender(node)
        if (ret && ret !== true) return ret
      }

      const ret = inSearch ? renderTitleWithHighlight(node, searchValue, prefixCls) : true

      return ret
    },
    [titleRender, inSearch, searchValue, prefixCls]
  )

  const showData = useMemo(() => getSearchedData(cloneTree(data), matchedIds, filteredIds), [
    data,
    matchedIds,
    filteredIds,
  ])

  const treeProps = {
    ...nativeTreeProps,
    prefixCls,
    fieldNames,
    data: isEmpty || !inSearch ? data : showData,
    // Fix bug: https://github.com/XiaoMi/hiui/issues/2391
    ...(nativeTreeProps.checkable ? { flattedData } : null),
    expandedIds: expandedIds,
    onExpand: tryToggleExpandedIds,
    render: proxyTitleRender,
    // 在搜索中时不允许节点拖拽操作，纯展示
    draggable: inSearch ? !inSearch : draggable,
  }

  const filterTree = useCallback(
    (keyword: string | string[], matchKey?: string[]) => {
      setSearchValue(keyword)

      // 匹配到搜索的节点，将这些节点进行展开显示，其它均隐藏
      const matchedNodes = getMatchedNodes(
        flattedData,
        typeof keyword === 'string' ? (keyword === '' ? [] : [keyword]) : keyword,
        matchKey
      )
      const filteredNodeIds = getFilteredIds(matchedNodes)

      setMatchedIds(matchedNodes.map((v) => v.id))
      setFilteredIds(filteredNodeIds)
      tryToggleExpandedIds(filteredNodeIds)
    },
    [flattedData, tryToggleExpandedIds]
  )

  const onSearchLatest = useLatestCallback(onSearch)

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const nextSearchValue = evt.target.value

      onSearchLatest(nextSearchValue)
      filterTree(nextSearchValue)
    },
    [onSearchLatest, filterTree]
  )

  const searchInputProps = {
    value: Array.isArray(searchValue) ? searchValue.join(',') : searchValue,
    onChange: handleChange,
  }

  return { treeProps, searchInputProps, isEmpty, filterTree }
}

export interface SearchableTreeProps extends TreeProps {
  /**
   * 节点可搜索，仅在 node.title 类型为字符串下支持
   */
  searchable?: boolean
  /**
   * 搜索输入占位符
   */
  searchPlaceholder?: string
  /**
   * 搜索结果为空时提示文字
   */
  searchEmptyContent?: string
  /**
   * 输入关键字搜索时触发回调
   */
  onSearch?: (keyword: string) => void
}

/**
 * 高亮节点的文本内容
 */
const renderTitleWithHighlight = (
  node: TreeNodeEventData,
  searchValue: string | string[],
  prefixCls: string
) => {
  const { title } = node

  if (typeof title !== 'string') {
    return
  }

  const values = Array.isArray(searchValue) ? searchValue : [searchValue]
  // 记录关键字对应的索引
  const valuesIndex = []

  for (let i = 0, l = values.length; i < l; i++) {
    const index = title.indexOf(values[i])
    if (index !== -1) valuesIndex.push(index)
  }

  // 没有匹配到直接返回原始内容
  if (valuesIndex.length === 0) {
    return title
  }
  // 对匹配到的内容增加高亮样式
  else {
    let startIndex = 0

    return valuesIndex.map((index, key) => {
      const beforeStr = title.substring(startIndex, index)
      startIndex = index + 1

      return (
        <span key={key}>
          {beforeStr}
          <span className={`${prefixCls}__title-text--matched`}>{title.charAt(index)}</span>
          {key === valuesIndex.length - 1 && title.length > index && title.substr(startIndex)}
        </span>
      )
    })
  }
}

/**
 * 获取搜索高亮展示的数据
 */
const getSearchedData = (
  treeData: TreeDataItem[],
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

const getMatchedNodes = (
  flattedData: FlattedTreeNodeData[],
  searchValue: string[],
  matchKey: string[] = ['title']
): FlattedTreeNodeData[] => {
  if (!searchValue || searchValue.length === 0) return []
  return flattedData.filter((node) => {
    return !!matchKey.find((item) =>
      searchValue.some((value) =>
        (node[item as keyof FlattedTreeNodeData] as string)?.includes?.(value)
      )
    )
  })
}

const getFilteredIds = (matchedNodes: FlattedTreeNodeData[]) => {
  const filterIdsSet = new Set<React.ReactText>()
  matchedNodes.forEach((node) => {
    const ancestors = getNodeAncestors(node)

    ancestors.forEach((ancestor) => {
      filterIdsSet.add(ancestor.id)
    })
  })
  return Array.from(filterIdsSet)
}
