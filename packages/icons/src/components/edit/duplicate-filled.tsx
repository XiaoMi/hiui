
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-duplicate-filled')

export const DuplicateFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32382"  ><path d="M677.333333 244.266667a102.4 102.4 0 0 1 102.4 102.4v469.333333a102.4 102.4 0 0 1-102.4 102.4h-469.333333a102.4 102.4 0 0 1-102.4-102.4v-469.333333a102.4 102.4 0 0 1 102.4-102.4h469.333333z m-234.773333 181.44a38.4 38.4 0 0 0-38.4 38.4v78.826666H325.333333a38.4 38.4 0 1 0 0 76.8h78.826667v79.04a38.4 38.4 0 1 0 76.8 0V619.733333h79.04a38.4 38.4 0 1 0 0-76.8h-79.04v-78.826666a38.4 38.4 0 0 0-38.4-38.4z" p-id="32383"></path><path d="M841.6 538.666667V208a25.6 25.6 0 0 0-25.6-25.6h-341.333333a38.4 38.4 0 1 1 0-76.8h341.333333a102.4 102.4 0 0 1 102.4 102.4v330.666667a38.4 38.4 0 1 1-76.8 0z" p-id="32384"></path></svg>
    )
  }
)

if (__DEV__) {
  DuplicateFilled.displayName = 'DuplicateFilled'
}
  