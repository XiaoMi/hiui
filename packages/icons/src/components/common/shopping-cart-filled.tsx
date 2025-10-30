
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-shopping-cart-filled')

export const ShoppingCartFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28692"  ><path d="M224.725333 267.712h627.925334a64 64 0 0 1 63.424 72.682667L869.610667 679.466667a64 64 0 0 1-63.402667 55.317333H344.533333a64 64 0 0 1-63.402666-55.317333l-56.426667-411.733334z" p-id="28693"></path><path d="M101.546667 122.389333c54.229333-8.192 94.08 17.28 119.189333 47.893334 15.189333 18.538667 25.856 39.744 32.896 59.029333h599.04a102.4 102.4 0 0 1 101.44 116.309333l-46.442667 339.029334a102.4 102.4 0 0 1-101.461333 88.490666H344.533333a102.4 102.4 0 0 1-101.461333-88.490666l-56.192-410.24c-3.264-15.850667-11.818667-38.677333-25.578667-55.445334-12.906667-15.744-27.797333-23.744-48.298666-20.650666a38.4 38.4 0 1 1-11.456-75.946667z m217.642666 551.850667a25.6 25.6 0 0 0 25.386667 22.122667H806.186667a25.6 25.6 0 0 0 25.344-22.122667l46.464-339.050667a25.6 25.6 0 0 0-25.344-29.077333H268.736l50.453333 368.128z" p-id="28694"></path><path d="M936.554667 831.232a71.914667 71.914667 0 1 1-143.850667 0 71.914667 71.914667 0 0 1 143.850667 0zM358.037333 830.784a71.466667 71.466667 0 1 1-142.933333 0 71.466667 71.466667 0 0 1 142.933333 0z" p-id="28695"></path></svg>
    )
  }
)

if (__DEV__) {
  ShoppingCartFilled.displayName = 'ShoppingCartFilled'
}
  