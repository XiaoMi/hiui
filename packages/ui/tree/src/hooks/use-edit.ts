import { useCallback } from 'react'
import { TreeNodeData, FlattedTreeNodeData } from '../types'
import cloneDeep from 'lodash.clonedeep'
import { addChildNodeById, deleteNodeById, insertNodeById, uuid } from '../utils'

const genTreeNode = () => ({ id: uuid(), title: '', type: 'add' })

export const useEdit = (
  data: TreeNodeData[],
  treeData: TreeNodeData[],
  setTreeData: any,
  onBeforeSave: any,
  onBeforeDelete: any,
  onSave: any,
  onDelete: any
) => {
  const addSiblingNode = useCallback(
    (node) => {
      // console.log('添加兄弟节点')

      const nextTreeData = cloneDeep(treeData)
      const nodeToAdd = genTreeNode()

      insertNodeById(nextTreeData, node.id, nodeToAdd, 1)
      setTreeData(nextTreeData)
    },
    [treeData, setTreeData]
  )

  const addChildNode = useCallback(
    (node) => {
      const nextTreeData = cloneDeep(treeData)
      const nodeToAdd = genTreeNode()
      // console.log('添加子节点', node, nextTreeData)

      addChildNodeById(nextTreeData, node.id, nodeToAdd, 0)
      // console.log('添加后子节点', nextTreeData)
      setTreeData(nextTreeData)
    },
    [treeData, setTreeData]
  )

  const deleteNode = useCallback(
    (node) => {
      // console.log('删除当前节点')
      const nextTreeData = cloneDeep(treeData)
      deleteNodeById(nextTreeData, node.id)

      // TODO: 拦截方法提取出去
      // 默认不拦截（不传或者返回 true）则非受控删除
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
      // 取消添加节点（需要移除）
      if (node.raw.type === 'add') {
        const nextTreeData = cloneDeep(treeData)

        deleteNodeById(nextTreeData, node.id)
        setTreeData(nextTreeData)
      } else {
        // 编辑态取消，什么也不做
      }
    },
    [treeData, setTreeData]
  )

  const saveEdit = useCallback(
    (targetNode: FlattedTreeNodeData, type: 'add' | 'edit') => {
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
        }
      } else {
        // 没有 onBeforeSave 的情况下，直接非受控修改数据
        setTreeData(nextTreeData)
        onSave?.(targetNode, nextTreeData)
      }
    },
    [onBeforeSave, onSave, setTreeData, treeData]
  )

  return [saveEdit, cancelAddNode, deleteNode, addChildNode, addSiblingNode] as const
}

// 修改指定的 id 的 node 内容
const _saveEdit = (targetNode: TreeNodeData, treeData: TreeNodeData[]) => {
  const { id, title } = targetNode

  treeData.forEach((node, index) => {
    if (node.id === id) {
      node.title = title
      // @ts-ignore
      delete node.type
    } else {
      if (node.children) {
        _saveEdit(targetNode, node.children)
      }
    }
  })
}
