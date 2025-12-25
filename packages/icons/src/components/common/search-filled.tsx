
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-search-filled')

export const SearchFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5308"  ><path d="M470.933333 101.866667c203.84 0 369.066667 165.248 369.066667 369.066666 0 88.106667-30.869333 168.96-82.368 232.405334l153.237333 153.237333a38.4 38.4 0 0 1-54.314666 54.293333l-153.237334-153.237333a367.488 367.488 0 0 1-232.384 82.368c-203.818667 0-369.066667-165.226667-369.066666-369.066667 0-203.818667 165.248-369.066667 369.066666-369.066666z"  p-id="5309"></path></svg>
    )
  }
)

if (__DEV__) {
  SearchFilled.displayName = 'SearchFilled'
}
  