
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-close-square-outlined')

export const CloseSquareOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8115"  ><path d="M677.930667 346.069333a42.666667 42.666667 0 0 1 0 60.330667L572.330667 512l105.6 105.6a42.666667 42.666667 0 0 1-60.330667 60.330667L512 572.330667l-105.6 105.6a42.666667 42.666667 0 0 1-60.330667-60.330667l105.6-105.6-105.6-105.6a42.666667 42.666667 0 0 1 60.330667-60.330667l105.6 105.6 105.6-105.6a42.666667 42.666667 0 0 1 60.330667 0z" p-id="8116"></path><path d="M234.666667 106.666667h554.666666a128 128 0 0 1 128 128v554.666666a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V234.666667a128 128 0 0 1 128-128z m554.666666 85.333333H234.666667a42.666667 42.666667 0 0 0-42.666667 42.666667v554.666666a42.666667 42.666667 0 0 0 42.666667 42.666667h554.666666a42.666667 42.666667 0 0 0 42.666667-42.666667V234.666667a42.666667 42.666667 0 0 0-42.666667-42.666667z" p-id="8117"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseSquareOutlined.displayName = 'CloseSquareOutlined'
}
  