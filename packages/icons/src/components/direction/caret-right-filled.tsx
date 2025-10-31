
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-caret-right-filled')

export const CaretRightFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12245"  ><path d="M651.946667 489.813333L405.504 262.698667c-11.093333-10.218667-27.541333-8.554667-36.778667 3.690666-3.925333 5.184-6.058667 11.733333-6.058666 18.496v454.229334c0 15.957333 11.690667 28.885333 26.112 28.885333 6.101333 0 12.032-2.368 16.725333-6.698667L651.946667 534.186667c11.072-10.218667 12.565333-28.416 3.328-40.682667-1.002667-1.344-2.133333-2.56-3.328-3.690667z" p-id="12246"></path></svg>
    )
  }
)

if (__DEV__) {
  CaretRightFilled.displayName = 'CaretRightFilled'
}
  