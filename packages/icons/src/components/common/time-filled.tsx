
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-time-filled')

export const TimeFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="30469"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333z m0 170.666667a38.4 38.4 0 0 0-38.4 38.4v214.613333a55.466667 55.466667 0 0 0 25.685333 46.805334l109.44 69.653333 0.682667 0.426667 0.725333 0.426666 55.424 32a38.4 38.4 0 1 0 38.4-66.517333l-54.613333-31.530667L550.4 490.88V288a38.4 38.4 0 0 0-38.4-38.4z" p-id="30470"></path></svg>
    )
  }
)

if (__DEV__) {
  TimeFilled.displayName = 'TimeFilled'
}
  