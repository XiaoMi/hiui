import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import cloneDeep from 'lodash.clonedeep'
import { TreeNodeData } from '../TreeNode'
import { fFindNestedChildNodesById } from '../utils'

export const ANIMATION_KEY = `TREE_MOTION_NODE_${Math.random()}`

export const useExpand = (
  flattedData: TreeNodeData[],
  defaultExpandedIds: React.ReactText[],
  expandedIds?: React.ReactText[],
  onExpand?: (expandIds: React.ReactText[], expandedNode: TreeNodeData, expanded: boolean) => void
) => {
  const expandedNodeIdSet = useMemo(() => new Set<React.ReactText>(), [])
  const checkIfExpanded = useCallback((id: React.ReactText) => expandedNodeIdSet.has(id), [
    expandedNodeIdSet,
  ])

  const [_expandedIds, tryToggleExpandedIds] = useUncontrolledState(
    defaultExpandedIds,
    expandedIds,
    onExpand
  )

  const prevExpandedIds = useRef(_expandedIds)
  useEffect(() => {
    prevExpandedIds.current = _expandedIds
  })

  // TODO: 假如非受控模式，需要支持默认展开全部或者默认关闭收起，需要率先更新一次 _expandedIds
  // 默认全折叠
  React.useEffect(() => {
    const nextData = flattenTreeDataWithExpand(flattedData, prevExpandedIds.current)
    setTransitionData(nextData)
  }, [flattedData])

  // animation
  const [transitionData, setTransitionData] = useState(() => {
    return flattenTreeDataWithExpand(flattedData, _expandedIds)
  })

  const trySetTransitionData = useCallback(
    (data: TreeNodeData[]) => {
      const nextData = flattenTreeDataWithExpand(data, _expandedIds)
      setTransitionData(nextData)
    },
    [_expandedIds]
  )

  // 用来确保一次折叠动画是一次加锁的单元任务，防止频繁折叠导致动画渲染（存在 DOM 操作）异常
  const isExpandingRef = React.useRef(false)

  const onNodeToggleStart = useCallback(
    (expandedNode, isExpanded) => {
      if (isExpandingRef.current) return

      isExpandingRef.current = true

      // TODO：多选逻辑抽离复用
      if (isExpanded) {
        console.log('展开ing---------------', expandedNode.id)
        expandedNodeIdSet.add(expandedNode.id)

        // TODO: flattedData 改成 prevData
        // 通过新旧 diff 来实现展开当前层节点

        // 设置展开的子节点集合用一个容器节点包裹，用来实现动画展开效果
        const rangeData = fFindNestedChildNodesById(flattedData, expandedNode.id)
        const expandedNodeIndex = transitionData.findIndex((node) => node.id === expandedNode.id)
        const childrenStartIndex = expandedNodeIndex + 1
        const newTransitionData = cloneDeep(transitionData)

        newTransitionData.splice(childrenStartIndex, 0, {
          id: ANIMATION_KEY,
          children: flattenTreeDataWithExpand(rangeData, _expandedIds),
          type: 'show',
        })

        trySetTransitionData(newTransitionData)
      } else {
        console.log('收起ing---------------', expandedNode.id)
        expandedNodeIdSet.delete(expandedNode.id)

        // 设置隐藏的子节点集合用一个 节点 包裹，用来实现动画隐藏效果
        const rangeData = fFindNestedChildNodesById(transitionData, expandedNode.id)
        // TODO: 和 fFindNestedChildNodesById 存在重复逻辑
        const expandedNodeIndex = transitionData.findIndex((node) => node.id === expandedNode.id)
        const childrenStartIndex = expandedNodeIndex + 1
        const newTransitionData = cloneDeep(transitionData)

        newTransitionData.splice(childrenStartIndex, rangeData.length, {
          id: ANIMATION_KEY,
          children: rangeData,
          type: 'hide',
        })

        trySetTransitionData(newTransitionData)
      }

      tryToggleExpandedIds(Array.from(expandedNodeIdSet))
    },
    [
      expandedNodeIdSet,
      _expandedIds,
      tryToggleExpandedIds,
      flattedData,
      transitionData,
      trySetTransitionData,
    ]
  )

  const onNodeToggleEnd = useCallback(() => {
    setTransitionData(
      transitionData.reduce((prev, cur) => {
        if (cur.id !== ANIMATION_KEY) {
          prev.push(cur)
          return prev
        }

        if (cur.type === 'show') {
          cur.children.forEach((node) => prev.push(node))
          return prev
        }

        return prev
      }, [] as TreeNodeData[])
    )

    // 闭环结束列表展开或收起动画
    isExpandingRef.current = false
  }, [transitionData])

  return [
    transitionData,
    // expandedNodeIds: _expandedIds,
    onNodeToggleStart,
    onNodeToggleEnd,
    checkIfExpanded,
  ] as const
}

function flattenTreeDataWithExpand(
  flattedTreeData: TreeNodeData[],
  expandedIds: React.ReactText[]
) {
  const expandedKeySet = new Set(expandedIds)
  const nextData = []

  // 处理只展示 未折叠内容
  for (let i = 0; i < flattedTreeData.length; ) {
    const node = flattedTreeData[i]
    nextData.push(node)

    if (expandedKeySet.has(node.id) || node.id === ANIMATION_KEY) {
      i++
    } else {
      // 过滤掉所有被折叠节点项的 children 展示
      let child = flattedTreeData[++i]

      while (child && child.depth! > node.depth!) {
        child = flattedTreeData[++i]
      }
    }
  }

  return nextData
}
