
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-ellipsis-outlined')

export const EllipsisOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M213.333333 426.666667a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64H170.666667a64 64 0 0 1-64-64v-42.666666a64 64 0 0 1 64-64h42.666666z m320 0a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64v-42.666666a64 64 0 0 1 64-64h42.666666z m320 0a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64v-42.666666a64 64 0 0 1 64-64h42.666666z" p-id="45026"></path></svg>
    )
  }
)

if (__DEV__) {
  EllipsisOutlined.displayName = 'EllipsisOutlined'
}
  