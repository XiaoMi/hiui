
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-add-circle-filled')

export const AddCircleFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11495"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333z m0 213.653334a38.4 38.4 0 0 0-38.4 38.4V473.6h-142.613333a38.4 38.4 0 1 0 0 76.778667H473.6v142.613333a38.4 38.4 0 1 0 76.778667 0V550.4h142.634666a38.378667 38.378667 0 1 0 0-76.778667H550.4v-142.613333a38.4 38.4 0 0 0-38.378667-38.4z" p-id="11496"></path></svg>
    )
  }
)

if (__DEV__) {
  AddCircleFilled.displayName = 'AddCircleFilled'
}
  