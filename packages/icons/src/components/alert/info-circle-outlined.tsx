
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-info-circle-outlined')

export const InfoCircleOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8727"  ><path d="M868.266667 512c0-196.757333-159.509333-356.266667-356.266667-356.266667-196.757333 0-356.266667 159.509333-356.266667 356.266667 0 196.757333 159.509333 356.266667 356.266667 356.266667v76.8C272.832 945.066667 78.933333 751.146667 78.933333 512S272.853333 78.933333 512 78.933333 945.066667 272.853333 945.066667 512 751.146667 945.066667 512 945.066667v-76.8c196.757333 0 356.266667-159.509333 356.266667-356.266667z"  p-id="8728"></path><path d="M507.733333 426.56a42.666667 42.666667 0 0 1 42.666667 42.666667v192H576a38.4 38.4 0 1 1 0 76.8h-128a38.4 38.4 0 1 1 0-76.8h25.6v-157.866667H469.333333a38.4 38.4 0 1 1 0-76.8h38.4zM512 285.994667a49.066667 49.066667 0 1 1 0 98.133333 49.066667 49.066667 0 0 1 0-98.133333z"  p-id="8729"></path></svg>
    )
  }
)

if (__DEV__) {
  InfoCircleOutlined.displayName = 'InfoCircleOutlined'
}
  