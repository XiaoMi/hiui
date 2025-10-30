
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-close-outlined')

export const CloseOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="41409"  ><path d="M794.176 175.530667a38.4 38.4 0 1 1 54.293333 54.272l-608 608a38.4 38.4 0 1 1-54.293333-54.272l608-608z"  p-id="41410"></path><path d="M240.469333 175.530667a38.4 38.4 0 1 0-54.293333 54.272l608 608a38.4 38.4 0 1 0 54.293333-54.272l-608-608z"  p-id="41411"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseOutlined.displayName = 'CloseOutlined'
}
  