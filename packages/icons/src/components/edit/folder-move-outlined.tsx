import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-folder-move-outlined'
const _prefix = getPrefixCls(_role)

export const FolderMoveOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M399.68 149.333333a85.333333 85.333333 0 0 1 73.173333 41.429334L524.8 277.333333H810.666667a128 128 0 0 1 128 128v341.333334a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V234.666667a85.333333 85.333333 0 0 1 85.333334-85.333334h229.013333z m0 85.333334H170.666667v512a42.666667 42.666667 0 0 0 39.466666 42.56L213.333333 789.333333h597.333334a42.666667 42.666667 0 0 0 42.56-39.466666L853.333333 746.666667V405.333333a42.666667 42.666667 0 0 0-39.466666-42.56L810.666667 362.666667H476.48l-76.8-128zM567.168 460.501333a42.666667 42.666667 0 0 1 60.330667 0l85.333333 85.333334 2.496 2.709333a42.666667 42.666667 0 0 1-2.496 57.621333l-85.333333 85.333334-2.709334 2.496a42.666667 42.666667 0 0 1-57.621333-2.496l-2.496-2.709334a42.666667 42.666667 0 0 1 2.496-57.621333L579.626667 618.666667H384a42.666667 42.666667 0 1 1 0-85.333334h195.648l-12.48-12.501333-2.496-2.709333a42.666667 42.666667 0 0 1 2.496-57.621334z"
          p-id="44826"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  FolderMoveOutlined.displayName = 'FolderMoveOutlined'
}
