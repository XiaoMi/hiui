
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-tag-outlined')

export const TagOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9424"  ><path d="M216.661333 559.936a25.6 25.6 0 0 0 0 36.224l211.2 211.2a25.6 25.6 0 0 0 36.202667 0l343.296-343.317333a25.6 25.6 0 0 0 7.488-18.090667v-232.533333a4.266667 4.266667 0 0 0-4.266667-4.266667h-232.533333a25.6 25.6 0 0 0-18.090667 7.488L216.682667 559.957333zM505.664 162.346667a102.4 102.4 0 0 1 72.384-29.994667h232.533333a81.066667 81.066667 0 0 1 81.066667 81.066667v232.533333a102.4 102.4 0 0 1-29.973333 72.384L518.357333 861.653333a102.4 102.4 0 0 1-144.789333 0l-211.2-211.2a102.4 102.4 0 0 1 0-144.810666L505.664 162.346667z" p-id="9425"></path><path d="M630.186667 318.4a53.333333 53.333333 0 1 1 75.434666 75.413333 53.333333 53.333333 0 0 1-75.434666-75.413333z" p-id="9426"></path></svg>
    )
  }
)

if (__DEV__) {
  TagOutlined.displayName = 'TagOutlined'
}
  