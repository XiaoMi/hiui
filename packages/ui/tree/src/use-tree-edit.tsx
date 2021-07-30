import React, { useState, useMemo, useCallback } from 'react'
import { TreeProps } from './Tree'
import { TreeNodeData } from './TreeNode'
import { flattenTreeData } from './utils'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
// @ts-ignore
import cloneDeep from 'lodash.clonedeep'
import { useEdit, useCache } from './hooks'

/**
 * 将 BaseTree 添加定制编辑功能
 *
 * @param props
 * @returns
 */
export const useTreeEdit = (props: EditableTreeProps) => {
  const {
    data,
    editable = false,
    expandedIds: expandedIdsProp,
    defaultExpandedIds = [],
    onExpand,
    defaultExpandAll = false,
    titleRender,
    onBeforeSave,
    onBeforeDelete,
    onSave,
    onDelete,
    ...nativeTreeProps
  } = props

  const [treeData, setTreeData] = useCache(data)
  const [saveEdit, cancelAddNode, deleteNode, addChildNode, addSiblingNode] = useEdit(
    data,
    treeData,
    setTreeData,
    onBeforeSave,
    onBeforeDelete,
    onSave,
    onDelete
  )
}

export interface EditableTreeProps extends TreeProps {
  /**
   * 开启后节点可编辑（内置：添加同级节点、添加子节点、编辑节点、删除节点）
   */
  editable?: boolean
  /**
   * 节点保存新增、编辑状态时触发，返回 false 则节点保持失败，不会触发 onSave
   */
  onBeforeSave?: (savedNode: TreeNodeData, data: any, level: number) => boolean
  /**
   * 	节点保存新增、编辑状态后触发
   */
  onSave?: (savedNode: TreeNodeData, data: TreeNodeData[]) => void
  /**
   * 节点删除前触发，返回 false 则节点删除失败，不会触发 onDelete
   */
  onBeforeDelete?: (deletedNode: TreeNodeData, data: any, level: number) => boolean
  /**
   * 节点删除后触发
   */
  onDelete?: (deletedNode: TreeNodeData, data: TreeNodeData[]) => void
}
