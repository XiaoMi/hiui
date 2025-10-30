
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-zoom-out-outlined')

export const ZoomOutOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10043"  ><path d="M601.536 435.136a38.4 38.4 0 0 1 0 76.8h-256a38.4 38.4 0 1 1 0-76.8h256z"  p-id="10044"></path><path d="M214.933333 214.933333c139.946667-139.968 366.890667-139.968 506.858667 0 130.773333 130.773333 139.328 337.493333 25.685333 478.250667l155.306667 155.306667a38.4 38.4 0 1 1-54.272 54.314666l-155.328-155.349333c-140.757333 113.664-347.456 105.109333-478.250667-25.685333-139.946667-139.946667-139.946667-366.890667 0-506.837334z m452.565334 54.293334c-109.973333-109.952-288.277333-109.952-398.250667 0-109.973333 109.973333-109.973333 288.298667 0 398.250666 109.973333 109.973333 288.277333 109.973333 398.250667 0 109.952-109.952 109.952-288.277333 0-398.250666z"  p-id="10045"></path></svg>
    )
  }
)

if (__DEV__) {
  ZoomOutOutlined.displayName = 'ZoomOutOutlined'
}
  