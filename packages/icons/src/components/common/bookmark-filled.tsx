
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
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M746.666667 85.333333a128 128 0 0 1 128 128v597.333334a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h469.333334z m-64 85.333334h-170.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v184.896l0.106667 3.136c2.112 29.909333 34.218667 48.725333 61.653333 35.029334L597.333333 403.242667l66.261334 33.152A42.666667 42.666667 0 0 0 725.333333 398.208V213.333333a42.666667 42.666667 0 0 0-42.666666-42.666666z" p-id="14931"></path></svg>
    )
  }
)

if (__DEV__) {
  BookmarkFilled.displayName = 'BookmarkFilled'
}
  