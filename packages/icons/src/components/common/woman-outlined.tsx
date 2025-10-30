
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-woman-outlined')

export const WomanOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21786"  ><path d="M729.6 384c0-120.170667-97.429333-217.6-217.6-217.6-120.170667 0-217.6 97.429333-217.6 217.6 0 120.170667 97.429333 217.6 217.6 217.6 120.170667 0 217.6-97.429333 217.6-217.6z m76.8 0c0 162.602667-131.797333 294.4-294.4 294.4-162.602667 0-294.4-131.797333-294.4-294.4 0-162.581333 131.797333-294.4 294.4-294.4 162.602667 0 294.4 131.818667 294.4 294.4z" p-id="21787"></path><path d="M473.6 896V640a38.4 38.4 0 1 1 76.8 0v256a38.4 38.4 0 1 1-76.8 0z" p-id="21788"></path><path d="M373.333333 729.493333h277.333334a38.4 38.4 0 1 1 0 76.8h-277.333334a38.4 38.4 0 1 1 0-76.8z" p-id="21789"></path></svg>
    )
  }
)

if (__DEV__) {
  WomanOutlined.displayName = 'WomanOutlined'
}
  