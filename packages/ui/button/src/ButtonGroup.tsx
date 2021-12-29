import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'button'
const _prefix = getPrefixCls(_role)

export const ButtonGroup = forwardRef<any, ButtonGroupProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      style,
    },
    ref
  ) => {

    const cls = cx(`${prefixCls}-group`, className)

    return <div role={role} className={cls} style={style} ref={ref}>{children}</div>
  }
)

export interface ButtonGroupProps {
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
   * 组件的孩子节点
   */
  children?: React.ReactNode
}

if (__DEV__) {
  ButtonGroup.displayName = 'ButtonGroup'
}
