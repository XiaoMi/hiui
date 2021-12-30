import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'icon-button'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is IconButton
 *
 * TODO: 移送到 button，拆分出一个子组件，专门用于把 icon 当按钮的场景
 * 1. 但是和单独icon的 Button 不一样，这个IconButton要求尺寸上是svg的尺寸，
 * 而不是 Button的大尺寸，并且带有点击区域放大的功能
 * 2. 样式上也是svg的样式，不带任何修饰，hover后是圆型的态，并且也不占文档流空间
 */
export const IconButton = forwardRef<HTMLButtonElement | null, IconButtonProps>(
  ({ prefixCls = _prefix, icon, className, active = false, ...rest }, ref) => {
    const cls = cx(prefixCls, className, active && `${prefixCls}--active`)

    return (
      <button ref={ref} className={cls} {...rest}>
        {icon}
      </button>
    )
  }
)

if (__DEV__) {
  IconButton.displayName = 'IconButton'
}

interface IconButtonProps {
  prefixCls?: string
  className?: string
  style?: React.CSSProperties
  onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void
  icon: React.ReactNode
  active?: boolean
  tabIndex?: number
  onBlur?: (evt: React.FocusEvent) => void
}
