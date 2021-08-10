import React, { useCallback } from 'react'
import { TreeNodeData, FlattedTreeNodeData, TreeNodeType, TreeDataStatus } from '../types'
import cloneDeep from 'lodash.clonedeep'
import { addChildNodeById, deleteNodeById, insertNodeById, uuid } from '../utils'
import { useLatestRef } from '@hi-ui/use-latest'

const genTreeNode = () => ({ id: uuid(), title: '', type: 'add' } as FlattedTreeNodeData)

export const useEdit = (
  treeData: TreeNodeData[],
  setTreeData: React.Dispatch<React.SetStateAction<TreeNodeData[]>>,
  onBeforeSave?: (
    savedNode: FlattedTreeNodeData,
    data: TreeDataStatus,
    level: number
  ) => boolean | Promise<boolean>,
  onBeforeDelete?: (
    deletedNode: FlattedTreeNodeData,
    data: TreeDataStatus,
    level: number
  ) => boolean | Promise<boolean>,
  onSave?: (savedNode: FlattedTreeNodeData, data: TreeNodeData[]) => void,
  onDelete?: (deletedNode: FlattedTreeNodeData, data: TreeNodeData[]) => void
) => {
  const addSiblingNode = useCallback(
    (node: FlattedTreeNodeData) => {
      setTreeData((prev) => {
        const nextTreeData = cloneDeep(prev)
        const nodeToAdd = genTreeNode()
        insertNodeById(nextTreeData, node.id, nodeToAdd, 1)
        return nextTreeData
      })
    },
    [setTreeData]
  )

  const addChildNode = useCallback(
    (node: FlattedTreeNodeData) => {
      setTreeData((prev) => {
        const nextTreeData = cloneDeep(prev)
        const nodeToAdd = genTreeNode()
        addChildNodeById(nextTreeData, node.id, nodeToAdd, 0)
        return nextTreeData
      })
    },
    [setTreeData]
  )

  const cancelAddNode = useCallback(
    (node: FlattedTreeNodeData) => {
      // 取消添加节点（需要移除）
      if (node.raw.type === TreeNodeType.ADD) {
        setTreeData((prev) => {
          const nextTreeData = cloneDeep(prev)
          deleteNodeById(nextTreeData, node.id)

          return nextTreeData
        })
      }
    },
    [setTreeData]
  )

  const onBeforeDeleteRef = useLatestRef(onBeforeDelete)
  const onDeleteRef = useLatestRef(onDelete)

  const deleteNode = useCallback(
    async (node: FlattedTreeNodeData) => {
      const nextTreeData = cloneDeep(treeData)
      deleteNodeById(nextTreeData, node.id)

      // 默认不拦截（不传或者返回 true）则非受控删除
      if (onBeforeDeleteRef.current) {
        const uncontrolledUpdate = await onBeforeDeleteRef.current(
          node,
          { before: treeData, after: nextTreeData },
          node.depth
        )

        if (uncontrolledUpdate === true) {
          setTreeData(nextTreeData)
          onDeleteRef.current?.(node, nextTreeData)
        }
      } else {
        setTreeData(nextTreeData)
        onDeleteRef.current?.(node, nextTreeData)
      }
    },
    [treeData, setTreeData]
  )

  const onBeforeSaveRef = useLatestRef(onBeforeSave)
  const onSaveRef = useLatestRef(onSave)

  const saveEdit = useCallback(
    async (targetNode: FlattedTreeNodeData) => {
      const nextTreeData = cloneDeep(treeData)
      _saveEdit(targetNode, nextTreeData)

      if (onBeforeSaveRef.current) {
        const result = await onBeforeSaveRef.current(
          targetNode,
          { before: treeData, after: nextTreeData },
          targetNode.depth
        )

        // 根据返回结果 非受控更新数据
        if (result === true) {
          setTreeData(nextTreeData)
          onSaveRef.current?.(targetNode, nextTreeData)
        }
      } else {
        // 没有 onBeforeSave 的情况下，直接非受控修改数据
        setTreeData(nextTreeData)
        onSaveRef.current?.(targetNode, nextTreeData)
      }
    },
    [treeData, setTreeData]
  )

  return [saveEdit, cancelAddNode, deleteNode, addChildNode, addSiblingNode] as const
}

// 修改指定的 id 的 node 内容
const _saveEdit = (targetNode: TreeNodeData, treeData: TreeNodeData[]) => {
  const { id, title } = targetNode

  treeData.forEach((node) => {
    if (node.id === id) {
      node.title = title
      delete node.type
    } else {
      if (node.children) {
        _saveEdit(targetNode, node.children)
      }
    }
  })
}
