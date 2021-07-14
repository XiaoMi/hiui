import React, { forwardRef, useCallback, useRef, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { times } from './utils/index'
import { useTreeContext } from './context'
import { IconLoading } from './Icon'

const _role = 'tree-node'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TreeNode
 */
export const TreeNode = forwardRef<HTMLLIElement | null, TreeNodeProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      data: node,
      expanded = false,
      ...rest
    },
    ref
  ) => {
    const treeNodeRef = useRef(null)
    const {
      disabled = false,
      draggable = false,
      onSelect,
      selectedId,
      onExpand,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDrop,
    } = useTreeContext()

    const [direction, setDirection] = useState<'before' | 'inside' | 'after' | null>(null)
    const dragIdRef = useRef<React.ReactText | null>(null)

    // TODO: 控制优先级 父子组件传递
    const enableDraggable = draggable && !disabled

    const treeNodeTitleRef = useRef<HTMLDivElement>(null)

    // 拖拽管理
    const dragEventHandlers = useMemo(() => {
      if (!enableDraggable) return

      const { id, depth } = node

      return {
        onDragStart: (evt: React.DragEvent) => {
          console.log('onDragStart')

          evt.stopPropagation()

          dragIdRef.current = id
          evt.dataTransfer.setData('treeNode', JSON.stringify({ id, depth }))

          onDragStart?.(node)
        },
        onDragEnd: (evt: React.DragEvent) => {
          console.log('onDragEnd')

          evt.preventDefault()
          evt.stopPropagation()
          evt.dataTransfer.clearData()
          dragIdRef.current = null
          setDirection(null)

          onDragEnd?.(node)
        },
        onDragLeave: (evt: React.DragEvent) => {
          console.log('onDragLeave')

          evt.preventDefault()
          evt.stopPropagation()
          setDirection(null)
        },
        // 拖至到目标元素上时触发事件
        onDragOver: (evt: React.DragEvent) => {
          const dragId = dragIdRef.current
          console.log('onDragOver', dragId)

          evt.preventDefault()
          evt.stopPropagation()

          // 这里需要考虑3点：
          // 拖到自己的老位置，不处理
          // 父树不能拖到其子树内
          // 不同于简单的文件夹，同层可以拖拽进行排序
          if (dragId !== id) {
            const targetBoundingRect = treeNodeTitleRef.current?.getBoundingClientRect()
            if (!targetBoundingRect) return

            const hoverTargetSortY = (targetBoundingRect.bottom - targetBoundingRect.top) / 3
            const hoverTargetInsideY = hoverTargetSortY + hoverTargetSortY

            // 鼠标垂直移动距离
            const hoverClientY = evt.clientY - targetBoundingRect.top

            // 将当前元素垂直平分为三层，每一层用来对应其放置的位置
            if (hoverClientY < hoverTargetSortY) {
              setDirection('before')
            } else if (hoverClientY < hoverTargetInsideY) {
              setDirection('inside')
            } else {
              setDirection('after')
            }
          }

          onDragOver?.(node)
        },
        // 放置目标元素时触发事件
        onDrop: (evt: React.DragEvent) => {
          const dragId = dragIdRef.current

          evt.preventDefault()
          evt.stopPropagation()
          setDirection(null)

          // 在拖拽的过程中，该节点可能已经不是该节点了
          // 次数 dragId 为 null，node.id 变成了目标节点
          if (onDrop && dragId !== id) {
            const passedData = JSON.parse(evt.dataTransfer.getData('treeNode'))
            console.log('onDrop', passedData, dragId, id)

            onDrop({
              targetId: id,
              sourceId: passedData.id,
              depth: { source: passedData.depth, target: depth },
              direction,
            })
          }
        },
      }
    }, [node, enableDraggable, direction, onDragStart, onDragEnd, onDragOver, onDrop])

    // 渲染标题
    const renderTitle = (node, selectedId) => {
      const { id, title, depth } = node
      return (
        <div
          ref={treeNodeTitleRef}
          draggable={enableDraggable}
          className={`${prefixCls}__title`}
          {...dragEventHandlers}
        >
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
    }

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

    // 处理 Switch 点击
    const handleSwitcherClick = useCallback(
      (node) => {
        // e.stopPropagation()
        // if (onLoadChildren && !node.children) {
        //   setLoading(true)
        //   onLoadChildren(node).then(
        //     (res) => {
        //       setLoading(false)
        //       onExpandNode(node, !expanded)
        //     },
        //     () => {
        //       setLoading(false)
        //     }
        //   )
        // } else {
        onExpand(node, !expanded)
        // }
      },
      [expanded, onExpand]
    )

    // 渲染子树折叠切换器
    const renderSwitcher = useCallback(
      (data) => {
        return (
          <span
            onClick={() => {
              handleSwitcherClick(data)
            }}
          >
            ⑥
          </span>
        )
      },
      [handleSwitcherClick]
    )

    const cls = cx(
      prefixCls,
      className,
      direction && `${prefixCls}--drag-${direction}`,
      selectedId === node.id && `${prefixCls}--selected`,
      node.disabled && `${prefixCls}--disabled`
    )

    return (
      <li ref={ref} role={role} className={cls} {...rest}>
        {renderIndent(node.depth)}

        {renderSwitcher(node)}

        {renderTitle(node, selectedId)}
      </li>
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
  expanded?: boolean
}

export interface TreeNodeData {
  id: React.ReactText
  title: React.ReactNode
  children?: TreeNodeData[]
  isLeaf?: boolean
  disabled?: boolean
  depth?: number
  ancestors?: any[]
}

if (__DEV__) {
  TreeNode.displayName = 'TreeNode'
}
