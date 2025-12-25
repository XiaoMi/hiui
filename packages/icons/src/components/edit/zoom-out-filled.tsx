
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-zoom-out-filled')

export const ZoomOutFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5898"  ><path d="M848.490667 902.784a38.4 38.4 0 0 0 54.293333-54.293333l-155.349333-155.306667a356.885333 356.885333 0 0 0 79.317333-224.832c0-197.930667-160.469333-358.4-358.4-358.4s-358.4 160.469333-358.4 358.4 160.469333 358.4 358.4 358.4c85.12 0 163.285333-29.717333 224.768-79.296l155.349333 155.328zM345.493333 511.914667a38.4 38.4 0 1 1 0-76.8h256a38.4 38.4 0 1 1 0 76.8h-256z" p-id="5899"></path></svg>
    )
  }
)

if (__DEV__) {
  ZoomOutFilled.displayName = 'ZoomOutFilled'
}
  