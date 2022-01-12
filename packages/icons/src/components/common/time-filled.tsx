
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-time-filled')

export const TimeFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 170.666667l-3.2 0.106667A42.666667 42.666667 0 0 0 469.333333 298.666667v195.626666l-136.832 136.874667-2.496 2.709333a42.666667 42.666667 0 0 0 62.826667 57.621334l149.333333-149.333334 2.56-2.773333A42.666667 42.666667 0 0 0 554.666667 512V298.666667l-0.106667-3.2A42.666667 42.666667 0 0 0 512 256z" p-id="15461"></path></svg>
    )
  }
)

if (__DEV__) {
  TimeFilled.displayName = 'TimeFilled'
}
  