
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
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26644"  ><path d="M153.642667 490.666667a42.666667 42.666667 0 0 1 42.666666-42.666667h42.666667a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666666a42.666667 42.666667 0 0 1-42.666667 42.666667h-42.666667a42.666667 42.666667 0 0 1-42.666666-42.666667v-42.666666zM452.309333 490.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h42.666667a42.666667 42.666667 0 0 1 42.666666 42.666667v42.666666a42.666667 42.666667 0 0 1-42.666666 42.666667h-42.666667a42.666667 42.666667 0 0 1-42.666667-42.666667v-42.666666zM750.976 490.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h42.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666666a42.666667 42.666667 0 0 1-42.666667 42.666667h-42.666666a42.666667 42.666667 0 0 1-42.666667-42.666667v-42.666666z" p-id="26645"></path></svg>
    )
  }
)

if (__DEV__) {
  EllipsisOutlined.displayName = 'EllipsisOutlined'
}
  