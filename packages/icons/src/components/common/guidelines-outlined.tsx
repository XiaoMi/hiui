
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-guidelines-outlined')

export const GuidelinesOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6507"  ><path d="M270.997333 170.666667a42.666667 42.666667 0 0 0-42.666666 42.666666v597.333334a42.666667 42.666667 0 0 0 42.666666 42.666666h192a42.666667 42.666667 0 1 1 0 85.333334h-192a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h469.333334a128 128 0 0 1 128 128v256a42.666667 42.666667 0 1 1-85.333334 0V213.333333a42.666667 42.666667 0 0 0-42.666666-42.666666h-469.333334z" p-id="6508"></path><path d="M356.330667 384a42.666667 42.666667 0 0 1 42.666666-42.666667h213.333334a42.666667 42.666667 0 1 1 0 85.333334h-213.333334a42.666667 42.666667 0 0 1-42.666666-42.666667zM356.330667 512a42.666667 42.666667 0 0 1 42.666666-42.666667h213.333334a42.666667 42.666667 0 1 1 0 85.333334h-213.333334a42.666667 42.666667 0 0 1-42.666666-42.666667zM740.010667 624.021333a38.4 38.4 0 0 1 54.314666 0l90.496 90.496a38.4 38.4 0 0 1 0 54.314667l-0.213333 0.170667-90.282667 90.346666a38.4 38.4 0 0 1-54.314666-54.293333l24.661333-24.704a153.728 153.728 0 0 0-137.386667 106.282667 38.421333 38.421333 0 0 1-73.130666-23.509334c28.970667-90.133333 112-156.117333 210.986666-159.68l-25.130666-25.130666a38.4 38.4 0 0 1 0-54.293334z" p-id="6509"></path></svg>
    )
  }
)

if (__DEV__) {
  GuidelinesOutlined.displayName = 'GuidelinesOutlined'
}
  