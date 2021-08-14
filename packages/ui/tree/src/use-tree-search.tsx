import React, { useState, useMemo, useCallback, forwardRef } from 'react'
import { __DEV__ } from '@hi-ui/env'
import Input from '@hi-ui/input'
import { useDeepEqualDeps as useDeep } from '@hi-ui/use-deep-equal-deps'
import { TreeNodeData, FlattedTreeNodeData, TreeNodeEventData } from './types'
import { useExpandProps } from './hooks'
import cloneDeep from 'lodash.clonedeep'
import { flattenTreeData } from './utils'
import { TreeProps, Tree, _prefix } from './Tree'
import { SearchOutlined } from '@hi-ui/icons'

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
    const AdvancedTree = forwardRef<HTMLUListElement | null, SearchableTreeProps>((props, ref) => {
      const [treeProps, searchInputProps, isEmpty] = useTreeSearchProps(props)

      return (
        <>
          <div className={`${treeProps.prefixCls}-searcher`}>
            <Input
              clearable
              clearableTrigger="always"
              {...searchInputProps}
              suffix={searchInputProps.value ? null : <SearchOutlined />}
            />
            {isEmpty ? (
              <span className={`${treeProps.prefixCls}-searcher--empty`}>未找到相关结果</span>
            ) : null}
          </div>
          <BaseTree ref={ref} {...treeProps} />
        </>
      )
    })
    if (__DEV__) {
      AdvancedTree.displayName = 'AdvancedTree'
    }

    return AdvancedTree
  }, [BaseTree])

  return AdvancedTreeMemo
}

export const useTreeSearchProps = <T extends SearchableTreeProps>(props: T) => {
  const {
    prefixCls = _prefix,
    data,
    searchable = true,
    defaultExpandAll = false,
    expandedIds: expandedIdsProp,
    defaultExpandedIds = NOOP_ARRAY,
    onExpand,
    titleRender,
    ...nativeTreeProps
  } = props
  const flattedData = useMemo(() => flattenTreeData(data), [useDeep(data)])

  // 拦截 expand：用于搜索时控制将搜到的结果高亮，并且自动展开节点
  // 但是对外仍然暴露 expand 相关 props 原有的功能
  const [expandedIds, tryToggleExpandedIds] = useExpandProps(
    flattedData,
    defaultExpandedIds,
    expandedIdsProp,
    onExpand,
    defaultExpandAll
  )

  const [searchValue, setSearchValue] = useState('')
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

      const ret = inSearch ? renderTitleWithHighlight(node, searchValue) : true

      return ret
    },
    [titleRender, inSearch, searchValue]
  )

  const showData = useMemo(() => getSearchedData(cloneDeep(data), matchedIds, filteredIds), [
    data,
    matchedIds,
    filteredIds,
  ])

  const treeProps = {
    ...nativeTreeProps,
    prefixCls,
    data: isEmpty || !inSearch ? data : showData,
    expandedIds: expandedIds,
    onExpand: tryToggleExpandedIds,
    titleRender: proxyTitleRender,
    // 在搜索中时不允许节点拖拽操作，纯展示
    draggable: !inSearch,
  }

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const nextSearchValue = evt.target.value

      setSearchValue(nextSearchValue)

      // 匹配到搜索的节点，将这些节点进行展开显示，其它均隐藏
      const matchedNodes = getMatchedNodes(flattedData, nextSearchValue)
      const filteredNodeIds = getFilteredIds(matchedNodes)

      setMatchedIds(matchedNodes.map((v) => v.id))
      setFilteredIds(filteredNodeIds)
      tryToggleExpandedIds(filteredNodeIds)
    },
    [flattedData, tryToggleExpandedIds]
  )

  const inputProps = {
    value: searchValue,
    onChange: handleChange,
  }

  return [treeProps, inputProps, isEmpty] as const
}

export interface SearchableTreeProps extends TreeProps {
  /**
   * 节点可搜索，仅在 node.title 类型为字符串下支持
   */
  searchable?: boolean
}

/**
 * 高亮节点的文本内容
 */
const renderTitleWithHighlight = (node: TreeNodeEventData, searchValue: string) => {
  if (typeof node.title !== 'string') {
    return
  }

  const index = node.title.indexOf(searchValue)
  if (index === -1) return node.title

  const beforeStr = node.title.substr(0, index)
  const afterStr = node.title.substr(index + searchValue?.length)

  return (
    <span>
      {beforeStr}
      <span className="title__text--matched">{searchValue}</span>
      {afterStr}
    </span>
  )
}

/**
 * 获取搜索高亮展示的数据
 */
const getSearchedData = (
  treeData: TreeNodeData[],
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
  searchValue: string
): FlattedTreeNodeData[] => {
  if (!searchValue) return []
  return flattedData.filter((node) => (node.title as string)?.includes?.(searchValue))
}

const getFilteredIds = (matchedNodes: FlattedTreeNodeData[]) => {
  const filterIdsSet = new Set<React.ReactText>()
  matchedNodes.forEach((node) => {
    node.ancestors?.forEach((ancestor) => {
      filterIdsSet.add(ancestor.id)
    })
  })
  return Array.from(filterIdsSet)
}
