
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-mail-filled')

export const MailFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M938.666667 277.333333v469.333334a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V277.333333c0-26.624 8.128-51.370667 22.058667-71.850666a42.666667 42.666667 0 0 0 16.021333 41.749333l362.666667 277.333333 2.944 2.048a42.666667 42.666667 0 0 0 48.896-2.048l362.666667-277.333333 2.688-2.24a42.666667 42.666667 0 0 0 13.333333-39.509333A127.424 127.424 0 0 1 938.666667 277.333333z m-128-128c26.666667 0 51.413333 8.149333 71.893333 22.08a42.517333 42.517333 0 0 0-33.813333 8.021334L512 436.949333 175.253333 179.456l-2.858666-2.026667a42.56 42.56 0 0 0-30.933334-6.037333A127.466667 127.466667 0 0 1 213.333333 149.333333h597.333334z" p-id="15161"></path></svg>
    )
  }
)

if (__DEV__) {
  MailFilled.displayName = 'MailFilled'
}
  