
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-lightning-outlined'
const _prefix = getPrefixCls(_role)

export const LightningOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M717.652 58a8 8 0 0 1 7.45 10.914l-101.694 280.104h233.856a8 8 0 0 1 5.84 13.468L317.576 963.868a8 8 0 0 1-13.7-6.968l56.878-337.6H166a8 8 0 0 1-7.752-9.976l133.92-545.3A8 8 0 0 1 299.92 58h417.732z m-105.46 80H355.866l-97.21 401.3h198.832l-28.35 188.33 262.096-298.612h-185L612.192 138z" p-id="12835"></path></svg>
    )
  }
)

if (__DEV__) {
  LightningOutlined.displayName = 'LightningOutlined'
}
  