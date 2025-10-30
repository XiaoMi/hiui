
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-compass-outlined')

export const CompassOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15021"  ><path d="M868.266667 512c0-196.757333-159.509333-356.266667-356.266667-356.266667-196.757333 0-356.266667 159.509333-356.266667 356.266667 0 196.757333 159.509333 356.266667 356.266667 356.266667 196.757333 0 356.266667-159.509333 356.266667-356.266667z m76.8 0c0 239.168-193.898667 433.066667-433.066667 433.066667S78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333 945.066667 272.853333 945.066667 512z" p-id="15022"></path><path d="M600.213333 323.2c63.488-26.794667 127.402667 37.12 100.608 100.586667L634.794667 580.266667a102.4 102.4 0 0 1-54.528 54.528l-156.48 66.048c-63.488 26.773333-127.381333-37.141333-100.608-100.629334l66.026666-156.48a102.4 102.4 0 0 1 54.528-54.528l156.48-66.026666zM473.6 459.946667a25.642667 25.642667 0 0 0-13.653333 13.653333l-66.005334 156.458667L550.4 564.053333a25.6 25.6 0 0 0 13.610667-13.610666l66.026666-156.48L473.6 459.946667z" p-id="15023"></path></svg>
    )
  }
)

if (__DEV__) {
  CompassOutlined.displayName = 'CompassOutlined'
}
  