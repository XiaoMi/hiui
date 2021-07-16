import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { findNode } from '../utils'
import cloneDeep from 'lodash.clonedeep'

export const ANIMATION_KEY = `RC_TREE_MOTION_${Math.random()}`

export const useExpand = (
  defaultExpandedIds: React.ReactText[],
  expandedIds?: React.ReactText[],
  onExpand?: (node: any) => void,
  flattedData
) => {
  const expandedNodeIdsMp = useMemo(() => new Set<React.ReactText>(), [])

  const [_expandedIds, tryToggleExpandedIds] = useUncontrolledState(
    defaultExpandedIds,
    expandedIds,
    onExpand
  )

  // TODO: 假如非受控模式，需要支持默认展开全部或者默认关闭收起，需要率先更新一次 _expandedIds
  // 默认全折叠
  React.useEffect(() => {
    if (!flattedData.length) return
    const pDepth = flattedData[0].depth

    setTransitionData(flattedData.filter((item) => item.depth === pDepth))
  }, [flattedData])

  // animation
  const [transitionData, setTransitionData] = React.useState(flattedData)

  const isExpandingRef = React.useRef(false)

  const onExpandNode = useCallback(
    (expandedNode, isExpanded) => {
      // if (isExpandingRef.current)
      isExpandingRef.current = true
      // TODO：多选逻辑抽离复用
      if (isExpanded) {
        console.log('展开ing---------------', expandedNode.id)
        expandedNodeIdsMp.add(expandedNode.id)

        // 设置展开的子节点集合用一个 节点 包裹，用来实现动画展开效果
        // 获取到范围节点
        let expandedNodeIndex = flattedData.findIndex((item) => {
          return item.id === expandedNode.id
        })

        let childrenStartIndex = expandedNodeIndex + 1
        let childrenEndIndex = childrenStartIndex
        for (let i = childrenStartIndex; i < flattedData.length + 1; ++i) {
          const item = flattedData[i]
          // 找到后面连续部分层级大于当前展开元素
          if (!item || item.depth <= expandedNode.depth) {
            childrenEndIndex = i
            break
          }
        }

        const rangeData = flattedData.slice(childrenStartIndex, childrenEndIndex)

        expandedNodeIndex = transitionData.findIndex((item) => {
          return item.id === expandedNode.id
        })
        childrenStartIndex = expandedNodeIndex + 1

        const newTransitionData = cloneDeep(transitionData)

        // 给动画元素打上标记占位标记
        newTransitionData.splice(childrenStartIndex, 0, {
          id: ANIMATION_KEY,
          children: rangeData,
          type: 'show',
        })

        setTransitionData(newTransitionData)
      } else {
        console.log('收起ing---------------', expandedNode.id)
        expandedNodeIdsMp.delete(expandedNode.id)

        // 设置隐藏的子节点集合用一个 节点 包裹，用来实现动画隐藏效果
        // 获取到范围节点
        const expandedNodeIndex = transitionData.findIndex((item) => {
          return item.id === expandedNode.id
        })

        const childrenStartIndex = expandedNodeIndex + 1
        let childrenEndIndex = childrenStartIndex
        for (let i = childrenStartIndex; i < transitionData.length + 1; ++i) {
          const item = transitionData[i]
          // 找到后面连续部分层级大于当前展开元素
          if (!item || item.depth <= expandedNode.depth) {
            childrenEndIndex = i
            break
          }
        }

        const rangeData = transitionData.slice(childrenStartIndex, childrenEndIndex)
        const newTransitionData = cloneDeep(transitionData)

        // 给动画元素打上标记占位标记
        newTransitionData.splice(childrenStartIndex, rangeData.length, {
          id: ANIMATION_KEY,
          children: rangeData,
          type: 'hide',
        })

        setTransitionData(newTransitionData)
      }

      tryToggleExpandedIds(Array.from(expandedNodeIdsMp))
    },
    [expandedNodeIdsMp, tryToggleExpandedIds, flattedData, transitionData]
  )

  return [
    _expandedIds,
    onExpandNode,
    expandedNodeIdsMp,
    transitionData,
    setTransitionData,
    isExpandingRef,
  ] as const
}

