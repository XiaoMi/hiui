
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-search-outlined')

export const SearchOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25138"  ><path d="M763.2 470.933333c0 161.429333-130.837333 292.266667-292.266667 292.266667-161.408 0-292.266667-130.837333-292.266666-292.266667 0-161.408 130.858667-292.266667 292.266666-292.266666 161.429333 0 292.266667 130.858667 292.266667 292.266666z m76.8 0c0-203.818667-165.226667-369.066667-369.066667-369.066666-203.818667 0-369.066667 165.248-369.066666 369.066666 0 203.84 165.248 369.066667 369.066666 369.066667 203.84 0 369.066667-165.226667 369.066667-369.066667z" p-id="25139"></path><path d="M856.576 910.869333l-165.930667-165.930666a38.4 38.4 0 0 1 54.293334-54.293334l165.930666 165.930667a38.4 38.4 0 1 1-54.293333 54.293333z" p-id="25140"></path></svg>
    )
  }
)

if (__DEV__) {
  SearchOutlined.displayName = 'SearchOutlined'
}
  