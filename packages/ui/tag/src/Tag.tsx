import React, { forwardRef, useMemo, MouseEvent } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'tag'
const _prefix = getPrefixCls(_role)

/**
 * 标签 用来标记信息的属性，用以区分信息
 */
export const Tag = forwardRef<HTMLDivElement | null, TagProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      style,
      color,
      type = 'primary',
      appearance = 'default',
      shape = 'round',
      onClick,
    },
    ref
  ) => {
    // 根容器样式
    // 如果 color 存在则注入
    const rootStyle = useMemo(() => {
      const result = { ...style }

      if (color) {
        result.borderColor = color
        if (appearance === 'default') {
          result.background = color
        } else {
          result.color = color
        }
      }

      return result
    }, [color, style, appearance])

    const rootClassName = useMemo(
      () =>
        cx(
          prefixCls,
          className,
          `${prefixCls}--type-${type}`,
          `${prefixCls}--appearance-${appearance}`,
          `${prefixCls}--shape-${shape}`
        ),
      [prefixCls, className, type, appearance, shape]
    )

    return (
      <div ref={ref} role={role} className={rootClassName} style={rootStyle} onClick={onClick}>
        {children}
      </div>
    )
  }
)

export interface TagProps {
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
   * 类型状态
   */
  type?: 'primary' | 'success' | 'warning' | 'danger'
  /**
   * 外观
   */
  appearance?: 'default' | 'line'
  /**
   * 形状
   */
  shape?: 'round' | 'square'
  /**
   * 标签背景色
   */
  color?: string
  /**
   * 点击标签内容时的回调
   */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void

  children?: React.ReactNode
  /**
   * 是否展示可关闭按钮
   */
  closeable?: boolean
  /**
   * 是否可编辑
   */
  editable?: boolean
}

if (__DEV__) {
  Tag.displayName = 'Tag'
}
