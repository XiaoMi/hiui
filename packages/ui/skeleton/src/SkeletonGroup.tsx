import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { SkeletonProps } from './Skeleton'

const _role = 'skeleton-group'
const _prefix = getPrefixCls(_role)

/**
 * 骨架屏组合容器，用于组织多个骨架屏元素，统一控制加载状态和动画效果。
 * 使用 children 作为骨架屏模板，使用 content 作为加载完成后显示的实际内容。
 */
export const SkeletonGroup = forwardRef<HTMLDivElement | null, SkeletonGroupProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      content,
      layout = 'vertical',
      gap,
      loading = true,
      animation,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, `${prefixCls}--layout-${layout}`)

    const { style, ...restProps } = rest

    // 渲染子组件，注入 loading 和 animation props
    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // 如果子组件是 Skeleton 或 SkeletonGroup，注入 props
          const childProps: Partial<SkeletonProps> = {}

          // 注入 loading（如果子组件没有显式设置）
          if (child.props.loading === undefined) {
            childProps.loading = loading
          }

          // 注入 animation（如果父组件设置了 animation 且子组件没有显式设置）
          if (animation !== undefined && child.props.animation === undefined) {
            childProps.animation = animation
          }

          // 如果有需要注入的 props，则克隆组件
          if (Object.keys(childProps).length > 0) {
            return React.cloneElement(child, childProps)
          }
        }
        return child
      })
    }

    // 如果不是 loading 状态，渲染实际内容
    // 如果提供了 content，使用 content；否则使用 children（但会注入 loading='none'）
    if (!loading) {
      // 优先使用 content
      if (content !== undefined) {
        return <>{content}</>
      }
      // 如果没有 content，使用 children（向后兼容），但注入 loading='none'
      return <>{renderChildren()}</>
    }

    // loading 状态下，渲染骨架屏模板（children），并注入 loading=true 和 animation
    return (
      <div ref={ref} role={role} className={cls} style={{ gap, ...style }} {...restProps}>
        {renderChildren()}
      </div>
    )
  }
)

export interface SkeletonGroupProps extends HiBaseHTMLProps<'div'> {
  /**
   * 骨架屏模板，loading 为 true 时显示
   */
  children?: React.ReactNode
  /**
   * 加载完成后显示的实际内容，loading 为 false 时显示
   */
  content?: React.ReactNode
  /**
   * 布局方向
   * @default 'vertical'
   */
  layout?: 'vertical' | 'horizontal'
  /**
   * 子元素间距，可以是数字（px）或字符串（如 '12px', '1rem'）
   */
  gap?: React.CSSProperties['gap']
  /**
   * 加载状态，控制骨架屏与实际内容的切换
   * @default true
   */
  loading?: boolean
  /**
   * 统一设置子组件的动画效果
   */
  animation?: 'pulse' | 'wave' | 'none'
}

if (__DEV__) {
  SkeletonGroup.displayName = 'SkeletonGroup'
}
