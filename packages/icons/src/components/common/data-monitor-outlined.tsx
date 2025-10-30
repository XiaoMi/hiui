
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-data-monitor-outlined')

export const DataMonitorOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15461"  ><path d="M817.194667 245.333333a46.933333 46.933333 0 0 0-46.933334-46.933333H253.717333a46.933333 46.933333 0 0 0-46.933333 46.933333v388.266667h610.389333V245.333333z m76.8 388.266667H896a38.4 38.4 0 1 1 0 76.8H128a38.4 38.4 0 1 1 0-76.8h2.026667V245.333333a123.733333 123.733333 0 0 1 123.733333-123.733333h516.48a123.733333 123.733333 0 0 1 123.733333 123.733333v388.266667z" p-id="15462"></path><path d="M473.6 693.333333a38.4 38.4 0 1 1 76.8 0v59.328l189.205333 75.690667a38.4 38.4 0 0 1-28.544 71.296L512 820.010667l-199.061333 79.637333a38.4 38.4 0 0 1-28.544-71.296l189.226666-75.690667V693.333333zM633.216 318.634667a38.4 38.4 0 0 1 61.930667 45.397333l-91.456 124.736a59.733333 59.733333 0 0 1-97.898667-2.197333l-43.989333-66.069334-78.186667 113.322667a38.4 38.4 0 0 1-63.210667-43.626667l92.522667-134.037333 2.304-3.136c24.042667-30.506667 70.741333-30.122667 94.293333 0.789333l2.282667 3.2 44.373333 66.645334 77.034667-105.024z" p-id="15463"></path></svg>
    )
  }
)

if (__DEV__) {
  DataMonitorOutlined.displayName = 'DataMonitorOutlined'
}
  