
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-smile-outlined')

export const SmileOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6358"  ><path d="M586.666667 437.333333a53.333333 53.333333 0 1 1 106.666666 0 53.333333 53.333333 0 0 1-106.666666 0zM330.666667 437.333333a53.333333 53.333333 0 1 1 106.666666 0 53.333333 53.333333 0 0 1-106.666666 0z" p-id="6359"></path><path d="M868.266667 512c0-196.757333-159.509333-356.266667-356.266667-356.266667-196.757333 0-356.266667 159.509333-356.266667 356.266667 0 196.757333 159.509333 356.266667 356.266667 356.266667 196.757333 0 356.266667-159.509333 356.266667-356.266667z m76.8 0c0 239.168-193.898667 433.066667-433.066667 433.066667S78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333 945.066667 272.853333 945.066667 512z" p-id="6360"></path><path d="M608.298667 575.68a38.4 38.4 0 1 1 63.402666 43.306667C637.781333 668.672 574.08 699.733333 512 699.733333c-62.08 0-125.781333-31.061333-159.701333-80.746666a38.4 38.4 0 1 1 63.402666-43.306667C433.941333 602.410667 472.768 622.933333 512 622.933333c39.232 0 78.058667-20.522667 96.298667-47.253333z" p-id="6361"></path></svg>
    )
  }
)

if (__DEV__) {
  SmileOutlined.displayName = 'SmileOutlined'
}
  