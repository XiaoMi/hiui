
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-bars-outlined')

export const BarsOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15893"  ><path d="M896 789.333333a42.666667 42.666667 0 1 1 0 85.333334H298.666667a42.666667 42.666667 0 1 1 0-85.333334h597.333333z m0-320a42.666667 42.666667 0 1 1 0 85.333334H298.666667a42.666667 42.666667 0 1 1 0-85.333334h597.333333z m0-320a42.666667 42.666667 0 1 1 0 85.333334H298.666667a42.666667 42.666667 0 1 1 0-85.333334h597.333333zM128 789.333333a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z m0-320a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334zM128 149.333333a42.666667 42.666667 0 1 1 0 85.333334 42.666667 42.666667 0 0 1 0-85.333334z" p-id="15894"></path></svg>
    )
  }
)

if (__DEV__) {
  BarsOutlined.displayName = 'BarsOutlined'
}
  