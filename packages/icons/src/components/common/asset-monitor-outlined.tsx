
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-asset-monitor-outlined')

export const AssetMonitorOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12021"  ><path d="M817.194667 245.333333a46.933333 46.933333 0 0 0-46.933334-46.933333H253.717333a46.933333 46.933333 0 0 0-46.933333 46.933333v388.266667h610.389333V245.333333z m76.8 388.266667H896a38.4 38.4 0 1 1 0 76.8H128a38.4 38.4 0 1 1 0-76.8h2.026667V245.333333a123.733333 123.733333 0 0 1 123.733333-123.733333h516.48a123.733333 123.733333 0 0 1 123.733333 123.733333v388.266667z" p-id="12022"></path><path d="M618.666667 302.933333a38.4 38.4 0 1 1 0 76.8H405.333333a38.4 38.4 0 1 1 0-76.8h213.333334zM618.666667 452.266667a38.4 38.4 0 1 1 0 76.8H405.333333a38.4 38.4 0 1 1 0-76.8h213.333334zM473.6 693.333333a38.4 38.4 0 1 1 76.8 0v59.328l189.205333 75.690667a38.4 38.4 0 0 1-28.544 71.296L512 820.010667l-199.061333 79.637333a38.4 38.4 0 0 1-28.544-71.296l189.226666-75.690667V693.333333z" p-id="12023"></path></svg>
    )
  }
)

if (__DEV__) {
  AssetMonitorOutlined.displayName = 'AssetMonitorOutlined'
}
  