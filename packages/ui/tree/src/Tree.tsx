import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { flattenTreeData } from './utils'
import { useExpand } from './hooks'
import { TreeNode } from './TreeNode'

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
      ...rest
    },
    ref
  ) => {
    const flattedData = flattenTreeData(data)
    console.log(flattedData)

    const [expandedNodeIds, onExpandNode] = useExpand(defaultExpandedIds, expandedIds, onExpand)

    const cls = cx(prefixCls, className)

    return (
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
                idx={index}
                // tabIndex={index === defaultFocus ? 0 : -1}
                expanded={expandedNodeIds.includes(node.id)}
              />
            )
          })}
      </ul>
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
}

if (__DEV__) {
  Tree.displayName = 'Tree'
}
