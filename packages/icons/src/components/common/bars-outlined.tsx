
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-bars-outlined')

export const BarsOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M896 789.333333a42.666667 42.666667 0 1 1 0 85.333334H128a42.666667 42.666667 0 1 1 0-85.333334h768z m0-320a42.666667 42.666667 0 1 1 0 85.333334H128a42.666667 42.666667 0 1 1 0-85.333334h768z m0-320a42.666667 42.666667 0 1 1 0 85.333334H128a42.666667 42.666667 0 1 1 0-85.333334h768z" p-id="39145"></path></svg>
    )
  }
)

if (__DEV__) {
  BarsOutlined.displayName = 'BarsOutlined'
}
  