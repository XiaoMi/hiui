import React, { Children, forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const ICON_BUTTON_PREFIX = getPrefixCls('icon-button')

/**
 * TODO: What is IconButton
 */
export const IconButton = forwardRef<HTMLButtonElement | null, IconButtonProps>(
  (
    {
      prefixCls = ICON_BUTTON_PREFIX,
      role = 'icon-button',
      className,
      children,
      icon,
      active = false,
      areaExpand = true,
      ...rest
    },
    ref
  ) => {
    const cls = cx(
      prefixCls,
      className,
      active && `${prefixCls}--active`,
      areaExpand && `${prefixCls}--area-expand`
    )
    return (
      <button ref={ref} role={role} className={cls} {...rest}>
        {Children.only(icon)}
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
  areaExpand?: boolean
}

if (__DEV__) {
  IconButton.displayName = 'IconButton'
}
