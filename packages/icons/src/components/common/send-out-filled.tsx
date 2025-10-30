
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-send-out-filled')

export const SendOutFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28226"  ><path d="M798.506667 171.84c33.066667-10.602667 64.277333 20.586667 53.674666 53.653333l-192.213333 599.210667c-12.48 38.976-67.392 39.68-80.896 1.024L487.317333 562.986667a42.752 42.752 0 0 0-26.24-26.261334L198.272 444.928c-38.634667-13.482667-37.930667-68.394667 1.045333-80.896l599.210667-192.213333z" p-id="28227"></path><path d="M788.757333 141.354667c57.834667-18.56 112.448 36.053333 93.888 93.909333l-192.170666 599.210667c-21.888 68.224-117.973333 69.418667-141.610667 1.792l-91.776-262.741334a10.752 10.752 0 0 0-6.549333-6.592L187.733333 475.157333c-67.626667-23.637333-66.410667-119.722667 1.813334-141.610666l599.210666-192.192z m32.938667 74.368a10.666667 10.666667 0 0 0-13.397333-13.418667L209.088 394.496a10.666667 10.666667 0 0 0-0.256 20.224l262.805333 91.797333a74.773333 74.773333 0 0 1 45.866667 45.909334l91.797333 262.762666a10.666667 10.666667 0 0 0 20.224-0.256l192.170667-599.210666z" p-id="28228"></path></svg>
    )
  }
)

if (__DEV__) {
  SendOutFilled.displayName = 'SendOutFilled'
}
  