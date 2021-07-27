
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-like-outlined'
const _prefix = getPrefixCls(_role)

export const LikeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M477.75 88.434c64.146 0 116.268 51.48 117.304 115.38l0.016 1.94V342h232.62a100 100 0 0 1 23.264 2.744c53.176 12.72 86.176 65.73 74.364 118.908l-0.37 1.61-91.848 384c-10.656 44.548-50.188 76.1-95.872 76.728l-1.386 0.01H132a16 16 0 0 1-16-16V430a16 16 0 0 1 16-16h136.432l82.14-224c19.228-60.484 63.71-101.566 127.178-101.566zM515.07 422V205.754c0-20.612-16.708-37.32-37.32-37.32-28.33 0-41.748 18.15-50.668 44.972l-0.27 0.832L348 429.168 347.998 846h387.844a20 20 0 0 0 19.312-14.8l0.14-0.548 91.848-384c2.57-10.742-4.056-21.534-14.8-24.104a20 20 0 0 0-3.868-0.532l-0.784-0.016h-312.62zM268 494H196v352h71.998V494z" p-id="12975"></path></svg>
    )
  }
)

if (__DEV__) {
  LikeOutlined.displayName = 'LikeOutlined'
}
  