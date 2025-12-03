
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-up-short-bold-outlined')

export const UpShortBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2846"  ><path d="M576.021333 801.834667a64 64 0 0 1-128 0V358.997333l-192.426666 192.426667a64 64 0 1 1-90.517334-90.496L436.586667 189.397333a106.666667 106.666667 0 0 1 150.869333 0l271.509333 271.530667a64 64 0 0 1-90.496 90.517333l-192.426666-192.426666v442.816z" p-id="2847"></path></svg>
    )
  }
)

if (__DEV__) {
  UpShortBoldOutlined.displayName = 'UpShortBoldOutlined'
}
  