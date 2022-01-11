import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-tag-filled')

export const TagFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M615.04 108.096l157.717333 6.848c73.898667 3.221333 136.426667 65.749333 139.626667 139.648l6.869333 157.696c1.536 35.498667-11.093333 68.906667-35.093333 92.928L499.285333 890.112c-49.984 49.984-134.72 46.293333-189.248-8.234667l-164.565333-164.565333c-54.528-54.528-58.218667-139.264-8.234667-189.248L522.133333 143.168c24-24 57.429333-36.608 92.906667-35.072zM682.666667 298.666667a64 64 0 1 0 0 128 64 64 0 0 0 0-128z"
          p-id="15611"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  TagFilled.displayName = 'TagFilled'
}
