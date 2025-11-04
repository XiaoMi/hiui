import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const SKELETON_PREFIX = getPrefixCls('skeleton')

/**
 * 骨架屏组件，用于页面或区域加载时的占位展示。
 */
export const Skeleton = forwardRef<HTMLDivElement | null, SkeletonProps>(
  (
    {
      prefixCls = SKELETON_PREFIX,
      role = 'skeleton',
      className,
      children,
      visible = true,
      type = 'text',
      animation = 'none',
      size = 'md',
      width,
      height,
      ...rest
    },
    ref
  ) => {
    const cls = cx(
      prefixCls,
      className,
      type && `${prefixCls}--type-${type}`,
      animation && `${prefixCls}--animation-${animation}`,
      size && `${prefixCls}--size-${size}`
    )
    const { style, ...restProps } = rest
    // 如果不在加载状态，直接渲染子元素
    if (!visible) return <>{children}</>

    return (
      <div
        ref={ref}
        role={role}
        className={cls}
        style={{ width, height, ...style }}
        {...restProps}
      ></div>
    )
  }
)

export interface SkeletonProps extends HiBaseHTMLProps<'div'> {
  /**
   * 加载状态，控制骨架屏的显示与隐藏
   */
  visible?: boolean
  /**
   * 类型，支持文本、头像、图片、图标四种类型
   */
  type?: 'text' | 'avatar' | 'image' | 'icon'
  /**
   * 动画，控制骨架屏的动画效果
   */
  animation?: 'pulse' | 'wave' | 'none'
  /**
   * 尺寸，支持三种预设尺寸
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 宽度，支持自定义宽度
   */
  width?: string | number
  /**
   * 高度，支持自定义高度
   */
  height?: string | number
}

if (__DEV__) {
  Skeleton.displayName = 'Skeleton'
}
