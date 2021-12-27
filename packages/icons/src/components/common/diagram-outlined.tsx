
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-diagram-outlined'
const _prefix = getPrefixCls(_role)

export const DiagramOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 192c162.261333 0 296.32 120.768 317.184 277.333333H938.666667a42.666667 42.666667 0 1 1 0 85.333334h-109.482667C808.32 711.253333 674.261333 832 512 832c-162.261333 0-296.32-120.768-317.184-277.333333H85.333333a42.666667 42.666667 0 1 1 0-85.333334h109.482667C215.68 312.768 349.738667 192 512 192z m0 85.333333c-129.6 0-234.666667 105.066667-234.666667 234.666667s105.066667 234.666667 234.666667 234.666667 234.666667-105.066667 234.666667-234.666667-105.066667-234.666667-234.666667-234.666667z m0 170.666667a64 64 0 1 1 0 128 64 64 0 0 1 0-128z" p-id="39335"></path></svg>
    )
  }
)

if (__DEV__) {
  DiagramOutlined.displayName = 'DiagramOutlined'
}
  