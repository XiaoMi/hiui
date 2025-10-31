
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-caret-up-filled')

export const CaretUpFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12535"  ><path d="M489.813333 372.053333L262.698667 618.496c-10.218667 11.093333-8.554667 27.541333 3.690666 36.778667 5.184 3.925333 11.733333 6.058667 18.496 6.058666h454.229334c15.957333 0 28.885333-11.690667 28.885333-26.112 0-6.101333-2.368-12.032-6.698667-16.725333L534.186667 372.053333c-10.218667-11.072-28.416-12.565333-40.682667-3.328-1.344 1.002667-2.56 2.133333-3.690667 3.328z" p-id="12536"></path></svg>
    )
  }
)

if (__DEV__) {
  CaretUpFilled.displayName = 'CaretUpFilled'
}
  