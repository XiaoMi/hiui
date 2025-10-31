
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-outlined')

export const FileOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17006"  ><path d="M646.528 320.64a118.677333 118.677333 0 0 0-167.829333 0L210.346667 588.970667a198.954667 198.954667 0 1 0 281.386666 281.386666L800.576 561.493333c106.624-106.624 106.624-279.530667 0-386.154666-106.645333-106.645333-279.530667-106.645333-386.176 0L210.773333 378.986667l54.314667 54.293333 203.626667-203.648a196.266667 196.266667 0 0 1 277.568 277.568L437.418667 816.042667a122.176 122.176 0 0 1-172.757334-172.757334l268.352-268.373333a41.898667 41.898667 0 0 1 59.221334 59.242667l-170.410667 170.432 54.293333 54.293333 170.410667-170.410667a118.677333 118.677333 0 0 0 0-167.829333z" p-id="17007"></path></svg>
    )
  }
)

if (__DEV__) {
  FileOutlined.displayName = 'FileOutlined'
}
  