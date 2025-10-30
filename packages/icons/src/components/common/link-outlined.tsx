
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-link-outlined')

export const LinkOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20762"  ><path d="M187.456 530.112l90.517333-90.517333a38.4 38.4 0 1 1 54.293334 54.293333l-90.496 90.517333a142.933333 142.933333 0 0 0 202.133333 202.133334l90.517333-90.496a38.4 38.4 0 1 1 54.293334 54.293333l-90.517334 90.517333c-85.802667 85.802667-224.917333 85.802667-310.741333 0-85.802667-85.824-85.802667-224.938667 0-310.741333z m512.896 0l90.517333-90.517333a142.933333 142.933333 0 0 0-202.154666-202.154667l-90.517334 90.517333a38.4 38.4 0 1 1-54.293333-54.293333l90.517333-90.517333c85.802667-85.802667 224.917333-85.802667 310.741334 0 85.802667 85.824 85.802667 224.938667 0 310.741333l-90.517334 90.517333a38.4 38.4 0 1 1-54.293333-54.293333z" p-id="20763"></path><path d="M475.050667 607.061333a38.4 38.4 0 1 1-54.314667-54.293333l135.765333-135.765333a38.4 38.4 0 1 1 54.314667 54.293333l-135.765333 135.765333z" p-id="20764"></path></svg>
    )
  }
)

if (__DEV__) {
  LinkOutlined.displayName = 'LinkOutlined'
}
  