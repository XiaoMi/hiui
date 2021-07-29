
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-time-rewind-outlined'
const _prefix = getPrefixCls(_role)

export const TimeRewindOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64c-111.074 0-212.706 40.422-290.99 107.36L173.554 128.628a8 8 0 0 0-13.276 4.828l-26.176 185.932a8 8 0 0 0 9.86 8.876l182.174-45.468a8 8 0 0 0 3.416-13.706l-48.468-43.642C344.224 174.504 424.55 144 512 144c203.24 0 368 164.76 368 368s-164.76 368-368 368S144 715.24 144 512H64c0 247.424 200.576 448 448 448s448-200.576 448-448S759.424 64 512 64zM480 572a8 8 0 0 1-8-8V292a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v200h152a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H480z" p-id="12385"></path></svg>
    )
  }
)

if (__DEV__) {
  TimeRewindOutlined.displayName = 'TimeRewindOutlined'
}
  