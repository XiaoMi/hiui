
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-webpage-outlined')

export const WebpageOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12109"  ><path d="M177.066667 768a25.6 25.6 0 0 0 25.6 25.6h618.666666a25.6 25.6 0 0 0 25.6-25.6V256a25.6 25.6 0 0 0-25.6-25.6h-618.666666A25.6 25.6 0 0 0 177.066667 256v512zM100.266667 256a102.4 102.4 0 0 1 102.4-102.4h618.666666a102.4 102.4 0 0 1 102.4 102.4v512a102.4 102.4 0 0 1-102.4 102.4h-618.666666A102.4 102.4 0 0 1 100.266667 768V256z" p-id="12110"></path><path d="M128 454.4v-76.8h757.333333v76.8H128zM266.666667 309.333333a32 32 0 1 1-64 0 32 32 0 0 1 64 0zM352 309.333333a32 32 0 1 1-64 0 32 32 0 0 1 64 0zM437.333333 309.333333a32 32 0 1 1-64 0 32 32 0 0 1 64 0z" p-id="12111"></path></svg>
    )
  }
)

if (__DEV__) {
  WebpageOutlined.displayName = 'WebpageOutlined'
}
  