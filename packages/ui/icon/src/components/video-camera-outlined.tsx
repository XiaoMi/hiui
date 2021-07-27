
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-video-camera-outlined'
const _prefix = getPrefixCls(_role)

export const VideoCameraOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M772 862a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V162a8 8 0 0 1 8-8h692a8 8 0 0 1 8 8v700z m-80-72V234H144v556h548zM970.616 242.13a16 16 0 0 1 1.384 6.508v526.724a16 16 0 0 1-22.032 14.82l-0.476-0.204L692 675.324V348.676l257.492-114.654a16 16 0 0 1 21.124 8.108zM892 347.192l-120 53.432v222.75l120 53.432V347.192zM216.1 282h143.8c4.472 0 8.1 3.58 8.1 8v64c0 4.42-3.628 8-8.1 8h-143.8c-4.472 0-8.1-3.58-8.1-8v-64c0-4.42 3.628-8 8.1-8z" p-id="12475"></path></svg>
    )
  }
)

if (__DEV__) {
  VideoCameraOutlined.displayName = 'VideoCameraOutlined'
}
  