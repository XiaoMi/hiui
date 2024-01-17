import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { LeftOutlined } from '@hi-ui/icons'

const SEPARATOR_PREFIX = getPrefixCls('resize-box-separator')

export const Separator = forwardRef<HTMLDivElement | null, SeparatorProps>(
  (
    {
      prefixCls = SEPARATOR_PREFIX,
      role = 'resize-box-separator',
      className,
      children,
      collapsible,
      collapsed,
      onToggle,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, collapsed && `${prefixCls}--collapsed`)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <span className={`${prefixCls}-content`} />
        {collapsible && (
          <div
            className={cx(`${prefixCls}-toggle`)}
            onClick={() => {
              onToggle?.()
            }}
          >
            <LeftOutlined />
          </div>
        )}
      </div>
    )
  }
)

export interface SeparatorProps extends HiBaseHTMLProps<'div'> {
  /**
   * 可折叠
   */
  collapsible?: boolean
  /**
   * 是否折叠
   */
  collapsed?: boolean
  /**
   * 折叠切换
   */
  onToggle?: () => void
}

if (__DEV__) {
  Separator.displayName = 'SEPARATOR'
}
