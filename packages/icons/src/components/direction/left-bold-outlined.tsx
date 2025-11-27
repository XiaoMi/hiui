
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-left-bold-outlined')

export const LeftBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4668"  ><path d="M613.056 165.013333a64 64 0 1 1 90.496 90.496L447.146667 511.957333l256.426666 256.448a64 64 0 0 1-90.496 90.517334L326.442667 572.309333a85.333333 85.333333 0 0 1 0-120.682666L613.056 165.013333z" p-id="4669"></path></svg>
    )
  }
)

if (__DEV__) {
  LeftBoldOutlined.displayName = 'LeftBoldOutlined'
}
  