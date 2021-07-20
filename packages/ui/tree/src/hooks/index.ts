import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import cloneDeep from 'lodash.clonedeep'
import { TreeNodeData, TreeNodeDragDirection } from '../TreeNode'

export const ANIMATION_KEY = `RC_TREE_MOTION_${Math.random()}`

function flattenTreeDataWithExpand(flattedData, expandedIds) {
  const expandedKeySet = new Set(expandedIds)
  const nextData = []
  // 处理只展示 未折叠内容
  for (let i = 0; i < flattedData.length; ) {
    const node = flattedData[i]
    nextData.push(node)
    if (expandedKeySet.has(node.id) || node.id === ANIMATION_KEY) {
      // 继续遍历 children
      i++
    } else {
      // 过滤掉所有children
      let child = flattedData[++i]

      while (child && child.depth > node.depth) {
        child = flattedData[++i]
      }
    }
  }
  console.log('nextData', nextData)

  return nextData
}

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
  // React.useEffect(() => {
  //   if (!flattedData.length) return

  //   const nextData = flattenTreeDataWithExpand(flattedData, _expandedIds)
  //   setTransitionData(nextData)
  // }, [flattedData])

  // animation
  const [transitionData, setTransitionData] = React.useState(() => {
    return flattenTreeDataWithExpand(flattedData, _expandedIds)
  })

  const isExpandingRef = React.useRef(false)

  const trySetTransitionData = (data) => {
    const nextData = flattenTreeDataWithExpand(data, _expandedIds)
    setTransitionData(nextData)
  }

  const onExpandNode = useCallback(
    (expandedNode, isExpanded) => {
      // if (isExpandingRef.current)
      isExpandingRef.current = true
      // TODO：多选逻辑抽离复用
      if (isExpanded) {
        console.log('展开ing---------------', expandedNode.id)
        expandedNodeIdsMp.add(expandedNode.id)

        // TODO: flattedData 改成 prevData
        // 通过新旧 diff 来实现展开当前层节点
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
          children: flattenTreeDataWithExpand(rangeData, _expandedIds),
          type: 'show',
        })

        trySetTransitionData(newTransitionData)
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

        trySetTransitionData(newTransitionData)
      }

      tryToggleExpandedIds(Array.from(expandedNodeIdsMp))
    },
    [expandedNodeIdsMp, tryToggleExpandedIds, flattedData, transitionData, trySetTransitionData]
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

// TODO: 使用 扁平数据结构优化查找
// 自定义数据结构：关联扁平数据节点和原生用户节点
/**
 * 根据指定 id 查找对应节点
 * @param treeData
 * @param targetId
 * @returns 返回第一个被查找到的节点
 */
export const findNodeById = (
  treeData: TreeNodeData[],
  targetId: React.ReactText
): TreeNodeData | null => {
  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node.id) {
      return node
    }

    if (node.children) {
      return findNodeById(node.children, targetId)
    }
  }

  return null
}

/**
 * 从树中删除指定 id 的第一个被找到的节点
 * 采用递归遍历
 *
 * @param treeData
 * @param targetId
 * @returns
 */
const deleteNodeById = (treeData: TreeNodeData[], targetId: React.ReactText) => {
  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node.id) {
      return treeData.splice(i, 1)
    }
    if (node.children) {
      deleteNodeById(node.children, targetId)
    }
  }
}

/**
 * 为指定 id 的第一个被找到的节点添加孩子节点
 *
 * @param treeData
 * @param targetId
 * @param sourceNode
 * @returns
 */
const addChildNodeById = (
  treeData: TreeNodeData[],
  targetId: React.ReactText,
  sourceNode: TreeNodeData
) => {
  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node.id) {
      if (!node.children) {
        node.children = []
      }

      node.children.push(sourceNode)
      return
    }

    if (node.children) {
      addChildNodeById(node.children, targetId, sourceNode)
    }
  }
}

/**
 * 插入节点到指定 id 的节点之前或之后
 *
 * @param treeData
 * @param targetId
 * @param sourceNode
 * @param position 0 表示插入到指定节点之前，1 表示之后
 * @returns
 */
