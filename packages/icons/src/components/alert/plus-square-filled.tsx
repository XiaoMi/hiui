
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-plus-square-filled')

export const PlusSquareFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1978"  ><path d="M810.666667 110.933333a102.4 102.4 0 0 1 102.4 102.4v597.333334a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V213.333333A102.4 102.4 0 0 1 213.333333 110.933333h597.333334z m-301.44 197.589334a38.4 38.4 0 0 0-38.4 38.4v123.882666h-123.904a38.4 38.4 0 0 0 0 76.8h123.882666V682.666667a38.4 38.4 0 0 0 76.8 0v-135.061334H682.666667a38.4 38.4 0 0 0 0-76.8h-135.061334v-123.882666a38.4 38.4 0 0 0-38.4-38.4z" p-id="1979"></path></svg>
    )
  }
)

if (__DEV__) {
  PlusSquareFilled.displayName = 'PlusSquareFilled'
}
  