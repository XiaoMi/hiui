
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-unlock-outlined')

export const UnlockOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M521.557333 171.008l-4.757333-0.256L512 170.666667a128 128 0 0 0-127.914667 123.2L384 298.666667v85.333333h362.666667a128 128 0 0 1 128 128v298.666667a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V512a128 128 0 0 1 128-128h21.333334v-85.333333c0-115.84 92.309333-210.090667 207.36-213.248L512 85.333333c115.84 0 210.090667 92.309333 213.248 207.36L725.333333 298.666667a42.666667 42.666667 0 1 1-85.333333 0 128 128 0 0 0-118.442667-127.658667zM746.666667 469.333333H277.333333a42.666667 42.666667 0 0 0-42.56 39.466667L234.666667 512v298.666667a42.666667 42.666667 0 0 0 39.466666 42.56L277.333333 853.333333h469.333334a42.666667 42.666667 0 0 0 42.56-39.466666L789.333333 810.666667V512a42.666667 42.666667 0 0 0-39.466666-42.56L746.666667 469.333333z m-234.666667 128a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666667a42.666667 42.666667 0 1 1-85.333334 0v-42.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z" p-id="38595"></path></svg>
    )
  }
)

if (__DEV__) {
  UnlockOutlined.displayName = 'UnlockOutlined'
}
  