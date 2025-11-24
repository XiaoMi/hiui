
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-plus-outlined')

export const PlusOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="37771"  ><path d="M477.909333 874.666667a38.4 38.4 0 1 0 76.8 0V149.333333a38.4 38.4 0 1 0-76.8 0v725.333334z" p-id="37772"></path><path d="M878.976 550.506667a38.4 38.4 0 1 0 0-76.8h-725.333333a38.4 38.4 0 1 0 0 76.8h725.333333z" p-id="37773"></path></svg>
    )
  }
)

if (__DEV__) {
  PlusOutlined.displayName = 'PlusOutlined'
}
  