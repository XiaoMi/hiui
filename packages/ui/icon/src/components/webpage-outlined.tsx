
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-webpage-outlined'
const _prefix = getPrefixCls(_role)

export const WebpageOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M896 112a16 16 0 0 1 16 16v768a16 16 0 0 1-16 16H128a16 16 0 0 1-16-16V128a16 16 0 0 1 16-16h768z m-64 303.998H192V832h640V415.998zM504 640a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H264a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h240z m256-144a8 8 0 0 1 8 8v66a8 8 0 0 1-8 8H264a8 8 0 0 1-8-8v-66a8 8 0 0 1 8-8h496z m72-304H192v143.998L832 336V192z m-536 32c22.092 0 40 17.908 40 40s-17.908 40-40 40-40-17.908-40-40 17.908-40 40-40z m140 0c22.092 0 40 17.908 40 40s-17.908 40-40 40-40-17.908-40-40 17.908-40 40-40z m140 0c22.092 0 40 17.908 40 40s-17.908 40-40 40-40-17.908-40-40 17.908-40 40-40z" p-id="12465"></path></svg>
    )
  }
)

if (__DEV__) {
  WebpageOutlined.displayName = 'WebpageOutlined'
}
  