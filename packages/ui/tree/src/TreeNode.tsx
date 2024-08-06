import React, { forwardRef, useCallback, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { times } from '@hi-ui/array-utils'
import Checkbox from '@hi-ui/checkbox'
import {
  defaultLoadingIcon,
  defaultCollapseIcon,
  defaultExpandIcon,
  defaultLeafIcon,
} from './icons'
import { IconButton } from './IconButton'
import { useTreeContext } from './context'
import { FlattedTreeNodeData, TreeNodeDragDirection, TreeNodeEventData } from './types'
import { getTreeNodeEventData } from './utils'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { getNodeSiblings } from '@hi-ui/tree-utils'

const _role = 'tree-node'
const treePrefix = getPrefixCls(_role)

export const TreeNode = forwardRef<HTMLLIElement | null, TreeNodeProps>((props, ref) => {
  const {
    prefixCls = treePrefix,
    role = _role,
    className,
    data: node,
    expanded = false,
    checked = false,
    semiChecked = false,
    selected = false,
    loading = false,
    focused = false,
    // custom switcher
    collapsedIcon: collapseIconProp = defaultCollapseIcon,
    expandedIcon: expandIconProp = defaultExpandIcon,
    leafIcon: leafIconProp = defaultLeafIcon,
    ...rest
  } = props
  const {
    draggable = false,
    checkable = false,
    checkOnSelect,
    onSelect,
    onExpand,
    onFocus,
    onContextMenu,
    dragNodeRef,
    onDragStart: onDragStartContext,
    onDragEnd: onDragEndContext,
    onDragOver: onDragOverContext,
    onDrop: onDropContext,
    onDragLeave: onDragLeaveContext,
    onLoadChildren,
    onCheck,
    showLine,
    titleRender,
    iconRender,
    collapsedIcon: collapseIconContext,
    expandedIcon: expandIconContext,
    leafIcon: leafIconContext,
    expandOnSelect,
  } = useTreeContext()

  const collapsedIcon = collapseIconContext || collapseIconProp
  const expandedIcon = expandIconContext || expandIconProp
  const leafIcon = leafIconContext || leafIconProp

  const { disabled, isLeaf } = node
  const enableDraggable = draggable && !disabled

  const eventNodeRef = useLatestRef(
    getTreeNodeEventData(node, {
      expanded,
      checked,
      semiChecked,
      selected,
      loading,
      focused,
    })
  )

  const [isDragging, setIsDragging] = useState(false)
  const [direction, setDirection] = useState<TreeNodeDragDirection>(null)

  const treeNodeTitleRef = useRef<HTMLDivElement>(null)

  // 拖拽管理
  const onDragStartContextLatest = useLatestCallback(onDragStartContext)
  const onDragStart = useCallback(
    (evt: React.DragEvent) => {
      if (!enableDraggable) return

      const { id } = eventNodeRef.current

      // 清空数据，下面会重新设置
      evt.dataTransfer.clearData()
      evt.stopPropagation()

      setIsDragging(true)
      dragNodeRef.current = eventNodeRef.current
      evt.dataTransfer.setData('treeNode', JSON.stringify({ sourceId: id }))

      onDragStartContextLatest(evt, { dragNode: eventNodeRef.current })
    },
    [onDragStartContextLatest, enableDraggable, eventNodeRef, dragNodeRef]
  )

  const onDragEndContextLatest = useLatestCallback(onDragEndContext)
  const onDragEnd = useCallback(
    (evt: React.DragEvent) => {
      evt.preventDefault()
      evt.stopPropagation()
      // issue: https://github.com/XiaoMi/hiui/issues/2941
      // 在firefox中拖拽结束后，清除数据会报错，Modifications are not allowed for this document，所以这里注释掉
      // evt.dataTransfer.clearData()
      dragNodeRef.current = null
      setDirection(null)
      setIsDragging(false)

      onDragEndContextLatest(evt, { dragNode: eventNodeRef.current })
    },
    [onDragEndContextLatest, eventNodeRef, dragNodeRef]
  )

  const onDragLeaveContextLatest = useLatestCallback(onDragLeaveContext)
  const onDragLeave = useCallback(
    (evt: React.DragEvent) => {
      evt.preventDefault()
      evt.stopPropagation()
      setDirection(null)
      onDragLeaveContextLatest(evt, {
        // dragNode: dragNodeRef.current,
        dropNode: eventNodeRef.current,
      })
    },
    [onDragLeaveContextLatest, eventNodeRef]
  )

  // 拖至到目标元素上时触发事件
  const onDragOverContextLatest = useLatestCallback(onDragOverContext)
  const onDragOver = useCallback(
    (evt: React.DragEvent) => {
      const dragNode = dragNodeRef.current
      if (!dragNode) return

      evt.preventDefault()
      evt.stopPropagation()

      const dragId = dragNode.id

      // 这里需要考虑3点：
      // 1. 拖到自己的老位置，不处理 TODO
      // 2. 父树不能拖到其子树内
      // 3. 同层可以拖拽进行排序
      if (dragId !== node.id) {
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

      onDragOverContextLatest(evt, { dropNode: eventNodeRef.current })
    },
    [onDragOverContextLatest, eventNodeRef, dragNodeRef, node.id]
  )

  // 放置目标元素时触发事件
  const onDropContextLatestRef = useLatestRef(onDropContext)

  const onDrop = useCallback(
    (evt: React.DragEvent) => {
      const dragNode = dragNodeRef.current
      if (!dragNode) return

      const dragId = dragNode.id

      evt.preventDefault()
      evt.stopPropagation()
      setDirection(null)

      const targetId = eventNodeRef.current.id
      const onDropContext = onDropContextLatestRef.current

      if (onDropContext && dragId !== targetId) {
        try {
          const { sourceId } = JSON.parse(evt.dataTransfer.getData('treeNode'))

          onDropContext(evt, sourceId, targetId, direction)
        } catch (error) {
          console.error(error)
        }
      }
    },
    [onDropContextLatestRef, direction, eventNodeRef, dragNodeRef]
  )

  const onNodeExpand = async (evt: React.MouseEvent) => {
    // 避免触发 title 点击事件，选中
    evt.stopPropagation()
    if (loading) return

    onExpand?.(eventNodeRef.current, !expanded)
  }

  const renderTitle = useCallback(
    (node: TreeNodeEventData, titleRender?: (node: TreeNodeEventData) => React.ReactNode) => {
      // 如果 titleRender 返回 `true`，则使用默认 title
      const title = titleRender ? titleRender(node) : true

      return (
        <div ref={treeNodeTitleRef} className={`${prefixCls}__title`}>
          {title === true ? (
            <span className={`${prefixCls}__title-text`}>{node.title}</span>
          ) : (
            title
          )}
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
    focused && `${prefixCls}--focused`,
    selected && `${prefixCls}--selected`,
    disabled && `${prefixCls}--disabled`,
    checked && `${prefixCls}--checkbox-checked`,
    semiChecked && `${prefixCls}--checkbox-indeterminate`,
    loading && `${prefixCls}--loading`,
    isLeaf && `${prefixCls}--leaf`,
    !isLeaf && `${prefixCls}--${expanded ? 'open' : 'closed'}`
  )

  return (
    <li ref={ref} role={role} className={cls} {...rest}>
      <div
        className={cx(`${prefixCls}__wrap`, isDragging && 'dragging')}
        draggable={enableDraggable}
        onDragStart={enableDraggable ? onDragStart : undefined}
        onDragEnd={enableDraggable ? onDragEnd : undefined}
        onDragLeave={enableDraggable ? onDragLeave : undefined}
        onDragOver={enableDraggable ? onDragOver : undefined}
        onDrop={enableDraggable ? onDrop : undefined}
        onContextMenu={
          onContextMenu ? (evt) => onContextMenu(evt, eventNodeRef.current) : undefined
        }
        tabIndex={0}
        onFocus={() => onFocus?.(eventNodeRef.current)}
        onClick={(evt) => {
          onSelect?.(eventNodeRef.current)
          if (checkOnSelect) {
            onCheck?.(eventNodeRef.current, !checked)
          }
          if (expandOnSelect) {
            onNodeExpand(evt).catch(console.error)
          }
        }}
      >
        {renderIndent(prefixCls, node)}

        {renderSwitcher(
          eventNodeRef.current,
          prefixCls,
          loading,
          expanded,
          expandedIcon,
          collapsedIcon,
          leafIcon,
          onNodeExpand,
          onLoadChildren,
          iconRender
        )}

        {renderCheckbox(
          eventNodeRef.current,
          checkable,
          prefixCls,
          disabled,
          checked,
          semiChecked,
          onCheck
        )}

        {renderTitle(eventNodeRef.current, titleRender)}
      </div>
    </li>
  )
})

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
   * 该节点是否被单选
   */
  selected?: boolean
  /**
   * 该节点是否被展开
   */
  expanded?: boolean
  /**
   * 表示该节点被复选
   */
  checked?: boolean
  /**
   * 表示该节点被半选
   */
  semiChecked?: boolean
  /**
   * 节点收起时的默认图标
   */
  collapsedIcon?: React.ReactNode
  /**
   * 节点展开时的默认图标
   */
  expandedIcon?: React.ReactNode
  /**
   * 叶子结点的默认图标
   */
  leafIcon?: React.ReactNode
  /**
   * 该节点加载中状态
   */
  loading?: boolean
  /**
   * 该节点被 focus
   */
  focused?: boolean
}

if (__DEV__) {
  TreeNode.displayName = 'TreeNode'
}

/**
 * 渲染空白占位
 */
const renderIndent = (prefixCls: string, node: FlattedTreeNodeData) => {
  const { id, depth } = node
  const siblings = getNodeSiblings(node)

  const isSiblingLast = siblings && siblings[siblings.length - 1].id === id

  return times(depth, (index: number) => {
    const isDepthLast = depth === index + 1
    return (
      <span key={index} style={{ alignSelf: 'stretch' }}>
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
  node: TreeNodeEventData,
  checkable: boolean,
  prefixCls: string,
  disabled?: boolean,
  checked?: boolean,
  semiChecked?: boolean,
  onCheck?: (checkedNode: TreeNodeEventData, checked: boolean) => void
) => {
  return checkable ? (
    <Checkbox
      indeterminate={semiChecked}
      checked={checked}
      disabled={disabled}
      tabIndex={-1}
      onClick={(evt) => evt.stopPropagation()}
      onChange={() => {
        onCheck?.(node, !checked)
      }}
      className={`${prefixCls}__checkbox`}
    />
  ) : null
}

/**
 * 渲染子树折叠切换器
 */
const renderSwitcher = (
  node: TreeNodeEventData,
  prefixCls: string,
  loading: boolean,
  expanded: boolean,
  expandedIcon: React.ReactNode,
  collapsedIcon: React.ReactNode,
  leafIcon: React.ReactNode,
  onNodeExpand: (evt: React.MouseEvent) => Promise<void>,
  onLoadChildren?: (node: TreeNodeEventData) => void | Promise<any>,
  iconRender?: (node: TreeNodeEventData) => React.ReactNode
) => {
  if (iconRender) {
    return (
      <IconButton
        tabIndex={-1}
        className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--noop`)}
        icon={iconRender(node)}
      />
    )
  }

  if (loading) {
    return (
      <IconButton
        tabIndex={-1}
        className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--loading`)}
        icon={defaultLoadingIcon}
      />
    )
  }

  const hasChildren = node.children && node.children.length > 0
  const canLoadChildren = onLoadChildren && !node.children && !node.isLeaf

  if (hasChildren || canLoadChildren) {
    return (
      <IconButton
        tabIndex={-1}
        className={cx(
          `${prefixCls}__switcher`,
          expanded ? `${prefixCls}__switcher--expanded` : `${prefixCls}__switcher--collapse`
        )}
        icon={expanded ? expandedIcon : collapsedIcon}
        onClick={onNodeExpand}
      />
    )
  }

  return (
    <IconButton
      tabIndex={-1}
      icon={leafIcon}
      className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--noop`)}
    />
  )
}
