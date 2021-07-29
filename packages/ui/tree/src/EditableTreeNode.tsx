// @ts-nocheck
import React, { forwardRef, useCallback, useRef, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useTreeContext } from './context'
import { TreeNode } from './TreeNode'

const _role = 'tree-node'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is EditableTreeNode
 */
export const EditableTreeNode = forwardRef<HTMLLIElement | null, EditableTreeNodeProps>(
  ({ prefixCls = _prefix, role = _role, className, data: node, ...rest }, ref) => {
    const {
      onSave,
      onCancel,
      onDelete,
      addChildNode,
      addSiblingNode,
      tryToggleExpandedIds,
      // type = 'add',
    } = useTreeContext()

    const cls = cx(prefixCls, className)

    const [editing, setEditing] = useState(() => {
      return node.type === 'add' || false
    })

    const [inputValue, setInputValue] = useState('')

    // TODO: 写成高阶组件

    let child = null

    if (editing) {
      child = (
        <div className={`${prefixCls}--editing`}>
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
      <TreeNode data={node} {...rest}>
        <div>
          {child || (
            <div>
              {node.title}
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
                add
              </span>
              {/* 添加子节点 */}
              <span
                style={{ marginLeft: 12 }}
                onClick={() => {
                  addChildNode(node)
                  // TODO: 动画丢失，动画触发来源有多个，如何将展开收起和动画触发解耦
                  tryToggleExpandedIds((prev) => prev.concat(node.id))
                }}
              >
                child
              </span>

              {/* 删除当前子节点 */}
              <span
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onDelete(node)
                }}
              >
                del
              </span>
            </div>
          )}
        </div>
      </TreeNode>
    )
  }
)

export interface EditableTreeNodeProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * 控制是否可以触发拖拽
   */
  tabIndex?: number
  /**
   * 该节点的数据信息
   */
  data: EditableTreeNodeData
  /**
   * 该节点是否被展开
   */
  expanded?: boolean
  /**
   * 该节点所在扁平化后的树中的位置
   */
  index?: number
}

export type EditableTreeNodeDragDirection = 'before' | 'inside' | 'after' | null

export interface EditableTreeNodeData {
  /**
   * 树节点唯一 id
   */
  id: React.ReactText
  /**
   * 树节点标题
   */
  title: React.ReactNode
  /**
   * 该节点的子节点
   */
  children?: EditableTreeNodeData[]
  /**
   * 是否为叶子节点
   */
  isLeaf?: boolean
  /**
   * 是否禁用节点
   */
  disabled?: boolean
  /**
   * 该节点的层级，从 0（顶层）开始
   * @private
   */
  depth?: number
  /**
   * 该节点的所有祖先节点
   * @private
   */
  ancestors?: EditableTreeNodeData[]

  parent?: EditableTreeNodeData
  parentId?: React.ReactText
}

if (__DEV__) {
  EditableTreeNode.displayName = 'EditableTreeNode'
}
