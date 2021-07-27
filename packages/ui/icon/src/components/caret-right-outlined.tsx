
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-caret-right-outlined'
const _prefix = getPrefixCls(_role)

export const CaretRightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M698.156 521.186L388.742 767.928a11.318 11.318 0 0 1-15.872-1.758 11.234 11.234 0 0 1-2.474-7.032V265.652c0-6.216 5.056-11.256 11.292-11.256 2.564 0 5.052 0.87 7.054 2.466l309.414 246.744a11.232 11.232 0 0 1 0 17.58z" p-id="13775"></path></svg>
    )
  }
)

if (__DEV__) {
  CaretRightOutlined.displayName = 'CaretRightOutlined'
}
  