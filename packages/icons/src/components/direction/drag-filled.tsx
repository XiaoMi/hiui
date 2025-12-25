
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-drag-filled')

export const DragFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2216"  ><path d="M640.170667 262.698667L886.613333 489.813333c1.194667 1.109333 2.325333 2.346667 3.328 3.690667 9.237333 12.266667 7.744 30.464-3.328 40.682667L640.170667 761.301333c-4.693333 4.330667-10.624 6.698667-16.725334 6.698667-14.421333 0-26.112-12.928-26.112-28.885333V284.885333c0-6.762667 2.133333-13.312 6.058667-18.496 9.237333-12.245333 25.685333-13.909333 36.778667-3.690666zM383.829333 262.698667L137.386667 489.813333c-1.194667 1.109333-2.325333 2.346667-3.328 3.690667-9.237333 12.266667-7.744 30.464 3.328 40.682667l246.442666 227.114666c4.693333 4.330667 10.624 6.698667 16.725334 6.698667 14.421333 0 26.112-12.928 26.112-28.885333V284.885333c0-6.762667-2.133333-13.312-6.058667-18.496-9.237333-12.245333-25.685333-13.909333-36.778667-3.690666z" p-id="2217"></path></svg>
    )
  }
)

if (__DEV__) {
  DragFilled.displayName = 'DragFilled'
}
  