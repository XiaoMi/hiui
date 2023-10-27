
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-data-export-outlined')

export const DataExportOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M746.666667 85.333333v85.333334H213.333333a42.666667 42.666667 0 0 0-42.666666 42.666666v554.666667a42.666667 42.666667 0 0 0 42.666666 42.666667h533.333334v85.333333H213.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h533.333334z" p-id="15935"></path><path d="M716.501333 311.168a42.666667 42.666667 0 0 0-2.496 57.621333l2.496 2.709334L793.002667 448H409.514667a42.666667 42.666667 0 1 0 0 85.333333H792.96l-76.48 76.501334a42.666667 42.666667 0 0 0-2.496 57.621333l2.496 2.709333a42.666667 42.666667 0 0 0 57.621333 2.496l2.709334-2.496 149.333333-149.333333a42.666667 42.666667 0 0 0 2.496-57.621333l-2.496-2.709334-149.333333-149.333333a42.666667 42.666667 0 0 0-60.330667 0z m115.669334 182.976v-6.954667l3.477333 3.477334-3.477333 3.477333z" p-id="15936"></path></svg>
    )
  }
)

if (__DEV__) {
  DataExportOutlined.displayName = 'DataExportOutlined'
}
  