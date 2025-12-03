
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-up-short-outlined')

export const UpShortOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2701"  ><path d="M550.4 801.834667a38.4 38.4 0 0 1-76.8 0V297.173333l-236.16 236.16a38.4 38.4 0 1 1-54.293333-54.314666L454.677333 207.509333a81.066667 81.066667 0 0 1 114.624 0l271.530667 271.530667A38.4 38.4 0 1 1 786.56 533.333333L550.4 297.194667v504.64z" p-id="2702"></path></svg>
    )
  }
)

if (__DEV__) {
  UpShortOutlined.displayName = 'UpShortOutlined'
}
  