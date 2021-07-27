import React, { useCallback } from 'react'
import { TreeNodeData } from '../TreeNode'
import cloneDeep from 'lodash.clonedeep'

export const useEdit = (
  treeData: TreeNodeData[],
  setTreeData: any,
  onBeforeSave: any,
  onBeforeDelete: any,
  onSave: any,
  onDelete: any
) => {
  const deleteNode = useCallback(
    (node) => {
      const nextTreeData = cloneDeep(treeData)
      _deleteNode(node.id, nextTreeData)

      if (onBeforeDelete) {
        const result = onBeforeDelete(node, { before: treeData, after: nextTreeData }, node.depth)
        if (result === true) {
          setTreeData(nextTreeData)
          onDelete?.(node, nextTreeData)
        }
      } else {
        setTreeData(nextTreeData)
        onDelete?.(node, nextTreeData)
      }
    },
    [treeData, onBeforeDelete, onDelete, setTreeData]
  )

  const cancelAddNode = useCallback(
    (node) => {
      const nextTreeData = cloneDeep(treeData)

      _cancelAddNode(node, nextTreeData)
      setTreeData(nextTreeData)
    },
    [treeData, setTreeData]
  )

  const saveEdit = useCallback(
    (targetNode: TreeNodeData, type: 'add' | 'edit') => {
      const nextTreeData = cloneDeep(treeData)

      _saveEdit(targetNode, nextTreeData)

      if (onBeforeSave) {
        const result = onBeforeSave(
          targetNode,
          { before: treeData, after: nextTreeData },
          targetNode.depth
        )

        // 根据返回结果 非受控更新数据
        if (result === true) {
          setTreeData(nextTreeData)
          onSave?.(targetNode, nextTreeData)
        } else {
          // 取消编辑
        }
      } else {
        // 没有 onBeforeSave 的情况下，直接非受控修改数据
        setTreeData(nextTreeData)
        onSave?.(targetNode, nextTreeData)
      }
    },
    [onBeforeSave, onSave, setTreeData, treeData]
  )

  return [saveEdit, cancelAddNode, deleteNode] as const
}

// 删除节点
const _deleteNode = (itemId: React.ReactText, data: TreeNodeData[]) => {
  data.forEach((d, index) => {
    if (d.id === itemId) {
      data.splice(index, 1)
    } else {
      if (d.children) {
        _deleteNode(itemId, d.children)
      }
    }
  })
}

// 取消添加节点
const _cancelAddNode = (node: TreeNodeData, data: TreeNodeData[]) => {
  data.forEach((d, index) => {
    if (d.id === node.id) {
      data.splice(index, 1)
    } else {
      if (d.children) {
        _cancelAddNode(node, d.children)
      }
    }
  })
}

// 修改指定的 id 的 node 内容
const _saveEdit = (targetNode: TreeNodeData, treeData: TreeNodeData[]) => {
  const { id, title } = targetNode

  treeData.forEach((node, index) => {
    if (node.id === id) {
      node.title = title
      // delete node.TREE_NODE_TYPE
    } else {
      if (node.children) {
        _saveEdit(targetNode, node.children)
      }
    }
  })
}
