import React, { Children, forwardRef } from 'react'
import { cx, getPrefixCls, getPrefixStyleVar } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, GlobalConfig } from '@hi-ui/core'
import { isString } from '@hi-ui/type-assertion'

const _prefix = getPrefixCls('icon-button')

/**
 * 专门用于把 icon 当按钮的场景，和 Button 的边界区分如下：
 *
 * 1. IconButton 要求尺寸上是 svg 的原始尺寸，而不是 Button 的大尺寸，不占文档流空间
 * 2. 带有点击区域放大的功能，不占文档流空间
 * 3. 样式上也是 svg 的样式，不带任何修饰，hover | focus 后是圆型的态，也不占文档流空间
 */
export const IconButton = forwardRef<HTMLButtonElement | null, IconButtonProps>(
  (
    {
      prefixCls: prefixClsProp,
      role = 'icon-button',
      className,
      children,
      icon,
      active = false,
      virtualArea = true,
      effect = false,
      disabled = false,
      effectColor,
      ...rest
    },
    ref
  ) => {
    const globalPrefixCls = GlobalConfig.prefixCls
    const prefixCls =
      prefixClsProp || (globalPrefixCls && getPrefixCls('icon-button', globalPrefixCls)) || _prefix
    const cls = cx(
      prefixCls,
      className,
      disabled && `${prefixCls}--disabled`,
      active && `${prefixCls}--active`,
      virtualArea && `${prefixCls}--virtual-area`,
      !disabled && effect && `${prefixCls}--effect`
    )
    return (
      <button
        ref={ref}
        role={role}
        className={cls}
        {...rest}
        style={{
          ...rest.style,
          ...(effectColor ? { [getPrefixStyleVar('icon-button-effect-color')]: effectColor } : {}),
        }}
      >
        {isString(icon) ? icon : Children.only(icon)}
      </button>
    )
  }
)

export interface IconButtonProps extends HiBaseHTMLProps<'button'> {
  /**
   * icon 图标
   */
  icon: React.ReactNode
  /**
   * 是否被激活
   */
  active?: boolean
  /**
   * 扩大点击区域
   */
  virtualArea?: boolean
  /**
   * 是否开启 hover  和 focus 展示底色变化效果
   */
  effect?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 鼠标悬浮时的颜色
   */
  effectColor?: string
}

if (__DEV__) {
  IconButton.displayName = 'IconButton'
}
