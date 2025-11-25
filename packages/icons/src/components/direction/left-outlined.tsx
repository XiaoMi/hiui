
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-left-outlined')

export const LeftOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2200"  ><path d="M631.146667 183.104a38.4 38.4 0 1 1 54.293333 54.314667l-274.538667 274.56 274.56 274.538666a38.4 38.4 0 1 1-54.314666 54.293334L344.533333 554.197333a59.733333 59.733333 0 0 1 0-84.48L631.146667 183.104z" p-id="2201"></path></svg>
    )
  }
)

if (__DEV__) {
  LeftOutlined.displayName = 'LeftOutlined'
}
  