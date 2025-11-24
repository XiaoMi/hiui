
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-right-short-bold-outlined')

export const RightShortBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4088"  ><path d="M222.186667 576a64 64 0 0 1 0-128h442.816l-192.426667-192.426667a64 64 0 0 1 90.517333-90.517333l271.530667 271.530667a106.666667 106.666667 0 0 1 0 150.826666L563.093333 858.986667a64 64 0 0 1-90.517333-90.517334l192.426667-192.426666H222.186667z" p-id="4089"></path></svg>
    )
  }
)

if (__DEV__) {
  RightShortBoldOutlined.displayName = 'RightShortBoldOutlined'
}
  