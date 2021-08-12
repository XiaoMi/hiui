import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'cascader-menu'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is CascaderMenu
 */
export const CascaderMenu = forwardRef<HTMLDivElement | null, CascaderMenuProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      overlayClassName,
      data: options,
      expandTrigger = 'click',
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, overlayClassName, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {options.map((option) => {
          return null
        })}
        eqeqwe
      </div>
    )
  }
)

export interface CascaderMenuProps {
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
  CascaderMenu.displayName = 'CascaderMenu'
}
