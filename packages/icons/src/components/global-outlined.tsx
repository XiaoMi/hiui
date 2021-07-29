
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-global-outlined'
const _prefix = getPrefixCls(_role)

export const GlobalOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960 64 759.424 64 512 264.576 64 512 64z m0 72C304.34 136 136 304.34 136 512s168.34 376 376 376 376-168.34 376-376S719.66 136 512 136zM144 334h736v72H144zM144 616h736v72H144zM476.712 68.364l74.174 27.98C439.6 200.036 370 347.89 370 512c0 161.5 67.404 307.26 175.614 410.68l-80.326 20.77C361.378 829.666 298 678.234 298 512c0-172.24 68.04-328.592 178.712-443.636zM728 512c0 164.24-61.866 314.028-163.564 427.336l-60.996-39.992C598.086 797.88 656 661.704 656 512c0-166.812-71.908-316.828-186.418-420.74l89.008-13.022C663.758 192.278 728 344.638 728 512z" p-id="12875"></path></svg>
    )
  }
)

if (__DEV__) {
  GlobalOutlined.displayName = 'GlobalOutlined'
}
  