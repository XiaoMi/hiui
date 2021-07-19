import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { flattenTreeData } from './utils'
import { ANIMATION_KEY, useExpand, useSingleSelect, useTreeDrop } from './hooks'
import { TreeNodeData } from './TreeNode'
import { TreeProvider } from './context'
import { MotionTreeNode } from './MotionTreeNode'

const _role = 'tree'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Tree
 */
export const Tree = forwardRef<HTMLUListElement | null, TreeProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      data,
      expandedIds,
      defaultExpandedIds = [],
      onExpand,
      selectedId,
      defaultSelectedId,
      onSelect,
      selectable = true,
      draggable = false,
      disabled = false,
      onDragStart,
      onDragEnd,
      onDrop,
      onDropEnd,
      onLoadChildren,
      ...rest
    },
    ref
  ) => {
    const flattedData: TreeNodeData[] = useMemo(() => flattenTreeData(data), [data])
    const [prevData, setPrevData] = React.useState(flattedData)

    const [selectedNodeId, trySelectNode] = useSingleSelect(
      defaultSelectedId,
      selectedId,
      onSelect,
      !selectable
    )

    const [
      expandedNodeIds,
      tryToggleNode,
      expandedNodeIdsMp,
      transitionData,
      setTransitionData,
      isExpandingRef,
    ] = useExpand(defaultExpandedIds, expandedIds, onExpand, flattedData)

    const dropTree = useTreeDrop(data, flattedData, onDrop, onDropEnd)

    const cls = cx(prefixCls, className)

    const providedValue = useMemo(
      () => ({
        selectedId: selectedNodeId,
        onSelect: trySelectNode,
        onExpand: tryToggleNode,
        draggable,
        disabled,
        onDragStart,
        onDragEnd,
        onDrop: dropTree,
        onLoadChildren,
      }),
      [
        selectedNodeId,
        trySelectNode,
        tryToggleNode,
        draggable,
        disabled,
        onDragStart,
        onDragEnd,
        dropTree,
        onLoadChildren,
      ]
    )

    console.log('selectedNodeId', selectedNodeId)
    console.log(expandedNodeIdsMp, transitionData, flattedData)

    const onMotionEnd = () => {
      setTransitionData(
        transitionData.reduce((prev, cur) => {
          if (cur.id !== ANIMATION_KEY) {
            prev.push(cur)
            return prev
          }

          if (cur.type === 'show') {
            cur.children.forEach((item) => prev.push(item))
            return prev
          }

          return prev
        }, [])
      )

      // 闭环结束列表展开或收起动画
      isExpandingRef.current = false
    }

    return (
      <TreeProvider value={providedValue}>
        <ul ref={ref} role={role} className={cls} {...rest}>
          {transitionData.map((node, index) => {
            return (
              <MotionTreeNode
                key={node.id}
                data={node}
                onMotionEnd={onMotionEnd}
                // idx={index}
                // tabIndex={index === defaultFocus ? 0 : -1}
                expanded={expandedNodeIdsMp.has(node.id)}
              />
            )
          })}
        </ul>
      </TreeProvider>
    )
  }
)

export interface TreeProps {
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
   * 展示数据
   */
  data?: TreeNodeData[]
  /**
   * 展开的节点
   */
  expandedIds?: string[]
  /**
   * 默认展开的节点
   */
  defaultExpandedIds?: string[]
  /**
   * 节点被点击(展开/收起)时触发
   */
  onExpand?: (expandedNode: TreeNodeData, expanded: boolean, expandIds: string[]) => void
  /**
   * 选中的节点
   */
  selectedId?: string
  /**
   * 默认选中的节点
   */
  defaultSelectedId?: string
  /**
   * 点击节点时触发选中
   */
  onSelect?: (selectedNode: TreeNodeData) => void
  /**
   * 节点是否可选中
   */
  selectable?: boolean
  /**
   * 节点可拖拽
   */
  draggable?: boolean
  /**
   * 是否禁用节点
   */
  disabled?: boolean
  /**
   * 节点开始拖拽时触发
   */
  onDragStart?: (dragNode: TreeNodeData) => void
  /**
   * 节点结束拖拽时触发
   */
  onDragEnd?: (dragNode: TreeNodeData) => void
  /**
   * 节点放开时触发
   */
  onDrop?: (
    dragNode: TreeNodeData,
    dropNode: TreeNodeData,
    data: TreeNodeData[],
    level: number
  ) => boolean
  /**
   * 节点拖拽成功时触发
   */
  onDropEnd?: (dragNode: TreeNodeData, dropNode: TreeNodeData) => void
  /**
   * 点击异步加载子项
   */
  onLoadChildren?: (selectedNode: TreeNodeData) => TreeNodeData
}

if (__DEV__) {
  Tree.displayName = 'Tree'
}
