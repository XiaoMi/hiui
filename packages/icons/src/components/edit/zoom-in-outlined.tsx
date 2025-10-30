
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-zoom-in-outlined')

export const ZoomInOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10189"  ><path d="M671.04 269.226667c109.973333 109.973333 109.973333 288.277333 0 398.250666-109.973333 109.973333-288.277333 109.973333-398.250667 0-109.973333-109.973333-109.973333-288.277333 0-398.250666 109.973333-109.973333 288.277333-109.973333 398.250667 0zM725.333333 214.933333c-139.946667-139.946667-366.869333-139.946667-506.837333 0-139.946667 139.946667-139.946667 366.890667 0 506.837334 139.946667 139.968 366.890667 139.968 506.837333 0 139.968-139.946667 139.968-366.869333 0-506.837334z"  p-id="10190"></path><path d="M605.098667 435.136a38.4 38.4 0 1 1 0 76.8h-256a38.4 38.4 0 1 1 0-76.8h256z"  p-id="10191"></path><path d="M515.498667 601.536a38.4 38.4 0 1 1-76.8 0v-256a38.4 38.4 0 1 1 76.8 0v256zM852.053333 902.805333l-165.930666-165.952a38.4 38.4 0 1 1 54.314666-54.293333l165.930667 165.930667a38.4 38.4 0 1 1-54.314667 54.314666z"  p-id="10192"></path></svg>
    )
  }
)

if (__DEV__) {
  ZoomInOutlined.displayName = 'ZoomInOutlined'
}
  