const insertNodeById = (
  treeData: TreeNodeData[],
  targetId: React.ReactText,
  sourceNode: TreeNodeData,
  position: 0 | 1
) => {
  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node.id) {
      treeData.splice(i + position, 0, sourceNode)

      return
    }

    if (node.children) {
      insertNodeById(node.children, targetId, sourceNode, position)
    }
  }
}

/**
 * 从扁平的树数据结构中找到指定 id 的节点的所有孩子节点的 ids，包含嵌套节点
 *
 * 不同于增删改原 data 数据，查询操作使用扁平化的树数据结构，可以避免函数递归，加快查询
 *
 * @param flattedTreeData
 * @param targetId
 * @returns
 */

const fFindNestedChildNodesById = (
  flattedTreeData: TreeNodeData[],
  targetId: React.ReactText
): TreeNodeData[] => {
  const targetNodeIndex = flattedTreeData.findIndex((node) => node.id === targetId)

  const { length } = flattedTreeData
  const childrenNodes = [] as TreeNodeData[]

  if (targetNodeIndex < 0 || targetNodeIndex === length - 1) return childrenNodes

  const boundNodeDepth = flattedTreeData[targetNodeIndex].depth!

  // 判定子节点：后面连续部分层级大于目标元素的层级
  for (let i = targetNodeIndex + 1; i < length; ++i) {
    const node = flattedTreeData[i]

    if (node.depth! > boundNodeDepth) {
      // TODO: 改成 callback，类似于 Array.prototype.find
      childrenNodes.push(node)
    } else {
      break
    }
  }

  return childrenNodes
}

const moveNodeById = (
  treeData: TreeNodeData[],
  flattedTreeData: TreeNodeData[],
  sourceId: React.ReactText,
  targetId: React.ReactText,
  direction: TreeNodeDragDirection
) => {
  // 阻止将节点拖拽到自己
  if (targetId === sourceId) return

  const sourceChildrenIds = fFindNestedChildNodesById(flattedTreeData, sourceId).map(
    (node) => node.id
  )
  // 阻止将节点拖拽到自己的子树当中
  if (sourceChildrenIds.includes(targetId) || sourceId === targetId) return

  const sourceNode = findNodeById(treeData, sourceId)
  const targetNode = findNodeById(treeData, targetId)

  if (!sourceNode || !targetNode) return

  const nextTreeData = cloneDeep(treeData)
  const isInsertToInside = direction === 'inside'

  // 正式开始进行节点位置替换
  deleteNodeById(nextTreeData, sourceId)

  if (isInsertToInside) {
    addChildNodeById(nextTreeData, targetId, sourceNode)
  } else {
    insertNodeById(nextTreeData, targetId, sourceNode, direction === 'before' ? 0 : 1)
  }
}

