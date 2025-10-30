
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-data-monitor-filled')

export const DataMonitorFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9162"  ><path d="M817.194667 245.333333a46.933333 46.933333 0 0 0-46.933334-46.933333H253.717333a46.933333 46.933333 0 0 0-46.933333 46.933333v388.266667h610.389333V245.333333z m76.8 388.266667H896a38.4 38.4 0 1 1 0 76.8H128a38.4 38.4 0 1 1 0-76.8h2.026667V245.333333a123.733333 123.733333 0 0 1 123.733333-123.733333h516.48a123.733333 123.733333 0 0 1 123.733333 123.733333v388.266667z" p-id="9163"></path><path d="M770.24 160a85.333333 85.333333 0 0 1 85.333333 85.333333v426.666667H168.426667v-426.666667a85.333333 85.333333 0 0 1 85.333333-85.333333h516.48z m-72.704 139.712a38.4 38.4 0 0 0-53.653333 8.234667L566.826667 413.013333l-44.373334-66.666666-2.282666-3.178667c-23.552-30.933333-70.229333-31.317333-94.293334-0.789333l-2.304 3.136-92.501333 134.016a38.4 38.4 0 0 0 63.189333 43.648l78.186667-113.322667 44.010667 66.069333a59.733333 59.733333 0 0 0 97.898666 2.197334l91.456-124.736a38.4 38.4 0 0 0-8.277333-53.653334z" p-id="9164"></path><path d="M473.6 693.333333a38.4 38.4 0 1 1 76.8 0v59.328l189.205333 75.690667a38.4 38.4 0 0 1-28.544 71.296L512 820.010667l-199.061333 79.637333a38.4 38.4 0 0 1-28.544-71.296l189.226666-75.690667V693.333333z" p-id="9165"></path></svg>
    )
  }
)

if (__DEV__) {
  DataMonitorFilled.displayName = 'DataMonitorFilled'
}
  