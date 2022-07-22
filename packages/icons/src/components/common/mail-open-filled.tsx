
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-mail-open-filled')

export const MailOpenFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M531.050667 116.522667l336.789333 168.106666A128 128 0 0 1 938.666667 399.189333V789.333333a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V399.146667a128 128 0 0 1 70.826667-114.496l336.789333-168.106667a42.666667 42.666667 0 0 1 38.101334 0zM512 202.389333L194.346667 360.938667 512 546.496l317.632-185.557333L512 202.389333z" p-id="15001"></path></svg>
    )
  }
)

if (__DEV__) {
  MailOpenFilled.displayName = 'MailOpenFilled'
}
  