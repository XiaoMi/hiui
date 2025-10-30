
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-time-outlined')

export const TimeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10181"  ><path d="M868.266667 512c0-196.757333-159.509333-356.266667-356.266667-356.266667-196.757333 0-356.266667 159.509333-356.266667 356.266667 0 196.757333 159.509333 356.266667 356.266667 356.266667 196.757333 0 356.266667-159.509333 356.266667-356.266667z m76.8 0c0 239.168-193.898667 433.066667-433.066667 433.066667S78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333 945.066667 272.853333 945.066667 512z" p-id="10182"></path><path d="M473.6 320a38.4 38.4 0 1 1 76.8 0v169.450667l61.290667 25.728 63.701333 25.088a38.4 38.4 0 0 1-28.117333 71.466666l-64-25.173333-0.405334-0.170667-0.426666-0.170666-74.858667-31.424a55.466667 55.466667 0 0 1-33.984-51.157334V320z" p-id="10183"></path></svg>
    )
  }
)

if (__DEV__) {
  TimeOutlined.displayName = 'TimeOutlined'
}
  