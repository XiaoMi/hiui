
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-download-outlined'
const _prefix = getPrefixCls(_role)

export const DownloadOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M184 654a8 8 0 0 1 8 8v168h640v-168a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v240a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V662a8 8 0 0 1 8-8h64zM544 109.04a8 8 0 0 1 8 8v479.136l124.048-124.048a8 8 0 0 1 11.314 0l45.256 45.254a8 8 0 0 1 0 11.314l-214.96 214.96a8 8 0 0 1-11.314 0l-214.96-214.96a8 8 0 0 1 0-11.314l45.254-45.254a8 8 0 0 1 11.314 0L472 596.176V117.04a8 8 0 0 1 8-8h64z" p-id="12715"></path></svg>
    )
  }
)

if (__DEV__) {
  DownloadOutlined.displayName = 'DownloadOutlined'
}
  