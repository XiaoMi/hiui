
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-caret-left-outlined'
const _prefix = getPrefixCls(_role)

export const CaretLeftOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M325.844 503.606L635.258 256.86a11.318 11.318 0 0 1 15.872 1.76 11.234 11.234 0 0 1 2.474 7.03V759.14c0 6.218-5.056 11.258-11.292 11.258a11.316 11.316 0 0 1-7.054-2.468L325.844 521.186a11.232 11.232 0 0 1 0-17.58z" p-id="13795"></path></svg>
    )
  }
)

if (__DEV__) {
  CaretLeftOutlined.displayName = 'CaretLeftOutlined'
}
  