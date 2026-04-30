
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-details-filled')

export const DetailsFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32237"  ><path d="M768 89.6A102.4 102.4 0 0 1 870.4 192v640c0 56.576-45.909333 102.4-102.442667 102.4H256.042667A102.421333 102.421333 0 0 1 153.6 832V192A102.4 102.4 0 0 1 256 89.6h512zM362.666667 526.933333a38.4 38.4 0 1 0 0 76.8h192a38.4 38.4 0 1 0 0-76.8h-192z m0-170.666666a38.4 38.4 0 1 0 0 76.8h298.666666a38.4 38.4 0 1 0 0-76.8H362.666667z" p-id="32238"></path></svg>
    )
  }
)

if (__DEV__) {
  DetailsFilled.displayName = 'DetailsFilled'
}
  