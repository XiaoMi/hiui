import React, { useState, useCallback, useMemo } from 'react'
import { cx } from '@hi-ui/classname'
import { TreeProps } from './Tree'
import { TreeNodeData } from './TreeNode'
import { useEdit, useCache } from './hooks'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { flattenTreeData } from './utils'

/**
 * 将 BaseTree 添加定制编辑功能，返回 EditableTree
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
  const flattedData: TreeNodeData[] = useMemo(() => flattenTreeData(data), [data])

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

  // 拦截 expand：用于添加子节点时自动展开当前节点
  // 但是对外仍然暴露 expand 相关 props 原有的功能
  const [expandedIds, tryToggleExpandedIds] = useUncontrolledState(
    function getDefaultExpandedId() {
      // 开启默认展开全部
      if (defaultExpandAll) {
        return flattedData.map((node) => node.id)
      }
      return defaultExpandedIds
    },
    expandedIdsProp,
    onExpand
  )

  const renderTitleWithEditable = useCallback(
    (node) => {
      return (
        <EditableTreeNode
          node={node}
          onSave={saveEdit}
          onCancel={cancelAddNode}
          onDelete={deleteNode}
          addChildNode={addChildNode}
          addSiblingNode={addSiblingNode}
          onExpand={tryToggleExpandedIds}
        />
      )
    },
    [saveEdit, cancelAddNode, deleteNode, addChildNode, addSiblingNode, tryToggleExpandedIds]
  )

  const proxyTitleRender = useCallback(
    (node: TreeNodeData) => {
      if (titleRender) {
        return titleRender(node)
      }

      return editable ? renderTitleWithEditable(node) : node.title
    },
    [titleRender, editable, renderTitleWithEditable]
  )

  const treeProps = {
    ...nativeTreeProps,
    titleRender: proxyTitleRender,
    data: editable ? treeData : data,
    expandedIds,
    onExpand: tryToggleExpandedIds,
  }

  return treeProps
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

const EditableTreeNode = (props) => {
  const { node, onSave, onCancel, onDelete, addChildNode, addSiblingNode, onExpand } = props

  // 待添加
  // 编辑中
  // 正常节点
  // 删除后

  // 如果是添加的节点，进入节点编辑临时态
  const [editing, setEditing] = useState(() => node.raw.type === 'add' || false)
  const [inputValue, setInputValue] = useState(node.title || '')

  if (editing) {
    return (
      <div className={`hi-v4-tree-node--editing`}>
        <input
          style={{ width: 240, marginRight: 20 }}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
        />
        <span
          className={cx('save-btn', !inputValue && 'save-btn-disabled')}
          onClick={() => {
            if (!inputValue) return

            onSave?.({ ...node, title: inputValue })
            setEditing(false)
          }}
        >
          确认
        </span>
        <span
          style={{ cursor: 'pointer', color: '#999' }}
          onClick={() => {
            setEditing(false)
            onCancel?.(node)
          }}
        >
          取消
        </span>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <span>{node.title}</span>
      </div>
      {/* 自定义 title 的后缀 icon */}
      <div>
        {/* 编辑节点 */}
        <span
          style={{ marginLeft: 12 }}
          onClick={() => {
            setEditing(true)
          }}
        >
          edit
        </span>
        {/* 添加兄弟节点 */}
        <span
          style={{ marginLeft: 12 }}
          onClick={() => {
            addSiblingNode(node)
          }}
        >
          addSibling
        </span>
        {/* 添加子节点 */}
        <span
          style={{ marginLeft: 12 }}
          onClick={() => {
            addChildNode(node)
            // 展开子节点列表
            onExpand((prev) => Array.from(new Set(prev.concat(node.id))))
          }}
        >
          addChild
        </span>

        {/* 删除当前子节点 */}
        <span
          style={{ marginLeft: 12 }}
          onClick={() => {
            onDelete(node)
          }}
        >
          delete
        </span>
      </div>
    </div>
  )
}
