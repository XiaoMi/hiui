import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const CONTENT_PREFIX = getPrefixCls('content')

/**
 * 内容区域组件
 */
export const Content = forwardRef<HTMLDivElement | null, ContentProps>(
  ({ prefixCls = CONTENT_PREFIX, role = 'content', className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {children}
      </div>
    )
  }
)

export interface ContentProps extends HiBaseHTMLProps<'div'> {}

if (__DEV__) {
  Content.displayName = 'Content'
}
