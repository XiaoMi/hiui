
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-share-outlined'
const _prefix = getPrefixCls(_role)

export const ShareOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M284 488a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H192v276h640V568h-92a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h164a8 8 0 0 1 8 8v420a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V496a8 8 0 0 1 8-8h164zM517.656 101.666l186.678 186.678a8 8 0 0 1 0 11.312l-45.256 45.256a8 8 0 0 1-11.314 0L552 249.148V728a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V249.146l-95.764 95.766a8 8 0 0 1-11.314 0l-45.256-45.256a8 8 0 0 1 0-11.312l186.678-186.678a8 8 0 0 1 11.312 0z" p-id="12295"></path></svg>
    )
  }
)

if (__DEV__) {
  ShareOutlined.displayName = 'ShareOutlined'
}
  