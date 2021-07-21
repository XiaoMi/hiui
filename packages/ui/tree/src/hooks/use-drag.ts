import React, { useCallback, useRef, useState, useEffect } from 'react'
import cloneDeep from 'lodash.clonedeep'
import { TreeNodeData, TreeNodeDragDirection } from '../TreeNode'

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
  let ret = null

  const _findNode = (treeData: TreeNodeData[], targetId: React.ReactText) => {
    const { length } = treeData

    for (let i = 0; i < length; ++i) {
      const node = treeData[i]

      if (targetId === node.id) {
        ret = node
        return
      }

      if (node.children) {
        _findNode(node.children, targetId)
      }
    }
  }

  _findNode(treeData, targetId)
  return ret
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
      if (targetId === sourceId) {
        console.log('阻止将节点拖拽到自己')
        return
      }

      const sourceChildrenIds = fFindNestedChildNodesById(flattedData, sourceId).map(
        (node) => node.id
      )
      // 阻止将节点拖拽到自己的子树当中
      if (sourceChildrenIds.includes(targetId) || sourceId === targetId) {
        console.log('阻止将节点拖拽到自己的子树当中')
        return
      }

      const sourceNode = findNodeById(treeData, sourceId)
      const targetNode = findNodeById(treeData, targetId)

      if (!sourceNode || !targetNode) {
        console.log(
          '未找到任何节点(sourceNode, targetNode)',
          sourceId,
          sourceNode,
          targetId,
          targetNode
        )
        return
      }

      const nextTreeData = cloneDeep(treeData)
      const isInsertToInside = direction === 'inside'

      console.log('Moving Node---------------', sourceId, targetId)

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

export const useDataCache = (data: TreeNodeData[]) => {
  const [internalData, setInternalData] = useState(data)

  useEffect(() => {
    setInternalData(data)
  }, [data])

  return [internalData, setInternalData] as const
}
