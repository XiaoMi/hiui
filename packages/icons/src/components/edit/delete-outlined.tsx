
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-delete-outlined')

export const DeleteOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24966"  ><path d="M185.6 823.04v-550.4h76.8v550.4a25.6 25.6 0 0 0 25.6 25.6h448a25.6 25.6 0 0 0 25.6-25.6v-550.4h76.8v550.4a102.4 102.4 0 0 1-102.4 102.4h-448a102.4 102.4 0 0 1-102.4-102.4z" p-id="24967"></path><path d="M170.666667 240.64h682.666666a38.4 38.4 0 1 1 0 76.8H170.666667a38.4 38.4 0 1 1 0-76.8zM388.266667 688.789333V466.88a38.4 38.4 0 1 1 76.8 0v221.909333a38.4 38.4 0 1 1-76.8 0zM558.933333 688.789333V466.88a38.4 38.4 0 1 1 76.8 0v221.909333a38.4 38.4 0 1 1-76.8 0zM392.042667 170.496a38.4 38.4 0 1 1 0-76.8h243.797333a38.4 38.4 0 1 1 0 76.8H392.042667z" p-id="24968"></path></svg>
    )
  }
)

if (__DEV__) {
  DeleteOutlined.displayName = 'DeleteOutlined'
}
  