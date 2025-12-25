
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-business-card-transverse-filled')

export const BusinessCardTransverseFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5191"  ><path d="M832 153.6a102.4 102.4 0 0 1 102.4 102.4v512a102.4 102.4 0 0 1-102.4 102.4H192a102.421333 102.421333 0 0 1-102.4-102.442667V256.042667A102.421333 102.421333 0 0 1 192 153.6h640zM373.333333 501.333333c-37.824 0-74.538667 15.189333-101.866666 39.210667C244.032 564.650667 224 599.552 224 640a32 32 0 0 0 64 0c0-18.474667 9.173333-36.885333 25.685333-51.413333 16.597333-14.570667 38.570667-23.253333 59.648-23.253334 21.077333 0 43.050667 8.682667 59.648 23.253334 16.512 14.528 25.685333 32.938667 25.685334 51.413333a32 32 0 0 0 64 0c0-40.448-20.053333-75.370667-47.466667-99.456-27.328-24.021333-64.042667-39.210667-101.866667-39.210667z m256 57.6a38.4 38.4 0 1 0 0 76.8h64a38.4 38.4 0 1 0 0-76.8h-64z m-256-206.933333a74.666667 74.666667 0 1 0 0 149.333333 74.666667 74.666667 0 0 0 0-149.333333z m256 36.266667a38.4 38.4 0 1 0 0 76.8h128a38.4 38.4 0 1 0 0-76.8h-128z" p-id="5192"></path></svg>
    )
  }
)

if (__DEV__) {
  BusinessCardTransverseFilled.displayName = 'BusinessCardTransverseFilled'
}
  