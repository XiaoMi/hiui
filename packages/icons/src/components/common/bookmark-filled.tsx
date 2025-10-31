
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-bookmark-filled')

export const BookmarkFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7070"  ><path d="M774.4 89.642667a96 96 0 0 1 96 96v652.714666a96 96 0 0 1-96 96H249.6a96 96 0 0 1-96-96V185.642667a96 96 0 0 1 96-96h524.8zM554.666667 143.317333a42.666667 42.666667 0 0 0-42.666667 42.666667v202.837333a21.333333 21.333333 0 0 0 31.786667 18.602667l66.56-37.333333a21.333333 21.333333 0 0 1 20.885333 0l66.581333 37.333333a21.333333 21.333333 0 0 0 31.786667-18.602667V185.984a42.666667 42.666667 0 0 0-42.666667-42.666667H554.666667z" p-id="7071"></path></svg>
    )
  }
)

if (__DEV__) {
  BookmarkFilled.displayName = 'BookmarkFilled'
}
  