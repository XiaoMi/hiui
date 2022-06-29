
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-paste-filled')

export const PasteFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M234.666667 277.333333v85.333334a42.666667 42.666667 0 0 0-42.56 39.466666L192 405.333333v384a42.666667 42.666667 0 0 0 39.466667 42.56L234.666667 832h384a42.666667 42.666667 0 0 0 42.56-39.466667L661.333333 789.333333h85.333334a128 128 0 0 1-123.2 127.914667L618.666667 917.333333H234.666667a128 128 0 0 1-127.914667-123.2L106.666667 789.333333V405.333333a128 128 0 0 1 123.2-127.914666L234.666667 277.333333z m554.666666-170.666666a128 128 0 0 1 127.914667 123.2L917.333333 234.666667v384a128 128 0 0 1-123.2 127.914666L789.333333 746.666667H405.333333a128 128 0 0 1-127.914666-123.2L277.333333 618.666667V234.666667a128 128 0 0 1 123.2-127.914667L405.333333 106.666667h384z m-106.666666 362.666666h-170.666667a42.666667 42.666667 0 1 0 0 85.333334h170.666667a42.666667 42.666667 0 1 0 0-85.333334z m0-149.333333h-170.666667a42.666667 42.666667 0 1 0 0 85.333333h170.666667a42.666667 42.666667 0 1 0 0-85.333333z" p-id="44796"></path></svg>
    )
  }
)

if (__DEV__) {
  PasteFilled.displayName = 'PasteFilled'
}
  