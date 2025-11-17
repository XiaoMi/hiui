
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-document-search-outlined')

export const DocumentSearchOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25715"  ><path d="M380.906667 142.933333c29.226667 0 57.109333 12.501333 76.522666 34.346667l47.146667 53.056c4.864 5.461333 11.84 8.597333 19.157333 8.597333h312.576a102.4 102.4 0 0 1 102.4 102.4v160a38.4 38.4 0 0 1-76.8 0V341.333333a25.6 25.6 0 0 0-25.6-25.6H523.733333a102.421333 102.421333 0 0 1-76.544-34.389333l-47.146666-53.013333a25.642667 25.642667 0 0 0-19.136-8.597334H196.309333a25.6 25.6 0 0 0-25.6 25.6v533.333334a25.6 25.6 0 0 0 25.6 25.6h384a38.4 38.4 0 1 1 0 76.8h-384a102.4 102.4 0 0 1-102.4-102.4v-533.333334a102.4 102.4 0 0 1 102.4-102.4h184.597334z"  p-id="25716"></path><path d="M649.92 581.610667a145.066667 145.066667 0 0 1 228.650667 174.336l48.896 48.896a38.4 38.4 0 0 1-54.293334 54.314666l-48.917333-48.917333a145.088 145.088 0 0 1-174.336-228.629333z m150.848 54.314666a68.266667 68.266667 0 1 0-96.533333 96.533334 68.266667 68.266667 0 0 0 96.533333-96.533334z"  p-id="25717"></path></svg>
    )
  }
)

if (__DEV__) {
  DocumentSearchOutlined.displayName = 'DocumentSearchOutlined'
}
  