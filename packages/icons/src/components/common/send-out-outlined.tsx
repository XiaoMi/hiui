
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-send-out-outlined')

export const SendOutOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25312"  ><path d="M786.794667 135.253333c62.805333-20.117333 122.069333 39.168 101.952 101.973334l-192.213334 599.210666c-23.765333 74.069333-128.064 75.370667-153.706666 1.962667l-91.797334-262.741333a4.352 4.352 0 0 0-2.624-2.666667L185.6 481.194667c-73.429333-25.642667-72.106667-129.962667 1.962667-153.728l599.253333-192.213334z m27.776 74.197334a4.565333 4.565333 0 0 0-2.005334-1.216 3.904 3.904 0 0 0-2.325333 0.170666l-599.210667 192.213334a5.909333 5.909333 0 0 0-1.706666 0.768 2.389333 2.389333 0 0 0-0.533334 0.576 4.864 4.864 0 0 0-0.725333 2.645333c0 1.28 0.362667 2.197333 0.682667 2.666667 0.128 0.213333 0.277333 0.405333 0.512 0.576 0.213333 0.192 0.725333 0.512 1.664 0.853333l262.826666 91.776a81.152 81.152 0 0 1 49.792 49.834667l91.776 262.762666a5.504 5.504 0 0 0 0.853334 1.642667 2.346667 2.346667 0 0 0 0.576 0.554667 4.821333 4.821333 0 0 0 2.666666 0.64c1.258667 0 2.154667-0.384 2.624-0.704a2.389333 2.389333 0 0 0 0.576-0.554667 6.016 6.016 0 0 0 0.789334-1.685333l192.213333-599.210667a3.925333 3.925333 0 0 0 0.149333-2.304 4.586667 4.586667 0 0 0-1.194666-2.005333z" p-id="25313"></path></svg>
    )
  }
)

if (__DEV__) {
  SendOutOutlined.displayName = 'SendOutOutlined'
}
  