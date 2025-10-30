
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-pause-filled')

export const PauseFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26884"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333z m-117.333333 277.333334a38.4 38.4 0 0 0-38.4 38.4v234.666666a38.4 38.4 0 1 0 76.8 0v-234.666666a38.4 38.4 0 0 0-38.4-38.4z m234.666666 0a38.4 38.4 0 0 0-38.4 38.4v234.666666a38.4 38.4 0 1 0 76.8 0v-234.666666a38.4 38.4 0 0 0-38.4-38.4z" p-id="26885"></path></svg>
    )
  }
)

if (__DEV__) {
  PauseFilled.displayName = 'PauseFilled'
}
  