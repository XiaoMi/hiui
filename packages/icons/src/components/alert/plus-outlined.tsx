
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-plus-outlined')

export const PlusOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 106.666667a42.666667 42.666667 0 0 1 42.666667 42.666666v320h320a42.666667 42.666667 0 1 1 0 85.333334H554.666667v320a42.666667 42.666667 0 1 1-85.333334 0V554.666667H149.333333a42.666667 42.666667 0 1 1 0-85.333334h320V149.333333a42.666667 42.666667 0 0 1 42.666667-42.666666z" p-id="47731"></path></svg>
    )
  }
)

if (__DEV__) {
  PlusOutlined.displayName = 'PlusOutlined'
}
  