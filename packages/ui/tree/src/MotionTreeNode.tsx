import React, { forwardRef, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TreeNode } from './TreeNode'
import { ANIMATION_KEY } from './hooks'
import CSSTransition from 'react-transition-group/CSSTransition'
import { times } from '@hi-ui/times'

const _role = 'tree-node'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is MotionTreeNode
 */
export const MotionTreeNode = forwardRef<HTMLLIElement | null, MotionTreeNodeProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      data,
      onMotionEnd,
      style,
      isExpanded,
      isChecked,
      isSemiChecked,
      overscanCount,
      ...rest
    },
    ref
  ) => {
    // 根据 type 控制显隐过渡动画
    const { id, children, type } = data
    const isMotion = id === ANIMATION_KEY
    const isHide = isMotion && type === 'hide'
    const isShow = isMotion && type === 'show'

    const motionNodeRef = useRef<HTMLLIElement>(null)

    const [visible, setVisible] = useState(isHide)
    const [height, setHeight] = useState<number | undefined>()

    React.useEffect(() => {
      if (isHide && visible) {
        setVisible(false)
      } else if (isShow && !visible) {
        setVisible(true)
      }
    }, [isHide, isShow, visible])
    // console.log(motionCount)

    // 使用一个 dom 包裹，给过渡的列表集合体添加过渡动画
    if (id === ANIMATION_KEY) {
      const motionCount = Math.min(children.length, overscanCount ?? children.length)

      return (
        <CSSTransition
          classNames={`${prefixCls}__motion`}
          in={visible}
          unmountOnExit
          timeout={320}
          // 0 => scrollHeight
          onEnter={() => {
            setHeight(0)
          }}
          onEntering={() => {
            const nextHeight = motionNodeRef.current?.scrollHeight ?? 0
            setHeight(nextHeight)
          }}
          onEntered={onMotionEnd}
          style={{ height: height }}
          // scrollHeight => 0
          onExit={() => {
            const nextHeight = motionNodeRef.current?.scrollHeight ?? 0
            setHeight(nextHeight)
          }}
          onExiting={() => {
            setHeight(0)
          }}
          onExited={onMotionEnd}
        >
          <div ref={motionNodeRef} className={'motion-tree-node'}>
            {times(motionCount, (index) => {
              const treeNode = children[index]
              // TODO:优化在一个地方统一处理或者缓存，不然会执行多次

              return (
                <TreeNode
                  key={treeNode.id}
                  ref={ref}
                  className={className}
                  data={treeNode}
                  // 需要赋予以下必要的值，用于过渡动画时也能正确展示一些状态
                  expanded={isExpanded(treeNode.id)}
                  checked={isChecked(treeNode.id)}
                  semiChecked={isSemiChecked(treeNode.id)}
                  {...rest}
                />
              )
            })}
          </div>
        </CSSTransition>
      )
    }

    return (
      <TreeNode
        ref={ref}
        className={className}
        data={data}
        style={style}
        expanded={isExpanded(id)}
        checked={isChecked(id)}
        semiChecked={isSemiChecked(id)}
        {...rest}
      />
    )
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
  onMotionEnd?: any
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
