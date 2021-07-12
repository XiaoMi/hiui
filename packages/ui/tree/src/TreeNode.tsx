import React, { forwardRef, useCallback, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { times } from './utils/index'

const _role = 'tree-node'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TreeNode
 */
export const TreeNode = forwardRef<HTMLDivElement | null, TreeNodeProps>(
  ({ prefixCls = _prefix, role = _role, className, children, data, ...rest }, ref) => {
    const treeNodeRef = useRef(null)
    const {
      treeNodeRender,
      checkable,
      checkedNodes,
      semiCheckedIds,
      onSelectNode,
      selectedId,
      onCheckNode,
      onExpandNode,
      draggable,
      onLoadChildren,
      apperance = 'default',
      onDragStart,
      onDragOver,
      onDrop,
      onDragEnd,
      moveFocus,
    } = {}
    const [direction, setDirection] = useState(null)
    const [dragId, setDragId] = useState(null)

    // 渲染标题
    const renderTitle = useCallback(
      (node, selectedId) => {
        const { id, title, depth } = node
        return (
          <div
            ref={treeNodeRef}
            draggable={!node.disabled && draggable}
            className={cx('tree-node__title', {
              [`tree-node__title--${direction}`]: direction,
              [`tree-node__title--draggable`]: draggable,
              [`tree-node__title--disabled`]: node.disabled,
            })}
            onDragStart={(e) => {
              e.stopPropagation()
              e.dataTransfer.setData('treeNode', JSON.stringify({ id, depth }))
              setDragId(id)
              if (onDragStart) {
                onDragStart(node)
              }
            }}
            onDragEnd={(e) => {
              e.preventDefault()
              e.stopPropagation()
              e.dataTransfer.clearData()
              setDragId(null)
              if (onDragEnd) {
                onDragEnd(e)
              }
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDirection(null)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (dragId !== id) {
                const targetBoundingRect = treeNodeRef.current?.getBoundingClientRect?.()
                const hoverTargetSortY = (targetBoundingRect.bottom - targetBoundingRect.top) / 3
                const hoverTargetInsideY = hoverTargetSortY * 2
                // 鼠标垂直移动距离
                const hoverClientY = e.clientY - targetBoundingRect.top

                if (hoverClientY < hoverTargetSortY) {
                  setDirection('up')
                } else if (hoverClientY >= hoverTargetSortY && hoverClientY < hoverTargetInsideY) {
                  setDirection('in')
                } else {
                  setDirection('down')
                }
              }
              if (onDragOver) {
                onDragOver(e)
              }
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDirection(null)
              if (onDrop && dragId !== id) {
                const passedData = JSON.parse(e.dataTransfer.getData('treeNode'))
                onDrop({
                  targetId: id,
                  sourceId: passedData.id,
                  depth: { source: passedData.depth, target: depth },
                  direction,
                })
              }
            }}
          >
            {treeNodeRender ? (
              treeNodeRender(node, selectedId === id, treeNodeRef, onSelectNode)
            ) : (
              <div
                className={cx('title__text', {
                  'title__text--selected': selectedId === id,
                })}
                onClick={() => {
                  onSelectNode(node)
                }}
              >
                {title}
              </div>
            )}
          </div>
        )
      },
      [treeNodeRef, draggable, treeNodeRender, direction, dragId]
    )

    // 渲染空白占位
    const renderIndent = useCallback(
      (depth) => {
        console.log(depth)

        return times(depth, (index: number) => {
          return (
            <span id={`${index}`} key={index} style={{ alignSelf: 'stretch' }}>
              <span className={cx(`${prefixCls}__indent`)} />
            </span>
          )
        })
      },
      [prefixCls]
    )

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {renderIndent(data.depth)}
        {renderTitle(data, 1)}
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
}

if (__DEV__) {
  TreeNode.displayName = 'TreeNode'
}
