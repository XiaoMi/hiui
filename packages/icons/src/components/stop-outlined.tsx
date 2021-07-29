
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-stop-outlined'
const _prefix = getPrefixCls(_role)

export const StopOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960 64 759.424 64 512 264.576 64 512 64zM144 512c0 203.24 164.76 368 368 368 87.466 0 167.806-30.516 230.954-81.48L225.48 281.046C174.516 344.194 144 424.534 144 512zM512 144c-86.956 0-166.866 30.16-229.844 80.588l517.256 517.256C849.84 678.866 880 598.956 880 512c0-203.24-164.76-368-368-368z" p-id="13365"></path></svg>
    )
  }
)

if (__DEV__) {
  StopOutlined.displayName = 'StopOutlined'
}
  