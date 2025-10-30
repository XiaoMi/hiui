
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-mobile-filled')

export const MobileFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26302"  ><path d="M827.733333 853.333333a102.4 102.4 0 0 1-102.4 102.4H298.666667A102.4 102.4 0 0 1 196.266667 853.333333V170.666667A102.4 102.4 0 0 1 298.666667 68.266667h426.666666A102.4 102.4 0 0 1 827.733333 170.666667v682.666666z m-262.4-64a53.333333 53.333333 0 1 0-106.666666 0 53.333333 53.333333 0 0 0 106.666666 0z" p-id="26303"></path></svg>
    )
  }
)

if (__DEV__) {
  MobileFilled.displayName = 'MobileFilled'
}
  