import React, { forwardRef, useCallback, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { times } from './utils/index'
import { useTreeContext } from './context'

const _role = 'tree-node'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TreeNode
 */
export const TreeNode = forwardRef<HTMLDivElement | null, TreeNodeProps>(
  ({ prefixCls = _prefix, role = _role, className, children, data, ...rest }, ref) => {
    const treeNodeRef = useRef(null)
    const { onSelect, selectedId } = useTreeContext()

    const [direction, setDirection] = useState(null)
    const [dragId, setDragId] = useState(null)

    // 渲染标题
    const renderTitle = useCallback(
      (node, selectedId) => {
        const { id, title, depth } = node
        return (
          <div ref={treeNodeRef} draggable={!node.disabled} className={`${prefixCls}__title`}>
            <div
              className="title__text"
              onClick={() => {
                onSelect?.(node)
              }}
            >
              {title}
            </div>
          </div>
        )
      },
      [prefixCls, onSelect]
    )

    // 渲染空白占位
    const renderIndent = useCallback(
      (depth) => {
        return times(depth, (index: number) => {
          return (
            <span
              className={cx(`${prefixCls}__indent`)}
              id={`${index}`}
              key={index}
              style={{ alignSelf: 'stretch' }}
            />
          )
        })
      },
      [prefixCls]
    )

    const cls = cx(
      prefixCls,
      className,
      selectedId === data.id && `${prefixCls}--selected`,
      data.disabled && `${prefixCls}--disabled`
    )

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {renderIndent(data.depth)}
        {renderTitle(data, selectedId)}
      </div>
    )
  }
)

export interface TreeNodeProps {
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
  data: TreeNodeData
}

export interface TreeNodeData {
  id: string
  title: React.ReactNode
  children?: TreeNodeData[]
  isLeaf?: boolean
  disabled?: boolean
  depth?: number
}

if (__DEV__) {
  TreeNode.displayName = 'TreeNode'
}
