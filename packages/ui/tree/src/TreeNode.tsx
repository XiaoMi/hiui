import React, { forwardRef, useCallback, useRef, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { times } from '@hi-ui/times'
import Checkbox from '@hi-ui/checkbox'
import { defaultLoadingIcon } from './icons'
import { useTreeContext } from './context'
import { FlattedTreeNodeData, TreeNodeDragDirection } from './types'

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
      data: node,
      expanded = false,
      checked = false,
      semiChecked = false,
      ...rest
    },
    ref
  ) => {
    const {
      draggable = false,
      checkable = false,
      selectedId,
      onSelect,
      onExpand,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDrop,
      onLoadChildren,
      onNodeCheck,
      showLine,
      collapseIcon,
      expandIcon,
      leafIcon,
      titleRender,
    } = useTreeContext()

    const { disabled } = node
    const enableDraggable = draggable && !disabled

    const [isDragging, setIsDragging] = useState(false)
    const [direction, setDirection] = useState<TreeNodeDragDirection>(null)

    const treeNodeTitleRef = useRef<HTMLDivElement>(null)
    const dragIdRef = useRef<React.ReactText | null>(null)

    // 拖拽管理
    const dragEventHandlers = useMemo(() => {
      if (!enableDraggable) return

      const { id, depth } = node

      return {
        onDragStart: (evt: React.DragEvent) => {
          // console.log('onDragStart')

          evt.stopPropagation()

          setIsDragging(true)
          dragIdRef.current = id
          evt.dataTransfer.setData('treeNode', JSON.stringify({ id, depth }))

          onDragStart?.(node)
        },
        onDragEnd: (evt: React.DragEvent) => {
          // console.log('onDragEnd')

          evt.preventDefault()
          evt.stopPropagation()
          evt.dataTransfer.clearData()
          dragIdRef.current = null
          setDirection(null)
          setIsDragging(false)

          onDragEnd?.(node)
        },
        onDragLeave: (evt: React.DragEvent) => {
          // console.log('onDragLeave')

          evt.preventDefault()
          evt.stopPropagation()
          setDirection(null)
        },
        // 拖至到目标元素上时触发事件
        onDragOver: (evt: React.DragEvent) => {
          const dragId = dragIdRef.current
          // console.log('onDragOver', dragId)

          evt.preventDefault()
          evt.stopPropagation()

          // 这里需要考虑3点：
          // 拖到自己的老位置，不处理
          // 父树不能拖到其子树内
          // 不同于简单的文件夹拖拽，同层可以拖拽进行排序
          if (dragId !== id) {
            const targetBoundingRect = treeNodeTitleRef.current?.getBoundingClientRect()
            if (!targetBoundingRect) return

            const hoverTargetSortY = (targetBoundingRect.bottom - targetBoundingRect.top) / 3
            const hoverTargetInsideY = hoverTargetSortY + hoverTargetSortY

            // 鼠标垂直移动距离
            const hoverClientY = evt.clientY - targetBoundingRect.top

            // 将当前元素垂直平分为三层，每一层用来对应其放置的位置
            if (hoverClientY < hoverTargetSortY) {
              setDirection(TreeNodeDragDirection.BEFORE)
            } else if (hoverClientY < hoverTargetInsideY) {
              setDirection(TreeNodeDragDirection.INSIDE)
            } else {
              setDirection(TreeNodeDragDirection.AFTER)
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
            // console.log('onDrop', passedData, dragId, id)

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

    const [loading, setLoading] = useState(false)

    const onExpandRef = useRef(onExpand)
    React.useEffect(() => {
      onExpandRef.current = onExpand
    })

    const onNodeExpand = useCallback(
      (evt: React.MouseEvent) => {
        // 避免触发 title 被点击，选中
        evt.stopPropagation()

        if (node.children) {
          onExpandRef.current?.(node, !expanded)
          return
        }

        if (onLoadChildren) {
          setLoading(true)

          onLoadChildren(node)
            .then(() => {
              setLoading(false)
              // 由于闭包，这里通过 setTimeout 拿取最新的 onExpand
              setTimeout(() => {
                onExpandRef.current?.(node, !expanded)
              })
            })
            .catch(() => {
              setLoading(false)
            })
        }
      },
      [node, expanded, onLoadChildren]
    )

    const renderTitle = useCallback(
      (
        node: FlattedTreeNodeData,
        titleRender?: (node: FlattedTreeNodeData) => React.ReactNode,
        onSelect?: (node: FlattedTreeNodeData) => void
      ) => {
        return (
          <div
            ref={treeNodeTitleRef}
            className={`${prefixCls}__title`}
            onClick={() => onSelect?.(node)}
          >
            {/* TODO: 对 titleRender 注入 context ？ */}
            {titleRender ? titleRender(node) : <span className="title__text">{node.title}</span>}
          </div>
        )
      },
      [prefixCls]
    )

    const cls = cx(
      prefixCls,
      className,
      showLine && `${prefixCls}--linear`,
      direction && `${prefixCls}--drag-${direction}`,
      selectedId === node.id && `${prefixCls}--selected`,
      disabled && `${prefixCls}--disabled`,
      !node.isLeaf && `${prefixCls}--${expanded ? 'open' : 'closed'}`
    )

    return (
      <li ref={ref} role={role} className={cls} {...rest}>
        <div
          className={cx(`${prefixCls}__wrap`, isDragging && 'dragging')}
          draggable={enableDraggable}
          {...dragEventHandlers}
        >
          {renderIndent(prefixCls, node)}

          {renderSwitcher(
            node,
            prefixCls,
            loading,
            expanded,
            expandIcon,
            collapseIcon,
            leafIcon,
            onNodeExpand,
            onLoadChildren
          )}

          {renderCheckbox(node, onNodeCheck, checkable, disabled, checked, semiChecked)}

          {renderTitle(node, titleRender, onSelect)}
        </div>
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
  /**
   * 控制是否可以触发拖拽
   */
  tabIndex?: number
  /**
   * 该节点的数据信息
   */
  data: FlattedTreeNodeData
  /**
   * 该节点是否被展开
   */
  expanded?: boolean
  /**
   * 该节点所在扁平化后的树中的位置
   */
  index?: number
  /**
   * 表示该节点被选中
   */
  checked?: boolean
  /**
   * 表示该节点被半选中
   */
  semiChecked?: boolean
}

if (__DEV__) {
  TreeNode.displayName = 'TreeNode'
}

/**
 * 渲染空白占位
 */
const renderIndent = (prefixCls: string, node: FlattedTreeNodeData) => {
  const { id, depth, siblings } = node
  const isSiblingLast = siblings && siblings[siblings.length - 1].id === id

  return times(depth, (index: number) => {
    index++
    const isDepthLast = depth === index
    return (
      <span id={`${index}`} key={index} style={{ alignSelf: 'stretch' }}>
        <span
          className={cx(
            `${prefixCls}__indent`,
            isDepthLast && `${prefixCls}__indent--depth-tail`,
            isSiblingLast && isDepthLast && `${prefixCls}__indent--tail`
          )}
        />
      </span>
    )
  })
}

/**
 * 渲染复选框
 */
const renderCheckbox = (
  node: FlattedTreeNodeData,
  onNodeCheck: (checkedNode: FlattedTreeNodeData, checked: boolean) => void,
  checkable: boolean,
  disabled: boolean | undefined,
  checked: boolean | undefined,
  semiChecked: boolean | undefined
) => {
  return checkable ? (
    <Checkbox
      indeterminate={semiChecked}
      checked={checked}
      disabled={disabled}
      focusable={false}
      onChange={() => {
        onNodeCheck(node, !checked)
      }}
    />
  ) : null
}

/**
 * 渲染子树折叠切换器
 */
const renderSwitcher = (
  node: FlattedTreeNodeData,
  prefixCls: string,
  loading: boolean,
  expanded: boolean,
  expandIcon: React.ReactNode,
  collapseIcon: React.ReactNode,
  leafIcon: React.ReactNode,
  onNodeExpand: (evt: React.MouseEvent) => void,
  onLoadChildren?: (node: FlattedTreeNodeData) => Promise<any>
) => {
  if (loading) {
    return (
      <span className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--loading`)}>
        {defaultLoadingIcon}
      </span>
    )
  }

  const hasChildren = node.children && node.children.length > 0
  const canLoadChildren = onLoadChildren && !node.isLeaf && !node.children

  if (hasChildren || canLoadChildren) {
    return (
      <button
        className={cx(
          `${prefixCls}__switcher`,
          expanded ? `${prefixCls}__switcher--expanded` : `${prefixCls}__switcher--collapse`
        )}
        onClick={onNodeExpand}
      >
        {expanded ? expandIcon : collapseIcon}
      </button>
    )
  }

  return (
    <span
      className={cx(
        `${prefixCls}__switcher`,

        `${prefixCls}__switcher--noop`
      )}
    >
      {leafIcon}
    </span>
  )
}
