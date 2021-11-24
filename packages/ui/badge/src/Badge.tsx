import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'badge'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Badge
 */
export const Badge = forwardRef<HTMLDivElement | null, BadgeProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      type,
      max,
      offset,
      content,
      color,
      visible,
      style,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const _style = {
      backgroundColor: color,
      marginTop: offset ? offset[1] : 0,
      marginRight: -(offset ? offset[0] : 0),
    }
    const badgeNode =
      type === 'dot' ? (
        <span className={`${prefixCls}-dot`} style={_style} />
      ) : (
        <span className={`${prefixCls}-value`} style={_style}>
          {typeof content === 'number' && max !== undefined
            ? content > max
              ? max + '+'
              : content
            : content}
        </span>
      )

    return (
      <div ref={ref} role={role} className={cls} style={style}>
        {children}
        {visible ? badgeNode : null}
      </div>
    )
  }
)

export interface BadgeProps {
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

  type?: 'bubble' | 'dot'
  content?: React.ReactNode
  offset?: [number, number]
  color?: string
  max?: number
  visible?: boolean
}

if (__DEV__) {
  Badge.displayName = 'Badge'
}
