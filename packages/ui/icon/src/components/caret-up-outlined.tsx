
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-caret-up-outlined'
const _prefix = getPrefixCls(_role)

export const CaretUpOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M520.79 341.844l246.744 309.414a11.318 11.318 0 0 1-1.76 15.872 11.234 11.234 0 0 1-7.032 2.474H265.26c-6.218 0-11.258-5.056-11.258-11.292 0-2.564 0.87-5.052 2.466-7.054l246.744-309.414a11.232 11.232 0 0 1 17.58 0z" p-id="13805"></path></svg>
    )
  }
)

if (__DEV__) {
  CaretUpOutlined.displayName = 'CaretUpOutlined'
}
  