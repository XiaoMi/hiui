import React, { forwardRef, useCallback, useRef, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { times } from '@hi-ui/times'

import { useTreeContext } from './context'
import { IconLoading } from './Icon'
// TODO: error import when using
import Checkbox from '@hi-ui/checkbox'
import { TreeNode } from './TreeNode'

const _role = 'tree-node'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is EditableTreeNode
 */
export const EditableTreeNode = forwardRef<HTMLLIElement | null, EditableTreeNodeProps>(
  ({ prefixCls = _prefix, role = _role, className, data: node, ...rest }, ref) => {
    const {
      disabled: disabledContext = false,
      draggable = false,
      selectedId,
      onSelect,
      onExpand,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDrop,
      onLoadChildren,
      checkable = false,
      onNodeCheck,
      onSave,
      onCancel,
      // type = 'add',
    } = useTreeContext()

    const cls = cx(prefixCls, className)

    const [editing, setEditing] = useState(false)
    const [inputValue, setInputValue] = useState('')

    // TODO: 写成高阶组件

    let children = null

    if (editing) {
      children = (
        <div className={`${prefixCls}--editing`}>
          <input
            style={{ width: 240, marginRight: 20 }}
            onKeyDown={(e) => {
              e.stopPropagation()
            }}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value, node.id)
            }}
          />
          <span
            className={cx('save-btn', {
              'save-btn-disabled': inputValue === '',
            })}
            onClick={() => {
              if (inputValue === '') {
                return
              }
              onSave?.(node)
              setEditing(false)
            }}
          >
            确认
          </span>
          <span
            style={{ cursor: 'pointer', color: '#999' }}
            onClick={() => {
              onCancel?.(node.id)

              if (node.type === 'add') {
                // cancelAddNode(node)
              }
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
          {/* 保存：插入孩子、插入兄弟、
           */}
          {children || (
            <div>
              {children}
              <span
                onClick={() => {
                  setEditing(true)
                }}
              >
                点击编辑
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
