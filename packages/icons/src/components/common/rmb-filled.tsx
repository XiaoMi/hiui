
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-rmb-filled')

export const RmbFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28081"  ><path d="M512 68.266667c245.056 0 443.733333 198.656 443.733333 443.733333 0 245.056-198.677333 443.733333-443.733333 443.733333-245.077333 0-443.733333-198.677333-443.733333-443.733333C68.266667 266.922667 266.944 68.266667 512 68.266667z m120.490667 267.242666a38.4 38.4 0 0 0-54.314667 0L512 401.706667l-66.176-66.176a38.4 38.4 0 1 0-54.314667 54.293333l45.568 45.546667H405.333333a38.4 38.4 0 0 0 0 76.8h68.266667v29.866666H405.333333a38.4 38.4 0 0 0 0 76.8h68.266667v50.496a38.4 38.4 0 1 0 76.8 0v-50.496H618.666667a38.4 38.4 0 1 0 0-76.8h-68.266667v-29.866666H618.666667a38.4 38.4 0 1 0 0-76.8h-31.744l45.568-45.568a38.4 38.4 0 0 0 0-54.272z" p-id="28082"></path></svg>
    )
  }
)

if (__DEV__) {
  RmbFilled.displayName = 'RmbFilled'
}
  