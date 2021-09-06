import React, { useCallback } from 'react'
import { cloneTree } from '@hi-ui/tree-utils'
import { getTreeNodeEventData } from '../utils/index'
import {
  TreeNodeRequiredProps,
  TreeNodeEventData,
  TreeNodeData,
  TreeNodeDragDirection,
  FlattedTreeNodeData,
  TreeDataStatus,
  TreeLevelStatus,
} from '../types'
import {
  getBeforeAfter,
  deleteNodeById,
  addChildNodeById,
  insertNodeById,
  fFindNestedChildNodesById,
  fFindNodeById,
} from '../utils'

export const useTreeDrop = (
  getTreeNodeRequiredProps: (id: React.ReactText) => TreeNodeRequiredProps,
  treeData: TreeNodeData[],
  flattedData: FlattedTreeNodeData[],
  setTreeData: React.Dispatch<React.SetStateAction<TreeNodeData[]>>,
  onDrop?: (
    dragNode: TreeNodeEventData,
    dropNode: TreeNodeEventData,
    dataStatus: TreeDataStatus,
    level: TreeLevelStatus
  ) => boolean | Promise<any>,
  onDropEnd?: (dragNode: TreeNodeEventData, dropNode: TreeNodeEventData) => void
) => {
  const moveNode = useCallback(
    (sourceId: React.ReactText, targetId: React.ReactText, direction: TreeNodeDragDirection) => {
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

      const nextTreeData = cloneTree(treeData)
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
        const eventSourceNode = getTreeNodeEventData(
          sourceNode,
          getTreeNodeRequiredProps(sourceNode.id)
        )

        const eventTargetNode = getTreeNodeEventData(
          targetNode,
          getTreeNodeRequiredProps(targetNode.id)
        )

        const result = onDrop(
          eventSourceNode,
          eventTargetNode,
          getBeforeAfter(treeData, nextTreeData),
          getBeforeAfter(
            sourceNode.depth,
            isInsertToInside ? targetNode.depth + 1 : targetNode.depth
          )
        )

        // 根据 onDrop 用户返回结果，判断是否需要非受控，进行内部更新树结构
        if (result === true) {
          setTreeData(nextTreeData)
          onDropEnd?.(eventSourceNode, eventTargetNode)
        } else if (result && typeof result.then === 'function') {
          result.then(() => {
            setTreeData(nextTreeData)
            onDropEnd?.(eventSourceNode, eventTargetNode)
          })
        }
      } else {
        setTreeData(nextTreeData)
      }
    },
    [setTreeData, treeData, flattedData, onDrop, onDropEnd, getTreeNodeRequiredProps]
  )

  return moveNode
}
