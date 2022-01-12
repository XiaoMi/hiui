
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-lock-filled')

export const LockFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c117.824 0 213.333333 95.509333 213.333333 213.333334v85.333333h21.333334a128 128 0 0 1 128 128v298.666667a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V512a128 128 0 0 1 128-128h21.333334v-85.333333c0-115.84 92.309333-210.090667 207.36-213.248z m0 512a42.666667 42.666667 0 0 0-42.666667 42.666667v42.666667a42.666667 42.666667 0 1 0 85.333334 0v-42.666667a42.666667 42.666667 0 0 0-42.666667-42.666667z m0-426.666666a128 128 0 0 0-128 128v85.333333h256v-85.333333a128 128 0 0 0-123.2-127.914667z" p-id="15301"></path></svg>
    )
  }
)

if (__DEV__) {
  LockFilled.displayName = 'LockFilled'
}
  