
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-travel-filled')

export const TravelFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M640 64a85.333333 85.333333 0 0 1 85.333333 85.333333v42.666667h21.333334a128 128 0 0 1 127.914666 123.2L874.666667 320v426.666667a128 128 0 0 1-128 128h-42.666667v21.333333a42.666667 42.666667 0 1 1-85.333333 0v-21.333333H405.333333v21.333333a42.666667 42.666667 0 1 1-85.333333 0v-21.333333h-42.666667a128 128 0 0 1-127.914666-123.2L149.333333 746.666667V320a128 128 0 0 1 128-128h21.333334V149.333333a85.333333 85.333333 0 0 1 81.066666-85.226666L384 64zM405.333333 362.666667a42.666667 42.666667 0 0 0-42.666666 42.666666v256a42.666667 42.666667 0 1 0 85.333333 0V405.333333a42.666667 42.666667 0 0 0-42.666667-42.666666z m213.333334 0a42.666667 42.666667 0 0 0-42.666667 42.666666v256a42.666667 42.666667 0 1 0 85.333333 0V405.333333a42.666667 42.666667 0 0 0-42.666666-42.666666z m21.333333-213.333334H384v42.666667h256V149.333333z" p-id="15441"></path></svg>
    )
  }
)

if (__DEV__) {
  TravelFilled.displayName = 'TravelFilled'
}
  