
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-arrow-right-outlined')

export const ArrowRightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3363"  ><path d="M623.509333 250.176a38.4 38.4 0 0 1 54.314667 0L897.408 469.76a59.733333 59.733333 0 0 1 0 84.48L677.781333 773.802667a38.4 38.4 0 1 1-54.272-54.272l169.109334-169.130667H147.584a38.4 38.4 0 1 1 0-76.8h645.034667l-169.109334-169.130667a38.4 38.4 0 0 1 0-54.293333z" p-id="3364"></path></svg>
    )
  }
)

if (__DEV__) {
  ArrowRightOutlined.displayName = 'ArrowRightOutlined'
}
  