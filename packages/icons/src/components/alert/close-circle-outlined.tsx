import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-close-circle-outlined')

export const CloseCircleOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 85.333334C323.477333 170.666667 170.666667 323.477333 170.666667 512s152.810667 341.333333 341.333333 341.333333 341.333333-152.810667 341.333333-341.333333S700.522667 170.666667 512 170.666667zM677.930667 346.069333a42.666667 42.666667 0 0 1 0 60.330667L572.330667 512l105.6 105.6a42.666667 42.666667 0 1 1-60.330667 60.330667L512 572.330667l-105.6 105.6a42.666667 42.666667 0 1 1-60.330667-60.330667L451.626667 512l-105.6-105.6a42.666667 42.666667 0 1 1 60.373333-60.330667l105.557333 105.578667 105.6-105.6a42.666667 42.666667 0 0 1 60.373334 0z"
          p-id="47681"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  CloseCircleOutlined.displayName = 'CloseCircleOutlined'
}
