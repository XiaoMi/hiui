
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-flag-filled')

export const FlagFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24087"  ><path d="M110.933333 128a38.4 38.4 0 1 1 76.8 0v768a38.4 38.4 0 1 1-76.8 0V128z" p-id="24088"></path><path d="M149.333333 192a417.792 417.792 0 0 1 374.997334-24.512l34.304 14.549333a310.229333 310.229333 0 0 0 247.146666-2.090666A48.981333 48.981333 0 0 1 874.666667 224.704v372.266667a37.973333 37.973333 0 0 1-18.709334 32.704 379.690667 379.690667 0 0 1-337.066666 23.829333l-57.749334-23.786667a320.064 320.064 0 0 0-258.133333 6.357334L149.333333 661.333333V192z" p-id="24089"></path><path d="M836.266667 224.704a10.581333 10.581333 0 0 0-14.890667-9.664 348.650667 348.650667 0 0 1-277.76 2.346667l-34.282667-14.528a379.392 379.392 0 0 0-321.6 11.818666v386.154667a358.464 358.464 0 0 1 288-6.613333l57.770667 23.786666a341.269333 341.269333 0 0 0 302.762667-21.333333V224.725333z m76.8 372.266667a76.373333 76.373333 0 0 1-37.653334 65.792 418.090667 418.090667 0 0 1-371.157333 26.24l-57.728-23.765334a281.664 281.664 0 0 0-227.178667 5.589334L110.933333 721.813333V192H149.333333l-19.477333-33.109333A456.213333 456.213333 0 0 1 539.306667 132.138667l34.304 14.549333A271.829333 271.829333 0 0 0 790.186667 144.853333c57.792-25.685333 122.88 16.618667 122.88 79.850667v372.266667z" p-id="24090"></path></svg>
    )
  }
)

if (__DEV__) {
  FlagFilled.displayName = 'FlagFilled'
}
  