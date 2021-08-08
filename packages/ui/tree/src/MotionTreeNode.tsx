import React, { useRef, useState, useEffect, forwardRef, useCallback } from 'react'
import CSSTransition from 'react-transition-group/CSSTransition'
import { times } from '@hi-ui/times'
import { TreeNode } from './TreeNode'
import { TreeNodeType, MotionTreeNodeData } from './types'
import { __DEV__ } from '@hi-ui/env'
import { useMergeRefs } from '@hi-ui/use-merge-refs'

/**
 * TODO: What is MotionTreeNode
 */
export const MotionTreeNode = forwardRef<HTMLDivElement | null, MotionTreeNodeProps>(
  ({ prefixCls, data, onMotionEnd, overscanCount, getTreeNodeProps }, ref) => {
    const { children: childrenNodes, type } = data

    // 根据 type 控制显隐过渡动画
    const [visible, setVisible] = useState(() => type === TreeNodeType.HIDE)
    const [height, setHeight] = useState<number>()

    useEffect(() => {
      if (visible) {
        if (type === TreeNodeType.HIDE) {
          setVisible(false)
        }
      } else {
        if (type === TreeNodeType.SHOW) {
          setVisible(true)
        }
      }
    }, [visible, type])

    const motionNodeRef = useRef<HTMLDivElement>(null)
    // 0 => scrollHeight
    const open = useCallback(() => {
      const nextHeight = motionNodeRef.current?.scrollHeight || 0
      setHeight(nextHeight)
    }, [])
    // scrollHeight => 0
    const close = useCallback(() => {
      setHeight(0)
    }, [])

    const motionNodeCount = Math.min(childrenNodes.length, overscanCount ?? childrenNodes.length)

    return (
      <CSSTransition
        classNames={`${prefixCls}-motion`}
        style={{ height }}
        in={visible}
        timeout={310}
        unmountOnExit
        onEnter={close}
        onEntering={open}
        onEntered={onMotionEnd}
        onExit={open}
        onExiting={close}
        onExited={onMotionEnd}
      >
        {/* 使用一个 dom 包裹，给过渡的列表集合体添加过渡动画 */}
        <div ref={useMergeRefs(ref, motionNodeRef)} className={`${prefixCls}-motion-node`}>
          {times(motionNodeCount, (index) => {
            const node = childrenNodes[index]
            return <TreeNode key={node.id} data={node} {...getTreeNodeProps(node.id)} />
          })}
        </div>
      </CSSTransition>
    )
  }
)

export interface MotionTreeNodeProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls: string
  /**
   * 树节点过渡数据
   */
  data: MotionTreeNodeData
  /**
   * 在可视区中可展示的树节点个数
   */
  overscanCount: number | undefined
  /**
   * 过渡动画结束后回调
   */
  onMotionEnd: () => void
  /**
   * 获取节点的基础状态 props
   */
  getTreeNodeProps: (
    id: React.ReactText
  ) => {
    expanded: boolean
    checked: boolean
    semiChecked: boolean
    selected: boolean
  }
}

if (__DEV__) {
  MotionTreeNode.displayName = 'MotionTreeNode'
}
