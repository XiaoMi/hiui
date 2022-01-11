import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-lightning-outlined')

export const LightningOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg
        className={cls}
        ref={ref}
        role="icon"
        {...rest}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        version="1.1"
      >
        <path
          d="M704 106.666667a85.333333 85.333333 0 0 1 68.266667 136.533333L666.666667 384h134.442666a64 64 0 0 1 44.352 110.122667l-415.36 399.381333A85.333333 85.333333 0 0 1 370.986667 917.333333H341.333333a44.970667 44.970667 0 0 1-42.325333-60.224L384.853333 618.666667h-143.061333a85.333333 85.333333 0 0 1-81.92-109.226667l99.562667-341.333333A85.333333 85.333333 0 0 1 341.333333 106.666667h362.666667z m-182.421333 328.533333L703.978667 192H341.333333l-99.562666 341.333333h234.112a21.333333 21.333333 0 0 1 20.074666 28.565334L413.44 791.146667 748.117333 469.333333h-209.493333a21.333333 21.333333 0 0 1-17.066667-34.133333z"
          p-id="38705"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  LightningOutlined.displayName = 'LightningOutlined'
}
