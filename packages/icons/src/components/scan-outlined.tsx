
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-scan-outlined'
const _prefix = getPrefixCls(_role)

export const ScanOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M184 624a8 8 0 0 1 8 8v200h200a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V632a8 8 0 0 1 8-8h64z m720 0a8 8 0 0 1 8 8v272a8 8 0 0 1-8 8H632a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h200V632a8 8 0 0 1 8-8h64z m-120-152a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H240a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h544zM392 112a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H192v200a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h272z m512 0a8 8 0 0 1 8 8v272a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V192H632a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h272z" p-id="13125"></path></svg>
    )
  }
)

if (__DEV__) {
  ScanOutlined.displayName = 'ScanOutlined'
}
  