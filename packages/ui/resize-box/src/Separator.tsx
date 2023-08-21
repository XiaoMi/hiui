import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { DragDotOutlined } from '@hi-ui/icons'

const SEPARATOR_PREFIX = getPrefixCls('resize-box-separator')

export const Separator = forwardRef<HTMLDivElement | null, SeparatorProps>(
  (
    { prefixCls = SEPARATOR_PREFIX, role = 'resize-box-separator', className, children, ...rest },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <DragDotOutlined className={prefixCls + '-icon'} />
      </div>
    )
  }
)

export interface SeparatorProps extends HiBaseHTMLProps<'div'> {}

if (__DEV__) {
  Separator.displayName = 'SEPARATOR'
}
