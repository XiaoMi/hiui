
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-travel-outlined')

export const TravelOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10472"  ><path d="M776.576 298.666667a25.6 25.6 0 0 0-25.6-25.6h-469.333333a25.6 25.6 0 0 0-25.6 25.6v469.333333a25.6 25.6 0 0 0 25.6 25.6h469.333333a25.6 25.6 0 0 0 25.6-25.6V298.666667z m76.8 469.333333a102.4 102.4 0 0 1-102.4 102.4h-469.333333a102.4 102.4 0 0 1-102.4-102.4V298.666667a102.4 102.4 0 0 1 102.4-102.4h469.333333a102.4 102.4 0 0 1 102.4 102.4v469.333333z" p-id="10473"></path><path d="M605.909333 213.333333V170.666667a4.266667 4.266667 0 0 0-4.266666-4.266667h-170.666667a4.266667 4.266667 0 0 0-4.266667 4.266667v35.562666a38.4 38.4 0 0 1-76.8 0V170.666667a81.066667 81.066667 0 0 1 81.066667-81.066667h170.666667a81.066667 81.066667 0 0 1 81.066666 81.066667v42.666666a38.4 38.4 0 1 1-76.8 0zM392.576 405.333333a38.4 38.4 0 1 1 76.8 0v256a38.4 38.4 0 1 1-76.8 0V405.333333zM563.242667 405.333333a38.4 38.4 0 1 1 76.8 0v256a38.4 38.4 0 1 1-76.8 0V405.333333zM371.242667 853.333333a38.4 38.4 0 1 1 76.8 0v42.666667a38.4 38.4 0 1 1-76.8 0v-42.666667zM584.576 853.333333a38.4 38.4 0 1 1 76.8 0v42.666667a38.4 38.4 0 1 1-76.8 0v-42.666667z" p-id="10474"></path></svg>
    )
  }
)

if (__DEV__) {
  TravelOutlined.displayName = 'TravelOutlined'
}
  