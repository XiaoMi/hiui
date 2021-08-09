import { useQueue } from './use-queue'
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import cloneDeep from 'lodash.clonedeep'
import { fFindNestedChildNodesById, uuid } from '../utils'
import {
  FlattedTreeNodeData,
  TreeNodeType,
  TreeNodeTransitionData,
  MotionTreeNodeData,
} from '../types'
import { useLatestRef, useLatestCallback } from '@hi-ui/use-latest'

export const useExpandProps = (
  flattedData: FlattedTreeNodeData[],
  defaultExpandedIds: React.ReactText[],
  expandedIdsProp?: React.ReactText[],
  onExpand?: (expandIds: React.ReactText[], node: FlattedTreeNodeData, expanded: boolean) => void,
  defaultExpandAll?: boolean
) => {
  return useUncontrolledState(
    function getDefaultExpandedIds() {
      // 开启默认展开全部
      if (defaultExpandAll) {
        return flattedData.map((node) => node.id)
      }
      return defaultExpandedIds
    },
    expandedIdsProp,
    onExpand
  )
}

export const MOTION_NODE_KEY = `TREE_MOTION_NODE_${uuid()}`

export const isMotionNode = (node: TreeNodeTransitionData): node is MotionTreeNodeData => {
  return node.id === MOTION_NODE_KEY
}

export const useExpand = (
  flattedData: FlattedTreeNodeData[],
  defaultExpandedIds: React.ReactText[],
  expandedIdsProp?: React.ReactText[],
  onExpand?: (expandIds: React.ReactText[], node: FlattedTreeNodeData, expanded: boolean) => void,
  defaultExpandAll?: boolean
) => {
  const [expandedIds, tryToggleExpandedIds] = useExpandProps(
    flattedData,
    defaultExpandedIds,
    expandedIdsProp,
    onExpand,
    defaultExpandAll
  )

  const expandedNodeIdSet = useMemo(() => new Set<React.ReactText>(expandedIds), [expandedIds])
  const isExpandedId = (id: React.ReactText) => expandedNodeIdSet.has(id)
  const expandedIdsRef = useLatestRef(expandedIds)

  // 更新展示数据，只展示被展开的所有节点
  const [transitionData, setTransitionData] = useState<TreeNodeTransitionData[]>(flattedData)
  const transitionDataRef = useLatestRef(transitionData)

  const trySetTransitionData = useCallback((data: TreeNodeTransitionData[]) => {
    const nextData = flattenTreeDataWithExpand(data, expandedIdsRef.current)
    setTransitionData(nextData)
  }, [])

  // 用来确保一次折叠动画是一次加锁的单元任务
  // 防止用户频繁折叠展开导致动画渲染（存在 DOM 操作）异常
  const [isExpanding, setIsExpanding] = useState(false)
  const isExpandingRef = useRef(false)

  const { enqueue, top, dequeue } = useQueue<any>([])

  // 用户传入 data 或 expandedIds 被改变时，同步更新要展示的所有节点
  useEffect(() => {
    if (isExpanding) return
    trySetTransitionData(flattedData)
  }, [flattedData, trySetTransitionData, isExpanding, expandedIds])

  const onNodeToggleStart = useCallback(
    (expandedNode: FlattedTreeNodeData, shouldExpanded: boolean) => {
      if (isExpandingRef.current) return

      const expanded = expandedIdsRef.current.indexOf(expandedNode.id) !== -1
      if (shouldExpanded === expanded) {
        dequeue()
        return
      }

      isExpandingRef.current = true
      setIsExpanding(true)

      const expandedIds = expandedIdsRef.current
      const transitionData = transitionDataRef.current

      const expandedNodeIdSet = new Set<React.ReactText>(expandedIds)
      const expandedNodeId = expandedNode.id

      if (shouldExpanded) {
        // console.log('展开ing---------------', expandedNodeId)
        expandedNodeIdSet.add(expandedNodeId)

        // 设置展开的子节点集合用一个容器节点包裹，用来实现动画展开效果
        const [rangeData] = fFindNestedChildNodesById(flattedData, expandedNodeId)
        const expandedNodeIndex = transitionData.findIndex((node) => node.id === expandedNodeId)
        const childrenStartIndex = expandedNodeIndex + 1
        const newTransitionData: TreeNodeTransitionData[] = cloneDeep(transitionData)

        newTransitionData.splice(childrenStartIndex, 0, {
          id: MOTION_NODE_KEY,
          children: flattenTreeDataWithExpand(rangeData, expandedIds) as FlattedTreeNodeData[],
          type: TreeNodeType.SHOW,
        })

        trySetTransitionData(newTransitionData)
      } else {
        // console.log('收起ing---------------', expandedNodeId)
        expandedNodeIdSet.delete(expandedNodeId)

        // 设置隐藏的子节点集合用一个 节点 包裹，用来实现动画隐藏效果
        const [rangeData, expandedNodeIndex] = fFindNestedChildNodesById(
          transitionData as FlattedTreeNodeData[],
          expandedNodeId
        )
        const childrenStartIndex = expandedNodeIndex + 1
        const newTransitionData = cloneDeep(transitionData)

        newTransitionData.splice(childrenStartIndex, rangeData.length, {
          id: MOTION_NODE_KEY,
          children: rangeData,
          type: TreeNodeType.HIDE,
        })

        trySetTransitionData(newTransitionData)
      }

      tryToggleExpandedIds(Array.from(expandedNodeIdSet))
    },
    [tryToggleExpandedIds, flattedData, trySetTransitionData, dequeue]
  )

  const onNodeToggleStartLatest = useLatestCallback(onNodeToggleStart)

  const enExpandQueue = useCallback(
    (expandedNode: FlattedTreeNodeData, shouldExpanded: boolean) => {
      enqueue([expandedNode, shouldExpanded] as const)
    },
    [enqueue]
  )

  useEffect(() => {
    window.requestAnimationFrame(() => {
      if (isExpanding) return
      if (top) {
        onNodeToggleStartLatest(top[0], top[1])
      }
    })
  }, [isExpanding, top, onNodeToggleStartLatest])

  const onNodeToggleEnd = useCallback(() => {
    // 动画结束后回恢复成真正的原始数据结构
    setTransitionData(
      transitionData.reduce((prev, cur) => {
        if (!isMotionNode(cur)) {
          prev.push(cur)
        } else if (cur.type === TreeNodeType.SHOW) {
          cur.children?.forEach((node) => prev.push(node))
        }
        return prev
      }, [] as FlattedTreeNodeData[])
    )

    // 闭环结束列表展开或收起动画
    isExpandingRef.current = false
    setIsExpanding(false)
    dequeue()
  }, [transitionData, dequeue])

  return [transitionData, enExpandQueue, onNodeToggleEnd, isExpandedId] as const
}

function flattenTreeDataWithExpand(
  flattedTreeData: TreeNodeTransitionData[],
  expandedIds: React.ReactText[]
) {
  const expandedKeySet = new Set(expandedIds)
  const length = flattedTreeData.length
  const nextData = []

  // 处理只展示未折叠的节点或动画节点
  for (let i = 0; i < length; ) {
    const node = flattedTreeData[i]
    nextData.push(node)

    if (expandedKeySet.has(node.id) || isMotionNode(node)) {
      i++
    } else {
      let child = flattedTreeData[++i]
      while (child && !isMotionNode(child) && child.depth > node.depth) {
        child = flattedTreeData[++i]
      }
    }
  }

  return nextData
}
