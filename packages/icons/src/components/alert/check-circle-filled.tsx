
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-check-circle-filled')

export const CheckCircleFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m164.544 266.005334l-2.709333 2.496L448 579.626667l-97.834667-97.813334a42.666667 42.666667 0 0 0-57.621333-2.496l-2.709333 2.496a42.666667 42.666667 0 0 0-2.496 57.621334l2.496 2.709333 128 128a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496 256-256a42.666667 42.666667 0 0 0-57.621333-62.826667z" p-id="47601"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckCircleFilled.displayName = 'CheckCircleFilled'
}
  