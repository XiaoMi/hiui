
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-shopping-cart-outlined')

export const ShoppingCartOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25895"  ><path d="M101.589333 122.389333c54.208-8.192 94.058667 17.28 119.168 47.893334 15.189333 18.538667 25.856 39.744 32.874667 59.029333h599.04a102.4 102.4 0 0 1 101.461333 116.309333l-46.442666 339.029334a102.4 102.4 0 0 1-101.461334 88.490666h-461.653333a102.4 102.4 0 0 1-101.461333-88.490666l-56.192-410.24c-3.264-15.850667-11.818667-38.677333-25.578667-55.445334-12.906667-15.744-27.797333-23.744-48.298667-20.650666a38.4 38.4 0 1 1-11.456-75.946667z m217.6 551.850667a25.6 25.6 0 0 0 25.386667 22.122667h461.653333a25.6 25.6 0 0 0 25.344-22.122667l46.464-339.050667a25.6 25.6 0 0 0-25.344-29.077333H268.778667l50.432 368.128z" p-id="25896"></path><path d="M936.576 831.232a71.914667 71.914667 0 1 1-143.850667 0 71.914667 71.914667 0 0 1 143.850667 0zM358.058667 830.784a71.466667 71.466667 0 1 1-142.933334 0 71.466667 71.466667 0 0 1 142.933334 0z" p-id="25897"></path></svg>
    )
  }
)

if (__DEV__) {
  ShoppingCartOutlined.displayName = 'ShoppingCartOutlined'
}
  