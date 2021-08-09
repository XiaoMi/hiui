import React, { useCallback } from 'react'
import cloneDeep from 'lodash.clonedeep'

import {
  TreeNodeData,
  TreeNodeDragDirection,
  FlattedTreeNodeData,
  TreeDataStatus,
  TreeLevelStatus,
} from '../types'
import {
  fFindNodeById,
  deleteNodeById,
  addChildNodeById,
  insertNodeById,
  fFindNestedChildNodesById,
} from '../utils'

export const useTreeDrop = (
  treeData: TreeNodeData[],
  flattedData: FlattedTreeNodeData[],
  setTreeData: React.Dispatch<React.SetStateAction<TreeNodeData[]>>,
  onDrop?: (
    dragNode: FlattedTreeNodeData,
    dropNode: FlattedTreeNodeData,
    dataStatus: TreeDataStatus,
    level: TreeLevelStatus
  ) => boolean | Promise<any>,
  onDropEnd?: (dragNode: FlattedTreeNodeData, dropNode: FlattedTreeNodeData) => void
) => {
  const moveNode = useCallback(
    ({ targetId, sourceId, direction, depth }) => {
      if (targetId === sourceId) {
        // console.log('阻止将节点拖拽到自己')
        return
      }

      const sourceChildrenIds = fFindNestedChildNodesById(flattedData, sourceId)[0].map(
        (node) => node.id
      )

      if (sourceChildrenIds.includes(targetId) || sourceId === targetId) {
        // console.log('阻止将节点拖拽到自己的子树当中')
        return
      }

      const sourceNode = fFindNodeById(flattedData, sourceId)
      const targetNode = fFindNodeById(flattedData, targetId)

      if (!sourceNode || !targetNode) {
        // console.log('未找到任何节点(sourceNode, targetNode)', sourceNode, targetNode)
        return
      }

      const nextTreeData = cloneDeep(treeData)
      const isInsertToInside = direction === TreeNodeDragDirection.INSIDE

      // 正式开始进行节点位置替换
      deleteNodeById(nextTreeData, sourceId)

      if (isInsertToInside) {
        addChildNodeById(nextTreeData, targetId, sourceNode.raw)
      } else {
        insertNodeById(
          nextTreeData,
          targetId,
          sourceNode.raw,
          direction === TreeNodeDragDirection.BEFORE ? 0 : 1
        )
      }

      if (onDrop) {
        const result = onDrop(
          sourceNode,
          targetNode,
          { before: treeData, after: nextTreeData },
          { before: depth.source, after: isInsertToInside ? depth.target + 1 : depth.target }
        )

        // 根据 onDrop 用户返回结果，判断是否需要非受控，进行内部更新树结构
        if (result === true) {
          setTreeData(nextTreeData)
          onDropEnd?.(sourceNode, targetNode)
        } else if (result && typeof result.then === 'function') {
          result.then(() => {
            setTreeData(nextTreeData)
            onDropEnd?.(sourceNode, targetNode)
          })
        }
      } else {
        setTreeData(nextTreeData)
      }
    },
    [setTreeData, treeData, flattedData, onDrop, onDropEnd]
  )

  return moveNode
}
