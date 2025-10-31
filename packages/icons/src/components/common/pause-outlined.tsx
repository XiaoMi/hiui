
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-pause-outlined')

export const PauseOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23036"  ><path d="M868.266667 512c0-196.757333-159.509333-356.266667-356.266667-356.266667-196.757333 0-356.266667 159.509333-356.266667 356.266667 0 196.757333 159.509333 356.266667 356.266667 356.266667 196.757333 0 356.266667-159.509333 356.266667-356.266667z m76.8 0c0 239.168-193.898667 433.066667-433.066667 433.066667S78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333 945.066667 272.853333 945.066667 512z" p-id="23037"></path><path d="M433.066667 629.333333a38.4 38.4 0 1 1-76.8 0v-234.666666a38.4 38.4 0 1 1 76.8 0v234.666666zM667.733333 629.333333a38.4 38.4 0 1 1-76.8 0v-234.666666a38.4 38.4 0 1 1 76.8 0v234.666666z" p-id="23038"></path></svg>
    )
  }
)

if (__DEV__) {
  PauseOutlined.displayName = 'PauseOutlined'
}
  