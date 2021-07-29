
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-travel-outlined'
const _prefix = getPrefixCls(_role)

export const TravelOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M724 64a8 8 0 0 1 8 8v114h120a8 8 0 0 1 8 8v704a8 8 0 0 1-8 8h-94v62a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-62H348v62a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-62H172a8 8 0 0 1-8-8V194a8 8 0 0 1 8-8h120V72a8 8 0 0 1 8-8h424z m56 202H244v560h536V266z m-356 118a8 8 0 0 1 8 8v320a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V392a8 8 0 0 1 8-8h64z m240 0a8 8 0 0 1 8 8v320a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V392a8 8 0 0 1 8-8h64z m-12-240H372v42h280V144z" p-id="12395"></path></svg>
    )
  }
)

if (__DEV__) {
  TravelOutlined.displayName = 'TravelOutlined'
}
  