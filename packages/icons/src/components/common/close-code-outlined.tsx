
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-close-code-outlined')

export const CloseCodeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M294.954667 153.152A42.666667 42.666667 0 0 1 317.44 206.506667l-1.258667 3.093333L179.008 512l137.173333 302.378667a42.666667 42.666667 0 0 1-18.24 54.976l-2.986666 1.493333a42.666667 42.666667 0 0 1-54.976-18.24l-1.493334-2.986667-145.173333-320a42.666667 42.666667 0 0 1-1.493333-31.466666l1.493333-3.776 145.173333-320a42.666667 42.666667 0 0 1 56.469334-21.226667z m438.272 0a42.666667 42.666667 0 0 1 56.469333 21.226667l145.173333 320 1.493334 3.776a42.666667 42.666667 0 0 1-1.493334 31.466666l-145.173333 320-1.493333 2.986667a42.666667 42.666667 0 0 1-54.976 18.24l-2.986667-1.493333a42.666667 42.666667 0 0 1-18.24-54.976l137.173333-302.4-137.173333-302.357334-1.28-3.093333A42.666667 42.666667 0 0 1 733.226667 153.173333z m-89.194667-1.216a42.666667 42.666667 0 0 1 26.389333 51.584l-1.024 3.178667-234.666666 640a42.666667 42.666667 0 0 1-81.152-26.218667l1.024-3.178667 234.666666-640a42.666667 42.666667 0 0 1 54.762667-25.365333z" p-id="39285"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseCodeOutlined.displayName = 'CloseCodeOutlined'
}
  