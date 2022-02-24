import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const DESCRIPTIONS_PREFIX = getPrefixCls('descriptions')

/**
 * TODO: What is Descriptions
 */
export const Descriptions = forwardRef<HTMLDivElement | null, DescriptionsProps>(
  (
    { prefixCls = DESCRIPTIONS_PREFIX, role = 'descriptions', className, children, ...rest },
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

export interface DescriptionsProps extends HiBaseHTMLProps<'div'> {}

if (__DEV__) {
  Descriptions.displayName = 'Descriptions'
}
