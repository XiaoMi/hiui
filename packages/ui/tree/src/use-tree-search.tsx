import React, { forwardRef, useState, useEffect, useMemo, memo } from 'react'
import { __DEV__ } from '@hi-ui/env'
import { Tree, TreeProps } from './Tree'
import { TreeNodeData } from './TreeNode'
import { flattenTreeData } from './utils'

/**
 * 将 BaseTree 添加定制搜索功能
 *
 * @param BaseTree 被改造的组件
 * @returns
 */
export const useTreeSearch = (BaseTree: typeof Tree) => {
  const [searchValue, setSearchValue] = useState('')
  const [treeData, setTreeData] = useState<TreeNodeData[]>([])

  const [matchedNodes, setMatchedNodes] = useState<TreeNodeData[]>([])
  const [filteredIds, setFilteredIds] = useState<React.ReactText[]>([])

  console.log('searchValue', searchValue)

  const SearchTree = memo(
    forwardRef<HTMLUListElement | null, SearchTreeProps>(
      ({ searchable = false, data, ...baseProps }, ref) => {
        useEffect(() => {
          setTreeData(data)
        }, [data])

        const showData = useMemo(
          () =>
            getShowData(
              data,
              matchedNodes.map((node) => node.id),
              filteredIds
            ),
          [data, matchedNodes, filteredIds]
        )

        console.log('showData', showData, treeData, matchedNodes, filteredIds)

        return <BaseTree ref={ref} data={showData} {...baseProps} />
      }
    )
  )

  if (__DEV__) {
    SearchTree.displayName = `WithSearch(${BaseTree.displayName})`
  }

  const flattedData: TreeNodeData[] = useMemo(() => flattenTreeData(treeData), [treeData])

  const inputProps = {
    value: searchValue,
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
      // 匹配到搜索的节点，将这些节点进行展开显示，其它均隐藏
      const matchedNodes = getMatchedNodes(flattedData, searchValue)

      // TODO: 是否当做 props 可以自动展开被展开节点的所有祖先节点
      const filteredNodeIds = matchedNodes
        .reduce((prev, node) => prev.concat(node.ancestors ?? []), [] as TreeNodeData[])
        .map((node) => node.id)

      setSearchValue(evt.target.value)
      setMatchedNodes(matchedNodes)
      setFilteredIds(filteredNodeIds)
    },
  }

  return [SearchTree, inputProps] as const
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
  data: TreeNodeData[],
  matchedIds: React.ReactText[],
  filteredIds: React.ReactText[]
) => {
  for (let i = 0; i < data.length; ++i) {
    const node = data[i]
    if (matchedIds.includes(node.id)) {
      // do nothing
    } else if (filteredIds.includes(node.id)) {
      if (node.children) {
        getShowData(node.children, matchedIds, filteredIds)
      }
    } else {
      data.splice(i, 1)
      i = i - 1
    }
  }
  return data
}
