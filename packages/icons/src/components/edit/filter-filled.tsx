
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-filter-filled')

export const FilterFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M640 512a21.333333 21.333333 0 0 1 21.333333 21.333333v238.528a85.333333 85.333333 0 0 1-56.64 80.362667l-185.002666 66.069333A42.666667 42.666667 0 0 1 362.666667 878.122667V533.333333a21.333333 21.333333 0 0 1 21.333333-21.333333h256z m194.986667-405.333333a42.666667 42.666667 0 0 1 34.858666 67.264l-172.053333 243.712a21.333333 21.333333 0 0 1-17.429333 9.024H343.616a21.333333 21.333333 0 0 1-17.429333-9.024L154.154667 173.930667A42.666667 42.666667 0 0 1 189.013333 106.666667h645.973334z" p-id="3414"></path></svg>
    )
  }
)

if (__DEV__) {
  FilterFilled.displayName = 'FilterFilled'
}
  