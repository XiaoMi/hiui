
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-user-add-outlined')

export const UserAddOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M277.333333 896a170.666667 170.666667 0 1 1 0-341.333333h320a42.666667 42.666667 0 1 1 0 85.333333H277.333333a85.333333 85.333333 0 0 0-4.266666 170.56L277.333333 810.666667h320a42.666667 42.666667 0 1 1 0 85.333333H277.333333z m490.666667-341.333333a42.666667 42.666667 0 0 1 42.666667 42.666666v85.333334h85.333333a42.666667 42.666667 0 1 1 0 85.333333h-85.333333v85.333333a42.666667 42.666667 0 1 1-85.333334 0v-85.333333h-85.333333a42.666667 42.666667 0 1 1 0-85.333333h85.333333v-85.333334a42.666667 42.666667 0 0 1 42.666667-42.666666zM512 85.333333c117.824 0 213.333333 95.509333 213.333333 213.333334s-95.509333 213.333333-213.333333 213.333333-213.333333-95.509333-213.333333-213.333333S394.176 85.333333 512 85.333333z m0 85.333334a128 128 0 1 0 0 256 128 128 0 0 0 0-256z" p-id="38635"></path></svg>
    )
  }
)

if (__DEV__) {
  UserAddOutlined.displayName = 'UserAddOutlined'
}
  