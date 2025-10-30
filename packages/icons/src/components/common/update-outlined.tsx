
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-update-outlined')

export const UpdateOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11232"  ><path d="M868.266667 512c0-196.757333-159.509333-356.266667-356.266667-356.266667-196.757333 0-356.266667 159.509333-356.266667 356.266667 0 196.757333 159.509333 356.266667 356.266667 356.266667 196.757333 0 356.266667-159.509333 356.266667-356.266667z m76.8 0c0 239.168-193.898667 433.066667-433.066667 433.066667S78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333 945.066667 272.853333 945.066667 512z" p-id="11233"></path><path d="M553.557333 679.338667a38.4 38.4 0 1 1-76.8-0.021334V348.992a38.4 38.4 0 1 1 76.8 0v330.346667z" p-id="11234"></path><path d="M421.824 496.490667a38.4 38.4 0 0 1-54.314667-54.314667l120.682667-120.682667a38.4 38.4 0 1 1 54.314667 54.314667l-120.682667 120.682667z" p-id="11235"></path><path d="M663.168 442.176a38.4 38.4 0 0 1-54.293333 54.314667l-120.682667-120.682667a38.4 38.4 0 1 1 54.314667-54.314667l120.661333 120.682667z" p-id="11236"></path></svg>
    )
  }
)

if (__DEV__) {
  UpdateOutlined.displayName = 'UpdateOutlined'
}
  