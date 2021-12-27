import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-exclamation-circle-filled'
const _prefix = getPrefixCls(_role)

export const ExclamationCircleFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m21.333333 576h-42.666666a21.333333 21.333333 0 0 0-21.333334 21.333334v42.666666a21.333333 21.333333 0 0 0 21.333334 21.333334h42.666666a21.333333 21.333333 0 0 0 21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 0-21.333334-21.333334z m0-384h-42.666666a21.333333 21.333333 0 0 0-21.333334 21.333334v277.333333a21.333333 21.333333 0 0 0 21.333334 21.333333h42.666666a21.333333 21.333333 0 0 0 21.333334-21.333333V298.666667a21.333333 21.333333 0 0 0-21.333334-21.333334z"
          p-id="47551"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  ExclamationCircleFilled.displayName = 'ExclamationCircleFilled'
}
