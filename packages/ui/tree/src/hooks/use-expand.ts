// @ts-nocheck
import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import cloneDeep from 'lodash.clonedeep'
import { TreeNodeData } from '../TreeNode'
import { fFindNestedChildNodesById, uuid } from '../utils'

export const MOTION_NODE_KEY = `TREE_MOTION_NODE_${uuid()}`

export const MotionTreeNode = (type, data) => {
  return {
    id: MOTION_NODE_KEY,
    children: data,
    type,
  }
}

export const useExpand = (
  flattedData: TreeNodeData[],
  defaultExpandedIds: React.ReactText[],
  expandedIdsProp?: React.ReactText[],
  onExpand?: (expandIds: React.ReactText[], expandedNode: TreeNodeData, expanded: boolean) => void,
  defaultExpandAll?: boolean
) => {
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

  const expandedNodeIdSet = useMemo(() => new Set<React.ReactText>(expandedIds), [expandedIds])
  const checkIfExpanded = useCallback((id: React.ReactText) => expandedNodeIdSet.has(id), [
    expandedNodeIdSet,
  ])

  // 更新展示数据，只展示被展开的所有节点
  const [transitionData, setTransitionData] = useState(flattedData)
  const prevExpandedIdsRef = usePreviousRef(expandedIds)
  // 原始数据被改变时，需要更新要展示的所有节点
  useEffect(() => {
    const nextData = flattenTreeDataWithExpand(flattedData, prevExpandedIdsRef.current)
    setTransitionData(nextData)
  }, [flattedData])

  const trySetTransitionData = useCallback(
    (data: TreeNodeData[]) => {
      const nextData = flattenTreeDataWithExpand(data, expandedIds)
      setTransitionData(nextData)
    },
    [expandedIds]
  )

  // 用来确保一次折叠动画是一次加锁的单元任务
  // 防止用户频繁折叠展开导致动画渲染（存在 DOM 操作）异常
  const isExpandingRef = useRef(false)

  // console.log('flattedData', flattedData)

  const onNodeToggleStart = useCallback(
    (expandedNode, isExpanded) => {
      if (isExpandingRef.current) return
      isExpandingRef.current = true

      const expandedNodeIdSet = new Set<React.ReactText>(expandedIds)

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

        // console.log('rangeData', rangeData, flattedData)

        newTransitionData.splice(childrenStartIndex, 0, {
          id: MOTION_NODE_KEY,
          children: flattenTreeDataWithExpand(rangeData, expandedIds),
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
          id: MOTION_NODE_KEY,
          children: rangeData,
          type: 'hide',
        })

        trySetTransitionData(newTransitionData)
      }

      tryToggleExpandedIds(Array.from(expandedNodeIdSet))
    },
    [expandedIds, tryToggleExpandedIds, flattedData, transitionData, trySetTransitionData]
  )

  const onNodeToggleEnd = useCallback(() => {
    // 动画结束后回恢复成真正的原始数据结构
    setTransitionData(
      transitionData.reduce((prev, cur) => {
        if (cur.id !== MOTION_NODE_KEY) {
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
    // expandedNodeIds: expandedIds,
    tryToggleExpandedIds,
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

    if (expandedKeySet.has(node.id) || node.id === MOTION_NODE_KEY) {
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

const usePreviousRef = <T>(value: T) => {
  const prevRef = React.useRef<T>(value)
  React.useEffect(() => {
    prevRef.current = value
  })
  return prevRef
}
