
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-forward-outlined')

export const ForwardOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6949"  ><path d="M819.242667 160a38.4 38.4 0 0 1 76.8 0v149.333333a38.4 38.4 0 1 1-76.8 0v-149.333333z" p-id="6950"></path><path d="M708.309333 347.733333a38.4 38.4 0 1 1 0-76.8h149.333334a38.4 38.4 0 1 1 0 76.8h-149.333334z" p-id="6951"></path><path d="M93.909333 512c0-233.28 189.12-422.4 422.4-422.4 143.765333 0 270.72 71.850667 346.965334 181.418667a38.4 38.4 0 0 1-63.04 43.882666C737.706667 225.066667 633.877333 166.4 516.309333 166.4c-190.869333 0-345.6 154.730667-345.6 345.6s154.730667 345.6 345.6 345.6 345.6-154.730667 345.6-345.6a38.4 38.4 0 1 1 76.8 0c0 233.28-189.12 422.4-422.4 422.4s-422.4-189.12-422.4-422.4z" p-id="6952"></path></svg>
    )
  }
)

if (__DEV__) {
  ForwardOutlined.displayName = 'ForwardOutlined'
}
  