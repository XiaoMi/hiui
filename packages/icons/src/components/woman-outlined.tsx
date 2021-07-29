
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-woman-outlined'
const _prefix = getPrefixCls(_role)

export const WomanOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 52c165.686 0 300 134.314 300 300 0 150.042-110.148 274.358-253.996 296.494L558 728h140a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-140v156a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-156h-140a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h140v-77.906C328.322 633.21 212 506.19 212 352c0-165.686 134.314-300 300-300z m0 80c-121.502 0-220 98.498-220 220s98.498 220 220 220 220-98.498 220-220S633.502 132 512 132z" p-id="12505"></path></svg>
    )
  }
)

if (__DEV__) {
  WomanOutlined.displayName = 'WomanOutlined'
}
  