export const useTreeDrop = (
  treeData: TreeNodeData[],
  flattedData: TreeNodeData[],
  onDrop: any,
  onDropEnd: any
) => {
  const moveNode = useCallback(
    ({ targetId, sourceId, direction, depth }) => {
      // moveNodeById(treeData, flattedData, sourceId, targetId, direction)

      // 阻止将节点拖拽到自己
      if (targetId === sourceId) return

      const sourceChildrenIds = fFindNestedChildNodesById(flattedData, sourceId).map(
        (node) => node.id
      )
      // 阻止将节点拖拽到自己的子树当中
      if (sourceChildrenIds.includes(targetId) || sourceId === targetId) return

      const sourceNode = findNodeById(treeData, sourceId)
      const targetNode = findNodeById(treeData, targetId)

      if (!sourceNode || !targetNode) return

      const nextTreeData = cloneDeep(treeData)
      const isInsertToInside = direction === 'inside'

      // 正式开始进行节点位置替换
      deleteNodeById(nextTreeData, sourceId)

      if (isInsertToInside) {
        addChildNodeById(nextTreeData, targetId, sourceNode)
      } else {
        insertNodeById(nextTreeData, targetId, sourceNode, direction === 'before' ? 0 : 1)
      }

      if (onDrop) {
        console.log(depth, sourceNode, targetNode)

        const result = onDrop(
          sourceNode,
          targetNode,
          { before: treeData, after: nextTreeData },
          { before: depth.source, after: isInsertToInside ? depth.target + 1 : depth.target }
        )

        // 根据 onDrop 用户返回结果，判断是否需要非受控，进行内部更新树结构
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

export const useTreeDragDrop = (props) => {
  const {
    onDragStart: onDragStartProp,
    onDragEnd: onDragEndProp,
    onDragOver: onDragOverProp,
    onDrop: onDropProp,
  } = props

  const treeNodeTitleRef = useRef<HTMLDivElement>(null)
  const dragNodeRef = useRef<TreeNodeData | null>(null)
  const [direction, setDirection] = useState<TreeNodeDragDirection>(null)

  const onDragStart = useCallback(
    (evt: React.DragEvent, node: TreeNodeData) => {
      console.log('onDragStart')

      evt.stopPropagation()

      dragNodeRef.current = node
      evt.dataTransfer.setData('treeNode', JSON.stringify({ id: node.id, depth: node.depth }))

      onDragStartProp?.(node)
    },
    [onDragStartProp]
  )

  const onDragEnd = useCallback(
    (evt: React.DragEvent, node: TreeNodeData) => {
      console.log('onDragEnd')

      evt.preventDefault()
      evt.stopPropagation()
      evt.dataTransfer.clearData()
      dragNodeRef.current = null
      setDirection(null)

      onDragEndProp?.(node)
    },
    [onDragEndProp]
  )

  const onDragLeave = useCallback((evt: React.DragEvent) => {
    console.log('onDragLeave')

    evt.preventDefault()
    evt.stopPropagation()
    setDirection(null)
  }, [])

  // 拖至到目标元素上时触发事件
  const onDragOver = useCallback(
    (evt: React.DragEvent, node: TreeNodeData) => {
      const dragNode = dragNodeRef.current
      console.log('onDragOver', dragNode)

      evt.preventDefault()
      evt.stopPropagation()

      // 这里需要考虑3点：
      // 拖到自己的老位置，不处理
      // 父树不能拖到其子树内
      // 不同于简单的文件夹拖拽，同层可以拖拽进行排序
      if (dragNode?.id !== node.id) {
        const targetBoundingRect = treeNodeTitleRef.current?.getBoundingClientRect()
        if (!targetBoundingRect) return

        const hoverTargetSortY = (targetBoundingRect.bottom - targetBoundingRect.top) / 3
        const hoverTargetInsideY = hoverTargetSortY + hoverTargetSortY

        // 鼠标垂直移动距离
        const hoverClientY = evt.clientY - targetBoundingRect.top

        // 将当前元素垂直平分为三层，每一层用来对应其放置的位置
        if (hoverClientY < hoverTargetSortY) {
          setDirection('before')
        } else if (hoverClientY < hoverTargetInsideY) {
          setDirection('inside')
        } else {
          setDirection('after')
        }
      }

      onDragOverProp?.(node)
    },
    [onDragOverProp]
  )

  // 放置目标元素时触发事件
  const onDrop = useCallback(
    (evt: React.DragEvent, node: TreeNodeData) => {
      const dragNode = dragNodeRef.current

      evt.preventDefault()
      evt.stopPropagation()
      setDirection(null)

      // 在拖拽的过程中，该节点可能已经不是该节点了
      // 次数 dragId 为 null，node.id 变成了目标节点
      if (onDropProp && dragNode?.id !== node.id) {
        const passedData = JSON.parse(evt.dataTransfer.getData('treeNode'))
        console.log('onDrop', passedData, dragNode, node)

        onDropProp({
          targetId: node.id,
          sourceId: passedData.id,
          depth: { source: passedData.depth, target: node.depth },
          direction,
        })
      }
    },
    [onDropProp, direction]
  )

  return {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
  }
}
