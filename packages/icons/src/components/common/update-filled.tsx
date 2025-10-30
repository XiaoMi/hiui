
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-update-filled')

export const UpdateFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31196"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333z m30.506667 242.56a38.4 38.4 0 0 0-54.314667 0l-120.682667 120.682667a38.4 38.4 0 1 0 54.314667 54.314667l54.954667-54.976v237.802666a38.4 38.4 0 0 0 76.8 0V441.173333l55.296 55.317334a38.4 38.4 0 1 0 54.293333-54.314667L542.506667 321.493333z" p-id="31197"></path></svg>
    )
  }
)

if (__DEV__) {
  UpdateFilled.displayName = 'UpdateFilled'
}
  