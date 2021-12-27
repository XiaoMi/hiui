import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-bank-card-filled'
const _prefix = getPrefixCls(_role)

export const BankCardFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg
        className={cls}
        ref={ref}
        role={role}
        style={style}
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        version="1.1"
      >
        <path
          d="M810.666667 149.333333a128 128 0 0 1 128 128v469.333334a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V277.333333a128 128 0 0 1 128-128h597.333334z m-21.333334 448h-128a42.666667 42.666667 0 1 0 0 85.333334h128a42.666667 42.666667 0 1 0 0-85.333334z m21.333334-234.666666H213.333333a42.666667 42.666667 0 1 0 0 85.333333h597.333334a42.666667 42.666667 0 1 0 0-85.333333z"
          p-id="14941"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  BankCardFilled.displayName = 'BankCardFilled'
}
