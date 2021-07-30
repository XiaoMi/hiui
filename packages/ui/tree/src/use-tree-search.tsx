import React, { useState, useMemo, useCallback } from 'react'
import { TreeProps } from './Tree'
import { TreeNodeData } from './TreeNode'
import { flattenTreeData } from './utils'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
// @ts-ignore
import cloneDeep from 'lodash.clonedeep'

/**
 * 将 BaseTree 添加定制搜索功能
 *
 * @param props
 * @returns
 */
export const useTreeSearch = (props: SearchTreeProps) => {
  const {
    data,
    searchable = false,
    expandedIds: expandedIdsProp,
    defaultExpandedIds = [],
    onExpand,
    defaultExpandAll = false,
    titleRender,
    ...nativeTreeProps
  } = props

  const flattedData: TreeNodeData[] = useMemo(() => flattenTreeData(data), [data])

  // 拦截 expand：用于搜索时控制将搜到的结果高亮，并且自动展开节点
  const [expandedIds, tryToggleExpandedIds] = useUncontrolledState(
    function getDefaultExpandedId() {
      // 开启默认展开全部
      if (defaultExpandAll) {
        return flattedData.map((node) => node.id)
      }
      return defaultExpandedIds
    },
    expandedIdsProp,
    onExpand
  )

  const [searchValue, setSearchValue] = useState('')

  const [matchedNodes, setMatchedNodes] = useState<TreeNodeData[]>([])
  const [filteredIds, setFilteredIds] = useState<React.ReactText[]>([])

  const showData = useMemo(
    () =>
      getShowData(
        cloneDeep(data),
        matchedNodes.map((node) => node.id),
        filteredIds
      ),
    [data, matchedNodes, filteredIds]
  )

  /**
   * 高亮节点的文本内容
   */
  const renderTitleWithHighlight = useCallback(
    (node: any) => {
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
    },
    [searchValue]
  )

  // 拦截 titleRender，自定义高亮展示
  const proxyTitleRender = useCallback(
    (node: TreeNodeData) => {
      return titleRender?.(node) || renderTitleWithHighlight(node) || node.title
    },
    [titleRender, renderTitleWithHighlight]
  )

  const inSearch = !!searchValue

  const treeProps = {
    ...nativeTreeProps,
    data: searchable && inSearch ? showData : data,
    expandedIds,
    onExpand: tryToggleExpandedIds,
    titleRender: proxyTitleRender,
    // 在搜索中时不允许节点拖拽操作，纯展示
    draggable: !inSearch,
  }

  const inputProps = {
    value: searchValue,
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
      // 匹配到搜索的节点，将这些节点进行展开显示，其它均隐藏
      const nextSearchValue = evt.target.value
      setSearchValue(nextSearchValue)
      const matchedNodes = getMatchedNodes(flattedData, nextSearchValue)

      // TODO: 是否当做 props 可以自动展开被展开节点的所有祖先节点
      const filteredNodeIds = matchedNodes
        .reduce((prev, node) => prev.concat(node.ancestors ?? []), [] as TreeNodeData[])
        .map((node) => node.id)

      setMatchedNodes(matchedNodes)
      setFilteredIds(filteredNodeIds)
    },
  }

  return [treeProps, inputProps] as const
}

export interface SearchTreeProps extends TreeProps {
  searchable?: boolean
}

const getMatchedNodes = (
  flattedData: TreeNodeData[],
  searchValue: React.ReactText
): TreeNodeData[] => {
  if (!searchValue) return []

  // @ts-ignore
  return flattedData.filter((node) => node.title?.includes?.(searchValue))
}

const getShowData = (
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
        getShowData(node.children, matchedIds, filteredIds)
      }
    } else {
      treeData.splice(i, 1)
      i = i - 1
    }
  }

  return treeData
}