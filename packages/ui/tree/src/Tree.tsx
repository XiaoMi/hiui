import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { flattenTreeData } from './utils'
import { useExpand, useSingleSelect } from './hooks'
import { TreeNode, TreeNodeData } from './TreeNode'
import { TreeProvider } from './context'

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
      ...rest
    },
    ref
  ) => {
    const flattedData: TreeNodeData[] = flattenTreeData(data)

    const [selectedNodeId, trySelectNode] = useSingleSelect(
      defaultSelectedId,
      selectedId,
      onSelect,
      !selectable
    )

    const [expandedNodeIds, tryToggleExpandNode] = useExpand(
      defaultExpandedIds,
      expandedIds,
      onExpand
    )

    const cls = cx(prefixCls, className)

    const providedValue = useMemo(
      () => ({
        selectedId: selectedNodeId,
        onSelect: trySelectNode,
      }),
      [selectedNodeId, trySelectNode]
    )

    console.log('selectedNodeId', selectedNodeId)

    return (
      <TreeProvider value={providedValue}>
        <ul ref={ref} role={role} className={cls} {...rest}>
          {flattedData
            // .filter((node) => {
            //   const ancestors = node.ancestors || []
            //   return ancestors.every((ancestor) => expandedNodeIds.includes(ancestor.id))
            // })
            .map((node, index) => {
              return (
                <TreeNode
                  key={node.id}
                  data={node}
                  // idx={index}
                  // tabIndex={index === defaultFocus ? 0 : -1}
                  // expanded={expandedNodeIds.includes(node.id)}
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
  data?: TreeNodeData
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
}

if (__DEV__) {
  Tree.displayName = 'Tree'
}
