
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-drag-outlined')

export const DragOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26006"  ><path d="M489.706667 112.042667a38.4 38.4 0 0 1 54.314666 0l105.6 105.6a38.4 38.4 0 1 1-54.314666 54.314666l-40.064-40.064v242.24h241.173333l-40.042667-40.042666A38.4 38.4 0 0 1 810.666667 379.776l105.6 105.6 2.624 2.922667a38.4 38.4 0 0 1-2.624 51.370666L810.666667 645.269333a38.4 38.4 0 1 1-54.293334-54.293333l40.042667-40.042667H555.242667v241.152l40.064-40.042666a38.4 38.4 0 1 1 54.293333 54.293333l-105.6 105.6a38.4 38.4 0 0 1-51.370667 2.645333l-2.922666-2.624-105.6-105.6a38.4 38.4 0 1 1 54.314666-54.314666l40.042667 40.021333V550.933333H236.224l40.042667 40.042667a38.4 38.4 0 0 1-54.293334 54.293333l-105.6-105.6a38.4 38.4 0 0 1-2.645333-51.370666l2.645333-2.922667 105.6-105.6a38.4 38.4 0 0 1 54.293334 54.314667l-40.042667 40.042666h242.24V231.914667l-40.042667 40.042666a38.4 38.4 0 1 1-54.293333-54.293333l105.578667-105.6z"  p-id="26007"></path></svg>
    )
  }
)

if (__DEV__) {
  DragOutlined.displayName = 'DragOutlined'
}
  