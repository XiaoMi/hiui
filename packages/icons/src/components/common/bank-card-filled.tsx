
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-bank-card-filled')

export const BankCardFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6633"  ><path d="M934.4 768a102.4 102.4 0 0 1-102.4 102.4H192A102.4 102.4 0 0 1 89.6 768V422.4h844.8V768zM256 665.6a38.4 38.4 0 1 0 0 76.8h138.666667a38.4 38.4 0 1 0 0-76.8H256z m576-512a102.4 102.4 0 0 1 102.4 102.4v89.6H89.6V256A102.4 102.4 0 0 1 192 153.6h640z" p-id="6634"></path></svg>
    )
  }
)

if (__DEV__) {
  BankCardFilled.displayName = 'BankCardFilled'
}
  