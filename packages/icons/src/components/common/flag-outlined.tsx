
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-flag-outlined')

export const FlagOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M149.333333 106.666667a42.666667 42.666667 0 0 1 42.666667 42.666666h405.333333a128.042667 128.042667 0 0 1 126.229334 106.666667H832a85.333333 85.333333 0 0 1 85.333333 85.333333v298.666667a85.333333 85.333333 0 0 1-85.333333 85.333333H576a128.042667 128.042667 0 0 1-126.229333-106.666666H192v256a42.666667 42.666667 0 1 1-85.333333 0V149.333333a42.666667 42.666667 0 0 1 42.666666-42.666666z m448 128H192v298.666666h256v-192a42.666667 42.666667 0 1 1 85.333333 0v256c0 1.152-0.042667 2.282667-0.128 3.413334l0.725334 3.797333c3.2 19.157333 19.242667 33.749333 38.613333 35.306667L576 640h256V341.333333h-108.437333a85.333333 85.333333 0 0 1-83.349334-66.986666l-0.810666-4.224a42.709333 42.709333 0 0 0-38.613334-35.306667L597.333333 234.666667z" p-id="39555"></path></svg>
    )
  }
)

if (__DEV__) {
  FlagOutlined.displayName = 'FlagOutlined'
}
  