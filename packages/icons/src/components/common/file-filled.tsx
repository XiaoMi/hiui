
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-filled')

export const FileFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M554.986667 85.290667c-0.213333 1.898667-0.32 3.84-0.32 5.824v265.877333A48.341333 48.341333 0 0 0 603.008 405.333333H868.906667c1.984 0 3.925333-0.106667 5.802666-0.32L874.666667 810.666667a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128l277.653334-0.042666zM640 115.498667a21.333333 21.333333 0 0 1 15.082667 6.250666l183.168 183.168A21.333333 21.333333 0 0 1 823.168 341.333333H661.333333a42.666667 42.666667 0 0 1-42.666666-42.666666V136.832a21.333333 21.333333 0 0 1 21.333333-21.333333z" p-id="15131"></path></svg>
    )
  }
)

if (__DEV__) {
  FileFilled.displayName = 'FileFilled'
}
  