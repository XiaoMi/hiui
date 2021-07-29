
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-time-outlined'
const _prefix = getPrefixCls(_role)

export const TimeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960 64 759.424 64 512 264.576 64 512 64z m0 80C308.76 144 144 308.76 144 512s164.76 368 368 368 368-164.76 368-368S715.24 144 512 144z m12 114a8 8 0 0 1 8 8v246h140a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H460a8 8 0 0 1-8-8V266a8 8 0 0 1 8-8h64z" p-id="12365"></path></svg>
    )
  }
)

if (__DEV__) {
  TimeOutlined.displayName = 'TimeOutlined'
}
  