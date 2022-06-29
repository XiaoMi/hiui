
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-delete-filled')

export const DeleteFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M874.666667 256a42.666667 42.666667 0 1 1 0 85.333333H149.333333a42.666667 42.666667 0 1 1 0-85.333333h725.333334zM618.666667 106.666667a42.666667 42.666667 0 1 1 0 85.333333H405.333333a42.666667 42.666667 0 1 1 0-85.333333h213.333334zM789.333333 298.666667a42.666667 42.666667 0 0 1 42.666667 42.666666v448a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V341.333333l0.106667-3.2A42.666667 42.666667 0 0 1 277.333333 341.333333h469.333334a42.666667 42.666667 0 0 1 42.666666-42.666666z" p-id="44736"></path></svg>
    )
  }
)

if (__DEV__) {
  DeleteFilled.displayName = 'DeleteFilled'
}
  