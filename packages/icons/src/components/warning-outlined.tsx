
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-warning-outlined'
const _prefix = getPrefixCls(_role)

export const WarningOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M472 684V372h80v312h-80z m40 144c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zM965.84 900.574L526.174 72.86a16 16 0 0 0-28.344 0L58.158 900.574A16 16 0 0 0 72.33 924h879.34a16 16 0 0 0 14.172-23.426zM519.088 231.712l320.664 600.576A8 8 0 0 1 832.66 844H191.336a8 8 0 0 1-7.088-11.712l320.666-600.576a8 8 0 0 1 14.172 0z" p-id="13345"></path></svg>
    )
  }
)

if (__DEV__) {
  WarningOutlined.displayName = 'WarningOutlined'
}
  