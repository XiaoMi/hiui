
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-down-up-outlined')

export const DownUpOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6065"  ><path d="M250.176 389.824a38.4 38.4 0 0 1 0-54.293333L469.76 115.925333a59.733333 59.733333 0 0 1 84.48 0l219.562667 219.605334a38.4 38.4 0 1 1-54.293334 54.293333L512 182.314667l-207.530667 207.509333a38.4 38.4 0 0 1-54.293333 0zM250.176 634.197333a38.4 38.4 0 0 0 0 54.293334L469.76 908.096a59.733333 59.733333 0 0 0 84.48-0.021333l219.562667-219.584a38.4 38.4 0 1 0-54.293334-54.293334L512 841.685333l-207.530667-207.488a38.4 38.4 0 0 0-54.293333 0z" p-id="6066"></path></svg>
    )
  }
)

if (__DEV__) {
  DownUpOutlined.displayName = 'DownUpOutlined'
}
  