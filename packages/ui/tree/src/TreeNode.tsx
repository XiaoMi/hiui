import React, { forwardRef, useCallback, useRef, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { times } from '@hi-ui/times'
import { useTreeContext } from './context'
import { defaultLoadingIcon } from './icons'
import Checkbox from '@hi-ui/checkbox'

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
      checked = false,
      semiChecked = false,
      ...rest
    },
    ref
  ) => {
    const {
      disabled: disabledContext = false,
      draggable = false,
      checkable = false,
      appearance,
      searchValue,
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
      highlightText,
      collapseIcon,
      expandIcon,
      leafIcon,
      titleRender,
    } = useTreeContext()

    const [direction, setDirection] = useState<TreeNodeDragDirection>(null)

    const treeNodeTitleRef = useRef<HTMLDivElement>(null)
    const dragIdRef = useRef<React.ReactText | null>(null)

    const disabled = node.disabled || disabledContext

    const enableDraggable = draggable && !disabled

    const [isDragging, setIsDragging] = useState(false)

    // 拖拽管理
    const dragEventHandlers = useMemo(() => {
      if (!enableDraggable) return

      const { id, depth } = node

      return {
        onDragStart: (evt: React.DragEvent) => {
          console.log('onDragStart')

          evt.stopPropagation()

          setIsDragging(true)
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
          setIsDragging(false)

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

    const [loading, setLoading] = useState(false)

    const onExpandRef = useRef(onExpand)
    React.useEffect(() => {
      onExpandRef.current = onExpand
    })
    // 处理 Switch 点击
    const handleSwitcherClick = useCallback(
      (evt: React.MouseEvent) => {
        // evt.stopPropagation()
        if (node.isLeaf) return

        if (node.children) {
          console.log('onExpand', node)

          onExpandRef.current?.(node, !expanded)
          // 避免重复调用 onLoadChildren 异步加载子节点
          return
        }

        if (onLoadChildren) {
          setLoading(true)

          // 如何设计请求数据，异步插入
          onLoadChildren(node)
            .then((res) => {
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

    // 渲染空白占位
    const renderIndent = useCallback(
      (node) => {
        const { id, depth, sibling, ancestors } = node
        const isSiblingLast = sibling && sibling[sibling.length - 1].id === id

        // const isAncestorSiblingLast = []
        // if (ancestors) {
        //   ancestors.forEach((a, idx) => {
        //     if (idx < ancestors.length - 1) {
        //       isAncestorSiblingLast.push(
        //         a.id === ancestors[idx + 1].children[ancestors[idx + 1].children.length - 1].id
        //       )
        //     }
        //   })
        // }

        // const _isAncestorSiblingLast = isAncestorSiblingLast.reverse()

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
                  // _isAncestorSiblingLast[index] && !isDepthLast && 'tree-node__indent--parent-tail'
                )}
              />
            </span>
          )
        })
      },
      [prefixCls]
    )

    // 渲染子树折叠切换器
    const renderSwitcher = useCallback(
      (node) => {
        if (loading) {
          return defaultLoadingIcon
        }

        const hasChildren = node.children && node.children.length > 0
        const canLoadChildren = onLoadChildren && !node.isLeaf && !node.children

        if (hasChildren || canLoadChildren) {
          return (
            <button className={`${prefixCls}-switcher`} onClick={handleSwitcherClick}>
              {expanded ? expandIcon : collapseIcon}
            </button>
          )
        }

        return leafIcon
      },
      [
        handleSwitcherClick,
        prefixCls,
        onLoadChildren,
        expanded,
        expandIcon,
        collapseIcon,
        leafIcon,
        loading,
      ]
    )

    const renderHighlight = (node: any) => {
      const index = node.title.indexOf(highlightText)
      const beforeStr = node.title.substr(0, index)
      const afterStr = node.title.substr(index + highlightText?.length)

      return (
        <span>
          {beforeStr}
          <span className="title__text--matched">{highlightText}</span>
          {afterStr}
        </span>
      )
    }

    // 渲染标题
    const renderTitle = (node: TreeNodeData, selectedId: React.ReactText) => {
      const { id, title, depth } = node

      return (
        <div
          ref={treeNodeTitleRef}
          className={`${prefixCls}__title`}
          onClick={() => onSelect?.(node)}
        >
          {/* TODO: 对 titleRender 注入 context ？ */}
          {titleRender ? titleRender(node) : <span className="title__text">{title}</span>}
        </div>
      )
    }

    // 渲染复选框
    const renderCheckbox = useCallback(
      (node, checked, semiChecked) => {
        return (
          <Checkbox
            indeterminate={semiChecked}
            checked={checked}
            disabled={disabled}
            focusable={false}
            onChange={() => {
              onNodeCheck(node, !checked)
            }}
          />
        )
      },
      [disabled, onNodeCheck]
    )

    const cls = cx(
      prefixCls,
      className,
      appearance && `${prefixCls}--appearance-${appearance}`,
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
          {renderIndent(node)}

          {renderSwitcher(node)}

          {checkable ? renderCheckbox(node, checked, semiChecked) : null}

          {renderTitle(node, selectedId)}
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
  data: TreeNodeData
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

export type TreeNodeDragDirection = 'before' | 'inside' | 'after' | null

export interface TreeNodeData {
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
  children?: TreeNodeData[]
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
  ancestors?: TreeNodeData[]

  parent?: TreeNodeData
  parentId?: React.ReactText
}

if (__DEV__) {
  TreeNode.displayName = 'TreeNode'
}
