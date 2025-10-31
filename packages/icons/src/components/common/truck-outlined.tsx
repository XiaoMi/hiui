
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-truck-outlined')

export const TruckOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10618"  ><path d="M600.896 729.6a38.4 38.4 0 1 1 0 76.8h-149.333333a38.4 38.4 0 1 1 0-76.8h149.333333z"  p-id="10619"></path><path d="M626.496 501.333333V256a25.6 25.6 0 0 0-25.6-25.6h-384a25.6 25.6 0 0 0-25.6 25.6v448a25.6 25.6 0 0 0 25.6 25.6h80a38.4 38.4 0 1 1 0 76.8h-80a102.4 102.4 0 0 1-102.4-102.4V256a102.4 102.4 0 0 1 102.4-102.4h384a102.4 102.4 0 0 1 102.4 102.4v245.333333c0 15.317333 9.813333 28.928 24.341333 33.770667l13.397334 4.458667a38.4 38.4 0 0 1-24.277334 72.874666l-13.397333-4.48a112.384 112.384 0 0 1-76.864-106.624z"  p-id="10620"></path><path d="M391.829333 768a25.6 25.6 0 1 1-51.2 0 25.6 25.6 0 0 1 51.2 0z m76.8 0a102.4 102.4 0 1 0-204.8 0 102.4 102.4 0 0 0 204.8 0zM711.829333 768a25.6 25.6 0 1 1-51.2 0 25.6 25.6 0 0 1 51.2 0z m76.8 0a102.4 102.4 0 1 0-204.8 0 102.4 102.4 0 0 0 204.8 0z"  p-id="10621"></path><path d="M861.162667 704V469.333333a89.6 89.6 0 0 0-89.6-89.6h-106.666667v-76.8h106.666667a166.4 166.4 0 0 1 166.4 166.4v234.666667a102.4 102.4 0 0 1-102.4 102.4h-85.333334v-76.8h85.333334a25.6 25.6 0 0 0 25.6-25.6z"  p-id="10622"></path></svg>
    )
  }
)

if (__DEV__) {
  TruckOutlined.displayName = 'TruckOutlined'
}
  