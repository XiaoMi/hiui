
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
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25689"  ><path d="M458.602667 142.122667a102.4 102.4 0 0 1 106.794666 0l350.613334 214.272a38.4 38.4 0 0 1 18.325333 34.922666l0.064 1.664v401.514667a102.4 102.4 0 0 1-102.4 102.4H192a102.4 102.4 0 0 1-102.4-102.4V392.981333c0-0.554667 0-1.109333 0.042667-1.664a38.4 38.4 0 0 1 18.346666-34.922666L458.581333 142.122667z m66.752 65.536a25.621333 25.621333 0 0 0-26.709334 0L201.642667 389.141333l297.002666 181.525334a25.6 25.6 0 0 0 26.709334 0l296.96-181.525334-296.96-181.482666z" p-id="25690"></path></svg>
    )
  }
)

if (__DEV__) {
  MailOpenFilled.displayName = 'MailOpenFilled'
}
  