---
to: <%= h.uiDir(`${name}/src/${h.camelCase(name)}.tsx`) %>
---
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = '<%= name %>'
const _prefixCls = getPrefixCls(_role)

/**
* What is <%= h.camelCase(name) %>
*/
export const <%= h.camelCase(name) %> = forwardRef<HTMLDivElement | null, <%= h.camelCase(name) %>Props>(
  (
    {
      prefixCls = _prefixCls,
      role = _role,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {children}
      </div>
    )
  }
)

export interface <%= h.camelCase(name) %>Props {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的根选择器类
   */
  className?: string
  /**
   * 组件的根样式
   */
  style?: React.CSSProperties
}

if (__DEV__) {
  <%= h.camelCase(name) %>.displayName = '<%= h.camelCase(name) %>'
}
