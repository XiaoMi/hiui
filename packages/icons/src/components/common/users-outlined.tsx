
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-users-outlined')

export const UsersOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11526"  ><path d="M517.952 473.6a143.637333 143.637333 0 1 1 0-287.274667 143.637333 143.637333 0 0 1 0 287.253334z m0 76.8c121.728 0 220.437333-98.709333 220.437333-220.437333 0-121.749333-98.709333-220.416-220.437333-220.416S297.536 208.213333 297.536 329.962667 396.224 550.4 517.952 550.4zM138.24 829.098667c0-133.504 108.245333-241.728 241.749333-241.728h206.208a38.4 38.4 0 1 1 0 76.8h-206.208a164.970667 164.970667 0 0 0-164.949333 164.949333c0 4.693333 3.84 8.533333 8.533333 8.533333h362.624a38.4 38.4 0 1 1 0 76.8H223.573333a85.333333 85.333333 0 0 1-85.333333-85.333333zM856.021333 712.512a38.4 38.4 0 1 1 0 76.8h-149.333333a38.4 38.4 0 1 1 0-76.8h149.333333zM856.021333 829.845333a38.4 38.4 0 1 1 0 76.8h-149.333333a38.4 38.4 0 1 1 0-76.8h149.333333z m0-234.666666a38.4 38.4 0 1 1 0 76.8h-149.333333a38.4 38.4 0 1 1 0-76.8h149.333333z" p-id="11527"></path></svg>
    )
  }
)

if (__DEV__) {
  UsersOutlined.displayName = 'UsersOutlined'
}
  