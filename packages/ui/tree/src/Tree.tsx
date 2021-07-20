import React, { forwardRef, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { flattenTreeData } from './utils'
import { useExpand, useSelect, useTreeDragDrop, useTreeDrop } from './hooks'
import { TreeNodeData } from './TreeNode'
import { TreeProvider } from './context'
import { MotionTreeNode } from './MotionTreeNode'
import { useDataCache } from './hooks/index'

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
      onDragOver,
      onLoadChildren,
      ...rest
    },
    ref
  ) => {
    // TODO: 考虑是否要做成 value-onChange 的受控模式
    // 目前修改来源有拖拽、编辑，通过回调函数的返回布尔值来进行是否内部以非受控模式更新 data
    // 在这种模式，当外部 data 一旦改变，内部的非受控状态 data 的所有改变都可能会被抹除
    const [treeData, setTreeData] = useDataCache(data)

    const flattedData: TreeNodeData[] = useMemo(() => flattenTreeData(treeData), [treeData])

    const disabledSelect = disabled || !selectable
    const [selectedNodeId, trySelectNode] = useSelect(
      defaultSelectedId,
      selectedId,
      onSelect,
      disabledSelect
    )

    const [transitionData, onNodeToggleStart, onNodeToggleEnd, checkIfExpanded] = useExpand(
      flattedData,
      defaultExpandedIds,
      expandedIds,
      onExpand
    )

    const dropTree = useTreeDrop(treeData, flattedData, onDrop, onDropEnd)

    // const dragDropTree =  useTreeDragDrop({
    //   onDragStart,
    //   onDragEnd,
    //   onDragOver,
    //   onDrop,
    // })

    const cls = cx(prefixCls, className)

    const providedValue = useMemo(
      () => ({
        selectedId: selectedNodeId,
        onSelect: trySelectNode,
        onExpand: onNodeToggleStart,
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
        onNodeToggleStart,
        draggable,
        disabled,
        onDragStart,
        onDragEnd,
        dropTree,
        onLoadChildren,
      ]
    )

    console.log('selectedNodeId', selectedNodeId)
    console.log(transitionData, flattedData)

    return (
      <TreeProvider value={providedValue}>
        <ul ref={ref} role={role} className={cls} {...rest}>
          {transitionData.map((node, index) => {
            return (
              <MotionTreeNode
                // idx={index}
                // tabIndex={index === defaultFocus ? 0 : -1}
                key={node.id}
                data={node}
                onMotionEnd={onNodeToggleEnd}
                expanded={checkIfExpanded(node.id)}
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
  data: TreeNodeData[]
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
  onExpand?: (expandIds: React.ReactText[], expandedNode: TreeNodeData, expanded: boolean) => void
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
  onSelect?: (selectedId: React.ReactText | null, selectedNode: TreeNodeData | null) => void
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