// ----

export const useSingleSelect = (
  defaultSelectedId?: string,
  selectedId?: string,
  onSelect?: (node: any) => void,
  disabled = false
) => {
  const proxyOnSelect = useCallback(
    (_: string | undefined, node: any) => {
      onSelect?.(node)
    },
    [onSelect]
  )

  const [_selectedId, tryChangeSelectedId] = useUncontrolledState(
    defaultSelectedId,
    selectedId,
    // import is `id` but export `rawData`
    proxyOnSelect
  )

  const onNodeSelect = useCallback(
    (selectedNode) => {
      if (disabled) return

      tryChangeSelectedId(selectedNode.id, selectedNode)
    },
    [disabled, tryChangeSelectedId]
  )

  return [_selectedId, onNodeSelect] as const
}

// ----

const hasOwnProperty = Object.prototype.hasOwnProperty

// 删除指定的节点
const deleteNode = (targetId, data) => {
  data.forEach((d, index) => {
    if (d.id === targetId) {
      data.splice(index, 1)
    } else {
      if (d.children) {
        deleteNode(targetId, d.children)
      }
    }
  })
}

// 为指定节点添加孩子节点
const addChildNode = (targetId, sourceNode, data) => {
  for (const key in data) {
    if (hasOwnProperty.call(data, key)) {
      const node = data[key]
      const { id, children } = node

      if (id === targetId) {
        node.children = (children || []).concat(sourceNode)
        return
      }

      if (children) {
        addChildNode(targetId, sourceNode, children)
      }
    }
  }
}

// 插入节点到指定节点之前或之后
const insertNode = (targetId, sourceNode, data, position) => {
  const index = data.findIndex((node) => node.id === targetId)
  if (index !== -1) {
    data.splice(index + position, 0, sourceNode)
    return
  }

  for (const key in data) {
    if (hasOwnProperty.call(data, key)) {
      const node = data[key]
      const { children } = node

      if (children) {
        insertNode(targetId, sourceNode, children, position)
      }
    }
  }
}

export const useTreeDrop = (treeData, flattedData, onDrop, onDropEnd) => {
  const moveNode = useCallback(
    ({ targetId, sourceId, direction, depth }) => {
      const nextTreeData = cloneDeep(treeData)

      // 阻止将节点拖拽到自己或者自己的子树当中
      const _sourceNode = flattedData.find((item) => item.id === sourceId)
      let sourceChildrenIds = []

      if (_sourceNode.children) {
        sourceChildrenIds = _sourceNode.children.map((node) => node.id)
      }
      console.log(_sourceNode, sourceChildrenIds)

      if (sourceChildrenIds.includes(targetId) || sourceId === targetId) {
        return
      }

      // 在老树上面查找节点信息
      const sourceNode = findNode(sourceId, treeData)
      const targetNode = findNode(targetId, treeData)

      // 先从树中删除原节点
      deleteNode(sourceId, nextTreeData)

      // 插入到指定节点内部
      if (direction === 'inside') {
        addChildNode(targetId, sourceNode, nextTreeData)
      } else {
        // 插入到指定节点之前（0）或者之后（1）
        const position = direction === 'before' ? 0 : 1
        insertNode(targetId, sourceNode, nextTreeData, position)
      }

      if (onDrop) {
        console.log(depth, sourceNode, targetNode)

        const result = onDrop(
          sourceNode,
          targetNode,
          { before: treeData, after: nextTreeData },
          { before: depth.source, after: direction === 'inside' ? depth.target + 1 : depth.target }
        )

        // 根据返回结果，判断是否需要非受控，内部更新树结构
        if (result === true) {
          // setTreeData(nextTreeData)
          onDropEnd?.(sourceNode, targetNode)
        } else if (result && typeof result.then === 'function') {
          result.then((res) => {
            // setTreeData(nextTreeData)
            onDropEnd?.(sourceNode, targetNode)
          })
        }
      } else {
        // setTreeData(nextTreeData)
      }
    },
    [treeData, flattedData, onDrop, onDropEnd]
  )

  return moveNode
}

export const useCollapseAnimation = () => {}
