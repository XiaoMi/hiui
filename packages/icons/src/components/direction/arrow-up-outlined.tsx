
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-arrow-up-outlined')

export const ArrowUpOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3653"  ><path d="M250.176 400.490667a38.4 38.4 0 0 1 0-54.314667L469.76 126.592a59.733333 59.733333 0 0 1 84.48 0l219.562667 219.584a38.4 38.4 0 1 1-54.293334 54.314667L550.4 231.36v645.056a38.4 38.4 0 1 1-76.8 0V231.381333l-169.130667 169.109334a38.4 38.4 0 0 1-54.293333 0z" p-id="3654"></path></svg>
    )
  }
)

if (__DEV__) {
  ArrowUpOutlined.displayName = 'ArrowUpOutlined'
}
  