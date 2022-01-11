import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-minus-outlined')

export const MinusOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg
        className={cls}
        ref={ref}
        role="icon"
        {...rest}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        version="1.1"
      >
        <path
          d="M106.666667 469.333333m42.666666 0l725.333334 0q42.666667 0 42.666666 42.666667l0 0q0 42.666667-42.666666 42.666667l-725.333334 0q-42.666667 0-42.666666-42.666667l0 0q0-42.666667 42.666666-42.666667Z"
          p-id="47761"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  MinusOutlined.displayName = 'MinusOutlined'
}
