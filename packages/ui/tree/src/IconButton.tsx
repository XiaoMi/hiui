import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'icon-button'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is IconButton
 *
 * TODO: 移送到 button，拆分出一个子组件，专门用于把 icon 当按钮的场景
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
  onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void
  icon: React.ReactNode
  active?: boolean
}
