
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-left-right-outlined')

export const LeftRightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7263"  ><path d="M264.832 567.168a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709334L230.997333 661.333333H853.333333a42.666667 42.666667 0 1 1 0 85.333334H231.018667l33.813333 33.834666a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-106.666666-106.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 106.666666-106.666667a42.666667 42.666667 0 0 1 60.330667 0z m451.669333-384a42.666667 42.666667 0 0 1 60.330667 0l106.666667 106.666667 2.496 2.709333a42.666667 42.666667 0 0 1-2.496 57.621333l-106.666667 106.666667-2.709333 2.496a42.666667 42.666667 0 0 1-57.621334-2.496l-2.496-2.709333a42.666667 42.666667 0 0 1 2.496-57.621334L750.293333 362.666667H128a42.666667 42.666667 0 1 1 0-85.333334h622.336l-33.834667-33.834666-2.496-2.709334a42.666667 42.666667 0 0 1 2.496-57.621333z" p-id="7264"></path></svg>
    )
  }
)

if (__DEV__) {
  LeftRightOutlined.displayName = 'LeftRightOutlined'
}
  