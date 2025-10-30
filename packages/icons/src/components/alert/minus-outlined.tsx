
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-minus-outlined')

export const MinusOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8873"  ><path d="M132.8 473.6c-23.829333 0-43.136 17.194667-43.136 38.4s19.306667 38.4 43.136 38.4h767.061333c23.829333 0 43.136-17.194667 43.136-38.4s-19.306667-38.4-43.136-38.4H132.8z" p-id="8874"></path></svg>
    )
  }
)

if (__DEV__) {
  MinusOutlined.displayName = 'MinusOutlined'
}
  