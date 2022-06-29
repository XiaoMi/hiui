
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-block-outlined')

export const BlockOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M576 106.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v170.666667h170.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v384a85.333333 85.333333 0 0 1-85.333333 85.333333H448a85.333333 85.333333 0 0 1-85.333333-85.333333v-170.666667H192a85.333333 85.333333 0 0 1-85.333333-85.333333V192a85.333333 85.333333 0 0 1 85.333333-85.333333h384z m256 341.333333h-170.666667v128a85.333333 85.333333 0 0 1-85.333333 85.333333h-128v170.666667h384V448zM576 192H192v384h170.666667v-128a85.333333 85.333333 0 0 1 85.333333-85.333333h128V192z m0 256h-128v128h128v-128z" p-id="39185"></path></svg>
    )
  }
)

if (__DEV__) {
  BlockOutlined.displayName = 'BlockOutlined'
}
  