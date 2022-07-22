
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-close-outlined')

export const CloseOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M769.322667 256.426667a42.666667 42.666667 0 0 1 0 60.373333l-196.117334 196.053333 196.117334 196.138667a42.666667 42.666667 0 1 1-60.330667 60.330667l-196.117333-196.117334-196.096 196.117334a42.666667 42.666667 0 1 1-60.330667-60.330667l196.074667-196.117333-196.074667-196.096a42.666667 42.666667 0 1 1 60.330667-60.330667l196.096 196.074667 196.117333-196.074667a42.666667 42.666667 0 0 1 60.330667 0z" p-id="47781"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseOutlined.displayName = 'CloseOutlined'
}
  