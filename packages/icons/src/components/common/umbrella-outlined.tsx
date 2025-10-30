
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-umbrella-outlined')

export const UmbrellaOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10912"  ><path d="M512 92.181333a401.066667 401.066667 0 0 1 283.605333 117.461334c62.293333 62.293333 99.413333 167.765333 112.213334 257.066666 8.853333 61.653333-42.112 107.605333-97.152 107.605334H213.333333c-55.04 0-106.026667-45.973333-97.152-107.605334 12.8-89.301333 49.92-194.773333 112.213334-257.066666A401.066667 401.066667 0 0 1 512 92.181333z m0 76.8a324.266667 324.266667 0 0 0-229.290667 94.976c-45.589333 45.589333-78.826667 132.16-90.517333 213.674667a15.061333 15.061333 0 0 0 4.266667 13.056c3.669333 3.882667 9.621333 6.826667 16.874666 6.826667h597.333334c7.253333 0 13.226667-2.944 16.896-6.826667a15.061333 15.061333 0 0 0 4.266666-13.056c-11.712-81.514667-44.949333-168.085333-90.538666-213.674667A324.266667 324.266667 0 0 0 512 168.981333z" p-id="10913"></path><path d="M432.490667 828.778667a38.4 38.4 0 1 0-54.293334 54.293333l18.730667 18.752a102.421333 102.421333 0 0 0 174.805333-72.405333V578.56a38.4 38.4 0 1 0-76.8 0V829.44a25.6 25.6 0 0 1-43.690666 18.090667l-18.773334-18.730667z" p-id="10914"></path></svg>
    )
  }
)

if (__DEV__) {
  UmbrellaOutlined.displayName = 'UmbrellaOutlined'
}
  