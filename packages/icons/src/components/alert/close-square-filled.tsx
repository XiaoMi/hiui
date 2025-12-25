
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-close-square-filled')

export const CloseSquareFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1295"  ><path d="M810.666667 110.933333a102.4 102.4 0 0 1 102.4 102.4v597.333334a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V213.333333A102.4 102.4 0 0 1 213.333333 110.933333h597.333334z m-143.509334 245.909334a38.4 38.4 0 0 0-54.314666 0L512 457.728l-100.842667-100.842667a38.4 38.4 0 1 0-54.314666 54.272L457.728 512l-100.842667 100.842667a38.4 38.4 0 0 0 54.272 54.314666L512 566.272l100.842667 100.842667a38.4 38.4 0 1 0 54.314666-54.272L566.272 512l100.842667-100.842667a38.4 38.4 0 0 0 0-54.314666z" p-id="1296"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseSquareFilled.displayName = 'CloseSquareFilled'
}
  