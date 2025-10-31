
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-archive-filled')

export const ArchiveFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6165"  ><path d="M170.666667 218.666667a64 64 0 0 1 64-64h554.666666a64 64 0 0 1 64 64v85.333333a64 64 0 0 1-64 64H234.666667a64 64 0 0 1-64-64v-85.333333z" p-id="6166"></path><path d="M821.333333 218.666667a32 32 0 0 0-32-32H234.666667a32 32 0 0 0-32 32v85.333333a32 32 0 0 0 32 32h554.666666a32 32 0 0 0 32-32v-85.333333z m64 85.333333a96 96 0 0 1-96 96H234.666667a96 96 0 0 1-96-96v-85.333333a96 96 0 0 1 96-96h554.666666a96 96 0 0 1 96 96v85.333333zM234.666667 464a96 96 0 0 0-96 96v245.333333a96 96 0 0 0 96 96h554.666666a96 96 0 0 0 96-96v-245.333333a96 96 0 0 0-96-96H544v220.352l50.986667-50.986667a32 32 0 1 1 45.226666 45.269334l-105.6 105.6a32 32 0 0 1-45.226666 0l-105.6-105.6a32 32 0 0 1 45.248-45.248l50.986666 50.965333v-220.373333H234.666667z" p-id="6167"></path></svg>
    )
  }
)

if (__DEV__) {
  ArchiveFilled.displayName = 'ArchiveFilled'
}
  