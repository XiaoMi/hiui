import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'time-picker'
const _prefix = getPrefixCls(_role)

/**
* TODO: What is TimePicker
*/
export const TimePicker = forwardRef<HTMLDivElement | null, TimePickerProps>(
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

export interface TimePickerProps extends HiBaseHTMLProps<'div'> {

}

if (__DEV__) {
  TimePicker.displayName = 'TimePicker'
}
