
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-check-circle-outlined')

export const CheckCircleOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="41117"  ><path d="M659.797333 400.021333a38.4 38.4 0 0 1 55.317334 53.290667l-185.386667 192.426667a81.066667 81.066667 0 0 1-118.208-1.557334l-78.869333-86.314666-17.472-17.749334a38.4 38.4 0 1 1 54.72-53.866666l17.856 18.133333 0.512 0.512 0.469333 0.533333 79.466667 86.954667a4.266667 4.266667 0 0 0 6.229333 0.064l185.386667-192.426667z" p-id="41118"></path><path d="M868.266667 512c0-196.757333-159.509333-356.266667-356.266667-356.266667-196.757333 0-356.266667 159.509333-356.266667 356.266667 0 196.757333 159.509333 356.266667 356.266667 356.266667 196.757333 0 356.266667-159.509333 356.266667-356.266667z m76.8 0c0 239.168-193.898667 433.066667-433.066667 433.066667S78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333 945.066667 272.853333 945.066667 512z" p-id="41119"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckCircleOutlined.displayName = 'CheckCircleOutlined'
}
  