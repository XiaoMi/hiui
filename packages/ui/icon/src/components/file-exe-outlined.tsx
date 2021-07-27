
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-file-exe-outlined'
const _prefix = getPrefixCls(_role)

export const FileExeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M764 304l-132-132v132h132zM552 144H232v736h560V384H560a8 8 0 0 1-8-8V144z m320 160v648a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h472l240 240zM512 484c93.888 0 170 76.112 170 170h-86.008l-0.004-0.372C595.256 608.42 558.382 572 513 572c-45.506 0-82.46 36.62-82.994 82H342c0-93.888 76.112-170 170-170zM342 694h340v80H342z" p-id="11365"></path></svg>
    )
  }
)

if (__DEV__) {
  FileExeOutlined.displayName = 'FileExeOutlined'
}
  