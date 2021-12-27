import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-import-outlined'
const _prefix = getPrefixCls(_role)

export const ImportOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M277.333333 938.666667a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h469.333334a128 128 0 0 1 128 128v426.666667a42.666667 42.666667 0 1 1-85.333334 0V213.333333a42.666667 42.666667 0 0 0-39.466666-42.56L746.666667 170.666667H277.333333a42.666667 42.666667 0 0 0-42.56 39.466666L234.666667 213.333333v597.333334a42.666667 42.666667 0 0 0 39.466666 42.56L277.333333 853.333333h128a42.666667 42.666667 0 1 1 0 85.333334h-128z m348.074667-288.256a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709333-33.813333 33.834667h234.154666a42.666667 42.666667 0 1 1 0 85.333333H591.616l33.792 33.834667a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709334a42.666667 42.666667 0 0 1-57.6 2.496l-2.730667-2.496-106.666666-106.666667a42.666667 42.666667 0 0 1-2.496-57.6l2.496-2.730667 106.666666-106.666666a42.666667 42.666667 0 0 1 60.330667 0zM618.666667 469.333333a42.666667 42.666667 0 1 1 0 85.333334H405.333333a42.666667 42.666667 0 1 1 0-85.333334h213.333334z m0-128a42.666667 42.666667 0 1 1 0 85.333334H405.333333a42.666667 42.666667 0 1 1 0-85.333334h213.333334z"
          p-id="39595"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  ImportOutlined.displayName = 'ImportOutlined'
}
