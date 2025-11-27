
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-right-short-outlined')

export const RightShortOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3798"  ><path d="M222.165333 550.4a38.4 38.4 0 0 1 0-76.8h504.64l-236.16-236.16a38.4 38.4 0 1 1 54.314667-54.293333l271.530667 271.530666a81.066667 81.066667 0 0 1 0 114.645334L544.96 840.853333a38.4 38.4 0 1 1-54.314667-54.293333L726.826667 550.4H222.165333z" p-id="3799"></path></svg>
    )
  }
)

if (__DEV__) {
  RightShortOutlined.displayName = 'RightShortOutlined'
}
  