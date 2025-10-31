
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-mail-outlined')

export const MailOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21200"  ><path d="M849.514667 210.218667a38.4 38.4 0 1 1 44.970666 62.250666L571.946667 505.386667a102.4 102.4 0 0 1-119.893334 0L129.493333 272.448A38.4 38.4 0 1 1 174.506667 210.218667l322.538666 232.938666a25.6 25.6 0 0 0 29.952 0l322.56-232.96z" p-id="21201"></path><path d="M192 241.066667a25.6 25.6 0 0 0-25.6 25.6v490.666666A25.6 25.6 0 0 0 192 782.933333h640a25.6 25.6 0 0 0 25.6-25.6v-490.666666a25.6 25.6 0 0 0-25.6-25.6H192z m640-76.8a102.4 102.4 0 0 1 102.4 102.4v490.666666a102.4 102.4 0 0 1-102.4 102.4H192a102.4 102.4 0 0 1-102.4-102.4v-490.666666A102.4 102.4 0 0 1 192 164.266667h640z" p-id="21202"></path></svg>
    )
  }
)

if (__DEV__) {
  MailOutlined.displayName = 'MailOutlined'
}
  