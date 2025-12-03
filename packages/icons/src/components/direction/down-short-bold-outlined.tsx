
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-down-short-bold-outlined')

export const DownShortBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2991"  ><path d="M576 222.186667a64 64 0 0 0-128 0v442.816l-192.448-192.426667a64 64 0 0 0-90.517333 90.517333l271.530666 271.530667a106.666667 106.666667 0 0 0 150.848 0l271.530667-271.530667a64 64 0 0 0-90.517333-90.517333L576 665.002667V222.186667z" p-id="2992"></path></svg>
    )
  }
)

if (__DEV__) {
  DownShortBoldOutlined.displayName = 'DownShortBoldOutlined'
}
  