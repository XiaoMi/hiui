
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-smile-filled')

export const SmileFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28985"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333z m149.653333 508.032a38.4 38.4 0 0 0-53.354666 10.048C590.058667 623.744 551.232 644.266667 512 644.266667c-39.232 0-78.058667-20.522667-96.298667-47.253334a38.4 38.4 0 1 0-63.402666 43.306667C386.218667 690.005333 449.92 721.066667 512 721.066667c62.08 0 125.781333-31.061333 159.701333-80.746667a38.4 38.4 0 0 0-10.048-53.354667zM373.333333 384a53.333333 53.333333 0 1 0 0 106.666667 53.333333 53.333333 0 0 0 0-106.666667z m277.333334 0a53.333333 53.333333 0 1 0 0 106.666667 53.333333 53.333333 0 0 0 0-106.666667z" p-id="28986"></path></svg>
    )
  }
)

if (__DEV__) {
  SmileFilled.displayName = 'SmileFilled'
}
  