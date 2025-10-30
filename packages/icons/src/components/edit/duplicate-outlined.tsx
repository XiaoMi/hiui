
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-duplicate-outlined')

export const DuplicateOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26151"  ><path d="M702.933333 346.666667a25.6 25.6 0 0 0-25.6-25.6h-469.333333a25.6 25.6 0 0 0-25.6 25.6v469.333333a25.6 25.6 0 0 0 25.6 25.6h469.333333a25.6 25.6 0 0 0 25.6-25.6v-469.333333z m76.8 469.333333a102.4 102.4 0 0 1-102.4 102.4h-469.333333a102.4 102.4 0 0 1-102.4-102.4v-469.333333a102.4 102.4 0 0 1 102.4-102.4h469.333333a102.4 102.4 0 0 1 102.4 102.4v469.333333z" p-id="26152"></path><path d="M841.6 538.666667V208a25.6 25.6 0 0 0-25.6-25.6h-341.333333a38.4 38.4 0 1 1 0-76.8h341.333333a102.4 102.4 0 0 1 102.4 102.4v330.666667a38.4 38.4 0 1 1-76.8 0zM560 542.933333a38.4 38.4 0 1 1 0 76.8h-234.666667a38.4 38.4 0 1 1 0-76.8h234.666667z" p-id="26153"></path><path d="M404.16 464.106667a38.4 38.4 0 1 1 76.8 0v234.666666a38.4 38.4 0 1 1-76.8 0v-234.666666z" p-id="26154"></path></svg>
    )
  }
)

if (__DEV__) {
  DuplicateOutlined.displayName = 'DuplicateOutlined'
}
  