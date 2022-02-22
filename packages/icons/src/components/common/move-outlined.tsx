
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-move-outlined')

export const MoveOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13916"  ><path d="M917.333333 746.666667a42.666667 42.666667 0 1 1 0 85.333333H106.666667a42.666667 42.666667 0 1 1 0-85.333333h810.666666z m0-277.333334a42.666667 42.666667 0 1 1 0 85.333334H106.666667a42.666667 42.666667 0 1 1 0-85.333334h810.666666z m0-277.333333a42.666667 42.666667 0 1 1 0 85.333333H106.666667a42.666667 42.666667 0 1 1 0-85.333333h810.666666z" p-id="13917"></path></svg>
    )
  }
)

if (__DEV__) {
  MoveOutlined.displayName = 'MoveOutlined'
}
  