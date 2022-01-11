import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-archive-filled')

export const ArchiveFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M746.666667 490.666667a128 128 0 0 1 128 128v170.666666a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128v-170.666666a128 128 0 0 1 128-128h187.818667v148.821333L431.36 605.653333l-2.709333-2.496a42.666667 42.666667 0 0 0-57.642667 62.848l106.666667 106.666667 2.730666 2.496a42.666667 42.666667 0 0 0 57.6-2.496l106.666667-106.666667 2.517333-2.709333a42.666667 42.666667 0 0 0-2.496-57.642667l-2.709333-2.496a42.666667 42.666667 0 0 0-57.642667 2.496l-33.813333 33.813334L550.485333 490.666667H746.666667z m42.666666-384a128 128 0 0 1 128 128v42.666666a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128v-42.666666a128 128 0 0 1 128-128h554.666666z"
          p-id="15021"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  ArchiveFilled.displayName = 'ArchiveFilled'
}
