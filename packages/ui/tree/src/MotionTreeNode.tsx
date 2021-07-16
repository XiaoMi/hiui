import React, { forwardRef, useCallback, useRef, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TreeNode } from './TreeNode'
import { ANIMATION_KEY } from './hooks'
import CSSTransition from 'react-transition-group/CSSTransition'

const _role = 'tree-node'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is MotionTreeNode
 */
export const MotionTreeNode = forwardRef<HTMLLIElement | null, MotionTreeNodeProps>(
  ({ prefixCls = _prefix, role = _role, className, data, onMotionEnd, ...rest }, ref) => {
    // 根据 type 控制显隐过渡动画
    const { id, children, type } = data
    const isMotion = id === ANIMATION_KEY
    const isHide = isMotion && type === 'hide'
    const isShow = isMotion && type === 'show'

    const motionNodeRef = useRef<HTMLLIElement>(null)

    console.log('in', type, isHide)

    const [visible, setVisible] = useState(isHide)
    const [height, setHeight] = useState<number | undefined>()

    React.useEffect(() => {
      if (isHide && visible) {
        setVisible(false)
      }

      if (isShow && !visible) {
        setVisible(true)
      }
    }, [isHide, isShow, visible])

    // 使用一个 dom 包裹，给列表集合体添加过渡动画
    if (id === ANIMATION_KEY) {
      return (
        <CSSTransition
          classNames={`${prefixCls}__motion`}
          in={visible}
          unmountOnExit
          timeout={320}
          // 0 => scrollHeight
          onEnter={() => {
            console.log('enter', 0)
            setHeight(0)
          }}
          onEntering={() => {
            const nextHeight = motionNodeRef.current?.scrollHeight ?? 0
            console.log('onEntering', nextHeight)
            setHeight(nextHeight)
          }}
          onEntered={onMotionEnd}
          style={{ height: height }}
          // scrollHeight => 0
          onExit={() => {
            const nextHeight = motionNodeRef.current?.scrollHeight ?? 0
            console.log('onExit', nextHeight)
            setHeight(nextHeight)
          }}
          onExiting={() => {
            console.log('onExiting', 0)
            setHeight(0)
          }}
          onExited={onMotionEnd}
        >
          <div ref={motionNodeRef} className={'motion-tree-node'}>
            {children.map((treeNode) => {
              return (
                <TreeNode
                  key={treeNode.id}
                  ref={ref}
                  className={className}
                  data={treeNode}
                  {...rest}
                />
              )
            })}
          </div>
        </CSSTransition>
      )
    }

    return <TreeNode ref={ref} className={className} data={data} {...rest} />
  }
)

export interface MotionTreeNodeProps {
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
  data: MotionTreeNodeData
  expanded?: boolean
}

export interface MotionTreeNodeData {
  id: React.ReactText
  title: React.ReactNode
  children?: MotionTreeNodeData[]
  isLeaf?: boolean
  disabled?: boolean
  depth?: number
  ancestors?: any[]
}

if (__DEV__) {
  MotionTreeNode.displayName = 'MotionTreeNode'
}
