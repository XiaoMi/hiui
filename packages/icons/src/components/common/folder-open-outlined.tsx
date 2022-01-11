import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-folder-open-outlined')

export const FolderOpenOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M399.68 320a85.333333 85.333333 0 0 1 73.173333 41.429333L524.8 448H810.666667a128 128 0 0 1 128 128v213.333333a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V405.333333a85.333333 85.333333 0 0 1 85.333334-85.333333h229.013333z m0 85.333333H170.666667v384a42.666667 42.666667 0 0 0 39.466666 42.56L213.333333 832h597.333334a42.666667 42.666667 0 0 0 42.56-39.466667L853.333333 789.333333V576a42.666667 42.666667 0 0 0-39.466666-42.56L810.666667 533.333333H476.48l-76.8-128zM733.589333 128c65.6 0 117.290667 55.552 119.658667 123.157333L853.333333 256v106.666667a42.666667 42.666667 0 0 1-85.226666 3.2L768 362.666667v-106.666667c0-23.253333-14.826667-40.832-31.722667-42.538667L733.589333 213.333333H290.410667c-17.066667 0-32.768 16.426667-34.282667 39.04L256 256a42.666667 42.666667 0 1 1-85.333333 0c0-68.16 50.176-125.290667 115.072-127.914667L290.410667 128h443.178666z"
          p-id="39605"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  FolderOpenOutlined.displayName = 'FolderOpenOutlined'
}
