import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'radio'
const _prefix = getPrefixCls(_role)

/**
* TODO: What is Radio
*/
export const Radio = forwardRef<HTMLDivElement | null, RadioProps>(
  (
    {
      prefixCls = _prefix,
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

export interface RadioProps extends HiBaseHTMLProps<'div'> {

}

if (__DEV__) {
  Radio.displayName = 'Radio'
}
