
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
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15313"  ><path d="M225.642667 913.066667h533.333333a38.4 38.4 0 1 0 0-76.8h-533.333333a25.6 25.6 0 0 1-25.6-25.6V213.333333a25.6 25.6 0 0 1 25.6-25.6h533.333333a38.4 38.4 0 1 0 0-76.8h-533.333333a102.4 102.4 0 0 0-102.4 102.4v597.333334a102.4 102.4 0 0 0 102.4 102.4z" p-id="15314"></path><path d="M454.976 550.208a38.4 38.4 0 1 1 0-76.8h415.658667a38.4 38.4 0 1 1 0 76.8H454.976z" p-id="15315"></path><path d="M692.970667 388.288a38.4 38.4 0 1 1 54.314666-54.293333l150.826667 150.848a38.4 38.4 0 1 1-54.272 54.293333l-150.869333-150.826667z" p-id="15316"></path><path d="M747.285333 689.984a38.4 38.4 0 0 1-54.314666-54.293333l150.869333-150.848a38.4 38.4 0 1 1 54.293333 54.293333l-150.848 150.848z" p-id="15317"></path></svg>
    )
  }
)

if (__DEV__) {
  DataExportOutlined.displayName = 'DataExportOutlined'
}
  