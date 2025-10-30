
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-mail-filled')

export const MailFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25544"  ><path d="M93.866667 243.712l58.666666 45.333333 0.469334 0.384 0.512 0.362667L452.053333 505.386667a102.4 102.4 0 0 0 119.936 0L870.016 290.133333l62.357333-43.669333c1.301333 6.528 2.026667 13.290667 2.026667 20.202667v490.666666a102.4 102.4 0 0 1-102.4 102.4H192a102.4 102.4 0 0 1-102.4-102.4v-490.666666c0-8.32 1.002667-16.405333 2.88-24.149334l1.365333 1.194667zM832 164.266667c21.546667 0 41.557333 6.677333 58.069333 18.069333l-64.085333 44.864-0.469333 0.341333-298.538667 215.616a25.6 25.6 0 0 1-29.973333 0L199.338667 228.138667 140.8 182.933333a38.698667 38.698667 0 0 0-3.882667-2.602666A101.909333 101.909333 0 0 1 192 164.266667h640z" p-id="25545"></path></svg>
    )
  }
)

if (__DEV__) {
  MailFilled.displayName = 'MailFilled'
}
  