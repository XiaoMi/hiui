
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-mail-outlined')

export const MailOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M810.666667 149.333333c26.666667 0 51.413333 8.149333 71.893333 22.08a42.453333 42.453333 0 0 1 26.005333 16c4.202667 5.504 6.869333 11.690667 8.042667 18.069334A127.424 127.424 0 0 1 938.666667 277.333333v469.333334a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V277.333333c0-26.624 8.128-51.370667 22.058667-71.850666A42.517333 42.517333 0 0 1 141.44 171.392 127.466667 127.466667 0 0 1 213.333333 149.333333h597.333334z m42.666666 133.994667L537.92 524.565333a42.666667 42.666667 0 0 1-48.896 2.048l-2.944-2.048L170.666667 283.349333V746.666667a42.666667 42.666667 0 0 0 39.466666 42.56L213.333333 789.333333h597.333334a42.666667 42.666667 0 0 0 42.56-39.466666L853.333333 746.666667V283.328zM776.512 234.666667H247.466667L512 436.949333 776.512 234.666667z" p-id="39685"></path></svg>
    )
  }
)

if (__DEV__) {
  MailOutlined.displayName = 'MailOutlined'
}
  