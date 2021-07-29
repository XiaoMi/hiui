
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-reload-outlined'
const _prefix = getPrefixCls(_role)

export const ReloadOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64c111.074 0 212.706 40.422 290.99 107.36l47.456-42.73a8 8 0 0 1 13.276 4.828l26.176 185.932a8 8 0 0 1-9.86 8.876L697.866 282.8a8 8 0 0 1-3.416-13.706l48.468-43.642C679.776 174.504 599.45 144 512 144 308.76 144 144 308.76 144 512s164.76 368 368 368 368-164.76 368-368h80c0 247.424-200.576 448-448 448S64 759.424 64 512 264.576 64 512 64z" p-id="13145"></path></svg>
    )
  }
)

if (__DEV__) {
  ReloadOutlined.displayName = 'ReloadOutlined'
}
  