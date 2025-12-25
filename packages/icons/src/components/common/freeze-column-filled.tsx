
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-freeze-column-filled')

export const FreezeColumnFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5160"  ><path d="M213.333333 430.933333V181.333333A96 96 0 0 1 309.333333 85.333333h405.333334A96 96 0 0 1 810.666667 181.333333v249.6H213.333333z m597.333334 411.733334c0 53.056-43.093333 96-96.064 96H309.397333A96.042667 96.042667 0 0 1 213.333333 842.666667V507.733333h597.333334v334.933334zM401.066667 234.666667a38.4 38.4 0 1 0-76.8 0v42.666666a38.4 38.4 0 1 0 76.8 0v-42.666666z m0 426.666666a38.4 38.4 0 1 0-76.8 0v42.666667a38.4 38.4 0 1 0 76.8 0v-42.666667z" p-id="5161"></path></svg>
    )
  }
)

if (__DEV__) {
  FreezeColumnFilled.displayName = 'FreezeColumnFilled'
}
  