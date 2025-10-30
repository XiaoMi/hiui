
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-freeze-column-outlined')

export const FreezeColumnOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8405"  ><path d="M228.309333 198.4a25.6 25.6 0 0 0-25.6 25.6v576a25.6 25.6 0 0 0 25.6 25.6h576a25.6 25.6 0 0 0 25.6-25.6v-576a25.6 25.6 0 0 0-25.6-25.6h-576z m576-76.8a102.4 102.4 0 0 1 102.4 102.4v576a102.4 102.4 0 0 1-102.4 102.4h-576a102.4 102.4 0 0 1-102.4-102.4v-576a102.4 102.4 0 0 1 102.4-102.4h576z" p-id="8406"></path><path d="M388.309333 667.733333h-213.333333a38.4 38.4 0 1 1 0-76.8h213.333333a38.4 38.4 0 1 1 0 76.8zM388.309333 433.066667h-213.333333a38.4 38.4 0 1 1 0-76.8h213.333333a38.4 38.4 0 1 1 0 76.8z" p-id="8407"></path><path d="M360.576 842.666667v-682.666667a38.4 38.4 0 1 1 76.8 0v682.666667a38.4 38.4 0 1 1-76.8 0z" p-id="8408"></path></svg>
    )
  }
)

if (__DEV__) {
  FreezeColumnOutlined.displayName = 'FreezeColumnOutlined'
}
  