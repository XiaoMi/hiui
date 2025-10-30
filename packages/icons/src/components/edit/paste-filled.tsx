
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-paste-filled')

export const PasteFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33256"  ><path d="M346.666667 779.733333a102.4 102.4 0 0 1-102.4-102.4v-469.333333a102.4 102.4 0 0 1 102.4-102.4h469.333333a102.4 102.4 0 0 1 102.4 102.4v469.333333a102.4 102.4 0 0 1-102.4 102.4h-469.333333z m234.773333-181.44a38.4 38.4 0 0 0 38.4-38.4V481.066667h78.826667a38.4 38.4 0 1 0 0-76.8h-78.826667v-79.04a38.4 38.4 0 1 0-76.8 0v79.04H464a38.4 38.4 0 0 0 0 76.8h79.04v78.826666a38.4 38.4 0 0 0 38.4 38.4zM208 918.4a102.4 102.4 0 0 1-102.4-102.4v-330.666667a38.4 38.4 0 1 1 76.8 0v330.666667a25.6 25.6 0 0 0 25.6 25.6h341.333333a38.4 38.4 0 1 1 0 76.8h-341.333333z" p-id="33257"></path></svg>
    )
  }
)

if (__DEV__) {
  PasteFilled.displayName = 'PasteFilled'
}
  