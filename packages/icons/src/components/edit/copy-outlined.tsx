import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-copy-outlined'
const _prefix = getPrefixCls(_role)

export const CopyOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M618.666667 277.333333a128 128 0 0 1 128 128v384a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V405.333333a128 128 0 0 1 128-128z m0 85.333334H234.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v384a42.666667 42.666667 0 0 0 42.666667 42.666667h384a42.666667 42.666667 0 0 0 42.666666-42.666667V405.333333a42.666667 42.666667 0 0 0-42.666666-42.666666z m170.666666-256a128 128 0 0 1 127.914667 123.2L917.333333 234.666667v384a128 128 0 0 1-123.2 127.914666L789.333333 746.666667v-85.333334a42.666667 42.666667 0 0 0 42.56-39.466666L832 618.666667V234.666667a42.666667 42.666667 0 0 0-39.466667-42.56L789.333333 192H405.333333a42.666667 42.666667 0 0 0-42.56 39.466667L362.666667 234.666667h-85.333334a128 128 0 0 1 123.2-127.914667L405.333333 106.666667h384z"
          p-id="44876"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  CopyOutlined.displayName = 'CopyOutlined'
}
